# owl-builder

**owl-builder** is a versatile JavaScript library and CLI tool designed to build, manage, and query OWL ontologies. It provides functionality for ontology creation from public data sources while offering dynamic data plotting features in multiple formats (SVG, JSON, CSV, Markdown, HTML, ASCII, and PNG).

## Installation

Install via npm:

```bash
npm install owl-builder
```

## Features

- **Ontology Management:** Build and query OWL ontologies from diverse data sources.
- **CLI Tool:** Manage your ontologies and generate visual data plots via a comprehensive command-line interface.
- **Output Flexibility:** Generate output in multiple formats (SVG, JSON, CSV, Markdown, HTML, ASCII, and PNG).
- **Rotation & Custom Title:** Enhance SVG outputs by applying rotation transforms and adding custom titles.
- **Interactive Mode:** Enjoy real-time user input for on-the-fly plotting or ontology queries.
- **Summary & Table Output:** Quickly view summary statistics (min, max, average) for your data plots in textual or tabular form.
- **Enhanced Error Handling:** Robust error logging and a global uncaught exception handler improve stability across operations.

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
  Generates a demo SVG file (`output.svg`) with default plots.

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
- `--rotate`: Specify a rotation angle for the SVG output.
- `--title`: Add a custom title to the SVG output.
- `--summary`: Show summary statistics for plots.
- `--table`: Output summary statistics in a table format.

## Incremental Changes Plan

Our development strategy is aligned with the guidelines in [CONTRIBUTING.md](./CONTRIBUTING.md):

1. **Refactoring & Modularization:** Simplify and organize plotting functions and CLI logic to support both ontology management and dynamic data visualization.
2. **Simplification:** Remove overly complex and redundant mathematical computations while preserving core plotting functionality.
3. **Enhanced CLI Features:** Improve interactive mode, output formatting, and integration of rotation and custom title features.
4. **Robustness:** Strengthen error handling and expand test coverage.
5. **Future Enhancements:** Integrate further ontology management features and design improvements based on community feedback.

## Contributing

We welcome contributions! Please review our [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to contribute effectively.

## Linting & Testing

- **Linting:** Run `npm run linting` to check for style issues (we use ESLint and Prettier).
- **Testing:** Unit tests are located in `tests/unit/`. Run tests with `npm test`.

## License

Released under the Apache-2.0 License.
