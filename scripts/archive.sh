#!/usr/bin/env bash
# scripts/archive.sh
# Usage: ./scripts/archive.sh
#
# This file is part of the Example Suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT

intention="$(head -1 CONTRIBUTING.md | sed 's/^# //')"
mkdir -p 'archive/'
cp -fv CONTRIBUTING.md "archive/${intention?}-$(date +%Y-%m-%d)-CONTRIBUTING.md"
cp -fv README.md "archive/${intention?}-$(date +%Y-%m-%d)-README.md"
cp -fv package.json "archive/${intention?}-$(date +%Y-%m-%d)-package.json"
cp -fv src/lib/main.js "archive/${intention?}-$(date +%Y-%m-%d)-main.js"
cp -fv tests/unit/main.test.js "archive/${intention?}-$(date +%Y-%m-%d)-main.test.js"
#rm -rfv node_modules
#rm -rfv package-lock.json
#npm install
#npm run build
#npm link
