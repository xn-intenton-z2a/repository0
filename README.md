# owl-builder

`owl-builder` is a versatile CLI tool and JavaScript library for building, managing, and querying OWL ontologies. It showcases automated CI/CD workflows imported from intentïon [`agentic‑lib`](https://github.com/xn-intenton-z2a/agentic-lib).

This repository serves as both a template and a demonstration environment for creating robust, self-evolving ontology management systems. The current CLI provides a range of implemented commands for help, versioning, ontology examples, diagnostics, and more.

**Note:** Some advanced features like persistent knowledge base integration, advanced ontology querying, and a full web interface are planned for future releases and have not yet been implemented.

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
- Showing help in JSON format (--help-json) for machine-readable output.
- Displaying version information (--version).
- Displaying detailed version info (--version-full) including name, version, and description.
- Presenting an example OWL ontology as JSON (--example-owl).
- Fetching public API data (from REST Countries or JSONPlaceholder) and rendering it as OWL ontology JSON (--fetch-owl). This output now includes metadata such as the fetch timestamp, source endpoint, and record count. The diagnostics command now also falls back to a backup endpoint if the primary fails.
- Building a demo OWL ontology as JSON (--build-owl).
- Running diagnostics to test public API connectivity and log relevant details (--diagnostics). The diagnostics output includes metadata such as fetch timestamp, record count, latency, and source endpoint.
- Displaying extended functionality (--extend) that outputs an extended OWL ontology with additional metadata.
- **New Feature:** Displaying a full extended OWL ontology (--full-extend) that includes environment details such as Node.js version and platform.
- **New Feature:** Generating a random OWL ontology (--random-owl) from a set of sample ontologies.
- **New Feature:** Logging output to a file (--log) which appends a log entry to `owl-builder.log`.
- **New Feature:** Displaying the current UTC time (--time) using a standardized format.
- **New Feature:** Displaying system information (--system) including platform, architecture, Node.js version, and CPU model.
- **New Feature:** **Detailed Diagnostics (--detailed-diagnostics)** which displays extended diagnostics including memory usage, uptime, and load averages.
- **New Feature:** **Generate UUID (--uuid)** which generates and displays a new random UUID.
- **New Feature:** **Analyze OWL Ontology (--analyze-owl)** which analyzes a built OWL ontology and reports the number of classes, properties, and individuals.
- **Extended Feature:** **Combined Extended Info (--extended)** which displays a combined JSON output of system information and detailed diagnostics.
- **New Feature:** **ASCII Art Version (--ascii-version)** which displays the CLI version in an ASCII art banner using figlet.

**Default Behavior:** If no command line arguments are provided, the CLI displays usage instructions along with a demo output and then terminates immediately without waiting for user input.

## Future Enhancements

Planned features for future releases include:

- Advanced ontology querying capabilities.
- Persistent knowledge base integration.
- Full web interface for ontology querying and management.

These features are currently under discussion and development.

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

- **Display Version:**
  ```bash
  node src/lib/main.js --version
  ```

- **Display Detailed Version Info:**
  ```bash
  node src/lib/main.js --version-full
  ```

- **Display OWL Ontology as JSON (Example):**
  ```bash
  node src/lib/main.js --example-owl
  ```

- **Fetch and Render OWL Ontology from Public API:**
  ```bash
  node src/lib/main.js --fetch-owl
  ```

  The command attempts to fetch data from the REST Countries API as the primary source. If the primary endpoint fails, it falls back to the JSONPlaceholder API to extract data and map it into an OWL ontology structure. The output includes metadata such as fetch timestamp, source endpoint, and record count.

- **Build OWL Ontology as JSON (Demo):**
  ```bash
  node src/lib/main.js --build-owl
  ```

- **Run Diagnostics (Self-Test):**
  ```bash
  node src/lib/main.js --diagnostics
  ```

  This command performs a self-test by fetching public API data. If the primary endpoint fails, it uses a backup endpoint. It then reports the number of records, response time, and logs the derived OWL ontology JSON (with metadata).

- **Extended Functionality:**
  ```bash
  node src/lib/main.js --extend
  ```

- **Full Extended Functionality:**
  ```bash
  node src/lib/main.js --full-extend
  ```

- **Random OWL Ontology:**
  ```bash
  node src/lib/main.js --random-owl
  ```

- **Enable Logging:**
  ```bash
  node src/lib/main.js --log
  ```

- **Display Current Time:**
  ```bash
  node src/lib/main.js --time
  ```

- **Display System Information:**
  ```bash
  node src/lib/main.js --system
  ```

- **Display Detailed Diagnostics:**
  ```bash
  node src/lib/main.js --detailed-diagnostics
  ```

- **Generate UUID:**
  ```bash
  node src/lib/main.js --uuid
  ```

- **Analyze OWL Ontology:**
  ```bash
  node src/lib/main.js --analyze-owl
  ```

- **Combined Extended Info:**
  ```bash
  node src/lib/main.js --extended
  ```

- **Display ASCII Art Version:**
  ```bash
  node src/lib/main.js --ascii-version
  ```

- **Default Demo Output:**
  ```bash
  npm run start
  ```

## Contributing

We welcome contributions to improve owl-builder! Please follow the guidelines outlined in [CONTRIBUTING.md](./CONTRIBUTING.md).

Your adherence to our contribution guidelines helps us maintain a robust, clean, and efficient project.

## Incremental Changes Plan

Upcoming enhancements include advanced CLI commands, a web interface for ontology querying, and extended ontology management capabilities.

**Planned Features:**
- Advanced ontology querying capabilities (not yet implemented).
- Persistent knowledge base integration (not yet implemented).
- Full web interface for ontology querying (planned).

## License

Released under the MIT License (see [LICENSE](./LICENSE)).

<!-- Consistency improvements applied to code and documentation for better readability and maintainability. -->
