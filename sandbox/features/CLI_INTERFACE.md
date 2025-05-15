# CLI Interface

Enhance the command line interface to support a new plot command in addition to existing help, version, and mission commands.

# Commands

## --help

Display a concise usage guide listing all available commands, flags, and examples of common invocations, including the new plot command.

## --version

Read and print the version field from package.json to show the current release of the tool.

## --mission

Load and display the first section of the repository mission from MISSION.md to remind users of the project purpose.

## --plot <function> [--range <start,end>] [--output <filename>]

Generate an SVG plot of a mathematical function and write it to a file.

Supported functions:
- quadratic: y = x * x
- sine: y = Math.sin(x)

Options:
- --range <start,end>: Two comma-separated numbers specifying the x-axis range. Default is 0,10.
- --output <filename>: The filename for the SVG output. Default is plot.svg.

Examples:
  $ node main.js --plot quadratic
  $ node main.js --plot sine --range -3.14,3.14 --output sine.svg

# Implementation Details

- Update src/lib/main.js to detect the plot flag before echoing arguments.
- Parse function name, range, and output parameters using minimist.
- Compute sample points at regular intervals over the specified range.
- Build a minimal SVG document string with a polyline element representing the function curve.
- Use fs.writeFileSync to write the SVG string to the specified output file.
- Preserve existing behavior for help, version, mission, and argument echo commands.

# Testing

- Extend sandbox/tests/cli-interface.test.js to cover:
  - Successful invocation of --plot quadratic writes plot.svg with an <svg> tag and polyline data.
  - Invocation with custom range generates curves spanning the specified x values.
  - Invocation with --output writes to the given filename.
  - Error case when an unsupported function name is provided: exit status non-zero and helpful error message.

# Documentation

- Update README.md CLI Usage section with examples of the plot command and expected outputs.
- Include a brief explanation of supported functions and options in the README.
