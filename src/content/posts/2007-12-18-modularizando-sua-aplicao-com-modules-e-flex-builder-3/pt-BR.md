---
title: "Modularizando aplicações com Modules e Flex Builder 3"
description: "Como reduzir e organizar aplicações Adobe Flex com módulos carregados sob demanda e configurados pelo Flex Builder 3."
permalink: "2007/12/18/modularizando-sua-aplicao-com-modules-e-flex-builder-3"
publishedAt: "2007-12-18T23:57:06.000Z"
reviewedAt: "2026-07-11"
language: "pt-BR"
categories: ["Random Thoughts"]
tags: ["Flex Builder 3","Modules"]
draft: false
wordpressId: 130
translationKey: "2007/12/18/modularizando-sua-aplicao-com-modules-e-flex-builder-3"
legacyUrl: "https://digows.com/2007/12/18/modularizando-sua-aplicao-com-modules-e-flex-builder-3/"
legacy: true
---
Olá pessoal,

Uma vez apresentei um [artigo](/2007/07/10/convenca-sua-equipe-para-desenvolvimento-web-e-com-adobe-flex/) falando sobre o Adobe Flex, e neste artigo, e como entusiasta da tecnologia apenas apresentei pontos positivos, e como era de se esperar alguns perguntaram: **_Esse tal Flex não tem pontos negativos?!_**

Hoje posso dizer que desenvolver uma aplicação de grande porte com o **Adobe Flex** requer uma atenção necessária, o problema aparece quando se quer diminuir o tamanho do **.swf** final, ou então dividir a aplicação em modulos.

Confesso senhores que tentei usar o **Module** no **Flex Builder 2** **(SDK 2.0.1)** e não atendeu muito bem, era custoso ter que ficar compilando cada modulo, e depois quando usava dava uns problemas muito estranhos.

Hoje quero apresentar a vocês algo que o **Flex Builder 3** trouxe de novo, a manipulação dos modules via Flex Builder.

Vamos ao código então:

## Criando um Módulo
No **Flex Builder 3**  para criar um novo modulo de um botão direito sobre seu projeto, e vá em **NEW -> MXML Module**

Após dar um nome ao seu modulo, o Builder vai gerará um arquivo com essas linhas:

```xml
<mx:Module xmlns:mx="http://www.adobe.com/2006/mxml"
            layout="absolute"
            width="400" height='300'>
</mx:Module>
```

Com o seu modulo criado você pode trata-lo como se fosse um **Apllication**  e trabalhar normamente, componentizando e etc..

Quando você Salvar/Build, o Flex Builder automaticamente compilará o módulo e colocará na sua pasta bin, com tudo o que necessário para ser usado por qualquer outra aplicacão Flex, seja ela local, ou [remota](http://livedocs.adobe.com/labs/flex3/html/help.html?content=modular_5.html#199130).

Lembrando que se você preparar sua aplicação de forma modular, sabendo componentizar, mais reuso seu sistema terá, uma vez que esse module composto por outros componentes pode ser usado em outras aplicações.

## Carregando um Módulo
Para carregar o seu módulo, existe algumas formas apresentadas na documentação, eu estarei abordando duas apenas.

_Com MXML_:

O MXML facilita a vida quando temos aplicar o componente, e com os modules são a mesma coisa observe:

```xml
<mx:ModuleLoader id="moduleMXML" url="ModuleMXML.swf"
    width="100%" height="100%"
    ready="carregou()" progress="onProgress(event)"
    error="onError(event)" unload="onUnload(event)"/>
```

Observe que é possível tratar vários eventos, como **ready, progrees, error, unload.**

Mas são opcionais, sendo que para funcionar, apenas o parâmetro **URL,** deve ser setado, no meu caso eu compilei o modulo na raiz do projeto.

Abaixo mostro como pode tratar os eventos:

```actionscript-3
private function onProgress(event:ProgressEvent):void
{
    var numPerc:Number    = Math.round((Number(event.bytesLoaded) / Number(event.bytesTotal)) * 100);
    windowModule.status    = "Carregando Modulo..."+numPerc+"%";
    progress.label                  = "Carregando Modulo..."+numPerc+"%";
    progress.indeterminate = false;
}

private function onError(event:ModuleEvent) : void
{
    Alert.show("Não foi possível carregar o modulo. nDetalhes:"+event.errorText,"Erro");
}

private function onUnload(event:Event):void
{
   windowModule.status = "Modulo Descarregado";
   progress.label      = "Modulo Descarregado";
}

private function unLoadModule(modulo:ModuleLoader):void
{
    modulo.url == "ModuleAS.swf" ? vbModuloAS.removeChild(moduleLoaderAS) : null;
    modulo.unloadModule();
}

private function carregou():void
{
    windowModule.status    = "Modulo Carregado";
    progress.label                  = "Modulo Carregado";
    progress.indeterminate = true;
}
```

Outra forma de carregar os módulos, é através do ActionScript como apresentado abaixo:

_Com ActionScript_:

```actionscript-3
private var moduleLoaderAS:ModuleLoader = new ModuleLoader();

private function loadAS() : void
{
    //Progresso do download...
    moduleLoaderAS.addEventListener(ModuleEvent.PROGRESS,onProgress);
    //Ao estar carregado e pronto....
    moduleLoaderAS.addEventListener(ModuleEvent.READY,onReady);
    //Se ocorrer algum erro...
    moduleLoaderAS.addEventListener(ModuleEvent.ERROR,onError);
    moduleLoaderAS.addEventListener(ModuleEvent.UNLOAD,onUnload);
    moduleLoaderAS.url = "ModuleAS.swf";
    moduleLoaderAS.loadModule();
}

private function onReady(event:ModuleEvent):void
{
    vbModuloAS.addChild(moduleLoaderAS);
    carregou();
}
```

Esta funcão pode ser cahamada por qualquer evento, no meu causo uso um **Button**, para acionar o carregamento. Outro motivo questionável  é os Leaks de Memória, e quando se usava muitos módules acontecia direto, tanto que pessoas da comunidade não usam os modules, e partem para outros frameworks como o [Masapi](http://code.google.com/p/masapi/), tenho minhas críticas sobre isso, mas prefiro mostrar apenas as soluções dadas pela própria Adobe.

Fiz uma aplicação que contém modulos sendo carregado via ActionScript e via MXML, a aplicação também conta com um componente que analiza a quantidade de memória utlizada pelo Player\* para que todos possam realizar seus testes...

_**\*Este marcador analiza a memória utlizada pela VM em todas as instâncias do seu browser abertas.**_

## Aplicação Rodando:
[http://23.20.48.222/downloads/postagens/moduleflex/index.html](http://23.20.48.222/downloads/postagens/moduleflex/index.html)

[Link Externo](http://23.20.48.222/downloads/postagens/moduleflex/#) / [Link do Source](http://23.20.48.222/downloads/postagens/moduleflex/srcview/index.html)

## Referências:
[Modular Applications overview](http://livedocs.adobe.com/labs/flex3/html/help.html?content=modular_2.html)

[Writing Modules](http://livedocs.adobe.com/labs/flex3/html/help.html?content=modular_3.html)

[Compiling Modules](http://livedocs.adobe.com/labs/flex3/html/help.html?content=modular_4.html#170594)

[Loading and Unloading modules](http://livedocs.adobe.com/labs/flex3/html/help.html?content=modular_5.html#199130)

[Adding modules too your project](http://livedocs.adobe.com/labs/flex3/html/help.html?content=creating_modules_3.html)

[Optmizing modules in Flex Builder 3](http://livedocs.adobe.com/labs/flex3/html/help.html?content=creating_modules_4.html)

[Creating modules in Flex Builder 3](http://livedocs.adobe.com/labs/flex3/html/help.html?content=creating_modules_2.html)

[Using ModuleLoader Events](http://livedocs.adobe.com/labs/flex3/html/help.html?content=modular_6.html)

Obrigado pessoal, e até a próxima!

o/

Liz.. =\*\*\*
