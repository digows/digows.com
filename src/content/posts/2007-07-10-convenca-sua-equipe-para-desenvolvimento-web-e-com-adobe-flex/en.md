---
title: "How to Present Adobe Flex to Your Team"
description: "Historical arguments, originally written in 2007, for adopting Adobe Flex 2 in rich web applications for the enterprise."
permalink: "2007/07/10/how-to-present-adobe-flex-to-your-team"
publishedAt: "2007-07-10T11:15:00.000Z"
reviewedAt: "2026-07-11"
language: "en"
categories: ["Software Development"]
tags: ["Adobe Flex","Architecture"]
draft: false
translationKey: "2007/07/10/convenca-sua-equipe-para-desenvolvimento-web-e-com-adobe-flex"
translationOf: "2007/07/10/convenca-sua-equipe-para-desenvolvimento-web-e-com-adobe-flex"
legacyUrl: "https://digows.com/2007/07/10/convenca-sua-equipe-para-desenvolvimento-web-e-com-adobe-flex/"
legacy: true
---
In 2007, after proposing an Adobe Flex solution at work, I had to explain why the technology might be appropriate. This article reorganizes the case I made at the time.

> **Historical context:** licensing, pricing, Flash Player adoption, and product information reflect 2007. Adobe Flex and Flash Player have been discontinued, and this article is not a current technology recommendation.

## What Adobe Flex 2 was

Originally created by Macromedia and later maintained by Adobe, Flex was an SDK for rich internet applications, or RIAs. Interfaces were written in MXML and ActionScript, compiled to SWF, and executed by Flash Player.

The SDK could be downloaded and used at no cost. In 2007, Adobe announced that the SDK and the `mxmlc` compiler would be released under the Mozilla Public License. Flex Builder, an Eclipse-based IDE, and some commercial components such as Flex Charts remained paid products.

## The server side

Flex handled the presentation layer and did not require a particular server by itself. Applications could consume services implemented in Java, PHP, ASP.NET, ColdFusion, and other platforms through HTTP, web services, RPC, or AMF. Projects such as Granite Data Services and OpenAMF provided server-side integrations.

## Arguments in its favor at the time

Compared with HTML and JSP interfaces in 2007, Flex promised:

- a consistent interface across browsers because it ran on Flash Player;
- faster visual development with Flex Builder;
- interactive components and an experience closer to desktop software;
- communication through XML, web services, RPC, and the binary AMF protocol;
- integration with Java EE application servers;
- an open SDK, extensive documentation, and a growing community.

Compared with OpenLaszlo, I highlighted the dedicated IDE, wider protocol support, ahead-of-time compilation, and Adobe's commercial support.

## What the original argument missed

The document was deliberately favorable and understated important costs: dependence on a proprietary client plugin, accessibility, performance, security, SWF size, content indexing, and platform risk. Those limitations became decisive as native web standards evolved.

Today, the article is useful less as a recommendation and more as a snapshot of an architectural decision in 2007.
