---
title: "Integrando Flex, BlazeDS, Spring e Hibernate — Parte 1"
description: "Primeira parte do tutorial histórico de uma arquitetura web open source com Adobe Flex, BlazeDS, Spring Framework e Hibernate."
permalink: "2008/01/21/integrando-adobe-flex-blazeds-springframework-hibernate-uma-soluo-opensource-para-sistemas-web-parte-1"
publishedAt: "2008-01-21T09:00:22.000Z"
reviewedAt: "2026-07-11"
language: "pt-BR"
categories: ["Hibernate","Java","Spring Framework"]
tags: ["Flex Builder","SpringFramework"]
draft: false
wordpressId: 140
translationKey: "2008/01/21/integrando-adobe-flex-blazeds-springframework-hibernate-uma-soluo-opensource-para-sistemas-web-parte-1"
legacyUrl: "https://digows.com/2008/01/21/integrando-adobe-flex-blazeds-springframework-hibernate-uma-soluo-opensource-para-sistemas-web-parte-1/"
legacy: true
---
Olá Pessoal,

Hoje vou começar algo que estou prometendo há um bom tempo! A integração dos seguintes frameworks:

> **[Adobe Flex;](http://pt.wikipedia.org/wiki/Adobe_Flex)** **[Adobe BlazeDS;](http://en.wikipedia.org/wiki/BlazeDS)** **[Spring Framework;](http://www.springframework.org/)** **[Hibernate;](http://www.hibernate.org/)**

## Introdução

No mundo de desenvolvimento WEB principalmente com Java, temos problemas quanto ao desenvolvimento de interfaces, como incompatibilidade entre browsers, desenvolviemento lento, e outros detalhes que muitos vivenciam diariamente.

Existem soluções que prometem como o [JSF](http://www.javafree.org/wiki/JSF) por exemplo, mas como dizem **_"A primeira experiência em Flex o programador Java nunca esquece."_** logo quero convidar você que vem do mundo do Java, para conhecer uma solução de desenvolvimento de interfaces com o AdobeFlex.

## Apresentando Adobe Flex e Adobe BlazeDS

## Adobe Flex
Do Flex não vou falar muito, também por que neste blog você pode encontrar muito conteúdo explicativo como por exemplo este link: [/2007/07/10/convenca-sua-equipe-para-desenvolvimento-web-e-com-adobe-flex/](/2007/07/10/convenca-sua-equipe-para-desenvolvimento-web-e-com-adobe-flex/) algumas abordagens ali já estão desatualizadas, porém a essência é a mesma como por exemplo algumas vantagens de se usar Flex:

> O Flex é executado a partir de uma máquina virtual, logo o programador apenas se preocupa em desenvolver a interface não em programar compatibilidade entre browsers. Você programa sua interface totalmente orientada a objetos, isso visa reuso de componentes, desenvolvimento de módulos e afins. Há várias maneiras de comunicar o Java com o Flex, mas em destaque é que você pode trocar objetos Java/Flex por um protocolo que provê compactação e tranferência binária, este é o [AMF](http://download.macromedia.com/pub/labs/amf/amf3_spec_121207.pdf).

## Adobe BlazeDS
O **BlazeDS** é um produto OpenSource (**Licença LGPL v3**) que corresponde à tecnologia JAVA server-side que dá suporte tanto para o Remoting assim como ao Messaging de objetos trocados entre o Java e o Flex/Flash.

Com o **BlazeDS** você pode gerar vários tipos de canais de conexão, um destaque muito importante para toda a comunidade Flex/Flash mundial, é que o serviço de **data-push** também foi disponibilizado de graça!, para quem não conhece, é algo semelhante ao [Pattern Observer](http://jacques.dsc.ufcg.edu.br/cursos/map/html/arqu/observer.htm).

## Integrando o Adobe Flex com o BlazeDS

## Requerimentos:
> [Eclipse 3.3;](http://www.eclipse.org/downloads/) [Adobe Flex Builder 3 Plugin;](http://labs.adobe.com/technologies/flex/flexbuilder3/) _\*No título apresento como solução OpenSource, e o FlexBuilder 3 é pago, mas irei fazer uso apenas para facilitar o entendimento, caso seja estudante, baixe o [FlexBuilder 2](http://www.flexregistration.com/) é de graça para estudantes ou afins, caso não, baixe o [Flex SDK](http://labs.adobe.com/technologies/flex/sdk/flex3sdk.html) e compile com Ant ou com o [FlashDeveloper](http://forum.flexbrasil.com.br/viewtopic.php?f=5&t=25) que é de graça._ [Adobe BlazeDS;](http://labs.adobe.com/technologies/blazeds/) _\*É recomendável que baixe a [documentação](http://livedocs.adobe.com/labs/blazeds/blazeds_devguide_12-12-07.pdf) do BlazeDS, para futuros estudos._ [Tomcat 6.0;](http://tomcat.apache.org/download-60.cgi)

Ok, Vamos começar!

> Extraia o Eclipse 3.3 em algum lugar, por exemplo **C:/Desenvolvimento/Eclipse 3.3/** Instale o Plugin do Flex no Eclipse, quando pedir o local aonde instalar o flex sdk, você pode selecionar em **C:/Desenvolvimento/Frameworks/Adobe/**

Após baixado o BlazeDS, perceba que ele vem vários arquivos, o que importa agora são os seguintes:

> **blazeds-samples.war** **blazeds.war**

No **blazeds-samples.war** como o próprio nome diz, contém aplicações de exemplo, como implementação do data-push, um chat, e etc...

O **blazeds.war** contém tudo o que é necessário para podermos configurar nossa aplicação.

Você deve ter percebido que no arquivo que você baixou o BlazeDS, contém um Tomcat já com todas as libs necessárias e etc.. Algumas libs ali tem reelevância como a **flex-tomcat-common.jar** e **flex-tomcat-server.jar** mas vamos deixar isso para outro artigo =)

Apesar do BlazeDS já vir com um Tomcat, eu estarei usando meu próprio Tomcat 6.0.

Abra seu Eclipse, e faça como no screencast abaixo que mostra como criar seu projeto no Eclipse 3.3:

[Link Externo](http://23.20.48.222/downloads/screencast/JavaFlex/JavaFlex_Parte1_Criando_o_Projeto/JavaFlex_Parte1_Criando_o_Projeto.htm)

_\*Se na aba "**Problems**" estiver com o erro "**Cannot create HTML wrapper. Right-click here to recreate folder html-template.**" clique com o botão direito, e clique em **Recreate HTML Templates.** Considero isso um bug do FlexBuilder._

Com o projeto criado, vamos adicionar as libs necessárias para a execução do BlazeDS, para isso abra o **blazeds.war** (Com um Winrar da vida) e copie todos os Jars contidos na pasta **WEB-INFlib** para o nosso projeto na pasta **WebContentWEB-INFlib.**

Com as Libs adicionadas, vamos criar um serviço no java que servirá como exemplo de como o Flex pode acessar uma classe java através do BlazeDS.

Para isso na pasta **src\_java,** crie uma estrutura de pacotes, por exemplo:

**com/digows/artigos/JavaFlex/model/service/** **com/digows/artigos/JavaFlex/model/entity/**

> *Historic image unavailable from the original source: Historic article image.*

Dentro do package **entity** crie uma classe java com o nome de **Cargo** com o seguinte conteúdo:

## Cargo.java
```java
package com.digows.artigos.JavaFlex.model.entity;

public class Cargo {

	private long idCargo;
	private String dsCargo;

	public long getIdCargo() {
		return idCargo;
	}
	public void setIdCargo(long idCargo) {
		this.idCargo = idCargo;
	}
	public String getDsCargo() {
		return dsCargo;
	}
	public void setDsCargo(String dsCargo) {
		this.dsCargo = dsCargo;
	}
}
```

**Entities** (ou Entidades, nenhuma relação com Entity Beans) são objetos que possuem uma identidade única.

Um carrinho de compras numa loja virtual web não é igual a outro, não importa que possuam os mesmos produtos, o carrinho A é o carrinho do usuário A, o carrinho B é do usuário B. Mesmo que contenham os mesmos produtos você não pode exibir o carrinho B ao usuário A, eles são diferentes! O carrinho neste exemplo segue o Padrão **Entity**, ele é uma entidade de negócios única.

Dentro do package **services** crie uma classe java com o nome de **CargoService** com o seguinte conteúdo**:**

## CargoService.java
```java
package com.digows.artigos.JavaFlex.model.service;

import java.util.ArrayList;
import java.util.List;

import com.digows.artigos.JavaFlex.model.entity.Cargo;

public class CargoService {

	public Cargo save(Cargo p_cargo) {
		System.out.println("Salvou o Cargo: "+p_cargo.getDsCargo());
		return p_cargo;
	}

	public void remove(Cargo p_cargo) {
		System.out.println("Excluiu o Cargo: "+p_cargo.getDsCargo());
	}

	public List getList() {
		return new ArrayList();
	}

	public Cargo findByPrimaryKey() {
		return new Cargo();
	}
}
```

**Services** são classes que não implementam diretamente as regras de negócio da aplicação, apenas coordenam a interação entre os componentes, elas são quase sempre beans gerenciados pelo Spring. É muito importante que as classes do tipo **Services** não implementem as regras de negócio, elas apenas atuam como **Façades** coordenando as interações.

O **CargoService** claro não proverá persistência a um banco de dados, os sysouts ali são apenas para abstração da intragração.

Com as classes javas feitas, vamos a configuração dos channels do BlazeDS, para isso no web.xml contido dentro da pasta **WebContentWEB-INFweb.xml,** deixe como mostrado abaixo:

## web.xml
```xml
ArquiteturaJavaFlex

	<!-- MessageBroker Servlet -->

		MessageBrokerServlet
		MessageBrokerServlet

			flex.messaging.MessageBrokerServlet

			services.configuration.file
			/WEB-INF/flex/services-config.xml

			flex.write.path
			/WEB-INF/flex

		1

		MessageBrokerServlet
		/messagebroker/*

		index.html
		index.htm
		index.jsp
```

Perceba que ao gerar a Servlet Java, é passado por parâmetro um arquivo dentro da pasta **WebContentWEB-INFflex,** crie um arquivo chamado **services-config.xml** como referênciado, este arquivo é o que contém **Factorys, Channels, LogConfigs.** Nós vamos usar apenas um tipo de serviço que o BlazeDS implementa, que o canal de AMF3 simples, para isso adicione o seguinte conteúdo:

## services-config.xml
```xml
false

        <!-- You may also use flex.messaging.log.ServletLogTarget -->

                false
                false
                true
                false

                <!--Endpoint.*-->
                <!--Service.*-->
                Message.*
                DataService.*
                Configuration

            true
            20
            {context.root}/WEB-INF/flex/services-config.xml
            {context.root}/WEB-INF/flex/remoting-config.xml
            {context.root}/WEB-INF/web.xml
```

Perceba que é feito um include em um arquivo chamado: **remoting-config.xml**, então crie um arquivo com este nome na pasta **WebContentWEB-INFflex.** Este arquivo contém alguns **adapters,** e nossos **destinations**, que nada mais é que o mapeamento das nossas classes de serviços no java. Para isso adicione o seguinte conteúdo:

## remoting-config.xml
```xml
com.digows.artigos.JavaFlex.model.service.CargoService
```

A estrutura deverá ficar igual apresentado abaixo:

> *Historic image unavailable from the original source: image.*

Para testar se tudo está ok, de um botão direito sobre o Projeto **JavaFlex**, e clique em **Run As -> Run on Server.** Na proxima janela aberta, em **server runtime** deixe seleciona o "**Apache Tomcat v6.0**" e clique em **finish**, o Servidor irá iniciar, observer a aba **Console** para verificar possíveis erros. Se alguma Exception tiver ocorrida, verifique os passos e faça novamente.

## Acessando o serviço Java através do remoting do BlazeDS

Como nosso serviço já foi levantado, basta gerarmos um form simples para testar nosso serviço, para isso na pasta **src\_flex**, crie a seguinte estrutura de pastas:

**com/digows/artigos/JavaFlex/view/entity/** **com/digows/artigos/JavaFlex/view/screen/**

> *Historic image unavailable from the original source: Historic article image.*

Dentro do package **Entity** crie uma Classe ActionScript com o nome de **Cargo** com o seguinte conteúdo:

## Cargo.as
```actionscript-3
package com.digows.artigos.JavaFlex.view.entity
{

	public class Cargo
	{
		public var idCargo:Number;
		public var dsCargo:String;
	}
}
```

A Classe **Cargo** do Flex, é nada mais nada menos do que o espelho do **Entity** do java, nesta classe não realizei get's set's. Para fazer o espelho dos objetos usei a **metatag** mapeando a localização exata (Com package e nome da Classe) da mesma classe no java. A **metatag Bindable** é uma annotation muito importante, mais agora vamos apenas abstrair ela.

E dentro do package **Screen,** crie um arquivo MXML com o nome de CargoForm com o seguinte conteúdo:

## CargoForm.mxml
Perceba que acoplei muito código neste arquivo, isto não é uma boa prática, nos próximos artigos irei desaclopar as responsabilidades em camadas.

Para testar se tudo está ok, no arquivo **JavaFlex.mxml** que está na raiz da pasta **src\_flex** renomeie para **index.mxml**, de um botão direito e clique em **Set as Default Application,** e deixe ele com o seguinte conteúdo:

## index.mxml
E para finalizar vamos dizer ao compilador do Flex que existe um servidor de AMF levantado, para isso de um botão direito no projeto **JavaFlex** **\-> Properties -> Selecione Flex Compiler -> em Additional compiler arguments** adicione a linha e ok:

> \-services "../WebContent/WEB-INF/flex/services-config.xml"

Para Executar, de um botão direito sobre o projeto **JavaFlex**, e clique em **Run As -> Run on Server e Finish.**

Se tudo correr bem, você verá a descrição que você digitou no flex aparecerá no console do Tomcat.

Bom finalizo aqui a primeira parte desta poderosa integração, logo logo posto o resto.

**Link do Source do Projeto:** [Download](http://23.20.48.222/downloads/postagens/javaflex/JavaFlex_part1.rar)

Abraço Pessoal!!

o/

Te Amuh Liz!! =\*\*\*\*\*\*
