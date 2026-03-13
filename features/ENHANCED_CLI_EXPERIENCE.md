# Enhanced CLI Experience

Improve the command-line interface with better help, examples, and user-friendly features to make plot-code-lib as intuitive as jq for mathematical plotting.

## Purpose

Transform plot-code-lib into a polished command-line tool with excellent discoverability, comprehensive help system, and user-friendly error messages that make mathematical plotting as approachable as JSON processing with jq.

## Acceptance Criteria

- Enhance --help with comprehensive examples and common patterns
- Add --examples flag showcasing typical mathematical plotting workflows
- Include --functions flag listing all available mathematical functions with descriptions  
- Implement helpful error messages with suggestions for common mistakes
- Add --preview flag for quick ASCII art plot preview without file generation
- Support --template flag generating example command templates
- Include expression syntax validation with specific error location reporting
- Add --dry-run flag to validate all inputs without creating output files
- Support short flag aliases (-e, -r, -f) for common options
- Include command completion hints in error messages

## Technical Implementation

Extend existing CLI parser with enhanced help system and validation. Create example database with common mathematical expressions and use cases. Add ASCII text plotting for terminal preview functionality. Implement detailed error reporting that shows exact syntax error locations.

## Integration Points

- Builds on existing CLI interface in main.js plotCLI function
- Uses current ExpressionParser for enhanced error reporting
- Works with existing PlotRenderer for all output formats
- Compatible with current file saving and path handling
- Maintains full backward compatibility with existing command syntax

## Example Usage

Enhanced help: node src/lib/main.js --help

Show examples: node src/lib/main.js --examples

Quick preview: node src/lib/main.js -e "y=sin(x)" -r "x=-pi:pi" --preview

List functions: node src/lib/main.js --functions