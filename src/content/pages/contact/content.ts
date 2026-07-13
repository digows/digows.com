import type { Locale } from "../../../i18n/locales";

export interface ContactPageContent
{
  readonly title: string;
  readonly description: string;
  readonly eyebrow: string;
  readonly heading: string;
  readonly introduction: string;
}

export const contactPageContent: Readonly<Record<Locale, ContactPageContent>> = {
  en: {
    title: "Contact",
    description: "Contact Rodrigo P. Fraga about software architecture, engineering leadership, cloud systems, and technical collaboration.",
    eyebrow: "Contact",
    heading: "Let’s talk.",
    introduction: "For architecture work, technical leadership, speaking, or a thoughtful engineering conversation, send a message below.",
  },
  "pt-BR": {
    title: "Contato",
    description: "Entre em contato com Rodrigo P. Fraga para conversar sobre arquitetura de software, liderança técnica, cloud e colaboração.",
    eyebrow: "Contato",
    heading: "Vamos conversar.",
    introduction: "Para trabalhos de arquitetura, liderança técnica, palestras ou uma boa conversa sobre engenharia, envie uma mensagem.",
  },
  es: {
    title: "Contacto",
    description: "Contacta con Rodrigo P. Fraga para hablar sobre arquitectura de software, liderazgo técnico, sistemas cloud y colaboración técnica.",
    eyebrow: "Contacto",
    heading: "Hablemos.",
    introduction: "Para trabajos de arquitectura, liderazgo técnico, conferencias o una conversación reflexiva sobre ingeniería, envía un mensaje a continuación.",
  },
  fr: {
    title: "Contact",
    description: "Contactez Rodrigo P. Fraga pour échanger sur l’architecture logicielle, le leadership technique, les systèmes cloud et la collaboration technique.",
    eyebrow: "Contact",
    heading: "Parlons-en.",
    introduction: "Pour une mission d’architecture, du leadership technique, une conférence ou une conversation approfondie sur l’ingénierie, envoyez un message ci-dessous.",
  },
  "zh-Hans": {
    title: "联系",
    description: "联系 Rodrigo P. Fraga，交流软件架构、技术领导力、云系统与技术协作。",
    eyebrow: "联系",
    heading: "聊一聊。",
    introduction: "无论是架构工作、技术领导、演讲，还是一次深入的工程交流，都可以通过下方表单留言。",
  },
};
