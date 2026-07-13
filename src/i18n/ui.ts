import { m } from "../paraglide/messages.js";
import type { Locale } from "./locales";

export function getGlobalUiCopy(locale: Locale)
{
  const options = { locale } as const;

  return {
    accessibility: {
      skipToContent: m.accessibility_skip_to_content({}, options),
    },
    footer: {
      siteLinks: m.footer_site_links({}, options),
      source: m.footer_source({}, options),
    },
    language: {
      current: m.language_current({}, options),
    },
    navigation: {
      about: m.navigation_about({}, options),
      archive: m.navigation_archive({}, options),
      contact: m.navigation_contact({}, options),
      home: m.navigation_home({}, options),
      newsletter: m.navigation_newsletter({}, options),
      primary: m.navigation_primary({}, options),
    },
    site: {
      strapline: m.site_strapline({}, options),
    },
    theme: {
      dark: m.theme_dark({}, options),
      label: m.theme_label({}, options),
      light: m.theme_light({}, options),
      system: m.theme_system({}, options),
    },
  } as const;
}

export function getContactUiCopy(locale: Locale)
{
  const options = { locale } as const;

  return {
    name: m.contact_name({}, options),
    email: m.contact_email({}, options),
    website: m.contact_website({}, options),
    message: m.contact_message({}, options),
    submit: m.contact_submit({}, options),
    loading: m.contact_loading({}, options),
    success: m.contact_success({}, options),
    error: m.contact_error({}, options),
    verification: m.contact_verification({}, options),
    verificationExpired: m.contact_verification_expired({}, options),
    rateLimited: m.contact_rate_limited({}, options),
    privacy: m.contact_privacy({}, options),
    newsletterOptIn: m.contact_newsletter_opt_in({}, options),
    newsletterConfirmationNote: m.newsletter_opt_in_confirmation_note({}, options),
    newsletterUnavailableNote: m.newsletter_opt_in_unavailable_note({}, options),
    invalid: {
      name: m.contact_invalid_name({}, options),
      email: m.contact_invalid_email({}, options),
      website: m.contact_invalid_website({}, options),
      message: m.contact_invalid_message({}, options),
      verification: m.contact_invalid_verification({}, options),
      fallback: m.contact_invalid_fallback({}, options),
    },
  } as const;
}

export function getPostCardUiCopy(locale: Locale)
{
  const options = { locale } as const;

  return {
    read: m.post_card_read({}, options),
    translations: m.post_card_translations({}, options),
  } as const;
}

export function getPostPageUiCopy(locale: Locale)
{
  const options = { locale } as const;

  return {
    languages: m.post_languages({}, options),
    historicalNote: m.post_historical_note({}, options),
    historicalNoteBody: m.post_historical_note_body({}, options),
  } as const;
}

export function getArticleUiCopy(locale: Locale, readingMinutes: number, contentKind: "article" | "profile")
{
  const options = { locale } as const;

  return {
    minutes: m.article_minutes({ minutes: readingMinutes }, options),
    focus: m.article_focus({}, options),
    listen: m.article_listen({}, options),
    bookmark: m.article_bookmark({}, options),
    share: m.article_share({}, options),
    copied: m.article_copied({}, options),
    linkCopied: m.article_link_copied({}, options),
    copy: m.article_copy({}, options),
    comment: m.article_comment({}, options),
    quote: m.article_quote({}, options),
    askAi: m.article_ask_ai({}, options),
    close: m.article_close({}, options),
    aiTitle: contentKind === "profile"
      ? m.article_ai_profile_title({}, options)
      : m.article_ai_article_title({}, options),
    aiNote: m.article_ai_note({}, options),
    download: m.article_download({}, options),
    wrap: m.article_wrap({}, options),
  } as const;
}

export function getArticleInsightsUiCopy(locale: Locale)
{
  const options = { locale } as const;

  return {
    heading: m.insights_heading({}, options),
    takeaways: m.insights_takeaways({}, options),
    counterpoint: m.insights_counterpoint({}, options),
    applies: m.insights_applies({}, options),
    notApplies: m.insights_not_applies({}, options),
    glossary: m.insights_glossary({}, options),
    related: m.insights_related({}, options),
  } as const;
}

export function getReactionsUiCopy(locale: Locale, subject: "article" | "profile")
{
  const options = { locale } as const;

  return {
    heading: subject === "profile"
      ? m.reactions_heading_profile({}, options)
      : m.reactions_heading_article({}, options),
    description: m.reactions_description({}, options),
    error: m.reactions_error({}, options),
    reactions: {
      apply: m.reactions_apply({}, options),
      perspective: m.reactions_perspective({}, options),
      disagree: m.reactions_disagree({}, options),
      follow_up: m.reactions_follow_up({}, options),
    },
  } as const;
}

export function getContextPanelUiCopy(locale: Locale, readingMinutes?: number)
{
  const options = { locale } as const;

  return {
    about: m.context_about({}, options),
    biography: m.context_biography({}, options),
    profile: m.context_profile({}, options),
    topics: m.context_topics({}, options),
    elsewhere: m.context_elsewhere({}, options),
    reading: {
      label: m.reading_label({}, options),
      progress: m.reading_progress({}, options),
      contents: m.reading_contents({}, options),
      minutes: m.reading_minutes({ minutes: readingMinutes ?? 0 }, options),
      focus: m.reading_focus({}, options),
      listen: m.reading_listen({}, options),
      bookmark: m.reading_bookmark({}, options),
      share: m.reading_share({}, options),
    },
  } as const;
}

export function getCommentsUiCopy(locale: Locale)
{
  const options = { locale } as const;

  return {
    heading: m.comments_heading({}, options),
    empty: m.comments_empty({}, options),
    reply: m.comments_reply({}, options),
    formHeading: m.comments_form_heading({}, options),
    moderation: m.comments_moderation({}, options),
    name: m.comments_name({}, options),
    newsletterEmail: m.comments_newsletter_email({}, options),
    newsletterOptIn: m.comments_newsletter_opt_in({}, options),
    newsletterConfirmationNote: m.newsletter_opt_in_confirmation_note({}, options),
    newsletterUnavailableNote: m.newsletter_opt_in_unavailable_note({}, options),
    website: m.comments_website({}, options),
    message: m.comments_message({}, options),
    submit: m.comments_submit({}, options),
    pending: m.comments_pending({}, options),
    error: m.comments_error({}, options),
    loading: m.comments_loading({}, options),
    loadingComments: m.comments_loading_comments({}, options),
    question: m.comments_question({}, options),
    anchored: m.comments_anchored({}, options),
    cancelAnchor: m.comments_cancel_anchor({}, options),
    cancelReply: m.comments_cancel_reply({}, options),
    unavailable: m.comments_unavailable({}, options),
    unavailableRetry: m.comments_unavailable_retry({}, options),
    verification: m.comments_verification({}, options),
    verificationExpired: m.comments_verification_expired({}, options),
  } as const;
}

export function getNewsletterUiCopy(locale: Locale)
{
  const options = { locale } as const;

  return {
    panelTitle: m.navigation_newsletter({}, options),
    cta: {
      kicker: m.newsletter_cta_kicker({}, options),
      title: m.newsletter_cta_title({}, options),
      description: m.newsletter_cta_description({}, options),
      action: m.newsletter_cta_action({}, options),
    },
    email: m.newsletter_email({}, options),
    submit: m.newsletter_submit({}, options),
    loading: m.newsletter_loading({}, options),
    checkEmail: m.newsletter_check_email({}, options),
    error: m.newsletter_error({}, options),
    invalidEmail: m.newsletter_invalid_email({}, options),
    rateLimited: m.newsletter_rate_limited({}, options),
    privacy: m.newsletter_privacy({}, options),
    verification: m.newsletter_verification({}, options),
    verificationExpired: m.newsletter_verification_expired({}, options),
    confirmation: {
      heading: m.newsletter_confirm_heading({}, options),
      description: m.newsletter_confirm_description({}, options),
      action: m.newsletter_confirm_action({}, options),
      loading: m.newsletter_confirm_loading({}, options),
      confirmed: m.newsletter_confirmed({}, options),
      alreadyConfirmed: m.newsletter_already_confirmed({}, options),
      expired: m.newsletter_expired({}, options),
      invalid: m.newsletter_invalid({}, options),
      error: m.newsletter_error({}, options),
    },
  } as const;
}
