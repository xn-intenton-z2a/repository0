# GitHub Actions Reusing Workflows
## https://docs.github.com/en/actions/using-workflows/reusing-workflows
This official GitHub documentation explains how to define and consume reusable workflows using the `workflow_call` event. It covers input/output schemas, secret propagation, permissions, and best practices for modular CI/CD pipelines. Directly informs how agentic-lib workflows orchestrate multi-job pipelines, securely transfer data, and maintain granular permissions across calls.
Last updated: 2024-02-15. Official GitHub documentation is authoritative based on GitHub’s own release notes.
## License
Creative Commons Attribution 4.0 International (CC BY 4.0)

# GitHub Actions Event Triggers
## https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows
Comprehensive reference of all available workflow triggers—cron syntax for scheduled runs, manual dispatch, `workflow_call`, push/pull events, and repository_dispatch. Essential for configuring schedules, manual overrides, and failure recovery strategies in agentic workflows.
Last updated: 2024-01-10. Official GitHub documentation.
## License
Creative Commons Attribution 4.0 International (CC BY 4.0)

# GitHub Actions Best Practices
## https://docs.github.com/en/actions/learn-github-actions
Guidance on performance tuning (caching, matrices), security (least privilege tokens, secret management), and maintainability (action version pinning, container reuse). Critical for optimizing workflows to minimize run times and ensure safe handling of credentials.
Last updated: 2023-11-20. Official GitHub documentation.
## License
Creative Commons Attribution 4.0 International (CC BY 4.0)

# GitHub Actions Contexts and Expressions
## https://docs.github.com/en/actions/learn-github-actions/contexts
Defines the built-in contexts (e.g., `github`, `env`, `inputs`) and expression syntax for conditionals, string interpolation, and logical operations. Enables workflows to make dynamic decisions, reference workflow metadata, and pass parameters across steps with precision.
Last updated: 2024-04-01. Official GitHub documentation.
## License
Creative Commons Attribution 4.0 International (CC BY 4.0)

# GitHub Actions Workflow Syntax
## https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions
Official syntax reference for defining workflow file schema: jobs, steps, runners, triggers, strategy, concurrency, permissions, and environment variables. Crucial for authoring custom agentic workflows and ensuring correct job dependencies, matrix builds, and security contexts.
Last updated: 2024-05-15. Official GitHub documentation.
## License
Creative Commons Attribution 4.0 International (CC BY 4.0)

# GitHub Actions Caching Dependencies
## https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows
Detailed guide on using `actions/cache` to speed up workflow runs by reusing dependencies and build outputs. Covers key strategies for creating cache keys, restore-keys, and handling cache misses. Vital for reducing CI run times in large JavaScript and Node.js projects.
Last updated: 2024-01-05. Official GitHub documentation.
## License
Creative Commons Attribution 4.0 International (CC BY 4.0)

# GitHub Actions Workflow Commands for Logging
## https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions
This official documentation details the special workflow commands used to interact with GitHub Actions at runtime. It covers how to write and format log messages, group and fold logs, mask sensitive values, set and export job outputs, add timing annotations, and invoke debug mode. Essential for agentic workflows to produce structured, machine-readable logs and to coordinate data propagation between steps.
Last updated: 2024-02-10. Official GitHub documentation.
## License
Creative Commons Attribution 4.0 International (CC BY 4.0)

# GitHub Actions Artifacts
## https://docs.github.com/en/actions/using-workflows/storing-workflow-data-as-artifacts
This guide explains how to persist data from workflow runs across jobs using `actions/upload-artifact` and `actions/download-artifact`. It details artifact retention, size limits, and path configurations. Critical for agentic workflows that share generated files, logs, or intermediate results between discrete jobs in a multi-stage pipeline.
Last updated: 2024-03-01. Official GitHub documentation.
## License
Creative Commons Attribution 4.0 International (CC BY 4.0)

# GitHub REST API
## https://docs.github.com/en/rest
Unified reference for GitHub's REST API endpoints covering issues, pull requests, workflow runs, artifacts, logs, and repository management. Essential for agentic-lib’s automation flows—creating and labeling issues, initiating workflow runs, monitoring artifacts, and implementing custom recovery logic.
Last updated: 2024-04-05. Official GitHub documentation.
## License
Creative Commons Attribution 4.0 International (CC BY 4.0)

# GitHub GraphQL API Reference
## https://docs.github.com/en/graphql
Authoritative guide to the GraphQL v4 API schema, queries, mutations, and authentication. Offers efficient data retrieval patterns and batching for advanced automation and state inspection when REST limits are reached.
Last updated: 2024-05-20. Official GitHub documentation.
## License
Creative Commons Attribution 4.0 International (CC BY 4.0)

# Node.js ESM Modules
## https://nodejs.org/api/esm.html
Official Node.js documentation describing the ESM loader, `import`/`export` syntax, interoperability with CommonJS, file extensions, and experimental loader hooks. Crucial for ensuring `src/lib/main.js` and test suites run predictably under Node.js v20.
Last updated: Node.js v20 documentation (2024).
## License
OpenJS Foundation (MIT-compatible)

# OpenAI Chat API & Node.js SDK
## https://platform.openai.com/docs/api-reference/chat
Combined reference for OpenAI’s Chat Completions API and the official Node.js client library. Details the `/chat/completions` endpoint’s request/response schemas, streaming patterns, error handling, rate limits, and best practices for token management, alongside SDK installation, configuration, and authentication via environment variables in Node.js. Underpins all LLM-driven workflows.
Last updated: API (2024-05-15), SDK (2024-04-05). Published by OpenAI.
## License
OpenAI API Terms of Use; MIT (Node.js SDK)

# Zod: Type Validation for TypeScript and JavaScript
## https://github.com/colinhacks/zod
Comprehensive documentation on defining schemas, refining types, nesting and composition, and handling validation errors. Ensures robust input/output validation for workflow inputs and LLM responses.
Last commit: 2024-03-20.
## License
MIT

# Agentic-lib: Reusable Agentic GitHub Workflows
## https://github.com/xn-intenton-z2a/agentic-lib
README and schema definitions for a collection of composable GitHub Actions workflows that automate issue creation, code mutation, PR merging, and issue review. Serves as the primary source for understanding inputs, branching strategies, and behavior of agentic pipelines.
Last commit: 2024-06-01.
## License
MIT

# dotenv – Environment Variable Management
## https://github.com/motdotla/dotenv#readme
Official guide to loading environment variables from `.env` files into Node.js `process.env`, including configuration options for path, encoding, override behavior, and example patterns. Essential for managing secrets (e.g., `CHATGPT_API_SECRET_KEY`) and configuration in automated workflows.
Last updated: 2024-05.
## License
MIT

# js-yaml – YAML Parsing for JavaScript
## https://github.com/nodeca/js-yaml#readme
Thorough documentation on parsing (`load`, `loadAll`) and serializing (`dump`) YAML in JavaScript, schema customization (`FAILSAFE`, `JSON`), safe load options, and error handling. Critical for reading and writing YAML-based workflow definitions and configuration files.
Last updated: 2024-04-10.
## License
MIT