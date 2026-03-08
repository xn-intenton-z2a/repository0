# WEB_DEMO

## Summary
Create an interactive web demonstration of the FizzBuzz library functions that allows users to input numbers and see real-time FizzBuzz results. The web interface should be simple, accessible, and showcase both fizzBuzz(n) and fizzBuzzSingle(n) functions with clear examples and error handling.

## Rationale
A web demonstration makes the FizzBuzz library accessible to users who want to try it without installing or running code locally. It provides immediate visual feedback, validates the library functions work correctly, and serves as living documentation that stays in sync with the actual implementation.

## Specification
- Interactive web page in src/web/ that imports and uses the FizzBuzz library functions
- Two main sections: single number testing and range testing
- Single number input: text field where users enter a number to see fizzBuzzSingle result
- Range input: text field where users enter n to see fizzBuzz(n) array results
- Real-time validation and error display for invalid inputs
- Clear visual formatting of results with appropriate styling
- Responsive design that works on desktop and mobile devices

## Behavioural Details
- Input validation mirrors the library: show TypeError for non-integers, RangeError for invalid ranges
- Results update immediately as user types (debounced to avoid excessive computation)
- Array results display as a formatted list or grid for easy reading
- Error messages are user-friendly but technically accurate
- Examples and usage hints are prominently displayed
- Page works without JavaScript build tools - uses ES modules directly

## Examples and Interface Elements
- Header: "FizzBuzz Library Demo"
- Single Number Section:
  - Input field labeled "Enter a number (1 or greater)"
  - Live result display showing the fizzBuzzSingle output
  - Example buttons for common cases (3, 5, 15, 7)
- Range Section:
  - Input field labeled "Enter range size (0 or greater)"
  - Scrollable results area showing the fizzBuzz array
  - Limit display to reasonable range (e.g., max 100) with option to show more
- Error handling displays clear messages for invalid inputs

## Tests and Acceptance Criteria
Behaviour tests shall verify the web interface works correctly:
- Page loads without errors and displays both input sections
- Single number inputs produce correct fizzBuzzSingle results
- Range inputs produce correct fizzBuzz arrays
- Invalid inputs display appropriate error messages
- Example buttons work and populate expected results
- Results update in real-time as users type
- Page remains responsive with large arrays (proper pagination/limits)
- Error boundary handles library function exceptions gracefully

## Implementation Notes
- Changes limited to: src/web/ files (HTML, CSS, JS), tests/behaviour/ test files
- Web page imports fizzBuzz functions directly from the library using ES modules
- Simple, semantic HTML with progressive enhancement
- CSS uses modern features but maintains broad browser compatibility
- Behaviour tests use Playwright to verify interactive functionality
- Keep the interface minimal and focused on demonstrating library capabilities

## Files to update
- src/web/index.html (main demo page)
- src/web/style.css (styling for the demo)
- src/web/demo.js (interactive functionality)
- tests/behaviour/web-demo.spec.js (behaviour tests)