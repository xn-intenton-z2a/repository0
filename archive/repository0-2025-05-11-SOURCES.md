# GitHub Actions Workflow Syntax
## https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions
GitHub’s official workflow syntax documentation provides comprehensive details on defining triggers, jobs, steps, and reusable workflows. It covers conditional expressions, matrix builds, secrets, environment variables, and custom workflow calls—enabling advanced CI/CD pipeline configurations that form the backbone of this repository’s agentic automation. Last updated June 2024, maintained by GitHub under CC BY 4.0, it is the authoritative reference for composing and extending GitHub Actions-based automation in this template.
## CC BY 4.0

# GitHub REST API Reference
## https://docs.github.com/en/rest
This source offers detailed technical specifications for interacting with GitHub resources—issues, pull requests, workflows, and more—via REST endpoints. It includes example requests, parameter schemas, pagination patterns, rate-limit guidance, and authentication strategies. Critical for agentic-lib integrations that open, update, and close issues or modify repository state. Updated monthly, endorsed by GitHub, public and reliable.
## Various (GitHub Docs)

# GitHub GraphQL API Reference
## https://docs.github.com/en/graphql
The GraphQL API reference provides a unified schema for querying and mutating GitHub data with precision, reducing over-fetching compared to REST. It covers query structure, authentication, rate limits, schema introspection, and code samples in JavaScript and cURL. Essential for implementing complex data-driven workflows and retrieving nested resource relationships efficiently. Last updated June 2024, maintained by GitHub.
## Various (GitHub Docs)

# GitHub Actions Toolkit
## https://github.com/actions/toolkit
The GitHub Actions Toolkit repository documents the core libraries (@actions/core, @actions/github, command-parser) used by JavaScript Actions. It details context objects, input/output parsing, workflow commands, tool caching, and debugging strategies. Key for building custom Actions that complement or extend agentic-lib workflows. Last commit May 2024, MIT licensed.
## MIT

# OpenAI Node.js SDK Reference
## https://github.com/openai/openai-node
The official repository for the OpenAI Node.js client library includes installation instructions, usage examples for completions, chat, embeddings, and streaming. It details configuration options, error handling, rate-limits, retry logic, and built-in TypeScript types—vital for implementing the LLM-driven workflows in this template. Last updated May 2024, MIT licensed.
## MIT

# Node.js ECMAScript Modules Guide
## https://nodejs.org/api/esm.html
Node.js’s official ESM guide explains module resolution, import assertions, conditional exports, and interoperability with CommonJS. Essential for preserving ESM compliance in `src/lib/main.js` and sandboxed sources, it clarifies loader flags, package.json `type` fields, and interop patterns. Last revision March 2024, Node.js Foundation.
## MIT

# Vitest Testing Framework
## https://vitest.dev/guide/
Vitest’s primary guide covers test suite setup, matchers, snapshot testing, mocking, coverage collection, and configuration. It demonstrates fixture patterns, watch mode, parallel execution, and integration with TypeScript and ESM projects—vital for writing and maintaining unit tests across both `tests/unit` and `sandbox/tests`. Last published April 2024, MIT licensed.
## MIT

# Zod Schema Validation
## https://zod.dev/
Zod provides TypeScript-first schema definitions for validating and parsing structured data, used here for config and CLI argument validation. The docs include examples for coercion, transformations, custom error messaging, and performance considerations. Updated February 2024, MIT license.
## MIT

# EJS Templating Engine
## https://ejs.co/
EJS’s documentation describes syntax for embedding JavaScript into HTML-like templates, including partials, filters, and strict mode. It explains safe variable interpolation, caching strategies, and custom delimiters—used in generating issue comments, PR templates, and other dynamic artifacts within agentic workflows. Latest update January 2024, New BSD license.
## BSD-3-Clause

# js-yaml Parser 🟄 Serializer
## https://github.com/nodeca/js-yaml
This source covers YAML parsing and serialization in JavaScript, schema customization, type definitions, and security recommendations. Critical for reading and writing `agentic-lib` workflow parameter files, configuration dumps, and K8s-style manifests. Documentation includes performance tips, safe loading practices, and advanced usage patterns. Last commit May 2024, MIT license.
## MIT

# ESLint Configuration Reference
## https://eslint.org/docs/latest/user-guide/configuring
ESLint’s user guide covers project-level and shareable configurations, plugin management, rule customization, overrides, and formatter options. It is essential for maintaining code quality standards and enforcing style rules in automated linting workflows. Last updated May 2024, MIT licensed.
## MIT

# Prettier Code Formatter Docs
## https://prettier.io/docs/en/index.html
Prettier’s official documentation explains core formatting rules, plugin architecture, editor integrations, and CI enforcement. It provides configuration options, scope coverage, and examples for consistent code styling via `prettier --check` and `--write`. Updated April 2024, MIT license.
## MIT

# intentïon agentic-lib SDK
## https://github.com/xn-intenton-z2a/agentic-lib
The core reusable workflows library used by this template. Contains `workflow_call` examples, configuration modules, and utility scripts enabling autonomous code review, issue management, and continuous CI/CD loops. The README and examples showcase how to compose these workflows downstream. Last commit June 2024, Apache-2.0.
## Apache-2.0

# Probot Framework
## https://probot.github.io/
Probot provides a Node.js framework for building GitHub Apps. The docs cover event handling, authentication strategies, rate limiting, custom middleware, and testing strategies using nock. Useful for exploring alternative automation patterns and extending agentic-lib approaches. Updated March 2024, MIT licensed.
## MIT

# Semantic-release Automated Publishing
## https://semantic-release.gitbook.io/semantic-release/
This guide details convention-based release automation: semantic version determination, changelog generation, package registry integrations, and plugin ecosystem. It offers insights into automated package management and release workflows that complement the CI/CD focus here. Last revision April 2024, MIT license.
## MIT

# Octokit REST.js Client
## https://octokit.github.io/rest.js/v19
The official JavaScript client for GitHub’s REST API includes typed methods for issues, pull requests, workflows, and more. The documentation explains pagination, authentication flows, plugin support, and request hooks—providing a robust alternative to raw HTTP calls within action workflows. Last update May 2024, MIT license.
## MIT