sandbox/library/URL_MODULE.md
# sandbox/library/URL_MODULE.md
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
sandbox/library/YARGS_CLI.md
# sandbox/library/YARGS_CLI.md
# YARGS_CLI

## Crawl Summary
Installation via npm install --save yargs. Import statements import yargs from 'yargs' and import hideBin from 'yargs/helpers'. Core API signatures: hideBin(argv: string[]): string[], yargs(): YargsInstance. Methods: scriptName(name: string), usage(usage: string), command(cmd:string|array, description:string, builder?, handler?), positional(name:string, options:PositionalOptions), help([opt],[message]), parse(argv, [context],[callback]). PositionalOptions include type, describe, default, choices, demandOption. Fluent chaining pattern. Generated help menu based on options. Example code provided.

## Normalised Extract
Table of Contents
1 Installation
2 Basic Parser Setup
3 Defining Commands
4 Positional Arguments
5 Help Generation
6 Argument Parsing

1 Installation
Install yargs via npm
npm install --save yargs

2 Basic Parser Setup
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
Initialize parser
const parser = yargs()
Use hideBin to strip node and script path
const args = parser.parse(hideBin(process.argv))

3 Defining Commands
Method signature
.command(cmd: string | string[], description: string, builder?: (yargs) => YargsInstance, handler?: (argv) => void)
Usage example
parser.command(
  'hello [name]',
  'welcome ter yargs!',
  y => y.positional('name', { type: 'string', default: 'Cambi', describe: 'the name to say hello to' }),
  argv => console.log('hello', argv.name)
)

4 Positional Arguments
Use positional to declare arguments in command builders
.positional(name: string, options: { type: 'string' | 'number' | 'boolean'; describe: string; default?: any; choices?: any[]; demandOption?: boolean })
Example
builder.positional('name', { type: 'string', default: 'Cambi', describe: 'the name to say hello to' })

5 Help Generation
.help([opt], [message])
Generates --help option and auto prints usage

6 Argument Parsing
.parse(argv: string[], context?: object, callback?) returns parsed Arguments or Promise
.parse(hideBin(process.argv))

Use fluent chaining: scriptName, usage, command, help, parse.

## Supplementary Details
Configuration Options Summary

scriptName(name: string)
  Purpose: override the displayed script name in usage and help.
  Default: basename of process.argv[1]

usage(usage: string)
  Purpose: set usage instructions string, supports $0 placeholder.

command(cmd: string | string[], description: string, builder?: Function, handler?: Function)
  cmd patterns: '<cmd>' for required, '[cmd]' for optional, 'files...' for variadic.

positional(name: string, options: PositionalOptions)
  type: string | number | boolean
  describe: string
  default: any
  choices: array of allowed values
  demandOption: boolean to enforce presence

help(opt: string = 'help', message: string = 'Show help')
  Register help option and override default message.

parse(argv, context, callback)
  argv: array of strings
  context: optional object to use as this
  callback: err, argv, output => void
  Returns: parsed Arguments object or Promise<Arguments>

hideBin(argv: string[]) -> drops first two entries. Use hideBin(process.argv)

Fluent API returns same parser instance for chaining.


## Reference Details
API Specifications

Function hideBin(argv: string[]): string[]
  Parameters
    argv: array of process arguments including node and script path
  Returns
    array of strings containing user-supplied args only

Function yargs(): YargsInstance
  Returns
    YargsInstance with methods below

YargsInstance Methods

scriptName(name: string): YargsInstance
  name: string to display as command name in help

usage(usage: string): YargsInstance
  usage: string containing usage pattern, supports $0 placeholder

command(
  cmd: string | string[],
  description: string,
  builder?: (yargs: YargsInstance) => YargsInstance,
  handler?: (argv: Arguments) => void
): YargsInstance
  cmd patterns examples:
    'install <pkg>' required argument
    'remove [pkg]' optional argument
    'copy <src> [dest]' mixed
    'build [files...]' variadic
  builder: function to add options and positionals
  handler: function invoked with parsed argv

positional(
  name: string,
  options: {
    type: 'string' | 'number' | 'boolean',
    describe: string,
    default?: any,
    choices?: any[],
    demandOption?: boolean
  }
): YargsInstance

help(opt?: string, message?: string): YargsInstance
  opt: name of help flag, default 'help'
  message: help description, default 'Show help'

parse(
  argv: string[],
  context?: object,
  callback?: (err: Error, argv: Arguments, output: string) => void
): Arguments | Promise<Arguments>

Arguments Type
  argv: object mapping option names to values
  _: array of non-option arguments

Implementation Pattern

1 Create script file with shebang
2 import yargs and hideBin
3 Initialize parser: yargs()
4 Chain scriptName, usage, commands, help
5 Invoke parse(hideBin(process.argv))

Example Complete Implementation
#!/usr/bin/env node
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

yargs()
  .scriptName('my-cli')
  .usage('$0 <cmd> [options]')
  .command(
    'greet <user>',
    'Greet a user',
    y => y.positional('user', { type: 'string', describe: 'username' }),
    argv => console.log('Hello', argv.user)
  )
  .help()
  .strict()
  .fail((msg, err) => {
    if (err) throw err
    console.error(msg)
    process.exit(1)
  })
  .parse(hideBin(process.argv))

Best Practices

Use strict() to enforce defined commands and options
Use fail() for custom error handling
Chain command definitions before help and parse
Always hideBin(process.argv) for accurate parsing

Troubleshooting

Unknown command error:
  Run with --help to view available commands
  Example output:
    my-cli <cmd> [options]

Validate positional defaults and types
Check that builder functions return yargs instance


## Information Dense Extract
install yargs via npm install --save yargs import yargs from 'yargs' import { hideBin } from 'yargs/helpers' core methods: hideBin(argv:string[]):string[] yargs():YargsInstance scriptName(name:string) usage(usage:string) command(cmd:string|string[],desc:string,builder?:Function,handler?:Function) positional(name:string,{type:string|number|boolean,describe:string,default?:any,choices?:any[],demandOption?:boolean}) help(opt?:string,msg?:string) parse(argv:string[],context?:object,callback?:Function):Arguments|Promise. Fluent pattern: yargs().scriptName().usage().command().help().parse(hideBin(process.argv)). Use strict(), fail() for validations. Example code included.

## Sanitised Extract
Table of Contents
1 Installation
2 Basic Parser Setup
3 Defining Commands
4 Positional Arguments
5 Help Generation
6 Argument Parsing

1 Installation
Install yargs via npm
npm install --save yargs

2 Basic Parser Setup
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
Initialize parser
const parser = yargs()
Use hideBin to strip node and script path
const args = parser.parse(hideBin(process.argv))

3 Defining Commands
Method signature
.command(cmd: string | string[], description: string, builder?: (yargs) => YargsInstance, handler?: (argv) => void)
Usage example
parser.command(
  'hello [name]',
  'welcome ter yargs!',
  y => y.positional('name', { type: 'string', default: 'Cambi', describe: 'the name to say hello to' }),
  argv => console.log('hello', argv.name)
)

4 Positional Arguments
Use positional to declare arguments in command builders
.positional(name: string, options: { type: 'string' | 'number' | 'boolean'; describe: string; default?: any; choices?: any[]; demandOption?: boolean })
Example
builder.positional('name', { type: 'string', default: 'Cambi', describe: 'the name to say hello to' })

5 Help Generation
.help([opt], [message])
Generates --help option and auto prints usage

6 Argument Parsing
.parse(argv: string[], context?: object, callback?) returns parsed Arguments or Promise
.parse(hideBin(process.argv))

Use fluent chaining: scriptName, usage, command, help, parse.

## Original Source
Yargs CLI Argument Parser
https://yargs.js.org/docs/

## Digest of YARGS_CLI

# Yargs CLI Argument Parser

## Installation

Install via npm

npm install --save yargs

## Getting Started Example

#!/usr/bin/env node
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

yargs()
  .scriptName('pirate-parser')
  .usage('$0 <cmd> [args]')
  .command(
    'hello [name]',
    'welcome ter yargs!',
    builder => builder.positional('name', {
      type    : 'string',
      default : 'Cambi',
      describe: 'the name to say hello to'
    }),
    argv => console.log('hello', argv.name, 'welcome to yargs!')
  )
  .help()
  .parse(hideBin(process.argv))

## Core Method Signatures

Function hideBin(argv: string[]): string[]

Function yargs(): YargsInstance

Method scriptName(name: string): YargsInstance
Method usage(usage: string): YargsInstance
Method command(cmd: string | string[], description: string, builder?: (yargs: YargsInstance) => YargsInstance, handler?: (argv: Arguments) => void): YargsInstance
Method positional(name: string, options: PositionalOptions): YargsInstance
Method help(opt?: string, message?: string): YargsInstance
Method parse(argv: string[], context?: object, callback?: (err: Error, argv: Arguments, output: string) => void): Arguments | Promise<Arguments>

## Configuration Options

PositionalOptions:
  type         string | number | boolean
  describe     string
  default?     any
  choices?     any[]
  demandOption? boolean

## Usage Patterns

Use hideBin to strip node and script path from process.argv.
Chain scriptName, usage, command, positional, help, parse in fluent API.

## Current Version and License

Yargs · v17 · MIT License


## Attribution
- Source: Yargs CLI Argument Parser
- URL: https://yargs.js.org/docs/
- License: License: MIT
- Crawl Date: 2025-05-09T00:39:24.675Z
- Data Size: 348060 bytes
- Links Found: 34

## Retrieved
2025-05-09
sandbox/library/AGENTIC_LIB_WORKFLOWS.md
# sandbox/library/AGENTIC_LIB_WORKFLOWS.md
# AGENTIC_LIB_WORKFLOWS

## Crawl Summary
Agentic-lib provides a set of reusable GitHub Actions workflows invoked via workflow_call. Core workflows: issue-creator (wfr-create-issue@1.2.0), issue-worker (wfr-select-issue@1.2.0, wfr-apply-issue-resolution@1.2.0, wfr-create-pr@1.2.0), automerge (wfr-automerge-*.yml@1.2.0), issue-reviewer (wfr-review-issue@1.2.0), library-worker (wfr-completion-maintain-library), source-worker (wfr-completion-maintain-sources), publish-web (wfr-github-publish-web). Each accepts typed inputs with defaults, exposes outputs. Chaining via needs.<job>.outputs.<param>. Configuration files (CONTRIBUTING.md, eslint.config.js) can override style and mission. AWS deployment uses CDK with assume-role trust policy and permissions policy, deploy via npx cdk deploy producing Lambda ARNs, SQS URLs, S3 bucket ARNs.

## Normalised Extract
Table of Contents

1 Setup
2 Workflow Invocation
3 Workflow Parameters
4 Chaining Workflows
5 Configuration Tuning
6 Issue Management Workflows
7 Reusable Workflows SDK
8 AWS Deployment

1 Setup
Clone https://github.com/xn-intenton-z2a/repository0
Install: npm install
test: npm test

2 Workflow Invocation
Use on: workflow_call or schedule or workflow_dispatch
jobs:
  create_issue:
    uses: xn-intenton-z2a/agentic-lib/.github/workflows/issue-creator.yml@main
    with:
      issueTitle: "Describe the task"

3 Workflow Parameters
issue-creator inputs:
  issueTitle string default "house choice"
issue-worker inputs:
  maxAttempts integer default 1
automerge inputs:
  mergeBranch string default "main"
  requiredLabels array default []
issue-reviewer inputs:
  reviewCriteria string default "fixed"

4 Chaining Workflows
Use needs.create_issue.outputs.newIssueNumber to pass issue number to issue-worker
job condition example: if needs.review.outputs.closed == 'true'

5 Configuration Tuning
CONTRIBUTING.md: custom mission
eslint.config.js: add rules
Override files: README.md, package.json, src/lib/main.js, tests/unit/main.test.js

6 Issue Management Workflows
issue-creator.yml -> creates new GitHub issue
issue-worker.yml -> selects issue, applies resolution, opens PR
automerge.yml -> finds PR, checks labels, merges when ready
issue-reviewer.yml -> reviews and closes issue when tests pass

7 Reusable Workflows SDK
Each workflow file under .github/workflows maps to a function
Inputs defined under with: section, outputs under outputs
Invoke with uses: and with: in calling workflow
Supports version pinning via @<tag>

8 AWS Deployment
AWS role: agentic-lib-deployment-role assume with sts assume-role
IAM trust policy allows sts:AssumeRole and sts:TagSession
Permissions policy: cloudformation, iam, s3, logs, lambda, dynamodb, sqs, sts
Commands:
  aws sts assume-role --role-arn <ARN> --role-session-name <name>
  export AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
  npx cdk deploy



## Supplementary Details
Agentic-lib reads agentic-lib.yml for parameters:
  schedule: schedule-2
  paths:
    missionFilepath: MISSION.md write none
    librarySourcesFilepath: sandbox/SOURCES.md write limit 16
    libraryDocumentsPath: sandbox/library write limit 64
    featuresPath: sandbox/features write limit 8
    contributingFilepath: CONTRIBUTING.md
    targetTestsPath: sandbox/tests write
    otherTestsPaths: tests/unit
    targetSourcePath: sandbox/source write
    otherSourcePaths: src/lib
    dependenciesFilepath: package.json write
    documentationPath: sandbox/docs write
    formattingFilepath: .prettierrc
    lintingFilepath: eslint.config.js
    readmeFilepath: README.md
  buildScript: npm run build
  testScript: npm test
  mainScript: npm run start
  featureDevelopmentIssuesWipLimit: 3
  maintenanceIssuesWipLimit: 3
  attemptsPerBranch: 2
  attemptsPerIssue: 1
  docRoot: public
  sandbox:
    sandboxReset: true
    sandboxPath: sandbox
  discussionBot seedDiscussionFilepath: SEED_DISCUSSION.md

## Reference Details
Example: Invoke Issue Creator
on:
  workflow_dispatch:
    inputs:
      issueTitle:
        description: 'Title for the new task'
        required: false
        default: 'house choice'
jobs:
  create_issue:
    uses: xn-intenton-z2a/agentic-lib/.github/workflows/issue-creator.yml@1.2.0
    with:
      issueTitle: ${{ github.event.inputs.issueTitle }}

Example: AWS Assume Role in GitHub Actions
steps:
  - name: Configure AWS Credentials
    uses: aws-actions/configure-aws-credentials@v4
    with:
      role-to-assume: arn:aws:iam::541134664601:role/agentic-lib-deployment-role
      aws-region: eu-west-2
  - name: Set up Node.js
    uses: actions/setup-node@v3
    with:
      node-version: '20'

IAM Trust Policy (agentic-lib-deployment-trust-policy.json):
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {"AWS": ["arn:aws:iam::541134664601:user/antony-local-user","arn:aws:iam::541134664601:role/agentic-lib-github-actions-role"]},
      "Action": "sts:AssumeRole"
    }
  ]
}

Assume Role CLI:
aws sts assume-role \
  --role-arn "$ROLE_ARN" \
  --role-session-name "$SESSION_NAME" \
  --output json

Troubleshooting:
If assume-role fails check trust policy. Use aws iam get-role to verify assume role policy. Confirm AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are unset before assume-role.

Example: CDK deploy commands
mvnw clean package
npx cdk deploy
Expected output contains AgenticLibStack.* outputs with ARNs and resource names



## Information Dense Extract
agentic-lib workflows invoked via workflow_call; core workflows: issue-creator, issue-worker, automerge, issue-reviewer, library-worker, source-worker, publish-web; each workflow inputs: typed parameters with defaults; outputs: status, ids; chaining via needs.<job>.outputs; config via agentic-lib.yml fields: schedule, paths, buildScript, testScript, mainScript, limits; AWS CDK deploy uses assume-role with trust policy and permissions policy, commands: aws sts assume-role, npx cdk deploy, outputs: LambdaArn, QueueUrl, BucketArn; cleanup: cdk destroy, aws logs delete-log-group.

## Sanitised Extract
Table of Contents

1 Setup
2 Workflow Invocation
3 Workflow Parameters
4 Chaining Workflows
5 Configuration Tuning
6 Issue Management Workflows
7 Reusable Workflows SDK
8 AWS Deployment

1 Setup
Clone https://github.com/xn-intenton-z2a/repository0
Install: npm install
test: npm test

2 Workflow Invocation
Use on: workflow_call or schedule or workflow_dispatch
jobs:
  create_issue:
    uses: xn-intenton-z2a/agentic-lib/.github/workflows/issue-creator.yml@main
    with:
      issueTitle: 'Describe the task'

3 Workflow Parameters
issue-creator inputs:
  issueTitle string default 'house choice'
issue-worker inputs:
  maxAttempts integer default 1
automerge inputs:
  mergeBranch string default 'main'
  requiredLabels array default []
issue-reviewer inputs:
  reviewCriteria string default 'fixed'

4 Chaining Workflows
Use needs.create_issue.outputs.newIssueNumber to pass issue number to issue-worker
job condition example: if needs.review.outputs.closed == 'true'

5 Configuration Tuning
CONTRIBUTING.md: custom mission
eslint.config.js: add rules
Override files: README.md, package.json, src/lib/main.js, tests/unit/main.test.js

6 Issue Management Workflows
issue-creator.yml -> creates new GitHub issue
issue-worker.yml -> selects issue, applies resolution, opens PR
automerge.yml -> finds PR, checks labels, merges when ready
issue-reviewer.yml -> reviews and closes issue when tests pass

7 Reusable Workflows SDK
Each workflow file under .github/workflows maps to a function
Inputs defined under with: section, outputs under outputs
Invoke with uses: and with: in calling workflow
Supports version pinning via @<tag>

8 AWS Deployment
AWS role: agentic-lib-deployment-role assume with sts assume-role
IAM trust policy allows sts:AssumeRole and sts:TagSession
Permissions policy: cloudformation, iam, s3, logs, lambda, dynamodb, sqs, sts
Commands:
  aws sts assume-role --role-arn <ARN> --role-session-name <name>
  export AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
  npx cdk deploy

## Original Source
intentïon-agentic-lib Workflows
https://github.com/xn-intenton-z2a/agentic-lib

## Digest of AGENTIC_LIB_WORKFLOWS

# Getting Started
Clone seed repository: git clone https://github.com/xn-intenton-z2a/repository0.git
cd repository0
Install dependencies: npm install
Trigger first workflow: on workflow_dispatch or schedule run Create Issue workflow by calling issue-creator.yml

# Development Workflows
## Create Issue (issue-creator.yml)
Trigger: workflow_call, workflow_dispatch, schedule
Reusable workflow: wfr-create-issue.yml@1.2.0
Inputs:
  issueTitle: string, required false, default 'house choice'
Outputs:
  newIssueNumber: number

## Issue Worker (issue-worker.yml)
Trigger: workflow_call, schedule
Reusable workflows:
  wfr-select-issue.yml@1.2.0
  wfr-apply-issue-resolution.yml@1.2.0
  wfr-create-pr.yml@1.2.0
Inputs:
  maxAttempts: integer default 1
Outputs:
  prNumber: number, resolutionStatus: string

## Automerge (automerge.yml)
Trigger: workflow_call, schedule
Reusable workflows:
  wfr-automerge-find-pr-from-pull-request.yml@1.2.0
  wfr-automerge-find-pr-in-check-suite.yml@1.2.0
  wfr-automerge-label-issue.yml@1.2.0
  wfr-automerge-merge-pr.yml@1.2.0
Inputs:
  mergeBranch: string default 'main'
  requiredLabels: array<string> default []

## Review Issue (issue-reviewer.yml)
Trigger: workflow_call, schedule
Reusable workflow: wfr-review-issue.yml@1.2.0
Inputs:
  reviewCriteria: string default 'fixed'
Outputs:
  closed: boolean

# Feature Chain Workflows
Library Worker:
  file: library-worker.yml
  reusable: wfr-completion-maintain-library.yml
Source Worker:
  file: source-worker.yml
  reusable: wfr-completion-maintain-sources.yml
Publish Web:
  file: publish-web.yml
  reusable: wfr-github-publish-web.yml

# Reusable Workflows SDK Integration
Each reusable workflow is invoked using uses: <repo>/.github/workflows/<file>@<version>
Workflow inputs map to parameters under with:
  versionIncrement: string
  buildScript: string
  issueTitle: string
Outputs exposed via steps.<id>.outputs

# Configuration Tuning
Agentic-lib reads the following config files if present:
  CONTRIBUTING.md (mission statement guidelines)
  eslint.config.js (ESLint rules)
Override defaults or blank out:
  README.md, package.json, src/lib/main.js, tests/unit/main.test.js

# Chaining Workflows
Use outputs from one workflow as inputs to another by referencing needs.<job>.outputs.<name>
Example: if Review Issue outputs fixed=true then automerge job condition if fixed == 'true'

# Repository Setup
Template includes top-level workflows under .github/workflows and .github/agentic-lib
Required secrets:
  CHATGPT_API_SECRET_KEY, GITHUB_TOKEN
Node.js v20+, AWS CLI, Java JDK11+, Maven, AWS CDK v2, Docker

# AWS Deployment (CDK)
Assume role using aws sts assume-role with agentic-lib-deployment-role
Policy document: agentic-lib-deployment-permissions-policy.json granting cloudformation, iam, s3, logs, lambda, dynamodb, sqs
Commands:
  npm install -g aws-cdk
  ./mvnw clean package
  npx cdk deploy
Outputs include Arn and resource names for DigestLambda, DigestQueue, EventsBucket
Cleanup:
  npx cdk destroy
  aws logs delete-log-group --log-group-name "/aws/s3/agentic-lib-telemetry-bucket"
  aws logs delete-log-group --log-group-name "/aws/lambda/agentic-lib-digest-function"


## Attribution
- Source: intentïon-agentic-lib Workflows
- URL: https://github.com/xn-intenton-z2a/agentic-lib
- License: License: MIT
- Crawl Date: 2025-05-09T18:30:16.514Z
- Data Size: 741436 bytes
- Links Found: 4937

## Retrieved
2025-05-09
sandbox/library/AGENT_CONFIG.md
# sandbox/library/AGENT_CONFIG.md
# AGENT_CONFIG

## Crawl Summary
YAML schema for agentic-lib workflows configuration defining schedule identifier, file path mappings with write permissions and limits, npm build/test/start commands, issue and branch attempt limits, web doc root, sandbox reset path, and discussion bot seed file.

## Normalised Extract
Table of Contents
1 schedule
2 paths mapping
3 execution commands
4 issue and attempt limits
5 web publishing
6 sandbox configuration
7 discussionBot configuration

1 schedule
 schedule: schedule-2

2 paths mapping
 missionFilepath.path = MISSION.md
 librarySourcesFilepath.path = sandbox/SOURCES.md, permissions = write, limit = 16
 libraryDocumentsPath.path = sandbox/library/, permissions = write, limit = 64
 featuresPath.path = sandbox/features/, permissions = write, limit = 8
 contributingFilepath.path = CONTRIBUTING.md
 targetTestsPath.path = sandbox/tests/, permissions = write
 otherTestsPaths.paths = [tests/unit/]
 targetSourcePath.path = sandbox/source/, permissions = write
 otherSourcePaths.paths = [src/lib/]
 dependenciesFilepath.path = package.json, permissions = write
 documentationPath.path = sandbox/docs/, permissions = write
 formattingFilepath.path = .prettierrc
 lintingFilepath.path = eslint.config.js
 readmeFilepath.path = README.md

3 execution commands
 buildScript = npm run build
testScript = npm test
mainScript = npm run start

4 issue and attempt limits
 featureDevelopmentIssuesWipLimit = 3
 maintenanceIssuesWipLimit = 3
 attemptsPerBranch = 2
 attemptsPerIssue = 1

5 web publishing
 docRoot = public

6 sandbox configuration
 sandboxReset = true
 sandboxPath = sandbox

7 discussionBot configuration
 seedDiscussionFilepath = SEED_DISCUSSION.md

## Supplementary Details
Workflows load agentic-lib.yml at repository root. 'schedule' selects the predefined schedule in schedule-2. 'paths' mapping provides filepaths and permission controls used by elaborator, engineer, and maintainer workflows; 'limit' enforces maximum document count. Execution commands invoked in CI: buildScript, testScript, mainScript. Issue and attempt limits control how many concurrent issues and retries per branch and issue: 3 issues WIP, 2 attempts per branch, 1 per issue. 'docRoot' passed to publish-web.yml for GitHub Pages. 'sandboxReset' and 'sandboxPath' reset and locate sandbox directory. 'seedDiscussionFilepath' used by discussionBot workflows to seed new threads.

## Reference Details
JSON Schema:
{
  type: 'object',
  properties: {
    schedule: { type: 'string', enum: ['schedule-1','schedule-2','schedule-3'] },
    paths: {
      type: 'object',
      properties: {
        missionFilepath: { type: 'object', properties: { path: { type: 'string' } }, required: ['path'] },
        librarySourcesFilepath: { type: 'object', properties: { path: { type: 'string' }, permissions: { type: 'array', items: { type: 'string' } }, limit: { type: 'integer' } }, required: ['path','permissions','limit'] },
        libraryDocumentsPath: { type: 'object', properties: { path: { type: 'string' }, permissions: { type: 'array', items: { type: 'string' } }, limit: { type: 'integer' } }, required: ['path','permissions','limit'] },
        featuresPath: { type: 'object', properties: { path: { type: 'string' }, permissions: { type: 'array', items: { type: 'string' } }, limit: { type: 'integer' } }, required: ['path','permissions','limit'] },
        contributingFilepath: { type: 'object', properties: { path: { type: 'string' } }, required: ['path'] },
        targetTestsPath: { type: 'object', properties: { path: { type: 'string' }, permissions: { type: 'array', items: { type: 'string' } } }, required: ['path','permissions'] },
        otherTestsPaths: { type: 'object', properties: { paths: { type: 'array', items: { type: 'string' } } }, required: ['paths'] },
        targetSourcePath: { type: 'object', properties: { path: { type: 'string' }, permissions: { type: 'array', items: { type: 'string' } } }, required: ['path','permissions'] },
        otherSourcePaths: { type: 'object', properties: { paths: { type: 'array', items: { type: 'string' } } }, required: ['paths'] },
        dependenciesFilepath: { type: 'object', properties: { path: { type: 'string' }, permissions: { type: 'array', items: { type: 'string' } } }, required: ['path','permissions'] },
        documentationPath: { type: 'object', properties: { path: { type: 'string' }, permissions: { type: 'array', items: { type: 'string' } } }, required: ['path','permissions'] },
        formattingFilepath: { type: 'object', properties: { path: { type: 'string' } }, required: ['path'] },
        lintingFilepath: { type: 'object', properties: { path: { type: 'string' } }, required: ['path'] },
        readmeFilepath: { type: 'object', properties: { path: { type: 'string' } }, required: ['path'] }
      },
      required: ['missionFilepath','librarySourcesFilepath','libraryDocumentsPath','featuresPath']
    },
    buildScript: { type: 'string' },
    testScript: { type: 'string' },
    mainScript: { type: 'string' },
    featureDevelopmentIssuesWipLimit: { type: 'integer', minimum: 1 },
    maintenanceIssuesWipLimit: { type: 'integer', minimum: 1 },
    attemptsPerBranch: { type: 'integer', minimum: 1 },
    attemptsPerIssue: { type: 'integer', minimum: 1 },
    docRoot: { type: 'string' },
    sandbox: { type: 'object', properties: { sandboxReset: { type: 'boolean' }, sandboxPath: { type: 'string' } }, required: ['sandboxReset','sandboxPath'] },
    discussionBot: { type: 'object', properties: { seedDiscussionFilepath: { type: 'string' } }, required: ['seedDiscussionFilepath'] }
  },
  required: ['schedule','paths','buildScript','testScript','mainScript']
}

Example Usage in JS:
import fs from 'fs'
import yaml from 'yaml'
const config = yaml.parse(fs.readFileSync('agentic-lib.yml','utf8'))
// validate config against schema before running workflows

// sample GitHub Actions call
jobs:
  run_build:
    uses: ./.github/workflows/publish-web.yml@main
    with:
      docRoot: public


## Information Dense Extract
schedule=schedule-2; path.mission=MISSION.md; path.librarySources=sandbox/SOURCES.md perms=[write] limit=16; path.libraryDocs=sandbox/library/ perms=[write] limit=64; path.features=sandbox/features/ perms=[write] limit=8; contributing=CONTRIBUTING.md; tests.target=sandbox/tests/ perms=[write]; tests.other=[tests/unit/]; source.target=sandbox/source/ perms=[write]; source.other=[src/lib/]; deps=package.json perms=[write]; docs=sandbox/docs/ perms=[write]; formatting=.prettierrc; linting=eslint.config.js; readme=README.md; build=npm run build; test=npm test; start=npm run start; issueWIP=3; maintenanceWIP=3; attempts.branch=2; attempts.issue=1; webRoot=public; sandbox.reset=true; sandbox.path=sandbox; discussion.seed=SEED_DISCUSSION.md

## Sanitised Extract
Table of Contents
1 schedule
2 paths mapping
3 execution commands
4 issue and attempt limits
5 web publishing
6 sandbox configuration
7 discussionBot configuration

1 schedule
 schedule: schedule-2

2 paths mapping
 missionFilepath.path = MISSION.md
 librarySourcesFilepath.path = sandbox/SOURCES.md, permissions = write, limit = 16
 libraryDocumentsPath.path = sandbox/library/, permissions = write, limit = 64
 featuresPath.path = sandbox/features/, permissions = write, limit = 8
 contributingFilepath.path = CONTRIBUTING.md
 targetTestsPath.path = sandbox/tests/, permissions = write
 otherTestsPaths.paths = [tests/unit/]
 targetSourcePath.path = sandbox/source/, permissions = write
 otherSourcePaths.paths = [src/lib/]
 dependenciesFilepath.path = package.json, permissions = write
 documentationPath.path = sandbox/docs/, permissions = write
 formattingFilepath.path = .prettierrc
 lintingFilepath.path = eslint.config.js
 readmeFilepath.path = README.md

3 execution commands
 buildScript = npm run build
testScript = npm test
mainScript = npm run start

4 issue and attempt limits
 featureDevelopmentIssuesWipLimit = 3
 maintenanceIssuesWipLimit = 3
 attemptsPerBranch = 2
 attemptsPerIssue = 1

5 web publishing
 docRoot = public

6 sandbox configuration
 sandboxReset = true
 sandboxPath = sandbox

7 discussionBot configuration
 seedDiscussionFilepath = SEED_DISCUSSION.md

## Original Source
intentïon agentic-lib Workflows
https://github.com/xn-intenton-z2a/agentic-lib

## Digest of AGENT_CONFIG

# Agent Configuration Schema

Date Retrieved: 2025-04-02

## schedule

schedule: schedule-2

## paths mapping

missionFilepath:
  path: MISSION.md

librarySourcesFilepath:
  path: sandbox/SOURCES.md
  permissions: [write]
  limit: 16

libraryDocumentsPath:
  path: sandbox/library/
  permissions: [write]
  limit: 64

featuresPath:
  path: sandbox/features/
  permissions: [write]
  limit: 8

contributingFilepath:
  path: CONTRIBUTING.md

targetTestsPath:
  path: sandbox/tests/
  permissions: [write]

otherTestsPaths:
  paths: [tests/unit/]

targetSourcePath:
  path: sandbox/source/
  permissions: [write]

otherSourcePaths:
  paths: [src/lib/]

dependenciesFilepath:
  path: package.json
  permissions: [write]

documentationPath:
  path: sandbox/docs/
  permissions: [write]

formattingFilepath:
  path: .prettierrc

lintingFilepath:
  path: eslint.config.js

readmeFilepath:
  path: README.md

## execution commands

buildScript: npm run build
testScript: npm test
mainScript: npm run start

env keys required by workflows: CHATGPT_API_SECRET_KEY, GITHUB_TOKEN

## issue and attempt limits

featureDevelopmentIssuesWipLimit: 3
maintenanceIssuesWipLimit: 3
attemptsPerBranch: 2
attemptsPerIssue: 1

## web publishing

docRoot: public

## sandbox configuration

sandboxReset: true
sandboxPath: sandbox

## discussionBot configuration

seedDiscussionFilepath: SEED_DISCUSSION.md


## Attribution
- Source: intentïon agentic-lib Workflows
- URL: https://github.com/xn-intenton-z2a/agentic-lib
- License: License: MIT
- Crawl Date: 2025-05-08T18:31:05.022Z
- Data Size: 682118 bytes
- Links Found: 4507

## Retrieved
2025-05-08
sandbox/library/VITEST_GUIDE.md
# sandbox/library/VITEST_GUIDE.md
# VITEST_GUIDE

## Crawl Summary
Installation requires Vite>=5.0.0 and Node>=18.0.0. Install via npm/yarn/pnpm/bun or npx. Tests: filenames include .test. or .spec.; use import { expect, test } from 'vitest'; define scripts in package.json. Configuration inherits Vite config; override via vitest.config.ts, --config, or defineConfig mode; supports .js/.ts/etc; mergeConfig available. Workspaces: define glob patterns or config objects in workspace array. CLI: vitest run, --port, --https, skip install checks via env var. IDE: VSCode extension. Examples: multiple frameworks. Auto dependency prompts can be disabled. Projects list. Unreleased builds via pkg.pr.new and pnpm link. Community channels.

## Normalised Extract
Table of Contents:
1 Test File Conventions
2 Installation Commands and Requirements
3 Package.json Scripts
4 Vite Unified Configuration
5 Standalone Vitest Config
6 Config File Extensions
7 Conditional Config Overrides
8 Merging Vite and Vitest Config
9 Workspaces Configuration
10 CLI Options and Environment Variables
11 IDE Integration

1 Test File Conventions
Tests must include .test. or .spec. in filename. Vitest identifies files matching /\.(test|spec)\.[jt]s$/ by default.

2 Installation Commands and Requirements
Requirements:
  Vite: >=5.0.0
  Node: >=18.0.0
Commands:
  npm install -D vitest
  yarn add -D vitest
  pnpm add -D vitest
  bun add -D vitest
  npx vitest (fallback install behavior)

3 Package.json Scripts
Add:
  "scripts": {
    "test": "vitest"
  }
Optional coverage:
  "coverage": "vitest run --coverage"

4 Vite Unified Configuration
If no vitest.config file, Vitest reads root vite.config.ts/js:
  resolve.alias, plugins pass-through.

5 Standalone Vitest Config
File: vitest.config.(js|ts)
Content:
  import { defineConfig } from 'vitest/config'
  export default defineConfig({ test: { /* options */ } })

6 Config File Extensions
Supported: .js, .mjs, .cjs, .ts, .cts, .mts
Unsupported: .json

7 Conditional Config Overrides
Use CLI: vitest --config <path>
Use env: process.env.VITEST or defineConfig(mode) to apply test-mode settings.

8 Merging Vite and Vitest Config
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.mjs'
export default mergeConfig(viteConfig, defineConfig({ test: { /* options */ } }))

9 Workspaces Configuration
vitest.config.ts:
  test.workspace: array of:
    - glob patterns: 'packages/*'
    - config files: 'tests/*/vitest.config.{e2e,unit}.ts'
    - objects: { test: { name, root, environment, setupFiles } }

10 CLI Options and Environment Variables
Commands:
  vitest             : interactive watch mode
  vitest run         : single-run
  vitest --port <n>  : override port
  vitest --https     : enable https server
  vitest --config <p>: use specific config
Env vars:
  VITEST_SKIP_INSTALL_CHECKS=1 : disable auto dependency install prompts

11 IDE Integration
VSCode extension from Marketplace adds run/debug code lens and test explorer.


## Supplementary Details
Configuration Options (test property):
- include: string[] default ['**/*.{test,spec}.{js,mjs,cjs,ts,cts,mts}']
- exclude: string[] default ['node_modules', 'dist']
- globals: boolean default false
- environment: 'node' | 'jsdom' | 'happy-dom' default 'node'
- threads: boolean | number default true (detect CPU count)
- coverage: object {
    enabled: boolean default false,
    reporter: string[] default ['text','lcov'],
    reportsDirectory: string default 'coverage'
  }
- setupFiles: string[] default []
- testTimeout: number default 5000 (ms)
- hookTimeout: number default 1000 (ms)
- ui: 'bdd' | 'tdd' default 'bdd'
- alias: Record<string,string> inherits Vite resolve.alias
- transformMode: Record<string,string[]> default { web: ['.js','.ts','.jsx','.tsx'] }

Implementation Steps:
1. Install vitest and ensure Vite and Node versions.
2. Configure package.json scripts.
3. Create config file or extend Vite config with test options.
4. Write test files with proper naming.
5. Run `vitest` or `vitest run`.
6. Analyze results, coverage reports if enabled.



## Reference Details
API Specifications:

1. defineConfig(config: UserConfig): ResolvedConfig
   import { defineConfig } from 'vitest/config'
   config.test: TestConfig

2. TestConfig Interface:
  include?: string[]                           // file globs
  exclude?: string[]                           // file globs
  globals?: boolean                            // inject global test APIs
  environment?: 'node' | 'jsdom' | 'happy-dom'
  threads?: boolean | number                   // concurrency
  coverage?: {
    enabled: boolean;
    provider?: 'c8' | 'istanbul';
    reporter?: string[];
    reportsDirectory?: string;
    clean?: boolean;
  }
  setupFiles?: string[]                        // paths to modules executed before tests
  testTimeout?: number                         // per-test timeout (ms)
  hookTimeout?: number                         // per-hook timeout (ms)
  ui?: 'bdd' | 'tdd'                           // test interface
  alias?: Record<string,string>                // module resolution aliases

3. Vitest CLI options:
  --run, -r           : run tests once
  --watch, -w         : watch mode default
  --config, -c <path> : config file path
  --port, -p <number> : dev server port
  --https             : use https server
  --coverage          : collect coverage
  --environment, -e   : test environment
  --silent            : suppress logs

4. SDK Method Signatures:
Vitest does not expose SDK; test API:
  test(name: string, fn: () => any | Promise<any>): void
  test.only(name: string, fn: (() => any) | Promise<any>): void
  test.skip(name: string, fn: (() => any) | Promise<any>): void

  expect(value: any): Matchers
  interface Matchers {
    toBe(expected: any): void
    toEqual(expected: any): void
    toMatchObject(expected: object): void
    toThrow(error?: string | Regex): void
    resolves: MatchersSync & PromiseMatchers
    rejects: MatchersSync & PromiseMatchers
  }

5. Code Examples:
```js
import { test, expect, beforeAll, afterAll } from 'vitest'

beforeAll(() => initializeDB())
afterAll(() => closeDB())

test('db returns user', async () => {
  const user = await getUser(1)
  expect(user.id).toBe(1)
  expect(user.name).toMatch(/^[A-Za-z]+$/)
})
```

6. Best Practices:
- Use setupFiles to load environment variables or mocks.
- Use globals=true to avoid import statements for test API.
- Isolate tests by setting environment per workspace config.

7. Troubleshooting:
Command: VITEST_SKIP_INSTALL_CHECKS=1 vitest run
Expected output:
  ✓ all tests passed
  Coverage summary printed if enabled

If tests hang:
- Increase testTimeout or hookTimeout
- Use --run to disable watch mode
- Check import paths and module aliases



## Information Dense Extract
install: npm i -D vitest; req: Vite>=5.0.0,Node>=18.0.0; tests: filename=/\.(test|spec)\.[jt]s$/; package.json script: test:vitest; config inheritance: root vite.config; override: vitest.config.ts defineConfig({test:TestConfig}); extensions:js,mjs,cjs,ts,cts,mts; merge: mergeConfig(viteConfig, defineConfig({test:{}})); workspace: test.workspace: (glob|path|object{name,root,environment,setupFiles}); CLI: vitest[-r|--run],--config,--port,--https,--coverage,--environment; env: VITEST_SKIP_INSTALL_CHECKS=1; Test API: test(name,fn),expect(val).toBe,x; config TestConfig: include,exclude,globals,environment,threads,coverage{enabled,provider,reporter,reportsDirectory,clean},setupFiles,testTimeout,hookTimeout,ui,alias; BestPractices: setupFiles,mock,globals; Troubleshoot: adjust timeouts,use --run,check aliases.

## Sanitised Extract
Table of Contents:
1 Test File Conventions
2 Installation Commands and Requirements
3 Package.json Scripts
4 Vite Unified Configuration
5 Standalone Vitest Config
6 Config File Extensions
7 Conditional Config Overrides
8 Merging Vite and Vitest Config
9 Workspaces Configuration
10 CLI Options and Environment Variables
11 IDE Integration

1 Test File Conventions
Tests must include .test. or .spec. in filename. Vitest identifies files matching /'.(test|spec)'.[jt]s$/ by default.

2 Installation Commands and Requirements
Requirements:
  Vite: >=5.0.0
  Node: >=18.0.0
Commands:
  npm install -D vitest
  yarn add -D vitest
  pnpm add -D vitest
  bun add -D vitest
  npx vitest (fallback install behavior)

3 Package.json Scripts
Add:
  'scripts': {
    'test': 'vitest'
  }
Optional coverage:
  'coverage': 'vitest run --coverage'

4 Vite Unified Configuration
If no vitest.config file, Vitest reads root vite.config.ts/js:
  resolve.alias, plugins pass-through.

5 Standalone Vitest Config
File: vitest.config.(js|ts)
Content:
  import { defineConfig } from 'vitest/config'
  export default defineConfig({ test: { /* options */ } })

6 Config File Extensions
Supported: .js, .mjs, .cjs, .ts, .cts, .mts
Unsupported: .json

7 Conditional Config Overrides
Use CLI: vitest --config <path>
Use env: process.env.VITEST or defineConfig(mode) to apply test-mode settings.

8 Merging Vite and Vitest Config
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.mjs'
export default mergeConfig(viteConfig, defineConfig({ test: { /* options */ } }))

9 Workspaces Configuration
vitest.config.ts:
  test.workspace: array of:
    - glob patterns: 'packages/*'
    - config files: 'tests/*/vitest.config.{e2e,unit}.ts'
    - objects: { test: { name, root, environment, setupFiles } }

10 CLI Options and Environment Variables
Commands:
  vitest             : interactive watch mode
  vitest run         : single-run
  vitest --port <n>  : override port
  vitest --https     : enable https server
  vitest --config <p>: use specific config
Env vars:
  VITEST_SKIP_INSTALL_CHECKS=1 : disable auto dependency install prompts

11 IDE Integration
VSCode extension from Marketplace adds run/debug code lens and test explorer.

## Original Source
Vitest Testing Framework
https://vitest.dev/guide/

## Digest of VITEST_GUIDE

# Vitest Guide Detailed Digest

Last Updated: 2023-10-05 (Date retrieved: 2024-06-15)

Data Size: 26657117 bytes

## Getting Started

### Installation Requirements
- Vite >= v5.0.0
- Node >= v18.0.0

### Installation Commands
- npm: npm install -D vitest
- yarn: yarn add -D vitest
- pnpm: pnpm add -D vitest
- bun: bun add -D vitest
- npx usage: npx vitest (does local bin check, $PATH lookup, then temp install)

## Writing Tests

### File Naming
- Tests must include `.test.` or `.spec.` in filename by default

### Example Test
```js
// sum.js
export function sum(a: number, b: number): number {
  return a + b
}

// sum.test.js
import { expect, test } from 'vitest'
import { sum } from './sum.js'

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3)
})
```

### NPM Script
```json
{
  "scripts": {
    "test": "vitest"
  }
}
```

## Configuration

### Unified with Vite
- If no vitest.config.ts, Vitest reads root vite.config.(js|ts)
- To override:
  - Create vitest.config.ts
  - Use CLI: vitest --config <path>
  - Use process.env.VITEST or defineConfig mode property

### Config File Extensions Supported
- .js, .mjs, .cjs, .ts, .cts, .mts
- .json unsupported

### Vite-less Setup
```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    // options
  }
})
```

### In Vite Config
```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
export default defineConfig({
  test: {
    // options
  }
})
```

### Merging Configs
```js
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.mjs'
export default mergeConfig(viteConfig, defineConfig({
  test: {
    // options
  }
}))
```

## Workspaces
```ts
import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    workspace: [
      'packages/*',
      'tests/*/vitest.config.{e2e,unit}.ts',
      { test: { name: 'happy-dom', root: './shared_tests', environment: 'happy-dom', setupFiles: ['./setup.happy-dom.ts'] } },
      { test: { name: 'node', root: './shared_tests', environment: 'node', setupFiles: ['./setup.node.ts'] } }
    ]
  }
})
```

## CLI Usage

### Default Scripts
```json
{
  "scripts": {
    "test": "vitest",
    "coverage": "vitest run --coverage"
  }
}
```

### Commands
- vitest run: run tests once (no watch)
- vitest --port <number>
- vitest --https
- vitest --config <path>
- VITEST_SKIP_INSTALL_CHECKS=1: disable auto dependency installation

## IDE Integration
- VSCode extension: marketplace

## Examples & Projects
- Basic, fastify, in-source-test, lit, vue, marko, preact, react, solid, svelte, sveltekit, profiling, typecheck, workspace
- Projects using Vitest: unocss, unplugin-auto-import, unplugin-vue-components, vue, vite, vitesse, vitesse-lite, fluent-vue, vueuse, milkdown, gridjs-svelte, spring-easing, bytemd, faker, million, Vitamin, neodrag, svelte-multiselect, iconify, tdesign-vue-next, cz-git

## Unreleased Commits
- pkg.pr.new/vitest@{commit}
- Local build & link: pnpm link --global

## Community
- Discord, GitHub Discussions


## Attribution
- Source: Vitest Testing Framework
- URL: https://vitest.dev/guide/
- License: License: MIT
- Crawl Date: 2025-05-09T12:31:30.273Z
- Data Size: 26657117 bytes
- Links Found: 22269

## Retrieved
2025-05-09
