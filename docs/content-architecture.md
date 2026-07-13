# Content and localization architecture

## Locale contract

The canonical locale identifiers are `en`, `pt-BR`, `es`, `fr`, and `zh-Hans`.
Their URL segments are defined once in `src/i18n/locales.ts`; route names are
defined in `src/i18n/routes.ts`. Code must use these modules instead of building
localized paths or accepting locale strings ad hoc.

The URL is the authority for the active locale. An explicit language selection
is stored in `digows.preferredLocale`, but it must never silently redirect an
explicit localized URL. Navigation rendered by the site stays in the active
locale; the language switcher links to the equivalent localized resource.

## Where text belongs

- `messages/<locale>.json`: reusable interface labels, validation feedback,
  accessibility labels, and interaction copy. Paraglide compiles these files to
  typed message functions in the ignored `src/paraglide` directory.
- `src/content/pages/<page>/content.ts`: localized editorial or narrative page
  content whose structure is specific to a page.
- `src/content/experiences/<experience>/content.ts`: localized copy and data for
  a custom interactive experience.
- `src/content/posts/<content-id>/<locale>.md`: one Markdown document per post
  locale. The directory is the immutable content group; `translationKey` is the
  stable content ID shared by translations. Each file owns its localized slug.
- `src/content/prompts`: provider-independent AI prompt builders.

English and Brazilian Portuguese remain available for the historical archive.
Posts published from 2025 onward require all five canonical locales. The build
audit enforces this rule.

## Asset convention

Imported WordPress media under `public/images/imported` is immutable legacy
media. Existing About media under `public/media/about` is shared by every locale.

New post media follows this layout:

```text
public/media/posts/<content-id>/shared/<asset>
public/media/posts/<content-id>/<locale-segment>/<asset>
```

Use `shared` when the same bytes and meaning apply in every language. Use the
locale directory when the image, audio, video, diagram labels, poster, caption,
or crop is language-specific. New page media uses the equivalent layout under
`public/media/pages/<page>/`.

Alternative text and captions are content, not asset metadata: keep them in the
localized Markdown or typed page content.

## SEO and compatibility

Every canonical page is locale-prefixed and emits its own canonical URL,
reciprocal `hreflang` links for available translations, and an `x-default`
pointing to the source version. `public/_redirects` is the finite source of truth
for previously indexed, unprefixed URLs. New routes must never be added to the old
URL shape.

Imported content declares one shared `legacyUrl` across all translations, and the
build audit requires the corresponding English and Brazilian Portuguese redirects.
Genuinely new content omits `legacyUrl` from every translation and must not add an
unprefixed redirect. Its first public URL is the locale-prefixed canonical URL.

The Worker combines legacy-path migration and `www`/`blog` hostname
canonicalization into one `308` response while preserving the query string.

## Social data

URLs are addresses, not identities. Comments and reactions use the shared
`translationKey` as `contentId`. General comments are shared across translations;
paragraph-anchored comments carry a locale because paragraph identity belongs to
one translated document. D1 maps each `(contentId, locale)` pair to its current
canonical path for moderation and notifications.
