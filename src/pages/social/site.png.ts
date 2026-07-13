import type { APIRoute } from "astro";
import sharp from "sharp";
import { createSiteSocialImageSvg } from "../../lib/social-images";

export const prerender = true;

export const GET: APIRoute = async () =>
{
  const image = await sharp(Buffer.from(createSiteSocialImageSvg()))
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();

  return new Response(new Uint8Array(image), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
