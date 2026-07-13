import type { Post } from "./posts";
import { getPrimaryTopicForTranslationKey } from "../data/topics";
import { getLocaleUrlSegment } from "../i18n/locales";
import type { Locale } from "../i18n/locales";

export interface SocialImagePostData
{
  readonly title: string;
  readonly language: Locale;
  readonly translationKey: string;
  readonly publicationYear: number;
}

interface SocialImageContent
{
  readonly title: string;
  readonly kicker: string;
  readonly signature?: string;
  readonly seed: string;
}

const palettes = [
  { accent: "#4f87ff", secondary: "#c674ff" },
  { accent: "#86a6ff", secondary: "#a76ce8" },
  { accent: "#315bea", secondary: "#d090ff" },
  { accent: "#6f8fff", secondary: "#9c6cff" },
] as const;

export function getPostSocialImagePath(post: Post): string
{
  return `/social/${getLocaleUrlSegment(post.data.language)}/${post.data.permalink}.png`;
}

export function createPostSocialImageSvg(post: SocialImagePostData): string
{
  const topic = getPrimaryTopicForTranslationKey(post.translationKey);

  return createSocialImageSvg({
    title: post.title,
    kicker: `${topic.labels[post.language]} · ${post.publicationYear}`,
    signature: "Rodrigo P. Fraga · digows.com",
    seed: post.translationKey,
  });
}

export function createSiteSocialImageSvg(): string
{
  return createSocialImageSvg({
    title: "Software after the happy path.",
    kicker: "SOFTWARE · SYSTEMS · CONSEQUENCE",
    signature: "Rodrigo P. Fraga · digows.com",
    seed: "digows.com",
  });
}

function createSocialImageSvg(content: SocialImageContent): string
{
  const palette = palettes[stableHash(content.seed) % palettes.length];
  const titleLines = wrapText(content.title, 26, 4);
  const titleStartY = 235 - Math.max(titleLines.length - 2, 0) * 40;
  const titleMarkup = titleLines.map((line, index) =>
    `<text x="88" y="${titleStartY + index * 82}" fill="#edf1ee" font-family="Georgia,Times New Roman,serif" font-size="70" font-weight="700" letter-spacing="-2">${escapeXml(line)}</text>`,
  ).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="signal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${palette.accent}"/><stop offset="1" stop-color="${palette.secondary}"/></linearGradient>
    <radialGradient id="halo"><stop stop-color="${palette.accent}" stop-opacity=".22"/><stop offset="1" stop-color="${palette.accent}" stop-opacity="0"/></radialGradient>
    <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M80 0H0V80" fill="none" stroke="#edf1ee" stroke-opacity=".045"/></pattern>
  </defs>
  <rect width="1200" height="630" rx="34" fill="#090a0f"/>
  <rect width="1200" height="630" rx="34" fill="url(#grid)"/>
  <circle cx="1010" cy="125" r="250" fill="url(#halo)"/>
  <g transform="translate(1000 132)">
    <g fill="none" stroke="url(#signal)">
      <ellipse rx="126" ry="50" transform="rotate(18)" stroke-opacity=".74" stroke-width="2"/>
      <ellipse rx="118" ry="46" transform="rotate(76)" stroke-opacity=".44" stroke-width="2"/>
      <ellipse rx="96" ry="36" transform="rotate(-38)" stroke-opacity=".32" stroke-width="1.5"/>
    </g>
    <text x="-4" y="16" fill="#edf1ee" text-anchor="middle" font-family="Georgia,Times New Roman,serif" font-size="47" font-style="italic" font-weight="700" letter-spacing="-2">digows</text>
  </g>
  <text x="88" y="96" fill="${palette.accent}" font-family="Arial,sans-serif" font-size="19" font-weight="700" letter-spacing="4">${escapeXml(content.kicker.toUpperCase())}</text>
  ${titleMarkup}
  <line x1="88" y1="544" x2="1112" y2="544" stroke="#edf1ee" stroke-opacity=".14"/>
  <text x="88" y="585" fill="#a0aaa2" font-family="Arial,sans-serif" font-size="20" letter-spacing="1">${escapeXml(content.signature ?? "digows.com")}</text>
  <text x="1112" y="585" fill="${palette.accent}" text-anchor="end" font-family="Arial,sans-serif" font-size="20" font-weight="700">BUILD WHAT MATTERS →</text>
</svg>`;
}

function wrapText(value: string, maximumCharacters: number, maximumLines: number): string[]
{
  const usesSpaces = /\s/u.test(value.trim());
  const words = usesSpaces
    ? value.trim().split(/\s+/u)
    : [...new Intl.Segmenter("zh-Hans", { granularity: "word" }).segment(value.trim())].map((segment) => segment.segment);
  const lines: string[] = [];
  let currentLine = "";
  let processedTokenCount = 0;

  for (const word of words)
  {
    processedTokenCount += 1;
    const candidate = currentLine.length === 0 ? word : `${currentLine}${usesSpaces ? " " : ""}${word}`;

    if ([...candidate].length <= maximumCharacters || currentLine.length === 0)
    {
      currentLine = candidate;
      continue;
    }

    lines.push(currentLine);
    currentLine = word;

    if (lines.length === maximumLines - 1) break;
  }

  if (currentLine.length > 0 && lines.length < maximumLines) lines.push(currentLine);
  if (processedTokenCount < words.length)
  {
    lines[lines.length - 1] = `${lines[lines.length - 1].replace(/[.,:;!?-]*$/, "")}…`;
  }

  return lines;
}

function stableHash(value: string): number
{
  let hash = 2_166_136_261;

  for (const character of value)
  {
    hash ^= character.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16_777_619);
  }

  return hash >>> 0;
}

function escapeXml(value: string): string
{
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&apos;" })[character] ?? character);
}
