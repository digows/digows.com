---
title: "Como migrei do WordPress para um site estático com agentes"
seoTitle: "Como migrei do WordPress para um site estático com agentes"
description: "Como troquei o WordPress por arquivos no Git, um site estático, agentes editoriais e alguns serviços da Cloudflare."
permalink: "2026/07/13/como-migrei-wordpress-site-estatico-agentes"
publishedAt: "2026-07-13T17:00:01.000Z"
reviewedAt: "2026-07-13"
language: "pt-BR"
categories: ["Engenharia de Software", "Arquitetura", "Inteligência Artificial"]
tags: ["WordPress", "sites estáticos", "agentes de IA", "Cloudflare", "Astro"]
draft: false
translationKey: "2026/07/13/how-i-migrated-wordpress-to-a-static-site-with-agents"
translationOf: "2026/07/13/how-i-migrated-wordpress-to-a-static-site-with-agents"
legacy: false
editorial:
  quickSummary: "Troquei o WordPress por um fluxo em que os artigos ficam no Git, agentes ajudam a escrever e revisar, o Astro gera as páginas e a Cloudflare atende apenas o que precisa de código ou banco de dados. Ganhei controle e reduzi o código executado para servir cada artigo, mas passei a cuidar da automação e da infraestrutura."
  keyTakeaways:
    - "Meu problema não era o WordPress em si, mas plugins de terceiros capazes de afetar o site inteiro."
    - "Eu listei os trabalhos que o WordPress fazia e escolhi uma solução simples para cada um."
    - "Os agentes ajudam a pesquisar, escrever e revisar, mas não publicam sem uma aprovação humana."
    - "D1, Queues e Email Routing são úteis, porém cada serviço tem limites e custos diferentes."
    - "Este modelo faz mais sentido para quem já trabalha com código e quer controlar a própria publicação."
  strongestCounterargument: "O WordPress já entrega uma boa interface de escrita, gestão de mídia, usuários, atualizações e milhares de plugins. Meu fluxo não faz essa complexidade desaparecer: ele coloca código, Git, automação, banco de dados e deploy nas mãos do dono do site. Para quem prefere delegar a parte técnica, o WordPress pode continuar sendo a melhor escolha."
  appliesWhen: ["O responsável pelo site sabe trabalhar com Git, código e deploy", "A maior parte do conteúdo pode virar arquivo estático", "As poucas funções dinâmicas podem ficar em APIs pequenas", "Cada idioma passa por revisão humana"]
  doesNotApplyWhen: ["Os autores precisam de um painel visual completo", "O site depende de muitos plugins prontos", "Não há quem mantenha código e infraestrutura", "O trabalho de manter um fluxo próprio custa mais do que o controle obtido"]
  discussionPrompt:
    key: "wordpress-static-agents.v2"
    text: "Quais trabalhos seu CMS faz hoje, e quais deles poderiam ser resolvidos de forma mais simples?"
  glossary:
    - { term: "CMS baseado em repositório", definition: "Fluxo em que textos, metadados e regras de publicação ficam versionados junto com o código." }
    - { term: "Static Assets", definition: "Arquivos prontos que a Cloudflare entrega sem executar o Worker a cada acesso." }
    - { term: "D1", definition: "Banco de dados SQL gerenciado pela Cloudflare para as funções dinâmicas do site." }
    - { term: "Email Routing", definition: "Serviço que recebe e encaminha mensagens enviadas para um endereço do domínio." }
    - { term: "Agente especializado", definition: "Agente configurado para uma tarefa específica, como escrever, revisar ou conferir fontes." }
  relatedTranslationKeys: ["2026/05/20/the-high-individual-contributor-in-the-age-of-ai-agents", "2025/09/02/the-ifless-principle-designing-apis-without-hidden-decisions"]
  copyReviewed: true
---

O WordPress ficou no ar por muito mais tempo do que a minha vontade de sair dele. Isso é mérito do projeto. Ele sobreviveu a mudanças de hospedagem, temas, hábitos de leitura e da própria web.

Por isso, esta não é uma história sobre um CMS ruim. Meu problema era mais específico: plugins de terceiros rodam dentro da mesma aplicação. No meu caso, um plugin mal escrito podia quebrar o site inteiro. A própria [documentação do WordPress](https://wordpress.org/documentation/article/manage-plugins/) diz que plugins variam em qualidade, precisam de atualização e podem causar problemas. Ela recomenda até fazer backup antes de atualizá-los.

Isso não torna o WordPress inseguro por natureza, nem transforma todo plugin em ameaça. Mas eu já não queria que publicar um texto dependesse de todo o código instalado no site. A [documentação oficial de segurança](https://developer.wordpress.org/advanced-administration/security/hardening/) também deixa claro que manter o WordPress seguro é um trabalho contínuo.

Minha saída foi simples de explicar: os artigos viraram arquivos no Git, o Astro passou a gerar as páginas e serviços pequenos ficaram responsáveis pelo que realmente precisa de código ou banco de dados. Também criei um agente editorial com agentes especializados para me ajudar a pesquisar, escrever e revisar. Eu continuo fornecendo os fatos, o recorte e as correções. E continuo aprovando o que será publicado.

Eu não fiz o CMS desaparecer. Montei outra forma de fazer o trabalho dele.

## Primeiro, listei tudo o que o WordPress fazia

Mover os textos era a parte fácil. O WordPress também cuidava de URLs, metadados, idiomas, comentários, banco de dados e publicação.

Em vez de tratar a migração como uma simples cópia de páginas, eu listei esses trabalhos um por um. Depois decidi quem ou o que faria cada um no novo site:

| O que o WordPress fazia | Quem faz agora | Onde conferir |
| --- | --- | --- |
| Guardava textos e metadados | Arquivos Markdown no Git | [Schema dos artigos](https://github.com/digows/digows.com/blob/8cbb2ee946a51c313488c35b6652713c413d7f08/src/content.config.ts) |
| Ligava traduções e URLs | Uma identidade comum e um endereço próprio para cada idioma | [Arquitetura de conteúdo](https://github.com/digows/digows.com/blob/8cbb2ee946a51c313488c35b6652713c413d7f08/docs/content-architecture.md) e [lista de idiomas](https://github.com/digows/digows.com/blob/8cbb2ee946a51c313488c35b6652713c413d7f08/src/i18n/locales.ts) |
| Ajudava a escrever e revisar | Meus insumos, agentes especializados e testes automáticos | Aprovação humana antes de publicar |
| Servia os artigos | Astro e arquivos estáticos | [Deploy do Astro na Cloudflare](https://docs.astro.build/en/guides/deploy/cloudflare/) |
| Guardava comentários e outros dados | Worker e D1 | [Arquitetura do site](https://github.com/digows/digows.com/blob/8cbb2ee946a51c313488c35b6652713c413d7f08/docs/ARCHITECTURE.md) e [migrações do D1](https://github.com/digows/digows.com/tree/8cbb2ee946a51c313488c35b6652713c413d7f08/migrations) |
| Mantinha URLs antigas funcionando | Redirects permanentes apenas para URLs que já existiam | Regras revisadas e testadas no build |
| Configurava os serviços do site | Arquivo de configuração do Worker | [Configuração da Cloudflare](https://github.com/digows/digows.com/blob/8cbb2ee946a51c313488c35b6652713c413d7f08/wrangler.jsonc) |

Essa lista tornou a migração muito mais clara. Para cada trabalho, há uma solução e uma forma de conferir se ela está correta.

O resultado também muda o caminho de leitura. Um artigo não precisa mais consultar uma aplicação e um banco de dados para abrir. A [integração do Astro com a Cloudflare](https://docs.astro.build/en/guides/integrations-guide/cloudflare/) permite entregar o arquivo pronto e chamar o Worker apenas quando alguma ação precisa dele.

## Agentes ajudam no trabalho editorial, não dão a palavra final

Meu agente editorial começa com os meus insumos: o que aconteceu, o que quero contar, quais pontos precisam de cuidado e quais correções devem entrar. A partir daí, agentes especializados conferem as fontes, escrevem em cada idioma e revisam os textos. Scripts verificam se faltou algum campo, idioma ou aprovação.

A publicação continua sendo uma decisão humana. O agente pode fazer o trabalho; ele não recebe autoridade para publicar por conta própria.

Esse tipo de fluxo já é possível em ferramentas diferentes. O [Codex permite criar subagentes especializados](https://learn.chatgpt.com/docs/agent-configuration/subagents). O [Claude Code também oferece subagentes com instruções, ferramentas e permissões próprias](https://code.claude.com/docs/en/sub-agents). O Google descreve o [Antigravity](https://antigravity.google/docs/overview) como um lugar para iniciar e acompanhar agentes e documenta [subagentes assíncronos e personalizados](https://antigravity.google/docs/subagents).

As três ferramentas não são iguais em qualidade, preço ou funcionamento. A ideia em comum é mais simples: posso dar uma função clara a cada agente. Um verifica a pauta, outro escreve, outro revisa. Regras automáticas rejeitam um pacote incompleto.

É assim que agentes tornam um CMS pessoal viável para mim. Não basta pedir “publique algo sobre WordPress”. O resultado melhora quando há bons insumos, fontes definidas, tarefas separadas, testes e aprovação.

## Começou em dois idiomas e chegou a cinco

A primeira versão do site foi pensada em português e inglês. Depois, a estrutura passou a aceitar cinco idiomas: `pt-BR`, `en`, `es`, `fr` e `zh-Hans`. Francês e chinês simplificado vieram depois; eles não faziam parte da primeira migração.

Eu sempre quis escrever também em francês e chinês. Antes, manter esse hábito exigiria tempo demais. Agora preparo os mesmos fatos para todos os idiomas e cada agente escreve uma versão própria. Um texto não serve como molde de frases para o outro.

Isso facilita muito o trabalho, mas não garante qualidade nativa por mágica. Francês e chinês ainda precisam de uma pauta precisa, um agente adequado e revisão humana. O ganho é ter um processo que se repete e leva cada texto até essa revisão.

Cada idioma também tem sua própria URL, mas todos compartilham a mesma identidade interna. Assim, os comentários podem acompanhar o artigo mesmo quando o endereço muda de um idioma para outro. A [arquitetura de conteúdo](https://github.com/digows/digows.com/blob/8cbb2ee946a51c313488c35b6652713c413d7f08/docs/content-architecture.md) explica essa escolha.

## A maior parte do site é arquivo; o resto tem função definida

O desenho ficou assim:

```text
meus insumos
    ↓
fontes → agentes especializados → revisão e testes → Git
                                                    ↓
                                                  Astro
                                                    ↓
leitura dos artigos ───────────────────────→ Static Assets

ações que salvam dados ───────→ Worker ────→ D1
e-mails recebidos ────────────→ Email Routing ───→ endereço verificado ou Worker
```

Na leitura de um artigo, quero que o caminho seja curto. A documentação de [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/) diz que o acesso direto aos arquivos estáticos é gratuito e ilimitado, sem cobrança extra para guardar esses arquivos. Mas há uma diferença importante: se a requisição executar o Worker, ela passa a seguir as regras de cobrança de Workers. Uma configuração como `run_worker_first` também muda esse caminho.

O [D1](https://developers.cloudflare.com/d1/platform/pricing/) guarda apenas os dados das funções dinâmicas. Os artigos continuam em arquivos. O plano gratuito tem limites diários para linhas lidas e escritas, além de limite de armazenamento. Quando um limite diário é atingido, as operações falham até ele ser renovado. Por isso, “tem plano grátis” não significa “não preciso pensar em falhas”.

O [Email Routing](https://developers.cloudflare.com/email-service/configuration/email-routing-addresses/) também é muito útil. Ele recebe uma mensagem enviada para um endereço do meu domínio e a encaminha para um destino verificado ou para um Worker. Mas isso não é o mesmo que enviar uma newsletter ou um e-mail transacional para qualquer pessoa. A [página de preços do Email Service](https://developers.cloudflare.com/email-service/platform/pricing/) explica a diferença: receber por Email Routing está disponível nos planos gratuito e pago; enviar para destinatários arbitrários exige Workers Paid. O envio para endereços verificados tem sua própria condição gratuita.

Essa combinação mostra por que a Cloudflare está tão forte para sites pequenos. Ela reúne arquivos estáticos, código sob demanda, banco de dados e roteamento de e-mail. Posso escolher só as peças necessárias, sem colocar uma aplicação inteira no caminho de cada visita.

## A melhor Queue foi a que eu removi

Eu cheguei a avaliar Cloudflare Queues para processar a newsletter. A ideia fazia sentido no papel, e o plano gratuito é suficiente para experimentar. Mas ter um serviço disponível não significa precisar dele.

Segundo a [documentação de Queues](https://developers.cloudflare.com/queues/platform/pricing/), o Workers Free oferece 10 mil operações por dia e guarda mensagens por 24 horas. Escrita, leitura, exclusão e novas tentativas contam separadamente.

Uma fila também exige código para consumir mensagens, evitar duplicidade, repetir falhas, acompanhar o processamento e recuperar problemas. Para o volume atual, era trabalho demais para pouco benefício. Então retirei a Queue.

Essa decisão é tão importante quanto os serviços que ficaram. Infraestrutura gratuita ainda custa tempo e atenção. Antes de adicionar uma peça, preciso saber qual problema ela resolve e quais problemas novos ela traz.

## Grátis tem limite

Essa infraestrutura pode atender muitos sites pequenos dentro dos planos gratuitos. Não posso prometer custo zero para sempre, nem dizer que tudo continuará grátis sem acompanhar uso e cobrança.

Cada serviço mede uma coisa diferente. Static Assets separa a entrega direta de arquivos da execução do Worker. D1 mede linhas processadas e armazenamento. Queues cobra várias operações para tratar uma mensagem. Email Routing recebe e encaminha mensagens, mas não substitui qualquer tipo de envio.

O benefício real não é “hospedagem infinita de graça”. É começar com serviços baratos ou gratuitos e saber onde cada limite está. Quando o site crescer, fica mais fácil ver qual parte passou a custar mais.

## A complexidade mudou de lugar

O melhor argumento a favor do WordPress continua válido. Ele oferece uma interface madura para escrever, gerenciar mídia e usuários, atualizar o sistema e instalar plugins. Uma pessoa sem experiência técnica pode delegar boa parte da operação sem aprender Git, CI ou migrações de banco.

Meu sistema coloca essas tarefas nas minhas mãos. Eu cuido de código, dependências, automação, agentes, APIs, segredos, migrações, proteção contra abuso e deploy. Servir artigos estáticos reduz o código executado durante a leitura, mas as funções dinâmicas ainda precisam de segurança, testes e monitoramento.

Se a prioridade é editar por um painel e delegar a infraestrutura, criar um CMS pessoal provavelmente é uma ideia ruim. Para quem já trabalha com engenharia e quer controle, a troca pode valer. Codex, Claude Code e Antigravity ajudam a manter um fluxo feito sob medida. Ainda assim, alguém precisa cuidar dele como software de produção.

## O código está público. Traga uma lupa, não confete

O [repositório do digows.com](https://github.com/digows/digows.com/blob/8cbb2ee946a51c313488c35b6652713c413d7f08/README.md) está público para consulta e revisão. Ele não tem uma licença geral que autorize reutilização, redistribuição ou criação de trabalhos derivados. Por isso, não o apresento como open source nem faço um convite genérico para copiar tudo.

O convite é este: escolha uma parte do sistema, leia o código e procure algo concreto que pode melhorar. Achou uma validação ausente, um comportamento confuso ou uma documentação ruim? Leia o [guia de contribuição](https://github.com/digows/digows.com/blob/8cbb2ee946a51c313488c35b6652713c413d7f08/CONTRIBUTING.md), abra uma issue focada e proponha a menor correção possível.

Se encontrar uma vulnerabilidade, não abra uma issue pública. Siga a [política de segurança](https://github.com/digows/digows.com/blob/8cbb2ee946a51c313488c35b6652713c413d7f08/SECURITY.md).

Menos confete, mais lupa. Uma boa contribuição começa com um problema específico.
