import type { Locale } from "../i18n/locales";

export type Environment = Env;

export interface CommentRecord
{
  readonly id: string;
  readonly content_id: string;
  readonly parent_id: string | null;
  readonly author_name: string;
  readonly author_url: string | null;
  readonly body_text: string;
  readonly language: Locale;
  readonly created_at: number;
  readonly anchor_locale: Locale | null;
  readonly anchor_id: string | null;
  readonly anchor_quote: string | null;
  readonly discussion_prompt_key: string | null;
}

export interface TurnstileVerification
{
  readonly success: boolean;
  readonly challenge_ts?: string;
  readonly hostname?: string;
  readonly action?: string;
  readonly cdata?: string;
  readonly "error-codes"?: readonly string[];
}
