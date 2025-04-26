#!/usr/bin/env bash
# scripts/accept-release.sh
# Usage: ./scripts/accept-release.sh
#
# This file is part of the Example Suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT

schedule=$(grep '^schedule:' .github/agents/agentic-lib.yml | awk '{print $2}' | sed 's/schedule-//')
if [ -z "${schedule}" ]; then
  echo "No schedule found in .github/agents/agentic-lib.yml, looking for line of the form 'schedule: schedule-<number>', using schedule-1"
  schedule=1
fi
echo "Workflow schedule: schedule-${schedule?}"
./scripts/activate-schedule.sh "${schedule?}"
git add .github/agents/*
git add .github/workflows/*
git add scripts/*
git add public/*
git add AGENT-*
git commit -m 'Update from agentic-lib'
git pull
git push
