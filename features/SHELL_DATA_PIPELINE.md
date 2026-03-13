# Shell Data Pipeline Integration

Enable mathematical expression evaluation on input data streams, making plot-code-lib a composable tool in Unix-style data processing pipelines.

## Purpose

Position plot-code-lib as a mathematical transformation tool in shell workflows, similar to how jq processes JSON. Users can pipe data through mathematical expressions and continue processing in data analysis pipelines.

## Acceptance Criteria

- Add --stdin flag to read CSV or JSON data from stdin
- Support mathematical expressions with column references (e.g., "y=sin(x_column)")  
- Process input data through expressions and output transformed results
- Support --stdout flag for pipeline output without file creation
- Handle CSV headers and maintain column structure in output
- Process JSON arrays with mathematical transformations
- Enable filtering operations based on mathematical results
- Maintain memory efficiency for reasonable dataset sizes

## Technical Implementation

Add stdin reading to CLI interface. Extend ExpressionParser to handle column references from input data. Add data transformation logic that applies expressions to input columns and generates output.

## Integration Points

- Extends existing CLI with data processing capabilities
- Uses current ExpressionParser with column reference support  
- Integrates with existing export formats for consistent output
- Works alongside existing plotting functionality

## Example Usage

Transform CSV data with mathematical expressions:
cat data.csv | node src/lib/main.js --stdin --expression "transformed_y=sin(x)" --stdout --format csv

Process JSON arrays through mathematical functions:
echo '[{"x":1,"value":10},{"x":2,"value":20}]' | node src/lib/main.js --stdin --expression "y=log(value)" --stdout --format json

Chain with other Unix tools for data analysis:
cat measurements.csv | node src/lib/main.js --stdin --expression "normalized=(value-3.14)/2" --stdout --format csv | sort -t, -k2 -n