# Plano — Tint na lib web e no icon-manager

Especificação: ideia `adicionar-suporte-a-tonalizacao-dos-icones-como-ja-existe-no` (status approved, 20 regras rascunho).
Stack/padrões consultados: `shared/` puro (sem window/document/localStorage/fetch/bindings), `generated/` só via
`bun run icons`, i18n en+pt. Itens de revisão abertos: nenhum.

## Usuários, entradas, saídas
- **Devs que usam `skill-icons`** (react, vue, angular, solid, astro, element, svelte, core/html): entrada `tint`
  (`'5fd3c4' | '#5FD3C4' | '5fc'`), saída SVG/HTML tingido idêntico byte a byte ao da API `/icons?tint=`.
- **Mantenedor no icon-manager (macOS)**: escolhe/digita um tint; saída só visual (data: URL), nada gravado.

## Restrições
- Algoritmo único: `shared/tint.ts` (`parseTint`, `tintIconSvg`). Lib usa espelho em `packages/skill-icons/src/generated/`
  gerado por `scripts/build-icons.ts`; icon-manager usa bundle gerado por `build.sh`. Nada de `mix(`/`luminance(`/
  `PAINT_ATTR` fora de `shared/` e `generated/`; `index.html` sem `tintPalette`/`rasterFilter`.
- Regra da API (`worker/index.ts:117-119`): com tint, parte-se da variante **dark** e o tema vai como `theme` de
  `tintIconSvg`; ícones sem variantes usam o único SVG.
- Sem tint: saída da lib e `src`/`shownFile` do icon-manager idênticos aos de hoje.
- Tint inválido na lib: renderiza sem tint, sem lançar.
- `TINT_SWATCHES` só em `shared/tint.ts`.
- typecheck, test, knip, Biome, Conventional Commits; commits direto na main (memória do projeto).

## Observações técnicas levantadas
- `shared/tint.ts` faz `import type { Theme } from './icons'`: o espelho precisa reescrever esse import
  (ex.: `import type { Theme } from '../core'` ou tipo inline `'dark' | 'light'`) — gerado, não à mão.
- Core: `cache` (`core/index.ts:68`) é keyed por `iconKey`; com tint a chave ganha sufixo (ex.: `react-dark|tint|theme`).
  `remoteIconsUrl` (`:163`) ganha `&tint=` só com `parseTint` válido. `html.ts:85` `<picture>`/`latest` (`:100`, `:139`).
- icon-manager: SVGs hoje são `file://` em `<img>` (`index.html:1320-1323`); para tingir é preciso o texto do SVG.
  Caminho previsto: comando de bridge **somente leitura** em `main.swift` (ex.: `readSvg`, como `readCategories`),
  ou `fetch` de file:// se o WKWebView permitir — decisão técnica do agente da subtarefa 6, sem escrita em disco.
- Dicionários i18n do HTML: `en` em `index.html:1011`, `pt` em `:1119`; rótulos nativos via `L(en, pt)` (`main.swift:11`);
  o controle segue o padrão do controle de tema existente (`toolbarState`).

## Subtarefas

### 1. Swatches em `shared/` — agente **A** (`claude`)
- Escopo: mover `TINT_SWATCHES` de `src/lib/tinted-icons.ts:6` para `shared/tint.ts` (exportado, algoritmo intacto);
  site importa de `shared/`; ajustar imports em `src/components/tint-picker.tsx` se houver.
- Arquivos: `shared/tint.ts`, `src/lib/tinted-icons.ts`, `src/components/tint-picker.tsx`, `test/tint.test.ts`.
- Depende de: —
- Aceite: `grep` não acha outra lista de hex de swatches no repo; `test/tint.test.ts` cobre a exportação; regra
  B230FFC6 (shared puro) passa; typecheck ok.

### 2. Espelho do tint na lib — agente **A** (`claude`)
- Escopo: `scripts/build-icons.ts` copia `shared/tint.ts` para `packages/skill-icons/src/generated/tint.ts`
  reescrevendo o import de `Theme`; rodar `bun run icons`; ajustar knip se preciso.
- Arquivos: `scripts/build-icons.ts`, `packages/skill-icons/src/generated/tint.ts` (gerado), `knip.json` se preciso.
- Depende de: 1.
- Aceite: arquivo gerado compila no tsconfig do pacote; diff entre o espelho e `shared/tint.ts` limitado ao import
  + cabeçalho "gerado"; nenhum arquivo de `generated/` editado à mão.

### 3. Core e HTML com `tint` — agente **B** (`claude`)
- Escopo: opção `tint` em `loadIcons`, `peekIcons`, `remoteIconsUrl`, `renderIcon`, `renderIcons`; `parseTint`
  na entrada; variante dark + `tintIconSvg(svg, tint, theme)`; ícones sem tema usam SVG único; chave de cache
  com tint; `<picture>` auto com dark/light tingidos; `latest` repassa tint a cada URL.
- Arquivos: `packages/skill-icons/src/core/index.ts`, `core/html.ts`, `packages/skill-icons/test/core.test.ts`,
  `test/html.test.ts`.
- Depende de: 2.
- Aceite (testes): `'xyz'` = sem tint; `'#5FC'`/`'5fc'` = `'55ffcc'`; react light = `tintIconSvg(react-dark, t, 'light')`;
  adonis/astro nos dois temas não vazio; `remoteIconsUrl` com/sem `&tint=`; cache A depois de B devolve A;
  regressão sem tint (ícone com e sem tema, dark e light); `renderIcon('react',{theme:'auto',tint:'5fd3c4'})`
  decodificado; `latest` + auto + `'#5FD3C4'` → 2 URLs com `&tint=5fd3c4`; grep sem `mix(`/`luminance(`/`PAINT_ATTR` em `src/` fora de `generated/`.

### 4. Entry points expõem `tint` — agente **C** (`claude`)
- Escopo: prop/atributo `tint` em react, vue, angular, solid, astro (`*.astro`, `types.ts`), element
  (`observedAttributes`, re-render ao mudar/remover), svelte (`*.svelte`, `types.ts`), incluindo providers/contexto
  se existirem para `theme`.
- Arquivos: `packages/skill-icons/src/{react,vue,angular,solid,astro,element,svelte}/**` e testes em `packages/skill-icons/test/`.
- Depende de: 3.
- Aceite: typecheck de todos os tsconfigs do pacote; ≥1 ícone tingido renderizado em teste por entry point;
  element: `setAttribute('tint','ff3b30')` e `removeAttribute('tint')` atualizam o `src` do `<img>`.

### 5. Paridade lib × worker e README — agente **D** (`claude`)
- Escopo: teste em `test/` comparando o core com o handler `/icons` do worker (alguns ícones, incluindo um com
  `<image>`, temas dark/light, um tint); README do pacote com `tint` em exemplo de componente, `renderIcon`/`loadIcons`,
  menção à variante dark e aos swatches de `shared/`.
- Arquivos: `test/tint-parity.test.ts` (novo) ou `test/worker.test.ts`, `packages/skill-icons/README.md`.
- Depende de: 3 (teste); exemplo de componente no README alinhado à API de 4.
- Aceite: teste byte a byte passa; README contém `tint` nos pontos exigidos.

### 6. Tint no icon-manager — agente **E** (`claude`)
- Escopo: `build.sh` gera bundle de `shared/tint.ts` (ex.: `bun build --format=iife` expondo `parseTint`,
  `tintIconSvg`, `TINT_SWATCHES`) em `Contents/Resources` e o `index.html` o carrega; controle de tint (swatches
  compartilhados, cor digitada via `parseTint`, opção "sem tint"); `src`/`shownFile` com ramo tingido em data: URL
  (dark + tema escolhido; sem tema = SVG único) e ramo sem tint inalterado; leitura de SVG só leitura; Copy/Reveal/
  `entry()` intactos; chaves i18n novas em `en` e `pt`; rótulos nativos com `L("…","…")`; estado do tint pode ser
  persistido no `saveState` (preferência da UI, não arquivo do repo).
- Arquivos: `tools/icon-manager/build.sh`, `index.html`, `main.swift`.
- Depende de: 1 (swatches). Independe de 2–5.
- Aceite: `build.sh` compila o app; `grep` sem `tintPalette`/`rasterFilter` no HTML; após escolher tint, `git status`
  limpo em `icons/`, `generated/`, `public/svg/`; mesmas chaves em `en`/`pt`; Copy gera o mesmo JSON.

### 7. Integração e regras — orquestrador
- Escopo: `bun run typecheck`, `bun run test`, knip, `bun run format`; `rules_for` com todos os arquivos alterados
  e `submit_rule_check` até `passed=true`; commits Conventional (direto na main); `update_idea status=done`.
- Depende de: 1–6.

## Ordem e paralelismo
```
1 ──► 2 ──► 3 ──┬─► 4 ──┐
 │              └─► 5 ──┼─► 7
 └────────────► 6 ──────┘
```
- Após 1: trilha da lib (2→3) e trilha do icon-manager (6) em paralelo.
- Após 3: 4 e 5 em paralelo (README de 5 finaliza o exemplo de componente depois de 4).
- Agentes: A (1+2), B (3), C (4), D (5), E (6), orquestrador (7).

## Critério de conclusão
Todos os critérios de aceite da ideia cobertos por testes/greps acima, check de regras aprovado e ideia em done.
Nenhuma decisão de produto em aberto: a especificação cobre comportamento, escopo e arquivos.
