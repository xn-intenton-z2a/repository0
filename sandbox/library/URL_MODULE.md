# URL_MODULE

## Crawl Summary
Node.js v24.0.0 `node:url` module implements WHATWG URL Standard: Constructor `new URL(input, base)` with string coercion, Punycode conversion, throws TypeError. Properties: href, origin, protocol, username, password, host, hostname, port (0-65535), pathname, search, searchParams, hash. Methods: toString, toJSON. Static: createObjectURL, revokeObjectURL, canParse, parse. URLSearchParams: constructors (string, object, iterable), methods append, delete, get, getAll, has, set, sort, toString, iterators, size, forEach. URLPattern experimental: constructors with pattern/object/base/options ignoreCase, methods exec, test. Utilities: domainToASCII, domainToUnicode, fileURLToPath, pathToFileURL, urlFormat, urlToHttpOptions. Legacy API: url.parse, url.format, url.resolve.

## Normalised Extract
Table of Contents
1 URL Class
2 URL Properties
3 URL Methods
4 URL Static Methods
5 URLSearchParams API
6 URLPattern API
7 Utilities
8 Legacy API

1 URL Class
new URL(input: string, base?: string)
Throws TypeError if invalid. Converts Unicode hostnames to Punycode. Input and base coerced via toString.

2 URL Properties
href: string; setting parses new URL
origin: string; read-only
protocol: string; trailing ':'
username/password: string; percent-encoded on set
host: string; hostname:port
hostname: string; host without port
port: string; 0-65535; default yields ''
pathname/search/hash: string; include ?, #; percent-encoded on set
searchParams: URLSearchParams

3 URL Methods
toString(): string
toJSON(): string

4 URL Static Methods
createObjectURL(blob: Blob): string
revokeObjectURL(id: string): void
canParse(input: string, base?: string): boolean
parse(input: string, base?: string): URL|null

5 URLSearchParams API
Constructors
new URLSearchParams()
new URLSearchParams(queryString: string)
new URLSearchParams(object: Record<string,string>)
new URLSearchParams(iterable: Iterable<[string,string]>)

Methods
append(name: string, value: string)
delete(name: string, value?: string)
get(name: string): string|null
getAll(name: string): string[]
has(name: string, value?: string): boolean
set(name: string, value: string)
sort(): void
toString(): string
entries()/keys()/values()/[Symbol.iterator]()
forEach(fn: Function, thisArg?: any)
size: number

6 URLPattern API (experimental)
new URLPattern(pattern: string|object, baseURL?: string, options?: {ignoreCase?: boolean})
exec(input: string|object, baseURL?: string): PatternResult|null
test(input: string|object, baseURL?: string): boolean

7 Utilities
domainToASCII(domain: string): string
domainToUnicode(domain: string): string
fileURLToPath(url: string|URL, options?: {windows?: boolean}): string
pathToFileURL(path: string, options?: {windows?: boolean}): URL
urlFormat(url: URL, options?: {auth?: boolean, fragment?: boolean, search?: boolean, unicode?: boolean}): string
urlToHttpOptions(url: URL): {protocol:string,hostname:string,port:number,auth?:string,path:string,href:string,hash?:string,search?:string}

8 Legacy API
url.parse(urlString: string, parseQueryString?: boolean, slashesDenoteHost?: boolean): UrlObject
url.format(urlObject: UrlObject): string
url.resolve(from: string, to: string): string

## Supplementary Details
Node.js v24.0.0 does not require ICU for URL parsing. URL constructor now global. Default imports refer to globalThis.URL. fileURLToPath and pathToFileURL ensure absolute platform-specific paths. format options default: auth=true, fragment=true, search=true, unicode=false. fileURLToPath windows default from process.platform. URLSearchParams size added in v19.8.0. URL.canParse added v19.9.0. URL.parse added v22.1.0.

## Reference Details
## API Signatures and Examples

### URL
Signature: new URL(input: string, base?: string): URL
Throws TypeError

Example:
const url = new URL('/data', 'https://example.org'); // https://example.org/data

### URL Properties
- url.href: string
- url.origin: string
- url.protocol: string
- url.username/password: string
- url.host: string
- url.hostname: string
- url.port: string
- url.pathname: string
- url.search: string
- url.searchParams: URLSearchParams
- url.hash: string

### URL Methods
url.toString(): string
url.toJSON(): string

### Static Methods
URL.createObjectURL(blob: Blob): string
URL.revokeObjectURL(id: string): void
URL.canParse(input: string, base?: string): boolean
URL.parse(input: string, base?: string): URL|null

### URLSearchParams
Constructors:
new URLSearchParams()
new URLSearchParams('a=1&b=2')
new URLSearchParams({a:'1',b:'2'})
new URLSearchParams([['a','1'],['b','2']])

Methods:
append(name: string, value: string): void
delete(name: string, value?: string): void
get(name: string): string|null
getAll(name: string): string[]
has(name: string, value?: string): boolean
set(name: string, value: string): void
sort(): void
toString(): string
entries(): Iterator<[string,string]>
keys(): Iterator<string>
values(): Iterator<string>
forEach(fn: (value,name,params)=>void, thisArg?: any)
size: number

### URLPattern (Experimental)
new URLPattern(pattern: string|object, baseURL?: string, options?: {ignoreCase?: boolean})
exec(input: string|object, baseURL?: string): PatternResult|null
test(input: string|object, baseURL?: string): boolean

### Utilities
domainToASCII(domain: string): string
domainToUnicode(domain: string): string
fileURLToPath(url: string|URL, options?: {windows?: boolean}): string
pathToFileURL(path: string, options?: {windows?: boolean}): URL
urlFormat(url: URL, options?: Params): string
urlToHttpOptions(url: URL): HttpOptions

## Best Practices
- Use WHATWG API over legacy. Avoid `url.parse` in new code.
- Validate `url.origin` after constructing with unknown input to prevent SSRF.
- Call `URL.revokeObjectURL` when done with blobs.
- Use `searchParams.sort()` for cache-friendly query strings.

## Troubleshooting
Command: node -e "console.log(new URL('測試', 'https://例子.com').href)"
Expected: https://xn--fsqu00a.xn--fiqs8s/

Command: node -e "require('node:url').fileURLToPath('file:///C:/test%20file')"
Expected (Windows): C:\test file

Error Handling:
TypeError on invalid URL input:
node -e "new URL('::invalid')"
-> Throws TypeError: Invalid URL


## Information Dense Extract
URL MODULE: new URL(input:string,base?:string)->URL; throws TypeError; Punycode host; href,string; origin,read-only; protocol:'scheme:'; username,password percent-encoded; host:'hostname:port'; hostname; port '0-65535'->'' default; pathname,search ('?'),hash('#'); searchParams:URLSearchParams; toString()/toJSON()->href; static: createObjectURL(Blob)->string; revokeObjectURL(string)->void; canParse(string,base?)->boolean; parse(string,base?)->URL|null. URLSearchParams: constructors: (),(string),(object),(iterable); methods: append(name,value),delete(name,value?),get(name)->string|null,getAll(name)->string[],has(name,value?)->boolean,set(name,value),sort(),toString()->string; iterators: entries,keys,values,[Symbol.iterator]; forEach; size:number. URLPattern(exp): new(pattern:string|object,base?string,options?{ignoreCase:boolean}); exec(input,base?)->PatternResult|null; test->boolean. Utilities: domainToASCII(string)->string; domainToUnicode(string)->string; fileURLToPath(string|URL,{windows?})->string; pathToFileURL(string,{windows?})->URL; format(URL,{auth?,fragment?,search?,unicode?})->string; urlToHttpOptions(URL)->{protocol,hostname,port,auth?,path,href,hash?,search?}. Legacy: url.parse(string,parseQS?,slashes?)->UrlObject; url.format(UrlObject)->string; url.resolve(from,to)->string.

## Sanitised Extract
Table of Contents
1 URL Class
2 URL Properties
3 URL Methods
4 URL Static Methods
5 URLSearchParams API
6 URLPattern API
7 Utilities
8 Legacy API

1 URL Class
new URL(input: string, base?: string)
Throws TypeError if invalid. Converts Unicode hostnames to Punycode. Input and base coerced via toString.

2 URL Properties
href: string; setting parses new URL
origin: string; read-only
protocol: string; trailing ':'
username/password: string; percent-encoded on set
host: string; hostname:port
hostname: string; host without port
port: string; 0-65535; default yields ''
pathname/search/hash: string; include ?, #; percent-encoded on set
searchParams: URLSearchParams

3 URL Methods
toString(): string
toJSON(): string

4 URL Static Methods
createObjectURL(blob: Blob): string
revokeObjectURL(id: string): void
canParse(input: string, base?: string): boolean
parse(input: string, base?: string): URL|null

5 URLSearchParams API
Constructors
new URLSearchParams()
new URLSearchParams(queryString: string)
new URLSearchParams(object: Record<string,string>)
new URLSearchParams(iterable: Iterable<[string,string]>)

Methods
append(name: string, value: string)
delete(name: string, value?: string)
get(name: string): string|null
getAll(name: string): string[]
has(name: string, value?: string): boolean
set(name: string, value: string)
sort(): void
toString(): string
entries()/keys()/values()/[Symbol.iterator]()
forEach(fn: Function, thisArg?: any)
size: number

6 URLPattern API (experimental)
new URLPattern(pattern: string|object, baseURL?: string, options?: {ignoreCase?: boolean})
exec(input: string|object, baseURL?: string): PatternResult|null
test(input: string|object, baseURL?: string): boolean

7 Utilities
domainToASCII(domain: string): string
domainToUnicode(domain: string): string
fileURLToPath(url: string|URL, options?: {windows?: boolean}): string
pathToFileURL(path: string, options?: {windows?: boolean}): URL
urlFormat(url: URL, options?: {auth?: boolean, fragment?: boolean, search?: boolean, unicode?: boolean}): string
urlToHttpOptions(url: URL): {protocol:string,hostname:string,port:number,auth?:string,path:string,href:string,hash?:string,search?:string}

8 Legacy API
url.parse(urlString: string, parseQueryString?: boolean, slashesDenoteHost?: boolean): UrlObject
url.format(urlObject: UrlObject): string
url.resolve(from: string, to: string): string

## Original Source
Node.js URL Module
https://nodejs.org/api/url.html#url_fileurltopath_url

## Digest of URL_MODULE

# URL Module (node:url)

## Overview
Node.js v24.0.0 stable provides the `node:url` module with WHATWG and legacy URL APIs for parsing, constructing, and formatting URLs.

## Importing
```js
import { URL, URLSearchParams, URLPattern, fileURLToPath, pathToFileURL, domainToASCII, domainToUnicode, format as urlFormat, urlToHttpOptions } from 'node:url';
// or
const { URL, URLSearchParams, URLPattern, fileURLToPath, pathToFileURL, domainToASCII, domainToUnicode, format: urlFormat, urlToHttpOptions } = require('node:url');
```

## Class: URL
### new URL(input: string, base?: string)
- `input` & `base` coerced to strings. Throws `TypeError` on invalid URL.
- Converts Unicode hostnames to ASCII (Punycode).

### Properties (get/set)
- `url.href: string` — full serialized URL. Setting parses new URL.
- `url.origin: string` — read-only origin (protocol + host).
- `url.protocol: string` — includes trailing `:`. Invalid assignments ignored.
- `url.username: string` / `url.password: string` — percent-encoded on set.
- `url.host: string` — `<hostname>:<port>`. Invalid ignored.
- `url.hostname: string` — host without port.
- `url.port: string` — numeric port `0-65535`. Default port yields `""`. Invalid or out-of-range ignored; leading digits taken.
- `url.pathname: string` — path portion. Percent-encoded on set.
- `url.search: string` — serialized query, includes leading `?`. Percent-encoded on set.
- `url.searchParams: URLSearchParams` — mutable query interface.
- `url.hash: string` — fragment, includes leading `#`. Percent-encoded on set.

### Methods
- `url.toString(): string` — alias for `.href`.
- `url.toJSON(): string` — alias for `.href`, used in `JSON.stringify`.

### Static Methods
- `URL.createObjectURL(blob: Blob): string` — returns blob URL, must call `URL.revokeObjectURL(id)` to free memory.
- `URL.revokeObjectURL(id: string): void`
- `URL.canParse(input: string, base?: string): boolean`
- `URL.parse(input: string, base?: string): URL|null`

## Class: URLSearchParams
### Constructors
- `new URLSearchParams()` — empty.
- `new URLSearchParams(queryString: string)` — leading `?` ignored.
- `new URLSearchParams(object: Record<string,string|Iterable<[string,string]>>)`
- `new URLSearchParams(iterable: Iterable<[string,string]>)`

### Methods
- `.append(name: string, value: string): void`
- `.delete(name: string, value?: string): void`
- `.get(name: string): string|null`
- `.getAll(name: string): string[]`
- `.has(name: string, value?: string): boolean`
- `.set(name: string, value: string): void`
- `.sort(): void`
- `.toString(): string`
- Iterators: `.entries()`, `.keys()`, `.values()`, default iterator.
- `.forEach(callback: (value, name, params) => void, thisArg?): void`
- `.size: number`

## Class: URLPattern (experimental)
### new URLPattern(pattern: string|object, baseURL?: string, options?: { ignoreCase?: boolean })
- `.exec(input: string|object, baseURL?: string): PatternResult|null`
- `.test(input: string|object, baseURL?: string): boolean`

## Utility Functions
- `domainToASCII(domain: string): string`
- `domainToUnicode(domain: string): string`
- `fileURLToPath(url: string|URL, options?: { windows?: boolean }): string`
- `pathToFileURL(path: string, options?: { windows?: boolean }): URL`
- `urlFormat(url: URL, options?: { auth?: boolean, fragment?: boolean, search?: boolean, unicode?: boolean }): string`
- `urlToHttpOptions(url: URL): HttpOptions`

## Legacy API (deprecated)
- `url.parse(urlString: string, parseQueryString?: boolean, slashesDenoteHost?: boolean): UrlObject`
- `url.format(urlObject: UrlObject): string`
- `url.resolve(from: string, to: string): string`



## Attribution
- Source: Node.js URL Module
- URL: https://nodejs.org/api/url.html#url_fileurltopath_url
- License: License: CC BY-SA 4.0
- Crawl Date: 2025-05-09T06:30:28.043Z
- Data Size: 4255935 bytes
- Links Found: 3299

## Retrieved
2025-05-09
