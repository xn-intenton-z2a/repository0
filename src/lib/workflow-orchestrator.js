// src/lib/workflow-orchestrator.js

/**
 * Workflow Orchestrator
 * 
 * Manages the composition and orchestration of agentic workflows,
 * enabling workflows to be invoked using GitHub's workflow_call event
 * and composed together like an SDK.
 */
export class WorkflowOrchestrator {
  constructor(githubIntegration, options = {}) {
    this.github = githubIntegration;
    this.options = options;
    this.activeWorkflows = new Map();
    this.workflowRegistry = new Map();
  }

  /**
   * Register a new workflow type
   */
  registerWorkflow(name, definition) {
    this.workflowRegistry.set(name, {
      name,
      ...definition,
      registeredAt: new Date(),
    });
    console.log(`Registered agentic workflow: ${name}`);
  }

  /**
   * Create and start a new workflow instance
   */
  async createWorkflow(config) {
    const workflowId = this.generateWorkflowId();
    const workflow = {
      id: workflowId,
      type: config.type,
      config,
      status: "pending",
      createdAt: new Date(),
      lastUpdate: new Date(),
    };

    this.activeWorkflows.set(workflowId, workflow);

    try {
      // Create agentic branch for this workflow if needed
      if (config.createBranch !== false) {
        const branchName = `agentic/${config.type}-${workflowId}`;
        workflow.branch = await this.github.createBranch(branchName, {
          purpose: `workflow-${config.type}`,
        });
      }

      // Create tracking issue if needed
      if (config.createIssue !== false) {
        workflow.issue = await this.github.createIssue(
          `Agentic Workflow: ${config.type}`,
          this.generateWorkflowDescription(config),
          ["agentic", "workflow", config.type]
        );
      }

      workflow.status = "running";
      workflow.lastUpdate = new Date();

      console.log(`Started agentic workflow ${workflowId} (${config.type})`);
      return workflow;
    } catch (error) {
      workflow.status = "failed";
      workflow.error = error.message;
      console.error(`Failed to create workflow ${workflowId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update workflow status
   */
  async updateWorkflow(workflowId, updates) {
    const workflow = this.activeWorkflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }

    Object.assign(workflow, updates, {
      lastUpdate: new Date(),
    });

    // Update tracking issue if it exists
    if (workflow.issue && updates.status) {
      const statusComment = `Workflow status updated: **${updates.status}**\n\n${updates.message || ""}`;
      await this.github.addComment(workflow.issue.number, statusComment);
    }

    return workflow;
  }

  /**
   * Complete a workflow
   */
  async completeWorkflow(workflowId, result = {}) {
    const workflow = await this.updateWorkflow(workflowId, {
      status: "completed",
      result,
      completedAt: new Date(),
    });

    // Add completion comment to issue
    if (workflow.issue) {
      const completionComment = `✅ Workflow completed successfully!\n\n**Result:** ${JSON.stringify(result, null, 2)}`;
      await this.github.addComment(workflow.issue.number, completionComment);
    }

    console.log(`Completed agentic workflow ${workflowId}`);
    return workflow;
  }

  /**
   * Fail a workflow
   */
  async failWorkflow(workflowId, error) {
    const workflow = await this.updateWorkflow(workflowId, {
      status: "failed",
      error: error.message || error,
      failedAt: new Date(),
    });

    // Add failure comment to issue
    if (workflow.issue) {
      const failureComment = `❌ Workflow failed!\n\n**Error:** ${error.message || error}`;
      await this.github.addComment(workflow.issue.number, failureComment);
    }

    console.error(`Failed agentic workflow ${workflowId}: ${error.message || error}`);
    return workflow;
  }

  /**
   * Get the status of all active workflows
   */
  async getStatus() {
    const workflows = Array.from(this.activeWorkflows.values());
    return {
      total: workflows.length,
      running: workflows.filter(w => w.status === "running").length,
      completed: workflows.filter(w => w.status === "completed").length,
      failed: workflows.filter(w => w.status === "failed").length,
      workflows: workflows.map(w => ({
        id: w.id,
        type: w.type,
        status: w.status,
        createdAt: w.createdAt,
        lastUpdate: w.lastUpdate,
      })),
    };
  }

  /**
   * Trigger a workflow_call event
   */
  async triggerWorkflowCall(workflowPath, inputs = {}) {
    // This would typically trigger a GitHub Actions workflow_call
    // For now, we'll simulate the behavior
    console.log(`Triggering workflow_call: ${workflowPath}`, inputs);
    
    return {
      workflow: workflowPath,
      inputs,
      triggeredAt: new Date(),
      status: "dispatched",
    };
  }

  /**
   * Compose multiple workflows together
   */
  async composeWorkflows(workflows) {
    const composedId = this.generateWorkflowId();
    const composition = {
      id: composedId,
      type: "composition",
      workflows: [],
      status: "running",
      createdAt: new Date(),
    };

    try {
      for (const workflowConfig of workflows) {
        const workflow = await this.createWorkflow(workflowConfig);
        composition.workflows.push(workflow.id);
      }

      composition.status = "completed";
      console.log(`Created workflow composition ${composedId} with ${workflows.length} workflows`);
      return composition;
    } catch (error) {
      composition.status = "failed";
      composition.error = error.message;
      throw error;
    }
  }

  /**
   * Shutdown all workflows gracefully
   */
  async shutdown() {
    const runningWorkflows = Array.from(this.activeWorkflows.values())
      .filter(w => w.status === "running");

    for (const workflow of runningWorkflows) {
      try {
        await this.updateWorkflow(workflow.id, {
          status: "shutdown",
          shutdownAt: new Date(),
        });
      } catch (error) {
        console.error(`Error shutting down workflow ${workflow.id}: ${error.message}`);
      }
    }

    console.log(`Shutdown ${runningWorkflows.length} active workflows`);
  }

  /**
   * Generate a unique workflow ID
   */
  generateWorkflowId() {
    return `wf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate workflow description for issues
   */
  generateWorkflowDescription(config) {
    return `
**Workflow Type:** ${config.type}
**Created:** ${new Date().toISOString()}
**Configuration:**
\`\`\`json
${JSON.stringify(config, null, 2)}
\`\`\`

This issue tracks the progress of an agentic workflow. Updates will be posted as comments.
    `.trim();
  }
}