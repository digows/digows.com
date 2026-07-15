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

### Editorial agent: article images

Every image inside a post body is automatically enhanced by
`src/components/ArticleImageLightbox.astro`. The editorial agent invokes this
behavior through normal Markdown or HTML image markup; posts must remain plain
Markdown and must not import UI components or duplicate lightbox scripts.

For each article image, the editorial agent must:

- use a site-relative asset path under the convention above;
- write localized alternative text that describes the information conveyed by
  the image, not its filename or a generic label;
- add a localized italic caption immediately after the image when the context or
  provenance is not already clear from the surrounding paragraph;
- preserve intrinsic `width` and `height` when using HTML image markup;
- use `loading="lazy" decoding="async"` below the initial viewport, reserving
  `loading="eager" fetchpriority="high"` for a genuine lead image;
- leave the image unlinked so the global lightbox can enhance it.

Use `data-image-lightbox="off"` only when the image is intentionally decorative
or another explicit interaction owns it. A linked image keeps its link behavior
and is also excluded automatically. The lightbox supplies the localized open,
close, caption, and original-file experience; editorial content must not repeat
those controls.

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
