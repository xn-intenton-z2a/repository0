# NODE_CLI

## Crawl Summary
The freeCodeCamp crawl provides a guide to building a Node.js CLI tool including project setup, executable configuration, argument parsing using process.argv, file system integration using fs and path, and deployment with npm link. Key technical details include the shebang format, package.json bin configuration, and a sample code structure.

## Normalised Extract
Table of Contents:
1. Project Setup
   - npm initialization with defaults
   - package.json 'bin' configuration for executable mapping
2. CLI Script Essentials
   - Shebang line: #!/usr/bin/env node
   - File permissions: chmod +x filename
3. Argument Parsing
   - Use process.argv
   - Custom parseArguments function signature: parseArguments(argv: string[]) returns an object mapping flags to values
4. Code Structure and Execution
   - Main function to process arguments
   - Error handling and help message display
5. Deployment and Testing
   - npm link for global installation
   - Unit testing using Vitest or similar frameworks

Project Setup Details:
- Command: npm init --yes creates a basic package.json
- Example package.json section:
  "bin": { "mycli": "cli.js" }

CLI Script Essentials:
- First line of cli.js: #!/usr/bin/env node
- Ensure executable permissions are set

Argument Parsing Implementation:
- parseArguments function iterates over process.argv starting index 2
- For each argument starting with '--', assign flag and next value if provided

Code Structure and Execution:
- Main function calls parseArguments and handles commands based on flags
- Includes conditional display of help message and logging of received arguments

Deployment and Testing:
- Use npm link to install the CLI globally
- Run unit tests to ensure reliable argument parsing and file system operations

## Supplementary Details
Technical Specifications:
- Shebang: '#!/usr/bin/env node' at the top of the CLI script. Mandatory for Unix-like OS execution.
- Package.json Configuration:
  Name: my-cli-tool, Version: 1.0.0
  Bin mapping: "bin": { "mycli": "cli.js" }
- File Permissions: Must run 'chmod +x cli.js' post creation.
- Function parseArguments:
  Signature: function parseArguments(argv: string[]): { [key: string]: string }
  Behavior: Iterates over the command line arguments array starting at index 2, checking for flags that begin with '--'. If a flag is detected, links it to the following element assuming it is not another flag; otherwise, assigns true.
- Main Function:
  Signature: function main(): void
  Responsibilities: Calls parseArguments, validates flags (e.g., help), logs output, and handles further commands.
- Troubleshooting Steps:
  1. Verify CLI file starts with valid shebang.
  2. Confirm executable permissions with 'ls -l cli.js'.
  3. Debug argument parsing using console.log on process.argv output.
- Deployment Command:
  Command: npm link
  Effect: Creates a global symlink for the CLI tool.

## Reference Details
API Specifications and SDK Method Signatures:

1. parseArguments Function
   Signature: function parseArguments(argv: string[]): { [key: string]: string }
   Parameters:
     - argv: array of strings representing command line arguments
   Return Type: Object mapping flag names to their values or boolean true if no value is provided
   Exceptions: None explicitly thrown; may return empty object if no flags found

2. main Function
   Signature: function main(): void
   Behavior: Invokes parseArguments, processes flags (--help, --version), outputs usage instructions if necessary

3. Package.json 'bin' Field
   Configuration Option: "bin": { "mycli": "cli.js" }
   Effect: Maps the command 'mycli' to execute cli.js globally when installed via npm link

4. Execution Flow
   - Command Execution: './cli.js' runs if file permissions are set correctly
   - If '--help' flag is present, output usage text and exit using process.exit(0)
   - If other flags are present, log the parsed arguments

Implementation Patterns:

Step 1: Setup Project
   Command: npm init --yes
Step 2: Add Shebang in cli.js
   First line: #!/usr/bin/env node
Step 3: Write parseArguments function as specified above
Step 4: Implement main function to call parseArguments and handle commands
Step 5: Set executable permissions: chmod +x cli.js
Step 6: Link the package globally: npm link

Best Practices:
- Always validate input arguments and provide clear help messages
- Use error handling to catch unexpected inputs
- Write unit tests (e.g., with Vitest) to validate expected behavior of argument parsing

Troubleshooting Procedures:
1. If the CLI command is not recognized:
   - Run npm link again
   - Check the symlink with which mycli
2. If arguments are not parsed correctly:
   - Add console.log(process.argv) at the beginning of cli.js
   - Verify that the parseArguments function correctly iterates from index 2
3. If permission errors occur:
   - Run chmod +x cli.js and try again

Complete Code Example:
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function parseArguments(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    let arg = argv[i];
    if (arg.startsWith('--')) {
      let key = arg.substring(2);
      let value = (i + 1 < argv.length && !argv[i + 1].startsWith('--')) ? argv[i + 1] : true;
      args[key] = value;
    }
  }
  return args;
}

function main() {
  const args = parseArguments(process.argv);
  if (args.help) {
    console.log('Usage: mycli [options]');
    process.exit(0);
  }
  console.log('Parsed Arguments:', args);
}

main();

## Information Dense Extract
Node CLI tool implementation using Node.js. Key points: Use shebang '#!/usr/bin/env node' in cli.js, set executable (chmod +x cli.js), initialize with npm init --yes, configure package.json bin mapping { "mycli": "cli.js" }. Argument parsing via process.argv from index 2; function parseArguments(argv: string[]): returns object { flag: value } pattern. Main function calls parseArguments, handles flags (--help produces usage and exit with code 0). Deployment via npm link for global command installation. Unit testing recommended with frameworks like Vitest. Troubleshooting commands: 'ls -l cli.js', 'npm link', console logging of process.argv.

## Sanitised Extract
Table of Contents:
1. Project Setup
   - npm initialization with defaults
   - package.json 'bin' configuration for executable mapping
2. CLI Script Essentials
   - Shebang line: #!/usr/bin/env node
   - File permissions: chmod +x filename
3. Argument Parsing
   - Use process.argv
   - Custom parseArguments function signature: parseArguments(argv: string[]) returns an object mapping flags to values
4. Code Structure and Execution
   - Main function to process arguments
   - Error handling and help message display
5. Deployment and Testing
   - npm link for global installation
   - Unit testing using Vitest or similar frameworks

Project Setup Details:
- Command: npm init --yes creates a basic package.json
- Example package.json section:
  'bin': { 'mycli': 'cli.js' }

CLI Script Essentials:
- First line of cli.js: #!/usr/bin/env node
- Ensure executable permissions are set

Argument Parsing Implementation:
- parseArguments function iterates over process.argv starting index 2
- For each argument starting with '--', assign flag and next value if provided

Code Structure and Execution:
- Main function calls parseArguments and handles commands based on flags
- Includes conditional display of help message and logging of received arguments

Deployment and Testing:
- Use npm link to install the CLI globally
- Run unit tests to ensure reliable argument parsing and file system operations

## Original Source
Building Node.js CLI Tools
https://www.freecodecamp.org/news/how-to-build-a-command-line-tool-with-node-js/

## Digest of NODE_CLI

# NODE_CLI
Date Retrieved: 2023-10-06

# Overview
This document details the technical process for building a command line tool using Node.js. It covers project setup, argument parsing methods, file system integration, deployment strategies, and testing routines, all based on practical instructions from the freeCodeCamp article.

# Project Setup
- Initialize a new Node.js project with npm init --yes
- Specify the entry point (for example, cli.js) in package.json
- Set the executable field by adding a shebang (#!/usr/bin/env node) at the top of cli.js
- Example package.json entry for bin configuration:
  {
    "name": "my-cli-tool",
    "version": "1.0.0",
    "bin": {
      "mycli": "cli.js"
    },
    "scripts": {
      "start": "node cli.js"
    }
  }

# CLI Implementation Details
## Shebang and Execution
- Place '#!/usr/bin/env node' as the first line in cli.js to set the interpreter
- Ensure cli.js has executable permissions (chmod +x cli.js)

## Argument Parsing
- Use process.argv for capturing command line arguments
- Implement a custom parseArguments function:
  Function Signature: parseArguments(argv: string[]): { [key: string]: string }
  Description: Iterates over argv to map flags (e.g. --help, --version) to their values

## File System and Path
- Include Node.js core modules by requiring 'fs' and 'path'
- Example Pattern:
  const fs = require('fs');
  const path = require('path');

## Deployment and Testing
- Use npm link to turn the CLI tool into a globally available command
- Incorporate unit tests (e.g., using Vitest or Mocha) to test argument parsing and file operations

# Code Example Structure
Example cli.js content:

#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function parseArguments(argv) {
  const args = {};
  argv.slice(2).forEach((arg, index, arr) => {
    if (arg.startsWith('--')) {
      let key = arg.substring(2);
      let value = (arr[index + 1] && !arr[index + 1].startsWith('--')) ? arr[index + 1] : true;
      args[key] = value;
    }
  });
  return args;
}

function main() {
  const args = parseArguments(process.argv);
  if (args.help) {
    console.log('Usage: mycli [options]');
    process.exit(0);
  }
  // Additional command handling
  console.log('Arguments:', args);
}

main();

# Troubleshooting
- If the command is not recognized, verify that npm link was executed correctly
- Check file permissions with ls -l cli.js to ensure the file is executable
- Debug argument parsing by logging process.argv

# Attribution
Source: freeCodeCamp article on Building a Command Line Tool with Node.js (Entry 8)
Data Size: 0 bytes

## Attribution
- Source: Building Node.js CLI Tools
- URL: https://www.freecodecamp.org/news/how-to-build-a-command-line-tool-with-node-js/
- License: License: Not explicitly specified
- Crawl Date: 2025-05-01T04:48:14.595Z
- Data Size: 0 bytes
- Links Found: 0

## Retrieved
2025-05-01
