---
title: "Um bug no Google?"
description: "Uma curiosidade encontrada em 2007 ao pesquisar uma sequência incomum de números no Google e comparar os resultados exibidos."
permalink: "2007/09/26/um-bug-no-google"
publishedAt: "2007-09-26T02:37:00.000Z"
reviewedAt: "2026-07-11"
language: "pt-BR"
categories: ["Google"]
tags: []
draft: false
wordpressId: 126
translationKey: "2007/09/26/um-bug-no-google"
legacyUrl: "https://digows.com/2007/09/26/um-bug-no-google/"
legacy: true
---
Em 2007, enquanto tentava me distrair de alguns problemas de lógica, fiz buscas no Google usando intervalos numéricos como estes:

```text
123...233
1232...2313
93...786
```

Descobri que o Google interpretava os três pontos como um intervalo e retornava números situados entre os dois valores.

Ao testar acidentalmente apenas dois pontos com intervalos muito maiores, como os exemplos abaixo, o servidor demorava para responder e terminava em uma página 404:

```text
1000000..100000000
1000000..10000031231
10000321..10000031231
```

Na época, pareceu ser um caso de entrada não validada no mecanismo de busca. O comportamento atual pode ser completamente diferente.
