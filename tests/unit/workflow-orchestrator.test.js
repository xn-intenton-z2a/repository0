import { describe, expect, it, vi, beforeEach } from "vitest";
import { WorkflowOrchestrator } from "../../src/lib/workflow-orchestrator.js";
import { GitHubIntegration } from "../../src/lib/github-integration.js";

// Mock GitHub integration
const mockGitHub = {
  createBranch: vi.fn(),
  createIssue: vi.fn(),
  addComment: vi.fn(),
};

describe("WorkflowOrchestrator", () => {
  let orchestrator;

  beforeEach(() => {
    vi.clearAllMocks();
    orchestrator = new WorkflowOrchestrator(mockGitHub, {});
  });

  describe("registerWorkflow", () => {
    it("should register a workflow type", () => {
      const definition = {
        description: "Test workflow",
        inputs: ["param1"],
      };

      orchestrator.registerWorkflow("test-workflow", definition);

      expect(orchestrator.workflowRegistry.has("test-workflow")).toBe(true);
      const registered = orchestrator.workflowRegistry.get("test-workflow");
      expect(registered.name).toBe("test-workflow");
      expect(registered.description).toBe("Test workflow");
    });
  });

  describe("createWorkflow", () => {
    beforeEach(() => {
      mockGitHub.createBranch.mockResolvedValue({
        name: "agentic/test-wf123",
        sha: "abc123",
      });
      mockGitHub.createIssue.mockResolvedValue({
        number: 1,
        title: "Agentic Workflow: test",
        body: "Test workflow",
        labels: ["agentic", "workflow", "test"],
        url: "https://github.com/test/test/issues/1",
      });
    });

    it("should create a new workflow with branch and issue", async () => {
      const config = {
        type: "test",
        description: "Test workflow",
      };

      const workflow = await orchestrator.createWorkflow(config);

      expect(workflow.type).toBe("test");
      expect(workflow.status).toBe("running");
      expect(workflow.branch).toBeDefined();
      expect(workflow.issue).toBeDefined();
      expect(mockGitHub.createBranch).toHaveBeenCalled();
      expect(mockGitHub.createIssue).toHaveBeenCalled();
    });

    it("should skip branch creation if disabled", async () => {
      const config = {
        type: "test",
        createBranch: false,
      };

      const workflow = await orchestrator.createWorkflow(config);

      expect(workflow.branch).toBeUndefined();
      expect(mockGitHub.createBranch).not.toHaveBeenCalled();
    });

    it("should handle creation errors", async () => {
      mockGitHub.createBranch.mockRejectedValue(new Error("Branch creation failed"));

      const config = { type: "test" };

      await expect(orchestrator.createWorkflow(config)).rejects.toThrow("Branch creation failed");
    });
  });

  describe("updateWorkflow", () => {
    it("should update workflow status and add comment", async () => {
      // Create a workflow first
      const workflow = {
        id: "test-workflow",
        issue: { number: 1 },
        status: "running",
        createdAt: new Date(),
      };
      orchestrator.activeWorkflows.set("test-workflow", workflow);

      await orchestrator.updateWorkflow("test-workflow", {
        status: "completed",
        message: "Workflow completed successfully",
      });

      expect(workflow.status).toBe("completed");
      expect(mockGitHub.addComment).toHaveBeenCalledWith(
        1,
        "Workflow status updated: **completed**\n\nWorkflow completed successfully"
      );
    });

    it("should throw error for non-existent workflow", async () => {
      await expect(orchestrator.updateWorkflow("non-existent", {})).rejects.toThrow(
        "Workflow non-existent not found"
      );
    });
  });

  describe("getStatus", () => {
    it("should return status summary of all workflows", async () => {
      // Add some test workflows
      orchestrator.activeWorkflows.set("wf1", { status: "running", type: "test1" });
      orchestrator.activeWorkflows.set("wf2", { status: "completed", type: "test2" });
      orchestrator.activeWorkflows.set("wf3", { status: "failed", type: "test3" });

      const status = await orchestrator.getStatus();

      expect(status.total).toBe(3);
      expect(status.running).toBe(1);
      expect(status.completed).toBe(1);
      expect(status.failed).toBe(1);
      expect(status.workflows).toHaveLength(3);
    });
  });

  describe("composeWorkflows", () => {
    beforeEach(() => {
      mockGitHub.createBranch.mockResolvedValue({ name: "test", sha: "abc" });
      mockGitHub.createIssue.mockResolvedValue({ number: 1 });
    });

    it("should compose multiple workflows", async () => {
      const workflows = [
        { type: "workflow1" },
        { type: "workflow2" },
      ];

      const composition = await orchestrator.composeWorkflows(workflows);

      expect(composition.type).toBe("composition");
      expect(composition.workflows).toHaveLength(2);
      expect(composition.status).toBe("completed");
    });
  });

  describe("utility methods", () => {
    it("should generate unique workflow IDs", () => {
      const id1 = orchestrator.generateWorkflowId();
      const id2 = orchestrator.generateWorkflowId();

      expect(id1).toMatch(/^wf_\d+_[a-z0-9]+$/);
      expect(id2).toMatch(/^wf_\d+_[a-z0-9]+$/);
      expect(id1).not.toBe(id2);
    });

    it("should generate workflow descriptions", () => {
      const config = { type: "test", param: "value" };
      const description = orchestrator.generateWorkflowDescription(config);

      expect(description).toContain("**Workflow Type:** test");
      expect(description).toContain('"type": "test"');
      expect(description).toContain('"param": "value"');
    });
  });
});