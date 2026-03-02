# HTTP_SERVER ✅

## Overview

Add HTTP server capabilities to the CLI tool, enabling it to serve agentic workflow status and control endpoints via a REST API. This feature allows integration with web applications, monitoring systems, and remote workflow management.

**Status: ✅ IMPLEMENTED**

## Acceptance Criteria

### ✅ Server Configuration
- ✅ Add --serve flag that starts an HTTP server on a configurable port (default 3000)
- ✅ Support --port option to specify custom port number
- ✅ Provide --host option to bind to specific network interface (default localhost)
- ✅ Proper validation of port ranges and host addresses

### ✅ REST API Endpoints
- ✅ `GET /health` - Health check endpoint returning server status
- ✅ `GET /status` - Get current workflow status and uptime information  
- ✅ `GET /workflows` - List active workflows with details
- ✅ `POST /workflows` - Create new workflow via API
- ✅ `POST /messages` - Send communication message through agentic system

### ✅ HTTP Features
- ✅ CORS support for cross-origin requests
- ✅ JSON request/response handling
- ✅ Proper HTTP status codes (200, 201, 404, 500)
- ✅ Error handling with JSON error responses
- ✅ Content-Type headers set appropriately

### ✅ Integration with CLI
- ✅ Server mode integrates seamlessly with existing CLI commands
- ✅ Same agentic library instance used for both CLI and API operations
- ✅ Verbose logging option works in server mode
- ✅ Graceful startup and status reporting

## Implementation Details

### Server Implementation
- **Technology**: Node.js built-in `http` module  
- **Port Binding**: Configurable port with validation (1-65535)
- **Host Binding**: Configurable host interface
- **Async Handling**: Full Promise-based request handling

### API Design
All endpoints return JSON responses with consistent structure:

```json
{
  "status": "success|error", 
  "data": {},
  "timestamp": "ISO8601",
  "error": "message" // only on errors
}
```

### Error Handling
- ✅ Try/catch blocks around all request handlers
- ✅ 500 status codes for server errors  
- ✅ 404 status codes for unknown endpoints
- ✅ JSON error response format
- ✅ Optional verbose error logging

### Request Body Parsing
- ✅ JSON body parsing for POST requests
- ✅ Proper Content-Type validation
- ✅ Error handling for malformed JSON
- ✅ Request timeout handling

## API Endpoints Reference

### GET /health
Returns server health status:
```json
{
  "status": "healthy",
  "timestamp": "2026-03-02T03:28:00.000Z"
}
```

### GET /status  
Returns workflow system status:
```json
{
  "status": "running",
  "activeWorkflows": 2,
  "uptime": 3600.5,
  "timestamp": "2026-03-02T03:28:00.000Z"
}
```

### GET /workflows
Returns list of active workflows:
```json
{
  "workflows": [
    {
      "id": "wf_123",
      "type": "fix-code", 
      "status": "running",
      "createdAt": "2026-03-02T03:25:00.000Z",
      "lastUpdate": "2026-03-02T03:27:30.000Z"
    }
  ]
}
```

### POST /workflows
Create new workflow:
```bash
curl -X POST http://localhost:3000/workflows \
  -H "Content-Type: application/json" \
  -d '{"type": "fix-code", "description": "Fix linting issues"}'
```

### POST /messages
Send communication message:
```bash
curl -X POST http://localhost:3000/messages \
  -H "Content-Type: application/json" \
  -d '{"message": "Status update", "channel": "default"}'
```

## Usage Examples

### Start Server
```bash
# Start on default port 3000
npx @xn-intenton-z2a/repo --serve

# Start on custom port and host
npx @xn-intenton-z2a/repo --serve --port 8080 --host 0.0.0.0

# Start with verbose logging
npx @xn-intenton-z2a/repo --serve --verbose
```

### API Integration
```javascript
// Check server health
const health = await fetch('http://localhost:3000/health').then(r => r.json());

// Get workflow status
const status = await fetch('http://localhost:3000/status').then(r => r.json());

// Create new workflow
const workflow = await fetch('http://localhost:3000/workflows', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ type: 'fix-code' })
}).then(r => r.json());
```

## Integration with CLI_CORE

This feature extends the CLI_CORE functionality by:
- Using the same argument parsing system for server options
- Sharing the same AgenticLib instance for consistency  
- Providing API access to all CLI command functionality
- Maintaining the same error handling patternsork interface
- Server starts without blocking the terminal and logs startup information

### API Endpoints
- GET /status returns current workflow status and system health in JSON format
- GET /workflows lists all active agentic workflows with metadata
- POST /workflows creates new workflows with JSON configuration payload
- POST /messages sends messages through agentic communication channels
- GET /health provides basic health check endpoint for monitoring

### Request Handling
- Accept and return JSON for all data endpoints
- Implement proper HTTP status codes for different response types
- Handle malformed requests with appropriate error responses
- Support CORS headers for browser-based client integration

### Server Lifecycle
- Graceful shutdown on SIGINT and SIGTERM signals
- Cleanup active connections and resources on shutdown
- Log all incoming requests and responses for debugging
- Handle server errors without crashing the entire process

### Integration Requirements
- Use existing AgenticLib functionality for all workflow operations
- Maintain consistency with CLI command behavior and responses
- Support both CLI and HTTP interfaces simultaneously when applicable
- Follow established communication protocol for message handling

## Implementation Notes

The HTTP server exposes agentic workflow capabilities through a REST API, enabling remote management and integration with external systems. This transforms the CLI tool into a more versatile service that can be embedded in larger automation pipelines.

The server should be lightweight and focused on core agentic operations rather than becoming a full web application framework. All endpoints should map cleanly to existing CLI commands and AgenticLib methods.