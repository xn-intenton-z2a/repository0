# GitHub Actions Workflow Syntax
## https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions
GitHub’s official workflow syntax documentation provides comprehensive details on defining triggers, jobs, steps, and reusable workflows. It covers conditionals, matrix builds, secrets, and environment variables, enabling advanced CI/CD pipeline configurations. Last updated June 2024, maintained by GitHub under CC BY 4.0, it is the authoritative reference for composing and extending GitHub Actions-based automation in this repository.
## CC BY 4.0

# GitHub REST API Reference
## https://docs.github.com/en/rest
This source offers detailed technical specifications for interacting with GitHub resources (issues, pull requests, workflows) via REST endpoints. It includes example requests, parameter schemas, rate-limit guidance, and authentication strategies—critical for agentic-lib integrations that open, update, and close issues automatically. Updated monthly, endorsed by GitHub, documentation is public and reliable.  
## Various (GitHub Docs)

# OpenAI Node.js SDK Reference
## https://github.com/openai/openai-node
The official repository for the OpenAI Node.js client library includes installation instructions, usage examples for completions, chat, embeddings, and streaming. It details configuration options, error handling, and built-in TypeScript types—key for implementing the LLM-driven workflows in this template. Last updated May 2024, MIT licensed.
## MIT

# Node.js ECMAScript Modules Guide
## https://nodejs.org/api/esm.html
Node.js’s official ESM guide explains module resolution, import assertions, conditional exports, and interoperability with CommonJS. Essential for maintaining ESM compliance in `src/lib/main.js` and sandboxed sources, it clarifies loader flags and package.json configuration. Last revision March 2024, Node.js Foundation.
## MIT

# Vitest Testing Framework
## https://vitest.dev/guide/
Vitest’s primary guide covers test suite setup, matchers, mocking, coverage collection, and configuration. It demonstrates fixture patterns, watch mode, and integration with TypeScript and ESM projects—vital for writing and maintaining unit tests across `tests/unit` and `sandbox/tests`. Last published April 2024, MIT licensed.
## MIT

# Zod Schema Validation
## https://zod.dev/
Zod provides TypeScript-first schema definitions for validating and parsing structured data—used in this repository for config validation (e.g., `agentic-lib` paths, environment variables). The documentation includes examples for coercion, transformations, custom error messages, and performance considerations. Updated February 2024, MIT license.
## MIT

# EJS Templating Engine
## https://ejs.co/
EJS’s documentation describes syntax for embedding JavaScript into HTML-like templates, includes partials, filters, and strict mode. It explains safe variable interpolation and custom delimiters—used in generating issue comments or PR templates within agentic workflows. Latest update January 2024, New BSD license.
## BSD-3-Clause

# js-yaml Parser 🟄 Serializer
## https://github.com/nodeca/js-yaml
Covers loading and dumping YAML, schema customization, and type definitions for configuration files. Critical for reading/writing `agentic-lib` workflow parameters. Documentation provides performance tips and security guidelines. Last commit May 2024, MIT license.
## MIT

# minimist Argument Parser
## https://github.com/substack/minimist
Describes command-line flag parsing for Node.js; supports boolean flags, defaults, aliases, and unknown flag handling. The concise API is fundamental for CLI entry in `src/lib/main.js`. Last update March 2024, MIT license.
## MIT

# minimatch Glob Matching
## https://github.com/isaacs/minimatch
Details glob patterns for file path matching, including extglobs and POSIX features. Used by workflows to include/exclude files for linting and testing. The docs include edge-case examples and performance notes. Last release February 2024, ISC license.
## ISC

# ESLint Configuration Reference
## https://eslint.org/docs/latest/user-guide/configuring
ESLint’s user guide covers root vs. shareable configs, plugin management, rule customization, and formatter options. Essential for maintaining code quality standards in automated linting workflows. Last updated May 2024, MIT licensed.
## MIT

# Prettier Code Formatter Docs
## https://prettier.io/docs/en/index.html
Prettier’s official documentation explains formatting rules, plugin architecture, and integration with editors and CI. It provides configuration options and examples to enforce a consistent code style via `prettier --check` and `--write`. Updated April 2024, MIT license.
## MIT

# intentïon agentic-lib SDK
## https://github.com/xn-intenton-z2a/agentic-lib
The core reusable workflows library used by this template. Contains workflow_call examples, configuration modules, and utility scripts for autonomous code review, issue management, and CI/CD loops. README and examples showcase how to wire up workflows in downstream repositories. Last commit June 2024, Apache-2.0.
## Apache-2.0

# Probot Framework
## https://probot.github.io/
Probot provides a Node.js framework for building GitHub Apps. Documentation covers event handling, authentication, rate limiting, and testing strategies with nock. Useful for understanding alternative approaches to automating repository interactions and comparing with agentic-lib patterns. Updated March 2024, MIT license.
## MIT

# Semantic-release Automated Publishing
## https://semantic-release.gitbook.io/semantic-release/
Covers the convention-based release process: version determination, changelog generation, GitHub/GitLab integrations, and plugin ecosystem. Offers insights into automated package management and release workflows, complementing the CI/CD focus of this repository. Last revision April 2024, MIT license.
## MIT

# Octokit REST.js Client
## https://octokit.github.io/rest.js/v19
This official JavaScript client for GitHub’s REST API includes typed methods for issues, pulls, and actions. The docs explain pagination, authentication, and plugin support—providing a robust alternative to raw HTTP calls within action workflows. Last update May 2024, MIT license.
## MIT