#!/usr/bin/env bash
# scripts/deactivate-schedule.sh
#
# Usage: ./scripts/deactivate-schedule.sh <schedule-number>
# Example: ./scripts/deactivate-schedule.sh 1
# (deactivates schedule-1 by commenting out lines ending with "# schedule-1".)
#
# This script processes all .yml files in the .github/workflows directory.
# It looks for lines with cron schedule definitions ending with a comment like "# schedule-N"
# and, if N matches the given parameter, adds a leading "#" (if not already present) to comment out the line.
#
# Tested on macOS (zsh).

set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <schedule-number>"
  exit 1
fi

active="$1"
workflow_dir=".github/workflows"

if [ ! -d "$workflow_dir" ]; then
  echo "Error: Directory $workflow_dir not found."
  exit 1
fi

echo "Deactivating schedule-$active in all YAML workflow files in $workflow_dir..."

for file in "$workflow_dir"/*.yml; do
  #echo "Processing $file..."
  # This sed command matches lines that start with whitespace, then a dash,
  # and ending with "# schedule-<active>".
  # It prepends a '#' to comment out that line.
  sed -i.bak -E "s/^([[:space:]]*)(- cron:.*# schedule-$active)/\1#\2/" "$file"
  rm -f "$file.bak"
done

echo "Schedule-$active deactivated in workflows."
