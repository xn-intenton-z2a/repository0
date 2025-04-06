#!/usr/bin/env node

/**
 * repository0 CLI Tool: A Template for Automated Workflows
 *
 * This main file now delegates all CLI command handling to modularized command handler functions
 * located in the ../commands/cliHandlers.js module. This refactoring improves readability, maintainability,
 * and scalability of the CLI code. For complete functionality, ensure that the new module(s) under src/commands/
 * are present in the repository.
 */

import { fileURLToPath } from "url";
import { main as cliMain, __test } from "../commands/cliHandlers.js";

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  (async function run() {
    await cliMain(process.argv.slice(2));
    process.exit(0);
  })();
}

export { cliMain as main, __test };
