#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/main.js

import { fileURLToPath } from "url";
import { AgenticLib } from "./agentic-lib.js";

/**
 * Display help information
 */
function showHelp() {
  console.log(`
🤖 Agentic Lib CLI - GitHub Workflow Orchestration Toolkit

USAGE:
  npx @xn-intenton-z2a/repo <command> [options]

COMMANDS:
  init                     Initialize agentic workflows in current repository
  create-workflow <type>   Create and start a new agentic workflow
  send-message <message>   Send message through agentic communication system
  list-workflows          List active workflows
  status                  Show agentic system status
  help                    Show this help message

WORKFLOW TYPES:
  review                  Code review workflow
  fix                     Automated code fixing workflow  
  transform               Code transformation workflow
  maintain                Repository maintenance workflow

OPTIONS:
  --channel <name>        Communication channel (for send-message)
  --type <type>           Message type: info, warning, error (for send-message)
  --branch               Create branch for workflow (default: true)
  --issue                Create tracking issue for workflow (default: true)

EXAMPLES:
  npx @xn-intenton-z2a/repo init
  npx @xn-intenton-z2a/repo create-workflow review
  npx @xn-intenton-z2a/repo send-message "Build completed" --channel status
  npx @xn-intenton-z2a/repo status

ENVIRONMENT VARIABLES:
  GITHUB_TOKEN           GitHub personal access token (required for most operations)
  GITHUB_REPOSITORY      Repository in format owner/repo (auto-detected in Actions)

For more information: https://github.com/xn-intenton-z2a/agentic-lib
  `);
}

/**
 * Initialize agentic system in current repository
 */
async function initializeAgentic(options = {}) {
  console.log("🚀 Initializing agentic workflows...");
  
  try {
    const agentic = new AgenticLib(options);
    await agentic.initialize();
    
    console.log("✅ Agentic system initialized successfully!");
    console.log("📝 Communication hub created for workflow coordination");
    console.log("🔧 Ready to create and orchestrate workflows");
    
    return agentic;
  } catch (error) {
    console.error("❌ Initialization failed:", error.message);
    process.exit(1);
  }
}

/**
 * Create a new agentic workflow
 */
async function createWorkflow(type, options = {}) {
  console.log(`🔨 Creating ${type} workflow...`);
  
  try {
    const agentic = new AgenticLib(options);
    await agentic.initialize();
    
    const workflowConfig = {
      type,
      createBranch: options.branch !== false,
      createIssue: options.issue !== false,
    };
    
    const workflow = await agentic.createWorkflow(workflowConfig);
    
    console.log(`✅ Workflow created successfully!`);
    console.log(`   ID: ${workflow.id}`);
    console.log(`   Type: ${workflow.type}`);
    if (workflow.branch) {
      console.log(`   Branch: ${workflow.branch.name}`);
    }
    if (workflow.issue) {
      console.log(`   Issue: #${workflow.issue.number}`);
    }
    
    return workflow;
  } catch (error) {
    console.error("❌ Workflow creation failed:", error.message);
    process.exit(1);
  }
}

/**
 * Send message through agentic communication system
 */
async function sendMessage(message, options = {}) {
  console.log(`📨 Sending message: "${message}"`);
  
  try {
    const agentic = new AgenticLib(options);
    await agentic.initialize();
    
    const channel = options.channel || "default";
    const messageOptions = {
      type: options.type || "info",
      sender: "cli",
    };
    
    const result = await agentic.communication.sendMessage(message, channel, messageOptions);
    
    console.log(`✅ Message sent successfully!`);
    console.log(`   Channel: ${channel}`);
    console.log(`   Message ID: ${result.id}`);
    
    return result;
  } catch (error) {
    console.error("❌ Message sending failed:", error.message);
    process.exit(1);
  }
}

/**
 * Show system status
 */
async function showStatus(options = {}) {
  console.log("📊 Agentic System Status");
  console.log("========================");
  
  try {
    const agentic = new AgenticLib(options);
    
    // Show basic configuration
    console.log(`Repository: ${agentic.options.owner}/${agentic.options.repository}`);
    console.log(`GitHub Token: ${agentic.options.githubToken ? '✅ Configured' : '❌ Missing'}`);
    
    // Try to initialize to check connectivity
    await agentic.initialize();
    console.log("Status: ✅ Connected to GitHub");
    console.log(`Active Workflows: ${agentic.orchestrator.activeWorkflows.size}`);
    console.log(`Registered Workflow Types: ${agentic.orchestrator.workflowRegistry.size}`);
    
    // Show active workflows
    if (agentic.orchestrator.activeWorkflows.size > 0) {
      console.log("\nActive Workflows:");
      for (const [id, workflow] of agentic.orchestrator.activeWorkflows) {
        console.log(`  ${id}: ${workflow.type} (${workflow.status})`);
      }
    }
    
  } catch (error) {
    console.log("Status: ❌ Connection failed");
    console.error(`Error: ${error.message}`);
  }
}

/**
 * Parse command line arguments
 */
function parseArgs(args) {
  const options = {};
  const commands = [];
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const nextArg = args[i + 1];
      
      if (nextArg && !nextArg.startsWith('--')) {
        options[key] = nextArg;
        i++; // Skip next argument since we consumed it
      } else {
        options[key] = true;
      }
    } else {
      commands.push(arg);
    }
  }
  
  return { commands, options };
}

/**
 * Main CLI entry point
 */
export async function main(args) {
  const { commands, options } = parseArgs(args || []);
  const [command, ...commandArgs] = commands;
  
  // Handle no command or help
  if (!command || command === 'help' || command === '--help' || command === '-h') {
    showHelp();
    return;
  }
  
  // Set up environment options
  const agenticOptions = {
    githubToken: process.env.GITHUB_TOKEN || options.token,
    repository: process.env.GITHUB_REPOSITORY?.split("/")[1] || options.repository,
    owner: process.env.GITHUB_REPOSITORY?.split("/")[0] || options.owner,
  };
  
  try {
    switch (command) {
      case 'init':
        await initializeAgentic(agenticOptions);
        break;
        
      case 'create-workflow':
        const workflowType = commandArgs[0];
        if (!workflowType) {
          console.error("❌ Workflow type is required. Use: review, fix, transform, or maintain");
          process.exit(1);
        }
        await createWorkflow(workflowType, { ...agenticOptions, ...options });
        break;
        
      case 'send-message':
        const message = commandArgs.join(' ');
        if (!message) {
          console.error("❌ Message content is required");
          process.exit(1);
        }
        await sendMessage(message, { ...agenticOptions, ...options });
        break;
        
      case 'list-workflows':
        console.log("📋 Listing workflows (not implemented yet)");
        console.log("This feature will show all active workflows from GitHub issues");
        break;
        
      case 'status':
        await showStatus(agenticOptions);
        break;
        
      default:
        console.error(`❌ Unknown command: ${command}`);
        console.log("Run 'npx @xn-intenton-z2a/repo help' for usage information");
        process.exit(1);
    }
  } catch (error) {
    console.error("❌ Command failed:", error.message);
    process.exit(1);
  }
}

// Auto-run if this file is executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  await main(args);
}
