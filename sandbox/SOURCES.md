# GitHub Actions Reusing Workflows
## https://docs.github.com/en/actions/using-workflows/reusing-workflows
This official GitHub documentation describes how to create and consume reusable workflows via the `workflow_call` event. It details how to define inputs, outputs, secrets, and permissions, and illustrates best practices for modularizing CI/CD logic into composable units. This source addresses core implementation needs for `repository0`’s agentic-lib integration by explaining how to structure workflow calls, pass data between workflows, and secure secrets.
Last updated: 2024-02-15. Authoritative as the official GitHub Actions docs under Creative Commons Attribution 4.0.
## License
Creative Commons Attribution 4.0 International (CC BY 4.0)

# GitHub Actions Event Triggers
## https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows
This reference outlines every trigger available for GitHub Actions, including `schedule`, `workflow_call`, and manual dispatch. It provides syntax examples for cron schedules, input schemas for manual and reusable workflows, and guidance on fallback strategies for failed runs. Essential for defining the agentic-lib schedules and manual runs used in `repository0`’s pipelines.
Last updated: 2024-01-10. Official GitHub documentation.
## License
Creative Commons Attribution 4.0 International (CC BY 4.0)

# GitHub Actions Best Practices
## https://docs.github.com/en/actions/learn-github-actions
This high-level guide presents performance and security best practices for writing workflows: caching strategies, container usage, secret management, and matrix builds. It helps maintain robust, efficient pipelines and is directly applicable to optimizing `repository0`’s automated workflows to reduce run times and ensure secure API key handling.
Last updated: 2023-11-20.
## License
Creative Commons Attribution 4.0 International (CC BY 4.0)

# Node.js ESM Modules
## https://nodejs.org/api/esm.html
The official Node.js documentation on ECMAScript Module support covers file extensions, interop with CommonJS, dynamic imports, and loader hooks. Crucial for `repository0`, which uses ESM (`import`/`export`) throughout its source and tests. Provides technical specifications to avoid runtime errors when launching the `main.js` script.
Last updated: Node.js v20 documentation (2024).
## License
OpenJS Foundation (MIT-compatible)

# OpenAI Node.js Client Library
## https://platform.openai.com/docs/client-libraries/nodejs
This guide explains how to install and use the OpenAI Node.js SDK, including authentication via environment variables, streaming completions, and advanced configuration options. It addresses core implementation needs for agentic-lib’s LLM integration by illustrating example calls, error handling patterns, and rate‐limit management.
Last reviewed: 2024-04-05.
## License
MIT

# Zod: Type Validation for TypeScript and JavaScript
## https://github.com/colinhacks/zod
Zod is a schema validation library used for parsing and validating runtime data in TypeScript and JavaScript. This repository and its published documentation explain how to define schemas, compose validators, and infer static types. Useful for validating workflow inputs, API responses, and configuration objects in `repository0`.
Last commit: 2024-03-20.
## License
MIT

# Vitest Testing Framework
## https://vitest.dev/guide/
Vitest is a fast unit testing framework built on V8, designed to be compatible with Jest. The guide covers test setup, mocking, snapshots, coverage collection, and watch mode. Directly informs the structure of the `tests/unit` and `sandbox/tests` suites in `repository0` and provides configuration tips to integrate with `package.json` scripts.
Last updated: 2024-01.
## License
MIT

# npm-check-updates (ncu)
## https://www.npmjs.com/package/npm-check-updates
This package automates dependency version upgrades by scanning `package.json` for outdated modules and updating to the latest semver-compliant versions. It is used in `repository0` scripts `update-to-minor` and `update-to-greatest`. The page details flags for target ranges, package managers, and exclusion patterns.
Last published: 2024-05-12.
## License
MIT

# Agentic-lib: Reusable Agentic GitHub Workflows
## https://github.com/xn-intenton-z2a/agentic-lib
The `agentic-lib` repository provides a suite of reusable GitHub Action workflows that autonomously iterate on issues, apply code changes, and merge pull requests. Its README includes usage examples, input schemas, and branching models. Understanding this source is essential to customizing and extending the workflows in `repository0`.
Last commit: 2024-06-01.
## License
MIT

# Prettier Code Formatter
## https://prettier.io/docs/en/index.html
Prettier is an opinionated code formatter that supports JavaScript, JSON, Markdown, and more. The documentation details configuration options, editor integration, and CLI usage. Relevant for maintaining consistent style in the automated formatting workflows defined in `repository0`.
Last updated: 2024-02.
## License
MIT