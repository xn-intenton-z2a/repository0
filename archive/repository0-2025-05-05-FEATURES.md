sandbox/features/FUNCTION_PLOT_CLI.md
# sandbox/features/FUNCTION_PLOT_CLI.md
# Function Plot CLI

Provide a simple command-line interface to generate SVG plots of mathematical functions. The main script will accept function identifiers or expressions, an output path, and optional plot range and dimensions, then produce a valid SVG file representing the function curve.

# Usage

Users invoke the tool via npm or directly with node. Supported options:

--function   The function to plot. Allowed values: quadratic, sine, custom expression in JavaScript syntax.
--range      Optional numeric range in the form start:end. Default is -10:10.
--width      Optional plot width in pixels. Default is 800.
--height     Optional plot height in pixels. Default is 600.
--output     Path to the output SVG file. Default is plot.svg in the working directory.

Example: npm run start -- --function quadratic --range -5:5 --width 400 --height 300 --output out.svg

# Implementation

• Extend src/lib/main.js to parse CLI arguments. Use zod for schema validation of options.  
• Map the built-in functions quadratic and sine to JavaScript implementations: quadratic(x)=x*x, sine(x)=Math.sin(x).  
• For custom expressions use Function constructor to evaluate x.  
• Sample 1000 points evenly spaced over the specified range and construct an SVG polyline element connecting the sampled points.  
• Wrap the polyline in an SVG element with the configured width and height and simple axes.  
• Write the resulting markup to the specified output file using fs/promises.

# Testing

• Add unit tests in tests/unit/main.test.js to validate argument parsing with valid and invalid inputs.  
• Add feature-level tests in sandbox/tests/plot.test.js to run the CLI in a temporary directory, check that an SVG file is created, and validate that it contains an svg element with expected width and height attributes.  
• Ensure that invalid function identifiers or bad ranges cause the program to exit with a nonzero code and a helpful error message.
