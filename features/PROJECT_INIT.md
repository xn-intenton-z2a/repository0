# PROJECT_INIT

## Overview
This feature bootstraps new projects from the repository template. In this updated version, the CLI not only sets up the basic project scaffold (configuration files, template code, and directories) but also offers an optional interactive mode. When run in an interactive terminal, users will be prompted to customize key aspects of the project initialization such as project name, selected template variants, and initial configuration settings. This ensures projects are set up to better match user requirements while still adhering to repository standards.

## Implementation Details
- **CLI Flag Integration:**
  - Retain the existing `--init` flag to trigger project initialization.
  - Detect if the CLI is running in an interactive terminal (using process.stdout.isTTY) and optionally prompt the user for additional configuration inputs.
  - Introduce interactive prompts to customize elements like project name, template variant (if multiple templates are available), and initial configuration options. Use built-in Node.js methods (e.g. readline) to collect user input without adding external dependencies.

- **Initialization Process:**
  - The dedicated module (e.g. `src/lib/projectInit.js`) will now include logic to detect if interactive input is available. If so, it will prompt users for choices and incorporate responses into the scaffold generation.
  - If the user does not supply a target directory, the files will be generated in the current working directory with a confirmation prompt before overwriting any existing files.
  - All file operations use Node.js built-in modules (`fs`, `path`) and include robust error handling for cases like permission issues or invalid inputs.

- **Modularity and Maintainability:**
  - The entire functionality is implemented within a single source file to ensure ease of maintenance.
  - Interactive functionality is toggled without interfering with non-interactive (scripted) use cases, maintaining backward compatibility.

## Testing
- **Unit Tests:**
  - Add tests to simulate both non-interactive and interactive project initialization scenarios (e.g., using mocks for stdin). Verify that the project scaffold is created correctly in both modes.
  - Ensure that file overwrites are safeguarded and proper error handling is in place.

## Documentation
- Update the README and CONTRIBUTING files to include instructions on using the enhanced interactive project initialization feature. 
- Include examples such as:
  ```bash
  # Initialize a new project in the current directory interactively
  node src/lib/main.js --init
  
  # Initialize a new project in a specified directory
  node src/lib/main.js --init ./my-new-project
  ```

## Benefits
- **Rapid Bootstrapping with Customization:** Users get a ready-to-use project scaffold that can be fine-tuned during initialization.
- **Enhanced User Experience:** Interactive mode reduces manual post-setup configuration, lowering the barrier for new contributions.
- **Consistency and Safety:** Ensures all new projects adhere to repository standards while offering a personalized setup experience.