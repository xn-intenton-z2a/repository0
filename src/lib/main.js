#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/main.js

import { fileURLToPath } from "url";
import { AgenticLib } from "./agentic-lib.js";

/**
 * Agentic Library CLI - Demo and Testing Interface
 * 
 * This CLI demonstrates the capabilities of the agentic-lib SDK for creating
 * autonomous GitHub workflows that communicate through branches and issues.
 */
class AgenticCLI {
  constructor() {
    this.agenticLib = null;
    this.commands = {
      init: this.initializeAgentic.bind(this),
      demo: this.runDemo.bind(this),
      status: this.showStatus.bind(this),
      create: this.createWorkflow.bind(this),
      message: this.sendMessage.bind(this),
      channels: this.listChannels.bind(this),
      help: this.showHelp.bind(this),
    };
  }

  async run(args) {
    const command = args[0] || "help";
    const commandArgs = args.slice(1);

    if (!this.commands[command]) {
      console.error(`Unknown command: ${command}`);
      this.showHelp();
      process.exit(1);
    }

    try {
      await this.commands[command](commandArgs);
    } catch (error) {
      console.error(`Error executing command '${command}': ${error.message}`);
      process.exit(1);
    }
  }

  async initializeAgentic(args) {
    console.log("🚀 Initializing Agentic Library...");
    
    const options = {
      githubToken: process.env.GITHUB_TOKEN,
      repository: process.env.GITHUB_REPOSITORY?.split("/")[1],
      owner: process.env.GITHUB_REPOSITORY?.split("/")[0],
    };

    if (!options.githubToken) {
      console.log("ℹ️  No GitHub token found. Running in demo mode.");
    }

    this.agenticLib = new AgenticLib(options);
    await this.agenticLib.initialize();
    
    console.log("✅ Agentic Library initialized successfully!");
    console.log(`📊 Repository: ${options.owner}/${options.repository}`);
    console.log(`🔑 Token: ${options.githubToken ? "✓" : "✗"} provided`);
  }

  async runDemo(args) {
    await this.ensureInitialized();
    
    console.log("🎬 Running Agentic Library Demo...\n");

    // Demo 1: Create a simple workflow
    console.log("Demo 1: Creating a simple workflow");
    const workflow1 = await this.agenticLib.createWorkflow({
      type: "code-review",
      description: "Automated code review workflow",
      createBranch: false, // Skip for demo
      createIssue: false,  // Skip for demo
    });
    console.log(`✅ Created workflow: ${workflow1.id}\n`);

    // Demo 2: Send messages through communication protocol
    console.log("Demo 2: Communication protocol");
    await this.agenticLib.communication.sendMessage(
      "Demo workflow started successfully",
      "demo-channel",
      { type: "info", sender: "demo-cli" }
    );
    console.log("✅ Message sent to demo-channel\n");

    // Demo 3: Show orchestrator status
    console.log("Demo 3: Workflow orchestration status");
    const status = await this.agenticLib.orchestrator.getStatus();
    console.log(`📊 Total workflows: ${status.total}`);
    console.log(`🏃 Running: ${status.running}`);
    console.log(`✅ Completed: ${status.completed}`);
    console.log(`❌ Failed: ${status.failed}\n`);

    // Demo 4: Compose multiple workflows
    console.log("Demo 4: Composing multiple workflows");
    const composition = await this.agenticLib.orchestrator.composeWorkflows([
      { type: "test-runner", createBranch: false, createIssue: false },
      { type: "linter", createBranch: false, createIssue: false },
      { type: "build", createBranch: false, createIssue: false },
    ]);
    console.log(`✅ Created workflow composition: ${composition.id} with ${composition.workflows.length} workflows\n`);

    console.log("🎉 Demo completed successfully!");
  }

  async showStatus(args) {
    await this.ensureInitialized();
    
    console.log("📊 Agentic Library Status\n");
    
    // Workflow status
    const status = await this.agenticLib.orchestrator.getStatus();
    console.log("🔄 Workflow Orchestrator:");
    console.log(`  Total workflows: ${status.total}`);
    console.log(`  Running: ${status.running}`);
    console.log(`  Completed: ${status.completed}`);
    console.log(`  Failed: ${status.failed}`);
    
    if (status.workflows.length > 0) {
      console.log("\n  Recent workflows:");
      status.workflows.slice(0, 5).forEach(w => {
        console.log(`    ${w.id} (${w.type}) - ${w.status} - ${w.lastUpdate}`);
      });
    }

    // Communication status
    const channels = this.agenticLib.communication.getChannels();
    console.log(`\n💬 Communication Protocol:`);
    console.log(`  Active channels: ${channels.length}`);
    
    if (channels.length > 0) {
      console.log("  Channels:");
      channels.forEach(channel => {
        const stats = this.agenticLib.communication.getChannelStats(channel);
        console.log(`    ${channel}: ${stats.totalMessages} messages (${stats.recentMessages} recent)`);
      });
    }
  }

  async createWorkflow(args) {
    await this.ensureInitialized();
    
    const type = args[0] || "default";
    const description = args[1] || `Created via CLI: ${type}`;
    
    console.log(`🔧 Creating workflow of type: ${type}`);
    
    const workflow = await this.agenticLib.createWorkflow({
      type,
      description,
      createBranch: process.env.GITHUB_TOKEN ? true : false,
      createIssue: process.env.GITHUB_TOKEN ? true : false,
    });
    
    console.log(`✅ Workflow created: ${workflow.id}`);
    console.log(`   Type: ${workflow.type}`);
    console.log(`   Status: ${workflow.status}`);
    console.log(`   Created: ${workflow.createdAt}`);
    
    if (workflow.branch) {
      console.log(`   Branch: ${workflow.branch.name}`);
    }
    
    if (workflow.issue) {
      console.log(`   Issue: #${workflow.issue.number} - ${workflow.issue.title}`);
    }
  }

  async sendMessage(args) {
    await this.ensureInitialized();
    
    const message = args[0];
    const channel = args[1] || "default";
    
    if (!message) {
      console.error("Error: Message text is required");
      console.log("Usage: node main.js message 'Your message here' [channel]");
      return;
    }
    
    console.log(`📤 Sending message to channel: ${channel}`);
    
    const result = await this.agenticLib.communication.sendMessage(
      message,
      channel,
      { type: "info", sender: "cli-user" }
    );
    
    console.log(`✅ Message sent: ${result.id}`);
    console.log(`   Channel: ${result.channel}`);
    console.log(`   Timestamp: ${result.timestamp}`);
  }

  async listChannels(args) {
    await this.ensureInitialized();
    
    const channels = this.agenticLib.communication.getChannels();
    
    console.log("💬 Communication Channels:");
    
    if (channels.length === 0) {
      console.log("  No channels active");
    } else {
      channels.forEach(channel => {
        const stats = this.agenticLib.communication.getChannelStats(channel);
        console.log(`  ${channel}:`);
        console.log(`    Messages: ${stats.totalMessages}`);
        console.log(`    Recent: ${stats.recentMessages}`);
        console.log(`    Last: ${stats.lastMessage || "Never"}`);
      });
    }
  }

  showHelp() {
    console.log(`
🤖 Agentic Library CLI

DESCRIPTION:
  Command-line interface for the agentic-lib SDK. Enables creation and management
  of autonomous GitHub workflows that communicate through branches and issues.

USAGE:
  node main.js <command> [args...]

COMMANDS:
  init                Initialize the agentic library
  demo                Run a comprehensive demo of all features
  status              Show status of workflows and communication
  create <type> [desc] Create a new workflow
  message <text> [ch] Send a message to a channel
  channels            List all communication channels
  help                Show this help message

EXAMPLES:
  node main.js init
  node main.js demo
  node main.js create code-review "Review PR changes"
  node main.js message "Build completed successfully" status
  node main.js status

ENVIRONMENT:
  GITHUB_TOKEN       GitHub token for API access (optional for demo)
  GITHUB_REPOSITORY  Repository in format owner/repo

For more information, see the README.md file.
    `);
  }

  async ensureInitialized() {
    if (!this.agenticLib) {
      await this.initializeAgentic([]);
    }
  }
}

export function main(args) {
  const cli = new AgenticCLI();
  return cli.run(args || []);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args).catch(error => {
    console.error("Fatal error:", error.message);
    process.exit(1);
  });
}
