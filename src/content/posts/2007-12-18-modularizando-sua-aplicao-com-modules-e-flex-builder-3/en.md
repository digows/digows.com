---
title: "Modularizing Applications with Modules and Flex Builder 3"
description: "How large Adobe Flex applications used on-demand modules configured and loaded through Flex Builder 3."
permalink: "2007/12/18/modularizing-applications-with-modules-and-flex-builder-3"
publishedAt: "2007-12-18T23:57:06.000Z"
reviewedAt: "2026-07-11"
language: "en"
categories: ["Software Development"]
tags: ["Flex Builder 3","Modules"]
draft: false
translationKey: "2007/12/18/modularizando-sua-aplicao-com-modules-e-flex-builder-3"
translationOf: "2007/12/18/modularizando-sua-aplicao-com-modules-e-flex-builder-3"
legacyUrl: "https://digows.com/2007/12/18/modularizando-sua-aplicao-com-modules-e-flex-builder-3/"
legacy: true
---
An earlier [article](/2007/07/10/how-to-present-adobe-flex-to-your-team/) focused on Adobe Flex's strengths. Large Flex applications also had a practical challenge: reducing the final `.swf` size and separating the application into modules.

Working with modules in Flex Builder 2 was cumbersome because each module had to be compiled manually and could behave unpredictably. Flex Builder 3 improved that workflow by managing modules directly in the IDE.

## Creating a module

In Flex Builder 3, right-click the project and choose **New → MXML Module**. The generated file had this structure:

```xml
<mx:Module xmlns:mx="http://www.adobe.com/2006/mxml"
           layout="absolute"
           width="400"
           height="300">
</mx:Module>
```

A module could be developed much like an application, including its own components. On build, Flex Builder compiled it to the output directory so it could be loaded by a local or remote Flex application.

Good component boundaries increased reuse: a module composed of independent components could also be used by other applications.

## Loading a module with MXML

`ModuleLoader` could load the compiled module and expose lifecycle events:

```xml
<mx:ModuleLoader id="moduleMXML"
    url="ModuleMXML.swf"
    width="100%" height="100%"
    ready="carregou()"
    progress="onProgress(event)"
    error="onError(event)"
    unload="onUnload(event)" />
```

Only the URL was required. The other handlers made it possible to report download progress, display errors, react when the module became ready, and clean up after unloading.

```actionscript-3
private function onProgress(event:ProgressEvent):void
{
    var numPerc:Number = Math.round(
        (Number(event.bytesLoaded) / Number(event.bytesTotal)) * 100
    );
    windowModule.status = "Carregando módulo..." + numPerc + "%";
    progress.label = "Carregando módulo..." + numPerc + "%";
    progress.indeterminate = false;
}

private function onError(event:ModuleEvent):void
{
    Alert.show("Não foi possível carregar o módulo: " + event.errorText, "Erro");
}

private function onUnload(event:Event):void
{
    windowModule.status = "Módulo descarregado";
    progress.label = "Módulo descarregado";
}

private function unLoadModule(modulo:ModuleLoader):void
{
    modulo.url == "ModuleAS.swf" ? vbModuloAS.removeChild(moduleLoaderAS) : null;
    modulo.unloadModule();
}

private function carregou():void
{
    windowModule.status = "Módulo carregado";
    progress.label = "Módulo carregado";
    progress.indeterminate = true;
}
```

## Loading a module with ActionScript

The same lifecycle could be controlled in ActionScript:

```actionscript-3
private var moduleLoaderAS:ModuleLoader = new ModuleLoader();

private function loadAS():void
{
    moduleLoaderAS.addEventListener(ModuleEvent.PROGRESS, onProgress);
    moduleLoaderAS.addEventListener(ModuleEvent.READY, onReady);
    moduleLoaderAS.addEventListener(ModuleEvent.ERROR, onError);
    moduleLoaderAS.addEventListener(ModuleEvent.UNLOAD, onUnload);
    moduleLoaderAS.url = "ModuleAS.swf";
    moduleLoaderAS.loadModule();
}

private function onReady(event:ModuleEvent):void
{
    vbModuloAS.addChild(moduleLoaderAS);
    carregou();
}
```

Memory leaks were an important concern when applications loaded many modules. The original demo included a memory indicator for testing the Flash Player VM, but both the running application and its source viewer are now offline.

## Historical references

- [Modular applications overview](http://livedocs.adobe.com/labs/flex3/html/help.html?content=modular_2.html)
- [Writing modules](http://livedocs.adobe.com/labs/flex3/html/help.html?content=modular_3.html)
- [Compiling modules](http://livedocs.adobe.com/labs/flex3/html/help.html?content=modular_4.html#170594)
- [Loading and unloading modules](http://livedocs.adobe.com/labs/flex3/html/help.html?content=modular_5.html#199130)
- [Using ModuleLoader events](http://livedocs.adobe.com/labs/flex3/html/help.html?content=modular_6.html)
