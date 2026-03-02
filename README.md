# @xn-intenton-z2a/repo

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D24.0.0-green)](https://nodejs.org/)

**Agentic workflow management library for autonomous GitHub operations**

A powerful CLI tool and JavaScript library that enables autonomous workflows to communicate, coordinate, and continuously improve codebases through GitHub's native features.

## 🚀 Quick Start

```bash
# Install globally
npm install -g @xn-intenton-z2a/repo

# Or use npx
npx @xn-intenton-z2a/repo help
```

## 📋 Features

- **🤖 Autonomous Workflows**: Create and manage self-operating workflows that communicate through GitHub branches and issues
- **💬 Communication Protocol**: Enable workflows to coordinate through structured messaging channels
- **🔄 Workflow Orchestration**: Compose and chain multiple workflows together for complex automation
- **📊 Status Monitoring**: Real-time tracking of workflow states and progress
- **🛠️ CLI Interface**: User-friendly command-line tool for workflow management

## 🔧 CLI Usage

### Initialize Agentic Workflows

```bash
agentic init
```

Sets up communication channels and prepares your repository for autonomous workflow management.

### Create Workflows

```bash
# Create a code review workflow
agentic workflow create review

# Create a maintenance workflow  
agentic workflow create maintenance

# Create a custom workflow with options
agentic workflow create custom --option value
```

### Send Messages

```bash
# Send to default channel
agentic message send "Hello from CLI"

# Send to specific channel
agentic message send "Status update" status
```

### Check Status

```bash
agentic status
```

View active workflows, communication channels, and system health.

## 📚 Library Usage

```javascript
import { AgenticLib } from '@xn-intenton-z2a/repo';

// Initialize the library
const agentic = new AgenticLib({
  githubToken: process.env.GITHUB_TOKEN,
  owner: 'your-org',
  repository: 'your-repo'
});

// Set up communication channels
await agentic.initialize();

// Create a workflow
const workflow = await agentic.createWorkflow({
  type: 'code-review',
  createBranch: true,
  createIssue: true
});

// Send messages between workflows
await agentic.communication.sendMessage(
  'Workflow started', 
  'status',
  { sender: 'main-process' }
);
```

## 🏗️ Architecture

The library consists of four main components:

### AgenticLib
Main entry point providing high-level API for workflow management.

### GitHubIntegration
Handles all GitHub API interactions, branch management, and issue creation.

### WorkflowOrchestrator  
Manages workflow lifecycle, composition, and coordination between multiple workflows.

### CommunicationProtocol
Implements messaging system using GitHub issues and branches for workflow communication.

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:unit

# Run specific test file
npx vitest tests/unit/main.test.js
```

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on contributing to this project.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🔗 Related Projects

- [agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib) - Core workflows and actions
- [repository0-crucible](https://github.com/xn-intenton-z2a/repository0-crucible) - Experimental fork
- [repository0-plot-code-lib](https://github.com/xn-intenton-z2a/repository0-plot-code-lib) - Plotting utilities fork

---

**Built with ❤️ by the intentïon team**
