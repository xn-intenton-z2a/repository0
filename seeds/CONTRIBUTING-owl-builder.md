# owl-builder

Thank you for your interest in contributing to **owl-builder**! This document outlines the guidelines and best practices for developers, testers, and community members who wish to help improve our library and command line tool for building, managing, and querying OWL ontologies.

## Mission Statement

**owl-builder** is a versatile JavaScript library and CLI tool designed to:
- Build OWL ontologies from public data sources.
- Persist and manage ontologies as files.
- Provide intuitive tools for querying via both a CLI and a web interface.
- Integrate supplemental theme ontologies and data crawlers.
- Function as a knowledge base by automatically committing updates.

Our goal is to deliver a robust, user-friendly platform that empowers users to efficiently build and explore ontological data.

## How to Contribute

There are many ways to get involved:

1. **Open an Issue**  
   Whether you're reporting a bug, suggesting a new feature, or discussing an enhancement, please open an issue on our GitHub repository. Detailed descriptions and reproducible examples help us address your feedback more effectively.

2. **Submit a Pull Request**
    - **Fork the Repository:** Create your own branch from the main branch.
    - **Implement Your Changes:** Follow our coding standards and ensure your code is modular, testable, and compatible with ECMAScript Module (ESM) standards.
    - **Write Tests:** Add or update tests to cover new functionality or bug fixes.
    - **Update Documentation:** If your changes affect usage or behavior, please update the relevant documentation, including this guide if needed.
    - **Create a Pull Request:** Submit your changes for review, and be prepared to iterate based on feedback.

3. **Enhance Our Automated Processes**  
   Our repository functions as both a codebase and a dynamic knowledge base. Contributions to improve:
    - The data crawling and ontology-building routines.
    - The persistence layer that writes out and reads the JS knowledge base.
    - The automated commit and job wrapper mechanisms.
    - The CLI and web interface functionalities.

4. **Improve Documentation**  
   Clear documentation is key to making owl-builder accessible to everyone. Contributions in this area are highly appreciated.

## Guidelines

- **Code Quality:**  
  Write clean, modular code that adheres to our coding style. Our architecture separates core logic from GitHub Actions, ensuring each component is testable and maintainable.

- **Testing:**  
  Always include or update tests with your changes. Automated testing is vital to ensure that our ontology building and querying features work reliably.

- **Documentation:**  
  Keep both inline code comments and external documentation up-to-date. This helps maintain clarity around our functions for:
    - Ontology building (classes, properties, individuals, axioms, and restrictions).
    - Data crawling and integration of external theme ontologies.
    - Querying capabilities through CLI and web interfaces.
    - Repository-as-knowledge-base operations.

- **Collaboration:**  
  Engage with the community through GitHub issues and pull requests. Constructive feedback and collaboration help us continually enhance owl-builder.

## Agentic contribution house choice options (programmatically parsed): START

## Issue House Choice Options

repository specific activities:
- Create, vary or extend as many library functions as you can that deliver the spirit of this CONTRIBUTING.md Update the Change Log in README.md (or say what was checked).

generic activities:
- Review the Mission Statement and prune any "drift" from the source file where there are no longer relevant features. Update the Change Log in README.md (or say what was checked).
- Review the Mission Statement and create, vary or extend as many features as you can inline with the Mission Statement. Update the Change Log in README.md (or say what was checked).
  #- Find anything that might be a "simulated" or "demo" implementation and switch to a real implementation. Update the Change Log in README.md (or say what was checked).
  #- Consider alternate code paths that could be explicitly handled to improve the range of supported behaviours. Update the Change Log in README.md (or say what was checked).
  #- Look for code that could be simplified using a library and introduce that library. Update the Change Log in README.md (or say what was checked).

undocumented chores:
#- Look for any duplicated code that could be usefully abstracted out to become shared code and implement that abstraction.
- Refresh the README, consulting the guidance in CONTRIBUTING.md while retaining any relevant content and pruning irrelevant content.
  #- Dry-run any examples in comments or the README against the current code and if they are not accurate or if they could cover more features, update the docs or code to be accurate.
- Bring test coverage up as close to 100% as possible, have single layer mocked tests and deeper tests mocking at the external resource (e.g. file system or network).
  #- Ensure the main function so that it generates some demo output without an over the wire call, and hint a CLI switch that will do the real call.

## Agentic contribution house choice options (programmatically parsed): END

## Getting Started

To dive in:

1. **Installation**

   Install via npm:
   ```bash
   npm install owl-builder
   ```

2. **Command Line Interface**

   Build the ontology from public data sources:
   ```bash
   owl-builder build --source <publicDataSource>
   ```

   Launch the web server for queries and visualizations:
   ```bash
   owl-builder serve --port 8080
   ```

3. **Demo and Usage**

   For a quick demonstration of core functionality, run:
   ```bash
   npm run start -- --help
   ```
   This will output a detailed help message, outlining available commands and parameters.

---

Thank you for contributing to **owl-builder**. Your efforts help us maintain a cutting-edge tool for ontology management and ensure that our project continues to serve the community effectively!