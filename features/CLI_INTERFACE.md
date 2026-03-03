# Command Line Interface

## Overview  
Provide a comprehensive CLI using Commander.js that makes mathematical plotting accessible through terminal commands. Enable users to generate plots directly from command line with intuitive syntax following Unix philosophy principles.

## Acceptance Criteria

### Core Command Structure
- Main command: `plot-code-lib` with expression and range arguments
- Required options: --expression "sin(x)" --range "x=0:2*pi"
- Output specification: --output filename.svg or --output filename.png
- Auto-format detection from file extension (.svg/.png)
- Help and version information: --help, --version, plot-code-lib --help

### Mathematical Expression Interface
- Accept MathJS expressions as primary input format
- Support parametric mode: --parametric --x "cos(t)" --y "sin(t)" --range "t=0:2*pi"
- Polar coordinate mode: --polar --r "1+cos(theta)" --range "theta=0:2*pi"  
- Multi-function plotting: --expressions "sin(x),cos(x),tan(x)"
- Expression validation with clear error messages

### Output and Formatting Options
- Multiple format generation: --format svg,png for batch output
- Plot dimensions: --width 1024 --height 768 (maintains aspect ratio)
- Styling themes: --theme scientific|minimal|colorful
- Grid control: --grid, --no-grid for axis grid display
- DPI setting for PNG: --dpi 96|150|300

### Unix Integration Features
- Standard input support: echo "sin(x)" | plot-code-lib --range "x=0:10"
- Batch processing from file: --input expressions.txt --output-dir ./plots/
- Progress reporting: --verbose for detailed operation logging
- Quiet mode: --quiet to suppress non-essential output
- Proper exit codes: 0 success, 1 input error, 2 file error

### Advanced CLI Features
- Configuration file support: --config plot.config.json
- Range auto-detection: --auto-range for optimal viewing bounds  
- Interactive mode: --interactive for step-by-step plot building
- Dry run mode: --dry-run to show operations without execution
- Template generation: --template sine|parabola|circle for quick starts

## Technical Requirements
- Use Commander.js v9+ as the CLI framework
- Support both short (-e) and long (--expression) option formats
- Implement proper argument validation and type checking
- Cross-platform compatibility: Windows, macOS, Linux
- Tab completion support using Commander.js completion features

## Error Handling Strategy
- Validate mathematical expressions before processing
- Check file write permissions before plot generation
- Provide corrective suggestions for common input mistakes
- Clear error messages with examples of correct usage
- Graceful handling of mathematical domain errors

## Performance Considerations
- Stream processing for large coordinate datasets
- Progress callbacks for long-running operations
- Memory usage reporting in verbose mode
- Timeout handling for complex expression evaluation
- Efficient file I/O for batch processing operations

## Command Examples
```bash
# Basic function plotting
plot-code-lib --expression "sin(x)" --range "x=0:10" --output sine.svg

# Parametric curve plotting  
plot-code-lib --parametric --x "cos(t)" --y "sin(t)" --range "t=0:2*pi" --output circle.png

# Multiple function overlay
plot-code-lib --expressions "sin(x),cos(x)" --range "x=0:4*pi" --output trig.svg

# Polar coordinate plotting
plot-code-lib --polar --r "1+cos(theta)" --range "theta=0:2*pi" --output cardioid.svg

# Batch processing with styling
plot-code-lib --input functions.txt --output-dir ./plots/ --theme scientific --format svg,png

# Pipeline integration
echo "x^2" | plot-code-lib --range "x=-5:5" --output parabola.svg --quiet
```

## Integration with Mission
- Showcase all library features through CLI demonstrations
- Generate example commands and outputs for README.md documentation
- Provide template commands for common mathematical visualization tasks
- Enable "jq-like" pipeline workflows for mathematical data processing