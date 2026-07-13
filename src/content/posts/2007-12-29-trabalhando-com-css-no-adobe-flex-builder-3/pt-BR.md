---
title: "Trabalhando com CSS no Adobe Flex Builder 3"
description: "Tutorial histórico sobre criação, aplicação e edição visual de estilos CSS em projetos Adobe Flex Builder 3."
permalink: "2007/12/29/trabalhando-com-css-no-adobe-flex-builder-3"
publishedAt: "2007-12-29T03:36:30.000Z"
reviewedAt: "2026-07-11"
language: "pt-BR"
categories: ["Random Thoughts"]
tags: ["CSS"]
draft: false
wordpressId: 135
translationKey: "2007/12/29/trabalhando-com-css-no-adobe-flex-builder-3"
legacyUrl: "https://digows.com/2007/12/29/trabalhando-com-css-no-adobe-flex-builder-3/"
legacy: true
---
No Adobe Flex, separar a lógica da interface das decisões de design ajudava a manter aplicações maiores. O Flex Builder 3 oferecia um editor visual de CSS para criar estilos de componentes sem abandonar o arquivo-fonte.

## Criando o arquivo CSS

1. Crie um projeto usando o Flex SDK 3.
2. Adicione um arquivo CSS ao projeto.
3. No editor visual, escolha **New Style** e selecione o componente que deseja personalizar.

O editor oferecia quatro escopos:

- **All Components:** aplica o estilo a todos os componentes;
- **All Components with style name:** aplica o estilo aos componentes que usam determinado `styleName`;
- **Specific Component:** aplica o estilo a um tipo específico de componente;
- **Specific Component with style name:** combina o tipo do componente com um `styleName`.

As propriedades podiam gerar estilos filhos reutilizáveis. Por exemplo, o estilo da barra de status de um `TitleWindow` também podia ser aplicado a um `Panel`.

> *As capturas do editor visual não estavam mais disponíveis na migração.*

## Adicionando o CSS à aplicação

Inclua o arquivo no documento MXML principal:

```xml
<?xml version="1.0" encoding="utf-8"?>
<mx:Application
    xmlns:mx="http://www.adobe.com/2006/mxml"
    layout="absolute">
    <mx:Style source="styles.css" />
</mx:Application>
```

Ao compilar, o Flex verificava os estilos usados pela aplicação e emitia avisos para declarações não utilizadas. O autocompletar do Flex Builder também ajudava a descobrir as propriedades disponíveis para cada componente.
