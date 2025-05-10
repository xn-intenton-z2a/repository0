# GitHub Actions Reusing Workflows
## https://docs.github.com/en/actions/using-workflows/reusing-workflows
This official GitHub documentation explains how to define and consume reusable workflows using the `workflow_call` event. It covers input/output schemas, secret propagation, permissions, and best practices for modular CI/CD pipelines. Directly informs how `repository0` orchestrates agentic-lib workflows to call one another securely and transfer data between jobs.
Last updated: 2024-02-15. Official GitHub documentation is authoritative based on GitHub’s own release notes.
## License
Creative Commons Attribution 4.0 International (CC BY 4.0)

# GitHub Actions Event Triggers
## https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows
Comprehensive reference of all available workflow triggers—cron syntax for scheduled runs, manual dispatch, `workflow_call`, push/pull events, and repository_dispatch. Essential for configuring `repository0`’s schedules, manual overrides, and failure recovery strategies.
Last updated: 2024-01-10. Official GitHub documentation.
## License
Creative Commons Attribution 4.0 International (CC BY 4.0)

# GitHub Actions Best Practices
## https://docs.github.com/en/actions/learn-github-actions
Guidance on performance tuning (caching, matrices), security (least privilege tokens, secret management), and maintainability (action version pinning, container reuse). Critical for optimizing `repository0`’s workflows to minimize run times and ensure safe handling of credentials.
Last updated: 2023-11-20. Official GitHub documentation.
## License
Creative Commons Attribution 4.0 International (CC BY 4.0)

# GitHub Actions Contexts and Expressions
## https://docs.github.com/en/actions/learn-github-actions/contexts
Defines the built-in contexts (e.g., `github`, `env`, `inputs`) and expression syntax for conditionals, string interpolation, and logical operations. Enables `repository0` workflows to make dynamic decisions, reference workflow metadata, and pass parameters across steps with precision.
Last updated: 2024-04-01. Official GitHub documentation.
## License
Creative Commons Attribution 4.0 International (CC BY 4.0)

# GitHub REST API – Issues and Pull Requests
## https://docs.github.com/en/rest/issues
Detailed endpoint reference for creating, commenting, labeling, and merging PRs. Foundational for agentic-lib’s Issue Worker and Automerge flows in `repository0`, enabling full automation of issue management and PR lifecycles.
Last updated: 2024-03-01. Official GitHub documentation.
## License
Creative Commons Attribution 4.0 International (CC BY 4.0)

# GitHub REST API – Actions
## https://docs.github.com/en/rest/actions
Complete REST API surface for workflow runs, artifacts, logs, and workflow dispatch. Provides actionable methods to query, rerun, and monitor workflows programmatically—used in custom monitoring steps and remediation flows in `repository0`.
Last updated: 2024-04-05. Official GitHub documentation.
## License
Creative Commons Attribution 4.0 International (CC BY 4.0)

# GitHub GraphQL API Reference
## https://docs.github.com/en/graphql
Authoritative guide to the GraphQL v4 API schema, queries, mutations, and authentication. Offers more efficient data retrieval patterns and batching compared to REST—useful for advanced automation and state inspection in `repository0` when REST endpoints are limiting.
Last updated: 2024-05-20. Official GitHub documentation.
## License
Creative Commons Attribution 4.0 International (CC BY 4.0)

# Node.js ESM Modules
## https://nodejs.org/api/esm.html
Official Node.js documentation describing ESM loader, `import`/`export` syntax, interoperability with CommonJS, file extensions, and experimental loader hooks. Crucial for ensuring `src/lib/main.js` and test suites run predictably under Node.js v20.
Last updated: Node.js v20 documentation (2024).
## License
OpenJS Foundation (MIT-compatible)

# OpenAI Chat API & Node.js SDK
## https://platform.openai.com/docs/api-reference/chat
Combined reference for OpenAI’s Chat Completions API and the official Node.js client library. Details the `/chat/completions` endpoint’s request/response schemas, streaming patterns, error handling, rate limits, and best practices for token management, alongside SDK installation, configuration, and authentication via environment variables in Node.js. This unified source underpins all LLM-driven workflows in `repository0`.
Last updated: API (2024-05-15), SDK (2024-04-05). Published by OpenAI.
## License
OpenAI API Terms of Use; MIT (Node.js SDK)

# Zod: Type Validation for TypeScript and JavaScript
## https://github.com/colinhacks/zod
Comprehensive documentation on defining schemas, refining types, nesting and composition, and handling validation errors. Ensures robust input/output validation for workflow inputs and LLM responses in `repository0`.
Last commit: 2024-03-20.
## License
MIT

# EJS Templating Engine
## https://ejs.co/#docs
Official reference for EJS templating syntax, partials/includes, custom filters, and performance considerations. Facilitates generation of code and configuration files within agentic workflows in `repository0`.
Last reviewed: 2024-01-10.
## License
MIT

# Vitest Testing Framework
## https://vitest.dev/guide/
In-depth guide to setting up unit tests, mocks, snapshots, parallel runs, coverage collection, and watch mode. Directly informs the configuration of test scripts in `repository0` and ensures reliable CI feedback loops.
Last updated: 2024-01.
## License
MIT

# Agentic-lib: Reusable Agentic GitHub Workflows
## https://github.com/xn-intenton-z2a/agentic-lib
README and schema definitions for a collection of composable GitHub Actions workflows that automate issue creation, code mutation, PR merging, and issue review. Serves as the primary source for understanding inputs, branching strategies, and behavior of `repository0`’s agentic pipelines.
Last commit: 2024-06-01.
## License
MIT

# dotenv – Environment Variable Management
## https://github.com/motdotla/dotenv#readme
Official guide to loading environment variables from `.env` files into Node.js `process.env`, including configuration options for path, encoding, override behavior, and example patterns. Essential for managing secrets (e.g., `CHATGPT_API_SECRET_KEY`) and configuration in automated workflows.
Last updated: 2024-05. MIT licensed.
## License
MIT

# js-yaml – YAML Parsing for JavaScript
## https://github.com/nodeca/js-yaml#readme
Thorough documentation on parsing (`load`, `loadAll`) and serializing (`dump`) YAML in JavaScript, schema customization (`FAILSAFE`, `JSON`), safe load options, and error handling. Critical for reading and writing YAML-based workflow definitions and configuration files in `repository0`.
Last updated: 2024-04-10. MIT licensed.
## License
MIT

# minimatch – File Globbing and Pattern Matching
## https://github.com/isaacs/minimatch
Detailed reference for glob pattern matching semantics (wildcards, character classes, negation), options (`nocase`, `dot`), and testing methods (`minimatch`, `match`). Used in scripts and workflows for dynamic file selection and path filtering in `repository0`.
Last updated: 2024-02. ISC licensed.
## License
ISC