---
title: "Flex: um chat simples em menos de 20 linhas"
description: "Tutorial histórico de mensageria com Adobe Flex e BlazeDS; parte do código original não estava presente no arquivo exportado pelo WordPress."
permalink: "2009/01/13/flex-um-chat-simples-em-menos-de-20-linhas"
publishedAt: "2009-01-14T01:18:44.000Z"
reviewedAt: "2026-07-11"
language: "pt-BR"
categories: ["Java"]
tags: ["Messaging"]
draft: false
wordpressId: 144
translationKey: "2009/01/13/flex-um-chat-simples-em-menos-de-20-linhas"
legacyUrl: "https://digows.com/2009/01/13/flex-um-chat-simples-em-menos-de-20-linhas/"
legacy: true
featuredImage: "/images/imported/2009/01/chatapp-2ca0944ea1.webp"
---
Uma das características marcantes do Adobe Flex era a facilidade de usar serviços de mensageria. No cliente, os componentes `<mx:Producer />` e `<mx:Consumer />` abstraíam boa parte da comunicação com um serviço de dados no back-end.

No ecossistema Java, opções comuns eram LiveCycle Data Services e o open source BlazeDS. Este exemplo usava **Java com BlazeDS** para criar um chat cuja interface Flex tinha menos de 20 linhas de código — sem contar a configuração do servidor.

## Estrutura original do exemplo

1. Configurar, no `services-config.xml`, um canal de streaming ou um canal AMF com polling.
2. Criar um `destination` chamado `chatMessage` no `messaging-config.xml`.
3. Registrar a configuração de mensageria no BlazeDS.
4. Criar a interface com um `Producer` para enviar mensagens e um `Consumer` para recebê-las.
5. Iniciar o servidor web e abrir o chat em dois navegadores ou sessões diferentes.

> **Código parcialmente indisponível:** o arquivo exportado pelo WordPress e a página pública atual contêm os blocos de configuração e de MXML vazios. Como o conteúdo não pôde ser verificado, não reconstruí nem inventei os trechos ausentes.

<img src="/images/imported/2009/01/chatapp-2ca0944ea1.webp" alt="Interface do ChatApp original" width="630" height="480" loading="eager" fetchpriority="high" decoding="async">
