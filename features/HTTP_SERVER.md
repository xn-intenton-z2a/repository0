# HTTP Server

Implement HTTP server functionality with RESTful endpoints to expose library capabilities over HTTP when running in server mode.

## Overview

Add HTTP server capabilities to the main library, allowing it to function as a web service. This enables remote access to library functionality and integration with web applications or other services that need HTTP-based access.

## Acceptance Criteria

- Support --serve flag to start HTTP server mode
- Implement basic REST endpoints for core library functionality
- Provide health check endpoint for monitoring and load balancing
- Support configurable port with sensible default (e.g., 3000)
- Include proper HTTP status codes and JSON response formatting
- Implement graceful shutdown handling for server termination
- Provide endpoint documentation and basic API reference
- Include integration tests for HTTP functionality

## Implementation Notes  

Use Node.js built-in http module to minimize dependencies. Server should be production-ready with proper error handling, logging, and performance considerations. Consider using lightweight frameworks only if built-in capabilities are insufficient.

## Success Metrics

- HTTP server starts successfully and responds to requests
- All endpoints return appropriate responses and status codes
- Server handles errors gracefully without crashing
- Performance is acceptable for typical usage scenarios
- Documentation clearly explains API usage