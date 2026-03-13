# Example Generation

Generate and maintain a comprehensive examples directory with actual plot outputs, CLI command demonstrations, and usage patterns to showcase plot-code-lib capabilities.

## Purpose

Fulfill the mission requirement to "showcase all the features of the library via a CLI by dry running to generate example commands and output in the README.md file" by creating an automated system that generates real examples with actual plot outputs and keeps documentation current with working demonstrations.

## Acceptance Criteria

- Create examples/ directory structure with organized plot samples and commands
- Generate actual SVG and PNG plot files for common mathematical functions and use cases
- Add CLI flag --generate-examples to automatically create example plots and documentation
- Include example time series data exports in JSON and CSV formats alongside plots
- Create README section with embedded example outputs showing actual generated plots
- Add examples for all major mathematical function categories (trig, polynomial, log, exp)
- Include advanced examples demonstrating step size control, range specifications, and output formats
- Generate CLI usage examples with corresponding output files for verification
- Add automated example regeneration script for maintaining current examples
- Create example batch processing scripts for multiple expressions at once

## Technical Implementation

Add generateExamples function to main library that creates examples/ directory structure and generates sample plots for documented use cases. Add CLI flag support for example generation. Create build script that regenerates examples and updates README with actual output references. Add example validation to ensure generated files match documentation.

## Integration Points

- Extends existing CLI interface with --generate-examples flag
- Uses current mathematical expression parsing and plotting functionality 
- Integrates with existing SVG/PNG output capabilities and JSON/CSV export features
- Works with current README structure while adding actual output demonstrations
- Compatible with existing build process for automated example maintenance

## Example Usage

Generate all examples: node src/lib/main.js --generate-examples

Update README examples: npm run examples:generate

Validate examples: npm run examples:validate

Example output structure: examples/trigonometric/sine-wave.svg with corresponding examples/trigonometric/sine-wave.json