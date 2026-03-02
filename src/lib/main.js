#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/main.js

import { fileURLToPath } from "url";
import { AgenticLib } from "./agentic-lib.js";

/**
 * Agentic CLI Tool
 * 
 * A command-line interface for managing agentic workflows in GitHub repositories.
 * Enables autonomous workflows to communicate, coordinate, and continuously improve codebases.
 */

const COMMANDS = {
  init: "Initialize agentic workflows for this repository",
  workflow: "Create and manage agentic workflows", 
  message: "Send messages through agentic communication channels",
  status: "Check status of active workflows",
  help: "Show this help message"
};

export async function main(args = []) {
  try {
    const [command, ...commandArgs] = args;
    
    if (!command || command === "help") {
      showHelp();
      return;
    }

    // Initialize the AgenticLib instance
    const agentic = new AgenticLib();

    switch (command) {
      case "init":
        await handleInit(agentic, commandArgs);
        break;
        
      case "workflow":
        await handleWorkflow(agentic, commandArgs);
        break;
        
      case "message":
        await handleMessage(agentic, commandArgs);
        break;
        
      case "status":
        await handleStatus(agentic, commandArgs);
        break;
        
      default:
        console.error(`Unknown command: ${command}`);
        console.error("Run 'agentic help' for available commands.");
        process.exit(1);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

function showHelp() {
  console.log("\n🤖 Agentic CLI - Autonomous Workflow Management");
  console.log("\nUsage: agentic <command> [options]\n");
  console.log("Commands:");
  
  Object.entries(COMMANDS).forEach(([cmd, desc]) => {
    console.log(`  ${cmd.padEnd(12)} ${desc}`);
  });
  
  console.log("\nExamples:");
  console.log("  agentic init                    # Initialize agentic workflows");
  console.log("  agentic workflow create review  # Create a code review workflow");
  console.log("  agentic message send \"Hello\"     # Send a message to default channel");
  console.log("  agentic status                  # Check active workflow status");
  console.log("");
}

async function handleInit(agentic, args) {
  console.log("🚀 Initializing agentic workflows...");
  
  await agentic.initialize();
  
  console.log("✅ Agentic workflows initialized successfully!");
  console.log("  - Communication channels set up");
  console.log("  - Ready to create and manage workflows");
  console.log("\nNext steps:");
  console.log("  - Run 'agentic workflow create <type>' to start a workflow");
  console.log("  - Check 'agentic status' to monitor progress");
}

async function handleWorkflow(agentic, args) {
  const [action, type, ...options] = args;
  
  if (!action) {
    console.error("Workflow action required. Usage: agentic workflow <create|list|stop> [type]");
    return;
  }

  await agentic.initialize();
  
  switch (action) {
    case "create":
      if (!type) {
        console.error("Workflow type required. Usage: agentic workflow create <type>");
        return;
      }
      
      console.log(`🔄 Creating ${type} workflow...`);
      
      const workflow = await agentic.createWorkflow({
        type: type,
        createBranch: true,
        createIssue: true,
        options: parseOptions(options)
      });
      
      console.log(`✅ Created workflow ${workflow.id}`);
      console.log(`  - Type: ${workflow.type}`);
      console.log(`  - Branch: ${workflow.branch?.name || 'N/A'}`);
      console.log(`  - Issue: #${workflow.issue?.number || 'N/A'}`);
      break;
      
    case "list":
      console.log("📋 Active workflows:");
      // This would require extending the orchestrator to persist workflow state
      console.log("  (Feature coming soon - workflow persistence)");
      break;
      
    default:
      console.error(`Unknown workflow action: ${action}`);
  }
}

async function handleMessage(agentic, args) {
  const [action, messageOrChannel, ...rest] = args;
  
  if (!action) {
    console.error("Message action required. Usage: agentic message <send> <message> [channel]");
    return;
  }

  await agentic.initialize();
  
  switch (action) {
    case "send":
      if (!messageOrChannel) {
        console.error("Message required. Usage: agentic message send <message> [channel]");
        return;
      }
      
      const message = messageOrChannel;
      const channel = rest[0] || "default";
      
      console.log(`📤 Sending message to '${channel}' channel...`);
      
      await agentic.communication.sendMessage(message, channel, {
        sender: "agentic-cli",
        type: "user-message"
      });
      
      console.log("✅ Message sent successfully!");
      break;
      
    default:
      console.error(`Unknown message action: ${action}`);
  }
}

async function handleStatus(agentic, args) {
  console.log("📊 Agentic Status Dashboard");
  console.log("==========================");
  
  try {
    // Initialize to check connection
    await agentic.initialize();
    console.log("✅ Connection: OK");
    console.log(`📁 Repository: ${agentic.options.owner}/${agentic.options.repository}`);
    console.log("🔄 Active Workflows: (Feature coming soon - workflow persistence)");
    console.log("💬 Communication: Ready");
    
  } catch (error) {
    console.log("❌ Connection: Failed");
    console.log(`   Error: ${error.message}`);
  }
}

function parseOptions(optionsArray) {
  const options = {};
  for (let i = 0; i < optionsArray.length; i += 2) {
    if (optionsArray[i] && optionsArray[i].startsWith('--')) {
      const key = optionsArray[i].slice(2);
      const value = optionsArray[i + 1] || true;
      options[key] = value;
    }
  }
  return options;
}

// Run CLI if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args).catch(console.error);
}
