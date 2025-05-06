# GITHUB_REST_API

## Crawl Summary
GitHub REST API uses date-based versioning via X-GitHub-Api-Version header with default and supported version 2022-11-28. Authenticate using PAT in Authorization header, GitHub CLI login, or GitHub App installation tokens. CLI usage: gh api path with --method flag. Octokit.js: instantiate with auth token, use request(method path, params). curl: set Accept header, Authorization Bearer. Pagination via per_page and Link header; default 30, max 100. Rate limits: 5000/h auth, 60/h unauth. Include conditional requests using ETag and handle HTTP status codes: 400,401,403,404.

## Normalised Extract
Table of Contents
1 Authentication
2 API Versioning
3 GitHub CLI
4 Octokit.js SDK
5 curl Requests
6 Pagination
7 Rate Limits
8 Best Practices
9 Troubleshooting Procedures

1 Authentication
• Personal Access Token
  Header: Authorization: Bearer <TOKEN> or Authorization: token <TOKEN>
  Scopes: repo, workflow, admin:org, etc. per endpoint
• GitHub CLI
  Command: gh auth login
  Modes: github.com or custom GHE hostname
• GitHub App
  Step 1: Store APP_ID in vars
  Step 2: Store RSA private key in secret (-----BEGIN RSA PRIVATE KEY----- ...)
  Step 3: Generate token in workflow using actions/create-github-app-token@v1
  Step 4: Use GH_TOKEN from generate-token outputs

2 API Versioning
• Header: X-GitHub-Api-Version: YYYY-MM-DD
• Default: 2022-11-28
• Supported: 2022-11-28
• Error: 400 if unsupported version
• Upgrade: set new header, adjust integration per breaking changes

3 GitHub CLI
• Install gh on macOS/Windows/Linux
• Authenticate: gh auth login
• API calls: gh api <path> --method <GET|POST|PATCH|DELETE>
• Example: gh api /repos/octocat/Spoon-Knife/issues --method GET

4 Octokit.js SDK
• Install: npm install octokit
• Import: import { Octokit } from "octokit"
• Constructor signature:
    new Octokit({ auth: string, userAgent?: string, baseUrl?: string, request?: { timeout?: number } })
• Request method signature:
    octokit.request(methodAndPath: string, params: object): Promise<{ data: any, status: number, headers: object }>
• Example:
    const octokit = new Octokit({ auth: process.env.TOKEN })
    await octokit.request("GET /repos/{owner}/{repo}/issues", { owner: "octocat", repo: "Spoon-Knife" })

5 curl Requests
• Header: Accept: application/vnd.github+json
• Header: Authorization: Bearer <TOKEN>
• Request format:
    curl --request <METHOD> \
      --url "https://api.github.com/repos/{owner}/{repo}/issues" \
      --header "Accept: application/vnd.github+json" \
      --header "Authorization: Bearer <TOKEN>"

6 Pagination
• Query params: per_page (default 30, max 100), page (default 1)
• Response header: Link: <...&page=2>; rel="next", <...&page=N>; rel="last"
• To iterate: parse Link header, follow next until absent

7 Rate Limits
• Endpoint: GET /rate_limit
• Authenticated: 5000 per hour
• Unauthenticated: 60 per hour
• Response JSON: resources.core.remaining, resets_at

8 Best Practices
• Always set X-GitHub-Api-Version
• Use conditional GET with If-None-Match: <ETag>
• Check rate limits before bulk requests
• Use appropriate Accept media type for preview features

9 Troubleshooting Procedures
• Inspect HTTP status codes:
    400: invalid parameters
    401: missing/invalid auth
    403: rate limit or insufficient scopes
    404: wrong endpoint or missing permissions
• Debug CLI: gh api --verbose
• Debug Octokit: set log: { debug: console.debug }
• Curl output: add --verbose and check response headers and body

## Supplementary Details
Authentication Scopes
- repo: Full control of private repositories
- workflow: Update GitHub Actions workflows
- admin:org: Full control of org settings
- notifications: Read user notifications

Rate Limit Details
- core: 5000/hour
- search: 30/hour
- graphql: 5000/minute
- integration manifest: 1000/hour
Reset header: X-RateLimit-Reset (UNIX timestamp)

Pagination Defaults
- per_page default: 30
- per_page max: 100
- page default: 1

Media Types
- application/vnd.github+json: stable API
- application/vnd.github.machine-man-preview+json: GitHub App preview

Conditional Requests
- Send header If-None-Match: <ETag> obtained from previous response
- 304 status on unmodified

Error Response Schema
{
  message: string,
  documentation_url: string
}

Environment Variables
- GITHUB_TOKEN: automatically provided in Actions
- GH_TOKEN: user-provided PAT
- APP_ID: GitHub App ID
- APP_PEM: GitHub App private key


## Reference Details
1 Constructor Signatures
Octokit(options: {
  auth: string
  userAgent?: string
  baseUrl?: string
  request?: { timeout?: number }
}): OctokitInstance

Methods
- request(methodAndPath: "METHOD /path/{param}", params: object): Promise<{ data: any; status: number; headers: object }>
- paginate(requestMethod: Function, params: object): AsyncIterableIterator<any>
- rest.issues.createComment(params: { owner: string; repo: string; issue_number: number; body: string }): Promise<{ data: IssueComment }>

2 GitHub CLI Commands
- gh auth login [--hostname <hostname>]
- gh api <endpoint> [--method <METHOD>] [--header <header>] [--input <file>]
- gh api graphql -f query='<query>'

3 curl Commands
- curl --request GET --url "https://api.github.com/repos/{owner}/{repo}/issues" --header "Accept: application/vnd.github+json" --header "Authorization: Bearer <TOKEN>"
- curl --request POST --url "https://api.github.com/repos/{owner}/{repo}/issues" --header "Authorization: token <TOKEN>" --data '{"title":"New issue","body":"Issue body"}'

4 Implementation Patterns
- Conditional update:
  1. GET resource with If-None-Match: <ETag>
  2. If 200: process data, modify payload
  3. PATCH resource with If-Match: <ETag>

- Bulk pagination:
  async function getAllIssues(octokit, owner, repo) {
    const iterator = octokit.paginate.iterator("GET /repos/{owner}/{repo}/issues", { owner, repo, per_page:100 })
    for await (const { data } of iterator) {
      data.forEach(issue => process(issue))
    }
  }

5 Configuration Options
- X-GitHub-Api-Version: specify date string
- Accept: media type string
- per_page, page in query

6 Troubleshooting Commands
- gh api --verbose /rate_limit
- curl --verbose --header "Authorization: Bearer <TOKEN>" https://api.github.com/rate_limit
- NODE_DEBUG=octokit node script.js


## Information Dense Extract
version:X-GitHub-Api-Version=2022-11-28;auth:Bearer<TOKEN>;rate_limit:5000/h core,60/h unauth;pagination:per_page<=100,page>=1,Link header;octokit: new Octokit({auth}), request("METHOD /path/{params}",params);ghCLI: gh api <path> --method METHOD;curl: curl -XMETHOD URL -HAccept:application/vnd.github+json -HAuthorization:Bearer<TOKEN>;scopes:repo,workflow,admin:org;conditional:If-None-Match/If-Match with ETag;errors:400,401,403,404;debug:gh api --verbose,NODE_DEBUG=octokit

## Sanitised Extract
Table of Contents
1 Authentication
2 API Versioning
3 GitHub CLI
4 Octokit.js SDK
5 curl Requests
6 Pagination
7 Rate Limits
8 Best Practices
9 Troubleshooting Procedures

1 Authentication
 Personal Access Token
  Header: Authorization: Bearer <TOKEN> or Authorization: token <TOKEN>
  Scopes: repo, workflow, admin:org, etc. per endpoint
 GitHub CLI
  Command: gh auth login
  Modes: github.com or custom GHE hostname
 GitHub App
  Step 1: Store APP_ID in vars
  Step 2: Store RSA private key in secret (-----BEGIN RSA PRIVATE KEY----- ...)
  Step 3: Generate token in workflow using actions/create-github-app-token@v1
  Step 4: Use GH_TOKEN from generate-token outputs

2 API Versioning
 Header: X-GitHub-Api-Version: YYYY-MM-DD
 Default: 2022-11-28
 Supported: 2022-11-28
 Error: 400 if unsupported version
 Upgrade: set new header, adjust integration per breaking changes

3 GitHub CLI
 Install gh on macOS/Windows/Linux
 Authenticate: gh auth login
 API calls: gh api <path> --method <GET|POST|PATCH|DELETE>
 Example: gh api /repos/octocat/Spoon-Knife/issues --method GET

4 Octokit.js SDK
 Install: npm install octokit
 Import: import { Octokit } from 'octokit'
 Constructor signature:
    new Octokit({ auth: string, userAgent?: string, baseUrl?: string, request?: { timeout?: number } })
 Request method signature:
    octokit.request(methodAndPath: string, params: object): Promise<{ data: any, status: number, headers: object }>
 Example:
    const octokit = new Octokit({ auth: process.env.TOKEN })
    await octokit.request('GET /repos/{owner}/{repo}/issues', { owner: 'octocat', repo: 'Spoon-Knife' })

5 curl Requests
 Header: Accept: application/vnd.github+json
 Header: Authorization: Bearer <TOKEN>
 Request format:
    curl --request <METHOD> '
      --url 'https://api.github.com/repos/{owner}/{repo}/issues' '
      --header 'Accept: application/vnd.github+json' '
      --header 'Authorization: Bearer <TOKEN>'

6 Pagination
 Query params: per_page (default 30, max 100), page (default 1)
 Response header: Link: <...&page=2>; rel='next', <...&page=N>; rel='last'
 To iterate: parse Link header, follow next until absent

7 Rate Limits
 Endpoint: GET /rate_limit
 Authenticated: 5000 per hour
 Unauthenticated: 60 per hour
 Response JSON: resources.core.remaining, resets_at

8 Best Practices
 Always set X-GitHub-Api-Version
 Use conditional GET with If-None-Match: <ETag>
 Check rate limits before bulk requests
 Use appropriate Accept media type for preview features

9 Troubleshooting Procedures
 Inspect HTTP status codes:
    400: invalid parameters
    401: missing/invalid auth
    403: rate limit or insufficient scopes
    404: wrong endpoint or missing permissions
 Debug CLI: gh api --verbose
 Debug Octokit: set log: { debug: console.debug }
 Curl output: add --verbose and check response headers and body

## Original Source
GitHub REST API
https://docs.github.com/en/rest

## Digest of GITHUB_REST_API

# Overview

## API Versioning
- Header: `X-GitHub-Api-Version: YYYY-MM-DD`
- Default version: 2022-11-28
- Supported versions: 2022-11-28
- Breaking changes every version; see changelog

## Authentication
- Personal Access Token: pass in header `Authorization: Bearer <TOKEN>` or `Authorization: token <TOKEN>`
- GitHub CLI: `gh auth login`
- GitHub App: generate installation token via `actions/create-github-app-token@v1`

## GitHub CLI Usage
- Command: `gh api <path> [--method <METHOD>] [--input <file>]`
- Example: `gh api /repos/{owner}/{repo}/issues --method GET`

## Octokit.js Usage
- Install: `npm install octokit`
- Import: `import { Octokit } from "octokit"`
- Init: `const octokit = new Octokit({ auth: 'YOUR-TOKEN' })`
- Request: `await octokit.request("GET /repos/{owner}/{repo}/issues", { owner, repo })`

## curl Usage
- Request: 
  curl --request GET \
    --url "https://api.github.com/repos/{owner}/{repo}/issues" \
    --header "Accept: application/vnd.github+json" \
    --header "Authorization: Bearer <TOKEN>"

## Pagination
- Use `per_page` and `page` parameters
- Default `per_page`: 30, max: 100
- Check `Link` header for `rel=next`

## Rate Limits
- Authenticated: 5000 requests per hour
- Unauthenticated: 60 requests per hour
- Check endpoint: GET /rate_limit

## Best Practices
- Specify version header
- Use conditional requests with `If-None-Match` and ETag
- Handle 403 rate-limit responses

## Troubleshooting
- HTTP 400: bad request
- HTTP 401: authentication error
- HTTP 403: rate limit exceeded
- HTTP 404: not found
- Inspect response.headers and response.data.message

## Attribution
- Source: GitHub REST API
- URL: https://docs.github.com/en/rest
- License: License
- Crawl Date: 2025-05-06T06:30:17.830Z
- Data Size: 426618 bytes
- Links Found: 7685

## Retrieved
2025-05-06
