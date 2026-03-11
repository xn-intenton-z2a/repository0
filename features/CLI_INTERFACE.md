# Command Line Interface

CLI tool for calculating Hamming distances from command line with support for batch processing and various input formats.

## Requirements

Add CLI functionality to main.js that provides command-line access to Hamming distance functions:

- Accept string or integer comparison via command line arguments
- Support batch processing from files or stdin
- Provide help documentation and usage examples
- Handle various input formats and delimiters
- Output results in machine-readable formats

## Acceptance Criteria

- node src/lib/main.js --string "abc" "def" outputs distance
- node src/lib/main.js --bits 7 4 outputs bit distance
- Support --help flag with usage documentation
- Process multiple comparisons from file input
- Exit with proper codes for success/failure
- JSON output format option for integration
- Pipe-friendly for use in shell scripts

## CLI Features

- Positional arguments for quick comparisons
- Named flags for clarity and options
- Batch mode for processing multiple pairs
- Quiet mode for scripts that only need the result
- Verbose mode with detailed output and timing
- Input validation with helpful error messages

## Implementation Notes

- Check if module is run directly vs imported as library
- Use process.argv for argument parsing
- Support both positional and flag-based arguments
- Provide clear usage examples in help text
- Handle process.stdin for pipeline usage
- Exit with appropriate codes for automation