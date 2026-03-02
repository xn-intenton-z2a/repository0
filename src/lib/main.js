#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/main.js

import { fileURLToPath } from "url";
import { createServer } from "http";
import { AgenticLib } from "./agentic-lib.js";

/**
 * Parse command line arguments into structured options
 */
function parseArgs(args) {
  const options = {
    help: false,
    serve: false,
    port: 3000,
    host: "localhost",
    verbose: false,
    command: null,
    args: [],
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case "--help":
      case "-h":
        options.help = true;
        break;
      case "--serve":
      case "-s":
        options.serve = true;
        break;
      case "--port":
      case "-p":
        if (i + 1 < args.length) {
          options.port = parseInt(args[++i], 10);
          if (isNaN(options.port) || options.port < 1 || options.port > 65535) {
            throw new Error("Port must be a number between 1 and 65535");
          }
        } else {
          throw new Error("--port requires a value");
        }
        break;
      case "--host":
        if (i + 1 < args.length) {
          options.host = args[++i];
        } else {
          throw new Error("--host requires a value");
        }
        break;
      case "--verbose":
      case "-v":
        options.verbose = true;
        break;
      default:
        if (!options.command && !arg.startsWith("-")) {
          options.command = arg;
        } else if (options.command) {
          options.args.push(arg);
        } else {
          throw new Error(`Unknown option: ${arg}`);
        }
        break;
    }
  }

  return options;
}

/**
 * Display help information
 */
function showHelp() {
  console.log(`
Agentic Library CLI - JavaScript library for agentic workflow automation

USAGE:
  npx @xn-intenton-z2a/repo [OPTIONS] [COMMAND] [ARGS...]

OPTIONS:
  -h, --help         Show this help message
  -s, --serve        Start HTTP server mode
  -p, --port <port>  Server port (default: 3000)
      --host <host>  Server host (default: localhost)
  -v, --verbose      Enable verbose output

COMMANDS:
  init               Initialize agentic workflows for current repository
  status             Show status of active workflows
  create <type>      Create new workflow of specified type
  send <message>     Send message through agentic communication system
  list               List available workflow types

EXAMPLES:
  npx @xn-intenton-z2a/repo --help
  npx @xn-intenton-z2a/repo init
  npx @xn-intenton-z2a/repo --serve --port 8080
  npx @xn-intenton-z2a/repo status
  npx @xn-intenton-z2a/repo create fix-code
  npx @xn-intenton-z2a/repo send "Ready for review"

SERVER MODE:
  When using --serve, the CLI starts an HTTP server that exposes REST API endpoints
  for managing agentic workflows:
  
  GET  /status          - Get current workflow status
  GET  /workflows       - List active workflows  
  POST /workflows       - Create new workflow
  POST /messages        - Send communication message
  GET  /health          - Health check endpoint
`);
}

/**
 * Start HTTP server with REST API endpoints
 */
async function startServer(options, agenticLib) {
  const server = createServer(async (req, res) => {
    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    
    if (req.method === "OPTIONS") {
      res.writeHead(200);
      res.end();
      return;
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const path = url.pathname;
    
    try {
      let response = {};
      let statusCode = 200;

      if (req.method === "GET" && path === "/health") {
        response = { status: "healthy", timestamp: new Date().toISOString() };
      } else if (req.method === "GET" && path === "/status") {
        response = {
          status: "running",
          activeWorkflows: agenticLib.orchestrator?.activeWorkflows?.size || 0,
          uptime: process.uptime(),
          timestamp: new Date().toISOString(),
        };
      } else if (req.method === "GET" && path === "/workflows") {
        const workflows = Array.from(agenticLib.orchestrator?.activeWorkflows?.entries() || []).map(([id, workflow]) => ({
          id,
          type: workflow.type,
          status: workflow.status,
          createdAt: workflow.createdAt,
          lastUpdate: workflow.lastUpdate,
        }));
        response = { workflows };
      } else if (req.method === "POST" && path === "/workflows") {
        const body = await getRequestBody(req);
        const config = JSON.parse(body);
        const workflow = await agenticLib.createWorkflow(config);
        response = { workflow };
        statusCode = 201;
      } else if (req.method === "POST" && path === "/messages") {
        const body = await getRequestBody(req);
        const { message, channel, ...options } = JSON.parse(body);
        await agenticLib.communication.sendMessage(message, channel, options);
        response = { success: true, timestamp: new Date().toISOString() };
        statusCode = 201;
      } else {
        statusCode = 404;
        response = { error: "Not Found", path };
      }

      res.writeHead(statusCode, { "Content-Type": "application/json" });
      res.end(JSON.stringify(response, null, 2));
    } catch (error) {
      if (options.verbose) {
        console.error("Server error:", error);
      }
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
    }
  });

  return new Promise((resolve, reject) => {
    server.listen(options.port, options.host, (err) => {
      if (err) {
        reject(err);
      } else {
        console.log(`🚀 Agentic server running at http://${options.host}:${options.port}`);
        console.log(`📊 Status: http://${options.host}:${options.port}/status`);
        console.log(`💾 Health: http://${options.host}:${options.port}/health`);
        resolve(server);
      }
    });
  });
}

/**
 * Helper function to read request body
 */
function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      resolve(body);
    });
    req.on("error", reject);
  });
}

/**
 * Execute CLI commands
 */
async function executeCommand(command, args, options, agenticLib) {
  switch (command) {
    case "init":
      console.log("🔧 Initializing agentic workflows...");
      await agenticLib.initialize();
      console.log("✅ Agentic workflows initialized successfully");
      break;

    case "status":
      console.log("📊 Workflow Status:");
      console.log(`Active workflows: ${agenticLib.orchestrator?.activeWorkflows?.size || 0}`);
      console.log(`Communication channels: ${agenticLib.communication?.channels?.size || 0}`);
      
      if (agenticLib.orchestrator?.activeWorkflows?.size > 0) {
        console.log("\n🔄 Active Workflows:");
        for (const [id, workflow] of agenticLib.orchestrator.activeWorkflows.entries()) {
          console.log(`  • ${id}: ${workflow.type} (${workflow.status})`);
        }
      }
      break;

    case "create":
      if (args.length === 0) {
        throw new Error("create command requires a workflow type");
      }
      const workflowType = args[0];
      console.log(`🔨 Creating ${workflowType} workflow...`);
      
      const workflow = await agenticLib.createWorkflow({
        type: workflowType,
        ...options.verbose && { verbose: true },
      });
      
      console.log(`✅ Created workflow: ${workflow.id}`);
      break;

    case "send":
      if (args.length === 0) {
        throw new Error("send command requires a message");
      }
      const message = args.join(" ");
      console.log(`📤 Sending message: "${message}"`);
      
      await agenticLib.communication.sendMessage(message, "cli", {
        sender: "cli-user",
        type: "info",
      });
      
      console.log("✅ Message sent successfully");
      break;

    case "list":
      console.log("📋 Available Workflow Types:");
      const workflowTypes = Array.from(agenticLib.orchestrator?.workflowRegistry?.keys() || []);
      
      if (workflowTypes.length > 0) {
        workflowTypes.forEach((type) => {
          console.log(`  • ${type}`);
        });
      } else {
        console.log("  No workflow types registered. Use 'init' to set up defaults.");
      }
      break;

    default:
      throw new Error(`Unknown command: ${command}. Use --help for available commands.`);
  }
}

/**
 * Main CLI entry point
 */
export async function main(args = []) {
  try {
    const options = parseArgs(args);

    if (options.help) {
      showHelp();
      return;
    }

    // Initialize the agentic library
    const agenticLib = new AgenticLib({
      verbose: options.verbose,
    });

    if (options.serve) {
      // Server mode
      await agenticLib.initialize();
      await startServer(options, agenticLib);
    } else if (options.command) {
      // Command mode
      await executeCommand(options.command, options.args, options, agenticLib);
    } else {
      // Default behavior - show basic info
      console.log("🤖 Agentic Library CLI");
      console.log("Use --help for usage information");
      console.log("Use --serve to start HTTP server mode");
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

// Execute if run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
