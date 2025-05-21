# PLOT_EQUATION

# Overview
Integrate equation plotting into the main CLI with two modes: console rendering of ASCII charts and HTTP serving of plots wrapped in simple HTML responses. The user can enter an equation to plot on the command line or start a local server to generate plots via HTTP queries.

# Usage

- Plot an equation in the terminal:
  node src/lib/main.js --plot x^2+2*x-5

- Start the HTTP plot server on the default port 3000:
  node src/lib/main.js --serve

- Specify a custom port when starting the server:
  node src/lib/main.js --serve --port 4000

- Query the running server for a plot:
  curl http://localhost:3000/plot?equation=sin(x)*x

# Implementation

1. Argument Parsing
   - Recognize flags: --plot <equation>, --serve, --port <number> alongside the existing --emotion flag.  
   - Default port is 3000 when --serve is provided without --port.

2. Console Plotting Mode
   - Parse the equation string safely (avoid eval risks).  
   - Sample x values evenly over a range from -10 to 10.  
   - Compute y values, determine min and max, and normalize to fit a fixed ASCII grid height.  
   - Draw X and Y axes at zero coordinates.  
   - Mark data points with a character (for example, *) and output the grid to stdout.

3. HTTP Server Mode
   - Use the Node http module to create a server listening on the specified port.  
   - Handle GET requests to path /plot.  
   - Extract the query parameter equation.  
   - On valid equation, generate an ASCII plot via the same logic as console mode.  
   - Wrap the ASCII output in a minimal HTML document with a pre block.  
   - Send response with content-type text/html and status 200.  
   - On missing or invalid parameter, send status 400 with a plain text usage instruction.

4. Error Handling and Exit Codes
   - Console mode returns exit code 0 on success, 1 on missing or invalid equation.  
   - Server mode does not exit but logs errors and serves HTTP error statuses.
   
5. Maintain Backward Compatibility
   - Ensure the existing --emotion command remains unaffected when --plot or --serve flags are not used.

# Testing

- Unit Tests in tests/unit/main.test.js
  - Verify that invoking main with --plot and a valid equation returns code 0 and logs an ASCII chart.  
  - Verify that invoking main with --plot and no equation returns code 1 and logs an error message.  

- End-to-End HTTP Tests
  - Spawn the CLI with --serve and --port in a test, send HTTP GET requests to /plot with valid and invalid queries, and assert status codes and response bodies.

- Regression
  - Confirm existing DISPLAY_EMOTION tests still pass when no new flags are provided.

# Documentation

- Update docs/USAGE.md to include examples and descriptions for --plot and --serve modes.  
- Update README.md to describe the plotting feature, show sample commands, and link to docs and MISSION.md.
