#!/bin/sh
# bun vem do mise; o shell de login nem sempre o tem no PATH.
export PATH="$HOME/.local/share/mise/shims:$HOME/.bun/bin:$PATH"
cd "${VIBEDECK_ROOT:-.}" || exit 1
# typecheck e testes, como o CONTRIBUTING.md e o deploy.yml exigem.
bun run typecheck || { echo "bun run typecheck falhou"; exit 1; }
bun run test || { echo "bun run test falhou"; exit 1; }
