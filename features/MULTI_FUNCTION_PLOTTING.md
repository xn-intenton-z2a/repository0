# Multi Function Plotting

Plot multiple mathematical expressions on the same coordinate system with different colors and line styles to compare functions visually.

## Purpose

This feature extends the plotting capabilities to support multiple mathematical expressions on a single plot, enabling users to compare different functions, visualize function transformations, or show mathematical relationships between expressions. Currently the CLI accepts multiple --expression flags but only renders the last one.

## Acceptance Criteria

- Accept multiple --expression flags in CLI and render all functions  
- Render each function with different colors and line styles
- Support function labels and legends on plots
- Handle different domains per function gracefully
- Provide clear color coding in both SVG and PNG outputs
- Support up to 6 different functions per plot with distinct styling
- Include legend showing function expressions and colors
- Auto-scale axes to fit all functions appropriately
- Handle functions with different mathematical domains
- Support custom colors through CLI options

## Technical Implementation

Extend the CLI argument parsing to collect multiple expressions into an array. Modify PlotRenderer to accept arrays of data series and render them with distinct visual properties using a predefined color palette.

## Integration Points

- Fix CLI interface to handle multiple --expression flags correctly
- Enhance PlotRenderer to support multi-series plotting with color coding
- Web interface provides multiple expression input fields
- Legend generation integrates with SVG and PNG output
- Color management ensures visual distinction between functions

## Example Usage

```
# Plot sine and cosine together
node src/lib/main.js --expression "y=sin(x)" --expression "y=cos(x)" --range "x=-pi:pi" --file trig.svg

# Compare polynomial degrees  
node src/lib/main.js --expression "y=x" --expression "y=x^2" --expression "y=x^3" --range "x=-2:2" --file polynomials.png

# Function transformations
node src/lib/main.js --expression "y=sin(x)" --expression "y=2*sin(x)" --expression "y=sin(2*x)" --range "x=0:2*pi" --file transformations.svg
```

## Visual Design

Each function should use a distinct color from a predefined palette (blue, red, green, orange, purple, brown). Line styles can vary (solid, dashed, dotted) when more than 6 functions are plotted. Legend should be positioned to not obstruct the plot area.