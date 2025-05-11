sandbox/library/CODE_BLOCKS.md
# sandbox/library/CODE_BLOCKS.md
# CODE_BLOCKS

## Crawl Summary
Indented code blocks: lines with ≥4-space indent form literal code content minus 4 spaces, cannot interrupt paragraphs without blank line, list indent takes precedence.  Fenced code blocks: opening fence /^ {0,3}(`{3,}|~{3,})([ \t]*)([^`~]*)$/, closing fence /^ {0,3}(`{n,}|~{n,})[ \t]*$/, content unparsed text, indent removal equal to opening indent, info string allowed after opening fence, fence type and length must match, blocks interrupt paragraphs, no blank lines required.

## Normalised Extract
Table of Contents:
1. Indented Code Blocks
2. Fenced Code Blocks

1. Indented Code Blocks
Definition: lines with ≥4 spaces indentation constitute code block.  Blank-line-separated chunks.  Content = literal lines minus first 4 spaces.  Cannot start inside paragraph without blank line; list-indentation overrides.
Implementation details:
  - Detection regex: /^[ \t]{4,}/
  - Start: if prevLine is blank or non-paragraph, and line matches regex.
  - End: first non-blank line with <4 spaces indent.
  - Content extraction: strip exactly 4 leading spaces; retain extra spaces/tabs.

2. Fenced Code Blocks
Definition: opening fence = up to 3 spaces indent + ≥3 backticks or tildes; optional info string.  Closing fence: same char, length ≥ opening, ≤3 spaces indent.
Implementation details:
  - Opening regex: /^ {0,3}(`{3,}|~{3,})([ \t]*)([^`~]*)$/
  - Info string: trim spaces/tabs from capture group 3.
  - Content lines: for each line until closing fence, remove min(N,lineIndent) spaces where N = indent of opening.
  - Closing regex: new RegExp(`^ {0,3}(${fenceChar}{${fenceLen},})[ \t]*$`)
  - Blocks may interrupt any block, no blank-line requirement.


## Supplementary Details
Implementation steps for parser:
1. Iterate lines of document sequentially.
2. At each line, check for fenced code opening with Opening regex. If match:
   a. Record fenceChar (` or ~), fenceLen = length(match[1]), indent = countLeadingSpaces(match[0]).
   b. Parse infoString = match[3].split(/\s+/)[0].
   c. Collect subsequent lines until a line matching closing regex: new RegExp(`^ {0,3}(${fenceChar}{${fenceLen},})[ \t]*$`).
   d. For each content line, strip up to indent spaces, append to code content.
3. If no fence, check for indented code start with /^[ \t]{4,}/ and (prevBlank||prevNotParagraph).
   a. Collect subsequent lines while /^[ \t]{4,}/ or blank.
   b. For each non-blank, strip first 4 spaces; append to code content. Blank lines preserved if indented.

Configuration options:
- Tab stops: 4 spaces in indented contexts.
- Max fence indent: 3 spaces.
- Min fence length: 3 characters.


## Reference Details
Regex patterns:
  INDENTED_CODE_OPEN: /^[ \t]{4,}.+$/
  FENCE_OPEN: /^ {0,3}(`{3,}|~{3,})([ \t]*)([^`~]*)$/
  FENCE_CLOSE: prefix '^ {0,3}(' + fenceChar.repeat(fenceLen) + ',) *$'
Parser pseudocode:
function parseDocument(lines) {
  let i=0;
  while(i<lines.length) {
    if(lines[i].match(FENCE_OPEN)) {
      let [fenceChar, fenceLen, info] = extractFence(lines[i]);
      i++;
      let content=[];
      while(i<lines.length && !isFenceClose(lines[i], fenceChar, fenceLen)) {
        content.push(stripIndent(lines[i], indent)); i++;
      }
      i++;
      yield {type:'fenced_code', infoString:info, content};
    } else if(lines[i].match(INDENTED_CODE_OPEN) && isBlockBoundary(lines[i-1])) {
      let content=[];
      while(i<lines.length && (lines[i].match(INDENTED_CODE_OPEN)||isBlank(lines[i]))) {
        if(!isBlank(lines[i])) content.push(lines[i].slice(4));
        else content.push('');
        i++;
      }
      yield {type:'indented_code', content};
    } else {
      // other block parsing
      i++;
    }
  }
}

Best practices:
- Use fence sequences longer than any in content to avoid premature closure.
- Normalize tabs to spaces before parsing, preserving literal tabs in code.
- Always treat fenced code as literal; skip inline parsing inside.

Troubleshooting:
Command: run spec_tests.py against your parser
Expected: all code-block conformance tests pass (exit code 0).
Example: python3 tools/spec_tests.py commonmark-parser.js
If failure at test 4.5.3, inspect fence length comparison logic.


## Information Dense Extract
Indented code: lines≥4-space indent→strip4spaces→literal content; must follow blank/non-paragraph; list indent wins.  Fenced code: opening /^ {0,3}(`{3,}|~{3,})( *)(info)?$/, info=first word trimmed; content until closing /^ {0,3}(${char}{len,}) *$/, strip up to opening indent spaces; no inline parsing; blank-line-agnostic; parser: detect open, record fenceChar,len, indent, collect lines, match close, strip indent, output code node.

## Sanitised Extract
Table of Contents:
1. Indented Code Blocks
2. Fenced Code Blocks

1. Indented Code Blocks
Definition: lines with 4 spaces indentation constitute code block.  Blank-line-separated chunks.  Content = literal lines minus first 4 spaces.  Cannot start inside paragraph without blank line; list-indentation overrides.
Implementation details:
  - Detection regex: /^[ 't]{4,}/
  - Start: if prevLine is blank or non-paragraph, and line matches regex.
  - End: first non-blank line with <4 spaces indent.
  - Content extraction: strip exactly 4 leading spaces; retain extra spaces/tabs.

2. Fenced Code Blocks
Definition: opening fence = up to 3 spaces indent + 3 backticks or tildes; optional info string.  Closing fence: same char, length  opening, 3 spaces indent.
Implementation details:
  - Opening regex: /^ {0,3}('{3,}|~{3,})([ 't]*)([^'~]*)$/
  - Info string: trim spaces/tabs from capture group 3.
  - Content lines: for each line until closing fence, remove min(N,lineIndent) spaces where N = indent of opening.
  - Closing regex: new RegExp('^ {0,3}(${fenceChar}{${fenceLen},})[ 't]*$')
  - Blocks may interrupt any block, no blank-line requirement.

## Original Source
CommonMark Specification
https://spec.commonmark.org/0.30/

## Digest of CODE_BLOCKS

# Indented Code Blocks
An indented code block consists of one or more indented chunks separated by blank lines.  An indented chunk is a sequence of non-blank lines each preceded by at least four spaces of indentation.  The content of the code block is the literal text of those lines including trailing line endings, minus four leading spaces per line.  A blank line is required before an indented code block if the preceding block is a paragraph; no blank line is needed before a following paragraph.  Additional spaces or tabs beyond the initial four remain in content.  If indentation could also indicate a list item, list-item interpretation takes precedence.

# Fenced Code Blocks
A fenced code block begins with an opening fence: at most three spaces of indentation, then at least three consecutive backticks (`) or tildes (~), not mixed, optionally followed by spaces/tabs and an info string.  The info string is trimmed and may include a language identifier as its first word.  The block ends at a closing fence of the same character and at least the same length, preceded by up to three spaces of indentation, followed only by spaces or tabs.  Content lines have up to N leading spaces removed, where N is the indentation of the opening fence.  Content is treated as literal text.  Fenced code can interrupt paragraphs and does not require blank lines before or after.

Current date: 2023-11-20
Data size retrieved: 26611114 bytes


## Attribution
- Source: CommonMark Specification
- URL: https://spec.commonmark.org/0.30/
- License: CC0-1.0
- Crawl Date: 2025-05-11T08:57:55.704Z
- Data Size: 26611114 bytes
- Links Found: 111897

## Retrieved
2025-05-11
sandbox/library/EJS_FEATURES.md
# sandbox/library/EJS_FEATURES.md
# EJS_FEATURES

## Crawl Summary
Use plain JavaScript templates. No custom syntax. Scriptlet tags `<% %>` for code, `<%= %>` for output. Compiled functions are cached. Debugging shows JS exceptions with line numbers. Active community.

## Normalised Extract
Table of Contents:
1. Plain JavaScript Templating
2. Scriptlet Tag Syntax
3. Template Compilation and Caching
4. Debugging Error Reporting
5. Community and Maintenance

1. Plain JavaScript Templating
Templates are authored entirely in JavaScript. No preprocessing or custom DSL required. Use any JS constructs directly.

2. Scriptlet Tag Syntax
Use `<% code %>` to execute statements without output. Use `<%= expression %>` to output escaped HTML. Use `<%- expression %>` to output unescaped raw HTML.

3. Template Compilation and Caching
EJS compiles `.ejs` files into JavaScript functions on first render. Set `cache: true` to enable LRU caching by file path. Caching avoids re-compilation on subsequent renders.

4. Debugging Error Reporting
Errors thrown during template execution include template filename and line number. Enable `compileDebug: true` to embed debug instrumentation in compiled functions.

5. Community and Maintenance
EJS is under active development. Report issues via GitHub. Use the latest npm release for bug fixes.

## Supplementary Details
Configuration Options:
- delimiter: String, default '%', custom tag delimiter character.
- cache: Boolean, default false, enable caching compiled templates in memory.
- filename: String, required for accurate error messages and caching key.
- compileDebug: Boolean, default true, include debug instrumentation.
- rmWhitespace: Boolean, default false, remove all safe-to-remove whitespace.

Implementation Steps:
1. Install: `npm install ejs`
2. Require module: `const ejs = require('ejs')`
3. Render string: `ejs.render(templateString, data, options)`
4. Render file: `ejs.renderFile(filePath, data, options, callback)`

## Reference Details
API Specifications:

Method: ejs.render(template:String, data:Object, options:Object):String
- template: template source string
- data: key/value pairs for template context
- options:
  - filename:String (for caching and errors)
  - delimiter:String
  - cache:Boolean
  - compileDebug:Boolean
  - rmWhitespace:Boolean
Returns rendered HTML string.

Method: ejs.renderFile(path:String, data:Object, options:Object, callback:Function(err, str))
- path: filesystem path to `.ejs` file
- data: context object
- options: same as render
- callback: receives error or rendered string

Implementation Pattern:
```
const ejs = require('ejs');
const options = {cache: true, filename: 'template.ejs'};
ejs.renderFile('views/template.ejs', {user: 'Alice'}, options, (err, html) => {
  if (err) console.error('Render error:', err);
  else console.log(html);
});
```

Best Practices:
- Always set `filename` when using caching to avoid collisions.
- Use LRU cache in production: `ejs.cache = new LRU({ max: 100 });`
- Sanitize user input or use `<%- %>` only when safe.

Troubleshooting:
- Command: `DEBUG=ejs node app.js` enables detailed compile debug output.
- Common Error: "Could not find include" requires correct relative `filename` in options.
- Inspect compiled function: `const fn = ejs.compile(str, options); console.log(fn.toString());`

## Information Dense Extract
Plain JS templating via `<% %>`, `<%= %>`, `<%- %>`. compileDebug:true includes source map comments. cache:true + filename:String => in-memory LRU caching. Options: delimiter:String, rmWhitespace:Boolean. Methods: render(string,data,opts):String; renderFile(path,data,opts,cb). Best: set filename for caching, use LRU of size N. Debug: DEBUG=ejs, fn=compile(src,opts).

## Sanitised Extract
Table of Contents:
1. Plain JavaScript Templating
2. Scriptlet Tag Syntax
3. Template Compilation and Caching
4. Debugging Error Reporting
5. Community and Maintenance

1. Plain JavaScript Templating
Templates are authored entirely in JavaScript. No preprocessing or custom DSL required. Use any JS constructs directly.

2. Scriptlet Tag Syntax
Use '<% code %>' to execute statements without output. Use '<%= expression %>' to output escaped HTML. Use '<%- expression %>' to output unescaped raw HTML.

3. Template Compilation and Caching
EJS compiles '.ejs' files into JavaScript functions on first render. Set 'cache: true' to enable LRU caching by file path. Caching avoids re-compilation on subsequent renders.

4. Debugging Error Reporting
Errors thrown during template execution include template filename and line number. Enable 'compileDebug: true' to embed debug instrumentation in compiled functions.

5. Community and Maintenance
EJS is under active development. Report issues via GitHub. Use the latest npm release for bug fixes.

## Original Source
EJS
https://ejs.co/

## Digest of EJS_FEATURES

# EJS Core Features

## Use plain JavaScript
We love JavaScript. It's a totally friendly language. All templating languages grow to be Turing-complete. Cut out the middle-man and use JS directly in your templates.

## Fast development time
No need to learn custom syntax or preprocess data. Templates are authored as plain JavaScript within scriptlet tags.

## Simple syntax
Embed JavaScript statements with `<% code %>` and output values with `<%= value %>`.

## Speedy execution
EJS compiles templates to intermediate JavaScript functions and caches them for reuse, leveraging V8 and other JS runtime optimizations.

## Easy debugging
Runtime errors in templates surface as JavaScript exceptions with accurate template line numbers.

## Active development
EJS is maintained by an active community, with frequent updates and support channels.

## Attribution
- Source: EJS
- URL: https://ejs.co/
- License: MIT
- Crawl Date: 2025-05-11T06:29:44.194Z
- Data Size: 9176 bytes
- Links Found: 33

## Retrieved
2025-05-11
sandbox/library/HTTP_MODULE.md
# sandbox/library/HTTP_MODULE.md
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
