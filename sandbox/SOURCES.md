# GitHub Actions Documentation
## https://docs.github.com/en/actions
Comprehensive guide to building, testing, and deploying applications using GitHub Actions. Covers workflow syntax, event triggers, runner environments, job strategies, matrix builds, reusable workflows, secrets management, and integration with external services. Essential for defining and orchestrating CI/CD pipelines that power `repository0`’s agentic automation.
Last updated: continuously by GitHub. Authoritative as the official documentation.
## License: CC BY 4.0

# Reusing Workflows in GitHub Actions
## https://docs.github.com/en/actions/using-workflows/reusing-workflows
Detailed reference on modularizing workflows via `workflow_call`, input/output parameters, secrets forwarding, and environment configuration. Critical for implementing `agentic-lib`’s reusable workflows pattern and composing complex automation across branches and issues.
Last updated: continuously by GitHub. Authoritative as the official documentation.
## License: CC BY 4.0

# GitHub REST API & Octokit Client
## https://octokit.github.io/rest.js/v18
Combined resource for GitHub’s REST API and the official Octokit REST.js client library. Describes API endpoints, request/response schemas, authentication methods, pagination, error handling, and Octokit’s abstraction methods (installation, authentication helpers, retries, pagination utilities). Streamlines automation of issues, pull requests, and workflow dispatch in Node.js.
Last updated: Octokit v18.x (2023). Authoritative as the official SDK documentation.
## License: MIT

# GitHub GraphQL API Reference
## https://docs.github.com/en/graphql
Comprehensive guide to the GitHub GraphQL schema, queries, mutations, and best practices for efficient data retrieval. Enables complex repository inspections and batched operations with fewer HTTP requests, enhancing performance in automation workflows.
Last updated: continuously by GitHub. Authoritative as the official documentation.
## License: CC BY 4.0

# intentïon agentic-lib
## https://github.com/xn-intenton-z2a/agentic-lib
Source repository for a suite of reusable GitHub Actions workflows that autonomously manage issues, code changes, automergers, and reviews. Provides patterns for issue-to-code conversion, workflow chaining, and self-evolving code bases. Offers direct insight into extending and customizing the workflows used by `repository0`.
Last commit: see repository. Authoritative as the canonical source.
## License: MIT

# OpenAI Node.js SDK
## https://github.com/openai/openai-node
Official JavaScript client library for OpenAI APIs. Includes detailed usage examples for chat completions, streaming responses, error handling, rate limits, and batching. Essential for implementing LLM-driven steps in automation workflows and CLI tools.
Last updated: maintained actively by OpenAI.
## License: MIT

# OpenAI API Reference
## https://platform.openai.com/docs/api-reference
Official documentation for the OpenAI REST API, detailing available endpoints (completions, chat, embeddings, fine-tuning), request/response schemas, authentication, rate limits, and streaming protocols. Crucial for crafting effective prompts, handling responses, and integrating LLM capabilities directly within workflows.
Last updated: continuously by OpenAI. Authoritative as the official documentation.
## License: governed by OpenAI API Terms of Service

# dotenv Documentation
## https://github.com/motdotla/dotenv
Documentation for loading environment variables from `.env` files into Node.js processes. Covers usage patterns, variable expansion, custom parsing, and security considerations. Useful for local development and secure management of secrets in automated workflows.
Last updated: v16.5.0 (2024). Community-maintained.
## License: MIT

# js-yaml Documentation
## https://github.com/nodeca/js-yaml
Official documentation for parsing and dumping YAML in JavaScript. Details API for loading, dumping, custom schema definitions, and error handling. Vital for reading and writing YAML-based workflow definitions and configuration files within the repository.
Last updated: latest release (2024). Authoritative as the canonical repository.
## License: MIT

# Node.js ECMAScript Modules (ESM)
## https://nodejs.org/api/esm.html
In-depth documentation of ESM support in Node.js, covering `import`/`export` syntax, dynamic imports, import assertions, package scope resolution, and top-level await. Critical for structuring ESM-based CLI scripts and workflows in Node 20+ environments.
Last updated: Node.js v20 docs. Authoritative as the official documentation.
## License: MIT

# Vitest Testing Framework
## https://vitest.dev/
Modern, blazing-fast testing framework built on V8. Covers configuration, mocking, snapshot testing, coverage reports, and CLI usage. Provides actionable examples for setting up tests and integrating coverage, directly applicable to `repository0`’s test suite.
Last updated: v3.x series (2024). Authoritative as the official documentation.
## License: MIT

# Zod Schema Validation
## https://github.com/colinhacks/zod
Type-safe schema validation library for TypeScript and JavaScript. Demonstrates schema definitions, parsing, refinements, and inference. Useful for validating configuration objects (e.g., workflow inputs, CLI args) with minimal runtime overhead.
Last updated: latest release (2024). Authoritative as the canonical repository.
## License: MIT

# semantic-release Automated Versioning
## https://semantic-release.gitbook.io/semantic-release/
Automates release management by deriving version numbers from commit messages, generating changelogs, and publishing packages. Describes plugin ecosystem, CI integration, and configuration conventions. Relevant for orchestrating releases within agentic workflows.
Last updated: maintained (2024). Authoritative as the GitBook documentation.
## License: MIT

# GitHub Actions Toolkit & Best Practices
## https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action
Consolidated guide on authoring custom JavaScript actions with the GitHub Actions Toolkit and following best practices. Covers `action.yml` metadata, using `@actions/core` and `@actions/exec`, input/output parameters, logging, error handling, least-privilege permissions, caching strategies, and modular design. Enables building secure, performant, and maintainable actions invoked via `workflow_call`.
Last updated: continuously by GitHub (2024). Authoritative as the official documentation.
## License: CC BY 4.0

# SVG Path Specification
## https://www.w3.org/TR/SVG2/paths.html
W3C specification detailing the SVG path data syntax, commands, parameters, and units. Essential for understanding and constructing complex SVG `d` attribute values, enabling precise control over graphical outputs in `repository0`’s plotting utilities.
Last updated: SVG 2.0 Candidate Recommendation (2023). Authoritative as the W3C specification.
## License: W3C Document License

# MDN Web Docs: SVG Element Reference
## https://developer.mozilla.org/en-US/docs/Web/SVG/Element
Comprehensive reference for all SVG elements and attributes, including `<svg>`, `<polyline>`, and `<path>`. Details coordinate systems, `viewBox`, `preserveAspectRatio`, styling, and diagnostics for constructing and manipulating SVG programmatically. Addresses core implementation needs for generating dynamic vector graphics in JavaScript.
Last updated: continuously by MDN contributors. Authoritative community-maintained resource.
## License: CC BY-SA 2.5