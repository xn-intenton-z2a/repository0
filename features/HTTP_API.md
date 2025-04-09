# HTTP_API

## Overview
This feature adds a lightweight HTTP server to the repository that exposes key CLI functionalities as endpoints. In addition to endpoints for version, diagnostics, and help, this update introduces a new `/health` endpoint to report the overall health status of the application. This improvement provides automated systems (and developers) with a concise status summary of core services such as configuration, logging, and CLI processing, in alignment with the repository’s mission of promoting healthy, actionable diagnostics and robust CI/CD workflows.

## Implementation Details
- **Server Initialization:**
  - Utilize Node.js's built-in HTTP module to create a server that listens on a configurable port (defaulting to 3000).
  - The server is initialized from the main CLI entry point (`src/lib/main.js`) when the `--serve` flag is present.

- **Endpoints:**
  - `/`: Returns a welcome message with a brief overview of available endpoints.
  - `/diagnostics`: Outputs extended diagnostics information (similar to the `--diagnostics` CLI flag) in JSON format.
  - `/version`: Reads and returns the application version from `package.json` in both plain text and JSON formats.
  - `/help`: Provides help content that mirrors the `--help` CLI flag output.
  - **New `/health` Endpoint:**
    - Returns a JSON object indicating the operational status of core services (e.g. configuration management, logging, and CLI readiness).
    - Checks may include basic file access for configuration files, the status of dynamic configuration reloading, and whether essential modules are initialized.

- **Integration:**
  - The HTTP API module (e.g. `src/lib/httpApi.js`) is designed to be self-contained and only activated when explicit HTTP service is requested.
  - Ensure graceful error handling for unsupported routes, returning a standard 404 message in JSON format.

## Testing
- **Unit Tests:**
  - Create tests (e.g. in `tests/unit/httpApi.test.js`) to verify that each endpoint responds with the expected HTTP status and data formats.
  - Tests should simulate HTTP requests to `/`, `/diagnostics`, `/version`, `/help`, and `/health` and check JSON schema where applicable.
- **Edge Cases:**
  - Validate the server’s behavior when an endpoint is not found; it should return a clear JSON error message with a 404 status.
  - Ensure that enabling the HTTP server via the CLI (`--serve`) does not interfere with normal CLI operations.

## Documentation
- **README Update:**
  - Add a new section describing the HTTP API features, particularly highlighting the new `/health` endpoint.
  - Provide usage examples to start the application with HTTP server enabled:
    ```bash
    node src/lib/main.js --serve
    curl http://localhost:3000/health
    ```
- **Contributing Guidelines:**
  - Update CONTRIBUTING.md to include instructions for testing HTTP endpoints and extending the API.

This updated HTTP_API feature enhances the repository by providing both CLI and HTTP interfaces in a single, self-contained module, further reinforcing the repository's commitment to robust, automated diagnostics and seamless CI/CD integration.