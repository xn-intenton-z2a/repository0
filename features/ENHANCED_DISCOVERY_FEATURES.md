# Enhanced Discovery Features

Transform plot-code-lib into an intuitive, self-documenting CLI tool with rich help system and learning features that make mathematical plotting as discoverable as jq functionality.

## Purpose

Enhance plot-code-lib with comprehensive discovery features, examples, and educational content that help users learn mathematical plotting through interactive exploration and guided examples, following jq's philosophy of self-contained functionality.

## Acceptance Criteria

- Add --examples flag with curated mathematical plotting examples and explanations
- Include --functions flag listing mathematical functions with syntax and domain information
- Support --gallery flag showing popular mathematical curves with ready-to-run commands
- Implement --preview flag for quick ASCII art plot display in terminal without file output
- Add --validate flag to check expression syntax and range compatibility without plotting
- Include --template flag generating command templates for common mathematical scenarios
- Support enhanced error messages with specific syntax error locations and suggestions
- Add --random flag generating random mathematical expressions for exploration and learning
- Include short flag aliases: -e for --expression, -r for --range, -f for --file, -p for --preview
- Support auto-completion hints for mathematical functions and common range patterns

## Technical Implementation

Create comprehensive example database with categorized mathematical expressions. Implement ASCII plotting using simple character-based visualization. Add expression syntax validation with detailed error reporting. Build template generation system for common use cases.

## Integration Points

- Extends existing plotCLI function with enhanced help and discovery features
- Uses current ExpressionParser for syntax validation and error location reporting
- Builds on existing mathematical function library (mathjs) for function documentation
- Compatible with all current plotting functionality while adding educational layer
- Maintains backward compatibility with existing CLI argument structure

## Example Usage

Browse examples: node src/lib/main.js --examples

Function reference: node src/lib/main.js --functions trigonometric

Quick preview: node src/lib/main.js -e "y=sin(x)" -r "x=-pi:pi" -p

Gallery tour: node src/lib/main.js --gallery curves