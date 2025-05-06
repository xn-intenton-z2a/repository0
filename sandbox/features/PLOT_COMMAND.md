# Purpose

Add a plot subcommand to the main script that allows users to generate SVG visualizations of supported mathematical functions. This delivers a self‐contained CLI plotting tool for quadratic and sine functions, providing a clear demonstration of the plotting capability as part of the agentic workflow showcase.

# CLI Interface

Invoke the plotting tool via:
  node src/lib/main.js plot functionType [outputPath] [options]

Where:
  functionType (required) is either quadratic or sine
  outputPath (optional) is a file path to write the SVG (defaults to stdout)
  Options:
    --width <number>    SVG viewport width in pixels (default 800)
    --height <number>   SVG viewport height in pixels (default 400)
    --domainStart <number>   start of x range (default -10)
    --domainEnd <number>     end of x range (default 10)

# Behavior

1. Parse the arguments to determine functionType, outputPath, and numeric options.
2. Validate the functionType; if unsupported, exit with code 1 and print a descriptive error.
3. Sample 100 points evenly across the domainStart to domainEnd range.
4. For each sample x:
   - If quadratic, compute y = x * x
   - If sine, compute y = Math.sin(x)
   - Map (x, y) into SVG coordinate space, inverting y so positive values appear above the horizontal axis.
5. Construct an SVG document with coordinate axes and a single path element connecting the sampled points.
6. Write the SVG string to stdout or to the specified outputPath file.

# Tests

- Add unit tests in tests/unit/main.test.js that call main(["plot","quadratic",...]) and assert the returned string begins with <svg and contains a path tag.
- Test sine plots similarly and test that an unsupported functionType causes an error exit and descriptive message.
- Add end‐to‐end sandbox tests in sandbox/tests/equation-plotter.test.js that invoke the CLI in a child process, capture stdout, and validate SVG structure.

# Files to Modify

- src/lib/main.js   implement argument parsing for plot subcommand, sampling logic, SVG generation, file output, and error handling
- tests/unit/main.test.js   add tests for plot subcommand success and failure cases
- sandbox/tests/equation-plotter.test.js   add sandbox‐level end‐to‐end tests for CLI invocation
- README.md   document the plot command syntax, options, usage examples, and an embed example using <img>
- package.json   ensure test scripts include sandbox tests (sandbox/tests/*.test.js)