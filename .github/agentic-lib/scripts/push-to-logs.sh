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

BRANCH="${LOG_BRANCH:-agentic-lib-logs}"
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

# Mark the workspace as safe (needed in container jobs where the checkout
# was done by a different user, e.g. Playwright containers)
git config --global --add safe.directory "$(pwd)" 2>/dev/null || true

# Configure git
git config --local user.email 'action@github.com'
git config --local user.name 'GitHub Actions[bot]'

# Save file contents to temp
TMPDIR=$(mktemp -d)
for f in "${FILES[@]}"; do
  cp "$f" "${TMPDIR}/$(basename "$f")"
done

# Remember which branch/ref to return to
ORIGINAL_REF=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "")
if [ "$ORIGINAL_REF" = "HEAD" ]; then
  ORIGINAL_REF=$(git rev-parse HEAD 2>/dev/null || echo "")
fi

# Stash any uncommitted changes so branch switching works cleanly
git stash --include-untracked 2>/dev/null || true

# Fetch the agentic-lib-logs branch (may not exist yet)
REMOTE_EXISTS=""
git fetch origin "${BRANCH}" 2>/dev/null && REMOTE_EXISTS="true" || true

if [ "$REMOTE_EXISTS" = "true" ]; then
  # Check out existing agentic-lib-logs branch
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
    echo "push-to-logs: push failed (attempt $attempt) — fetching latest and retrying"

    # Fetch the latest remote state before rebasing
    git fetch origin "${BRANCH}" 2>/dev/null || true

    # Save our file contents before rebase (they may be lost on conflict)
    for f in "${FILES[@]}"; do
      cp "$f" "${TMPDIR}/ours-$(basename "$f")" 2>/dev/null || true
    done

    git pull --rebase origin "${BRANCH}" || {
      echo "push-to-logs: rebase conflict — resolving state file with merge strategy"

      # For agentic-lib-state.toml conflicts, merge booleans (prefer true) and take max counters
      STATE_FILE="agentic-lib-state.toml"
      if git diff --name-only --diff-filter=U 2>/dev/null | grep -q "$STATE_FILE"; then
        # Get the remote (theirs) version from the rebase base
        git show "REBASE_HEAD:${STATE_FILE}" > "${TMPDIR}/ours-${STATE_FILE}" 2>/dev/null || true
        git checkout --theirs "$STATE_FILE" 2>/dev/null || true

        # Merge: for each boolean in our version that is true, set it true in theirs
        if [ -f "${TMPDIR}/ours-${STATE_FILE}" ]; then
          # Extract true booleans from our version and apply them
          while IFS='=' read -r key val; do
            key=$(echo "$key" | xargs)
            val=$(echo "$val" | xargs)
            if [ "$val" = "true" ]; then
              # Set this key to true in the resolved file (theirs)
              if grep -q "^${key} = " "$STATE_FILE" 2>/dev/null; then
                sed -i "s/^${key} = .*/${key} = true/" "$STATE_FILE" 2>/dev/null || \
                  sed -i'' "s/^${key} = .*/${key} = true/" "$STATE_FILE" 2>/dev/null || true
              fi
            fi
          done < "${TMPDIR}/ours-${STATE_FILE}"
        fi

        git add "$STATE_FILE"
      fi

      # Resolve any other conflicting files by taking ours (our log files are authoritative)
      for f in "${FILES[@]}"; do
        if git diff --name-only --diff-filter=U 2>/dev/null | grep -q "$(basename "$f")"; then
          cp "${TMPDIR}/ours-$(basename "$f")" "$f" 2>/dev/null || true
          git add "$f"
        fi
      done

      # Continue the rebase if there are resolved conflicts
      git rebase --continue 2>/dev/null || {
        echo "push-to-logs: rebase continue failed — aborting"
        git rebase --abort 2>/dev/null || true
      }
    }
    sleep $((attempt * 2))
    if [ "$attempt" -eq "$MAX_RETRIES" ]; then
      echo "::warning::push-to-logs: failed to push after $MAX_RETRIES attempts"
    fi
  done
fi

# Return to original branch/ref
if [ -n "$ORIGINAL_REF" ]; then
  git checkout "$ORIGINAL_REF" 2>/dev/null || git checkout main 2>/dev/null || true
else
  git checkout main 2>/dev/null || true
fi

# Restore stashed changes
git stash pop 2>/dev/null || true

# Clean up
rm -rf "$TMPDIR"
