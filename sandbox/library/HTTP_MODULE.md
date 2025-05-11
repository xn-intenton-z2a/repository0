# HTTP_MODULE

## Crawl Summary
http.createServer: options.allowHalfOpen=false, pauseOnConnect=false, returns http.Server.
http.Server: extends net.Server. listen(port, hostname?, backlog?, callback?), close(callback?). Default maxHeadersCount=undefined, keepAliveTimeout=5000ms, headersTimeout=60000ms. Events: request, connection, close, error, listening, clientError.
http.request: RequestOptions with protocol=http:, hostname=localhost, port=80, path='/', method=GET, headers={}, auth, agent=http.globalAgent, timeout (ms), family=4, signal, insecureHTTPParser=false. Returns ClientRequest. Callback on response.
http.get: alias to http.request with auto-end.
http.Agent: new Agent(options): keepAlive=false, keepAliveMsecs=1000ms, maxSockets=Infinity, maxFreeSockets=256, timeout=60000ms. Manages sockets: sockets, freeSockets. Methods: createConnection, destroy.
ClientRequest: extends Writable. Methods: setHeader, getHeader, removeHeader, write, end, abort. Events: response, socket, timeout, error, close.
IncomingMessage: extends Readable. Properties: httpVersion, headers, rawHeaders, trailers, rawTrailers, method, url, statusCode, statusMessage, socket. Events: data, end, close, aborted.

## Normalised Extract
Table of Contents
1. http.createServer
2. http.Server
3. http.request
4. http.get
5. http.Agent
6. http.ClientRequest
7. http.IncomingMessage

1. http.createServer
Signature: http.createServer([options][, requestListener]) -> http.Server
Options:
  allowHalfOpen: boolean (default false)
  pauseOnConnect: boolean (default false)
  IncomingMessage: constructor (default http.IncomingMessage)
  ServerResponse: constructor (default http.ServerResponse)
requestListener: function(req, res)
Returns: http.Server

2. http.Server
Extends net.Server
Methods:
  listen(port, hostname?, backlog?, callback?)
  close(callback?)
Properties:
  maxHeadersCount: number (default undefined)
  keepAliveTimeout: number (default 5000)
  headersTimeout: number (default 60000)
Events: request, connection, close, error, listening, clientError

3. http.request
Signature: http.request(options[, callback]) -> http.ClientRequest
RequestOptions:
  protocol: string (default "http:")
  hostname: string (default "localhost")
  port: number (default 80)
  path: string (default "/")
  method: string (default "GET")
  headers: object (default {})
  auth: string
  agent: http.Agent (default http.globalAgent)
  timeout: number
  family: number (default 4)
  signal: AbortSignal
  insecureHTTPParser: boolean (default false)
callback: function(res)
Returns: http.ClientRequest

4. http.get
Alias of http.request that calls req.end() automatically

5. http.Agent
Constructor: new http.Agent([options])
Options:
  keepAlive: boolean (default false)
  keepAliveMsecs: number (default 1000)
  maxSockets: number (default Infinity)
  maxFreeSockets: number (default 256)
  timeout: number (default 60000)
Properties:
  maxSockets, maxFreeSockets, sockets, freeSockets
Methods:
  createConnection(options, callback)
  destroy()

6. http.ClientRequest
Extends stream.Writable
Methods:
  setHeader(name, value)
  getHeader(name)
  removeHeader(name)
  write(chunk, encoding?, callback?)
  end([data], [encoding], [callback])
  abort()
Properties:
  aborted: boolean
  socket: net.Socket
Events: response, socket, timeout, error, close

7. http.IncomingMessage
Extends stream.Readable
Properties:
  httpVersion, httpVersionMajor, httpVersionMinor
  headers, rawHeaders
  trailers, rawTrailers
  method, url
  statusCode, statusMessage
  socket
Events: data, end, close, aborted

## Supplementary Details
Server creation steps:
1. Import module: const http = require('node:http');
2. Create server: const server = http.createServer(listener);
3. Configure: server.keepAliveTimeout = 10000; server.headersTimeout = 120000;
4. Start: server.listen(8080, '0.0.0.0', () => console.log('Listening')); 
5. Handle errors: server.on('error', err => console.error(err));

Client request steps:
1. Define RequestOptions object.
2. Call http.request(options, resCallback).
3. Set headers: req.setHeader('Content-Type', 'application/json');
4. Handle events: req.on('error', err=>{}); req.on('timeout', ()=>{});
5. Send data: req.write(payload);
6. End: req.end();

Agent pooling:
const agent = new http.Agent({ keepAlive: true, maxSockets: 100 });
Include agent in options: agent: agent
agent.destroy() to close all sockets.

Timeout tuning:
Server.headersTimeout = 30000;
Server.keepAliveTimeout = 5000;
req.setTimeout(2000, ()=> req.abort());

## Reference Details
// Basic HTTP Server
import { createServer } from 'node:http';
const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World');
});
server.keepAliveTimeout = 10000;
server.headersTimeout = 60000;
server.listen(3000, '127.0.0.1', () => console.log('Server up'));

// Client GET Request
import { request } from 'node:http';
const options = {
  hostname: 'example.com', port: 80, path: '/api', method: 'GET',
  headers: { 'Accept': 'application/json' }, timeout: 5000
};
const req = request(options, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(JSON.parse(data)));
});
req.on('timeout', () => { req.abort(); });
req.on('error', err => console.error('Request error', err));
req.end();

// Using custom Agent
import { Agent } from 'node:http';
const keepAliveAgent = new Agent({ keepAlive: true, keepAliveMsecs: 2000, maxSockets: 50 });
options.agent = keepAliveAgent;

// Best practices
server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
// Troubleshooting
// Test server: curl -v http://127.0.0.1:3000
// Enable debug logs: NODE_DEBUG=http node server.js


## Information Dense Extract
http.createServer(options?, listener) → Server  allowHalfOpen:false, pauseOnConnect:false
Server.listen(port[,host[,backlog]][,cb]), close([cb]),  keepAliveTimeout:5000ms, headersTimeout:60000ms, events: request,connection,clientError
http.request(opts) → ClientRequest  opts:{protocol,http:,hostname,localhost,port80,path'/',method'GET',headers{},auth,agent,timeout,family4,signal,insecureHTTPParser:false}
http.get(...) auto-end
http.Agent(opts) → Agent keepAlive:false,keepAliveMsecs1000ms,maxSockets∞,maxFreeSockets256,timeout60000ms sockets/freeSockets pools, methods:createConnection,destroy
ClientRequest.setHeader,getHeader,removeHeader,write,end,abort; events:response,socket,timeout,error,close
IncomingMessage props: httpVersion,headers,rawHeaders,trailers,rawTrailers,method,url,statusCode,statusMessage,socket; events:data,end,close,aborted

## Sanitised Extract
Table of Contents
1. http.createServer
2. http.Server
3. http.request
4. http.get
5. http.Agent
6. http.ClientRequest
7. http.IncomingMessage

1. http.createServer
Signature: http.createServer([options][, requestListener]) -> http.Server
Options:
  allowHalfOpen: boolean (default false)
  pauseOnConnect: boolean (default false)
  IncomingMessage: constructor (default http.IncomingMessage)
  ServerResponse: constructor (default http.ServerResponse)
requestListener: function(req, res)
Returns: http.Server

2. http.Server
Extends net.Server
Methods:
  listen(port, hostname?, backlog?, callback?)
  close(callback?)
Properties:
  maxHeadersCount: number (default undefined)
  keepAliveTimeout: number (default 5000)
  headersTimeout: number (default 60000)
Events: request, connection, close, error, listening, clientError

3. http.request
Signature: http.request(options[, callback]) -> http.ClientRequest
RequestOptions:
  protocol: string (default 'http:')
  hostname: string (default 'localhost')
  port: number (default 80)
  path: string (default '/')
  method: string (default 'GET')
  headers: object (default {})
  auth: string
  agent: http.Agent (default http.globalAgent)
  timeout: number
  family: number (default 4)
  signal: AbortSignal
  insecureHTTPParser: boolean (default false)
callback: function(res)
Returns: http.ClientRequest

4. http.get
Alias of http.request that calls req.end() automatically

5. http.Agent
Constructor: new http.Agent([options])
Options:
  keepAlive: boolean (default false)
  keepAliveMsecs: number (default 1000)
  maxSockets: number (default Infinity)
  maxFreeSockets: number (default 256)
  timeout: number (default 60000)
Properties:
  maxSockets, maxFreeSockets, sockets, freeSockets
Methods:
  createConnection(options, callback)
  destroy()

6. http.ClientRequest
Extends stream.Writable
Methods:
  setHeader(name, value)
  getHeader(name)
  removeHeader(name)
  write(chunk, encoding?, callback?)
  end([data], [encoding], [callback])
  abort()
Properties:
  aborted: boolean
  socket: net.Socket
Events: response, socket, timeout, error, close

7. http.IncomingMessage
Extends stream.Readable
Properties:
  httpVersion, httpVersionMajor, httpVersionMinor
  headers, rawHeaders
  trailers, rawTrailers
  method, url
  statusCode, statusMessage
  socket
Events: data, end, close, aborted

## Original Source
Node.js API v20
https://nodejs.org/docs/latest-v20.x/api/

## Digest of HTTP_MODULE

# HTTP Module

## http.createServer([options][, requestListener]) -> http.Server

options.allowHalfOpen <boolean> Default: false
options.pauseOnConnect <boolean> Default: false
options.IncomingMessage <constructor> Default: http.IncomingMessage
options.ServerResponse <constructor> Default: http.ServerResponse
requestListener(req: http.IncomingMessage, res: http.ServerResponse) invoked per request
Returns: http.Server

## Class: http.Server
Extends net.Server

Methods:
  listen(port: number, hostname?: string, backlog?: number, callback?: ()=>void): this
  close(callback?: (err?: Error)=>void): this

Properties:
  maxHeadersCount <number> Default: undefined (no limit)
  keepAliveTimeout <number> Default: 5000 ms
  headersTimeout <number> Default: 60000 ms

Events:
  'request'(req: IncomingMessage, res: ServerResponse)
  'connection'(socket: net.Socket)
  'close'
  'error'(err: Error)
  'listening'
  'clientError'(err: Error, socket: net.Socket)

## http.request(options[, callback]) -> http.ClientRequest

options.protocol <string> Default: 'http:'
options.hostname <string> Default: 'localhost'
options.port <number> Default: 80
options.path <string> Default: '/'
options.method <string> Default: 'GET'
options.headers <object> Default: {}
options.auth <string> Optional user:password
options.agent <http.Agent> Default: http.globalAgent
options.timeout <number> Socket timeout in ms
options.family <number> IP version (4 or 6) Default: 4
options.signal <AbortSignal> Optional
options.insecureHTTPParser <boolean> Default: false
Returns: http.ClientRequest
callback(res: IncomingMessage)

## http.get(options[, callback]) -> http.ClientRequest
Alias for http.request with auto call to req.end()

## Class: http.Agent

Constructor:
  new http.Agent([options])

AgentOptions:
  keepAlive <boolean> Default: false
  keepAliveMsecs <number> Default: 1000 ms
  maxSockets <number> Default: Infinity
  maxFreeSockets <number> Default: 256
  timeout <number> Default: 60000 ms (free socket timeout)

Properties:
  defaultPort <number>
  protocol <string>
  maxSockets <number>
  maxFreeSockets <number>
  sockets <object> Active sockets by origin
  freeSockets <object> Idle sockets by origin

Methods:
  createConnection(options: object, callback: Function)
  destroy()

## Class: http.ClientRequest
Extends stream.Writable

Methods:
  setHeader(name: string, value: string|number|string[]): void
  getHeader(name: string): string|number|string[]|undefined
  removeHeader(name: string): void
  write(chunk: Buffer|string|Uint8Array, encoding?: string, callback?: Function): boolean
  end([data: Buffer|string], [encoding: string], [callback: Function]): void
  abort(): void

Properties:
  aborted <boolean>
  socket <net.Socket>

Events:
  'response'(res: IncomingMessage)
  'socket'(socket: net.Socket)
  'timeout'
  'error'(err: Error)
  'close'

## Class: http.IncomingMessage
Extends stream.Readable

Properties:
  httpVersion <string>
  httpVersionMajor <number>
  httpVersionMinor <number>
  headers <object>
  rawHeaders <string[]>
  trailers <object>
  rawTrailers <string[]>
  method <string> (requests)
  url <string> (requests)
  statusCode <number> (responses)
  statusMessage <string> (responses)
  socket <net.Socket>

Events:
  'data'(chunk: Buffer|string)
  'end'
  'close'
  'aborted'


## Attribution
- Source: Node.js API v20
- URL: https://nodejs.org/docs/latest-v20.x/api/
- License: MIT
- Crawl Date: 2025-05-11T04:58:01.741Z
- Data Size: 3182246 bytes
- Links Found: 585

## Retrieved
2025-05-11
