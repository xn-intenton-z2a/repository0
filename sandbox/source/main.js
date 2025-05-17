#!/usr/bin/env node
import { fileURLToPath } from "url";
import { main } from "../../src/lib/main.js";

// Execute main when run as a script
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
