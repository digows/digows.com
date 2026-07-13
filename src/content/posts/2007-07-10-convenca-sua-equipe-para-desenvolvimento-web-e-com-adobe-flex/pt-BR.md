---
title: "Como apresentar o Adobe Flex à sua equipe"
description: "Argumentos históricos, escritos em 2007, sobre adoção do Adobe Flex 2 para aplicações web ricas no ambiente corporativo."
permalink: "2007/07/10/convenca-sua-equipe-para-desenvolvimento-web-e-com-adobe-flex"
publishedAt: "2007-07-10T11:15:00.000Z"
reviewedAt: "2026-07-11"
language: "pt-BR"
categories: ["Software Development"]
tags: []
draft: false
wordpressId: 125
translationKey: "2007/07/10/convenca-sua-equipe-para-desenvolvimento-web-e-com-adobe-flex"
legacyUrl: "https://digows.com/2007/07/10/convenca-sua-equipe-para-desenvolvimento-web-e-com-adobe-flex/"
legacy: true
---
Em 2007, depois de propor uma solução com Adobe Flex no trabalho, precisei explicar à equipe por que a tecnologia poderia ser adequada. Este texto reorganiza os argumentos que apresentei naquele momento.

> **Contexto histórico:** os dados de licenciamento, preços, participação do Flash Player e produtos citados refletem 2007. Adobe Flex e Flash Player foram descontinuados e este artigo não é uma recomendação de tecnologia atual.

## O que era o Adobe Flex 2

Criado originalmente pela Macromedia e depois mantido pela Adobe, o Flex era um SDK para aplicações ricas de internet, ou RIAs. A interface era escrita em MXML e ActionScript, compilada para SWF e executada pelo Flash Player.

O SDK podia ser baixado e usado gratuitamente. Em 2007, a Adobe anunciou a abertura do SDK e do compilador `mxmlc` sob a Mozilla Public License. O Flex Builder, IDE baseada no Eclipse, e determinados componentes comerciais, como Flex Charts, continuavam pagos.

## O lado servidor

Flex cuidava da camada de apresentação e não exigia, por si só, um servidor específico. A aplicação podia consumir serviços em Java, PHP, ASP.NET, ColdFusion e outras plataformas por HTTP, web services, RPC ou AMF. Projetos como Granite Data Services e OpenAMF ofereciam integrações no lado servidor.

## Argumentos favoráveis na época

Comparado às interfaces HTML e JSP de 2007, o Flex prometia:

- uma interface consistente entre navegadores por executar sobre o Flash Player;
- desenvolvimento visual mais rápido com o Flex Builder;
- componentes interativos e uma experiência próxima à de aplicações desktop;
- comunicação por XML, web services, RPC e o protocolo binário AMF;
- integração com servidores Java EE;
- SDK aberto, documentação extensa e uma comunidade em crescimento.

Em comparação com OpenLaszlo, eu destacava a existência de uma IDE dedicada, a variedade de protocolos, a possibilidade de compilar antes da publicação e o suporte comercial da Adobe.

## O que faltava no argumento original

O documento era deliberadamente favorável e subestimava custos importantes: dependência de um plugin proprietário no cliente, acessibilidade, desempenho, segurança, tamanho dos arquivos SWF, indexação do conteúdo e risco de plataforma. Esses limites se tornaram decisivos com a evolução dos padrões nativos da web.

Preservar o texto hoje é útil menos como recomendação e mais como fotografia de uma decisão arquitetural em 2007.
