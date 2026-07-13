import type { Locale } from "../../i18n/locales";

type ContentKind = "article" | "profile";

interface PromptInput
{
  readonly locale: Locale;
  readonly title: string;
  readonly url: string;
  readonly excerpt: string;
  readonly contentKind: ContentKind;
}

export function buildAiPrompt(input: PromptInput): string
{
  const passage = input.excerpt === "" ? "" : promptPassage[input.locale](input.excerpt);

  return input.contentKind === "profile"
    ? profilePrompts[input.locale](input.url, input.title, passage)
    : articlePrompts[input.locale](input.url, input.title, passage);
}

const promptPassage: Readonly<Record<Locale, (excerpt: string) => string>> = {
  en: (excerpt) => `\nPassage I want to explore: “${excerpt}”`,
  "pt-BR": (excerpt) => `\nTrecho que quero explorar: “${excerpt}”`,
  es: (excerpt) => `\nPasaje que quiero explorar: “${excerpt}”`,
  fr: (excerpt) => `\nPassage que je souhaite explorer : « ${excerpt} »`,
  "zh-Hans": (excerpt) => `\n我想进一步探讨的段落：“${excerpt}”`,
};

const profilePrompts: Readonly<Record<Locale, (url: string, title: string, passage: string) => string>> = {
  en: (url, title, passage) => `Open this URL using web search and read the complete profile: ${url}\n\nProfile: ${title}${passage}\n\nAfter reading the actual content: 1) synthesize the main areas of work, principles, and experience; 2) identify less obvious connections across engineering, products, people, and purpose; 3) answer in English; 4) distinguish presented facts from your inferences; 5) suggest a useful follow-up question. Do not invent information if you cannot access the page.`,
  "pt-BR": (url, title, passage) => `Abra esta URL com busca na web e leia o perfil completo: ${url}\n\nPerfil: ${title}${passage}\n\nDepois de ler o conteúdo real: 1) sintetize os principais campos de atuação, princípios e experiências; 2) identifique as conexões menos óbvias entre engenharia, produtos, pessoas e propósito; 3) responda em português do Brasil; 4) diferencie fatos apresentados de suas inferências; 5) sugira uma boa pergunta de follow-up. Não invente informações se não conseguir acessar a página.`,
  es: (url, title, passage) => `Abre esta URL mediante búsqueda web y lee el perfil completo: ${url}\n\nPerfil: ${title}${passage}\n\nDespués de leer el contenido real: 1) sintetiza las principales áreas de trabajo, principios y experiencias; 2) identifica conexiones menos obvias entre ingeniería, productos, personas y propósito; 3) responde en español; 4) diferencia los hechos presentados de tus inferencias; 5) sugiere una buena pregunta de seguimiento. No inventes información si no puedes acceder a la página.`,
  fr: (url, title, passage) => `Ouvrez cette URL avec une recherche web et lisez le profil complet : ${url}\n\nProfil : ${title}${passage}\n\nAprès avoir lu le contenu réel : 1) synthétisez les principaux domaines d’activité, principes et expériences ; 2) identifiez les liens moins évidents entre ingénierie, produits, personnes et finalité ; 3) répondez en français ; 4) distinguez les faits présentés de vos inférences ; 5) suggérez une bonne question de suivi. N’inventez aucune information si vous ne pouvez pas accéder à la page.`,
  "zh-Hans": (url, title, passage) => `请使用网络搜索打开这个 URL，并阅读完整的个人介绍：${url}\n\n个人介绍：${title}${passage}\n\n阅读实际内容后：1）概括主要工作领域、原则与经历；2）找出工程、产品、人与目标之间不那么显而易见的联系；3）使用简体中文回答；4）区分文中事实与你的推断；5）建议一个有价值的后续问题。如果无法访问页面，请不要编造信息。`,
};

const articlePrompts: Readonly<Record<Locale, (url: string, title: string, passage: string) => string>> = {
  en: (url, title, passage) => `Open this URL using web search and read the complete article: ${url}\n\nArticle: ${title}${passage}\n\nAfter reading the actual content: 1) summarize the five most important points and conclusion; 2) explain which details, evidence, and insights a reader misses by not reading it; 3) answer in English; 4) remind me I can keep asking about the article; 5) suggest a useful follow-up question. Do not invent content if you cannot access the page.`,
  "pt-BR": (url, title, passage) => `Abra esta URL com busca na web e leia o artigo completo: ${url}\n\nArtigo: ${title}${passage}\n\nDepois de ler o conteúdo real: 1) resuma os 5 pontos mais importantes e a conclusão; 2) explique quais detalhes, dados e insights o leitor perderia sem ler o artigo completo; 3) responda em português do Brasil; 4) lembre que posso continuar perguntando sobre o artigo; 5) sugira uma boa pergunta de follow-up. Não invente conteúdo se não conseguir acessar a página.`,
  es: (url, title, passage) => `Abre esta URL mediante búsqueda web y lee el artículo completo: ${url}\n\nArtículo: ${title}${passage}\n\nDespués de leer el contenido real: 1) resume los cinco puntos más importantes y la conclusión; 2) explica qué detalles, datos e ideas perdería el lector si no leyera el artículo completo; 3) responde en español; 4) recuerda que puedo seguir haciendo preguntas sobre el artículo; 5) sugiere una buena pregunta de seguimiento. No inventes contenido si no puedes acceder a la página.`,
  fr: (url, title, passage) => `Ouvrez cette URL avec une recherche web et lisez l’article complet : ${url}\n\nArticle : ${title}${passage}\n\nAprès avoir lu le contenu réel : 1) résumez les cinq points les plus importants et la conclusion ; 2) expliquez quels détails, données et enseignements le lecteur manquerait sans lire l’article complet ; 3) répondez en français ; 4) rappelez que je peux continuer à poser des questions sur l’article ; 5) suggérez une bonne question de suivi. N’inventez aucun contenu si vous ne pouvez pas accéder à la page.`,
  "zh-Hans": (url, title, passage) => `请使用网络搜索打开这个 URL，并阅读完整文章：${url}\n\n文章：${title}${passage}\n\n阅读实际内容后：1）总结五个最重要的观点和结论；2）说明如果不阅读全文，读者会错过哪些细节、数据与洞见；3）使用简体中文回答；4）提醒我可以继续就本文提问；5）建议一个有价值的后续问题。如果无法访问页面，请不要编造内容。`,
};
