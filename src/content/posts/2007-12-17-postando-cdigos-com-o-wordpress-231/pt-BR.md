---
title: "Publicando código no WordPress 2.3.1"
description: "Registro de 2007 sobre a configuração de syntax highlighting no WordPress 2.3.1 com o plugin iG:Syntax Hiliter."
permalink: "2007/12/17/postando-cdigos-com-o-wordpress-231"
publishedAt: "2007-12-17T23:50:51.000Z"
reviewedAt: "2026-07-11"
language: "pt-BR"
categories: ["Random Thoughts"]
tags: ["Vários"]
draft: false
wordpressId: 9
translationKey: "2007/12/17/postando-cdigos-com-o-wordpress-231"
legacyUrl: "https://digows.com/2007/12/17/postando-cdigos-com-o-wordpress-231/"
legacy: true
---
Em 2007, um dos motivos para migrar do Blogspot para o WordPress era poder publicar código com syntax highlighting. Encontrar um plugin compatível com o WordPress 2.3.1 não foi simples.

Por indicação do colega [Ebertom](http://blog.flexdev.com.br/), cheguei ao **[iG:Syntax Hiliter v3.5](http://www.igeek.info/download.php?file=1)**.

Depois de instalar o plugin, bastava envolver o trecho com a tag correspondente à linguagem. Este era o exemplo usado para XML:

```xml
<root>
  <example />
</root>
```

O plugin também aceitava configurações de linguagem no próprio marcador. Os exemplos abaixo foram preservados porque documentam a sintaxe usada naquela versão do WordPress:

```text
[sourcecode language="xml"]
<!-- XML aqui -->
[/sourcecode]
```

```text
[sourcecode language="java"]
// Java aqui
[/sourcecode]
```
