#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";
import http from "http";
import { readFile } from "fs/promises";
import { createRequire } from "module";

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
`Usage: node src/lib/main.js [--open-prs | --open-prs-consolidated | --mission | --diagnostics | --serve [port] | --help]
  --open-prs               Automate opening separate PRs for issues #2188 and #2193
  --open-prs-consolidated  Automate opening a consolidated PR for HTTP server and diagnostics
  --mission                Print project mission and exit
  --diagnostics            Print runtime diagnostics JSON and exit
  --serve [port]           Start HTTP server on [port] (default 8080)
  --help                   Show this help message and exit`
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
 * Parses command-line arguments to determine if consolidated PR mode is requested.
 * @param {string[]} args
 * @returns {boolean}
 */
export function parseConsolidatedPrArg(args) {
  return args[0] === "--open-prs-consolidated";
}

/**
 * Opens separate pull requests via GitHub CLI for each issue.
 * @returns {Promise<void>}
 */
export async function openPrs() {
  const require = createRequire(import.meta.url);
  const { exec } = require('child_process');
  const issues = [2188, 2193];
  for (const issue of issues) {
    await new Promise((resolve, reject) => {
      exec('gh auth status', (error, stdout, stderr) => {
        if (error) return reject(error);
        if (stderr) console.error(stderr);
        exec(`git checkout -b pr-${issue}`, (error2, stdout2, stderr2) => {
          if (error2) return reject(error2);
          if (stderr2) console.error(stderr2);
          const cmd = `gh pr create --title "Implement feature for issue #${issue}" --body "Resolves issue #${issue}"`;
          exec(cmd, (error3, stdout3, stderr3) => {
            if (error3) return reject(error3);
            if (stderr3) console.error(stderr3);
            console.log(`Opened PR for issue #${issue}`);
            resolve();
          });
        });
      });
    });
  }
}

/**
 * Opens a single consolidated pull request via GitHub CLI.
 * @returns {Promise<void>}
 */
export async function openConsolidatedPr() {
  const require = createRequire(import.meta.url);
  const { exec } = require('child_process');
  await new Promise((res, rej) => exec('gh auth status', err => err ? rej(err) : res()));
  await new Promise((res, rej) => exec('git checkout -b open-prs-http-diagnostics', err => err ? rej(err) : res()));
  await new Promise((res, rej) => exec(
    'gh pr create --title "Merge HTTP server and diagnostics features" --body "- resolves #2188\n- resolves #2193"',
    (err, stdout, stderr) => err ? rej(err) : (stderr ? console.error(stderr) : console.log('Opened consolidated PR for HTTP server and diagnostics'), res())
  ));
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
  // Consolidated PR opener mode
  if (parseConsolidatedPrArg(args)) {
    await openConsolidatedPr();
    process.exit(0);
  }
  // Separate PR opener mode
  if (parseOpenPrsArg(args)) {
    await openPrs();
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