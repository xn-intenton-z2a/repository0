# Node.js FS Promises API

## https://nodejs.org/api/fs.html#fs_fs_promises_api
The Node.js fs/promises API offers a modern, promise-based interface for file system operations, including `readFile`, `writeFile`, `readdir`, and more. It eliminates callback complexity, supports async/await patterns, and provides guidance on error handling and performance considerations. This is foundational for implementing all file I/O commands in the CLI, such as reading `MISSION.md` and `package.json`.
Last Reviewed: Node.js v20.9.0 (LTS)
License: Node.js License

# Node.js ECMAScript Modules (ESM)

## https://nodejs.org/api/esm.html
Comprehensive documentation on using ECMAScript modules in Node.js, covering `import`/`export` syntax, `import.meta.url`, top-level await, and module resolution. This is critical for ensuring correct module loading in both CLI entrypoint and library code under the `type: "module"` setting.
Last Reviewed: Node.js v20.9.0 (LTS)
License: Node.js License

# minimist

## https://github.com/substack/minimist#readme
The lightweight argument parser `minimist` documentation explains parsing flags, aliases, default values, and boolean options. It includes usage examples that directly inform how the CLI processes `--help`, `--mission`, and other flags.
Last Updated: v1.2.8
License: MIT

# yargs (CLI Argument Parsing)

## https://yargs.js.org/docs/
Detailed guide for the feature-rich `yargs` library as a comparator to `minimist`. Covers declarations of commands, options, middleware, and advanced parsing. Useful for planning future expansions of the CLI's command structure.
Last Updated: 2024-01-15
License: MIT

# EJS Templating

## https://ejs.co/#docs
Official EJS documentation covering template syntax, includes, client-side rendering, and performance tips. Essential for understanding how to use `ejs.render()` in the `--render` command and troubleshooting template injection patterns.
Last Updated: 2023-12-01
License: MIT

# js-yaml

## https://github.com/nodeca/js-yaml#readme
The `js-yaml` README details parsing and dumping YAML in JavaScript, schema customization, and security considerations. It directly informs how the CLI loads YAML data for the `--render` command.
Last Updated: v4.1.0
License: MIT

# GitHub Actions - Reusing Workflows

## https://docs.github.com/en/actions/using-workflows/reusing-workflows
Comprehensive guide on the `workflow_call` event, inputs/outputs definitions, and security contexts. Key to configuring the agentic-workflow automation in this repository.
Last Reviewed: 2024-05-10
License: CC BY 4.0

# GitHub Actions REST API

## https://docs.github.com/en/rest/actions
This resource documents endpoints to list, trigger, and manage workflows programmatically via REST. Valuable for implementing higher-level agents that interact with CI/CD pipelines and inspect workflow statuses.
Last Reviewed: 2024-04-01
License: CC BY 4.0

# intentïon agentic-lib

## https://github.com/xn-intenton-z2a/agentic-lib
The core repository of reusable GitHub Actions workflows driving autonomous code updates and reviews. Contains workflows such as Issue Worker, Automerge, and Review Issue. Understanding its inputs, outputs, and branching logic is critical for extending or troubleshooting the CI/CD automation.
Last Updated: 2024-06-01
License: MIT

# Vitest Testing Framework

## https://vitest.dev/guide/
Official Vitest guide explaining test suite structure, mocking, spies, snapshots, and coverage reporting. Directly applicable to all tests in `sandbox/tests/` and `tests/unit/`.
Last Updated: 2024-02-20
License: MIT

# Zod Schema Validation

## https://github.com/colinhacks/zod
Zod provides compile-time type inference and runtime data validation. The docs cover schema definitions, parsing options, and error handling. Useful for adding structured validation to CLI inputs or configuration files.
Last Updated: v3.24.4
License: MIT

# AJV JSON Schema Validator

## https://ajv.js.org/
AJV (Another JSON Schema Validator) offers high-performance JSON schema validation, supporting JSON Schema draft-07/2019-09/2020-12, custom keywords, and asynchronous validation. Consider it for advanced data validation use cases in future CLI commands.
Last Reviewed: 2024-03-10
License: MIT
