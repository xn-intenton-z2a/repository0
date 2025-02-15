#!/usr/bin/env node
// src/lib/main.js

/*

# OWL Builder

**OWL Builder** is a JavaScript library and command line tool designed to build, manage, and query OWL ontologies from public data sources. It integrates data crawlers, supplemental theme ontologies, and provides both CLI and web interfaces for querying and visualizing the ontology. Additionally, the repository itself functions as a knowledge base database—with a job that writes out a JS knowledge base to disk and reads it back, leveraging an action wrapper to handle commits.

This library and command line tool shall:
* Build an OWL ontology from public data sources.
* Persist the ontology in a file.
* Provide tools to query the ontology.
* Include libraries which access public sites to crawl for data.
* Use different supplemental theme ontologies to build the ontology.
* Create a web interface to query the ontology.
* Provide a command line interface to query the ontology.
* Provide a web interface with visualizations of the ontology.

## Features

- **Ontology Building**
  - Build an OWL ontology from public data sources.
  - Integrate supplemental theme ontologies to enrich the ontology.

- **Data Crawling**
  - Include libraries to crawl public sites and ingest data automatically.

- **Persistence**
  - Persist the built ontology in a file.
  - Use the repository as a database:
    - A job writes out a JS knowledge base to disk.
    - A job reads it back.
    - An action wrapper handles automatic commits of changes.

- **Querying Tools**
  - **CLI:** Query the ontology via a command line interface.
  - **Web Interface:** Query the ontology through a web-based interface.
  - **Visualizations:** Display visual representations of the ontology.

## Core Components

### OWL Ontology Support

- **Classes**
  - Parse and represent `owl:Class` and `rdfs:Class`.
  - Handle subclass relationships (`rdfs:subClassOf`), equivalent classes (`owl:equivalentClass`), and disjoint classes (`owl:disjointWith`).

- **Properties**
  - **Object Properties** (`owl:ObjectProperty`):
    - Define domain, range, and inverse properties (`owl:inverseOf`).
    - Support characteristics like transitivity, symmetry, and reflexivity.
  - **Datatype Properties** (`owl:DatatypeProperty`):
    - Manage domains and ranges for literal values.
  - **Annotation Properties** (`owl:AnnotationProperty`):
    - Store metadata, comments, and labels.

- **Individuals**
  - Handle instances and `rdf:type` assertions.
  - Manage relationships between individuals as defined by properties.

- **Axioms and Restrictions**
  - Support restrictions such as `owl:allValuesFrom`, `owl:someValuesFrom`, and cardinality constraints (`owl:cardinality`, `owl:minCardinality`, `owl:maxCardinality`).
  - Process complex axioms like property chains (`owl:propertyChainAxiom`).

### Data Processing & Querying

- **Parsing and Serialization**
  - Parse and serialize common RDF formats (Turtle, RDF/XML, JSON-LD).

- **Ontology Imports**
  - Support the `owl:imports` mechanism to include definitions from external ontologies.

- **Querying**
  - Integrate with SPARQL query engines (e.g., Comunica) for advanced querying.

- **Reasoning**
  - Provide basic inference for subclass relationships and type inheritance.
  - Allow integration with external reasoning engines for full OWL reasoning.

### Repository as a Knowledge Base

- **Database-like Functionality**
  - The repository doubles as a JS knowledge base.
  - A scheduled job writes out a JS knowledge base to disk and reads it back.
  - An action wrapper automates the commit process for changes.

## Installation

*(Provide installation instructions here, e.g., via npm or cloning the repository)*

```bash
npm install owl-builder
```

## Usage

### Command Line Interface

```bash
# Build the ontology from public data sources
owl-builder build --source <publicDataSource>
```

### Web Interface

- Launch the web server to access the query interface and visualizations:

```bash
owl-builder serve --port 8080
```

- Visit [http://localhost:8080](http://localhost:8080) in your browser.

*/

import { fileURLToPath } from "url";

// -----------------------------------------------------------------------------
// Run main if executed directly.
// -----------------------------------------------------------------------------

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  console.log(`Run with: ${JSON.stringify(args)}`);
}
