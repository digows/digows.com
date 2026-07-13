import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) =>
{
  const baseUrl = site ?? new URL("https://digows.com");
  return new Response([
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${new URL("sitemap-index.xml", baseUrl).href}`,
    "",
  ].join("\n"));
};
