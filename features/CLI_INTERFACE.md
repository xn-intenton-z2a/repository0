# Command Line Interface

## Overview
Provide a comprehensive CLI tool that makes mathematical plotting accessible through terminal commands. Enable users to generate plots directly from command line with intuitive syntax and powerful options.

## Acceptance Criteria

### Core Commands
- Generate plots from expressions: --expression "sin(x)" --range "x=0:2*pi"
- Output file specification: --output plot.svg or --output plot.png
- Multiple format support: --format svg,png for batch generation
- Help and usage information: --help, --version

### Advanced Options  
- Custom plot dimensions: --width 1024 --height 768
- Styling presets: --theme scientific|minimal|colorful
- Range specification: --range "x=-5:5:0.1,y=-2:2"
- Batch processing: multiple expressions or input files

### Integration Features
- Pipe support for Unix-style workflows
- Configuration file support for complex setups
- Progress reporting for long operations
- Verbose and quiet modes for different use cases

### Error Handling
- Clear error messages with suggestions
- Validation of all input parameters
- Graceful handling of file system errors
- Exit codes for scripting integration

## Technical Requirements
- Use commander.js or similar CLI framework
- Support both short and long option formats
- Tab completion support where possible
- Cross-platform compatibility (Windows, macOS, Linux)

## Command Examples
```bash
# Basic plot generation
plot-code-lib --expression "sin(x)" --range "x=0:10" --output sine.svg

# Multiple formats
plot-code-lib --expression "x^2" --range "x=-5:5" --format svg,png

# Advanced styling
plot-code-lib --expression "cos(x)*exp(-x/10)" --theme scientific --width 1200

# Batch processing
plot-code-lib --input expressions.txt --output-dir ./plots/

# Piped workflow
echo "sin(x)+cos(2*x)" | plot-code-lib --range "x=0:4*pi" --output combined.svg
```

## Documentation Integration
- Generate example commands and outputs for README
- Showcase all library features through CLI usage
- Demonstrate mathematical expression capabilities
- Provide template commands for common use cases