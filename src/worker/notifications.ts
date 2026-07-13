import type { Environment } from "./contracts";
import type { Locale } from "../i18n/locales";
import { createCommentModerationUrl } from "./moderation";

interface ContactNotification
{
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly website: string | null;
  readonly message: string;
  readonly language: Locale;
  readonly createdAt: number;
}

interface CommentNotification
{
  readonly id: string;
  readonly contentId: string;
  readonly canonicalPath: string;
  readonly parentId: string | null;
  readonly authorName: string;
  readonly authorUrl: string | null;
  readonly body: string;
  readonly language: Locale;
  readonly anchorQuote: string | null;
  readonly createdAt: number;
}

export async function sendContactNotification(
  environment: Environment,
  notification: ContactNotification,
): Promise<void>
{
  const website = notification.website ?? "Not provided";
  const text = [
    "A new contact message was stored in digows-com.",
    "",
    `Message ID: ${notification.id}`,
    `Received at: ${new Date(notification.createdAt).toISOString()}`,
    `Language: ${notification.language}`,
    `Name: ${notification.name}`,
    `Email: ${notification.email}`,
    `Website: ${website}`,
    "",
    "Message:",
    notification.message,
  ].join("\n");

  await sendNotification(environment, {
    subject: `[digows.com] New contact from ${notification.name}`,
    text,
    replyTo: {
      name: notification.name,
      email: notification.email,
    },
    event: "contact_notification",
    recordId: notification.id,
  });
}

export async function sendCommentNotification(
  environment: Environment,
  notification: CommentNotification,
): Promise<void>
{
  const articleUrl = new URL(notification.canonicalPath, environment.SITE_ORIGIN).href;
  const [approveUrl, rejectUrl] = await Promise.all([
    createCommentModerationUrl(notification.id, environment, "approve"),
    createCommentModerationUrl(notification.id, environment, "reject"),
  ]);
  const text = [
    "A new comment is awaiting moderation in digows-com.",
    "",
    `Comment ID: ${notification.id}`,
    `Received at: ${new Date(notification.createdAt).toISOString()}`,
    `Language: ${notification.language}`,
    `Content ID: ${notification.contentId}`,
    `Article: ${articleUrl}`,
    `Parent comment: ${notification.parentId ?? "None"}`,
    `Author: ${notification.authorName}`,
    `Author URL: ${notification.authorUrl ?? "Not provided"}`,
    `Selected passage: ${notification.anchorQuote ?? "None"}`,
    "",
    "Comment:",
    notification.body,
    "",
    `Review and approve: ${approveUrl}`,
    `Review and reject: ${rejectUrl}`,
  ].join("\n");

  await sendNotification(environment, {
    subject: `[digows.com] Comment awaiting moderation from ${notification.authorName}`,
    text,
    event: "comment_notification",
    recordId: notification.id,
  });
}

async function sendNotification(
  environment: Environment,
  notification: {
    readonly subject: string;
    readonly text: string;
    readonly replyTo?: EmailAddress;
    readonly event: "contact_notification" | "comment_notification";
    readonly recordId: string;
  },
): Promise<void>
{
  try
  {
    const result = await environment.NOTIFICATION_EMAIL.send({
      to: environment.NOTIFICATION_EMAIL_DESTINATION,
      from: {
        name: "digows.com",
        email: environment.NOTIFICATION_EMAIL_FROM,
      },
      subject: notification.subject,
      text: notification.text,
      ...(notification.replyTo === undefined ? {} : { replyTo: notification.replyTo }),
    });

    console.log(JSON.stringify({
      event: `${notification.event}_sent`,
      recordId: notification.recordId,
      messageId: result.messageId,
    }));
  }
  catch (error)
  {
    console.error(JSON.stringify({
      event: `${notification.event}_failed`,
      recordId: notification.recordId,
      code: getErrorCode(error),
      message: error instanceof Error ? error.message : "Unknown email error",
    }));
  }
}

function getErrorCode(error: unknown): string | null
{
  if (typeof error !== "object" || error === null || !("code" in error))
  {
    return null;
  }

  return typeof error.code === "string" ? error.code : null;
}
