# CLI Usage

The CLI tool (`src/lib/main.js`) supports several flags to drive its core operations. Invoke via:

node src/lib/main.js [options]

or using npm scripts:

npm run start -- [options]

---

## Flags and Behavior

• **--help**
  Show usage information and exit.

• **--diagnostics**
  Collect and display system diagnostics (node version, platform, working directory, selected environment variables) in JSON format, then exit.

• **--serve**
  Start a simple HTTP server (default port 3000 or `PORT` env). Endpoints:
  - `GET /health` → HTTP 200, `{ "status": "ok" }`
  - `GET /options` → HTTP 200, current CLI options JSON
  - Other paths → HTTP 404, `{ "error": "Not Found" }`

• **--build-intermediate**
  Perform a staged build by reading a source definition (`source.json` or `config.yml`), generating an intermediate manifest, and logging a summary `{ items, path }`.

• **--build-enhanced**
  Read the intermediate manifest, apply transformations (e.g., add timestamp), write enhanced output, and log a report `{ transformed, path }`.

• **--refresh**
  Reload and normalize configuration (`config.json` or `config.yml`), log the configuration object, and exit.

• **--merge-persist**
  Merge two data sources (`data1.json`, `data2.json`), write merged result to disk (`merged-data.json`), and log `{ path, size }`.

---

## Examples

Run diagnostics:
`npm run diagnostics`

Start the HTTP server:
`npm run serve`

Perform intermediate build:
`npm run build-intermediate`

Perform enhanced build:
`npm run build-enhanced`

Reload configuration:
`npm run refresh`

Merge and persist data:
`npm run merge-persist`

Display help:
`npm run start -- --help`