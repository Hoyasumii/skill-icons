#!/bin/sh
cd "${VIBEDECK_ROOT:-.}" || exit 1
# Saídas de bun run icons nunca entram como arquivo alterado à mão.
[ -z "$VIBEDECK_FILES" ] && exit 77
bad=$(printf '%s\n' "$VIBEDECK_FILES" | grep -E '^(generated/|public/svg/|packages/skill-icons/src/generated/)')
[ -z "$bad" ] && exit 0
echo "Arquivos gerados alterados; mude icons/ ou scripts/build-icons.ts e rode bun run icons:"; echo "$bad"; exit 1
