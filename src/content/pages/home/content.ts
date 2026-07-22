import type { Locale } from "../../../i18n/locales";

export interface HomeProjectSpotlight
{
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly cta: string;
  readonly href: string;
}

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
  readonly projectSpotlight: HomeProjectSpotlight;
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
    projectSpotlight: {
      eyebrow: "Check out my latest pet project",
      title: "Engineering work deserves more than a chat.",
      description: "Kavor connects coding agents, specifications, files, terminals, decisions, and evidence in one durable visual workspace.",
      cta: "Explore Kavor",
      href: "https://agentkavor.com/en",
    },
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
    projectSpotlight: {
      eyebrow: "Conheça meu projeto mais recente",
      title: "Engenharia merece mais do que um chat.",
      description: "Kavor conecta coding agents, especificações, arquivos, terminais, decisões e evidências em um workspace visual e durável.",
      cta: "Explorar o Kavor",
      href: "https://agentkavor.com/pt-br",
    },
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
    projectSpotlight: {
      eyebrow: "Conoce mi proyecto más reciente",
      title: "La ingeniería merece más que un chat.",
      description: "Kavor conecta coding agents, especificaciones, archivos, terminales, decisiones y evidencias en un espacio de trabajo visual y duradero.",
      cta: "Explorar Kavor",
      href: "https://agentkavor.com/es",
    },
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
    projectSpotlight: {
      eyebrow: "Découvrez mon projet le plus récent",
      title: "L’ingénierie mérite mieux qu’un simple chat.",
      description: "Kavor relie coding agents, spécifications, fichiers, terminaux, décisions et preuves dans un espace de travail visuel et durable.",
      cta: "Découvrir Kavor",
      href: "https://agentkavor.com/fr",
    },
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
    projectSpotlight: {
      eyebrow: "看看我最近在做的项目",
      title: "工程工作不该止于一次聊天。",
      description: "Kavor 将 coding agent、规格、文件、终端、决策与证据连接在一个持久的可视化工作空间中。",
      cta: "探索 Kavor",
      href: "https://agentkavor.com/zh",
    },
  },
};
