---
title: "Integrating Flex, BlazeDS, Spring, and Hibernate — Part 1"
description: "Part one of a historical open-source web architecture tutorial using Adobe Flex, BlazeDS, Spring Framework, and Hibernate."
permalink: "2008/01/21/integrating-flex-blazeds-spring-and-hibernate-part-1"
publishedAt: "2008-01-21T09:00:22.000Z"
reviewedAt: "2026-07-11"
language: "en"
categories: ["Hibernate","Java","Spring Framework"]
tags: ["Adobe Flex","BlazeDS"]
draft: false
translationKey: "2008/01/21/integrando-adobe-flex-blazeds-springframework-hibernate-uma-soluo-opensource-para-sistemas-web-parte-1"
translationOf: "2008/01/21/integrando-adobe-flex-blazeds-springframework-hibernate-uma-soluo-opensource-para-sistemas-web-parte-1"
legacyUrl: "https://digows.com/2008/01/21/integrando-adobe-flex-blazeds-springframework-hibernate-uma-soluo-opensource-para-sistemas-web-parte-1/"
legacy: true
---
This two-part tutorial, originally published in 2008, combined **Adobe Flex**, **BlazeDS**, **Spring Framework**, and **Hibernate** in an open-source Java web architecture. Part one establishes communication between Flex and a Java service through BlazeDS.

> **Historical context:** every version and deployment instruction in this article is obsolete. The architecture is preserved to document the period; it is not a secure or supported starting point for a new application.

## Responsibilities

- **Flex** rendered the client interface in Flash Player and exchanged typed values with Java through AMF.
- **BlazeDS** provided remoting and messaging between the Flex client and the Java web application.
- **Spring** would manage service objects, dependency injection, and transactions in part two.
- **Hibernate** would implement relational persistence in part two.

## Preparing BlazeDS

The original environment used Eclipse 3.3, the Flex Builder 3 plugin, BlazeDS, and Tomcat 6. The `blazeds.war` sample was expanded into Tomcat, then copied into a new Java web project.

The example domain was deliberately small: a `Cargo` object represented a job role, and `CargoService` returned a list of roles.

```java
package com.digows.artigos.JavaFlex.model.vo;

import java.io.Serializable;

public class Cargo implements Serializable
{
    private static final long serialVersionUID = 1L;

    private Long idCargo;
    private String dsCargo;

    public Long getIdCargo()
    {
        return idCargo;
    }

    public void setIdCargo(Long idCargo)
    {
        this.idCargo = idCargo;
    }

    public String getDsCargo()
    {
        return dsCargo;
    }

    public void setDsCargo(String dsCargo)
    {
        this.dsCargo = dsCargo;
    }
}
```

`CargoService` exposed a method that populated sample values. BlazeDS instantiated that class and made it available to Flex as a remoting destination.

## Web and remoting configuration

The web application registered the BlazeDS message broker servlet in `web.xml`. `services-config.xml` declared the AMF channel, while `remoting-config.xml` mapped a destination name to the Java service class.

At compile time, Flex Builder received the service configuration through the `-services` option. On the client, an ActionScript class with matching fields represented `Cargo`, and the MXML form invoked the remote destination asynchronously.

## Result

At the end of part one, the Flex client could request a typed list of job roles from the Java service. [Part two](/2008/01/27/integrating-flex-blazeds-spring-and-hibernate-part-2/) replaces direct service construction with Spring-managed beans and adds Hibernate persistence.

The Portuguese original preserves the complete recovered `web.xml`, channel configuration, Java classes, and ActionScript fragments.
