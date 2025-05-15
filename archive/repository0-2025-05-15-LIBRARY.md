sandbox/library/ES_MODULES.md
# sandbox/library/ES_MODULES.md
# ES_MODULES

## Crawl Summary
Explicit ES module markers: .mjs, package.json type:module, --input-type=module. Relative specifiers require extension. Bare specifiers resolved via node_modules and exports field. Absolute via file: URLs. Supported URL schemes: file, data, node. Import attributes: with { type:'json' } required for JSON modules. import.meta properties: url:string, dirname:string, filename:string, resolve(specifier):string. ES↔CJS interop: default export = module.exports, named exports via static analysis, dynamic import() in CJS, module.createRequire for CJS in ESM. JSON modules: default only, cached. Wasm modules behind flag, support instance and source-phase imports. Top-level await allowed. Resolution algorithm: ESM_RESOLVE→URL/relative/imports/bare, returns format and URL, errors on invalid specifiers, missing files, unsupported directories, bad package exports/imports.

## Normalised Extract
Table of Contents
1. Enabling ES Modules
2. Import Specifiers
3. URL Schemes
4. Import Attributes
5. import.meta API
6. CommonJS Interoperability
7. JSON Modules
8. Wasm Modules
9. Top-Level Await
10. Resolution Algorithm

1. Enabling ES Modules
Markers:
  • .mjs extension
  • package.json: "type": "module"
  • CLI flag --input-type=module
Inverse for CJS:
  • .cjs | "type":"commonjs" | --input-type=commonjs

2. Import Specifiers
Relative:
  import X from './file.js'
Bare:
  import X from 'pkg'
Absolute:
  import X from 'file:///abs/path.js'

3. URL Schemes
file: → local FS URLs (use url.pathToFileURL)
data: → text/javascript, application/json, application/wasm
node: → builtin modules (import fs from 'node:fs')

4. Import Attributes
import data from './foo.json' with { type: 'json' }
await import('./foo.json', { with: { type: 'json' } })

5. import.meta API
import.meta.url returns module file URL
import.meta.dirname returns directory path
import.meta.filename returns file path
import.meta.resolve(specifier) → absolute URL string

6. CommonJS Interoperability
import cjsDefault from 'cjs-module'
import { named } from 'cjs-module'
const req = module.createRequire(import.meta.url)
const cjs = req('./cjs.cjs')

7. JSON Modules
import cfg from './config.json' with { type: 'json' }
exports: default only
cache: shared with CJS

8. Wasm Modules
node --experimental-wasm-modules index.mjs
import * as M from './lib.wasm'
import source mod from './lib.wasm'
const inst = await WebAssembly.instantiate(mod, imports)

9. Top-Level Await
export const data = await fetchData()
Node exit code 13 on unresolved promises

10. Resolution Algorithm
Call: ESM_RESOLVE(specifier, parentURL)
Steps:
  1. If valid URL → normalize
  2. If startsWith './', '../', or '/' → resolve URL
  3. If startsWith '#' → PACKAGE_IMPORTS_RESOLVE
  4. Else → PACKAGE_RESOLVE
Output: { format: 'module'|'commonjs'|'json'|'wasm'|'addon', resolvedURL }
Error types: Invalid Module Specifier, Module Not Found, Unsupported Directory Import, Invalid Package Configuration, Package Path Not Exported, Package Import Not Defined

## Supplementary Details
package.json examples:
{
  "type": "module",
  "dependencies": { }
}

CLI usage:
node --input-type=module file.js
node --input-type=commonjs file.cjs

Dynamic import in CJS:
(async () => {
  const mod = await import('./esm.mjs');
  console.log(mod);
})();

module.createRequire:
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const cjsLib = require('./lib.cjs');

URL import example:
import data from new URL('./data.txt', import.meta.url);

Error reproduction:
> import x from './file'
SyntaxError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension "." on file ./file
Fix: add extension or set "type": "module".


## Reference Details
import.meta.resolve(specifier: string): string
  • specifier: module specifier
  • returns: absolute URL string

createRequire(path: string): NodeRequire
  • path: file path or URL string
  • returns: require function with resolve, cache, extensions

Dynamic import:
Promise<any> import(modulePath)
  • returns module namespace object

JSON import attributes:
with: { type: 'json' }
  • mandatory for JSON

Top-level await:
allowed at module root

Wasm modules:
--experimental-wasm-modules flag required
import * as M from './mod.wasm'
import source M from './mod.wasm'

Resolution errors and codes:
ERR_INVALID_MODULE_SPECIFIER
ERR_MODULE_NOT_FOUND
ERR_UNSUPPORTED_DIR_IMPORT
ERR_INVALID_PACKAGE_CONFIG
ERR_PACKAGE_PATH_NOT_EXPORTED
ERR_PACKAGE_IMPORT_NOT_DEFINED

Best practice:
Always include file extensions on imports
Use package.json "type" field for .js modules
Cache JSON modules via import attributes
Use import.meta.resolve for cross-platform paths
Use module.createRequire to access CJS-only APIs

Troubleshooting commands:
node --trace-warnings esm-example.mjs  # show ESM warnings
node --input-type=module --trace-resolution file.js  # debug resolution


## Information Dense Extract
ESM markers: .mjs | package.json type:module | --input-type=module. Specifiers: relative(./x.js), bare(pkg[/sub]), absolute(file:///). URLs: file, data(MIME: js|json|wasm), node. Import attributes: with { type: 'json' }. import.meta: url, dirname, filename, resolve(specifier). CJS interop: import default=module.exports, named via static analysis, dynamic import() in CJS, module.createRequire(import.meta.url). JSON modules: default only, cached. Wasm: --experimental-wasm-modules, import * as M, import source. Top-level await allowed, unresolved exit 13. Resolution: ESM_RESOLVE→URL/relative/imports/bare→format via extension or package.json type→errors: ERR_INVALID_MODULE_SPECIFIER, ERR_MODULE_NOT_FOUND, ERR_UNSUPPORTED_DIR_IMPORT, ERR_INVALID_PACKAGE_CONFIG, ERR_PACKAGE_PATH_NOT_EXPORTED, ERR_PACKAGE_IMPORT_NOT_DEFINED.

## Sanitised Extract
Table of Contents
1. Enabling ES Modules
2. Import Specifiers
3. URL Schemes
4. Import Attributes
5. import.meta API
6. CommonJS Interoperability
7. JSON Modules
8. Wasm Modules
9. Top-Level Await
10. Resolution Algorithm

1. Enabling ES Modules
Markers:
   .mjs extension
   package.json: 'type': 'module'
   CLI flag --input-type=module
Inverse for CJS:
   .cjs | 'type':'commonjs' | --input-type=commonjs

2. Import Specifiers
Relative:
  import X from './file.js'
Bare:
  import X from 'pkg'
Absolute:
  import X from 'file:///abs/path.js'

3. URL Schemes
file:  local FS URLs (use url.pathToFileURL)
data:  text/javascript, application/json, application/wasm
node:  builtin modules (import fs from 'node:fs')

4. Import Attributes
import data from './foo.json' with { type: 'json' }
await import('./foo.json', { with: { type: 'json' } })

5. import.meta API
import.meta.url returns module file URL
import.meta.dirname returns directory path
import.meta.filename returns file path
import.meta.resolve(specifier)  absolute URL string

6. CommonJS Interoperability
import cjsDefault from 'cjs-module'
import { named } from 'cjs-module'
const req = module.createRequire(import.meta.url)
const cjs = req('./cjs.cjs')

7. JSON Modules
import cfg from './config.json' with { type: 'json' }
exports: default only
cache: shared with CJS

8. Wasm Modules
node --experimental-wasm-modules index.mjs
import * as M from './lib.wasm'
import source mod from './lib.wasm'
const inst = await WebAssembly.instantiate(mod, imports)

9. Top-Level Await
export const data = await fetchData()
Node exit code 13 on unresolved promises

10. Resolution Algorithm
Call: ESM_RESOLVE(specifier, parentURL)
Steps:
  1. If valid URL  normalize
  2. If startsWith './', '../', or '/'  resolve URL
  3. If startsWith '#'  PACKAGE_IMPORTS_RESOLVE
  4. Else  PACKAGE_RESOLVE
Output: { format: 'module'|'commonjs'|'json'|'wasm'|'addon', resolvedURL }
Error types: Invalid Module Specifier, Module Not Found, Unsupported Directory Import, Invalid Package Configuration, Package Path Not Exported, Package Import Not Defined

## Original Source
Node.js ESM Modules
https://nodejs.org/api/esm.html

## Digest of ES_MODULES

# Enabling

Node.js interprets modules as ES modules when any of the following explicit markers are present:

• File extension ".mjs"
• package.json field "type": "module"
• CLI flag --input-type=module

Inverse markers for CommonJS:

• File extension ".cjs"
• package.json field "type": "commonjs"
• CLI flag --input-type=commonjs

Example:

node --input-type=module index.mjs

# Import Specifiers

Three specifier types supported by `import`:

Relative:
• ./file.js | ../dir/file.mjs (extension mandatory, directories fully specified)

Bare:
• "pkg" | "pkg/sub.js" (resolved via node_modules and exports field)

Absolute:
• file:///path/to/file.js

# URL Schemes

Supported:
• file: URLs (use url.pathToFileURL for paths)
• data: URLs (v12.10.0+) with MIME types text/javascript, application/json, application/wasm
• node: URLs for builtin modules (v12.20.0+)

Remarks:
• file URLs with differing query or fragment load distinct modules
• data: imports support only bare or absolute specifiers for builtins

# Import Attributes

Syntax:

import jsonData from './data.json' with { type: 'json' }
await import('./data.json', { with: { type: 'json' } })

Supported attribute:
• type: 'json' (mandatory for JSON modules)

# import.meta

Properties (ES modules only):

import.meta.url  → string  // absolute file: URL of the module
import.meta.dirname → string  // directory name (v20.11.0+, file: only)
import.meta.filename → string  // absolute path with symlinks resolved (v20.11.0+)
import.meta.resolve(specifier: string) → string  // resolved absolute URL

# Interoperability with CommonJS

• `import` in ES modules can load CJS:
  - default export = module.exports
  - named exports from static analysis (cjs-module-lexer)

• Dynamic `import()` works in CJS to load ES modules

• `module.createRequire(path: string): NodeRequire` for CJS methods in ESM

# JSON Modules

import config from './package.json' with { type: 'json' }

• default export only
• cached in CJS cache for deduplication

# Wasm Modules (Experimental)

Flags: --experimental-wasm-modules

Instance imports:
import * as M from './lib.wasm'

Source phase imports (v24.0.0+):
import source mod from './lib.wasm'
const inst = await WebAssembly.instantiate(mod, imports)

# Top-Level Await

• Allowed in ES modules (v14.8.0+)
• Unresolved await causes exit code 13

# Resolution and Loading Algorithm

Features:
• FileURL-based resolution
• No default extensions or folder mains
• Bare specifier lookup via node_modules and package.json exports
• Loader supports file:, data:, node: URLs only

Resolution routine ESM_RESOLVE(specifier, parentURL) returns { format, resolvedURL }
• Valid URL → parse and normalize
• Relative (./, ../, /) → URL resolution
• # imports → PACKAGE_IMPORTS_RESOLVE
• Otherwise bare → PACKAGE_RESOLVE

Format from extension or package.json "type"

Errors:
Invalid Module Specifier, Module Not Found, Unsupported Directory Import,
Invalid Package Configuration, Package Path Not Exported, Package Import Not Defined

## Attribution
- Source: Node.js ESM Modules
- URL: https://nodejs.org/api/esm.html
- License: License: CC BY 4.0
- Crawl Date: 2025-05-13T12:31:52.630Z
- Data Size: 4210035 bytes
- Links Found: 3241

## Retrieved
2025-05-13
sandbox/library/HTTP_SERVER.md
# sandbox/library/HTTP_SERVER.md
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
sandbox/library/CHAT_COMPLETIONS.md
# sandbox/library/CHAT_COMPLETIONS.md
# CHAT_COMPLETIONS

## Crawl Summary
Endpoint POST /v1/chat/completions. Required: model(string), messages(array of {role,content,name?,function_call?}). Optional: temperature(0–2.0 default1.0), top_p(0–1 default1.0), n(int default1), stream(bool default false), stop(string|array), max_tokens(int), presence_penalty(-2.0–2.0 default0.0), frequency_penalty(-2.0–2.0 default0.0), logit_bias(map tokenId->bias), user(string), functions(array of {name,description,parameters}), function_call("none"|"auto"|{name}). Response: id,string; object,string; created,integer; model,string; usage:{prompt_tokens,completion_tokens,total_tokens}; choices:[{index,message:{role,content,name?,function_call?},finish_reason}].

## Normalised Extract
Table of Contents:
1. Endpoint Definition
2. Required Parameters
3. Optional Parameters
4. Response Structure
5. Error Handling

1. Endpoint Definition
URL: POST https://api.openai.com/v1/chat/completions
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

2. Required Parameters
model: string — model identifier (e.g., gpt-4, gpt-3.5-turbo)
messages: array of message objects. Each message: role:string (system|user|assistant|function), content:string, name?:string, function_call?:object

3. Optional Parameters
temperature: number [0.0,2.0] default 1.0
top_p: number [0.0,1.0] default 1.0
n: integer ≥1 default 1
stream: boolean default false
stop: string or array of strings default null
max_tokens: integer default model max
tpresence_penalty: number [-2.0,2.0] default 0.0
frequency_penalty: number [-2.0,2.0] default 0.0
logit_bias: object mapping token ID to integer bias [-100,100] default {}
user: string default null
functions: array of {name:string,description:string,parameters:JSONSchema} default none
function_call: "none"|"auto"|{name:string} default "none"

4. Response Structure
id: string
object: string = "chat.completion"
created: integer (unix timestamp)
model: string
usage: {prompt_tokens:int, completion_tokens:int, total_tokens:int}
choices: array of {index:int, message:{role:string, content:string, name?:string, function_call?:object}, finish_reason:string}

5. Error Handling
HTTP 400–499: client errors with JSON {error:{message:string, type:string, param:string|null, code:string|null}}
HTTP 401: invalid API key
HTTP 429: rate limit, implement exponential backoff
HTTP 500–599: server errors, retry with backoff

## Supplementary Details
Model IDs: gpt-4, gpt-4-0613, gpt-3.5-turbo, gpt-3.5-turbo-0613.
Max context tokens: 8192 for gpt-4, 4096 for gpt-3.5-turbo.
Rate limits: 3500 requests/min for gpt-3.5-turbo; 300 requests/min for gpt-4. Use client-side rate limiter.
Token counting: use tiktoken. Each message adds overhead: system/user/assistant role token count + content tokens.
Function calling: define functions array; to auto-invoke let function_call=auto; if the model returns function_call in response. Then send new request with updated messages including function call result.
Best practice: include system message first. Prune oldest user-assistant pairs when exceeding max_tokens - max_tokens parameter.
Logging: log usage.total_tokens for cost tracking. Set up counters per user.


## Reference Details
cURL Example:
curl https://api.openai.com/v1/chat/completions \
 -H "Authorization: Bearer $OPENAI_API_KEY" \
 -H "Content-Type: application/json" \
 -d '{"model":"gpt-3.5-turbo","messages":[{"role":"system","content":"You are helpful."},{"role":"user","content":"Hello!"}],"temperature":0.7,"max_tokens":100}'

Node.js SDK Example:
import OpenAI from "openai";
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
const res = await openai.chat.completions.create({
 model: "gpt-3.5-turbo",
 messages: [
   {role: "system", content: "You are a helpful assistant."},
   {role: "user", content: "Translate 'Hello' to French."}
 ],
 temperature: 0.3,
 max_tokens: 50,
 stream: false
});
console.log(res.choices[0].message.content);

SDK Method Signature:
create(params: {
 model: string;
 messages: Array<{role: string; content: string; name?: string; function_call?: object}>;
 temperature?: number;
 top_p?: number;
 n?: number;
 stream?: boolean;
 stop?: string|string[];
 max_tokens?: number;
 presence_penalty?: number;
 frequency_penalty?: number;
 logit_bias?: Record<string, number>;
 user?: string;
 functions?: Array<{name: string; description: string; parameters: object}>;
 function_call?: string|{name: string};
}): Promise<{
 id: string;
 object: string;
 created: number;
 model: string;
 usage: {prompt_tokens: number; completion_tokens: number; total_tokens: number};
 choices: Array<{
   index: number;
   message: {role: string; content: string; name?: string; function_call?: object};
   finish_reason: string;
 }>;
}>;

Troubleshooting Procedures:
1. Rate Limit Errors (429): implement exponential backoff: wait intervals [1s,2s,4s,8s,16s], max 5 retries.
2. Authentication Errors (401): verify OPENAI_API_KEY is set; run `echo $OPENAI_API_KEY`.
3. Validation Errors (400): inspect error.param and error.message in response. Example: missing messages array.
4. JSON Parse Errors: ensure payload is valid JSON. Test via `curl -i` to inspect headers and body.
5. Token Limit Errors: if total_tokens > model context, reduce message length or lower max_tokens. Check usage.total_tokens.

Configuration Options:
- TIMEOUT: custom request timeout in ms, default 60_000.
- RETRY_COUNT: default 3.
- LOG_LEVEL: info|warn|error, default info.
- PROXY: http(s) proxy URL.

Best Practices:
- Always include system message for context.
- Use streaming for low-latency use cases: handle server-sent events.
- Monitor usage.total_tokens for cost insights.
- Pre-validate function_call schema client-side using JSON schema validation.



## Information Dense Extract
POST /v1/chat/completions Authorization:Bearer token JSON body: {model:string,messages:[{role:(system|user|assistant|function),content:string,name?:string,function_call?:object}],temperature:float0–2=1,top_p:float0–1=1,n:int=1,stream:bool=false,stop:string|string[]=null,max_tokens:int,presence_penalty:float-2–2=0,frequency_penalty:float-2–2=0,logit_bias:{tokenId:int-100–100},user:string,functions:[{name:string,description:string,parameters:JSONSchema}],function_call:"none"|"auto"|{name:string}}. Response: {id:string,object:string,created:int,model:string,usage:{prompt_tokens:int,completion_tokens:int,total_tokens:int},choices:[{index:int,message:{role:string,content:string,name?:string,function_call?:object},finish_reason:string}]}. SDK: openai.chat.completions.create(params):Promise<response>. cURL and Node.js examples above. Rate limit 429→exponential backoff. Context limits: gpt-4 8192, gpt-3.5-turbo 4096 tokens. JSON schema validation for functions. Logging usage.total_tokens. Use system prompts. Prune messages to fit context. Streaming via SSE. Troubleshoot 400,401,429,500 with status code checks.

## Sanitised Extract
Table of Contents:
1. Endpoint Definition
2. Required Parameters
3. Optional Parameters
4. Response Structure
5. Error Handling

1. Endpoint Definition
URL: POST https://api.openai.com/v1/chat/completions
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

2. Required Parameters
model: string  model identifier (e.g., gpt-4, gpt-3.5-turbo)
messages: array of message objects. Each message: role:string (system|user|assistant|function), content:string, name?:string, function_call?:object

3. Optional Parameters
temperature: number [0.0,2.0] default 1.0
top_p: number [0.0,1.0] default 1.0
n: integer 1 default 1
stream: boolean default false
stop: string or array of strings default null
max_tokens: integer default model max
tpresence_penalty: number [-2.0,2.0] default 0.0
frequency_penalty: number [-2.0,2.0] default 0.0
logit_bias: object mapping token ID to integer bias [-100,100] default {}
user: string default null
functions: array of {name:string,description:string,parameters:JSONSchema} default none
function_call: 'none'|'auto'|{name:string} default 'none'

4. Response Structure
id: string
object: string = 'chat.completion'
created: integer (unix timestamp)
model: string
usage: {prompt_tokens:int, completion_tokens:int, total_tokens:int}
choices: array of {index:int, message:{role:string, content:string, name?:string, function_call?:object}, finish_reason:string}

5. Error Handling
HTTP 400499: client errors with JSON {error:{message:string, type:string, param:string|null, code:string|null}}
HTTP 401: invalid API key
HTTP 429: rate limit, implement exponential backoff
HTTP 500599: server errors, retry with backoff

## Original Source
OpenAI Chat Completions API Reference
https://platform.openai.com/docs/api-reference/chat

## Digest of CHAT_COMPLETIONS

# OpenAI Chat Completions API Reference
Date retrieved: 2024-06-15
Data Size: 0 bytes
Links Found: 0

# HTTP Request
POST https://api.openai.com/v1/chat/completions

# Request Parameters
| Name             | Type                       | Required | Description                                                                                       | Default |
|------------------|----------------------------|----------|---------------------------------------------------------------------------------------------------|---------|
| model            | string                     | yes      | ID of the model to use (e.g., "gpt-4", "gpt-3.5-turbo")                                        | —       |
| messages         | array of message objects   | yes      | List of messages forming the conversation. Each message: {role: string, content: string, name?: string, function_call?: object} | —       |
| temperature      | number (float)             | no       | Sampling temperature between 0.0 and 2.0. Higher values produce more random outputs.               | 1.0     |
| top_p            | number (float)             | no       | Nucleus sampling probability mass.                                                               | 1.0     |
| n                | integer                    | no       | Number of completions to generate for each input.                                                 | 1       |
| stream           | boolean                    | no       | If true, partial message deltas will be sent as data-only server-sent events.                     | false   |
| stop             | string or array of strings | no       | Up to 4 sequences where the API will stop generating further tokens.                              | null    |
| max_tokens       | integer                    | no       | Maximum number of tokens to generate in the completion.                                           | (model default) |
| presence_penalty | number (float)             | no       | Positive penalty decreases the model’s likelihood to talk about new topics. Range –2.0 to 2.0.     | 0.0     |
| frequency_penalty| number (float)             | no       | Positive penalty decreases the model's likelihood to repeat the same line verbatim. Range –2.0 to 2.0.| 0.0  |
| logit_bias       | map<string,int>            | no       | Modify likelihood of specified tokens. Map token ID to bias value between –100 and 100.            | {}      |
| user             | string                     | no       | A unique identifier for the end-user, helps OpenAI monitor and detect abuse.                       | null    |
| functions        | array of function objects  | no       | Definitions for function calling: {name: string, description: string, parameters: JSON schema}.    | none    |
| function_call    | string or object           | no       | Controls function calling. "none": no call, "auto": let model decide, or {name: string} to force a call.| "none" |

# Response
```json
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "gpt-3.5-turbo-0301",
  "usage": {
    "prompt_tokens": 13,
    "completion_tokens": 7,
    "total_tokens": 20
  },
  "choices": [
    {
      "index": 0,
      "message": {"role": "assistant", "content": "Hello there!"},
      "finish_reason": "stop"
    }
  ]
}
```

# SDK Method Signature (Node.js)
```js
openai.chat.completions.create({
  model: string,
  messages: Array<{role: string, content: string, name?: string, function_call?: object}>,
  temperature?: number,
  top_p?: number,
  n?: number,
  stream?: boolean,
  stop?: string|string[],
  max_tokens?: number,
  presence_penalty?: number,
  frequency_penalty?: number,
  logit_bias?: Record<string, number>,
  user?: string,
  functions?: Array<{name: string, description: string, parameters: object}>,
  function_call?: string|{name: string}
}): Promise<ChatCompletion>
```

## Attribution
- Source: OpenAI Chat Completions API Reference
- URL: https://platform.openai.com/docs/api-reference/chat
- License: License: OpenAI API Terms
- Crawl Date: 2025-05-13T00:40:03.758Z
- Data Size: 0 bytes
- Links Found: 0

## Retrieved
2025-05-13
sandbox/library/VITEST_API.md
# sandbox/library/VITEST_API.md
# VITEST_API

## Crawl Summary
Definitions: Awaitable<T>, TestFunction, TestOptions
test(), test.skip/.only/.concurrent/.sequential/.todo/.fails/.each/.for
bench(), bench.skip/.only/.todo
Hooks: beforeEach/afterEach/beforeAll/afterAll/onTestFinished/onTestFailed

## Normalised Extract
Contents:
1. Type Aliases & Interfaces
   a. Awaitable<T>: T | PromiseLike<T>
   b. TestFunction: () => Awaitable<void>
   c. TestOptions: {timeout?: number, retry?: number (default 0), repeats?: number (default 0)}
2. Test Functions
   a. test(name: string, fn: TestFunction, timeout?: number)
      - Default timeout 5000ms, positional timeout disallowed with options.
   b. test(name: string, options: TestOptions, fn: TestFunction)
   c. Modifiers: skip, only, concurrent, sequential, todo, fails
   d. Data-driven: test.each(cases)(namePattern: string, fn: (...args) => void), test.for(cases)(namePattern, fn)
3. Benchmarks
   a. bench(name: string, fn: BenchFunction, options?: BenchOptions)
   b. BenchOptions: time (ms, default 500), iterations (default 10), warmupTime (ms, default 100), warmupIterations (default 5), now(), signal, throws, setup(), teardown()
4. Suite Organization
   a. describe(name: string, fn: () => void)
   b. Modifiers: skip, skipIf(cond), runIf(cond), only, concurrent, sequential, shuffle, todo
   c. Data-driven: describe.each/for
5. Hooks
   a. beforeEach(fn, timeout?), afterEach(fn, timeout?), beforeAll(fn, timeout?), afterAll(fn, timeout?)
6. Test Context Hooks
   a. onTestFinished(callback)
   b. onTestFailed(callback)

Detailed:
1.a. Awaitable: generic union.
1.b. TestFunction signature.
1.c. TestOptions fields with defaults.
2.a. test(): signature; constraints; example.
2.b. test() with options: exact ordering.
2.c. Modifiers chainable: skip, only, concurrent, sequential, todo, fails.
2.d. test.each: printf patterns: %s, %d, %i, %f, %j, %o, %#, %$, %%; $foo inject. For arrays, spreads. test.for: no spread of array.
3.a. bench(): signature. Tinybench under the hood.
3.b. BenchOptions exact field names and defaults.
4.a. describe(): grouping; implicit suite.
4.b. Suite modifiers with alias: suite.skip, suite.skipIf, suite.runIf, suite.only, suite.concurrent, suite.sequential, suite.shuffle, suite.todo.
4.c. describe.each/for: similar to test.
5.a. Lifecycle hooks signatures with optional timeouts.
6.a/b. onTestFinished/Failed: signatures, usage patterns.


## Supplementary Details
Parameter Defaults and Effects:
- test timeout default: 5000ms; set via --testTimeout or config.sequence.timeout
- retry default 0; repeats default 0; unlimited only via object.
- bench time default: 500ms; iterations 10; warmupTime 100ms; warmupIterations 5.
- describe.shuffle order randomized by config.sequence.seed or flag --sequence.shuffle.
- Hooks optional cleanup return functions: beforeEach/beforeAll can return cleanup to be invoked after scope.
Implementation Steps:
1. Install Vitest: npm install -D vitest
2. Add script: "test": "vitest"
3. Create test files: *.test.ts or *.spec.ts
4. Import APIs: import { test, expect, describe, bench, beforeEach,... } from 'vitest'
5. Configure vitest.config.ts for global options:
   export default {
     test: { timeout: 10000, globalSetup: '', sequence: { concurrent: true, shuffle: true } },
     bench: { time: 2000 }
   }
6. Run tests: npx vitest
7. For CI, use --run flag.


## Reference Details
// Full API Signatures

// Type Aliases
export type Awaitable<T> = T | PromiseLike<T>
export type TestFunction = () => Awaitable<void>

export interface TestOptions {
  timeout?: number
  retry?: number
  repeats?: number
}

// Test API
export function test(name: string, fn: TestFunction, timeout?: number): void
export function test(name: string, options: TestOptions, fn: TestFunction): void
export namespace test {
  function skip(name: string, fn: TestFunction): void
  function only(name: string, fn: TestFunction): void
  function concurrent(name: string, fn: TestFunction, timeout?: number): void
  function sequential(name: string, fn: TestFunction): void
  function todo(name: string): void
  function fails(name: string, fn: TestFunction): void
  function each<T extends any[]>(cases: readonly T[]): (name: string, fn: (...args: T) => void) => void
  function for<T extends any[]>(cases: readonly T[]): (name: string, fn: (args: T) => void) => void
  function skipIf(cond: boolean): (name: string, fn: TestFunction) => void
  function runIf(cond: boolean): (name: string, fn: TestFunction) => void
}

// Suite API
export function describe(name: string, fn: () => void): void
export namespace describe {
  function skip(name: string, fn: () => void): void
  function skipIf(cond: boolean): (name: string, fn: () => void) => void
  function runIf(cond: boolean): (name: string, fn: () => void) => void
  function only(name: string, fn: () => void): void
  function concurrent(name: string, fn: () => void): void
  function sequential(name: string, fn: () => void): void
  function shuffle(name: string, options: { shuffle: boolean } , fn: () => void): void
  function todo(name: string): void
  function each<T extends any[]>(cases: readonly T[]): (name: string, fn: (...args: T) => void) => void
  function for<T extends any[]>(cases: readonly T[]): (name: string, fn: (args: T) => void) => void
}

// Hooks
export function beforeEach(fn: () => Awaitable<void>, timeout?: number): void
export function afterEach(fn: () => Awaitable<void>, timeout?: number): void
export function beforeAll(fn: () => Awaitable<void>, timeout?: number): void
export function afterAll(fn: () => Awaitable<void>, timeout?: number): void

// Test Context Hooks
export function onTestFinished(callback: () => void): void
export function onTestFailed(callback: (ctx: { task: TaskResult }) => void): void

// Bench API
export type BenchFunction = () => Awaitable<void>
export interface BenchOptions {
  time?: number
  iterations?: number
  now?: () => number
  signal?: AbortSignal
  throws?: boolean
  warmupTime?: number
  warmupIterations?: number
  setup?: () => Awaitable<void>
  teardown?: () => Awaitable<void>
}
export function bench(name: string, fn: BenchFunction, options?: BenchOptions): void
export namespace bench {
  function skip(name: string, fn: BenchFunction, options?: BenchOptions): void
  function only(name: string, fn: BenchFunction, options?: BenchOptions): void
  function todo(name: string): void
}

// TaskResult
export interface TaskResult {
  error?: unknown
  totalTime: number
  min: number
  max: number
  hz: number
  period: number
  samples: number[]
  mean: number
  variance: number
  sd: number
  sem: number
  df: number
  critical: number
  moe: number
  rme: number
  mad: number
  p50: number
  p75: number
  p99: number
  p995: number
  p999: number
}

// Code Examples

// test with fixture
import { test, expect } from 'vitest'

test.extend({
  db: async ({}, use) => {
    const conn = await connectDb()
    await use(conn)
    await conn.close()
  }
})('db test', async ({ db }) => {
  const rows = await db.query('SELECT * FROM users')
  expect(rows).toEqual([])
})

// CI invocation
$ npx vitest --run --reporter=dot

// Troubleshooting

// Increase default timeout if tests hang
export default { test: { timeout: 20000 }} in vitest.config.ts

// Debug concurrent leaks
$ npx vitest --run --detect-leaks

// Show coverage
$ npx vitest --coverage


## Information Dense Extract
Awaitable<T>=T|PromiseLike<T>;TestFunction=()=>Awaitable<void>;TestOptions{timeout?:number;retry?:number=0;repeats?:number=0};test(name,fn[,timeout]);test(name,opts,fn); modifiers: skip,only,concurrent[,timeout],sequential,todo,fails;data-driven: test.each(cases)(namePattern,fn(args));test.for(cases)(namePattern,fn([args]));bench(name,fn,opts{time?:number=500;iterations?:10;warmupTime?:100;warmupIterations?:5;now?;signal?;throws?;setup?;teardown?});suite: describe(name,fn); suite.skip/skipIf(cond)/runIf(cond)/only/concurrent/sequential/shuffle({shuffle:true|false})/todo; suite.each/for;hooks: beforeEach/afterEach/beforeAll/afterAll(fn[,timeout]);test ctx hooks: onTestFinished(cb);onTestFailed(cb);TaskResult{error?,totalTime,min,max,hz,period,samples[],mean,variance,sd,sem,df,critical,moe,rme,mad,p50,p75,p99,p995,p999}

## Sanitised Extract
Contents:
1. Type Aliases & Interfaces
   a. Awaitable<T>: T | PromiseLike<T>
   b. TestFunction: () => Awaitable<void>
   c. TestOptions: {timeout?: number, retry?: number (default 0), repeats?: number (default 0)}
2. Test Functions
   a. test(name: string, fn: TestFunction, timeout?: number)
      - Default timeout 5000ms, positional timeout disallowed with options.
   b. test(name: string, options: TestOptions, fn: TestFunction)
   c. Modifiers: skip, only, concurrent, sequential, todo, fails
   d. Data-driven: test.each(cases)(namePattern: string, fn: (...args) => void), test.for(cases)(namePattern, fn)
3. Benchmarks
   a. bench(name: string, fn: BenchFunction, options?: BenchOptions)
   b. BenchOptions: time (ms, default 500), iterations (default 10), warmupTime (ms, default 100), warmupIterations (default 5), now(), signal, throws, setup(), teardown()
4. Suite Organization
   a. describe(name: string, fn: () => void)
   b. Modifiers: skip, skipIf(cond), runIf(cond), only, concurrent, sequential, shuffle, todo
   c. Data-driven: describe.each/for
5. Hooks
   a. beforeEach(fn, timeout?), afterEach(fn, timeout?), beforeAll(fn, timeout?), afterAll(fn, timeout?)
6. Test Context Hooks
   a. onTestFinished(callback)
   b. onTestFailed(callback)

Detailed:
1.a. Awaitable: generic union.
1.b. TestFunction signature.
1.c. TestOptions fields with defaults.
2.a. test(): signature; constraints; example.
2.b. test() with options: exact ordering.
2.c. Modifiers chainable: skip, only, concurrent, sequential, todo, fails.
2.d. test.each: printf patterns: %s, %d, %i, %f, %j, %o, %#, %$, %%; $foo inject. For arrays, spreads. test.for: no spread of array.
3.a. bench(): signature. Tinybench under the hood.
3.b. BenchOptions exact field names and defaults.
4.a. describe(): grouping; implicit suite.
4.b. Suite modifiers with alias: suite.skip, suite.skipIf, suite.runIf, suite.only, suite.concurrent, suite.sequential, suite.shuffle, suite.todo.
4.c. describe.each/for: similar to test.
5.a. Lifecycle hooks signatures with optional timeouts.
6.a/b. onTestFinished/Failed: signatures, usage patterns.

## Original Source
vitest Testing Framework
https://vitest.dev/api/

## Digest of VITEST_API

# Vitest API Reference (retrieved 2023-08-01)

## Type Definitions

### Awaitable

```ts
// Accepts a value or a promise-like value
type Awaitable<T> = T | PromiseLike<T>
```

### TestFunction

```ts
// A function that returns void or a promise-like void
type TestFunction = () => Awaitable<void>
```

### TestOptions

```ts
interface TestOptions {
  /** maximum execution time in ms before failing */
  timeout?: number
  /** number of retries on failure; default: 0 */
  retry?: number
  /** number of repeats regardless of pass/fail; default: 0 */
  repeats?: number
}
```

## Test API Methods

### test(name: string, fn: TestFunction, timeout?: number): void

```ts
import { test } from 'vitest'

// default timeout: 5000ms
// 'timeout' as 3rd positional arg is disallowed when options object is provided
test('basic test', () => {
  // ... assertions
}, 5000)
```

### test(name: string, options: TestOptions, fn: TestFunction): void

```ts
// with options
test('heavy test', { timeout: 10000, retry: 2, repeats: 1 }, async () => {
  // async logic
})
```

### test.skip(name: string, fn: TestFunction): void
### test.only(name: string, fn: TestFunction): void
### test.concurrent(name: string, fn: AsyncTestFunction, timeout?: number): void
### test.sequential(name: string, fn: AsyncTestFunction): void
### test.todo(name: string): void
### test.fails(name: string, fn: TestFunction): void
### test.each(cases)(name: string, fn: (...args: any[]) => void): void
### test.for(cases)(name: string, fn: (args: any[]) => void): void

## Benchmark API

### bench(name: string, fn: BenchFunction, options?: BenchOptions): void

```ts
import { bench } from 'vitest'

bench('sort time', () => {
  [1,5,3,2].sort()
}, { time: 1000, iterations: 20, warmupTime: 100, warmupIterations:5 })
```

### BenchOptions

```ts
interface BenchOptions {
  time?: number    // ms, default 500
  iterations?: number // default 10
  now?: () => number
  signal?: AbortSignal
  throws?: boolean
  warmupTime?: number // default 100
  warmupIterations?: number // default 5
  setup?: () => Awaitable<void>
  teardown?: () => Awaitable<void>
}
```

## Test & Suite Hooks

```ts
beforeEach(fn: () => Awaitable<void>, timeout?: number)
afterEach(fn: () => Awaitable<void>, timeout?: number)
beforeAll(fn: () => Awaitable<void>, timeout?: number)
afterAll(fn: () => Awaitable<void>, timeout?: number)
```

### onTestFinished(callback: () => void)
Called after each test (post-afterEach), reverse order

### onTestFailed(callback: ({ task }) => void)
Called after failed test (post-afterEach)


## Attribution
- Source: vitest Testing Framework
- URL: https://vitest.dev/api/
- License: License: MIT
- Crawl Date: 2025-05-12T12:31:49.356Z
- Data Size: 41201758 bytes
- Links Found: 26607

## Retrieved
2025-05-12
sandbox/library/OPENAI_NODE_SDK.md
# sandbox/library/OPENAI_NODE_SDK.md
# OPENAI_NODE_SDK

## Crawl Summary
npm install openai
import OpenAI from 'openai';
const client = new OpenAI({ apiKey?:string, maxRetries?:number=2, timeout?:number=600000, httpAgent?:Agent });
responses.create(params:{ model:string; input:string; instructions?:string; stream?:boolean }, options?): Promise<{ output_text:string; _request_id:string }>
chat.completions.create(params:{ model:string; messages:Array<{ role:string; content:string }>; stream?:boolean }, options?): Promise<{ choices:Array<{ message:{ role:string; content:string } }>; _request_id:string }>
streaming via stream:true returns AsyncIterable<ServerSentEvent>
files.create({ file: ReadStream|File|Response|toFile(Buffer|Uint8Array,name); purpose:string })
Error subclasses by status, default retries on connection, 408,409,429,>=500 up to maxRetries, timeouts default10m, APIConnectionTimeoutError on timeout, all methods include _request_id, auto-pagination, realtime via OpenAIRealtimeWebSocket, AzureOpenAI class with azureADTokenProvider and apiVersion, custom requests via client.verb, fetch shims, custom fetch and logging, httpAgent for proxy, SemVer, Requirements.

## Normalised Extract
Table of Contents

1 Installation
2 Initialization
3 Responses API
4 Chat Completions API
5 Streaming Responses
6 File Uploads
7 Error Handling
8 Retries Configuration
9 Timeouts Configuration
10 Request ID Access
11 Pagination
12 Realtime API Beta
13 Azure OpenAI Integration
14 Custom/Undocumented Requests
15 Fetch Client Customization
16 Logging & Middleware
17 HTTP(S) Agent Configuration
18 Semantic Versioning Rules
19 Requirements

1 Installation
npm install openai

2 Initialization
import OpenAI from 'openai'
const client = new OpenAI({
 apiKey: process.env.OPENAI_API_KEY, // optional
 maxRetries: 2,                      // default
 timeout: 600000                     // default ms
})

3 Responses API
Signature:
responses.create(
 params: {
  model: string
  input: string
  instructions?: string
  stream?: boolean
 },
 options?: {
  maxRetries?: number
  timeout?: number
  httpAgent?: Agent
 }
): Promise<{
 output_text: string
 _request_id: string
}>
Usage:
const res = await client.responses.create({ model: 'gpt-4o', input: '…', instructions: '…' })
console.log(res.output_text)

4 Chat Completions API
Signature:
chat.completions.create(
 params: {
  model: string
  messages: Array<{ role: 'system'|'user'|'assistant'|'developer'; content: string }>
  stream?: boolean
 },
 options?: { maxRetries?: number; timeout?: number; httpAgent?: Agent }
): Promise<{
 choices: Array<{ message: { role: string; content: string } }>
 _request_id: string
}>
Usage:
const c = await client.chat.completions.create({
 model: 'gpt-4o',
 messages: [{ role: 'user', content: '…' }]
})
console.log(c.choices[0].message.content)

5 Streaming Responses
stream = await client.responses.create({ model: 'gpt-4o', input: '…', stream: true })
for await (const event of stream) console.log(event)

6 File Uploads
Acceptable inputs: fs.ReadStream | File | Response | toFile(Buffer,name) | toFile(Uint8Array,name)
client.files.create({ file: fs.createReadStream('f.jsonl'), purpose: 'fine-tune' })
client.files.create({ file: await toFile(Buffer.from('b'), 'f.jsonl'), purpose: 'fine-tune' })

7 Error Handling
Throws APIError subclasses:
 400 BadRequestError
 401 AuthenticationError
 403 PermissionDeniedError
 404 NotFoundError
 422 UnprocessableEntityError
 429 RateLimitError
 >=500 InternalServerError
 Connection issues: APIConnectionError

8 Retries Configuration
Default retries: 2 on connection failures, 408,409,429,>=500
Configure globally: new OpenAI({ maxRetries: x })
Per-request: method(params, { maxRetries: x })

9 Timeouts Configuration
Default: 600000ms
Configure globally: new OpenAI({ timeout: ms })
Per-request: method(params, { timeout: ms })
On timeout: throws APIConnectionTimeoutError and retries twice

10 Request ID Access
response._request_id
.or:
const { data, request_id } = await method.withResponse()

11 Pagination
Auto: for await (const item of client.x.y.list({ limit }))
Manual: let page = await client.x.y.list({ limit })
 while(page.hasNextPage()) { page = await page.getNextPage() }

12 Realtime API Beta
import { OpenAIRealtimeWebSocket } from 'openai/beta/realtime/websocket'
const rt = new OpenAIRealtimeWebSocket({ model: '…' })
rt.on('response.text.delta', e => process.stdout.write(e.delta))

13 Azure OpenAI Integration
import { AzureOpenAI } from 'openai'
const openai = new AzureOpenAI({ azureADTokenProvider: provider, apiVersion: '…' })
const r = await openai.chat.completions.create({ model: '…', messages: [{ role:'user',content:'…'}] })

14 Custom/Undocumented Requests
client.get('/path', { query:{}, body:{} })
client.post('/path', {...})
Use // @ts-expect-error for extra params

15 Fetch Client Customization
Global web fetch: import 'openai/shims/web'
Constructor: new OpenAI({ fetch: (url,init)=>Promise<Response> })

16 Logging & Middleware
new OpenAI({ fetch: async(u,i)=>{ console.log('req',u,i); r=await fetch(u,i); console.log('res',r); return r } })
Or DEBUG=true env logs all

17 HTTP(S) Agent Configuration
new OpenAI({ httpAgent: new HttpsProxyAgent(url) })
Per-request override: method(params, { httpAgent: new http.Agent({keepAlive:false}) })

18 Semantic Versioning Rules
Major: breaking runtime
Minor: breaking type-only or internal
Patch: fixes

19 Requirements
TypeScript>=4.5
Node.js>=18 LTS
Deno>=1.28.0
Bun>=1.0
Cloudflare Workers
Vercel Edge Runtime
Jest>=28 (node env)
Nitro>=2.6
Browser support: set dangerouslyAllowBrowser=true

## Supplementary Details
Global defaults: apiKey optional, maxRetries=2, timeout=600000ms, httpAgent=stable agent, fetch=node-fetch (Node), worldly global fetch (others).
toFile helper: toFile(data: Buffer|Uint8Array, filename: string): Promise<ReadableFile>
Purpose values: 'fine-tune'
APIError.request_id: string, status: number, name: string, headers: Record<string,string>
Retry backoff: exponential, base delay 100ms
SSE streaming: events of shape { id?: string; data: string; event?: string }
AzureOpenAI: azureADTokenProvider: ()=>Promise<string>, apiVersion: string (e.g. '2024-10-01-preview')
Realtime WebSocket events: 'response.text.delta', 'response.audio.chunk', 'response.function_call.delta'
Custom request options: query: Record<string,any>, body: any, headers: Record<string,string>
Logging: DEBUG=true to auto-log fetch in console
HTTP(S) Agent types: http.Agent or https.Agent
Configuration overrides precedence: per-request options override global
Environment variables: OPENAI_API_KEY, DEBUG, PROXY_URL
Browser enabling: dangerouslyAllowBrowser=true exposes apiKey in window.OpenAI

## Reference Details
Constructor OpenAIOptions { apiKey?: string; baseURL?: string; maxRetries?: number; timeout?: number; httpAgent?: Agent; fetch?: (url: RequestInfo, init?: RequestInit) => Promise<Response>; dangerouslyAllowBrowser?: boolean } Exported class OpenAI { constructor(opts?: OpenAIOptions)

responses: {
 create(params: ResponseCreateParams, opts?: RequestOptions): Promise<ResponseCreateResponse>;
}
ResponseCreateParams { model: string; input: string; instructions?: string; stream?: boolean }
ResponseCreateResponse { output_text: string; _request_id: string }

chat: {
 completions: {
   create(params: ChatCompletionParams, opts?: RequestOptions): Promise<ChatCompletionResponse>;
 }
}
ChatCompletionParams { model: string; messages: Array<{ role: 'system'|'user'|'assistant'|'developer'; content: string }>; stream?: boolean }
ChatCompletionResponse { choices: Array<{ message: { role: string; content: string } }>; _request_id: string }

files: {
 create(params: FileCreateParams): Promise<FileCreateResponse>;
}
FileCreateParams { file: ReadableStream|fs.ReadStream|File|Response|ReadableFile; purpose: 'fine-tune' }
ReadableFile = { name: string; data: Blob|Buffer|Uint8Array }
FileCreateResponse { id: string; object: 'file'; bytes: number; created_at: number; filename: string; purpose: string; _request_id: string }

RequestOptions { maxRetries?: number; timeout?: number; httpAgent?: Agent; headers?: Record<string,string>; query?: Record<string,any>; body?: any }

Error Classes:
class OpenAI.APIError extends Error { request_id: string; status: number; name: string; headers: Record<string,string> }
class BadRequestError extends APIError {}
class AuthenticationError extends APIError {}
class PermissionDeniedError extends APIError {}
class NotFoundError extends APIError {}
class UnprocessableEntityError extends APIError {}
class RateLimitError extends APIError {}
class InternalServerError extends APIError {}
class APIConnectionError extends APIError {}
class APIConnectionTimeoutError extends APIConnectionError {}

Methods:
client.get(path: string, opts?: RequestOptions): Promise<any>
client.post(path: string, opts?: RequestOptions): Promise<any>

Retry Logic: 2 attempts, exponential backoff: delays 100ms, 200ms, then error

Pagination: ListResponse<T> { data: T[]; hasNextPage(): boolean; getNextPage(): Promise<ListResponse<T>> }

Auto-pagination: AsyncIterable<T> from list()

Real-time:
class OpenAIRealtimeWebSocket { constructor(opts: { model: string; apiKey?: string; azureADTokenProvider?: any; apiVersion?: string });
on(event: 'response.text.delta'|'response.audio.chunk'|'response.function_call.delta', handler: (evt: any) => void): void; send(data: any): void }

Azure:
class AzureOpenAI extends OpenAI { constructor(opts: { azureADTokenProvider: () => Promise<string>; apiVersion: string; maxRetries?: number; timeout?: number; httpAgent?: Agent; fetch?: ... }); }

toFile(data: Buffer|Uint8Array, filename: string): Promise<ReadableFile>

troubleshoot:
Command: node example.js
On APIError: console.error(err.request_id, err.status, err.name, err.headers)
On timeout: retry twice, catch APIConnectionTimeoutError
LOGGING: set DEBUG=true and observe console logs


## Information Dense Extract
npm install openai; import OpenAI from 'openai'; client=new OpenAI({apiKey?,maxRetries=2,timeout=600000,httpAgent?,fetch?,dangerouslyAllowBrowser?}); responses.create({model:string,input:string,instructions?:string,stream?:boolean},RequestOptions?):Promise<{output_text:string;_request_id:string}>; chat.completions.create({model:string,messages:Array<{role:'system'|'user'|'assistant'|'developer';content:string}>,stream?:boolean},RequestOptions?):Promise<{choices:Array<{message:{role:string;content:string}}>;_request_id:string}>; streaming via stream:true yields AsyncIterable<SSEEvent>; files.create({file:fs.ReadStream|File|Response|toFile(Buffer|Uint8Array,name),purpose:'fine-tune'}):Promise<File>; toFile(data:Buffer|Uint8Array,filename):Promise<ReadableFile>; Error subclasses by HTTP status with APIError; default retries=2 on network/408/409/429/>=500 exponential backoff; timeout default=600000ms; APIConnectionTimeoutError on timeout; _request_id on all methods; auto-pagination via for await; OpenAIRealtimeWebSocket({model}) events; AzureOpenAI({azureADTokenProvider,apiVersion}); custom requests via client.get/post; import 'openai/shims/web' for global fetch; custom fetch or DEBUG=true logs; httpAgent for proxies; SemVer; requires TS>=4.5,Node>=18,Deno>=1.28,Bun>=1,Cloudflare,Vercel,Jest>=28,Nitro>=2.6; disable browser by default; enable dangerouslyAllowBrowser=true for browser use

## Sanitised Extract
Table of Contents

1 Installation
2 Initialization
3 Responses API
4 Chat Completions API
5 Streaming Responses
6 File Uploads
7 Error Handling
8 Retries Configuration
9 Timeouts Configuration
10 Request ID Access
11 Pagination
12 Realtime API Beta
13 Azure OpenAI Integration
14 Custom/Undocumented Requests
15 Fetch Client Customization
16 Logging & Middleware
17 HTTP(S) Agent Configuration
18 Semantic Versioning Rules
19 Requirements

1 Installation
npm install openai

2 Initialization
import OpenAI from 'openai'
const client = new OpenAI({
 apiKey: process.env.OPENAI_API_KEY, // optional
 maxRetries: 2,                      // default
 timeout: 600000                     // default ms
})

3 Responses API
Signature:
responses.create(
 params: {
  model: string
  input: string
  instructions?: string
  stream?: boolean
 },
 options?: {
  maxRetries?: number
  timeout?: number
  httpAgent?: Agent
 }
): Promise<{
 output_text: string
 _request_id: string
}>
Usage:
const res = await client.responses.create({ model: 'gpt-4o', input: '', instructions: '' })
console.log(res.output_text)

4 Chat Completions API
Signature:
chat.completions.create(
 params: {
  model: string
  messages: Array<{ role: 'system'|'user'|'assistant'|'developer'; content: string }>
  stream?: boolean
 },
 options?: { maxRetries?: number; timeout?: number; httpAgent?: Agent }
): Promise<{
 choices: Array<{ message: { role: string; content: string } }>
 _request_id: string
}>
Usage:
const c = await client.chat.completions.create({
 model: 'gpt-4o',
 messages: [{ role: 'user', content: '' }]
})
console.log(c.choices[0].message.content)

5 Streaming Responses
stream = await client.responses.create({ model: 'gpt-4o', input: '', stream: true })
for await (const event of stream) console.log(event)

6 File Uploads
Acceptable inputs: fs.ReadStream | File | Response | toFile(Buffer,name) | toFile(Uint8Array,name)
client.files.create({ file: fs.createReadStream('f.jsonl'), purpose: 'fine-tune' })
client.files.create({ file: await toFile(Buffer.from('b'), 'f.jsonl'), purpose: 'fine-tune' })

7 Error Handling
Throws APIError subclasses:
 400 BadRequestError
 401 AuthenticationError
 403 PermissionDeniedError
 404 NotFoundError
 422 UnprocessableEntityError
 429 RateLimitError
 >=500 InternalServerError
 Connection issues: APIConnectionError

8 Retries Configuration
Default retries: 2 on connection failures, 408,409,429,>=500
Configure globally: new OpenAI({ maxRetries: x })
Per-request: method(params, { maxRetries: x })

9 Timeouts Configuration
Default: 600000ms
Configure globally: new OpenAI({ timeout: ms })
Per-request: method(params, { timeout: ms })
On timeout: throws APIConnectionTimeoutError and retries twice

10 Request ID Access
response._request_id
.or:
const { data, request_id } = await method.withResponse()

11 Pagination
Auto: for await (const item of client.x.y.list({ limit }))
Manual: let page = await client.x.y.list({ limit })
 while(page.hasNextPage()) { page = await page.getNextPage() }

12 Realtime API Beta
import { OpenAIRealtimeWebSocket } from 'openai/beta/realtime/websocket'
const rt = new OpenAIRealtimeWebSocket({ model: '' })
rt.on('response.text.delta', e => process.stdout.write(e.delta))

13 Azure OpenAI Integration
import { AzureOpenAI } from 'openai'
const openai = new AzureOpenAI({ azureADTokenProvider: provider, apiVersion: '' })
const r = await openai.chat.completions.create({ model: '', messages: [{ role:'user',content:''}] })

14 Custom/Undocumented Requests
client.get('/path', { query:{}, body:{} })
client.post('/path', {...})
Use // @ts-expect-error for extra params

15 Fetch Client Customization
Global web fetch: import 'openai/shims/web'
Constructor: new OpenAI({ fetch: (url,init)=>Promise<Response> })

16 Logging & Middleware
new OpenAI({ fetch: async(u,i)=>{ console.log('req',u,i); r=await fetch(u,i); console.log('res',r); return r } })
Or DEBUG=true env logs all

17 HTTP(S) Agent Configuration
new OpenAI({ httpAgent: new HttpsProxyAgent(url) })
Per-request override: method(params, { httpAgent: new http.Agent({keepAlive:false}) })

18 Semantic Versioning Rules
Major: breaking runtime
Minor: breaking type-only or internal
Patch: fixes

19 Requirements
TypeScript>=4.5
Node.js>=18 LTS
Deno>=1.28.0
Bun>=1.0
Cloudflare Workers
Vercel Edge Runtime
Jest>=28 (node env)
Nitro>=2.6
Browser support: set dangerouslyAllowBrowser=true

## Original Source
OpenAI Node.js SDK
https://github.com/openai/openai-node

## Digest of OPENAI_NODE_SDK

# Installation

npm install openai

den✔️ Requires Node.js 18+ or Deno v1.28+, Bun 1.0+, Cloudflare Workers, Vercel Edge Runtime

# Initialization

```typescript
import OpenAI from 'openai';
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,    // default
  maxRetries: 2,                          // default
  timeout: 600000,                        // default 10min in ms
});
```

# Responses API

```typescript
client.responses.create({
  model: 'gpt-4o',
  instructions: '…',
  input: '…',
  stream: false
})
  .then(response => console.log(response.output_text));
```

Signature: responses.create(params: { model: string; input: string; instructions?: string; stream?: boolean }, options?: { maxRetries?: number; timeout?: number; httpAgent?: Agent }): Promise<{ output_text: string; _request_id: string }>;

# Chat Completions API

```typescript
client.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    { role: 'system', content: '…' },
    { role: 'user', content: '…' }
  ],
  stream: false
})
  .then(completion => console.log(completion.choices[0].message.content));
```

Signature: chat.completions.create(params: { model: string; messages: Array<{ role: 'system'|'user'|'assistant'|'developer'; content: string }>; stream?: boolean }, options?: { maxRetries?: number; timeout?: number; httpAgent?: Agent }): Promise<{ choices: Array<{ message: { role: string; content: string } }>; _request_id: string }>;

# Streaming responses (SSE)

```typescript
const stream = await client.responses.create({ model: 'gpt-4o', input: '…', stream: true });
for await (const event of stream) console.log(event);
```

# File Uploads

Accepts file: fs.ReadStream | File | Response | toFile(Buffer, name) | toFile(Uint8Array, name).

```typescript
import fs from 'fs';
import { toFile } from 'openai';
await client.files.create({ file: fs.createReadStream('file.jsonl'), purpose: 'fine-tune' });
await client.files.create({ file: await toFile(Buffer.from('bytes'), 'file.jsonl'), purpose: 'fine-tune' });
```

# Errors and retries

Throws subclass of APIError based on HTTP status:
400 BadRequestError, 401 AuthenticationError, 403 PermissionDeniedError, 404 NotFoundError, 422 UnprocessableEntityError, 429 RateLimitError, >=500 InternalServerError, connection issues APIConnectionError.

Default retries on connection errors, 408, 409, 429, >=500 up to maxRetries. Configure in constructor or per request.

# Timeouts

Default timeout 600000ms. Configure globally or per request. On timeout throws APIConnectionTimeoutError and retries twice.

# Request IDs

All responses include _request_id from x-request-id. Use .withResponse() to obtain raw Response and request_id.

# Pagination

List methods return paginated results. Use for await…of for auto-pagination. Use .hasNextPage() and .getNextPage() for manual.

# Realtime API Beta

```typescript
import { OpenAIRealtimeWebSocket } from 'openai/beta/realtime/websocket';
const rt = new OpenAIRealtimeWebSocket({ model: 'gpt-4o-realtime-preview-2024-12-17' });
rt.on('response.text.delta', e => process.stdout.write(e.delta));
```

# Azure OpenAI

```typescript
import { AzureOpenAI } from 'openai';
import { getBearerTokenProvider, DefaultAzureCredential } from '@azure/identity';
const cred = new DefaultAzureCredential();
const provider = getBearerTokenProvider(cred, 'https://cognitiveservices.azure.com/.default');
const azure = new AzureOpenAI({ azureADTokenProvider: provider, apiVersion: '2024-10-01-preview' });
const res = await azure.chat.completions.create({ model: 'gpt-4o', messages: [{ role: 'user', content: '…' }] });
```

# Custom Requests

```typescript
await client.post('/custom/path', { body: {...}, query: {...} });
client.foo.create({ foo: 'x', // undocumented
  bar: 1, baz: 'y' } as any);
```

# Fetch Customization

Global: import 'openai/shims/web';
Constructor: fetch: (url, init) => Promise<Response>.

# Logging and middleware

```typescript
const client = new OpenAI({ fetch: async(u,i)=>{ console.log(u,i); const r=await fetch(u,i); console.log(r); return r; } });
```

# HTTP(S) Agent for proxies

```typescript
import http from 'http';
import { HttpsProxyAgent } from 'https-proxy-agent';
const client = new OpenAI({ httpAgent: new HttpsProxyAgent(process.env.PROXY_URL) });
await client.models.list({ httpAgent: new http.Agent({ keepAlive: false }) });
```

# Semantic Versioning

Follows SemVer. Breaking static type-only changes in minor.

# Requirements

TypeScript>=4.5, Node.js 18+, Deno v1.28+, Bun 1.0+, Cloudflare Workers, Vercel Edge Runtime, Jest 28+ (node), Nitro v2.6+, browser support disabled by default; enable dangerouslyAllowBrowser=true.

# Troubleshooting

Inspect response headers with .asResponse() or .withResponse(). Log _request_id for support. Use DEBUG=true to log requests/responses.


## Attribution
- Source: OpenAI Node.js SDK
- URL: https://github.com/openai/openai-node
- License: License: MIT
- Crawl Date: 2025-05-12T00:42:47.683Z
- Data Size: 656028 bytes
- Links Found: 5215

## Retrieved
2025-05-12
sandbox/library/GH_ACTIONS_VARIABLES.md
# sandbox/library/GH_ACTIONS_VARIABLES.md
# GH_ACTIONS_VARIABLES

## Crawl Summary
Variables interpolated on runner; set env at workflow/job/step; configuration vars via UI or REST at org/repo/env; precedence: env>repo>org; naming: alphanumeric/underscore, no GITHUB_/digit, case-insensitive; limits: 48 KB per var, 500 repo/100 env/1 000 org, 256 KB combined; access via env and vars contexts; runner shell syntax: $NAME or $env:NAME; default GITHUB_* and RUNNER_* out of override; use runner.os in conditions; pass values in-job via $GITHUB_ENV, between-jobs via outputs.

## Normalised Extract
Table of Contents:
1 Environment Variables
2 Configuration Variables
3 Scoping and Precedence
4 Naming Rules
5 Size and Count Limits
6 Context Access Patterns
7 Shell Syntax per OS
8 Default Variables
9 OS Detection
10 Passing Data Between Steps and Jobs

1 Environment Variables
Use `env:` key in workflow, job, or step block. Example:
  env: { VAR_NAME: "value" }

2 Configuration Variables
UI: Settings→Secrets and variables→Actions→Variables. REST API: POST/GET/PUT/DELETE /repos/{owner}/{repo}/actions/variables.{ name:string; value:string; }

3 Scoping and Precedence
Lowest-level wins: Environment > Repository > Organization. Reusable workflows use caller repo variables.

4 Naming Rules
Pattern: ^[A-Za-z_][A-Za-z0-9_]*$. Disallow GITHUB_ prefix, no leading digit, case-insensitive uniqueness.

5 Size and Count Limits
Single var ≤48 KB. Repo ≤500 vars; org ≤1 000; env ≤100. Repo+org total ≤256 KB per run. Env-level excluded from total.

6 Context Access Patterns
- In runner commands: use shell syntax `$VAR` or `$env:VAR`.
- In workflow metadata/conditionals: use `${{ env.VAR }}` or `${{ vars.VAR }}`.

7 Shell Syntax per OS
Linux/macOS (bash): `$VAR`.
Windows (PowerShell): `$env:VAR`.

8 Default Variables
List includes CI, GITHUB_REPOSITORY, GITHUB_REF, GITHUB_SHA, GITHUB_RUN_ID, RUNNER_OS, RUNNER_TEMP, RUNNER_TOOL_CACHE.

9 OS Detection
Use `if: runner.os == 'Windows'` or `runner.os != 'Windows'`.

10 Passing Data Between Steps and Jobs
Within job: `echo "KEY=VALUE" >> $GITHUB_ENV` then `$KEY`. Between jobs: define step output: `id: set
 run: echo "::set-output name=key::value"`; reference `${{ needs.job.outputs.key }}`.

## Supplementary Details
Parameter values and defaults:
- env key scopes: workflow, jobs.<id>, steps[*]
- REST API JSON body for repo variables: { name:string, value:string }
- Precedence order: org(1000 vars) < repo(500) < env(100)
- Combined size limit repo+org: 256 KB; truncate alphabetical overflow
- Single variable max: 48 KB
- Context names: env and vars
- Shell default: bash on ubuntu-latest, PowerShell on windows-latest
Implementation steps:
1. Add env in workflow YAML under correct block.
2. Create configuration vars via UI or call Octokit:
   await octokit.actions.createOrUpdateRepoVariable({ owner, repo, name, value });
3. Access in steps: run: echo "${{ vars.NAME }}" or echo "$NAME".
4. For conditionals: if: ${{ env.VAR == 'value' }}.
5. Pass values: echo "NAME=value" >> $GITHUB_ENV for intra-job; use outputs for cross-job.
6. Detect OS: if: runner.os == 'Windows'.

UI creation steps:
- Repository: Settings→Secrets and variables→Actions→Variables→New repository variable
- Organization: Settings→Secrets and variables→Actions→Variables→New organization variable→select access policy
- Environment: Settings→Environments→Select env→Environment variables→Add variable

REST API endpoints:
- GET    /repos/{owner}/{repo}/actions/variables
- GET    /repos/{owner}/{repo}/actions/variables/{name}
- POST   /repos/{owner}/{repo}/actions/variables
- PUT    /repos/{owner}/{repo}/actions/variables/{name}
- DELETE /repos/{owner}/{repo}/actions/variables/{name}

Permissions: admin for org, owner for repo, collaborator for API.

## Reference Details
Octokit REST methods:
```js
// List repository variables
const { data } = await octokit.actions.listRepoVariables({ owner, repo });
// Create or update repository variable
await octokit.actions.createOrUpdateRepoVariable({ owner, repo, name: 'MY_VAR', value: 'my_value' });
// Get a single repository variable
const { data: variable } = await octokit.actions.getRepoVariable({ owner, repo, name: 'MY_VAR' });
// Delete repository variable
await octokit.actions.deleteRepoVariable({ owner, repo, name: 'MY_VAR' });
```
Request/Response schemas:
- POST/PUT /repos/{owner}/{repo}/actions/variables
  Request: { name: string, value: string }
  Response: 204 No Content
- GET /repos/{owner}/{repo}/actions/variables
  Response: { total_count: number, variables: [ { name:string, created_at:string, updated_at:string } ] }
- GET /repos/{owner}/{repo}/actions/variables/{name}
  Response: { name:string, value:string, ...metadata }

Workflow commands:
- Set env: echo "KEY=VALUE" >> $GITHUB_ENV
- Set output: echo "::set-output name=key::value"
- List all runner env: run: env

Best practices:
- Do not override GITHUB_* or RUNNER_*
- Use contexts in non-runner sections
- Mask secrets; variables are unmasked by default
- Use $GITHUB_ENV for intra-job data passing; outputs for inter-job

Troubleshooting:
- Verify var existence: run: env
- Confirm context usage: echo "${{ env.NAME }}"
- Shell syntax errors: ensure correct $NAME vs $env:NAME
- API errors: check HTTP status codes (401 unauthorized, 404 not found)
- Exceeded limits: 413 Payload Too Large; reduce variable sizes or use environment level

Expected outputs:
- GET repo variables returns JSON list
- POST returns 204
- Workflow run logs show variable values in runner steps


## Information Dense Extract
env scopes: workflow, job, step. YAML: env: {KEY:VALUE}. Configuration vars via UI or REST /repos/{owner}/{repo}/actions/variables. JSON body: {name:string,value:string}. Precedence: env>repo>org. Naming: ^[A-Za-z_][A-Za-z0-9_]*$, no GITHUB_ prefix. Limits: var≤48 KB; repo≤500; org≤1000; env≤100; repo+org≤256 KB. Access: run steps: bash($VAR)/PowerShell($env:VAR); metadata: ${{ env.VAR }} and ${{ vars.VAR }}. Default vars (CI, GITHUB_REPOSITORY, GITHUB_REF, RUNNER_OS, RUNNER_TEMP) immutable. OS detection: if: runner.os=='Windows'. Intra-job: echo "KEY=VALUE">>$GITHUB_ENV. Cross-job: ::set-output. Octokit: createOrUpdateRepoVariable({owner,repo,name,value}); listRepoVariables; getRepoVariable; deleteRepoVariable. Best practices: mask secrets; avoid overwriting defaults; use contexts pre-run; use appropriate shell syntax. Troubleshoot: run: env; check HTTP status codes; adjust sizes to limits.

## Sanitised Extract
Table of Contents:
1 Environment Variables
2 Configuration Variables
3 Scoping and Precedence
4 Naming Rules
5 Size and Count Limits
6 Context Access Patterns
7 Shell Syntax per OS
8 Default Variables
9 OS Detection
10 Passing Data Between Steps and Jobs

1 Environment Variables
Use 'env:' key in workflow, job, or step block. Example:
  env: { VAR_NAME: 'value' }

2 Configuration Variables
UI: SettingsSecrets and variablesActionsVariables. REST API: POST/GET/PUT/DELETE /repos/{owner}/{repo}/actions/variables.{ name:string; value:string; }

3 Scoping and Precedence
Lowest-level wins: Environment > Repository > Organization. Reusable workflows use caller repo variables.

4 Naming Rules
Pattern: ^[A-Za-z_][A-Za-z0-9_]*$. Disallow GITHUB_ prefix, no leading digit, case-insensitive uniqueness.

5 Size and Count Limits
Single var 48KB. Repo 500 vars; org 1000; env 100. Repo+org total 256KB per run. Env-level excluded from total.

6 Context Access Patterns
- In runner commands: use shell syntax '$VAR' or '$env:VAR'.
- In workflow metadata/conditionals: use '${{ env.VAR }}' or '${{ vars.VAR }}'.

7 Shell Syntax per OS
Linux/macOS (bash): '$VAR'.
Windows (PowerShell): '$env:VAR'.

8 Default Variables
List includes CI, GITHUB_REPOSITORY, GITHUB_REF, GITHUB_SHA, GITHUB_RUN_ID, RUNNER_OS, RUNNER_TEMP, RUNNER_TOOL_CACHE.

9 OS Detection
Use 'if: runner.os == 'Windows'' or 'runner.os != 'Windows''.

10 Passing Data Between Steps and Jobs
Within job: 'echo 'KEY=VALUE' >> $GITHUB_ENV' then '$KEY'. Between jobs: define step output: 'id: set
 run: echo '::set-output name=key::value''; reference '${{ needs.job.outputs.key }}'.

## Original Source
GitHub Actions Environment Variables & Secrets
https://docs.github.com/en/actions/learn-github-actions/variables

## Digest of GH_ACTIONS_VARIABLES

# Variables

Variables provide a way to store and reuse non-sensitive configuration data in GitHub Actions workflows. They are interpolated on the runner and accessible by commands in actions or workflow steps. GitHub sets default environment variables per run; you can also set custom environment or configuration variables.

# Defining Environment Variables for a Single Workflow

Scope levels and syntax:

  • Workflow-level (top): env: { NAME: VALUE }
  • Job-level: jobs.<job_id>.env: { NAME: VALUE }
  • Step-level: jobs.<job_id>.steps[*].env: { NAME: VALUE }

YAML example:

```yaml
name: Greeting on variable day
on: workflow_dispatch

env:
  DAY_OF_WEEK: Monday

jobs:
  greeting_job:
    runs-on: ubuntu-latest
    env:
      Greeting: Hello
    steps:
      - name: Say Hello Mona
        run: echo "$Greeting $First_Name. Today is $DAY_OF_WEEK!"
        env:
          First_Name: Mona
```

# Defining Configuration Variables for Multiple Workflows

Configuration variables can be set at organization, repository or environment level via UI or REST API. They appear in the `vars` context.

UI steps (repository):

  1. Settings → Secrets and variables → Actions → Variables tab.
  2. Click New repository variable; enter Name, Value; Add variable.

REST API endpoints:

  • GET   /repos/{owner}/{repo}/actions/variables
  • POST  /repos/{owner}/{repo}/actions/variables
  • PUT   /repos/{owner}/{repo}/actions/variables/{name}
  • DELETE /repos/{owner}/{repo}/actions/variables/{name}

# Configuration Variable Precedence

Organization < Repository < Environment (lowest-level overrides higher-level). Reusable workflows use caller’s repo variables, not callee’s.

# Naming Conventions

  • Only alphanumeric or underscore; no spaces.
  • Must not start with GITHUB_ or digit.
  • Case-insensitive; unique per scope.

# Limits for Configuration Variables

  • Single variable max size: 48 KB.
  • Max 1 000 org variables; 500 repo; 100 environment.
  • Combined org+repo size ≤ 256 KB per run (alphabetical truncation if exceeded).
  • Environment-level variables excluded from 256 KB limit.

# Using Contexts to Access Values

  • `env` context for environment variables: ${{ env.NAME }}.
  • `vars` context for configuration variables: ${{ vars.NAME }}.
  • Runner env syntax in `run` steps: bash: `$NAME`; PowerShell: `$env:NAME`.
  • Non-runner sections (if, uses, with): only contexts.

# Default Environment Variables

GitHub sets ~60 GITHUB_* and RUNNER_* vars. Examples:

  • CI=true
  • GITHUB_REPOSITORY=owner/repo
  • GITHUB_REF=refs/heads/main
  • RUNNER_OS=Linux
  • RUNNER_TEMP=/home/runner/_temp

These cannot be overridden (except CI).

# Detecting the Operating System

Use `runner.os` context in `if` conditionals. Example:

```yaml
if: runner.os == 'Windows'
run: echo "OS is $env:RUNNER_OS"
```

# Passing Values Between Steps and Jobs

  • Within a job: write `echo "NAME=VALUE" >> $GITHUB_ENV` then use $NAME.
  • Between jobs: declare outputs: `outputs: { KEY: ${{ steps.step_id.outputs.KEY }}}` and reference via `${{ needs.job_id.outputs.KEY }}`.

---

*Retrieved: 2024-06-15*  
*Attribution: docs.github.com/le ... /variables*  
*Data size: 716856 bytes*

## Attribution
- Source: GitHub Actions Environment Variables & Secrets
- URL: https://docs.github.com/en/actions/learn-github-actions/variables
- License: License: CC BY 4.0
- Crawl Date: 2025-05-12T18:30:36.208Z
- Data Size: 716856 bytes
- Links Found: 11461

## Retrieved
2025-05-12
sandbox/library/EJS_CORE.md
# sandbox/library/EJS_CORE.md
# EJS_CORE

## Crawl Summary
Scriptlet tags: <% code %>, <%= value %>, <%- value %>. Compiles templates to JavaScript functions and caches them in memory keyed by filename. Rendering errors throw JavaScript exceptions including template file path and line number. Active open source development on GitHub.

## Normalised Extract
Table of Contents
1 Syntax
2 Performance
3 Debugging

1 Syntax
   Use JavaScript in scriptlet tags to control output:
     <% code %> for logic without rendering output
     <%= value %> for HTML-escaped output
     <%- value %> for raw HTML output

2 Performance
   Template files are compiled into JS functions once and stored in an in-memory cache keyed by the template file path, reducing compilation overhead on repeated renders.

3 Debugging
   Runtime errors during template rendering throw standard JavaScript exceptions augmented with the originating template file path and line number for precise troubleshooting.

## Supplementary Details
Uses three scriptlet tag forms: control-flow, escaped output, raw output. In-memory cache holds compiled template functions; cache invalidated when template file changes. Exceptions include message: 'Error in template at TEMPLATE_PATH:LINE:COLUMN'. Community contributions via GitHub repository ejs/ejs.

## Reference Details
None of the core API method signatures or configuration options were available in the provided crawl content.

## Information Dense Extract
Syntax: <% code %>, <%= value %>, <%- value %>. Cache: compiled JS functions per template file in memory. Errors: JS exceptions with template path and line number. Active development: GitHub repository with issue/PR support.

## Sanitised Extract
Table of Contents
1 Syntax
2 Performance
3 Debugging

1 Syntax
   Use JavaScript in scriptlet tags to control output:
     <% code %> for logic without rendering output
     <%= value %> for HTML-escaped output
     <%- value %> for raw HTML output

2 Performance
   Template files are compiled into JS functions once and stored in an in-memory cache keyed by the template file path, reducing compilation overhead on repeated renders.

3 Debugging
   Runtime errors during template rendering throw standard JavaScript exceptions augmented with the originating template file path and line number for precise troubleshooting.

## Original Source
EJS Templating Engine
https://ejs.co/#docs

## Digest of EJS_CORE

# Syntax

Use plain JavaScript in scriptlet tags:

<% code %>    control flow without output
<%= value %>  escaped output
<%- value %>  unescaped output

# Performance

EJS caches compiled JavaScript functions per template file in memory. Cache is keyed by the template filename.

# Debugging

Errors during rendering throw JavaScript exceptions with template file path and line number included.

# Community

Library is under active development with issue and pull request support on GitHub.

Retrieved 2024-06-30 from https://ejs.co/#docs
Data Size: 8029 bytes
Links Found: 26

## Attribution
- Source: EJS Templating Engine
- URL: https://ejs.co/#docs
- License: License: MIT
- Crawl Date: 2025-05-13T06:29:53.711Z
- Data Size: 8029 bytes
- Links Found: 26

## Retrieved
2025-05-13
