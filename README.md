# @xn-intenton-z2a/repo

A JavaScript library for agentic workflow automation with CLI and HTTP server capabilities. This repository demonstrates the agentic-lib workflows and provides immediate utility through command-line tools.

## 🚀 Quick Start

### Install and Run with npx

```bash
# Show help information
npx @xn-intenton-z2a/repo --help

# Initialize agentic workflows
npx @xn-intenton-z2a/repo init

# Check workflow status
npx @xn-intenton-z2a/repo status

# Start HTTP server on port 3000
npx @xn-intenton-z2a/repo --serve

# Start HTTP server on custom port
npx @xn-intenton-z2a/repo --serve --port 8080 --host 0.0.0.0
```

## 📋 CLI Commands

### Basic Commands

- `init` - Initialize agentic workflows for current repository
- `status` - Show status of active workflows
- `list` - List available workflow types
- `create <type>` - Create new workflow of specified type
- `send <message>` - Send message through agentic communication system

### Server Mode

Start the HTTP server with `--serve`:

```bash
npx @xn-intenton-z2a/repo --serve --port 3000
```

#### REST API Endpoints

- `GET /health` - Health check endpoint
- `GET /status` - Get current workflow status  
- `GET /workflows` - List active workflows
- `POST /workflows` - Create new workflow
- `POST /messages` - Send communication message

### Options

- `-h, --help` - Show help message
- `-s, --serve` - Start HTTP server mode
- `-p, --port <port>` - Server port (default: 3000)
- `--host <host>` - Server host (default: localhost)
- `-v, --verbose` - Enable verbose output

## 🔧 Development

### Local Development

```bash
# Clone the repository
git clone https://github.com/xn-intenton-z2a/repo.git
cd repo

# Install dependencies
npm install

# Run tests
npm test

# Run CLI locally
npm run cli -- --help
npm run cli -- status

# Start server locally
npm run serve
```

### Project Structure

```
src/lib/
├── main.js                    # CLI entry point
├── agentic-lib.js            # Main agentic library
├── github-integration.js     # GitHub API integration
├── workflow-orchestrator.js  # Workflow management
└── communication-protocol.js # Inter-workflow communication

tests/unit/                   # Unit tests
.github/workflows/           # GitHub Actions workflows
```

## 🤖 Agentic Workflows

This repository is powered by [intentïon agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib), which provides:

1. **Autonomous Code Evolution**: GitHub workflows that continuously review, fix, and improve code
2. **Communication Protocol**: Workflows coordinate through branches and issues
3. **Mission-Driven Development**: Code evolves toward goals defined in `MISSION.md`

### Getting Started with Agentic Workflows

1. Write your mission in `MISSION.md`
2. Enable GitHub Actions
3. The agentic workflows will evolve `src/lib/main.js` toward your mission

## 🎯 Features

### ✅ CLI Core (`CLI_CORE`)
- **Command Line Interface**: Full-featured CLI with argument parsing
- **Help System**: Comprehensive `--help` with usage examples
- **Command Support**: `init`, `status`, `create`, `send`, `list` commands
- **Error Handling**: Graceful error handling with helpful messages

### ✅ HTTP Server (`HTTP_SERVER`)  
- **REST API**: HTTP server with workflow management endpoints
- **Configurable**: Custom port and host binding
- **CORS Support**: Cross-origin resource sharing enabled
- **Health Monitoring**: Built-in health check endpoint

## 📝 Examples

### Create and Monitor Workflows

```bash
# Initialize the system
npx @xn-intenton-z2a/repo init

# Create a code fix workflow
npx @xn-intenton-z2a/repo create fix-code

# Check status
npx @xn-intenton-z2a/repo status

# Send status update
npx @xn-intenton-z2a/repo send "Workflow ready for review"
```

### Server Integration

```bash
# Start server
npx @xn-intention-z2a/repo --serve --port 3000 &

# Check health
curl http://localhost:3000/health

# Get status
curl http://localhost:3000/status

# Create workflow via API
curl -X POST http://localhost:3000/workflows \
  -H "Content-Type: application/json" \
  -d '{"type": "fix-code", "description": "Fix linting issues"}'
```

## 🔗 Links

- [intentïon agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib)
- [Mission Statement](MISSION.md)
- [Contributing Guidelines](CONTRIBUTING.md)

## 📜 License

MIT License - see [LICENSE](LICENSE) for details.
