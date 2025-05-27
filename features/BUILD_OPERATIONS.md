# BUILD_OPERATIONS

# Description
Provide core build capabilities for the CLI, enabling users to perform both intermediate and enhanced build workflows. This feature delivers the primary build functionality beyond argument parsing, allowing staged artifact creation and optimized final outputs.

# Build Modes
1. **Staged Build (--build-intermediate)**
   - Read source definitions or configuration files.
   - Generate an intermediate JSON manifest or artifact representing the build inputs.
   - Write the intermediate artifact to a temporary directory or stdout.
   - Log a summary of generated items, including counts and file paths.
2. **Enhanced Build (--build-enhanced)**
   - Consume the intermediate artifact produced by staged build.
   - Apply transformations, optimizations, or code generation to produce final build outputs.
   - Write the final output to a configured output directory or stdout.
   - Log a detailed build report including performance metrics and file sizes.

# Implementation
- In **src/lib/main.js**:
  - Export a function **performBuildIntermediate(options)** that carries out the first-stage build and returns the path or contents of the intermediate artifact.
  - Export a function **performBuildEnhanced(options)** that reads the intermediate artifact, applies processing, and returns metadata about the final build.
  - In **main()**, after parsing args:
    * If `options.buildIntermediate` is true, call **performBuildIntermediate** and exit with status code 0.
    * If `options.buildEnhanced` is true, call **performBuildEnhanced** and exit with status code 0.
  - Ensure each function handles errors gracefully and logs meaningful messages.

# Testing
- In **tests/unit/main.test.js**:
  - Add unit tests for **performBuildIntermediate**:
    * Mock input configuration and verify the intermediate artifact structure.
    * Spy on `console.log` to assert summary information is logged.
  - Add unit tests for **performBuildEnhanced**:
    * Use a sample intermediate artifact and verify the final output metadata.
    * Confirm that transformations are applied by inspecting returned data.
  - Validate that **main(["--build-intermediate"])** and **main(["--build-enhanced"])** invoke the correct functions and exit cleanly.

# Documentation
- Update **README.md**:
  - Under **Build Operations** section, document the two modes:
    - `npm run build-intermediate` produces an intermediate artifact.
    - `npm run build-enhanced` produces final optimized output.
  - Provide inline usage examples showing commands and expected console logs.
