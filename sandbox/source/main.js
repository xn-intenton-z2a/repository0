#!/usr/bin/env node
import { main } from '../../src/lib/main.js';

// Collect CLI arguments and invoke main
const args = process.argv.slice(2);
main(args);
