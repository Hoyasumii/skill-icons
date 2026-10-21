# Correção AJUSTAR — subtarefas #2/#3

Escopo: corrigir a origem das dez falhas de paridade identificadas em review-4-5.md; provider codex, algoritmo compartilhado e teste byte a byte preservados. Implementação delegada ao agente fonte_bruta, com responsabilidade por scripts/core, geração e expectativas tint de core/HTML.

`scripts/build-icons.ts` gera cada módulo com `raw` contendo o SVG original e default `raw.trim()`. O payload não é duplicado. O tipo de loaders inclui raw e o core usa raw somente no ramo tint. Sem tint continua usando default. Geração executada exclusivamente por `bun run icons`.

As expectativas tint de `packages/skill-icons/test/core.test.ts` e `html.test.ts` agora partem de raw, pois o default aparado representa o contrato sem tint. Testes de paridade, algoritmo e expectativas sem tint não foram enfraquecidos.

## Evidências

- Paridade lib/worker: 24/24; compara bytes dos SVGs internos completos, incluindo image, nos dois temas. Não afirma igualdade dos wrappers compostos preexistentes.
- Core/HTML: 37/37. Regressão sem tint isolada: 4/4.
- Verificação objetiva de todos os 1.136 módulos: default igual à fonte original aparada; raw igual à fonte original integral.
- Check obrigatório `bed2c775`, arquivo `.vibedeck/checks/20261020-195650-bed2c775.json`: passed=true, sem failures/warnings. Typecheck raiz, 201 testes raiz e 7 testes release, knip e Biome aprovados; Conventional Commits não aplicável. Uma regra manual pendente, conforme fluxo padrão.
- `git diff --check` dos quatro arquivos: aprovado.

## Estado

Correção #2/#3 concluída; bloqueador de #5 removido. #5 aguarda revisão da correção; #7 continua pendente, incluindo typecheck e suíte completa do pacote, observação da instabilidade Solid já registrada, integração, commit e status done da ideia. A ideia permanece approved até conclusão global. Nenhum commit realizado nesta subtarefa.

IMPLEMENTADO
