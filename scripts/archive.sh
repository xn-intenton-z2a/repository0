#!/usr/bin/env bash
# scripts/archive.sh
# Usage: ./scripts/archive.sh
#
# This file is part of the Example Suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT

intention="$(head -1 CONTRIBUTING.md | sed 's/^# //')"
mkdir -p 'archive/'
find "features" -maxdepth 2 -type f -name '*.md' -print -exec echo "# {}" \; -exec cat {} \; > "archive/${intention?}-$(date +%Y-%m-%d)-FEATURES.md"
find "prompts" -maxdepth 2 -type f -name '*.md' -print -exec echo "# {}" \; -exec cat {} \; > "archive/${intention?}-$(date +%Y-%m-%d)-PROMPTS.md"
find "library" -maxdepth 2 -type f -name '*.md' -print -exec echo "# {}" \; -exec cat {} \; > "archive/${intention?}-$(date +%Y-%m-%d)-LIBRARY.md"
cp -fv MISSION.md "archive/${intention?}-$(date +%Y-%m-%d)-MISSION.md"
cp -fv README.md "archive/${intention?}-$(date +%Y-%m-%d)-README.md"
cp -fv SOURCES.md "archive/${intention?}-$(date +%Y-%m-%d)-SOURCES.md"
cp -fv package.json "archive/${intention?}-$(date +%Y-%m-%d)-package.json"
cp -fv src/lib/main.js "archive/${intention?}-$(date +%Y-%m-%d)-main.js"
cp -fv tests/unit/main.test.js "archive/${intention?}-$(date +%Y-%m-%d)-main.test.js"
mkdir -p "archive/public-$(date +%Y-%m-%d)"
cp -rfv public/* "archive/public-$(date +%Y-%m-%d)/"
#rm -rfv node_modules
#rm -rfv package-lock.json
#npm install
#npm run build
#npm link
