# repository0

A template showcasing CLI argument echo behavior and agentic-lib workflows.

## Overview

`repository0` is a demo repository that showcases:
- A CLI that echoes provided arguments.
- GitHub workflows from intentïon [`agentic-lib`](https://github.com/xn-intenton-z2a/agentic-lib) for autonomous CI/CD.

## Source Code

- `src/lib/main.js`: Defines the `main(args)` function that logs provided arguments.
- `sandbox/source/main.js`: CLI entry point that invokes `main(args)` with command-line arguments.

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

## Scripts and Usage

- `npm run start` &nbsp;&nbsp;&nbsp; Run the CLI (`sandbox/source/main.js`).
- `npm test` &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Run unit tests using Vitest.
- `npm run build` &nbsp;&nbsp;&nbsp; Placeholder build script.
- `npm run formatting` &nbsp;&nbsp;&nbsp;&nbsp; Check code formatting with Prettier.
- `npm run formatting-fix` &nbsp;&nbsp;&nbsp; Fix code formatting.
- `npm run linting` &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Lint code with ESLint.
- `npm run linting-fix` &nbsp;&nbsp;&nbsp; Fix linting issues.
- `npm run update-to-minor` &nbsp;&nbsp;&nbsp; Update dependencies to latest minor versions.
- `npm run update-to-greatest` &nbsp; Update dependencies to latest greatest versions (excluding alphas).

## Links

- [Mission Statement](../../MISSION.md)
- [Contributing Guidelines](../../CONTRIBUTING.md)
- [intentïon agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib)
