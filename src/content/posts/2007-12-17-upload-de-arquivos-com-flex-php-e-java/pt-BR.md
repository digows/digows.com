---
title: "Upload de arquivos com Flex, PHP e Java"
description: "Exemplo histórico de upload de arquivos no Adobe Flex usando FileReference, com destinos de servidor em PHP e Java."
permalink: "2007/12/17/upload-de-arquivos-com-flex-php-e-java"
publishedAt: "2007-12-18T02:34:31.000Z"
reviewedAt: "2026-07-11"
language: "pt-BR"
categories: ["Java","PHP"]
tags: []
draft: false
wordpressId: 129
translationKey: "2007/12/17/upload-de-arquivos-com-flex-php-e-java"
legacyUrl: "https://digows.com/2007/12/17/upload-de-arquivos-com-flex-php-e-java/"
legacy: true
---
Olá Pessoal!

Uma coisa que o pessoal sempre pede na lista, é como fazer o upload de arquivos com Flex,

Um modo é você tratar o **Flex** como se fosse um **form HTML,** outro modo é através de **ByteArray** como este [Link.](http://www.bytearray.org/?p=90)

Hoje mostrarei o modo mais simples, usando a API **[FileReference](http://livedocs.adobe.com/flex/2/langref/flash/net/FileReference.html)**.

_\***Nota**: Por questões de segurança do browser, a VM ActionScript não tem acesso direto a arquivos no disco,_ _logo a API apenas da a possibilidade de trabalhar com:_ **Tamanho,** **Nome do Arquivo,** **Data de Criação,** **Data de modificação e** **Tipo (extenção).**

Neste exemplo mostrarei como fazer o upload com php e java.

No flex é muito simples, Aqui mostrarei como funciona o "**Listeners**" que a API oferece:

```actionscript-3
public function procuraImg():void
{
    fileImagem = new FileReference();
    //Ao Selecionar....
    fileImagem.addEventListener(Event.SELECT,
        function(event:Event):void
        {
            txtImagem.text = fileImagem.name;
        }
    );
    //Enquanto estiver fazendo o Upload..
    fileImagem.addEventListener(ProgressEvent.PROGRESS,
        function(event:ProgressEvent):void
        {
            var numPerc:Number = Math.round((Number(event.bytesLoaded) / Number(event.bytesTotal)) * 100);
            titleWindow.status = "Carregando Imagem..."+numPerc+"%";
        }
    );
    //Ao ocorrer um erro.....
    fileImagem.addEventListener(IOErrorEvent.IO_ERROR,
        function(event:IOErrorEvent):void
        {
            Alert.show("Ocurreu um erro ao Realizar o Upload nDetalhes: "+event.text);
        }
    );
    //Ao Terminar o Upload.....
    fileImagem.addEventListener(Event.COMPLETE,
        function(event:Event):void
        {
            fileImagem = null;
            titleWindow.status = "Upload efetuado com sucesso!"
        }
    );
    //utilizando filtro para upload somente de imagem
    var tipos:FileFilter = new FileFilter("Arquivos de Imagem *.jpg; *.jpeg; *.gif; *.png"
                                         ,"*.jpg; *.jpeg; *.gif; *.png");
    var tiposArray:Array = new Array(tipos);
    fileImagem.browse(tiposArray);
}
```

Como podemos ver, é possivel tratar vários eventos,

o mais interessante é o **[ProgressEvent](http://livedocs.adobe.com/flex/2/langref/flash/events/ProgressEvent.html)** que como foi apresentado, é possivel fazer um

calculo para gerar a porcentagem de envio.

Com os listeners adicionados, vamos ver como fica quando aciona o upload:

```actionscript-3
public function fazerUpload():void
{
    if (txtImagem.text != "" || fileImagem != null)
    {
        //aproximadamente 1MB.
        if (fileImagem.size <= 1048576)
        {
            //Endereco onde esta o aquivo php, ou java.
            var request:URLRequest = new URLRequest("FileUpload.php");
            var vars:URLVariables  = new URLVariables();
            vars.nomeImagem = txtNomeImagem.text+fileImagem.type;
            request.data = vars;
            request.method = URLRequestMethod.GET;
            fileImagem.upload(request);
        }
        else
        {
            titleWindow.status = "Selecione uma Imagem com no maximo 1Mb";
        }
    }
    else
    {
        titleWindow.status = "Selecione uma Imagem";
    }
}
```

No PHP fica somente isso:

```php
//Pega o nome da imagem passado pelo Flex.
$nomeImg = $_GET;

//Diretório aonde será salvo o arquivo.
$dirImg = dirname(__FILE__)."/img/";

move_uploaded_file($_FILES,$dirImg.$nomeImg);
```

O exemplo acima mostrei fazendo upload usando PHP no beck-end, mas no source, existe uma servlet java que faz o mesmo papel que o php apresentado.

Aplicação Rodando:

[http://23.20.48.222/downloads/postagens/flexupload/index.html](http://23.20.48.222/downloads/postagens/flexupload/index.html)

[Link do Source](http://23.20.48.222/downloads/postagens/flexupload/srcview/index.html) _**\*Flex 3**_

Obrigado pessoal e Boas festas!

o/
