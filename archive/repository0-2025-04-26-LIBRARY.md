library/NODE_JS.md
# library/NODE_JS.md
# NODE_JS

## Crawl Summary
Node.js v23.11.0 documentation details an asynchronous event-driven runtime with complete API specifications. Key points include createServer method, HTTP server setup with listen, extensive module support (Buffer, Crypto, Clusters, etc.), installation guidelines distinguishing official and community methods, and release lifecycle information. The documentation includes concrete code examples and configuration details for managing version releases and troubleshooting server deployment.

## Normalised Extract
Table of Contents:
1. HTTP Server Setup
   - Use import { createServer } from 'node:http';
   - Method: createServer(callback(req: http.IncomingMessage, res: http.ServerResponse)) returns http.Server
   - Server listens on port and host using server.listen(port, hostname, callback)
   - Example provided for creating a simple server responding with 'Hello World!'
2. API Modules
   - Modules include: Assertion Testing, Async Hooks, Buffer, Crypto, File System, HTTP/HTTPS, Modules (CommonJS & ECMAScript), REPL, Timers
3. Installation and Release Management
   - Official methods download pre-built binaries from nodejs.org; community methods must support all non-EOL versions
   - Release strategy: current release for 6 months, transition to Active LTS for 30 months
4. Child Processes and Clustering
   - Use child_process.fork() for spawning new processes
   - Cluster module to share sockets among processes for load balancing
5. Best Practices and Troubleshooting
   - Use asynchronous programming to prevent blocking
   - Validate server binding via callback of listen method
   - Follow official Node.js documentation for error handling

Each topic contains actionable details with method signatures and configuration parameters for immediate implementation.

## Supplementary Details
HTTP Server Setup:
- Method: createServer(callback: (req: http.IncomingMessage, res: http.ServerResponse) => void): http.Server
- Callback example: sets response header with Content-Type 'text/plain' and sends a response using res.end().
- Listening: server.listen(3000, '127.0.0.1', callback) to bind server to specified IP and port.

API Modules:
- Comprehensive modules include Buffer, Crypto, File System, Diagnostics Channel, Async Hooks, etc.
- Each module exposes methods with detailed parameter lists and return types as specified in official docs.

Installation Options:
- Official: must download binaries bundled by Node.js; no building from source if pre-built version exists.
- Community: supports all active Node.js versions and multiple OS distributions (Windows: Windows 10/11, Linux: all major distros).

Release Specifications:
- Major releases are current for 6 months; even-numbered releases become Active LTS for 30 months.
- Detailed release schedule available on GitHub with precise version numbering and release codename labels.

Child Processes & Clustering:
- Use child_process.fork() to start separate processes; cluster module to balance load among cores.

Configuration Options:
- Version managers: nvm, official package managers; use provided installation scripts.
- Binaries available in various formats: tar.gz, tar.xz, MSI, 7z for different platforms.

Troubleshooting:
- Verify server status by logging message in listen callback.
- Check network binding and correct port usage.
- Use official Node.js installation if encountering library mismatches or outdated binaries.

## Reference Details
API Specifications:
1. HTTP Module:
   - createServer(callback: (req: http.IncomingMessage, res: http.ServerResponse) => void): http.Server
   - Server methods:
     - listen(port: number, hostname: string, callback?: () => void): http.Server
     - writeHead(statusCode: number, headers: { [header: string]: string }): void
     - end(data?: string): void

2. Child Processes:
   - child_process.fork(modulePath: string, args?: string[], options?: ChildProcessForkOptions): ChildProcess
   - Cluster: cluster.fork() to spawn worker processes; sharing of server ports for load balancing

SDK Example (CommonJS):
const http = require('node:http');
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

Configuration Options:
- Installation: Binaries available in formats (tar.gz, tar.xz, MSI, zip, 7z) for platforms AIX, ARM, Darwin, Linux, Windows.
- Versioning: Current vs LTS releases; method: node -v to verify installed version.

Best Practices:
- Use asynchronous callbacks in I/O to prevent blocking.
- Validate all server responses by checking HTTP status codes and response headers.
- Use official Node.js domains (nodejs.org, nodejs.dev) to download secure binaries.

Troubleshooting Procedures:
- Run with increased logging: node server.js; expect output 'Server running at http://127.0.0.1:3000/'
- Check for network errors if binding fails; use netstat to verify port usage.
- If using child processes, ensure proper inter-process communication channels are established.

Exceptions:
- Handle errors using try/catch in synchronous blocks and error event listeners in asynchronous contexts.

Return Types:
- createServer returns http.Server, listen returns the same server instance.

Detailed commands:
- To run a server: Save the code as server.js and execute: node server.js
- To verify installation: node -v, npm -v

This specification contains all essential parameters, method signatures with full argument definitions, and explicit code examples for immediate developer use.

## Information Dense Extract
Node.js v23.11.0; createServer(callback(req: IncomingMessage, res: ServerResponse)) -> http.Server; server.listen(port: number, hostname: string, callback: () => void); full API modules: Buffer, Crypto, FS, HTTP, HTTPS, Async Hooks; child_process.fork(modulePath, args, options); cluster.fork() for load balancing; installation via official binaries (tar.gz, MSI, zip, etc.); release cycle: 6-month current, then Active LTS for 30 months; best practices: non-blocking I/O, proper error handling, validate server binding; troubleshooting: use console logs, netstat, node -v; full code examples provided.

## Sanitised Extract
Table of Contents:
1. HTTP Server Setup
   - Use import { createServer } from 'node:http';
   - Method: createServer(callback(req: http.IncomingMessage, res: http.ServerResponse)) returns http.Server
   - Server listens on port and host using server.listen(port, hostname, callback)
   - Example provided for creating a simple server responding with 'Hello World!'
2. API Modules
   - Modules include: Assertion Testing, Async Hooks, Buffer, Crypto, File System, HTTP/HTTPS, Modules (CommonJS & ECMAScript), REPL, Timers
3. Installation and Release Management
   - Official methods download pre-built binaries from nodejs.org; community methods must support all non-EOL versions
   - Release strategy: current release for 6 months, transition to Active LTS for 30 months
4. Child Processes and Clustering
   - Use child_process.fork() for spawning new processes
   - Cluster module to share sockets among processes for load balancing
5. Best Practices and Troubleshooting
   - Use asynchronous programming to prevent blocking
   - Validate server binding via callback of listen method
   - Follow official Node.js documentation for error handling

Each topic contains actionable details with method signatures and configuration parameters for immediate implementation.

## Original Source
Node.js Official Documentation
https://nodejs.org/en/docs

## Digest of NODE_JS

# Node.js v23.11.0 Documentation

## Overview
Node.js is a cross-platform, open-source JavaScript runtime built on Chrome's V8 engine. It provides an asynchronous, event-driven architecture designed for scalable network applications.

## HTTP Server Example
The HTTP module provides the createServer method with the following signature:

createServer(callback: (req: http.IncomingMessage, res: http.ServerResponse) => void): http.Server

Example:

import { createServer } from 'node:http';

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World!\n');
});

server.listen(3000, '127.0.0.1', () => {
  console.log('Listening on 127.0.0.1:3000');
});

## API Modules and Capabilities
- HTTP, HTTP/2, HTTPS: Full support including streaming and low latency responses.
- Child Processes and Clusters: Use child_process.fork() and cluster module for multi-core support.
- Asynchronous I/O: Non-blocking system calls using callbacks and event-loop management.
- Various modules available include Buffer, Crypto, DNS, File system, Modules (CommonJS & ECMAScript), REPL, Timers, and more.

## Installation Methods and Releases
- Official Installation Methods: Download pre-built binaries from nodejs.org; do not build from source when binaries exist.
- Community Installation: Must support all current non-EOL versions; compatibility across Windows and Linux distributions.
- Release Strategy: Major versions have 6-month current status, then odd releases become unsupported and even releases transition to Active LTS with 30 month bug fixes.

## Code Repositories and Versioning
- Node.js v23.11.0 is the latest current release.
- The documentation includes how to view on a single page, as JSON, and instructions to edit on GitHub.

## Troubleshooting and Best Practices
- Always use official nodes: nodejs.org, nodejs.dev.
- Use provided CLI and version managers (nvm) for installation.
- Follow asynchronous best practices to avoid blocking calls in I/O operations.
- Use logging (console.log) and check network bindings (server.listen method callback) for server status.

Document retrieved: 2023-10-05
Attribution: Data Size 80185 bytes; 1230 links found; No errors.

## Attribution
- Source: Node.js Official Documentation
- URL: https://nodejs.org/en/docs
- License: License: MIT
- Crawl Date: 2025-04-25T20:28:00.972Z
- Data Size: 80185 bytes
- Links Found: 1230

## Retrieved
2025-04-25
library/HTTP_MODULE.md
# library/HTTP_MODULE.md
# HTTP_MODULE

## Crawl Summary
createServer([options], requestListener) returns an HTTP server. Options: allowHalfOpen=false, pauseOnConnect=false. requestListener receives IncomingMessage and ServerResponse. listen(port, hostname='0.0.0.0', backlog=511, callback) binds and listens. IncomingMessage exposes httpVersion, headers, method, url, socket. ServerResponse supports statusCode, setHeader, write, end.

## Normalised Extract
Table of Contents
1. createServer
2. server.listen
3. http.IncomingMessage
4. http.ServerResponse

1. createServer
Signature: http.createServer([options], requestListener) -> Server
Options:
  allowHalfOpen: boolean, default false
  pauseOnConnect: boolean, default false
requestListener(req, res):
  req: IncomingMessage
  res: ServerResponse
Returns: Server

2. server.listen
Signature: server.listen(port, hostname, backlog, callback)
Parameters:
  port: number
  hostname: string, default '0.0.0.0'
  backlog: number, default 511
  callback: () => void

3. http.IncomingMessage
Properties:
  httpVersion: string
  headers: { [key:string]: string | string[] }
  method: string
  url: string
  socket: net.Socket

4. http.ServerResponse
Properties:
  statusCode: number
Methods:
  setHeader(name:string, value:string | string[]): void
  write(chunk:Buffer|string, encoding?:string, callback?:() => void): void
  end(data?:Buffer|string, encoding?:string, callback?:() => void): void

## Supplementary Details
createServer implementation steps:
1. Import http: import { createServer } from 'node:http';
2. Call createServer with requestListener.
3. Configure requestListener to inspect req.method, req.url, req.headers.
4. Use res.statusCode = <code>; set headers via res.setHeader(); send body via res.end().
5. Call server.listen with port, hostname, backlog, optional callback.

Configuration options:
allowHalfOpen: when true, server allows sockets to remain open for reading after end.
pauseOnConnect: when true, socket is paused on connection until user resumes.

Error handling:
- 'error' event on server: server.on('error', (err) => {});
- request errors: req.on('error', (err) => {});

Security best practice:
- Validate incoming headers length (<8KB).
- Limit concurrent requests via server.maxConnections.


## Reference Details
API Specifications:

http.createServer(options?: {allowHalfOpen?:boolean; pauseOnConnect?:boolean}, requestListener: (req: http.IncomingMessage, res: http.ServerResponse) => void): http.Server

http.Server extends net.Server, events:
- 'request': (req: IncomingMessage, res: ServerResponse)
- 'connection': (socket: net.Socket)
- 'error': (err: Error)

http.Server.listen(port: number, hostname?: string, backlog?: number, callback?: () => void): http.Server

http.IncomingMessage properties:
- httpVersion: string
- httpVersionMajor: number
- httpVersionMinor: number
- headers: Record<string,string | string[]>
- rawHeaders: string[]
- url: string
- method: string
- socket: net.Socket

http.ServerResponse:
- statusCode: number (default 200)
- statusMessage: string (default 'OK')
Methods:
  setHeader(name: string, value: number | string | string[]): void
  getHeader(name: string): number | string | string[] | undefined
  removeHeader(name: string): void
  write(chunk: string|Buffer, encoding?: string, callback?: () => void): boolean
  end(data?: string|Buffer, encoding?: string, callback?: () => void): void

Full Code Example with Comments:

```js
import { createServer } from 'node:http';

function requestHandler(req, res) {
  // Set response code and header
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  // Log request method and URL
  console.log(`Received ${req.method} ${req.url}`);
  // Send JSON response
  const payload = { message: 'Hello World!' };
  res.end(JSON.stringify(payload));
}

const server = createServer({ allowHalfOpen: false }, requestHandler);

server.maxConnections = 1000;

server.on('error', (err) => {
  console.error('Server error:', err);
});

server.listen(3000, '127.0.0.1', 100, () => {
  console.log('Server listening on 127.0.0.1:3000');
});
```

Best Practices:
- Use JSON.parse on request body with limit checks.
- Set server.keepAliveTimeout = 5000;
- Use TLS for HTTPS.

Troubleshooting:

Check port occupancy:
$ lsof -i :3000
Expected: no process listening

Test server response:
$ curl -i http://127.0.0.1:3000/
Expected:
HTTP/1.1 200 OK
Content-Type: application/json

{"message":"Hello World!"}

Handle EADDRINUSE:
server.on('error', err => {
  if (err.code === 'EADDRINUSE') {
    console.error('Port in use, retrying in 1s');
    setTimeout(() => server.listen(3000), 1000);
  }
});

## Information Dense Extract
http.createServer([options:{allowHalfOpen:boolean= false,pauseOnConnect:boolean= false}], reqListener(req:IncomingMessage,res:ServerResponse))→Server; Server.listen(port:number,hostname:string='0.0.0.0',backlog:number=511,cb?:()→void)→Server; IncomingMessage:{httpVersion:string,httpVersionMajor:number,httpVersionMinor:number,headers:Record<string,string|string[]>,rawHeaders:string[],method:string,url:string,socket:net.Socket}; ServerResponse:{statusCode:number=200,statusMessage:string='OK';setHeader(name:string,value:string|number|string[]):void;getHeader(name:string):string|number|string[]|undefined;removeHeader(name:string):void;write(chunk:Buffer|string,encoding?:string,cb?:()→void):boolean;end(data?:Buffer|string,encoding?:string,cb?:()→void):void}; Config: allowHalfOpen=false,pauseOnConnect=false,maxConnections=1000,keepAliveTimeout=5000; Best: JSON response, header limits, TLS; Troubleshoot: lsof -i :port,curl -i,http errors EADDRINUSE retry.

## Sanitised Extract
Table of Contents
1. createServer
2. server.listen
3. http.IncomingMessage
4. http.ServerResponse

1. createServer
Signature: http.createServer([options], requestListener) -> Server
Options:
  allowHalfOpen: boolean, default false
  pauseOnConnect: boolean, default false
requestListener(req, res):
  req: IncomingMessage
  res: ServerResponse
Returns: Server

2. server.listen
Signature: server.listen(port, hostname, backlog, callback)
Parameters:
  port: number
  hostname: string, default '0.0.0.0'
  backlog: number, default 511
  callback: () => void

3. http.IncomingMessage
Properties:
  httpVersion: string
  headers: { [key:string]: string | string[] }
  method: string
  url: string
  socket: net.Socket

4. http.ServerResponse
Properties:
  statusCode: number
Methods:
  setHeader(name:string, value:string | string[]): void
  write(chunk:Buffer|string, encoding?:string, callback?:() => void): void
  end(data?:Buffer|string, encoding?:string, callback?:() => void): void

## Original Source
Node.js Official Documentation
https://nodejs.org/en/docs

## Digest of HTTP_MODULE

# HTTP Module

## http.createServer([options], requestListener)

Signature

```js
http.createServer([options], requestListener) -> http.Server
```

Parameters

- options (Object, optional)
  - allowHalfOpen (boolean): false
  - pauseOnConnect (boolean): false
- requestListener (Function)
  - req (http.IncomingMessage)
  - res (http.ServerResponse)

Returns

- server (http.Server)

## server.listen(port[, hostname][, backlog][, callback])

Signature

```js
server.listen(port, hostname, backlog, callback)
```

Parameters

- port (number)
- hostname (string, optional), default '0.0.0.0'
- backlog (number, optional), default 511
- callback (Function, optional)

## http.IncomingMessage

Properties

- httpVersion (string)
- headers (Object)
- method (string)
- url (string)

Methods

- socket (net.Socket)

## http.ServerResponse

Methods

- statusCode (number)
- setHeader(name, value)
- write(chunk[, encoding][, callback])
- end([data][, encoding][, callback])

# Code Example

```js
import { createServer } from 'node:http';
const server = createServer((req, res) => {
  res.writeHead(200, {'Content-Type':'text/plain'});
  res.end('Hello World!');
});
server.listen(3000,'127.0.0.1',() => console.log('Listening')); 
```


## Attribution
- Source: Node.js Official Documentation
- URL: https://nodejs.org/en/docs
- License: License: MIT
- Crawl Date: 2025-04-25T22:46:04.753Z
- Data Size: 358962 bytes
- Links Found: 3895

## Retrieved
2025-04-25
library/AGENTIC_LIB.md
# library/AGENTIC_LIB.md
# AGENTIC_LIB

## Crawl Summary
agenticHandler processes JSON payloads with property 'command' or 'commands' array, increments globalThis.callCount and reports executionTimeMS. CLI supports flags: --agentic, --dry-run, --version, --verbose, --diagnostics, --status, --digest, --simulate-error, --simulate-delay <ms>, --simulate-load <ms>, --apply-fix, --cli-utils. AWS integrations include createSQSEventFromDigest and digestLambdaHandler functions for SQS event simulation and error handling. Environment variables MAX_BATCH_COMMANDS and COMMAND_ALIASES control batch throttling and alias substitution respectively.

## Normalised Extract
Table of Contents:
1. Component Breakdown
   - Re‑usable Workflows: Located in .github/workflows, stable, GPL‑3 licensed with attribution.
   - Example Workflows: Located in examples, MIT licensed for demonstrative purposes.
   - The Evolving main.js: Located in src/lib/main.js, JavaScript module for re‑usable workflows, tracks command invocations via globalThis.callCount.
2. Agentic Library Functions
   - agenticHandler: Accepts JSON payloads (single 'command' or 'commands' array), processes each command sequentially, logs executionTimeMS for each, supports optional batch throttling via MAX_BATCH_COMMANDS.
3. CLI Options
   - --agentic: Processes command(s) as JSON payload; examples: node src/lib/main.js --agentic '{"command":"doSomething"}' or node src/lib/main.js --agentic '{"commands":["cmd1","cmd2"]}'
   - --dry-run: Executes without action
   - --version: Outputs version info and timestamp
   - --verbose: Enables detailed logging
   - --diagnostics: Provides diagnostic report including configuration and Node.js version
   - --status: Outputs runtime health summary
   - --digest: Initiates SQS event simulation and processing via digestLambdaHandler
   - --simulate-error: Triggers error simulation with immediate exit
   - --simulate-delay <ms>: Delays command execution
   - --simulate-load <ms>: Simulates CPU load
   - --apply-fix: Applies fix and logs success, stops execution
   - --cli-utils: Lists all CLI commands with descriptions
4. AWS Integrations and Logging
   - AWS Functions: createSQSEventFromDigest (formats digest to SQS event), digestLambdaHandler (processes SQS messages with fallback for missing messageId)
   - Logging: logInfo and logError functions to log operations and error stacks when verbose mode is enabled

## Supplementary Details
Exact Technical Specifications:
- agenticHandler(input: { command?: string, commands?: string[] }): Processes input JSON payload. For single command, expects a string; for batch, expects an array of strings. Increments globalThis.callCount and returns executionTimeMS for each successfully processed command.
- Environment Variable MAX_BATCH_COMMANDS: When set (e.g., MAX_BATCH_COMMANDS=10), if the number of commands in a batch exceeds this limit, agenticHandler returns an error (exact error message: "Batch command limit exceeded").
- Environment Variable COMMAND_ALIASES: Must be a JSON string (e.g., '{ "ls": "list", "rm": "remove" }') that maps short commands to actual commands; substitution occurs automatically before processing.
- CLI Commands:
   --agentic: Accepts payload with either "command" or "commands" key. 
   --dry-run: Simulates execution without performing actions.
   --version: Reads version from package.json and appends a timestamp in ISO format.
   --verbose: Activates logging at debug level.
   --diagnostics: Reports current configuration variables, Node.js version (e.g., v14.17.0), and environment variables.
   --status: Returns JSON with keys: configuration, Node.js version, globalThis.callCount, uptime (in seconds), select environment variables.
   --simulate-error: Immediately logs error message "Simulated error" and exits with status code 1.
   --simulate-delay <ms>: Uses setTimeout to delay processing for specified milliseconds.
   --simulate-load <ms>: Executes CPU-intensive loop for given milliseconds to simulate heavy processing.
   --apply-fix: Executes fix routine, logs "Applied fix successfully", then terminates further execution.
   --cli-utils: Displays a complete summary of available CLI commands and their brief usage.
- AWS Integrations:
   createSQSEventFromDigest(digest: string): Returns an object structured as a typical SQS message event. 
   digestLambdaHandler(event): Processes event, uses try-catch for JSON parsing, logs and accumulates failed records. Generates fallback messageId if missing (e.g., messageId = 'fallback-' + Date.now()).

## Reference Details
API Specifications and SDK Method Signatures:

Function: agenticHandler
Signature: function agenticHandler(payload: { command?: string, commands?: string[] }): { results: Array<{ executionTimeMS: number, command: string }>, globalCallCount: number }
Description: Processes a JSON payload containing a single command or an array of commands, updates globalThis.callCount for each valid command, and returns an aggregated response containing individual execution times.

CLI Commands (with exact usage examples):
--agentic: node src/lib/main.js --agentic '{"command": "doSomething"}'
Batch: node src/lib/main.js --agentic '{"commands": ["cmd1", "cmd2"]}'
--dry-run: node src/lib/main.js --dry-run
--version: node src/lib/main.js --version
--verbose: node src/lib/main.js --verbose
--diagnostics: node src/lib/main.js --diagnostics
--status: node src/lib/main.js --status
--digest: node src/lib/main.js --digest
--simulate-error: node src/lib/main.js --simulate-error
--simulate-delay: node src/lib/main.js --simulate-delay 500
--simulate-load: node src/lib/main.js --simulate-load 1000
--apply-fix: node src/lib/main.js --apply-fix
--cli-utils: node src/lib/main.js --cli-utils

Exact Environment Configurations:
MAX_BATCH_COMMANDS: (Type: number, Default: not set, Effect: Rejects batch if number of commands exceeds value)
COMMAND_ALIASES: (Type: JSON string, e.g., '{ "ls": "list", "rm": "remove" }', Effect: Substitutes command aliases before processing)

Detailed Troubleshooting Procedures:
1. For command rejections due to batch size: Check MAX_BATCH_COMMANDS environment variable; if batch exceeds limit, the error "Batch command limit exceeded" is returned.
2. For JSON payload parsing errors: Ensure the JSON string is properly formatted; error logs will include JSON parsing error details.
3. For simulated errors: Use --simulate-error to trigger error behavior and verify system error logging; expected output: log message "Simulated error" and exit code 1.
4. For performance issues: Use --simulate-delay and --simulate-load to test system response under latency and load conditions; verify executionTimeMS values in the response.

Best Practices:
- Always validate JSON payloads before invoking agenticHandler.
- Use the --dry-run flag during testing to avoid unintended state changes.
- Monitor globalThis.callCount to track agentic command invocations over time.
- Log detailed diagnostics (using --verbose or --diagnostics) when troubleshooting integration issues.
- Ensure correct configuration of environment variables (MAX_BATCH_COMMANDS and COMMAND_ALIASES) to avoid processing errors.

Code Comment Example:
// Example: Processing a single agentic command
// Input: { "command": "doSomething" }
// Expected: Increment globalThis.callCount and return executionTimeMS for the command
// Invocation: node src/lib/main.js --agentic '{"command": "doSomething"}'


## Information Dense Extract
agenticHandler(payload:{command?:string,commands?:string[]}): returns {results:[{executionTimeMS:number,command:string}],globalCallCount:number}; CLI: --agentic, --dry-run, --version, --verbose, --diagnostics, --status, --digest, --simulate-error, --simulate-delay <ms>, --simulate-load <ms>, --apply-fix, --cli-utils; ENV: MAX_BATCH_COMMANDS (number, rejects batch > limit), COMMAND_ALIASES (JSON mapping); AWS: createSQSEventFromDigest(digest:string) returns SQS event object, digestLambdaHandler(event) with fallback messageId; Troubleshooting: JSON parse errors, batch limit exceeded error ('Batch command limit exceeded'), simulated error returns exit code 1; Best Practices: validate JSON, use --dry-run, monitor globalThis.callCount, use --verbose/--diagnostics; CLI examples exactly as provided.

## Sanitised Extract
Table of Contents:
1. Component Breakdown
   - Reusable Workflows: Located in .github/workflows, stable, GPL3 licensed with attribution.
   - Example Workflows: Located in examples, MIT licensed for demonstrative purposes.
   - The Evolving main.js: Located in src/lib/main.js, JavaScript module for reusable workflows, tracks command invocations via globalThis.callCount.
2. Agentic Library Functions
   - agenticHandler: Accepts JSON payloads (single 'command' or 'commands' array), processes each command sequentially, logs executionTimeMS for each, supports optional batch throttling via MAX_BATCH_COMMANDS.
3. CLI Options
   - --agentic: Processes command(s) as JSON payload; examples: node src/lib/main.js --agentic '{'command':'doSomething'}' or node src/lib/main.js --agentic '{'commands':['cmd1','cmd2']}'
   - --dry-run: Executes without action
   - --version: Outputs version info and timestamp
   - --verbose: Enables detailed logging
   - --diagnostics: Provides diagnostic report including configuration and Node.js version
   - --status: Outputs runtime health summary
   - --digest: Initiates SQS event simulation and processing via digestLambdaHandler
   - --simulate-error: Triggers error simulation with immediate exit
   - --simulate-delay <ms>: Delays command execution
   - --simulate-load <ms>: Simulates CPU load
   - --apply-fix: Applies fix and logs success, stops execution
   - --cli-utils: Lists all CLI commands with descriptions
4. AWS Integrations and Logging
   - AWS Functions: createSQSEventFromDigest (formats digest to SQS event), digestLambdaHandler (processes SQS messages with fallback for missing messageId)
   - Logging: logInfo and logError functions to log operations and error stacks when verbose mode is enabled

## Original Source
Agentic-lib Reusable Workflows Documentation
https://github.com/xn-intenton-z2a/agentic-lib

## Digest of AGENTIC_LIB

# Agentic-lib Technical Documentation

This document was retrieved on 2023-10-05.

# Component Breakdown

1. Re‑usable Workflows (Core Functionality)
   - Location: .github/workflows/
   - Stable, well‑tested, integrated in CI/CD pipelines
   - Licensing: GPL‑3 with attribution

2. Example Workflows (Demonstrative Content)
   - Location: examples/
   - Used for learning and experimentation
   - Licensing: MIT

3. The Evolving main.js (JavaScript Implementation)
   - Location: src/lib/main.js
   - Implements re‑usable workflows as a JS module
   - Tracks successful agentic command invocations with globalThis.callCount
   - Supports batch processing, optional throttling via MAX_BATCH_COMMANDS environment variable

# Agentic Library Functions

- Primary Function: agenticHandler
  - Accepts a JSON payload with either a single property 'command' or an array of commands ('commands')
  - For each valid command, increments global invocation counter and logs executionTimeMS (in ms)
  - Batch processing: sequential execution; if command count exceeds value in MAX_BATCH_COMMANDS, returns an error

# CLI Invocation Examples

- Single command:
  node src/lib/main.js --agentic '{"command": "doSomething"}'

- Batch processing:
  node src/lib/main.js --agentic '{"commands": ["cmd1", "cmd2"]}'

- Dry run flag:
  node src/lib/main.js --dry-run

# Additional CLI Options

--version: Displays version info from package.json with timestamp in JSON

--verbose: Activates detailed logging for debugging

--diagnostics: Outputs diagnostic report including current configuration, Node.js version, and environment variables

--status: Outputs a runtime health summary (configuration, Node.js version, callCount, uptime, select env variables)

--digest: Processes a sample digest event using a simulated SQS event

--simulate-error: Logs a simulated error and exits with a non-zero status code

--simulate-delay <ms>: Delays execution by specified milliseconds

--simulate-load <ms>: Executes a CPU‑intensive loop to simulate processing load for given ms

--apply-fix: Applies automated fixes and logs a success message "Applied fix successfully" (execution stops immediately)

--cli-utils: Displays a summary of available CLI commands with short descriptions

# AWS Integrations

- SQS Integration:
  - Function createSQSEventFromDigest: Formats a digest into a mock AWS SQS event
  - Function digestLambdaHandler: Processes incoming SQS events, handles JSON parsing errors, and accumulates failed records. Generates fallback messageId when absent.

# Environment Variables & Configuration

- MAX_BATCH_COMMANDS: Limits maximum commands in a batch. If exceeded, returns error.

- COMMAND_ALIASES: JSON mapping for command alias substitution (e.g., { "ls": "list", "rm": "remove" })

# Logging

- Functions: logInfo and logError provide detailed logging with configuration details and error stacks (activated when verbose mode is enabled)

# Licensing and Attribution

- Licensed under GNU General Public License (GPL‑3) for core workflows and MIT for example workflows
- Any derived work must include: "This work is derived from https://github.com/xn-intenton-z2a/agentic-lib"


## Attribution
- Source: Agentic-lib Reusable Workflows Documentation
- URL: https://github.com/xn-intenton-z2a/agentic-lib
- License: License: Mixed (GPL and MIT as indicated within individual files)
- Crawl Date: 2025-04-25T04:02:34.679Z
- Data Size: 664104 bytes
- Links Found: 5178

## Retrieved
2025-04-25
library/ESLINT_EXTENSIONS.md
# library/ESLINT_EXTENSIONS.md
# ESLINT_EXTENSIONS

## Crawl Summary
Ways to extend ESLint include: Create Plugins with custom rules, custom formatters for output, custom parsers for AST generation, custom processors for file pre/post processing, and sharing configurations via npm packages. Technical specifications include context.report API in custom rules, parser interface (parse and parseForESLint), processor methods (preprocess and postprocess), and ESLint configuration file schema (env, parserOptions, plugins, rules). CLI commands such as 'eslint .' and 'eslint --fix .' are used to run and auto-fix issues.

## Normalised Extract
Table of Contents:
1. Ways to Extend ESLint
   - Use plugins, custom rules, formatters, parsers, processors, and shared configurations.
2. Create Plugins
   - Export an object with a 'rules' property.
   - Example: module.exports with rules: { 'rule-name': { meta: { type, docs, fixable, schema }, create(context) { return { Identifier(node) { if (node.name==='eval') { context.report({ node, message:'Avoid eval', fix(fixer){ return fixer.replaceText(node,'safeEval'); }}); } } }; } } } }
3. Custom Rule Tutorial
   - Define meta and create function.
   - Rule API: context.report({ node, message, data, fix }).
   - Testing with RuleTester from ESLint; instantiate RuleTester with parserOptions and invoke run method with valid and invalid cases.
4. Custom Rules
   - Function(context) returns listener map with exposed methods for AST nodes.
5. Custom Formatters
   - Function that takes results array and returns formatted string.
   - Iterates over result.filePath and result.messages to build output.
6. Custom Parsers
   - Must implement parse(text, options) and parseForESLint(text, options) to return AST and services.
7. Custom Processors
   - Must export preprocess(text, filename) -> array of text chunks and postprocess(messages, filename) -> merged messages.
8. Share Configurations
   - Export configuration object including env, parserOptions, rules.
9. Finding Issues and Fixing Problems
   - Use CLI commands: 'eslint .' to lint and 'eslint --fix .' to auto-fix.
10. Configuring ESLint
   - Use .eslintrc.json or eslint.config.js with properties: parserOptions, env, plugins, rules.


## Supplementary Details
Plugin Configuration:
- rules: Object mapping rule names to rule definitions.
- Rule definition includes:
   meta: { type: string, docs: { description: string, recommended: boolean }, fixable: 'code' | 'whitespace' | null, schema: Array }
   create(context): function returning listener object.
Custom Rule Testing:
- Use ESLint.RuleTester with constructor parameter { parserOptions: { ecmaVersion: number } }.
- Method: ruleTester.run(ruleName: string, rule: Object, tests: { valid: string[], invalid: Array<{ code: string, errors: Array<{ message: string }>, output: string }> }).
Custom Parser Requirements:
- parse(text: string, options?: object): AST
- parseForESLint(text: string, options?: object): { ast: AST, services: object }.
Custom Processor Requirements:
- preprocess(text: string, filename: string): string[]
- postprocess(messages: object[][], filename: string): object[].n
ESLint Configuration Options:
- parserOptions: { ecmaVersion: number, sourceType: 'module' | 'script' }
- env: { browser: boolean, node: boolean }
- plugins: array of plugin names
- rules: Object mapping rule names to level ('off', 'warn', 'error')
CLI Commands:
- lint: eslint . 
- auto-fix: eslint --fix .


## Reference Details
API Specifications and Code Examples:
1. Rule Definition API:
   Function signature: function(context: Object): Object
   Use context.report method: context.report({ node: ASTNode, message: string, data?: Object, fix?: function(fixer: Fixer): Fix })
   Example:
   module.exports = {
     rules: {
       'no-eval': {
         meta: {
           type: 'problem',
           docs: { description: 'Avoid eval usage', recommended: true },
           fixable: 'code',
           schema: []
         },
         create(context) {
           return {
             Identifier(node) {
               if(node.name === 'eval') {
                 context.report({
                   node,
                   message: 'Avoid eval for security reasons',
                   fix(fixer) { return fixer.replaceText(node, 'safeEval'); }
                 });
               }
             }
           };
         }
       }
     }
   };
2. RuleTester API:
   Import: const { RuleTester } = require('eslint');
   Constructor: new RuleTester({ parserOptions: { ecmaVersion: 2020 } })
   Method: ruleTester.run(ruleName: string, rule: Object, tests: { valid: string[], invalid: Array<{ code: string, errors: Array<{ message: string }>, output: string }> })
3. Custom Formatter API:
   Module exports a function: function(results: Array<Object>): string
   Iterates over results and messages. Example provided in detailed digest.
4. Custom Parser API:
   Must export an object with:
   parse(text: string, options?: Object): AST
   parseForESLint(text: string, options?: Object): { ast: AST, services: Object }
5. Custom Processor API:
   Module exports an object with:
   preprocess(text: string, filename: string): Array<string>
   postprocess(messages: Array<Array<Object>>, filename: string): Array<Object>
6. ESLint Configuration File (eslint.config.js or .eslintrc.json):
   Example structure:
   {
     parserOptions: { ecmaVersion: 2020, sourceType: 'module' },
     env: { browser: true, node: true },
     plugins: ['my-plugin'],
     rules: { 'my-plugin/no-eval': 'error', 'no-console': 'warn' }
   }
7. CLI Usage:
   Command: eslint .   -> runs linting
   Command: eslint --fix .   -> runs lint with automatic fixing
8. Troubleshooting Procedures:
   - Run: eslint . --debug to see detailed logs
   - Verify configuration file paths and plugin installations
   - Check RuleTester outputs to validate custom rule behavior. Expected: errors reported with exact messages and fixed output when applicable.


## Information Dense Extract
ESLint Extensions: Plugin export with rules mapping. Rule meta includes type, docs, fixable, schema. Rule create(context) returns AST listener. Use context.report({node, message, fix}). RuleTester: new RuleTester({parserOptions:{ecmaVersion:2020}}) and run(ruleName, rule, {valid:[], invalid:[{code, errors, output}]}). Formatter: function(results) iterates result.filePath and result.messages. Parser: export {parse(text,options):AST, parseForESLint(text,options):{ast,services}}. Processor: export {preprocess(text,filename):string[], postprocess(messages,filename):object[]}. Config: {parserOptions:{ecmaVersion:2020,sourceType:'module'}, env:{browser:true,node:true}, plugins:['my-plugin'], rules:{'my-plugin/no-eval':'error'}}. CLI: 'eslint .' and 'eslint --fix .'. Debug: use --debug flag.

## Sanitised Extract
Table of Contents:
1. Ways to Extend ESLint
   - Use plugins, custom rules, formatters, parsers, processors, and shared configurations.
2. Create Plugins
   - Export an object with a 'rules' property.
   - Example: module.exports with rules: { 'rule-name': { meta: { type, docs, fixable, schema }, create(context) { return { Identifier(node) { if (node.name==='eval') { context.report({ node, message:'Avoid eval', fix(fixer){ return fixer.replaceText(node,'safeEval'); }}); } } }; } } } }
3. Custom Rule Tutorial
   - Define meta and create function.
   - Rule API: context.report({ node, message, data, fix }).
   - Testing with RuleTester from ESLint; instantiate RuleTester with parserOptions and invoke run method with valid and invalid cases.
4. Custom Rules
   - Function(context) returns listener map with exposed methods for AST nodes.
5. Custom Formatters
   - Function that takes results array and returns formatted string.
   - Iterates over result.filePath and result.messages to build output.
6. Custom Parsers
   - Must implement parse(text, options) and parseForESLint(text, options) to return AST and services.
7. Custom Processors
   - Must export preprocess(text, filename) -> array of text chunks and postprocess(messages, filename) -> merged messages.
8. Share Configurations
   - Export configuration object including env, parserOptions, rules.
9. Finding Issues and Fixing Problems
   - Use CLI commands: 'eslint .' to lint and 'eslint --fix .' to auto-fix.
10. Configuring ESLint
   - Use .eslintrc.json or eslint.config.js with properties: parserOptions, env, plugins, rules.

## Original Source
Quality & Documentation Tools Documentation
https://eslint.org/docs/latest/developer-guide

## Digest of ESLINT_EXTENSIONS

# Ways to Extend ESLint

Retrieved: 2025-04-21
Data Size: 2120390 bytes
Links Found: 5120

## Table of Contents
1. Ways to Extend ESLint
2. Create Plugins
3. Custom Rule Tutorial
4. Custom Rules
5. Custom Formatters
6. Custom Parsers
7. Custom Processors
8. Share Configurations
9. Finding Issues and Fixing Problems
10. Configuring ESLint

## 1. Ways to Extend ESLint
The ESLint developer guide details several extension points:
- Plugin Creation
- Custom Rules, Formatters, Parsers, and Processors
- Sharing configurations via packages

## 2. Create Plugins
Plugins are Node.js modules exporting an object with key properties. A basic plugin structure is:

module.exports = {
  rules: {
    'my-rule': {
      meta: {
        type: 'problem',
        docs: {
          description: 'disallow use of eval()',
          recommended: true
        },
        fixable: 'code',
        schema: []
      },
      create(context) {
        return {
          Identifier(node) {
            if (node.name === 'eval') {
              context.report({
                node,
                message: 'Avoid eval for security reasons',
                fix(fixer) {
                  return fixer.replaceText(node, 'safeEval');
                }
              });
            }
          }
        };
      }
    }
  }
};

## 3. Custom Rule Tutorial
Steps to create a custom rule include:
- Define the rule meta object with type, docs, fixable, and schema.
- Implement the create function with a listener for AST nodes.
- Use context.report to output errors, including node, message, optional data, and a fix function if applicable.

Example usage in tests:

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/my-rule');

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2020 } });
ruleTester.run('my-rule', rule, {
  valid: ['var a = 1;'],
  invalid: [
    {
      code: 'eval(x);',
      errors: [{ message: 'Avoid eval for security reasons' }],
      output: 'safeEval(x);'
    }
  ]
});

## 4. Custom Rules
A custom rule is defined as a function taking context and returning a listener map. API signature:

function rule(context: Object): Object

The context.report method accepts an object with:
- node: AST node
- message: string
- data: object (optional)
- fix: function (optional) that returns a Fix object

## 5. Custom Formatters
Custom formatters allow customization of ESLint output. A formatter is a function that takes an array of linting results and returns a formatted string. Example structure:

module.exports = function(results) {
  let output = '';
  results.forEach(result => {
    output += `File: ${result.filePath}\n`;
    result.messages.forEach(msg => {
      output += `  Line ${msg.line}: ${msg.message} (${msg.ruleId})\n`;
    });
  });
  return output;
};

## 6. Custom Parsers
Custom parsers must implement at least the following methods:
- parse(text: string, options?: Object): AST
- parseForESLint(text: string, options?: Object): { ast: AST, services: Object }

A parser module example:

module.exports = {
  parse(text, options) {
    // implement parsing logic
    return {}; // returns AST
  },
  parseForESLint(text, options) {
    return { ast: this.parse(text, options), services: {} };
  }
};

## 7. Custom Processors
Processors allow ESLint to handle non-JavaScript files. A processor module must export two functions:
- preprocess(text: string, filename: string): Array<string>
- postprocess(messages: Array<Array<Object>>, filename: string): Array<Object>

Example processor:

module.exports = {
  preprocess(text, filename) {
    // Split file contents if needed
    return [text];
  },
  postprocess(messages, filename) {
    // Merge messages from different parts
    return [].concat(...messages);
  }
};

## 8. Share Configurations
ESLint configurations can be shared by exporting a configuration object in a package. Example in package.json:

{
  "name": "eslint-config-myconfig",
  "main": "index.js"
}

And in index.js:

module.exports = {
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  rules: {
    'no-unused-vars': 'warn'
  }
};

## 9. Finding Issues and Fixing Problems
ESLint is designed to find issues using static analysis. It is integrated in editors and CI pipelines. Core CLI commands include:

eslint .
eslint --fix .

The tool automatically fixes problems if a rule is marked as fixable. Look for output patterns indicating fixed files and remaining issues.

## 10. Configuring ESLint
Configuration can be done via configuration files like .eslintrc.json or eslint.config.js. A sample configuration:

module.exports = {
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module"
  },
  env: {
    browser: true,
    node: true
  },
  plugins: ['my-plugin'],
  rules: {
    'my-plugin/my-rule': 'error',
    'no-console': 'warn'
  }
};

Attribution: Content retrieved from ESLint Developer Guide at https://eslint.org/docs/latest/developer-guide on 21 Apr, 2025.

## Attribution
- Source: Quality & Documentation Tools Documentation
- URL: https://eslint.org/docs/latest/developer-guide
- License: License: ESLint (MIT), Prettier (varies), markdown-it (MIT), EJS (MIT)
- Crawl Date: 2025-04-25T19:42:42.151Z
- Data Size: 2120390 bytes
- Links Found: 5120

## Retrieved
2025-04-25
library/GITHUB_DOCS.md
# library/GITHUB_DOCS.md
# GITHUB_DOCS

## Crawl Summary
GitHub documentation crawl delivers detailed technical instructions on Git integration, SSH key generation and troubleshooting, personal access token management, repository creation and branch protection rules, configuration and usage of Codespaces, GitHub Copilot integration in IDEs, and REST API endpoints for repository and pull request management.

## Normalised Extract
Table of Contents:
1. Git and GitHub Integration
   - Global Git configuration commands for username and email
2. SSH Configuration and Troubleshooting
   - Command: ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
   - Start agent with: eval $(ssh-agent -s) and add key with: ssh-add ~/.ssh/id_rsa
   - Troubleshoot "Permission denied (publickey)" using ls ~/.ssh and ssh -T git@github.com
3. Personal Access Tokens (PAT) Management
   - Create tokens via GitHub settings, recommended scopes: repo, admin:org, workflow
4. Repository Management and Best Practices
   - Create repository either via GitHub UI or API (POST /user/repos), enforce branch protection, handle pull requests
   - Sample command: git pull --rebase origin main
5. Codespaces Configuration
   - Enable Codespaces, use devcontainer.json with keys like "image", "settings", "extensions"
   - Example devcontainer.json with Node image and ESLint extension
6. GitHub Copilot Integration
   - Install plugin in VS Code/JetBrains, use Tab to accept suggestions, shortcuts for alternative suggestions
7. API and CLI Specifications
   - REST API endpoints for repository details (GET /repos/{owner}/{repo}), repository creation (POST /user/repos), and pull request creation (POST /repos/{owner}/{repo}/pulls)
   - SDK method examples for GitHub client usage

## Supplementary Details
SSH Key Configuration:
   Command: ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
   Saves to: ~/.ssh/id_rsa with optional passphrase
   Start ssh-agent: eval $(ssh-agent -s)
   Add key: ssh-add ~/.ssh/id_rsa
PAT Setup:
   Create tokens in GitHub Settings > Developer Settings > Personal access tokens
   Recommended scopes: repo, admin:org, workflow
Repository Creation:
   API: POST /user/repos with JSON { "name": "RepoName", "description": "Desc", "private": false }
Codespaces:
   Dev container configuration (devcontainer.json) sample:
   {"image": "node:14", "settings": {"terminal.integrated.shell.linux": "/bin/bash"}, "extensions": ["dbaeumer.vscode-eslint"]}
GitHub Copilot Setup:
   Install plugin from marketplace, authenticate with GitHub, use Tab or configured shortcuts to accept suggestions
Troubleshooting SSH:
   Check key existence with ls -al ~/.ssh, test connection with ssh -T git@github.com, examine error outputs for missing key or incorrect permissions

## Reference Details
API Specifications:
GET /repos/{owner}/{repo}:
   Method: GET
   Parameters:
      owner: string (GitHub username, e.g., "octocat")
      repo: string (Repository name, e.g., "Hello-World")
   Returns: 200 OK with JSON { id: int, name: string, full_name: string, private: boolean, owner: { login: string } }

POST /user/repos:
   Method: POST
   Payload: { name: string, description: string, private: boolean }
   Returns: 201 Created with full repository details

POST /repos/{owner}/{repo}/pulls:
   Method: POST
   Payload: { title: string, head: string, base: string }
   Returns: JSON object with pull request information (id: number, state: string)

SDK Method Signatures (Hypothetical GitHub Client):
   GitHubClient.getRepository(owner: string, repo: string): Repository
   GitHubClient.createRepository(name: string, description: string, isPrivate: boolean): Repository
   GitHubClient.createPullRequest(owner: string, repo: string, title: string, head: string, base: string): PullRequest

Code Example:
   // Initialize GitHub client with authentication token
   const client = new GitHubClient(authToken);
   // Retrieve repository information
   const repo = client.getRepository('octocat', 'Hello-World');
   // Create a new repository
   const newRepo = client.createRepository('NewRepo', 'Repository description', false);
   // Create a pull request
   const pr = client.createPullRequest('octocat', 'Hello-World', 'Feature Update', 'feature-branch', 'main');

Configuration Options:
   SSH Configuration file (~/.ssh/config):
      Host github.com
         IdentityFile ~/.ssh/id_rsa
         User git
   PAT recommended scopes: repo, admin:org, workflow

Troubleshooting Procedures:
   - SSH Connection Test: ssh -T git@github.com
   - List SSH keys: ls -al ~/.ssh
   - API debug using curl: curl -H 'Authorization: token <YOUR_TOKEN>' https://api.github.com/repos/octocat/Hello-World

Best Practices:
   - Use two-factor authentication
   - Rotate personal access tokens periodically
   - Enforce branch protection via API calls
   - Validate SSH keys with: ssh-keygen -lf ~/.ssh/id_rsa.pub

## Information Dense Extract
GIT CONFIG: git config --global user.name/email; SSH: ssh-keygen -t rsa -b 4096, eval $(ssh-agent -s), ssh-add ~/.ssh/id_rsa, verify with ls and ssh -T git@github.com; PAT: Create in GitHub settings with scopes repo, admin:org, workflow; REPO API: POST /user/repos {name, description, private}, GET /repos/{owner}/{repo} returns {id, name, full_name, private}; PULL API: POST /repos/{owner}/{repo}/pulls {title, head, base}; SDK: GitHubClient.getRepository(string, string): Repository, createRepository(string, string, boolean): Repository, createPullRequest(string, string, string, string, string): PullRequest; CODESPACES: Enable via settings, use devcontainer.json with image, settings, extensions; COPILOT: Install plugin, accept suggestions with Tab, keyboard shortcuts for alternatives; TROUBLESHOOT: ssh -T git@github.com, curl API with token.

## Sanitised Extract
Table of Contents:
1. Git and GitHub Integration
   - Global Git configuration commands for username and email
2. SSH Configuration and Troubleshooting
   - Command: ssh-keygen -t rsa -b 4096 -C 'your_email@example.com'
   - Start agent with: eval $(ssh-agent -s) and add key with: ssh-add ~/.ssh/id_rsa
   - Troubleshoot 'Permission denied (publickey)' using ls ~/.ssh and ssh -T git@github.com
3. Personal Access Tokens (PAT) Management
   - Create tokens via GitHub settings, recommended scopes: repo, admin:org, workflow
4. Repository Management and Best Practices
   - Create repository either via GitHub UI or API (POST /user/repos), enforce branch protection, handle pull requests
   - Sample command: git pull --rebase origin main
5. Codespaces Configuration
   - Enable Codespaces, use devcontainer.json with keys like 'image', 'settings', 'extensions'
   - Example devcontainer.json with Node image and ESLint extension
6. GitHub Copilot Integration
   - Install plugin in VS Code/JetBrains, use Tab to accept suggestions, shortcuts for alternative suggestions
7. API and CLI Specifications
   - REST API endpoints for repository details (GET /repos/{owner}/{repo}), repository creation (POST /user/repos), and pull request creation (POST /repos/{owner}/{repo}/pulls)
   - SDK method examples for GitHub client usage

## Original Source
GitHub Documentation
https://docs.github.com/en

## Digest of GITHUB_DOCS

# GitHub Documentation

Retrieved Date: 2023-11-24
Data Size: 544071 bytes
Links Found: 12604

## Git and GitHub Overview
Git is the core version control system used by GitHub. Configure Git by setting your global username and email:

   git config --global user.name "Your Name"
   git config --global user.email "you@example.com"

## SSH Setup and Troubleshooting
To securely connect to GitHub using SSH:

1. Generate a new SSH Key:
   ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

2. Start the ssh-agent in the background:
   eval $(ssh-agent -s)

3. Add your SSH private key to the ssh-agent:
   ssh-add ~/.ssh/id_rsa

Common troubleshooting:
- Error: Permission denied (publickey) 
   Verify the key exists with ls -al ~/.ssh and test connection: ssh -T git@github.com

## Personal Access Tokens (PAT)
Generate and manage PATs in GitHub Settings > Developer Settings. Use tokens as a password substitute in CLI operations when HTTPS is used.

Example scopes: repo, admin:org, workflow.

## Repository Management and Best Practices
- Create repositories via the GitHub UI or using the REST API (POST /user/repos).
- Enforce branch protection rules to avoid unauthorized force pushes. Example command on command line:
   git pull --rebase origin main
- Use pull requests for code review and merging with required approvals.

## Codespaces Configuration
Codespaces provide a cloud development environment. Key steps:

- Enable Codespaces in your organization or repository settings.
- Configure a dev container (devcontainer.json) with properties:
    {
       "image": "node:14",
       "settings": { "terminal.integrated.shell.linux": "/bin/bash" },
       "extensions": ["dbaeumer.vscode-eslint"]
    }
- Use GitHub CLI to create and manage codespaces.

## GitHub Copilot Integration
For AI-assisted coding, install the Copilot plugin from your IDE marketplace. Key points include:
- In Visual Studio Code or JetBrains IDEs, accept suggestions using the Tab key.
- Use keyboard shortcuts to cycle through alternative suggestions (macOS: Option+[ / Option+], Windows/Linux: Alt+[ / Alt+]).
- Customize Copilot settings via the plugin configuration.

## API and CLI Specifications
### REST API Example: Get Repository Details
Endpoint: GET /repos/{owner}/{repo}
Parameters:
   owner: string (e.g., "octocat")
   repo: string (e.g., "Hello-World")
Returns:
   JSON with fields: id (int), name (string), full_name (string), private (boolean), owner (object with login string)

### Creating a Repository via API
Method: POST /user/repos
Payload:
   {
     "name": "NewRepo",
     "description": "Repository description",
     "private": false
   }
Returns: 201 Created with repository details.

### Creating a Pull Request
Endpoint: POST /repos/{owner}/{repo}/pulls
Payload Fields:
   title: string
   head: string (branch name with proposed changes)
   base: string (target branch)
Returns: JSON with pull request id and state.

## Attribution
Extracted from GitHub Docs at https://docs.github.com/en

## Attribution
- Source: GitHub Documentation
- URL: https://docs.github.com/en
- License: License: Not specified
- Crawl Date: 2025-04-25T22:09:09.406Z
- Data Size: 544071 bytes
- Links Found: 12604

## Retrieved
2025-04-25
library/VITEST.md
# library/VITEST.md
# VITEST

## Crawl Summary
Vitest is a Vite-native testing framework supporting ESM, TypeScript, JSX. Installation via npm/yarn/pnpm/bun, requires Vite>=v5.0.0 and Node>=v18.0.0. Key topics include writing tests with sample code files (sum.js, sum.test.js), unified configuration via vite.config or a separate vitest.config, workspace support for monorepos, CLI usage with options for running tests and coverage, dependency optimization settings (inline, external, cacheDir) and extensive configuration options (include, exclude, globals, environment, alias). Troubleshooting includes ensuring correct versions, handling dependency inline issues, and using proper commands for different package managers.

## Normalised Extract
Table of Contents:
1. Installation
   - npm: npm install -D vitest
   - yarn: yarn add -D vitest
   - pnpm: pnpm add -D vitest
   - bun: bun add -D vitest
   - Requirements: Vite >= v5.0.0; Node >= v18.0.0
2. Writing Tests
   - Example Code: 
     File: sum.js
       export function sum(a, b) { return a + b }
     File: sum.test.js
       import { expect, test } from 'vitest'
       import { sum } from './sum.js'
       test('adds 1 + 2 to equal 3', () => { expect(sum(1, 2)).toBe(3) })
   - Package.json Script: { "scripts": { "test": "vitest" } }
3. Configuring Vitest
   - Use vitest.config.ts with defineConfig from 'vitest/config'
   - Options specified under test property; sample configuration:
       import { defineConfig } from 'vitest/config'
       export default defineConfig({ test: { /* options here */ } })
   - CLI option: vitest --config <path>
   - Environment variable: process.env.VITEST
4. Workspace Support
   - Define workspaces in vitest.workspace.ts with defineWorkspace
   - Glob patterns and specific overrides with test configurations
5. Command Line Interface
   - Default scripts: test and coverage in package.json
   - Options: vitest run, --port, --https, --help
6. Dependency & Optimization
   - test.deps.external default: [/\/node_modules\//]
   - test.deps.inline: array/string/true to force processing via esbuild
   - Cache: 'node_modules/.vite'
7. Advanced Config Options
   - include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)']
   - exclude: ['**/node_modules/**', '**/dist/**', etc.]
   - globals: boolean flag for global API
   - environment: e.g., 'node', 'jsdom', 'happy-dom', 'edge-runtime'
   - alias: mapping for module resolution
   - reporters, update, watch, root, and base dir settings
8. Troubleshooting and Best Practices
   - Verify version requirements
   - Use --update for snapshot changes
   - For dependency issues, adjust deps.inline or fallbackCJS
   - Use correct CLI commands (e.g., bun run test for Bun)

Detailed Technical Information:
Installation commands, sample test files, configuration file structure including merging Vite and Vitest configurations, complete parameter defaults for options such as include, exclude, globals, environment; and CLI commands for running tests with coverage and debugging options are provided as listed above.

## Supplementary Details
Vitest Technical Specifications:
- Install Vitest via package managers; ensure Vite (>=v5.0.0) and Node (>=v18.0.0).
- Configuration Options (in vite.config or vitest.config):
   test: {
     include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
     exclude: ['**/node_modules/**', '**/dist/**', '**/[config|vite,vitest,jest,ava,...].config.*'],
     globals: false,
     environment: 'node',
     alias: { },
     reporters: 'default',
     update: false,
     watch: !process.env.CI,
     deps: {
       external: [/\/node_modules\//],
       inline: [],
       fallbackCJS: false,
       cacheDir: 'node_modules/.vite',
       optimizer: {
         ssr: { enabled: false },
         web: { enabled: false }
       }
     }
   }
- Workspace: Define in vitest.workspace.ts using defineWorkspace with glob patterns and inline configuration overrides.
- CLI Commands:
   - Run tests: vitest or npx vitest
   - Run tests once: vitest run
   - Coverage: vitest run --coverage
   - Help: npx vitest --help
- Dependency Optimization:
   - External dependencies by default are those in node_modules
   - Inline configuration can be specified for problematic modules
   - Configuration merging can be done via mergeConfig from 'vitest/config'
- Best Practices:
   - Use a single config file when possible
   - For monorepos, define clear workspace boundaries in vitest.workspace.ts
   - Update snapshots with --update flag and disable automatic dependency installation with VITEST_SKIP_INSTALL_CHECKS=1 if needed
- Troubleshooting:
   1. Check version compatibility (Vite, Node)
   2. Use correct CLI commands (e.g., bun run test for Bun)
   3. For module resolution errors, adjust deps.inline or fallbackCJS parameter
   4. Refer to error outputs from npx vitest --help if issues persist.

## Reference Details
API Specifications and SDK Method Signatures:

1. defineConfig from 'vitest/config'
   Signature: function defineConfig(config: { test?: TestOptions }): Config
   TestOptions includes parameters:
     - include: string[] (default ['**/*.{test,spec}.?(c|m)[jt]s?(x)'])
     - exclude: string[] (default ['**/node_modules/**', '**/dist/**', ...])
     - globals: boolean (default false)
     - environment: string (e.g., 'node', 'jsdom', 'happy-dom')
     - deps: { external: (string|RegExp)[], inline: (string|RegExp)[]|true, fallbackCJS: boolean, cacheDir: string, optimizer: { ssr: { enabled: boolean }, web: { enabled: boolean } } }
     - reporters: Reporter | Reporter[] (default 'default')
     - update: boolean (default false)
     - watch: boolean (default based on CI env)
     - root: string (project root path)

2. CLI Options:
   - Command: vitest [options]
   - Options include:
     --config <path>: Specify an alternative configuration file
     --port <num>: Set server port
     --https: Enable https
     --update: Update snapshot files
     --watch: Enable watch mode
     --coverage: Run tests with coverage

3. Code Examples:

// sum.js
export function sum(a, b) {
  return a + b
}

// sum.test.js
import { expect, test } from 'vitest'
import { sum } from './sum.js'

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3)
})

// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    globals: false,
    environment: 'node',
    deps: {
      external: [/\/node_modules\//],
      inline: [],
      fallbackCJS: false,
      cacheDir: 'node_modules/.vite'
    },
    reporters: 'default',
    update: false,
    watch: false
  }
})

4. Troubleshooting Procedures:
   - Verify package versions: Command: node -v and vite --version
   - For inline dependency issues, set deps.inline: true or specify problematic module patterns
   - Use CLI command: npx vitest --help for full options list
   - For configuration merge issues, use mergeConfig from 'vitest/config' as shown:

     import { defineConfig, mergeConfig } from 'vitest/config'
     import viteConfig from './vite.config'
     export default mergeConfig(viteConfig, defineConfig({ test: { exclude: ['packages/template/*'] } }))

5. Environment Configuration:
   - Use triple slash references for TypeScript: /// <reference types="vitest/config" />
   - For jsdom, add vitest/jsdom to tsconfig types

6. Best Practices:
   - Use a unified configuration by merging Vite and Vitest configs
   - For monorepos, clearly define workspaces in vitest.workspace.ts
   - Always run tests with explicit scripts in package.json to avoid ambiguity

Every parameter, method signature, and CLI option is provided with its default and expected data types as per the Vitest documentation.

## Information Dense Extract
Vitest: Next-gen testing framework using Vite. Install via npm, yarn, pnpm, bun; requires Vite>=5.0.0, Node>=18.0.0. Test files must include .test. or .spec. Extensions. defineConfig({ test: { include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'], exclude: ['**/node_modules/**', '**/dist/**'], globals: false, environment: 'node', deps: { external: [/\/node_modules\//], inline: [], fallbackCJS: false, cacheDir: 'node_modules/.vite' }, reporters: 'default', update: false, watch: false } }). CLI: vitest, vitest run, --config, --coverage, --update, --watch. Workspace support via defineWorkspace with glob patterns. Dependency optimization: inline modules via esbuild; fallbackCJS for ESM packages. SDK methods: defineConfig(config: { test?: TestOptions }) with TestOptions detailed above. Code examples provided for sum.js, sum.test.js, vitest.config.ts. Advanced options include aliasing, environment variables, reporters, CLI flags for port and HTTPS. Troubleshooting: verify versions, adjust deps.inline and fallbackCJS, use mergeConfig for config merging.

## Sanitised Extract
Table of Contents:
1. Installation
   - npm: npm install -D vitest
   - yarn: yarn add -D vitest
   - pnpm: pnpm add -D vitest
   - bun: bun add -D vitest
   - Requirements: Vite >= v5.0.0; Node >= v18.0.0
2. Writing Tests
   - Example Code: 
     File: sum.js
       export function sum(a, b) { return a + b }
     File: sum.test.js
       import { expect, test } from 'vitest'
       import { sum } from './sum.js'
       test('adds 1 + 2 to equal 3', () => { expect(sum(1, 2)).toBe(3) })
   - Package.json Script: { 'scripts': { 'test': 'vitest' } }
3. Configuring Vitest
   - Use vitest.config.ts with defineConfig from 'vitest/config'
   - Options specified under test property; sample configuration:
       import { defineConfig } from 'vitest/config'
       export default defineConfig({ test: { /* options here */ } })
   - CLI option: vitest --config <path>
   - Environment variable: process.env.VITEST
4. Workspace Support
   - Define workspaces in vitest.workspace.ts with defineWorkspace
   - Glob patterns and specific overrides with test configurations
5. Command Line Interface
   - Default scripts: test and coverage in package.json
   - Options: vitest run, --port, --https, --help
6. Dependency & Optimization
   - test.deps.external default: [/'/node_modules'//]
   - test.deps.inline: array/string/true to force processing via esbuild
   - Cache: 'node_modules/.vite'
7. Advanced Config Options
   - include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)']
   - exclude: ['**/node_modules/**', '**/dist/**', etc.]
   - globals: boolean flag for global API
   - environment: e.g., 'node', 'jsdom', 'happy-dom', 'edge-runtime'
   - alias: mapping for module resolution
   - reporters, update, watch, root, and base dir settings
8. Troubleshooting and Best Practices
   - Verify version requirements
   - Use --update for snapshot changes
   - For dependency issues, adjust deps.inline or fallbackCJS
   - Use correct CLI commands (e.g., bun run test for Bun)

Detailed Technical Information:
Installation commands, sample test files, configuration file structure including merging Vite and Vitest configurations, complete parameter defaults for options such as include, exclude, globals, environment; and CLI commands for running tests with coverage and debugging options are provided as listed above.

## Original Source
Vitest Testing Framework Documentation
https://vitest.dev

## Digest of VITEST

# Vitest Testing Framework Documentation

Retrieved Date: 2023-10-24

# Overview
Vitest is a next-generation testing framework powered by Vite. It supports ESM, TypeScript, JSX and is designed to be fast and lightweight. Vitest also provides compatibility with Jest (expect, snapshot, coverage) and supports an instant watch mode, unified Vite configuration, and in-source tests.

# Installation
- npm: npm install -D vitest
- yarn: yarn add -D vitest
- pnpm: pnpm add -D vitest
- bun: bun add -D vitest

Requirements:
- Vite >= v5.0.0
- Node >= v18.0.0

# Writing Tests
Example file: sum.js

  export function sum(a, b) {
    return a + b
  }

Example test file: sum.test.js

  import { expect, test } from 'vitest'
  import { sum } from './sum.js'

  test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3)
  })

Package.json snippet to run tests:

  {
    "scripts": {
      "test": "vitest"
    }
  }

Command to run tests:
  npm run test (or yarn test / pnpm test)

# Configuring Vitest
Vitest leverages Vite’s unified configuration. The test options can be configured inside vite.config.js or a separate vitest.config.js/ts file.

Methods to configure:
- Create vitest.config.ts for higher priority config
- Pass --config option to CLI
- Use process.env.VITEST or mode property in defineConfig

Sample vitest.config.ts:

  import { defineConfig } from 'vitest/config'
  
  export default defineConfig({
    test: {
      // Specify test options here
    }
  })

Using Vite config with Vitest:

  /// <reference types="vitest/config" />
  import { defineConfig } from 'vite'

  export default defineConfig({
    test: { /* options */ }
  })

Merging Vite and Vitest configuration example:

  import { defineConfig, mergeConfig } from 'vitest/config'
  import viteConfig from './vite.config.mjs'
  
  export default mergeConfig(viteConfig, defineConfig({
    test: { /* options */ }
  }))

# Workspace Support
Vitest supports workspaces for monorepos. Define a vitest.workspace.ts file:

  import { defineWorkspace } from 'vitest/config'
  
  export default defineWorkspace([
    'packages/*',
    'tests/*/vitest.config.{e2e,unit}.ts',
    {
      test: {
        name: 'happy-dom',
        root: './shared_tests',
        environment: 'happy-dom',
        setupFiles: ['./setup.happy-dom.ts']
      }
    },
    {
      test: {
        name: 'node',
        root: './shared_tests',
        environment: 'node',
        setupFiles: ['./setup.node.ts']
      }
    }
  ])

# Command Line Interface (CLI)

Default npm scripts in scaffolded Vitest project:

  {
    "scripts": {
      "test": "vitest",
      "coverage": "vitest run --coverage"
    }
  }

CLI Options:
- vitest run for non-watch mode
- Additional options like --port and --https
- Run help: npx vitest --help

# Dependency Optimization & Handling

Vitest externalizes dependencies by default (node_modules). Specific configuration options include:

- test.deps.external: array of string/RegExp, default [/\/node_modules\//]
- test.deps.inline: boolean or array, to force inlining by esbuild
- test.deps.fallbackCJS: boolean, default false
- Cache directory: default 'node_modules/.vite'

Optimizer configuration:

  test: {
    deps: {
      optimizer: {
        ssr: { enabled: false },
        web: { enabled: false }
      }
    }
  }

# Advanced Configuration Options

Vitest configuration supports a vast array of parameters. Key options include:

- include: string[] patterns for test file matching. Default ['**/*.{test,spec}.?(c|m)[jt]s?(x)']
- exclude: string[] patterns for files to ignore
- globals: boolean flag to provide global API if set to true
- environment: defines the test runner environment e.g., 'node', 'jsdom', 'happy-dom', 'edge-runtime'
- alias: object or array for module aliasing
- reporters: custom reporter configurations
- update: boolean to update snapshot files
- watch: boolean to enable watch mode

Detailed Vite and Vitest config options are available with type definitions and expected defaults in the Vitest documentation.

# Troubleshooting & Best Practices

Troubleshooting Steps:
1. Ensure Vite version is >= v5.0.0 and Node >= v18.0.0
2. For dependency errors, check if inline option is needed for ESM packages
3. For CLI issues, run npx vitest --help for full list of options
4. If using Bun as a package manager, use 'bun run test' instead of 'bun test'

Best Practices:
- Use a single configuration file for both Vite and Vitest where possible
- Define a vitest.workspace file for monorepo setups
- Update snapshots with the --update CLI flag as required
- Leverage dependency optimization settings when tests are slow

# Attribution
Data Size: 39784282 bytes; Extracted from https://vitest.dev; Links Processed: 26038

## Attribution
- Source: Vitest Testing Framework Documentation
- URL: https://vitest.dev
- License: License: MIT
- Crawl Date: 2025-04-25T18:34:23.914Z
- Data Size: 39784282 bytes
- Links Found: 26038

## Retrieved
2025-04-25
