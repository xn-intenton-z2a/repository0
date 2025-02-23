# `repository0`

Create a repository from a Repository Template to get started with the agentic coding system. See: [TEMPLATE README](TEMPLATE-README.md)

The repository is intended as a template that includes:
* A Template Base: A starting point for new projects.
* A Running Experiment: An example implementation that demonstrates one way to use the template (but is not necessarily production‑ready).
* Reusable Workflows from agentic‑lib: External automation workflows that are integrated into the template.

## Overview

`repository0` is a demo repository that showcases the GitHub workflows imported from intentïon agentic‑lib. Its primary purpose is to demonstrate automated CI/CD workflows and serves as a seed for the Equation Plotter—a CLI tool that generates plots for mathematical functions including quadratic, linear, sine, cosine, polar, exponential, and logarithmic functions. The tool supports multiple output formats (SVG, JSON, CSV, Markdown, ASCII, HTML, and PNG) and offers additional features:

- **Rotation Feature:** Rotate SVG output around its center using the `--rotate` flag.
- **Custom Title Support:** Add a custom title to the SVG output using the `--title` flag.
- **Interactive Mode:** Allows real-time user input via the `--interactive` flag.
- **Summary Feature:** Use the `--summary` flag to print summary statistics (min, max, average) for the first plot of each type.
- **Default Behavior:** When no arguments are provided, the tool outputs a usage message and a demo SVG file (`output.svg`) with default plots, and then terminates immediately without requiring any user input.
- **Data URI Support:** Generate a Data URI for the SVG output using the new `plotToDataUri` function, enabling easy embedding into web pages or other applications.
- **Improved Error Handling & Consistency:** Enhanced input validation (especially for sine formulas) and consistent code formatting for better maintenance.

> **Note:** The library now exports a `getSummary` function for convenience and improved test coverage.

## What’s Inside

- **GitHub Workflows:**
  Workflows in the `.github/workflows/` directory consume reusable workflows from intentïon agentic‑lib.

- **Source Code:**
  The main functionality resides in `src/lib/main.js`. This file implements the plotting logic, various parsing functions, and the CLI with all the features described above. Recent improvements include a consistent code style, better formatting, and stricter error checking. A new function `plotToDataUri` has been added to generate a Data URI from SVG output.

- **Dependencies:**
  The dependencies in `package.json` support the range of functionalities including CLI argument parsing, file generation, testing, and image conversion (via sharp).

- **Tests:**
  Unit tests located in `tests/unit/` validate core functionalities, ensure correct CLI behavior, and test new features like rotation, custom title, summary output, interactive mode, error handling, default SVG output behavior, and the new data URI generation.

- **Docs:**
  This `README.md` records the repository usage and tracks the evolution of the CLI behavior.

## Getting Started

This repository is preconfigured with essential workflows and scripts. Ensure you provide the required secrets:
- `CHATGPT_API_SECRET_KEY`

You can set these in your repository settings under *Settings > Secrets and Variables > Actions*. They are crucial for automated workflows like publishing packages and managing issues.

### Running the CLI

When you run the CLI with no arguments, it will print a usage message and automatically output an SVG file named `output.svg` containing the default plots, then exit immediately.

- Run with no arguments (default demo output):
  ```bash
  node src/lib/main.js
  ```
  This will print a usage message, create an `output.svg` file in the current directory, and terminate without waiting for user input.

- Generate JSON output:
  ```bash
  node src/lib/main.js output.json "sine:1,1,0,0,360,30"
  ```

- Generate CSV output:
  ```bash
  node src/lib/main.js output.csv "quad:1,0,0,-10,10,1"
  ```

- Generate Markdown output:
  ```bash
  node src/lib/main.js output.md "y=2x+3:-10,10,1"
  ```

- Generate ASCII art output:
  ```bash
  node src/lib/main.js output.txt "sine:1,1,0,0,360,30"
  ```

- Generate HTML output with grid overlay:
  ```bash
  node src/lib/main.js output.html --grid "y=2x+3:-10,10,1"
  ```

- Generate PNG output (new feature):
  ```bash
  node src/lib/main.js output.png "sine:1,1,0,0,360,30"
  ```

- **Rotation Feature:**
  Rotate the SVG output by specifying the angle:
  ```bash
  node src/lib/main.js output.svg "y=2x+3:-10,10,1" --rotate 45
  ```

- **Custom Title Feature:**
  Include a custom title which appears as a `<title>` element in the SVG:
  ```bash
  node src/lib/main.js output.svg "y=2x+3:-10,10,1" --title "My Custom Plot Title"
  ```

- **Summary Feature:**
  Print summary statistics (min, max, avg) for the first plot of each type by adding the `--summary` flag:
  ```bash
  node src/lib/main.js output.svg "y=2x+3:-10,10,1" --summary
  ```

- **Data URI Feature:**
  Generate a Data URI for the SVG output using the new function:
  ```bash
  node -e "console.log(require('./src/lib/main.js').plotToDataUri({ formulas: ['y=2x+3:-10,10,1'] }))"
  ```

- **Interactive Mode:**
  Engage real-time input with:
  ```bash
  node src/lib/main.js --interactive
  ```
  You will be prompted to enter semicolon-separated formula strings.

Other available flags:

- `--help` or `-h`: Display detailed usage instructions.
- `--json`, `--csv`, `--ascii`, `--md`, `--html`: Select respective output formats.
- `--grid`: Overlay grid lines on the generated SVG plots.
- `--debug`: Output internal parsed plot data for troubleshooting.
- `--dealers-choice`: Use a randomized color palette for the SVG plots.

## Linting

The project uses ESLint to enforce code quality and consistency. The `no-console` rule has been disabled in `src/lib/main.js` to support necessary CLI output.

## Test Coverage

Unit tests verify core functions, CLI behavior (including new rotation, custom title, summary output, interactive mode, default demo output behavior, and data URI generation), error handling, and the new `getSummary` function. These tests help ensure that enhancements do not break existing functionality.

## Future Enhancements

While the Equation Plotter CLI is fully functional:

- **Performance Optimization:** Further refine SVG rendering logic and plotting algorithms.
- **Enhanced Interactive CLI:** Improve the interactive mode for smoother real-time user experience.
- **Advanced Error Handling:** Continue refining error management and logging.
- **Additional Output Formats:** Explore integration with advanced plotting libraries for extended formats.
- **Mobile-Friendly Outputs:** Optimize visuals for different device displays.

## Tuning the agentic coding system

The current setup is open for future tuning. Modify the key files highlighted below as the project evolves:

- `README.md`
- `package.json`
- `src/lib/main.js`
- `tests/unit/main.test.js`

Other files taken into account by our workflows (but not changed by the workflows) include:

- `CONTRIBUTING.md` - Contribution guidelines for the project
- `eslint.config.js` - Linting and formatting configuration

## Diary of an agentic coding system - Day 1

(An exploration of our repository's evolution through the Equation Plotter Library's development.)

In its early hours, `repository0` emerged with the revolutionary idea of transforming mathematical formulae into visual plots. Initially featuring quadratic curves and sine waves, the functionality has been expanded to include linear, cosine, polar, exponential, and logarithmic plots. This release introduces a rotation feature for SVG outputs, custom title support for enhanced user-friendliness, an interactive CLI mode, summary output for plot statistics, a default demo output when no arguments are provided, improved error handling alongside consistent code formatting, an exported `getSummary` function, and a new Data URI generation feature for embedding plots.

**Version:** Equation Plotter Library version 0.2.0-14
