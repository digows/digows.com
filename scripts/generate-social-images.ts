import { access, mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { parse } from "yaml";
import { createPostSocialImageSvg } from "../src/lib/social-images";
import { getLocaleUrlSegment, isLocale, type Locale } from "../src/i18n/locales";

interface PostFrontmatter
{
  readonly title: string;
  readonly permalink: string;
  readonly language: Locale;
  readonly translationKey: string;
}

const projectRoot = path.resolve(import.meta.dirname, "..");
const postsDirectory = path.join(projectRoot, "src/content/posts");
const outputDirectory = path.join(projectRoot, "public/social");
const markdownFiles = await collectMarkdownFiles(postsDirectory);
const generatorTimestamp = Math.max(
  (await stat(new URL(import.meta.url))).mtimeMs,
  (await stat(path.join(projectRoot, "src/lib/social-images.ts"))).mtimeMs,
  (await stat(path.join(projectRoot, "src/data/topics.ts"))).mtimeMs,
);
const expectedOutputPaths = new Set<string>();
let generatedImageCount = 0;

await mkdir(outputDirectory, { recursive: true });

for (let index = 0; index < markdownFiles.length; index += 8)
{
  await Promise.all(markdownFiles.slice(index, index + 8).map(generateSocialImage));
}

for (const existingImage of await collectFiles(outputDirectory, ".png"))
{
  if (!expectedOutputPaths.has(existingImage)) await rm(existingImage, { force: true });
}

console.log(`${generatedImageCount === 0 ? "Reused" : `Generated ${generatedImageCount} and reused ${markdownFiles.length - generatedImageCount}`} social images in ${path.relative(projectRoot, outputDirectory)}`);

async function generateSocialImage(markdownFile: string): Promise<void>
{
  const source = await readFile(markdownFile, "utf8");
  const frontmatterMatch = source.match(/^---\s*\n([\s\S]*?)\n---/);

  if (frontmatterMatch === null)
  {
    throw new Error(`Missing frontmatter in ${path.relative(projectRoot, markdownFile)}`);
  }

  const data = parsePostFrontmatter(parse(frontmatterMatch[1]), markdownFile);
  const publicationYear = Number.parseInt(data.permalink.slice(0, 4), 10);
  const outputPath = path.join(outputDirectory, getLocaleUrlSegment(data.language), `${data.permalink}.png`);
  expectedOutputPaths.add(outputPath);
  const sourceTimestamp = Math.max(generatorTimestamp, (await stat(markdownFile)).mtimeMs);

  try
  {
    const output = await stat(outputPath);

    if (output.mtimeMs >= sourceTimestamp)
    {
      return;
    }
  }
  catch
  {
    // A missing output is generated below.
  }

  const image = await sharp(Buffer.from(createPostSocialImageSvg({
    title: data.title,
    language: data.language,
    translationKey: data.translationKey,
    publicationYear,
  })))
    .png({ compressionLevel: 7, palette: true, effort: 3 })
    .toBuffer();

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, image);
  generatedImageCount += 1;
}

function parsePostFrontmatter(value: unknown, markdownFile: string): PostFrontmatter
{
  if (typeof value !== "object" || value === null)
  {
    throw new Error(`Invalid frontmatter in ${path.relative(projectRoot, markdownFile)}`);
  }

  const title = Reflect.get(value, "title");
  const permalink = Reflect.get(value, "permalink");
  const language = Reflect.get(value, "language");
  const translationKey = Reflect.get(value, "translationKey");

  if (
    typeof title !== "string"
    || title.length === 0
    || typeof permalink !== "string"
    || !/^\d{4}\/\d{2}\/\d{2}\/[a-z0-9-]+$/u.test(permalink)
    || !isLocale(language)
    || typeof translationKey !== "string"
    || translationKey.length === 0
  )
  {
    throw new Error(`Invalid social image metadata in ${path.relative(projectRoot, markdownFile)}`);
  }

  return { title, permalink, language, translationKey };
}

async function collectMarkdownFiles(directory: string): Promise<string[]>
{
  const entries = await readdir(directory, { withFileTypes: true });
  const nestedFiles = await Promise.all(entries.map(async (entry) =>
  {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory()
      ? collectMarkdownFiles(entryPath)
      : entry.isFile() && entry.name.endsWith(".md") ? [entryPath] : [];
  }));

  return nestedFiles.flat().sort();
}

async function collectFiles(directory: string, extension: string): Promise<string[]>
{
  try
  {
    await access(directory);
  }
  catch
  {
    return [];
  }

  const entries = await readdir(directory, { withFileTypes: true });
  const nestedFiles = await Promise.all(entries.map(async (entry) =>
  {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory()
      ? collectFiles(entryPath, extension)
      : entry.isFile() && entry.name.endsWith(extension) ? [entryPath] : [];
  }));

  return nestedFiles.flat();
}
