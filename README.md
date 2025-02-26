# owl-builder

`owl-builder` is a versatile CLI tool and JavaScript library for building, managing, and querying OWL ontologies. It showcases automated CI/CD workflows imported from intentïon [`agentic‑lib`](https://github.com/xn-intenton-z2a/agentic-lib).

This repository serves as both a template and a demonstration environment for creating robust, self-evolving ontology management systems. The current CLI provides several implemented commands, while future enhancements will introduce advanced querying capabilities, a web interface for ontology visualization, and persistent knowledge base features.

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
- *Improved consistency across source and test files with standardized async outputs.*

## Future Enhancements

Planned features for upcoming releases include:

- Advanced ontology building from diverse public data sources.
- Querying capabilities through both the CLI and a web interface.
- A persistent knowledge base for managing ontologies over time.
- Integration with additional external data crawlers and improved data mapping.

## Installation

Install via npm:

```bash
npm install owl-builder
```

## Usage

To use the CLI tool, run:

```bash
node src/lib/main.js --help
```

Providing the `--help` flag displays a help menu with available options. Running without any arguments will display usage instructions along with a demo output. In a testing environment, process termination is suppressed to allow for proper test execution.

### Example Commands

- **Display Help:**
  ```bash
  node src/lib/main.js --help
  ```

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

- **Default Demo Output:**
  ```bash
  npm run start
  ```
  Running without arguments produces:
  ```
  Usage: node src/lib/main.js [options]
  Options:
    --help           Show help
    --version        Show version
    --example-owl    Show an example OWL ontology as JSON
    --fetch-owl      Fetch public API data and render as OWL ontology JSON
    --build-owl      Build a demo OWL ontology as JSON
    --diagnostics    Run diagnostics to test public API connectivity
    --extend         Display extended OWL ontology as JSON with additional metadata
  Demo Output: Run with: []
  ```

## JSON-LD Ontology Example

Below is a simple example of an OWL ontology expressed in JSON-LD. This example defines a basic ontology with two classes (Person and Employee) and one datatype property (hasAge), showcasing how OWL concepts can be represented in a JSON structure.

```json
{
  "@context": {
    "owl": "http://www.w3.org/2002/07/owl#",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "xsd": "http://www.w3.org/2001/XMLSchema#",
    "ex": "http://example.org/ontology#"
  },
  "@graph": [
    {
      "@id": "ex:Person",
      "@type": "owl:Class",
      "rdfs:label": "Person"
    },
    {
      "@id": "ex:Employee",
      "@type": "owl:Class",
      "rdfs:subClassOf": { "@id": "ex:Person" },
      "rdfs:label": "Employee"
    },
    {
      "@id": "ex:hasAge",
      "@type": "owl:DatatypeProperty",
      "rdfs:domain": { "@id": "ex:Person" },
      "rdfs:range": { "@id": "xsd:integer" },
      "rdfs:label": "has age"
    }
  ]
}
```

## Contributing

We welcome contributions! Please refer to our [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines on how to contribute effectively. In summary:

1. Fork the repository and create a feature branch.
2. Implement your changes ensuring that code quality, tests, and documentation are updated.
3. Submit a pull request and address any feedback from maintainers.

Your contributions help improve the functionality and quality of the project.

## Incremental Changes Plan

- Upcoming enhancements include advanced CLI commands, a web interface for ontology querying, and extended ontology management capabilities.

## License

Released under the MIT License (see [LICENSE](./LICENSE)).
