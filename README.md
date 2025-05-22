# `repository0`

The repository is intended as a template that includes:
* A Template Base: A starting point for new projects.
* A Running Experiment: An example implementation that demonstrates one way to use the template.
* Workflows from `agentic-lib` which reference reusable workflows.

## Overview
`repository0` is a demo repository that showcases the GitHub workflows imported from intentïon `agentic-lib`. Its primary purpose is to demonstrate these automated CI/CD workflows.

## CLI Usage

### Default mode
```bash
npm run start      # or node src/lib/main.js
```
Prints the received arguments. Example: `Run with: ["foo","bar"]`.

### Server mode
```bash
npm run serve      # or node src/lib/main.js --serve
npm run serve -- 3000  # or node src/lib/main.js --serve 3000
```
Starts an HTTP server on port 8080 (default) or `3000` when specified.
Responds to `GET /` with status 200 and body `Hello World!`.

### Diagnostics mode
```bash
npm run diagnostics  # or node src/lib/main.js --diagnostics
```
Prints a JSON object with keys: `version`, `uptime`, `memoryUsage` (with `rss`, `heapTotal`, `heapUsed`), `platform`, `arch`.
Exits with code 0.

### Mission mode
```bash
npm run mission      # or node src/lib/main.js --mission
```
Reads and prints the full contents of `MISSION.md`, including the `# repository0` heading.
Exits with code 0.

### Help
```bash
npm run start -- --help  # or node src/lib/main.js --help
```
Displays usage information and exits with code 0.

## Links to Detailed Docs

- [HTTP Server](docs/HTTP_SERVER.md)
- [Diagnostics Mode](docs/DIAGNOSTICS_MODE.md)
- [Mission Mode](docs/MISSION_MODE.md)
- [Info Modes](docs/INFO_MODES.md)
