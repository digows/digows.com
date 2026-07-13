---
title: "Arquitetura com Adobe Flex, PHP e Zend Framework"
description: "Exemplo completo de formulário de contato com Flex, PHP, Zend Framework e AMFPHP, organizado em camadas e objetos de transferência."
permalink: "2008/01/03/proposta-de-arquitetura-com-adobe-flex-e-php-usando-zend-framework"
publishedAt: "2008-01-03T16:07:25.000Z"
reviewedAt: "2026-07-11"
language: "pt-BR"
categories: ["PHP"]
tags: []
draft: false
wordpressId: 137
translationKey: "2008/01/03/proposta-de-arquitetura-com-adobe-flex-e-php-usando-zend-framework"
legacyUrl: "https://digows.com/2008/01/03/proposta-de-arquitetura-com-adobe-flex-e-php-usando-zend-framework/"
legacy: true
---
Olá Pessoal,

Um item básico quando se trata de sites, é um local onde o visitante pode de alguma forma entrar em contato com a empresa do site, hoje existem algumas boas soluções para isso, como por exemplo um client msn que pode ser colocado no site e se o visitante quiser, pode entrar em contato com o msn da empresa.

Mas hoje vou mostrar a vocês uma forma simples e funcional, que consiste em um formulário onde o visitante preenche os dados, e gera um e-mail para o destinatário.

Mostrarei isso usando [PHP](http://pt.wikipedia.org/wiki/PHP)/[ZEND](http://www.zend.com/)/[AMFPHP](http://amfphp.org/)/[FLEX](http://www.adobe.com/br/products/flex/), poderia fazer isso somente com [HTTPService](http://livedocs.adobe.com/flex/2/langref/mx/rpc/http/HTTPService.html)? concerteza, ficaria menos código e até mais simples, porém concordamos que ninguém iria fazer uma aplicação só com essa funcionalidade, pois o Formulário de Contato seria apenas um módulo do sistema.

Então vou lhes mostrar também uma proposta de como você pode trabalhar arquiteturalmente com Flex e PHP, trocando apenas [VO/TO/DTO](http://www.guj.com.br/posts/list/31773.java) entre as camadas, lembrando que isso é uma boa prática, vejo muitos porae trocando array's com Flex e PHP, isso é totalmente desnecessário.

## Detalhes da Arquitetura

> **[ZEND Framework](http://www.zend.com/);** **[AMFPHP](http://amfphp.org/);** **[Adobe Flex](http://www.adobe.com/br/products/flex/);**

A arquitetura usa o ZEND para abstração do banco de dados usando a Classe [Zend\_Db\_Table](http://zendwork.com/manual/core/pt-br/zend.db.table.html), e outros recursos como o [Zend\_Loader](http://zendwork.com/manual/core/pt-br/zend.loader.html) e [Zend\_Registry](http://zendwork.com/manual/core/pt-br/zend.registry.html).

[AMFPHP](http://amfphp.org/) para a comunicação entre o AdobeFlex e o PHP, esta comunicação rodando em cima do protocolo [AMF3](http://download.macromedia.com/pub/labs/amf/amf3_spec_121207.pdf), que provém comunicação binária não mais String como no HTTP puro, e também compactação.

## Estruturando a aplicação

> *Historic image unavailable from the original source: Estrutura de Pastas.*
   _Listagem 1_

Crie uma estrutura de pastas como mostrado na **Listagem 1**

O package **entitybean** contém classes que segue os conceitos de um [EntityBean](http://dataware.nce.ufrj.br:8080/dataware/Cursos/mestrado/teesIII/Modulos/fisico/apresentacoes/componentes/cmp.pdf) como nas especificações J2EE/JEE, só que claro BMP através do [Zend\_Db\_Table](http://zendwork.com/manual/core/pt-br/zend.db.table.html), e uma outra classe que eu fiz chamada EntityBeanImpl, que abstrai ainda mais os métodos [CRUD](http://pt.wikipedia.org/wiki/CRUD) de um caso de uso, como por Exemplo eliminei os métodos Inserir e Atualizar, e criei um Salvar, que insere ou atualiza baseado na **Primary-Key**. Em poucas palavras, um EntityBean, é reponsável pela abstração de um **Banco de Dados Relacional**, as camadas acima de entityBean apenas conhecem o entitybean, não tem acesso ao Banco de dados.

Para Garantir transação e concorrência, criei uma classe chamada **DB** que cotém um singleton me garantindo apenas uma instância da mesma em uma transação,  ela é reponsavel por iniciar uma transação através do método **beginTransaction()** realizar o commit se toda a operação ocorrer com sucesso atraveés do método **commit()**  e realizar o roolback no banco de dados através do método **rollback().**

O package **sessionbean** contém classes que segue os conceitos de um [SessionBean](http://www.uniriotec.br/~paulo.pires/cursos/TABD1/sessionBeans.pdf) também como nas especificações J2EE/JEE só que apenas sendo Stateless. Em poucas palavras um SessionBean tem a responsábilidade de implementar a regra de negócio do caso de uso, como por exemplo validações, calculos e etc.

O package **facade** contém classes que implementam o [Pattern Facade](http://www.guj.com.br/posts/list/39105.java) em outras palavras é a fachada do sistema, neta arquitetura ela é responsável por garantir a transação usando a classe **DB**, também é reponsável pelo tratamento de exceções (Erros).

O package **vo** contém simples classes que implementam os Patterns [VO/TO/DTO](http://www.guj.com.br/posts/list/31773.java), são os vo's encarregados de transportar entre as camadas as informações de cada caso de uso. Lembrando que o mesmo VO no PHP, será automaticamente serializado pelo AMFPHP para um VO no Flex para isso os VO devem ficar assim:

_No PHP: **\*_Coloque a tag do php no inicio e no fim._**_

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

//NOME DO VO NO FLEX
    var $_explicitType = "ContatoVO";
}
```

_No Flex/AS3_

```actionscript-3
package com.digows.Artigos.FlexPHP.vo
{
    //NOME DO VO NO PHP

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

O package **services** contem as classes de serviços de toda aplicação, estes serviços podem ser disponibilizados para o AMFPHP como veremos a seguir, ou também se você conhece bem o Zend Framework, pode gerar serviços através de **WebServices** ou até mesmo serviços para o **Controller** do Zend Framework, neste caso usando HTML na View.

O package **config** apenas contém arquivos de configuração, como por exemplo path do servidor, dados do banco de dados e etc.

E finalmente o package **libs** que contém as bibliotecas utilizadas na aplicação, no caso o AMFPHP e Zend Framework.

## Configurando a aplicação

Nós precisamos fazer uma integração com o Zend Framework, e o AMFPHP, então primeiramente vamos gerar o application-config.php do Zend.

Dentro do package config, crie um arquivo chamado **application-config.php**  com este conteúdo:

**\*_Coloque a tag do php no inicio e no fim._**

```php
set_include_path('.'.PATH_SEPARATOR.'../../libs'.PATH_SEPARATOR.get_include_path());
    require_once ('Zend/Loader.php');
    /**
    * Loaders
    */
    //Registrador de Variaveis
    Zend_Loader::loadClass('Zend_Registry');
    //Carregador de configuracoes de um .ini
    Zend_Loader::loadClass('Zend_Config_Ini');
      //Classe que encapsula o Banco
    Zend_Loader::loadClass('Zend_Db');
    //Classe para usar as tabelas como objetos.
    Zend_Loader::loadClass('Zend_Db_Table');
    //Usada para fazer o parser dos xml
    Zend_Loader::loadClass('Zend_Config_Xml');

/**
    * Configuracoes da Persistencia.
    */
    //Carrega o arquivo de configuracoes.
    $configDB = new Zend_Config_Ini(dirname(__FILE__).'/config.ini', 'database');
    Zend_Registry::set('configDB', $configDB);
    $configPaths = new Zend_Config_Ini(dirname(__FILE__).'/config.ini', 'paths');
    Zend_Registry::set('configPaths', $configPaths);
    /**
     * Configuracoees variadas...
     */
       //Configura o formato para moeda
      setlocale(LC_MONETARY, 'ptb');
    //Configura as mensagens de erro que devem ser apresentadas.
    error_reporting(E_ALL | E_STRICT);
```

Perceba que a configuração usa um arquivo chamado **config.ini** este contém as configurações do Banco de Dados e paths:

```text

db.adapter=PDO_MYSQL
db.config.host=localhost
db.config.username=root
db.config.password=
db.config.dbname=flexphp

path.dirImg=C:/resources/img
```

No package **libs** você coloca os arquivos do ZEND e do AMFPHP ficando assim:

> *Historic image unavailable from the original source: Libs.*
 _Listagem 2_

A única coisa que precisa ser feita com o AMFPHP, é dizer a ele aonde está os **services**, que usa para mandar os VO's para o PHP, e aonde se encontra o package dos VO's, que ele usa para serializar os VO's Flex e PHP.

Para isso, abra o arquivo **globals.php** dentro da pasta do AMFPHP e deixe assim:

**\*_Coloque a tag do php no inicio e no fim._**

```php
//This file is intentionally left blank so that you can add your own global settings
    //and includes which you may need inside your services. This is generally considered bad
    //practice, but it may be the only reasonable choice if you want to integrate with
    //frameworks that expect to be included as globals, for example TextPattern or WordPress

//Set start time before loading framework
    list($usec, $sec) = explode(" ", microtime());
    $amfphp = ((float)$usec + (float)$sec);

$servicesPath = "../../application/services/";
    $voPath = "../../application/business/vo/";

//As an example of what you might want to do here, consider:
    /*
    if(!PRODUCTION_SERVER)
    {
        define("DB_HOST", "localhost");
        define("DB_USER", "root");
        define("DB_PASS", "");
        define("DB_NAME", "amfphp");
    }
    */
```

Perceba as variaveis $servicesPath e $voPath.

É preciso configurar os sources\_paths do projeto no caso o **src\_flex** e **src\_php**, para isso:

No seu projeto de um botão direito -> **Properties ->** Selecione a opção **Flex Build Path ->** clique no botão **Add Folder** e procure a pasta **src\_php ->** Em **Main source folder** selecione a pasta **src\_flex.**

Esta tela deverá ficar assim:

> *Historic image unavailable from the original source: Flex Build Path.*
 _Listagem 3_

E para concluir, precisamos informar ao compilador Flex qual o endereço do gateway onde será possível trocar dados em cima do protocolo AMF3, para isso gere um arquivo com o nome de     **services-config.xml**  na raiz da pasta **src\_flex**  com este conteúdo:

## XML
   1: <services-config\>

   2:     <services\>

   3:         <service id\="amfphp-flashremoting-service"

   4:             class\="flex.messaging.services.RemotingService"

   5:                 messageTypes\="flex.messaging.messages.RemotingMessage"\>

   6:             <destination id\="amfgateway"\>

   7:                 <channels\>

   8:                     <channel ref\="channel-amf"/>

   9:                 </channels\>

  10:                 <properties\>

  11:                     <scope\>session</scope\>

  12:                     <source\>\*</source\>

  13:                 </properties\>

  14:             </destination\>

  15:         </service\>

  16:     </services\>

  17:     <channels\>

  18:         <channel-definition id\="channel-amf" class\="mx.messaging.channels.AMFChannel"\>

  19:             <endpoint uri\="http://{server.name}:{server.port}/FlexPHP/libs/amfphp/gateway.php"

  20:                 class\="flex.messaging.endpoints.AMFEndpoint"/>

  21:         </channel-definition\>

  22:     </channels\>

  23: </services-config\>

E nos Properties do Projeto, o **FlexCompiler** deverá ficar assim:

> *Historic image unavailable from the original source: Flex Compiler.*

_Listagem 4_

## Detalhando as Camadas

O Fluxo das Camada é a seguinte:

O Flex chama um Serviço através do AMFPHP que direciona para uma classe com um especifico método no package **services**;

**Ex:** O Flex Chama a classe **ContatoService**, solicitando o método  **save()**, passando por parâmentro uma instância de **ContatoVO**.

A Service chama uma classe da **Facade**  com o respectivo método solicitado;

**Ex:** O **ContatoService** chama o **ContatoFacade** solicitando o método **save()** passando por parâmentro uma instância de **ContatoVO**.

A Facade abre uma transação, e chama um SessionBean;

**Ex:** O **ContatoFacade**  chama o **ContatoBean** solicitando o método **save()** passando por parâmentro uma instância de **ContatoVO**.

O SessionBean faz a regra de negócio específica do caso de uso,  e se tudo tiver ok chama um EntityBean para fazer a persistência, se não dispara uma nova Exception dando rollback no banco e mostrando uma mensagem de erro para o Flex através do **catch** na Facade;

**Ex:** O **ContatoSession** chama o **ContatoBean** solicitando para que insira ou atualize os dados através do **ContatoVO**  passado por parâmentro.

Tendo conhecimento do Fluxo das camadas pode se observar que o código ficou bem separado, o que garante baixo acoplamento e alta coesão.

## E como Fica no Flex?

> *Historic image unavailable from the original source: Estrutura de Pastas Flex.*
  _Listagem 5_

Como este exemplo tem por finalidade de mostrar uma proposta de arquitetura com Flex e PHP, este exemplo não adota padrões de projetos no lado Flex, mas é extremamente recomendável o uso de Padrões seja com o [Cairngorm](http://labs.adobe.com/wiki/index.php/Cairngorm) da Adobe ou tantos outros existentes porae.

A classe **RemoteConnection** é uma classe que tem por finalidade de abstrair o uso do [RemoteObject](http://livedocs.adobe.com/flex/2/langref/mx/rpc/remoting/mxml/RemoteObject.html), como por exemplo você pode chamar o **ContatoService** desta forma:

```actionscript-3
var contatoVO:ContatoVO = new ContatoVO();
contatoVO.dsNome     = txtNome.text;
contatoVO.dsEmail    = txtEmail.text;
contatoVO.nuTelefone = txtTelefone.text;
contatoVO.dsCidade   = txtCidade.text;
contatoVO.dsEstado   = txtEstado.text;
contatoVO.dsMensagem = txtMensagem.text;

RemoteConnection.call("ContatoService","save",
     function(event:ResultEvent):void
     {
         Alert.show("Email enviado com sucesso!","SUCESSO!");
         clear();
    },
    contatoVO
);
```

Perceba que gero um VO com as informações da Tela, e Solicito o serviço **ContatoService** chamando o método **save()** passando por parâmetro uma instância de **ContatoVO.**

A Função de retorno implementei dentro do próprio método, mas eu poderia criar uma função só para tratar o retorno do método assíncrono.

Bom Senhores, acredito que consegui dar uma boa explicação sobre como trabalhar arquiteturalmente com Flex e PHP.

Estarei diponibilizando o projeto usado no exemplo, para executar, dentro da pasta **docs** contém 2 arquivos, um chamado **localhost.sql.zip** que pode ser usado para gerar o banco de dados e outro chamado **MER.xml** que é o MER feito com o [DBDesigner](http://fabforce.net/dbdesigner4/). Após gerar o banco, é só importar no seu **Flex Builder 3**.

## Aplicação Rodando
[FlexPHP](http://23.20.48.222/downloads/postagens/flexphp/)

**Source do Projeto:** **[Projeto FlexPHP](http://23.20.48.222/downloads/postagens/flexphp/srcview/index.html)**

Para aqueles que tiverem dúvidas, sujestões ou críticas podem entrar em contato comigo, na medida do possível estarei lhes respondendo.

Obrigado a Todos e um Bom Proveito!

Liz.. te amo querida! =\*
