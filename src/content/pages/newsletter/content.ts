import type { Locale } from "../../../i18n/locales";

export interface NewsletterPageContent
{
  readonly title: string;
  readonly seoTitle: string;
  readonly description: string;
  readonly eyebrow: string;
  readonly heading: string;
  readonly introduction: string;
  readonly promises: readonly string[];
}

export const newsletterPageContent: Readonly<Record<Locale, NewsletterPageContent>> = {
  en: {
    title: "Newsletter",
    seoTitle: "Newsletter — Rodrigo P. Fraga",
    description: "Receive new digows.com essays on software architecture, systems, engineering leadership, and AI agents by email.",
    eyebrow: "The field notes, by email",
    heading: "One considered message when there is something worth sending.",
    introduction: "New essays arrive in the language you choose. No manufactured cadence and no inbox filler.",
    promises: ["Only newly published work", "Language-specific delivery", "Leave with one click"],
  },
  "pt-BR": {
    title: "Newsletter",
    seoTitle: "Newsletter — Rodrigo P. Fraga",
    description: "Receba por e-mail os novos ensaios do digows.com sobre arquitetura de software, sistemas, liderança técnica e agentes de IA.",
    eyebrow: "Notas de campo, por e-mail",
    heading: "Uma mensagem pensada quando houver algo que valha o envio.",
    introduction: "Os novos ensaios chegam no idioma que você escolher. Sem frequência inventada e sem preencher sua caixa de entrada.",
    promises: ["Apenas conteúdo recém-publicado", "Envio separado por idioma", "Saída em um clique"],
  },
  es: {
    title: "Boletín",
    seoTitle: "Boletín — Rodrigo P. Fraga",
    description: "Recibe por correo los nuevos ensayos de digows.com sobre arquitectura de software, sistemas, liderazgo técnico y agentes de IA.",
    eyebrow: "Notas de campo, por correo",
    heading: "Un mensaje meditado cuando haya algo que merezca ser enviado.",
    introduction: "Los nuevos ensayos llegan en el idioma que elijas. Sin una cadencia artificial ni contenido de relleno.",
    promises: ["Solo contenido recién publicado", "Envío separado por idioma", "Baja con un clic"],
  },
  fr: {
    title: "Lettre",
    seoTitle: "Lettre — Rodrigo P. Fraga",
    description: "Recevez par e-mail les nouveaux essais de digows.com sur l’architecture logicielle, les systèmes, le leadership technique et les agents IA.",
    eyebrow: "Notes de terrain, par e-mail",
    heading: "Un message réfléchi lorsqu’il y a vraiment quelque chose à transmettre.",
    introduction: "Les nouveaux essais arrivent dans la langue choisie. Aucun rythme artificiel, aucun remplissage de boîte de réception.",
    promises: ["Uniquement les nouvelles publications", "Envoi distinct par langue", "Désabonnement en un clic"],
  },
  "zh-Hans": {
    title: "通讯",
    seoTitle: "通讯 — Rodrigo P. Fraga",
    description: "通过电子邮件接收 digows.com 关于软件架构、系统、技术领导力和 AI 智能体的新文章。",
    eyebrow: "通过电子邮件接收现场笔记",
    heading: "只有在确实值得发送时，才寄出一封认真写成的邮件。",
    introduction: "新文章会以你选择的语言送达。不刻意维持频率，也不向收件箱填充内容。",
    promises: ["仅发送新发布的内容", "按语言分别发送", "一键退订"],
  },
};
