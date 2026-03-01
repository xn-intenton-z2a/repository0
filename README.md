# Agentic-lib SDK

**agentic‑lib** is a JavaScript library which can be used as a drop in JS implementation or wholesale replacement for the steps, jobs, and re-usable workflows. It is designed to be used in a GitHub Actions workflow to enable your repository to operate in an "agentic" manner. In our system, autonomous workflows communicate through branches and issues to continuously review, fix, update, and transform your code. Each workflow is designed to be invoked using GitHub's `workflow_call` event, so they can be composed together like an SDK.

## Installation

```bash
npm install @xn-intenton-z2a/agentic-lib
```

## Quick Start

```javascript
import { AgenticLib } from "@xn-intenton-z2a/agentic-lib";

// Initialize the agentic system
const agentic = new AgenticLib({
  githubToken: process.env.GITHUB_TOKEN,
  owner: "your-org",
  repository: "your-repo",
});

// Initialize communication channels
await agentic.initialize();

// Create an agentic workflow
const workflow = await agentic.createWorkflow({
  type: "code-review",
  description: "Automated code review workflow",
});

// Send messages between workflows
await agentic.sendMessage("Workflow started", "status");

// Create agentic branches and issues
const branch = await agentic.createAgenticBranch("feature/auto-improvement");
const issue = await agentic.createAgenticIssue("Automated Enhancement", "Details...");
```

## Features

### 🤖 Workflow Orchestration
- Create and manage autonomous workflows
- Compose workflows together like an SDK
- Track workflow status and results
- Handle workflow_call events

### 🌐 GitHub Integration
- Seamless GitHub API integration
- Branch-based workflow communication
- Issue-based status tracking
- Automated branch and issue management

### 💬 Communication Protocol
- Multi-channel messaging system
- Workflow coordination mechanisms
- Status updates and error handling
- Real-time communication between workflows

## Core Components

### AgenticLib (Main Class)

The primary entry point for the agentic-lib SDK.

```javascript
import { AgenticLib } from "@xn-intenton-z2a/agentic-lib";

const agentic = new AgenticLib({
  githubToken: "your-github-token",
  owner: "repository-owner", 
  repository: "repository-name",
});

await agentic.initialize();
```

### GitHubIntegration

Direct GitHub API integration utilities.

```javascript
import { GitHubIntegration } from "@xn-intenton-z2a/agentic-lib/github-integration";

const github = new GitHubIntegration({
  githubToken: "your-token",
  owner: "owner",
  repository: "repo",
});

const branch = await github.createBranch("agentic/feature-branch");
const issue = await github.createIssue("Workflow Status", "Details...");
```

### WorkflowOrchestrator

Manage and compose workflows.

```javascript
import { WorkflowOrchestrator } from "@xn-intenton-z2a/agentic-lib/workflow-orchestrator";

const orchestrator = new WorkflowOrchestrator(githubIntegration, options);

// Register workflow types
orchestrator.registerWorkflow("code-review", {
  description: "Automated code review",
  inputs: ["pull_request"],
});

// Create workflow instances
const workflow = await orchestrator.createWorkflow({
  type: "code-review",
  inputs: { pullRequest: 123 },
});
```

### CommunicationProtocol

Enable communication between workflows.

```javascript
import { CommunicationProtocol } from "@xn-intenton-z2a/agentic-lib/communication-protocol";

const protocol = new CommunicationProtocol(githubIntegration, options);

await protocol.initialize();

// Send messages
await protocol.sendMessage("Processing started", "status");

// Receive messages
const messages = await protocol.receiveMessages("status");
```

## Advanced Usage

### Workflow Composition

Create complex workflows by composing simpler ones:

```javascript
const composition = await agentic.orchestrator.composeWorkflows([
  { type: "linter", config: { strict: true } },
  { type: "test-runner", config: { coverage: true } },
  { type: "security-scan", config: { level: "high" } },
]);
```

### Custom Communication Channels

Set up dedicated channels for different purposes:

```javascript
// Create channels
await agentic.communication.createChannel("ci-status", "CI/CD status updates");
await agentic.communication.createChannel("security", "Security alerts");

// Send to specific channels
await agentic.sendMessage("Build passed", "ci-status");
await agentic.sendMessage("Vulnerability detected", "security", { type: "error" });
```

### Workflow Coordination

Coordinate between multiple workflows:

```javascript
// Workflow A requests action from Workflow B
await agentic.communication.sendCoordinationRequest(
  "workflow-a-id",
  "workflow-b-id", 
  { action: "deploy", environment: "staging" }
);

// Listen for coordination requests
const requests = await agentic.communication.receiveMessages("coordination");
```

## GitHub Actions Integration

Use with GitHub Actions workflow_call events:

```yaml
name: Agentic Workflow
on:
  workflow_call:
    inputs:
      workflow_type:
        required: true
        type: string

jobs:
  agentic:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install @xn-intenton-z2a/agentic-lib
      - run: |
          node -e "
            import('./workflow.mjs').then(m => m.run('${{ inputs.workflow_type }}'))
          "
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GITHUB_TOKEN` | GitHub personal access token or Actions token | ✅ |
| `GITHUB_REPOSITORY` | Repository in format `owner/repo` | Auto-detected in Actions |

## API Reference

### AgenticLib Methods

- `initialize()` - Initialize communication channels
- `createWorkflow(config)` - Create new workflow
- `sendMessage(message, channel, options)` - Send message
- `receiveMessages(channel, filters)` - Receive messages
- `createAgenticBranch(name, purpose)` - Create workflow branch
- `createAgenticIssue(title, body, labels)` - Create tracking issue
- `getWorkflowStatus()` - Get all workflow statuses
- `shutdown()` - Graceful shutdown

### Configuration Options

```javascript
const options = {
  githubToken: string,     // GitHub API token
  owner: string,           // Repository owner
  repository: string,      // Repository name
  baseURL: string,         // GitHub API base URL (default: https://api.github.com)
};
```

## Testing

```bash
npm test          # Run unit tests
npm run test:unit # Run unit tests with coverage
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

## License

This project is licensed under both GPL-3.0 and MIT licenses. Choose the one that best fits your use case.
