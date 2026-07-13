import type { Locale } from "./locales";

const readingRates: Readonly<Record<Locale, number>> = {
  en: 230,
  "pt-BR": 210,
  es: 220,
  fr: 220,
  "zh-Hans": 300,
};

export function countWords(text: string, locale: Locale): number
{
  const segmenter = new Intl.Segmenter(locale, { granularity: "word" });
  return [...segmenter.segment(text)].filter((segment) => segment.isWordLike).length;
}

export function calculateReadingMinutes(text: string, locale: Locale): number
{
  return Math.max(1, Math.ceil(countWords(text, locale) / readingRates[locale]));
}

export function formatPublishedDate(date: Date, locale: Locale): string
{
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
