# owl-builder

**owl-builder** is a versatile JavaScript library and CLI tool designed to build, manage, and query OWL ontologies. It not only provides functionality for ontology creation from public data sources but also serves as a dynamic knowledge base with a user-friendly command-line interface.

## Installation

Install via npm:

```bash
npm install owl-builder
```

## Features

- **Ontology Management:** Build and query OWL ontologies from diverse data sources.
- **CLI Tool:** Manage your ontologies via a comprehensive command-line interface.
- **Output Flexibility:** Generate output in multiple formats (SVG, JSON, CSV, Markdown, HTML, ASCII, and PNG).
- **Rotation & Custom Title:** Enhance SVG outputs by applying rotation transforms and adding custom titles.
- **Interactive Mode:** Enjoy real-time user input for on-the-fly plotting or ontology queries.
- **Summary & Table Output:** Quickly view summary statistics (min, max, average) for your data plots in textual or tabular form.
- **Enhanced Error Handling:** Robust error logging (using console.warn for non-critical issues) and a global uncaught exception handler improve stability across all operations.

## Usage

To run the CLI tool and see help instructions:

```bash
node src/lib/main.js --help
```

### Example Commands

- **Default Demo Output (SVG):**
  ```bash
  node src/lib/main.js
  ```
  This command generates a demo SVG file (`output.svg`) with default plots and terminates immediately without waiting for further input.

- **Generate JSON Output:**
  ```bash
  node src/lib/main.js output.json "sine:1,1,0,0,360,30"
  ```

- **Generate CSV Output:**
  ```bash
  node src/lib/main.js output.csv "quad:1,0,0,-10,10,1"
  ```

- **Generate Markdown Output:**
  ```bash
  node src/lib/main.js output.md "y=2x+3:-10,10,1"
  ```

- **Generate ASCII Art Output:**
  ```bash
  node src/lib/main.js output.txt "sine:1,1,0,0,360,30"
  ```

- **Generate HTML Output with Grid:**
  ```bash
  node src/lib/main.js output.html --grid "y=2x+3:-10,10,1"
  ```

- **Generate PNG Output:**
  ```bash
  node src/lib/main.js output.png "sine:1,1,0,0,360,30"
  ```

- **Rotation Feature:**
  ```bash
  node src/lib/main.js output.svg "y=2x+3:-10,10,1" --rotate 45
  ```

- **Custom Title Feature:**
  ```bash
  node src/lib/main.js output.svg "y=2x+3:-10,10,1" --title "My Custom Plot Title"
  ```

- **Summary Feature:**
  ```bash
  node src/lib/main.js output.svg "y=2x+3:-10,10,1" --summary
  ```

- **Table Summary Feature:**
  ```bash
  node src/lib/main.js output.svg "y=2x+3:-10,10,1" --table
  ```

- **Interactive Mode:**
  ```bash
  node src/lib/main.js --interactive
  ```
  When prompted, enter semicolon-separated formula strings.

Other flags:
- `--help` or `-h`: Display usage instructions.
- `--json`, `--csv`, `--ascii`, `--md`, `--html`: Choose output format.
- `--grid`: Overlay grid lines on SVG plots.
- `--debug`: Print internal parsed plot data.
- `--dealers-choice`: Use a randomized color palette for SVG plots.

## Incremental Changes Plan

Our development strategy is divided into phases:

1. **Phase 1 - Refactoring & Optimization:**
   - Modularize plotting functions and CLI logic.
   - Optimize performance with refined utility functions.

2. **Phase 2 - Robustness & Error Handling:**
   - Enhance input validation, particularly for formula parsing.
   - Improve error messaging for clarity (using console.warn for non-critical errors).

3. **Phase 3 - Extended CLI Features:**
   - Expand interactive mode and add new output formats, including table summary output.
   - Integrate rotation and custom title features seamlessly.

4. **Phase 4 - Testing & Documentation:**
   - Increase test coverage to include new features, error handling scenarios, and interactive CLI mode.
   - Update documentation to reflect development milestones and extended functionality.

5. **Phase 5 - Future Enhancements:**
   - Further optimize SVG rendering performance.
   - Explore additional output formats and responsive design improvements.

## Contributing

We welcome contributions! Please review our [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to contribute effectively:

- **Open an Issue:** Provide detailed descriptions and reproducible examples.
- **Submit a Pull Request:** Follow our coding standards, write tests, and update documentation as needed.
- **Enhance Documentation:** Help us keep our docs clear and up-to-date.

Your contributions help make **owl-builder** a robust and reliable tool for ontology management and querying.

## Linting & Testing

- **Linting:** We use ESLint and Prettier for code quality. Run:
  ```bash
  npm run linting
  ```

- **Testing:** Unit tests are located in `tests/unit/`. Run tests with:
  ```bash
  npm test
  ```

## Additional Resources

- **Change Log:** See our version history in the source code comments and documentation.
- **Support:** Open an issue on GitHub for bugs or feature requests.

## License

Released under the Apache-2.0 License.
