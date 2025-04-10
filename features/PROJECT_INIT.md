# PROJECT_INIT

## Overview
Enhance the project initialization feature to not only bootstrap a new project with a basic scaffold and interactive mode but also to support custom hook execution. This update enables users to define pre-initialization and post-initialization hooks that run custom scripts or commands. These hooks allow developers to extend or modify the initialization process without altering the core implementation, thereby increasing flexibility and customizability.

## Implementation Details
- **Interactive Initialization:**
  - Retain the existing interactive mode that prompts users for project details such as project name, template variant, and configuration settings.
  
- **Hooks Integration:**
  - **Pre-Initialization Hooks:** Before scaffold generation begins, check for a hooks configuration file (e.g. `hooks.json`) or CLI flag (e.g. `--pre-hook`) specifying commands to run. Execute these commands using Node.js’s `child_process` module, and log any output or errors.
  - **Post-Initialization Hooks:** Once the project scaffold is created, similarly check for defined post-initialization hooks (e.g. via a CLI flag `--post-hook` or configuration file entry) and execute them. These hooks can be used to finalize setup tasks, such as installing dependencies or performing additional configuration.
  - **Configuration and Fallbacks:** Allow hooks to be optional. If a hooks file is not present or if the user does not supply hooks via CLI, the initialization should proceed normally. Provide robust error handling to ensure that hook failures do not break the entire initialization flow.
  - **Single Source File Implementation:** As with the rest of the project initialization logic, maintain all hooks functionality within the same module (e.g. `src/lib/projectInit.js`) to ensure ease of maintenance.

## Testing
- **Unit Tests:**
  - Write tests to simulate both successful and failing hook executions (for both pre- and post-initialization). Use mocks for the `child_process` executions to verify that hooks are triggered as expected.
  - Validate that in the absence of hooks, the standard initialization behavior is preserved.
- **Edge Cases:**
  - Test for scenarios where hooks return non-zero exit codes, ensuring that proper error messages are logged and that the CLI prompts the user for confirmation before proceeding (or optionally aborts based on configuration).

## Documentation
- **README and CONTRIBUTING Updates:**
  - Update user-facing documentation to include instructions on how to define and use initialization hooks. Provide usage examples such as:
  ```bash
  # Run initialization with a pre-hook to check system prerequisites and a post-hook to install dependencies
  node src/lib/main.js --init --pre-hook "./scripts/checkPrerequisites.sh" --post-hook "npm install"
  ```
- Detail the structure of the optional `hooks.json` file if users prefer a file-based configuration over CLI flags.

## Benefits
- **Customization:** Developers can insert custom logic into the project setup process to tailor the scaffold to specific requirements without modifying the core code.
- **Modularity:** By collocating hook logic within the existing project initialization module, the feature remains maintainable and self-contained.
- **Error Resilience:** With integrated error handling in hook execution, the initialization process remains robust even when custom hooks fail.
