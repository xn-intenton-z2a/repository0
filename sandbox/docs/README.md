# CLI Demo of Agentic Workflows

A simple CLI demonstration of agentic workflows integrated with GitHub Actions. This tool provides commands to showcase **help**, **mission**, **version**, **features**, **render**, **echo**, **env**, and **yaml2json** functionality.

## Links

- [Mission Statement](../../MISSION.md)
- [Contributing Guidelines](../../CONTRIBUTING.md)
- [License](../../LICENSE.md)
- [intentïon agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib)

## Commands

Usage: main.js [--help] [-m|--mission] [--version] [-f|--features <tag>...] [--render <template> <data>] [--env <VAR_NAME>] [--yaml2json <yamlPath>] [--output <file>] [echo <message>...]

Commands:
  --help                      Display usage instructions
  -m, --mission               Print mission statement
  --version                   Print version
  -f, --features [<tag>...]   List available features, optionally filtered by mission tags
  --render <template> <data>  Render EJS template with data (JSON or YAML)
  --yaml2json <yamlPath>      Convert YAML file to JSON printed to stdout
  -y <yamlPath>               Alias for --yaml2json
  --output <file>             Write JSON output to the specified file
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

npm run start -- --env VAR_NAME
# Prints the value of VAR_NAME loaded from .env

npm run start -- --yaml2json path/to/data.yaml
# Converts YAML to JSON and prints to stdout

npm run start -- --yaml2json path/to/data.yaml --output output.json
# Converts YAML to JSON and writes to output.json

npm run start -- echo Hello World
# Prints "Hello World"
```