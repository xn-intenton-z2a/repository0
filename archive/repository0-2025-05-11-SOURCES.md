# GitHub Actions Documentation
## https://docs.github.com/en/actions
Comprehensive guide to building, testing, and deploying applications using GitHub Actions. Covers workflow syntax, event triggers, runner environments, job strategies, matrix builds, reusable workflows, secrets management, and integration with external services. Essential for defining and orchestrating CI/CD pipelines that power `repository0`’s agentic automation flows.
Last updated: continuously by GitHub. Authoritative as the official documentation.
## License: CC BY 4.0

# Reusing Workflows in GitHub Actions
## https://docs.github.com/en/actions/using-workflows/reusing-workflows
Detailed reference on modularizing workflows via `workflow_call`, including input/output parameters, secrets forwarding, environment configurations, and conditional job selection. Critical for implementing `agentic-lib`’s composable workflows and chaining automation tasks across branches and issues.
Last updated: continuously by GitHub. Authoritative as the official documentation.
## License: CC BY 4.0

# GitHub REST API & Octokit Client
## https://octokit.github.io/rest.js/v18
Combined resource for GitHub’s REST API and the Octokit REST.js client library. Describes endpoints, request/response schemas, authentication methods, pagination utilities, rate-limiting strategies, and built-in retry logic. Streamlines automation of issues, pull requests, workflow dispatch, and repository management in Node.js.
Last updated: Octokit v18.x (2023). Authoritative as the official SDK documentation.
## License: MIT

# GitHub GraphQL API Reference
## https://docs.github.com/en/graphql
Comprehensive guide to GitHub’s GraphQL schema, queries, mutations, input types, error handling, and best practices for efficient data fetching. Enables complex repository inspections, fine-grained permission checks, and batched operations with fewer HTTP requests to enhance performance in automation workflows.
Last updated: continuously by GitHub. Authoritative as the official documentation.
## License: CC BY 4.0

# intentïon agentic-lib
## https://github.com/xn-intenton-z2a/agentic-lib
Source repository for a suite of reusable GitHub Actions workflows that autonomously manage issues, code changes, automergers, and reviews. Provides patterns for issue-to-code conversion, workflow chaining, and self-evolving codebases. Direct insight into extending and customizing the workflows used by `repository0`.
Last commit: see repository. Authoritative as the canonical source.
## License: MIT

# OpenAI API & SDK Documentation
## https://github.com/openai/openai-node
## https://platform.openai.com/docs/api-reference
Unified reference combining the official OpenAI Node.js client library (`openai-node`) and the REST API specification. Covers chat completions, streaming responses, embeddings, fine-tuning, authentication, rate limits, error handling, and batching strategies. Essential for implementing LLM-driven steps in automation workflows and CLI tools.
Last updated: SDK v4.x series (2024) & API docs continuously by OpenAI. Authoritative as official sources.
## License: MIT (Node.js SDK) & governed by OpenAI API Terms of Service

# dotenv Documentation
## https://github.com/motdotla/dotenv
Documentation for loading environment variables from `.env` files into Node.js processes. Covers usage patterns, variable expansion, custom parsing, and security considerations. Crucial for local development and secure management of secrets in automated workflows and actions.
Last updated: v16.5.0 (2024). Community-maintained.
## License: MIT

# js-yaml Documentation
## https://github.com/nodeca/js-yaml
Official documentation for parsing and dumping YAML in JavaScript. Details API for synchronous/asynchronous loading, custom schema definitions, YAML safety options, and error handling. Vital for reading and writing YAML-based workflow definitions and configuration files within the repository.
Last updated: latest release (2024). Authoritative as the canonical repository.
## License: MIT

# Node.js ECMAScript Modules (ESM)
## https://nodejs.org/api/esm.html
In-depth documentation of ESM support in Node.js, covering `import`/`export` syntax, dynamic imports, import assertions, package scope resolution, conditional exports, and top-level await. Critical for structuring modern ESM-based CLI scripts and workflows in Node 20+ environments.
Last updated: Node.js v20 docs. Authoritative as the official documentation.
## License: MIT

# Vitest Testing Framework
## https://vitest.dev/
Modern, blazing-fast testing framework built on V8. Covers configuration, mocking, snapshot testing, coverage reports, watch mode, and CLI usage. Provides actionable examples for setting up tests and integrating coverage directly applicable to `repository0`’s test suite.
Last updated: v3.x series (2024). Authoritative as the official documentation.
## License: MIT

# Zod Schema Validation
## https://github.com/colinhacks/zod
Type-safe schema validation library for TypeScript and JavaScript. Demonstrates schema definitions, parsing, refinements, async validation, and TypeScript inference. Useful for validating configuration objects (e.g., workflow inputs, CLI args) with minimal runtime overhead.
Last updated: latest release (2024). Authoritative as the canonical repository.
## License: MIT

# GitHub Actions Toolkit & Best Practices
## https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action
Consolidated guide on authoring custom JavaScript actions with the GitHub Actions Toolkit and following best practices. Covers `action.yml` metadata, using `@actions/core` and `@actions/exec`, input/output parameters, logging, error handling, least-privilege permissions, caching strategies, and modular design. Enables building secure, performant, and maintainable actions invoked via `workflow_call`.
Last updated: continuously by GitHub (2024). Authoritative as the official documentation.
## License: CC BY 4.0

# SVG Graphics Specification & Reference
## https://www.w3.org/TR/SVG2/paths.html
## https://developer.mozilla.org/en-US/docs/Web/SVG/Element
Comprehensive resources combining the W3C SVG2 Paths specification and MDN’s SVG element reference. Covers path data syntax, commands, parameters, coordinate systems, `viewBox`, `preserveAspectRatio`, polyline and path elements, and graphical primitives. Essential for understanding and constructing precise SVG outputs used by the plotting utilities.
Last updated: SVG 2.0 CR (2023) & continuously by MDN. Authoritative as W3C and community-maintained resources.
## License: W3C Document License & CC BY-SA 2.5

# D3 Shape Module API Reference
## https://github.com/d3/d3-shape#api-reference
Official API reference for the D3.js Shape module. Details line, curve, area, and radial shape generators, path interpolation options, scale utilities, and built-in mathematical transforms. Provides practical patterns for generating complex path data and scaling continuous functions, directly relevant to custom SVG plotting logic.
Last updated: D3 v8.x (2024). Authoritative as the official module documentation.
## License: MIT

# Chart.js Documentation
## https://www.chartjs.org/docs/latest/
Comprehensive guide to Chart.js, a popular JavaScript charting library. Covers chart types (line, bar, scatter, radar), configuration options, responsive design, plugin architecture, animations, and data update patterns. Helpful for comparing Canvas-based solutions with SVG approaches and informing design decisions.
Last updated: v4.x series (2024). Authoritative as the official documentation.
## License: MIT

# Plotly.js JavaScript Reference
## https://plotly.com/javascript/reference/
Detailed reference for Plotly.js, an interactive charting library supporting SVG and WebGL. Includes trace type specifications, layout configurations, styling attributes, event handling, and export utilities. Offers actionable insights for producing interactive plots and exporting high-fidelity SVGs within web and Node.js environments.
Last updated: continuously by Plotly. Authoritative as the official documentation.
## License: MIT