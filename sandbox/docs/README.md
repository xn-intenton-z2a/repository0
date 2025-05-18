# CLI Demo of Agentic Workflows

A simple CLI demonstration of agentic workflows integrated with GitHub Actions. This tool provides basic commands to showcase **help**, **mission**, **version**, **echo**, and **render** functionality.

## Links

- [Mission Statement](../../MISSION.md)
- [Contributing Guidelines](../../CONTRIBUTING.md)
- [License](../../LICENSE.md)
- [intentïon agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib)

## Commands

- `--help`  
  : Displays usage instructions and a summary of available commands.

- `--mission`  
  : Reads and prints the mission statement from `MISSION.md`.

- `--version`  
  : Reads and prints the version from `package.json`.

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

# Display current version
npm run start -- --version

# Echo a message
npm run start -- echo hello world

# Render an EJS template with JSON data
npm run start -- --render sandbox/tests/fixtures/template.ejs sandbox/tests/fixtures/data.json

# Render an EJS template with YAML data
npm run start -- --render sandbox/tests/fixtures/template.ejs sandbox/tests/fixtures/data.yaml
```

### Expected Output

```bash
Hello Alice! You have 3 items.
```

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone <repository_url>
   cd repository0
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run tests**:
   ```bash
   npm test
   ```
4. **Run the CLI**:
   ```bash
   npm run start -- --help
   ```
