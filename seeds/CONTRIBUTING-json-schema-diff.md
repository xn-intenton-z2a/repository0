# json‑schema‑diff

Thank you for your interest in contributing to **json‑schema‑diff**! This document outlines our guidelines and best practices for developers, testers, and API maintainers who wish to help improve our utility for comparing JSON Schemas and data objects.

## Mission Statement

**json‑schema‑diff** is designed to help API developers and teams track and validate changes in JSON Schemas. By providing a human‑readable diff, the tool simplifies the evolution of API definitions and facilitates collaboration during version upgrades.

## How to Contribute

1. **Report Issues and Suggest Enhancements**  
   Open an issue on GitHub to report bugs, propose new features, or suggest improvements. Clear, reproducible examples and detailed descriptions are invaluable.

2. **Submit Pull Requests**
    - **Fork the Repository:** Create your own branch from the main branch.
    - **Implement Your Changes:** Ensure that your modifications maintain code clarity, modularity, and are well-tested.
    - **Update Documentation:** Modify or add to the documentation as needed, including this guide and usage examples.
    - **Create a Pull Request:** Submit your changes for review and participate in the discussion process.

3. **Improve the API and Core Features**  
   Contribute to enhancing the diffing functionality, improving output readability, or extending support for additional JSON Schema features. Your contributions can include bug fixes, new features, or performance enhancements.

4. **Enhance Documentation**  
   Help maintain clear and concise documentation, from installation instructions to API references. Good documentation ensures that json‑schema‑diff remains accessible to all users.

## Guidelines

- **Code Quality:**  
  Write clean, maintainable code that adheres to our coding standards. Ensure your changes are accompanied by adequate tests.

- **Testing:**  
  All contributions should include appropriate tests. Our project relies on various dependencies (including vitest) to maintain a stable and robust diffing utility.

- **Compatibility:**  
  Maintain backward compatibility where possible and follow semantic versioning principles. If you introduce breaking changes, please document them clearly.

- **Collaboration:**  
  Engage with the community by actively participating in GitHub issues and pull requests. Constructive feedback is key to our project's success.

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

### Installation

Install **json‑schema‑diff** via npm:

```bash
npm install json-schema-diff
```

### Usage Example

Below is a simple example to compare two JSON Schemas:

```javascript
const { diffSchemas } = require('json-schema-diff');

const schemaA = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: 'number' }
  },
  required: ['name', 'age'],
  additionalProperties: false
};

const schemaB = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: 'number' },
    email: { type: 'string' }
  },
  required: ['name', 'age', 'email'],
  additionalProperties: false
};

const diff = diffSchemas(schemaA, schemaB);
console.log(diff);
```

### API Reference

- **diffSchemas(schemaA: object, schemaB: object): string**  
  Returns a human‑readable diff that shows the changes between two JSON Schemas.

---

Thank you for being a part of the **json‑schema‑diff** community. Your contributions help ensure that our tool remains effective, reliable, and easy to use for API developers and teams tracking schema changes. Let's work together to build a better diffing experience!

