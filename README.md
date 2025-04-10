# `repository0`

This repository template demonstrates GitHub workflows imported from intentïon `agentic‑lib` and serves as a demo for automated CI/CD processes. For guidance on using this template, refer to [TEMPLATE-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/TEMPLATE-README.md).

## Overview

`repository0` is a demo repository showcasing GitHub workflows from intentïon `agentic‑lib` for automated CI/CD processes. It includes a CLI tool implemented in `src/lib/main.js` that supports various options for configuration and debugging. This documentation reflects the latest CLI options and behavior implemented in version 1.4.1-13.

**Note:** The CLI argument parsing has been refactored to leverage yargs for robust and maintainable parsing. In addition to the existing features, the CLI now benefits from automatic help generation and improved flag handling. Specifically, the JSON output generation has been refactored into a helper function that supports both standard and extended metadata formats, ensuring consistency and easier maintenance.

The tool supports the following flags:

- **--help, -h**  
  Display help and usage information.

- **--pkg-version**  
  Display the package version by reading `package.json`. If `package.json` is missing, corrupt, or unreadable, a clear error message is provided and the process exits with a non-zero status.

- **--warning-index-mode <value>**  
  Set the warning index mode to a numeric value.
  
  **Example:**
  node src/lib/main.js --warning-index-mode 5

- **--diagnostics**  
  Output detailed diagnostic information including Node version, package version, and list of dependencies. If there is an error reading `package.json`, an error message will be displayed and the process exits with a non-zero status.

- **--json-output**  
  Output the CLI response in JSON format. The JSON structure includes:
  • `arguments`: Array of provided command line arguments.
  • `metadata`: An object containing `timestamp`, `nodeVersion`, and `packageVersion`.
  
  In case of a missing or corrupt `package.json`, a valid JSON error response is returned and the process exits with a non-zero status.
  
  **Example:**
  node src/lib/main.js --json-output extraArg

- **--json-extended**  
  Output the CLI response in JSON format with extended metadata. In addition to the standard fields, the metadata object includes:
  • `cwd`: The current working directory  
  • `uptime`: The process uptime in seconds
  
  **Example:**
  node src/lib/main.js --json-extended extraArg

- **--verbose, -v**  
  Enable verbose logging for detailed debug information. When activated, the CLI prints:
  • A "Verbose Mode Enabled:" message.
  • Parsed command-line arguments.
  • Internal state details, such as the warning index mode (if provided).

- **--diagnose-nan**  
  Show diagnostic information related to NaN handling.

- **--check-update**  
  Check if a new version is available from the npm registry. When invoked, the CLI fetches the latest version information from [npm registry](https://registry.npmjs.org/@xn-intenton-z2a/repository0) and compares it with the version specified in `package.json`. It then outputs whether your CLI is up-to-date or if an update is available.

  **Example:**
  node src/lib/main.js --check-update

### NaN Directives

Please note that all CLI flags related to NaN (including --diagnose-nan, --toggle-allow-nan, --allow-nan-inline, and --ignore-invalid) are intentionally non-operative. This design choice ensures that the tool maintains consistent behavior and avoids misinterpretation regarding the management of 'Not a Number' (NaN) values. For further guidelines, please refer to [CONTRIBUTING.md](./CONTRIBUTING.md).

### Environment Configuration

The CLI automatically loads environment configuration via the `dotenv` package. For example, if you set the environment variable `CLI_MODE` in a `.env` file, the CLI will output:

  Environment CLI_MODE: <value>

Ensure your project root contains a `.env` file with the appropriate configurations.

### NaN Directives in Practice

All flags related to NaN are provided solely for informational purposes and do not influence the behavior of the CLI. They are part of the interface only and are designed to avoid unnecessary processing or side effects.

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