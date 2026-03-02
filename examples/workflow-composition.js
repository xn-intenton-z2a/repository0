#!/usr/bin/env node
/**
 * Workflow Composition Example
 * 
 * This example demonstrates how to compose multiple workflows together
 * for complex automation scenarios using the agentic-lib toolkit.
 */

import { AgenticLib } from "../src/lib/agentic-lib.js";

/**
 * Example 1: Sequential workflow composition
 * Each workflow waits for the previous one to complete
 */
async function sequentialWorkflowComposition() {
  console.log("🔄 Sequential Workflow Composition");
  console.log("==================================\n");

  const agentic = new AgenticLib();
  
  try {
    await agentic.initialize();
    
    // Create workflows that depend on each other
    const workflows = [
      { type: "review", name: "Code Review", createBranch: true },
      { type: "fix", name: "Auto Fix Issues", createBranch: false },
      { type: "transform", name: "Code Transform", createBranch: false },
      { type: "maintain", name: "Maintenance", createBranch: false }
    ];

    console.log("Creating sequential workflow chain...");
    
    const createdWorkflows = [];
    for (const [index, workflowConfig] of workflows.entries()) {
      console.log(`Step ${index + 1}: Creating ${workflowConfig.name} workflow`);
      
      const workflow = await agentic.createWorkflow(workflowConfig);
      createdWorkflows.push(workflow);
      
      // Send coordination message to next workflow
      if (index < workflows.length - 1) {
        const nextWorkflow = workflows[index + 1];
        await agentic.communication.sendCoordinationRequest(
          workflow.id,
          `next-workflow-${nextWorkflow.type}`,
          `${workflowConfig.name} completed, ready for ${nextWorkflow.name}`
        );
      }
      
      // Simulate workflow completion
      await agentic.orchestrator.updateWorkflow(workflow.id, {
        status: "completed",
        message: `${workflowConfig.name} completed successfully`
      });
      
      console.log(`   ✅ ${workflowConfig.name} completed`);
    }
    
    console.log(`\n✅ Sequential composition completed: ${createdWorkflows.length} workflows`);
    
  } catch (error) {
    console.error("❌ Sequential composition error:", error.message);
  }
}

/**
 * Example 2: Parallel workflow composition
 * Multiple workflows run simultaneously
 */
async function parallelWorkflowComposition() {
  console.log("\n⚡ Parallel Workflow Composition");
  console.log("===============================\n");

  const agentic = new AgenticLib();
  
  try {
    await agentic.initialize();
    
    // Define parallel workflows
    const parallelWorkflows = [
      { type: "review", task: "security-review", createBranch: true },
      { type: "review", task: "performance-review", createBranch: true },
      { type: "review", task: "accessibility-review", createBranch: true }
    ];

    console.log("Creating parallel workflows...");
    
    // Create all workflows simultaneously
    const workflows = await Promise.all(
      parallelWorkflows.map(config => agentic.createWorkflow(config))
    );
    
    console.log(`✅ Created ${workflows.length} parallel workflows`);
    
    // Send status updates to coordination channel
    await agentic.communication.sendMessage(
      `Started ${workflows.length} parallel review workflows`,
      "coordination",
      { type: "info", sender: "composition-manager" }
    );
    
    // Simulate parallel processing with status updates
    const updates = workflows.map(async (workflow, index) => {
      const task = parallelWorkflows[index].task;
      
      // Simulate work with periodic updates
      await agentic.communication.sendStatus(workflow.id, "processing", {
        task,
        progress: "25%"
      });
      
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulate work
      
      await agentic.communication.sendStatus(workflow.id, "processing", {
        task,
        progress: "75%"
      });
      
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulate work
      
      // Complete the workflow
      await agentic.orchestrator.completeWorkflow(workflow.id, {
        task,
        result: `${task} completed successfully`,
        findings: Math.floor(Math.random() * 5) // Random findings
      });
      
      return workflow;
    });
    
    const completedWorkflows = await Promise.all(updates);
    console.log(`✅ All ${completedWorkflows.length} parallel workflows completed`);
    
  } catch (error) {
    console.error("❌ Parallel composition error:", error.message);
  }
}

/**
 * Example 3: Conditional workflow composition
 * Workflows are created based on conditions and results
 */
async function conditionalWorkflowComposition() {
  console.log("\n🔀 Conditional Workflow Composition");
  console.log("===================================\n");

  const agentic = new AgenticLib();
  
  try {
    await agentic.initialize();
    
    // Initial workflow
    console.log("Creating initial review workflow...");
    const reviewWorkflow = await agentic.createWorkflow({ 
      type: "review",
      createBranch: true
    });
    
    // Simulate review results
    const reviewResult = {
      issuesFound: Math.random() > 0.5,
      securityIssues: Math.random() > 0.7,
      performanceIssues: Math.random() > 0.6,
      codeQuality: Math.random() * 10
    };
    
    console.log("Review results:", reviewResult);
    
    // Conditional workflow creation based on review results
    const conditionalWorkflows = [];
    
    if (reviewResult.issuesFound) {
      console.log("Issues found - creating fix workflow...");
      const fixWorkflow = await agentic.createWorkflow({ 
        type: "fix",
        reason: "Issues found in code review"
      });
      conditionalWorkflows.push(fixWorkflow);
    }
    
    if (reviewResult.securityIssues) {
      console.log("Security issues found - creating security workflow...");
      await agentic.communication.sendMessage(
        "Security vulnerabilities detected - escalating to security team",
        "security",
        { type: "warning", sender: "security-scanner" }
      );
    }
    
    if (reviewResult.performanceIssues) {
      console.log("Performance issues found - creating optimization workflow...");
      const optimizeWorkflow = await agentic.createWorkflow({
        type: "transform",
        reason: "Performance optimization needed"
      });
      conditionalWorkflows.push(optimizeWorkflow);
    }
    
    if (reviewResult.codeQuality < 7) {
      console.log("Code quality below threshold - creating refactor workflow...");
      const refactorWorkflow = await agentic.createWorkflow({
        type: "transform", 
        reason: "Code quality improvement needed"
      });
      conditionalWorkflows.push(refactorWorkflow);
    }
    
    // Complete review workflow
    await agentic.orchestrator.completeWorkflow(reviewWorkflow.id, reviewResult);
    
    console.log(`✅ Conditional composition completed: created ${conditionalWorkflows.length} additional workflows`);
    
    // Send summary
    await agentic.communication.sendMessage(
      `Workflow composition completed - ${conditionalWorkflows.length} follow-up workflows created`,
      "coordination",
      { 
        type: "success", 
        sender: "composition-manager",
        metadata: { reviewResult, additionalWorkflows: conditionalWorkflows.length }
      }
    );
    
  } catch (error) {
    console.error("❌ Conditional composition error:", error.message);
  }
}

/**
 * Example 4: Complex multi-stage composition
 * Combines sequential, parallel, and conditional patterns
 */
async function complexWorkflowComposition() {
  console.log("\n🎯 Complex Multi-Stage Composition");
  console.log("==================================\n");

  const agentic = new AgenticLib();
  
  try {
    await agentic.initialize();
    
    console.log("Stage 1: Initial parallel analysis...");
    
    // Stage 1: Parallel analysis workflows
    const analysisWorkflows = await Promise.all([
      agentic.createWorkflow({ type: "review", task: "security-analysis" }),
      agentic.createWorkflow({ type: "review", task: "quality-analysis" }),
      agentic.createWorkflow({ type: "review", task: "performance-analysis" })
    ]);
    
    // Wait for analysis completion (simulated)
    for (const workflow of analysisWorkflows) {
      await agentic.orchestrator.completeWorkflow(workflow.id, {
        stage: "analysis",
        findings: Math.floor(Math.random() * 3)
      });
    }
    
    console.log("Stage 2: Conditional action workflows...");
    
    // Stage 2: Create action workflows based on analysis
    const actionWorkflows = [];
    
    // Always create a maintenance workflow
    const maintainWorkflow = await agentic.createWorkflow({ 
      type: "maintain",
      stage: "maintenance"
    });
    actionWorkflows.push(maintainWorkflow);
    
    // Conditionally create fix workflows
    if (Math.random() > 0.5) {
      const fixWorkflow = await agentic.createWorkflow({ 
        type: "fix",
        stage: "remediation"
      });
      actionWorkflows.push(fixWorkflow);
    }
    
    console.log("Stage 3: Final transformation...");
    
    // Stage 3: Final transformation workflow
    const transformWorkflow = await agentic.createWorkflow({
      type: "transform",
      stage: "finalization",
      dependencies: actionWorkflows.map(w => w.id)
    });
    
    // Complete all workflows
    for (const workflow of [...actionWorkflows, transformWorkflow]) {
      await agentic.orchestrator.completeWorkflow(workflow.id, {
        stage: workflow.config?.stage || "unknown",
        completedAt: new Date().toISOString()
      });
    }
    
    console.log(`✅ Complex composition completed successfully`);
    console.log(`   Analysis workflows: ${analysisWorkflows.length}`);
    console.log(`   Action workflows: ${actionWorkflows.length}`);
    console.log(`   Transform workflows: 1`);
    console.log(`   Total workflows: ${analysisWorkflows.length + actionWorkflows.length + 1}`);
    
  } catch (error) {
    console.error("❌ Complex composition error:", error.message);
  }
}

// Run all examples if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  await sequentialWorkflowComposition();
  await parallelWorkflowComposition();
  await conditionalWorkflowComposition();
  await complexWorkflowComposition();
  
  console.log("\n🎉 All workflow composition examples completed!");
  console.log("💡 Check the GitHub issues for detailed workflow tracking");
}