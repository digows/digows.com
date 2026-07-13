---
title: "The Ifless Principle: Designing APIs Without Hidden Decisions"
description: "A practical API design principle: replace methods that hide branching decisions with explicit operations that clarify intent, behavior, and tests."
permalink: "2025/09/02/the-ifless-principle-designing-apis-without-hidden-decisions"
publishedAt: "2025-09-02T19:44:38.000Z"
reviewedAt: "2026-07-13"
language: "en"
categories: ["Java","Software Development","Software Engineering"]
tags: ["blog","technology"]
draft: false
wordpressId: 1927
translationKey: "2025/09/02/the-ifless-principle-designing-apis-without-hidden-decisions"
legacyUrl: "https://digows.com/2025/09/02/the-ifless-principle-designing-apis-without-hidden-decisions/"
legacy: false
featuredImage: "/images/imported/2025/09/unnamed-d90bb2430f.webp"
editorial:
  quickSummary: "Ifless design does not ban conditionals. It moves a decision to the actor that already knows the intent and gives each operation an explicit contract. The result is clearer APIs, narrower tests, and behavior that can evolve independently without a service guessing what the caller meant."
  keyTakeaways:
    - "Do not make a service infer a choice the caller has already made."
    - "Separate commands when their rules, permissions, failure modes, or future evolution differ."
    - "Keep true domain invariants inside the entity even when enforcing them still requires a conditional."
  strongestCounterargument: "Explicit commands can leak persistence mechanics or multiply an API without adding meaning. A conventional save operation remains appropriate when create and update genuinely share semantics and the caller should not control lifecycle details."
  appliesWhen: ["The caller already knows which operation it intends", "Branches have different rules or authorization", "One generic method keeps accumulating flags and modes"]
  doesNotApplyWhen: ["The distinction is only an internal implementation detail", "A standard framework contract is clearer to its users", "Multiple operations would expose an invalid domain choice"]
  discussionPrompt:
    key: "ifless-hidden-decision.v1"
    text: "Which method in your current codebase is hiding a decision that its caller already knows?"
  glossary:
    - { term: "Hidden decision", definition: "A branch inferred inside an API even though its caller already knows the intended operation." }
    - { term: "Domain invariant", definition: "A rule that must remain true for a domain object to be valid." }
    - { term: "Command", definition: "An explicit request to perform one meaningful domain operation." }
  relatedTranslationKeys: ["2025/08/27/nine-women-cant-make-one-baby-why-smaller-software-teams-deliver-more", "2026/05/20/the-high-individual-contributor-in-the-age-of-ai-agents"]
  interactiveExperience: "find-hidden-decision"
  copyReviewed: true
---
## Introduction

One of the most dangerous lines of code isn’t the one that throws an exception — it’s the one that hides a decision.

As engineers, we often celebrate _flexible_ methods: a single `save()` that “magically” knows when to insert or update, a `send()` that picks the right channel, or an `approveOrReject()` that decides the outcome. At first, it feels convenient. But hidden behind that convenience lives complexity, ambiguity, and a growing army of **if-statements**.

The problem with too many ifs is not only **code readability**. It’s that each of the multiple scenarios your team must design, test, and maintain. What looks like “just one more condition” can easily become exponential in cost.

Over time, I’ve adopted a design approach I call the **ifless principle**: instead of burying decisions in code, we make them explicit in the design of the API and in the domain itself.

* * *

## The Ifless Principle

The idea is simple:

-   **Don’t let your service decide what the user already knows.**
-   Express different operations as **different methods, commands, or entities**, even if they initially share behavior.
-   Move intelligence into **rich domain entities** (following Domain-Driven Design), so that rules live where they belong.

_In short: **ifless is not about eliminating ifs, but about putting decisions in the right place.**_

## Example 1: Save vs Insert/Update

### ❌ If-full version

```java
public void save(Order order)
{
    if (order.getId() == null)
    {
        insert(order);
    }
    else
    {
        update(order);
    }
}
```

### ✅ Ifless version

```java
public void insert(Order order)
{
    // Insert the order.
}

public void update(Order order)
{
    // Update the order.
}
```

Even if both methods are identical today, the design already anticipates that **inserts and updates will evolve differently**. More importantly, the _caller_ knows the intent, so the service doesn’t have to guess.

## Example 2: Approvals

### ❌ Decision hidden in the service

```java
public void approveOrReject(Transaction transaction, boolean approve)
{
    if (approve)
    {
        // Approve the transaction.
    }
    else
    {
        // Reject the transaction.
    }
}
```

### ✅ Ifless API

```java
public void approve(Transaction transaction)
{
    // Approve the transaction.
}

public void reject(Transaction transaction)
{
    // Reject the transaction.
}
```

Each operation has its own lifecycle, rules, and evolution. Tests become more focused, and the API expresses _intention clearly_.

## Example 3: Notifications

### ❌ Conditional channel selection

```java
notificationService.send(user, message, channel);
```

### ✅ Ifless separation

```java
emailNotification.send(user, message);
smsNotification.send(user, message);
pushNotification.send(user, message);
```

Instead of one method with multiple branching conditions, each channel implements its own rules. Adding a new channel doesn’t mean touching a giant switch-case.

## Connection with Domain-Driven Design

In Domain-Driven Design (DDD), the **domain model encapsulates the core logic**. That means invariants (like “an order can only ship if it is paid”) should live inside the entity itself:

```java
public class Order
{
    public void ship()
    {
        if (!this.isPaid())
        {
            throw new BusinessException("Order must be paid before shipping");
        }

        // proceed with shipping...
    }
}
```

Notice: there’s still an if — but it’s **not scattered across services**. It’s encapsulated in the place where the rule truly belongs: the Order entity.

This is ifless in spirit: **decisions are modeled explicitly in the domain, not left to a god-service to decide.**

## Benefits of the Ifless Principle

1. **Clarity of API:** the method name tells you exactly what it does. No hidden branching.
2. **Reduced test explosion:** each `if` doubles the number of possible execution paths. Removing branches from services simplifies test design. For example, `save()` with insert/update needs at least two scenarios; explicit `insert()` and `update()` operations each have a narrower contract.
3. **Evolution without risk:** as requirements diverge, methods evolve independently. You don’t risk breaking insert logic while changing update.
4. **Alignment with SRP (Single Responsibility Principle):** one method has one reason to change.
5. **Cleaner architecture:** services stay thin, entities stay rich, and decisions are explicit.

## Trade-offs and Counterpoints

No principle is universal. _Ifless_ comes with its own costs:

-   **Verbosity**: You might end up with more methods or services, even when differences are minimal.
-   **Client Burden**: Sometimes, callers just want a convenient `save()`. Exposing too much detail can reduce ergonomics.
-   **Breaking conventions**: Frameworks like Hibernate and Spring Data already assume methods like `save()` or `merge()`. Going against the grain might surprise new developers.

That’s why I see ifless not as a **dogma**, but as a **compass**. Use it when clarity, testability, and explicit design outweigh the convenience of a single method.

## Related Ideas and References

-   [Eric Evans – Domain-Driven Design](https://www.domainlanguage.com/ddd/)
-   [Martin Fowler – Refactoring: Replace Conditional with Polymorphism](https://martinfowler.com/refactoring/replace-conditional-with-polymorphism.html)
-   [Clean Code by Robert C. Martin](https://www.oreilly.com/library/view/clean-code/9780136083238/)
-   [The “UPSERT” debate in SQL](https://en.wikipedia.org/wiki/Merge_\(SQL\)) — convenience vs explicitness.

* * *

## Conclusion

Every if has a cost. Not just in code complexity, but in **testing, maintenance, and evolution**.

The ifless principle is about **making decisions explicit in the design of your API and your domain**. It’s about contracts that express intent without ambiguity.

It doesn’t mean you’ll never write an if. It means your architecture won’t hide them in the wrong places.

**In the age of scaling startups with fewer resources, clarity in design is not a luxury — it’s survival.**
