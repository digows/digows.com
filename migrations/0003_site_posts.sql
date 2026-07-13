CREATE TABLE site_posts
(
    comment_path TEXT PRIMARY KEY NOT NULL,
    translation_key TEXT NOT NULL UNIQUE,
    original_language TEXT NOT NULL CHECK (original_language IN ('pt-BR', 'en')),
    is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
    created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
    CHECK (substr(comment_path, 1, 1) = '/'),
    CHECK (substr(comment_path, -1, 1) = '/')
);

INSERT INTO site_posts (comment_path, translation_key, original_language)
VALUES
    ('/2007/07/10/convenca-sua-equipe-para-desenvolvimento-web-e-com-adobe-flex/', '2007/07/10/convenca-sua-equipe-para-desenvolvimento-web-e-com-adobe-flex', 'pt-BR'),
    ('/2007/09/26/um-bug-no-google/', '2007/09/26/um-bug-no-google', 'pt-BR'),
    ('/2007/11/16/como-anda-o-adobe-flex-no-brasil/', '2007/11/16/como-anda-o-adobe-flex-no-brasil', 'pt-BR'),
    ('/2007/12/13/ol-pessoal/', '2007/12/13/ol-pessoal', 'pt-BR'),
    ('/2007/12/17/postando-cdigos-com-o-wordpress-231/', '2007/12/17/postando-cdigos-com-o-wordpress-231', 'pt-BR'),
    ('/2007/12/17/upload-de-arquivos-com-flex-php-e-java/', '2007/12/17/upload-de-arquivos-com-flex-php-e-java', 'pt-BR'),
    ('/2007/12/18/modularizando-sua-aplicao-com-modules-e-flex-builder-3/', '2007/12/18/modularizando-sua-aplicao-com-modules-e-flex-builder-3', 'pt-BR'),
    ('/2007/12/19/adobe-flash-player-com-google-toolbar/', '2007/12/19/adobe-flash-player-com-google-toolbar', 'pt-BR'),
    ('/2007/12/20/adobe-celebra-25-anos-de-inovao/', '2007/12/20/adobe-celebra-25-anos-de-inovao', 'pt-BR'),
    ('/2007/12/20/adobe-flex-padronizando-seu-cdigo/', '2007/12/20/adobe-flex-padronizando-seu-cdigo', 'pt-BR'),
    ('/2007/12/28/lanado-meu-labs/', '2007/12/28/lanado-meu-labs', 'pt-BR'),
    ('/2007/12/29/trabalhando-com-css-no-adobe-flex-builder-3/', '2007/12/29/trabalhando-com-css-no-adobe-flex-builder-3', 'pt-BR'),
    ('/2007/12/30/ainda-sei-jogar-counter-strike/', '2007/12/30/ainda-sei-jogar-counter-strike', 'pt-BR'),
    ('/2008/01/03/proposta-de-arquitetura-com-adobe-flex-e-php-usando-zend-framework/', '2008/01/03/proposta-de-arquitetura-com-adobe-flex-e-php-usando-zend-framework', 'pt-BR'),
    ('/2008/01/11/crtica-em-forma-de-comdia/', '2008/01/11/crtica-em-forma-de-comdia', 'pt-BR'),
    ('/2008/01/16/forum-sobre-adobeflex/', '2008/01/16/forum-sobre-adobeflex', 'pt-BR'),
    ('/2008/01/21/integrando-adobe-flex-blazeds-springframework-hibernate-uma-soluo-opensource-para-sistemas-web-parte-1/', '2008/01/21/integrando-adobe-flex-blazeds-springframework-hibernate-uma-soluo-opensource-para-sistemas-web-parte-1', 'pt-BR'),
    ('/2008/01/27/integrando-adobe-flex-blazeds-springframework-hibernate-uma-soluo-opensource-para-sistemas-web-parte-2-final/', '2008/01/27/integrando-adobe-flex-blazeds-springframework-hibernate-uma-soluo-opensource-para-sistemas-web-parte-2-final', 'pt-BR'),
    ('/2008/03/16/manifesto-flex-brasil/', '2008/03/16/manifesto-flex-brasil', 'pt-BR'),
    ('/2008/04/13/porqu-flex-why-flex/', '2008/04/13/porqu-flex-why-flex', 'pt-BR'),
    ('/2009/01/13/flex-um-chat-simples-em-menos-de-20-linhas/', '2009/01/13/flex-um-chat-simples-em-menos-de-20-linhas', 'pt-BR'),
    ('/2009/05/29/artigo-interfaces-de-qualidade-com-flex-na-java-magazine/', '2009/05/29/artigo-interfaces-de-qualidade-com-flex-na-java-magazine', 'pt-BR'),
    ('/2010/09/06/artigo-integrando-flex-com-java-utilizando-o-blazeds-na-java-magazine-72/', '2010/09/06/artigo-integrando-flex-com-java-utilizando-o-blazeds-na-java-magazine-72', 'pt-BR'),
    ('/2025/08/27/nine-women-cant-make-one-baby-why-smaller-software-teams-deliver-more/', '2025/08/27/nine-women-cant-make-one-baby-why-smaller-software-teams-deliver-more', 'en'),
    ('/2025/09/02/the-ifless-principle-designing-apis-without-hidden-decisions/', '2025/09/02/the-ifless-principle-designing-apis-without-hidden-decisions', 'en'),
    ('/2026/05/20/the-high-individual-contributor-in-the-age-of-ai-agents/', '2026/05/20/the-high-individual-contributor-in-the-age-of-ai-agents', 'en');

CREATE INDEX site_posts_active_index
    ON site_posts(is_active, comment_path);
