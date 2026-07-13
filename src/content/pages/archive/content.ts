import type { Locale } from "../../../i18n/locales";

export interface ArchiveContent
{
  readonly title: string;
  readonly description: string;
  readonly articles: string;
}

export const archiveContent: Readonly<Record<Locale, ArchiveContent>> = {
  en: {
    title: "Archive",
    description: "Complete archive of Rodrigo P. Fraga's writing on software engineering, architecture, Java, cloud, and AI agents.",
    articles: "articles",
  },
  "pt-BR": {
    title: "Arquivo",
    description: "Arquivo completo dos textos de Rodrigo P. Fraga sobre engenharia de software, arquitetura, Java, cloud e agentes de IA.",
    articles: "artigos",
  },
  es: {
    title: "Archivo",
    description: "Archivo completo de los textos de Rodrigo P. Fraga sobre ingeniería de software, arquitectura, Java, cloud y agentes de IA.",
    articles: "artículos",
  },
  fr: {
    title: "Archives",
    description: "Archives complètes des textes de Rodrigo P. Fraga sur l’ingénierie logicielle, l’architecture, Java, le cloud et les agents d’IA.",
    articles: "articles",
  },
  "zh-Hans": {
    title: "归档",
    description: "Rodrigo P. Fraga 关于软件工程、架构、Java、云计算与人工智能体的完整文章归档。",
    articles: "篇文章",
  },
};
