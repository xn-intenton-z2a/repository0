#!/usr/bin/env node
import { main } from "../../src/lib/main.js";

// Retrieve command line arguments and invoke the main function
const args = process.argv.slice(2);
main(args);
