---
title: "Nine Women Can't Make One Baby: Why Smaller Software Teams Deliver More"
description: "Why adding developers can delay complex software projects—and how small, focused teams reduce coordination costs and preserve ownership."
permalink: "2025/08/27/nine-women-cant-make-one-baby-why-smaller-software-teams-deliver-more"
publishedAt: "2025-08-27T20:23:11.000Z"
updatedAt: "2025-08-27T20:51:06.000Z"
reviewedAt: "2026-07-11"
language: "en"
categories: ["Software Engineering"]
tags: ["agile development","business","CTO's Life","productivity"]
draft: false
wordpressId: 1897
translationKey: "2025/08/27/nine-women-cant-make-one-baby-why-smaller-software-teams-deliver-more"
legacyUrl: "https://digows.com/2025/08/27/nine-women-cant-make-one-baby-why-smaller-software-teams-deliver-more/"
legacy: false
featuredImage: "/images/imported/2025/08/nine-women-one-month-95b1cdc84d.webp"
editorial:
  quickSummary: "Adding people increases total capacity, but it can slow one complex delivery because onboarding, communication, and integration grow faster than parallel work. Small autonomous teams preserve context and ownership; the right size depends on how divisible the work really is."
  keyTakeaways:
    - "Team size is a coordination design decision, not a direct proxy for delivery speed."
    - "Late staffing is especially expensive because experienced engineers must stop to transfer context."
    - "A trio can be effective when it owns a coherent outcome and has the skills to deliver it end to end."
  strongestCounterargument: "Small teams are not automatically faster: a broad product, on-call coverage, specialist knowledge, or truly independent workstreams can require more people. The relevant unit is an autonomous stream of work, not an arbitrary headcount ceiling."
  appliesWhen: ["One outcome requires shared architectural context", "Coordination and handoffs are already slowing delivery", "The team can own product, implementation, and quality"]
  doesNotApplyWhen: ["Work can be split into independent, well-bounded streams", "Operational coverage or regulation requires distinct roles", "The current team lacks essential domain expertise"]
  discussionPrompt:
    key: "team-size-bottleneck.v1"
    text: "Where is your current delivery actually constrained: engineering capacity, coordination, or decisions outside the team?"
  glossary:
    - { term: "Brooks's law", definition: "The observation that adding people to a late software project can make it later." }
    - { term: "Communication paths", definition: "The possible person-to-person connections a group must keep aligned." }
    - { term: "Autonomous team", definition: "A team able to deliver an outcome with minimal external handoffs." }
  relatedTranslationKeys: ["2025/09/02/the-ifless-principle-designing-apis-without-hidden-decisions", "2026/05/20/the-high-individual-contributor-in-the-age-of-ai-agents"]
  copyReviewed: true
---
In software engineering, scaling a project doesn’t work the same way as scaling manufacturing. While hiring more developers can increase overall capacity, it doesn’t proportionally accelerate the delivery of a single feature or project. This insight was famously captured by **Fred Brooks** in _The Mythical Man‑Month_, where he observed that **“adding manpower to a late software project makes it later”** . Brooks illustrated the problem with an analogy: one woman can produce a baby in nine months, but nine women working together cannot produce a baby in one month . This law isn’t about biology — it’s about the inherent constraints of complex work.

### Why throwing people at a project often backfires

Brooks’s law identifies three fundamental reasons why adding more people to a software project can actually slow it down:

1.  **Ramp‑up time.** New team members need time to learn the codebase and context. Experienced developers must stop what they’re doing to train newcomers, temporarily reducing productivity . In some cases, new hires even introduce bugs while still ramping up, pushing the project further from completion .
2.  **Communication overhead.** Coordination paths grow exponentially as the team grows. Each person must keep others informed, creating more meetings, emails and stand‑ups . The Nuclino blog visualizes this: a three‑person team has three communication links, but adding three more members increases the links to fifteen .
3.  **Limited divisibility of tasks.** Not all work can be partitioned into smaller pieces. Some tasks demand sequential design and integration. Brooks points out that many software tasks are inherently indivisible . The two‑pizza‑team article expands this: you can’t simply split a complex design problem into tiny independent tickets and expect the result to emerge organically .

These forces mean that there is an upper limit to the productivity gains you can achieve by simply adding developers. At some point, coordination costs and integration complexity outweigh the benefit of having more hands on deck.

### The case for small, focused teams

For decades, agile practitioners have advocated small, cross‑functional teams. Jeff Bezos famously framed Amazon’s **two‑pizza team rule**: if a team cannot be fed with two pizzas, it is too big . The rationale is that small teams minimize communication overhead, allow rapid decision‑making, and foster accountability. Harvard psychologist **J. Richard Hackman** also warned that larger groups suffer from process problems and dysfunctional dynamics.

Research backs this up. **Mike Cohn** cites a study in which teams were asked whether their group was too large to achieve the best result. Nearly everyone agreed that teams become inefficient above five members . Analysing over 1,000 software projects, **Kate Armel** found that projects delivered by teams of four or fewer developers were far more cost‑efficient and had fewer defects than those built by larger teams . The data suggests that **four to five** people is a sweet spot for most agile projects.

### My own “magic number”: three developers

After years of experimenting with different team compositions working as CTO at [eits.com.br](http://eits.com.br), I’ve discovered a pragmatic variation on this theme: **three developers** can deliver remarkable results during a two‑week sprint. With trios, communication paths are minimal (three links), the team can self‑organize without excessive coordination, and everyone has a clear sense of ownership. It’s easier to maintain shared context, perform peer reviews, and collaborate closely on design decisions. If you add more people, you inevitably introduce hand‑offs and waiting, and the time spent aligning increases faster than the productive time gained.

This isn’t just about efficiency — it’s about **creativity**. Complex problem‑solving often benefits from deep focus and uninterrupted thought. When more developers are involved, everyone gravitates toward smaller sub‑tasks, and the holistic view of the solution can get fragmented. A trio can tackle architecture, coding and testing collaboratively while still preserving big‑picture coherence.

### Constraints outside the team

Adding developers doesn’t just create internal coordination issues; it also assumes that there is enough parallelizable work to keep everyone busy. In practice, **business requirements, product design and stakeholder input** often limit throughput. If there aren’t enough well‑defined tasks, additional engineers either wait idle or start working on poorly defined work, increasing rework later. Similarly, **creativity and solution design** don’t scale linearly. Some problems require brainstorming and iterative design cycles that don’t benefit from extra hands.

### Mitigating the urge to scale up

How can leaders resist the instinct to “manpower their way” out of a schedule slip? Here are some strategies:

-   **Invest early.** Brooks noted that adding developers late in a project is particularly harmful . If you anticipate needing more people, bring them in early when ramp‑up costs are easier to absorb.
-   **Focus on talent, not headcount.** Adding one highly experienced developer may yield more benefit than hiring several junior engineers. Good programmers require less ramp‑up and introduce fewer defects .
-   **Prioritize architecture and requirements.** Many delays stem from unclear requirements or architectural flaws. Spend time up front clarifying what needs to be built and how pieces will fit together. This reduces integration challenges later.
-   **Keep teams autonomous.** When multiple small teams work in parallel, ensure their interfaces are well-defined to minimize cross-team dependencies. Jeff Bezos’ decentralization mantra and the two‑pizza rule were born from this philosophy.

### Conclusion

The baby metaphor endures because it cuts to the core of software project dynamics: you can’t compress all tasks simply by adding more people. There is a natural limit to how much work can be parallelized; beyond that, communication overhead, ramp‑up time and cognitive load drag the project down. Research suggests that small teams — typically **four to five** people — are optimal , and my own experience shows that **three developers** often deliver the best trade‑off between speed, quality and creativity.

Before you attempt to “scale up” your team to meet a deadline, ask whether the extra hands will actually move the delivery forward or whether they’ll simply add more complexity. Sometimes the most effective strategy is to empower a small, focused team, give them clear goals, and trust them to deliver.
