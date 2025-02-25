# owl-builder

`owl-builder` is a versatile CLI tool and JavaScript library for building, managing, and querying OWL ontologies. It showcases automated CI/CD workflows imported from intentïon [`agentic‑lib`](https://github.com/xn-intenton-z2a/agentic-lib).

This repository serves as both a template and a demonstration environment for creating robust, self-evolving ontology management systems.

## Repository Template

The repository includes:
* A Template Base: A starting point for new projects.
* A Running Experiment: An example implementation demonstrating one way to use the template.
* Example GitHub Workflows from [agentic‑lib](https://github.com/xn-intenton-z2a/agentic-lib) that hand off to reusable workflows.

For more details, see [TEMPLATE-README.md](./TEMPLATE-README.md).

## intentïon `agentic-lib`

The **intentïon `agentic-lib`** is a collection of reusable GitHub Actions workflows that enable your repository to operate in an “agentic” manner. Autonomous workflows communicate through branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be invoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK. This project itself is evolving, and these workflows may eventually become bundled actions.

*Warning:* Executing these workflows may incur charges on your OpenAI account and consume GitHub Actions minutes.

*Warning:* Experimental. This coding system is still in development and may not suit production use.

## Should you use the `owl-builder` Coding System?

* Do you have access to an OpenAI account with necessary API keys?
* Are you willing to incur charges for consumed resources?
* Are you curious about self-evolving code?
* Would you like to see how such a system can be built?
* Do you appreciate integrated OpenAI and GitHub API calls in a JavaScript environment?

## Installation

Install via npm:

```bash
npm install owl-builder
```

## Features

- Build OWL ontologies from public data sources
- Manage and query ontologies via a CLI and web interface
- Automated CI/CD workflows for continuous evolution

## Usage

To use the CLI tool, run:

```bash
node src/lib/main.js --help
```

Providing the `--help` flag displays a help menu with available options. Running without any arguments will display usage instructions along with a demo output.

### Example Commands

- **Display Help:**
  ```bash
  node src/lib/main.js --help
  ```

- **Display Version:**
  ```bash
  node src/lib/main.js --version
  ```

- **Default Demo Output:**
  ```bash
  npm run start
  ```

  Running without arguments produces:
  ```
  Usage: node src/lib/main.js [options]
  Options:
    --help     Show help
    --version  Show version
  Demo Output: Run with: []
  ```

## Contributing

We welcome contributions! Please refer to our [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines on how to contribute effectively. In summary:

1. Fork the repository and create a feature branch.
2. Implement your changes ensuring that code quality, tests, and documentation are updated.
3. Submit a pull request and address any feedback from maintainers.

Your contributions help improve the functionality and quality of the project.

## Incremental Changes Plan

TODO: Add forthcoming changes here.

## License

Released under the MIT License (see [LICENSE](./LICENSE)).
