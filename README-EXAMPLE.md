# repository0

**Equation Plotter Library**

This repository hosts an Equation Plotter Library that generates SVG plots (and other formats) from mathematical equations. The tool supports quadratic, linear, sine, cosine, polar, exponential, and logarithmic functions, making it a versatile solution for visualizing mathematical relationships.

## Overview

The Equation Plotter Library can generate plots in various output formats:

- SVG
- HTML
- JSON
- CSV
- ASCII
- Plain text
- Markdown

It can be used both as a CLI tool and as an importable library in Node.js projects.

## CLI Usage

The library provides a command line interface to generate plot files. Below are some usage examples:

```sh
# Generate an SVG file with a quadratic and a sine plot
node src/lib/main.js output.svg "x^2+y-1=0" "sine:1,1,0,0,360,10"

# Generate a JSON output
node src/lib/main.js output.json --json "x^2+y-1=0" "sine:1,1,0,0,360,10"

# Generate a CSV output
node src/lib/main.js output.csv --csv "x^2+y-1=0" "sine:1,1,0,0,360,10"

# Generate an HTML file (note the .html extension)
node src/lib/main.js output.html "x^2+y-1=0" "sine:1,1,0,0,360,10"

# Generate ASCII art output
node src/lib/main.js output.txt --ascii "x^2+y-1=0" "sine:1,1,0,0,360,10"

# Display version
node src/lib/main.js --version

# Display help
node src/lib/main.js --help

# Run demo tests
node src/lib/main.js --demo
```

When no formulas are provided, the tool uses default plotting for all supported functions.

## API Usage

You can also import the library into your projects. For example:

```js
import { plotToSvg, plotToJson, plotToHtml, plotToMarkdown } from './src/lib/main.js';

const svgContent = plotToSvg({ formulas: ["x^2+y-1=0", "sine:1,1,0,0,360,10"] });
console.log(svgContent);
```

## Running Tests

Unit tests are available in the `tests/unit/` directory. To run the tests, execute:

```sh
npm test
```

## Project Structure

- **CLI:** Main execution is handled in `src/lib/main.js` with comprehensive CLI options (e.g., --json, --csv, --ascii, --grid, --demo, --version).
- **Source Code:** The core plotting logic is implemented in `src/lib/main.js`.
- **Tests:** Unit tests to ensure exported functions and CLI behavior are located in `tests/unit/`.
- **Dependencies:** See `package.json` for version and dependency details.

## Contributing

Please refer to the [CONTRIBUTING.md](./CONTRIBUTING.md) file for guidelines on how to contribute.

## License

This project is licensed under the MIT License.

## Additional Information

- The project continuously evolves based on automated workflows and feedback.
- CLI usage documentation is kept in sync with the source code to ensure clarity and ease of use.
