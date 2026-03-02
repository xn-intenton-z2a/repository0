# Time Series Generation

## Overview

Generate time series data points from mathematical expressions within specified ranges. This feature takes parsed mathematical expressions and range specifications to create arrays of coordinate pairs that represent the function values across the specified domain.

## Acceptance Criteria

- Accept range specifications in formats like "x=-10:10" or "x=-π:π,y=-2:2"
- Generate evenly spaced x values across the specified range
- Apply the parsed expression to generate corresponding y values
- Support configurable step size or point count for sampling resolution
- Handle range validation to ensure min < max
- Filter out invalid points like NaN or infinity values
- Export time series data in a standard format compatible with plotting libraries

## Implementation Requirements

- Parse range strings to extract min, max values for x axis
- Support mathematical constants in ranges like π, e
- Generate arrays of [x, y] coordinate pairs
- Allow specification of sample count or step size
- Validate that generated points are within reasonable bounds
- Handle discontinuous functions by detecting and managing breaks
- Support both inclusive and exclusive range boundaries

## Usage Examples

The feature enables conversion of expressions and ranges into plottable data sets.

Range "x=-5:5" with expression "y=x^2" generates 100 points from (-5,25) to (5,25)
Range "x=0:2π" with expression "y=sin(x)" generates a complete sine wave cycle
Range "x=-10:10" with expression "y=1/x" handles discontinuity at x=0 gracefully