---
title: "Le principe Ifless : concevoir des API sans décisions cachées"
description: "Un principe concret de conception d’API : remplacer les méthodes qui cachent des décisions par des opérations explicites, aux intentions et aux tests plus clairs."
permalink: "2025/09/02/le-principe-ifless-concevoir-des-api-sans-decisions-cachees"
publishedAt: "2025-09-02T19:44:38.000Z"
reviewedAt: "2026-07-12"
language: "fr"
categories: ["Java", "Développement logiciel", "Ingénierie logicielle"]
tags: ["conception d’API", "DDD", "architecture"]
draft: false
translationKey: "2025/09/02/the-ifless-principle-designing-apis-without-hidden-decisions"
translationOf: "2025/09/02/the-ifless-principle-designing-apis-without-hidden-decisions"
legacyUrl: "https://digows.com/2025/09/02/the-ifless-principle-designing-apis-without-hidden-decisions/"
legacy: false
featuredImage: "/images/imported/2025/09/unnamed-d90bb2430f.webp"
editorial:
  quickSummary: "Ifless ne signifie pas interdire les conditions. Il s’agit de confier la décision à celui qui connaît déjà l’intention et de donner à chaque opération un contrat explicite. On obtient des API plus claires, des tests plus ciblés et des comportements capables d’évoluer séparément sans qu’un service doive deviner l’intention de l’appelant."
  keyTakeaways:
    - "Ne demandez pas à un service de déduire un choix que l’appelant a déjà fait."
    - "Séparez les commandes lorsque leurs règles, permissions, échecs ou évolutions diffèrent."
    - "Conservez les véritables invariants dans l’entité, même si leur application exige encore une condition."
  strongestCounterargument: "Des commandes explicites peuvent exposer des détails de persistance ou multiplier les API sans ajouter de sens. Un save conventionnel reste pertinent lorsque création et mise à jour partagent réellement la même sémantique et que l’appelant ne doit pas contrôler le cycle de vie."
  appliesWhen: ["L’appelant connaît déjà l’opération qu’il veut exécuter", "Les branches ont des règles ou autorisations différentes", "Une méthode générique accumule les flags et les modes"]
  doesNotApplyWhen: ["La distinction n’est qu’un détail d’implémentation interne", "Le contrat conventionnel du framework est plus clair", "Séparer les opérations exposerait un choix invalide du domaine"]
  discussionPrompt:
    key: "ifless-hidden-decision.v1"
    text: "Quelle méthode de votre base de code cache une décision que son appelant connaît déjà ?"
  glossary:
    - { term: "Décision cachée", definition: "Une branche déduite à l’intérieur d’une API alors que l’appelant connaît déjà l’opération souhaitée." }
    - { term: "Invariant de domaine", definition: "Une règle qui doit rester vraie pour qu’un objet du domaine soit valide." }
    - { term: "Commande", definition: "Une demande explicite d’exécuter une opération significative du domaine." }
  relatedTranslationKeys: ["2025/08/27/nine-women-cant-make-one-baby-why-smaller-software-teams-deliver-more", "2026/05/20/the-high-individual-contributor-in-the-age-of-ai-agents"]
  interactiveExperience: "find-hidden-decision"
  copyReviewed: true
---
## Introduction

L’une des lignes de code les plus dangereuses n’est pas celle qui lève une exception, mais celle qui cache une décision.

En tant qu’ingénieurs, nous apprécions souvent les méthodes _flexibles_ : un unique `save()` qui sait « magiquement » quand insérer ou mettre à jour, un `send()` qui choisit le bon canal ou un `approveOrReject()` qui décide du résultat. Cela semble d’abord pratique. Mais derrière cette commodité grandissent la complexité, l’ambiguïté et une armée de conditions.

Le problème des trop nombreux `if` ne se limite pas à la lisibilité. Chaque scénario supplémentaire doit être conçu, testé et maintenu. Ce qui ressemble à « une condition de plus » peut faire croître le coût de façon exponentielle.

Avec le temps, j’ai adopté une approche que j’appelle le **principe ifless** : au lieu d’enfouir les décisions dans le code, nous les rendons explicites dans la conception de l’API et dans le domaine lui-même.

## Le principe Ifless

L’idée est simple :

- **ne laissez pas le service décider ce que l’appelant sait déjà ;**
- représentez des opérations différentes par **des méthodes, commandes ou entités différentes**, même si leur comportement est d’abord identique ;
- placez l’intelligence dans **des entités de domaine riches**, conformément au Domain-Driven Design, afin que les règles vivent au bon endroit.

En bref : **ifless ne consiste pas à supprimer les conditions, mais à placer les décisions au bon endroit.**

## Exemple 1 : enregistrer ou insérer/mettre à jour

### ❌ Version chargée de décisions

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

### ✅ Version ifless

```java
public void insert(Order order) { ... }
public void update(Order order) { ... }
```

Même si les méthodes sont identiques aujourd’hui, la conception anticipe que l’insertion et la mise à jour pourront évoluer différemment. Surtout, l’appelant connaît l’intention : le service n’a pas à la deviner.

## Exemple 2 : approbations

### ❌ Décision cachée dans le service

```java
public void approveOrReject(Transaction transaction, boolean approve)
{
    if (approve) { ... } else { ... }
}
```

### ✅ API ifless

```java
public void approve(Transaction transaction) { ... }
public void reject(Transaction transaction) { ... }
```

Chaque opération possède son propre cycle de vie, ses règles et son évolution. Les tests sont plus ciblés et l’API exprime clairement l’intention.

## Exemple 3 : notifications

### ❌ Sélection conditionnelle du canal

```java
notificationService.send(user, message, channel);
```

### ✅ Séparation ifless

```java
emailNotification.send(user, message);
smsNotification.send(user, message);
pushNotification.send(user, message);
```

Au lieu d’une méthode à multiples branches, chaque canal applique ses propres règles. Ajouter un canal ne demande plus de modifier un immense `switch`.

## Lien avec le Domain-Driven Design

En DDD, le **modèle de domaine encapsule la logique centrale**. Les invariants — par exemple « une commande ne peut être expédiée qu’après son paiement » — doivent vivre dans l’entité elle-même :

```java
public class Order
{
    public void ship()
    {
        if (!this.isPaid())
        {
            throw new BusinessException("Order must be paid before shipping");
        }

        // Poursuivre l’expédition.
    }
}
```

Il reste un `if`, mais il n’est pas dispersé entre plusieurs services. La règle est encapsulée là où elle appartient vraiment : dans l’entité `Order`.

C’est l’esprit ifless : **les décisions sont modélisées explicitement dans le domaine, et non déléguées à un service omniscient.**

## Bénéfices

1. **Des API plus claires :** le nom de la méthode indique précisément ce qu’elle fait.
2. **Moins d’explosion combinatoire dans les tests :** chaque opération possède des chemins plus ciblés.
3. **Une évolution moins risquée :** insertion et mise à jour peuvent changer séparément.
4. **Un meilleur alignement avec le principe de responsabilité unique :** chaque méthode a une raison claire de changer.
5. **Une architecture plus propre :** les services restent minces, les entités riches et les décisions explicites.

## Limites et contrepoints

Aucun principe n’est universel. Ifless a aussi un coût :

- **verbosité :** davantage de méthodes ou de services peuvent apparaître, même lorsque les différences sont faibles ;
- **charge pour le client :** l’appelant peut réellement préférer l’ergonomie d’un `save()` ;
- **conventions existantes :** Hibernate et Spring Data utilisent déjà `save()` et `merge()`, et s’en écarter peut surprendre l’équipe.

Je considère donc ifless comme une **boussole**, pas comme un dogme. Utilisez-le lorsque la clarté, la testabilité et l’intention explicite valent davantage que la commodité d’une méthode générique.

## Références

- [Eric Evans — Domain-Driven Design](https://www.domainlanguage.com/ddd/)
- [Martin Fowler — Replace Conditional with Polymorphism](https://martinfowler.com/refactoring/replace-conditional-with-polymorphism.html)
- [Clean Code, de Robert C. Martin](https://www.oreilly.com/library/view/clean-code/9780136083238/)
- [Le débat sur UPSERT en SQL](https://en.wikipedia.org/wiki/Merge_(SQL))

## Conclusion

Chaque `if` a un coût, non seulement en complexité, mais aussi en tests, en maintenance et en évolution.

Le principe ifless consiste à **rendre les décisions explicites dans la conception de l’API et du domaine**. Il produit des contrats qui expriment l’intention sans ambiguïté.

Il ne signifie pas que vous n’écrirez plus jamais de condition. Il empêche l’architecture de les cacher aux mauvais endroits.

**À une époque où les entreprises doivent évoluer avec moins de ressources, la clarté de conception n’est pas un luxe : c’est une condition de survie.**
