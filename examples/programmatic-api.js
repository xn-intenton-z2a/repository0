#!/usr/bin/env node
/**
 * Programmatic API Example
 * 
 * This example shows how to use the agentic-lib SDK directly in your Node.js applications
 * instead of through the CLI interface.
 */

import { AgenticLib } from "../src/lib/agentic-lib.js";

async function demonstrateProgrammaticAPI() {
  console.log("🔧 Agentic-lib Programmatic API Examples");
  console.log("==========================================\n");

  // Initialize the SDK
  const agentic = new AgenticLib({
    githubToken: process.env.GITHUB_TOKEN,
    repository: "repository0", 
    owner: "xn-intenton-z2a"
  });

  try {
    console.log("1. Initializing agentic system...");
    await agentic.initialize();
    console.log("   ✅ System initialized\n");

    console.log("2. Creating a code review workflow...");
    const reviewWorkflow = await agentic.createWorkflow({
      type: "review",
      createBranch: true,
      createIssue: true
    });
    console.log(`   ✅ Workflow created: ${reviewWorkflow.id}\n`);

    console.log("3. Sending status message...");
    const message = await agentic.communication.sendMessage(
      "Automated review workflow started successfully",
      "status", 
      { type: "info", sender: "api-example" }
    );
    console.log(`   ✅ Message sent: ${message.id}\n`);

    console.log("4. Creating a channel for notifications...");
    const notificationChannel = await agentic.communication.createChannel(
      "notifications",
      "Channel for automated notifications and alerts"
    );
    console.log(`   ✅ Channel created: #${notificationChannel.number}\n`);

    console.log("5. Sending coordinated messages...");
    await agentic.communication.sendStatus(reviewWorkflow.id, "running", {
      progress: "50%",
      task: "analyzing code changes"
    });
    console.log("   ✅ Status update sent\n");

    console.log("6. Getting workflow status...");
    const status = await agentic.orchestrator.getStatus();
    console.log(`   📊 Active workflows: ${status.running}`);
    console.log(`   📊 Total workflows: ${status.total}\n`);

    console.log("7. Composing multiple workflows...");
    const composition = await agentic.orchestrator.composeWorkflows([
      { type: "fix", createBranch: false },
      { type: "transform", createBranch: false }
    ]);
    console.log(`   ✅ Composed workflow: ${composition.id}\n`);

  } catch (error) {
    console.error("❌ Error:", error.message);
    console.log("\n💡 Make sure GITHUB_TOKEN is set and has appropriate permissions");
  }
}

// Advanced example: Custom workflow coordination
async function advancedCoordination() {
  console.log("\n🔀 Advanced Coordination Example");
  console.log("================================\n");

  const agentic = new AgenticLib();
  
  try {
    await agentic.initialize();

    // Create multiple workflows that need to coordinate
    const workflows = await Promise.all([
      agentic.createWorkflow({ type: "review", createIssue: false }),
      agentic.createWorkflow({ type: "fix", createIssue: false }),
      agentic.createWorkflow({ type: "transform", createIssue: false })
    ]);

    console.log(`Created ${workflows.length} coordinated workflows`);

    // Send coordination messages between workflows
    const [review, fix, transform] = workflows;
    
    await agentic.communication.sendCoordinationRequest(
      review.id, 
      fix.id, 
      "Please wait for review completion before starting fixes"
    );

    await agentic.communication.sendCoordinationRequest(
      fix.id,
      transform.id,
      "Transform can begin after fixes are applied"
    );

    console.log("✅ Coordination messages sent");

    // Simulate workflow completion and status updates
    for (const workflow of workflows) {
      await agentic.orchestrator.updateWorkflow(workflow.id, {
        status: "completed",
        message: `${workflow.type} workflow completed successfully`
      });
    }

    console.log("✅ All workflows completed");

  } catch (error) {
    console.error("❌ Coordination error:", error.message);
  }
}

// Run examples if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  await demonstrateProgrammaticAPI();
  await advancedCoordination();
}