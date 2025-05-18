# REST_AUTHENTICATION

## Crawl Summary
GitHub REST API authentication supports three methods: GitHub CLI, Octokit.js, and curl. CLI: gh auth login with options --hostname and --with-token; stores HTTPS credentials. CLI in Actions: set GH_TOKEN to GITHUB_TOKEN, grant minimal permissions, run gh api with --method. GitHub App token: use actions/create-github-app-token@v1 with app-id and private-key inputs, output token expires in 60m. Octokit.js: npm install octokit; instantiate Octokit({auth: token}); use octokit.request(method path, params). Octokit.js in Actions: checkout, setup-node, install, run script with process.env.TOKEN. curl: include headers Accept: application/vnd.github+json and Authorization: Bearer token. curl in Actions: same pattern with GH_TOKEN.

## Normalised Extract
Table of Contents
1 Authentication via GitHub CLI
2 GitHub CLI in GitHub Actions
3 GitHub App installation token in Actions
4 Authentication via Octokit.js
5 Octokit.js usage in Actions
6 Authentication via curl
7 curl usage in GitHub Actions

1 Authentication via GitHub CLI
  Command: gh auth login
  Options: --hostname <host> to specify GitHub instance
           --with-token to read token from stdin
  Behavior: stores HTTPS Git credentials automatically

2 GitHub CLI in GitHub Actions
  permissions: issues: read
  env var: GH_TOKEN set to GITHUB_TOKEN secret
  Invocation: gh api /repos/{owner}/{repo}/issues --method GET

3 GitHub App installation token in Actions
  Action: actions/create-github-app-token@v1
  Inputs:
    app-id      integer GitHub App ID
    private-key PEM RSA private key including headers
  Output: token expires after 60 minutes
  Usage: set GH_TOKEN to output token

4 Authentication via Octokit.js
  Install: npm install octokit
  Import: import { Octokit } from octokit
  Constructor: new Octokit({ auth: "YOUR-TOKEN" })
  Request: await octokit.request("GET /repos/{owner}/{repo}/issues", { owner: "octocat", repo: "Spoon-Knife" })

5 Octokit.js usage in Actions
  Steps:
    checkout@v4
    setup-node@v4 with node-version and cache
    npm install octokit
    run script .github/actions-scripts/use-the-api.mjs
      env TOKEN: GITHUB_TOKEN
  Script details: instantiate Octokit({ auth: process.env.TOKEN }), use octokit.request, handle response

6 Authentication via curl
  Command syntax:
    curl --request GET
         --url "https://api.github.com/repos/{owner}/{repo}/issues"
         --header "Accept: application/vnd.github+json"
         --header "Authorization: Bearer YOUR-TOKEN"
  Header: Authorization can use Bearer or token prefix except JWT requires Bearer

7 curl usage in GitHub Actions
  Run step:
    env GH_TOKEN: GITHUB_TOKEN secret
    run curl with same headers and Authorization: Bearer $GH_TOKEN

## Supplementary Details
Environment variables:
  GH_TOKEN: personal or installation token for non-interactive authentication
  GITHUB_TOKEN: built-in token in Actions with default scopes, use GH_TOKEN mapping
Headers:
  Accept: application/vnd.github+json (API media type)
  Authorization: Bearer <token> or Authorization: token <token> for PATs; JWT must use Bearer
CLI:
  gh auth login auto-detects protocol; use --with-token to pipe token
  gh api supports --method, --header, and full URL or path prefixed with /repos/
Octokit.js:
  request(method path, params) accepts path with placeholders {owner}, {repo}
  returns Promise resolving to Response object with data array when listing issues
GitHub App token Action inputs:
  app-id must be integer or string value
  private-key must include full PEM including BEGIN and END markers
  token output called 'token' and stored under steps.generate-token.outputs.token
Token expiration:
  Installation tokens expire after maximum 60 minutes; refresh per workflow run
Permissions in Actions:
  Grant minimal permissions to GITHUB_TOKEN to limit scope


## Reference Details
GitHub CLI Authentication:
  gh auth login
    --hostname <host:string> optional, default github.com
    --with-token boolean flag to read token from stdin
  gh api <endpoint:string> --method <METHOD:string> [--header name:value]

GitHub Actions CLI step example:
  permissions:
    issues: read
  steps:
    - run: gh api /repos/{owner}/{repo}/issues --method GET
      env:
        GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

GitHub App Token Action:
  uses: actions/create-github-app-token@v1
  with:
    app-id: <integer|string>  # App identifier
    private-key: <string>     # PEM RSA private key
  outputs:
    token: <string>           # Installation token, expires in 3600 seconds

Octokit.js SDK:
  import { Octokit } from "octokit"
  constructor signature: new Octokit(options:{ auth:string, userAgent?:string, baseUrl?:string, log?:object })
  request<T = any>(route:string, parameters?:object): Promise<{
    status: number
    url: string
    headers: Record<string,string>
    data: T
  }>

Octokit.js request example:
  const response = await octokit.request("GET /repos/{owner}/{repo}/issues", { owner: "octocat", repo: "Spoon-Knife" })
  if (response.status === 200) process(response.data)
  else throw new Error(`Status ${response.status}`)

Octokit.js in Actions workflow:
  uses: actions/checkout@v4
  uses: actions/setup-node@v4 with node-version: '16.17.0'
  run: npm install octokit
  run: node script.mjs env: TOKEN=GITHUB_TOKEN

curl Authentication:
  curl --request <METHOD:string> \
       --url <url:string> \
       --header "Accept: application/vnd.github+json" \
       --header "Authorization: Bearer <token:string>"
  returns: JSON response body, status codes 200 on success, 401 on Unauthorized, 403 on rate limit

Troubleshooting:
  Command: curl --version
    Expected: curl x.y.z protocol https
  Error 401: verify Authorization header format; ensure Bearer prefix and valid token
  Error 403: check rate-limit headers X-RateLimit-Remaining and X-RateLimit-Reset; back off or upgrade token

Best Practices:
  Use GITHUB_TOKEN in Actions to avoid storing PATs
  Grant least permissions necessary in permissions block
  Rotate private keys and regenerate installation tokens per run
  Validate token expiration and catch 401 to refresh


## Information Dense Extract
gh auth login: interactive OAuth device flow; options --hostname, --with-token. gh api endpoint --method, supports --header. In Actions: set GH_TOKEN to ${{secrets.GITHUB_TOKEN}}, minimal permissions. For GitHub App: actions/create-github-app-token@v1 with inputs app-id, private-key; outputs token valid 3600s. Octokit: npm install octokit; new Octokit({auth:string}); octokit.request("METHOD /path", params) returns Promise<{status, headers, data}>. In Actions: checkout@v4, setup-node@v4, npm install octokit, run script with TOKEN env. curl: curl --request METHOD --url URL --header "Accept: application/vnd.github+json" --header "Authorization: Bearer TOKEN". Use Bearer or token prefix; JWT must use Bearer. Handle HTTP 200,401,403. X-RateLimit headers for rate-limiting.

## Sanitised Extract
Table of Contents
1 Authentication via GitHub CLI
2 GitHub CLI in GitHub Actions
3 GitHub App installation token in Actions
4 Authentication via Octokit.js
5 Octokit.js usage in Actions
6 Authentication via curl
7 curl usage in GitHub Actions

1 Authentication via GitHub CLI
  Command: gh auth login
  Options: --hostname <host> to specify GitHub instance
           --with-token to read token from stdin
  Behavior: stores HTTPS Git credentials automatically

2 GitHub CLI in GitHub Actions
  permissions: issues: read
  env var: GH_TOKEN set to GITHUB_TOKEN secret
  Invocation: gh api /repos/{owner}/{repo}/issues --method GET

3 GitHub App installation token in Actions
  Action: actions/create-github-app-token@v1
  Inputs:
    app-id      integer GitHub App ID
    private-key PEM RSA private key including headers
  Output: token expires after 60 minutes
  Usage: set GH_TOKEN to output token

4 Authentication via Octokit.js
  Install: npm install octokit
  Import: import { Octokit } from octokit
  Constructor: new Octokit({ auth: 'YOUR-TOKEN' })
  Request: await octokit.request('GET /repos/{owner}/{repo}/issues', { owner: 'octocat', repo: 'Spoon-Knife' })

5 Octokit.js usage in Actions
  Steps:
    checkout@v4
    setup-node@v4 with node-version and cache
    npm install octokit
    run script .github/actions-scripts/use-the-api.mjs
      env TOKEN: GITHUB_TOKEN
  Script details: instantiate Octokit({ auth: process.env.TOKEN }), use octokit.request, handle response

6 Authentication via curl
  Command syntax:
    curl --request GET
         --url 'https://api.github.com/repos/{owner}/{repo}/issues'
         --header 'Accept: application/vnd.github+json'
         --header 'Authorization: Bearer YOUR-TOKEN'
  Header: Authorization can use Bearer or token prefix except JWT requires Bearer

7 curl usage in GitHub Actions
  Run step:
    env GH_TOKEN: GITHUB_TOKEN secret
    run curl with same headers and Authorization: Bearer $GH_TOKEN

## Original Source
GitHub REST API
https://docs.github.com/en/rest

## Digest of REST_AUTHENTICATION

# Authenticating to the REST API

## Using GitHub CLI in the command line

Install GitHub CLI on macOS, Windows, or Linux via official installer or package manager.

Authenticate interactively:

  gh auth login
    --hostname <host>
    --with-token (reads token from stdin)

CLI stores credentials for HTTPS Git operations when using gh auth login with HTTPS.

## Using GitHub CLI in GitHub Actions

Set permissions:
  permissions:
    issues: read

Set environment variable:
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

Invoke API:

  gh api /repos/{owner}/{repo}/issues --method GET

## Authenticating with a GitHub App in GitHub Actions

Generate installation token:

  uses: actions/create-github-app-token@v1
    with:
      app-id: ${{ vars.APP_ID }}          # integer GitHub App ID
      private-key: ${{ secrets.APP_PEM }}  # RSA private key PEM

Outputs:
  steps.generate-token.outputs.token  # expires in 60 minutes

Use token:
  GH_TOKEN: ${{ steps.generate-token.outputs.token }}
  gh api /repos/{owner}/{repo}/issues --header "Authorization: Bearer $GH_TOKEN"

## Using Octokit.js

Install package:
  npm install octokit

Import and authenticate:

  import { Octokit } from "octokit"
  const octokit = new Octokit({ auth: "YOUR-TOKEN" })

Request syntax:

  await octokit.request("GET /repos/{owner}/{repo}/issues", {
    owner: "octocat",
    repo: "Spoon-Knife"
  })

## Using Octokit.js in GitHub Actions

Steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-node@v4
      node-version: '16.17.0'
      cache: npm
  - run: npm install octokit
  - run: node .github/actions-scripts/use-the-api.mjs
      env:
        TOKEN: ${{ secrets.GITHUB_TOKEN }}

Script file .github/actions-scripts/use-the-api.mjs:

  import { Octokit } from "octokit"
  const octokit = new Octokit({ auth: process.env.TOKEN })
  const result = await octokit.request("GET /repos/{owner}/{repo}/issues", { owner: "octocat", repo: "Spoon-Knife" })
  console.log(result.data.map(issue => ({ title: issue.title, authorID: issue.user.id })))

## Using curl in the command line

Authenticate and request:

  curl --request GET \
       --url "https://api.github.com/repos/octocat/Spoon-Knife/issues" \
       --header "Accept: application/vnd.github+json" \
       --header "Authorization: Bearer YOUR-TOKEN"

## Using curl in GitHub Actions

  - run: |
      curl --request GET \
           --url "https://api.github.com/repos/octocat/Spoon-Knife/issues" \
           --header "Accept: application/vnd.github+json" \
           --header "Authorization: Bearer ${{ secrets.GITHUB_TOKEN }}"

Retrieved on 2024-06-12
Attribution: https://docs.github.com/en/rest
Data Size: 1191669 bytes

## Attribution
- Source: GitHub REST API
- URL: https://docs.github.com/en/rest
- License: License
- Crawl Date: 2025-05-18T03:38:15.337Z
- Data Size: 1191669 bytes
- Links Found: 12620

## Retrieved
2025-05-18
