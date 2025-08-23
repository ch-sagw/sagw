#!/usr/bin/env bash
set -euo pipefail

TARGET="${BUILD_TARGET:-payload}"  # default to payload

case "$TARGET" in
  payload)   npm run build:prod ;;
  storybook) npm run build-storybook ;;
  *)
    echo "Unknown BUILD_TARGET: $TARGET" >&2
    exit 1
    ;;
esac