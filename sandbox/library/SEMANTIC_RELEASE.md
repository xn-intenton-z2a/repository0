# SEMANTIC_RELEASE

## Crawl Summary
syntax: semanticRelease(options:Object, config:Object) => Promise<Boolean|ResultObject>

options.branches:Array<String|Object> default [\"+([0-9])?(.{+([0-9]),x}).x\",\"master\",\"main\",\"next\",\"next-major\",{name:\"beta\",prerelease:true},{name:\"alpha\",prerelease:true}]
options.repositoryUrl:String
options.extends:String|String[]
options.githubUrl:String
options.githubApiPathPrefix:String

config.cwd:String default process.cwd()
config.env:Object default process.env
config.stdout:WritableStream default process.stdout
config.stderr:WritableStream default process.stderr

Result: lastRelease, commits[], nextRelease, releases[] with complete field definitions
Plugin lifecycles: verifyConditions, analyzeCommits, verifyRelease, generateNotes, addChannel, prepare, publish, success, fail
Context keys by lifecycle: common keys, commits and releases injection
Logger: context.logger.log/warn/success/error


## Normalised Extract
Table of Contents:
1. API Signature
2. Core Options
3. Execution Config
4. Result Structure
5. Plugin Lifecycle Methods
6. Context Object Keys
7. Environment Variables
8. Logger Usage

1. API Signature
semanticRelease(options:Object, config:Object) => Promise<Boolean|ResultObject>

2. Core Options
branches: Array<String|{name:String,prerelease:Boolean}>
repositoryUrl: String
extends: String|Array<String>
githubUrl: String
githubApiPathPrefix: String

3. Execution Config
cwd: String (default process.cwd())
env: Object (default process.env)
stdout: WritableStream (default process.stdout)
stderr: WritableStream (default process.stderr)

4. Result Structure
lastRelease: { version:String, gitHead:String, gitTag:String, channel:String }
commits: Array<{ commit:{long:String,short:String}, tree:{long:String,short:String}, author:{name:String,email:String,date:String}, committer:{name:String,email:String,date:String}, subject:String, body:String, hash:String, message:String, committerDate:String }>
nextRelease: { type:String, version:String, gitHead:String, gitTag:String, notes:String, channel:String }
releases: Array<{ name?:String, url?:String, type:String, gitHead:String, version:String, gitTag:String, notes:String, pluginName:String, channel:String }>

5. Plugin Lifecycle Methods
verifyConditions(pluginConfig:Object, context:Object) => Promise<void>
analyzeCommits(pluginConfig:Object, context:Object) => Promise<String|void>
verifyRelease(pluginConfig:Object, context:Object) => Promise<void>
generateNotes(pluginConfig:Object, context:Object) => Promise<String>
addChannel(pluginConfig:Object, context:Object) => Promise<void>
prepare(pluginConfig:Object, context:Object) => Promise<Array<{path:String, data:String}>>
publish(pluginConfig:Object, context:Object) => Promise<Array<{name:String, url:String}>>
success(pluginConfig:Object, context:Object) => Promise<void>
fail(pluginConfig:Object, context:Object) => Promise<void>

6. Context Object Keys
cwd: String, env: Object, envCi: Object, options: Object, branches: Array, commit: String, branch: String, main: Boolean
Additional by lifecycle: commits, lastRelease, nextRelease, releases, errors

7. Environment Variables
context.env holds all process.env variables for plugin logic

8. Logger Usage
context.logger.log(message)
context.logger.warn(message)
context.logger.success(message)
context.logger.error(message)

## Supplementary Details
Plugin Development Steps:
1. Initialize project: yarn init
2. In index.js, export methods: module.exports = { verifyConditions, analyzeCommits, ... }
3. Create src/ for logic, test/ for tests
4. Each lifecycle method signature: async function(methodConfig, context)
5. Validate pluginConfig fields; accumulate errors; throw AggregateError(errors)
6. Access environment in methods via context.env
7. Log via context.logger

Configuration File (.releaserc.js or release.config.js):
module.exports = {
  branches: ["main", {name:"beta", prerelease:true}],
  repositoryUrl: "https://github.com/user/repo.git",
  extends: "@semantic-release/recommended",
  plugins: [
    ["@semantic-release/commit-analyzer", {releaseRules:[{type:"docs",release:"patch"}]}],
    ["@semantic-release/release-notes-generator", {}],
    ["@semantic-release/github", {assets:[{path:"dist/*.js",label:"Dist"}]}]
  ],
  githubUrl: "https://github.com",
  githubApiPathPrefix: "/api/v3"
};

CI Integration (GitHub Actions example):
- uses: actions/setup-node@v2
  with: node-version: 16
- run: npm ci
- run: npx semantic-release
  env:
    NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
    GH_TOKEN: ${{ secrets.GH_TOKEN }}

## Reference Details
API: semanticRelease(options:Object, config?:Object) => Promise<Boolean|ResultObject>

Parameters:
options:
  branches: Array<String|{name:String,prerelease:Boolean}>
  repositoryUrl: String
  extends: String|Array<String>
  githubUrl: String
  githubApiPathPrefix: String
config (optional):
  cwd: String (default process.cwd())
  env: Object (default process.env)
  stdout: WritableStream (default process.stdout)
  stderr: WritableStream (default process.stderr)

Return: Promise<Boolean|{
  lastRelease:{version:String,gitHead:String,gitTag:String,channel:String},
  commits:Array<Commit>,
  nextRelease:{type:String,version:String,gitHead:String,gitTag:String,notes:String,channel:String},
  releases:Array<Release>
}>

Commit:
{ commit:{long:String,short:String}, tree:{long:String,short:String}, author:{name:String,email:String,date:String}, committer:{name:String,email:String,date:String}, subject:String, body:String, hash:String, message:String, committerDate:String }

Release:
{ name?:String, url?:String, type:String, gitHead:String, version:String, gitTag:String, notes:String, pluginName:String, channel:String }

Plugin Lifecycle Method Signatures:
async verifyConditions(pluginConfig:Object, context:Object):void
async analyzeCommits(pluginConfig:Object, context:Object):String|void
async verifyRelease(pluginConfig:Object, context:Object):void
async generateNotes(pluginConfig:Object, context:Object):String
async addChannel(pluginConfig:Object, context:Object):void
async prepare(pluginConfig:Object, context:Object):Array<{path:String,data:String}>
async publish(pluginConfig:Object, context:Object):Array<{name:String,url:String,channel?:String}>
async success(pluginConfig:Object, context:Object):void
async fail(pluginConfig:Object, context:Object):void

Best Practices:
- Always implement verifyConditions
- Use shareable configs via extends field
- Validate pluginConfig and environment variables early
- Run semantic-release in CI after tests pass

Troubleshooting Procedures:
- List published versions: npm dist-tags ls <package-name>
- Dry-run: npx semantic-release --dry-run
- Bypass CI check: npx semantic-release --no-ci


## Information Dense Extract
semanticRelease(options:Object, config:Object) => Promise<{lastRelease, commits[], nextRelease, releases[]}>
options: branches:Array<String|{name,prerelease}>, repositoryUrl:String, extends:String|String[], githubUrl:String, githubApiPathPrefix:String
config: cwd:String, env:Object, stdout:WritableStream, stderr:WritableStream
Result keys: lastRelease{version,gitHead,gitTag,channel}, commits[{commit{long,short},tree{long,short},author{name,email,date},committer{name,email,date},subject,body,hash,message,committerDate}], nextRelease{type,version,gitHead,gitTag,notes,channel}, releases[{name?,url?,type,gitHead,version,gitTag,notes,pluginName,channel}]
Plugin lifecycles: verifyConditions, analyzeCommits, verifyRelease, generateNotes, addChannel, prepare, publish, success, fail
Lifecycle signature: async(elConfig:Object, context:Object)
Context keys: common(cwd,env,envCi,options,branches,commit,branch,main), analyzeCommits adds commits,lastRelease; verifyRelease adds nextRelease; prepare adds assets; publish adds releases; success adds releases; fail adds errors
Logger: context.logger.log/warn/success/error
Configuration: .releaserc.js with branches, repositoryUrl, extends, plugins[], githubUrl, githubApiPathPrefix
CI: NPM_TOKEN, GH_TOKEN environment variables; run semantic-release after tests
Troubleshoot: npm dist-tags ls, semantic-release --dry-run|--no-ci

## Sanitised Extract
Table of Contents:
1. API Signature
2. Core Options
3. Execution Config
4. Result Structure
5. Plugin Lifecycle Methods
6. Context Object Keys
7. Environment Variables
8. Logger Usage

1. API Signature
semanticRelease(options:Object, config:Object) => Promise<Boolean|ResultObject>

2. Core Options
branches: Array<String|{name:String,prerelease:Boolean}>
repositoryUrl: String
extends: String|Array<String>
githubUrl: String
githubApiPathPrefix: String

3. Execution Config
cwd: String (default process.cwd())
env: Object (default process.env)
stdout: WritableStream (default process.stdout)
stderr: WritableStream (default process.stderr)

4. Result Structure
lastRelease: { version:String, gitHead:String, gitTag:String, channel:String }
commits: Array<{ commit:{long:String,short:String}, tree:{long:String,short:String}, author:{name:String,email:String,date:String}, committer:{name:String,email:String,date:String}, subject:String, body:String, hash:String, message:String, committerDate:String }>
nextRelease: { type:String, version:String, gitHead:String, gitTag:String, notes:String, channel:String }
releases: Array<{ name?:String, url?:String, type:String, gitHead:String, version:String, gitTag:String, notes:String, pluginName:String, channel:String }>

5. Plugin Lifecycle Methods
verifyConditions(pluginConfig:Object, context:Object) => Promise<void>
analyzeCommits(pluginConfig:Object, context:Object) => Promise<String|void>
verifyRelease(pluginConfig:Object, context:Object) => Promise<void>
generateNotes(pluginConfig:Object, context:Object) => Promise<String>
addChannel(pluginConfig:Object, context:Object) => Promise<void>
prepare(pluginConfig:Object, context:Object) => Promise<Array<{path:String, data:String}>>
publish(pluginConfig:Object, context:Object) => Promise<Array<{name:String, url:String}>>
success(pluginConfig:Object, context:Object) => Promise<void>
fail(pluginConfig:Object, context:Object) => Promise<void>

6. Context Object Keys
cwd: String, env: Object, envCi: Object, options: Object, branches: Array, commit: String, branch: String, main: Boolean
Additional by lifecycle: commits, lastRelease, nextRelease, releases, errors

7. Environment Variables
context.env holds all process.env variables for plugin logic

8. Logger Usage
context.logger.log(message)
context.logger.warn(message)
context.logger.success(message)
context.logger.error(message)

## Original Source
Semantic-release Automated Publishing
https://semantic-release.gitbook.io/semantic-release/

## Digest of SEMANTIC_RELEASE

# Semantic-release Automated Publishing

Date Retrieved: 2024-06-18
Data Size: 32771 bytes

# API Signature

```js
const semanticRelease = require("semantic-release");
const { WritableStreamBuffer } = require("stream-buffers");

// Usage example
const result = await semanticRelease(options, config);
```

# Core Options (options)

- branches: Array<String|{name:String,prerelease:Boolean}>
  Default: ["+([0-9])?(.{+([0-9]),x}).x","master","main","next","next-major",{name:"beta",prerelease:true},{name:"alpha",prerelease:true}]
- repositoryUrl: String
- extends: String|Array<String>
- githubUrl: String
- githubApiPathPrefix: String

# Execution Configuration (config)

- cwd: String  Default: process.cwd()
- env: Object  Default: process.env
- stdout: WritableStream  Default: process.stdout
- stderr: WritableStream  Default: process.stderr

# Result Object Structure

- lastRelease: { version:String, gitHead:String, gitTag:String, channel:String }
- commits: Array<{
    commit:{ long:String, short:String },
    tree:{ long:String, short:String },
    author:{ name:String, email:String, date:String },
    committer:{ name:String, email:String, date:String },
    subject:String,
    body:String,
    hash:String,
    message:String,
    committerDate:String
  }>
- nextRelease: { type:String, version:String, gitHead:String, gitTag:String, notes:String, channel:String }
- releases: Array<{
    name?:String,
    url?:String,
    type:String,
    gitHead:String,
    version:String,
    gitTag:String,
    notes:String,
    pluginName:String,
    channel:String
  }>

# Plugin Development Lifecycle

Lifecycles (in execution order):
verifyConditions, analyzeCommits, verifyRelease, generateNotes, addChannel, prepare, publish, success, fail

Each method signature:
async function lifecycleName(pluginConfig:Object, context:Object) => Promise<void>

# Context Object Keys by Lifecycle

- Common (all): cwd, env, envCi, options, branches, commit, branch, main
- analyzeCommits: adds commits:Array, lastRelease:Object
- verifyRelease: adds nextRelease:Object
- addChannel: same as verifyRelease
- prepare: same as verifyRelease
- publish: adds releases:Array
- success/fail: success has releases:Array, fail has errors:Array

# Environment Variables

- context.env: process.env mapping
- Example: if (context.env.GITHUB_TOKEN) { /*...*/ }

# Logger

Use context.logger:
- logger.log(message:String)
- logger.warn(message:String)
- logger.success(message:String)
- logger.error(message:String)

# Troubleshooting Commands

- npm dist-tags ls <package-name>
- npx semantic-release --dry-run
- npx semantic-release --no-ci


## Attribution
- Source: Semantic-release Automated Publishing
- URL: https://semantic-release.gitbook.io/semantic-release/
- License: MIT
- Crawl Date: 2025-05-11T00:43:00.789Z
- Data Size: 32771 bytes
- Links Found: 1456

## Retrieved
2025-05-11
