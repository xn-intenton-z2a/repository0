# Node.js Process and CLI Arguments

## Table of Contents

1. Process Object and Command Line Arguments
2. Argument Parsing Patterns
3. CLI Design Best Practices
4. Help System Implementation
5. Error Handling for CLI Tools

## Process Object and Command Line Arguments

### Process.argv Array

Node.js provides command line arguments via process.argv:
- process.argv[0] - Path to Node.js executable
- process.argv[1] - Path to JavaScript file being executed
- process.argv[2] and beyond - Actual command line arguments

### Basic Argument Access

const args = process.argv.slice(2);

Example for command: node script.js --file output.svg --expression "y=Math.sin(x)"
args[0] = '--file'
args[1] = 'output.svg'  
args[2] = '--expression'
args[3] = 'y=Math.sin(x)'

### Argument Parsing Implementation

Simple flag and value parsing:
function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].substring(2);
      const value = argv[i + 1];
      if (value && !value.startsWith('--')) {
        args[key] = value;
        i++; // Skip next item as it's been consumed as value
      } else {
        args[key] = true; // Boolean flag
      }
    }
  }
  return args;
}

## Argument Parsing Patterns

### Flag Detection

Check for boolean flags:
const hasHelp = process.argv.includes('--help') || process.argv.includes('-h');

### Value Extraction

Get value for specific flag:
function getArgValue(flag, defaultValue = null) {
  const index = process.argv.indexOf(flag);
  if (index !== -1 && index + 1 < process.argv.length) {
    return process.argv[index + 1];
  }
  return defaultValue;
}

### Required Argument Validation

function validateRequiredArgs(args, required) {
  const missing = required.filter(key => !(key in args));
  if (missing.length > 0) {
    console.error(`Missing required arguments: ${missing.join(', ')}`);
    process.exit(1);
  }
}

### Argument Parsing for Plotting CLI

function parsePlotArgs() {
  const args = parseArgs(process.argv.slice(2));
  
  // Handle help flag
  if (args.help) {
    printHelp();
    process.exit(0);
  }
  
  // Validate required arguments
  if (!args.file) {
    console.error('Error: --file argument is required');
    process.exit(1);
  }
  
  // Require either expression+range or csv
  if (!args.expression && !args.csv) {
    console.error('Error: Either --expression or --csv is required');
    process.exit(1);
  }
  
  if (args.expression && !args.range) {
    console.error('Error: --range is required when using --expression');
    process.exit(1);
  }
  
  return args;
}

## CLI Design Best Practices

### Help System Design

Comprehensive help output:
function printHelp() {
  console.log(`
Usage: node src/lib/main.js [options]

Options:
  --expression <expr>  Mathematical expression (e.g., "y=Math.sin(x)")
  --range <range>      Range in format start:step:end (e.g., "-3.14:0.01:3.14")  
  --csv <file>         CSV file with time,value columns
  --file <output>      Output file (.svg or .png)
  --help               Show this help message

Examples:
  node src/lib/main.js --expression "y=Math.sin(x)" --range "-3.14:0.01:3.14" --file output.svg
  node src/lib/main.js --csv data.csv --file output.png
`);
}

### Exit Codes

Standard exit codes:
- 0: Success
- 1: General error
- 2: Misuse of shell command

process.exit(0);  // Success
process.exit(1);  // Error

### Progress and Status Output

Use stderr for status messages, stdout for data:
console.error('Processing data...'); // Status to stderr
console.log('{"result": "data"}');   // Data to stdout

## Help System Implementation

### Auto-Generated Help

Generate help from argument definitions:
const argDefinitions = [
  { flag: 'expression', required: false, description: 'Mathematical expression', example: '"y=Math.sin(x)"' },
  { flag: 'range', required: false, description: 'Range in format start:step:end', example: '"-3.14:0.01:3.14"' },
  { flag: 'csv', required: false, description: 'CSV file with time,value columns', example: 'data.csv' },
  { flag: 'file', required: true, description: 'Output file (.svg or .png)', example: 'output.svg' }
];

function generateHelp(definitions) {
  console.log('Usage: node src/lib/main.js [options]\n');
  console.log('Options:');
  definitions.forEach(def => {
    const required = def.required ? ' (required)' : '';
    console.log(`  --${def.flag.padEnd(12)} ${def.description}${required}`);
    if (def.example) {
      console.log(`${' '.repeat(16)}Example: ${def.example}`);
    }
  });
}

### Context-Sensitive Help

Show relevant help based on partial input:
function showContextHelp(args) {
  if (args.expression && !args.range) {
    console.error('Hint: --expression requires --range parameter');
    console.error('Example: --range "-3.14:0.01:3.14"');
  }
}

## Error Handling for CLI Tools

### Input Validation

Validate file extensions:
function validateOutputFile(filename) {
  const ext = filename.toLowerCase().split('.').pop();
  if (!['svg', 'png'].includes(ext)) {
    console.error(`Error: Unsupported file format '.${ext}'. Use .svg or .png`);
    process.exit(1);
  }
}

### Graceful Error Messages

User-friendly error reporting:
function handleError(error, context) {
  console.error(`Error ${context}:`);
  
  if (error.code === 'ENOENT') {
    console.error(`File not found: ${error.path}`);
  } else if (error.code === 'EACCES') {
    console.error(`Permission denied: ${error.path}`);
  } else {
    console.error(error.message);
  }
  
  process.exit(1);
}

### Async Error Handling

Handle Promise rejections:
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Promise Rejection:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

## Reference Details

### Process Object Properties

process.argv: string[] - Command line arguments
process.exit(code?: number): never - Exit process with code
process.cwd(): string - Current working directory
process.env: ProcessEnv - Environment variables

### Standard Stream Access

process.stdout.write(data): boolean - Write to stdout
process.stderr.write(data): boolean - Write to stderr
process.stdin: ReadableStream - Standard input stream

### Exit Code Conventions

0 - Success
1 - General error  
2 - Misuse of shell command
126 - Command cannot execute
127 - Command not found
128+n - Fatal error signal n

### Argument Parsing Libraries (Alternative)

Popular npm packages for advanced CLI parsing:
- commander: Full-featured command line framework
- yargs: Modern CLI builder with help generation
- minimist: Lightweight argument parsing
- meow: CLI app helper

## Detailed Digest

Technical specifications for Node.js process object and command line argument handling extracted from Node.js documentation. The process global provides access to command line arguments via process.argv array. Essential for building CLI tools with argument parsing, help systems, and error handling. Standard patterns for flag parsing, validation, and user feedback. Content retrieved on 2026-03-19.

Attribution: Node.js Foundation
Data size: ~679KB HTML content