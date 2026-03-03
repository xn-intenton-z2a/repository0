# Command Line Interface

## Overview  
Provide a comprehensive CLI using Commander.js that makes mathematical plotting accessible through terminal commands. Enable users to generate plots directly from command line with intuitive syntax following Unix philosophy principles.

## Acceptance Criteria

### Current Implementation Status
- IMPLEMENTED: Basic plot command with --expression, --range, --output options
- IMPLEMENTED: Parametric plotting with separate x/y expressions
- IMPLEMENTED: SVG and PNG output format auto-detection from file extension
- IMPLEMENTED: Plot customization: --title, --width, --height, --xlabel, --ylabel
- MISSING: Polar coordinate mode and multi-function overlay
- MISSING: Batch processing and pipeline input capabilities

### Core Command Structure 
- Main commands: `plot-code-lib plot` and `plot-code-lib parametric`
- Standard plotting: plot -e "sin(x)" -r "x=0:2*pi" -o plot.svg
- Parametric plotting: parametric -x "cos(t)" -y "sin(t)" -r "t=0:2*pi" -o circle.svg
- Output format detection from .svg or .png extension
- Help and version: --help, --version

### Essential Missing Features for Mission Alignment
- Polar coordinate mode: --polar command for r(theta) expressions
- Multi-function plotting: --expressions flag for overlaying multiple functions
- Pipeline integration: stdin support for expression input
- Batch processing: --input file for processing multiple expressions
- Data export: --format geojson for exporting coordinate data

### Output and Styling Capabilities
- SVG vector output (default, scalable for publication)
- PNG raster output with Sharp-based conversion
- Configurable dimensions with --width and --height
- Axis labeling with --xlabel and --ylabel options
- Plot titles with --title option

### Performance and Usability
- Fast expression evaluation using MathJS compilation
- Error handling for invalid expressions and mathematical domain errors
- Cross-platform compatibility (Node.js 24+)
- Memory-efficient coordinate generation for large ranges

## Technical Implementation
- Uses Commander.js v12 for CLI framework
- MathJS integration for expression parsing and evaluation
- D3.js for SVG generation with proper mathematical scaling
- Sharp library for high-quality PNG conversion
- GeoJSON coordinate format for data interchange

## Current Command Examples
```bash
# Basic function plotting
plot-code-lib plot -e "sin(x)" -r "x=0:2*pi" -o sine.svg

# Parametric curve (circle)
plot-code-lib parametric -x "cos(t)" -y "sin(t)" -r "t=0:2*pi" -o circle.png

# Customized plot with labels and dimensions
plot-code-lib plot -e "x^2" -r "x=-5:5" -o parabola.svg --title "Parabola" --width 1200 --height 800
```

## Priority Enhancements Needed
1. Add polar coordinate plotting capability
2. Implement multi-function overlay support
3. Add pipeline input from stdin for jq-like workflows
4. Support batch processing from input files
5. Enable GeoJSON data export for coordinate sharing