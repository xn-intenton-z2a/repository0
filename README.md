# owl-builder

`owl-builder` is a versatile JavaScript library and CLI tool designed to build, manage, and query OWL ontologies from public data sources. This repository serves both as a template for new projects and as a running example that showcases automated CI/CD workflows derived from [agentic‑lib](https://github.com/xn-intenton-z2a/agentic-lib).

## Repository Template

The repository provides:
* A flexible starting point for building ontology-driven applications.
* An example implementation that demonstrates how to use the CLI tool and library.
* Automated workflows that streamline development and deployment.

For detailed guidelines on contributing, please review our [CONTRIBUTING.md](./CONTRIBUTING.md).

## Installation

Install via npm:

```bash
npm install owl-builder
```

## Features

- Build OWL ontologies from public data sources.
- Manage and persist ontologies as files.
- Query ontological data through a CLI.

## Usage

To run the CLI tool and display help instructions:

```bash
node src/lib/main.js --help
```

If the --help flag is provided, a help menu with available options will display. When no arguments are provided, the CLI prints usage instructions along with a demo output, then terminates automatically.

### Example Commands

- **Display Help:**
  ```bash
  node src/lib/main.js --help
  ```

- **Default Demo Output:**
  ```bash
  npm run start
  ```

## Incremental Changes Plan

TODO: Outline forthcoming changes and enhancements.

## Contributing

We welcome contributions! Please refer to our [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines on how to contribute effectively.

## License

Released under the MIT License (see [LICENSE](./LICENSE)).
