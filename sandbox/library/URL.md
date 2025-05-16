# URL

## Crawl Summary
Constructor signature new URL(input, base) throws TypeError if invalid URL. Instance properties typed USVString: hash, host, hostname, href setter and getter, origin readonly, password, pathname, port, protocol, search, searchParams readonly URLSearchParams, username. Static methods: canParse(input, base): boolean; createObjectURL(blob|MediaSource): USVString; parse(input, base): URL|null; revokeObjectURL(url): void. Instance methods: toString(): USVString; toJSON(): USVString. Encoding per RFC3986. Supports Web Workers. Available since July 2015.

## Normalised Extract
Table of Contents

1 Constructor
2 Instance Properties
3 Static Methods
4 Instance Methods
5 Encoding and Normalization
6 Search Parameters

1 Constructor
Signature new URL(input, base)
Parameters
 input  USVString required absolute or relative URL string
 base   USVString optional base URL for relative input
Behavior Throws TypeError if parsing fails

2 Instance Properties
 hash         Leading '#' plus fragment USVString
 host         Hostname plus optional ':' and port USVString
 hostname     Domain name USVString
 href         Full URL setter/getter USVString
 origin       Scheme '://' domain optional ':' port readonly USVString
 password     Password before hostname USVString
 pathname     Leading '/' plus path USVString
 port         Port number or empty USVString
 protocol     Scheme plus ':' USVString
 search       Leading '?' plus query USVString
 searchParams Readonly URLSearchParams object
 username     User name before hostname USVString

3 Static Methods
 URL.canParse(input, base) -> boolean
 URL.createObjectURL(object) -> USVString
 URL.parse(input, base) -> URL or null
 URL.revokeObjectURL(url) -> void

4 Instance Methods
 url.toString() -> USVString same as href
 url.toJSON() -> USVString same as href

5 Encoding and Normalization
 Percent-encodes non-ASCII and reserved characters per RFC 3986
 Normalizes path segments (resolves '.' and '..') on construction

6 Search Parameters
 url.searchParams.get(name) -> string or null
 url.searchParams.append(name, value) -> void
 url.searchParams.set(name, value) -> void
 url.searchParams.delete(name) -> void
 url.searchParams.toString() -> USVString query without '?'



## Supplementary Details
Browser Support: All modern browsers since July 2015. Feature available in Web Workers. Compliance with RFC 3986 percent-encoding rules. Exceptions: TypeError on invalid input. Implementation steps:
1 Use URL.canParse before new URL to avoid exceptions.
2 Construct URL with new URL or URL.parse for nullable return.
3 Modify individual properties on URL instance to update href.
4 Use URL.revokeObjectURL to release blob URLs.



## Reference Details
API Specifications

Constructor
 new URL(input: USVString, base?: USVString) -> URL
 Throws TypeError if input invalid

Static Methods
 canParse(input: USVString, base?: USVString) -> boolean
 createObjectURL(object: Blob | MediaSource) -> USVString
 parse(input: USVString, base?: USVString) -> URL | null
 revokeObjectURL(url: USVString) -> void

Instance Properties (mutable unless specified)
 hash: USVString
 host: USVString
 hostname: USVString
 href: USVString
 origin: USVString readonly
 password: USVString
 pathname: USVString
 port: USVString
 protocol: USVString
 search: USVString
 searchParams: URLSearchParams readonly
 username: USVString

Instance Methods
 toString(): USVString
 toJSON(): USVString

Code Examples

// Pre-validate and parse
if URL.canParse('../cats', 'http://example.com/dogs')
  url = new URL('../cats', 'http://example.com/dogs')
else
  log 'Invalid URL'

// Modify fragment
url.hash = 'tabby'
// href becomes http://example.com/cats#tabby

// Percent-encoding path
url.pathname = 'démonstration.html'
// href becomes http://example.com/d%C3%A9monstration.html

// Working with query parameters
url = new URL('http://site/?id=123')
value = url.searchParams.get('id') // '123'
url.searchParams.append('page', '1') // updates search to '?id=123&page=1'

// Blob URL workflow
blobUrl = URL.createObjectURL(myBlob)  // blob:... opaque URL
// use blobUrl for resource loading
URL.revokeObjectURL(blobUrl) // release memory

Best Practices
 Always validate input using canParse before constructing to avoid exceptions
 Use URL.parse when you prefer null on failure instead of exceptions
 Modify properties rather than string concatenation for correctness and encoding
 Use searchParams API for safe query manipulation instead of manual string handling

Troubleshooting

Problem: TypeError on new URL
Command:
 url = new URL(input, base)
Expected: URL object created
Actual: TypeError invalid URL
Solution: pre-check URL.canParse or wrap in try catch

Problem: Unreleased blob URLs lead to memory leaks
Command:
 blobUrl = URL.createObjectURL(blob)
Expected: blobUrl string
Solution: call URL.revokeObjectURL(blobUrl) after use


## Information Dense Extract
new URL(input:USVString, base?:USVString)->URL throws TypeError; props mutable USVString: hash,host,hostname,href,password,pathname,port,protocol,search,username; readonly props USVString: origin and URLSearchParams searchParams; static canParse(input,base?)->boolean; createObjectURL(blob|MediaSource)->USVString; parse(input,base?)->URL|null; revokeObjectURL(url)->void; methods toString()->USVString; toJSON()->USVString; encoding RFC3986; path normalization; use canParse or try/catch; use searchParams API; revoke blob URLs to avoid leaks; web workers supported; since July 2015.

## Sanitised Extract
Table of Contents

1 Constructor
2 Instance Properties
3 Static Methods
4 Instance Methods
5 Encoding and Normalization
6 Search Parameters

1 Constructor
Signature new URL(input, base)
Parameters
 input  USVString required absolute or relative URL string
 base   USVString optional base URL for relative input
Behavior Throws TypeError if parsing fails

2 Instance Properties
 hash         Leading '#' plus fragment USVString
 host         Hostname plus optional ':' and port USVString
 hostname     Domain name USVString
 href         Full URL setter/getter USVString
 origin       Scheme '://' domain optional ':' port readonly USVString
 password     Password before hostname USVString
 pathname     Leading '/' plus path USVString
 port         Port number or empty USVString
 protocol     Scheme plus ':' USVString
 search       Leading '?' plus query USVString
 searchParams Readonly URLSearchParams object
 username     User name before hostname USVString

3 Static Methods
 URL.canParse(input, base) -> boolean
 URL.createObjectURL(object) -> USVString
 URL.parse(input, base) -> URL or null
 URL.revokeObjectURL(url) -> void

4 Instance Methods
 url.toString() -> USVString same as href
 url.toJSON() -> USVString same as href

5 Encoding and Normalization
 Percent-encodes non-ASCII and reserved characters per RFC 3986
 Normalizes path segments (resolves '.' and '..') on construction

6 Search Parameters
 url.searchParams.get(name) -> string or null
 url.searchParams.append(name, value) -> void
 url.searchParams.set(name, value) -> void
 url.searchParams.delete(name) -> void
 url.searchParams.toString() -> USVString query without '?'

## Original Source
MDN URL API
https://developer.mozilla.org/en-US/docs/Web/API/URL

## Digest of URL

# URL API (retrieved 2024-06-15)

## Constructor

### Signature

new URL(input, base?)
- input: USVString (absolute or relative URL string)
- base: USVString optional base URL for relative input
- Throws TypeError if input cannot be parsed as valid URL

## Instance Properties

- hash : USVString returned as leading '#' plus fragment identifier
- host : USVString hostname plus optional ':' and port
- hostname : USVString domain name
- href : USVString full URL stringifier setter and getter
- origin (readonly) : USVString scheme plus '://' plus domain plus optional ':' port
- password : USVString password segment before hostname
- pathname : USVString leading '/' plus path segment
- port : USVString numeric port section or empty string
- protocol : USVString scheme plus ':'
- search : USVString leading '?' plus query string or empty string
- searchParams (readonly) : URLSearchParams object
- username : USVString username segment before hostname

## Static Methods

- URL.canParse(input, base?) -> boolean
- URL.createObjectURL(object: Blob or MediaSource) -> USVString
- URL.parse(input, base?) -> URL or null
- URL.revokeObjectURL(url: USVString) -> void

## Instance Methods

- toString() -> USVString same as href
- toJSON() -> USVString same as href

## Encoding and Normalization

- Percent-encodes input values per RFC 3986
- Automatically normalizes path segments when constructing

## Usage Notes

- Throws TypeError on invalid URL
- Use canParse to prevalidate
- Modify properties to rebuild URL dynamically

## Search Parameters

- Use url.searchParams.get(name)
- Use url.searchParams.append(name, value)
- URLSearchParams methods apply percent-encoding

## Attribution
- Source: MDN URL API
- URL: https://developer.mozilla.org/en-US/docs/Web/API/URL
- License: License
- Crawl Date: 2025-05-16T03:35:41.985Z
- Data Size: 1757562 bytes
- Links Found: 18175

## Retrieved
2025-05-16
