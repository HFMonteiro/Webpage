# Simplified Navigation Implementation Plan

> **For agentic workers:** Execute inline in this checkout; use test-driven-development and verification-before-completion. No publication or subagents requested.

**Goal:** Implementar a hierarquia PT/EN aprovada e imagem de fundo no banner Orbit.

**Architecture:** HTML estático com navegação global de cinco links e subnavegação contextual. Preservar scripts de menu/temas, URLs, conteúdo e alterações locais anteriores.

**Tech Stack:** HTML, CSS, JavaScript vanilla, node:test; navegador integrado para QA.

**Spec:** `docs/superpowers/specs/2026-11-02-navigation-design.md`.

## Global Constraints

- PT-PT e EN em paridade; sem publicação, dependências novas ou movimentos de ficheiros.
- Preservar ORCID, notícias da defesa, demo de process mining, links WebPLS/Orbit e fontes.
- Manter alterações anteriores em projetos e os mockups locais.

## Review Focus

- Homepage acessível pelo nome em todas as páginas, incluindo 404.
- Subpáginas não ficam órfãs quando saem do menu global.
- Menu mobile/temas e subnav convivem sem overflow a 320 px.
- Conteúdo acessível sem JavaScript; não gerar navegação apenas em runtime.
- Imagem Orbit local, sem texto cortado e sem depender do tema para ser legível.

## Task 1: Estrutura e notícias

- [x] Teste de cinco destinos globais, home no nome, rodapé e relações contextuais: 22 falhas antes da implementação, 22 aprovações depois.
- [x] Atualizados `pt/*.html`, `en/*.html` e `404.html` sem mover URLs. Subnav de Perfil/Investigação/Projetos, notícias na homepage e rodapé.
- [x] CSS e testes ajustados; `npm test`: 38 testes aprovados.

## Task 2: Banner e QA

- [x] Copiado asset inspecionado do Orbit; fundo e gradiente em `assets/css/portfolio-pages.css`.
- [x] Browser: 22 páginas × 320/1440 px × claro/escuro = 88 combinações sem overflow; sem erros de consola. Verificados Perfil→Experiência, Investigação→Publicações, homepage→Notícias e menu/Escape/home no nome.
- [x] Imagem inspecionada a 320 e 1440 px, sem cortes no texto; links existentes WebPLS e Orbit preservados. Foco dourado confirmado por computed style; âncora da defesa após correção: título 88 px, menu termina aos 60 px.
- [x] Revisão estática independente e revisão visual concluídas. Contraste e espaço inferior do rodapé reforçados para a navegação secundária.
- [x] Preview local mantido; sem commit/push/deploy. Não foi executado o workflow de ORCID nem alterado o projeto Mayan.

## Execução

Hugo pediu expressamente documentação e implementação; execução direta nesta sessão. Os ficheiros existentes permanecem no checkout atual para preservar o preview e as alterações anteriores. Revisão estática independente por explorer: identificados foco claro e offset da âncora da defesa; ambos corrigidos. A verificação visual também levou a melhorar o contraste dos links do rodapé, agora usados como navegação secundária.
