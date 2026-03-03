# Command Line Interface

## Overview
Production-ready CLI tool using Commander.js that transforms mathematical expressions into publication-quality plots. Implements the jq philosophy for mathematical visualization with intuitive Unix-style command patterns.

## Acceptance Criteria

### Core Commands IMPLEMENTED
Standard plotting with comprehensive options:
- plot-code-lib plot -e "sin(x)" -r "x=0:2*pi" -o output.svg
- plot-code-lib parametric -x "cos(t)" -y "sin(t)" -r "t=0:2*pi" -o circle.png

Automatic output format detection from file extension (.svg/.png)
Full customization: --title, --width, --height, --xlabel, --ylabel
Range specifications: "x=start:end" or "x=start:end:step" with MathJS evaluation
Expression validation with clear error messages

### Production Quality Features IMPLEMENTED  
Commander.js v12 integration with proper help system
Cross-platform Node.js 24+ compatibility
Memory-efficient coordinate generation for large datasets
Sharp library PNG conversion maintaining aspect ratios
Error handling for mathematical domain violations and invalid syntax

### Advanced Mathematical Support IMPLEMENTED
MathJS expression engine supporting full mathematical function library
Mathematical constants (pi, e) with high precision
Complex operator precedence and parentheses handling
Parametric curve generation with separate x(t) and y(t) expressions
GeoJSON coordinate output format for data interchange

## Technical Implementation
Built on proven libraries: Commander.js, MathJS, D3.js, Sharp
Expression compilation caching for performance optimization
SVG generation using D3.js with mathematically accurate scaling
Robust range parsing supporting mathematical expressions in bounds
Domain validation preventing crashes on mathematical edge cases

## Current Working Examples
```bash
# Standard function plots
plot-code-lib plot -e "sin(x)" -r "x=0:2*pi" -o sine.svg
plot-code-lib plot -e "x^2 - 4*x + 3" -r "x=-2:6" -o quadratic.png

# Parametric curves  
plot-code-lib parametric -x "cos(t)" -y "sin(t)" -r "t=0:2*pi" -o circle.svg
plot-code-lib parametric -x "t" -y "t^2" -r "t=-3:3:0.1" -o parabola.png

# Publication ready plots
plot-code-lib plot -e "exp(-x^2/2)" -r "x=-4:4" -o gaussian.svg --title "Gaussian Distribution" --width 1200 --height 800 --xlabel "Standard Deviations" --ylabel "Probability Density"
```

## Mission Alignment
Fully implements core mission: "Be the jq of formulae visualisations"
Transforms expressions to coordinate data to publication plots
Provides Unix-style command interface with composable options
Ready for production mathematical visualization workflows