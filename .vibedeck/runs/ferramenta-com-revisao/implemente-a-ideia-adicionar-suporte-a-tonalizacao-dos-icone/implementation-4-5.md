# Implementação parcial — subtarefas 4 e 5

Objetivo: expor tint nos sete entry points e testar a paridade dos ícones da lib com o handler /icons.
Escopo separado por agentes próprios; stack, padrões e ideia consultados. Nenhuma revisão aberta encontrada.
Grafo ausente. Provider/modelo não alterados. Não foram alterados core, gerador ou algoritmo nesta etapa.

## Subtarefa 4 — implementada, validação específica aprovada

React, Vue, Angular, Solid, Astro, element e Svelte expõem tint em seus tipos e componentes,
encaminham a opção ao core em renderização local e latest, incluindo dependências dos caches reativos.
Providers/contextos existentes também propagam tint com herança e override.
O custom element observa tint e atualiza o src ao mudar ou remover o atributo.

Arquivos: packages/skill-icons/src/{react,vue,angular,solid,astro,element,svelte}/** e testes associados
em packages/skill-icons/test/ (incluindo fixtures de tipos e reatividade).

Evidências do agente:
- bun run typecheck no pacote: passou em todos os frameworks/tsconfigs.
- bun run build no pacote: passou, incluindo emissão TypeScript, Angular, Svelte, Astro e Solid.
- bun run test no pacote, isolado: 13 arquivos, 178/178 testes passaram.
- Singles e grids tingidos cobertos nos sete entry points; herança/override de providers e reação a
  mudanças/remover tint cobertas em React, Vue, Solid, Svelte e element.
- Knip, Biome e git diff --check aprovados.

Check obrigatório 3db446eb (.vibedeck/checks/20261020-194930-3db446eb.json) reprovado apenas pela
regra global typecheck/test: os dez casos de paridade da subtarefa 5 falham. Zero manuais pendentes.
Portanto a implementação específica de 4 está validada, mas a aprovação global continua bloqueada.

## Subtarefa 5 — README pronto; paridade bloqueada por falha real

Arquivos exclusivos: packages/skill-icons/README.md e test/tint-parity.test.ts.
README documenta tint em componentes, renderIcon e loadIcons (quarto argumento), formatos aceitos,
variante dark e a fonte compartilhada TINT_SWATCHES. Não afirma igualdade byte a byte ainda não comprovada.

Teste novo: 24 casos com react, adonis, astro, moonrepo e void (incluindo SVG com image), temas dark/light,
com/sem tint e grades com perLine=2. Resultado: 14 passaram e 10 falharam.

O wrapper de composição do core já era compacto e o do worker já era indentado. O teste documenta essa
diferença e extrai cada SVG completo do ícone usando profundidade de tags SVG, preservando SVGs aninhados,
image e todos os bytes internos. Compara Uint8Arrays sem normalização. O wrapper externo fica fora
da comparação; a revisão deve avaliar esse limite frente ao contrato pedido. Saída sem tint foi preservada.

A extração não esconde a falha de produção: os casos tingidos adonis/astro/moonrepo/void e a grade,
nos dois temas, diferem por um newline interno. scripts/build-icons.ts:33 armazena a fonte bruta para
o worker, mas :39 gera o default da lib com svg.trim(). tintIconSvg envolve a fonte em g e o newline
removido passa a ficar dentro do SVG tingido. react tingido passa; os casos sem tint passam.

Check 70908982 (.vibedeck/checks/20261020-194825-70908982.json): reprovado, suíte raiz com
191 testes aprovados e 10 reprovados. Biome e git diff --check aprovados. Checks anteriores também
documentam a descoberta; o teste estrito permanece no disco.

## Pendências e próximo passo

Por instrução do orquestrador, não ampliar esta fatia para as subtarefas 2/3. A revisão deve emitir
AJUSTAR e encaminhar a correção da fonte usada para tint, preservando o default sem tint e sua regressão.
Uma possibilidade técnica é exportar a fonte bruta adicionalmente nos módulos gerados e usá-la apenas
no caminho tint; a decisão/implementação fica para o próximo ciclo, seguida de regeneração e checks.

Subtarefa 5 não aprovada; subtarefa 7 (integração/regras/commit/status da ideia) continua pendente.
A ideia não foi marcada done. Nenhum commit criado nesta etapa. Não houve decisão de produto pendente.
