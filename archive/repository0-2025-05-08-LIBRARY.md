sandbox/library/ISSUES_API.md
# sandbox/library/ISSUES_API.md
# ISSUES_API

## Crawl Summary
Endpoints: List, Create, Get, Update, Lock, Unlock issues; Assignees: List, Check assignable, Add, Remove; Comments: List, Get, Create, Update, Delete; Labels: List, Add, Set, Remove; Milestones: List, Create, Update, Delete. Paths, methods, headers, parameters, request body schemas, and response codes for each. Rate limit headers and common error codes.

## Normalised Extract
Table of Contents
1. Issues Endpoints
2. Assignees Endpoints
3. Comments Endpoints
4. Labels Endpoints
5. Milestones Endpoints

1. Issues Endpoints
GET /repos/{owner}/{repo}/issues
  Query params: milestone,string/number/null; state=open|closed|all; assignee,string/*/none; creator,string; mentioned,string; labels,CSV; sort=created|updated|comments; direction=asc|desc; since=ISO8601; per_page=1-100; page=int
  Response: 200 Array<Issue>

POST /repos/{owner}/{repo}/issues
  Body: { title:string, body?:string, assignees?:string[], milestone?:int|null, labels?:string[] }
  Response: 201 Issue

GET /repos/{owner}/{repo}/issues/{issue_number}
  Path params: issue_number:int
  Response: 200 Issue

PATCH /repos/{owner}/{repo}/issues/{issue_number}
  Body: { title?:string, body?:string, assignees?:string[], state?:open|closed, milestone?:int|null, labels?:string[] }
  Response: 200 Issue

PUT /repos/{owner}/{repo}/issues/{issue_number}/lock
  Body: { lock_reason?:off-topic|too heated|resolved|spam }
  Response: 204

DELETE /repos/{owner}/{repo}/issues/{issue_number}/lock  Response: 204

2. Assignees Endpoints
GET /repos/{owner}/{repo}/issues/{issue_number}/assignees  Response: 200 Array<User>
GET /repos/{owner}/{repo}/issues/{issue_number}/assignees/{assignee}  Response:204|404
POST /repos/{owner}/{repo}/issues/{issue_number}/assignees  Body:{assignees:string[]}  Response:201 Issue
DELETE /repos/{owner}/{repo}/issues/{issue_number}/assignees Body:{assignees:string[]} Response:200 Issue

3. Comments Endpoints
GET /repos/{owner}/{repo}/issues/{issue_number}/comments?per_page=&page=  Response:200 Array<Comment>
GET /repos/{owner}/{repo}/issues/comments/{comment_id}  Response:200 Comment
POST /repos/{owner}/{repo}/issues/{issue_number}/comments Body:{body:string} Response:201 Comment
PATCH /repos/{owner}/{repo}/issues/comments/{comment_id} Body:{body:string} Response:200 Comment
DELETE /repos/{owner}/{repo}/issues/comments/{comment_id} Response:204

4. Labels Endpoints
GET /repos/{owner}/{repo}/issues/{issue_number}/labels Response:200 Array<Label>
POST /repos/{owner}/{repo}/issues/{issue_number}/labels Body:{labels:string[]} Response:200 Array<Label>
PUT /repos/{owner}/{repo}/issues/{issue_number}/labels Body:{labels:string[]} Response:200 Array<Label>
DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name} Response:204
DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels Response:204

5. Milestones Endpoints
GET /repos/{owner}/{repo}/milestones?state=open|closed|all&sort=due_on|completeness&direction=asc|desc&per_page=&page= Response:200 Array<Milestone>
POST /repos/{owner}/{repo}/milestones Body:{ title:string, state?:open|closed, description?:string, due_on?:ISO8601 } Response:201 Milestone
PATCH /repos/{owner}/{repo}/milestones/{number} Body:{ title?:string, state?:open|closed, description?:string, due_on?:ISO8601 } Response:200 Milestone
DELETE /repos/{owner}/{repo}/milestones/{number} Response:204

## Supplementary Details
Authentication: token via Authorization: Bearer <token> or Bearer token header. Versioning: X-GitHub-Api-Version: YYYY-MM-DD. Media type: Accept: application/vnd.github+json. User-Agent: <app-name>. Pagination: Link headers. Rate limit: x-ratelimit-limit, x-ratelimit-remaining, x-ratelimit-reset. Error format: {message:string, documentation_url:string}.

## Reference Details
Issue object schema: id:int, number:int, title:string, body:string|null, user:User, state:string, assignees:User[], labels:Label[], milestone:Milestone|null, comments:int, created_at:ISO8601, updated_at:ISO8601, closed_at:ISO8601|null, locked:boolean, active_lock_reason:string|null, url:string, repository_url:string. Comment object schema: id:int, body:string, user:User, created_at:ISO8601, updated_at:ISO8601, url:string. Label object schema: id:int, node_id:string, url:string, name:string, color:string, default:boolean, description:string|null. Milestone object schema: id:int, number:int, state:string, title:string, description:string|null, creator:User, open_issues:int, closed_issues:int, created_at:ISO8601, updated_at:ISO8601, closed_at:ISO8601|null, due_on:ISO8601|null.

Octokit.js Method Signatures:
new Octokit(options:{ auth:string, userAgent?:string, baseUrl?:string, request?:RequestOptions })
octokit.request<T = any>(route: string, parameters?: RequestParameters): Promise<{ status:number; url:string; headers:any; data:T }>

octokit.issues.listForRepo({ owner:string, repo:string, milestone?:string|number|null, state?:string, assignee?:string, creator?:string, mentioned?:string, labels?:string, sort?:string, direction?:string, since?:string, per_page?:number, page?:number })
octokit.issues.create({ owner:string, repo:string, title:string, body?:string, assignees?:string[], milestone?:number, labels?:string[] })
octokit.issues.get({ owner:string, repo:string, issue_number:number })
octokit.issues.update({ owner:string, repo:string, issue_number:number, title?:string, body?:string, assignees?:string[], state?:string, milestone?:number, labels?:string[] })
octokit.issues.lock({ owner:string, repo:string, issue_number:number, lock_reason?:string })
octokit.issues.unlock({ owner:string, repo:string, issue_number:number })

Curl Implementation:
curl --request GET \
  --url "https://api.github.com/repos/{owner}/{repo}/issues" \
  --header "Accept: application/vnd.github+json" \
  --header "Authorization: Bearer <token>" \
  --header "User-Agent: MyApp"

Best Practices:
- Always specify Accept and User-Agent headers.
- Use pagination controls per_page and page.
- Use X-GitHub-Api-Version for version locking.
- Handle rate-limit headers and implement retry-after logic when 403 with rate limit exceeded.

Troubleshooting:
Check status codes and error responses:
400: curl --dump-header - \
  --request POST --url ... --data '{}' 
Expected: {message: 'Validation Failed', errors:[...]}
401: Unauthorized header missing or invalid
404: Invalid endpoint or resource not found
Monitor x-ratelimit-remaining and when zero: wait until x-ratelimit-reset epoch seconds.

## Information Dense Extract
GET /repos/{owner}/{repo}/issues ?milestone?&state?&assignee?&creator?&mentioned?&labels?&sort?&direction?&since?&per_page?&page? => 200 [Issue]
POST /repos/{owner}/{repo}/issues {title,body?,assignees?,milestone?,labels?} => 201 Issue
GET /repos/{owner}/{repo}/issues/{issue_number} => 200 Issue
PATCH /repos/{owner}/{repo}/issues/{issue_number} {title?,body?,assignees?,state?,milestone?,labels?} => 200 Issue
PUT /repos/{owner}/{repo}/issues/{issue_number}/lock {lock_reason?} => 204
DELETE /repos/{owner}/{repo}/issues/{issue_number}/lock => 204

Issue schema: id,int; number,int; title,string; body?, user, state,string; [...]
Authentication: Authorization: Bearer <token>; headers: Accept: application/vnd.github+json; User-Agent
Version: X-GitHub-Api-Version:YYYY-MM-DD
Rate-limits: x-ratelimit-limit, x-ratelimit-remaining, x-ratelimit-reset
Octokit.js: new Octokit({auth}); octokit.issues.listForRepo(params); create, get, update, lock, unlock methods with typed params
Curl example: curl --request GET --url URL --header Accept... --header Authorization: Bearer
Best practices: set headers, manage pagination, lock API version, handle rate limits
Errors: 400 validation;401 auth;403 permissions/rate-limit;404 not found

## Sanitised Extract
Table of Contents
1. Issues Endpoints
2. Assignees Endpoints
3. Comments Endpoints
4. Labels Endpoints
5. Milestones Endpoints

1. Issues Endpoints
GET /repos/{owner}/{repo}/issues
  Query params: milestone,string/number/null; state=open|closed|all; assignee,string/*/none; creator,string; mentioned,string; labels,CSV; sort=created|updated|comments; direction=asc|desc; since=ISO8601; per_page=1-100; page=int
  Response: 200 Array<Issue>

POST /repos/{owner}/{repo}/issues
  Body: { title:string, body?:string, assignees?:string[], milestone?:int|null, labels?:string[] }
  Response: 201 Issue

GET /repos/{owner}/{repo}/issues/{issue_number}
  Path params: issue_number:int
  Response: 200 Issue

PATCH /repos/{owner}/{repo}/issues/{issue_number}
  Body: { title?:string, body?:string, assignees?:string[], state?:open|closed, milestone?:int|null, labels?:string[] }
  Response: 200 Issue

PUT /repos/{owner}/{repo}/issues/{issue_number}/lock
  Body: { lock_reason?:off-topic|too heated|resolved|spam }
  Response: 204

DELETE /repos/{owner}/{repo}/issues/{issue_number}/lock  Response: 204

2. Assignees Endpoints
GET /repos/{owner}/{repo}/issues/{issue_number}/assignees  Response: 200 Array<User>
GET /repos/{owner}/{repo}/issues/{issue_number}/assignees/{assignee}  Response:204|404
POST /repos/{owner}/{repo}/issues/{issue_number}/assignees  Body:{assignees:string[]}  Response:201 Issue
DELETE /repos/{owner}/{repo}/issues/{issue_number}/assignees Body:{assignees:string[]} Response:200 Issue

3. Comments Endpoints
GET /repos/{owner}/{repo}/issues/{issue_number}/comments?per_page=&page=  Response:200 Array<Comment>
GET /repos/{owner}/{repo}/issues/comments/{comment_id}  Response:200 Comment
POST /repos/{owner}/{repo}/issues/{issue_number}/comments Body:{body:string} Response:201 Comment
PATCH /repos/{owner}/{repo}/issues/comments/{comment_id} Body:{body:string} Response:200 Comment
DELETE /repos/{owner}/{repo}/issues/comments/{comment_id} Response:204

4. Labels Endpoints
GET /repos/{owner}/{repo}/issues/{issue_number}/labels Response:200 Array<Label>
POST /repos/{owner}/{repo}/issues/{issue_number}/labels Body:{labels:string[]} Response:200 Array<Label>
PUT /repos/{owner}/{repo}/issues/{issue_number}/labels Body:{labels:string[]} Response:200 Array<Label>
DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name} Response:204
DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels Response:204

5. Milestones Endpoints
GET /repos/{owner}/{repo}/milestones?state=open|closed|all&sort=due_on|completeness&direction=asc|desc&per_page=&page= Response:200 Array<Milestone>
POST /repos/{owner}/{repo}/milestones Body:{ title:string, state?:open|closed, description?:string, due_on?:ISO8601 } Response:201 Milestone
PATCH /repos/{owner}/{repo}/milestones/{number} Body:{ title?:string, state?:open|closed, description?:string, due_on?:ISO8601 } Response:200 Milestone
DELETE /repos/{owner}/{repo}/milestones/{number} Response:204

## Original Source
GitHub Issues REST API
https://docs.github.com/en/rest/issues

## Digest of ISSUES_API

# Issues REST API Detailed Digest

Date Retrieved: 2024-06-05

## 1. Endpoints and Paths

### List repository issues
Method: GET
Path: /repos/{owner}/{repo}/issues
Path Parameters:
  owner (string)  : Repository owner
  repo  (string)  : Repository name
Query Parameters:
  milestone (string|number|null) : Filter by milestone number or * (all) or none
  state     (string)             : open, closed, all  Default: open
  assignee  (string)             : Filter by assignee username or * or none  Default: *
  creator   (string)             : Filter by creator username
  mentioned (string)             : Filter by mentioned username
  labels    (string)             : Comma-separated label names
  sort      (string)             : created, updated, comments  Default: created
  direction (string)             : asc, desc  Default: desc
  since     (string)             : ISO 8601 timestamp
  per_page  (integer)            : 1–100  Default: 30
  page      (integer)            : Page number  Default: 1
Response: 200 OK, Array of Issue objects

### Create an issue
Method: POST
Path: /repos/{owner}/{repo}/issues
Headers: Accept: application/vnd.github+json
Request Body (application/json):
  title     (string)             : Required
  body      (string)             : Optional
  assignees (array[string])      : Optional
  milestone (integer|null)       : Optional
  labels    (array[string])      : Optional
Response: 201 Created, Issue object

### Get an issue
Method: GET
Path: /repos/{owner}/{repo}/issues/{issue_number}
Path Parameters:
  issue_number (integer)         : Required
Response: 200 OK, Issue object

### Update an issue
Method: PATCH
Path: /repos/{owner}/{repo}/issues/{issue_number}
Request Body (application/json):
  title     (string)             : Optional
  body      (string)             : Optional
  assignees (array[string])      : Optional, replaces existing
  state     (string)             : open or closed
  milestone (integer|null)       : Optional
  labels    (array[string])      : Optional, replaces existing
Response: 200 OK, Issue object

### Lock an issue
Method: PUT
Path: /repos/{owner}/{repo}/issues/{issue_number}/lock
Request Body (application/json):
  lock_reason (string)           : Optional, one of off-topic, too heated, resolved, spam
Response: 204 No Content

### Unlock an issue
Method: DELETE
Path: /repos/{owner}/{repo}/issues/{issue_number}/lock
Response: 204 No Content

## 2. Issue Assignees

### List assignees
Method: GET
Path: /repos/{owner}/{repo}/issues/{issue_number}/assignees
Response: 200 OK, Array of User objects

### Check if a user can be assigned
Method: GET
Path: /repos/{owner}/{repo}/issues/{issue_number}/assignees/{assignee}
Response: 204 No Content (assignable), 404 Not Found (not assignable)

### Add assignees
Method: POST
Path: /repos/{owner}/{repo}/issues/{issue_number}/assignees
Request Body (application/json):
  assignees (array[string])      : Required
Response: 201 Created, Issue object

### Remove assignees
Method: DELETE
Path: /repos/{owner}/{repo}/issues/{issue_number}/assignees
Request Body (application/json):
  assignees (array[string])      : Required
Response: 200 OK, Issue object

## 3. Issue Comments

### List comments
Method: GET
Path: /repos/{owner}/{repo}/issues/{issue_number}/comments
Query Parameters: per_page, page
Response: 200 OK, Array of Comment objects

### Get a comment
Method: GET
Path: /repos/{owner}/{repo}/issues/comments/{comment_id}
Response: 200 OK, Comment object

### Create a comment
Method: POST
Path: /repos/{owner}/{repo}/issues/{issue_number}/comments
Request Body (application/json):
  body (string)                  : Required
Response: 201 Created, Comment object

### Update a comment
Method: PATCH
Path: /repos/{owner}/{repo}/issues/comments/{comment_id}
Request Body (application/json):
  body (string)                  : Required
Response: 200 OK, Comment object

### Delete a comment
Method: DELETE
Path: /repos/{owner}/{repo}/issues/comments/{comment_id}
Response: 204 No Content

## 4. Labels

### List labels for an issue
Method: GET
Path: /repos/{owner}/{repo}/issues/{issue_number}/labels
Response: 200 OK, Array of Label objects

### Add labels to an issue
Method: POST
Path: /repos/{owner}/{repo}/issues/{issue_number}/labels
Request Body (application/json):
  labels (array[string])         : Required
Response: 200 OK, Array of Label objects

### Set labels for an issue
Method: PUT
Path: /repos/{owner}/{repo}/issues/{issue_number}/labels
Request Body (application/json):
  labels (array[string])         : Required, replaces existing
Response: 200 OK, Array of Label objects

### Remove a label from an issue
Method: DELETE
Path: /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}
Response: 204 No Content

### Remove all labels
Method: DELETE
Path: /repos/{owner}/{repo}/issues/{issue_number}/labels
Response: 204 No Content

## 5. Milestones

### List milestones
Method: GET
Path: /repos/{owner}/{repo}/milestones
Query Parameters: state, sort, direction, per_page, page
Response: 200 OK, Array of Milestone objects

### Create a milestone
Method: POST
Path: /repos/{owner}/{repo}/milestones
Request Body (application/json):
  title       (string)           : Required
  state       (string)           : open or closed  Default: open
  description (string)           : Optional
  due_on      (string ISO 8601)  : Optional
Response: 201 Created, Milestone object

### Update a milestone
Method: PATCH
Path: /repos/{owner}/{repo}/milestones/{milestone_number}
Request Body: title, state, description, due_on
Response: 200 OK, Milestone object

### Delete a milestone
Method: DELETE
Path: /repos/{owner}/{repo}/milestones/{milestone_number}
Response: 204 No Content

## 6. Error Rates and Rate Limits

### Rate Limit Headers
Headers returned on each request:
  x-ratelimit-limit   : The maximum number of requests you're permitted to make.
  x-ratelimit-remaining: The number of requests remaining in the current rate limit window.
  x-ratelimit-reset   : The time at which the current rate limit window resets in UTC epoch seconds.

### Common Error Codes
  400 : Bad Request (invalid parameters)
  401 : Unauthorized (invalid or missing credentials)
  403 : Forbidden (insufficient permissions)
  404 : Not Found (invalid endpoint or resource)

## Attribution
- Source: GitHub Issues REST API
- URL: https://docs.github.com/en/rest/issues
- License: CC BY 4.0
- Crawl Date: 2025-05-07T06:30:26.854Z
- Data Size: 2661605 bytes
- Links Found: 15490

## Retrieved
2025-05-07
sandbox/library/ACTIONS_CACHE.md
# sandbox/library/ACTIONS_CACHE.md
# ACTIONS_CACHE

## Crawl Summary
Setup a cache step with actions/cache@v3 before installing dependencies. Provide inputs: path (string|string[]), key (string unique per version), restore-keys (string multiline of prefixes), optional upload-chunk-size (bytes, default 32MiB) and retention-days (days, default 7). Use hashFiles on lockfiles for primary key. Restore behavior uses first exact match, then prefixes. Share caches across jobs by matching keys. Use JavaScript API: restoreCache(paths, primaryKey, restoreKeys?, options?) returns cacheKey or undefined; saveCache(paths, primaryKey, options?) saves cache. Check outputs.cache-hit for cache result.

## Normalised Extract
Table of Contents:
1. Cache Step Configuration
2. Key and Restore Keys
3. Path Definitions
4. Restore Behavior
5. JavaScript API Usage
6. Outputs and Env Variables
7. Best Practices
8. Troubleshooting Procedures

1. Cache Step Configuration
 uses: actions/cache@v3
 with:
   path: ~/.npm or custom directory
   key: runner.os-node-hash(package-lock.json)
   restore-keys: |
     runner.os-node-
   upload-chunk-size: 33554432
   retention-days: 7

2. Key and Restore Keys
 Primary key format: <os>-<name>-<hash>
 Restore key prefixes: <os>-<name>-
 Combine multiple restore-keys by newline separation.

3. Path Definitions
 Single path as string or array of strings separated by commas. Example: ['~/.npm','~/.cache'].

4. Restore Behavior
 Workflow reads primary key; on miss tries each restore-key in order; returns first match. Exact key match sets cache-hit output to true.

5. JavaScript API Usage
 restoreCache(paths:Array|string, primaryKey:string, restoreKeys?:Array|string, options?:{lookupOnly?:boolean}) => Promise<string|undefined>
 saveCache(paths:Array|string, key:string, options?:{uploadChunkSize?:number, retentionDays?:number}) => Promise<number>

6. Outputs and Env Variables
 Steps: cache-hit output (true|false). Runtime vars: ACTIONS_CACHE_URL, ACTIONS_RUNTIME_TOKEN.

7. Best Practices
 Use fine-grained paths. Keep cache size < 10GB. Invalidate caches on dependency updates by hashfiles. Use matrix-specific keys.

8. Troubleshooting Procedures
 Inspect action log prefix Cache saved/restored. To flush invalid caches run gh api DELETE /repos/{owner}/{repo}/actions/caches/{cache_id}. Check key mismatches in logs.

## Supplementary Details
Action inputs:
 path: type string|string[]; required; path(s) to cache directories
 key: type string; required; unique cache identifier
 restore-keys: type string; optional; newline-separated prefix patterns
 upload-chunk-size: type number; optional; default 33554432 bytes
 retention-days: type number; optional; default 7 days

JavaScript API interfaces:
 interface RestoreCacheOptions { lookupOnly?: boolean }
 interface SaveCacheOptions { uploadChunkSize?: number; retentionDays?: number }

declarations:
 function restoreCache(paths: string|string[], primaryKey: string, restoreKeys?: string|string[], options?: RestoreCacheOptions): Promise<string|undefined>
 function saveCache(paths: string|string[], key: string, options?: SaveCacheOptions): Promise<number>
 function reserveCache(key: string, options?: {uploadChunkSize?: number; retentionDays?: number}): Promise<number>


## Reference Details
YAML Workflow Example:
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Cache dependencies
        uses: actions/cache@v3
        with:
          path:
            - ~/.npm
            - ~/.cache/yarn
          key: |
            ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-
          upload-chunk-size: 33554432
          retention-days: 14
      - name: Install
        run: npm ci
```

JavaScript API Example:
```javascript
import * as cache from '@actions/cache'

async function run() {
  const key = `${process.platform}-deps-${hashFiles(['package-lock.json'])}`
  const cacheKey = await cache.restoreCache(['node_modules'], key, [`${process.platform}-deps-`])
  if (!cacheKey) {
    // cache miss
  }
  // install deps
  await exec('npm install')
  await cache.saveCache(['node_modules'], key, { retentionDays: 14 })
}
```

Implementation Steps:
1. Compute hashFiles lockfiles to create key
2. Define cache step before install
3. On restore miss run install, then save cache
4. Use environment outputs to conditionally skip install on hit

Best Practices:
- Scope paths to only required directories
- Use hashFiles for key uniqueness
- Set retention-days to project lifecycle
- Monitor cache-hit percentage in action logs

Troubleshooting:
Command: gh api GET /repos/{owner}/{repo}/actions/caches
Expected: list of caches with keys and ids
Command: gh api DELETE /repos/{owner}/{repo}/actions/caches/{cache_id}
Use logs word regex to find Cache restored and Cache saved lines.


## Information Dense Extract
actions/cache@v3 usage: inputs path(string|string[]), key(string), restore-keys(string newline), upload-chunk-size(number,default=33554432), retention-days(number,default=7). Workflow: restore then install then save. Key pattern: <os>-<name>-<hash>. restoreCache(paths, primaryKey, restoreKeys?,{lookupOnly?}):Promise<string|undefined>. saveCache(paths, key,{uploadChunkSize?,retentionDays?}):Promise<number>. Outputs: steps.<id>.outputs.cache-hit. Env: ACTIONS_CACHE_URL, ACTIONS_RUNTIME_TOKEN. Max cache size 10GB. Best practices: use hashFiles for key, narrow paths, matrix-specific keys. Troubleshoot via gh api GET/DELETE actions/caches.

## Sanitised Extract
Table of Contents:
1. Cache Step Configuration
2. Key and Restore Keys
3. Path Definitions
4. Restore Behavior
5. JavaScript API Usage
6. Outputs and Env Variables
7. Best Practices
8. Troubleshooting Procedures

1. Cache Step Configuration
 uses: actions/cache@v3
 with:
   path: ~/.npm or custom directory
   key: runner.os-node-hash(package-lock.json)
   restore-keys: |
     runner.os-node-
   upload-chunk-size: 33554432
   retention-days: 7

2. Key and Restore Keys
 Primary key format: <os>-<name>-<hash>
 Restore key prefixes: <os>-<name>-
 Combine multiple restore-keys by newline separation.

3. Path Definitions
 Single path as string or array of strings separated by commas. Example: ['~/.npm','~/.cache'].

4. Restore Behavior
 Workflow reads primary key; on miss tries each restore-key in order; returns first match. Exact key match sets cache-hit output to true.

5. JavaScript API Usage
 restoreCache(paths:Array|string, primaryKey:string, restoreKeys?:Array|string, options?:{lookupOnly?:boolean}) => Promise<string|undefined>
 saveCache(paths:Array|string, key:string, options?:{uploadChunkSize?:number, retentionDays?:number}) => Promise<number>

6. Outputs and Env Variables
 Steps: cache-hit output (true|false). Runtime vars: ACTIONS_CACHE_URL, ACTIONS_RUNTIME_TOKEN.

7. Best Practices
 Use fine-grained paths. Keep cache size < 10GB. Invalidate caches on dependency updates by hashfiles. Use matrix-specific keys.

8. Troubleshooting Procedures
 Inspect action log prefix Cache saved/restored. To flush invalid caches run gh api DELETE /repos/{owner}/{repo}/actions/caches/{cache_id}. Check key mismatches in logs.

## Original Source
GitHub Actions Caching
https://docs.github.com/en/actions/advanced-guides/caching-dependencies-and-builds

## Digest of ACTIONS_CACHE

Retrieved: 2024-06-23
Source: https://docs.github.com/en/actions/advanced-guides/caching-dependencies-and-builds
Data Size: 0 bytes

# Workflow Setup
Define cache steps before dependency installation and after code checkout.

# Using actions/cache@v3
Use the official cache action with inputs path, key, restore-keys, upload-chunk-size and retention-days.

# Key and Restore-keys
Primary key must be unique; restore-keys act as fallbacks. Use OS and file-hash-based patterns.

# Caching Multiple Directories
Multiple path entries can be provided as array or multiline string.

# Cross-Job and Matrix Caching
Share caches across jobs and matrix configurations using identical key patterns.

# JavaScript Cache API
Methods: restoreCache, saveCache, reserveCache. Interfaces for options and return values.

# Environment Variables and Outputs
Outputs: cache-hit. Environment variables: ACTIONS_CACHE_URL, ACTIONS_RUNTIME_TOKEN.

# Best Practices and Limits
Limit cache size to 10GB per repository. Use precise keys. Group related caches.

# Troubleshooting
Check action logs for upload/download warnings. Use rm -rf to clear stale caches. Verify key patterns.

## Attribution
- Source: GitHub Actions Caching
- URL: https://docs.github.com/en/actions/advanced-guides/caching-dependencies-and-builds
- License: CC BY 4.0
- Crawl Date: 2025-05-07T18:30:10.162Z
- Data Size: 0 bytes
- Links Found: 0

## Retrieved
2025-05-07
sandbox/library/GRAPHQL_API.md
# sandbox/library/GRAPHQL_API.md
# GRAPHQL_API

## Crawl Summary
GitHub GraphQL API: POST endpoint https://api.github.com/graphql with JSON payload {query, variables}. Authenticate via header Authorization: bearer <token>, Accept: application/vnd.github.v4+json. Introspect schema via __schema query. Use cursor-based pagination with first:Int (max 100) and after:String, read pageInfo and nodes. Monitor rate limits via rateLimit query and HTTP headers X-RateLimit-Remaining. Global node IDs are base64 encoded "TypeName:ID" and fetched via node(id:ID). Core operations: repository(owner,name), rateLimit, node(id). Handle errors: 401 unauthorized, 422 syntax errors with locations.

## Normalised Extract
Table of Contents
1 Authentication
2 Endpoint Configuration
3 Schema Introspection
4 Query Execution
5 Pagination
6 Rate Limiting
7 Global Node IDs

1 Authentication
Header "Authorization": "bearer <PERSONAL_ACCESS_TOKEN>"
Header "Accept": "application/vnd.github.v4+json"
Header "Content-Type": "application/json"

2 Endpoint Configuration
URL: POST https://api.github.com/graphql
TLS: TLS1.2+

3 Schema Introspection
Payload: {"query":"{ __schema { queryType { name } mutationType { name } types { name kind fields { name args { name type { name kind ofType { name kind } } } type { name kind ofType { name kind } } } } } }"}
Response path: data.__schema

4 Query Execution
HTTP Method: POST
JSON body keys: query: String, variables: Object (optional)
Response: data key mirrors query shape, errors: array

5 Pagination
Arguments on connection fields: first: Int(default 30, max 100), after: String(cursor)
Fields returned: edges [{ node, cursor }], pageInfo { hasNextPage:Boolean, endCursor:String }
Loop pattern: while pageInfo.hasNextPage fetch next page using after=endCursor

6 Rate Limiting
GraphQL query: { rateLimit { limit cost remaining resetAt } }
Headers: X-RateLimit-Limit:Int, X-RateLimit-Remaining:Int, X-RateLimit-Reset:Int(timestamp)

7 Global Node IDs
ID format: base64("TypeName:ID")
Fetch by ID: query { node(id:ID!) { __typename id } }


## Supplementary Details
GraphQL Version: v4
Schema download: https://docs.github.com/public/schema.docs.graphql
Explorer URL: https://docs.github.com/en/graphql/overview/explorer
Authentication scopes: repo, user, admin:org (depending on data access)
Default query complexity limit: 5000 cost points per hour
Cost per field: see schema __type(name:"RateLimit"){...}
Pagination default page size: 30
Maximum page size: 100
Error object structure: { message: String!, locations: [{ line:Int!, column:Int! }], path: [String | Int] }


## Reference Details
Schema Types
-----------
type Query {
  repository(owner: String!, name: String!): Repository
  rateLimit: RateLimit!
  node(id: ID!): Node
}

type RateLimit {
  limit: Int!
  cost: Int!
  remaining: Int!
  resetAt: DateTime!
}

type Repository {
  id: ID!
  name: String!
  owner: RepositoryOwner!
  issues(first: Int, after: String, states: [IssueState!]): IssueConnection!
}

enum IssueState { OPEN CLOSED }

type IssueConnection {
  nodes: [Issue!]!
  pageInfo: PageInfo!
}

type Issue {
  id: ID!
  number: Int!
  title: String!
  url: URI!
  state: IssueState!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

SDK Method Signature (Octokit)
-----------------------------
import { Octokit } from "@octokit/rest";
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

octokit.graphql = function <T>(query: string, variables?: Record<string, any>): Promise<T>;

Code Example (TypeScript)
-------------------------
const query = `
  query ($owner: String!, $name: String!, $first: Int!, $after: String) {
    repository(owner: $owner, name: $name) {
      issues(first: $first, after: $after) {
        nodes { id number title state url }
        pageInfo { hasNextPage endCursor }
      }
    }
    rateLimit { remaining resetAt }
  }
`;

async function fetchIssues(owner: string, name: string) {
  let hasNext = true;
  let cursor: string | null = null;
  const allIssues = [];

  while (hasNext) {
    const result = await octokit.graphql<{ repository: { issues: { nodes: Array<{ id: string; number: number; title: string; state: string; url: string }>; pageInfo: { hasNextPage: boolean; endCursor: string } } }; rateLimit: { remaining: number; resetAt: string } }>(query, {
      owner,
      name,
      first: 100,
      after: cursor,
    });

    allIssues.push(...result.repository.issues.nodes);
    hasNext = result.repository.issues.pageInfo.hasNextPage;
    cursor = result.repository.issues.pageInfo.endCursor;
  }

  return allIssues;
}

Configuration Options
---------------------
Header Accept values:
  application/vnd.github.v4+json (default)
Content negotiation via media type parameters supported

Best Practices
--------------
- Specify only required fields in selection set
- Use pagination for large data sets
- Monitor rateLimit and batch queries accordingly
- Cache schema locally for validation

Troubleshooting
---------------
1 Unauthorized
  Command: curl -H "Authorization: bearer INVALID" -X POST -d '{"query":"{ rateLimit { remaining }}"}' https://api.github.com/graphql
  Response: 401 {"message":"Bad credentials"}

2 Syntax Error
  Command: curl -H "Authorization: bearer $TOKEN" -X POST -d '{"query":"{ repository(owner:\"foo\", name:\"bar\"{ id } }"}' https://api.github.com/graphql
  Response: 422 {"message":"Something went wrong","errors":[{"message":"Syntax Error","locations":[{"line":1,"column":50}]}]}

3 Rate Limit Exceeded
  Query: { rateLimit { remaining } }
  Response remaining: 0
  Action: wait until resetAt or reduce query cost


## Information Dense Extract
Auth: Authorization: bearer <token>; Accept: application/vnd.github.v4+json; POST https://api.github.com/graphql; Introspect: __schema query; Pagination: first:Int(max100), after:String -> pageInfo; RateLimit: query rateLimit and HTTP headers X-RateLimit-*; Node IDs: base64("Type:ID") via node(id); Core schema: Query.repository(owner:String!,name:String!)->Repository; rateLimit->RateLimit; node->Node; Octokit.graphql<T>(query: string, variables?): Promise<T>; Best practice: minimal selection, paginate, monitor rateLimit; Errors: 401 Bad credentials, 422 syntax error with locations.

## Sanitised Extract
Table of Contents
1 Authentication
2 Endpoint Configuration
3 Schema Introspection
4 Query Execution
5 Pagination
6 Rate Limiting
7 Global Node IDs

1 Authentication
Header 'Authorization': 'bearer <PERSONAL_ACCESS_TOKEN>'
Header 'Accept': 'application/vnd.github.v4+json'
Header 'Content-Type': 'application/json'

2 Endpoint Configuration
URL: POST https://api.github.com/graphql
TLS: TLS1.2+

3 Schema Introspection
Payload: {'query':'{ __schema { queryType { name } mutationType { name } types { name kind fields { name args { name type { name kind ofType { name kind } } } type { name kind ofType { name kind } } } } } }'}
Response path: data.__schema

4 Query Execution
HTTP Method: POST
JSON body keys: query: String, variables: Object (optional)
Response: data key mirrors query shape, errors: array

5 Pagination
Arguments on connection fields: first: Int(default 30, max 100), after: String(cursor)
Fields returned: edges [{ node, cursor }], pageInfo { hasNextPage:Boolean, endCursor:String }
Loop pattern: while pageInfo.hasNextPage fetch next page using after=endCursor

6 Rate Limiting
GraphQL query: { rateLimit { limit cost remaining resetAt } }
Headers: X-RateLimit-Limit:Int, X-RateLimit-Remaining:Int, X-RateLimit-Reset:Int(timestamp)

7 Global Node IDs
ID format: base64('TypeName:ID')
Fetch by ID: query { node(id:ID!) { __typename id } }

## Original Source
GitHub GraphQL API
https://docs.github.com/en/graphql

## Digest of GRAPHQL_API

# GitHub GraphQL API Technical Details (Retrieved: 2024-06-07)

# Authentication
Header: Authorization: bearer <PERSONAL_ACCESS_TOKEN>
Accept: application/vnd.github.v4+json
Content-Type: application/json

# Endpoint
POST https://api.github.com/graphql

# Schema Introspection
Request payload: { "query": "{ __schema { queryType { name } mutationType { name } types { name kind fields { name args { name type { name kind ofType { name kind } } } type { name kind ofType { name kind } } } } } }" }
Response: JSON root __schema with type definitions

# Pagination
Arguments: first: Int (max 100, default 30), after: String (cursor)
Response connection: edges { node, cursor }, nodes: [Type], pageInfo { hasNextPage: Boolean!, endCursor: String }

# Rate Limiting
Query: { rateLimit { limit: Int!, cost: Int!, remaining: Int!, resetAt: DateTime! } }
HTTP headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset

# Global Node IDs
Format: base64("TypeName:ID")
Query: node(id: ID!): Node

# Core Queries
repository(owner: String!, name: String!): Repository
rateLimit: RateLimit!
node(id: ID!): Node

# Common Errors
401 Unauthorized – missing/invalid token
422 QuerySyntaxError – inspect errors[0].message and errors[0].locations

# Attribution
Data Size: 2418823 bytes
Links Found: 21362


## Attribution
- Source: GitHub GraphQL API
- URL: https://docs.github.com/en/graphql
- License: CC BY 4.0
- Crawl Date: 2025-05-07T12:32:19.005Z
- Data Size: 2418823 bytes
- Links Found: 21362

## Retrieved
2025-05-07
