# digows.com

Source code and published content for [digows.com](https://digows.com), a multilingual site about software engineering, architecture, distributed systems, cloud, and AI agents.

The site is generated with Astro and deployed to Cloudflare Workers. Articles are static; comments, reactions, and contact messages use a small Worker API backed by Cloudflare D1.

## Highlights

- English, Brazilian Portuguese, international Spanish, French, and Simplified Chinese editions.
- Per-language canonical URLs and reciprocal `hreflang` metadata.
- RSS, sitemap, structured data, social metadata, and optimized static output.
- System-aware light and dark themes.
- Moderated comments, article reactions, and a private contact form.
- Cloudflare Turnstile protection and email notifications.
- Reading progress, focus mode, text-to-speech, bookmarks, sharing, and paragraph-level interactions.

## Stack

- [Astro](https://astro.build/) for static generation.
- Markdown content collections for articles.
- Cloudflare Workers and Static Assets for production hosting and APIs.
- Cloudflare D1 for dynamic site data.
- Cloudflare Turnstile for abuse protection.
- GitHub Actions for validation.
- Cloudflare Workers Builds for production deployment.

See [Architecture](docs/ARCHITECTURE.md) for the public production topology, deployment flow, runtime boundaries, and security model.

## Repository layout

```text
src/
├── components/       UI and interactive article features
├── content/          Posts and typed page/experience content
├── i18n/             Locale, route, formatting, and UI message adapters
├── layouts/          Shared page layouts
├── pages/            Astro routes
├── styles/           Global and page-specific styles
└── worker/           Cloudflare Worker APIs
migrations/           D1 schema migrations
public/               Static public assets and response headers
scripts/              Build-time audits and maintenance tools
docs/                 Editorial and infrastructure documentation
```

## Requirements

- Node.js 22.13 or newer.
- pnpm 11.
- Wrangler 4.

## Local development

Install dependencies and create the local-only environment file:

```bash
pnpm install
cp .dev.vars.example .dev.vars
```

Initialize the local D1 database, build with Cloudflare's Turnstile test key, and start the Worker development server:

```bash
pnpm run d1:migrate:local
pnpm run build:local
pnpm exec wrangler dev
```

The generated site and Worker are served together at `http://localhost:8787`.

## Content model

Each translation group lives in one directory derived from its stable content ID:

```text
src/content/posts/2025-09-02-the-ifless-principle-designing-apis-without-hidden-decisions/
├── en.md
├── pt-BR.md
├── es.md
├── fr.md
└── zh-Hans.md
```

Every file shares a `translationKey`; translated editions reference the source through `translationOf` and own their localized slug. Canonical URLs use `/{locale}/{year}/{month}/{day}/{localized-slug}/`. The Worker redirects only the finite set of previously indexed, unprefixed English and Portuguese URLs.

Reusable interface labels live in Paraglide bundles under `messages/`; narrative page content remains typed and colocated under `src/content/pages/`. Read [Content and localization architecture](docs/content-architecture.md) for ownership, URL, preference, asset, SEO, and social-data conventions.

## Validation

Run the same checks used by CI:

```bash
pnpm run types:check
pnpm run check
pnpm run build
pnpm run audit
pnpm exec wrangler deploy --dry-run
```

The audit verifies locale coverage, canonical and `hreflang` metadata, stable social content IDs, paragraph anchors, editorial modules, exact legacy redirects, deterministic social images, and internal links in the generated site.

## Deployment

Every pull request and push to `main` is validated by GitHub Actions. A successful push to `main` also triggers Cloudflare Workers Builds, which repeats the production checks and deploys the `digows-com` Worker.

Manual deployment is available for recovery. The command applies backward-compatible D1 migrations before uploading the Worker; the previous Worker remains valid during the rolling transition.

```bash
pnpm run deploy
```

Do not commit `.dev.vars`, secrets, generated `dist/` output, or local data. Production secrets are managed by Wrangler and Cloudflare.

## Documentation

- [Architecture and deployment](docs/ARCHITECTURE.md)
- [Content and localization architecture](docs/content-architecture.md)

## Security

Do not report vulnerabilities in a public issue. Follow [SECURITY.md](SECURITY.md) to submit a private GitHub security advisory.

## License

This repository is public for transparency and review. No license is granted for reuse, redistribution, or derivative works unless a file explicitly states otherwise.
