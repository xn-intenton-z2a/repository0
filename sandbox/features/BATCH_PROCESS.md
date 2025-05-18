# Batch Processing

## CLI Behavior

Introduce a new top-level command batch to apply an existing CLI subcommand to multiple files matching a glob pattern in a single invocation.  

Usage:

npm run start -- batch <subcommand> <globPattern> [--output-dir <directory>] [--dry-run]

- <subcommand>: Any valid CLI command implemented by sandbox/source/main.js.  
- <globPattern>: Glob pattern to select input files (for example *.md or data/*.csv).  
- --output-dir <directory>: When provided, writes each invocation’s output to a file under the specified directory, using the same base name as the input and an appropriate extension.  
- --dry-run: Print the list of commands that would run without executing them.  

Behavior:

Locate all files in the current working directory and its subdirectories that match the glob pattern.  
For each file, construct a child process invocation: node sandbox/source/main.js <subcommand> <file> plus any flags for output redirection.  
If output-dir is provided, ensure the directory exists, and write each result to a separate file.  
If dry-run is specified, do not execute commands but list them in order.  

## Implementation

- sandbox/source/main.js:
  - Add import of glob from the glob package and child_process from node.  
  - In the main switch, add a case batch that calls async function doBatchCommand(argv).  
  - Implement doBatchCommand(argv):
    - Validate presence of argv._[1] and argv._[2]; exit with code 1 and show usage if missing.  
    - Use glob.sync to resolve the pattern to a sorted list of file paths.  
    - If no files match, print a message and exit with code 1.  
    - If argv.dryRun is true, print each command string and exit with code 0.  
    - Otherwise, for each file:
      - If --output-dir is provided, compute an output file path in that directory with the same base name and appropriate extension.  
      - Spawn a synchronous child process to run node sandbox/source/main.js <subcommand> <file> [--output <outFile>] inheriting stdio or capturing output.  
      - If any invocation exits with a nonzero code, collect the error and at the end exit with code 1.  
    - On success of all invocations, exit with code 0.  

- package.json:
  - Add glob as a dependency.

## Testing

Add sandbox/tests/batch.test.js to cover the following scenarios:

- Successful batch run in dry-run mode: Create sample text files, run batch echo pattern --dry-run, and assert that printed commands match expected invocations without executing.  
- Batch processing to stdout: Create three .txt files, run batch echo *.txt and assert combined stdout contains each file name.  
- Batch processing with output-dir: Create markdown files, run batch markdown *.md --output-dir out, verify out directory contains .html files with expected rendered content.  
- Error handling for missing arguments: Run batch with no subcommand or pattern and assert exit code 1 and usage message.  
- Error when no files match pattern: Run batch with a pattern that matches nothing and assert exit code 1 and informative message.

## Documentation

- README.md and sandbox/docs/CLI_USAGE.md:
  - Add an entry for the batch command under Commands Reference with usage, flags, and examples demonstrating dry-run, stdout batch output, and output-dir usage.