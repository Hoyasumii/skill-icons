#!/bin/sh
# bun vem do mise; o shell de login nem sempre o tem no PATH.
export PATH="$HOME/.local/share/mise/shims:$HOME/.bun/bin:$PATH"
cd "${VIBEDECK_ROOT:-.}" || exit 1
# Mesmo comando do pre-commit (husky).
bunx knip || { echo "knip achou código, export ou dependência sem uso"; exit 1; }
