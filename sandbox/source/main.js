#!/usr/bin/env node
import { main } from "../../src/lib/main.js";

// Extract CLI arguments (excluding node and script path)
const args = process.argv.slice(2);
// Execute main functionality
main(args);
