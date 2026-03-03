# Formula Library and Templates

## Overview
Add built-in collection of common mathematical functions, scientific formulas, and curve templates accessible via short names and discovery commands. Transform plot-code-lib from expression-only to guided mathematical exploration tool with educational and productivity enhancements.

## Acceptance Criteria

### Formula Discovery Commands
List available formulas by category: plot-code-lib formulas --category trig
Search formulas by keyword: plot-code-lib formulas --search "wave"
Formula details with description and parameters: plot-code-lib formula gaussian --info
Example usage generation: plot-code-lib formula sine --example generates complete command

### Built-in Formula Library
Trigonometric functions: sine, cosine, tangent with frequency and phase options
Statistical distributions: gaussian, exponential, chi-squared, beta with parameter substitution
Wave functions: square-wave, sawtooth, triangle-wave with amplitude and period controls
Scientific curves: logistic-growth, exponential-decay, damped-oscillation with configurable constants

### Template-Based Plotting
Direct formula plotting: plot-code-lib formula gaussian --params "mu=0,sigma=1" -r "x=-4:4" -o normal.svg
Parameter substitution syntax supporting named constants and mathematical expressions
Range suggestion based on formula characteristics ensuring optimal visualization
Multiple formula comparison: plot-code-lib formula gaussian,exponential --params "sigma=1,lambda=1" -o comparison.svg

### Educational Integration
Formula metadata including mathematical description, common applications, and parameter meanings
Related formula suggestions encouraging mathematical exploration and learning
Formula validation ensuring parameter constraints are met with helpful error messages
Export formula definitions in JSON format for external documentation or teaching materials

## Technical Implementation
FormulaRegistry class managing library of predefined mathematical expressions with metadata
ParameterSubstitution engine for variable replacement in template expressions
Integration with existing ExpressionParser maintaining full MathJS compatibility
Enhanced CLI commands extending current Commander.js structure with formula subcommands

## Mission Alignment
Bridges gap between mathematical theory and practical visualization supporting educational workflows
Maintains jq simplicity while providing discovery mechanisms for complex mathematical expressions
Enables rapid prototyping of scientific visualizations without requiring deep mathematical syntax knowledge
Supports both educational exploration and professional scientific plotting requirements