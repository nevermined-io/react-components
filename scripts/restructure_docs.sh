#!/usr/bin/env bash
set -e

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
CORE_DOCS_DIR="$SCRIPT_DIR/../docs/core"
PROVIDERS_DOCS_DIR="$SCRIPT_DIR/../docs/providers"
DOCS=("$CORE_DOCS_DIR" "$PROVIDERS_DOCS_DIR")

for i in "${DOCS[@]}"; do
  mkdir -p "$i/API"
  if [ "$i" == "$CORE_DOCS_DIR" ]; then
    mv -t "$i/API" "$i/enums" "$i/interfaces" "$i/modules" "$i/modules.md"
  else
    mv -t "$i/API" "$i/interfaces" "$i/modules.md"
  fi
done
