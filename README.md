# owl-builder

`owl-builder` is a versatile CLI tool and JavaScript library for building, managing, and querying OWL ontologies. It showcases automated CI/CD workflows imported from intentïon [`agentic‑lib`](https://github.com/xn-intenton-z2a/agentic-lib).

This repository serves as both a template and a demonstration environment for creating robust, self-evolving ontology management systems. The current CLI provides a range of implemented commands for help, versioning, ontology examples, diagnostics, and more. Future enhancements will introduce advanced querying capabilities and persistent knowledge base features, which are still under development.

## Repository Template

The repository includes:
* A Template Base: A starting point for new projects.
* A Running Experiment: An example implementation demonstrating one way to use the template.
* Example GitHub Workflows from [agentic‑lib](https://github.com/xn-intenton-z2a/agentic-lib) that hand off to reusable workflows.

For more details, see [TEMPLATE-README.md](./TEMPLATE-README.md).

## intentïon `agentic‑lib`

The **intentïon `agentic‑lib`** is a collection of reusable GitHub Actions workflows that enable your repository to operate in an “agentic” manner. Autonomous workflows communicate through branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be invoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK. This project itself is evolving, and these workflows may eventually become bundled actions.

*Warning:* Executing these workflows may incur charges on your OpenAI account and consume GitHub Actions minutes.

*Warning:* Experimental. This coding system is still in development and may not suit production use.

## Current Features

The current implementation of `owl-builder` includes:

- Displaying a help message (--help) with usage information and demo output.
- Showing version information (--version).
- Presenting an example OWL ontology as JSON (--example-owl).
- Fetching public API data (from REST Countries or JSONPlaceholder) and rendering it as an OWL ontology JSON (--fetch-owl).
- Building a demo OWL ontology as JSON (--build-owl).
- Running diagnostics to test public API connectivity and log relevant details (--diagnostics).
- Displaying extended functionality (--extend) that outputs an extended OWL ontology with additional metadata.
- **New Feature:** Logging output to a file (--log) which appends a log entry to `owl-builder.log`.
- **New Feature:** Displaying the current UTC time (--time) using a standardized format.
- **New Feature:** Displaying the help information in JSON format (--help-json) for machine-readable output.
- **New Feature:** Displaying system information (--system) including platform, architecture, Node.js version, and CPU model.
- **New Feature:** **Detailed Diagnostics (--detailed-diagnostics)** which displays extended diagnostics including memory usage, uptime, and load averages.

**Default Behavior:** If no command line arguments are provided, the CLI displays usage instructions along with a demo output and then terminates without waiting for further user input.

## Future Enhancements

Planned features for upcoming releases (not yet implemented) include:

- Advanced ontology building from diverse public data sources.
- Querying capabilities through both the CLI and an interactive web interface.
- A persistent knowledge base for managing ontologies over time.
- Integration with additional external data crawlers and improved data mapping.

These future enhancements are part of our roadmap to extend the functionality of `owl-builder` while maintaining a robust and user-friendly tool.

## Installation

Install via npm:

```bash
npm install owl-builder
```

Note: This version requires Node 20.0.0 or higher as it uses the new JSON module import syntax with the `with` keyword.

## Usage

To use the CLI tool, run:

```bash
node src/lib/main.js --help
```

Providing the `--help` flag displays a help menu with available options. Running without any arguments will display usage instructions along with a demo output and then exit immediately.

### Example Commands

- **Display Help:**
  ```bash
  node src/lib/main.js --help
  ```

- **Display Help in JSON Format:**
  ```bash
  node src/lib/main.js --help-json
  ```
  This command outputs the help information in a machine-readable JSON format.

- **Display Version:**
  ```bash
  node src/lib/main.js --version
  ```

- **Display OWL Ontology as JSON (Example):**
  ```bash
  node src/lib/main.js --example-owl
  ```

- **Fetch and Render OWL Ontology from Public API:**
  ```bash
  node src/lib/main.js --fetch-owl
  ```
  The command attempts to fetch data from the REST Countries API as the primary source. If the primary endpoint fails, it falls back to the JSONPlaceholder API to extract data and map it into an OWL ontology structure.

- **Build OWL Ontology as JSON (Demo):**
  ```bash
  node src/lib/main.js --build-owl
  ```
  This command builds a demo OWL ontology with a sample class and individual, outputting the result as formatted JSON.

- **Run Diagnostics (Self-Test):**
  ```bash
  node src/lib/main.js --diagnostics
  ```
  This command performs a self-test by fetching public API data, reporting the number of records and response time, and logging the derived OWL ontology JSON.

- **Extended Functionality:**
  ```bash
  node src/lib/main.js --extend
  ```
  This command displays an extended OWL ontology as JSON, including additional metadata to showcase enhanced functionality.

- **Enable Logging:**
  ```bash
  node src/lib/main.js --log
  ```
  This command logs a message to a file named `owl-builder.log` and confirms logging via console output.

- **Display Current Time:**
  ```bash
  node src/lib/main.js --time
  ```
  This command displays the current UTC time in the format `YYYY-MM-DD HH:mm:ss`.

- **Display System Information:**
  ```bash
  node src/lib/main.js --system
  ```
  This command displays details about the system including platform, architecture, Node.js version, and CPU model.

- **Display Detailed Diagnostics:**
  ```bash
  node src/lib/main.js --detailed-diagnostics
  ```
  This command displays extended diagnostics information including memory usage, uptime, and load averages.

- **Default Demo Output:**
  ```bash
  npm run start
  ```
  Running without arguments produces:
  ```
  Usage: node src/lib/main.js [options]
  Options:
    --help                  Show help
    --help-json             Show help in JSON format
    --version               Show version
    --example-owl           Show an example OWL ontology as JSON
    --fetch-owl             Fetch public API data and render as OWL ontology JSON
    --build-owl             Build a demo OWL ontology as JSON
    --diagnostics           Run diagnostics to test public API connectivity
    --extend                Display extended OWL ontology as JSON with additional metadata
    --log                   Enable logging of output to file
    --time                  Display the current UTC time
    --system                Display system information
    --detailed-diagnostics  Display extended diagnostics including memory usage, uptime, and load averages
  Demo Output: Run with: []
  ```

## Contributing

We welcome contributions to improve owl-builder! For detailed instructions, please refer to our [CONTRIBUTING.md](./CONTRIBUTING.md). Contributors are encouraged to:

- Open an issue with a detailed description or suggestion.
- Fork the repository and create a feature branch.
- Implement changes following our coding standards and include tests.
- Update documentation where necessary.
- Submit your pull request for review.

By following these guidelines, you help ensure that our project remains robust, maintainable, and in line with community best practices.

## Incremental Changes Plan

- Upcoming enhancements include advanced CLI commands, a web interface for ontology querying, and extended ontology management capabilities. Note that features such as advanced querying and persistent knowledge bases are planned for future releases and are not yet implemented.

## License

Released under the MIT License (see [LICENSE](./LICENSE)).
