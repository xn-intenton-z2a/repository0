# Enhanced CLI Interface

Expand the basic CLI tool with advanced features for calculating Hamming distances from command line.

## Requirements

Enhance existing CLI functionality in main.js with advanced command-line features:

- Accept string or integer comparison via command line arguments  
- Support batch processing from files or stdin
- Provide comprehensive help documentation and usage examples
- Handle various input formats and delimiters
- Output results in multiple formats (text, JSON, CSV)

## Acceptance Criteria

- node src/lib/main.js --string "abc" "def" outputs distance calculation
- node src/lib/main.js --bits 7 4 outputs bit distance calculation
- Support --help flag with comprehensive usage documentation
- Process multiple comparisons from file input with --file option
- Exit with proper codes for success/failure scenarios
- JSON output format option with --json flag for integration
- Pipe-friendly for use in shell scripts and automation

## CLI Features

- Positional arguments for quick single comparisons
- Named flags for clarity and advanced options  
- Batch mode for processing multiple pairs from files
- Quiet mode for scripts that only need numerical results
- Verbose mode with detailed output including timing information
- Input validation with helpful and clear error messages
- Support for different output formats and delimiters

## Implementation Notes

- Expand existing CLI detection and argument parsing
- Add comprehensive argument validation and help text
- Support both positional and flag-based argument patterns
- Handle process.stdin for pipeline usage scenarios
- Implement proper exit codes for automation compatibility
- Add timing and performance information in verbose mode