---
title: "A Bug in Google?"
description: "A curiosity found in 2007 while searching Google for unusual number sequences and comparing the results it returned."
permalink: "2007/09/26/a-bug-in-google"
publishedAt: "2007-09-26T02:37:00.000Z"
reviewedAt: "2026-07-11"
language: "en"
categories: ["Google"]
tags: []
draft: false
translationKey: "2007/09/26/um-bug-no-google"
translationOf: "2007/09/26/um-bug-no-google"
legacyUrl: "https://digows.com/2007/09/26/um-bug-no-google/"
legacy: true
---
In 2007, while taking a break from a few logic problems, I searched Google for numeric ranges such as these:

```text
123...233
1232...2313
93...786
```

I discovered that Google treated the three dots as a range and returned numbers between the two values.

When I accidentally tried only two dots with much larger ranges, such as the examples below, the server took a long time to respond and eventually returned a 404 page:

```text
1000000..100000000
1000000..10000031231
10000321..10000031231
```

At the time, it looked like an unvalidated input case in the search engine. Its current behavior may be completely different.
