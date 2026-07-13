---
title: "Flex: A Simple Chat in Fewer Than 20 Lines"
description: "A historical messaging tutorial with Adobe Flex and BlazeDS; part of the original source code was missing from the WordPress export."
permalink: "2009/01/13/flex-a-simple-chat-in-fewer-than-20-lines"
publishedAt: "2009-01-14T01:18:44.000Z"
reviewedAt: "2026-07-11"
language: "en"
categories: ["Java"]
tags: ["Messaging"]
draft: false
translationKey: "2009/01/13/flex-um-chat-simples-em-menos-de-20-linhas"
translationOf: "2009/01/13/flex-um-chat-simples-em-menos-de-20-linhas"
legacyUrl: "https://digows.com/2009/01/13/flex-um-chat-simples-em-menos-de-20-linhas/"
legacy: true
featuredImage: "/images/imported/2009/01/chatapp-2ca0944ea1.webp"
---
One of Adobe Flex's notable features was how easily it could use messaging services. On the client, the `<mx:Producer />` and `<mx:Consumer />` components abstracted much of the communication with a back-end data service.

In the Java ecosystem, common choices included LiveCycle Data Services and the open source BlazeDS. This example used **Java with BlazeDS** to create a chat whose Flex interface contained fewer than 20 lines of code—not counting server configuration.

## Original example structure

1. Configure a streaming channel, or an AMF channel with polling, in `services-config.xml`.
2. Create a `destination` named `chatMessage` in `messaging-config.xml`.
3. Register the messaging configuration in BlazeDS.
4. Build the interface with a `Producer` to send messages and a `Consumer` to receive them.
5. Start the web server and open the chat in two different browsers or sessions.

> **Partially unavailable code:** both the WordPress export and the current public page contain empty configuration and MXML blocks. Because the missing content could not be verified, I did not reconstruct or invent it.

<img src="/images/imported/2009/01/chatapp-2ca0944ea1.webp" alt="Original ChatApp interface" width="630" height="480" loading="eager" fetchpriority="high" decoding="async">
