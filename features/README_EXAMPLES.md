# README_EXAMPLES

Purpose
Describe the README content and usage examples required to help users and satisfy acceptance criteria.

Required README content
- Short library description and the exported API names: hammingString and hammingBits, plus basic metadata exports name, version and description.
- Import example text showing how to import the named functions from src/lib/main.js and the expected results for the core acceptance cases (no fenced code blocks required in the spec; actual README may include code snippets).
- CLI usage guidance: state that the package provides a main function that is used when running the script, and examples of the kinds of invocations to compute string or integer Hamming distances.
- Error and validation section describing TypeError and RangeError behaviours and linking to VALIDATION.md for exact messages used by tests.

Example usages to include in README (describe inline)
- Import the functions and call hammingString("karolin", "kathrin") to get 3.
- Calling hammingString("", "") should return 0.
- Calling hammingBits(1, 4) should return 2.
- Demonstrate CLI invocation that prints identity information and that main can be invoked without throwing in tests.

Acceptance criteria
- README contains examples that demonstrate the key acceptance criteria: karolin vs kathrin -> 3, empty vs empty -> 0, integer 1 vs 4 -> 2.
- README documents import examples and references the CLI behaviour used by tests.
