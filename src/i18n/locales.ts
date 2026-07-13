export const supportedLocales = ["en", "pt-BR", "es", "fr", "zh-Hans"] as const;

export type Locale = typeof supportedLocales[number];

export interface LocaleDefinition
{
  readonly locale: Locale;
  readonly urlSegment: string;
  readonly nativeName: string;
  readonly shortName: string;
  readonly openGraphLocale: string;
  readonly speechLocale: string;
  readonly direction: "ltr" | "rtl";
}

export const defaultLocale: Locale = "en";

export const localeDefinitions: Readonly<Record<Locale, LocaleDefinition>> = {
  en: {
    locale: "en",
    urlSegment: "en",
    nativeName: "English",
    shortName: "EN",
    openGraphLocale: "en_US",
    speechLocale: "en",
    direction: "ltr",
  },
  "pt-BR": {
    locale: "pt-BR",
    urlSegment: "pt-br",
    nativeName: "Português",
    shortName: "PT",
    openGraphLocale: "pt_BR",
    speechLocale: "pt-BR",
    direction: "ltr",
  },
  es: {
    locale: "es",
    urlSegment: "es",
    nativeName: "Español",
    shortName: "ES",
    openGraphLocale: "es_ES",
    speechLocale: "es",
    direction: "ltr",
  },
  fr: {
    locale: "fr",
    urlSegment: "fr",
    nativeName: "Français",
    shortName: "FR",
    openGraphLocale: "fr_FR",
    speechLocale: "fr",
    direction: "ltr",
  },
  "zh-Hans": {
    locale: "zh-Hans",
    urlSegment: "zh-hans",
    nativeName: "简体中文",
    shortName: "中文",
    openGraphLocale: "zh_CN",
    speechLocale: "zh-CN",
    direction: "ltr",
  },
};

const localeByUrlSegment = new Map(
  supportedLocales.map((locale) => [localeDefinitions[locale].urlSegment, locale] as const),
);

export function isLocale(value: unknown): value is Locale
{
  return typeof value === "string" && supportedLocales.includes(value as Locale);
}

export function assertLocale(value: unknown): Locale
{
  if (!isLocale(value))
  {
    throw new Error(`Unsupported locale: ${String(value)}`);
  }

  return value;
}

export function getLocaleByUrlSegment(segment: string): Locale | undefined
{
  return localeByUrlSegment.get(segment.toLocaleLowerCase("en-US"));
}

export function getLocaleFromPathname(pathname: string): Locale | undefined
{
  const segment = pathname.split("/").filter(Boolean)[0];
  return segment === undefined ? undefined : getLocaleByUrlSegment(segment);
}

export function getLocaleUrlSegment(locale: Locale): string
{
  return localeDefinitions[locale].urlSegment;
}
