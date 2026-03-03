# Command Line Interface

## Overview

Complete CLI tool that integrates all library features into a user-friendly command-line interface. This makes the library accessible as a standalone tool for quick mathematical visualization tasks, positioning it as "the jq of formulae visualisations."

## Acceptance Criteria

### Core Commands
- Main plotting command: `--expression "y=sin(x)" --range "x=-pi:pi" --output plot.svg`
- Help system with `--help` flag showing usage examples
- Version information with `--version` flag
- Verbose output with `--verbose` flag for debugging

### Input Options
- Expression input via `--expression` or `-e` flag
- Range specification via `--range` or `-r` flag
- Input file support: `--input data.json` for pre-generated data
- Batch processing: `--batch expressions.txt`

### Output Options
- Output file specification: `--output` or `-o` flag
- Format selection: `--format svg|png`
- Size control: `--width 800 --height 600`
- Quality settings for PNG output

### Advanced Features
- Dry run mode: `--dry-run` to show what would be generated
- Example generation: `--examples` to output sample commands
- Watch mode: `--watch` to regenerate on file changes
- Server mode: `--serve` for HTTP API endpoints

### Error Handling
- Clear error messages for invalid expressions
- Helpful suggestions for common mistakes
- Validation of file paths and permissions
- Graceful handling of mathematical domain errors

## Implementation Notes

Use `commander.js` or similar CLI framework. Integrate all other features through clean API calls. Focus on excellent user experience with clear documentation and helpful error messages.

## API Design

Create a main CLI entry point that orchestrates calls to expression parsing, time series generation, and plot rendering features based on command-line arguments.