# `repository0`

This repository serves as a template demonstrating automated CI/CD workflows imported from intentïon `agentic‑lib` and includes a basic CLI built with Node.js. It provides fundamental commands to check the version, system diagnostics, and usage help, making it easy to test and extend CLI functionality.

You probably want to start with the template documentation here: [TEMPLATE-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/TEMPLATE-README.md)

## Overview

`repository0` is a demo repository showcasing GitHub workflows from intentïon `agentic‑lib` along with a simple CLI tool. The CLI functionality is implemented in `src/lib/main.js` and provides the following commands:

- **version**: Prints the current version (currently `2.1.0-0`).
- **diagnostics**: Displays diagnostic information including the Node.js version and a system status message.
- **help**: Shows a help message with usage instructions.

For any unrecognized command or when no command is provided, the CLI defaults to displaying the help message.

This repository demonstrates how automated workflows can manage source code, tests, and documentation, ensuring consistency across the project. The CLI and its associated tests verify that each command behaves as expected.

## What’s Inside

- **GitHub Workflows:**
  Workflows in the `.github/workflows/` directory use reusable workflows from intentïon `agentic‑lib` to automate project tasks.

- **Source Code:**
  The core CLI is implemented in `src/lib/main.js`. It handles command parsing and execution and is maintained alongside project tests.

- **Dependencies:**
  The `package.json` file defines the project dependencies and scripts for testing, formatting, linting, and running the CLI.

- **Tests:**
  Unit tests in the `tests/unit/` folder verify the functionality of the CLI commands (`version`, `diagnostics`, and `help`).

- **Documentation:**
  This README provides an overview of the repository. Detailed CLI usage instructions are available in [docs/USAGE.md](docs/USAGE.md).

## CLI Commands

You can interact with the CLI using the following commands:

- **version**
  - Description: Prints the current CLI version.
  - Usage: `npm run version` or `node src/lib/main.js version`
  - Example Output: `2.1.0-0`

- **diagnostics**
  - Description: Prints a JSON object with the Node.js version and a system status message.
  - Usage: `npm run diagnostics` or `node src/lib/main.js diagnostics`
  - Example Output:
    ```json
    { "nodeVersion": "v<your_node_version>", "message": "Diagnostics info: all systems operational" }
    ```

- **help**
  - Description: Displays a help message with usage instructions and available commands.
  - Usage: `npm run start` or `node src/lib/main.js help`
  - Example Output:
    ```
    Available commands:
      version      - Prints the version number.
      diagnostics  - Prints diagnostics information.
      help         - Displays this help message.

    Usage: node src/lib/main.js [command]
    ```

## Getting Started

The repository is pre-configured with necessary workflows, scripts, and tests. To run the CLI locally, make sure you have Node.js (version 20 or later) installed and set any required secrets if using automated workflows:

- `CHATGPT_API_SECRET_KEY` – A key for accessing account services via the OpenAI chat completions API (model `o3-mini`).

Set these secrets in your repository settings under *Settings > Secrets and Variables > Actions*.

Run the CLI with the following npm script:

```bash
npm run start
```

## intentïon `agentic‑lib`

The **intentïon `agentic‑lib`** is a collection of reusable GitHub Actions workflows that enable autonomous CI/CD processes. These workflows continuously update and evolve your codebase by interacting through branches and issues. Learn more at [https://github.com/xn-intenton-z2a/agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib).

*Warning:* Running these workflows may incur resource usage and charges.

## Additional Resources

- [MISSION.md](./MISSION.md)
- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [LICENSE](./LICENSE)
- [TEMPLATE-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/TEMPLATE-README.md)

### Contributing

We welcome contributions! See the [CONTRIBUTING.md](./CONTRIBUTING.md) file for guidelines on how to contribute.

## License

Released under the MIT License (see [LICENSE](./LICENSE)).
