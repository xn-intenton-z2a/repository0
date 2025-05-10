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

# Dependabot – Auto-updating Dependencies
## https://docs.github.com/en/code-security/supply-chain-security/keeping-your-dependencies-updated-automatically
Covers configuring Dependabot version updates for npm, cron schedules, security patches, and PR automerge. Complements `npm-check-updates` scripts in `repository0` to maintain dependency hygiene and reduce security risks.
Last updated: 2024-03-15. Official GitHub documentation.
## License
Creative Commons Attribution 4.0 International (CC BY 4.0)

# Node.js ESM Modules
## https://nodejs.org/api/esm.html
Official Node.js documentation describing ESM loader, `import`/`export` syntax, interoperability with CommonJS, file extensions, and experimental loader hooks. Crucial for ensuring `src/lib/main.js` and test suites run predictably under Node.js v20.
Last updated: Node.js v20 documentation (2024).
## License
OpenJS Foundation (MIT-compatible)

# OpenAI Chat Completions API Reference
## https://platform.openai.com/docs/api-reference/chat
Authoritative specification of the `/chat/completions` endpoint, including request schemas, streaming responses, error codes, rate limits, and best practices for token management. Forms the backbone of all LLM-driven workflows in `repository0`.
Last updated: 2024-05-15. Published by OpenAI.
## License
Subject to OpenAI API Terms of Use

# OpenAI Node.js Client Library
## https://platform.openai.com/docs/client-libraries/nodejs
Guide to installing and using the official OpenAI SDK for Node.js: authentication via environment variables, streaming output, configuration options, and error handling patterns. Directly supports agentic-lib’s integration layer in `repository0`.
Last reviewed: 2024-04-05.
## License
MIT

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

# Prettier Code Formatter
## https://prettier.io/docs/en/index.html
Official Prettier documentation covering CLI usage, editor integrations, configuration overrides, and plugin ecosystem. Guarantees consistent project-wide code styling for both human- and machine-generated code in `repository0`.
Last updated: 2024-02.
## License
MIT

# Agentic-lib: Reusable Agentic GitHub Workflows
## https://github.com/xn-intenton-z2a/agentic-lib
README and schema definitions for a collection of composable GitHub Actions workflows that automate issue creation, code mutation, PR merging, and issue review. Serves as the primary source for understanding inputs, branching strategies, and behavior of `repository0`’s agentic pipelines.
Last commit: 2024-06-01.
## License
MIT