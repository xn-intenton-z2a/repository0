# Summary

Extend the existing plotting CLI to support SVG output format for function data points in addition to JSON and CSV. Introduce a new --output-format (alias -o) option value "svg" that generates a simple line chart as an SVG graphic. Allow customization of dimensions and file output.

# Implementation

1. Modify src/lib/main.js to:
   - Enhance minimist parsing to accept:
     • --output-format (-o) with values json, csv, svg; default json.
     • --width and --height numeric options for SVG canvas dimensions; defaults 800 and 600.
     • --export-file (-f) string option for writing SVG to a file path; if omitted, SVG is written to stdout.
   - After computing the array of points (x,y), branch on output-format:
     • json: serialize points as JSON.
     • csv: as in EXPORT_CSV feature.
     • svg:
       - Compute viewBox and scale coordinates to fit width and height while preserving aspect ratio.
       - Generate an SVG document string with <svg> root, <polyline> element connecting points, and optional axes lines at x=0 and y=0.
       - If --export-file is provided, write using fs.writeFileSync; otherwise console.log the SVG string.
   - Validate numeric dimensions (positive integers) and valid file path; on invalid input, exit with code 1 and print an error message.

# README Updates

- Update Usage section to list new output-format value "svg" and new flags --width, --height, --export-file.
- Provide examples:
  node src/lib/main.js --function sine --from 0 --to 6.28 --step 0.1 --output-format svg
  node src/lib/main.js --function quadratic --output-format svg --width 1024 --height 768 --export-file curve.svg

# Testing Deliverables

1. In tests/unit/main.test.js and sandbox/tests/main.test.js add tests to verify:
   - --output-format svg produces a string containing <svg> and a <polyline> with correct point count.
   - --width and --height flags appear as width and height attributes in the <svg> element.
   - Providing --export-file writes the SVG file with expected content (mock fs to intercept writeFileSync).
   - Invalid dimension values (zero or negative) and unsupported output-format values cause the process to exit with code 1 and print an error.
2. Ensure all existing JSON and CSV output tests continue to pass unmodified.