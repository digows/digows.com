import type { Locale } from "../../i18n/locales";

export const newsletterConsentVersion = "2026-07-13-single-opt-in";

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
  readonly confirmed_at: number | null;
  readonly welcome_delivery_status: "not_ready" | "pending" | "sent" | "failed";
  readonly welcome_sent_at: number | null;
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
  | "subscribed"
  | "already_subscribed"
  | "suppressed"
  | "rate_limited";

export interface NewsletterRequestResult
{
  readonly status: NewsletterRequestStatus;
  readonly subscriptionId: string | null;
}
