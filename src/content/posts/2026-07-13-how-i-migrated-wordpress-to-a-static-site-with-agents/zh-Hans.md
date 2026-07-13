---
title: "我如何借助 AI 智能体，把 WordPress 迁到静态站点"
description: "我把文章交给 Git 和 Astro，把评论等动态功能留在 Cloudflare，并用智能体协助写作、审校和多语言发布。这是具体做法、费用限制和不适合这样做的情况。"
permalink: "2026/07/13/wordpress-static-site-ai-agents"
publishedAt: "2026-07-13T17:00:01.000Z"
reviewedAt: "2026-07-13"
language: "zh-Hans"
categories:
  - "软件工程"
  - "Web 架构"
tags:
  - "WordPress"
  - "静态站点"
  - "AI 智能体"
  - "Cloudflare"
  - "Astro"
draft: false
translationKey: "2026/07/13/how-i-migrated-wordpress-to-a-static-site-with-agents"
translationOf: "2026/07/13/how-i-migrated-wordpress-to-a-static-site-with-agents"
legacy: false
editorial:
  quickSummary: "我把 WordPress 原来承担的工作逐项拆开：Git 保存文章和版本，智能体协助编辑，Astro 生成静态页面，Cloudflare 只处理少量动态功能。人仍然负责提供材料、审稿、批准发布和处理故障。"
  keyTakeaways:
    - "让我想离开 WordPress 的主要原因，是质量不稳定的第三方插件会增加更新、安全和整站故障风险，而不是 WordPress 核心天生不安全。"
    - "智能体可以选取证据、独立写作和检查内容，但最终审稿和发布决定仍由人完成。"
    - "文章适合生成静态页面；评论、联系表单等确实需要保存数据的功能，才交给 Worker API 和 D1。"
    - "免费套餐都有额度和失败条件。这个站点不需要 Queues，所以我没有为了免费额度而保留它。"
  strongestCounterargument: "WordPress 已经提供好用的写作后台、媒体管理、用户权限、插件和日常维护工具。换成 Git、CI、智能体和云服务，不会让复杂度消失，只会让技术负责人自己接手这些工作。对不想维护基础设施的人，WordPress 往往更合适。"
  appliesWhen:
    - "有人愿意长期维护 Git、代码、CI 和云服务"
    - "站点主要发布长期文章，动态功能只有少量明确的 API"
    - "团队愿意保留人工审稿、明确批准和故障恢复流程"
  doesNotApplyWhen:
    - "编辑团队需要可视化后台、细致的用户权限和成熟的媒体管理"
    - "站点依赖大量现成插件、电商或复杂的实时业务功能"
    - "没有人愿意负责依赖升级、安全和线上故障"
  discussionPrompt:
    key: "wordpress-static-agents.v2"
    text: "如果列出你的 CMS 现在做的每一项工作，哪些适合交给代码和智能体，哪些最好继续留在成熟产品里？"
  glossary:
    - term: "Git 编辑流程"
      definition: "文章、配置和修改记录都放在 Git 仓库里，并通过评审和自动检查完成发布。"
    - term: "静态生成"
      definition: "先在构建时生成 HTML 和资源，读者访问时不需要应用程序临时生成页面。"
    - term: "D1"
      definition: "Cloudflare 托管的 SQL 数据库；这个站点用它保存评论等少量动态数据。"
    - term: "免费套餐"
      definition: "供应商在规定额度和条件内提供的免费用量，不代表资源无限或永远免费。"
    - term: "源码公开"
      definition: "任何人都可以查看代码，但没有许可证时，并不自动获得复制、再发布或修改后分发代码的权利。"
  relatedTranslationKeys: []
  copyReviewed: true
---

我早就想离开 WordPress，但不是因为 WordPress 核心天生不安全。它保存了我的旧文章，也稳定运行了很多年。

真正让我头疼的是第三方插件。插件和站点运行在同一个 PHP 应用里。一个质量不好的插件，就可能带来安全问题、更新冲突，甚至让整个站点无法工作。WordPress 的[插件管理文档](https://wordpress.org/documentation/article/manage-plugins/)也提醒用户：插件质量不同，要持续更新，更新前最好备份，因为更新可能出问题。[安全加固手册](https://developer.wordpress.org/advanced-administration/security/hardening/)则说明，安全需要长期维护。

这次迁移没有把问题全部消灭。我只是把 WordPress 原来做的工作列出来，再决定以后由谁来做：文章放在哪里，页面怎么生成，评论存在哪里，旧链接怎么保留，谁审稿，谁批准发布，出错后怎么恢复。

## WordPress 原来做的事，现在谁来做

文章现在是 Git 仓库里的 Markdown 文件，Astro 在构建时把它们生成静态页面。评论、表态和联系表单需要保存数据，所以继续由 Worker API 和 D1 处理。

这些安排都写进了公开仓库的[生产架构](https://github.com/digows/digows.com/blob/8cbb2ee946a51c313488c35b6652713c413d7f08/docs/ARCHITECTURE.md)、[内容架构](https://github.com/digows/digows.com/blob/8cbb2ee946a51c313488c35b6652713c413d7f08/docs/content-architecture.md)和[内容 schema](https://github.com/digows/digows.com/blob/8cbb2ee946a51c313488c35b6652713c413d7f08/src/content.config.ts)里。Astro 的文档也说明，纯静态站点不需要 Cloudflare 适配器。生成后的文件可以直接发布，只有动态请求才需要 Worker。具体做法可以参考 [Astro 的 Cloudflare 集成说明](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)和[部署指南](https://docs.astro.build/en/guides/deploy/cloudflare/)。

| WordPress 原来做的事 | 现在由谁来做 | 我仍然要负责什么 |
| --- | --- | --- |
| 保存文章和修改记录 | Git 仓库、Markdown、内容 schema | 处理合并冲突、升级依赖、检查内容 |
| 管理多语言文章 | 每种语言独立写作，共用一个内容 ID | 检查语言质量、链接和元数据 |
| 生成和发送页面 | Astro、Workers Static Assets | 构建、部署、缓存和回滚 |
| 保存评论、表态和联系消息 | Worker API、D1、Turnstile | 数据迁移、防滥用、密钥和告警 |
| 保留真正存在过的旧链接 | 明确列出的 `308` 重定向 | 维护旧 URL 清单；新文章不创建旧式 URL |
| 决定何时发布 | 人工批准和自动检查 | 看懂变更，并对发布结果负责 |

所以，这不是按一下按钮就“用静态站点替代 WordPress”。我只是换了一套工具，也接手了更多技术工作。[Cloudflare 配置](https://github.com/digows/digows.com/blob/8cbb2ee946a51c313488c35b6652713c413d7f08/wrangler.jsonc)列出了静态资源、Worker、D1 和邮件绑定；[数据库迁移记录](https://github.com/digows/digows.com/tree/8cbb2ee946a51c313488c35b6652713c413d7f08/migrations)显示了动态数据如何变化。页面变成静态文件后，风险少了一部分，但 API、依赖、密钥和数据库仍然需要维护。

```text
我提供材料和要求
        ↓
智能体选证据、分别写作、专项检查
        ↓
我审稿并明确批准，程序再做固定检查
        ↓
Git → Astro → 静态页面
              ↘ Worker API → D1 / 防滥用 / 邮件服务
```

## 智能体帮我做编辑工作，但不能自己发布

我做了一个编辑智能体，并给它安排了不同的专门智能体。它们根据我提供的材料选取证据、整理事实、分别写作和检查内容。最后仍由我审稿，并明确决定是否发布。

这种工作方式已经有产品支持。Codex 可以使用[专门智能体并行处理任务](https://learn.chatgpt.com/docs/agent-configuration/subagents)。Claude Code 也支持有独立上下文、工具和权限的[自定义 subagent](https://code.claude.com/docs/en/sub-agents)。Google Antigravity 的[产品说明](https://antigravity.google/docs/overview)和[subagent 文档](https://antigravity.google/docs/subagents)也介绍了它的智能体编排方式。这些产品都能支持多智能体工作，但它们的能力、质量、成本和成熟度并不相同。

每种语言只共享事实和证据，不共享成稿。这个站点最初只有葡萄牙语和英语，后来扩展到英语、巴西葡萄牙语、西班牙语、法语和简体中文。当前语言可以在[语言配置](https://github.com/digows/digows.com/blob/8cbb2ee946a51c313488c35b6652713c413d7f08/src/i18n/locales.ts)和[多语言内容规则](https://github.com/digows/digows.com/blob/8cbb2ee946a51c313488c35b6652713c413d7f08/docs/content-architecture.md)中核对。

我一直想用法语和中文发布内容。智能体让这件事容易了很多，但我不能因此声称文章已经达到母语水平。中文文章需要按中文习惯重新写，法语也需要独立成文。工具可以提高速度，语言质量仍然需要专门审校。

## 静态页面之外，只保留必要的动态功能

Cloudflare 很适合这种小型站点，因为我可以只启用真正需要的服务。

直接访问 Workers Static Assets 的静态文件，按官方说明免费且不限请求量；如果请求先调用 Worker，就要按 Workers 的规则计算用量。`run_worker_first` 也会改变这个结果。[Static Assets 的计费和限制](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/)写清楚了两种请求的区别。

D1 用来保存评论、联系消息和表态。它可以在免费套餐中使用，但不是无限使用。[D1 定价文档](https://developers.cloudflare.com/d1/platform/pricing/)规定了每天可读取和写入的行数，以及存储上限。达到免费额度后，数据库操作会失败，直到额度重置。对小站可能够用，但必须根据真实流量和查询方式来判断。

Queues 更能说明“免费不等于应该使用”。2026 年 7 月 13 日的 [Queues 定价页](https://developers.cloudflare.com/queues/platform/pricing/)显示，免费套餐每天提供 10,000 次操作，消息保留 24 小时。写入、读取、删除和重试都会分别计数。我曾考虑用 Queue 处理 newsletter，后来删掉了。当前流量不需要这套异步流程，保留它只会多出监控、重试和故障恢复工作。

邮件功能也要分开看。Email Routing 处理收到的邮件：它把某个收件地址转发到已验证的目标地址，或者交给 Worker。[Email Routing 规则](https://developers.cloudflare.com/email-service/configuration/email-routing-addresses/)说明了这种入站转发。它不代表站点可以向任意地址发送事务邮件或 newsletter。[Email Service 定价](https://developers.cloudflare.com/email-service/platform/pricing/)对发送到已验证地址和任意地址规定了不同条件。

## 免费额度要看数据，不能只看宣传页

我不能保证这个站点会永远免费，也没有足够数据给出准确的月成本。静态资源、Worker 调用、D1 查询、Queue 操作和邮件发送各有自己的额度和计费方式。本文提到的价格和限额，来自 2026 年 7 月 13 日查看的官方文档。上线后还要继续检查用量、账单、错误率和额度告警。

即使云服务账单是零，维护也要花时间。Git、CI、依赖升级、D1 数据迁移、防垃圾请求、备份和故障恢复都需要人来做。如果大多数访问只读取静态文件，动态 API 的使用量又很小，这套方案有机会留在免费套餐或较低成本内。是否真的如此，只能测量，不能承诺。

## 很多人继续使用 WordPress，完全合理

WordPress 已经把写作后台、用户管理、媒体管理、插件和更新工具放在一个成熟产品里。它的插件生态带来兼容性和更新工作，也提供了大量现成功能。

如果不想维护 Git、CI、Worker、数据库迁移和云服务 API，WordPress 往往更合适。电商、复杂会员系统、大量非技术编辑或高度依赖插件的站点，也不适合轻易改成自己维护的系统。即使你是工程师，也要先确认：大部分内容可以静态生成，动态功能能缩小到几个 API，而且有人愿意长期维护它。

这次迁移不能证明 WordPress 已经过时，也不能证明智能体可以完全替代 CMS。它只说明：如果技术负责人愿意管理代码、审稿、部署和故障恢复，智能体加静态生成可以完成个人出版流程中的很多工作。

## 代码公开可看，欢迎指出一个具体问题

实现代码在公开的 [`digows/digows.com` 仓库](https://github.com/digows/digows.com/tree/8cbb2ee946a51c313488c35b6652713c413d7f08)，任何人都可以检查架构和实现。不过，仓库没有通用的复用、再发布或衍生创作许可，所以准确的说法是“源码公开可审阅”，不是“开源项目”。[README 的许可说明](https://github.com/digows/digows.com/blob/8cbb2ee946a51c313488c35b6652713c413d7f08/README.md)写明了这一点。

如果你发现一个具体问题，可以先按[贡献指南](https://github.com/digows/digows.com/blob/8cbb2ee946a51c313488c35b6652713c413d7f08/CONTRIBUTING.md)开 issue，说明问题和范围，再提交一个小而明确的改进。安全漏洞不要放进公开 issue 或 pull request，请按[安全策略](https://github.com/digows/digows.com/blob/8cbb2ee946a51c313488c35b6652713c413d7f08/SECURITY.md)私下报告。

如果你想帮忙，不妨从一个问题开始：这里还有哪项工作没人明确负责，或者出了问题却没有恢复办法？找到它，就已经是一次有价值的贡献。
