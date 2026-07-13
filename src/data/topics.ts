import type { Post } from "../lib/posts";
import type { Locale } from "../i18n/locales";
import { getTopicRoutePath } from "../i18n/routes";
import { postTopicKeys } from "./post-topics";

export type TopicKey = "systems" | "intelligence" | "leadership" | "products" | "history";

export interface TopicDefinition
{
  readonly key: TopicKey;
  readonly slugs: Readonly<Record<Locale, string>>;
  readonly labels: Readonly<Record<Locale, string>>;
  readonly descriptions: Readonly<Record<Locale, string>>;
}

export const topics: readonly TopicDefinition[] = [
  {
    key: "systems",
    slugs: { en: "systems-architecture", "pt-BR": "sistemas-arquitetura", es: "sistemas-arquitectura", fr: "systemes-architecture", "zh-Hans": "系统与架构" },
    labels: { en: "Systems & Architecture", "pt-BR": "Sistemas e arquitetura", es: "Sistemas y arquitectura", fr: "Systèmes et architecture", "zh-Hans": "系统与架构" },
    descriptions: {
      en: "Architecture, APIs, distributed systems, integration, and software designed for production constraints.",
      "pt-BR": "Arquitetura, APIs, sistemas distribuídos, integração e software desenhado para as restrições de produção.",
      es: "Arquitectura, APIs, sistemas distribuidos, integración y software diseñado para las restricciones de producción.",
      fr: "Architecture, API, systèmes distribués, intégration et logiciels conçus pour les contraintes de la production.",
      "zh-Hans": "架构、API、分布式系统、集成，以及面向生产环境约束而设计的软件。",
    },
  },
  {
    key: "intelligence",
    slugs: { en: "ai-agents", "pt-BR": "ia-agentes", es: "ia-agentes", fr: "ia-agents", "zh-Hans": "人工智能与智能体" },
    labels: { en: "AI & Agents", "pt-BR": "IA e agentes", es: "IA y agentes", fr: "IA et agents", "zh-Hans": "人工智能与智能体" },
    descriptions: {
      en: "AI agents, tools, orchestration, engineering judgment, and practical collaboration with intelligent systems.",
      "pt-BR": "Agentes de IA, ferramentas, orquestração, julgamento de engenharia e colaboração prática com sistemas inteligentes.",
      es: "Agentes de IA, herramientas, orquestación, criterio de ingeniería y colaboración práctica con sistemas inteligentes.",
      fr: "Agents d’IA, outils, orchestration, jugement d’ingénierie et collaboration concrète avec des systèmes intelligents.",
      "zh-Hans": "人工智能体、工具、编排、工程判断，以及与智能系统的务实协作。",
    },
  },
  {
    key: "leadership",
    slugs: { en: "engineering-leadership", "pt-BR": "engenharia-lideranca", es: "ingenieria-liderazgo", fr: "ingenierie-leadership", "zh-Hans": "工程与领导力" },
    labels: { en: "Engineering & Leadership", "pt-BR": "Engenharia e liderança", es: "Ingeniería y liderazgo", fr: "Ingénierie et leadership", "zh-Hans": "工程与领导力" },
    descriptions: {
      en: "Technical leadership, individual contribution, team design, ownership, and the human systems around software.",
      "pt-BR": "Liderança técnica, contribuição individual, desenho de times, responsabilidade e os sistemas humanos ao redor do software.",
      es: "Liderazgo técnico, contribución individual, diseño de equipos, responsabilidad y los sistemas humanos que rodean al software.",
      fr: "Leadership technique, contribution individuelle, conception des équipes, responsabilité et systèmes humains autour du logiciel.",
      "zh-Hans": "技术领导力、个人贡献、团队设计、责任意识，以及软件周围的人类系统。",
    },
  },
  {
    key: "products",
    slugs: { en: "products-organizations", "pt-BR": "produtos-organizacoes", es: "productos-organizaciones", fr: "produits-organisations", "zh-Hans": "产品与组织" },
    labels: { en: "Products & Organizations", "pt-BR": "Produtos e organizações", es: "Productos y organizaciones", fr: "Produits et organisations", "zh-Hans": "产品与组织" },
    descriptions: {
      en: "Products, business constraints, organizations, delivery, and the decisions that turn software into an operation.",
      "pt-BR": "Produtos, restrições de negócio, organizações, entrega e as decisões que transformam software em operação.",
      es: "Productos, restricciones de negocio, organizaciones, entrega y las decisiones que convierten el software en una operación.",
      fr: "Produits, contraintes métier, organisations, livraison et décisions qui transforment le logiciel en activité réelle.",
      "zh-Hans": "产品、业务约束、组织、交付，以及把软件转化为实际运营的决策。",
    },
  },
  {
    key: "history",
    slugs: { en: "software-history", "pt-BR": "historia-do-software", es: "historia-del-software", fr: "histoire-du-logiciel", "zh-Hans": "软件历史" },
    labels: { en: "Software History", "pt-BR": "História do software", es: "Historia del software", fr: "Histoire du logiciel", "zh-Hans": "软件历史" },
    descriptions: {
      en: "The preserved Java, Flex, PHP, web, and community record behind more than two decades of building software.",
      "pt-BR": "O registro preservado de Java, Flex, PHP, web e comunidade por trás de mais de duas décadas construindo software.",
      es: "El registro conservado de Java, Flex, PHP, web y comunidad tras más de dos décadas construyendo software.",
      fr: "Les traces conservées de Java, Flex, PHP, du web et des communautés après plus de deux décennies à construire des logiciels.",
      "zh-Hans": "二十多年软件构建历程中留下的 Java、Flex、PHP、Web 与社区记录。",
    },
  },
] as const;

export function getTopicPath(topic: TopicDefinition, language: Locale): string
{
  return getTopicRoutePath(topic.slugs[language], language);
}

export function getTopicsForPost(post: Post): readonly TopicDefinition[]
{
  return getTopicsForTranslationKey(post.data.translationKey);
}

export function getTopicsForTranslationKey(translationKey: string): readonly TopicDefinition[]
{
  const matchingKeys = postTopicKeys[translationKey];

  if (matchingKeys === undefined)
  {
    throw new Error(`Missing stable topic assignment for ${translationKey}`);
  }

  return topics.filter((topic) => matchingKeys.includes(topic.key));
}

export function getPrimaryTopic(post: Post): TopicDefinition
{
  return getPrimaryTopicForTranslationKey(post.data.translationKey);
}

export function getPrimaryTopicForTranslationKey(translationKey: string): TopicDefinition
{
  const postTopics = getTopicsForTranslationKey(translationKey);
  return postTopics.find((topic) => topic.key !== "history") ?? postTopics[0] ?? topics[0];
}

export function postMatchesTopic(post: Post, topic: TopicDefinition): boolean
{
  return getTopicsForPost(post).some((candidate) => candidate.key === topic.key);
}
