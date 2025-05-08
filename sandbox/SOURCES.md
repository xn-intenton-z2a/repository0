# Node.js ECMAScript Modules
## https://nodejs.org/api/esm.html
Detailed reference for using ECMAScript modules in Node.js, including import/export syntax, support for JSON modules via import assertions, and configuration of module resolution. Essential for implementing modern ESM-based CLI tools and ensuring compatibility with native Node.js behaviors. Last updated in Node.js v20. Authoritative reference maintained by the Node.js project.
## License: CC BY-SA 4.0

# Node.js Process API
## https://nodejs.org/api/process.html#processargv
Explains access to command-line arguments through `process.argv` and environment variables via `process.env`. Crucial for parsing CLI flags (e.g., conversion-rate) and implementing robust argument validation patterns. Provides examples of typical usage and best practices for error handling. Last reviewed for Node.js v20.
## License: CC BY-SA 4.0

# Node.js URL Module
## https://nodejs.org/api/url.html#url_fileurltopath_url
Covers the `URL` class and `fileURLToPath` utility to convert module file URLs into file system paths. Key for ESM scripts requiring detection of `import.meta.url`. Demonstrates cross-platform resolution strategies for file and directory paths. Part of Node.js core documentation, updated in v20.
## License: CC BY-SA 4.0

# minimist CLI Argument Parser
## https://github.com/substack/minimist
Lightweight library for parsing CLI arguments into typed values and aliases. Offers configuration options for string vs. boolean flags, default values, and alias mappings. Provides actionable insights on handling unknown options and customizing parsing behavior. Last published v1.2.8 (2022). Perfect for building simple yet reliable CLI tools.
## License: MIT

# Zod Schema Validation
## https://github.com/colinhacks/zod
TypeScript-first schema validation library for runtime type checking of inputs. Includes rich built-in validators for numbers, strings, arrays, and supports custom refinements. Illustrates practical patterns for enforcing ranges (`min`, `max`) and generating detailed error messages. Widely adopted, v3.24.4, MIT license.
## License: MIT

# dotenv Configuration
## https://github.com/motdotla/dotenv
Standard approach for loading environment variables from a `.env` file into `process.env`. Covers security considerations, variable expansion, and multi-environment setups. Crucial for managing configuration in local development and CI environments. Latest v16.5.0. BSD-2-Clause.
## License: BSD-2-Clause

# Vitest Testing Framework
## https://vitest.dev/guide/
Modern unit testing framework built on Vite, offering Jest-like APIs (`describe`, `test`, `expect`) and built-in support for ESM. Provides examples for spying on console methods, snapshot testing, and coverage reporting. Demonstrates configuration for Node environment and detailed mocking strategies. Current as of v3.x series.
## License: MIT

# GitHub REST API Reference
## https://docs.github.com/en/rest
Comprehensive documentation of GitHub REST endpoints for issues, pull requests, workflows, and repository management. Includes URL structures, required permissions, request/response schemas, and code samples in JavaScript. Vital for extending agentic workflows to interact with GitHub programmatically.
## License: Proprietary (GitHub)

# GitHub Actions Reusing Workflows
## https://docs.github.com/en/actions/using-workflows/reusing-workflows
Guidance on creating and invoking reusable workflows using `workflow_call`. Covers input/output definitions, security contexts, and matrix strategies. Directly applicable to `agentic-lib` style workflows and composing CI/CD pipelines. Official docs updated continuously.
## License: Proprietary (GitHub)

# GitHub Actions Workflow Syntax
## https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions
Detailed YAML schema for defining triggers (`schedule`, `workflow_call`), job steps, environment variables, and secrets. Essential for authoring robust automated pipelines and enabling sandbox permissions in workflow files. Official source with examples.
## License: Proprietary (GitHub)

# GitHub Actions Best Practices
## https://docs.github.com/en/actions/learn-github-actions/best-practices-for-writing-github-actions
High-impact recommendations for security, performance, and maintainability of Actions. Includes tips on caching, artifact management, secret handling, and workflow modularization. Helps optimize `agentic-lib` workflows for resilience.
## License: Proprietary (GitHub)

# OpenAI Node.js SDK
## https://github.com/openai/openai-node
Official client library for interacting with OpenAI APIs in Node.js. Provides examples for chat completions, fine-tuning, streaming responses, and error handling. Covers authentication via environment variables and HTTP retries. Latest v4.97.0.
## License: MIT

# ESLint Configuration
## https://eslint.org/docs/latest/user-guide/configuring/
Describes creation of `.eslintrc` files, extending shareable configs (e.g., `google`, `prettier`), and enabling plugins for import, promise, security, and sonarjs. Offers actionable patterns for enforcing code style and detecting vulnerabilities. Updated in ESLint v9.
## License: MIT

# Prettier Code Formatter
## https://prettier.io/docs/en/
Documentation for configuring Prettier, using CLI flags, editor integrations, and customizing formatting options. Highlights integration with ESLint and enabling consistent code style across JavaScript, JSON, and Markdown. Current v3.x series.
## License: MIT

# npm package.json Configuration
## https://docs.npmjs.com/cli/v9/configuring-npm/package-json
Explains fields in `package.json`, including `config`, `scripts`, `dependencies`, and `overrides`. Demonstrates how to leverage `npm run` for build/test workflows and define custom default values accessible via `npm_package_config_*` environment variables.
## License: CC-BY-SA 4.0

# intentïon agentic-lib Workflows
## https://github.com/xn-intenton-z2a/agentic-lib
Repository hosting reusable GitHub Actions workflows for autonomous code management. Details `workflow_call` inputs/outputs for issue creation, automerge, and review pipelines. Offers a reference for developing self-evolving CI/CD patterns. MIT license.
## License: MIT