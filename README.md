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

The **intentïon `agentic‑lib`** is a collection of reusable GitHub Actions workflows that enable your repository to operate in an “agentic” manner. Autonomous workflows communicate through branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be invoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK. This project itself is evolving, and these workflows may eventually become bundled actions.

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

- Build OWL ontologies from public data sources (upcoming feature)
- Manage and query ontologies via a CLI and web interface (upcoming feature)
- Automated CI/CD workflows for continuous evolution
- Enhanced terminal output with colored messages using chalk

## Usage

To use the CLI tool, run:

```bash
node src/lib/main.js --help
```

Providing the `--help` flag displays a help menu with available options. Running without any arguments will display usage instructions along with a demo output. Note: In a testing environment, process termination is suppressed to allow for proper test execution.

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
  Running with the `--fetch-owl` flag fetches data from the REST Countries API (https://restcountries.com/v3.1/all), maps the first three records into an OWL ontology structure with a Country class, and outputs the formatted JSON.

- **Build OWL Ontology as JSON (Demo):**
  ```bash
  node src/lib/main.js --build-owl
  ```
  This command builds a demo OWL ontology with a sample class and individual, outputting the result as formatted JSON.

- **Run Diagnostics (Self-Test):**
  ```bash
  node src/lib/main.js --diagnostics
  ```
  This command performs a self-test by fetching public API data and reporting the number of records fetched along with the response time.

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
  Demo Output: Run with: []
  ```

## JSON-LD Ontology Example

Below is a simple example of an OWL ontology expressed in JSON-LD. This example defines a basic ontology with two classes (Person and Employee) and one datatype property (hasAge). It shows how OWL concepts can be represented in a JSON structure.

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

## Future Enhancements

The following features are planned for future releases:

- Enhanced ontology building from diverse public data sources
- Advanced querying capabilities through both CLI and a web interface
- Integration with additional external data crawlers
- Extended user configuration and customization options

## Contributing

We welcome contributions! Please refer to our [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines on how to contribute effectively. In summary:

1. Fork the repository and create a feature branch.
2. Implement your changes ensuring that code quality, tests, and documentation are updated.
3. Submit a pull request and address any feedback from maintainers.

Your contributions help improve the functionality and quality of the project.

## Incremental Changes Plan

- Upcoming enhancements include advanced CLI commands, web interface improvements, and expanded ontology management capabilities.

## License

Released under the MIT License (see [LICENSE](./LICENSE)).
