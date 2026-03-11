# Input Validation

Comprehensive input validation and error handling for all Hamming distance functions.

## Requirements

Implement robust input validation with clear error messages:

- Type checking for string and integer parameters
- Length validation for string inputs
- Range validation for integer inputs
- Consistent error types and messages across functions
- Detailed error information for debugging

## Acceptance Criteria

- TypeError thrown for wrong parameter types with descriptive message
- RangeError thrown for invalid ranges with context
- Error messages include parameter names and expected types
- All validation occurs before computation begins
- Edge cases like null, undefined, NaN handled appropriately
- Error handling tested in unit tests
- Website demo shows validation errors to users gracefully

## Error Messages

- "Expected string, got {type}" for type errors
- "String lengths must be equal: got {len1} and {len2}" for length errors  
- "Expected non-negative integer, got {value}" for range errors
- "Expected integer, got {type}" for non-integer numbers

## Implementation Notes

- Create helper functions for common validations
- Use Object.prototype.toString.call for reliable type checking
- Check Number.isInteger for integer validation
- Validate parameters in order they appear in function signature
- Ensure all functions fail fast on invalid input