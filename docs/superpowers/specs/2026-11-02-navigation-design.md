# Estrutura de navegação e faixa Orbit

Estado: proposta aprovada por Hugo em 02/11/2026; implementação local, sem publicação.

Seguimento de 02/11/2026: Hugo autorizou a publicação após sanity check PT/EN e pediu confirmação posterior de navegação, temas e mobile no domínio. Esta autorização substitui a restrição local acima apenas para a versão verificada.

## Objetivo

Reduzir o ruído do menu sem eliminar conteúdos nem quebrar ligações existentes.

## Estrutura aprovada

| Topo PT / EN | Conteúdo contextual |
|---|---|
| Perfil / Profile | Sobre / About; Experiência / Experience |
| Investigação / Research | Investigação / Research; Publicações / Publications |
| Projetos / Projects | Profissionais / Professional; Pessoais / Personal |
| Formação / Training | Página atual de formação e consultoria |
| Contacto / Contact | Página atual de contacto |

- O nome Hugo Monteiro liga à homepage do idioma atual; substitui a entrada Início/Home.
- Notícias/News e Publicações/Publications ficam acessíveis no rodapé de todas as páginas.
- A homepage apresenta as duas notícias existentes; investigação tem acesso contextual às notícias.
- Subnavegação horizontal, com quebra de linha em mobile, sem dropdowns ou sidebar global.
- Projetos profissionais e pessoais permanecem na mesma página; não criar filtros para apenas quatro projetos e um side project.
- Não mover ficheiros nem alterar URLs/canonical/hreflang nesta fase. As páginas existentes são as subpáginas lógicas das áreas; uma migração física de pastas fica fora do âmbito.

## Faixa Orbit

Usar o asset do próprio projeto Mayan `portal-mockup/assets/generated/orbit-hero-real-v3.webp`, imagem demonstrativa de produto sem dados pessoais. Copiar para `assets/img/projects/orbit-banner.webp`; sem carregamento automático de recursos externos. Gradiente escuro local para contraste; fundo decorativo, texto HTML e links PT/EN existentes preservados.

Asset copiado sem alteração: 65 410 bytes; SHA-256 `5542cf83ece122928a9034024b3683fc8b976d1863854b53944b916c8c8839f0`.

## Manutenção

`node scripts/update_navigation.cjs pt/` ou `en/` emite um patch para a estrutura estática. O script não escreve ficheiros. Os resultados devem ser revistos e aplicados com `apply_patch`; nova execução sobre o estado atual não produz alterações. Ao adicionar notícias, atualizar também os destaques estáticos da homepage. As datas indicam as datas já apresentadas nas notícias, não a data desta reorganização.

## Alternativas e decisão

Manter nove opções mantém o problema; esconder tudo num menu Mais reduz descoberta. A solução aprovada agrupa conteúdos, mantém cinco acessos principais e contextualiza as páginas secundárias. Não introduzir framework, dependências ou novas páginas vazias.

## Verificação

Testes de contratos de navegação, destinos internos e subnavegação em todas as páginas. Browser: Perfil→Experiência, Investigação→Publicações, homepage→Notícias→artigo, Projetos→Pessoais; idiomas, teclado, temas e 320/390/1440 px. Validar imagem, contraste e ausência de overflow. Não executar deploy nem alterações no projeto Mayan.
