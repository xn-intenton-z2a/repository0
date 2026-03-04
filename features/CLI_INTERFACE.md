# Command Line Interface

## Overview

A comprehensive CLI tool that makes mathematical plotting accessible through terminal commands. Transforms plot-code-lib into "the jq of formulae visualizations" by providing powerful command-line access to plotting capabilities with sensible defaults and extensive customization options.

## Functionality

### Core Arguments
Essential plotting parameters:
- `--expression, -e`: Mathematical expression to plot
- `--range, -r`: X-axis range in format "min:max" or "x=min:max"
- `--file, -f`: Output file path with automatic directory creation
- `--help, -h`: Display comprehensive usage information

### Output Configuration  
Control plot appearance and format:
- `--format`: Output format (svg, png support planned)
- `--width`: Plot width in pixels (default 800)
- `--height`: Plot height in pixels (default 600)
- `--points`: Number of data points to sample (default 200)

### Visual Styling
Customizable plot appearance:
- `--bg`: Background color (default white)
- `--stroke`: Line color (default black) 
- `--fill`: Fill color (default none)
- `--stroke-width`: Line thickness (default 2)

### User Experience
Intuitive command-line experience:
- Clear error messages with helpful suggestions
- Automatic output directory creation
- Sensible defaults for quick plotting
- Consistent argument naming and shortcuts
- Help system with examples

## Acceptance Criteria

- Execute plots with simple commands like: `node src/lib/main.js -e "sin(x)" -r "-3:3" -f output.svg`
- Provide comprehensive help with `--help` flag
- Handle missing required arguments with helpful error messages
- Create output directories automatically when needed
- Support both long and short argument forms
- Return appropriate exit codes for success/failure
- Display progress information during plot generation

## Technical Requirements

- Pure Node.js implementation without external CLI frameworks
- Argument parsing compatible with Unix conventions
- Support piped input and scripted usage
- Exit codes following standard conventions (0=success, >0=error)
- UTF-8 output file support
- Cross-platform compatibility (Windows, macOS, Linux)