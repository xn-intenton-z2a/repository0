# NETWORK

## Overview
This feature introduces a new CLI command flag `--network` that enables users to perform simple HTTP(S) health checks and diagnostics directly from the command line. The command makes GET requests to a provided URL and returns key metadata such as response status code, response time, and content length (if available). This addition reinforces the repository’s mission of providing streamlined automation and diagnostic utilities in a modular, single-source file tool.

## CLI Integration
- **Command Flag:** Introduce the global flag `--network` to activate the network diagnostics mode.
- **Parameters:** The command accepts a URL as a required parameter and an optional timeout value (in seconds). Example usage:
  - `node src/lib/main.js --network "https://example.com"`
  - `node src/lib/main.js --network "https://example.com" 5`
- **Output Modes:** In non-JSON mode, the results are printed in a human-readable format. In JSON mode (if global flag `--json` or `--json-pretty` is active), the output includes structured metadata (status code, response time, content length, and timestamp).

## Implementation Details
- **HTTP Request:** Use Node’s built-in `http` and `https` modules to perform the GET request. Detect the protocol from the URL and select the appropriate module.
- **Response Metrics:** Measure the time taken from request initiation until the response is fully received. Capture the HTTP status code and, if provided, the `content-length` header.
- **Timeout Handling:** Support an optional timeout value. If the response does not complete within the specified timeout, display an appropriate error message.

## Error Handling & Validation
- **Input Validation:** Validate that the provided URL is in a proper format. If the URL is invalid, return a clear error message.
- **Network Errors:** Handle potential network issues such as connectivity problems or timeouts gracefully. Provide appropriate error messages and fallback behavior.

## Testing & Documentation
- **Unit Tests:** Develop tests to simulate valid and invalid URL inputs, responses with various status codes, and scenarios involving timeouts. Tests should verify both plain text and JSON outputs.
- **Documentation:** Update the README and CLI usage instructions to include examples of the new network diagnostics feature. Inline comments in the source file should detail how the HTTP/HTTPS request is managed and how response metadata is processed.

## Alignment with Repository Mission
The NETWORK feature reinforces the repository’s commitment to modular, single-file CLI utilities that empower users to perform essential diagnostics and automation tasks. By enabling quick HTTP health checks, this feature enhances the utility’s role in monitoring and automating system workflows.