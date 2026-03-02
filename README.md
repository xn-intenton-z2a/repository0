# @xn-intenton-z2a/repo

🤖 **GitHub Workflow Orchestration Toolkit** - Agentic workflows for autonomous code management

A JavaScript library that enables autonomous GitHub workflows to communicate, coordinate, and manage code through structured protocols. Built on GitHub's native infrastructure using issues as communication channels and branches for workflow isolation.

## ⚡ Immediate Usage

**Test it now without installation:**

```bash
npx @xn-intenton-z2a/repo help
```

**Set up in your repository (requires GitHub token):**

```bash
export GITHUB_TOKEN="your_github_token_here"
npx @xn-intenton-z2a/repo init
npx @xn-intenton-z2a/repo create-workflow review
npx @xn-intenton-z2a/repo status
```

**That's it!** Your repository now has autonomous workflow orchestration.

## 📋 CLI Commands Reference

| Command | Purpose | Example |
|---------|---------|---------|
| `init` | Initialize agentic system | `npx @xn-intenton-z2a/repo init` |
| `create-workflow <type>` | Create workflow | `npx @xn-intenton-z2a/repo create-workflow review` |
| `send-message <msg>` | Send communication | `npx @xn-intenton-z2a/repo send-message "Build done" --channel status` |
| `status` | Show system status | `npx @xn-intenton-z2a/repo status` |
| `help` | Show all commands | `npx @xn-intenton-z2a/repo help` |

### Workflow Types
- **`review`** - Automated code review and analysis
- **`fix`** - Issue detection and automated fixes  
- **`transform`** - Code refactoring and transformation
- **`maintain`** - Repository maintenance and optimization

## 🔧 Core Features

### 🗣️ Communication Protocol
- **Issue-based messaging** - Persistent communication via GitHub Issues
- **Channel system** - Organized by purpose (status, errors, coordination)
- **Metadata tracking** - Timestamps, senders, message types, IDs
- **Real-time updates** - Comments posted automatically to relevant issues

### 🎭 Workflow Orchestration  
- **Dynamic workflow creation** - Generate workflows on-demand
- **Branch isolation** - Each workflow gets its own branch
- **Issue tracking** - Dedicated tracking issues with status updates
- **Composition patterns** - Combine workflows for complex automation
- **Status monitoring** - Real-time workflow health and progress

### 🐙 GitHub Integration
- **Native API support** - Full GitHub REST API with authentication
- **Actions environment** - Auto-detects repository and token in CI/CD
- **Branch management** - Automated branch creation and coordination
- **Issue automation** - Create, update, comment on issues programmatically

## 🔐 Authentication

Set your GitHub token for full functionality:

```bash
export GITHUB_TOKEN="your_github_token_here"
```

In GitHub Actions, this is automatically available as `${{ secrets.GITHUB_TOKEN }}` or use a Personal Access Token for more permissions.

## 🚀 Quick Examples

### Basic Repository Setup
```bash
# Initialize the system and create your first workflow
npx @xn-intenton-z2a/repo init
npx @xn-intenton-z2a/repo create-workflow review
npx @xn-intenton-z2a/repo send-message "System ready!" --channel status --type success
```

### CI/CD Integration
```yaml
# .github/workflows/agentic.yml
- name: Create Review Workflow
  run: npx @xn-intenton-z2a/repo create-workflow review
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Programmatic Usage
```javascript
import { AgenticLib } from "@xn-intenton-z2a/repo";

const agentic = new AgenticLib();
await agentic.initialize();
await agentic.createWorkflow({ type: "review" });
```

**📁 More examples in [`examples/`](examples/) directory**

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
