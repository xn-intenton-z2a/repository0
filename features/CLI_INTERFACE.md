# Command Line Interface

Provide a comprehensive command-line interface that makes the plot library accessible as a standalone tool for generating mathematical plots.

## Purpose

This feature implements the CLI functionality that allows users to generate plots directly from the command line using flags for expression, range, and output file specification. The CLI should be intuitive and follow standard command-line conventions.

## Acceptance Criteria

- Support --expression flag for mathematical expressions
- Support --range flag for domain specification
- Support --file flag for output filename (SVG or PNG based on extension)
- Provide --help flag with usage examples and documentation
- Support --version flag for version information
- Handle invalid arguments with clear error messages
- Support stdin input for batch processing expressions
- Provide verbose output option for debugging
- Support configuration files for common settings
- Generate example commands in README with actual output

## Technical Implementation

The CLI should extend the existing main.js structure to parse command-line arguments and coordinate between the expression parser, data generator, and plot renderer components. Arguments should be validated before processing.

## Integration Points

- Extends existing main() function in src/lib/main.js
- Coordinates all other features (parser, generator, renderer)
- Provides examples and documentation in README.md
- Web interface demonstrates same functionality as CLI
- Error handling provides helpful guidance for users

## Example Usage

```
// Basic plot generation
node src/lib/main.js --expression "y=sin(x)" --range "x=-pi:pi" --file sine.svg
node src/lib/main.js --expression "y=x^2+1" --range "x=-3:3,step=0.1" --file parabola.png

// Help and version
node src/lib/main.js --help
node src/lib/main.js --version

// Verbose output for debugging
node src/lib/main.js --expression "y=log(x)" --range "x=0.1:10" --file log.svg --verbose
```

## Documentation

The CLI should be fully documented with examples in the README.md file, showing various mathematical functions and their rendered output. Users should be able to copy-paste examples and immediately generate plots.

## Error Handling

Clear error messages for common issues like invalid expressions, impossible ranges, unsupported file formats, or file system permissions. Errors should suggest corrections when possible.