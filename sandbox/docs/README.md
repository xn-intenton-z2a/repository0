# CLI Demo of Agentic Workflows

A simple CLI demonstration of agentic workflows integrated with GitHub Actions. This tool provides basic commands to showcase **help**, **mission**, **version**, **features**, **echo**, **render**, and **env** functionality.

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

- `-e, --env <VAR_NAME>`  
  : Prints the value of the specified environment variable loaded from `.env`. Exits with code 0 if defined, or prints an error and exits with code 1 if undefined.

- `-e, --env`  
  : Prints all loaded environment variables as a JSON object. Exits with code 0.

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

# Print value of API_KEY
npm run start -- --env API_KEY

# Alias -e works the same
npm run start -- -e API_KEY

# Print all loaded environment variables
npm run start -- --env
```