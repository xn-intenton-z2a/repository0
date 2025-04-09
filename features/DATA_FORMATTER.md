# DATA_FORMATTER

## Overview
This feature introduces a lightweight data formatting and conversion utility to the CLI tool. DATA_FORMATTER empowers users to transform and reformat data between common formats (such as CSV, JSON, and XML) directly from the command line. By providing a simple, self-contained module, this feature streamlines data workflows and supports automated processing pipelines, in line with our mission for healthy collaboration.

## CLI Integration
- **Global Flag:** Introduce a new flag `--format` to invoke the DATA_FORMATTER module.
- **Sub-Commands:**
  - `csv2json <input>`: Converts CSV data to JSON format. Accepts either a file path or piped input.
  - `json2csv <input>`: Converts JSON data to CSV format. Supports both file and standard input.
  - (Optionally) `xml2json` and `json2xml` can be added in future iterations for XML conversions.
- **Usage Examples:**
  - `node src/lib/main.js --format csv2json ./data.csv`
  - `cat data.csv | node src/lib/main.js --format csv2json --json-pretty`

## Implementation Details
- **Parsing and Conversion:** Leverage Node’s built-in libraries along with lightweight parsing modules to read, validate, and convert data formats. Ensure proper error handling for malformed data and file I/O exceptions.
- **Modularity:** Implement DATA_FORMATTER as a self-contained library in a single source file, keeping the codebase minimal and maintainable.
- **Error Handling:** Provide clear error messages when conversion fails (e.g., syntax errors in input data), and support fallback outputs when possible.
- **Testing & Documentation:** Include comprehensive unit tests simulating file-based and stream-based inputs. Update the README and inline comments with examples and usage guidelines.

## Alignment with Repository Mission
DATA_FORMATTER reinforces our mission by extending the CLI tool’s utility in practical data transformation tasks. It enables users to quickly convert and format data as part of automated workflows, fostering streamlined collaboration and modular design.
