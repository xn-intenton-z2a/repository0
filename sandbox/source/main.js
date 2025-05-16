#!/usr/bin/env node
// sandbox/source/main.js

import { main } from "../../src/lib/main.js";

// Execute CLI with arguments
const args = process.argv.slice(2);
main(args);
