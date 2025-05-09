# Summary

Extend the existing plotting CLI to support HTML output format that wraps the generated SVG line chart inside a self-contained HTML document. Introduce a new output-format value html (alias -o html) that uses EJS to render an HTML template with embedded SVG and optional title.

# Implementation

1. Update src/lib/main.js to:
   • Accept output-format html as a new branch alongside json, csv, svg.
   • Add options:
     – --title string   (HTML document title; default "Function Plot")
     – --template-file string   (path to custom EJS template; if omitted, use built-in template)
   • When html format is selected:
     – Generate the SVG string as in EXPORT_SVG feature.
     – Load a default EJS template string embedded in code or read from template-file if provided.
     – Render HTML by passing title and svg content into EJS render function.
     – If --export-file is provided write the HTML string to the file; otherwise print to stdout.
   • Validate title is nonempty, template-file exists and is readable; on error exit with code 1 and print message.

# README Updates

- Update Usage section to list html as a valid output-format.
- Document new flags --title and --template-file.
- Provide examples:
  node src/lib/main.js --function sine --from 0 --to 6.28 --step 0.1 --output-format html
  node src/lib/main.js --function quadratic --output-format html --title "My Plot" --export-file plot.html

# Testing Deliverables

1. In tests/unit/main.test.js and sandbox/tests/main.test.js add tests to verify:
   • --output-format html produces a string containing <html>, <head>, <body>, and the <svg> content with correct dimensions.
   • Providing --title sets the <title> element accordingly.
   • Providing a custom --template-file loads and applies the custom template.
   • --export-file writes an HTML file with expected content (mock fs to intercept write).
   • Invalid template-file path or empty title causes process to exit with code 1 and print an error.
2. Ensure existing json, csv, svg tests continue to pass unmodified.