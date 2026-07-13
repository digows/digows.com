---
title: "O princípio Ifless: projetando APIs sem decisões ocultas"
description: "Um princípio prático de design de APIs: substituir métodos que escondem decisões por operações explícitas, com intenção e testes mais claros."
permalink: "2025/09/02/o-principio-ifless-projetando-apis-sem-decisoes-ocultas"
publishedAt: "2025-09-02T19:44:38.000Z"
reviewedAt: "2026-07-11"
language: "pt-BR"
categories: ["Java","Desenvolvimento de Software","Engenharia de Software"]
tags: ["design de APIs","DDD","arquitetura"]
draft: false
translationKey: "2025/09/02/the-ifless-principle-designing-apis-without-hidden-decisions"
translationOf: "2025/09/02/the-ifless-principle-designing-apis-without-hidden-decisions"
legacyUrl: "https://digows.com/2025/09/02/the-ifless-principle-designing-apis-without-hidden-decisions/"
legacy: false
featuredImage: "/images/imported/2025/09/unnamed-d90bb2430f.webp"
editorial:
  quickSummary: "Ifless não significa proibir condicionais. Significa mover a decisão para quem já conhece a intenção e dar a cada operação um contrato explícito. O resultado são APIs mais claras, testes menores e comportamentos que evoluem separadamente sem um serviço precisar adivinhar o que o chamador quis fazer."
  keyTakeaways:
    - "Não faça um serviço inferir uma escolha que o chamador já realizou."
    - "Separe comandos quando regras, permissões, falhas ou evolução futura forem diferentes."
    - "Mantenha invariantes reais dentro da entidade, mesmo que aplicá-las ainda exija uma condicional."
  strongestCounterargument: "Comandos explícitos podem expor detalhes de persistência ou multiplicar uma API sem acrescentar significado. Um save convencional continua adequado quando criar e atualizar possuem a mesma semântica e o chamador não deveria controlar o ciclo de vida."
  appliesWhen: ["O chamador já sabe qual operação deseja executar", "Os ramos têm regras ou autorizações diferentes", "Um método genérico acumula flags e modos"]
  doesNotApplyWhen: ["A distinção é apenas detalhe interno de implementação", "O contrato convencional do framework é mais claro", "Separar operações exporia uma escolha inválida do domínio"]
  discussionPrompt:
    key: "ifless-hidden-decision.v1"
    text: "Qual método na sua base atual esconde uma decisão que o chamador já conhece?"
  glossary:
    - { term: "Decisão oculta", definition: "Desvio inferido dentro da API apesar de o chamador já conhecer a operação pretendida." }
    - { term: "Invariante de domínio", definition: "Regra que precisa continuar verdadeira para um objeto do domínio ser válido." }
    - { term: "Comando", definition: "Solicitação explícita para executar uma operação significativa do domínio." }
  relatedTranslationKeys: ["2025/08/27/nine-women-cant-make-one-baby-why-smaller-software-teams-deliver-more", "2026/05/20/the-high-individual-contributor-in-the-age-of-ai-agents"]
  interactiveExperience: "find-hidden-decision"
  copyReviewed: true
---
## Introdução

Uma das linhas de código mais perigosas não é aquela que lança uma exceção — é aquela que esconde uma decisão.

Como engenheiros, muitas vezes celebramos métodos _flexíveis_: um único `save()` que “magicamente” sabe quando inserir ou atualizar, um `send()` que escolhe o canal correto ou um `approveOrReject()` que decide o resultado. No início isso parece conveniente. Mas, por trás da conveniência, crescem a complexidade, a ambiguidade e um exército de condicionais.

O problema de ter muitos `if` não se limita à legibilidade. Cada cenário adicional precisa ser projetado, testado e mantido. O que parece ser “apenas mais uma condição” pode aumentar o custo de forma exponencial.

Com o tempo, adotei uma abordagem que chamo de **princípio ifless**: em vez de enterrar decisões no código, tornamos essas decisões explícitas no design da API e no próprio domínio.

## O princípio Ifless

A ideia é simples:

- **não deixe o serviço decidir aquilo que o chamador já sabe;**
- represente operações diferentes como **métodos, comandos ou entidades diferentes**, mesmo que inicialmente compartilhem comportamento;
- coloque a inteligência em **entidades de domínio ricas**, seguindo Domain-Driven Design, para que as regras vivam no lugar correto.

Em resumo: **ifless não significa eliminar condicionais, mas colocar as decisões no lugar certo.**

## Exemplo 1: salvar ou inserir/atualizar

### ❌ Versão carregada de decisões

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

### ✅ Versão ifless

```java
public void insert(Order order) { ... }
public void update(Order order) { ... }
```

Mesmo que os métodos sejam idênticos hoje, o design antecipa que inserção e atualização podem evoluir de maneiras diferentes. Mais importante: o chamador conhece a intenção, portanto o serviço não precisa adivinhá-la.

## Exemplo 2: aprovações

### ❌ Decisão escondida no serviço

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

Cada operação ganha seu próprio ciclo de vida, regras e caminho de evolução. Os testes ficam mais específicos e a API expressa claramente a intenção.

## Exemplo 3: notificações

### ❌ Seleção condicional de canal

```java
notificationService.send(user, message, channel);
```

### ✅ Separação ifless

```java
emailNotification.send(user, message);
smsNotification.send(user, message);
pushNotification.send(user, message);
```

Em vez de um método com vários desvios, cada canal implementa suas próprias regras. Adicionar um novo canal não exige alterar um enorme `switch`.

## Conexão com Domain-Driven Design

Em DDD, o **modelo de domínio encapsula a lógica central**. Invariantes — como “um pedido só pode ser enviado depois de pago” — devem viver na própria entidade:

```java
public class Order
{
    public void ship()
    {
        if (!this.isPaid())
        {
            throw new BusinessException("Order must be paid before shipping");
        }

        // Continue o envio.
    }
}
```

Ainda existe um `if`, mas ele não está espalhado por vários serviços. A regra está encapsulada onde realmente pertence: na entidade `Order`.

Isso é ifless em essência: **as decisões são modeladas explicitamente no domínio, não delegadas a um serviço onisciente.**

## Benefícios

1. **APIs mais claras:** o nome do método informa exatamente o que ele faz.
2. **Menos explosão combinatória nos testes:** cada operação possui caminhos mais focados.
3. **Evolução com menos risco:** inserção e atualização podem mudar separadamente.
4. **Alinhamento com o princípio da responsabilidade única:** cada método tem uma razão clara para mudar.
5. **Arquitetura mais limpa:** serviços permanecem finos, entidades ficam ricas e decisões se tornam explícitas.

## Limites e contrapontos

Nenhum princípio é universal. Ifless também tem custos:

- **verbosidade:** podem surgir mais métodos ou serviços, mesmo quando as diferenças são pequenas;
- **carga para o cliente:** às vezes o chamador realmente prefere a ergonomia de um `save()`;
- **convenções existentes:** Hibernate e Spring Data já adotam métodos como `save()` e `merge()`, e contrariar a convenção pode surpreender a equipe.

Por isso, vejo ifless como uma **bússola**, não como dogma. Use-o quando clareza, testabilidade e intenção explícita forem mais valiosas que a conveniência de um método genérico.

## Referências relacionadas

- [Eric Evans — Domain-Driven Design](https://www.domainlanguage.com/ddd/)
- [Martin Fowler — Replace Conditional with Polymorphism](https://martinfowler.com/refactoring/replace-conditional-with-polymorphism.html)
- [Clean Code, de Robert C. Martin](https://www.oreilly.com/library/view/clean-code/9780136083238/)
- [O debate sobre UPSERT em SQL](https://en.wikipedia.org/wiki/Merge_(SQL))

## Conclusão

Todo `if` tem um custo — não apenas em complexidade, mas também em testes, manutenção e evolução.

O princípio ifless consiste em **tornar decisões explícitas no design da API e do domínio**. Ele produz contratos que expressam intenção sem ambiguidade.

Não significa nunca escrever uma condicional. Significa impedir que a arquitetura esconda condicionais nos lugares errados.

**Na era de empresas que precisam escalar com menos recursos, clareza de design não é luxo — é sobrevivência.**
