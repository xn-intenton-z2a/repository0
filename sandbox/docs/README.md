# CLI Demo of Agentic Workflows

A simple CLI demonstration of agentic workflows integrated with GitHub Actions. This tool provides basic commands to showcase **help**, **mission**, **version**, **features**, **echo**, and **render** functionality.

## Links

- [Mission Statement](../../MISSION.md)
- [Contributing Guidelines](../../CONTRIBUTING.md)
- [License](../../LICENSE.md)
- [intentïon agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib)

## Commands

- `--help`  
  : Displays usage instructions and a summary of available commands.

- `-m, --mission`  
  : Reads and prints the mission statement from `MISSION.md` (alias -m).

- `--version`  
  : Reads and prints the version from `package.json`.

- `-f, --features`  
  : Prints the mission statement from `MISSION.md` then lists available features by reading markdown files in `sandbox/features/` and printing a JSON array of objects containing `title` and `description` for each feature.

- `--render <templatePath> <dataPath>`  
  : Renders the specified EJS template with data provided in a JSON or YAML file and prints the result to stdout.

- `echo` _<message>..._  
  : Prints any additional arguments passed after the `echo` command.

## Usage Examples

```bash
# Display help text
npm run start -- --help

# Display mission statement
npm run start -- --mission

# Display mission statement using alias
npm run start -- -m

# Display current version
npm run start -- --version

# List features
npm run start -- --features
# List features using alias
npm run start -- -f
```

### Expected Output for Features

First, the mission statement:

```
<Contents of MISSION.md>
```

Then, the list of features:

```json
[
  {
    "title": "CLI Tool Enhancements",
    "description": "Brief description of CLI enhancements."
  },
  {
    "title": "Schema Validation",
    "description": "Short description of schema validation feature."
  }
]
```