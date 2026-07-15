---
title: "Passei horas especificando uma feature com agentes — e terminei mudando o requisito"
seoTitle: "Como especificar features com agentes antes de escrever código"
description: "Como entrevistas com agentes ampliaram a análise de uma feature, mudaram decisões de stack e arquitetura e expuseram riscos antes da implementação."
permalink: "2026/07/15/passei-horas-especificando-feature-agentes-mudei-requisito"
publishedAt: "2026-07-15T16:00:00.000Z"
reviewedAt: "2026-07-14"
language: "pt-BR"
categories: ["Engenharia de Software", "Arquitetura", "Inteligência Artificial"]
tags: ["agentes de IA", "especificação", "requisitos", "arquitetura de software", "Codex"]
draft: false
translationKey: "2026/07/15/i-spent-hours-specifying-a-feature-with-agents-and-changed-the-requirement"
translationOf: "2026/07/15/i-spent-hours-specifying-a-feature-with-agents-and-changed-the-requirement"
legacy: false
featuredImage: "/media/posts/agent-specification-interview/shared/agent-kavor-thumbnail.webp"
editorial:
  quickSummary: "Usei agentes para entrevistar, contestar e fechar os requisitos de uma feature antes de escrever código. A conversa mudou a escolha de stack, simplificou a arquitetura, corrigiu uma regra de ciclo de vida e separou o que já podia ser implementado do que ainda precisava de prova."
  keyTakeaways:
    - "Peça ao agente para entrevistar você por área, em vez de começar pedindo código ou uma solução pronta."
    - "Perguntas úteis mudam decisões; uma especificação longa, sozinha, não prova que o sistema está pronto."
    - "Plan mode organiza bem a conversa, mas respostas em bullets podem ser mais rápidas para fechar muitas decisões."
    - "Modelos com mais capacidade de raciocínio ampliam a análise, mas continuam sujeitos a contexto ruim e confiança falsa."
    - "O engenheiro continua responsável por contestar recomendações, exigir evidências e decidir quando implementar."
  strongestCounterargument: "Uma entrevista longa pode virar teatro de análise: muitas perguntas, documentos e tokens sem reduzir o risco real. O processo só compensa quando prioriza dúvidas que mudam o design, elimina o que já foi decidido e transforma incertezas externas em contratos, testes ou spikes verificáveis."
  appliesWhen: ["A feature tem integrações, riscos ou requisitos não funcionais relevantes", "Existem decisões de stack, arquitetura ou operação ainda abertas", "O agente consegue ler o contexto e os artefatos reais do projeto", "Há um responsável humano para contestar e fechar as decisões"]
  doesNotApplyWhen: ["A mudança é pequena, reversível e mais barata de testar diretamente", "O agente não tem contexto suficiente sobre o produto ou o repositório", "A equipe trata respostas convincentes como evidência", "O custo da entrevista supera o risco da decisão"]
  discussionPrompt:
    key: "agent-spec-interview.v1"
    text: "Qual requisito da sua próxima feature provavelmente mudaria se um agente entrevistasse você sobre falhas, integrações e operação?"
  glossary:
    - { term: "Entrevista de requisitos", definition: "Rodadas de perguntas que tornam explícitos objetivos, restrições, riscos, decisões e dúvidas de uma feature." }
    - { term: "Requisito não funcional", definition: "Restrição de qualidade ou operação, como desempenho, segurança, disponibilidade, observabilidade e recuperação." }
    - { term: "Evidence gate", definition: "Ponto que só pode ser fechado com contrato, teste, protótipo ou evidência do ambiente real." }
    - { term: "Analysis theater", definition: "Produção de perguntas e documentos que parece rigorosa, mas não muda decisões nem reduz incerteza." }
    - { term: "Thinking level", definition: "Nível configurado de esforço de raciocínio do modelo, normalmente associado a mais tempo e consumo de tokens." }
  relatedTranslationKeys: ["2026/05/20/the-high-individual-contributor-in-the-age-of-ai-agents", "2025/09/02/the-ifless-principle-designing-apis-without-hidden-decisions"]
  copyReviewed: true
---

Passei horas especificando uma feature sem escrever uma linha de código. No final, descobri que o requisito inicial estava errado.

Ótimo resultado :)

A feature parecia simples: um componente local, multiplataforma, responsável por coordenar aplicações externas e esconder complexidade do usuário. Eu já tinha uma ideia de fluxo e queria definir a infraestrutura e a stack para começar a implementação.

Em vez de pedir código, escrevi algo próximo disto:

> Me entreviste para detalhar esta feature antes de escrever código. Cubra requisitos funcionais e não funcionais, arquitetura, integrações, stack, segurança, operação, falhas, testes e rollout. Não pergunte o que já estiver claro. Separe decisões, recomendações, dúvidas reais e pontos que exigem prova.

Esse é o meu “prompt mágico” atual. Não porque ele produza respostas mágicas, mas porque muda o papel do agent. Em vez de adivinhar uma solução e correr para implementá-la, ele começa tentando encontrar o problema que ainda não descrevi direito.

Foi exatamente o que aconteceu.

## A feature simples começou a ficar parecida com um sistema real

A primeira rodada abriu perguntas sobre fluxo do usuário, integrações externas, autenticação, grandes volumes, concorrência, suporte a sistemas operacionais, instalação, atualização, recuperação de falhas, observabilidade e ciclo de vida.

Nenhum desses temas é exótico. O curioso é como eles somem quando a descrição começa com “o objetivo é simples”. Simples para quem? Em qual caminho? Com qual volume? O que acontece quando a aplicação externa demora, fecha ou volta depois?

Durante as entrevistas, quatro decisões importantes mudaram antes de virarem código. E o limite do que estava pronto para implementar ficou mais claro:

| Suposição inicial | Pressão da entrevista | Decisão depois da análise |
| --- | --- | --- |
| “O componente é simples” | Integrações, escala, ciclo de vida, atualização e recuperação | Tratar como um sistema de produção com fronteiras explícitas |
| A primeira stack recomendada parecia suficiente | A concorrência pesada virou a restrição dominante | Reavaliar e mudar a recomendação de stack |
| Mais módulos pareciam deixar a solução mais segura | A divisão começou a antecipar abstrações que ainda não existiam | Manter uma fundação menor |
| Encerrar depois de um período ocioso parecia razoável | Trabalho externo podia chegar mais tarde | Ligar o ciclo de vida a processos e trabalho realmente ativos |
| Uma spec longa parecia significar “pronto” | Três riscos ainda dependiam de contratos, testes ou ambiente real | Implementar a base e fazer spikes para o restante |

O agent não fez isso sozinho. Eu contestei a primeira recomendação de stack. Também parei uma arquitetura que começava a criar módulos demais e questionei uma regra de encerramento que poderia interromper trabalho tardio.

Essa é a parte que mais me interessa: o agent amplia o campo de análise, mas a engenharia continua decidindo. A boa especificação nasceu do atrito entre as perguntas dele e as minhas objeções.

## “Me entreviste” é só o começo

Se eu entregar duas frases vagas, o agent pode produzir cinquenta perguntas igualmente vagas. O contexto vem antes da entrevista: objetivo, repositório, restrições conhecidas, integrações existentes e o que definitivamente não faz parte da feature.

Depois, peço que ele percorra áreas diferentes:

- resultado esperado, atores, fluxos e critérios de aceitação;
- comportamento funcional, estados e transições;
- desempenho, volume, latência, disponibilidade e recuperação;
- segurança, privacidade, segredos e limites de autorização;
- arquitetura existente e restrições que não podem ser ignoradas;
- integrações, contratos, versões e comportamento quando algo externo falha;
- alternativas de stack e qual restrição deve comandar a escolha;
- instalação, migração, atualização, rollback e suporte;
- observabilidade, testes e dúvidas que exigem um spike.

Eu respondo rápido. `Sim`, `não`, uma frase curta ou `recomende` quando quero que o agent apresente uma escolha fundamentada. Depois peço que atualize a spec, liste contradições e volte apenas com as indecisões que realmente alteram design ou implementação.

No fim da rodada, uma pergunta ajuda muito:

> O que está implementável agora, e o que ainda depende de evidência?

Essa pergunta evita uma confusão comum: documento completo e conhecimento completo não são a mesma coisa. Uma API externa, um comportamento de sistema operacional ou um limite de desempenho não se torna fato porque o modelo escreveu uma seção bonita. Alguns pontos precisam de documentação oficial. Outros, de contrato. Outros, de um teste no ambiente real.

## Plan mode ajuda; eu ainda prefiro perguntas e respostas em bullets

O Plan mode melhora a UX dessa conversa. Ele inspeciona contexto, organiza perguntas e cria pausas claras antes da implementação. Essa ideia aparece no [Codex](https://learn.chatgpt.com/guides/best-practices), no [Plan mode do Claude Code](https://code.claude.com/docs/en/permission-modes) e nos [implementation plans revisáveis do Google Antigravity](https://antigravity.google/docs/implementation-plan). As interfaces mudam; o ponto útil é poder analisar e corrigir o plano antes do código.

Mesmo assim, para especificações longas, tenho preferido um formato bem menos sofisticado: perguntas numeradas e respostas em bullets.

Consigo ler vinte perguntas de uma vez, responder em blocos, anotar exceções e deixar `recomende` onde ainda não tenho uma opinião fechada. O resultado também fica fácil de preservar como artefato e comparar com a spec atualizada.

Os dois formatos resolvem o mesmo problema. Plan mode organiza melhor a interação; bullets me dão mais velocidade quando há muitas decisões conectadas.

## Pedi 100 perguntas. O agent entregou as 100, rsrs

Em outra especificação, a do Agent Kavor, pedi que o agent lesse as specs e ADRs existentes e retornasse **todas as 100 perguntas abertas** sobre análise, design e requisitos. A instrução principal era não perguntar o óbvio nem repetir o que já estava decidido.

Ele entregou as 100. Numeradas.

Eu respondi em blocos e usei o resultado para fechar decisões que estavam espalhadas entre documentos diferentes. Portanto, sim: se você pedir 100 dúvidas, ele provavelmente vai encontrar 100 dúvidas, rsrs.

Mas 100 não é um número ideal. Pode ser só uma ótima forma de gastar tokens e fabricar ansiedade. O valor veio de quatro limites:

- ler os artefatos existentes antes de perguntar;
- eliminar perguntas óbvias e decisões já fechadas;
- focar em lacunas que mudavam o design ou a implementação;
- devolver cada resposta para specs duráveis, em vez de abandoná-la no chat.

Doze perguntas consequentes vencem cem perguntas genéricas. As cem fizeram sentido naquele caso porque havia muitos documentos, relações e decisões incompletas.

## O loop útil não termina na resposta

A entrevista só gera valor quando a decisão volta para o projeto. Meu loop tem ficado assim:

```text
pergunta → resposta → contradição → decisão alterada → spec atualizada
```

Depois repito a análise sobre a nova versão. A pergunta deixa de ser “há mais alguma coisa?” e passa a ser “qual incerteza restante ainda pode mudar a arquitetura, quebrar a integração ou impedir a operação?”.

Não considero isso prova de que existe um processo universal. Mas a convergência está documentada: o [GitHub Spec Kit](https://github.github.com/spec-kit/index.html) organiza especificação, plano, tarefas e implementação; o [Kiro Specs](https://kiro.dev/docs/specs/) mantém requisitos, design e tarefas como artefatos revisáveis; o [Claude Code](https://code.claude.com/docs/en/permission-modes) tem um modo de planejamento que pesquisa e propõe sem editar; e o [Google Antigravity](https://antigravity.google/docs/artifacts) produz planos e outros artifacts para revisão. Quando gerar código fica barato, preservar intenção, decisões e critérios de aceitação fica ainda mais valioso.

A pesquisa em engenharia de requisitos segue uma direção parecida. Um trabalho sobre [IA generativa em requirements engineering](https://arxiv.org/abs/2310.13976) discute uso em elicitação, análise, especificação e validação. Uma [pesquisa com 55 profissionais](https://arxiv.org/abs/2511.01324) encontrou colaboração entre humanos e IA com muito mais frequência do que automação integral. É uma amostra pequena, não um retrato definitivo da indústria, mas a direção combina com o que tenho observado: o ganho vem da parceria crítica, não da terceirização da decisão.

## O risco é criar um belo teatro de análise

Há um contraponto forte. Uma entrevista longa pode produzir centenas de perguntas, vários documentos e uma sensação enorme de rigor sem reduzir um único risco real.

Agents inventam edge cases, repetem a mesma dúvida com palavras diferentes e sugerem a arquitetura da moda. Se o contexto estiver errado, um modelo mais capaz apenas argumenta melhor a favor da premissa errada.

Por isso, eu corto o processo quando:

- a dúvida já foi respondida por código, contrato ou documentação;
- a decisão é pequena, reversível e mais barata de testar;
- o agent está ampliando escopo sem mudar o resultado;
- uma integração precisa de evidência, não de mais prosa;
- uma abstração existe apenas para acomodar futuros imaginários.

Especificação não é competição de quantidade. O objetivo é reduzir decisões acidentais durante a implementação e deixar visível aquilo que ainda não sabemos.

## Meu “10x” acontece antes do código

Quando uso o melhor modelo que tenho disponível com o thinking level mais alto, sinto que multiplico por dez minha capacidade de abstrair e analisar. É uma percepção pessoal, não um benchmark.

O ganho vem da quantidade de hipóteses que consigo explorar, contestar e comparar sem precisar segurar tudo na memória. Uma rodada encontra falhas. Outra cruza a decisão com a arquitetura existente. Outra tenta desmontar a própria recomendação. Isso reduz erros evitáveis no meu desenvolvimento porque várias escolhas ruins morrem ainda na spec.

Esse modo custa mais tempo e tokens. O [Codex](https://developers.openai.com/api/docs/models/gpt-5.2-codex) oferece níveis de esforço até `xhigh`; o [Claude Code](https://code.claude.com/docs/en/model-config) permite ajustar o effort em modelos compatíveis; e o [Google Antigravity](https://antigravity.google/docs/models) expõe variantes de modelos com diferentes níveis de raciocínio. Isso não promete “10x” nem acerto automático. A revisão humana continua fazendo parte do trabalho.

É aí que a engenharia de software continua soberana. O modelo ajuda a enumerar cenários; eu respondo pelo contexto. Ele compara alternativas; eu respondo pelo trade-off. Ele aponta que algo pode falhar; contrato, teste e produção dizem se aquela hipótese é real.

Quanto mais convincente o agent fica, mais importante é saber contestá-lo.

## É uma das ideias por trás do Agent Kavor

Quero levar esse fluxo para além de uma conversa linear. Essa é uma das ideias por trás do [agentkavor.com](https://agentkavor.com), que vem aí: trabalhar a spec visualmente, ligar artefatos e agents num grafo e deixar o Agent Kavor coordenar implementação, saídas e rastreabilidade.

![Tela do Agent Kavor em um MacBook, com uma spec ligada a agentes, uma nota e um terminal.](/media/posts/agent-specification-interview/shared/agent-kavor-macbook.webp)

*Um gostinho do Agent Kavor: specs, agents e outputs ligados no mesmo canvas.*

A parte que quero preservar é simples: o usuário mantém o foco nas decisões da spec; os agents executam o loop ao redor dela. Porque terminar uma longa especificação mudando o requisito não é retrabalho. Retrabalho seria descobrir o mesmo erro depois de implementar tudo.
