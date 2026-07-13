---
title: "How I migrated WordPress to a static site with agents"
seoTitle: "How I migrated WordPress to a static site with AI agents"
description: "How I replaced WordPress with static pages, a simple agent-assisted editorial workflow, and a few focused Cloudflare services."
permalink: "2026/07/13/how-i-migrated-wordpress-to-a-static-site-with-agents"
publishedAt: "2026-07-13T17:00:01.000Z"
reviewedAt: "2026-07-13"
language: "en"
categories:
  - "Software architecture"
  - "AI agents"
tags:
  - "WordPress"
  - "Astro"
  - "Cloudflare"
  - "D1"
  - "static sites"
  - "multilingual publishing"
  - "coding agents"
draft: false
translationKey: "2026/07/13/how-i-migrated-wordpress-to-a-static-site-with-agents"
legacy: false
editorial:
  quickSummary: "I moved my site from WordPress to a system built around static pages, a Git repository, specialist agents, and a few Cloudflare services for the parts that still need a backend."
  keyTakeaways:
    - "I left because third-party plugins could break the whole site or increase its attack surface, not because WordPress core is inherently insecure."
    - "The site started in Portuguese and English and now supports five independently written language versions based on the same factual brief."
    - "Cloudflare Static Assets, D1, Queues, and Email Routing solve different problems and have different free-plan limits."
    - "Agents make this custom publishing workflow practical, but I still choose the sources, review the work, and approve each release."
  strongestCounterargument: "WordPress already gives publishers an editor, media tools, user roles, updates, plugins, and a large support community. My system still needs all that work in another form, and I am now responsible for the code, agents, services, and deployments."
  appliesWhen:
    - "A technical owner wants direct control over the content, code, and deployment."
    - "Most pages can be static and the few dynamic features can stay small and separate."
    - "Someone can maintain the tests, database migrations, secrets, monitoring, and provider limits."
  doesNotApplyWhen:
    - "Editors need a mature visual interface and do not want to work through a repository."
    - "The publication needs complex editorial roles or depends on many WordPress plugins."
    - "No one wants to own custom code, failed builds, abuse controls, and deployments."
  discussionPrompt:
    key: "wordpress-static-agents.v2"
    text: "Which job would you move out of your CMS first, and which one would you leave where it is?"
  glossary:
    - term: "Repository-based publishing"
      definition: "A publishing workflow where versioned files, reviews, and automated checks live in a Git repository."
    - term: "Static generation"
      definition: "Building pages as files before readers request them, instead of creating each page on demand."
    - term: "D1"
      definition: "Cloudflare's managed SQL database, which this site uses for selected dynamic data rather than article content."
    - term: "Email Routing"
      definition: "Cloudflare rules that forward incoming email to verified destinations or Workers; this is separate from sending email to arbitrary recipients."
  relatedTranslationKeys:
    - "2026/05/20/the-high-individual-contributor-in-the-age-of-ai-agents"
  copyReviewed: true
---

I wanted to leave WordPress for years. It kept surviving.

That resilience deserves respect. WordPress is familiar, widely supported, and capable of keeping an old site alive for a very long time. My problem was not that WordPress core is inherently insecure. It was what could happen when I added third-party plugins to the same application. One small, poorly written plugin could break the whole site or increase its attack surface.

WordPress's own [plugin documentation](https://wordpress.org/documentation/article/manage-plugins/) says plugin quality varies. It also recommends making a current backup before an update because problems can occur. The [WordPress hardening guide](https://developer.wordpress.org/advanced-administration/security/hardening/) treats security as ongoing work. That does not make every plugin dangerous. It simply explains why I no longer wanted my articles tied to every plugin the site needed.

I replaced WordPress with static pages, a Git repository, a few Cloudflare services, and an editorial workflow assisted by agents. The result works well for me. It is not a recipe for everyone.

## I replaced the jobs, not just the pages

Moving articles into Markdown was the easy part. WordPress was also managing URLs, metadata, publishing, plugins, and dynamic data.

So I made a list of those jobs and decided where each one should live next:

| Job | Where it lives now | What I still manage |
| --- | --- | --- |
| Articles and metadata | Versioned files and Astro content collections | Reviews, schema changes, and repository health |
| Editorial work | My inputs, a factual brief, and specialist agents | Sources, corrections, and final approval |
| Language versions | Separate articles linked by one shared content ID | Consistent facts and language review |
| Page delivery | Prebuilt files served as Cloudflare Static Assets | Builds, dependencies, caching, and deployment checks |
| Dynamic data | Small Worker APIs backed by D1 | Database migrations, limits, abuse controls, and recovery |
| Old URLs | Permanent redirects to the current localized URLs | Redirect and link audits |
| Incoming email aliases | Email Routing rules | Verified destinations and routing rules |

No single tool replaced WordPress. Several smaller parts took over its jobs.

The rules are visible in the public repository. The [content architecture](https://github.com/digows/digows.com/blob/8cbb2ee946a51c313488c35b6652713c413d7f08/docs/content-architecture.md) explains how language versions and URLs work. The [content schema](https://github.com/digows/digows.com/blob/8cbb2ee946a51c313488c35b6652713c413d7f08/src/content.config.ts) checks article metadata. The [locale definitions](https://github.com/digows/digows.com/blob/8cbb2ee946a51c313488c35b6652713c413d7f08/src/i18n/locales.ts) keep language codes and URL segments consistent.

## My agents help; they do not publish alone

I built an editorial agent that gives specific tasks to specialist agents. I provide the topic, personal experience, constraints, and intended argument. The workflow creates a factual brief, keeps claims tied to evidence, asks language specialists to write, and runs reviews and automatic checks.

I still decide what is true, correct mistakes, and approve the release. The agents do useful work, but they do not get the final word.

This kind of workflow is already supported by several coding tools. [Codex supports specialized subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents) with their own instructions and model settings. [Claude Code supports custom subagents](https://code.claude.com/docs/en/sub-agents) with separate context, tools, permissions, and models. Google documents agent orchestration in its [Antigravity overview](https://antigravity.google/docs/overview) and [subagent guide](https://antigravity.google/docs/subagents).

These products are not equal in quality, cost, maturity, or behavior. But they show that a developer can now build a personal publishing workflow around normal repository files and checks. The hard parts still matter: reliable sources, clear instructions, good reviews, and an explicit release decision.

## The site grew from two languages to five

The migration started with Portuguese and English. The site later grew to five languages: `pt-BR`, `en`, `es`, `fr`, and `zh-Hans`.

I had wanted to write in French and Chinese for a long time. Agents made that goal much easier to pursue. They did not magically prove the language quality.

Each language specialist therefore starts from the same factual brief and writes a native version for that audience. English is not the master text that every other language must copy sentence by sentence. The articles are then reviewed against the same facts. This gives me a much better process, while human language review remains important.

## Static pages, with a small backend where needed

Astro builds the articles as files before anyone requests them. The [Astro Cloudflare guide](https://docs.astro.build/en/guides/integrations-guide/cloudflare/) explains that a fully static site does not need the Cloudflare adapter. Generated files can serve the pages while a Worker handles the few features that need code at request time. Astro's [deployment guide](https://docs.astro.build/en/guides/deploy/cloudflare/) covers both static assets and backend APIs on Cloudflare Workers.

The flow is simple:

```text
my input -> factual brief -> specialist writers -> review -> approval
                                                               |
                                                               v
Git repository -> Astro build -> static articles ----------> readers
                              -> small Worker APIs -> D1 data
                                                   -> email rules
```

Cloudflare is a strong fit because I can add small services without turning every page request into an application request. The details matter, especially when calling the hosting “free.”

The current [Static Assets billing documentation](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/) says direct requests for static assets are free and unlimited. Worker requests follow Workers billing. A setting such as `run_worker_first` can therefore change which requests count as Worker use.

[D1's pricing page](https://developers.cloudflare.com/d1/platform/pricing/) lists daily limits for rows read and written, plus storage limits, on the Workers Free plan. If the site reaches a free daily limit, database operations fail until that limit resets. D1 gives this site useful persistent data. It is not an unlimited free database.

Email is another place where similar names hide different services. [Email Routing](https://developers.cloudflare.com/email-service/configuration/email-routing-addresses/) forwards incoming addresses to a verified destination or a Worker. That is very useful for email aliases on my domain. It does not provide unlimited free newsletter or transactional email. Cloudflare's [Email Service pricing](https://developers.cloudflare.com/email-service/platform/pricing/) says sending to arbitrary recipients requires Workers Paid, while sending to verified destination addresses remains a narrower free case.

A small publication can fit within these free allowances. I cannot promise that every part will stay free forever or that the same limits work for every site. Money is also not the only cost. Someone has to maintain the system.

## Why I removed Queues

I considered Cloudflare Queues for newsletter processing. The service was available, and it looked like a neat architecture. My site did not have enough work to justify another component, another failure path, and another retry policy.

The current [Queues pricing page](https://developers.cloudflare.com/queues/platform/pricing/) includes 10,000 operations per day and 24-hour retention on Workers Free. Reads, writes, deletes, and retries count separately. Those limits were not the reason I dropped it. I dropped it because the queue solved a scale problem I did not have.

Cloudflare's range of services is useful. Choosing fewer of them made my system better.

## WordPress still wins for many publishers

WordPress already includes a visual editor, media tools, user roles, upgrades, plugins, and a huge support community. My migration did not remove those needs. It moved the work into custom code, CI, agent instructions, provider APIs, dependency updates, D1 migrations, secrets, monitoring, and recovery.

Static pages reduce the code running when someone reads an article, but they do not make the whole system secure. APIs still need validation and abuse controls. Dependencies still change. Credentials still need protection. Deployments can still fail.

This trade makes sense for an engineer who wants control and is willing to own the details. It makes much less sense for a publisher who needs a visual editing interface, complex roles, many plugins, or someone else to operate the infrastructure. WordPress survived for good reasons.

## The code is public. Please challenge it.

The implementation is available through the pinned [repository README](https://github.com/digows/digows.com/blob/8cbb2ee946a51c313488c35b6652713c413d7f08/README.md). You can inspect the [production architecture](https://github.com/digows/digows.com/blob/8cbb2ee946a51c313488c35b6652713c413d7f08/docs/ARCHITECTURE.md), [Cloudflare configuration](https://github.com/digows/digows.com/blob/8cbb2ee946a51c313488c35b6652713c413d7f08/wrangler.jsonc), and [D1 migrations](https://github.com/digows/digows.com/tree/8cbb2ee946a51c313488c35b6652713c413d7f08/migrations).

The source is public for review, but the repository does not grant a general open-source license for reuse, redistribution, or derivative work. If you find a concrete problem, check the [contribution guide](https://github.com/digows/digows.com/blob/8cbb2ee946a51c313488c35b6652713c413d7f08/CONTRIBUTING.md), open an issue before making a broad change, or propose one focused improvement. Report suspected vulnerabilities through the private process in the [security policy](https://github.com/digows/digows.com/blob/8cbb2ee946a51c313488c35b6652713c413d7f08/SECURITY.md), not in a public issue.

Agents did not replace my judgment or make operations disappear. They made a custom publishing system practical enough for me to run. That is the real change: I can now own a CMS shaped around my site, while keeping its limits visible.
