# Overview

Add support for labeling and customizing the X and Y axes on generated SVG plots. Users can specify axis titles and tick marks for clearer interpretation of plotted data and functions.

# CLI Usage

- --x-label <text>           Set the label text for the X axis. Defaults to no label.
- --y-label <text>           Set the label text for the Y axis. Defaults to no label.
- --x-ticks <n|list>         Define tick positions on the X axis. Provide a number to auto-generate that many ticks or a comma-separated list of numeric positions. Defaults to automatic ticks based on range.
- --y-ticks <n|list>         Define tick positions on the Y axis. Provide a number to auto-generate that many ticks or a comma-separated list of numeric positions. Defaults to automatic ticks based on range.
- --show-grid                Enable light grid lines at each tick intersection. Defaults to off.

# Source File Changes

Modify src/lib/main.js to:

1. Extend argument parsing to recognize x-label, y-label, x-ticks, y-ticks, and show-grid flags.
2. Normalize tick inputs: if numeric count, compute evenly spaced tick values over the plot range; if list, parse comma-separated numeric values.
3. Pass axis label and tick configuration into the SVG generation logic.
4. In SVG output:
   - Render axis lines: a horizontal line at y=0 and a vertical line at x=0 (if within viewBox).
   - Place tick marks and numeric labels along axes according to configured positions.
   - Add axis title text elements at ends of axes with the provided label text.
   - If show-grid is enabled, draw thin lines parallel to axes at each tick.
5. Ensure backward compatibility: when no axis options are provided, omit axis lines, ticks, labels, and grid.

# Tests

Add sandbox/tests/axes-labels.test.js with tests that:

- Invoke main with an expression flag and --x-label and --y-label, verify output SVG includes <text> elements with correct label text positioned near axis ends.
- Test numeric x-ticks and y-ticks count: count=5 generates exactly five tick lines and five numeric <text> labels on each axis.
- Test comma list of ticks: provided list ["-5,0,5"] results in tick marks at those positions.
- Assert that enabling --show-grid adds <line> elements for grid lines at each tick intersection.
- Confirm default behavior when no axis flags: no <line> or <text> elements for axes or ticks.
- Validate invalid tick input (non-numeric) yields exit code 1 and descriptive error.

# Documentation

Update README.md to:

- Document new axis-related CLI flags with their descriptions, expected formats, and default behaviors.
- Provide example commands showing labeled axes and custom ticks with and without grid.
- Include snippet of SVG output illustrating axis titles, tick marks, and grid lines.