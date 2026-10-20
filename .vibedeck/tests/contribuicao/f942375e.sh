#!/bin/sh
export PATH="$HOME/.local/share/mise/shims:$HOME/.bun/bin:$PATH"
cd "${VIBEDECK_ROOT:-.}" || exit 1
# Valida os commits locais ainda não enviados (origin/main..HEAD); sem commits novos, não se aplica.
base=$(git rev-parse --verify -q origin/main) || exit 77
[ "$(git rev-list --count "$base..HEAD")" = 0 ] && exit 77
bunx commitlint --from "$base" --to HEAD || { echo "Commit fora do Conventional Commits"; exit 1; }
