#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";
import { AgenticLib } from "./agentic-lib.js";

export function main(args) {
  const agentic = new AgenticLib();
  console.log("Agentic-lib initialized");
  console.log(`Run with: ${JSON.stringify(args)}`);
  return agentic;
}

// Export the main class for library usage
export { AgenticLib } from "./agentic-lib.js";

// CLI entry point
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
