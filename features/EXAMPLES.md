# EXAMPLES

Summary
Provide minimal example scripts in examples directory that demonstrate library usage from Node and via the CLI.

Motivation
Concrete examples help new users try the library quickly and serve as executable documentation for CI and maintainers.

Specification
- Add examples/node-example.mjs that imports fizzBuzz and fizzBuzzSingle from src/lib/main.js and logs results for 3 and 15.
- Add examples/cli-example.sh that runs node src/lib/main.js 15 and prints the output.
- Link both examples from README and ensure they are small and copy-paste friendly.

Acceptance criteria
- examples/node-example.mjs exists and can be run with node to print expected results for sample inputs.
- examples/cli-example.sh exists and running it prints 15 lines with the correct FizzBuzz mapping ending in FizzBuzz.
- README references the examples directory with one-line instructions for running each example.
