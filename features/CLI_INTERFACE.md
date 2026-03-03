# CLI_INTERFACE

Command-line interface that makes mathematical plotting accessible through terminal commands with comprehensive options and built-in examples.

## Overview

The CLI interface provides a user-friendly terminal-based workflow for generating plots from mathematical expressions. It serves as the primary user interaction layer and showcases the full capabilities of the plot-code-lib library through intuitive commands and comprehensive help.

## Key Capabilities

Core plotting command:
- `plot` command with expression, range, and output options
- Automatic file format detection from extension (.svg, .png)
- Flexible expression syntax support (both y=f(x) and f(x) formats)
- Range specification with intuitive x=-10:10,y=-5:5 syntax
- Configurable resolution through steps parameter
- Custom plot titles and output directories

User experience features:
- `examples` command showing real usage patterns
- Comprehensive help system with detailed option descriptions  
- Progress feedback during plot generation
- Clear error messages with actionable guidance
- Version information and library metadata
- Automatic directory creation for output files

Developer-friendly options:
- Verbose logging mode for debugging
- Custom step counts for precision control
- Override defaults for power users
- Shell-friendly exit codes and error handling
- Support for batch processing workflows

Integration capabilities:
- Designed as npm global install: `npm install -g plot-code-lib`
- Executable binary: `plot-code-lib` command available globally
- Node.js shebang for direct execution
- Cross-platform compatibility (Windows, macOS, Linux)

## Technical Requirements

Must use Commander.js for robust CLI argument parsing
Must provide helpful error messages for invalid inputs
Must support both shorthand (-e, -r, -f) and long-form (--expression) options
Must automatically create output directories when they don't exist
Must handle file permission errors gracefully
Must provide non-zero exit codes on failures for shell scripting
Must include comprehensive built-in examples covering common use cases

## Acceptance Criteria

Successfully install and run as global npm package
Successfully parse all command line options and arguments
Successfully generate plots with single command invocation
Successfully show helpful examples with examples command
Successfully display version and help information
Successfully handle file path creation and validation
Successfully provide clear error messages for invalid expressions
Successfully support both SVG and PNG output formats through file extension
Successfully handle edge cases like missing directories or permissions
Performance: CLI startup and command parsing under 100ms
Usability: new users can generate first plot within 30 seconds using help