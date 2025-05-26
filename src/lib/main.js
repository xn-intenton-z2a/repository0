#!/usr/bin/env node
// src/lib/main.js

import http from "http";
import { fileURLToPath } from "url";
import { z } from "zod";

// Zod schema for allowed commands
const commandSchema = z.enum(["start", "diagnostics", "serve"]);

/**
 * Main entry point for CLI handling.
 * @param {string[]} args - Command-line arguments excluding node and script path.
 * @returns {http.Server|void} The HTTP server instance for serve command.
 */
export async function main(args = []) {
  const cmd = args[0] ?? "start";
  let command;
  try {
    command = commandSchema.parse(cmd);
  } catch (e) {
    const errMsg = `Unrecognized command: ${cmd}`;
    console.error(errMsg);
    process.exitCode = 1;
    throw new Error(errMsg);
  }

  const handlerArgs = args.slice(1);
  switch (command) {
    case "start":
      start(handlerArgs);
      return;
    case "diagnostics":
      diagnostics();
      return;
    case "serve":
      return serve();
    default:
      // Should not reach here
      return;
  }
}

/**
 * Start handler: logs provided arguments.
 * @param {string[]} args
 */
export function start(args) {
  console.log(`Run with: ${JSON.stringify(args)}`);
}

/**
 * Diagnostics handler: prints Node version, platform, and memory usage.
 */
export function diagnostics() {
  const mem = process.memoryUsage();
  console.log(
    `Node: ${process.version}, Platform: ${process.platform}, MemoryUsage: ${JSON.stringify(
      mem
    )}`
  );
}

/**
 * Serve handler: launches HTTP server on port 3000 with /health endpoint.
 * @returns {http.Server}
 */
export function serve() {
  const server = http.createServer((req, res) => {
    if (req.method === "GET" && req.url === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok" }));
    } else {
      res.writeHead(404);
      res.end();
    }
  });

  server.listen(3000);

  const shutdown = () => {
    server.close(() => process.exit(0));
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  return server;
}

// CLI invocation when run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  // slice off "node" and script path
  main(process.argv.slice(2)).catch(() => {
    // error already logged
  });
}
