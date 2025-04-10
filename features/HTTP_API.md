# HTTP_API

## Overview
This feature adds a lightweight HTTP server to the repository that exposes key CLI functionalities as endpoints. In addition to endpoints for version, diagnostics, help, health, and configuration, this update introduces a new **/scheduler** endpoint. The new endpoint enables users and automated systems to retrieve and manage scheduled tasks, providing insights into task timing and status. This enhancement further supports the repository’s mission of delivering robust, actionable diagnostics and streamlined CI/CD integration, all within a single source file module.

## Implementation Details
- **Server Initialization:**
  - Utilize Node.js's built-in HTTP module to create a server that listens on a configurable port (defaulting to 3000).
  - The server is initialized from the main CLI entry point (`src/lib/main.js`) when the `--serve` flag is provided.

- **Endpoints:**
  - **`/`**: Returns a welcome message with a brief overview of available endpoints.
  - **`/diagnostics`**: Outputs extended diagnostics information (similar to the `--diagnostics` CLI flag) in JSON format.
  - **`/version`**: Reads and returns the application version from `package.json` in both plain text and JSON formats.
  - **`/help`**: Provides help content that mirrors the `--help` CLI flag output.
  - **`/health`**: Returns a JSON object indicating the operational status of core services (e.g. configuration management, logging, CLI readiness).
  - **`/config`**: Retrieves current configuration settings as loaded by the CONFIG module. Sensitive keys are masked to ensure security.
  
- **New `/scheduler` Endpoint:**
  - **Purpose:** Allows retrieval and management of scheduled tasks within the repository. This endpoint helps verify scheduled operations such as periodic test runs or maintenance tasks.
  - **Behavior:**
    - Returns a JSON object listing scheduled tasks and their statuses. For example, tasks can be defined via a configuration file or environment variable.
    - Supports optional query parameters to filter or sort tasks.
    - Provides appropriate HTTP status codes in case of configuration or execution errors.

- **Integration:**
  - All endpoint logic is encapsulated within a single module (e.g. `src/lib/httpApi.js`), maintaining consistency with other CLI functionalities.
  - Robust error handling ensures that unsupported routes return a standard 404 message in JSON format.

## Testing
- **Unit Tests:**
  - Write tests in the `tests/unit/httpApi.test.js` module to verify that each endpoint responds with the expected HTTP status and data format.
  - Simulate HTTP requests to all endpoints, including the new `/scheduler` endpoint, ensuring correct handling of both valid and erroneous scenarios.
- **Edge Cases:**
  - Ensure that enabling the HTTP server via the CLI (`--serve`) does not interfere with other CLI operations.
  - Test for appropriate responses when configuration or scheduled tasks data is missing or malformed.

## Documentation
- **README Update:**
  - Add a new section describing the HTTP API features, with emphasis on the newly added `/scheduler` endpoint.
  - Provide usage examples to start the application with the HTTP server enabled, e.g.:
    ```bash
    node src/lib/main.js --serve
    curl http://localhost:3000/scheduler
    ```
- **Contributing Guidelines:**
  - Update CONTRIBUTING.md to include instructions for testing HTTP endpoints and extending the API with scheduling capabilities.

## Benefits
- **Enhanced Diagnostics & Task Management:** The new `/scheduler` endpoint empowers developers to monitor and manage scheduled operations within the repository.
- **Security & Flexibility:** Continues to ensure that sensitive configuration details are masked, while offering valuable functionality to streamline CI/CD tasks.
- **Improved Transparency:** Provides live insights into both system health and the status of scheduled tasks, further aligning with the repository’s mission.
