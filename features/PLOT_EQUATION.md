# PLOT_EQUATION

# Overview
Integrate equation plotting into the main CLI with two modes: console rendering and HTTP serving. Users invoke a --plot flag to render an ASCII chart in the terminal, or a --serve flag to run a local HTTP server that accepts equation queries and returns ASCII plots in an HTML response. This expands the CLI beyond emotion display to include interactive data visualization.

# Usage

- Plot an equation in the terminal using the CLI:
  node src/lib/main.js --plot x^2+2*x-5

- Start the HTTP plot server on the default port:
  node src/lib/main.js --serve

- Specify a custom port when starting the server:
  node src/lib/main.js --serve --port 4000

- Query the running server for a plot:
  curl http://localhost:3000/plot?equation=sin(x)*x
  The response is HTML containing a pre tag with the ASCII plot.

# Implementation

1. Extend argument parsing in src/lib/main.js to recognize flags:
   --plot <equation>  renders a console ASCII chart
   --serve            starts an HTTP server
   --port <number>    optional port parameter defaulting to 3000

2. For console plotting:
   a. Parse the equation string with a safe evaluator.
   b. Sample x values over a default range of -10 to 10 with a fixed step.
   c. Compute corresponding y values and normalize them to ASCII grid rows.
   d. Draw X and Y axes and plot points with ASCII characters on stdout.

3. For HTTP serving:
   a. Use Node http module to create a server listening on the specified port.
   b. Handle GET /plot requests, read the query parameter eqation.
   c. On valid equation, generate the ASCII plot as above and wrap it in an HTML document with a pre block.
   d. Respond with content-type text/html and status 200. For missing or invalid parameter respond with status 400 and instructions.

4. Ensure the original --emotion functionality remains unchanged when plot or serve flags are not present.

# Testing

- Add unit tests in tests/unit/main.test.js to:
  Verify that main returns 0 and logs an ASCII chart when invoked with --plot and a valid equation.
  Assert that missing or invalid equations after --plot produce an error message and return code 1.

- Add HTTP server tests by spawning main with --serve and --port 5000, sending HTTP GET requests and asserting the response status and ASCII content.

- Confirm that existing emotion tests continue to pass and are unaffected by the new flags.

# Documentation

- Update docs/USAGE.md to include examples for --plot and --serve modes under the CLI Usage section.
- Enhance README.md to describe the plotting feature, demonstrate example commands and link to USAGE and MISSION files.