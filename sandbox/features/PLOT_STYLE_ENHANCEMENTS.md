# PLOT_STYLE_ENHANCEMENTS

Unify and streamline common plot styling options—annotations, grid, area fill, tick labels, and legend—into a cohesive feature for both Cartesian and polar plots, simplifying flag and parameter usage while ensuring consistent behavior across CLI and HTTP interfaces.

# CLI INTEGRATION

Extend the `--plot`, `--plots`, and `--polar` commands with the following options:

• `--title <text>`
  - Add a centered title at the top of the SVG.

• `--xlabel <text>`
  - Add a centered X-axis label at bottom of the SVG.

• `--ylabel <text>`
  - Add a rotated Y-axis label along the left side.

• `--grid` (boolean)
  - Render background grid lines: horizontal and vertical lines for Cartesian; concentric circles and radial lines for polar.

• `--fill-area` (boolean)
  - Shade the area under the curve or closed polar path using fill color or semi-transparent stroke color.

• `--xticks <n>` and `--yticks <n>`
  - Specify number of tick marks on axes (angular and radial ticks for polar). Defaults to automatic tick count if omitted.

• `--tick-labels` / `--no-tick-labels` (boolean)
  - Enable or suppress numeric labels at each tick. By default labels are shown when ticks are requested.

• `--legend <label1,label2,...>`
  - Provide comma-separated labels for each data series. A legend box is rendered in the top-right with colored swatches and labels. The count of labels must match the number of series.

# HTTP ENDPOINT SUPPORT

Support the following query parameters on `/plot` and `/polar`:

• `title`, `xlabel`, `ylabel`
• `grid=true` to enable grid
• `fillArea=true` to enable area fill
• `xticks=<n>`, `yticks=<n>`
• `tickLabels=true|false`
• `legend=<label1,label2,...>`

When present, these parameters must apply the corresponding SVG enhancements. Validation errors (e.g., legend count mismatch or invalid tick counts) return HTTP 400 with an explanatory message.

# IMPLEMENTATION NOTES

1. **Generator Signature**: Update `generatePlotSVG` and `generatePolarSVG` to accept options: `title`, `xlabel`, `ylabel`, `grid`, `fillArea`, `xticks`, `yticks`, `tickLabels`, and `legend`.

2. **Annotations**: Append `<text>` elements for title and axis labels at computed coordinates using SVG alignment attributes and inherited styles.

3. **Grid and Ticks**: If `grid` is true, draw grid or concentric/radial ticks. Then if `xticks` or `yticks` specified, draw major tick lines and, if `tickLabels` is true, append numeric `<text>` at each tick position.

4. **Area Fill**: When `fillArea` is true, close the polyline path to the baseline or link last and first polar points, and insert a `<polygon>` or closed path with fill styling behind the data line.

5. **Legend**: After drawing series lines, compute legend box dimensions and render a `<rect>` background and a `<g>` containing colored line swatches and `<text>` labels aligned vertically.

6. **CLI Parser**: Enhance `sandbox/source/main.js` minimist configuration and `handlePlot`/`handlePolar` to parse these flags, validate values, and pass them into the SVG generators.

7. **HTTP Handlers**: In `/plot` and `/polar` routes, read `URLSearchParams` for new parameters, apply validation, and forward to SVG generators.

8. **Tests**: Consolidate and extend unit tests in `sandbox/tests/cli-interface.test.js` to cover combined styling options and error cases. Update integration tests in `sandbox/tests/data-export.test.js` to verify generated SVG contains expected elements for grid, ticks, fill, annotations, and legend via HTTP.

9. **Documentation**: Update `sandbox/docs/CLI_USAGE.md`, `sandbox/docs/HTTP_SERVER.md`, and the top-level `README.md` feature list to describe the unified styling options under PLOT_STYLE_ENHANCEMENTS.