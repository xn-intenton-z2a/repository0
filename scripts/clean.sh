#!/usr/bin/env bash
./scripts/clear-history-locally.sh
rm -rfv ./dist
rm -rfv ./node_modules
rm -rfv ./package-lock.json
npm install
npm run build
npm link
