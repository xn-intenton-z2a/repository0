# GitHub Actions Reusable Workflows
## https://docs.github.com/en/actions/using-workflows/reusing-workflows
GitHub’s official guidance on composing and invoking reusable workflows via `workflow_call`. This documentation explains how to structure inputs, outputs, secrets, and permissions to build modular CI/CD pipelines. It addresses core implementation needs by detailing invocation patterns, version pinning strategies, and best practices for sharing workflows across repositories.
## License: Unknown (GitHub Documentation Terms)

# GitHub Actions Workflow Syntax Reference
## https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions
Comprehensive reference for defining triggers, jobs, steps, and conditions in workflow YAML files. Essential for understanding event types (push, schedule, workflow_call), context and expression syntax, and matrix strategies. Provides actionable examples for caching, environment variables, and artifact handling.
## License: Unknown (GitHub Documentation Terms)

# GitHub Actions Toolkit (JavaScript)
## https://github.com/actions/toolkit
The official Node.js libraries (`@actions/core`, `@actions/github`, etc.) for writing custom GitHub Actions. Covers APIs for logging, input parsing, environment variable management, and REST/GraphQL calls. Includes detailed usage patterns and error-handling recommendations critical for building robust, reusable composite and JavaScript actions.
## License: MIT

# GitHub REST API Reference
## https://docs.github.com/en/rest
Authoritative reference for interacting with Issues, Pull Requests, Checks, and Workflow Runs via REST endpoints. Includes JSON schemas, rate limit guidelines, authentication methods, and pagination strategies. Enables agentic workflows to programmatically create issues, update PRs, and query repository state.
## License: Unknown (GitHub Documentation Terms)

# agentic-lib: Reusable Agentic Workflows SDK
## https://github.com/xn-intenton-z2a/agentic-lib
The source code and pattern library demonstrating autonomous CI/CD workflows using LLMs and GitHub Actions. Offers composite workflows for issue creation, code transforms, automerge, and review loops. Key for understanding the design and invocation of each workflow in this template.
## License: Apache-2.0

# OpenAI Node.js API Reference
## https://platform.openai.com/docs/api-reference/introduction
Official documentation for the OpenAI SDK covering chat completions, streaming responses, and model configuration parameters. Includes code samples for Node.js that handle rate limits, retry logic, and error handling—crucial for building reliable agentic workers.
## License: Proprietary API Terms

# Zod Schema Validation
## https://github.com/colinhacks/zod
A TypeScript-first schema declaration and validation library. Documentation covers parsing strategies, error reporting, and data coercion. Useful for validating workflow inputs, configuration files, and webhooks payloads with clear TypeScript definitions.
## License: MIT

# EJS Templating Engine
## https://ejs.co/#docs
Lightweight templating for generating markdown, YAML, or HTML artifacts. The docs explain tag syntax (`<%= %>`, `<% %>`), includes, and custom filters. Supports dynamic generation of workflow YAML or documentation based on templates.
## License: MIT

# js-yaml: YAML Parser & Dumper
## https://github.com/nodeca/js-yaml
Comprehensive guide to parsing and stringifying YAML documents in Node.js. Covers safe loading, custom schema extensions, and security considerations to prevent code injection. Essential for reading and updating action definitions or metadata files.
## License: MIT

# Minimatch: Glob Pattern Matching
## https://github.com/isaacs/minimatch
Documentation on matching file paths using glob patterns, with support for extended patterns (negation, braces, extglobs). Core to file include/exclude logic in workflows and repository scanners.
## License: ISC

# Node.js ES Modules Guide
## https://nodejs.org/api/esm.html
Explains `import`/`export`, `import.meta.url`, and interoperating with CommonJS. Includes resolution algorithm details and configuration (.mjs, `type:module`). Critical for designing cross-platform, ESM-native scripts in agentic workflows.
## License: MIT

# Vitest: Vite-Native Unit Testing
## https://vitest.dev/
Lightweight testing framework integrated with Vite. Documentation covers setup, mocking, snapshot testing, and coverage reporting. The practical examples show how to write fast unit tests and configure watch/mode options.
## License: MIT

# ESLint Google Style Config
## https://github.com/google/eslint-config-google
Provides the Google JavaScript Style Guide rules packaged for ESLint. Documentation highlights rule customizations, plugin integration, and override patterns. Ensures consistent code quality across human and automated commits.
## License: MIT

# Prettier Code Formatter
## https://prettier.io/docs/en/index.html
Defines conventions for automatic code formatting. Includes configuration options for printing width, tab width, and plugin usage. Critical for maintaining standardized formatting in auto-generated code.
## License: MIT

# npm-check-updates (ncu)
## https://github.com/raineorshine/npm-check-updates
CLI tool documentation for detecting and upgrading outdated dependencies. Covers command flags for target version ranges, peer dependency handling, and JSON output. Integral for automated dependency management workflows.
## License: MIT