# CLI Toolkit

## Overview

Transform the basic main.js into a robust CLI toolkit with argument parsing, help text, version display, and command validation. This feature provides the foundation for making the library immediately useful as an npx-runnable tool.

## User Value

Users can immediately invoke the package with npx and receive helpful feedback, version information, and structured command handling. This transforms a basic script into a professional CLI tool that follows standard conventions.

## Implementation Status

✅ **COMPLETED** - Full CLI toolkit implemented with:

### Features Delivered
- **Argument Parsing**: Comprehensive parsing of commands, flags, and options
- **Help System**: Professional help text with usage examples
- **Version Display**: Version information from package.json
- **Command Structure**: Organized command system (help, version, start, serve)
- **Error Handling**: Proper error messages for unknown commands
- **NPX Ready**: Configured bin field for immediate npx execution

### Commands Available
| Command | Description | Options |
|---------|-------------|---------|
| `help` | Show comprehensive help message | |
| `version` | Display version information | |
| `start` | Start the main application | |
| `serve` | Start development server | `--port`, `--host` |

### Flags and Options
- `-h, --help`: Show help
- `-v, --version`: Show version  
- `-p, --port <PORT>`: Port number
- `--host <HOST>`: Host address
- `--serve`: Start development server

### Usage Examples
```bash
npx @xn-intenton-z2a/repo --help
npx @xn-intenton-z2a/repo --version  
npx @xn-intenton-z2a/repo start
npx @xn-intenton-z2a/repo serve --port 8080
```

## Technical Implementation

- Modern ES modules with proper shebang
- Robust argument parsing without external dependencies
- Dynamic version reading from package.json
- Professional help text formatting
- Comprehensive test coverage (12 test cases)
- Error handling with appropriate exit codesions.

## Acceptance Criteria

- Parse command line arguments using a simple built-in approach without external dependencies
- Display version information when --version or -v flags are provided  
- Show comprehensive help text when --help or -h flags are provided
- Validate commands and provide helpful error messages for invalid usage
- Support both short and long flag formats
- Maintain backwards compatibility with existing argument handling
- Include usage examples in help output
- Handle edge cases like empty arguments gracefully

## Implementation Notes

- Use process.argv parsing without adding heavy dependencies
- Version should be read from package.json dynamically
- Help text should include examples of common usage patterns
- Error messages should be clear and actionable
- Exit codes should follow standard conventions (0 for success, 1 for errors)

## Testing Requirements

- Unit tests for argument parsing logic
- Tests for version display functionality
- Tests for help text generation
- Tests for error handling with invalid arguments
- Integration tests for CLI invocation scenarios