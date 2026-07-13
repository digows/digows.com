import type { Locale } from "../../i18n/locales";

interface WelcomeEmailCopy
{
  readonly subject: string;
  readonly preheader: string;
  readonly heading: string;
  readonly body: string;
  readonly action: string;
  readonly preferences: string;
}

const welcomeEmailCopy: Readonly<Record<Locale, WelcomeEmailCopy>> = {
  en: {
    subject: "You are now part of the digows.com newsletter",
    preheader: "Your subscription is active.",
    heading: "You are in.",
    body: "Your subscription is active. New digows.com essays will arrive here in English when there is something worth sending.",
    action: "Read the latest essays",
    preferences: "You can unsubscribe from future newsletters at any time from an email you receive.",
  },
  "pt-BR": {
    subject: "Você agora faz parte da newsletter do digows.com",
    preheader: "Sua assinatura está ativa.",
    heading: "Você está dentro.",
    body: "Sua assinatura está ativa. Os novos ensaios do digows.com chegarão aqui em português quando houver algo que valha o envio.",
    action: "Ler os ensaios mais recentes",
    preferences: "Você pode cancelar os próximos envios a qualquer momento por um e-mail recebido.",
  },
  es: {
    subject: "Ya formas parte del boletín de digows.com",
    preheader: "Tu suscripción está activa.",
    heading: "Ya estás dentro.",
    body: "Tu suscripción está activa. Los nuevos ensayos de digows.com llegarán aquí en español cuando haya algo que merezca ser enviado.",
    action: "Leer los ensayos más recientes",
    preferences: "Puedes darte de baja de futuros envíos en cualquier momento desde un correo recibido.",
  },
  fr: {
    subject: "Vous faites maintenant partie de la lettre de digows.com",
    preheader: "Votre abonnement est actif.",
    heading: "Vous êtes inscrit.",
    body: "Votre abonnement est actif. Les nouveaux essais de digows.com arriveront ici en français lorsqu’il y aura quelque chose qui mérite d’être envoyé.",
    action: "Lire les essais les plus récents",
    preferences: "Vous pourrez vous désabonner des prochains envois à tout moment depuis un e-mail reçu.",
  },
  "zh-Hans": {
    subject: "你已加入 digows.com 通讯",
    preheader: "你的订阅已生效。",
    heading: "订阅成功。",
    body: "你的订阅已生效。有值得分享的新内容时，digows.com 的简体中文文章将发送到这里。",
    action: "阅读最新文章",
    preferences: "你可以随时通过收到的邮件取消后续订阅。",
  },
};

export function createWelcomeEmail(locale: Locale, siteUrl: string): {
  readonly subject: string;
  readonly text: string;
  readonly html: string;
}
{
  const copy = welcomeEmailCopy[locale];
  const escapedUrl = escapeHtml(siteUrl);
  const text = [
    copy.heading,
    "",
    copy.body,
    "",
    `${copy.action}: ${siteUrl}`,
    "",
    copy.preferences,
  ].join("\n");
  const html = `<!doctype html>
<html lang="${escapeHtml(locale)}">
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
  <body style="margin:0;background:#090a0f;color:#eeedf7;font-family:Arial,sans-serif">
    <div style="display:none;max-height:0;overflow:hidden">${escapeHtml(copy.preheader)}</div>
    <main style="max-width:620px;margin:0 auto;padding:48px 24px">
      <p style="margin:0 0 24px;color:#8ba7ff;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase">digows.com</p>
      <h1 style="margin:0 0 20px;font-family:Georgia,serif;font-size:38px;line-height:1.1">${escapeHtml(copy.heading)}</h1>
      <p style="margin:0 0 28px;color:#b7b8c6;font-size:18px;line-height:1.65">${escapeHtml(copy.body)}</p>
      <p style="margin:0 0 30px"><a href="${escapedUrl}" style="display:inline-block;padding:13px 20px;border-radius:999px;background:#7694ff;color:#090a0f;font-weight:700;text-decoration:none">${escapeHtml(copy.action)}</a></p>
      <p style="margin:0;color:#8f90a0;font-size:13px;line-height:1.6">${escapeHtml(copy.preferences)}</p>
    </main>
  </body>
</html>`;

  return { subject: copy.subject, text, html };
}

function escapeHtml(value: string): string
{
  return value
    .replace(/&/gu, "&amp;")
    .replace(/</gu, "&lt;")
    .replace(/>/gu, "&gt;")
    .replace(/"/gu, "&quot;")
    .replace(/'/gu, "&#039;");
}
