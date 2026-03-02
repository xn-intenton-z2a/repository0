// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/agentic-lib.js

import { GitHubIntegration } from "./github-integration.js";
import { WorkflowOrchestrator } from "./workflow-orchestrator.js";
import { CommunicationProtocol } from "./communication-protocol.js";

/**
 * Main AgenticLib class - the primary entry point for the agentic-lib SDK
 * 
 * Provides utilities for GitHub Actions workflows to operate in an "agentic" manner,
 * enabling autonomous workflows to communicate through branches and issues to
 * continuously review, fix, update, and transform code.
 */
export class AgenticLib {
  constructor(options = {}) {
    this.options = {
      githubToken: options.githubToken || process.env.GITHUB_TOKEN,
      repository: options.repository || this.detectRepository(),
      owner: options.owner || this.detectOwner(),
      demoMode: options.demoMode || false,
      ...options,
    };

    // Auto-detect demo mode if token has insufficient permissions
    if (this.options.githubToken && !this.options.demoMode) {
      this.options.demoMode = false; // Will be set to true if API calls fail
    } else if (!this.options.githubToken) {
      this.options.demoMode = true;
    }

    // Initialize core components
    this.github = new GitHubIntegration(this.options);
    this.orchestrator = new WorkflowOrchestrator(this.github, this.options);
    this.communication = new CommunicationProtocol(this.github, this.options);
  }

  /**
   * Auto-detect repository from environment variables
   */
  detectRepository() {
    return process.env.GITHUB_REPOSITORY?.split("/")[1] || "unknown";
  }

  /**
   * Auto-detect owner from environment variables
   */
  detectOwner() {
    return process.env.GITHUB_REPOSITORY?.split("/")[0] || "unknown";
  }

  /**
   * Initialize agentic workflows for a repository
   */
  async initialize() {
    console.log(`Initializing agentic-lib for ${this.options.owner}/${this.options.repository}`);
    
    try {
      // Ensure communication channels are set up
      await this.communication.initialize();
      return this;
    } catch (error) {
      // If initialization fails due to permissions, enable demo mode
      if (error.message.includes("403") || error.message.includes("not accessible")) {
        console.log("⚠️  GitHub API permissions insufficient, enabling demo mode");
        this.options.demoMode = true;
        this.github.demoMode = true;
        
        // Retry initialization in demo mode
        await this.communication.initialize();
        return this;
      }
      throw error;
    }
  }

  /**
   * Create a new agentic workflow
   */
  async createWorkflow(workflowConfig) {
    return await this.orchestrator.createWorkflow(workflowConfig);
  }

  /**
   * Send a message through the agentic communication system
   */
  async sendMessage(message, channel = "default") {
    return await this.communication.sendMessage(message, channel);
  }

  /**
   * Listen for messages from other agentic workflows
   */
  async receiveMessages(channel = "default") {
    return await this.communication.receiveMessages(channel);
  }

  /**
   * Create an agentic branch for workflow communication
   */
  async createAgenticBranch(branchName, purpose = "agentic-workflow") {
    return await this.github.createBranch(branchName, { purpose });
  }

  /**
   * Create an agentic issue for workflow tracking
   */
  async createAgenticIssue(title, body, labels = ["agentic"]) {
    return await this.github.createIssue(title, body, labels);
  }

  /**
   * Get the status of all active agentic workflows
   */
  async getWorkflowStatus() {
    return await this.orchestrator.getStatus();
  }

  /**
   * Shutdown agentic workflows gracefully
   */
  async shutdown() {
    console.log("Shutting down agentic-lib...");
    await this.orchestrator.shutdown();
  }
}

// Export singleton instance for convenience
let defaultInstance;

export function getAgenticLib(options) {
  if (!defaultInstance) {
    defaultInstance = new AgenticLib(options);
  }
  return defaultInstance;
}
