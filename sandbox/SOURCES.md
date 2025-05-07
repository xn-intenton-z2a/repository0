# GitHub Actions Workflow Syntax
## https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions
Comprehensive reference of the core workflow file syntax, including events, jobs, steps, conditionals, matrices, concurrency controls, and expressions. Provides essential examples for defining `on:` triggers, `jobs:` structures, and advanced features like permissions and environment contexts. Critical for structuring robust CI/CD pipelines and leveraging GitHub’s hosted runners effectively. Last updated: June 2024; authoritative as canonical GitHub documentation.
## CC BY 4.0

# GitHub Actions Reusable Workflows (workflow_call)
## https://docs.github.com/en/actions/using-workflows/reusing-workflows
Detailed guide on decomposing complex workflows into reusable components using `workflow_call`. Explains how to declare inputs, outputs, and secrets for modular pipelines and demonstrates invocation patterns across repositories or branches. Essential for building agent-style SDK workflows in this template. Last updated: May 2024; direct source from GitHub Docs.
## CC BY 4.0

# GitHub Actions Caching
## https://docs.github.com/en/actions/advanced-guides/caching-dependencies-and-builds
Guide on caching dependencies and build outputs across workflow runs to speed up CI/CD pipelines. Covers cache key strategies, scope, pruning, and performance considerations for popular languages and package managers. Directly addresses optimization of build and test steps for faster feedback loops. Last updated: June 2024; canonical GitHub documentation.
## CC BY 4.0

# GitHub Actions Toolkit (actions/toolkit)
## https://github.com/actions/toolkit/blob/main/docs/action-toolkit.md
Authoritative documentation on the GitHub Actions Toolkit libraries for building custom JavaScript/TypeScript actions. Details core modules like `core`, `github`, `exec`, `io`, and `cache`, with usage examples for logging, environment management, and API calls. Key for extending workflows with bespoke actions. Latest commit: November 2023; MIT license.
## MIT

# GitHub Actions Contexts and Expressions
## https://docs.github.com/en/actions/learn-github-actions/contexts
Reference for the contexts and expression syntax available in GitHub Actions workflows, including `github`, `runner`, `env`, `secrets`, and job/matrix contexts. Explains how to interpolate values, use conditional logic, and manage dynamic behavior in steps and jobs. Essential for writing flexible and maintainable pipelines. Last updated: June 2024; CC BY 4.0.
## CC BY 4.0

# OpenAI Node.js Library
## https://github.com/openai/openai-node
Official repository for the `openai` npm package, featuring a full API reference, usage examples for chat and completion streaming, fine-tuning workflows, and rate limit handling. Crucial for implementing autonomous code generation, triage, and automated issue resolution within workflows. Version referenced: v4.x; MIT license.
## MIT

# OpenAI REST API Reference
## https://platform.openai.com/docs/api-reference/introduction
Primary reference for OpenAI’s RESTful endpoints, covering authentication, prompt and completion parameters, streaming, function calling, fine-tuning, and error handling. Includes detailed schema definitions and example requests/responses to solve real implementation problems. Last reviewed: June 2024; public documentation (license not specified).
## Not specified

# EJS Templating Engine
## https://ejs.co/#docs
Comprehensive documentation for EJS templating syntax, including interpolation, includes, custom filters, and security considerations to prevent injection. Demonstrates performance tuning and integration patterns for rendering dynamic content in workflow definitions, issue bodies, or reports. Last reviewed: April 2024; MIT license.
## MIT

# js-yaml API Reference
## https://github.com/nodeca/js-yaml
Detailed API docs and examples for parsing and serializing YAML with JavaScript. Covers safe loading, custom schemas, dumping options, and error handling. Foundational for programmatically reading and writing GitHub Actions YAML files. Released: v4.x; MIT license.
## MIT

# Zod Schema Validation
## https://github.com/colinhacks/zod
Extensive guide for runtime schema validation and TypeScript type inference using Zod. Includes patterns for validating environment variables, CLI arguments, and user-supplied inputs in workflows and actions. Ensures strong typing and robust error reporting. Version: 3.x; MIT license.
## MIT

# dotenv Configuration Utility
## https://github.com/motdotla/dotenv
Official documentation for loading environment variables from `.env` files in Node.js environments. Details best practices for variable scoping, safe file loading, and integration with ESM contexts. Vital for local testing of workflows dependent on secrets or API keys. Released under BSD-2-Clause.
## BSD-2-Clause

# Automerge Action by pascalgn
## https://github.com/pascalgn/automerge-action#readme
Provides practical guidance on automatically merging pull requests based on customizable criteria. Documents configuration of tokens, merge strategies (squash, rebase), branch protections, and conflict resolution. Directly applicable to the Automerge step in this repository. Version: v0.16.0; MIT license.
## MIT

# Vitest Testing Framework
## https://vitest.dev/guide/
In-depth guide on writing and running tests with Vitest, covering test structure, configuration, coverage reporting, and mocking. Demonstrates parallel execution, snapshot testing, and integration with ESM projects. Essential for maintaining unit and sandbox test suites with reliability and speed. Last updated: May 2024; MIT license.
## MIT

# Node.js ECMAScript Modules Guide
## https://nodejs.org/api/esm.html
Comprehensive reference for using ECMAScript Modules in Node.js v20+, including dynamic imports, loader hooks, and `import` maps. Clarifies module resolution, interop flags, and performance considerations for modern JavaScript. Updated: Node.js 20 LTS documentation; MIT license.
## MIT

# GitHub REST API Overview
## https://docs.github.com/en/rest
Master index of GitHub’s REST API endpoints, including authentication methods, pagination, error handling, and rate limit strategies. Serves as the primary reference for programmatic interactions with issues, pulls, and repository settings. Updated: June 2024; CC BY 4.0.
## CC BY 4.0

# Octokit Rest.js Library
## https://github.com/octokit/rest.js
Official JavaScript client for GitHub’s REST API, offering typed endpoint methods, pagination helpers, and plugin support. Includes usage examples for authentication, request retry strategies, and response handling. Key for robust, maintainable API calls in workflows and custom actions. Latest release: v19.x; MIT license.
## MIT