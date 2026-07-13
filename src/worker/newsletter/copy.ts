import type { Locale } from "../../i18n/locales";

interface ConfirmationEmailCopy
{
  readonly subject: string;
  readonly preheader: string;
  readonly heading: string;
  readonly body: string;
  readonly action: string;
  readonly expiry: string;
  readonly ignore: string;
}

const confirmationEmailCopy: Readonly<Record<Locale, ConfirmationEmailCopy>> = {
  en: {
    subject: "Confirm your digows.com subscription",
    preheader: "One click remains before the next essay reaches your inbox.",
    heading: "Confirm your subscription",
    body: "You asked to receive new essays from digows.com in English.",
    action: "Confirm subscription",
    expiry: "This confirmation link expires in 48 hours.",
    ignore: "If you did not request this, ignore this email. You will not be subscribed.",
  },
  "pt-BR": {
    subject: "Confirme sua assinatura do digows.com",
    preheader: "Falta um clique para o próximo ensaio chegar ao seu e-mail.",
    heading: "Confirme sua assinatura",
    body: "Você pediu para receber os novos ensaios do digows.com em português.",
    action: "Confirmar assinatura",
    expiry: "Este link de confirmação expira em 48 horas.",
    ignore: "Se você não fez este pedido, ignore este e-mail. A assinatura não será ativada.",
  },
  es: {
    subject: "Confirma tu suscripción a digows.com",
    preheader: "Solo falta un clic para recibir el próximo ensayo.",
    heading: "Confirma tu suscripción",
    body: "Has solicitado recibir los nuevos ensayos de digows.com en español.",
    action: "Confirmar suscripción",
    expiry: "Este enlace de confirmación caduca en 48 horas.",
    ignore: "Si no solicitaste esto, ignora este correo. No se activará ninguna suscripción.",
  },
  fr: {
    subject: "Confirmez votre abonnement à digows.com",
    preheader: "Il ne reste qu’un clic avant de recevoir le prochain essai.",
    heading: "Confirmez votre abonnement",
    body: "Vous avez demandé à recevoir les nouveaux essais de digows.com en français.",
    action: "Confirmer l’abonnement",
    expiry: "Ce lien de confirmation expire dans 48 heures.",
    ignore: "Si vous n’êtes pas à l’origine de cette demande, ignorez cet e-mail. Aucun abonnement ne sera activé.",
  },
  "zh-Hans": {
    subject: "确认订阅 digows.com",
    preheader: "再点击一次，即可在邮箱中收到下一篇文章。",
    heading: "确认订阅",
    body: "你已申请接收 digows.com 的简体中文新文章。",
    action: "确认订阅",
    expiry: "此确认链接将在 48 小时后失效。",
    ignore: "如果这不是你的操作，请忽略此邮件。订阅不会被激活。",
  },
};

export function createConfirmationEmail(locale: Locale, confirmationUrl: string): {
  readonly subject: string;
  readonly text: string;
  readonly html: string;
}
{
  const copy = confirmationEmailCopy[locale];
  const escapedUrl = escapeHtml(confirmationUrl);
  const text = [
    copy.heading,
    "",
    copy.body,
    "",
    `${copy.action}: ${confirmationUrl}`,
    "",
    copy.expiry,
    copy.ignore,
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
      <p style="margin:0 0 8px;color:#8f90a0;font-size:13px;line-height:1.6">${escapeHtml(copy.expiry)}</p>
      <p style="margin:0;color:#8f90a0;font-size:13px;line-height:1.6">${escapeHtml(copy.ignore)}</p>
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
