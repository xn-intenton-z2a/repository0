# GitHub REST API
## https://docs.github.com/en/rest
The official GitHub REST API documentation provides a comprehensive reference for automating GitHub operations via HTTP. It covers endpoints for repositories, issues, pull requests, workflows, and more, with detailed schemas, parameters, and example requests/responses. This source is essential for implementing issue creation, branch management, and CI/CD orchestration in agentic workflows. Last updated June 2024; authoritative as the official GitHub docs.
## License
GitHub Terms of Service

# Reusing GitHub Actions Workflows
## https://docs.github.com/en/actions/using-workflows/reusing-workflows
This guide explains how to modularize and call reusable GitHub Actions workflows using the `workflow_call` event. It details input/output mappings, security considerations, and best practices for composing workflows like the ones in `agentic-lib`. Last updated May 2024; authoritative as the official GitHub Actions docs.
## License
GitHub Terms of Service

# GitHub GraphQL API
## https://docs.github.com/en/graphql
The GraphQL API reference offers flexible, efficient querying of GitHub data models. It includes schema definitions, query examples, and pagination patterns. Use this source to implement optimized data retrieval for issues, pull requests, and repository metadata in automated agents. Last updated April 2024.
## License
GitHub Terms of Service

# OpenAI Chat Completions API
## https://platform.openai.com/docs/api-reference/chat
Official OpenAI documentation for the Chat Completions endpoint. It describes request/response structures, model parameters (temperature, max_tokens), rate limits, and streaming options. Crucial for integrating conversational LLM workflows in `agentic-lib`. Last updated June 2024.
## License
OpenAI Terms of Service

# Node.js ESM Modules
## https://nodejs.org/api/esm.html
In-depth guide to ECMAScript module support in Node.js, including `import`/`export` semantics, package `exports` field, and interoperability with CommonJS. Vital for maintaining ESM-compliant code in `src/lib` and sandbox scenarios. Last updated Node.js v20.4.0.
## License
Node.js Foundation

# Vitest Guide
## https://vitest.dev/guide/
Comprehensive guide for the Vitest testing framework. Covers configuration, test APIs, mocking strategies, and coverage reporting. Directly applicable to writing and extending tests in `tests/unit` and `sandbox/tests`. Last updated March 2024; Vitest is MIT-licensed and widely adopted.
## License
MIT

# Prettier CLI Documentation
## https://prettier.io/docs/en/cli.html
Official CLI docs for Prettier, detailing available flags, configuration file formats, and integration points with Git hooks. Supports enforcing consistent code style in automated workflows. Last updated May 2024.
## License
MIT

# ESLint Official Documentation
## https://eslint.org/docs/latest/
The ESLint docs offer rule definitions, configuration options, plugin development guidelines, and autofix details. Essential for maintaining code quality with `eslint.config.js` and automated linting workflows. Last updated June 2024.
## License
MIT

# dotenv GitHub Repository
## https://github.com/motdotla/dotenv
Source code and documentation for `dotenv`, the standard library for loading environment variables. Includes usage examples, security notes, and configuration options. Useful for managing secrets like `CHATGPT_API_SECRET_KEY` across local and CI environments. Last commit March 2024.
## License
BSD-2-Clause

# agentic-lib GitHub Repository
## https://github.com/xn-intenton-z2a/agentic-lib
The primary library of reusable GitHub Actions workflows powering this template. Contains workflow definitions, input schemas, and usage examples. Studying this source is key to extending or customizing agentic behaviors. Last commit May 2024.
## License
Apache-2.0

# EJS Official Documentation
## https://ejs.co/#docs
EJS templating engine docs covering syntax, rendering methods, and performance considerations. Relevant for generating dynamic documentation or code files in automated workflows. Last updated April 2024.
## License
MIT

# js-yaml GitHub Repository
## https://github.com/nodeca/js-yaml
Comprehensive reference for parsing and dumping YAML in JavaScript. Includes type schemas, error handling, and performance tips. Applies to reading `agentic-lib` configs or custom metadata files. Last commit February 2024.
## License
MIT

# npm publish CLI
## https://docs.npmjs.com/cli/v9/commands/npm-publish
Official npm CLI reference for `npm publish`. Describes package metadata, access levels, scoping, and registry configuration. Critical for automating package releases from GitHub Actions. Last updated May 2024.
## License
Creative Commons CC-BY-4.0

# npm-check-updates Package
## https://www.npmjs.com/package/npm-check-updates
The `npm-check-updates` tool documentation detailing how to automate dependency updates, pinning strategies, and workflow integration. Used by the `update-to-minor` and `update-to-greatest` scripts. Last updated April 2024.
## License
BSD-2-Clause

# Node.js FS (File System) Module
## https://nodejs.org/api/fs.html
Official Node.js API for file system operations. Covers `fs.promises`, streams, and watching patterns. Fundamental for reading and writing sandbox files in custom workflows. Last updated Node.js v20.4.0.
## License
Node.js Foundation