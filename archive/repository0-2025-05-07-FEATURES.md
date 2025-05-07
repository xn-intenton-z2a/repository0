sandbox/features/SANDBOX_TESTS.md
# sandbox/features/SANDBOX_TESTS.md
# SANDBOX_TESTS

# Purpose
Add end-to-end sandbox tests to demonstrate core plotting functionality for both EQUATION_PLOTTER and HTTP_PLOT_SERVER features in isolation from the main test suite. These tests will serve as examples of how the features behave when invoked programmatically and via HTTP, and ensure the examples in the sandbox directory remain valid.

# Tests
1. Equation Plotter Sandbox Test
   - Use Node to import main from src/lib/main.js and invoke it with ["plot","quadratic","--width","200","--height","100","--domainStart","-5","--domainEnd","5"] under sandbox environment.
   - Capture the returned SVG string and assert it begins with an <svg> tag and contains at least one path element.
   - Invoke main with ["plot","sine","--width","300","--height","150"] and perform the same SVG assertions.

2. HTTP Plot Server Sandbox Test
   - Spawn the serve command in a child process: node src/lib/main.js serve 0 (ephemeral port).
   - Determine the bound port from stdout or logs.
   - Send HTTP GET request to /plot?functionType=quadratic&width=250&height=120 and assert:
     - Status 200
     - content-type header image/svg+xml
     - Body contains an <svg> element with a path tag
   - Send request to /plot?functionType=unsupported and assert:
     - Status 400
     - Response is valid JSON with error property.

# Files to Modify
- sandbox/tests/equation-plotter.test.js (add sandbox-level tests for CLI plot subcommand)
- sandbox/tests/http-plot-server.test.js (add sandbox-level HTTP endpoint tests)
- README.md (document how to run sandbox tests and reference sandbox/examples)
- package.json (ensure sandbox tests are included in test scripts under sandbox/tests/*.test.js)sandbox/features/DATA_EXPORT.md
# sandbox/features/DATA_EXPORT.md
# Purpose
Add a data export subcommand to output sampled data points for supported functions in JSON or CSV format. This enables users to integrate numeric output into other tools or workflows without needing to parse SVG.

# CLI Interface
Add subcommand data under the main script invocation:
node src/lib/main.js data functionType [options]

Where:
  functionType (required) is either quadratic or sine
  Options:
    --format <json|csv>    output format, either json or csv (default json)
    --samples <number>     number of sample points across the domain (default 100)
    --domainStart <number> start of x range (default -10)
    --domainEnd <number>   end of x range (default 10)
    --outputPath <path>    optional file path to write the data (defaults to stdout)

# Behavior
1. Parse arguments to determine functionType, format, samples, domainStart, domainEnd, and outputPath.
2. Validate that functionType and format are supported; on error exit with code 1 and print descriptive message.
3. Sample the specified number of x values evenly from domainStart to domainEnd.
4. Compute corresponding y values: y = x * x for quadratic, y = Math.sin(x) for sine.
5. Build output:
   - For json produce an array of objects with x and y properties.
   - For csv produce a header line x,y followed by one line per sample with comma separated values.
6. Write the formatted output to stdout or to the given outputPath file.

# Tests
Add unit tests in tests/unit/main.test.js:
- Call main(["data","quadratic","--format","json","--samples","3"]) and assert the returned string begins with [ and contains objects with x and y fields.
- Call main(["data","sine","--format","csv","--samples","5"]) and assert the returned string contains header x,y and five data lines.
- Test unsupported functionType or unsupported format by calling main with bad values and assert exit code 1 and error message.

# Documentation
Update README.md to include the data subcommand with its options. Show example invocations for json and csv formats and embed sample output in plain text.

# Files to Modify
- src/lib/main.js implement data subcommand, argument parsing, data generation, formatting, and output handling
- tests/unit/main.test.js add unit tests for data command success and failure cases
- README.md document data command syntax, options, and example json and csv output
- package.json ensure test scripts include data mode testssandbox/features/ASCII_PLOT.md
# sandbox/features/ASCII_PLOT.md
# Purpose
Combine and unify ASCII plotting capabilities for both the CLI and the HTTP server into a single feature. Users can render text-based graphs of supported functions either directly in the terminal or by requesting an ASCII plot over HTTP.

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

# HTTP Interface
Extend the existing "serve" subcommand endpoint to handle ASCII requests at `/ascii`:
GET /ascii?functionType=<quadratic|sine>&width=<number>&height=<number>&domainStart=<number>&domainEnd=<number>

# Behavior
1. CLI Mode:
   - Parse arguments for functionType and grid options.
   - Validate functionType; on unsupported exit code 1 with descriptive error.
   - Sample one point per column across the specified domain range.
   - Compute y values (x*x or Math.sin(x)), determine y min and max for scaling.
   - Build a 2D character grid, place '*' at each sampled point, draw axes with '|' and '-'.
   - Join grid rows with line breaks and write to stdout.

2. HTTP Mode:
   - On GET to `/ascii`, parse and validate query parameters.
   - Perform the same sampling, scaling, and grid construction as CLI.
   - Respond with status 200 and header `content-type: text/plain; charset=utf-8`.
   - On invalid parameters respond with status 400 and a JSON error message.

# Tests
- Unit tests in `tests/unit/main.test.js`:
  - Call main(["ascii","quadratic","--width","20","--height","10"]) and assert the returned string contains at least one '*' and axis markers.
  - Test sine function similarly and verify negative and positive y mapping.
  - Test unsupported functionType exits with code 1 and prints an error.

- HTTP unit tests in `tests/unit/main.test.js`:
  - Spawn server via main(['serve','0']), send GET `/ascii?...`, assert status 200, content-type text/plain, and response body contains '*' and axis characters.
  - Test invalid queries return status 400 and JSON error.

- Sandbox tests in `sandbox/tests/http-ascii-plot-server.test.js`:
  - Demonstrate end-to-end HTTP ASCII plot requests and validate output.

# Documentation
- Update README.md:
  - Document the `ascii` CLI subcommand syntax and options.
  - Document the `/ascii` HTTP endpoint under the serve command.
  - Show example CLI invocation and embed a sample ASCII graph in plain text.

# Files to Modify
- src/lib/main.js  implement CLI parsing for `ascii`, ASCII grid logic, and HTTP `/ascii` routing.
- tests/unit/main.test.js  add unit tests and HTTP tests for ASCII.
- sandbox/tests/http-ascii-plot-server.test.js  ensure sandbox-level HTTP ASCII tests.
- README.md  add sections for ASCII subcommand and endpoint.
- package.json  ensure test scripts include sandbox tests for ASCII mode.sandbox/features/HTTP_PLOT_SERVER.md
# sandbox/features/HTTP_PLOT_SERVER.md
# Purpose
Enable users to run a simple HTTP server that provides generated SVG plots for supported mathematical functions via a REST endpoint. This extends the existing CLI plotting capability to a web API, making it easier to integrate the plot generator into other systems or use it interactively in a browser or script.

# Command Line Interface
Add a new subcommand "serve" to the main script invocation:
- node src/lib/main.js serve [port]
  - port is an optional integer for the HTTP server port (default 3000)
  - When started, the script launches an HTTP server listening on the specified port.

# Behavior
1. On "serve" subcommand, create an HTTP server using Node’s built-in http module.
2. Server listens on the provided port or 3000 by default.
3. Accept GET requests to path "/plot" with query parameters:
   - functionType (required): quadratic or sine
   - width (optional): SVG width in pixels (default 800)
   - height (optional): SVG height in pixels (default 400)
   - domainStart (optional): start of x range (default -10)
   - domainEnd (optional): end of x range (default 10)
4. Validate query parameters and respond with status 400 and a JSON error if invalid or missing.
5. On valid requests, generate an SVG string using existing plot logic.
6. Set response header content-type to image/svg+xml and send the SVG document in the HTTP response.
7. Log incoming requests and errors to the console.

# Tests
- Modify tests/unit/main.test.js to spawn the server in a child process on an ephemeral port.
- Use Node’s fetch or http.get to request /plot?functionType=quadratic and assert:
  - Response status is 200
  - Content-type header is image/svg+xml
  - Body begins with an <svg> tag and contains a path element.
- Test invalid requests (missing functionType or unsupported type) return status 400 and JSON error message.

# Documentation
- Update README.md to describe the "serve" command, its options, sample HTTP request URLs, and expected SVG response.
- Include a usage example showing how to embed the plot in an HTML <img> tag pointing to http://localhost:3000/plot?functionType=sine.

# Dependencies
No new dependencies required. Use Node.js built-in http and url modules to implement the server and query parsing.

# Files to Modify
- src/lib/main.js (add serve command parsing, HTTP server setup, routing, and SVG generation integration)
- tests/unit/main.test.js (add tests for HTTP server endpoints and error cases)
- README.md (document the new serve command and HTTP API examples)
- package.json (no changes unless adding a script alias for serve)sandbox/features/DEFAULT_DEMO.md
# sandbox/features/DEFAULT_DEMO.md
# Purpose
When the CLI is invoked with no subcommands or arguments, automatically run a demo sequence that generates SVG plots for both the quadratic and sine functions using default parameters. This provides an immediate showcase of the core plotting functionality when running npm run start.

# Behavior
1. Detect that main was called with an empty argument array.
2. Invoke the existing plot logic twice, once for quadratic and once for sine, using default values:
   - domainStart: -10  
   - domainEnd: 10  
   - width: 800  
   - height: 400
3. Receive two SVG strings and join them with line breaks.
4. Write the combined SVG output to stdout.
5. Return the combined SVG string from main so that tests or other callers can inspect the result programmatically.

# Tests
- In tests/unit/main.test.js, add a test that simulates calling main with no arguments (e.g., main([]) or resetting process.argv) and captures stdout. Assert:
  - The output contains exactly two <svg> tags.
  - No errors or exceptions are thrown.

# Files to Modify
- src/lib/main.js: implement detection of no-argument invocation and demo logic that calls the plot routines and outputs combined SVG.
- tests/unit/main.test.js: add a demo mode test capturing output and verifying two SVG documents.
- README.md: update Getting Started section to explain that npm run start will display demo SVGs for quadratic and sine functions.sandbox/features/PLOT_COMMAND.md
# sandbox/features/PLOT_COMMAND.md
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
- package.json   ensure test scripts include sandbox tests (sandbox/tests/*.test.js)sandbox/features/EQUATION_PLOTTER.md
# sandbox/features/EQUATION_PLOTTER.md
# Purpose
Extend the plot command to support polar function plotting, enabling users to generate SVG representations of r(theta) functions described in polar coordinates.

# Command Line Interface
Add support for polar plots under the existing plot subcommand:
- node src/lib/main.js plot polar [outputPath]
  - polar indicates generation of a polar plot of the form r = sin(theta)
  - outputPath is an optional file path to write the SVG, defaulting to stdout
  - Accept optional flags:
    --angleStart <number> (default 0)
    --angleEnd <number> (default 6.283)
    --width <number> (default 800)
    --height <number> (default 800)

# Behavior
1. Interpret angleStart and angleEnd as the theta range in radians.
2. Sample theta values evenly across the range and compute r = sin(theta).
3. Convert each polar coordinate to Cartesian coordinates for the SVG path.
4. Generate a standalone SVG with coordinate axes and the plotted curve.
5. Write the SVG to the specified output path or print to stdout.

# Tests
- Add unit tests in tests/unit/main.test.js invoking main with ["plot","polar"] and capturing output containing <svg> and path data.
- Test with outputPath, verifying file creation and valid SVG content.
- Test invalid flags produce exit code 1 and error messages.

# Documentation
- Update README.md to document the polar plot usage with examples of CLI invocation and sample SVG embedding.

# Dependencies
No new dependencies are required. Use existing SVG generation logic.

# Files to Modify
- src/lib/main.js
- tests/unit/main.test.js
- README.md
- package.json