import type { Locale } from "../../../i18n/locales";

export interface HomeContent
{
  readonly title: string;
  readonly seoTitle: string;
  readonly description: string;
  readonly eyebrow: string;
  readonly titleLead: string;
  readonly titleEmphasis: string;
  readonly browse: string;
  readonly profile: string;
  readonly actionsLabel: string;
  readonly latest: string;
  readonly listTitle: string;
  readonly archive: string;
  readonly empty: string;
}

export const homeContent: Readonly<Record<Locale, HomeContent>> = {
  en: {
    title: "Software after the happy path.",
    seoTitle: "Software Architecture & AI Agents | Rodrigo P. Fraga",
    description: "Field notes on software architecture, AI agents, engineering judgment, and building systems that must survive production.",
    eyebrow: "Software · Systems · Consequence",
    titleLead: "Software",
    titleEmphasis: "after the happy path.",
    browse: "Browse the latest writing",
    profile: "Explore the full profile",
    actionsLabel: "Explore digows.com",
    latest: "Latest writing",
    listTitle: "Ideas from practice.",
    archive: "View the complete archive",
    empty: "The archive is being prepared.",
  },
  "pt-BR": {
    title: "Software fora do happy path.",
    seoTitle: "Arquitetura de Software e Agentes de IA | Rodrigo P. Fraga",
    description: "Notas de campo sobre arquitetura de software, agentes de IA, julgamento de engenharia e sistemas que precisam sobreviver à produção.",
    eyebrow: "Software · Sistemas · Consequência",
    titleLead: "Software",
    titleEmphasis: "fora do happy path.",
    browse: "Explorar os artigos mais recentes",
    profile: "Conhecer o perfil completo",
    actionsLabel: "Explorar o digows.com",
    latest: "Publicações recentes",
    listTitle: "Ideias que vêm da prática.",
    archive: "Ver o arquivo completo",
    empty: "O arquivo está sendo preparado.",
  },
  es: {
    title: "Software después del happy path.",
    seoTitle: "Arquitectura de software y agentes de IA | Rodrigo P. Fraga",
    description: "Notas de campo sobre arquitectura de software, agentes de IA, criterio de ingeniería y sistemas que deben sobrevivir a producción.",
    eyebrow: "Software · Sistemas · Consecuencia",
    titleLead: "Software",
    titleEmphasis: "después del happy path.",
    browse: "Explorar los artículos más recientes",
    profile: "Conocer el perfil completo",
    actionsLabel: "Explorar digows.com",
    latest: "Publicaciones recientes",
    listTitle: "Ideas que nacen de la práctica.",
    archive: "Ver el archivo completo",
    empty: "El archivo se está preparando.",
  },
  fr: {
    title: "Le logiciel après le happy path.",
    seoTitle: "Architecture logicielle et agents d’IA | Rodrigo P. Fraga",
    description: "Notes de terrain sur l’architecture logicielle, les agents d’IA, le jugement d’ingénierie et les systèmes qui doivent survivre à la production.",
    eyebrow: "Logiciel · Systèmes · Conséquence",
    titleLead: "Le logiciel",
    titleEmphasis: "après le happy path.",
    browse: "Explorer les articles récents",
    profile: "Découvrir le profil complet",
    actionsLabel: "Explorer digows.com",
    latest: "Publications récentes",
    listTitle: "Des idées issues de la pratique.",
    archive: "Voir toutes les archives",
    empty: "Les archives sont en préparation.",
  },
  "zh-Hans": {
    title: "越过 happy path 之后的软件。",
    seoTitle: "软件架构与人工智能体 | Rodrigo P. Fraga",
    description: "关于软件架构、人工智能体、工程判断，以及必须经受生产环境考验的系统的实践笔记。",
    eyebrow: "软件 · 系统 · 后果",
    titleLead: "软件",
    titleEmphasis: "越过 happy path 之后。",
    browse: "浏览最新文章",
    profile: "查看完整个人介绍",
    actionsLabel: "探索 digows.com",
    latest: "近期文章",
    listTitle: "源于实践的思考。",
    archive: "查看完整归档",
    empty: "文章归档正在准备中。",
  },
};
