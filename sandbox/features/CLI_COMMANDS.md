# CLI Command Support

This document describes the core CLI commands available in this tool:

## Commands

### help
Displays usage instructions and a summary of available commands.

### mission
Reads and prints the mission statement to highlight the repository intent.

### version
Prints the current version from package.json.

### echo
Echoes any additional arguments passed after the echo command, demonstrating argument handling.

### features
Lists available feature documents (use --validate-mission to list those without mission references).

### mission-features
Prints the mission statement and then lists available features.

### csv-import
Imports a CSV file and outputs a JSON array.

### render
Renders an EJS template with optional JSON data to stdout or a file.

### replace / text-replace
Performs search-and-replace on a text file (literal or regex). Supports --all for global literal replacements and default global regex when no --flags are provided.

### convert
Converts between .env, JSON, and YAML formats (use --to-json, --to-env, or --to-yaml).

### validate
Validates JSON syntax and optionally validates against a JSON Schema.

### markdown
Converts a Markdown file to HTML.

### import-data
Imports structured data files into a SQLite database.