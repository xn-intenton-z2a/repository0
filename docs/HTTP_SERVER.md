# HTTP Server

## Overview

Extend the existing CLI tool to launch a minimal HTTP server that responds with "Hello World!" when accessed at `/`.

## CLI Usage

- `npm run start`  
  Default mode: prints received arguments.

- `npm run serve`  
  Starts the server on the default port 8080.

- `node src/lib/main.js --serve`  
  Equivalent to `npm run serve`.

- `node src/lib/main.js --serve 3000`  
  Starts the server on port 3000.

## HTTP API

- GET `/`  
  Returns status 200 and body `Hello World!`.

- Other paths  
  Returns status 404.

## Graceful Shutdown

- Press `Ctrl+C` to stop the server and exit cleanly.
