# Summary

Introduce an ASCII plot mode for the CLI that renders simple text-based line charts of quadratic and sine functions directly in the console. Add a new --ascii-plot option (alias -A) and accompanying size flags to control the dimensions of the text grid. This enables quick previews without generating files.

# Implementation

1. Modify sandbox/source/main.js to:
   - Enhance minimist parsing to accept:
     • --ascii-plot (alias -A) boolean flag; when provided, run ASCII plot renderer and exit.
     • --plot-width numeric option; default 80 columns.
     • --plot-height numeric option; default 20 rows.
   - After validating function type, range (--from, --to) and step, if ascii-plot flag is true:
     1. Generate points for the selected function over the range.
     2. Determine minY and maxY from the data set.
     3. Create a 2D array of spaces with dimensions [plot-height][plot-width].
     4. For each data point, compute:
        • col = round(((x - from) / (to - from)) * (plot-width - 1))
        • row = round((maxY - y) / (maxY - minY) * (plot-height - 1))
        • Mark the cell with an asterisk.
     5. Join each row into a string and print lines from top to bottom.
     6. After rendering, exit the process.
   - Validate plot-width and plot-height are positive integers; on invalid values, log error to stderr and exit with code 1.

# README Updates

Update sandbox/docs/USAGE.md:
- Document new flag --ascii-plot (alias -A) to enable ASCII rendering.
- Document --plot-width and --plot-height options with defaults.
- Provide examples:
  npm run start -- --function sine --ascii-plot
  npm run start -- --function quadratic --ascii-plot --plot-width 100 --plot-height 25

# Testing Deliverables

In sandbox/tests/main.test.js:
1. Add tests to verify that running main with --ascii-plot outputs an array of lines containing asterisks at expected positions for both quadratic and sine functions.
2. Test custom --plot-width and --plot-height values produce the correct number of columns and rows.
3. Verify invalid width or height values (zero, negative, non-numeric) cause process.exit(1) after logging an error.
4. Ensure existing SVG and conversion-rate tests remain unaffected and continue to pass without modification.