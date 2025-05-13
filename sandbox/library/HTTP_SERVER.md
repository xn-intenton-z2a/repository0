# HTTP_SERVER

## Crawl Summary
node command syntax, HTTP.createServer signature with options and requestListener types, Server.listen parameters and defaults, IncomingMessage and ServerResponse methods, Hello World server code example.

## Normalised Extract
Table of Contents
1. Command-Line Invocation
2. HTTP.createServer Signature
3. http.Server.listen Signature
4. requestListener: IncomingMessage and ServerResponse
5. Hello World Server Code

1. Command-Line Invocation
node [options] [V8 options] [ script.js | -e "script" | - ] [ arguments ]
Common options: --inspect, -r/--require, --experimental-modules, --trace-warnings

2. HTTP.createServer Signature
createServer(options?:{allowHalfOpen?:boolean;pauseOnConnect?:boolean}, requestListener?:(req:IncomingMessage,res:ServerResponse)=>void):Server
options.allowHalfOpen default false
options.pauseOnConnect default false
Throws TypeError on invalid args

3. http.Server.listen Signature
server.listen(port:number, hostname?:string, backlog?:number, callback?:()=>void):Server
hostname default '0.0.0.0', backlog default OS (511)
Throws Error on invalid port/host

4. requestListener: IncomingMessage and ServerResponse
req.url:string
req.method:string
req.headers:IncomingHttpHeaders
req.on('data',chunk)
req.on('end')
res.statusCode:number
res.setHeader(name,value)
res.getHeader(name)
res.removeHeader(name)
res.write(chunk[,encoding]):boolean
res.end([data],[encoding],[callback])

5. Hello World Server Code
import { createServer } from 'node:http';
const server = createServer((req,res)=>{res.writeHead(200,{'Content-Type':'text/plain'});res.end('Hello World!\n');});
server.listen(3000,'127.0.0.1',()=>console.log('Listening on 127.0.0.1:3000'));

## Supplementary Details
Configuration Options
• allowHalfOpen: controls socket half-open behavior. false = socket automatically ends when response ends.
• pauseOnConnect: pause socket on 'connection' until 'connection' listener resumes. false by default.
• hostname: when omitted server binds on all interfaces.
• backlog: max pending connections, OS default ~511.
Environment Variables
• NO_COLOR or NODE_DISABLE_COLORS: disable colored output in console and REPL.
Implementation Steps
1. mkdir ~/projects && cd ~/projects
2. generate server.mjs with createServer code
3. run node server.mjs
4. open http://127.0.0.1:3000


## Reference Details
API Specifications

http.createServer(options?, requestListener?) -> http.Server
  options.allowHalfOpen:boolean (default false)
  options.pauseOnConnect:boolean (default false)
  requestListener(req:IncomingMessage, res:ServerResponse):void
  Throws TypeError if invalid args

http.Server.listen(port:number, hostname?:string, backlog?:number, callback?:()=>void) -> http.Server
  port: integer [0..65535]
  hostname: string (default '0.0.0.0')
  backlog: integer (default OS)
  callback: void-returning
  Throws Error on invalid port or host

IncomingMessage extends Readable
  url:string
  method:string
  headers:IncomingHttpHeaders
  socket:net.Socket
  on('data',chunk)
  on('end')

ServerResponse extends Writable
  statusCode:number
  setHeader(name:string,value:string|string[]):void
  getHeader(name:string):string|string[]|undefined
  removeHeader(name:string):void
  write(chunk:Buffer|string, encoding?:string):boolean
  end(data?:Buffer|string, encoding?:string, callback?:()=>void):void
  on('close')

Best Practices
• Handle server 'error' event: server.on('error',(err)=>{if(err.code==='EADDRINUSE'){console.error('Port in use');process.exit(1);} });
• Close server gracefully: server.close(callback)
• Use environment variables for port and host: const port=Number(process.env.PORT)||3000

Troubleshooting
EADDRINUSE
  $ lsof -i :3000
  COMMAND   PID USER   ...
  node     1234 user   ...
  $ kill 1234
Server not starting
  Verify Node.js version: $ node --version -> v24.0.1
  Verify file permissions: ls -l server.mjs


## Information Dense Extract
node [opts] [V8 opts] [script| -e] [args]
http.createServer(options?:{allowHalfOpen=false,pauseOnConnect=false},requestListener?:(req, res)=>void):Server
Server.listen(port:number,hostname='0.0.0.0',backlog=OS,callback?):Server
IncomingMessage: url, method, headers, socket, on('data'), on('end')
ServerResponse: statusCode, setHeader(), getHeader(), removeHeader(), write(), end(), on('close')
Example: createServer((req,res)=>{res.writeHead(200,{'Content-Type':'text/plain'});res.end('Hello World!\n')}).listen(3000,'127.0.0.1',()=>console.log('Listening'));

## Sanitised Extract
Table of Contents
1. Command-Line Invocation
2. HTTP.createServer Signature
3. http.Server.listen Signature
4. requestListener: IncomingMessage and ServerResponse
5. Hello World Server Code

1. Command-Line Invocation
node [options] [V8 options] [ script.js | -e 'script' | - ] [ arguments ]
Common options: --inspect, -r/--require, --experimental-modules, --trace-warnings

2. HTTP.createServer Signature
createServer(options?:{allowHalfOpen?:boolean;pauseOnConnect?:boolean}, requestListener?:(req:IncomingMessage,res:ServerResponse)=>void):Server
options.allowHalfOpen default false
options.pauseOnConnect default false
Throws TypeError on invalid args

3. http.Server.listen Signature
server.listen(port:number, hostname?:string, backlog?:number, callback?:()=>void):Server
hostname default '0.0.0.0', backlog default OS (511)
Throws Error on invalid port/host

4. requestListener: IncomingMessage and ServerResponse
req.url:string
req.method:string
req.headers:IncomingHttpHeaders
req.on('data',chunk)
req.on('end')
res.statusCode:number
res.setHeader(name,value)
res.getHeader(name)
res.removeHeader(name)
res.write(chunk[,encoding]):boolean
res.end([data],[encoding],[callback])

5. Hello World Server Code
import { createServer } from 'node:http';
const server = createServer((req,res)=>{res.writeHead(200,{'Content-Type':'text/plain'});res.end('Hello World!'n');});
server.listen(3000,'127.0.0.1',()=>console.log('Listening on 127.0.0.1:3000'));

## Original Source
Node.js Core Modules
https://nodejs.org/api/

## Digest of HTTP_SERVER

# HTTP Server Example (Node.js v24.0.1)

Date Retrieved: 2024-07-01
Source: https://nodejs.org/api/, Data Size: 4137052 bytes, Links Found: 3253

# Command-Line Invocation

node [options] [V8 options] [ script.js | -e "script" | - ] [ arguments ]

Common options:
  --inspect[=[host:]port]    activate debugger on start
  -r, --require module        preload module at startup
  --experimental-modules      enable ECMAScript module support
  --trace-warnings            print stack trace on process emitWarning()

# HTTP.createServer

Signature:
  createServer(
    options?: {
      allowHalfOpen?: boolean;      // default: false
      pauseOnConnect?: boolean;     // default: false
    },
    requestListener?: (req: http.IncomingMessage, res: http.ServerResponse) => void
  ): http.Server

Returns:
  http.Server instance bound to event handlers.

Throws:
  TypeError if options is not an object or requestListener is not a function.

# http.Server.listen

Signature:
  server.listen(
    port: number,
    hostname?: string,
    backlog?: number,
    callback?: () => void
  ): http.Server

Defaults:
  hostname: '0.0.0.0'
  backlog: OS default (usually 511)

Returns:
  http.Server

Throws:
  Error if port is not integer in [0, 65535] or host is invalid.

# requestListener callback

Signature:
  (req: http.IncomingMessage, res: http.ServerResponse) => void

IncomingMessage methods/properties:
  url: string
  method: string
  headers: IncomingHttpHeaders
  socket: net.Socket
  event 'data', 'end'
  req.on('data', chunk: Buffer|string)
  req.on('end', )

ServerResponse methods:
  statusCode: number
  setHeader(name: string, value: string|string[]): void
  getHeader(name: string): string|string[]|undefined
  removeHeader(name: string): void
  write(chunk: Buffer|string, encoding?: string): boolean
  end(data?: Buffer|string, encoding?: string, callback?: ()=>void): void
  event 'close'

# Hello World Server Code

```javascript
import { createServer } from 'node:http';

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World!\n');
});

server.listen(3000, '127.0.0.1', () => {
  console.log('Listening on 127.0.0.1:3000');
});
```


## Attribution
- Source: Node.js Core Modules
- URL: https://nodejs.org/api/
- License: License: CC BY 4.0
- Crawl Date: 2025-05-13T18:30:11.998Z
- Data Size: 4137052 bytes
- Links Found: 3253

## Retrieved
2025-05-13
