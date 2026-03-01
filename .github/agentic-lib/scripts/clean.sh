#!/usr/bin/env bash
# scripts/clean.sh
# Usage: ./scripts/clean.sh
#
# This file is part of the Example Suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT
#

# Node clean and build
if [[ -e 'package.json' ]]; then
  rm -rf build
  rm -rf coverage
  rm -rf dist
  rm -rf node_modules
  rm -rf package-lock.json
  npm install
  npm run build
  npm link
fi
