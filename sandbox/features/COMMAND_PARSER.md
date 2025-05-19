# Overview
This feature adds comprehensive command-line parsing to the existing CLI entrypoint. Users can now invoke built-in commands and flags rather than only echoing arguments. The primary goal is to showcase core functionality and make the utility more user-friendly.

# CLI Commands
- help: Display usage instructions and available commands
- version: Print the current package version
- mission: Output the repository’s mission statement from MISSION.md
- [default]: If no recognized flags or commands are provided, echo the supplied arguments

# Implementation Details
- In src/lib/main.js, integrate minimist to parse positional arguments and flags
- Map commands and flags to functions that handle output accordingly
- Read the version from package.json dynamically
- Load and print the contents of MISSION.md for the mission command

# Tests
- Update tests/unit/main.test.js to include unit tests for help, version, and mission flags
- Ensure that the main function returns or logs expected outputs without throwing errors

# Documentation
- Update README.md to document the new commands with usage examples: 
  npm run start -- --help  
  npm run start -- --version  
  npm run start -- --mission
- Include links to MISSION.md, CONTRIBUTING.md, LICENSE.md, and the agentic-lib repository

# Dependencies File
- No new dependencies required; existing minimist package is reused
- Bump the package version in package.json to reflect the new feature