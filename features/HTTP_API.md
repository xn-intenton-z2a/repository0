# HTTP_API

## Overview
This feature adds a lightweight HTTP server to the repository that exposes key CLI functionalities as endpoints. In addition to endpoints for version, diagnostics, help, and health, this update introduces a new `/config` endpoint. The `/config` endpoint allows developers and automated systems to retrieve current configuration values (loaded via the CONFIG module) while masking sensitive information. This enhancement further supports the repository’s mission of delivering robust, actionable diagnostics and streamlined CI/CD integration.

## Implementation Details
- **Server Initialization:**
  - Utilize Node.js's built-in HTTP module to create a server that listens on a configurable port (defaulting to 3000).
  - The server is initialized from the main CLI entry point (`src/lib/main.js`) when the `--serve` flag is present.

- **Endpoints:**
  - `/`: Returns a welcome message with a brief overview of available endpoints.
  - `/diagnostics`: Outputs extended diagnostics information (similar to the `--diagnostics` CLI flag) in JSON format.
  - `/version`: Reads and returns the application version from `package.json` in both plain text and JSON formats.
  - `/help`: Provides help content that mirrors the `--help` CLI flag output.
  - `/health`: Returns a JSON object indicating the operational status of core services (e.g. configuration management, logging, CLI readiness). It checks file access, dynamic configuration reloading, and module initialization.
  
  - **New `/config` Endpoint:**
    - **Purpose:** Retrieve current configuration settings as loaded by the CONFIG module. This helps verify environment setup and diagnose configuration-related issues.
    - **Behavior:**
      - Returns a JSON object containing non-sensitive configuration keys and values.
      - Sensitive keys (e.g. API secrets) are masked or omitted to ensure security.
      - Responds with appropriate HTTP status codes for errors (e.g., missing configuration or issues in loading).

- **Integration:**
  - The HTTP API module (e.g. `src/lib/httpApi.js`) remains self-contained, with the new `/config` endpoint integrated alongside existing endpoints.
  - Robust error handling ensures that unsupported routes return a standard 404 message in JSON format.

## Testing
- **Unit Tests:**
  - Create tests (e.g. in `tests/unit/httpApi.test.js`) to verify each endpoint responds with the expected HTTP status and data format.
  - Simulate HTTP requests to `/`, `/diagnostics`, `/version`, `/help`, `/health`, and the new `/config` endpoint.
  - Validate that the `/config` endpoint correctly masks sensitive configuration values and returns a valid JSON object.

- **Edge Cases:**
  - Test behavior when an endpoint is not found; the server should return a clear JSON error message with a 404 status.
  - Verify that enabling the HTTP server via the CLI (`--serve`) does not interfere with normal CLI operations.

## Documentation
- **README Update:**
  - Add a new section describing the HTTP API features, highlighting the new `/config` endpoint.
  - Provide usage examples to start the application with the HTTP server enabled:
    ```bash
    node src/lib/main.js --serve
    curl http://localhost:3000/config
    ```

- **Contributing Guidelines:**
  - Update CONTRIBUTING.md to include instructions for testing HTTP endpoints and extending the API with configuration retrieval.

## Benefits
- **Enhanced Diagnostics:** Allows both developers and CI/CD systems to verify current configuration settings dynamically, improving troubleshooting and system validation.
- **Security:** Sensitive configuration values are masked to protect critical environment details while still providing useful diagnostics.
- **Improved Transparency:** Directly supports the repository’s mission by exposing live configuration data as part of the overall service health overview.
