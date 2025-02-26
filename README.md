# owl-builder

`owl-builder` is a versatile CLI tool and JavaScript library for building, managing, and querying OWL ontologies. It showcases automated CI/CD workflows imported from intentïon [`agentic‑lib`](https://github.com/xn-intenton-z2a/agentic-lib).

This repository serves as both a template and a demonstration environment for creating robust, self-evolving ontology management systems. The current CLI provides a range of implemented commands for help, versioning, ontology examples, diagnostics, and more. 

**Note:** Advanced querying capabilities and persistent knowledge base features are planned for future releases and are not yet implemented.

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
- **New Feature:** Displaying the help information in JSON format (--help-json) for machine-readable output.
- **New Feature:** Displaying system information (--system) including platform, architecture, Node.js version, and CPU model.
- **New Feature:** **Detailed Diagnostics (--detailed-diagnostics)** which displays extended diagnostics including memory usage, uptime, and load averages.
- **New Feature:** **Generate UUID (--uuid)** which generates and displays a new random UUID.

**Default Behavior:** If no command line arguments are provided, the CLI displays usage instructions along with a demo output and then terminates immediately without waiting for user input.

## Future Enhancements

Planned features for future releases include:

- Advanced ontology querying capabilities.
- Persistent knowledge base integration.

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
  This command outputs the help information in a machine-readable JSON format.

- **Display Version:**
  ```bash
  node src/lib/main.js --version
  ```

- **Display Detailed Version Info:**
  ```bash
  node src/lib/main.js --version-full
  ```
  This command outputs detailed version information including the package name, version, and description.

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
  This command builds a demo OWL ontology with a sample class and individual, outputting the result as formatted JSON.

- **Run Diagnostics (Self-Test):**
  ```bash
  node src/lib/main.js --diagnostics
  ```
  This command performs a self-test by fetching public API data. If the primary endpoint fails, it uses a backup endpoint. It then reports the number of records, response time, and logs the derived OWL ontology JSON (with metadata).

- **Extended Functionality:**
  ```bash
  node src/lib/main.js --extend
  ```
  This command displays an extended OWL ontology as JSON, including additional metadata to showcase enhanced functionality.

- **Full Extended Functionality:**
  ```bash
  node src/lib/main.js --full-extend
  ```
  This command displays a full extended OWL ontology as JSON that includes environment details such as Node.js version and platform.

- **Random OWL Ontology:**
  ```bash
  node src/lib/main.js --random-owl
  ```
  This command generates and displays a random OWL ontology as JSON from a set of predefined samples.

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

- **Detailed Diagnostics:**
  ```bash
  node src/lib/main.js --detailed-diagnostics
  ```
  This command displays extended diagnostics information including memory usage, uptime, and load averages.

- **Generate UUID:**
  ```bash
  node src/lib/main.js --uuid
  ```
  This command generates and displays a new random UUID.

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
    --version-full          Show detailed version info
    --example-owl           Show an example OWL ontology as JSON
    --fetch-owl             Fetch public API data and render as OWL ontology JSON (with metadata)
    --build-owl             Build a demo OWL ontology as JSON
    --diagnostics           Run diagnostics to test public API connectivity (with metadata)
    --extend                Display extended OWL ontology as JSON with additional metadata
    --full-extend           Display full extended OWL ontology as JSON with environment details
    --random-owl            Generate a random OWL ontology as JSON
    --log                   Enable logging of output to file
    --time                  Display the current UTC time
    --system                Display system information
    --detailed-diagnostics  Display extended diagnostics including memory usage, uptime, and load averages
    --uuid                  Generate a new random UUID
  Demo Output: Run with: []
  ```

## Contributing

We welcome contributions to improve owl-builder! Please follow the guidelines outlined in [CONTRIBUTING.md](./CONTRIBUTING.md). In summary:

- Open an issue with a detailed description of your suggestion or bug.
- Fork the repository, create your feature branch, and implement your changes ensuring you include tests.
- Update documentation as necessary to reflect your changes.
- Submit a pull request for review.

Your adherence to our contribution guidelines helps us maintain a robust, clean, and efficient project.

## Incremental Changes Plan

Upcoming enhancements include advanced CLI commands, a web interface for ontology querying, and extended ontology management capabilities. 

**Planned Features:**
- Advanced ontology querying capabilities (not yet implemented).
- Persistent knowledge base integration (not yet implemented).

## License

Released under the MIT License (see [LICENSE](./LICENSE)).

<!-- Consistency improvements applied to code and documentation for better readability and maintainability. -->
