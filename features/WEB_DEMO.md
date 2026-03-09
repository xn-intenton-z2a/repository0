# WEB_DEMO

Feature Name: WEB_DEMO

## Summary
Add a small interactive web demo page and accompanying examples content in src/web/ that demonstrates the library API on the website. The feature describes the interactive behaviour and exact acceptance criteria for UI-driven tests.

## Goals
- Provide a clear description of the web demo behaviour so the existing docs build can include it in docs/.
- Demonstrate fizzBuzzSingle and fizzBuzz with user inputs: a single-number input prints fizzBuzzSingle output, a range input renders the array result.
- Ensure accessibility (labels for inputs) and predictable markup IDs so behaviour tests can select elements reliably.

## UI contract
- A single-number input with id fizz-input and a button with id fizz-submit prints the result into an element with id fizz-output.
- A range input with id fizz-range and a button with id fizz-range-submit renders a comma-separated list inside an element with id fizz-range-output.
- Inputs validate client-side and show an element with id fizz-error containing error text on invalid input.

## Acceptance Criteria
- Entering 15 into fizz-input and clicking fizz-submit shows FizzBuzz in fizz-output.
- Entering 0 into fizz-range and clicking fizz-range-submit renders an empty string or empty list in fizz-range-output.
- Entering a negative or non-integer value into either input displays an appropriate error message in fizz-error.
- The demo uses the library exports (imported from src/lib/main.js) rather than reimplementing logic.

## Notes
- Implementation changes to src/web/ and tests should be minimal; this feature file defines the expected behaviour so implementers can add a small page and tests to satisfy the mission's web demonstration requirement.

## Summary
Add a small interactive web demo page and accompanying examples content in src/web/ that demonstrates the library API on the website. The feature describes the interactive behaviour and exact acceptance criteria for UI-driven tests.

## Goals
- Provide a clear description of the web demo behaviour so the existing docs build can include it in docs/.
- Demonstrate fizzBuzzSingle and fizzBuzz with user inputs: a single-number input prints fizzBuzzSingle output, a range input renders the array result.
- Ensure accessibility (labels for inputs) and predictable markup IDs so behaviour tests can select elements reliably.

## UI contract
- A single-number input with id fizz-input and a button with id fizz-submit prints the result into an element with id fizz-output.
- A range input with id fizz-range and a button with id fizz-range-submit renders a comma-separated list inside an element with id fizz-range-output.
- Inputs validate client-side and show an element with id fizz-error containing error text on invalid input.

## Acceptance Criteria
- Entering 15 into fizz-input and clicking fizz-submit shows FizzBuzz in fizz-output.
- Entering 0 into fizz-range and clicking fizz-range-submit renders an empty string or empty list in fizz-range-output.
- Entering a negative or non-integer value into either input displays an appropriate error message in fizz-error.
- The demo uses the library exports (imported from src/lib/main.js) rather than reimplementing logic.

## Notes
- Implementation changes to src/web/ and tests should be minimal; this feature file defines the expected behaviour so implementers can add a small page and tests to satisfy the mission's web demonstration requirement.
