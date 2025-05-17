# repository0

A template showcasing CLI argument echo behavior and agentic-lib workflows.

## Overview

`repository0` is a demo repository that showcases:
- A CLI that echoes provided arguments.
- GitHub workflows from intentïon [`agentic-lib`](https://github.com/xn-intenton-z2a/agentic-lib) for autonomous CI/CD.

## Source Code

- `src/lib/main.js`: Defines the `main(args)` function that logs provided arguments.
- `sandbox/source/main.js`: CLI entry point that invokes `main(args)` with command-line arguments and supports the `mission` command.

## Getting Started

1. **Clone the repository:**
   ```sh
   git clone <repository_url>
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Run tests:**
   ```sh
   npm test
   ```
4. **Run the CLI:**
   ```sh
   npm run start -- foo bar
   ```
   **Expected output:**
   ```sh
   Run with: ["foo","bar"]
   ```
5. **View Mission:**
   ```sh
   npm run start mission
   ```
   **Expected output:**
   The contents of `MISSION.md`, starting with:
   ```sh
   # Mission Statement
   ```

## Scripts and Usage

- `npm run start`     Run the CLI (`sandbox/source/main.js`).
- `npm run start mission`    Print the repository mission statement.
- `npm test`           Run unit tests using Vitest.
- `npm run build`      Placeholder build script.
- `npm run formatting`    Check code formatting with Prettier.
- `npm run formatting-fix`  Fix code formatting with Prettier.
- `npm run linting`       Lint code with ESLint.
- `npm run linting-fix`   Fix linting issues.
- `npm run update-to-minor`   Update dependencies to latest minor versions.
- `npm run update-to-greatest` Update dependencies to latest greatest versions (excluding alphas).

## Links

- [Mission Statement](../../MISSION.md)
- [Contributing Guidelines](../../CONTRIBUTING.md)
- [intentïon agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib)
