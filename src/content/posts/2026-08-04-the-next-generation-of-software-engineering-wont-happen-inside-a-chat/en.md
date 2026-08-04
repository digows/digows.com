---
title: "The next generation of software engineering won't happen inside a chat"
seoTitle: "Why software engineering with AI agents must move beyond chat"
description: "Code generation is abundant. Durable intent, responsibility, review, evidence, and release authority are not—and a chat cannot hold them together on its own."
permalink: "2026/08/04/the-next-generation-of-software-engineering-wont-happen-inside-a-chat"
publishedAt: "2026-08-04T05:27:15.000Z"
reviewedAt: "2026-08-04"
language: "en"
categories:
  - "Software engineering"
  - "AI agents"
tags:
  - "coding agents"
  - "software architecture"
  - "specifications"
  - "code review"
  - "release engineering"
draft: false
translationKey: "2026/08/04/the-next-generation-of-software-engineering-wont-happen-inside-a-chat"
legacy: false
featuredImage: "/media/posts/engineering-beyond-chat/shared/engineering-beyond-chat-durable-artifacts.webp"
editorial:
  quickSummary: "Coding agents can produce substantial code inside long conversations, but the project still needs durable intent, explicit ownership, independent evidence, and human release authority. Chat remains a useful working surface; it should not become the source of truth for the engineering system around it."
  keyTakeaways:
    - "Promote consequential decisions from conversation into versioned specifications, ADRs, tests, findings, and release evidence."
    - "Separate responsibilities when work can conflict, fresh context improves review, or authority must survive an executor change."
    - "Treat compaction and model switching as real context or executor transitions, even when the visible conversation remains continuous."
    - "Allocate provider, model, effort, tools, and context to a defined responsibility instead of searching for one universal winner."
    - "Make orchestration claim only states it can observe; an honest unknown is safer than a confident inference."
    - "Keep promotion, rollback, and product-risk decisions under explicit human authority even when agents perform the release mechanics."
  strongestCounterargument: "One capable coding-agent session may already be the simplest safe system for a cohesive, reversible task. Extra agents, queues, handoffs, statuses, and approval gates can add latency, duplicate state, lose context, and manufacture confidence. Separation is justified only when durable decisions, conflicting ownership, independent evidence, or explicit release authority outweigh that cost."
  appliesWhen:
    - "Several agents or people can change overlapping code, tests, or operational state."
    - "Specifications and decisions must survive compaction, model changes, restarts, or fresh review contexts."
    - "Independent verification or platform evidence is required before a consequential release decision."
    - "The team can define observable states and durable artifacts instead of inferring progress from terminal prose."
  doesNotApplyWhen:
    - "One cohesive, reversible task is cheaper to implement, inspect, and test in a single session."
    - "The proposed orchestration layer cannot observe the provider states it claims to report."
    - "Additional roles and gates exist only to imitate a mature process without changing a decision or reducing risk."
  discussionPrompt:
    key: "engineering-beyond-chat.v1"
    text: "Which decision in your current agent workflow must survive the conversation, and what durable artifact should own it?"
  glossary:
    - term: "Working context"
      definition: "The conversation, tool output, instructions, and loaded material available to the executor for its current response."
    - term: "Durable engineering state"
      definition: "Versioned or otherwise persistent intent, evidence, ownership, and release information that can be inspected outside one conversation."
    - term: "Compaction"
      definition: "A product mechanism that replaces or compresses earlier conversational input so work can continue within a smaller context."
    - term: "Responsibility boundary"
      definition: "An explicit division of decisions, owned artifacts, evidence, and authority around a piece of engineering work."
    - term: "Independent review"
      definition: "A separate inspection of a defined contract and result, often using fresh context to reduce anchoring on implementation history."
    - term: "Release authority"
      definition: "The reserved power to promote, wait, abort, pause, or roll back a candidate after considering its evidence and risk."
  relatedTranslationKeys:
    - "2026/07/15/i-spent-hours-specifying-a-feature-with-agents-and-changed-the-requirement"
    - "2026/05/20/the-high-individual-contributor-in-the-age-of-ai-agents"
    - "2025/09/02/the-ifless-principle-designing-apis-without-hidden-decisions"
  copyReviewed: true
---

The TESTER had a refactoring to finish. The FIXER had three functional corrections under way. Both needed to touch the tests, and I did not want to split the work into another worktree.

So I gave them an ownership boundary.

The TESTER would reorganize the external test layout and tell the FIXER when the new structure was ready. The FIXER could make the functional corrections, but would leave the new scenarios pending instead of creating a competing layout. When the handoff arrived, the FIXER recorded which files it had changed so the TESTER would not overwrite them.

This was not two chat windows politely taking turns. It was software work with a dependency, two owners, a temporary hold, a message, and an explicit point at which responsibility changed hands. The useful thing was not that both agents could produce code. The useful thing was that the work remained coherent while they did different jobs.

That distinction has become central to how I think about coding agents.

Generative AI has made code production abundant. Engineering did not become abundant with it. Intent, decisions, decomposition, review, evidence, and release authority are still scarce. In fact, faster production makes a weak decision more expensive because the wrong idea can now spread through a repository at impressive speed.

Chat is excellent for many local acts of engineering. It is a poor primary structure for the engineering system around them.

![A physical installation with blue conversation fragments dissipating above a specification, repository history, tests, review, and release artifacts.](/media/posts/engineering-beyond-chat/shared/engineering-beyond-chat-durable-artifacts.webp)

*Conversations dissipate. The engineering artifacts they produce must remain.*

## 1. Code got cheaper; coherence did not

Ask a capable coding agent to implement a bounded change and it can inspect files, edit code, run commands, respond to failures, and continue for a long time. That is real work. Pretending otherwise would be nostalgia disguised as rigor.

But code is only one output of engineering. Before implementation, somebody must decide what the system should do and which constraints matter. During implementation, somebody must preserve boundaries, manage conflicting changes, and distinguish a failed approach from a changed requirement. Afterwards, somebody must review the result, decide what evidence is enough, and choose whether the release should move.

Those responsibilities were always present. Agents make them easier to see because execution is no longer the obvious bottleneck. When producing another implementation becomes cheap, the costly questions move elsewhere:

- Which specification is authoritative?
- Which decisions have actually been made?
- Who owns a test boundary while another change is in flight?
- Did the reviewer inspect the same contract the implementer used?
- What passed, at which revision, on which platforms?
- Who can promote, pause, abort, or reverse a release?

A fluent transcript may contain answers to all six. That does not make it a dependable place to keep them.

The inversion is simple: AI made code abundant; engineering became scarce. I mean that as an opinion grounded in what I have been building, not as an industry benchmark. The important shift is from generating more material to keeping decisions and evidence coherent across the people, agents, tools, repositories, and releases that act on them.

Once you see the problem that way, “Which model writes the best code?” is still useful, but it is no longer the governing question. A stronger question is: what engineering system lets several capable executors work without making intent, ownership, and authority disappear into their conversations?

## 2. Chat is useful, and that is why the trap works

The case against chat is easy to overstate. A modern coding-agent session is not a prompt box attached to autocomplete. It can read repository files, run tools, keep a visible history, compact earlier work, create subagents, and sometimes switch models or reasoning settings without forcing the user to reconstruct the task manually.

For one cohesive task, that can be exactly the right interface.

If I am tracing one bug, the files already read remain relevant, and the same responsibility continues from diagnosis into a small correction, staying in the session avoids waste. Starting a process diagram and a coordination layer would add ceremony while solving nothing. Anthropic's own [session guidance](https://claude.com/blog/using-claude-code-session-management-and-1m-context) makes a similar practical distinction: continue when the same task still benefits from what is in context; start fresh, compact, rewind, or use a subagent when the shape of the work changes.

Chat is also a good surface for ambiguity. I can challenge an answer, add a constraint, ask the agent to inspect a file, or change direction in seconds. That conversational compression is valuable. Many engineering decisions begin as messy exchanges before they deserve a durable form.

The trap is mistaking a convenient interface for the system that owns the work.

A chat has a natural centre: the current conversation. Engineering has several centres at once. The specification has its history. The repository has its branches and commits. Tests have coverage boundaries and results. Review findings have severity and disposition. A release candidate has artifacts, platform gates, known limitations, promotion state, and rollback choices. These things relate to the conversation, but they cannot safely become shadows of it.

The question is not whether chat can support serious work. It plainly can. The question is what must remain true after the session is compacted, restarted, handed to another agent, read by another model, or forgotten by the person who initiated it.

That is where the primary abstraction starts to matter.

## 3. A readable transcript is not project state

Imagine a long session that contains a design decision halfway through: Git will remain the source of truth for a worktree lifecycle. Later messages discuss UI details, merge behaviour, cleanup, test failures, and naming. The transcript still exists, so the decision feels preserved.

Now ask a second reviewer to inspect the change. Which part is the contract?

If the answer is “read the chat,” the reviewer must infer which messages are current, which proposals were rejected, which assistant summaries were verified, and whether a later correction superseded an earlier instruction. If the reviewer enters through a compacted session or a synthesized handoff, it may not even receive the same evidence.

Durable state has stronger properties. It is addressable independently of the session. It can be diffed. It records change. Another executor can load it without reproducing the path that created it. A reviewer can point to a specific version. A release gate can test it without asking a model what it remembers.

This is why I care about specifications as files, ADRs, commits, test reports, review findings, and release manifests. Their formats are less interesting than their independence. The current executor can change while these artifacts remain available to the next one.

There is a useful separation here:

| Conversation state | Durable engineering state |
| --- | --- |
| Current instructions and recent corrections | Versioned specification and acceptance criteria |
| Files and tool output loaded for this turn | Repository content and Git history |
| The agent's working interpretation | Recorded decisions and open questions |
| A test command and its output | Test definition, revision, result, and coverage boundary |
| A review discussion | Findings, severity, response, and resulting change |
| A request to ship | Candidate artifacts, gates, promotion, and rollback state |

The left column is not disposable. It is the working surface. But it should be able to vanish without taking the right column with it.

That is the difference between continuity that feels smooth and continuity the project can prove.

## 4. Context is working memory, not the knowledge base

A context window is the material available to a model when it produces the next response. Depending on the product, that can include the system prompt, conversation, tool calls and outputs, and files read during the session. Anthropic describes that composition directly in its [guide to sessions and context](https://claude.com/blog/using-claude-code-session-management-and-1m-context).

I find it useful to think of context as closer to working memory than to a project knowledge base. This is an analogy, not a claim that a model context and computer RAM work the same way.

Working memory is assembled for the current act. It contains useful material and debris. It has a capacity and a selection problem. Its contents influence the next action, but their presence does not make them authoritative. If a stale console trace contradicts the committed specification, the trace does not win because it is nearer to the bottom of the prompt.

Project knowledge needs different qualities:

- stable identity;
- provenance;
- version history;
- explicit supersession;
- access outside one session;
- validation by tools that do not depend on the agent's recollection.

A specification file can have those qualities. So can an ADR, a test, a commit, a signed artifact, or a release receipt. A line buried in a transcript has weaker identity even if the model can currently quote it.

This matters because context feels more complete than it is. The user can scroll through the visible conversation and see an uninterrupted story. The executor does not necessarily receive that story in the same form on every turn. Content may be cleared, summarized, compressed, filtered, reloaded from disk, or read again by a different model.

None of that is an indictment of context management. Without it, long-running work would stop at a hard boundary. It is a reason to keep consequential decisions somewhere that survives whatever context management does next.

The rule I use is blunt: if a later executor must be able to recover a decision exactly, that decision should not live only in the conversation that produced it.

## 5. Compaction is a real transition, even when the chat looks continuous

Compaction exists because long sessions accumulate more material than the next model call should or can consume. Products handle this differently, and those differences matter.

Anthropic describes `/compact` as summarizing the conversation and replacing its history with that summary. Its documentation calls the operation lossy. OpenAI's engineering description of [Responses API compaction](https://openai.com/index/equip-responses-api-computer-environment/) instead describes a token-efficient encrypted compaction item plus selected earlier content, designed so the agent can continue across context boundaries. The [Codex agent-loop explanation](https://openai.com/index/unrolling-the-codex-agent-loop/) likewise describes automatic replacement with a smaller representative input and an opaque compaction item.

I do not treat these implementations as equivalent. The available evidence does not justify saying they lose the same information, expose the same representation, or preserve the same details. What they share is the state transition: the next executor does not simply receive an endlessly growing verbatim record in the ordinary way.

That transition can be operationally excellent. It can also be invisible to the engineering process.

The visible chat may still look like one continuous relationship. The user says “now apply the warning we noticed earlier,” and the interface gives no strong indication that “earlier” is represented differently. If the warning was not selected for the compacted state, the next action begins from a different practical memory even though the social shape of the interaction did not change.

This is exactly why compaction should not be forced to carry the project's source of truth. It has a harder job: preserve enough working understanding to continue usefully. Asking it also to preserve every acceptance criterion, rejected alternative, review obligation, and release caveat turns an optimization boundary into an implicit governance mechanism.

Put the decision in a spec. Put the rejected architectural alternative in an ADR. Put the failing scenario in a regression test. Put the release limitation in the candidate evidence. Then let compaction do what it is for.

That is not distrust of the model. It is refusing to hide project memory inside a mechanism designed to reduce working context.

## 6. The warning that disappeared

Anthropic's own guide offers a wonderfully ordinary failure case. A long debugging session is compacted. The next instruction refers to another warning seen in a different file. Because the compaction process could not predict that the next task would return to that warning, the warning may have been omitted from the summary.

Nothing dramatic happened. There was no corrupted database, malicious agent, or catastrophic hallucination. The future changed direction.

That is enough.

Engineering work changes direction constantly. A test failure makes an old assumption relevant. A reviewer reopens an apparently settled boundary. A platform check turns a packaging detail into a release blocker. A customer report makes the discarded alternative worth examining again. The material that matters tomorrow is not always the material that dominated today's session.

This is why “the context is large” is not the same claim as “the project remembers.” Even a very capable selection process must decide what to retain, and its decision is made before the future question arrives.

The practical response is not to copy the entire transcript into a larger transcript. It is to promote consequential discoveries into durable artifacts as the work unfolds:

- a warning that indicates a missing scenario becomes an issue or test;
- an accepted constraint becomes part of the specification;
- a rejected design and its reason become an ADR entry;
- a review finding receives a recorded disposition;
- an operational limitation stays attached to the release candidate.

Promotion is the useful word. Conversation produces possibilities. Engineering chooses which possibilities become part of the project record.

That choice still needs judgment. Persist everything and you have merely moved the context problem into a graveyard of documents. Persist nothing and the project depends on the next summary guessing correctly. The goal is not maximum memory. It is durable, curated intent and evidence.

## 7. A model switch is an executor change

A conversation can look continuous while the model answering it changes.

Claude Code's [prompt-caching documentation](https://code.claude.com/docs/en/prompt-caching) says that model switching makes the next request read the same conversation using the new model's cache rather than reusing the previous model's cache. Its product modes can also allocate different models to planning and execution. Effort controls add another variable: supported settings can change how much computation a request receives.

The transcript has not been deleted. The executor has changed.

This is not inherently risky. It can be a smart allocation. A complex architecture review may justify more reasoning than a mechanical file search. A cheap, fast model may be perfectly adequate for a bounded inventory. A different provider may offer tools or behaviour that fit one responsibility better. Official guidance from both Anthropic and OpenAI recommends matching models and effort to representative work rather than assuming the most expensive setting should handle everything.

I used that distinction in a real specification review. A Codex specification agent sent a review request to a connected Claude session. The Claude session was configured at `xhigh` effort and treated the task as a second independent review. That is one observed allocation, not evidence that Claude is always the best reviewer, Codex is always the best spec writer, or `xhigh` always improves the result.

The useful pattern is explicitness:

| Decision | Question to record |
| --- | --- |
| Provider | Which tool environment and behaviour does this responsibility need? |
| Model | Which capability and cost profile fits this task? |
| Effort | How much reasoning is justified by the consequence of error? |
| Context | What evidence should this executor load, and what should it not inherit? |
| Independence | Should it see the previous agent's reasoning, or only the contract and result? |

If these choices remain hidden inside a smooth chat, we may mistake interface continuity for execution continuity. If they become part of the work assignment, specialization becomes reviewable and repeatable.

The executor can change. The specification, evidence, and authority should not change accidentally with it.

## 8. The strongest case for simply adding more context

The cleanest counterargument to my thesis is also the most practical: why build an engineering layer when context windows keep getting larger?

Large context can remove artificial boundaries. A model can inspect more source files together, retain a broader debugging trail, compare distant parts of a repository, and avoid the cost of repeatedly loading material. For an individual engineer with one cohesive task, that may be better than introducing several agents, handoffs, queues, and documents. Every orchestration layer has its own state and its own ways to fail.

Research is also moving. Subquadratic, for example, reports work on sparse-attention models trained for long contexts and publishes a [technical report](https://subq.ai/docs/subq-1-1-small-model-card.pdf). Those are company-reported claims, not an independently reproduced basis for declaring the long-context problem solved. They are still a useful warning against writing as if context research has stopped.

And larger context genuinely matters when a task is transversal. A reviewer comparing an architectural rule across many packages may need broad source inspection. Splitting that inspection into tiny fragments could destroy the very relationship the reviewer is supposed to see.

The limit is that capacity does not guarantee effective use. The 2024 paper [“Lost in the Middle”](https://aclanthology.org/2024.tacl-1.9/) found strong position effects in its evaluated models on multi-document question answering and key-value retrieval: relevant material near the middle was often used less effectively than material near the beginning or end. Those experiments predate current 2026 models and did not test my repositories. They are historical evidence against equating nominal capacity with uniform retrieval, not a benchmark for today's products.

Even perfect retrieval would not settle the architecture question. A gigantic context could contain a spec, code, tests, findings, and release logs. It would still need to know which artifact is authoritative, who may change it, which finding was accepted, and whether promotion is allowed. Capacity can hold governance information; it does not create governance.

So yes: use more context when broad inspection is load-bearing. Stay in one session when the responsibility remains coherent. Do not create agents to decorate a diagram. But when decisions must survive executor changes, concurrent work can conflict, evidence requires independent checking, or release authority must remain explicit, context size is not the missing abstraction.

## 9. Durable does not mean “put everything in a database”

Once we accept that chat should not own project state, it is tempting to build a grand control plane that owns every specification, message, status, and output. That can be another trap.

Durability is not the same as centralization. The best source of truth is often the artifact that already has the right semantics.

A specification can be a Markdown file in the repository. Git then supplies history, diff, blame, branching, and review. Code stays in code. Tests remain executable. An ADR records the decision and its consequences. A release manifest identifies immutable artifacts. Runtime coordination may belong in a database because a queue and delivery state are operational facts rather than repository content.

In one architecture decision I reviewed, an earlier design treated a specification as a rich database entity with title, body, criteria, status, evidence, and outputs. The revised decision moved specification content into files and kept only runtime metadata outside them. The reason was concrete: agents already work with files; Git already supplies traceability; and trapping the body in a product database would create a proprietary source of truth.

The decision did not pretend files solve everything. File content and runtime metadata still require reconciliation. Branch switches can make a file disappear from the working tree. Watchers can become the highest-risk component. Lifecycle state may be advisory rather than enforced. A durable design does not become honest by omitting its synchronization cost.

The same distinction applies to conversations between agents. A durable message needs identity, sender, recipients, delivery state, and restart behaviour. Terminal text is a rendering surface, not a semantic messaging protocol. If delivery is ambiguous, the system must not invent certainty from what happened to appear in a PTY.

The TESTER/FIXER handoff becomes more interesting under this lens. “Tell the other agent to wait” sounds like a line of prose, but the engineering meaning is a small protocol:

1. The TESTER owns the test-layout transition.
2. The FIXER may continue functional corrections but must not create the pending scenarios yet.
3. A message announces when the layout boundary has changed.
4. The FIXER reports touched files before the TESTER resumes across the shared area.

If the message is only pasted into a terminal, several facts remain unclear after a restart. Was it submitted? Was it actually delivered? Was it held for human approval? Did a later message supersede it? Can the recipient recover the instruction without scraping terminal history?

A durable conversation design can answer those questions without pretending that every message is a synchronous request. A recipient may reply later, more than once, or not at all. Delivery state belongs to each recipient. A human approval hold should remain outside the agents' authority, or an agent could release its own blocked instruction. When submission has an ambiguous outcome, recovery should inspect the stored state rather than send the message again and hope duplication is harmless.

This is more machinery than most one-agent tasks need. It becomes worthwhile when messages change ownership or authorize action across separate executors. The content of the message is still conversational; its identity, delivery, and authority are engineering state.

That distinction lets the next executor recover the obligation without pretending it participated in the conversation that originally created it.

This gives us a less glamorous but more useful design rule: keep truth where its natural invariants already live, and add coordination metadata only where the underlying artifact cannot express it.

The engineering layer should connect sources of truth. It should be very suspicious of becoming all of them.

## 10. Decomposition is older than agents

Software engineers did not discover boundaries when language models learned to call tools.

In his classic paper on [decomposing systems into modules](https://kilthub.cmu.edu/articles/journal_contribution/On_the_criteria_to_be_used_in_decomposing_systems_into_modules/6607958), David Parnas compared different modular structures and argued for hiding changeable design decisions behind module interfaces. Eric Evans's [DDD reference](https://www.domainlanguage.com/ddd/reference/) defines a bounded context as the boundary within which a particular model applies and uses context maps to make relationships between models explicit.

Neither author prescribed multi-agent workflows. “One bounded context, one agent” would be a lazy reading. Their ideas matter here because both treat decomposition as a decision about responsibility and information, not as a count of moving parts.

That gives us a better way to divide agent work.

Do not begin by asking how many agents the subscription allows. Ask which decisions should be hidden behind a boundary, which work needs an independent view, and where concurrent changes could conflict. A specification responsibility is different from a coding responsibility because its output is the contract the code should satisfy. A review responsibility is different because it should be able to challenge both the implementation and the assumptions behind it. Release is different again because its authority concerns exposure and reversibility, not merely artifact production.

The boundaries can be implemented in several ways:

- one agent in separate sessions;
- several agents with explicit scopes;
- one model for planning and another for execution;
- a human review between stages;
- a tool-enforced gate around a shared artifact.

The architecture is not the cast list. It is the set of responsibilities, artifacts, and allowed transitions.

Here is the allocation I now find most useful. It is a thinking tool, not a mandatory deployment topology:

| Responsibility | Durable input | Evidence returned | Decision that stays human |
| --- | --- | --- | --- |
| Elicitation and specification | Problem, repository constraints, existing decisions | Contradictions, open questions, acceptance criteria, updated spec | Scope, product trade-offs, unresolved risk |
| Coding | Spec revision, repository state, owned files | Diff, build, types, lint, tests, declared gaps | Implementation direction and architectural correction |
| Tests | Contract, regressions, production boundaries | Scenarios, results, coverage limits | Whether the product surface should change for testability |
| Review | Spec, diff, ADRs, validation evidence | Findings, severity, and supporting code | Accept, reject, or redirect each finding |
| Release | Candidate artifacts, platform gates, rollback plan | Checks, receipts, endpoints, known limitations | Promote, wait, abort, pause, or roll back |

Each row creates a different failure if it becomes only a conversation. A forgotten specification decision changes the target. A coding handoff without a revision makes validation hard to reproduce. A test report without a boundary invites a broader claim than the suite supports. A review without disposition leaves the project with an unresolved opinion. A release request without authority turns artifact production into accidental exposure.

The table also shows why “human in the loop” is too vague. The human is not one generic checkpoint placed after everything else. Human authority appears at different decisions with different evidence. The person choosing scope needs contradictions and trade-offs. The person accepting a review finding needs the code and contract. The person promoting a release needs platform evidence and a recovery path.

An agent can prepare all of that material. It can even recommend the decision. The workflow becomes accountable only when it records which decision was delegated, which remained reserved, and who exercised it.

That point also limits my argument. A small change does not need five named agents performing a miniature enterprise workflow. One capable agent can specify, implement, and test it when the context is coherent and independence adds little. Separation earns its cost when ownership conflicts, fresh context matters, or the consequence justifies another check.

Billions of parameters did not abolish decomposition. They gave us more capable executors to place behind the boundaries we still have to choose.

## 11. Specification is a working contract, not a long prompt

One of my recent refactorings began with a seemingly simple rename: replace the existing concept of a task with a specification. It did not stay a rename for long.

Review exposed decisions that needed to become explicit. Could the old specification be removed after the work? Was a contract change acceptable? Did the MCP allowlist need to change with the terminology? Did “no migration” actually mean a fresh database that could discard the old table and node kind?

Then the desired object itself expanded. The new specification needed acceptance criteria instead of the old definition-of-done field, a clearer lifecycle, evidence, outputs, traceability, backlog behaviour, canvas representation, a stronger relationship with coding agents, and staged code reviews.

The important act was not asking an agent to remember all of that. It was updating the specification so later work could read the same decisions.

A useful specification in this setting does at least four jobs:

1. It states the intended result and non-goals.
2. It records decisions and their boundaries, including destructive or compatibility choices.
3. It distinguishes closed decisions from questions that still need evidence.
4. It names the review gates that implementation must cross.

That is more than a prompt because the specification survives the executor. It is also less than a frozen contract because engineering can change it deliberately. The file history then shows that the target moved, instead of forcing reviewers to infer a requirement change from a later chat message.

This matters when an agent proposes something plausible. “No migration” is ambiguous until someone says whether existing data may be discarded. “Add evidence” is decorative until the output and traceability rules are defined. “Review in stages” is wishful until the stages and their authority are part of the workflow.

The human role remains visible throughout. I chose that the contract could change, accepted the fresh-database boundary, expanded the scope, and requested staged review. The agent helped expose and record the consequences. It did not acquire product authority by editing the file.

The best specification is not the one with the most prose. It is the smallest durable contract that prevents the next executor from silently making the same decisions again.

## 12. Coding needs a bounded source of truth

The implementation that followed provides a useful contrast between execution evidence and architectural judgment.

The work added Git metadata for coding-agent worktrees, commands to rebase with the source branch and finish a worktree, checks for clean roots, merge and cleanup behaviour, conflict aborts, and UI state. Automated validation reported a successful build, type checking, lint, and 94 passing tests across ten files.

That is good evidence for a particular revision. It is not a declaration that the design is finished.

The coding responsibility had concrete inputs: the specification, current repository state, and worktree state. Its output was not merely a patch. It included the diff, the commands run, their results, and an operational caveat: the finish operation required a clean workspace root, including housekeeping around the worktree ignore entry.

This is what I want from an implementation agent. Not confidence. A bounded change and evidence another responsibility can inspect.

The source-of-truth question became decisive later. The implementation had introduced state that could duplicate facts already owned by Git. During review, I rejected that duplication and chose Git as the authority. That correction would have been much harder to reason about if “what the agent believes about the branch” and “what Git says” were allowed to coexist as equal truths.

Agents increase the pressure to settle these choices. A person may notice an inconsistency and compensate silently. Two agents can each behave correctly against different representations and still produce a broken workflow. Hidden coupling becomes executable disagreement.

So the coding assignment should identify more than files:

- the canonical specification revision;
- the repository and branch or worktree boundary;
- state owned by external systems such as Git;
- files or domains the agent may change;
- validation required before handoff;
- uncertainties that implementation is not authorized to decide.

That sounds strict until you compare it with debugging two correct implementations of two different assumptions.

## 13. Tests are a responsibility, not the tail of coding

Return to the TESTER and FIXER.

The TESTER owned a refactoring that moved tests out of functional code and prepared a stronger external layout for missing scenarios. One premise was fixed: do not change the behaviour of the hot pipeline. Its scope was later narrowed to tests, configuration, HTTP, SQLite, and integration work while another agent owned the Windows DCMTK runtime and related concerns.

The boundary prevented overlap, but ownership involved more than file paths.

At one point, making the test easier would have meant widening a production API by exposing a deserialization operation. The TESTER declined to distort the public surface for test convenience and chose a real integration path instead. That was a local trade-off, not a universal rule that production APIs must never change for testability. Sometimes a hard-to-test interface is revealing a poor design. Here, the evidence supported preserving the production boundary and testing through the real path.

This is why tests deserve their own engineering responsibility. The tester asks questions the implementer can easily underweight:

- Which contract are we actually proving?
- Which scenarios are missing rather than merely moved?
- Are we testing the production path or a convenient imitation?
- What behaviour must remain unchanged during refactoring?
- Which platform or dependency is outside this agent's scope?
- What result can be reported honestly before end-to-end delivery is complete?

In the handoff, the FIXER implemented functional corrections and validated them on macOS, but kept the test scenarios intentionally pending until the new layout was available. That is a much better state than two agents each deciding where the tests should live and merging the answer afterwards.

Notice the lack of magic. The selected session evidence does not prove that the final end-to-end delivery was flawless. It proves a narrower and more useful point: explicit test ownership allowed one agent to pause part of its work, continue another part, and avoid duplicating a structure owned elsewhere.

The orchestration did not remove dependency. It made the dependency inspectable.

## 14. Green checks do not close the review

After the worktree implementation passed build, types, lint, and all 94 reported tests, I still asked for a code review.

The review found two medium and two low issues. The resulting discussion led me to reject duplicate state and keep Git as the source of truth, followed by another simplification and review.

This episode supports one narrow claim: green automation did not make independent review redundant in that change. It does not prove that review always finds defects, that this number is typical, or that passing tests is somehow unimportant.

Tests and review answer different questions.

Tests ask whether selected behaviours hold under encoded scenarios. Type checks ask whether certain structural constraints hold. Lint checks enforce a defined set of rules. A build proves that the configured build process completed. Review can ask whether the representation should exist at all, whether two sources of truth have been created, whether the implementation matches the current specification, and whether the chosen evidence misses an architectural risk.

An independent review is especially valuable when it receives a clean contract and result rather than the entire persuasive history of the implementation. The implementer's reasoning can help explain choices, but it can also anchor the reviewer. Fresh context is useful when the job is to discover what the implementation owner normalized along the way.

A review handoff should therefore include:

- the specification and accepted decisions;
- the exact diff or revision;
- validation results and known gaps;
- relevant ADRs and source-of-truth boundaries;
- a request for findings with severity and evidence;
- authority limits: the reviewer recommends; the responsible human accepts, rejects, or redirects.

The last point is not bureaucracy. A model can produce a convincing finding that reflects an outdated contract or a preference presented as a defect. Review needs disposition. Otherwise the project collects authoritative-sounding objections without deciding what they mean.

Independent review works because responsibility changes. Merely asking the original executor “are you sure?” changes the sentence, not the perspective.

## 15. Specialization is allocation, not a provider tournament

Once responsibilities are explicit, model and provider selection becomes an engineering allocation problem.

The cross-provider specification review I mentioned used a connected Codex agent to request a second review from a Claude session configured at `xhigh` effort. The concrete facts matter: different provider, explicit review responsibility, deliberate effort setting, and a message connecting the work. The facts do not tell us which provider would win a controlled benchmark or whether the extra effort caused a better result.

That distinction keeps specialization useful.

Provider fandom asks which model is best. Engineering allocation asks what this task needs and how we will judge it. The answer can change by responsibility:

- Specification may benefit from broad repository reading and sustained trade-off analysis.
- Coding may depend more on tool reliability, edit precision, and fast validation loops.
- Testing may need a fresh context, strong adversarial scenario generation, and discipline around production boundaries.
- Review may justify higher effort because one architectural finding can outweigh many mechanical checks.
- Release work may value deterministic tools, explicit approvals, and idempotent recovery more than generative range.

These are hypotheses to test on representative work, not permanent labels to attach to vendors. Model families, effort settings, prices, context limits, and tool support change too quickly for static rankings to age well. Official [OpenAI model guidance](https://developers.openai.com/api/docs/guides/latest-model) itself emphasizes evaluating settings against the actual workload; Anthropic offers task-specific cost and model guidance rather than one answer for all work.

Maximum effort is not a badge of seriousness. It adds latency and cost, and a bounded mechanical task may gain nothing from it. Conversely, saving computation on a consequential architecture decision can be false economy. The unit of choice should be the responsibility and risk, not the agent's name in a sidebar.

The durable record should say what was assigned, what configuration mattered, what evidence returned, and what remains unproven. Then provider choice becomes replaceable. A new executor can perform the same responsibility without requiring the project to reinvent the workflow around it.

That is a healthier form of multi-model engineering: models compete for well-defined work, while the engineering system keeps the contract.

## 16. Orchestration can lie

An orchestration layer is dangerous when it displays certainty that the underlying provider does not expose.

I learned this through a status system that looked reasonable and behaved badly. Claude Code was asking for permission while the UI reported `running`. A Codex session remained stuck in `ATTENTION` after a fork. Completed tasks did not produce the expected one-shot notification.

The first temptation was to improve the inference. Inspect more output. Add more patterns. Reconcile more provider-specific events. That would have made the system more elaborate without making its claims more trustworthy.

We reframed the problem as modelling, not presentation. Then I ordered the status-detection specification to be redone and removed attempts to infer internal coding-agent state. The remaining states were tied to facts available through the PTY or UI boundary: whether the process was starting, running, stopped or exited, and whether installation was needed, active, or failed.

The retreat was the feature.

There is a second lesson in the mechanics. Provider terminals are made for people and for the provider's own interaction loop. They emit text, repaint screens, pause for permission, fork sessions, and change behaviour between versions. Treating that presentation stream as a stable semantic API is brittle even when the first demo looks convincing.

A permission prompt illustrates the mismatch. To a person, it clearly means “work cannot continue until somebody answers.” To a generic orchestrator that sees only a live process, it may look like ordinary execution. A parser can search for familiar phrases, but then localization, formatting changes, alternate prompts, and different providers become part of the status contract by accident. The system starts claiming knowledge from clues.

Sometimes clues are all a UI has. Then the label should reveal the uncertainty rather than laundering inference into fact. “Process running” is supported. “Agent reasoning” may not be. “Input appears required” is weaker but more honest than “blocked” if the provider has not supplied a dependable event.

This case is the strongest warning against my own thesis becoming a product fantasy. Adding orchestration creates more state, more process, more latency, and more failure modes. A graph of agents can be less truthful than two terminal windows if its arrows and badges imply delivery, attention, completion, or authority that it cannot actually prove.

Every orchestration claim needs an observable basis:

| Claim | Evidence worth accepting |
| --- | --- |
| “Message delivered” | Durable recipient state confirmed by the delivery mechanism |
| “Agent running” | Process or PTY fact, not a guess from prose |
| “Review complete” | Review artifact with findings or explicit no-findings result |
| “Tests passed” | Command, revision, result, and defined scope |
| “Ready to release” | Satisfied gates plus the human decision required by policy |
| “Published” | Stable remote receipt or verified endpoint, not an attempted request |

When evidence is unavailable, `unknown` is an honest state. A blank badge is sometimes better engineering than a beautiful lie.

Judge an orchestration system by how it behaves when signals are incomplete, deliveries are ambiguous, agents restart, and humans withhold approval. The happy-path canvas is the least interesting test.

## 17. Release is not the last coding task

Release work makes the authority boundary impossible to ignore.

In one session, I authorized package generation but explicitly withheld site promotion because I wanted more Windows and Linux testing. Later, another critical bug appeared and I asked whether the candidate could still be aborted. It could: the workflow had not created the public release or updated the site, so the candidate was stopped.

A separate event required a reversible rollback of a bad stable release. The instruction was to remove it from the stable/latest channel while preserving the tag, artifacts, and evidence where possible. The operational report also recorded a limitation around cache-purge permissions.

The rollback details matter because releases contain two different kinds of state. Binaries, tags, and evidence should remain immutable so the event can be investigated and reproduced. Channel pointers, update metadata, and cache state may need controlled mutation so users stop receiving the bad candidate. “Rollback” is therefore not synonymous with deleting the release. In this case, preserving the artifacts while changing what stable/latest advertised was the safer and more informative move.

That separation also prevents a comforting but dangerous shortcut: rewriting history until the release looks as if it never happened. An immutable bad artifact plus a durable record of removal tells the truth. A vanished artifact and an edited narrative do not.

These are two bounded events, not proof of a universally safe release system. They show why release deserves a distinct responsibility.

Implementation answers “can we produce the candidate?” Release answers different questions:

- Has the required platform evidence arrived?
- Are artifacts immutable and identifiable?
- Has promotion been explicitly authorized?
- Can the channel be paused or reversed without destroying evidence?
- Are public endpoints and mutable metadata consistent?
- If an external request has an ambiguous outcome, do we retry or stop?

The last question is where deterministic workflow matters. Blind retry can create a duplicate publication or repeat a side effect. A release system should distinguish “failed before sending,” “sent with a stable receipt,” and “outcome unknown.” Unknown requires verification, not optimism.

Human authority is not a ceremonial click after the agent has decided. I can delegate packaging, validation, endpoint checks, and rollback mechanics. I still own the choice to expose a version, wait for another platform, accept a known limitation, abort, or remove a bad candidate from the channel.

This is the point where the phrase “autonomous software engineering” becomes slippery. An agent may autonomously perform a bounded release operation after authorization. That does not mean it owns the product risk or may broaden the release because its checks are green.

Shipping is an engineering responsibility under human authority, not the moment the coding conversation runs out of tasks.

## 18. The bill for moving fast arrives as structure

There is a small application in my Git history that keeps this argument honest.

Its initial prototype had 50 tracked TypeScript and TSX files, no tracked test or spec files, and sampled API routes for bands and volunteers that parsed request JSON with inline shapes and called Prisma directly from route handlers. Those facts describe the code shape. They do not prove the application was defective, that every line came from an agent, or that direct ORM access is always wrong.

Within days, the repository changed substantially. One commit migrated from Prisma to Mikro-ORM and introduced a more domain-oriented structure, with 9,175 insertions and 2,401 deletions. Later commits added extensive integration tests and service refactoring, then application controllers, a common DTO, thinner adapters, broader tests, object-parameter service methods, and improved API error handling.

The sequence is useful as a bounded cost-of-iteration case. A fast prototype was followed by large structural and testing revisions. Git proves the sequence and scale of those changes; it does not prove that missing tests caused every refactor or that “vibe coding” universally produces technical debt.

My opinion is narrower: abundant implementation makes it easy to postpone boundaries because revising code also feels cheap. But structure is not charged only in lines changed. It is charged in migration reasoning, compatibility choices, rewritten tests, review load, and the risk carried while two models of the system coexist.

Sometimes that bill is worth paying. A prototype may exist precisely to discover the domain, and insisting on a mature architecture before learning anything would be waste. The mistake is turning temporary speed into a claim that engineering decisions no longer matter.

The durable record helps here too. If the prototype has explicit non-goals, known shortcuts, and a decision point for hardening, later work can distinguish deliberate debt from accidental architecture. If all of that exists only in the originating chat, the refactor begins by excavating intent from code.

Asaph is the allowed name for this example, but not an alibi. Its history shows rapid structural change. It does not tell a universal story about agents, architecture, or causation.

## 19. The strongest objection: this can become process theatre

Let me put the opposing case as strongly as I can.

Modern coding agents already operate across files, tools, tests, terminals, long sessions, subagents, and model switches. A skilled engineer can keep a specification in the repository, run implementation and review in one conversation, and ship a small change safely. Adding message queues, role-specific agents, status models, evidence objects, and release gates can multiply state without improving the result.

The overhead is real:

- another boundary can lose context;
- another agent can repeat repository reads;
- another handoff can be incomplete;
- another status can become stale;
- another artifact can contradict the code;
- another approval can become a ritual nobody evaluates;
- another orchestrator can fail in ways the providers themselves do not.

The status-inference failure is not a footnote. It demonstrates that orchestration can manufacture confidence. The TESTER/FIXER case also does not prove the workflow was faster or that final quality improved. It shows one intentional coordination boundary, nothing more.

So the answer cannot be “use more agents.” It must be conditional.

Stay in one conversation when the task and responsibility remain coherent, conflicts are unlikely, and the result is cheap to inspect and reverse. Use a larger context when broad source relationships are essential. Keep one agent across specification and implementation when independence would add ceremony rather than information.

Introduce a durable artifact when a decision must survive the session. Separate responsibility when work can conflict or a fresh view is valuable. Add a gate when the consequence justifies explicit evidence or authority. Add orchestration only when it can state what happened more reliably than the humans and tools it coordinates.

This is not a maturity ladder where every team eventually earns a complicated multi-agent platform. The simplest process that preserves intent, evidence, and authority is the mature one.

Sometimes that process is a chat, a spec file, a branch, and a human review. Excellent. The point is that the chat is participating in the system, not quietly impersonating all of it.

## 20. Authority survives delegation

The practical architecture is now visible.

Conversation remains the local working surface. Context gives an executor the material it needs for the current act. Specifications and ADRs preserve intent and decisions. Git preserves code history and source truth. Tests encode selected contracts. Review artifacts record independent findings and their disposition. Messages make handoffs durable. Release evidence ties promotion and rollback to observable state.

No single component needs to know everything.

That is the part I find exciting. We do not need one enormous agent carrying the entire company in its context. We need capable agents working against durable contracts, with boundaries that match the decisions they are allowed to make. One may elicit and refine a specification. Another may implement in a bounded worktree. Another may own the test structure. Another may review from fresh context. Deterministic tools may package and verify the release. The same agent can perform several roles when separation would add nothing.

The human does not have to type every command or inspect every unchanged line. That would waste the leverage. The human must still choose scope, resolve product trade-offs, accept or reject architectural findings, decide whether evidence is enough, and retain authority over release exposure.

Perhaps future systems will make some of these boundaries radically easier, and perhaps AGI will change who performs much of the reasoning; it will not make an unrecorded decision recorded by definition.

The next generation of software engineering will not happen inside a chat because engineering is larger than the executor's current memory. It happens in the relationships between durable intent, bounded responsibility, executable evidence, independent review, and accountable release.

Chat will remain part of that world. A good part. It is where questions move quickly, code takes shape, and a builder can redirect an agent with one sentence. But the project must be able to outlive the conversation, inspect its transitions, replace its executors, and stop its releases without asking a transcript what it thinks happened.

[![The Agent Kavor screen showing a specification, an agent session, and a sticky note.](/media/posts/engineering-beyond-chat/shared/agent-kavor-specification-workflow.webp)](https://agentkavor.com/)

That engineering layer is what I am trying to build with [Agent Kavor](https://agentkavor.com/).
