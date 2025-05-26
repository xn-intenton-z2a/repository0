#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";
import http from "http";

/**
 * Main entrypoint for CLI and programmatic usage.
 * @param {string[]} args Command-line arguments
 * @returns {import("http").Server|undefined} HTTP server instance in serve mode, otherwise undefined
 */
export function main(args) {
  const hasDiagnostics = args.includes("--diagnostics");
  const hasServe = args.includes("--serve");
  const remainingArgs = args.filter(
    (arg) => arg !== "--diagnostics" && arg !== "--serve"
  );

  if (hasServe) {
    const server = http.createServer((req, res) => {
      if (req.method === "GET" && req.url === "/") {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        res.end("Hello World");
      } else {
        res.statusCode = 404;
        res.end();
      }
    });
    server.listen(3000);
    return server;
  }

  console.log("Hello World");

  if (hasDiagnostics) {
    console.log(`Node version: ${process.version}`);
    console.log(`Platform: ${process.platform}`);
    console.log(`Args: ${JSON.stringify(remainingArgs)}`);
  }
}

// If invoked directly from the command line, run with process.argv
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
