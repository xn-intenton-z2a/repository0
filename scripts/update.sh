#!/usr/bin/env bash
rm -f package-lock.json
rm -f node-modules
npm install
npm run update-to-minor
npm update
npm upgrade
npm install
npm run build
npm link
