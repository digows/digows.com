---
title: "Working with CSS in Adobe Flex Builder 3"
description: "A historical tutorial on creating, applying, and visually editing CSS styles in Adobe Flex Builder 3 projects."
permalink: "2007/12/29/working-with-css-in-adobe-flex-builder-3"
publishedAt: "2007-12-29T03:36:30.000Z"
reviewedAt: "2026-07-11"
language: "en"
categories: ["Software Development"]
tags: ["CSS","Flex Builder 3"]
draft: false
translationKey: "2007/12/29/trabalhando-com-css-no-adobe-flex-builder-3"
translationOf: "2007/12/29/trabalhando-com-css-no-adobe-flex-builder-3"
legacyUrl: "https://digows.com/2007/12/29/trabalhando-com-css-no-adobe-flex-builder-3/"
legacy: true
---
In Adobe Flex, separating interface logic from design decisions helped keep larger applications maintainable. Flex Builder 3 provided a visual CSS editor for creating component styles without leaving the source file behind.

## Creating the CSS file

1. Create a project using Flex SDK 3.
2. Add a CSS file to the project.
3. In the visual editor, choose **New Style** and select the component you want to customize.

The editor offered four scopes:

- **All Components:** apply the style to every component;
- **All Components with style name:** apply it to components with a given `styleName`;
- **Specific Component:** apply it to a specific component type;
- **Specific Component with style name:** combine a component type with a `styleName`.

Properties could generate reusable child styles. For example, the status bar style from a `TitleWindow` could also be applied to a `Panel`.

> *The screenshots of the visual editor were no longer available during the migration.*

## Adding CSS to the application

Include the file in the main MXML document:

```xml
<?xml version="1.0" encoding="utf-8"?>
<mx:Application
    xmlns:mx="http://www.adobe.com/2006/mxml"
    layout="absolute">
    <mx:Style source="styles.css" />
</mx:Application>
```

During compilation, Flex checked which styles the application used and warned about unused declarations. Flex Builder's autocomplete also helped developers discover the properties available for each component.
