# @xn-intenton-z2a/repo

🤖 **GitHub Workflow Orchestration Toolkit** - Agentic workflows for autonomous code management

A JavaScript library that enables autonomous GitHub workflows to communicate, coordinate, and manage code through structured protocols. Built on GitHub's native infrastructure using issues as communication channels and branches for workflow isolation.

## 🚀 Quick Start

Install and run immediately:

```bash
npx @xn-intenton-z2a/repo --help
```

## 📋 Available Commands

### Initialize Agentic System
Set up communication hub and workflow infrastructure:
```bash
npx @xn-intenton-z2a/repo init
```

### Create Workflows
Start autonomous workflows for different tasks:
```bash
npx @xn-intenton-z2a/repo create-workflow review
npx @xn-intenton-z2a/repo create-workflow fix
npx @xn-intenton-z2a/repo create-workflow transform
npx @xn-intenton-z2a/repo create-workflow maintain
```

### Send Messages
Communicate through the agentic system:
```bash
npx @xn-intenton-z2a/repo send-message "Build completed successfully" --channel status
npx @xn-intenton-z2a/repo send-message "Critical error in deployment" --channel errors --type error
```

### Check System Status
Monitor active workflows and system health:
```bash
npx @xn-intenton-z2a/repo status
```

## 🔧 Core Features

### 🗣️ Communication Protocol
- **GitHub Issue-based messaging** - Uses issues as persistent communication channels
- **Channel system** - Organize messages by purpose (status, errors, coordination)
- **Message types** - Support for info, warning, error, success, and coordination messages
- **Metadata tracking** - Automatic timestamps, sender identification, and message IDs

### 🎭 Workflow Orchestration  
- **Dynamic workflow creation** - Generate workflows on-demand with GitHub integration
- **Branch management** - Automatic branch creation for workflow isolation
- **Issue tracking** - Each workflow gets a dedicated tracking issue
- **Status monitoring** - Real-time workflow status updates and health checks
- **Composition patterns** - Combine multiple workflows for complex tasks

### 🐙 GitHub Integration
- **Native API integration** - Full GitHub REST API support with authentication
- **Repository auto-detection** - Works seamlessly in GitHub Actions environment
- **Branch operations** - Create, manage, and coordinate across branches
- **Issue management** - Automated issue creation, updates, and commenting

## 🔐 Authentication

Set your GitHub token for full functionality:

```bash
export GITHUB_TOKEN="your_github_token_here"
```

In GitHub Actions, this is automatically available as `${{ secrets.GITHUB_TOKEN }}` or use a Personal Access Token for more permissions.

## 📖 Example Workflows

### Basic Repository Setup
```bash
# Initialize the agentic system
npx @xn-intenton-z2a/repo init

# Create a code review workflow
npx @xn-intenton-z2a/repo create-workflow review

# Send status update
npx @xn-intenton-z2a/repo send-message "Repository initialized successfully" --channel status --type success
```

### CI/CD Integration
```bash
# In your GitHub Actions workflow
- name: Initialize Agentic System
  run: npx @xn-intenton-z2a/repo init
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

- name: Create Fix Workflow
  run: npx @xn-intenton-z2a/repo create-workflow fix
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                   CLI Interface                 │
│              (src/lib/main.js)                  │
└─────────────────────┬───────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────┐
│              AgenticLib SDK                     │
│           (src/lib/agentic-lib.js)              │
├─────────────────────┬───────────────────────────┤
│  GitHub Integration │  Workflow Orchestrator   │
│  Communication      │  Branch & Issue Mgmt     │
│  Protocol           │  Status Tracking          │
└─────────────────────┴───────────────────────────┘
```

## 🎯 Mission

Build a JavaScript library that is **immediately useful** and available via `npx` for managing autonomous GitHub workflows and enabling agentic code management patterns.

## 🤝 Contributing

This repository is powered by [intentïon agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib) workflows. The code evolves autonomously toward the mission defined in [MISSION.md](MISSION.md).

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🔗 Links

- [Mission Statement](MISSION.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [intentïon agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
