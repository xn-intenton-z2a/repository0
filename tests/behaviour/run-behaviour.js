// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// Simple behaviour runner using jsdom to validate generated docs without Playwright.
import { readFile } from 'fs/promises';
import { JSDOM } from 'jsdom';

async function main() {
  try {
    const html = await readFile(new URL('../../docs/index.html', import.meta.url), 'utf8');
    const dom = new JSDOM(html);
    const { document } = dom.window;

    const name = document.getElementById('lib-name');
    const version = document.getElementById('lib-version');
    const output = document.getElementById('demo-output');

    if (!name || !version || !output) {
      console.error('Required elements not found in docs/index.html');
      process.exit(2);
    }

    // Basic visibility/content checks
    if (!name.textContent || !version.textContent) {
      console.error('Name or version appears empty');
      process.exit(3);
    }

    console.log('Behaviour check passed:', {
      name: name.textContent.trim(),
      version: version.textContent.trim(),
    });
    process.exit(0);
  } catch (err) {
    console.error('Behaviour runner failed:', err);
    process.exit(1);
  }
}

main();
