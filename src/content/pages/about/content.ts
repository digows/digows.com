export interface AboutArtifact
{
  readonly year: string;
  readonly title: string;
  readonly body: string;
  readonly href?: string;
}

export interface AboutContent
{
  readonly language: Locale;
  readonly seoTitle: string;
  readonly seoDescription: string;
  readonly languageLabel: string;
  readonly hero: {
    readonly kicker: string;
    readonly titleLead: string;
    readonly titleAccent: string;
    readonly titleTail: string;
    readonly introduction: string;
    readonly scroll: string;
  };
  readonly origins: {
    readonly eyebrow: string;
    readonly title: string;
    readonly body: string;
    readonly archiveLink: string;
    readonly archiveImageAlt?: string;
    readonly artifacts: readonly AboutArtifact[];
  };
  readonly distance: {
    readonly eyebrow: string;
    readonly title: string;
    readonly body: string;
    readonly continuation: readonly string[];
    readonly places: readonly { readonly place: string; readonly note: string }[];
    readonly references: readonly { readonly label: string; readonly href: string }[];
    readonly quote: string;
  };
  readonly eits: {
    readonly eyebrow: string;
    readonly collageLabel?: string;
    readonly quote: string;
    readonly indicators: readonly { readonly value: string; readonly label: string }[];
  };
  readonly hinge: {
    readonly eyebrow: string;
    readonly title: string;
    readonly body: string;
    readonly continuation: string;
    readonly oldTools: readonly string[];
    readonly newTools: readonly string[];
  };
  readonly agents: {
    readonly eyebrow: string;
    readonly title: string;
    readonly body: string;
    readonly continuation: string;
    readonly cards: readonly {
      readonly name: string;
      readonly body: string;
      readonly href: string;
      readonly cta?: string;
    }[];
  };
  readonly human: {
    readonly eyebrow: string;
    readonly title: string;
    readonly body: string;
    readonly music: string;
  };
  readonly closing: {
    readonly eyebrow: string;
    readonly title: string;
    readonly body: string;
    readonly contact: string;
    readonly writing: string;
  };
  readonly discussionPrompt: { readonly key: string; readonly text: string };
}

export const aboutContent: Readonly<Record<Locale, AboutContent>> = {
  "pt-BR": {
    language: "pt-BR",
    seoTitle: "Sobre Rodrigo P. Fraga — engenharia, produtos e agentes de IA",
    seoDescription: "A trajetória de Rodrigo P. Fraga: do primeiro blog em 2007 a produtos, sistemas de saúde e agentes de IA.",
    languageLabel: "Idioma",
    hero: {
      kicker: "Rodrigo Pereira Fraga · desde 2004",
      titleLead: "Engenharia de software",
      titleAccent: "para problemas reais.",
      titleTail: "",
      introduction: "Trabalho com software desde 2004. Nesse tempo, construí produtos, plataformas e sistemas que precisam funcionar de verdade — em produção, com limitações técnicas, operacionais e humanas.",
      scroll: "Atravesse a história",
    },
    origins: {
      eyebrow: "01 · Conhecimento em movimento",
      title: "Escrevo sobre o que aprendo desde 2007.",
      body: "Ainda na faculdade, comecei a resumir o que aprendia sobre Java, Adobe Flex e arquitetura em tutoriais no Blogspot. Escrever me ajudava a organizar as ideias; publicar ajudava outras pessoas. Vieram leitores, conversas em fóruns, palestras e convites para dar aula. Compartilhar o trabalho acabou virando parte do próprio trabalho.",
      archiveLink: "Ver o blog original de 2007",
      archiveImageAlt: "Captura do Blogspot de Rodrigo em dezembro de 2007",
      artifacts: [
        { year: "2007", title: "Blog no Blogspot", body: "Eu publicava tutoriais enquanto ainda estava entendendo os assuntos.", href: "https://e-digows.blogspot.com/" },
        { year: "Comunidade", title: "Fóruns e eventos", body: "Os textos trouxeram leitores, conversas, palestras e bons contatos.", href: "/pt-br/2008/01/16/forum-sobre-adobeflex/" },
        { year: "5 anos", title: "Sala de aula", body: "Dei aula em faculdades por cinco anos. Explicar bem virou parte da engenharia." },
        { year: "Publicações", title: "Pesquisa e revistas", body: "Também escrevi artigos científicos e para revistas técnicas.", href: "/pt-br/2010/09/06/artigo-integrando-flex-com-java-utilizando-o-blazeds-na-java-magazine-72/" },
        { year: "Produtos", title: "Do texto à operação", body: "EITS, Gamifier, ViaFronteira e muitos sistemas levaram as ideias para produção.", href: "https://www.eits.com.br/blog/" },
        { year: "Hoje", title: "De volta aos testes", body: "LLMs e agentes me fizeram voltar a experimentar e documentar como no começo.", href: "/pt-br/arquivo/" },
      ],
    },
    distance: {
      eyebrow: "02 · Quando a distância desapareceu",
      title: "Antes do diploma, o trabalho já atravessava fronteiras.",
      body: "Os artigos começaram como resumos do que eu aprendia na faculdade. A audiência cresceu, vieram palestras em eventos de tecnologia e, pouco depois, um contrato com uma empresa de Portugal. Eu ainda não tinha concluído a primeira graduação quando passei a trabalhar de Foz do Iguaçu, recebendo em euros, para pessoas que nunca haviam dividido uma sala comigo.",
      continuation: [
        "Na sequência vieram projetos para empresas nos Estados Unidos e depois para organizações em São Paulo. A distância deixou de ser obstáculo antes mesmo de o mercado chamar isso de trabalho remoto. O que sustentava a relação não era presença física: era aprender rápido, comunicar com clareza e entregar.",
        "Foi daí que nasceu a EITS, uma software house que operou por 19 anos. Passei a reunir projetos, formar equipes e assumir a arquitetura de produtos muito diferentes entre si.",
        "A Gamifier veio em paralelo. Peguei práticas de gamificação que usávamos com equipes de desenvolvimento e transformei isso em um SaaS para vendas e suporte.",
        "Depois veio a ViaFronteira, um marketplace entre Brasil, Paraguai e Argentina. Chegou a 30 mil usuários ativos em menos de um ano, mas não se sustentou comercialmente. Nos últimos anos, passei a trabalhar mais com saúde, DICOM e operação hospitalar. Agora estou de volta aos experimentos pequenos, desta vez com LLMs, agentes e coding agents.",
      ],
      places: [
        { place: "Brazil", note: "origem" },
        { place: "Portugal", note: "primeiros projetos remotos" },
        { place: "Estados Unidos", note: "produto e mercado" },
        { place: "Mundo", note: "produtos, saúde e agentes" },
      ],
      references: [
        { label: "Blogspot", href: "https://e-digows.blogspot.com/" },
        { label: "EITS", href: "https://www.eits.com.br/blog/" },
        { label: "Gamifier", href: "https://gamifier.co/blog/" },
        { label: "ViaFronteira", href: "https://www.instagram.com/viafronteira/" },
        { label: "Healthcare", href: "https://epeople.com.br/" },
        { label: "IA e agentes", href: "/pt-br/topicos/ia-agentes/" },
      ],
      quote: "Trabalho remoto antes de virar rotina.",
    },
    eits: {
      eyebrow: "03 · Experiência acumulada",
      collageLabel: "Registros da trajetória profissional",
      quote: "Depois de dezenas de produtos, os padrões começam a se repetir.",
      indicators: [
        { value: "90+", label: "produtos modelados e acompanhados como arquiteto" },
        { value: "2", label: "exits — negócios vendidos ou incorporados" },
        { value: "20+", label: "anos projetando e construindo software" },
        { value: "~12", label: "tentativas de SaaS que não viraram negócio :)" },
        { value: "dezenas", label: "artigos científicos e publicações técnicas" },
      ],
    },
    hinge: {
      eyebrow: "04 · Tecnologia como repertório",
      title: "A stack depende do problema.",
      body: "Já trabalhei com muitas linguagens, frameworks e tipos de sistema. Não tenho interesse em defender uma stack para tudo. A escolha depende do problema, da equipe, das restrições e de quem vai manter o software depois.",
      continuation: "Continuo gostando de abrir uma tecnologia nova, montar algo pequeno e entender onde ela funciona — e onde não funciona. Algumas entram no repertório; outras ficam só no experimento.",
      oldTools: ["Java", "Spring", "Hibernate", "BlazeDS", "Adobe Flex", "PHP", "Zend Framework", "JavaScript", "TypeScript", "SQL", "PostgreSQL", "Aurora", "Elasticsearch", "Rust", "Flutter", "REST", "Web", "Desktop", "Mobile", "SaaS", "PACS", "RIS", "DICOM", "DICOMweb", "Kubernetes", "AWS", "GitOps", "Cloud-native", "Observabilidade", "Geoprocessamento", "Streaming de áudio e vídeo"],
      newTools: ["LLMs", "AI agents", "Coding agents", "Agent harnesses", "MCP", "Tool use", "Context engineering", "Orquestração", "OpenClaw", "Hermes", "Kavor", "Kortex"],
    },
    agents: {
      eyebrow: "05 · Uma nova engenharia de software",
      title: "Software agora também é construído por software.",
      body: "Hoje, coding agents já leem repositórios inteiros, usam ferramentas, executam testes e trabalham em tarefas relativamente longas. OpenClaw, Hermes e outros assistentes mostram outra parte dessa mudança: software que mantém contexto e acompanha o trabalho por mais tempo.",
      continuation: "Quero usar este blog para registrar o que tenho aprendido construindo agentes para saúde, operação, atendimento e desenvolvimento: o que funciona, onde quebram e quais práticas de engenharia continuam fazendo diferença.",
      cards: [
        { name: "Kavor", body: "Um sistema visual para trabalhar com coding agents sem reduzir engenharia a uma conversa: conecte agentes, especificações, arquivos, terminais, decisões e evidências em um grafo durável.", href: "https://agentkavor.com/pt-br", cta: "Veja o Kavor em prática" },
        { name: "Kortex", body: "Agente conversacional sobre dados clínicos e operação hospitalar.", href: "https://agentkortex.com/" },
        { name: "Agent Asaph", body: "Agente no WhatsApp para equipes de música.", href: "https://agentasaph.com/" },
        { name: "ViaFronteira", body: "Concierge de compras cross-border pelo WhatsApp.", href: "https://www.instagram.com/viafronteira/" },
      ],
    },
    human: {
      eyebrow: "06 · Música",
      title: "Longe das telas, meu hobby é música.",
      body: "Tenho um estúdio, algumas guitarras e pedais demais. Gosto de testar combinações, mexer em timbres e tocar sem transformar tudo em projeto ou produto.",
      music: "Às vezes sai música. Às vezes só barulho. Os dois valem.",
    },
    closing: {
      eyebrow: "Este site",
      title: "Continuo escrevendo.",
      body: "Este site é um laboratório e um arquivo: ideias em construção, decisões examinadas e consequências que merecem ser registradas.",
      contact: "Vamos conversar",
      writing: "Leia os artigos",
    },
    discussionPrompt: { key: "about-curiosity.v1", text: "O que começou como curiosidade e acabou mudando sua trajetória?" },
  },
  en: {
    language: "en",
    seoTitle: "About Rodrigo P. Fraga — engineering, products, and AI agents",
    seoDescription: "Rodrigo P. Fraga's path: from a first blog in 2007 to products, healthcare systems, and AI agents.",
    languageLabel: "Language",
    hero: {
      kicker: "Rodrigo Pereira Fraga · since 2004",
      titleLead: "Software engineering",
      titleAccent: "for real-world problems.",
      titleTail: "",
      introduction: "I have worked with software since 2004. In that time, I have built products, platforms, and systems that need to work for real — in production, with technical, operational, and human limitations.",
      scroll: "Move through the story",
    },
    origins: {
      eyebrow: "01 · Knowledge in motion",
      title: "I have written about what I learn since 2007.",
      body: "While still in college, I began summarizing what I learned about Java, Adobe Flex, and architecture in Blogspot tutorials. Writing helped me organize ideas; publishing helped other people. Readers, forum conversations, talks, and invitations to teach followed. Sharing the work became part of the work itself.",
      archiveLink: "View the original 2007 blog",
      archiveImageAlt: "Screenshot of Rodrigo's Blogspot site in December 2007",
      artifacts: [
        { year: "2007", title: "Blogspot", body: "I published tutorials while I was still figuring the subjects out.", href: "https://e-digows.blogspot.com/" },
        { year: "Community", title: "Forums and events", body: "The posts brought readers, conversations, talks, and useful contacts.", href: "/en/2008/01/16/an-adobe-flex-forum/" },
        { year: "5 years", title: "The classroom", body: "I taught at colleges for five years. Explaining things clearly became part of engineering." },
        { year: "Publishing", title: "Research and magazines", body: "I also wrote scientific papers and articles for technical magazines.", href: "/en/2010/09/06/integrating-flex-with-java-using-blazeds-in-java-magazine-72/" },
        { year: "Products", title: "From text to operations", body: "EITS, Gamifier, ViaFronteira, and many systems took the ideas into production.", href: "https://www.eits.com.br/blog/" },
        { year: "Today", title: "Back to experiments", body: "LLMs and agents made me experiment and document things much like I did at the beginning.", href: "/en/archive/" },
      ],
    },
    distance: {
      eyebrow: "02 · When distance disappeared",
      title: "Before graduation, the work was already crossing borders.",
      body: "The articles began as summaries of what I was learning in college. The audience grew, invitations to speak at technology events followed, and soon I had a contract with a company in Portugal. I had not completed my first degree when I began working from Foz do Iguaçu, earning in euros, for people who had never shared a room with me.",
      continuation: [
        "Projects for companies in the United States followed, then work for organizations in São Paulo. Distance stopped being an obstacle before the market had a common name for remote work. The relationship was sustained by learning fast, communicating clearly, and delivering.",
        "That is where EITS came from, a software house that operated for 19 years. I began bringing projects together, building teams, and taking responsibility for the architecture of very different products.",
        "Gamifier came in parallel. I took gamification practices we used with development teams and turned them into a SaaS product for sales and support.",
        "ViaFronteira followed, a marketplace across Brazil, Paraguay, and Argentina. It reached 30,000 active users in under a year but was not commercially sustainable. In recent years, I have worked more with healthcare, DICOM, and hospital operations. Now I am back to small experiments, this time with LLMs, agents, and coding agents.",
      ],
      places: [
        { place: "Brazil", note: "origin" },
        { place: "Portugal", note: "early remote projects" },
        { place: "United States", note: "product and market" },
        { place: "The world", note: "products, healthcare, and agents" },
      ],
      references: [
        { label: "Blogspot", href: "https://e-digows.blogspot.com/" },
        { label: "EITS", href: "https://www.eits.com.br/blog/" },
        { label: "Gamifier", href: "https://gamifier.co/blog/" },
        { label: "ViaFronteira", href: "https://www.instagram.com/viafronteira/" },
        { label: "Healthcare", href: "https://epeople.com.br/" },
        { label: "AI and agents", href: "/en/topics/ai-agents/" },
      ],
      quote: "Remote work before it became routine.",
    },
    eits: {
      eyebrow: "03 · Accumulated experience",
      collageLabel: "Records from the professional journey",
      quote: "After dozens of products, patterns start to repeat.",
      indicators: [
        { value: "90+", label: "products modeled and followed as an architect" },
        { value: "2", label: "exits — businesses sold or incorporated" },
        { value: "20+", label: "years designing and building software" },
        { value: "~12", label: "SaaS attempts that did not become businesses :)" },
        { value: "dozens", label: "scientific articles and technical publications" },
      ],
    },
    hinge: {
      eyebrow: "04 · Technology as repertoire",
      title: "The stack depends on the problem.",
      body: "I have worked with many languages, frameworks, and kinds of systems. I have no interest in defending one stack for everything. The choice depends on the problem, the team, the constraints, and who will maintain the software later.",
      continuation: "I still enjoy opening a new technology, building something small, and finding where it works — and where it does not. Some tools join the repertoire; others remain experiments.",
      oldTools: ["Java", "Spring", "Hibernate", "BlazeDS", "Adobe Flex", "PHP", "Zend Framework", "JavaScript", "TypeScript", "SQL", "PostgreSQL", "Aurora", "Elasticsearch", "Rust", "Flutter", "REST", "Web", "Desktop", "Mobile", "SaaS", "PACS", "RIS", "DICOM", "DICOMweb", "Kubernetes", "AWS", "GitOps", "Cloud-native", "Observability", "Geoprocessing", "Audio and video streaming"],
      newTools: ["LLMs", "AI agents", "Coding agents", "Agent harnesses", "MCP", "Tool use", "Context engineering", "Orchestration", "OpenClaw", "Hermes", "Kavor", "Kortex"],
    },
    agents: {
      eyebrow: "05 · A new software engineering",
      title: "Software is now also built by software.",
      body: "Today, coding agents already read entire repositories, use tools, run tests, and work on fairly long tasks. OpenClaw, Hermes, and other assistants show another side of the change: software that keeps context and stays involved in the work for longer.",
      continuation: "I want to use this blog to record what I learn while building agents for healthcare, operations, service, and development: what works, where they break, and which engineering practices still make a difference.",
      cards: [
        { name: "Kavor", body: "A visual system for working with coding agents without reducing engineering to a chat: connect agents, specifications, files, terminals, decisions, and evidence in a durable graph.", href: "https://agentkavor.com/en", cta: "See Kavor in practice" },
        { name: "Kortex", body: "Conversational agent for clinical data and hospital operations.", href: "https://agentkortex.com/" },
        { name: "Agent Asaph", body: "A WhatsApp agent for music teams.", href: "https://agentasaph.com/" },
        { name: "ViaFronteira", body: "A cross-border shopping concierge on WhatsApp.", href: "https://www.instagram.com/viafronteira/" },
      ],
    },
    human: {
      eyebrow: "06 · Music",
      title: "Away from screens, music is my hobby.",
      body: "I have a studio, a few guitars, and too many pedals. I enjoy trying combinations, adjusting tones, and playing without turning everything into a project or product.",
      music: "Sometimes it becomes music. Sometimes it is just noise. Both count.",
    },
    closing: {
      eyebrow: "This site",
      title: "I keep writing.",
      body: "This site is a lab and an archive: ideas under construction, decisions under examination, and consequences worth recording.",
      contact: "Start a conversation",
      writing: "Read the essays",
    },
    discussionPrompt: { key: "about-curiosity.v1", text: "What began as curiosity and ended up changing your trajectory?" },
  },
  es: {
    language: "es",
    seoTitle: "Sobre Rodrigo P. Fraga — ingeniería, productos y agentes de IA",
    seoDescription: "La trayectoria de Rodrigo P. Fraga: del primer blog en 2007 a productos, sistemas de salud y agentes de IA.",
    languageLabel: "Idioma",
    hero: {
      kicker: "Rodrigo Pereira Fraga · desde 2004",
      titleLead: "Ingeniería de software",
      titleAccent: "para problemas reales.",
      titleTail: "",
      introduction: "Trabajo con software desde 2004. En este tiempo he construido productos, plataformas y sistemas que deben funcionar de verdad: en producción, con limitaciones técnicas, operativas y humanas.",
      scroll: "Recorre la historia",
    },
    origins: {
      eyebrow: "01 · Conocimiento en movimiento",
      title: "Escribo sobre lo que aprendo desde 2007.",
      body: "Mientras aún estaba en la universidad, empecé a resumir lo que aprendía sobre Java, Adobe Flex y arquitectura en tutoriales de Blogspot. Escribir me ayudaba a ordenar las ideas; publicar ayudaba a otras personas. Llegaron lectores, conversaciones en foros, charlas e invitaciones para enseñar. Compartir el trabajo terminó formando parte del propio trabajo.",
      archiveLink: "Ver el blog original de 2007",
      archiveImageAlt: "Captura del blog de Rodrigo en Blogspot en diciembre de 2007",
      artifacts: [
        { year: "2007", title: "Blog en Blogspot", body: "Publicaba tutoriales mientras todavía estaba entendiendo los temas.", href: "https://e-digows.blogspot.com/" },
        { year: "Comunidad", title: "Foros y eventos", body: "Los textos trajeron lectores, conversaciones, charlas y buenos contactos.", href: "/en/2008/01/16/an-adobe-flex-forum/" },
        { year: "5 años", title: "El aula", body: "Enseñé en universidades durante cinco años. Explicar con claridad se volvió parte de la ingeniería." },
        { year: "Publicaciones", title: "Investigación y revistas", body: "También escribí artículos científicos y para revistas técnicas.", href: "/en/2010/09/06/integrating-flex-with-java-using-blazeds-in-java-magazine-72/" },
        { year: "Productos", title: "Del texto a la operación", body: "EITS, Gamifier, ViaFronteira y muchos sistemas llevaron las ideas a producción.", href: "https://www.eits.com.br/blog/" },
        { year: "Hoy", title: "De vuelta a los experimentos", body: "Los LLM y los agentes me hicieron volver a experimentar y documentar como al principio.", href: "/es/archivo/" },
      ],
    },
    distance: {
      eyebrow: "02 · Cuando la distancia desapareció", title: "Antes de graduarme, el trabajo ya cruzaba fronteras.",
      body: "Los artículos comenzaron como resúmenes de lo que aprendía en la universidad. La audiencia creció, llegaron charlas en eventos tecnológicos y, poco después, un contrato con una empresa de Portugal. Aún no había terminado mi primera carrera cuando empecé a trabajar desde Foz do Iguaçu, cobrando en euros, para personas con las que nunca había compartido una sala.",
      continuation: [
        "Después llegaron proyectos para empresas de Estados Unidos y organizaciones de São Paulo. La distancia dejó de ser un obstáculo antes de que el mercado llamara a esto trabajo remoto. La relación se sostenía en aprender rápido, comunicar con claridad y entregar.",
        "De ahí nació EITS, una software house que operó durante 19 años. Empecé a reunir proyectos, formar equipos y asumir la arquitectura de productos muy diferentes.",
        "Gamifier surgió en paralelo. Convertí prácticas de gamificación que usábamos con equipos de desarrollo en un SaaS para ventas y soporte.",
        "Luego llegó ViaFronteira, un marketplace entre Brasil, Paraguay y Argentina. Alcanzó 30.000 usuarios activos en menos de un año, pero no fue comercialmente sostenible. En los últimos años trabajé más con salud, DICOM y operación hospitalaria. Ahora vuelvo a los experimentos pequeños, esta vez con LLM, agentes y coding agents.",
      ],
      places: [{ place: "Brasil", note: "origen" }, { place: "Portugal", note: "primeros proyectos remotos" }, { place: "Estados Unidos", note: "producto y mercado" }, { place: "El mundo", note: "productos, salud y agentes" }],
      references: [{ label: "Blogspot", href: "https://e-digows.blogspot.com/" }, { label: "EITS", href: "https://www.eits.com.br/blog/" }, { label: "Gamifier", href: "https://gamifier.co/blog/" }, { label: "ViaFronteira", href: "https://www.instagram.com/viafronteira/" }, { label: "Salud", href: "https://epeople.com.br/" }, { label: "IA y agentes", href: "/es/temas/ia-agentes/" }],
      quote: "Trabajo remoto antes de convertirse en rutina.",
    },
    eits: {
      eyebrow: "03 · Experiencia acumulada", quote: "Después de decenas de productos, los patrones empiezan a repetirse.",
      collageLabel: "Registros de la trayectoria profesional",
      indicators: [{ value: "90+", label: "productos modelados y acompañados como arquitecto" }, { value: "2", label: "exits: negocios vendidos o incorporados" }, { value: "20+", label: "años diseñando y construyendo software" }, { value: "~12", label: "intentos de SaaS que no se convirtieron en negocio :)" }, { value: "decenas", label: "artículos científicos y publicaciones técnicas" }],
    },
    hinge: {
      eyebrow: "04 · La tecnología como repertorio", title: "La stack depende del problema.",
      body: "He trabajado con muchos lenguajes, frameworks y tipos de sistema. No me interesa defender una stack para todo. La elección depende del problema, del equipo, de las restricciones y de quién mantendrá el software después.",
      continuation: "Todavía disfruto abrir una tecnología nueva, construir algo pequeño y descubrir dónde funciona y dónde no. Algunas pasan a formar parte del repertorio; otras se quedan en el experimento.",
      oldTools: ["Java", "Spring", "Hibernate", "BlazeDS", "Adobe Flex", "PHP", "Zend Framework", "JavaScript", "TypeScript", "SQL", "PostgreSQL", "Aurora", "Elasticsearch", "Rust", "Flutter", "REST", "Web", "Desktop", "Mobile", "SaaS", "PACS", "RIS", "DICOM", "DICOMweb", "Kubernetes", "AWS", "GitOps", "Cloud-native", "Observabilidad", "Geoprocesamiento", "Streaming de audio y vídeo"],
      newTools: ["LLM", "Agentes de IA", "Coding agents", "Agent harnesses", "MCP", "Uso de herramientas", "Ingeniería de contexto", "Orquestación", "OpenClaw", "Hermes", "Kavor", "Kortex"],
    },
    agents: {
      eyebrow: "05 · Una nueva ingeniería de software", title: "El software ahora también es construido por software.",
      body: "Hoy los coding agents ya leen repositorios enteros, usan herramientas, ejecutan pruebas y trabajan en tareas relativamente largas. OpenClaw, Hermes y otros asistentes muestran otra parte del cambio: software que conserva contexto y acompaña el trabajo durante más tiempo.",
      continuation: "Quiero usar este blog para registrar lo que aprendo al construir agentes para salud, operaciones, atención y desarrollo: qué funciona, dónde fallan y qué prácticas de ingeniería siguen marcando la diferencia.",
      cards: [{ name: "Kavor", body: "Un sistema visual para trabajar con coding agents sin reducir la ingeniería a un chat: conecta agentes, especificaciones, archivos, terminales, decisiones y evidencias en un grafo duradero.", href: "https://agentkavor.com/es", cta: "Ver Kavor en práctica" }, { name: "Kortex", body: "Agente conversacional sobre datos clínicos y operación hospitalaria.", href: "https://agentkortex.com/" }, { name: "Agent Asaph", body: "Agente en WhatsApp para equipos de música.", href: "https://agentasaph.com/" }, { name: "ViaFronteira", body: "Concierge de compras transfronterizas por WhatsApp.", href: "https://www.instagram.com/viafronteira/" }],
    },
    human: { eyebrow: "06 · Música", title: "Lejos de las pantallas, mi afición es la música.", body: "Tengo un estudio, algunas guitarras y demasiados pedales. Me gusta probar combinaciones, ajustar timbres y tocar sin convertirlo todo en un proyecto o producto.", music: "A veces sale música. A veces solo ruido. Ambos cuentan." },
    closing: { eyebrow: "Este sitio", title: "Sigo escribiendo.", body: "Este sitio es un laboratorio y un archivo: ideas en construcción, decisiones examinadas y consecuencias que merece la pena registrar.", contact: "Hablemos", writing: "Leer los artículos" },
    discussionPrompt: { key: "about-curiosity.v1", text: "¿Qué empezó como curiosidad y terminó cambiando tu trayectoria?" },
  },
  fr: {
    language: "fr",
    seoTitle: "À propos de Rodrigo P. Fraga — ingénierie, produits et agents d’IA",
    seoDescription: "Le parcours de Rodrigo P. Fraga : d’un premier blog en 2007 aux produits, aux systèmes de santé et aux agents d’IA.",
    languageLabel: "Langue",
    hero: { kicker: "Rodrigo Pereira Fraga · depuis 2004", titleLead: "Ingénierie logicielle", titleAccent: "pour des problèmes réels.", titleTail: "", introduction: "Je travaille dans le logiciel depuis 2004. J’ai construit des produits, des plateformes et des systèmes qui doivent réellement fonctionner : en production, avec des contraintes techniques, opérationnelles et humaines.", scroll: "Parcourir l’histoire" },
    origins: {
      eyebrow: "01 · Le savoir en mouvement", title: "J’écris sur ce que j’apprends depuis 2007.", body: "Encore étudiant, j’ai commencé à résumer ce que j’apprenais sur Java, Adobe Flex et l’architecture dans des tutoriels Blogspot. Écrire m’aidait à structurer mes idées ; publier aidait d’autres personnes. Des lecteurs, des échanges sur les forums, des conférences et des invitations à enseigner ont suivi. Partager le travail est devenu une partie du travail lui-même.", archiveLink: "Voir le blog original de 2007",
      artifacts: [{ year: "2007", title: "Blogspot", body: "Je publiais des tutoriels alors que je découvrais encore les sujets.", href: "https://e-digows.blogspot.com/" }, { year: "Communauté", title: "Forums et événements", body: "Les textes ont suscité des lectures, des échanges, des conférences et de belles rencontres.", href: "/en/2008/01/16/an-adobe-flex-forum/" }, { year: "5 ans", title: "La salle de cours", body: "J’ai enseigné dans le supérieur pendant cinq ans. Expliquer clairement est devenu une compétence d’ingénierie." }, { year: "Publications", title: "Recherche et revues", body: "J’ai également écrit des articles scientifiques et pour des revues techniques.", href: "/en/2010/09/06/integrating-flex-with-java-using-blazeds-in-java-magazine-72/" }, { year: "Produits", title: "Du texte à l’exploitation", body: "EITS, Gamifier, ViaFronteira et de nombreux systèmes ont porté ces idées en production.", href: "https://www.eits.com.br/blog/" }, { year: "Aujourd’hui", title: "Retour aux expériences", body: "Les LLM et les agents m’ont ramené à l’expérimentation et à la documentation des débuts.", href: "/fr/archives/" }],
    },
    distance: {
      eyebrow: "02 · Quand la distance a disparu", title: "Avant mon diplôme, le travail traversait déjà les frontières.", body: "Les articles ont commencé comme des résumés de ce que j’apprenais à l’université. L’audience a grandi, les conférences sont arrivées, puis un contrat avec une entreprise portugaise. Je n’avais pas terminé mon premier diplôme lorsque j’ai commencé à travailler depuis Foz do Iguaçu, payé en euros, pour des personnes avec lesquelles je n’avais jamais partagé une pièce.",
      continuation: ["Des projets pour des entreprises aux États-Unis ont suivi, puis pour des organisations à São Paulo. La distance a cessé d’être un obstacle avant même que le marché ne parle couramment de télétravail. La relation reposait sur la capacité à apprendre vite, à communiquer clairement et à livrer.", "C’est ainsi qu’est née EITS, une société de logiciels active pendant 19 ans. J’ai rassemblé des projets, constitué des équipes et pris en charge l’architecture de produits très différents.", "Gamifier est né en parallèle. J’ai transformé les pratiques de gamification utilisées avec les équipes de développement en un SaaS pour la vente et le support.", "Puis est venu ViaFronteira, une marketplace entre le Brésil, le Paraguay et l’Argentine. Elle a atteint 30 000 utilisateurs actifs en moins d’un an, sans trouver de modèle commercial durable. Ces dernières années, j’ai davantage travaillé sur la santé, DICOM et les opérations hospitalières. Je reviens maintenant aux petites expériences, avec les LLM, les agents et les coding agents."],
      places: [{ place: "Brésil", note: "origine" }, { place: "Portugal", note: "premiers projets à distance" }, { place: "États-Unis", note: "produit et marché" }, { place: "Le monde", note: "produits, santé et agents" }],
      references: [{ label: "Blogspot", href: "https://e-digows.blogspot.com/" }, { label: "EITS", href: "https://www.eits.com.br/blog/" }, { label: "Gamifier", href: "https://gamifier.co/blog/" }, { label: "ViaFronteira", href: "https://www.instagram.com/viafronteira/" }, { label: "Santé", href: "https://epeople.com.br/" }, { label: "IA et agents", href: "/fr/sujets/ia-agents/" }], quote: "Le télétravail avant qu’il ne devienne courant.",
    },
    eits: { eyebrow: "03 · Expérience accumulée", quote: "Après des dizaines de produits, les mêmes motifs commencent à réapparaître.", indicators: [{ value: "90+", label: "produits modélisés et suivis comme architecte" }, { value: "2", label: "exits — entreprises vendues ou intégrées" }, { value: "20+", label: "années à concevoir et construire des logiciels" }, { value: "~12", label: "tentatives de SaaS qui ne sont pas devenues des entreprises :)" }, { value: "des dizaines", label: "d’articles scientifiques et de publications techniques" }] },
    hinge: { eyebrow: "04 · La technologie comme répertoire", title: "La stack dépend du problème.", body: "J’ai travaillé avec de nombreux langages, frameworks et types de systèmes. Je ne cherche pas à défendre une stack universelle. Le choix dépend du problème, de l’équipe, des contraintes et de ceux qui maintiendront ensuite le logiciel.", continuation: "J’aime toujours découvrir une technologie, construire quelque chose de petit et comprendre où elle fonctionne — et où elle ne fonctionne pas. Certaines rejoignent le répertoire ; d’autres restent des expériences.", oldTools: ["Java", "Spring", "Hibernate", "BlazeDS", "Adobe Flex", "PHP", "Zend Framework", "JavaScript", "TypeScript", "SQL", "PostgreSQL", "Aurora", "Elasticsearch", "Rust", "Flutter", "REST", "Web", "Desktop", "Mobile", "SaaS", "PACS", "RIS", "DICOM", "DICOMweb", "Kubernetes", "AWS", "GitOps", "Cloud-native", "Observabilité", "Géotraitement", "Streaming audio et vidéo"], newTools: ["LLM", "Agents d’IA", "Coding agents", "Agent harnesses", "MCP", "Utilisation d’outils", "Ingénierie du contexte", "Orchestration", "OpenClaw", "Hermes", "Kavor", "Kortex"] },
    agents: { eyebrow: "05 · Une nouvelle ingénierie logicielle", title: "Le logiciel est désormais aussi construit par du logiciel.", body: "Les coding agents lisent déjà des dépôts entiers, utilisent des outils, exécutent des tests et travaillent sur des tâches assez longues. OpenClaw, Hermes et d’autres assistants montrent un autre aspect de cette évolution : des logiciels qui conservent le contexte et accompagnent le travail plus longtemps.", continuation: "Je veux consigner ici ce que j’apprends en construisant des agents pour la santé, les opérations, le service et le développement : ce qui fonctionne, leurs points de rupture et les pratiques d’ingénierie qui font toujours la différence.", cards: [{ name: "Kavor", body: "Un système visuel pour travailler avec des coding agents sans réduire l’ingénierie à une conversation : reliez agents, spécifications, fichiers, terminaux, décisions et preuves dans un graphe durable.", href: "https://agentkavor.com/fr", cta: "Voir Kavor en pratique" }, { name: "Kortex", body: "Agent conversationnel pour les données cliniques et les opérations hospitalières.", href: "https://agentkortex.com/" }, { name: "Agent Asaph", body: "Agent WhatsApp pour les équipes musicales.", href: "https://agentasaph.com/" }, { name: "ViaFronteira", body: "Concierge d’achats transfrontaliers sur WhatsApp.", href: "https://www.instagram.com/viafronteira/" }] },
    human: { eyebrow: "06 · Musique", title: "Loin des écrans, mon loisir est la musique.", body: "J’ai un studio, quelques guitares et beaucoup trop de pédales. J’aime tester des combinaisons, travailler les timbres et jouer sans transformer chaque chose en projet ou en produit.", music: "Parfois, cela devient de la musique. Parfois, seulement du bruit. Les deux comptent." },
    closing: { eyebrow: "Ce site", title: "Je continue d’écrire.", body: "Ce site est un laboratoire et une archive : des idées en construction, des décisions examinées et des conséquences qui méritent d’être consignées.", contact: "Échanger", writing: "Lire les articles" },
    discussionPrompt: { key: "about-curiosity.v1", text: "Qu’est-ce qui a commencé par curiosité et a fini par changer votre trajectoire ?" },
  },
  "zh-Hans": {
    language: "zh-Hans",
    seoTitle: "关于 Rodrigo P. Fraga — 工程、产品与人工智能体",
    seoDescription: "Rodrigo P. Fraga 的历程：从 2007 年的第一个博客，到产品、医疗系统与人工智能体。",
    languageLabel: "语言",
    hero: { kicker: "Rodrigo Pereira Fraga · 始于 2004 年", titleLead: "为真实问题而做的", titleAccent: "软件工程。", titleTail: "", introduction: "我从 2004 年开始从事软件工作。此后，我构建了必须真正运行起来的产品、平台和系统——它们要在生产环境中面对技术、运营与人的限制。", scroll: "沿着经历继续" },
    origins: { eyebrow: "01 · 流动的知识", title: "从 2007 年起，我一直记录所学。", body: "大学期间，我开始在 Blogspot 教程中总结自己对 Java、Adobe Flex 和架构的学习。写作帮助我整理思路，发布则帮助了其他人。随后有了读者、论坛交流、演讲和授课邀请。分享工作最终成为工作本身的一部分。", archiveLink: "查看 2007 年的原始博客", artifacts: [{ year: "2007", title: "Blogspot 博客", body: "还在摸索这些主题时，我就开始发布教程。", href: "https://e-digows.blogspot.com/" }, { year: "社区", title: "论坛与活动", body: "文章带来了读者、讨论、演讲和有价值的联系。", href: "/en/2008/01/16/an-adobe-flex-forum/" }, { year: "5 年", title: "课堂", body: "我在大学任教五年。清晰解释也成为工程能力的一部分。" }, { year: "出版", title: "研究与杂志", body: "我还撰写过科研论文和技术杂志文章。", href: "/en/2010/09/06/integrating-flex-with-java-using-blazeds-in-java-magazine-72/" }, { year: "产品", title: "从文字到运营", body: "EITS、Gamifier、ViaFronteira 和许多系统把这些想法带进了生产环境。", href: "https://www.eits.com.br/blog/" }, { year: "今天", title: "重返实验", body: "LLM 和智能体让我重新像最初一样实验并记录。", href: "/zh-hans/归档/" }] },
    distance: { eyebrow: "02 · 当距离不再重要", title: "毕业之前，工作就已经跨越国界。", body: "这些文章最初只是我对大学所学的总结。读者逐渐增加，科技活动的演讲邀请接踵而来，随后我与一家葡萄牙公司签订了合同。第一份学位尚未完成时，我已经在伊瓜苏市远程工作、领取欧元报酬，而合作的人从未与我共处一室。", continuation: ["之后是美国公司的项目，再后来是圣保罗的机构。远程工作成为通用说法之前，距离就已经不再是障碍。维系合作的不是物理上的在场，而是快速学习、清晰沟通和持续交付。", "EITS 由此诞生。这家软件公司运营了 19 年。我开始汇集项目、组建团队，并负责差异很大的产品架构。", "Gamifier 同期出现。我把开发团队采用的游戏化实践，做成了面向销售和支持的 SaaS。", "之后是连接巴西、巴拉圭和阿根廷的市场 ViaFronteira。它在不到一年内达到 3 万活跃用户，但商业上未能持续。近几年，我更多地从事医疗、DICOM 与医院运营。现在我再次回到小型实验，这次围绕 LLM、智能体和 coding agent。"], places: [{ place: "巴西", note: "起点" }, { place: "葡萄牙", note: "早期远程项目" }, { place: "美国", note: "产品与市场" }, { place: "世界", note: "产品、医疗与智能体" }], references: [{ label: "Blogspot", href: "https://e-digows.blogspot.com/" }, { label: "EITS", href: "https://www.eits.com.br/blog/" }, { label: "Gamifier", href: "https://gamifier.co/blog/" }, { label: "ViaFronteira", href: "https://www.instagram.com/viafronteira/" }, { label: "医疗", href: "https://epeople.com.br/" }, { label: "人工智能与智能体", href: "/zh-hans/主题/人工智能与智能体/" }], quote: "在远程工作成为日常之前。" },
    eits: { eyebrow: "03 · 积累的经验", quote: "经历几十个产品之后，模式开始重复出现。", indicators: [{ value: "90+", label: "作为架构师参与建模和跟进的产品" }, { value: "2", label: "次退出——业务被出售或整合" }, { value: "20+", label: "年软件设计与构建经验" }, { value: "~12", label: "次未成为业务的 SaaS 尝试 :)" }, { value: "数十篇", label: "科研论文与技术文章" }] },
    hinge: { eyebrow: "04 · 技术是一套工具谱系", title: "技术栈取决于问题。", body: "我使用过许多语言、框架和系统类型。我无意为所有问题捍卫同一套技术栈。选择取决于问题、团队、约束，以及日后维护软件的人。", continuation: "我仍然喜欢打开一项新技术，做一个小东西，理解它在哪里有效、又在哪里无效。有些进入工具谱系，有些只停留在实验中。", oldTools: ["Java", "Spring", "Hibernate", "BlazeDS", "Adobe Flex", "PHP", "Zend Framework", "JavaScript", "TypeScript", "SQL", "PostgreSQL", "Aurora", "Elasticsearch", "Rust", "Flutter", "REST", "Web", "桌面", "移动端", "SaaS", "PACS", "RIS", "DICOM", "DICOMweb", "Kubernetes", "AWS", "GitOps", "云原生", "可观测性", "地理处理", "音视频流"], newTools: ["LLM", "人工智能体", "Coding agent", "Agent harness", "MCP", "工具使用", "上下文工程", "编排", "OpenClaw", "Hermes", "Kavor", "Kortex"] },
    agents: { eyebrow: "05 · 一种新的软件工程", title: "软件如今也由软件来构建。", body: "如今，coding agent 已经能够读取完整代码库、使用工具、运行测试，并处理相对长期的任务。OpenClaw、Hermes 等助手呈现了变化的另一面：软件可以保留上下文，更长时间地参与工作。", continuation: "我希望用这个博客记录自己在为医疗、运营、服务和开发构建智能体时学到的内容：什么有效、哪里会失败，以及哪些工程实践依然重要。", cards: [{ name: "Kavor", body: "一个用于协同 coding agent 的可视化系统，不把工程压缩成一次聊天：在持久化图谱中连接智能体、规格、文件、终端、决策与证据。", href: "https://agentkavor.com/zh", cta: "看看 Kavor 如何实际运作" }, { name: "Kortex", body: "面向临床数据与医院运营的对话式智能体。", href: "https://agentkortex.com/" }, { name: "Agent Asaph", body: "面向音乐团队的 WhatsApp 智能体。", href: "https://agentasaph.com/" }, { name: "ViaFronteira", body: "通过 WhatsApp 提供跨境购物礼宾服务。", href: "https://www.instagram.com/viafronteira/" }] },
    human: { eyebrow: "06 · 音乐", title: "离开屏幕，我的爱好是音乐。", body: "我有一间录音室、几把吉他，以及多得有点过分的效果器。我喜欢尝试组合、调整音色，也喜欢在不把一切都变成项目或产品的前提下演奏。", music: "有时会成为音乐，有时只是噪声。两者都值得。" },
    closing: { eyebrow: "这个网站", title: "我还在继续写。", body: "这个网站既是实验室，也是档案：记录正在形成的想法、被审视的决策，以及值得留下的后果。", contact: "聊一聊", writing: "阅读文章" },
    discussionPrompt: { key: "about-curiosity.v1", text: "什么事情始于好奇，最终却改变了你的轨迹？" },
  },
};
import type { Locale } from "../../../i18n/locales";
