# @xn-intenton-z2a/repo

A JavaScript library that is immediately useful and available to run with npx. Built as a template repository demonstrating the agentic-lib workflows.

## ✨ Features

- **CLI Toolkit**: Professional command-line interface with argument parsing, help text, and version display
- **Development Server**: Lightweight HTTP server with `--serve` flag for rapid prototyping and testing
- **NPX Ready**: Instantly runnable with `npx @xn-intenton-z2a/repo`

## 🚀 Quick Start

### Run with npx (recommended)
```bash
# Show help
npx @xn-intenton-z2a/repo --help

# Show version
npx @xn-intenton-z2a/repo --version

# Start the application
npx @xn-intenton-z2a/repo start

# Start development server
npx @xn-intenton-z2a/repo serve
npx @xn-intenton-z2a/repo serve --port 8080
```

### Install and use locally
```bash
npm install @xn-intenton-z2a/repo
npm run start     # Start main application
npm run serve     # Start development server
npm run dev       # Start development server (alias)
```

## 📖 CLI Commands

| Command | Description | Options |
|---------|-------------|---------|
| `help` | Show help message | |
| `version` | Show version information | |
| `start` | Start the main application | |
| `serve` | Start development server | `--port`, `--host` |

## 🌐 Development Server

The built-in development server provides:
- **Static HTML page** at `/`
- **Status endpoint** at `/api/status` 
- **Info endpoint** at `/api/info`
- **CORS enabled** for development
- **Configurable port and host**

Example endpoints:
```bash
curl http://localhost:3000/api/status
curl http://localhost:3000/api/info
```

## 🔧 Development

This repository is powered by [intentïon agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib).

### Getting Started
1. Write your mission in `MISSION.md`
2. Enable GitHub Actions  
3. The agentic workflows will evolve `src/lib/main.js` toward your mission

### Scripts
```bash
npm test          # Run all tests
npm run test:unit # Run unit tests with coverage
npm run start     # Start main application
npm run serve     # Start development server
```

## 📁 Project Structure

```
src/lib/
├── main.js                    # Main CLI application (evolves over time)
├── agentic-lib.js            # AgenticLib SDK main class
├── github-integration.js     # GitHub API integration
├── communication-protocol.js # Agentic workflow communication
└── workflow-orchestrator.js  # Workflow composition and management

tests/unit/                   # Unit tests for all components
.github/workflows/            # Automated agentic workflows
```

## 🤖 Agentic Evolution

This repository demonstrates autonomous code evolution through GitHub Actions workflows that:
- Review and fix code issues
- Transform and enhance functionality  
- Maintain code quality through automated testing
- Communicate through branches and issues

The `src/lib/main.js` file is the primary target for evolution, starting simple and growing more sophisticated over time.

## 📜 License

MIT - See [LICENSE](LICENSE) for details.

## 🔗 Links

- [intentïon agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib)
- [MISSION.md](MISSION.md)
- [Contributing Guidelines](CONTRIBUTING.md)
