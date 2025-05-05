# GitHub Actions: Reusing Workflows
## https://docs.github.com/en/actions/learn-github-actions/reusing-workflows
This official GitHub documentation explains how to structure and invoke reusable workflows via the `workflow_call` event. It provides essential details on defining inputs/outputs, permissions, and secrets inheritance, which directly addresses how `repository0` composes `agentic-lib` workflows as an SDK-like system. Last updated: June 2024. Authoritative as it is maintained by GitHub itself.
## Creative Commons Attribution 4.0 International (CC BY 4.0)

# GitHub REST API Reference
## https://docs.github.com/en/rest
Comprehensive reference of GitHub’s REST endpoints. Covers authentication, issues, pull requests, and more. Crucial for automating issue creation and branch operations in the `Issue Worker` and `Automerge` workflows of the repository. Last updated: May 2024. Maintained by GitHub.
## Creative Commons Attribution 4.0 International (CC BY 4.0)

# GitHub GraphQL API: Managing Workflows
## https://docs.github.com/en/graphql/guides/managing-workflows
Details on querying and mutating workflow runs, artifacts, and logs via GraphQL. Offers deeper control over CI/CD pipelines and can complement REST calls in advanced `agentic-lib` workflows. Last updated: April 2024.
## Creative Commons Attribution 4.0 International (CC BY 4.0)

# OpenAI Node.js Library Documentation
## https://platform.openai.com/docs/libraries/node-js
Official guide to the OpenAI Node.js SDK (`openai` npm package). Demonstrates configuration patterns, streaming completions, and rate limit handling. Directly informs how the repository’s workflows invoke language model calls. Last updated: March 2024.
## MIT License

# Zod: TypeScript-first Schema Validation
## https://zod.dev
Explains schema definitions, parsing, and type inference in Zod. Essential for validating complex configuration objects and input payloads in automated workflows. Provides examples of error handling to improve reliability of dynamic file generation. Last updated: February 2024.
## MIT License

# minimatch: Glob Pattern Matching
## https://www.npmjs.com/package/minimatch
Describes glob syntax and matching options. Useful for selecting files in workflows (e.g., linting, formatting scripts). Offers performance considerations and edge-case behaviors for cross-platform compatibility. Last published: January 2024.
## ISC License

# js-yaml: YAML Parsing and Stringifying
## https://www.npmjs.com/package/js-yaml
Covers loading, dumping, and customizing schema options in YAML. Enables reading and writing GitHub Actions workflow YAML in scripts for dynamic updates. Highlights security implications of unsafe parsing. Last published: March 2024.
## MIT License

# EJS Templating Guide
## https://ejs.co/#docs
Provides an in-depth look at using Embedded JavaScript templates in Node.js. Addresses layout inheritance, partials, and custom delimiters. Directly applicable for generating workflow and documentation files programmatically. Last updated: December 2023.
## MIT License

# Vitest: Fast Unit Test Framework for Vite and Node
## https://vitest.dev/api
Documentation for writing and running tests with Vitest. Covers configuration, mocks, snapshot testing, and coverage reporting. Aligns with the repository’s test suite strategy. Last updated: May 2024.
## MIT License

# ESLint Configuration Guide
## https://eslint.org/docs/latest/user-guide/configuring
Official ESLint guide on defining `.eslintrc` configurations, shareable configs, and plugin development. Key for maintaining consistent code quality across automated and human contributions. Last updated: April 2024.
## MIT License

# Prettier Configuration File
## https://prettier.io/docs/en/configuration.html
Describes Prettier’s supported configuration options and override mechanisms. Crucial for enforcing style consistency in auto-generated code and templates. Last updated: June 2024.
## MIT License

# dotenv: Environment Variable Management
## https://www.npmjs.com/package/dotenv
Explains loading `.env` files, variable expansion, and safe defaults. Important for managing API keys (`CHATGPT_API_SECRET_KEY`) in local and CI environments. Last published: May 2024.
## BSD-2-Clause License

# Agentic-lib Repository
## https://github.com/xn-intenton-z2a/agentic-lib
The source of reusable workflows powering `repository0`. Contains composite and functional workflows, examples, and best practices for LLM-driven CI/CD automation. Studying this repository reveals core patterns and extension points. Last commit: June 2024.
## MIT License

# NPM Check Updates (ncu)
## https://www.npmjs.com/package/npm-check-updates
Describes programmatic dependency version scanning and upgrade strategies. Underpins the `update-to-minor` and `update-to-greatest` scripts, ensuring safe, automated dependency maintenance. Last published: April 2024.
## MIT License