#!/usr/bin/env bash
# scripts/update.sh
# Usage: ./scripts/update.sh
#
# This file is part of the repository template which uses `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see the file LICENSE
#

rm -f package-lock.json
rm -f node-modules
npm install
npm run update-to-minor
npm update
npm upgrade
npm install
npm run build
npm link
