#!/usr/bin/env bash
# scripts/export-source.sh
# Purpose: Export the source code to date stamped files.
# Usage: ./scripts/export-source.sh
#
# This file is part of the Example Suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT
#

mkdir -p 'exports/'
find "." -type f -not -path '*/build/*' -not -path '*/target/*' -not -path '*/cdk.out/*' -not -path '*/dist/*' -not -path '*/exports/*' -not -path '*/coverage/*' -not -path '*/node_modules/*' -not -path '*/\.git/*' -not -path '*/\.idea/*' -print | grep -v '.DS_Store' > "exports/$(date +%Y-%m-%d)-files-list.txt"
find "." -maxdepth 1 -type f -name '*.md' -print -exec echo "==== Content of {} ====" \; -exec cat {} \; > "exports/$(date +%Y-%m-%d)-root-cat.txt"
find "." -maxdepth 1 -type f -name 'package.json' -print -exec echo "==== Content of {} ====" \; -exec cat {} \; >> "exports/$(date +%Y-%m-%d)-root-cat.txt"
find "." -maxdepth 1 -type f -name 'vitest.config.js' -print -exec echo "==== Content of {} ====" \; -exec cat {} \; >> "exports/$(date +%Y-%m-%d)-root-cat.txt"
find "." -maxdepth 1 -type f -name 'jsconfig.json' -print -exec echo "==== Content of {} ====" \; -exec cat {} \; >> "exports/$(date +%Y-%m-%d)-root-cat.txt"
find "." -maxdepth 1 -type f -name 'eslint.config.js' -print -exec echo "==== Content of {} ====" \; -exec cat {} \; >> "exports/$(date +%Y-%m-%d)-root-cat.txt"
find "." -maxdepth 1 -type f -name '.prettierrc' -print -exec echo "==== Content of {} ====" \; -exec cat {} \; >> "exports/$(date +%Y-%m-%d)-root-cat.txt"
find "." -maxdepth 1 -type f -name 'LICENSE' -print -exec echo "==== Content of {} ====" \; -exec cat {} \; >> "exports/$(date +%Y-%m-%d)-root-cat.txt"
find "." -maxdepth 1 -type f -name '.prettierrc' -print -exec echo "==== Content of {} ====" \; -exec cat {} \; >> "exports/$(date +%Y-%m-%d)-root-cat.txt"
find "docs" -maxdepth 2 -type f -name '*.md' -print -exec echo "==== Content of {} ====" \; -exec cat {} \; > "exports/$(date +%Y-%m-%d)-DOCS.md"
find "features" -maxdepth 2 -type f -name '*.md' -print -exec echo "==== Content of {} ====" \; -exec cat {} \; > "exports/$(date +%Y-%m-%d)-FEATURES.md"
find "prompts" -maxdepth 2 -type f -name '*.md' -print -exec echo "==== Content of {} ====" \; -exec cat {} \; > "exports/$(date +%Y-%m-%d)-PROMPTS.md"
find "library" -maxdepth 2 -type f -name '*.md' -print -exec echo "==== Content of {} ====" \; -exec cat {} \; > "exports/$(date +%Y-%m-%d)-LIBRARY.md"
if [[ -e "Dockerfile" ]] ; then echo "==== Content of Dockerfile ====" > "exports/$(date +%Y-%m-%d)-docker-cat.txt" ; cat Dockerfile >> "exports/$(date +%Y-%m-%d)-docker-cat.txt" ; fi
if [[ -e "compose.yml" ]] ; then echo "==== Content of compose.yml ====" >> "exports/$(date +%Y-%m-%d)-docker-cat.txt" ; cat compose.yml >> "exports/$(date +%Y-%m-%d)-docker-cat.txt" ; fi
if [[ -e "pom.xml" ]] ; then echo "==== Content of pom.xml ====" > "exports/$(date +%Y-%m-%d)-aws-cat.txt" ; cat pom.xml >> "exports/$(date +%Y-%m-%d)-aws-cat.txt" ; fi
if [[ -e "cdk.json" ]] ; then echo "==== Content of cdk.json ====" >> "exports/$(date +%Y-%m-%d)-aws-cat.txt" ; cat cdk.json >> "exports/$(date +%Y-%m-%d)-aws-cat.txt" ; fi
if [[ -e "aws" ]] ; then find "aws" -type f -name '*.java' -print -exec echo "==== Content of {} ====" \; -exec cat {} \; >> "exports/$(date +%Y-%m-%d)-aws-cat.txt" ; fi
find "src" -type f -name '*.js' -print -exec echo "==== Content of {} ====" \; -exec cat {} \; > "exports/$(date +%Y-%m-%d)-src-cat.txt"
find "tests" -type f -name '*.js' -print -exec echo "==== Content of {} ====" \; -exec cat {} \; > "exports/$(date +%Y-%m-%d)-test-cat.txt"
find ".github" -type f -name '*.yml' -print -exec echo "==== Content of {} ====" \; -exec cat {} \; > "exports/$(date +%Y-%m-%d)-github-workflow-cat.txt"
find "scripts" -type f -name '*.sh' -print -exec echo "==== Content of {} ====" \; -exec cat {} \; > "exports/$(date +%Y-%m-%d)-scripts-cat.txt"
git log --follow -p src/lib/main.js > "exports/$(date +%Y-%m-%d)-main.js-history.txt"
git log --since="12 hours ago" --follow -p src/lib/main.js > "exports/$(date +%Y-%m-%d)-main.js-history-last-12-hours.txt"
