#!/usr/bin/env bash
# SPDX-License-Identifier: MIT
# Copyright (C) 2025-2026 Polycode Limited
# push-to-logs.sh — Push log/screenshot files to the agentic-lib-logs orphan branch.
#
# Usage: bash .github/agentic-lib/scripts/push-to-logs.sh [file ...]
#   e.g. bash .github/agentic-lib/scripts/push-to-logs.sh "intentïon.md" SCREENSHOT_INDEX.png
#
# Creates the agentic-lib-logs branch if it doesn't exist. Uses rebase/retry for
# concurrent pushes (same strategy as commit-if-changed).

set -euo pipefail

BRANCH="agentic-lib-logs"
MAX_RETRIES=3

# Collect files that actually exist in the workspace
FILES=()
for arg in "$@"; do
  if [ -f "$arg" ]; then
    FILES+=("$arg")
  fi
done

if [ ${#FILES[@]} -eq 0 ]; then
  echo "push-to-logs: no files to push"
  exit 0
fi

echo "push-to-logs: pushing ${FILES[*]} to ${BRANCH}"

# Configure git
git config --local user.email 'action@github.com'
git config --local user.name 'GitHub Actions[bot]'

# Save file contents to temp
TMPDIR=$(mktemp -d)
for f in "${FILES[@]}"; do
  cp "$f" "${TMPDIR}/$(basename "$f")"
done

# Fetch the agentic-lib-logs branch (may not exist yet)
REMOTE_EXISTS=""
git fetch origin "${BRANCH}" 2>/dev/null && REMOTE_EXISTS="true" || true

if [ "$REMOTE_EXISTS" = "true" ]; then
  # Check out existing agentic-lib-logs branch into a detached worktree-like state
  git checkout "origin/${BRANCH}" -- . 2>/dev/null || true
  git checkout -B "${BRANCH}" "origin/${BRANCH}"
else
  # Create orphan branch
  git checkout --orphan "${BRANCH}"
  git rm -rf . 2>/dev/null || true
fi

# Copy files in
for f in "${FILES[@]}"; do
  cp "${TMPDIR}/$(basename "$f")" "$f"
  git add "$f"
done

# Commit if changed
if git diff --cached --quiet 2>/dev/null; then
  echo "push-to-logs: no changes to commit"
else
  git commit -m "logs: update ${FILES[*]} [skip ci]"

  for attempt in $(seq 1 $MAX_RETRIES); do
    git push origin "${BRANCH}" && break
    echo "push-to-logs: push failed (attempt $attempt) — pulling and retrying"
    git pull --rebase origin "${BRANCH}" || {
      echo "push-to-logs: rebase conflict — aborting and retrying"
      git rebase --abort 2>/dev/null || true
    }
    sleep $((attempt * 2))
    if [ "$attempt" -eq "$MAX_RETRIES" ]; then
      echo "::warning::push-to-logs: failed to push after $MAX_RETRIES attempts"
    fi
  done
fi

# Return to previous branch
git checkout - 2>/dev/null || git checkout main 2>/dev/null || true

# Clean up
rm -rf "$TMPDIR"
