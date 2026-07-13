import { getCollection, type CollectionEntry } from "astro:content";
import { getLocalizedPostPath } from "../i18n/routes";

export type Post = CollectionEntry<"posts">;

/** Return published posts in reverse chronological order. */
export async function getPublishedPosts(): Promise<Post[]>
{
  const posts = await getCollection("posts", ({ data }) => !data.draft);
  const postsByPermalink = Map.groupBy(posts, (post) => post.data.permalink);
  const duplicatePermalinks = [...postsByPermalink.entries()]
    .filter(([, permalinkPosts]) => permalinkPosts.length > 1)
    .map(([permalink]) => permalink);

  if (duplicatePermalinks.length > 0)
  {
    throw new Error(`Duplicate post permalinks: ${duplicatePermalinks.join(", ")}`);
  }

  return posts.sort((left, right) => right.data.publishedAt.getTime() - left.data.publishedAt.getTime());
}

/** Return the canonical path for a post while preserving the historic WordPress permalink. */
export function getPostPath(post: Post): string
{
  return getLocalizedPostPath(post.data.permalink, post.data.language);
}

/** Return the editorial publication date encoded in the canonical permalink. */
export function getPostPublicationDate(post: Post): Date
{
  const match = /^(\d{4})\/(\d{2})\/(\d{2})\//u.exec(post.data.permalink);

  if (match === null)
  {
    throw new Error(`Invalid dated permalink: ${post.data.permalink}`);
  }

  const year = Number.parseInt(match[1], 10);
  const month = Number.parseInt(match[2], 10);
  const day = Number.parseInt(match[3], 10);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day)
  {
    throw new Error(`Invalid publication date in permalink: ${post.data.permalink}`);
  }

  return date;
}

export function getPostPublicationDateValue(post: Post): string
{
  return getPostPublicationDate(post).toISOString().slice(0, 10);
}
