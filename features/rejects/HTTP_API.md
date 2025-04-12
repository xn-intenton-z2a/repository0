# HTTP_API

## Overview
This feature adds a lightweight HTTP server to the repository that exposes key CLI functionalities as endpoints. In addition to endpoints for version, diagnostics, help, health, and configuration, it now also integrates a new **/scheduler** endpoint for managing scheduled tasks and a new **/profile** endpoint for runtime performance diagnostics. These additions further support the repository’s mission by providing robust, actionable diagnostics, improved CI/CD integration, and enhanced operational insights—all within a single, maintainable module.

## Existing Endpoints
- **`/`**: Returns a welcome message with an overview of available endpoints.
- **`/diagnostics`**: Outputs extended diagnostics information (similar to the `--diagnostics` CLI flag) in JSON format.
- **`/version`**: Reads and returns the application version from `package.json` in both plain text and JSON formats.
- **`/help`**: Provides help content that mirrors the `--help` CLI flag output.
- **`/health`**: Returns a JSON object indicating the operational status of key services (e.g. configuration management, logging, CLI readiness).
- **`/config`**: Retrieves the current configuration settings, with sensitive keys masked for security.
- **`/scheduler`**: Lists scheduled tasks and their statuses, supporting optional query parameters for filtering and sorting.

## New /profile Endpoint
- **Purpose:** Provides real-time performance metrics and runtime diagnostics of the application.
- **Behavior:**
  - Measures execution time of recent commands, memory usage, and other performance-related data.
  - Returns the metrics as a JSON object to facilitate integration with monitoring tools or CI/CD pipelines.
  - Ensures that the profiling data is computed efficiently so as not to impact overall server performance.

## Implementation Details
- **Server Initialization:**
  - Utilizes Node.js’s built-in HTTP module to create a server that listens on a configurable port (defaulting to 3000).
  - The server is initialized from the main CLI entry point (`src/lib/main.js`) when the `--serve` flag is provided.

- **Endpoint Integration:**
  - All endpoint logic, including the new `/profile` endpoint, is encapsulated within a single module (e.g. `src/lib/httpApi.js`).
  - The `/profile` endpoint aggregates runtime data such as command execution timings and memory usage.
  - Robust error handling is implemented for unsupported routes, with standard 404 responses in JSON format.

## Testing
- **Unit Tests:**
  - Simulate HTTP requests to all endpoints, including `/scheduler` and the new `/profile` endpoint, verifying correct HTTP statuses and response formats.
  - Use mocks to replicate both successful and error conditions for performance metric collection.

- **Edge Cases:**
  - Verify that enabling the HTTP server does not interfere with other CLI operations.
  - Ensure graceful handling of scenarios where configuration or performance data is missing or malformed.

## Documentation
- **README Update:**
  - Add a section describing the HTTP API features, with usage examples for starting the server and accessing the new `/scheduler` and `/profile` endpoints.
  - Include instructions on using the `--serve` flag and details on the available endpoints.

## Benefits
- **Comprehensive Diagnostics:** Aggregates diagnostic and performance data, enhancing transparency and enabling proactive monitoring.
- **Operational Insights:** The `/profile` endpoint facilitates real-time monitoring of command execution performance, aiding CI/CD pipeline integrations.
- **Enhanced Flexibility:** Provides developers and automated systems with more granular control and visibility over runtime behavior, supporting efficient troubleshooting and system optimization.