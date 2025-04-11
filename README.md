# `repository0`

This repository template demonstrates GitHub workflows imported from intentïon `agentic‑lib` and serves as a demo for automated CI/CD processes. For guidance on using this template, refer to [TEMPLATE-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/TEMPLATE-README.md).

## Overview

`repository0` is a demo repository showcasing GitHub workflows from intentïon `agentic‑lib` for automated CI/CD processes. It includes a CLI tool implemented in `src/lib/main.js` that now exclusively uses a subcommand architecture for enhanced clarity, maintainability, and usability. Legacy CLI flags have been deprecated in favor of explicit subcommands. Additionally, a new **config** command has been introduced to manage CLI configuration settings via a `config.json` file.

### CLI Subcommands

The CLI now supports the following subcommands:

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
    - Standard: `node src/lib/main.js json [extra ...]`
    - Extended Metadata: `node src/lib/main.js json --extended [extra ...]`
  - **Description:** Output CLI response in JSON format. Extended mode includes additional metadata such as the current working directory and process uptime.

- **verbose**
  - **Usage:**
    - Basic verbose: `node src/lib/main.js verbose`
    - Set warning index: `node src/lib/main.js verbose --warning <number>`
  - **Description:** Enable verbose logging; outputs parsed arguments and internal state or sets the warning index mode if specified.

- **warn**
  - **Usage:** `node src/lib/main.js warn --value <number>`
  - **Description:** Explicitly set the warning index mode.

- **nan**
  - **Usage:** `node src/lib/main.js nan`
  - **Description:** Display informational output regarding NaN flags. This command is purely informational and non-operative.

- **config**
  - **Subcommands:**
    - **view**
      - **Usage:** `node src/lib/main.js config view [--json]`
      - **Description:** View the current CLI configuration from the `config.json` file. If the file does not exist, a default empty configuration is created.
    - **set**
      - **Usage:** `node src/lib/main.js config set --key <key> --value <value> [--json]`
      - **Description:** Update a configuration key in the `config.json` file with a new value.

### Detailed Deprecation Notice for Legacy CLI Flags

Legacy CLI flags are no longer supported and have been mapped to their corresponding subcommands. Please update your usage according to the table below. Note that NaN-related flags (e.g. `--diagnose-nan`) are intentionally locked to remain non-operative.

| Legacy Flag            | New Subcommand (or Option)       | Example Usage                                             |
|------------------------|----------------------------------|----------------------------------------------------------|
| `--help`               | *Use subcommands*                | `node src/lib/main.js version`                           |
| `--pkg-version`        | `version`                        | `node src/lib/main.js version`                           |
| `--diagnostics`        | `diagnostics`                    | `node src/lib/main.js diagnostics`                       |
| `--check-update`       | `update`                         | `node src/lib/main.js update`                            |
| `--json-output`        | `json`                           | `node src/lib/main.js json [extra ...]`                  |
| `--json-extended`      | `json --extended`                | `node src/lib/main.js json --extended [extra ...]`       |
| `--verbose`            | `verbose`                        | `node src/lib/main.js verbose` or `node src/lib/main.js verbose --warning 3` |
| `--warning-index-mode` | `verbose` (with --warning option)| `node src/lib/main.js verbose --warning 5`               |
| `--diagnose-nan`       | `nan`                            | `node src/lib/main.js nan`                               |

**Rationale:**

Migrating to a subcommand architecture improves clarity, maintainability, and facilitates automated processing of CLI output. This redesign makes the CLI more intuitive and ensures that legacy flags produce deprecation warnings along with guidance on the updated usage. Particularly, the new **config** commands enhance flexibility by allowing users to manage CLI settings without modifying the code.

### Environment Configuration and CLI_MODE

The CLI automatically loads configuration from a `.env` file via the `dotenv` package. A special environment variable, **CLI_MODE**, can be set in your `.env` file to trigger additional logging and diagnostic output at startup. For example:

```env
CLI_MODE=debug
```

This will result in the CLI logging a message such as "Environment CLI_MODE: debug". When **CLI_MODE** is not set, the CLI will operate normally without the extra logging.

### Note on Legacy Flags

Legacy CLI flags (e.g., `--help`, `--pkg-version`, `--diagnostics`, `--check-update`, `--json-output`, `--json-extended`, `--verbose`, `--warning-index-mode`, `--diagnose-nan`) are deprecated. Using them will trigger a deprecation warning and execute the mapped functionality using the corresponding new subcommands. Please use the updated subcommand usage as detailed above.

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

4. To manage configuration, use the **config** commands. For example, view settings:

   node src/lib/main.js config view

   Or update a configuration item:

   node src/lib/main.js config set --key theme --value dark

5. Execute tests:

   npm test

## intentïon `agentic‑lib`

The **intentïon `agentic‑lib`** is a collection of reusable GitHub Actions workflows that enable autonomous operations and continuous evolution of your code. For more information and updates, visit [intentïon agentic‑lib](https://github.com/xn-intenton-z2a/agentic-lib).