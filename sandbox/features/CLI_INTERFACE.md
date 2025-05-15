# CLI Interface

Enhance the command line interface to support a new polar plot command in addition to existing help, version, mission, and Cartesian plot commands.

# Commands

## --help

Display a concise usage guide listing all available commands, flags, and examples of common invocations, including the new polar command.

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

## --polar <function> [--radius-range <rStart,rEnd>] [--angle-range <thetaStart,thetaEnd>] [--resolution <points>] [--output <filename>]

Generate an SVG polar plot of a radial function and write it to a file.

Supported functions:
- spiral: r = θ
- rose: r = sin(4 * θ)

Options:
- --radius-range <rStart,rEnd>: Two comma-separated numbers specifying radial limits. Default is 0,5.
- --angle-range <thetaStart,thetaEnd>: Two comma-separated angles in radians. Default is 0,6.28.
- --resolution <points>: Number of sample points. Default is 100.
- --output <filename>: The filename for the SVG output. Default is polar.svg.

# Implementation Details

- Update sandbox/source/main.js to detect and handle the polar flag after plot handling.
- Parse function name, radius-range, angle-range, resolution, and output parameters using minimist and raw args for negative values.
- Compute θ values evenly over the specified angle range, compute r by function, then convert to Cartesian points: x = r * cos(θ), y = r * sin(θ).
- Calculate bounding box from computed points to define the SVG viewBox.
- Build a minimal SVG document string with a polyline element representing the polar curve.
- Use fs.writeFileSync to write the SVG string to the specified output file.
- Preserve existing behavior for help, version, mission, and Cartesian plot commands.

# Testing

- Extend sandbox/tests/cli-interface.test.js to cover:
  - Successful invocation of --polar spiral writes polar.svg with an <svg> tag and polyline data.
  - Invocation with custom radius-range and angle-range generates curves spanning the specified limits.
  - Invocation with --resolution adjusts number of sampled points.
  - Invocation with --output writes to the given filename.
  - Error case when an unsupported polar function name is provided: exit status non-zero and helpful error message.

# Documentation

- Update README.md CLI Usage section with examples of the polar command and expected outputs.
- Include a brief explanation of supported polar functions and options in sandbox/docs/CLI_USAGE.md.