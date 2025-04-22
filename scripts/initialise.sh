#!/usr/bin/env bash
# scripts/initialise.sh
# Usage: ./scripts/initialise.sh <intention>
# Example: ./scripts/initialise.sh (randomly selects an intention)
# Example: ./scripts/initialise.sh "repository0-plot-code-lib"
# Example: ./scripts/initialise.sh "owl-builder"
#
# This file is part of the Example Suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT

defaultIntention=$(find seeds -maxdepth 1 -type f -name 'MISSION-*.md' | shuf -n 1 | sed -E 's/.*MISSION-(.*)\.md/\1/')

intention="${1-$defaultIntention}"

mkdir -p prompts
mkdir -p features
cp -fv "seeds/MISSION-${intention?}.md" MISSION.md
cp -fv "seeds/zero-README.md"  README.md
cp -fv "seeds/zero-package.json"  package.json
cp -fv "seeds/zero-main.js" src/lib/main.js
cp -fv "seeds/zero-main.test.js" tests/unit/main.test.js
rm -f docs/*.md
rm -f SOURCES.md
rm -f library/*.md
rm -f library/*.txt
rm -f features/*.md
rm -f prompts/*.md
cp -fv seeds/features/*.md features/
#rm -rfv node_modules
#rm -rfv package-lock.json
#npm install
#npm run build
#npm link

# Update the first line of CONTRIBUTING.md with the intention so it works on macOS or Linux
sed -i.bak "1s/.*/# ${intention?}/" CONTRIBUTING.md
rm -f CONTRIBUTING.md.bak
