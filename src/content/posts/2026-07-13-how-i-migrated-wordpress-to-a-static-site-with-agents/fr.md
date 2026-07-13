---
title: "Comment j’ai migré WordPress vers un site statique avec des agents"
seoTitle: "Comment j’ai migré WordPress vers un site statique avec des agents"
description: "J’explique comment j’ai remplacé WordPress par Astro, Cloudflare et un processus éditorial multilingue assisté par des agents, sans cacher les limites de ce choix."
permalink: "2026/07/13/comment-j-ai-migre-wordpress-vers-un-site-statique-avec-des-agents"
publishedAt: "2026-07-13T17:00:01.000Z"
reviewedAt: "2026-07-13"
language: fr
categories:
  - "Architecture logicielle"
  - "Publication numérique"
tags:
  - "WordPress"
  - "site statique"
  - "agents d’IA"
  - "Astro"
  - "Cloudflare"
  - "multilingue"
draft: false
translationKey: "2026/07/13/how-i-migrated-wordpress-to-a-static-site-with-agents"
translationOf: "2026/07/13/how-i-migrated-wordpress-to-a-static-site-with-agents"
legacy: false
editorial:
  quickSummary: >-
    J’ai remplacé WordPress par des articles versionnés dans Git, un site statique construit avec Astro et quelques services Cloudflare pour les fonctions dynamiques. Des agents m’aident à chercher, écrire et relire, mais je garde la main sur les faits et la publication.
  keyTakeaways:
    - "Mon problème ne venait pas du noyau de WordPress, mais de plugins tiers capables de fragiliser ou de casser tout le site."
    - "Les agents préparent et contrôlent le contenu ; un humain fournit les faits, relit le résultat et décide de publier."
    - "Les articles restent statiques, tandis qu’un Worker et D1 ne gèrent que les fonctions qui ont besoin de code ou de données."
    - "J’ai testé Cloudflare Queues, puis je l’ai retiré : le service était utile, mais trop complexe pour mon volume."
    - "Le code du site est visible publiquement pour être examiné, mais il n’est pas proposé sous une licence open source générale."
  strongestCounterargument: >-
    WordPress fournit déjà un bon éditeur, des rôles, la gestion des médias, les mises à jour et un vaste choix de plugins. Mon système ne fait pas disparaître la complexité : il me demande de gérer Git, le code, la CI, les dépendances, les secrets et les incidents. Il convient surtout à une personne technique qui veut garder ce contrôle.
  appliesWhen:
    - "Le propriétaire du site sait travailler avec Git, du code et des déploiements."
    - "La plupart des pages peuvent être statiques et les fonctions dynamiques restent peu nombreuses."
    - "Le contrôle des URLs, des données et du processus éditorial vaut le travail supplémentaire."
  doesNotApplyWhen:
    - "Les auteurs ont besoin d’un éditeur visuel complet sans aide technique."
    - "Le site dépend de nombreux plugins WordPress déjà bien intégrés au métier."
    - "L’équipe préfère déléguer la sécurité, les déploiements et la maintenance."
  discussionPrompt:
    key: "wordpress-static-agents.v2"
    text: "Parmi les tâches de votre CMS, lesquelles voudriez-vous gérer vous-même et lesquelles préférez-vous lui laisser ?"
  glossary:
    - term: "Génération statique"
      definition: "Création des fichiers HTML avant la visite du lecteur, au lieu de les reconstruire sur le serveur à chaque requête."
    - term: "D1"
      definition: "Base de données SQL gérée par Cloudflare, utilisée ici pour les données qui ne peuvent pas rester dans des fichiers statiques."
    - term: "Email Routing"
      definition: "Service qui reçoit un e-mail et le transfère vers une adresse vérifiée ou un Worker ; ce n’est pas un service général d’envoi."
    - term: "Agent spécialisé"
      definition: "Agent chargé d’une tâche précise, comme écrire en français ou contrôler les affirmations d’un article."
    - term: "Dépôt public sans licence générale"
      definition: "Code visible par tous, sans autorisation générale de le réutiliser, de le redistribuer ou de le modifier."
  relatedTranslationKeys: []
  copyReviewed: true
---

Un petit plugin tiers pouvait casser tout mon site. C’est la raison la plus simple de mon envie de quitter WordPress.

Le problème n’était pas que WordPress serait mauvais ou vulnérable par nature. Le problème était plus concret : les plugins ajoutent du code PHP à la même application, avec une qualité variable. La modification d’un seul plugin peut donc toucher tout le site. La [documentation officielle sur les plugins](https://wordpress.org/documentation/article/manage-plugins/) recommande de les maintenir à jour et de faire une sauvegarde avant une mise à jour, justement parce que des problèmes peuvent arriver.

WordPress a pourtant très bien résisté au temps. Il a gardé mes anciens contenus et m’a permis de publier pendant des années. Sa [documentation sur le durcissement](https://developer.wordpress.org/advanced-administration/security/hardening/) rappelle simplement que la sécurité demande un travail continu.

Je voulais conserver ce qui fonctionnait, sans garder tout le système dans le même bloc. Les agents ont rendu cette migration réaliste pour moi. Ils ne remplacent pas un CMS d’un coup de baguette magique. Ils m’aident à construire et à utiliser mon propre processus de publication.

## J’ai commencé par lister ce que WordPress faisait

Migrer un CMS ne consiste pas seulement à copier des pages. Il faut regarder chaque tâche assurée par le CMS, puis décider qui ou quoi s’en chargera après la migration.

Je devais préserver les articles, les anciennes URLs, le processus de publication, les différentes langues et les quelques fonctions qui ont besoin d’un serveur. Les anciennes adresses continuent donc de fonctionner grâce à des redirections permanentes. Les nouveaux articles, eux, naissent directement avec une URL qui indique leur langue.

| Tâche | Avant | Maintenant | Ce que je dois gérer |
| --- | --- | --- | --- |
| Écrire et stocker les articles | Éditeur et base WordPress | Fichiers Markdown dans Git | Les fichiers, les revues et l’historique |
| Préparer une publication | Rôles et plugins | Brief factuel, agents, contrôles et décision humaine | Les règles du processus |
| Produire les pages | PHP et thème | Astro construit des fichiers statiques | Un build et un déploiement à chaque changement |
| Garder les anciennes URLs | Routage WordPress | URLs localisées et redirections `308` | La vérification des anciennes routes |
| Stocker les données dynamiques | Base et plugins WordPress | Un Worker limité et D1 | Les API, les migrations et la protection contre les abus |
| Exploiter le site | Hébergeur et écosystème WordPress | Git, CI et services gérés | Les pannes, les dépendances et la sécurité |

Cette répartition n’est pas théorique. Elle est visible dans l’[architecture de production](https://github.com/digows/digows.com/blob/8cbb2ee946a51c313488c35b6652713c413d7f08/docs/ARCHITECTURE.md), l’[organisation du contenu et des langues](https://github.com/digows/digows.com/blob/8cbb2ee946a51c313488c35b6652713c413d7f08/docs/content-architecture.md) et le [schéma des articles](https://github.com/digows/digows.com/blob/8cbb2ee946a51c313488c35b6652713c413d7f08/src/content.config.ts). Ces liens pointent vers un commit précis, afin que le code cité ne change pas sous vos yeux.

## Les agents m’aident, mais je garde la décision

J’ai créé un agent éditorial qui coordonne plusieurs agents spécialisés à partir de mes informations. L’un peut vérifier les faits, un autre écrire dans une langue donnée, et un autre relire le résultat.

Leur liberté est volontairement limitée. Un brief commun définit les faits autorisés. Chaque langue est écrite séparément. Des contrôles automatiques vérifient les fichiers, puis un humain relit et décide ou non de publier.

[Codex permet de définir des subagents spécialisés](https://learn.chatgpt.com/docs/agent-configuration/subagents). [Claude Code propose aussi des subagents personnalisés](https://code.claude.com/docs/en/sub-agents). Google décrit dans [Antigravity](https://antigravity.google/docs/overview) une interface pour piloter plusieurs agents, ainsi que des [subagents asynchrones et personnalisés](https://antigravity.google/docs/subagents). Ces outils n’ont pas les mêmes garanties, les mêmes prix ni le même niveau de maturité. Leur point commun est plus modeste : ils permettent de confier des tâches précises à des agents séparés, puis de rassembler et de contrôler leur travail.

Mon processus ressemble à ceci :

```text
Informations humaines
        │
        ▼
  Brief factuel ──► agents spécialisés par tâche et par langue
        │                              │
        └──────────────────────────────▼
                                  relecture
                                      │
                                      ▼
                           décision humaine de publier
                                      │
                                      ▼
                              Git ──► build Astro
                                          │
                              ┌───────────┴───────────┐
                              ▼                       ▼
                       fichiers statiques       Worker + D1
```

Mon CMS personnel n’est donc pas un seul agent. C’est l’ensemble formé par Git, le format des articles, les agents, les contrôles et le déploiement. Les agents rendent cet ensemble plus facile à utiliser. Ils ne prennent pas la responsabilité à ma place.

## Le site est passé de deux langues à cinq

La migration a commencé avec le portugais et l’anglais. Le site gère maintenant cinq langues : portugais du Brésil, anglais, espagnol, français et chinois simplifié. Elles sont définies dans un [contrat de locales commun](https://github.com/digows/digows.com/blob/8cbb2ee946a51c313488c35b6652713c413d7f08/src/i18n/locales.ts).

Je voulais écrire en français et en chinois depuis longtemps. Les agents rendent ce projet beaucoup plus accessible. Je peux partager les mêmes faits avec chaque spécialiste, sans lui donner un texte portugais ou anglais à traduire mot à mot. Chaque version peut ainsi être organisée directement dans sa langue.

Cela accélère beaucoup le travail, mais ne prouve pas que le résultat a toujours une qualité native. Il faut encore de bonnes consignes, une composition séparée et une vraie relecture. La qualité doit rester ouverte à la critique.

## Les articles sont statiques, le reste est petit

Astro construit les articles avant que le lecteur les demande. D’après sa documentation, un site entièrement statique [n’a pas besoin de l’adaptateur Cloudflare](https://docs.astro.build/en/guides/integrations-guide/cloudflare/). Cloudflare peut servir les fichiers déjà produits et laisser un Worker traiter seulement les besoins dynamiques. Le [guide de déploiement d’Astro](https://docs.astro.build/en/guides/deploy/cloudflare/) décrit cette combinaison.

Cloudflare est particulièrement utile ici parce que je peux choisir quelques services sans adopter toute une plateforme :

- Les requêtes qui vont directement aux [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/) sont gratuites et illimitées selon les règles actuelles, sans coût de stockage supplémentaire pour les fichiers. Si une requête passe d’abord par un Worker, elle suit en revanche la facturation de Workers.
- [D1](https://developers.cloudflare.com/d1/platform/pricing/) garde les données dynamiques du site. Son offre gratuite limite le nombre de lignes lues ou écrites chaque jour et l’espace de stockage. Si une limite quotidienne est atteinte, les opérations échouent jusqu’à la remise à zéro. Gratuit ne veut donc pas dire illimité.
- [Email Routing](https://developers.cloudflare.com/email-service/configuration/email-routing-addresses/) transfère un message reçu vers une adresse vérifiée ou vers un Worker. Ce n’est pas la même chose que l’envoi libre d’e-mails. La [tarification d’Email Service](https://developers.cloudflare.com/email-service/platform/pricing/) indique que l’envoi vers des destinataires arbitraires exige Workers Paid, tandis que les envois vers des destinations vérifiées restent gratuits.

Cette architecture exécute moins de code pour servir un article. Elle ne rend pas le site sûr par défaut. Le Worker, les API, les secrets, les dépendances, les migrations D1, les protections contre les abus et le déploiement doivent toujours être surveillés.

## J’ai essayé Queues, puis je l’ai retiré

J’avais envisagé Cloudflare Queues pour traiter une newsletter. Le service avait du sens sur le papier. Pour mon volume réel, il ajoutait toutefois trop de choses à gérer : production et consommation des messages, nouvelles tentatives, rétention, erreurs et surveillance.

L’offre gratuite de [Cloudflare Queues](https://developers.cloudflare.com/queues/platform/pricing/) comprend actuellement 10 000 opérations par jour et 24 heures de rétention. Une lecture, une écriture, une suppression et une nouvelle tentative sont comptées séparément. Ce quota peut convenir à un petit site, mais il ne compense pas le temps nécessaire pour intégrer et exploiter le service. Je l’ai donc retiré de l’architecture finale.

Une plateforme est aussi utile quand elle permet de ne prendre que ce dont on a besoin. Un service gratuit reste un mauvais choix s’il ajoute plus de travail que de valeur.

## L’hébergement gratuit a quand même un coût

Les offres gratuites actuelles peuvent suffire à de nombreux petits sites gérés par une personne technique. Ce n’est ni une garantie ni une promesse. Je n’ai pas regroupé ici le coût mensuel réel de chaque composant, et les limites peuvent changer.

Il faut compter trois choses : la facture du fournisseur, le temps de travail et l’impact d’une panne. Les fichiers statiques, D1, Workers et l’e-mail ont chacun leurs propres règles et leurs propres façons d’échouer. Mon CMS sur mesure demande aussi des tests, des sauvegardes, des mises à jour et une personne qui comprend le système.

Dire « hébergement gratuit » n’est donc utile qu’avec une date, un niveau de trafic et une liste de services. Les prix et limites cités ici ont été vérifiés le 13 juillet 2026. Rien ne permet de promettre que le site restera gratuit pour toujours ou pour tous les usages.

## WordPress reste le meilleur choix pour beaucoup de monde

WordPress fournit déjà un éditeur solide, des rôles, la gestion des médias, des mises à jour, des milliers de plugins et un grand réseau de professionnels. Une équipe dont les auteurs ne travaillent pas dans Git peut y trouver une solution bien plus simple que la mienne.

Je n’ai donc pas supprimé la complexité. Je l’ai déplacée vers le code, la CI, les agents, les API, les dépendances et ma propre disponibilité. Ce choix me convient parce que je veux contrôler le contenu, les URLs et l’architecture. Il conviendra beaucoup moins à quelqu’un qui souhaite déléguer la partie technique.

Mon pari est précis : les agents réduisent le travail nécessaire pour construire un CMS personnel quand son propriétaire possède déjà les compétences techniques. Ils ne transforment pas chaque auteur en ingénieur d’infrastructure et ne rendent pas WordPress inutile.

## Le code est public : venez avec une question précise

Le [dépôt public du site](https://github.com/digows/digows.com/blob/8cbb2ee946a51c313488c35b6652713c413d7f08/README.md) permet de vérifier cette histoire dans le code. Vous pouvez notamment examiner la [configuration Cloudflare](https://github.com/digows/digows.com/blob/8cbb2ee946a51c313488c35b6652713c413d7f08/wrangler.jsonc) et les [migrations D1](https://github.com/digows/digows.com/tree/8cbb2ee946a51c313488c35b6652713c413d7f08/migrations).

Le dépôt est public, mais il n’a pas de licence générale de réutilisation. Être visible ne veut pas dire être open source. Si vous trouvez un problème, ouvrez d’abord une issue ou proposez une modification limitée en suivant le [guide de contribution](https://github.com/digows/digows.com/blob/8cbb2ee946a51c313488c35b6652713c413d7f08/CONTRIBUTING.md). Pour une vulnérabilité, utilisez la [politique de sécurité](https://github.com/digows/digows.com/blob/8cbb2ee946a51c313488c35b6652713c413d7f08/SECURITY.md) plutôt qu’une issue publique.

Mon invitation est simple : choisissez une partie du système, essayez de la casser sur le papier, puis montrez-moi exactement où elle cède. Une bonne critique vaut ici plus qu’un grand discours sur l’avenir des CMS.
