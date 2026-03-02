# CLI_CORE

## Overview

Transform the basic main.js entry point into a fully functional CLI tool that provides immediate utility through command-line interface capabilities. This feature enables users to run the package with npx and access core agentic workflow functionality directly from the terminal.

## Acceptance Criteria

### Command Line Interface
- Accept and parse command line arguments using a robust argument parser
- Provide --help flag that displays usage information and available commands
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