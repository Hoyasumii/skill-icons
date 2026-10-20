#!/bin/sh
cd "${VIBEDECK_ROOT:-.}" || exit 1
# shared/ é usado pelo site e pelo worker: nada de DOM, storage, rede ou bindings do Worker.
if [ -n "$VIBEDECK_FILES" ]; then
  files=$(printf '%s\n' "$VIBEDECK_FILES" | grep -E '^shared/.*\.(ts|tsx)$' | while read -r f; do [ -f "$f" ] && echo "$f"; done)
  [ -z "$files" ] && exit 77
else
  files=$(find shared -name '*.ts' -o -name '*.tsx')
fi
# shellcheck disable=SC2086
hits=$(grep -nE '\b(window|document|localStorage|sessionStorage|navigator)\.|\bfetch\(|\benv\.ASSETS\b|["'"'"'`]cloudflare:' $files)
[ -z "$hits" ] && exit 0
echo "APIs de runtime em shared/:"; echo "$hits"; exit 1
