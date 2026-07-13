---
title: "Publishing Code in WordPress 2.3.1"
description: "A 2007 record of configuring syntax highlighting in WordPress 2.3.1 with the iG:Syntax Hiliter plugin."
permalink: "2007/12/17/publishing-code-in-wordpress-2-3-1"
publishedAt: "2007-12-17T23:50:51.000Z"
reviewedAt: "2026-07-11"
language: "en"
categories: ["Random Thoughts"]
tags: ["WordPress"]
draft: false
translationKey: "2007/12/17/postando-cdigos-com-o-wordpress-231"
translationOf: "2007/12/17/postando-cdigos-com-o-wordpress-231"
legacyUrl: "https://digows.com/2007/12/17/postando-cdigos-com-o-wordpress-231/"
legacy: true
---
In 2007, one reason to move from Blogspot to WordPress was the ability to publish code with syntax highlighting. Finding a plugin compatible with WordPress 2.3.1 was not easy.

Following a recommendation from my colleague [Ebertom](http://blog.flexdev.com.br/), I found **[iG:Syntax Hiliter v3.5](http://www.igeek.info/download.php?file=1)**.

After installing the plugin, a code sample only had to be wrapped in the tag for its language. This was the XML example:

```xml
<root>
  <example />
</root>
```

The plugin also accepted a language setting in the marker itself. These examples are preserved because they document the syntax used by that WordPress version:

```text
[sourcecode language="xml"]
<!-- XML here -->
[/sourcecode]
```

```text
[sourcecode language="java"]
// Java here
[/sourcecode]
```
