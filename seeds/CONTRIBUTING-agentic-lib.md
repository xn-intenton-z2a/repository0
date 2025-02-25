# agentic‑lib

Thank you for your interest in contributing to **agentic‑lib**! This document outlines our guidelines for human and automated contributions, ensuring that our core library remains robust, testable, and efficient in powering our reusable GitHub workflows.

## Mission Statement

**agentic‑lib** is a core library for an agentic workflow system featuring:

- Fix issue fixes via an AI prompt.
- Update source files based on build, test, and main execution outputs.
- Supporting fixes for failing builds.
- Automatically merge pull requests.
- Select and process issues from a provided list.
- Create pull requests and issues.

Our goal is to continuously improve and extend these capabilities, making **agentic‑lib** the trusted engine behind automated contributions and continuous integration.

## How to Contribute

Contributions come in many forms—whether you’re a developer, tester, or an advocate for process improvements. Here’s how you can help:

1. **Report Issues or Ideas:**  
   Open an issue on GitHub to share bug reports, feature requests, or any improvements you envision. Clear descriptions and reproducible steps are highly appreciated.

2. **Submit Pull Requests:**
    - Fork the repository and create a feature branch.
    - Implement your changes, ensuring you follow our coding style and standards.
    - Add tests to cover any new functionality.
    - Update documentation and this file if your changes affect usage or workflow behavior.
    - Submit your pull request for review.

3. **Enhance Automated Workflows:**  
   Contributions might include adjustments to:
    - The AI-based fix verification logic.
    - File update routines responding to build, test, or main output.
    - Logic for extracting issue numbers from branch names.
    - Automated pull request merging or listing mechanisms.

4. **Run and Test the Library:**  
   To explore the capabilities of **agentic‑lib**, run the demo function with:
   ```bash
   node main.js [--help]
   ```
   This command prints a detailed help message, including available functions and parameters.

## Guidelines

- **Code Quality:**  
  Write modular, clean, and fully testable code. Our design intentionally decouples functionality from GitHub Actions globals to enhance testability and reuse.

- **Documentation:**  
  Keep inline comments and this Contributing.md up-to-date as you introduce changes. Clear documentation ensures the project stays accessible to both human and AI collaborators.

- **Compatibility:**  
  Ensure your code runs on Node 20 and adheres to ECMAScript Module (ESM) standards.

- **Feedback & Collaboration:**  
  We welcome constructive feedback. Engage with maintainers and peers through GitHub issues and pull request discussions to improve our collective workflow.

---
---
---

# Ensure README.md begins like this:

# intentïon agentic-lib

You probably want to start with the workflow documentation here: [WORKFLOWS-README.md](WORKFLOWS-README.md)

The **intentïon `agentic-lib`** is a collection of reusable GitHub Actions workflows that enable your
repository to operate in an “agentic” manner. In our system, autonomous workflows communicate through branches and
issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be invoked using
GitHub’s `workflow_call` event, so they can be composed together like an SDK.

[Start using the Repository Template](https://github.com/xn-intenton-z2a/repository0)

Mixed licensing:
* This project is licensed under the GNU General Public License (GPL).
* This file is part of the example suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
* This file is licensed under the MIT License. For details, see LICENSE-MIT

This README file will evolve as the test experiment within this repository evolves.

---
---
---

# Ensure README.md ends like this:

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Component Breakdown

This repository is organized into three distinct areas to help you understand the purpose and maturity level of each component:

### 1. Re‑usable Workflows (Core Functionality)
- **Purpose:**  
  These workflows form the backbone of the agentic‑lib system, enabling automated coding processes such as testing, publishing, and issue management.
- **Stability:**  
  They are stable and well‑tested, designed to be integrated into your CI/CD pipelines.
- **Licensing:**  
  The core workflows are released under GPL‑3 and include an attribution requirement for any derived work.
- **Location:**  
  Find these in the `.github/workflows/` directory.

### 2. Example Workflows (Demonstrative Content)
- **Purpose:**  
  These files provide practical examples of how to use the core workflows. They serve as learning tools and reference implementations.
- **Stability:**  
  While functional, they are intended primarily for demonstration and experimentation.
- **Licensing:**  
  The example workflows are covered by the MIT license to allow for broader use and modification.
- **Location:**  
  Look in the `examples/` directory for sample implementations.

### 3. The Evolving main.js (Experimental Work in Progress)
- **Purpose:**  
  This file showcases experimental features and serves as a testbed for integrating new ideas into the system.
- **Stability:**  
  It is under active development and may change frequently. It represents bleeding‑edge functionality that might not yet be production‑ready.
- **Licensing:**  
  As part of the core project, it is under GPL‑3 with the attribution clause.
- **Location:**  
  The experimental code is located in `src/lib/main.js`.

## License

This project is licensed under the GNU General Public License (GPL). See [LICENSE](LICENSE) for details.

License notice:
```
agentic-lib
Copyright (C) 2025 Polycode Limited

agentic-lib is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License v3.0 (GPL‑3).
along with this program. If not, see <https://www.gnu.org/licenses/>.

IMPORTANT: Any derived work must include the following attribution:
"This work is derived from https://github.com/xn-intenton-z2a/agentic-lib"
```

---
---
---