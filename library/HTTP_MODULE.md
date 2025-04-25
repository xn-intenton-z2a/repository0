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
