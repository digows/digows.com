import rss from "@astrojs/rss";
import type { APIContext, GetStaticPaths } from "astro";
import { homeContent } from "../../content/pages/home/content";
import { getLocaleUrlSegment, supportedLocales, type Locale } from "../../i18n/locales";
import { getPostPath, getPublishedPosts } from "../../lib/posts";

export const getStaticPaths = (() => supportedLocales.map((locale) => ({
  params: { locale: getLocaleUrlSegment(locale) },
  props: { locale },
}))) satisfies GetStaticPaths;

export async function GET(context: APIContext): Promise<Response>
{
  const { locale } = context.props as { readonly locale: Locale };
  const posts = (await getPublishedPosts()).filter((post) => post.data.language === locale);

  return rss({
    title: "Rodrigo P. Fraga",
    description: homeContent[locale].description,
    site: context.site ?? "https://digows.com",
    customData: `<language>${locale}</language>`,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishedAt,
      link: getPostPath(post),
    })),
  });
}
