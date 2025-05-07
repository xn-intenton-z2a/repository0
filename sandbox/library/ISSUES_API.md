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
