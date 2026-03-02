# Agentic Library Template

An autonomous GitHub workflow orchestration library that enables AI-driven code evolution through intelligent workflow composition and communication protocols.

## Features

**Current Status: ✅ FULLY FUNCTIONAL**

All source files are complete and working:
- ✅ **CLI Interface** (`src/lib/main.js`): Complete command-line interface  
- ✅ **Core Library** (`src/lib/agentic-lib.js`): Main SDK entry point
- ✅ **GitHub Integration** (`src/lib/github-integration.js`): Full GitHub API integration
- ✅ **Communication Protocol** (`src/lib/communication-protocol.js`): Inter-workflow messaging
- ✅ **Workflow Orchestrator** (`src/lib/workflow-orchestrator.js`): Workflow composition

**Testing:** All 38 tests passing ✅ | **Demo:** Working perfectly ✅

🤖 **Autonomous Workflows** - Self-managing GitHub Actions that coordinate through branches and issues
💬 **Communication Protocol** - Structured messaging between workflows via GitHub issues and comments  
🔄 **Workflow Orchestration** - Compose multiple workflows together like an SDK using workflow_call
📊 **Status Tracking** - Real-time monitoring of workflow states and progress
🌐 **GitHub Integration** - Full GitHub API integration for branches, issues, and automation

## Quick Start

```bash
# Clone and install
git clone <repository-url>
npm install

# Initialize the library
node src/lib/main.js init

# Run a comprehensive demo
node src/lib/main.js demo

# Create a workflow
node src/lib/main.js create code-review "Automated PR review"

# Send messages between workflows
node src/lib/main.js message "Build completed" status

# Check status
node src/lib/main.js status
```

## CLI Commands

```bash
node src/lib/main.js <command> [args...]

init                    Initialize agentic library
demo                    Run full feature demonstration  
status                  Show workflow and communication status
create <type> [desc]    Create new workflow
message <text> [ch]     Send message to channel
channels                List communication channels
help                    Show detailed help
```

## Architecture

```
src/lib/
├── main.js                    # CLI interface and demo
├── agentic-lib.js            # Main SDK entry point
├── workflow-orchestrator.js   # Workflow composition & management
├── communication-protocol.js  # Inter-workflow messaging
└── github-integration.js     # GitHub API utilities
```

## Environment Setup

```bash
# Required for GitHub integration
export GITHUB_TOKEN=your_token_here
export GITHUB_REPOSITORY=owner/repo

# Then run any command
node src/lib/main.js demo
```

## Testing

```bash
npm test              # Run all tests
npm run test:unit     # Unit tests with coverage
```

## Mission

This library demonstrates autonomous GitHub workflow orchestration, enabling AI agents to:
- Coordinate code reviews, builds, and deployments
- Communicate status and errors through structured protocols  
- Compose complex workflows from simple building blocks
- Enable truly autonomous code evolution and maintenance

## Links

- [Mission Statement](MISSION.md)
- [Contributing Guide](CONTRIBUTING.md)
- [Source Attribution](SOURCES.md)
