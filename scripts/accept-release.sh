#!/usr/bin/env bash
# scripts/accept-release.sh
# Usage: ./scripts/accept-release.sh
#
# This file is part of the Example Suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT

git add
git commit -m 'Update from agentic-lib'
git pull
git push
