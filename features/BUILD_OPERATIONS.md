# BUILD_OPERATIONS

# Description
Provide core build capabilities for the CLI, enabling users to perform both intermediate and enhanced build workflows. This feature delivers the primary build functionality beyond argument parsing, allowing staged artifact creation and optimized final outputs.

# Build Modes
1. **Staged Build (--build-intermediate)**
   - Read source definitions or configuration files (JSON or YAML) from the project root
   - Generate an intermediate JSON manifest capturing item counts and data structure
   - Write the intermediate manifest to the system temporary directory
   - Log a summary object with keys items and path

2. **Enhanced Build (--build-enhanced)**
   - Locate the intermediate manifest via environment variable or default path
   - Apply transformations or optimizations (for example, add timestamp or perform code generation)
   - Write the final enhanced output to the system temporary directory
   - Log a detailed report object with keys transformed and path

# Implementation
- In src/lib/main.js:
  1. Export performBuildIntermediate(options)
     - Detect a source file (source.json, config.yml, etc), load and parse its contents
     - Count entries and assemble a manifest object
     - Write manifest to a temp file and return summary { items, path }
  2. Export performBuildEnhanced(options)
     - Read the manifest file, apply simple transformation, and write enhanced output to temp file
     - Return report { transformed, path }
  3. Update main(args) to:
     - After parsing args, if options.buildIntermediate is true call performBuildIntermediate and process.exit(0)
     - Else if options.buildEnhanced is true call performBuildEnhanced and process.exit(0)

# Testing
- In tests/unit/main.test.js add:
  * Unit tests for performBuildIntermediate:
    - Mock file system to simulate presence of source file and fs operations
    - Assert returned summary matches expected items count and file path
  * Unit tests for performBuildEnhanced:
    - Mock intermediate manifest read and fs operations
    - Assert returned report has transformed true and correct path
  * Integration tests for main dispatch:
    - Invoke main(["--build-intermediate"]) to confirm performBuildIntermediate is called and process exits
    - Invoke main(["--build-enhanced"]) to confirm performBuildEnhanced is called and process exits

# Documentation
- Update README.md under Build Operations:
  - Describe both modes (--build-intermediate and --build-enhanced)
  - Provide inline examples without fenced code blocks:
    npm run build-intermediate
    npm run build-enhanced