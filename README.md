# `repository0`

This repository template demonstrates GitHub workflows imported from intentïon `agentic‑lib` and serves as a demo for automated CI/CD processes. For guidance on using this template, refer to [TEMPLATE-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/TEMPLATE-README.md).

## Overview

`repository0` is a demo repository showcasing GitHub workflows from intentïon `agentic‑lib` for automated CI/CD processes. It includes a CLI tool implemented in `src/lib/main.js` that now supports a subcommand architecture for enhanced clarity, maintainability, and usability.

### New CLI Subcommands

The CLI has been refactored to use subcommands. The following subcommands are available:

- **version**
  - **Usage:** `node src/lib/main.js version`
  - **Description:** Display the package version.

- **diagnostics**
  - **Usage:** `node src/lib/main.js diagnostics`
  - **Description:** Show diagnostic information including Node version, package version, and dependency list.

- **update**
  - **Usage:** `node src/lib/main.js update`
  - **Description:** Check if a new CLI version is available from the npm registry.

- **json**
  - **Usage:**
    - Standard: `node src/lib/main.js json [extraArgs]`
    - Extended Metadata: `node src/lib/main.js json --extended [extraArgs]`
  - **Description:** Output CLI response in JSON format. The extended mode includes additional metadata (current working directory and process uptime).

- **verbose**
  - **Usage:**
    - Basic verbose: `node src/lib/main.js verbose`
    - Set warning index: `node src/lib/main.js verbose --warning <number>`
  - **Description:** Enable verbose logging. It outputs parsed arguments and internal state or sets the warning index mode if specified.

- **warn**
  - **Usage:** `node src/lib/main.js warn --value <number>`
  - **Description:** Explicitly set the warning index mode.

- **nan**
  - **Usage:** `node src/lib/main.js nan`
  - **Description:** Display informational output regarding NaN flags. (Note: NaN-related flags are informational only.)

### Legacy Flag Support

For backward compatibility, the following flags are still supported and internally mapped to the new subcommands:

- `--help` or `-h`
- `--pkg-version`
- `--diagnostics`
- `--check-update`
- `--json-output` and `--json-extended`
- `--verbose`
- `--warning-index-mode`
- `--diagnose-nan`

### Environment Configuration

The CLI automatically loads configuration from a `.env` file via the `dotenv` package. If the `CLI_MODE` environment variable is set, it will be logged at startup.

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

3. Run the CLI using one of the subcommands. Example:

   npm start -- version

4. Execute tests:

   npm test

## intentïon `agentic‑lib`

The **intentïon `agentic‑lib`** is a collection of reusable GitHub Actions workflows that enable autonomous operations and continuous evolution of your code. For more information and updates, visit [intentïon agentic‑lib](https://github.com/xn-intenton-z2a/agentic-lib).
