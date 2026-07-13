---
title: "Ifless 原则：设计不隐藏决策的 API"
description: "一项务实的 API 设计原则：用意图明确的操作替代隐藏分支决策的方法，让契约与测试更加清晰。"
permalink: "2025/09/02/ifless-principle-designing-apis-without-hidden-decisions"
publishedAt: "2025-09-02T19:44:38.000Z"
reviewedAt: "2026-07-12"
language: "zh-Hans"
categories: ["Java", "软件开发", "软件工程"]
tags: ["API 设计", "DDD", "架构"]
draft: false
translationKey: "2025/09/02/the-ifless-principle-designing-apis-without-hidden-decisions"
translationOf: "2025/09/02/the-ifless-principle-designing-apis-without-hidden-decisions"
legacyUrl: "https://digows.com/2025/09/02/the-ifless-principle-designing-apis-without-hidden-decisions/"
legacy: false
featuredImage: "/images/imported/2025/09/unnamed-d90bb2430f.webp"
editorial:
  quickSummary: "Ifless 并不是禁止条件判断，而是把决策交给已经知道意图的一方，并让每项操作拥有明确的契约。这样得到的 API 更清晰、测试范围更小，不同行为也能独立演进，而不必由服务猜测调用方究竟想做什么。"
  keyTakeaways:
    - "不要让服务推断调用方已经做出的选择。"
    - "当规则、权限、失败方式或未来演进不同，应拆分为不同命令。"
    - "真正的领域不变量应留在实体内部，即使执行它仍然需要条件判断。"
  strongestCounterargument: "显式命令可能泄露持久化细节，或在没有增加语义的情况下扩张 API。如果创建与更新确实具有相同语义，而且调用方不应控制生命周期，那么传统的 save 操作仍然合适。"
  appliesWhen: ["调用方已经知道自己要执行哪项操作", "不同分支具有不同规则或授权", "一个通用方法不断积累标志和模式"]
  doesNotApplyWhen: ["区别只是内部实现细节", "框架的常规契约对使用者更清楚", "拆分操作会暴露无效的领域选择"]
  discussionPrompt:
    key: "ifless-hidden-decision.v1"
    text: "你当前代码库中的哪个方法，隐藏了调用方其实已经知道的决策？"
  glossary:
    - { term: "隐藏的决策", definition: "调用方已经知道目标操作，API 内部却仍然通过分支去推断它。" }
    - { term: "领域不变量", definition: "为了让领域对象保持有效而必须始终成立的规则。" }
    - { term: "命令", definition: "对一项有明确领域意义的操作所发出的显式请求。" }
  relatedTranslationKeys: ["2025/08/27/nine-women-cant-make-one-baby-why-smaller-software-teams-deliver-more", "2026/05/20/the-high-individual-contributor-in-the-age-of-ai-agents"]
  interactiveExperience: "find-hidden-decision"
  copyReviewed: true
---
## 引言

最危险的代码行之一，并不是抛出异常的那一行，而是隐藏了一个决策的那一行。

工程师常常欣赏所谓的“灵活”方法：一个 `save()` 能“神奇地”知道何时插入、何时更新；一个 `send()` 会选择正确的渠道；一个 `approveOrReject()` 会决定最终结果。开始时，这很方便。但这种方便背后，会不断积累复杂性、歧义，以及越来越多的条件判断。

过多 `if` 的问题不只是可读性。每增加一种场景，团队都必须设计、测试并维护它。看起来“只多一个条件”，成本却可能呈指数增长。

这些年，我逐渐采用了一种称为 **ifless 原则**的设计方式：不把决策埋进代码，而是在 API 与领域设计中把决策明确表达出来。

## Ifless 原则

想法很简单：

- **不要让服务决定调用方已经知道的事情；**
- 用**不同的方法、命令或实体**表达不同操作，即使它们一开始共享相同实现；
- 按照领域驱动设计，把智能放入**丰富的领域实体**，让规则待在真正属于它的位置。

简而言之：**ifless 不是消灭 `if`，而是把决策放在正确的位置。**

## 示例一：保存，还是插入/更新

### ❌ 隐藏决策的版本

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

### ✅ Ifless 版本

```java
public void insert(Order order) { ... }
public void update(Order order) { ... }
```

即使两个方法今天的实现完全相同，这个设计也预见到插入和更新将来可能朝不同方向演进。更重要的是，调用方已经知道意图，所以服务不必猜测。

## 示例二：审批

### ❌ 服务内部隐藏决策

```java
public void approveOrReject(Transaction transaction, boolean approve)
{
    if (approve) { ... } else { ... }
}
```

### ✅ Ifless API

```java
public void approve(Transaction transaction) { ... }
public void reject(Transaction transaction) { ... }
```

每项操作都有自己的生命周期、规则和演进路径。测试会更聚焦，API 也能清楚表达意图。

## 示例三：通知

### ❌ 通过条件选择渠道

```java
notificationService.send(user, message, channel);
```

### ✅ Ifless 拆分

```java
emailNotification.send(user, message);
smsNotification.send(user, message);
pushNotification.send(user, message);
```

每个渠道各自实现规则，而不是让一个方法包含多处分支。新增渠道也不再意味着修改一个巨大的 `switch`。

## 与领域驱动设计的关系

在 DDD 中，**领域模型封装核心逻辑**。不变量——例如“订单只有在付款后才能发货”——应当位于实体自身：

```java
public class Order
{
    public void ship()
    {
        if (!this.isPaid())
        {
            throw new BusinessException("Order must be paid before shipping");
        }

        // 继续发货。
    }
}
```

这里仍然有一个 `if`，但它没有散落在多个服务中。规则被封装在真正属于它的位置：`Order` 实体。

这就是 ifless 的精神：**在领域中明确建模决策，而不是让一个无所不知的服务代为决定。**

## 收益

1. **API 更清楚：**方法名准确说明它要做什么。
2. **减少测试路径爆炸：**每项操作的执行路径更聚焦。
3. **演进风险更低：**插入与更新可以独立改变。
4. **符合单一职责原则：**每个方法都有清晰的变化理由。
5. **架构更干净：**服务保持轻薄，实体更丰富，决策也更加明确。

## 局限与反方观点

没有任何原则适用于所有情况。Ifless 也有自己的成本：

- **冗长：**即使差异很小，也可能产生更多方法或服务；
- **客户端负担：**调用方有时确实只想使用方便的 `save()`；
- **已有惯例：**Hibernate 和 Spring Data 已经采用 `save()`、`merge()` 等方法，偏离惯例可能让新成员困惑。

因此，我把 ifless 看作**指南针，而不是教条**。当清晰度、可测试性和明确意图比单个通用方法的便利性更重要时，再使用它。

## 相关参考

- [Eric Evans — Domain-Driven Design](https://www.domainlanguage.com/ddd/)
- [Martin Fowler — Replace Conditional with Polymorphism](https://martinfowler.com/refactoring/replace-conditional-with-polymorphism.html)
- [Robert C. Martin 的 Clean Code](https://www.oreilly.com/library/view/clean-code/9780136083238/)
- [SQL 中关于 UPSERT 的讨论](https://en.wikipedia.org/wiki/Merge_(SQL))

## 结论

每个 `if` 都有成本——不仅是代码复杂度，还有测试、维护和演进成本。

Ifless 原则的核心，是**在 API 与领域设计中明确表达决策**，让契约无歧义地说明意图。

它不意味着你永远不再写条件判断，而是让架构不再把条件隐藏在错误的位置。

**在创业公司需要用更少资源实现增长的时代，清晰的设计不是奢侈品，而是生存条件。**
