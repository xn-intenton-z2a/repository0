# Range Evaluation Engine

Evaluate mathematical functions over numeric ranges to generate data points for plotting.

## Functionality

Take a parsed mathematical function and evaluate it over a specified numeric range with given step size. Parse range strings in format "start:step:end" and generate arrays of coordinate pairs.

## Range Format

Accept range strings like "-3.14:0.01:3.14" where:
- First value is start point
- Second value is step increment  
- Third value is end point
Generate approximately (end - start) / step data points.

## Error Handling

Skip data points that evaluate to NaN or infinite values. Continue evaluation even when individual points fail. Provide meaningful error messages for invalid range formats.

## API Design

```javascript
export function parseRange(rangeString) {
  // Returns { start, step, end }
}

export function evaluateOverRange(func, start, step, end) {
  // Returns array of { x, y } objects
}
```

## Acceptance Criteria

- Parse range string "-3.14:0.01:3.14" correctly
- Evaluate Math.sin over range to produce ~628 points
- Skip invalid points (NaN, Infinity) gracefully
- Return array of objects with x and y properties
- Handle edge cases like zero step size
- Validate range parameters are numeric
- Support negative start/end values