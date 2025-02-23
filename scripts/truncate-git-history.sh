#!/usr/bin/env bash
# scripts/truncate-git-history.sh
# Purpose: Truncate the history so that future revisions don't follow a past trend.
# Usage: ./scripts/truncate-git-history.sh
#
# This file is part of the Example Suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT
#
git checkout --orphan temp-branch
git add --verbose --all
git commit --verbose --message "Prepare release"
git push --verbose --force origin temp-branch:main
git checkout main
git pull --verbose
git branch --verbose --delete temp-branch
git pull --verbose
git push --verbose origin main
git log
git status
