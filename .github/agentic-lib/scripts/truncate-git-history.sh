#!/usr/bin/env bash
# scripts/truncate-git-history.sh
# Purpose: Truncate the history so that future revisions don't follow a past trend.
# Usage: ./scripts/truncate-git-history.sh
#
# This file is part of the Example Suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT
#
DANGER git checkout --orphan temp-branch
DANGER git add --verbose --all
DANGER git commit --verbose --message "Truncate the history"
DANGER git push --verbose --force origin temp-branch:main
DANGER git checkout main
DANGER git pull --verbose
DANGER git branch --verbose --delete temp-branch
DANGER git pull --verbose
DANGER git push --verbose origin main
DANGER git log
DANGER git status
