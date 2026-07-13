import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { supportedLocales } from "./i18n/locales";

const posts = defineCollection({
  loader: glob({
    base: "./src/content/posts",
    pattern: "**/*.{md,mdx}",
  }),
  schema: z.object({
    title: z.string().min(1),
    seoTitle: z.string().min(1).optional(),
    description: z.string().min(1),
    permalink: z.string().regex(/^\d{4}\/\d{2}\/\d{2}\/[a-z0-9-]+$/),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    reviewedAt: z.coerce.date().optional(),
    language: z.enum(supportedLocales).default("pt-BR"),
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    wordpressId: z.number().int().positive().optional(),
    translationKey: z.string().min(1),
    translationOf: z.string().optional(),
    legacyUrl: z.url(),
    legacy: z.boolean().default(false),
    featuredImage: z.string().optional(),
    editorial: z.object({
      quickSummary: z.string().min(40),
      keyTakeaways: z.array(z.string().min(15)).min(3).max(6),
      strongestCounterargument: z.string().min(40),
      appliesWhen: z.array(z.string().min(10)).min(2).max(5),
      doesNotApplyWhen: z.array(z.string().min(10)).min(2).max(5),
      discussionPrompt: z.object({
        key: z.string().regex(/^[a-z0-9][a-z0-9._-]{2,79}$/),
        text: z.string().min(20),
      }),
      glossary: z.array(z.object({
        term: z.string().min(1),
        definition: z.string().min(10),
      })).min(2).max(8),
      relatedTranslationKeys: z.array(z.string().min(1)).max(4).default([]),
      interactiveExperience: z.enum(["find-hidden-decision"]).optional(),
      copyReviewed: z.literal(true),
    }).optional(),
  }),
});

export const collections = { posts };
