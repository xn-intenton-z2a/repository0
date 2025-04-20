#!/usr/bin/env bash
# Purpose: Generate an ~/.npmrc file with the PERSONAL_ACCESS_TOKEN secret.
# Usage: ./scripts/generate-npmrc.sh
rm -f ~/.npmrc
source secrets.env
NPM_AUTH_ORGANISATION='@xn-intenton-z2a'
echo "${NPM_AUTH_ORGANISATION?}:registry=https://npm.pkg.github.com" >> ~/.npmrc
echo "//npm.pkg.github.com/:_authToken=${PERSONAL_ACCESS_TOKEN?}" >> ~/.npmrc
echo "always-auth=true" >> ~/.npmrc
