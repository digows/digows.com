import {
  defaultLocale,
  getLocaleUrlSegment,
  supportedLocales,
  type Locale,
} from "./locales";

export type SiteRouteKey = "home" | "about" | "archive" | "contact" | "newsletter";

const routeSlugs: Readonly<Record<Exclude<SiteRouteKey, "home">, Readonly<Record<Locale, string>>>> = {
  about: {
    en: "about",
    "pt-BR": "sobre",
    es: "acerca-de",
    fr: "a-propos",
    "zh-Hans": "关于",
  },
  archive: {
    en: "archive",
    "pt-BR": "arquivo",
    es: "archivo",
    fr: "archives",
    "zh-Hans": "归档",
  },
  contact: {
    en: "contact",
    "pt-BR": "contato",
    es: "contacto",
    fr: "contact",
    "zh-Hans": "联系",
  },
  newsletter: {
    en: "newsletter",
    "pt-BR": "newsletter",
    es: "boletin",
    fr: "lettre",
    "zh-Hans": "通讯",
  },
};

const topicRouteSlugs: Readonly<Record<Locale, string>> = {
  en: "topics",
  "pt-BR": "topicos",
  es: "temas",
  fr: "sujets",
  "zh-Hans": "主题",
};

export interface LanguageAlternate
{
  readonly language: Locale | "x-default";
  readonly path: string;
}

export function getSiteRoutePath(route: SiteRouteKey, locale: Locale): string
{
  const localeRoot = `/${getLocaleUrlSegment(locale)}/`;
  return route === "home" ? localeRoot : `${localeRoot}${routeSlugs[route][locale]}/`;
}

export function getTopicRoutePath(topicSlug: string, locale: Locale): string
{
  return `/${getLocaleUrlSegment(locale)}/${topicRouteSlugs[locale]}/${topicSlug}/`;
}

export function getLocalizedPostPath(permalink: string, locale: Locale): string
{
  return `/${getLocaleUrlSegment(locale)}/${permalink.replace(/^\/+|\/+$/gu, "")}/`;
}

export function getSiteRouteAlternates(route: SiteRouteKey): readonly LanguageAlternate[]
{
  return [
    ...supportedLocales.map((locale) => ({ language: locale, path: getSiteRoutePath(route, locale) })),
    { language: "x-default", path: getSiteRoutePath(route, defaultLocale) },
  ];
}

export function getTopicRouteSegment(locale: Locale): string
{
  return topicRouteSlugs[locale];
}

export function getSiteRouteSlug(route: Exclude<SiteRouteKey, "home">, locale: Locale): string
{
  return routeSlugs[route][locale];
}
