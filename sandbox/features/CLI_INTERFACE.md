# CLI Interface

The CLI entrypoint `sandbox/source/main.js` supports the following commands and flags:

- `--help`, `-h`             Show help information.
- `--version`, `-v`          Show version number.
- `--mission`                Show mission statement (first header and paragraph).
- `--mission-full`           Show full mission statement (entire MISSION.md).
- `--plot <function>`        Generate an SVG plot. Supported functions: `quadratic`, `sine`.
  - `--range <start,end>`      X-axis range (default: `0,10`).
  - `--output <filename>`      Output filename (default: `plot.svg`).
- `--polar <function>`       Generate an SVG polar plot. Supported functions: `spiral`, `rose`.
  - `--radius-range <rStart,rEnd>`   Radius range (default: `0,5`).
  - `--angle-range <thetaStart,thetaEnd>`  Angle range in radians (default: `0,6.28`).
  - `--resolution <points>`    Number of sample points (default: `100`).
  - `--output <filename>`      Output filename (default: `polar.svg`).

## Examples

```bash
# Display help
node sandbox/source/main.js --help

# Show full mission statement
node sandbox/source/main.js --mission-full

# Generate quadratic plot
node sandbox/source/main.js --plot quadratic --range 0,10 --output plot.svg
```
