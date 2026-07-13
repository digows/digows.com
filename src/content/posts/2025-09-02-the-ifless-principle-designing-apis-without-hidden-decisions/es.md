---
title: "El principio Ifless: diseñar APIs sin decisiones ocultas"
description: "Un principio práctico de diseño de APIs: sustituir métodos que ocultan decisiones por operaciones explícitas, con intención y pruebas más claras."
permalink: "2025/09/02/el-principio-ifless-disenar-apis-sin-decisiones-ocultas"
publishedAt: "2025-09-02T19:44:38.000Z"
reviewedAt: "2026-07-12"
language: "es"
categories: ["Java", "Desarrollo de software", "Ingeniería de software"]
tags: ["diseño de APIs", "DDD", "arquitectura"]
draft: false
translationKey: "2025/09/02/the-ifless-principle-designing-apis-without-hidden-decisions"
translationOf: "2025/09/02/the-ifless-principle-designing-apis-without-hidden-decisions"
legacyUrl: "https://digows.com/2025/09/02/the-ifless-principle-designing-apis-without-hidden-decisions/"
legacy: false
featuredImage: "/images/imported/2025/09/unnamed-d90bb2430f.webp"
editorial:
  quickSummary: "Ifless no significa prohibir los condicionales. Significa trasladar la decisión a quien ya conoce la intención y dar a cada operación un contrato explícito. El resultado son APIs más claras, pruebas más acotadas y comportamientos que evolucionan por separado sin que un servicio tenga que adivinar qué quiso hacer el llamador."
  keyTakeaways:
    - "No hagas que un servicio infiera una elección que el llamador ya tomó."
    - "Separa comandos cuando sus reglas, permisos, fallos o evolución futura sean diferentes."
    - "Mantén las verdaderas invariantes dentro de la entidad, aunque aplicarlas todavía requiera un condicional."
  strongestCounterargument: "Los comandos explícitos pueden exponer detalles de persistencia o multiplicar una API sin aportar significado. Un save convencional sigue siendo adecuado cuando crear y actualizar comparten realmente la misma semántica y el llamador no debería controlar el ciclo de vida."
  appliesWhen: ["El llamador ya sabe qué operación quiere ejecutar", "Las ramas tienen reglas o autorizaciones diferentes", "Un método genérico acumula flags y modos"]
  doesNotApplyWhen: ["La distinción es solo un detalle interno de implementación", "El contrato convencional del framework resulta más claro", "Separar operaciones expondría una elección inválida del dominio"]
  discussionPrompt:
    key: "ifless-hidden-decision.v1"
    text: "¿Qué método de tu base de código actual oculta una decisión que el llamador ya conoce?"
  glossary:
    - { term: "Decisión oculta", definition: "Una bifurcación inferida dentro de una API aunque el llamador ya conozca la operación deseada." }
    - { term: "Invariante de dominio", definition: "Una regla que debe seguir siendo verdadera para que un objeto de dominio sea válido." }
    - { term: "Comando", definition: "Una solicitud explícita para ejecutar una operación significativa del dominio." }
  relatedTranslationKeys: ["2025/08/27/nine-women-cant-make-one-baby-why-smaller-software-teams-deliver-more", "2026/05/20/the-high-individual-contributor-in-the-age-of-ai-agents"]
  interactiveExperience: "find-hidden-decision"
  copyReviewed: true
---
## Introducción

Una de las líneas de código más peligrosas no es la que lanza una excepción, sino la que oculta una decisión.

Como ingenieros, a menudo celebramos los métodos _flexibles_: un único `save()` que «mágicamente» sabe cuándo insertar o actualizar, un `send()` que elige el canal correcto o un `approveOrReject()` que decide el resultado. Al principio parece cómodo. Pero detrás de esa comodidad crecen la complejidad, la ambigüedad y un ejército de condicionales.

El problema de tener demasiados `if` no se limita a la legibilidad. Cada escenario adicional debe diseñarse, probarse y mantenerse. Lo que parece «solo una condición más» puede aumentar el coste de forma exponencial.

Con el tiempo adopté un enfoque que llamo **principio ifless**: en lugar de enterrar decisiones en el código, las hacemos explícitas en el diseño de la API y en el propio dominio.

## El principio Ifless

La idea es sencilla:

- **no dejes que el servicio decida lo que el llamador ya sabe;**
- representa operaciones diferentes mediante **métodos, comandos o entidades diferentes**, aunque al principio compartan comportamiento;
- coloca la inteligencia en **entidades de dominio ricas**, siguiendo Domain-Driven Design, para que las reglas vivan donde corresponden.

En resumen: **ifless no consiste en eliminar condicionales, sino en situar las decisiones en el lugar correcto.**

## Ejemplo 1: guardar o insertar/actualizar

### ❌ Versión cargada de decisiones

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

### ✅ Versión ifless

```java
public void insert(Order order) { ... }
public void update(Order order) { ... }
```

Aunque hoy ambos métodos sean idénticos, el diseño anticipa que la inserción y la actualización pueden evolucionar de manera diferente. Y, sobre todo, el llamador conoce la intención: el servicio no necesita adivinarla.

## Ejemplo 2: aprobaciones

### ❌ Decisión oculta en el servicio

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

Cada operación obtiene su propio ciclo de vida, reglas y camino de evolución. Las pruebas son más específicas y la API expresa con claridad la intención.

## Ejemplo 3: notificaciones

### ❌ Selección condicional del canal

```java
notificationService.send(user, message, channel);
```

### ✅ Separación ifless

```java
emailNotification.send(user, message);
smsNotification.send(user, message);
pushNotification.send(user, message);
```

En lugar de un método con varias bifurcaciones, cada canal implementa sus propias reglas. Añadir un canal ya no exige modificar un enorme `switch`.

## Relación con Domain-Driven Design

En DDD, el **modelo de dominio encapsula la lógica central**. Las invariantes —como «un pedido solo puede enviarse después de haber sido pagado»— deben vivir en la propia entidad:

```java
public class Order
{
    public void ship()
    {
        if (!this.isPaid())
        {
            throw new BusinessException("Order must be paid before shipping");
        }

        // Continuar con el envío.
    }
}
```

Todavía existe un `if`, pero no está disperso entre varios servicios. La regla queda encapsulada donde realmente pertenece: en la entidad `Order`.

Eso es ifless en esencia: **las decisiones se modelan explícitamente en el dominio, en vez de delegarse a un servicio omnisciente.**

## Beneficios

1. **APIs más claras:** el nombre del método indica exactamente qué hace.
2. **Menor explosión combinatoria en las pruebas:** cada operación tiene caminos más acotados.
3. **Evolución con menos riesgo:** inserción y actualización pueden cambiar por separado.
4. **Alineación con el principio de responsabilidad única:** cada método tiene una razón clara para cambiar.
5. **Arquitectura más limpia:** los servicios permanecen delgados, las entidades son ricas y las decisiones se hacen explícitas.

## Límites y contrapuntos

Ningún principio es universal. Ifless también tiene costes:

- **verbosidad:** pueden aparecer más métodos o servicios incluso cuando las diferencias son pequeñas;
- **carga para el cliente:** a veces el llamador prefiere de verdad la ergonomía de un `save()`;
- **convenciones existentes:** Hibernate y Spring Data ya adoptan métodos como `save()` y `merge()`, y apartarse de la convención puede sorprender al equipo.

Por eso considero ifless una **brújula**, no un dogma. Úsalo cuando la claridad, la capacidad de prueba y la intención explícita valgan más que la comodidad de un método genérico.

## Referencias relacionadas

- [Eric Evans — Domain-Driven Design](https://www.domainlanguage.com/ddd/)
- [Martin Fowler — Replace Conditional with Polymorphism](https://martinfowler.com/refactoring/replace-conditional-with-polymorphism.html)
- [Clean Code, de Robert C. Martin](https://www.oreilly.com/library/view/clean-code/9780136083238/)
- [El debate sobre UPSERT en SQL](https://en.wikipedia.org/wiki/Merge_(SQL))

## Conclusión

Cada `if` tiene un coste, no solo en complejidad, sino también en pruebas, mantenimiento y evolución.

El principio ifless consiste en **hacer explícitas las decisiones en el diseño de la API y del dominio**. Produce contratos que expresan intención sin ambigüedad.

No significa no volver a escribir nunca un condicional. Significa impedir que la arquitectura los oculte en lugares equivocados.

**En una época en la que las empresas necesitan escalar con menos recursos, la claridad de diseño no es un lujo: es supervivencia.**
