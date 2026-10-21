# Implementação — subtarefas 3 e 6

Provider: codex. Escopo delegado conforme plano; mudanças anteriores preservadas.

## Concluídas
- Pré-requisitos 1 e 2 verificados: swatches compartilhados; `bun run icons` gera espelho idêntico a `shared/tint.ts`, exceto cabeçalho e import do tipo Theme. Check `60c84c72` aprovado; quatro manuais pending.
- 3: core/HTML aceitam tint normalizado, usam variante dark e tema escolhido, distinguem cor/tema no cache e propagam tint para auto/latest. Alterados `packages/skill-icons/src/core/{index,html}.ts` e `packages/skill-icons/test/{core,html}.test.ts`.
- 6: bundle de shared/tint.ts, controle com swatches/cor digitada/remoção, bridge readSvg somente leitura, previews data URL, traduções en/pt e toolbar nativa. Alterados `tools/icon-manager/{build.sh,index.html,main.swift}` e adicionado `tools/icon-manager/tint.test.ts`. Copy/Reveal/entry e ramo sem tint preservados.

## Evidências
- Core/HTML: 37 testes e TypeScript do pacote passaram; Biome e busca de algoritmo duplicado passaram. Check individual `0e1ed83c` aprovado.
- Manager: quatro testes, 24 assertions sobre funções reais do HTML; bundle executado em VM produz tint idêntico ao shared; build universal arm64/x86_64 e `codesign --verify --deep --strict` passaram. Check individual `0128b2ab` aprovado. Build precisou escalada aprovada após iconutil falhar no sandbox.
- `git status` vazio para icons/, generated/ e public/svg/ após validações do manager.
- Check combinado `0a7af3a8` aprovado para os oito arquivos desta etapa: quatro regras de script, sem warnings e sem manuais pending. Incluiu typecheck/test raiz, knip e Biome.
- Limitação: sem validação interativa em WKWebView; validação do preview realizada com funções reais do HTML e bundle construído.

## Pendentes
- 4: prop/atributo tint e teste por entry point (react, vue, angular, solid, astro, element, svelte).
- 5: teste lib × handler /icons, incluindo ícone com image, e README.
- 7: integração final, typecheck/test de todos os entry points, demais checks e encerramento da ideia.

API para a subtarefa 4: `iconKey(name, theme?, tint?)`; `loadIcons/peekIcons(names, theme?, perLine?, tint?)`; `remoteIconsUrl({...options, tint})`; `renderIcon/renderIcons(..., {tint})`.

Ideia permanece approved porque o escopo completo ainda não foi implementado. Nenhum commit realizado nesta etapa.
