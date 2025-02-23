#!/usr/bin/env bash
# scripts/clean.sh
# Usage: ./scripts/clean.sh
#
# This file is part of the Example Suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT

./scripts/clear-history-locally.sh
rm -rfv ./build \
rm -rfv ./coverage \
rm -rfv ./dist
rm -rfv ./node_modules
rm -rfv ./package-lock.json
npm install
npm run build
npm link
