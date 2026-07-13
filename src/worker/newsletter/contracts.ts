import type { Locale } from "../../i18n/locales";

export const newsletterConsentVersion = "2026-07-13";

export const newsletterSources = ["home", "article", "newsletter_page", "contact", "comment"] as const;

export type NewsletterSource = typeof newsletterSources[number];

export interface NewsletterSubscriptionRecord
{
  readonly id: string;
  readonly email: string;
  readonly locale: Locale;
  readonly status: "pending" | "active" | "unsubscribed" | "suppressed";
  readonly provider_sync_status: "not_ready" | "pending" | "synced" | "failed";
  readonly provider_contact_id: string | null;
  readonly source: NewsletterSource;
  readonly source_path: string;
  readonly consent_version: string;
  readonly requested_at: number;
  readonly confirmation_sent_at: number | null;
  readonly confirmed_at: number | null;
  readonly updated_at: number;
}

export interface NewsletterSubscriptionRequest
{
  readonly email: string;
  readonly locale: Locale;
  readonly source: NewsletterSource;
  readonly sourcePath: string;
  readonly consentVersion: string;
  readonly submissionFingerprint: string;
}

export type NewsletterRequestStatus =
  | "confirmation_sent"
  | "already_pending"
  | "already_subscribed"
  | "suppressed"
  | "rate_limited";

export interface NewsletterRequestResult
{
  readonly status: NewsletterRequestStatus;
}

export interface NewsletterConfirmationResult
{
  readonly status: "confirmed" | "already_confirmed" | "expired" | "invalid";
  readonly subscriptionId: string | null;
}
