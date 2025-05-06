# Purpose
Extend the CLI plotting tool with an ASCII-based output mode that renders simple graphs of quadratic and sine functions directly to the terminal. This feature complements the existing SVG plot and HTTP server modes by providing a lightweight, dependencies-free visualization for quick inspection and demonstration.

# CLI Interface
Add a new subcommand "ascii" under the main script invocation:
node src/lib/main.js ascii functionType [options]

Where:
  functionType (required) is either quadratic or sine
  Options:
    --width <number>       number of columns in the ASCII grid (default 80)
    --height <number>      number of rows in the ASCII grid (default 24)
    --domainStart <number> start of x range (default -10)
    --domainEnd <number>   end of x range (default 10)

# Behavior
1. Parse arguments to determine functionType and numeric options.
2. Validate that functionType is supported; if not, exit with code 1 and print an error message.
3. Sample points evenly across the domainStart to domainEnd range for each column.
4. Compute y for each x: y = x * x for quadratic, y = Math.sin(x) for sine.
5. Determine the min and max y values across the sample set to scale data into the available row range.
6. Build a two-dimensional grid of characters, initializing with spaces.
7. Map each sampled (x,y) into (column, row) grid positions, placing a plot character (for example, '*') at each point.
8. Add simple axes using '|' for the y-axis and '-' for the x-axis at the corresponding row and column.
9. Join rows into a string with line breaks and write the ASCII graph to stdout.

# Tests
- Add unit tests in tests/unit/main.test.js that call main(["ascii","quadratic","--width","20","--height","10"]) and assert the returned string contains a row with an axis marker and at least one '*' character.
- Test sine plots similarly and verify proper scaling of positive and negative values.
- Test an unsupported functionType by calling main(["ascii","polynomial"]) and asserting exit code 1 and that the error message mentions unsupported functionType.

# Files to Modify
- src/lib/main.js   implement parsing for ascii subcommand, ASCII grid generation logic, scaling, axes, and output handling
- tests/unit/main.test.js  add unit tests covering ascii command success and failure cases
- README.md         document the ascii command syntax, options, and include an example output block
- package.json      ensure test scripts include ascii mode tests (already covered by the test pattern)

# Documentation
Update README.md to describe the ascii subcommand, detail its options, show sample invocation and embed a small example of the ASCII graph in code-formatted text (no code blocks escape sequences required).