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