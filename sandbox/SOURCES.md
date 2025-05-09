# GitHub Actions Reusing Workflows
## https://docs.github.com/en/actions/using-workflows/reusing-workflows
This official GitHub documentation describes how to create and consume reusable workflows via the `workflow_call` event. It details how to define inputs, outputs, secrets, and permissions, and illustrates best practices for modularizing CI/CD logic into composable units. Core for configuring `repository0`’s agentic-lib workflows to call each other securely and pass data between jobs.
Last updated: 2024-02-15. Authoritative as the official GitHub Actions docs.
## License
Creative Commons Attribution 4.0 International (CC BY 4.0)

# GitHub Actions Event Triggers
## https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows
A comprehensive reference of all triggers available for GitHub Actions, including `schedule`, `workflow_call`, and manual dispatch. Provides syntax for cron schedules, input schemas, and fallback strategies on failure—critical for scheduling and manual overrides in `repository0` pipelines.
Last updated: 2024-01-10. Official GitHub documentation.
## License
Creative Commons Attribution 4.0 International (CC BY 4.0)

# GitHub Actions Best Practices
## https://docs.github.com/en/actions/learn-github-actions
Guidance on performance and security best practices: caching, container usage, secret management, and matrix builds. Directly applicable to optimizing and securing `repository0`’s automated workflows and ensuring minimal run times and safe handling of API keys.
Last updated: 2023-11-20. Official GitHub documentation.
## License
Creative Commons Attribution 4.0 International (CC BY 4.0)

# GitHub REST API – Issues and Pull Requests
## https://docs.github.com/en/rest/issues
Detailed reference for the GitHub REST API endpoints handling issues and pull requests, including creation, comments, labeling, and merging. Essential for agentic-lib’s Issue Worker and Automerge flows in `repository0`, enabling programmatic issue and PR lifecycle management.
Last updated: 2024-03-01. Official GitHub documentation.
## License
Creative Commons Attribution 4.0 International (CC BY 4.0)

# GitHub REST API – Actions
## https://docs.github.com/en/rest/actions
Comprehensive REST API for GitHub Actions, covering workflow runs, artifacts, and logs. Provides actionable insights into querying, rerunning, and managing workflow executions—useful for custom monitoring or remediation steps in `repository0` workflows.
Last updated: 2024-04-05. Official GitHub documentation.
## License
Creative Commons Attribution 4.0 International (CC BY 4.0)

# Node.js ESM Modules
## https://nodejs.org/api/esm.html
The official Node.js documentation on ECMAScript Modules covers import/export syntax, file extensions, interoperability with CommonJS, dynamic imports, and loader hooks. Crucial for avoiding runtime errors and ensuring the `src/lib/main.js` script and tests execute under ESM semantics.
Last updated: Node.js v20 documentation (2024).
## License
OpenJS Foundation (MIT-compatible)

# OpenAI Chat Completions API Reference
## https://platform.openai.com/docs/api-reference/chat
The definitive guide to the Chat Completions endpoint, detailing request and response schemas, streaming capabilities, and error codes. Provides essential specifications to implement robust LLM-driven workflows in `repository0`, including rate-limit handling and token management.
Last updated: 2024-05-15. Published by OpenAI.
## License
Subject to OpenAI API Terms of Use

# OpenAI Node.js Client Library
## https://platform.openai.com/docs/client-libraries/nodejs
This guide explains how to install and use the OpenAI Node.js SDK, including authentication via environment variables, streaming completions, and advanced configuration options. Addresses agentic-lib’s LLM integration by showing example calls, error handling patterns, and usage of API features within Node.js.
Last reviewed: 2024-04-05.
## License
MIT

# Zod: Type Validation for TypeScript and JavaScript
## https://github.com/colinhacks/zod
Schema validation library documentation covering schema definitions, composition, type inference, and error handling. Vital for validating workflow inputs, LLM responses, and configuration objects in `repository0`, ensuring runtime safety.
Last commit: 2024-03-20.
## License
MIT

# EJS Templating Engine
## https://ejs.co/#docs
Official documentation for EJS, a simple templating language for JavaScript. Explains syntax, includes, partials, and custom delimiters. Useful when generating or modifying template-based files in agentic-lib-powered workflows.
Last reviewed: 2024-01-10.
## License
MIT

# Vitest Testing Framework
## https://vitest.dev/guide/
Comprehensive guide covering test setup, mocking, snapshots, coverage collection, and watch mode. Directly informs test suite configuration and advanced features used in `tests/unit/` and `sandbox/tests`, enabling faster feedback and reliable coverage metrics.
Last updated: 2024-01.
## License
MIT

# npm-check-updates (ncu)
## https://www.npmjs.com/package/npm-check-updates
Documentation for automating dependency version upgrades, including flags for semver targets, package managers, and exclusion patterns. Core to `repository0`’s `update-to-minor` and `update-to-greatest` scripts for keeping dependencies current.
Last published: 2024-05-12.
## License
MIT

# Agentic-lib: Reusable Agentic GitHub Workflows
## https://github.com/xn-intenton-z2a/agentic-lib
README and schema for a suite of reusable GitHub Actions workflows that autonomously iterate on issues, apply code changes, and merge pull requests. Key reference for customizing and extending agentic behaviors in `repository0`, including input schemas and branching strategies.
Last commit: 2024-06-01.
## License
MIT

# Prettier Code Formatter
## https://prettier.io/docs/en/index.html
Opinionated code formatter supporting JavaScript, JSON, Markdown, and more. Documents CLI usage, editor integrations, and configuration options. Ensures consistent style across code generated or modified by `repository0`’s workflows.
Last updated: 2024-02.
## License
MIT