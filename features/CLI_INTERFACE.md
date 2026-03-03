# Command Line Interface

## Overview

Provide a comprehensive CLI that integrates all library features, making the plot-code-lib accessible as a standalone tool for generating mathematical plots from the command line.

## Acceptance Criteria

### Command Structure
- Main command format: `node run start -- [options]`
- Support for all core operations through command line flags
- Consistent parameter naming and intuitive syntax
- Help documentation and usage examples

### Core Parameters
- --expression: Mathematical expression to plot (required)
- --range: Range specification for x values (required)  
- --file: Output file path (required)
- --format: Output format (svg, png, default: svg)
- --width, --height: Plot dimensions (optional)
- --title: Plot title (optional)

### Advanced Options
- --points: Number of data points to generate
- --grid: Enable/disable grid lines
- --color: Line color specification
- --verbose: Detailed operation logging
- --dry-run: Show what would be executed without running

### Error Handling
- Clear error messages for invalid expressions
- Range validation with helpful feedback
- File permission and path validation
- Graceful handling of mathematical edge cases

## Implementation Notes

- Use commander.js or similar CLI framework for argument parsing
- Integrate all previous features: parser, generator, renderer
- Provide extensive help and examples
- Support both interactive and batch processing modes
- Design for scriptability and automation

## Examples

Basic usage:
```
node run start -- --expression "y=sin(x)" --range "x=0:6.28" --file sine_wave.svg

node run start -- --expression "y=x^2 + 2*x + 1" --range "x=-5:5:0.1" --file parabola.png --format png

node run start -- --expression "y=cos(2*pi*x)" --range "x=0:2" --file cosine.svg --title "Cosine Function" --width 1000 --height 600
```

Help and validation:
```
node run start -- --help
node run start -- --expression "invalid)" --range "x=0:1" --file test.svg  # Should show clear error
```

Dry run mode:
```
node run start -- --expression "y=sin(x)" --range "x=0:6.28" --file output.svg --dry-run
```

## Dependencies

- Integration with all other features
- CLI argument parsing library (commander.js)
- File system validation utilities
- Logging and error reporting framework