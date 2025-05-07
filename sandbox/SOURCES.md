# GitHub Actions Workflow Syntax
## https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions
Comprehensive reference of the core workflow file syntax, including events, jobs, steps, and concurrency controls. This documentation provides essential examples of defining `on:` triggers, `jobs:` structures, and advanced features like conditionals and matrices. It addresses core implementation needs by detailing how to structure CI/CD pipelines and leverage GitHub’s hosted runners effectively. Last updated: June 2024; authoritative as canonical GitHub documentation under Creative Commons.
## CC BY 4.0

# GitHub Actions Reusable Workflows (workflow_call)
## https://docs.github.com/en/actions/using-workflows/reusing-workflows
Detailed guide on splitting complex workflows into reusable components using `workflow_call`. Shows how to declare inputs, outputs, and secrets, and how to invoke these workflows from other repositories or branches. Crucial for building the `agentic-lib` style modular workflows showcased in this template. Last updated: May 2024; direct source from GitHub Docs.
## CC BY 4.0

# OpenAI Node.js Library
## https://github.com/openai/openai-node
Official GitHub repository for the `openai` npm package. Contains API reference, code samples, and patterns for streaming, chat completions, and fine-tuning. Essential for implementing autonomous code generation, issue triaging, and other LLM-driven automation in workflows. Version referenced: v4.x; MIT license.
## MIT

# EJS Templating Engine
## https://ejs.co/#docs
Authoritative documentation for EJS, detailing template syntax, custom filters, and integration patterns. Covers raw HTML injection, partials, and performance considerations. Directly applicable for generating dynamic workflow files, GitHub issue content, or custom reports. Last reviewed: April 2024; MIT license.
## MIT

# js-yaml API Reference
## https://github.com/nodeca/js-yaml
API documentation and usage examples for parsing and serializing YAML in JavaScript. Demonstrates safe loading, custom schema definitions, and error handling. Foundational for reading and writing GitHub Action YAML files programmatically. Released: v4.x; MIT license.
## MIT

# Zod Schema Validation
## https://github.com/colinhacks/zod
Comprehensive guide for schema declaration, type inference, and data validation with Zod. Includes examples for parsing environment variables, CLI arguments, and workflow inputs. Supports strong typing and runtime checks, addressing core reliability requirements. Version: 3.x; MIT license.
## MIT

# dotenv Configuration Utility
## https://github.com/motdotla/dotenv
Official repository for loading environment variables from `.env` files. Documents best practices for variable scoping, safe loading, and integration with ECMAScript modules. Vital for local testing of workflows that depend on secrets or API keys. Released under BSD-2-Clause.
## BSD-2-Clause

# Automerge Action by pascalgn
## https://github.com/pascalgn/automerge-action#readme
Provides actionable insights into automatically merging pull requests based on customizable conditions. Covers setting up tokens, defining merge strategies, and handling conflicts. Directly addresses the `Automerge` workflow step in this repository. Version: v0.16.0; MIT license.
## MIT

# Dependabot Configuration
## https://docs.github.com/en/code-security/supply-chain-security/keeping-your-dependencies-updated-automatically
Official GitHub Docs for Dependabot. Explains `dependabot.yml` syntax, update schedules, and package ecosystem support. Critical for automated dependency updates and ensuring reproducible builds without manual intervention. Last updated: April 2024; CC BY 4.0.
## CC BY 4.0

# Vitest Testing Framework
## https://vitest.dev/guide/
In-depth guide for writing and running tests with Vitest, including configuration options, coverage reporting, and mocking strategies. Demonstrates parallel test execution and snapshot testing. Key to maintaining the `tests/unit` and sandbox test suite with performance and reliability. Last updated: May 2024; MIT license.
## MIT

# Probot Framework
## https://probot.github.io/docs/
Official documentation for building GitHub Apps with Probot. Covers authentication, event handling, and HTTP routing. Useful for extending this repository’s automation beyond Actions to custom bot integrations. Released under MIT.
## MIT

# Node.js ECMAScript Modules Guide
## https://nodejs.org/api/esm.html
Official Node.js guide on ESM support, including `import` maps, dynamic imports, and loader hooks. Clarifies module resolution and compatibility flags needed since the project uses Node 20 and ESM. Updated: Node.js v20 LTS docs; MIT license.
## MIT

# GitHub REST API Overview
## https://docs.github.com/en/rest
Comprehensive entry point for all REST endpoints, including pagination, authentication, and rate limits. Essential for workflows that interact with issues, pull requests, and repository settings programmatically. Updated: June 2024; CC BY 4.0.
## CC BY 4.0

# GitHub Issues REST API
## https://docs.github.com/en/rest/issues
Specific documentation on creating, updating, and triaging issues via the REST API. Includes request/response schemas, field descriptions, and error codes. Directly informs the `Create Issue` and `Issue Worker` workflows. Updated: June 2024; CC BY 4.0.
## CC BY 4.0

# GitHub Actions Expressions
## https://docs.github.com/en/actions/learn-github-actions/expressions
Details syntax for expressions, contexts, and functions within workflow files. Explains how to reference environment variables, secrets, and job outputs. Critical for writing conditional logic in each workflow step. Last revised: May 2024; CC BY 4.0.
## CC BY 4.0