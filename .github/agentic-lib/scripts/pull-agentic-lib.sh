#!/usr/bin/env bash
# pull-agentic-lib.sh — Pull latest agentic-lib content into this repository
#
# Fetches the latest distributed content from the agentic-lib source repo
# (workflows, actions, agents, seeds, scripts) and copies it into this
# repository's .github/ directory.
#
# Usage:
#   .github/agentic-lib/scripts/pull-agentic-lib.sh [options]
#
# Options:
#   --source <path>    Path to agentic-lib repo (default: ../agentic-lib)
#   --reset-seeds      Also reset source files to seed template state
#   --dry-run          Show what would be done without making changes
#   --help             Show this help
#
# This file is part of the Example Suite for agentic-lib
# Licensed under MIT. See LICENSE-MIT

set -euo pipefail

# Defaults
SOURCE=""
RESET_SEEDS=false
DRY_RUN=false
REPO_ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"

usage() {
  head -18 "$0" | tail -13 | sed 's/^# \?//'
  exit 1
}

# Parse args
while [[ $# -gt 0 ]]; do
  case "$1" in
    --source) SOURCE="$2"; shift 2 ;;
    --reset-seeds) RESET_SEEDS=true; shift ;;
    --dry-run) DRY_RUN=true; shift ;;
    --help) usage ;;
    *) echo "Unknown option: $1"; usage ;;
  esac
done

# Find agentic-lib source
if [[ -z "$SOURCE" ]]; then
  # Try common locations
  for candidate in "$REPO_ROOT/../agentic-lib" "$REPO_ROOT/../xn--intenton-z2a/agentic-lib"; do
    if [[ -d "$candidate/src/workflows" ]]; then
      SOURCE="$candidate"
      break
    fi
  done
fi

if [[ -z "$SOURCE" || ! -d "$SOURCE/src/workflows" ]]; then
  echo "ERROR: Cannot find agentic-lib source."
  echo "Use --source <path> to specify the agentic-lib repo location."
  exit 1
fi

SOURCE="$(cd "$SOURCE" && pwd)"
AGENTIC_DIR="$REPO_ROOT/.github/agentic-lib"

echo ""
echo "=== Pull agentic-lib ==="
echo "Source:      $SOURCE"
echo "Target:      $REPO_ROOT"
echo "Reset seeds: $RESET_SEEDS"
echo "Mode:        $(if $DRY_RUN; then echo 'DRY RUN'; else echo 'LIVE'; fi)"
echo ""

CHANGES=0

# Helper: copy a file
copy_file() {
  local src="$1" dst="$2" label="$3"
  if $DRY_RUN; then
    echo "  COPY: $label"
  else
    mkdir -p "$(dirname "$dst")"
    cp "$src" "$dst"
    echo "  COPY: $label"
  fi
  CHANGES=$((CHANGES + 1))
}

# Helper: copy a directory (all files)
copy_dir() {
  local src_dir="$1" dst_dir="$2" label="$3"
  if [[ ! -d "$src_dir" ]]; then
    echo "  SKIP: $label (source dir not found)"
    return
  fi
  find "$src_dir" -type f | while read -r f; do
    local rel="${f#$src_dir/}"
    copy_file "$f" "$dst_dir/$rel" "$label/$rel"
  done
}

# 1. Workflows
echo "--- Workflows ---"
for wf in "$SOURCE"/src/workflows/*.yml; do
  name="$(basename "$wf")"
  copy_file "$wf" "$REPO_ROOT/.github/workflows/$name" "workflows/$name"
done

# 2. Actions
echo ""
echo "--- Actions ---"
for action_dir in "$SOURCE"/src/actions/*/; do
  action_name="$(basename "$action_dir")"
  # Copy action files but skip node_modules
  find "$action_dir" -type f -not -path "*/node_modules/*" | while read -r f; do
    rel="${f#$SOURCE/src/actions/}"
    copy_file "$f" "$AGENTIC_DIR/actions/$rel" "actions/$rel"
  done
done

# 3. Agents
echo ""
echo "--- Agents ---"
for agent in "$SOURCE"/src/agents/*; do
  name="$(basename "$agent")"
  copy_file "$agent" "$AGENTIC_DIR/agents/$name" "agents/$name"
done

# 4. Seeds
echo ""
echo "--- Seeds ---"
for seed in "$SOURCE"/src/seeds/*; do
  name="$(basename "$seed")"
  copy_file "$seed" "$AGENTIC_DIR/seeds/$name" "seeds/$name"
done

# 5. Scripts (only the ones that are distributed)
echo ""
echo "--- Scripts ---"
DISTRIBUTED_SCRIPTS="accept-release.sh activate-schedule.sh clean.sh initialise.sh md-to-html.js update.sh"
for script_name in $DISTRIBUTED_SCRIPTS; do
  src="$SOURCE/src/scripts/$script_name"
  if [[ -f "$src" ]]; then
    copy_file "$src" "$AGENTIC_DIR/scripts/$script_name" "scripts/$script_name"
  fi
done

# 6. Reset seeds (optional)
if $RESET_SEEDS; then
  echo ""
  echo "--- Reset Source Files to Seed State ---"

  SEED_DIR="$SOURCE/src/seeds"

  # Seed mapping: seed-file=target-path (simple key=value pairs)
  SEED_PAIRS="zero-main.js=src/lib/main.js zero-main.test.js=tests/unit/main.test.js zero-MISSION.md=MISSION.md zero-package.json=package.json zero-README.md=README.md"

  for pair in $SEED_PAIRS; do
    seed_file="${pair%%=*}"
    target="${pair#*=}"
    src="$SEED_DIR/$seed_file"
    if [[ -f "$src" ]]; then
      copy_file "$src" "$REPO_ROOT/$target" "SEED: $seed_file → $target"
    else
      echo "  SKIP: $seed_file (not found)"
    fi
  done

  # Remove activity log
  INTENTION_FILE="$REPO_ROOT/intentïon.md"
  if [[ -f "$INTENTION_FILE" ]]; then
    if $DRY_RUN; then
      echo "  REMOVE: intentïon.md"
    else
      rm "$INTENTION_FILE"
      echo "  REMOVE: intentïon.md"
    fi
    CHANGES=$((CHANGES + 1))
  fi

  # Clear features
  FEATURES_DIR="$AGENTIC_DIR/features"
  if [[ -d "$FEATURES_DIR" ]]; then
    feature_count=$(find "$FEATURES_DIR" -type f | wc -l | tr -d ' ')
    if [[ "$feature_count" -gt 0 ]]; then
      if $DRY_RUN; then
        echo "  CLEAR: features/ ($feature_count files)"
      else
        find "$FEATURES_DIR" -type f -delete
        echo "  CLEAR: features/ ($feature_count files)"
      fi
      CHANGES=$((CHANGES + 1))
    fi
  fi
fi

echo ""
echo "$CHANGES change(s)$(if $DRY_RUN; then echo ' (dry run)'; fi)"

if ! $DRY_RUN && [[ $CHANGES -gt 0 ]]; then
  echo ""
  echo "Next steps:"
  if $RESET_SEEDS; then
    echo "  cd $REPO_ROOT && npm install"
  fi
  echo "  cd $REPO_ROOT/.github/agentic-lib/actions/agentic-step && npm ci"
  echo "  npm test"
fi
