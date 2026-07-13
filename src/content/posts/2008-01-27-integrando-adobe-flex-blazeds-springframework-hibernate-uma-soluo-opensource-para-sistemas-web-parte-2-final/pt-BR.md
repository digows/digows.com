---
title: "Integrando Flex, BlazeDS, Spring e Hibernate — Parte 2"
description: "Conclusão do tutorial: beans com annotations, integração do Spring aos serviços Flex e persistência com Hibernate."
permalink: "2008/01/27/integrando-adobe-flex-blazeds-springframework-hibernate-uma-soluo-opensource-para-sistemas-web-parte-2-final"
publishedAt: "2008-01-27T23:00:09.000Z"
reviewedAt: "2026-07-11"
language: "pt-BR"
categories: ["Hibernate","Java","Spring Framework"]
tags: ["RIA"]
draft: false
wordpressId: 141
translationKey: "2008/01/27/integrando-adobe-flex-blazeds-springframework-hibernate-uma-soluo-opensource-para-sistemas-web-parte-2-final"
legacyUrl: "https://digows.com/2008/01/27/integrando-adobe-flex-blazeds-springframework-hibernate-uma-soluo-opensource-para-sistemas-web-parte-2-final/"
legacy: true
---
Olá Pessoal!

Primeiro lugar, quero agradecer a todos pelo feedback do [post anterior](/2008/01/21/integrando-adobe-flex-blazeds-springframework-hibernate-uma-soluo-opensource-para-sistemas-web-parte-1/), isto é motivante e me dá ânimo em concluir este, e outros que virão.

Hoje o foco deste artigo é que você termine ele sabendo:

> Configurar os Beans do **Spring** através de annotations; Integrar o esquema de **Beans** do **Spring** com os **services** do Flex através de uma **Factory**; Configurar o **Spring** para usar o **Hibernate** para abstrair nosso banco de dados;

Para isso vamos a uma breve introdução a estes poderosos frameworks

## Breve Introdução ao Spring

[spring](http://www.springframework.org/)

Como não sou fã de ficar re-escrevendo a roda, vou tentar dar a você leigo em Spring, um caminho para estudar.

> _**Primeiro de tudo, leia este artigo feito pelo**_ _**[Phillip Calçado (Shoes)](http://blog.fragmental.com.br/)**_ [apostila-spring.pdf](http://blog.flexdev.com.br/wp-content/uploads/spring/apostila-spring.pdf "apostila-spring.pdf")  _Valeu_ [_Ebertom_](http://blog.flexdev.com.br/) _pela hospedagem! =)_ **_Uma Introdução ao que o  SpringFramework pode oferecer:_** [http://blog.fragmental.com.br/2005/08/31/spring-em-acao/](http://blog.fragmental.com.br/2005/08/31/spring-em-acao/) [http://www.ime.usp.br/~reverbel/SMA/Slides/seminarios/spring.pdf](http://www.ime.usp.br/~reverbel/SMA/Slides/seminarios/spring.pdf "http://www.ime.usp.br/~reverbel/SMA/Slides/seminarios/spring.pdf") [http://imasters.uol.com.br/artigo/4497/java/spring\_framework\_introducao/](http://imasters.uol.com.br/artigo/4497/java/spring_framework_introducao/ "http://imasters.uol.com.br/artigo/4497/java/spring_framework_introducao/") _**Outros Tutoriais**_ [http://www.javafree.org/content/view.jf?idContent=46](http://www.javafree.org/content/view.jf?idContent=46 "http://www.javafree.org/content/view.jf?idContent=46") [http://www.devmedia.com.br/articles/viewcomp.asp?comp=6627](http://www.devmedia.com.br/articles/viewcomp.asp?comp=6627 "http://www.devmedia.com.br/articles/viewcomp.asp?comp=6627") [http://www.devmedia.com.br/articles/viewcomp.asp?comp=6628](http://www.devmedia.com.br/articles/viewcomp.asp?comp=6628 "http://www.devmedia.com.br/articles/viewcomp.asp?comp=6628") [http://www.devmedia.com.br/articles/viewcomp.asp?comp=6653](http://www.devmedia.com.br/articles/viewcomp.asp?comp=6653 "http://www.devmedia.com.br/articles/viewcomp.asp?comp=6653") **_Spring Annotations_** [http://blog.interface21.com/main/2006/11/28/a-java-configuration-option-for-spring/](http://blog.interface21.com/main/2006/11/28/a-java-configuration-option-for-spring/ "http://blog.interface21.com/main/2006/11/28/a-java-configuration-option-for-spring/") [http://weblogs.java.net/blog/seemarich/archive/2007/11/annotation\_base\_1.html](http://weblogs.java.net/blog/seemarich/archive/2007/11/annotation_base_1.html "http://weblogs.java.net/blog/seemarich/archive/2007/11/annotation_base_1.html") **_Exemplos de códigos_** [http://paulojeronimo.com/arquivos/tutoriais/tutorial-spring-framework.zip](http://paulojeronimo.com/arquivos/tutoriais/tutorial-spring-framework.zip "http://paulojeronimo.com/arquivos/tutoriais/tutorial-spring-framework.zip") [http://www.java2s.com/Code/Java/Spring/CatalogSpring.htm](http://www.java2s.com/Code/Java/Spring/CatalogSpring.htm "http://www.java2s.com/Code/Java/Spring/CatalogSpring.htm") **_Documentação_** [The Spring Framework - Reference Documentation](http://static.springframework.org/spring/docs/2.5.x/reference/index.html "The Spring Framework - Reference Documentation")

Bom acredito que se você que está afim de conhecer o **SpringFramewok**, com esses Link's já é possível entender quase tudo o que ele pode oferecer a sua arquitetura. Lembrando que não é recomendável seguir com este artigo, sem antes entender como funciona  [IoC](http://www.javafree.org/content/view.jf?idContent=1), [AOP](http://pt.wikipedia.org/wiki/Programa%C3%A7%C3%A3o_orientada_a_aspecto), [DAO](http://www.google.com.br/url?q=http://pt.wikipedia.org/wiki/Data_Access_Object&revid=431202949&sa=X&oi=revisions_inline&resnum=0&ct=result&cd=2&usg=AFQjCNGQrW8xHQ3ujBGOkV86w-0pc_48MQ), com o SpringFramework.

\***Nota** A abordagem aqui é sobre o **SpringFramework**, (Framework de Negócio) e não sobre o **SpringMVC**, uma vez que o Flex pode se trocar objetos através do protocolo **AMF3,** é totalmente dispensável o uso de Frameworks **[MVC's](http://www.cfgigolo.com/archives/2008/01/mvc_model_view_controller_e_os_trs_macacos_tres_macacos.html)**.

## Breve Introdução ao Hibernate

[View historic media](http://www.hibernate.org/)

Como eu já disse, uma vez que já existe um bom conteúdo sobre Hibernate na Internet, não há a necessidade de re-escrever, por isso vou lhe dar a você leigo em Hibernate uma sequência de Link que irá te ajudar a entender este poderoso Framework.

> _**Uma Introdução ao que o  Hibernate pode oferecer:**_ [http://www.students.ic.unicamp.br/~ra007271/docs/white-papers/hibernate-uma\_introducao\_dirigida.pdf](http://www.students.ic.unicamp.br/~ra007271/docs/white-papers/hibernate-uma_introducao_dirigida.pdf "http://www.students.ic.unicamp.br/~ra007271/docs/white-papers/hibernate-uma_introducao_dirigida.pdf") [http://www.guj.com.br/java.tutorial.artigo.125.1.guj](http://www.guj.com.br/java.tutorial.artigo.125.1.guj "http://www.guj.com.br/java.tutorial.artigo.125.1.guj") [http://www.jeebrasil.com.br/mostrar/4](http://www.jeebrasil.com.br/mostrar/4 "http://www.jeebrasil.com.br/mostrar/4") [http://www.devmedia.com.br/articles/viewcomp.asp?comp=4149](http://www.devmedia.com.br/articles/viewcomp.asp?comp=4149 "http://www.devmedia.com.br/articles/viewcomp.asp?comp=4149") **_Outros Tutoriais_** [http://simundi.blogspot.com/2007/09/criar-uma-aplicao-com-hibernate.html](http://simundi.blogspot.com/2007/09/criar-uma-aplicao-com-hibernate.html "http://simundi.blogspot.com/2007/09/criar-uma-aplicao-com-hibernate.html") [http://www.hibernate.org/hib\_docs/v3/reference/en/html/queryhql.html](http://www.hibernate.org/hib_docs/v3/reference/en/html/queryhql.html "http://www.hibernate.org/hib_docs/v3/reference/en/html/queryhql.html") [http://www.hibernate.org/hib\_docs/tools/reference/en/html/plugins.html](http://www.hibernate.org/hib_docs/tools/reference/en/html/plugins.html "http://www.hibernate.org/hib_docs/tools/reference/en/html/plugins.html") [http://www.guj.com.br/posts/list/7249.java](http://www.guj.com.br/posts/list/7249.java "http://www.guj.com.br/posts/list/7249.java") **_Pacotão de PDF's_** [http://br.groups.yahoo.com/group/java-br/files/Hibernate/](http://br.groups.yahoo.com/group/java-br/files/Hibernate/ "http://br.groups.yahoo.com/group/java-br/files/Hibernate/") **_Exemplos de código_** [http://www.java2s.com/Code/Java/Hibernate/CatalogHibernate.htm](http://www.java2s.com/Code/Java/Hibernate/CatalogHibernate.htm "http://www.java2s.com/Code/Java/Hibernate/CatalogHibernate.htm") **_Documentação_** [http://www.hibernate.org/hib\_docs/v3/reference/en/html/](http://www.hibernate.org/hib_docs/v3/reference/en/html/ "http://www.hibernate.org/hib_docs/v3/reference/en/html/")

Ok, partindo do princípio que você já entendeu como funciona o **Hibernate**, e o **Spring,** vamos ao código! +)

## Requerimentos:
> **[SpringFramework 2.5](http://downloads.sourceforge.net/springframework/spring-framework-2.5.1-with-dependencies.zip?modtime=1199893964&big_mirror=0)** ou superior; \*_Vamos baixar o Spring com as dependências, isto é neste arquivo conterá todas as libs que nós podemos por ventura usar com o Spring, como por exemplo as libs do hibernate._ [MySql 5.x Instalado;](http://dev.mysql.com/downloads/mysql/5.0.html) _\*Eu estarei usando o pacote [apache friends - xampp](http://www.apachefriends.org/pt_br/xampp.html "apache friends - xampp")_ **[MySql JConnector 5.x.x](http://dev.mysql.com/get/Downloads/Connector-J/mysql-connector-java-5.1.5.tar.gz/from/pick)****;** Conhecimentos básicos sobre **MySql;** Plugin Eclipse **[SpringIDE](http://springide.org/updatesite/)****; \***_Opcional_ Plugin Eclipse **[Hibernate Tools 3.2.x](http://sourceforge.net/project/downloading.php?groupname=jboss&filename=HibernateTools-3.2.0.GA.zip)**_; **\***_Opcional__

Instale os plugin's estes opcionais na verdade este artigo não fará uso deles, mas pensando no futuro seria interessante fazer uso deles.

Após isso, abra seu projeto no Eclipse que nós tinhamos criado anteriormente, O [JavaFlex](http://23.20.48.222/downloads/postagens/javaflex/JavaFlex_part1.rar).

Vamos adicionar as seguintes libs ao projeto na pasta **JavaFlexWebContentWEB-INFlib:**

> *Historic image unavailable from the original source: Library.*

\*_A maioria das libs podem ser encontrada no arquivo compactado que você baixou do Spring. Lembrando também que o modelo de estilo de projeto criado no Eclipse, **Dynamic Web Project,** já adiciona automaticamente ao Classpath do projeto ao você colar as libs nesta pasta._

Como nós já tinhamos modelado um caso de uso chamado **Cargo,** vamos agora criar um banco de dados para o nosso pequeno sistema.

Abra seu **MySql**, e execute este script **sql** que criará a base de dados chamada **JavaFlex**, e também a tabela **JAVAFLEX\_CARGO;**

```text
--
-- Banco de Dados: `javaflex`
--
CREATE DATABASE `javaflex` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE `javaflex`;

--
-- Estrutura da tabela `javaflex_cargo`
--

CREATE TABLE `javaflex_cargo` (
  `ID_CARGO` int(10) unsigned NOT NULL auto_increment,
  `DS_CARGO` varchar(50) collate utf8_unicode_ci NOT NULL,
  PRIMARY KEY  (`ID_CARGO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;
```

## Entendendo os Pacotes, e configurando a persistência

Com o banco de dados criado, vamos mapear a tabela no banco, com o nosso **Entity Cargo**, para isso, crie um package chamado:

## com.digows.artigos.JavaFlex.model.repository.hibernate.hbm
> Neste package irá conter todos os nossos mapeamentos em xml, alguns preferem fazer uso de annotations, só que pessoalmente não gosto de acoplar códigos de annotations em meus beans de negócio, prefiro delegar a função **Mapeamento** a arquivos xml's.

Neste mesmo package crie um arquivo chamado **Cargo.hbm.xml**, e adicione o seguinte conteúdo:

## Cargo.hbm.xml
Perceba que estamos mapeando nosso **entity** **Cargo** que foi criado no [post anterior](/2008/01/21/integrando-adobe-flex-blazeds-springframework-hibernate-uma-soluo-opensource-para-sistemas-web-parte-1/) com a tabela  **JAVAFLEX\_CARGO** criada recém.

## com.digows.artigos.JavaFlex.model.repository.hibernate
> Este package irá conter classes que implementam o [Pattern DAO](http://www.javafree.org/content/view.jf?idContent=183) usando o **Hibernate**. Métodos de [CRUD](http://pt.wikipedia.org/wiki/CRUD) e querys em geral usando o Hibernate deverão estar neste pacote estes separados por casos de uso.

Neste mesmo package, vamos criar um DAO usando o hibernate para o nosso **entity** **cargo**, para isso, crie uma classe java chamada **CargoHibernateDao,**  e adicione o seguinte conteúdo:

## CargoHibernateDao.java
```java
package com.digows.artigos.JavaFlex.model.repository.hibernate;

import java.util.List;

import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;
import org.springframework.stereotype.Repository;

import com.digows.artigos.JavaFlex.model.entity.Cargo;
import com.digows.artigos.JavaFlex.model.repository.CargoRepository;

@Repository(value="cargoRepository")
public class CargoHibernateDao extends HibernateDaoSupport
						implements CargoRepository {

	@Autowired
	public CargoHibernateDao(@Qualifier("sessionFactory")SessionFactory factory) {
		super.setSessionFactory(factory);
	}

	public Cargo save(Cargo p_cargo) {
		getHibernateTemplate().saveOrUpdate(p_cargo);
		return p_cargo;// ID POPULADA
	}

	public void remove(Cargo p_cargo) {
		getHibernateTemplate().delete(p_cargo);
	}

	public Cargo findById(Cargo p_cargo) throws Exception {
		long id = p_cargo.getIdCargo();
		p_cargo = (Cargo) getHibernateTemplate().get(Cargo.class, p_cargo.getIdCargo());

		if (p_cargo == null)
			throw new Exception("O Cargo com a ID: "+id+" do(a) "+Cargo.class.getSimpleName()+" não foi encontrada.");
		return p_cargo;
	}

	@SuppressWarnings("unchecked")
	public List getList() {
		return (List) getHibernateTemplate().loadAll(Cargo.class);
	}
}
```

Perceba que esta implementa apenas métodos de acesso ao banco de dados usando o hibernate. Nesta classe faço uso de annotations para que o container Spring faça o wire dos beans.

> **@Repository** A anotação **@Repository** é mais um estereótipo que foi introduzido no Spring 2.0. Esta anotação é usada para indicar que uma classe funciona como um repositório (Veremos mais adiante o que é este pattern), esta anotação faz com que o Spring envie Exceptions da persistência a camada de serviço, vindas de **DataAccessException,** isto é deixa tranparênte a camada de serviço o tipo de repository que foi implementado. **@Autowired** A anotação **@Autowired** é usada para a injeção de depêndencia da sessionFactory do hibernate. **@SuppressWarnings** Faço uso da anotação **@SuppressWarnings**, apenas para o compilador não gerar um Warning no cast da List, uma vez que o **Hibernate** foi projetado sem o uso de [Generics](http://www.mundooo.com.br/php/modules.php?name=News&file=article&sid=554), ao usar [Generics](http://www.mundooo.com.br/php/modules.php?name=News&file=article&sid=554) o compilador devolve um Warning.

Perceba que esta classe implementa uma interface, está interface implementa o pattern **Repository,** este padrão já causou muita polêmica em forums Java como o GUJ por exemplo, recomendo a leitura deste post para entender o padrão: [http://blog.caelum.com.br/2007/06/09/repository-seu-modelo-mais-orientado-a-objeto/](http://blog.caelum.com.br/2007/06/09/repository-seu-modelo-mais-orientado-a-objeto/ "http://blog.caelum.com.br/2007/06/09/repository-seu-modelo-mais-orientado-a-objeto/")

## com.digows.artigos.JavaFlex.model.repository
> Este package irá conter interfaces do tipo **repository** que dará comportamentos a **DAO's** sejam elas implementadas por DAO's Hibernate, DAO's JDBC, DAO's iBatis e etc...

Neste mesmo pacote, crie uma interface chamada **CargoRepository** com o seguinte conteúdo:

## CargoRepository.java
```java
package com.digows.artigos.JavaFlex.model.repository;

import java.util.List;
import com.digows.artigos.JavaFlex.model.entity.Cargo;

public interface CargoRepository {

	void remove(Cargo p_cargo);
	Cargo save(Cargo p_cargo);
	Cargo findById(Cargo p_cargo) throws Exception;
	List getList();
}
```

Ok! nossa persistência já foi programada, vamos agora alterar a classe **CargoService** que foi criado no post anterior, para que se comporte como uma classe de serviço gerenciada pelo container **Spring**.

Para isso, altere o nome da classe **CargoService** que está no package **com.digows.artigos.JavaFlex.model.service** para **CargoServiceImpl** e adicione este conteúdo:

## CargoServiceImpl.java
```java
package com.digows.artigos.JavaFlex.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.digows.artigos.JavaFlex.model.entity.Cargo;
import com.digows.artigos.JavaFlex.model.repository.CargoRepository;

@Service(value="cargoService")
@Transactional(propagation=Propagation.REQUIRED, rollbackFor=Exception.class)
public class CargoServiceImpl implements CargoService {

	private CargoRepository cargoRepository;

	@Autowired
	public void setCargoRepository(CargoRepository cargoRepository) {
		this.cargoRepository = cargoRepository;
	}

	public Cargo save(Cargo p_cargo) throws Exception {
		try {
			this.cargoRepository.save(p_cargo);
			return p_cargo;
		} catch (Exception e) {
			throw new Exception("Não foi possível salvar." +e.getCause());
		}
	}

	public void remove(Cargo p_cargo) throws Exception {
		try {
			this.cargoRepository.remove(p_cargo);
		} catch (Exception e) {
			throw new Exception("Não foi possível excluir." +e.getMessage());
		}
	}

	public Cargo findById(Cargo p_cargo) throws Exception {
		try {
			return this.cargoRepository.findById(p_cargo);
		} catch (Exception e) {
			throw new Exception("Não foi possível procurar pela ID."+e.getMessage());
		}
	}

	public List getList() throws Exception {
		try {
			return this.cargoRepository.getList();
		} catch (Exception e) {
			throw new Exception("Não foi possível listar."+e.getMessage());
		}
	}
}
```

Perceba que é uma classe de serviço simples, esta apenas tem a funcão de coodernar os Entities de domínio e fazer a persistência atráves de um repository.

> **@Service** A anotação **@Service** é uma forma especializada da anotação **@Component**. É conveniente anotar as classes da camada de serviço com **@Service** para facilitar o processamento por ferramentas ou antecipar qualquer futuro serviço de capacidades específicas que podem ser adicionados a esta anotação. **@Transactional** Como o próprio nome diz, é um estereótipo que delega ao container que esta classe de serviço deve ser transicional. **@Autowired** A anotação **@Autowired** é usada para a injeção de depêndencia que será feita pelo container de uma implementação da interface **CargoService**.

Nessa camada de serviço faço uso também do Pattern [DIP (Dependency Inversion Principle)](http://www.objectmentor.com/resources/articles/dip.pdf), por isso esta classe é uma implementação (CasoDeUsoService**Impl)** de uma interface de serviço, no caso a **CargoService**.

Para isso no pacote **com.digows.artigos.JavaFlex.model.service**, crie uma interface com o nome de **CargoService**, com este conteúdo:

## CargoService.java
```java
package com.digows.artigos.JavaFlex.model.service;

import java.util.List;

import com.digows.artigos.JavaFlex.model.entity.Cargo;

public interface CargoService {

	void remove(Cargo p_cargo) throws Exception;
	Cargo save(Cargo p_cargo) throws Exception;
	Cargo findById(Cargo p_cargo) throws Exception;
	List getList() throws Exception;
}
```

Ok, com estes passos realizados, já concluímos a implementação do nosso model. A estrutura final deverá ser esta:

> *Historic image unavailable from the original source: image.*

## Configurando o SpringFramework com o Hibernate e o Blaze.
No post anterior, configuramos o **Tomcat** para utilizar apenas o **BlazeDS**, agora precisamos adicionar mais as configurações  do **SpringFramework.**

Para isso abra o arquivo **JavaFlexWebContentWEB-INFweb.xml** e altere deixando com este conteúdo:

## web.xml
```xml
JavaFlex

	<!--
		///////////////////////////////
			Configuracao Spring 2.5
		///////////////////////////////
	-->

		contextConfigLocation

			/WEB-INF/applicationContext.xml

			org.springframework.web.context.ContextLoaderListener

			org.springframework.web.context.request.RequestContextListener

	<!--
		///////////////////////////////
			Configuracao do BlazeDS
		///////////////////////////////
	-->

		flex.class.path
		/WEB-INF/flex/hotfixes

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

Perceba na configuração do Spring, ele faz referência a um arquivo chamado **applicationContext.xml**, este arquivo é o que contém as configurações do Spring em si, então no mesmo diretório que se econtra o **web.xml,** crie um arquivo com o nome de **applicationContext.xml** e coloque este conteúdo:

## applicationContext.xml
```xml
<!--
		//////////////////////////////////////
		Integração do Spring com o Hibernate
		//////////////////////////////////////
	-->

	<!--
		Carregamento do Arquivo de Configuracoes do JDBC
	-->

	<!--
		Configuracao do DataSource
	-->

			${jdbc.driverClassName}

			${jdbc.url}

			${jdbc.username}

			${jdbc.password}

	<!--
		Hibernate SessionFactory
	-->

		<!-- Carrega todos os HBM's -->

					classpath:com/digows/artigos/JavaFlex/model/repository/hibernate/hbm/

		<!-- Configuracoes do Hibernate -->

					org.hibernate.dialect.MySQLInnoDBDialect

				true
				<!--
					Atualizar o Banco de dados de acordo com os arquivos de mapeamentos.
					update
				-->

			<map>

			</map>

	<!--
		Transaction Manager
	-->

	<!-- Habilita os Services para serem transicionais via a Annotation @Transactional -->

	<!-- ============================== AOP DEFINITIONS ================================ -->

	<!-- ========================= BUSINESS OBJECT DEFINITIONS ========================= -->
	<!--
		Activates various annotations to be detected in bean classes:
		Spring's @Required and @Autowired, as well as JSR 250's @Resource.
	-->

	<!-- Carrega os Beans de Servico -->

	<!-- Carrega os Beans DAO Hibernate -->
```

Perceba que as configurações do banco de dados usado, delego a um arquivo **.properties**, também vou precisar configurar o **log4j** para a impressão de log's. Por estética o bacana seria gerar um novo source-path que contenha tais arquivos **properties**.

> Crie um pasta na raiz do projeto com o nome de **resources,** De um botão direito sobre o projeto e clique em **properties;** Em **Java Build Path**, clique no botão **AddFolder;** Selecione a pasta **resources,** clique em **ok**, e marque a opção **Allow output folders for source folders,** e **ok.**

Dentro do package **resources,** crie um arquivo chamado **jdbc.properties**, e adicione o seguinte conteúdo:

## jdbc.properties
```text
# Properties file com as configuracoes do JDBC.
# Aplicado pelo PropertyPlaceholderConfigurer do Spring

jdbc.driverClassName=com.mysql.jdbc.Driver
jdbc.url=jdbc:mysql://localhost:3306/javaflex
jdbc.username=root
jdbc.password=

#Properties que determina o dialeto do Banco de Dados.
hibernate.dialect=org.hibernate.dialect.MySQL5InnoDBDialect
```

e outro arquivo chamado **log4j.properties** com este conteúdo:

## log4j.properties
```text
### direct log messages to stdout ###
log4j.appender.stdout=org.apache.log4j.ConsoleAppender
log4j.appender.stdout.Target=System.out
log4j.appender.stdout.layout=org.apache.log4j.PatternLayout
log4j.appender.stdout.layout.ConversionPattern=%d{ABSOLUTE} %5p %c{1}:%L - %m%n

# set root logger level to debug and its only appender to mtf
log4j.rootLogger=INFO,development

# only for development purposes
log4j.appender.development=org.apache.log4j.ConsoleAppender
log4j.appender.development.layout=org.apache.log4j.PatternLayout
log4j.appender.development.layout.ConversionPattern=%d{yyyy-MM-dd HH:mm:ss} %5p  (%F:%L) - %m%n

log4j.logger.noModule=FATAL
log4j.logger.org.springframework=WARN

# Log JDBC bind parameter runtime arguments
log4j.logger.org.hibernate.type=DEBUG
```

Uma outra modificação é necessária, está a mais importante, pois delega ao **Blaze**, que existe uma **factory** de beans criada pelo **Spring**.

> Essa factory deve ser implementada, porém já existe pronto na internet para uso, esta pode ser encontrada aqui: [Spring and Flex Integration Factory Class](http://www.adobe.com/cfusion/exchange/index.cfm?event=extensionDetail&loc=en_us&extid=1035406 "Spring and Flex Integration") Baixe ela, e coloque por exemplo neste pacote: **com.digows.artigos.JavaFlex.controller** **\***_O  nome controller ficou sugestivo aqui, uma vez que está factory não tem comportamentos de um controller, porém como o Flex não faz uso do controller para controlar as actions que também não existe, achei bacana preservar o package colocando a factory de beans do Spring que será usada pelo Blaze neste pacote. Se alguém tiver uma idéia melhor de onde colocar a classe, estou aceitando opniões._

Vamos então configurar o **Blaze**. Abra o arquivo **JavaFlexWebContentWEB-INFflexservices-config.xml** e altere deixando com este conteúdo:

## services-config.xml
```xml
<!-- Spring factory registration -->

				false

				true
				false
				true
				true

				Endpoint.*
				Service.*
				Message.*
				DataService.*
				Configuration

			true
			20

				{context.root}/WEB-INF/flex/services-config.xml

				{context.root}/WEB-INF/flex/remoting-config.xml

			{context.root}/WEB-INF/web.xml
```

Perceba que mapeio o local da Factory. Agora é preciso atualizar nosso servico **cargoService** dentro do arquivo **JavaFlexWebContentWEB-INFflexremoting-config.xml.** Então abra e edite deixando com este conteúdo:

## remoting-config.xml
```xml
spring
			cargoService
```

Aqui só é importante observar que a tag **<source />** mapeia o nome do bean do tipo serviço que foi delegado na annotation, no nosso caso na classe **CargoServiceImpl** perceba a annotation **@Service(value="cargoService")** e também a tag **<factory />** que faz referência a configuração no arquivo **services-config.xml**

Se tudo foi efetuado corretamente, ao você dar um botão direito no projeto e ir em **Run As -> Run On Server**, ao clicar em salvar no fomulário de cadastro criado no post anterior, o seu objeto cargo vindo do Flex já será persistido! observe o console para isso.

Eu alterei o arquivo **comdigowsartigosJavaFlexviewscreenCargoForm.mxml** para que possa usar todos os métodos do CRUD **Cargo**. Segue como ficou:

## CargoForm.mxml

> *Historic image unavailable from the original source: image.*

Bom pessoal, acredito que com estes 2 artigos consegui atingir o objetivo de dar a comunidade **Java** uma proposta de interface produtiva e poderosa, e também a comunidade **Flex** uma proposta de uma arquitetura com **Flex e Java,** utilizando o **Blaze Data Services.**

Faça mais testes, veja que o desenvolvimento é muito rápido! muito melhor do que se matar com tags **html** e funções em **JavaScript**.

Fora que você pode desenvolver com o **Flex** aplicando os conceitos de Orientação a Objetos, a começar pela tranferência de dados, no Flex chega Objetos! e não textos (XML, WebServices, Request/Response e afins).

Neste artigo não fiz uso de patterns para o desenvolvimento das telas em **Flex**, porém nos próximos artigos irei abordar detalhadamente como você pode arquiteturar seu código **Flex** visando ganhar manutenabilidade, escalabilidade, e reusabilidade.

## Tópico no Forum que contém detalhes sobre o download. Flex 2.0 e Flex 3.0
Obrigado a todos e um **Beijão** especial para minha querida **Liz**!

\=\*\*\*\*\*

Abraços

o/
