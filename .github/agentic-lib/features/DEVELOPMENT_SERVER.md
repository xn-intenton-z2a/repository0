# Development Server

## Overview

Add HTTP server capabilities with a --serve flag that starts a lightweight development server. This extends the CLI toolkit to provide web-based functionality, making the library useful for rapid prototyping and development workflows.

## User Value

Developers can instantly spin up a local development server for testing, prototyping, or serving static content. This makes the library immediately valuable for web development tasks without requiring additional tools.

## Implementation Status

✅ **COMPLETED** - Full development server implemented with:

### Features Delivered
- **HTTP Server**: Built-in Node.js HTTP server
- **Static HTML Page**: Professional landing page at `/`
- **REST API Endpoints**: Status and info endpoints
- **CORS Support**: Cross-origin requests enabled for development
- **Configurable Options**: Port and host configuration
- **Professional UI**: Clean, responsive HTML interface

### Server Endpoints
| Endpoint | Method | Description | Response |
|----------|--------|-------------|----------|
| `/` | GET | Main HTML landing page | HTML page |
| `/api/status` | GET | Server health check | `{"status":"ok","version":"0.1.0","timestamp":"..."}` |
| `/api/info` | GET | Package information | Package details and endpoints |

### Configuration Options
- `--port <PORT>`: Server port (default: 3000)
- `--host <HOST>`: Host address (default: localhost) 
- `--serve`: Shorthand flag to start server

### Usage Examples
```bash
# Start on default port 3000
npx @xn-intenton-z2a/repo serve

# Start on custom port
npx @xn-intenton-z2a/repo serve --port 8080

# Start with custom host and port
npx @xn-intenton-z2a/repo serve --host 0.0.0.0 --port 3001

# Shorthand flag
npx @xn-intenton-z2a/repo --serve
```

### API Testing
```bash
curl http://localhost:3000/api/status
curl http://localhost:3000/api/info
```

## Technical Implementation

- Native Node.js HTTP server (no external dependencies)
- Modern HTML5 with responsive CSS
- JSON API responses with proper headers
- CORS headers for development use
- Graceful server startup with detailed logging
- Status indicators and auto-refresh functionality
- Comprehensive error handling
- Integration with CLI argument parsing system

## Development Benefits

- **Rapid Prototyping**: Instant server for testing ideas
- **API Development**: Built-in endpoints for development
- **Static Content**: Serve HTML/CSS/JS files
- **CORS Development**: Cross-origin testing support
- **Health Monitoring**: Built-in status endpointsoling setup.

## Acceptance Criteria

- Start HTTP server when --serve flag is provided
- Support custom port specification with --port flag (default: 3000)
- Serve static files from current working directory
- Provide basic API endpoints for health checks and diagnostics
- Display server startup information including URL and port
- Handle graceful shutdown on SIGINT and SIGTERM
- Include CORS headers for development convenience
- Show request logging in development mode
- Auto-open browser when --open flag is provided

## Implementation Notes

- Use Node.js built-in http module to avoid external dependencies
- Implement basic MIME type detection for static files
- Include basic security headers appropriate for development
- Support both IPv4 and IPv6 binding
- Handle port conflicts gracefully with clear error messages
- Provide JSON API endpoints at /api/status and /api/info

## Testing Requirements

- Unit tests for server creation and configuration
- Tests for static file serving functionality  
- Tests for API endpoint responses
- Tests for port handling and conflict resolution
- Integration tests for server lifecycle management
- Tests for graceful shutdown behavior