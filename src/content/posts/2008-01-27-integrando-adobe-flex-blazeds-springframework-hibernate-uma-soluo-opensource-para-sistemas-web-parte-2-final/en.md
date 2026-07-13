---
title: "Integrating Flex, BlazeDS, Spring, and Hibernate — Part 2"
description: "Part two: Spring-managed services, a BlazeDS bean factory, declarative transactions, and Hibernate persistence."
permalink: "2008/01/27/integrating-flex-blazeds-spring-and-hibernate-part-2"
publishedAt: "2008-01-27T23:00:09.000Z"
reviewedAt: "2026-07-11"
language: "en"
categories: ["Hibernate","Java","Spring Framework"]
tags: ["Adobe Flex","BlazeDS","Transactions"]
draft: false
translationKey: "2008/01/27/integrando-adobe-flex-blazeds-springframework-hibernate-uma-soluo-opensource-para-sistemas-web-parte-2-final"
translationOf: "2008/01/27/integrando-adobe-flex-blazeds-springframework-hibernate-uma-soluo-opensource-para-sistemas-web-parte-2-final"
legacyUrl: "https://digows.com/2008/01/27/integrando-adobe-flex-blazeds-springframework-hibernate-uma-soluo-opensource-para-sistemas-web-parte-2-final/"
legacy: true
---
The [first part](/2008/01/21/integrating-flex-blazeds-spring-and-hibernate-part-1/) connected an Adobe Flex client to a Java service through BlazeDS. This conclusion moves object creation and persistence into Spring and Hibernate.

> **Historical context:** this article uses Spring 2.5, Hibernate 3, MySQL 5, Java-era XML configuration, and a third-party BlazeDS factory from 2008. Preserve it as an architectural record, not as current setup guidance.

## Target architecture

The final request path was:

1. Flex called a BlazeDS remoting destination.
2. A BlazeDS factory resolved the destination from Spring instead of constructing the service itself.
3. The Spring service enforced the use case and owned the transaction.
4. A repository interface isolated persistence behavior.
5. A Hibernate repository implemented queries and CRUD operations.
6. Hibernate mapped the `Cargo` object to MySQL.

## Repository layer

The implementation used Spring's `@Repository` stereotype and injected a Hibernate `SessionFactory` with `@Autowired`. It implemented a separate `CargoRepository` interface so the service did not depend on Hibernate directly.

```java
@Repository
public class CargoHibernateDao implements CargoRepository
{
    @Autowired
    private SessionFactory sessionFactory;

    public Cargo get(Long idCargo)
    {
        return (Cargo) sessionFactory.getCurrentSession()
            .get(Cargo.class, idCargo);
    }

    @SuppressWarnings("unchecked")
    public List<Cargo> list()
    {
        return sessionFactory.getCurrentSession()
            .createQuery("from Cargo")
            .list();
    }
}
```

The XML mapping file kept persistence metadata out of the domain class—a deliberate trade-off chosen by the original article instead of Hibernate annotations.

## Service layer and transactions

The service implementation used `@Service` for component discovery, `@Transactional` for its transaction boundary, and `@Autowired` to receive a repository implementation.

```java
@Service("cargoService")
@Transactional
public class CargoServiceImpl implements CargoService
{
    @Autowired
    private CargoRepository cargoRepository;

    public Cargo get(Long idCargo)
    {
        return cargoRepository.get(idCargo);
    }

    public List<Cargo> list()
    {
        return cargoRepository.list();
    }
}
```

The important design decision was that transaction management belonged to the service use case—not to the Flex client or Hibernate DAO.

## Spring and Hibernate configuration

The application context enabled annotation scanning and transactional proxies, configured the data source from `jdbc.properties`, constructed the Hibernate session factory, and loaded mapping files. `web.xml` initialized the Spring context before the BlazeDS message broker.

The original setup also configured Log4j for development diagnostics and added the MySQL connector, Spring, Hibernate, and BlazeDS libraries to the web application.

## Connecting BlazeDS to Spring

BlazeDS normally constructed the Java class named by a remoting destination. The tutorial replaced that behavior with a factory that looked up `cargoService` in Spring. The destination therefore referenced a Spring bean and preserved dependency injection and transactional proxies.

The MXML client did not need to change: it still called the same destination and received the same typed objects. Only the server-side object lifecycle and persistence implementation changed.

The downloadable project and forum thread are no longer available. The Portuguese original preserves the full recovered Spring context, web descriptor, properties, mappings, and Java source.
