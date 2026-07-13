---
title: "Architecture with Adobe Flex, PHP, and Zend Framework"
description: "A layered contact-form example using Flex, PHP, Zend Framework, and AMFPHP with explicit data-transfer objects."
permalink: "2008/01/03/architecture-with-adobe-flex-php-and-zend-framework"
publishedAt: "2008-01-03T16:07:25.000Z"
reviewedAt: "2026-07-11"
language: "en"
categories: ["PHP","Software Architecture"]
tags: ["Adobe Flex","Zend Framework","AMFPHP"]
draft: false
translationKey: "2008/01/03/proposta-de-arquitetura-com-adobe-flex-e-php-usando-zend-framework"
translationOf: "2008/01/03/proposta-de-arquitetura-com-adobe-flex-e-php-usando-zend-framework"
legacyUrl: "https://digows.com/2008/01/03/proposta-de-arquitetura-com-adobe-flex-e-php-usando-zend-framework/"
legacy: true
---
This 2008 example used a contact form to demonstrate a broader application architecture with **Adobe Flex**, **PHP**, **Zend Framework**, and **AMFPHP**. A simple `HTTPService` would have required less code, but the goal was to show how a contact module could fit into a larger system.

> **Historical security note:** the frameworks and code predate modern PHP security practices. Do not deploy the example without current input validation, CSRF protection, authentication, secret management, mail controls, and supported dependencies.

## Architecture

Zend Framework abstracted database access with `Zend_Db_Table` and provided loading and configuration utilities. AMFPHP connected Flex and PHP over the binary AMF3 protocol.

The server application was divided into these packages:

- **entitybean:** relational persistence and CRUD behavior;
- **sessionbean:** use-case validation and business rules;
- **facade:** transaction boundaries and exception handling;
- **vo:** value/data-transfer objects exchanged between layers;
- **services:** operations exposed through AMFPHP;
- **config:** paths and database settings;
- **libs:** Zend Framework and AMFPHP dependencies.

The original design also used a `DB` object to begin, commit, or roll back a transaction. Although its singleton approach would deserve reconsideration today, the intended invariant was sound: the facade owned the transaction for a complete use case.

## Typed values across PHP and Flex

Instead of passing unstructured arrays, both sides declared a compatible `ContatoVO`. AMFPHP used `_explicitType` to map the PHP value to its ActionScript counterpart.

```php
class ContatoVO
{
    var $idContato;
    var $dsNome;
    var $dsEmail;
    var $nuTelefone;
    var $dsCidade;
    var $dsEstado;
    var $dsMensagem;

    var $_explicitType = "ContatoVO";
}
```

```actionscript-3
package com.digows.Artigos.FlexPHP.vo
{
    public class ContatoVO
    {
        public var idContato:int;
        public var dsNome:String;
        public var dsEmail:String;
        public var nuTelefone:String;
        public var dsCidade:String;
        public var dsEstado:String;
        public var dsMensagem:String;
    }
}
```

## Request flow

1. Flex called a method on `ContatoService` through AMFPHP and sent a `ContatoVO`.
2. The service delegated to `ContatoFacade`.
3. The facade opened a transaction and invoked the session bean.
4. The session bean applied the use-case rules and called the persistence layer.
5. The facade committed on success or rolled back after an exception.

This flow kept transport, orchestration, business rules, and persistence separate.

## Flex client

The example created the value object from form fields and invoked the remote service asynchronously:

```actionscript-3
var contatoVO:ContatoVO = new ContatoVO();
contatoVO.dsNome = txtNome.text;
contatoVO.dsEmail = txtEmail.text;
contatoVO.nuTelefone = txtTelefone.text;
contatoVO.dsCidade = txtCidade.text;
contatoVO.dsEstado = txtEstado.text;
contatoVO.dsMensagem = txtMensagem.text;

RemoteConnection.call(
    "ContatoService",
    "save",
    function(event:ResultEvent):void
    {
        Alert.show("Email enviado com sucesso!", "SUCESSO!");
        clear();
    },
    contatoVO
);
```

The original downloadable project, database archive, diagrams, and running demo are no longer available. The detailed Portuguese version preserves the remaining configuration and source fragments.
