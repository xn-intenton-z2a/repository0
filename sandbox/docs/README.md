# CLI Demo of Agentic Workflows

A simple CLI demonstration of agentic workflows integrated with GitHub Actions. This tool provides basic commands to showcase **help**, **mission**, **version**, and **echo** functionality.

## Links

- [Mission Statement](../../MISSION.md)
- [Contributing Guidelines](../../CONTRIBUTING.md)
- [License](../../LICENSE.md)
- [intentïon agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib)

## Commands

The CLI supports the following commands:

- `--help`
  : Displays usage instructions and a summary of available commands.

- `--mission`
  : Reads and prints the mission statement from `MISSION.md`.

- `--version`
  : Reads and prints the version from `package.json`.

- `echo` _<message>..._
  : Prints any additional arguments passed after the `echo` command.

### Usage Examples

```bash
# Display help text
npm run start -- --help

# Display mission statement
npm run start -- --mission

# Display current version
npm run start -- --version

# Echo a message
npm run start -- echo hello world
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