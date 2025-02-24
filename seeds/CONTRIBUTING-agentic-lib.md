# agentic‑lib

Thank you for your interest in contributing to **agentic‑lib**! This document outlines our guidelines for human and automated contributions, ensuring that our core library remains robust, testable, and efficient in powering our reusable GitHub workflows.

## Mission Statement

**agentic‑lib** is the heart of our automated workflow system. It encapsulates the core logic extracted from GitHub script sections to:

- Verify issue fixes via an AI prompt.
- Update source files based on build, test, and main execution outputs (supporting fixes for failing builds and starting issue fixes).
- Extract issue numbers from branch names.
- Automatically merge pull requests.
- Identify pull requests with the “automerge” label.
- Select and process issues from a provided list.
- Determine whether an issue is marked as merged.
- Create pull requests and issues.
- List open pull requests.

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

Thank you for contributing to **agentic‑lib**. Together, we can continue to build a reliable, efficient, and innovative automated workflow ecosystem!
