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
