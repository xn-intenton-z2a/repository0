#!/usr/bin/env node
// sandbox/source/main.js
// Entry point for CLI that invokes the main library function
import { main } from "@src/lib/main.js";

// Collect command-line arguments (excluding `node` and script path)
const args = process.argv.slice(2);
main(args);
