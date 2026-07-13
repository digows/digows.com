# Contributing

Bug reports and focused improvements are welcome. Open an issue before substantial architectural or content changes so scope and trade-offs can be agreed first.

## Development

Use Node.js 22.13 or newer and pnpm 11.

```bash
pnpm install
cp .dev.vars.example .dev.vars
pnpm run d1:migrate:local
pnpm run build:local
pnpm exec wrangler dev
```

Before submitting a pull request, run:

```bash
pnpm run types:check
pnpm run check
pnpm run d1:migrate:local
pnpm run build
pnpm run audit
pnpm exec wrangler deploy --dry-run
```

Keep code, comments, documentation, commit messages, and pull request descriptions in English. Do not commit `.dev.vars`, credentials, personal data, database exports, generated `dist/` output, or local Cloudflare state.

Security issues follow [SECURITY.md](SECURITY.md) and must not be reported publicly.
