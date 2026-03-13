# Shell Data Pipeline Integration

Enable mathematical formula visualization as part of shell-based data processing workflows, making plot-code-lib the "jq of formulae visualisations" through seamless Unix pipeline integration.

## Purpose

This feature positions plot-code-lib as a core tool in shell-based data analysis workflows, enabling mathematical expression evaluation and visualization within Unix pipelines, similar to how jq processes JSON data.

## Acceptance Criteria

- Accept input data from stdin in CSV or JSON format for processing
- Support mathematical transformations on existing data columns  
- Enable expression evaluation over input datasets with column references
- Provide --stdin flag to read input data from pipes
- Support column mapping syntax for data transformations (e.g., new_y=sin(existing_x))
- Output processed data to stdout for further pipeline processing
- Handle large datasets efficiently in streaming fashion
- Support filtering and aggregation operations on mathematical results
- Provide compact output modes for pipeline efficiency
- Include header preservation and CSV/JSON format consistency

## Technical Implementation

Add stdin reading capabilities to CLI interface. Extend ExpressionParser to handle column references from input data. Implement streaming data processing for memory efficiency. Add data transformation and filtering logic.

## Integration Points

- Extends existing CLI with stdin data processing capabilities
- Uses current expression parsing with data column references
- Integrates with export formats for pipeline output consistency
- Maintains existing file-based plotting capabilities
- Enables integration with shell data analysis workflows

## Example Usage

```
# Transform existing data with mathematical expressions
cat data.csv | node src/lib/main.js --stdin --expression "new_y=sin(x)" --stdout --format csv

# Process JSON data from API and visualize
curl api/data.json | node src/lib/main.js --stdin --expression "y=log(value)" --file plot.svg

# Chain with jq for complex data workflows  
jq '.timeseries[]' data.json | node src/lib/main.js --stdin --expression "smoothed=sin(x)*0.9" --stdout | jq 'select(.smoothed > 0)'

# Statistical transformations in pipelines
cat measurements.csv | node src/lib/main.js --stdin --expression "normalized=(value-mean)/std" --stdout --format csv
```

## Data Processing Capabilities

Supports mathematical transformations, statistical operations, and formula-based filtering within shell pipelines, enabling mathematical visualization as a composable tool in data analysis workflows.