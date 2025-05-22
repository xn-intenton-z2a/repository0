#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";
import http from "http";
import { readFile } from "fs/promises";
import { exec } from "child_process";

/**
 * Checks if a specific flag is present in args.
 * @param {string[]} args
 * @param {string} flag
 * @returns {boolean}
 */
function hasFlag(args, flag) {
  return args.includes(flag);
}

/**
 * Prints usage information.
 */
function printUsage() {
  console.log(
`Usage: node src/lib/main.js [--open-prs | --mission | --diagnostics | --serve [port] | --help]
  --open-prs     Automate opening PR for HTTP server and diagnostics
  --mission      Print project mission and exit
  --diagnostics  Print runtime diagnostics JSON and exit
  --serve [port] Start HTTP server on [port] (default 8080)
  --help         Show this help message and exit`
  );
}

/**
 * Parses command-line arguments to determine if open-prs mode is requested.
 * @param {string[]} args
 * @returns {boolean}
 */
export function parseOpenPrsArg(args) {
  return args[0] === "--open-prs";
}

/**
 * Opens a pull request via GitHub CLI.
 * @returns {Promise<void>}
 */
export function openPrs() {
  return new Promise((resolve, reject) => {
    const steps = [
      'gh auth status',
      'git checkout -b open-prs-http-diagnostics',
      'gh pr create --title "Merge HTTP server and diagnostics features" --body "- resolves #2188\n- resolves #2193"'
    ];
    let idx = 0;
    function next(err) {
      if (err) return reject(err);
      if (idx >= steps.length) return resolve();
      const cmd = steps[idx++];
      exec(cmd, (error, stdout, stderr) => {
        if (error) return reject(error);
        if (stderr) console.error(stderr);
        next();
      });
    }
    next();
  });
}

/**
 * Parses command-line arguments to determine if mission mode is requested.
 * @param {string[]} args
 * @returns {boolean}
 */
export function parseMissionArg(args) {
  return args[0] === "--mission";
}

/**
 * Reads the project mission from MISSION.md.
 * @returns {Promise<string>}
 */
export async function readMission() {
  const data = await readFile(
    new URL("../../MISSION.md", import.meta.url),
    "utf8"
  );
  return data;
}

/**
 * Parses command-line arguments to determine if diagnostics mode is requested.
 * @param {string[]} args
 * @returns {boolean}
 */
export function parseDiagnosticsArg(args) {
  return args[0] === "--diagnostics";
}

/**
 * Collects runtime diagnostics information.
 * @returns {{
 *   version: string;
 *   uptime: number;
 *   memoryUsage: { rss: number; heapTotal: number; heapUsed: number };
 *   platform: string;
 *   arch: string;
 * }}
 */
export function collectDiagnostics() {
  const memory = process.memoryUsage();
  return {
    version: process.version,
    uptime: process.uptime(),
    memoryUsage: {
      rss: memory.rss,
      heapTotal: memory.heapTotal,
      heapUsed: memory.heapUsed
    },
    platform: process.platform,
    arch: process.arch
  };
}

/**
 * Parses command-line arguments to determine server mode and port.
 * @param {string[]} args
 * @returns {{serve: boolean, port: number}}
 */
export function parseServeArgs(args) {
  let serve = false;
  let port = 8080;
  if (args[0] === "--serve") {
    serve = true;
    if (args[1] && !args[1].startsWith("-")) {
      const p = Number(args[1]);
      if (!Number.isNaN(p)) {
        port = p;
      }
    }
  }
  return { serve, port };
}

/**
 * Starts an HTTP server on the given port that responds to GET / with "Hello World!".
 * @param {number} portArg
 * @returns {Promise<import('http').Server>}
 */
export async function startServer(portArg) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      if (req.method === "GET" && req.url === "/") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Hello World!");
      } else {
        res.writeHead(404);
        res.end();
      }
    });

    server.on("error", reject);

    server.listen(portArg, () => {
      const address = server.address();
      const actualPort =
        typeof address === "object" && address ? address.port : address;
      console.log(`Server listening on port ${actualPort}`);
      resolve(server);
    });

    process.on("SIGINT", () => {
      server.close();
    });
  });
}

/**
 * Main entry point.
 * @param {string[]} args
 */
export async function main(args) {
  // Help flag
  if (hasFlag(args, "--help")) {
    printUsage();
    process.exit(0);
  }
  // Conflict: mission and diagnostics
  if (hasFlag(args, "--mission") && hasFlag(args, "--diagnostics")) {
    console.error("Error: --mission and --diagnostics cannot be used together");
    process.exit(1);
  }
  // PR opener mode
  if (parseOpenPrsArg(args)) {
    await openPrs();
    console.log("Pull request opened: Check your GitHub repository");
    process.exit(0);
  }

  if (parseMissionArg(args)) {
    const mission = await readMission();
    console.log(mission);
    process.exit(0);
  }

  if (parseDiagnosticsArg(args)) {
    const diag = collectDiagnostics();
    console.log(JSON.stringify(diag, null, 2));
    process.exit(0);
  }

  const { serve, port } = parseServeArgs(args);
  if (serve) {
    await startServer(port);
  } else {
    console.log(`Run with: ${JSON.stringify(args)}`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}