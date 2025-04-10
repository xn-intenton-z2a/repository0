# `repository0`

This repository template demonstrates GitHub workflows imported from intentïon `agentic‑lib` and serves as a demo for automated CI/CD processes. For guidance on using this template, refer to [TEMPLATE-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/TEMPLATE-README.md).

## Overview

`repository0` is a demo repository showcasing GitHub workflows from intentïon `agentic‑lib` for automated CI/CD processes. It includes a CLI tool implemented in `src/lib/main.js` that supports various options for configuration and debugging. This documentation reflects the latest CLI options and behavior implemented in version 1.4.1-13.

## CLI Usage

Run the CLI using:

  node src/lib/main.js [options]

### Available Flags

- **--help, -h**  
  Display help and usage information.

- **--version**  
  Display the package version by reading `package.json`.

- **--warning-index-mode <value>**  
  Set the warning index mode to a numeric value.
  
  **Example:**
  node src/lib/main.js --warning-index-mode 5

- **--diagnostics**  
  Output detailed diagnostic information including Node version, package version, and list of dependencies.

- **--json-output**  
  Output the CLI response in JSON format. The JSON structure includes:
    • `arguments`: Array of provided command line arguments.
    • `metadata`: An object containing `timestamp`, `nodeVersion`, and `packageVersion`.

  **Example:**
  node src/lib/main.js --json-output extraArg

- **--json-extended**  
  Output the CLI response in JSON format with extended metadata. In addition to the standard fields, the metadata object includes:
    • `cwd`: The current working directory
    • `uptime`: The process uptime in seconds
  
  **Example:**
  node src/lib/main.js --json-extended extraArg

- **--verbose**  
  Enable verbose logging for detailed debug information. When activated, the CLI prints:
    • A "Verbose Mode Enabled:" message.
    • Parsed command-line arguments.
    • Internal state details, such as the warning index mode.

### Environment Configuration

The CLI automatically loads environment configuration via the `dotenv` package. For example, if you set the environment variable `CLI_MODE` in a `.env` file, the CLI will output:

  Environment CLI_MODE: <value>

Ensure your project root contains a `.env` file with the appropriate configurations.

### NaN Directives

Any input related to NaN directives is intentionally treated as a no-op per project guidelines. Although flags such as `--toggle-allow-nan`, `--allow-nan-inline`, `--diagnose-nan`, and `--ignore-invalid` are referenced in metadata and the package description, their behavior is not directly activated within this CLI implementation.

## Workflows and Dependencies

The repository's workflows manage testing, formatting, linting, and CI/CD operations. For more details, please refer to:

- [MISSION.md](./MISSION.md)
- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [LICENSE](./LICENSE)
- [TEMPLATE-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/TEMPLATE-README.md)

## Getting Started

1. Configure the required secrets in your repository settings (e.g., `CHATGPT_API_SECRET_KEY`).
2. Install dependencies with:

  npm install

3. Run the CLI:

  npm start

4. Execute tests:

  npm test

## intentïon `agentic‑lib`

The **intentïon `agentic‑lib`** is a collection of reusable GitHub Actions workflows that enable autonomous operations and continuous evolution of your code. For more information and updates, visit [intentïon agentic‑lib](https://github.com/xn-intenton-z2a/agentic-lib).
