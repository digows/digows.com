---
title: "Uploading Files with Flex, PHP, and Java"
description: "A historical file-upload example in Adobe Flex using FileReference, with server-side destinations in PHP and Java."
permalink: "2007/12/17/uploading-files-with-flex-php-and-java"
publishedAt: "2007-12-18T02:34:31.000Z"
reviewedAt: "2026-07-11"
language: "en"
categories: ["Java","PHP"]
tags: []
draft: false
translationKey: "2007/12/17/upload-de-arquivos-com-flex-php-e-java"
translationOf: "2007/12/17/upload-de-arquivos-com-flex-php-e-java"
legacyUrl: "https://digows.com/2007/12/17/upload-de-arquivos-com-flex-php-e-java/"
legacy: true
---
A frequent question in the community was how to upload files with Flex. One option was to treat the Flex client like an HTML form; another involved working directly with `ByteArray`. This article demonstrates the simpler approach through the **[FileReference](http://livedocs.adobe.com/flex/2/langref/flash/net/FileReference.html)** API.

> **Historical security note:** this is code from 2007. The server examples do not implement the validation, authentication, randomized filenames, path controls, content inspection, and size limits required by a production upload endpoint today.

For browser security reasons, the ActionScript virtual machine did not provide direct access to files on disk. The API exposed metadata such as size, name, creation date, modification date, and type.

## Selecting a file and tracking progress

The client registered listeners for selection, upload progress, I/O errors, and completion. It also restricted the file picker to common image extensions:

```actionscript-3
public function procuraImg():void
{
    fileImagem = new FileReference();
    fileImagem.addEventListener(Event.SELECT,
        function(event:Event):void
        {
            txtImagem.text = fileImagem.name;
        }
    );
    fileImagem.addEventListener(ProgressEvent.PROGRESS,
        function(event:ProgressEvent):void
        {
            var numPerc:Number = Math.round(
                (Number(event.bytesLoaded) / Number(event.bytesTotal)) * 100
            );
            titleWindow.status = "Carregando Imagem..." + numPerc + "%";
        }
    );
    fileImagem.addEventListener(IOErrorEvent.IO_ERROR,
        function(event:IOErrorEvent):void
        {
            Alert.show("Ocorreu um erro no upload: " + event.text);
        }
    );
    fileImagem.addEventListener(Event.COMPLETE,
        function(event:Event):void
        {
            fileImagem = null;
            titleWindow.status = "Upload efetuado com sucesso!";
        }
    );

    var tipos:FileFilter = new FileFilter(
        "Arquivos de Imagem *.jpg; *.jpeg; *.gif; *.png",
        "*.jpg; *.jpeg; *.gif; *.png"
    );
    fileImagem.browse(new Array(tipos));
}
```

The `ProgressEvent` supplied `bytesLoaded` and `bytesTotal`, allowing the interface to calculate and display an upload percentage.

## Starting the upload

The next function checked that a file had been selected, limited its size to roughly 1 MB, prepared a `URLRequest`, and started the upload:

```actionscript-3
public function fazerUpload():void
{
    if (txtImagem.text != "" || fileImagem != null)
    {
        if (fileImagem.size <= 1048576)
        {
            var request:URLRequest = new URLRequest("FileUpload.php");
            var vars:URLVariables = new URLVariables();
            vars.nomeImagem = txtNomeImagem.text + fileImagem.type;
            request.data = vars;
            request.method = URLRequestMethod.GET;
            fileImagem.upload(request);
        }
        else
        {
            titleWindow.status = "Selecione uma imagem com no máximo 1 MB";
        }
    }
    else
    {
        titleWindow.status = "Selecione uma imagem";
    }
}
```

The original article then used a minimal PHP destination to move the uploaded file. The downloadable application, source viewer, and equivalent Java servlet are no longer available at their original addresses.
