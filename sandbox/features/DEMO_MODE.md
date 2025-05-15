# Demo Mode

## Purpose
Automatically showcase the repository's plotting capabilities when the CLI is invoked without flags. On a plain `npm run start` or `node sandbox/source/main.js` with no arguments, the tool generates a set of demonstration SVG files illustrating both Cartesian and polar plots.

## Behavior
- Detect no flags or commands in the CLI entrypoint and route execution to the demo runner.
- Generate four SVG files in the current working directory:
  - demo-quadratic.svg: Quadratic plot over default range 0 to 10.
  - demo-sine.svg: Sine wave plot over default range 0 to 10.
  - demo-spiral.svg: Polar spiral over default radius and angle ranges.
  - demo-rose.svg: Rose curve (sin(2θ)) over default ranges.
- After file creation, output a console summary listing the generated filenames and their paths.

## Implementation Details
- In sandbox/source/main.js, replace the fallback call to echoMain(args) with a call to handleDemo() when no flags are detected.
- Implement handleDemo() in sandbox/source/main.js or src/lib/demo.js to invoke existing handlePlot and handlePolar logic with hardcoded arguments for each demo file and to write the resulting SVG to the designated filenames.
- Use fs.writeFileSync to persist SVG content and console.log for the summary.
- Ensure exit code 0 on successful generation.

## Testing
- Add sandbox/tests/demo.test.js to cover:
  - Running the CLI with no arguments creates all four demo-*.svg files.
  - Each generated file contains valid SVG markup including an <svg> root and a <polyline> element.
  - After test cleanup, no leftover demo files remain.
- Optionally extend tests/unit/main.test.js to assert that main([]) triggers demo logic instead of echoing arguments.

## Documentation
- Update README.md and sandbox/docs/CLI_USAGE.md to document demo mode under the "Usage" section, showing how a plain start command generates demonstration outputs and lists the files produced.