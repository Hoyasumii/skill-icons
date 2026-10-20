#!/bin/sh
export PATH="$HOME/.local/share/mise/shims:$HOME/.bun/bin:$PATH"
cd "${VIBEDECK_ROOT:-.}" || exit 1
# Arquivos do VibeDeck são gravados pelo app e ficam fora da regra.
files=$(printf '%s\n' "$VIBEDECK_FILES" | grep -v -e '^$' -e '^\.vibedeck/' -e '^vibedeck\.json$' | while read -r f; do [ -f "$f" ] && echo "$f"; done)
if [ -z "$VIBEDECK_FILES" ]; then
  out=$(bunx biome format . 2>&1) && exit 0
  bad=$(printf '%s\n' "$out" | grep ' format ━' | grep -v -e '^\.vibedeck/' -e '^vibedeck\.json ')
  [ -z "$bad" ] && exit 0
  echo "Rode bun run format:"; printf '%s\n' "$bad"; exit 1
fi
[ -z "$files" ] && exit 77
# shellcheck disable=SC2086
bunx biome format --no-errors-on-unmatched $files || { echo "Rode bun run format"; exit 1; }
