# Owl Builder

Owl Builder is a versatile JavaScript library and CLI tool for building, managing, and querying OWL ontologies.

## Installation

Install via npm:

```bash
npm install owl-builder
```

- **Rotation Feature:** Rotate SVG output around its center using the `--rotate` flag.
- **Custom Title Support:** Add a custom title to the SVG output using the `--title` flag.
- **Interactive Mode:** Allows real-time user input via the `--interactive` flag.
- **Summary Feature:** Use the `--summary` flag to print summary statistics (min, max, average) for the first plot of each type.
- **Default Behavior:** When no arguments are provided, the tool outputs a usage message and a demo SVG file (`output.svg`) with default plots, then terminates immediately without requiring any user input.
- **Improved Error Handling & Consistency:** Enhanced input validation (especially for sine formulas) and consistent code formatting for better maintenance.
- **Incremental Changes Plan:** A detailed, step-by-step plan to evolve the project:
  1. **Code Refactoring:** Modularize and optimize plotting functions and CLI logic.
  2. **Robust Error Handling:** Enhance input validation and error messaging across parsing functions.
  3. **CLI Enhancements:** Expand interactive mode and add more output options.
  4. **Testing Improvements:** Incrementally add tests to cover new features like rotation, custom titles, and summary outputs.
  5. **Documentation Updates:** Continuously update this README and CONTRIBUTING.md to reflect project goals and development milestones.

## Usage

To run the CLI tool:

```bash
node src/lib/main.js --help
```

## Testing

- **Source Code:**
  The main functionality resides in `src/lib/main.js`, which implements the plotting logic, various parsing functions, and the CLI with all the described features. The source code now includes a comment block outlining our incremental changes plan.

- **Dependencies:**
  The dependencies in `package.json` support CLI argument parsing, file generation, testing, and image conversion (via sharp). A new script, `plan`, has been added to remind developers of the incremental plan detailed in this README.

- **Tests:**
  Unit tests in `tests/unit/` validate core functionalities, CLI behavior (including new features), and now check for the presence of the incremental changes plan in the code.

- **Docs:**
  This README outlines project usage and a detailed incremental development plan, aligning with the guidelines in `CONTRIBUTING.md`.

## Getting Started

This repository is preconfigured with essential workflows and scripts. Ensure you provide the required secrets:
- `CHATGPT_API_SECRET_KEY`

Set these in your repository settings under *Settings > Secrets and Variables > Actions*.

### Running the CLI

- **Default Demo Output (SVG):**
  ```bash
  node src/lib/main.js
  ```
  Outputs a usage message, creates an `output.svg` file with default plots, and exits.

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

- **Interactive Mode:**
  ```bash
  node src/lib/main.js --interactive
  ```
  Enter semicolon-separated formula strings when prompted.

Other flags:
- `--help` or `-h`: Display usage instructions.
- `--json`, `--csv`, `--ascii`, `--md`, `--html`: Choose output format.
- `--grid`: Overlay grid lines on SVG plots.
- `--debug`: Print internal parsed plot data.
- `--dealers-choice`: Use randomized color palette for SVG plots.

## Incremental Changes Plan

Our incremental development strategy focuses on continuous improvements:
1. **Phase 1 - Refactoring & Optimization:**
   - Break down complex plotting functions into modular components.
   - Optimize performance by refining the custom range and formatting functions.

2. **Phase 2 - Robustness & Error Handling:**
   - Enhance input validation for formula parsing (especially for sine formulas).
   - Update error messages for clarity.

3. **Phase 3 - Extended CLI Features:**
   - Improve interactive mode and add new output formats.
   - Integrate rotation and custom title features more seamlessly.

4. **Phase 4 - Testing & Documentation:**
   - Expand unit test coverage to include new features and error handling.
   - Maintain up-to-date documentation reflecting changes
     and guide contributions as per CONTRIBUTING.md.

5. **Phase 5 - Future Enhancements:**
   - Explore performance optimizations in SVG rendering.
   - Consider additional output formats and mobile-friendly designs.

## Linting

ESLint is used for code quality and consistency; `no-console` is disabled for CLI output.

## Test Coverage

Unit tests in `tests/unit/` cover core functions, CLI behavior, and new features.

## Tuning the Agentic Coding System

Key files evolving alongside project goals:
- `README.md`
- `package.json` (new script: `plan`)
- `src/lib/main.js`
- `tests/unit/main.test.js`

Refer to `CONTRIBUTING.md` for detailed guidelines.

## Diary of an Agentic Coding System - Day 1

The repository began with simple quadratic and sine plots. Our staged plan now aims to expand functionality to include interactive modes, multiple output formats, and enhanced error handling. Each incremental update is guided by our project goals and documented here.

**Version:** Equation Plotter Library version 0.2.0-14
=======
Run the tests using:

```bash
npm test
```

## Contributing

We welcome contributions! Please review our [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to help improve Owl Builder.

