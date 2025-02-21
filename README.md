# `repository0`

Hello Christo

Create a repository from a Repository Template to get started with the agentic coding system. See: [Tamplate README](TEMPLATE-README.md)

## Overview
`repository0` is a demo repository that showcases the GitHub workflows imported from intentïon agentic‑lib. Its primary purpose is to demonstrate these automated CI/CD workflows. One example seed idea included here is the Equation Plotter—a simple tool that generates plots (SVG, JSON, CSV, Markdown, ASCII, HTML, and now PNG) of mathematical functions like quadratic, linear, sine, cosine, polar, exponential, and logarithmic functions. The tool uses a custom range function for generating number sequences, eliminating the need for an external library for this purpose, and supports multiple output formats via a CLI.

## What’s Inside

- **GitHub Workflows:**
  Workflows in the `.github/workflows/` directory consume reusable workflows from intentïon agentic‑lib.

- **Source Code:**
  The main functionality is in `src/lib/main.js`. It provides a CLI with various options to generate plots in different formats (SVG, JSON, CSV, Markdown, ASCII, HTML, and now PNG). Note: The source file has been updated to disable the `no-console` rule for smoother linting.

- **Dependencies:**
  `package.json` can be modified by the workflow to add or update dependencies and it also defines some of the test and build scripts.

- **Tests:**
  Unit tests in the `tests/unit/` folder validate critical exported functions and ensure the CLI produces expected outputs, including additional tests for error handling and branch coverage.

- **Docs:**
  This `README.md` is maintained to keep track of the repository usage and the evolution of the CLI behaviour.

## Getting Started

This repository is already set up with the necessary workflows and scripts, but you need to supply the following secrets:
- `CHATGPT_API_SECRET_KEY`

Set these secrets in your repository settings under *Settings > Secrets and Variables > Actions*. They are essential for automated workflows such as publishing packages and managing issues.

### Running the CLI

The CLI offers a variety of output formats depending on the file extension provided:

- Run the demo with defaults (SVG output):
  ```bash
  node src/lib/main.js
  ```

- Generate a JSON output:
  ```bash
  node src/lib/main.js output.json "sine:1,1,0,0,360,30"
  ```

- Generate a CSV output:
  ```bash
  node src/lib/main.js output.csv "quad:1,0,0,-10,10,1"
  ```

- Generate a Markdown output:
  ```bash
  node src/lib/main.js output.md "y=2x+3:-10,10,1"
  ```

- Generate an ASCII art output:
  ```bash
  node src/lib/main.js output.txt "sine:1,1,0,0,360,30"
  ```

- Generate an HTML output with grid overlay:
  ```bash
  node src/lib/main.js output.html --grid "y=2x+3:-10,10,1"
  ```

- Generate a PNG output (new feature):
  ```bash
  node src/lib/main.js output.png "sine:1,1,0,0,360,30"
  ```

- **Interactive Mode:**
  For real-time user input, run:
  ```bash
  node src/lib/main.js --interactive
  ```
  You will be prompted to enter semicolon-separated formula strings.

Other flags include:

- `--help` or `-h`: Display the help message with detailed usage instructions.
- `--json`, `--csv`, `--ascii`, `--grid`, `--debug`, `--dealers-choice`, `--demo`, `--md`, `--html` for respective functionalities.

## Linting
The project uses ESLint for code quality. The `no-console` rule has been disabled in `src/lib/main.js` to facilitate necessary console output in the CLI, ensuring that linting passes with fewer warnings.

## Test Coverage
The project includes a suite of tests verifying key exported functions, CLI behavior, and error handling, ensuring that changes in the code do not break critical functionality.

## Tuning the agentic coding system

The default setup is open and can be refined over time. Modify these files, which the workflow takes into consideration:
- `CONTRIBUTING.md` - Guidelines for contributing to the project.
- `eslint.config.js` - Linting and formatting configuration.

Other files considered by the workflow:
- `README.md`
- `package.json`
- `src/lib/main.js`
- `tests/unit/main.test.js`

## Diary of an agentic coding system - Day 1
(An narrative exploration of the repository's evolution when asked to create an Equation Plotter Library.)

In the early hours, `repository0` burst into existence with a bold declaration: an Equation Plotter Library transforming mathematical functions into visual representations. The initial implementation showcased quadratic curves and sine waves. Subsequent revisions expanded functionality to include linear, cosine, polar, exponential, and logarithmic plots, while also introducing multiple output formats via the CLI.

**Version:** Equation Plotter Library version 0.2.0-6

## Next Up
- Enhance performance by optimizing the SVG rendering logic and plotting algorithms.
- Introduce an interactive CLI mode for real-time user input.
- Improve error handling and logging mechanisms across the application.
- Expand the library to support additional equation types and output formats.
- Refine CLI argument parsing for enhanced user guidance.
- Refactor formula parsing logic for improved maintainability.
- Investigate integration with external plotting libraries for advanced visuals.

## Final Notes
`repository0` serves as a demonstration of intentïon agentic‑lib workflows and acts as a starting point for further enhancements. This release increases unit test coverage by adding error handling and branch condition tests.
