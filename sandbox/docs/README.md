# CLI Demo of Agentic Workflows

A simple CLI demonstration of agentic workflows integrated with GitHub Actions. This tool provides commands to showcase **help**, **mission**, **version**, **features**, **render**, **echo**, and **env** functionality.

## Links

- [Mission Statement](../../MISSION.md)
- [Contributing Guidelines](../../CONTRIBUTING.md)
- [License](../../LICENSE.md)
- [intentïon agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib)

## Commands

Usage: main.js [--help] [-m|--mission] [--version] [-f|--features] [--render <template> <data>] [--env <VAR_NAME>] [echo <message>...]

Commands:
  --help                      Display usage instructions
  -m, --mission               Print mission statement
  --version                   Print version
  -f, --features              List available features
  --render <template> <data>  Render EJS template with data (JSON or YAML)
  -e, --env <VAR_NAME>        Print a specific environment variable
  -e, --env                   Print all loaded environment variables as JSON
  echo <message>              Echo message

## Usage Examples

```bash
npm run start -- --help
# Displays help text

npm run start -- --mission
# Prints the mission statement

npm run start -- --version
# Prints the current version

npm run start -- --features
# Prints the mission statement then lists available features as JSON

npm run start -- --render path/to/template.ejs path/to/data.json
# Renders EJS template with JSON data and prints the result

npm run start -- --render path/to/template.ejs path/to/data.yaml
# Renders EJS template with YAML data and prints the result

npm run start -- echo Hello World
# Prints "Hello World"

npm run start -- --env VAR_NAME
# Prints the value of VAR_NAME loaded from .env

npm run start -- --env
# Prints all loaded environment variables as JSON
```