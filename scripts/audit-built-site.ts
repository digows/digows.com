import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { parse } from "yaml";
import { aboutContent } from "../src/content/pages/about/content";
import { getLocaleUrlSegment, supportedLocales, type Locale } from "../src/i18n/locales";

interface PostRecord
{
  readonly filename: string;
  readonly language: Locale;
  readonly permalink: string;
  readonly translationKey: string;
  readonly translationOf?: string;
  readonly hasEditorial: boolean;
  readonly copyReviewed: boolean;
}

const projectRoot = path.resolve(import.meta.dirname, "..");
const postsDirectory = path.join(projectRoot, "src/content/posts");
const distributionDirectory = path.join(projectRoot, "dist");
const staticRedirectsPath = path.join(projectRoot, "public/_redirects");
const siteOrigin = "https://digows.com";
const errors: string[] = [];
const legacyRedirects = await loadStaticRedirects();
const postRecords = await loadPostRecords();
const postGroups = Map.groupBy(postRecords, (post) => post.translationKey);

for (const [translationKey, posts] of postGroups)
{
  const publicationYear = Number.parseInt(translationKey.slice(0, 4), 10);
  const expectedLocales: readonly Locale[] = publicationYear >= 2025 ? supportedLocales : ["en", "pt-BR"];

  if (posts.length !== expectedLocales.length)
  {
    errors.push(`${translationKey} has ${posts.length} language versions instead of ${expectedLocales.length}`);
    continue;
  }

  const languages = new Set(posts.map((post) => post.language));
  const originalPost = posts.find((post) => post.translationOf === undefined);

  for (const expectedLocale of expectedLocales)
  {
    if (!languages.has(expectedLocale))
    {
      errors.push(`${translationKey} is missing ${expectedLocale}`);
    }
  }

  if (originalPost === undefined || posts.filter((post) => post.translationOf === undefined).length !== 1)
  {
    errors.push(`${translationKey} must contain exactly one original post`);
    continue;
  }

  if (translationKey !== originalPost.permalink)
  {
    errors.push(`${translationKey} must match the original permalink ${originalPost.permalink}`);
  }

  for (const post of posts)
  {
    const expectedFilename = `${originalPost.permalink.replaceAll("/", "-")}/${post.language}.md`;

    if (post.filename !== expectedFilename)
    {
      errors.push(`${post.filename} must be stored as ${expectedFilename}`);
    }

    if (post !== originalPost && post.translationOf !== originalPost.permalink)
    {
      errors.push(`${post.filename} has an invalid translationOf value`);
    }

    const localeSegment = getLocaleUrlSegment(post.language);
    const htmlPath = path.join(distributionDirectory, localeSegment, post.permalink, "index.html");
    const html = await readFile(htmlPath, "utf8");
    const expectedCanonical = `${siteOrigin}/${localeSegment}/${post.permalink}/`;
    const canonical = html.match(/<link rel="canonical" href="([^"]+)">/)?.[1];
    const languageAlternates = new Map(
      [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">/g)]
        .map((match) => [match[1], match[2]]),
    );

    if (canonical !== expectedCanonical)
    {
      errors.push(`${post.filename} has canonical ${canonical ?? "missing"}`);
    }

    for (const siblingPost of posts)
    {
      const expectedAlternate = `${siteOrigin}/${getLocaleUrlSegment(siblingPost.language)}/${siblingPost.permalink}/`;

      if (languageAlternates.get(siblingPost.language) !== expectedAlternate)
      {
        errors.push(`${post.filename} has an invalid ${siblingPost.language} alternate`);
      }
    }

    const expectedDefault = `${siteOrigin}/${getLocaleUrlSegment(originalPost.language)}/${originalPost.permalink}/`;

    if (languageAlternates.get("x-default") !== expectedDefault)
    {
      errors.push(`${post.filename} has an invalid x-default alternate`);
    }

    const commentContentId = html.match(/data-comments-root data-content-id="([^"]+)"/)?.[1];

    if (commentContentId !== translationKey)
    {
      errors.push(`${post.filename} does not use its stable content ID for comments`);
    }

    if (!html.includes("data-article-actions") || !html.includes("data-reactions"))
    {
      errors.push(`${post.filename} is missing the global article experience`);
    }

    if (!html.includes('data-newsletter-root data-locale=') || !html.includes('data-source="article"'))
    {
      errors.push(`${post.filename} is missing the article newsletter panel`);
    }

    const expectedPublicationDate = post.permalink.slice(0, 10).replaceAll("/", "-");

    if (!html.includes(`<time datetime="${expectedPublicationDate}">`))
    {
      errors.push(`${post.filename} does not render its canonical editorial publication date`);
    }

    const expectedSocialImage = `${siteOrigin}/social/${localeSegment}/${post.permalink}.png`;

    if (!html.includes(`<meta property="og:image" content="${expectedSocialImage}">`) || !html.includes(`<meta name="twitter:image" content="${expectedSocialImage}">`))
    {
      errors.push(`${post.filename} does not use its deterministic social image`);
    }

    try
    {
      await access(path.join(distributionDirectory, "social", localeSegment, `${post.permalink}.png`));
    }
    catch
    {
      errors.push(`${post.filename} is missing its generated social image`);
    }

    if (!html.includes("data-article-paragraph"))
    {
      errors.push(`${post.filename} has no stable paragraph anchors`);
    }

    if (Number.parseInt(post.permalink.slice(0, 4), 10) >= 2025)
    {
      if (!post.hasEditorial || !post.copyReviewed)
      {
        errors.push(`${post.filename} is a modern article without reviewed custom editorial content`);
      }

      if (!html.includes("article-insights"))
      {
        errors.push(`${post.filename} does not render its custom editorial content`);
      }
    }

    if ((post.language === "en" || post.language === "pt-BR") && legacyRedirects.get(`/${post.permalink}/`) !== `/${localeSegment}/${post.permalink}/`)
    {
      errors.push(`${post.filename} is missing its exact legacy redirect`);
    }
  }
}

await auditAboutPages();
await auditHomeAndDiscoveryPages();

const htmlPaths = await collectFiles(distributionDirectory, ".html");
const missingInternalLinks = new Set<string>();

for (const htmlPath of htmlPaths)
{
  const html = await readFile(htmlPath, "utf8");
  const relativeHtmlPath = path.relative(distributionDirectory, htmlPath);
  const pagePath = relativeHtmlPath.endsWith("index.html")
    ? `/${relativeHtmlPath.slice(0, -"index.html".length)}`
    : `/${relativeHtmlPath}`;

  const title = html.match(/<title>(.*?)<\/title>/s)?.[1]?.trim();
  const headingCount = [...html.matchAll(/<h1(?:\s|>)/g)].length;
  const languageSwitcherCount = [...html.matchAll(/class="language-switcher"/g)].length;

  if (!title)
  {
    errors.push(`${pagePath} has no document title`);
  }

  if (headingCount !== 1)
  {
    errors.push(`${pagePath} has ${headingCount} h1 elements instead of 1`);
  }

  if (languageSwitcherCount !== 1)
  {
    errors.push(`${pagePath} has ${languageSwitcherCount} language switchers instead of the single header control`);
  }

  if (!html.includes('property="og:image"') || !html.includes('name="twitter:image"'))
  {
    errors.push(`${pagePath} is missing a social preview image`);
  }

  if (!html.includes("data-site-toast"))
  {
    errors.push(`${pagePath} is missing the global live status toast`);
  }

  if (html.includes("data-ai-dialog") && !html.includes('data-ai-dialog aria-labelledby="ai-dialog-title"'))
  {
    errors.push(`${pagePath} has an unnamed AI dialog`);
  }

  if (html.includes("data-quote-dialog") && !html.includes('data-quote-dialog aria-labelledby="quote-dialog-title"'))
  {
    errors.push(`${pagePath} has an unnamed quote dialog`);
  }

  if (/<label class="honeypot"(?![^>]*\b(?:hidden|inert)\b)/u.test(html))
  {
    errors.push(`${pagePath} exposes a honeypot field to assistive technology`);
  }

  for (const match of html.matchAll(/<a\s[^>]*href="([^"]+)"/g))
  {
    const href = match[1].replaceAll("&amp;", "&");

    if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:"))
    {
      continue;
    }

    const url = new URL(href, `${siteOrigin}${pagePath}`);

    if (url.origin !== siteOrigin || url.pathname.startsWith("/api/"))
    {
      continue;
    }

    const decodedPath = decodeURIComponent(url.pathname);
    const targetPath = decodedPath.endsWith("/")
      ? path.join(distributionDirectory, decodedPath, "index.html")
      : path.join(distributionDirectory, decodedPath);

    try
    {
      await access(targetPath);
    }
    catch
    {
      if (!legacyRedirects.has(decodedPath))
      {
        missingInternalLinks.add(`${pagePath} -> ${decodedPath}`);
      }
    }
  }

  for (const match of html.matchAll(/<a\s[^>]*href="https?:\/\/[^>]+>/g))
  {
    const openingTag = match[0];
    const href = openingTag.match(/href="([^"]+)"/)?.[1];

    if (href === undefined || new URL(href).origin === siteOrigin)
    {
      continue;
    }

    if (!/target="_blank"/.test(openingTag) || !/rel="[^"]*noopener[^"]*"/.test(openingTag))
    {
      errors.push(`External link does not open safely in a new tab: ${pagePath} -> ${href}`);
    }
  }
}

for (const missingLink of missingInternalLinks)
{
  errors.push(`Missing internal link: ${missingLink}`);
}

if (errors.length > 0)
{
  console.error(errors.join("\n"));
  process.exitCode = 1;
}
else
{
  console.log(JSON.stringify({
    postCount: postRecords.length,
    translationGroupCount: postGroups.size,
    auditedHtmlPageCount: htmlPaths.length,
    missingInternalLinkCount: 0,
  }, null, 2));
}

async function loadPostRecords(): Promise<PostRecord[]>
{
  const postPaths = await collectFiles(postsDirectory, ".md");

  return Promise.all(postPaths.map(async (postPath) =>
  {
    const content = await readFile(postPath, "utf8");

    if (/^\*{4}\s*$/mu.test(content) || /^#{1,6}\s+(?:\*{2,}|[^\n]*\*{4})/mu.test(content))
    {
      errors.push(`${path.relative(postsDirectory, postPath)} contains malformed Markdown emphasis in a heading or separator`);
    }

    const frontmatter = parse(content.split("---", 3)[1] ?? "") as Record<string, unknown>;
    const language = frontmatter.language as PostRecord["language"];
    const translationOf = typeof frontmatter.translationOf === "string" ? frontmatter.translationOf : undefined;

    return {
      filename: path.relative(postsDirectory, postPath),
      language,
      permalink: String(frontmatter.permalink),
      translationKey: String(frontmatter.translationKey),
      hasEditorial: /^editorial:\s*$/m.test(content),
      copyReviewed: /^\s+copyReviewed: true\s*$/m.test(content),
      ...(translationOf === undefined ? {} : { translationOf }),
    };
  }));
}

async function loadStaticRedirects(): Promise<ReadonlyMap<string, string>>
{
  const source = await readFile(staticRedirectsPath, "utf8");
  const builtSource = await readFile(path.join(distributionDirectory, "_redirects"), "utf8");
  const redirects = new Map<string, string>();

  if (builtSource !== source)
  {
    errors.push("The built _redirects file differs from public/_redirects");
  }

  for (const [lineIndex, rawLine] of source.split("\n").entries())
  {
    const line = rawLine.trim();

    if (line.length === 0 || line.startsWith("#"))
    {
      continue;
    }

    const columns = line.split(/\s+/u);

    if (columns.length !== 3)
    {
      errors.push(`public/_redirects:${lineIndex + 1} must contain source, destination, and status`);
      continue;
    }

    const [sourcePath, destinationPath, status] = columns;

    if (!sourcePath.startsWith("/") || !destinationPath.startsWith("/"))
    {
      errors.push(`public/_redirects:${lineIndex + 1} must use site-relative paths`);
      continue;
    }

    if (status !== "308")
    {
      errors.push(`public/_redirects:${lineIndex + 1} must use a permanent 308 redirect`);
    }

    if (redirects.has(sourcePath))
    {
      errors.push(`public/_redirects:${lineIndex + 1} duplicates ${sourcePath}`);
      continue;
    }

    redirects.set(sourcePath, destinationPath);
  }

  for (const [sourcePath, destinationPath] of redirects)
  {
    const destinationFilePath = destinationPath.endsWith("/")
      ? path.join(distributionDirectory, destinationPath, "index.html")
      : path.join(distributionDirectory, destinationPath);

    try
    {
      await access(destinationFilePath);
    }
    catch
    {
      errors.push(`Static redirect ${sourcePath} points to missing output ${destinationPath}`);
    }
  }

  return redirects;
}

async function auditAboutPages(): Promise<void>
{
  const aboutSlugs: Readonly<Record<Locale, string>> = { en: "about", "pt-BR": "sobre", es: "acerca-de", fr: "a-propos", "zh-Hans": "关于" };

  for (const locale of supportedLocales)
  {
    const localeSegment = getLocaleUrlSegment(locale);
    const relativePath = `${localeSegment}/${aboutSlugs[locale]}/index.html`;
    const html = await readFile(path.join(distributionDirectory, relativePath), "utf8");
    const canonical = html.match(/<link rel="canonical" href="([^"]+)">/)?.[1];
    const contentId = html.match(/data-comments-root data-content-id="([^"]+)"/)?.[1];
    const title = html.match(/<title>(.*?)<\/title>/s)?.[1]?.trim();

    const expectedCanonical = new URL(`/${localeSegment}/${aboutSlugs[locale]}/`, siteOrigin).href;
    if (canonical !== expectedCanonical)
    {
      errors.push(`${relativePath} has canonical ${canonical ?? "missing"}`);
    }

    if (title !== aboutContent[locale].seoTitle)
    {
      errors.push(`${relativePath} has title ${title ?? "missing"} instead of its exact localized SEO title`);
    }

    for (const alternateLocale of supportedLocales)
    {
      const alternate = new URL(`/${getLocaleUrlSegment(alternateLocale)}/${aboutSlugs[alternateLocale]}/`, siteOrigin).href;
      if (!html.includes(`hreflang="${alternateLocale}" href="${alternate}"`)) errors.push(`${relativePath} is missing ${alternateLocale} hreflang`);
    }

    if (contentId !== "page/about" || !html.includes("data-reactions"))
    {
      errors.push(`${relativePath} does not share the About content ID`);
    }

    if (!html.includes("data-about-webgl") || !html.includes("data-article-actions") || !html.includes('"@type":"ProfilePage"'))
    {
      errors.push(`${relativePath} is missing the immersive profile experience`);
    }

    if (/Cael|Roni|Comunidade da Graça/.test(html))
    {
      errors.push(`${relativePath} exposes intentionally omitted personal details`);
    }
  }
}

async function auditHomeAndDiscoveryPages(): Promise<void>
{
  const archiveSlugs: Readonly<Record<Locale, string>> = { en: "archive", "pt-BR": "arquivo", es: "archivo", fr: "archives", "zh-Hans": "归档" };
  const homePages = new Map<Locale, string>();

  for (const locale of supportedLocales)
  {
    const segment = getLocaleUrlSegment(locale);
    const homeHtml = await readFile(path.join(distributionDirectory, segment, "index.html"), "utf8");
    const archiveHtml = await readFile(path.join(distributionDirectory, segment, archiveSlugs[locale], "index.html"), "utf8");
    homePages.set(locale, homeHtml);

    for (const [name, html] of [[`${locale} home`, homeHtml], [`${locale} archive`, archiveHtml]] as const)
    {
      if (!html.includes('class="language-switcher"')) errors.push(`${name} is missing the language control`);
    }
  }

  const clientJavaScript = (await Promise.all(
    (await collectFiles(path.join(distributionDirectory, "_astro"), ".js")).map((file) => readFile(file, "utf8")),
  )).join("\n");

  if (!clientJavaScript.includes("digows.preferredLocale"))
  {
    errors.push("The built client runtime does not persist explicit language selections");
  }

  const englishHome = homePages.get("en") ?? "";
  if (!englishHome.includes("Software after the happy path.") || !englishHome.includes("post-card--featured") || !englishHome.includes("data-home-signal-field") || !englishHome.includes('class="landing-page"')) errors.push("English home is missing its editorial landing experience");

  for (const legacyOutput of ["index.html", "inicio/index.html", "about/index.html", "archive/index.html", "contact/index.html"])
  {
    try { await access(path.join(distributionDirectory, legacyOutput)); errors.push(`Legacy route was emitted as canonical HTML: ${legacyOutput}`); } catch {}
  }

  for (const asset of ["favicon.svg", "favicon.ico", "favicon-48x48.png", "apple-touch-icon.png", "brand/digows-orbit.webp", "social/site.png"])
  {
    try
    {
      await access(path.join(distributionDirectory, asset));
    }
    catch
    {
      errors.push(`Missing brand asset: ${asset}`);
    }
  }

  const favicon = await readFile(path.join(distributionDirectory, "favicon.svg"), "utf8");

  if (!favicon.includes("#4f87ff") || !favicon.includes("#c674ff") || !favicon.includes(">d</text>") || favicon.includes("#62e6aa"))
  {
    errors.push("Favicon does not use the digows cobalt-violet orbital identity");
  }

  if (!englishHome.includes('class="site-title"') || !englishHome.includes('src="/favicon.svg"'))
  {
    errors.push("Home page is missing the site-wide digows mark");
  }
}

async function collectFiles(directory: string, extension: string): Promise<string[]>
{
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) =>
  {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory()
      ? collectFiles(entryPath, extension)
      : entry.name.endsWith(extension) ? [entryPath] : [];
  }));

  return files.flat();
}
