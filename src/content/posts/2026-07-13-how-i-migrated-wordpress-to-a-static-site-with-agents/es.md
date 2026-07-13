---
title: "Cómo migré de WordPress a un sitio estático con agentes"
seoTitle: "Cómo migré de WordPress a un sitio estático con agentes"
description: >-
  Cómo pasé de WordPress a Astro, Cloudflare y un flujo editorial con agentes, sin ocultar los límites, el trabajo técnico ni los costes.
permalink: "2026/07/13/como-migre-wordpress-a-un-sitio-estatico-con-agentes"
publishedAt: "2026-07-13T17:00:01.000Z"
reviewedAt: "2026-07-13"
language: "es"
categories:
  - "Arquitectura web"
  - "Ingeniería de software"
  - "Inteligencia artificial"
tags:
  - "WordPress"
  - "Astro"
  - "Cloudflare"
  - "Agentes de IA"
  - "CMS estático"
draft: false
translationKey: "2026/07/13/how-i-migrated-wordpress-to-a-static-site-with-agents"
translationOf: "2026/07/13/how-i-migrated-wordpress-to-a-static-site-with-agents"
legacy: false
editorial:
  quickSummary: >-
    Migré de WordPress a un sitio que combina páginas estáticas, unas pocas funciones dinámicas y agentes para ayudar con la redacción y la revisión. Las tareas del CMS siguen ahí, pero ahora se reparten entre Git, Astro, Cloudflare, agentes y decisiones humanas.
  keyTakeaways:
    - "Mi problema no era WordPress por sí mismo, sino el riesgo de ejecutar plugins de terceros de calidad desigual dentro del sitio."
    - "Los agentes ayudan a redactar y revisar, pero yo sigo aportando los hechos, marcando los límites y autorizando la publicación."
    - "Cloudflare ofrece servicios útiles en su capa gratuita, pero cada uno tiene cuotas, costes posibles y formas distintas de fallar."
    - "También decidí no usar Queues: una herramienta gratuita sigue siendo innecesaria si añade más trabajo del que elimina."
  strongestCounterargument: >-
    WordPress ya resuelve la edición visual, los permisos, los medios, las actualizaciones y muchas extensiones. Mi sistema no elimina ese trabajo: lo mueve a código propio, Git, CI, servicios externos y a la persona técnica que debe mantenerlo.
  appliesWhen:
    - "El sitio tiene una persona técnica que puede trabajar con Git, código y despliegues."
    - "La mayor parte del contenido puede ser estática y las funciones dinámicas son pocas y claras."
    - "Tener un flujo editorial propio y verificable compensa el trabajo de mantenerlo."
  doesNotApplyWhen:
    - "El equipo necesita edición visual, gestión delegada y muchas extensiones listas para instalar."
    - "Nadie puede mantener dependencias, seguridad, migraciones, métricas y recuperación ante fallos."
    - "Las cuotas gratuitas o la operación de Cloudflare no encajan con la carga del proyecto."
  discussionPrompt:
    key: "wordpress-static-agents.v2"
    text: "Si migraras tu CMS, ¿qué tarea llevarías al repositorio y cuál dejarías en una plataforma ya madura?"
  glossary:
    - term: "Generación estática"
      definition: "Crear el HTML antes de que llegue la visita, en lugar de ejecutar la aplicación para formar cada página."
    - term: "D1"
      definition: "Base de datos SQL administrada por Cloudflare que guarda las funciones dinámicas usadas en este sitio."
    - term: "Email Routing"
      definition: "Servicio que reenvía el correo recibido a un destino verificado o a un Worker."
    - term: "Subagente"
      definition: "Agente especializado que recibe una tarea, unas instrucciones y un contexto limitados."
    - term: "Código público"
      definition: "Código que cualquiera puede inspeccionar, aunque no tenga una licencia que permita reutilizarlo."
  relatedTranslationKeys:
    - "2026/05/20/the-high-individual-contributor-in-the-age-of-ai-agents"
  copyReviewed: true
---

Durante años quise salir de WordPress. Pero WordPress siguió ahí, funcionando. Hay que reconocerle esa resiliencia.

El motivo de mi incomodidad no era que «WordPress sea inseguro». Esa frase es demasiado simple y también es injusta. Mi problema era más concreto: un plugin pequeño y mal escrito podía romper todo el sitio porque ejecutaba código de terceros dentro de la misma aplicación.

La documentación de WordPress dice que los [plugins son software PHP adicional y que su calidad puede variar](https://wordpress.org/documentation/article/manage-plugins/). También recomienda mantenerlos actualizados y hacer una copia de respaldo antes de actualizarlos, porque pueden aparecer problemas. El propio núcleo necesita mantenimiento: la guía oficial para [reforzar la seguridad de WordPress](https://developer.wordpress.org/advanced-administration/security/hardening/) recuerda que las versiones antiguas dejan de recibir actualizaciones de seguridad.

Eso no significa que todos los plugins sean peligrosos ni que WordPress sea inseguro por naturaleza. Significa que cada plugin añade código, actualizaciones y posibles fallos. Para mi sitio, llegó un momento en que no quería seguir asumiendo ese conjunto.

Tampoco bastaba con «quitar el CMS». WordPress hacía muchas tareas útiles. Para entender la migración, hice una lista de esas tareas y decidí quién se encargaría de cada una. El contenido pasó a Git. Astro genera las páginas. Cloudflare cubre unas pocas funciones dinámicas. Un grupo de agentes me ayuda a preparar y revisar cada publicación. Yo sigo tomando la decisión final.

## No eliminé el CMS: repartí sus tareas

La primera versión de la migración tenía dos idiomas: portugués e inglés. Más tarde, la [arquitectura de contenido](https://github.com/digows/digows.com/blob/8cbb2ee946a51c313488c35b6652713c413d7f08/docs/content-architecture.md) creció hasta cinco: portugués de Brasil, inglés, español, francés y chino simplificado.

Cada página nueva nace con el prefijo de su idioma. Las traducciones comparten una identidad estable, y las URLs antiguas que ya existían se mantienen con redirecciones. No creo redirecciones sin prefijo para artículos nuevos.

Francés y chino llegaron después de la migración bilingüe. Siempre quise publicar también en esos idiomas, pero el trabajo necesario hacía fácil posponerlo. Los agentes reducen mucho ese esfuerzo. Aun así, no basta con pedir una traducción y darla por buena. Mi flujo usa los mismos hechos para todos los idiomas, pero cada versión se redacta por separado y pasa por una revisión especializada.

Así quedó el reparto:

| Tarea que antes hacía el CMS | Quién la hace ahora | Lo que todavía debo cuidar |
| --- | --- | --- |
| Escribir y guardar versiones | Markdown, Git y agentes editoriales | Yo aporto los hechos y apruebo el resultado |
| Organizar idiomas y relacionar artículos | [Esquema de contenido](https://github.com/digows/digows.com/blob/8cbb2ee946a51c313488c35b6652713c413d7f08/src/content.config.ts) y [configuración de idiomas](https://github.com/digows/digows.com/blob/8cbb2ee946a51c313488c35b6652713c413d7f08/src/i18n/locales.ts) | Cada idioma necesita su propia redacción y revisión |
| Crear y servir las páginas | Astro y Workers Static Assets | El código y las dependencias necesitan mantenimiento |
| Guardar comentarios y otros datos | D1 y [migraciones guardadas en Git](https://github.com/digows/digows.com/tree/8cbb2ee946a51c313488c35b6652713c413d7f08/migrations) | Debo controlar cuotas, abuso, migraciones y fallos |
| Recibir correo | Email Routing | Recibir y reenviar correo no es lo mismo que enviar boletines |
| Publicar | Validaciones automáticas y una aprobación explícita | Ningún agente puede aprobarse ni publicarse a sí mismo |

La [arquitectura completa está documentada](https://github.com/digows/digows.com/blob/8cbb2ee946a51c313488c35b6652713c413d7f08/docs/ARCHITECTURE.md). No digo que sea más sencilla para todo el mundo. Digo que yo puedo ver cada pieza, entenderla y decidir si sigue haciendo falta.

## Agentes para redactar, revisar y comprobar

Construí un agente editorial que coordina especialistas. Unos seleccionan las evidencias. Otros redactan cada idioma sin copiar la prosa de otro. Después llegan las revisiones y las comprobaciones del paquete.

El punto de partida siempre es mío: el tema, mi experiencia, los hechos que puedo sostener y los límites de lo que quiero afirmar. Un agente puede encontrar una contradicción o una frase confusa. No puede inventar una experiencia que yo no tuve. Tampoco puede convertir su propia respuesta en permiso para publicar.

Estas funciones ya existen en herramientas actuales. [Codex permite crear y coordinar subagentes especializados](https://learn.chatgpt.com/docs/agent-configuration/subagents). [Claude Code también ofrece subagentes](https://code.claude.com/docs/en/sub-agents) con sus propios contextos, herramientas y permisos. Google presenta [Antigravity](https://antigravity.google/docs/overview) como un lugar para lanzar y supervisar agentes, y documenta [subagentes personalizados y asíncronos](https://antigravity.google/docs/subagents).

No son productos iguales. Sus costes, reglas y madurez pueden cambiar. Los menciono porque muestran algo que ya es práctico: dividir un trabajo editorial en tareas pequeñas, dar instrucciones distintas a cada especialista y comprobar el resultado antes de seguir.

Eso es lo que llamo mi CMS personal. No es una pantalla mágica creada por IA. Es un flujo alrededor del repositorio: hechos comunes, agentes con tareas limitadas, validaciones automáticas y una decisión humana al final.

## Páginas estáticas y solo el código dinámico necesario

Astro puede publicar un sitio completamente estático sin usar su adaptador de Cloudflare. Si una ruta necesita ejecutar código, la [integración de Astro con Cloudflare](https://docs.astro.build/en/guides/integrations-guide/cloudflare/) puede servir primero los archivos ya generados y dejar el Worker para el comportamiento dinámico. La [guía de despliegue](https://docs.astro.build/en/guides/deploy/cloudflare/) explica ambos casos.

Esta separación importa porque cambia el coste y el riesgo. Cloudflare dice que las solicitudes directas a [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/) son gratuitas y no tienen límite. Las llamadas al Worker siguen las reglas de cobro de Workers. Una opción como `run_worker_first` puede hacer que una visita que era estática pase antes por el Worker.

Por eso puedo decir que el alojamiento de los archivos estáticos es gratuito. No puedo decir que todo el sistema sea gratuito, sin límites y para siempre.

Para los datos dinámicos uso D1. La [configuración pública](https://github.com/digows/digows.com/blob/8cbb2ee946a51c313488c35b6652713c413d7f08/wrangler.jsonc) muestra cómo la base se conecta con la aplicación, y las migraciones quedan en Git. El plan gratuito de [D1 limita las filas procesadas cada día y el almacenamiento](https://developers.cloudflare.com/d1/platform/pricing/). Si se alcanza un límite diario, las operaciones fallan hasta que el contador se restablece.

D1 no es una base de datos infinita. En un sitio pequeño puede ser suficiente, siempre que mida el uso y decida qué debe pasar cuando una operación falla.

## La Queue que preferí quitar

También probé Cloudflare Queues para el boletín. Después la saqué del diseño. Con el volumen real del sitio, productores, consumidores, reintentos y seguimiento añadían más trabajo del que resolvían.

La capa gratuita de [Queues incluye 10.000 operaciones al día y 24 horas de retención](https://developers.cloudflare.com/queues/platform/pricing/). Leer, escribir, borrar y reintentar cuentan por separado. Es una oferta útil. Pero una herramienta no se vuelve necesaria porque sea buena o gratuita.

Quitar la Queue fue una decisión tan importante como elegir D1. La arquitectura mejora cuando cada servicio resuelve un problema real, no cuando acumula logos.

El correo también requiere nombres claros. [Email Routing](https://developers.cloudflare.com/email-service/configuration/email-routing-addresses/) recibe mensajes y los reenvía a un destino verificado o a un Worker. No es un servicio general para enviar cualquier correo.

Según la [página de precios de Email Service](https://developers.cloudflare.com/email-service/platform/pricing/), el enrutamiento de entrada está disponible en planes gratuitos y de pago. Enviar a destinatarios arbitrarios requiere Workers Paid, mientras que los envíos a destinos verificados siguen siendo gratuitos. Recibir, guardar y enviar correo son tres tareas distintas.

## Gratis no significa sin trabajo

Es posible que un sitio pequeño se mantenga dentro de las capas gratuitas o con un coste bajo. Depende del tráfico, del uso de la base de datos y de las llamadas al Worker. No tengo una cifra mensual verificada que me permita prometer algo más concreto.

Además, hay un coste que no aparece en la factura. Alguien debe actualizar dependencias, proteger secretos, revisar migraciones, vigilar fallos y mantener las validaciones del flujo editorial. En este caso, esa persona soy yo.

Un sitio estático reduce el código que se ejecuta en cada visita. No vuelve seguro todo lo demás por arte de magia. Todavía hay API dinámicas, dependencias, secretos, controles contra abuso y despliegues que pueden fallar.

## WordPress sigue siendo mejor para mucha gente

WordPress tiene un argumento fuerte: ya incluye una interfaz para escribir, usuarios con distintos permisos, gestión de imágenes, actualizaciones y un ecosistema enorme de plugins y soporte.

Mi sistema no hizo desaparecer esa complejidad. La movió a código propio, Git, CI, servicios externos y agentes. También la puso sobre mis hombros.

Este modelo tiene sentido para una persona o un equipo técnico que quiere ese control y acepta mantenerlo. Si una publicación necesita delegar la infraestructura, instalar funciones desde una pantalla o dar acceso editorial sin tocar Git, WordPress puede seguir siendo la opción más sensata.

## El código se puede revisar

El código del sitio está en el [repositorio público de digows.com](https://github.com/digows/digows.com/blob/8cbb2ee946a51c313488c35b6652713c413d7f08/README.md). «Público» no significa «código abierto»: el repositorio no incluye una licencia general para reutilizar, redistribuir o crear trabajos derivados. El agente editorial que describo aquí tampoco está publicado.

La mejor contribución no es un cambio enorme enviado sin contexto. Busca un punto frágil entre el contenido, el Worker y un servicio de Cloudflare. Comprueba qué ocurre cuando ese servicio falla. Después abre una propuesta pequeña siguiendo la [guía de contribución](https://github.com/digows/digows.com/blob/8cbb2ee946a51c313488c35b6652713c413d7f08/CONTRIBUTING.md).

Si encuentras una vulnerabilidad, usa el contacto privado indicado en la [política de seguridad](https://github.com/digows/digows.com/blob/8cbb2ee946a51c313488c35b6652713c413d7f08/SECURITY.md). Un issue público no es el lugar correcto.

La migración no me dejó sin CMS. Me dio un CMS que puedo desmontar y entender. Los agentes hacen viable el trabajo editorial y multilingüe, pero no eliminan mi responsabilidad. Ese es el verdadero cambio.
