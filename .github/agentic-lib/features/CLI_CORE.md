# CLI_CORE ✅

## Overview

Transform the basic main.js entry point into a fully functional CLI tool that provides immediate utility through command-line interface capabilities. This feature enables users to run the package with npx and access core agentic workflow functionality directly from the terminal.

**Status: ✅ IMPLEMENTED**

## Acceptance Criteria

### ✅ Command Line Interface
- ✅ Accept and parse command line arguments using robust argument parser
- ✅ Provide --help flag that displays usage information and available commands
- ✅ Support short and long form options (-h/--help, -s/--serve, -p/--port, etc.)
- ✅ Handle invalid arguments with helpful error messages

### ✅ Core Commands
- ✅ `init` - Initialize agentic workflows for current repository  
- ✅ `status` - Show status of active workflows
- ✅ `list` - List available workflow types
- ✅ `create <type>` - Create new workflow of specified type
- ✅ `send <message>` - Send message through agentic communication system

### ✅ Configuration Options
- ✅ `--port` option to specify custom port for server mode
- ✅ `--host` option to bind to specific network interface  
- ✅ `--verbose` flag for detailed output
- ✅ Proper validation of port numbers (1-65535 range)

### ✅ Error Handling
- ✅ Graceful error handling with user-friendly messages
- ✅ Proper exit codes (0 for success, 1 for errors)
- ✅ Input validation for all command options
- ✅ Comprehensive help system with examples

## Implementation Details

### Main Entry Point
- **File**: `src/lib/main.js`
- **Executable**: ✅ Shebang line for direct execution
- **ES Modules**: ✅ Full ES module support
- **Async/Await**: ✅ Modern async patterns throughout

### Package Configuration  
- **Bin Field**: ✅ Added `"agentic-repo"` binary to package.json
- **Scripts**: ✅ Added `cli` and `serve` npm scripts
- **Dependencies**: ✅ Integrated with existing agentic-lib dependency

### Test Coverage
- **File**: `tests/unit/main.test.js`
- **Coverage**: ✅ 18 test cases covering all CLI functionality
- **Mocking**: ✅ Console output and process.exit mocked properly
- **Commands**: ✅ All command paths tested
- **Error Cases**: ✅ Invalid inputs and error conditions tested

## Usage Examples

```bash
# Basic usage
npx @xn-intenton-z2a/repo --help
npx @xn-intenton-z2a/repo status

# Workflow management
npx @xn-intenton-z2a/repo init
npx @xn-intenton-z2a/repo create fix-code
npx @xn-intenton-z2a/repo send "Ready for review"

# Server mode (see HTTP_SERVER feature)  
npx @xn-intenton-z2a/repo --serve --port 3000
```

## Integration with HTTP_SERVER

This feature works seamlessly with the HTTP_SERVER feature to provide both CLI and web API interfaces for the same underlying agentic workflow functionality.mmands
- Provide --version flag that displays the current package version
- Support subcommands: init, status, create, and message as outlined in library documentation
- Handle invalid commands gracefully with helpful error messages

### Core Commands Implementation
- init command initializes agentic workflows for the current repository
- status command displays current workflow status and system health
- create command allows creation of new agentic workflows with configuration options
- message command enables sending messages through agentic communication channels

### User Experience
- All commands provide clear, actionable output
- Error messages include suggestions for resolution
- Commands execute quickly without unnecessary delays
- Support both interactive and non-interactive execution modes

### Integration Requirements
- Leverage existing AgenticLib class and its methods from agentic-lib.js
- Maintain compatibility with existing GitHub integration layer
- Use workflow orchestrator for command execution
- Follow established communication protocol patterns

## Implementation Notes

The CLI should be the primary interface for users to interact with agentic workflows. Each command maps directly to core AgenticLib functionality, making the library immediately useful for repository automation and workflow management.

Commands should be self-contained and not require complex setup beyond GitHub token configuration. The tool must deliver immediate value to users managing agentic workflows in their repositories.