#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/main.js

import { fileURLToPath } from "url";
import { createServer } from "http";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { URL } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Version from package.json
function getVersion() {
  try {
    const packagePath = join(__dirname, "../../package.json");
    const packageJson = JSON.parse(readFileSync(packagePath, "utf8"));
    return packageJson.version || "unknown";
  } catch {
    return "unknown";
  }
}

// Parse command line arguments
function parseArgs(args = []) {
  const parsed = {
    commands: [],
    flags: {},
    options: {},
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const nextArg = args[i + 1];
      
      // Check if next arg is a value or another flag/command
      if (nextArg && !nextArg.startsWith("-") && !isCommand(nextArg)) {
        parsed.options[key] = nextArg;
        i++; // Skip next arg since we consumed it
      } else {
        parsed.flags[key] = true;
      }
    } else if (arg.startsWith("-")) {
      const flags = arg.slice(1);
      for (const flag of flags) {
        parsed.flags[flag] = true;
      }
    } else {
      parsed.commands.push(arg);
    }
  }
  
  return parsed;
}

function isCommand(arg) {
  const knownCommands = ["help", "version", "serve", "start", "init"];
  return knownCommands.includes(arg);
}

// Display help text
function showHelp() {
  const help = `
@xn-intenton-z2a/repo v${getVersion()}

A JavaScript library that is immediately useful and available to run.

USAGE:
  npx @xn-intenton-z2a/repo [COMMAND] [OPTIONS]

COMMANDS:
  help                    Show this help message
  version                 Show version information
  serve                   Start development server (default port: 3000)
  start                   Start the main application

OPTIONS:
  --port <PORT>          Port number for development server (default: 3000)
  --host <HOST>          Host address for development server (default: localhost)
  --serve                Start development server (shorthand)
  -h, --help             Show help
  -v, --version          Show version
  -p <PORT>              Port number (shorthand)

EXAMPLES:
  npx @xn-intenton-z2a/repo help
  npx @xn-intenton-z2a/repo version
  npx @xn-intenton-z2a/repo serve --port 8080
  npx @xn-intenton-z2a/repo --serve -p 3001
  npx @xn-intenton-z2a/repo start

For more information, visit: https://github.com/xn-intenton-z2a/repository0
`;
  console.log(help.trim());
}

// Display version
function showVersion() {
  console.log(`@xn-intenton-z2a/repo v${getVersion()}`);
}

// Start development server
async function startDevelopmentServer(options = {}) {
  const port = options.port || options.p || 3000;
  const host = options.host || "localhost";
  
  const server = createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const path = url.pathname;
    
    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    
    if (req.method === "OPTIONS") {
      res.writeHead(200);
      res.end();
      return;
    }
    
    // Simple routing
    if (path === "/" || path === "/index.html") {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(getIndexPage());
    } else if (path === "/api/status") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ 
        status: "ok", 
        version: getVersion(),
        timestamp: new Date().toISOString()
      }));
    } else if (path === "/api/info") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        name: "@xn-intenton-z2a/repo",
        version: getVersion(),
        description: "A JavaScript library that is immediately useful and available to run",
        endpoints: ["/", "/api/status", "/api/info"]
      }));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Not found", path }));
    }
  });
  
  return new Promise((resolve, reject) => {
    server.listen(port, host, (err) => {
      if (err) {
        reject(err);
      } else {
        console.log(`🚀 Development server running on http://${host}:${port}`);
        console.log(`📊 Status endpoint: http://${host}:${port}/api/status`);
        console.log(`📋 Info endpoint: http://${host}:${port}/api/info`);
        console.log(`\n💡 Press Ctrl+C to stop the server`);
        resolve(server);
      }
    });
  });
}

// Generate index page
function getIndexPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@xn-intenton-z2a/repo Development Server</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            line-height: 1.6;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 3rem;
        }
        .version {
            background: #f0f0f0;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            display: inline-block;
            font-family: monospace;
            color: #666;
        }
        .endpoints {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 1.5rem;
            margin: 2rem 0;
        }
        .endpoint {
            margin: 1rem 0;
            padding: 0.5rem;
            background: white;
            border-radius: 4px;
            border: 1px solid #dee2e6;
        }
        .endpoint-url {
            font-family: monospace;
            color: #0366d6;
            font-weight: bold;
        }
        .status-indicator {
            color: #28a745;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            margin-top: 3rem;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>@xn-intenton-z2a/repo</h1>
        <div class="version">v${getVersion()}</div>
        <p>Development Server <span class="status-indicator">●</span> Running</p>
    </div>
    
    <div class="endpoints">
        <h2>Available Endpoints</h2>
        <div class="endpoint">
            <div class="endpoint-url">GET /api/status</div>
            <div>Server status and health check</div>
        </div>
        <div class="endpoint">
            <div class="endpoint-url">GET /api/info</div>
            <div>Package information and available endpoints</div>
        </div>
    </div>
    
    <div class="footer">
        <p>This is a development server for rapid prototyping and testing.</p>
        <p>Press Ctrl+C in your terminal to stop the server.</p>
    </div>
    
    <script>
        // Auto-refresh status
        async function updateStatus() {
            try {
                const response = await fetch('/api/status');
                const data = await response.json();
                console.log('Server status:', data);
            } catch (err) {
                console.warn('Failed to fetch status:', err);
            }
        }
        
        // Update status every 30 seconds
        setInterval(updateStatus, 30000);
        updateStatus();
    </script>
</body>
</html>`;
}

// Main application function
export function main(args = []) {
  const parsed = parseArgs(args);
  const { commands, flags, options } = parsed;
  
  // Handle version flags
  if (flags.version || flags.v) {
    showVersion();
    return;
  }
  
  // Handle help flags
  if (flags.help || flags.h || commands.includes("help")) {
    showHelp();
    return;
  }
  
  // Handle version command
  if (commands.includes("version")) {
    showVersion();
    return;
  }
  
  // Handle serve command or flag
  if (commands.includes("serve") || flags.serve) {
    startDevelopmentServer(options).catch(err => {
      console.error("❌ Failed to start development server:", err.message);
      process.exit(1);
    });
    return;
  }
  
  // Handle start command
  if (commands.includes("start")) {
    console.log(`🚀 Starting @xn-intenton-z2a/repo v${getVersion()}`);
    console.log("✨ Application is running!");
    console.log("💡 Use --help to see available commands");
    return;
  }
  
  // Default behavior - show help if no valid commands
  if (commands.length === 0 && Object.keys(flags).length === 0) {
    showHelp();
    return;
  }
  
  // Unknown command
  if (commands.length > 0) {
    console.error(`❌ Unknown command: ${commands[0]}`);
    console.log("💡 Use --help to see available commands");
    process.exit(1);
  }
}

// CLI entry point
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
