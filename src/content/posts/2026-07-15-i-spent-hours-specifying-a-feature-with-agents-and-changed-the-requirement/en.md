---
title: "I spent hours specifying a feature with agents — and ended up changing the requirement"
seoTitle: "How agent interviews changed my software requirement"
description: "A practical way to use coding agents as specification interviewers, expose consequential unknowns, and change bad decisions before they become code."
permalink: "2026/07/15/i-spent-hours-specifying-a-feature-with-agents-and-changed-the-requirement"
publishedAt: "2026-07-15T16:00:00.000Z"
reviewedAt: "2026-07-14"
language: "en"
categories:
  - "Software engineering"
  - "AI agents"
tags:
  - "requirements engineering"
  - "coding agents"
  - "software architecture"
  - "spec-driven development"
  - "Plan mode"
  - "Agent Kavor"
draft: false
translationKey: "2026/07/15/i-spent-hours-specifying-a-feature-with-agents-and-changed-the-requirement"
legacy: false
featuredImage: "/media/posts/agent-specification-interview/shared/agent-kavor-thumbnail.webp"
editorial:
  quickSummary: "I used coding agents to interview me before implementation. The process expanded a supposedly simple feature, changed the stack and lifecycle decisions, and separated what was ready to build from what still needed real evidence."
  keyTakeaways:
    - "Ask the agent to interview you before it writes code, and give it explicit areas to cover."
    - "Answering in bullet batches makes contradictions, recommendations, and unresolved decisions easier to inspect."
    - "A useful specification separates implementable decisions from integration risks that still need contracts, tests, or spikes."
    - "More questions are valuable only when they expose consequential uncertainty instead of creating analysis theatre."
    - "Stronger models can expand analysis, but engineering judgment still owns context, trade-offs, evidence, and the final decision."
  strongestCounterargument: "A long agent interview can become analysis theatre: many questions, polished documents, higher token cost, and confidence unsupported by real evidence. The process helps only when it removes obvious questions, ranks uncertainty by consequence, and stops when a test is cheaper than more discussion."
  appliesWhen:
    - "The feature crosses system boundaries or depends on external integrations."
    - "Architecture, lifecycle, security, scale, or rollout choices can make implementation expensive to reverse."
    - "The engineer can provide repository context and remain responsible for the decisions."
  doesNotApplyWhen:
    - "A small, reversible change is cheaper to implement and test than to specify further."
    - "The agent cannot inspect enough context to distinguish facts from plausible guesses."
    - "The team treats generated documents as approval or evidence without independent review."
  discussionPrompt:
    key: "agent-spec-interview.v1"
    text: "Which unanswered question could still change the requirement, rather than merely add detail to it?"
  glossary:
    - term: "Specification interview"
      definition: "A structured exchange in which an agent asks for the decisions, constraints, risks, and evidence needed before implementation."
    - term: "Evidence gate"
      definition: "A decision that stays open until a contract, test, spike, benchmark, or real environment provides enough proof."
    - term: "Analysis theatre"
      definition: "Producing more questions and documents without reducing meaningful uncertainty or improving a decision."
    - term: "Spec-driven development"
      definition: "A workflow that keeps requirements and design artifacts as durable inputs to planning and implementation."
  relatedTranslationKeys:
    - "2026/05/20/the-high-individual-contributor-in-the-age-of-ai-agents"
    - "2025/09/02/the-ifless-principle-designing-apis-without-hidden-decisions"
  copyReviewed: true
---

I spent hours specifying a feature with agents. By the end, I had changed the requirement.

That sounds like a delay until you compare it with the alternative: implementing the wrong requirement very quickly.

The feature began as “a simple local component.” It had to run on multiple operating systems, coordinate with external applications, and hide some integration complexity from the user. Straightforward enough, apparently.

Then I gave the agent a short instruction: **interview me to detail it**.

That interview pulled the feature apart. We discussed functional behaviour, scale, security, integrations, installation, updates, recovery, observability, process lifecycle and the stack. The first stack recommendation changed. An architecture that was becoming too modular was simplified. A reasonable-looking shutdown rule turned out to be capable of interrupting delayed work, so that requirement changed too.

The hours weren't spent decorating a document. They were spent moving mistakes from code into conversation, where they were much cheaper to fix.

## The prompt that starts the useful part

There is no genuinely magic prompt, of course. But this one has been unusually productive for me:

> Interview me to detail this feature before writing code. Cover functional and non-functional requirements, architecture, integrations, stack, security, operations, failure modes, testing and rollout. Don't ask what is already clear. Separate decisions, recommendations, real open questions and points that require evidence.

The last two sentences matter. Without them, an agent can happily ask everything it knows how to ask. That produces volume, not necessarily insight.

I normally give it the desired outcome, the repository context, constraints and explicit non-goals first. Then I ask it to interview me across a few areas:

- actors, user journeys and acceptance criteria;
- functional behaviour and state transitions;
- performance, scale, latency, availability and recovery;
- security, privacy, secrets and authorization boundaries;
- existing architecture and constraints that cannot move;
- external contracts, versions and failure behaviour;
- stack alternatives and the constraint that should dominate the choice;
- installation, migration, updates, rollback and support;
- tests, observability and unknowns that need a spike.

I answer quickly. `Yes`, `no`, a short decision, or `recommend` is often enough. After each round, I ask the agent to update the durable specification and show contradictions, assumptions and remaining gaps.

That loop is more useful than one enormous initial prompt because my answers change the next questions. A security boundary may alter the architecture. A concurrency requirement may change the stack. An external contract may turn a confident design into an evidence gate.

## What changed before I wrote the implementation

The private project behind this case cannot be described in detail, but the decisions can. It was a cross-platform local integration component handling large workloads and coordinating with external applications.

Here is the useful before-and-after view:

| Initial assumption | Pressure from the interview | Decision after analysis |
| --- | --- | --- |
| “The component is simple” | Integrations, scale, lifecycle, updates and recovery appeared | Define it as a production system with explicit boundaries |
| The first stack recommendation was good enough | Recheck the constraint that dominates the system | Change the stack recommendation |
| More modules would make the design safer | Challenge abstractions that existed only for imagined futures | Keep a smaller foundation |
| The process could stop after an idle period | Consider delayed work from external applications | Tie lifecycle to real processes and active work |
| A long specification meant we were ready | Separate decided work from unresolved evidence | Implement the foundation and spike the remaining risks |

The lifecycle decision was the best example. Stopping after inactivity sounded clean. It also risked killing the component while an external application still needed it. Once we followed that scenario to its actual consequence, the rule changed: active processes and work became the authority, with a conservative fallback when they could not be tracked reliably.

That was not the agent heroically saving me from myself. I challenged several of its recommendations, and it challenged several of my assumptions. The value came from the loop.

## Plan mode is good; bullet Q&A is faster for me

[Codex guidance](https://learn.chatgpt.com/guides/best-practices), [Claude Code's Plan mode](https://code.claude.com/docs/en/permission-modes), and [Google Antigravity's reviewable implementation plans](https://antigravity.google/docs/implementation-plan) all support inspecting and correcting a plan before code. I agree with the method. I just don't always prefer the interface.

Plan mode improves the experience when questions need repository inspection, staged decisions and explicit gates. In this case, I asked it to regenerate 12 structured questions in Plan mode, and that made the first round easier to navigate.

For longer specifications, I now prefer plain bullet Q&A. I can scan a batch, answer several questions together, annotate one answer, and keep the exchange as an artifact. It looks less sophisticated and moves faster. A fair trade, if you ask me.

The two formats are not competing methodologies. Plan mode is a useful interaction layer. Bullet Q&A is the writing surface I currently find most efficient.

## Yes, the agent will generate 100 questions

While specifying Agent Kavor, I asked an agent to inspect several specs and architecture decisions, remove anything obvious or already settled, and return **all 100 open questions** about analysis, design and requirements.

It did. All 100 of them. Ask literally, receive literally :)

I answered in grouped bullets and used those answers to close decisions scattered across specifications and architecture records. Some questions exposed naming inconsistencies. Others forced decisions about state, evidence, failure behaviour, traceability and the relationship between artifacts and coding agents.

The lesson is not “always ask 100 questions.” Twelve consequential questions beat 100 generic ones. The useful constraints were:

- inspect the existing artifacts first;
- skip what is obvious or already decided;
- focus on gaps that could change design or implementation;
- let me answer related questions in one block;
- write the resulting decisions back into the specs.

Without those constraints, a hundred questions are just a very expensive way to procrastinate.

## The real loop is question, contradiction, decision

My specification loop now looks like this:

1. Give the agent the problem, context, constraints and non-goals.
2. Ask for an interview organized by engineering area.
3. Answer in compact bullet batches.
4. Ask it to update the spec and list contradictions.
5. Challenge the stack, architecture and lifecycle, especially when the prose sounds too confident.
6. Run another interview containing only consequential indecisions.
7. Ask: “What is implementable now, and what still depends on evidence?”
8. Only then authorize planning or implementation.

That seventh question has become one of my favourites. A useful specification does not claim that uncertainty disappeared. It shows which decisions are closed, which defaults are acceptable and which risks still require a contract, a benchmark, a spike or a real environment.

In this project, the final review said the foundation was implementable while three integration and performance questions still needed evidence. That answer was much more useful than another confident “ready to build.”

## Higher reasoning is expensive. A wrong foundation is worse.

For high-impact specification work, I use the most capable model available to me and a higher reasoning level. [Codex](https://developers.openai.com/api/docs/models/gpt-5.2-codex) exposes effort settings up to `xhigh`; [Claude Code](https://code.claude.com/docs/en/model-config) lets you tune effort on supported models; and [Google Antigravity](https://antigravity.google/docs/models) offers model variants with different reasoning levels. None of that removes the need for human review.

My subjective experience? It feels like a 10x increase in my ability to abstract and analyse a problem.

That is not a benchmark. I am not claiming ten times the productivity or one tenth the defects. I mean that I can explore far more scenarios, compare more constraints and revisit more assumptions before implementation. That gives me more chances to catch avoidable mistakes while they are still cheap.

The cost is real: more time, more tokens and sometimes far more analysis than the feature deserves. I would not run this process for a tiny, reversible change that is cheaper to implement and test. I use it when a wrong boundary, stack, integration contract or lifecycle rule would be expensive to unwind.

## The danger is analysis theatre

The strongest objection to this method is simple: an agent can generate an impressive pile of questions and still leave you with a bad decision.

It can invent edge cases, repeat the same uncertainty in different words, recommend fashionable architecture and write a specification too broad to implement. A long document can make weak assumptions feel official. The 100-question example becomes ridiculous if question 83 has no chance of changing anything.

My controls are equally simple:

- give the agent real repository and business context;
- distinguish facts, recommendations and assumptions;
- rank questions by the cost of being wrong;
- ask for counterexamples and failure modes;
- require contracts, sources, tests or spikes for uncertain integrations;
- remove speculative modules before they become a framework;
- stop asking when an experiment is cheaper than another answer.

And keep one human decision owner.

This is where software engineering remains sovereign. The agent can expand the search space and keep pressure on the specification. It cannot own the product context, accept operational risk or decide that the evidence is good enough. It certainly will not suffer through the migration six months later if the abstraction was wrong.

## This pattern is becoming a real development practice

This is not proof of one universal process. But the convergence is documented: [GitHub Spec Kit](https://github.github.com/spec-kit/index.html) makes the path from specification to plan, tasks and implementation explicit; [Kiro Specs](https://kiro.dev/docs/specs/) keeps requirements and design reviewable; [Claude Code](https://code.claude.com/docs/en/permission-modes) can research and propose in Plan mode without editing; and [Google Antigravity](https://antigravity.google/docs/artifacts) produces plans and other artifacts for review. When code gets cheaper to generate, preserving intent, decisions and acceptance criteria becomes more valuable.

Requirements-engineering research is moving in the same direction, with important reservations. [A paper on generative AI for requirements engineering](https://arxiv.org/abs/2310.13976) discusses its use across elicitation, analysis, specification and validation. A [small survey of 55 practitioners](https://arxiv.org/abs/2511.01324) found human–AI collaboration far more common than full automation. A [systematic literature review](https://arxiv.org/abs/2409.06741) also highlights problems around reproducibility, control and validation.

That combination makes sense to me. Agents are unusually good at widening the interview and keeping a complicated set of decisions in view. They are not unusually good at being accountable.

## Where Agent Kavor fits

This loop is also one of the ideas behind [agentkavor.com](https://agentkavor.com), which is coming. I want to move the work beyond a linear chat: the user focuses on the specification, connects artifacts and agents visually, and Agent Kavor orchestrates implementation, outputs and traceability around that graph.

![Agent Kavor on a MacBook, with a specification connected to agents, a note, and a terminal.](/media/posts/agent-specification-interview/shared/agent-kavor-macbook.webp)

*A small preview of Agent Kavor: specs, agents, and outputs connected on the same canvas.*

The goal is not to remove engineering from implementation. It is to give engineering a better place to decide what should be implemented in the first place.
