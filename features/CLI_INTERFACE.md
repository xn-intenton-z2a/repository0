# CLI Interface

## Overview

Provide a command-line interface that orchestrates all plotting functionality through simple, intuitive commands. This feature makes the plot library accessible as a standalone CLI tool that can be used in scripts, automation, or interactive workflows.

## Acceptance Criteria

- Support command line arguments for expression, range, and output file specification
- Implement flags for different output formats (SVG, PNG)
- Provide help documentation and usage examples via --help flag
- Support batch processing of multiple expressions or files
- Include validation and meaningful error messages for invalid inputs
- Enable piping and integration with other command-line tools
- Support configuration via environment variables or config files

## Implementation Requirements

- Use a command-line argument parsing library like yargs or commander
- Support the core command pattern: --expression "y=sin(x)" --range "x=-π:π" --file output.svg
- Implement subcommands for different modes: plot, validate, batch
- Provide verbose and quiet modes for different levels of output
- Support stdin input for expression lists or data files
- Include version information and diagnostic commands
- Generate example commands and showcase all features in help output

## Usage Examples

The CLI enables users to generate plots directly from the command line with simple, memorable commands.

node src/lib/main.js --expression "y=sin(x)" --range "x=-10:10" --file sine.svg
node src/lib/main.js --expression "y=x^2" --range "x=-5:5" --format png --file parabola.png
node src/lib/main.js --help shows comprehensive usage documentation
node src/lib/main.js --validate "y=invalid(" checks expression syntax without plotting