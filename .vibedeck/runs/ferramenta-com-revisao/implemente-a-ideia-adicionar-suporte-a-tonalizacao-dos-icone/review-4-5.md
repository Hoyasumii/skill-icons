# Revisão — subtarefas 4 e 5

Escopo: entregas da etapa anterior comparadas ao plan.md e à ideia completa. Nenhuma implementação alterada. Guia e regras consultados; grafo ausente. Provider codex preservado.

## Achado bloqueador — #5, origem em #2/#3

A paridade byte a byte não está atendida. `scripts/build-icons.ts:39` exporta `svg.trim()` para a lib, enquanto o worker recebe a fonte bruta (`:33`). `packages/skill-icons/src/core/index.ts:99` aplica tintIconSvg ao default aparado. Para adonis, astro, moonrepo e void, o newline final removido passa a ser um byte interno ausente no resultado tingido. React passa; ambos os temas falham nos quatro ícones e na grade.

Reprodução independente: `bunx vitest run test/tint-parity.test.ts` — 14 passam / 10 falham. Log: /private/tmp/review45-parity.log. Não normalizar whitespace nem enfraquecer o teste. Corrigir a fonte do caminho tingido em #2/#3 e regenerar pelo script, mantendo o default e a saída sem tint intactos.

O teste extrai SVGs internos completos, balanceando SVGs aninhados, e compara Uint8Array sem normalização. Isso é uma verificação válida dos bytes de cada ícone, incluindo image; não demonstra igualdade do documento composto inteiro. O wrapper compacto da lib difere do wrapper indentado do worker, diferença preexistente. A exigência da ideia sobre um “ícone tingido” é verificada internamente, mas a alegação ampla de saída composta inteira idêntica deve continuar limitada até haver comparação integral específica. A falha atual existe mesmo no escopo interno mais estreito.

## #4 — interfaces e cobertura

Os sete entry points expõem tint e encaminham ao core/URL no local e latest; providers existentes herdam/permitem override, e dependências reativas incluem tint. Element observa tint e cobre alteração e remoção do atributo. Tipos Astro/Svelte e fixtures dos frameworks incluem a opção. Há testes de ícone e grade tingidos em cada entry point. Nenhum bloqueador adicional encontrado na inspeção do diff.

Typecheck do pacote executado nesta revisão: passou, todos os tsconfigs; Svelte e Astro sem erros/avisos. README de #5 atende exemplos de componente, renderIcon, loadIcons, variante dark e fonte compartilhada dos swatches.

## Regras e limites

Check obrigatório `90c83926` (`.vibedeck/checks/20261020-195233-90c83926.json`): reprovado pela paridade, suíte raiz 191 passam / 10 falham. Knip e Biome aprovados, Conventional Commits não aplicável; zero warnings e zero manuais pendentes. Não há aprovação global e a ideia permanece approved.

A suíte do pacote nesta revisão retornou 177/178: testes existentes de Solid-client dependem de settle fixo de 20 ms e falharam em pontos diferentes em duas execuções (composes several icons; shows a placeholder, then the loaded icon). Todos os novos cenários tint passaram. Uma execução intermediária foi descartada por coincidir com regeneração de generated/. Não há evidência de bug adicional de produção; a estabilidade desses testes deve ser observada em #7. Log final: /private/tmp/review45-package-final.log.

## Pendentes

- #2/#3: reabrir para preservar fonte bruta no caminho tint sem alterar saída sem tint.
- #5: fazer os 24 casos de paridade passarem; README concluído.
- #7: integração e regras verdes, commit e status done da ideia após aprovação.
- #4: implementação revista sem achados adicionais; aprovação global aguarda o bloqueador acima.

Veredito: AJUSTAR.
