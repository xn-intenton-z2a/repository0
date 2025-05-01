# GITHUB_API

## Crawl Summary
GitHub REST API technical documentation covering authentication (CLI, token, GitHub App), API versioning using X-GitHub-Api-Version header, and implementation with Octokit.js and curl. Detailed YAML workflow examples for GitHub Actions authentication and API requests with exact methods and examples provided. Complete list of REST endpoints with categorization and parameter specifications documented.

## Normalised Extract
Table of Contents:
1. Authentication Methods
   a. GitHub CLI: Command 'gh auth login'; Request example: gh api /octocat --method GET.
   b. Token Authentication: Set GH_TOKEN env variable; YAML snippet provided for using GITHUB_TOKEN.
   c. GitHub App Auth: Use app ID (APP_ID) and private key (APP_PEM); generate token using actions/create-github-app-token@v1 in workflows.
   d. Octokit.js: Installation via npm; method signature: new Octokit({ auth: 'YOUR-TOKEN' }); request: await octokit.request("GET /repos/{owner}/{repo}/issues", { owner: "octocat", repo: "Spoon-Knife" }).
   e. Curl Commands: Example provided with --request GET, --header "Accept: application/vnd.github+json", and Authorization header.
2. API Versioning
   - Use header X-GitHub-Api-Version with version string like "2022-11-28".
   - Default version fallback if omitted.
3. Endpoint Specifications
   - Endpoints for issues, commits, pull requests, deployments etc. with defined required and optional parameters.
4. Implementation Patterns
   - CLI, Octokit.js, and curl-based integration patterns with code snippets and YAML workflow examples.
Detailed Items:
Authentication via CLI: Execute 'gh auth login'; use 'gh api /octocat --method GET'.
Token authentication for GitHub Actions: Define GH_TOKEN in workflow environment; ensure permission scopes like 'issues: read'.
Octokit.js Example: Import Octokit from 'octokit'; then instantiate and call octokit.request with exact endpoint format.
Curl Command Example: Use curl with proper headers including Accept and Authorization.
API Versioning: Specify X-GitHub-Api-Version header; fallback to 2022-11-28 if missing.
Complete YAML Workflow examples provided for both token and GitHub App authentication.

## Supplementary Details
GitHub CLI setup:
- Command: gh auth login
- Usage: gh api /octocat --method GET

Token Authentication in GitHub Actions:
- Environment variable: GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
- YAML snippet provided to list repository issues.

GitHub App Authentication:
- Store app ID and private key secret (APP_ID and APP_PEM).
- Use action: actions/create-github-app-token@v1 with inputs:
    app-id: ${{ vars.APP_ID }}
    private-key: ${{ secrets.APP_PEM }}

Octokit.js Setup:
- Install via npm: npm install octokit
- Import using: import { Octokit } from "octokit";
- Method signature: const octokit = new Octokit({ auth: 'YOUR-TOKEN' });
- Request: await octokit.request("GET /repos/{owner}/{repo}/issues", { owner: "octocat", repo: "Spoon-Knife" });

Curl Command Usage:
- Command structure:
  curl --request GET \
    --url "https://api.github.com/repos/octocat/Spoon-Knife/issues" \
    --header "Accept: application/vnd.github+json" \
    --header "Authorization: Bearer YOUR-TOKEN"

API Versioning:
- Header: X-GitHub-Api-Version
- Example: curl --header "X-GitHub-Api-Version:2022-11-28" https://api.github.com/zen
- Supported version: 2022-11-28

Configuration Options:
- API Version header value must match supported versions. Default is 2022-11-28.
- Permissions in GitHub Actions require explicit declaration (e.g., issues: read).
- Secrets must include complete private key including RSA header/footer for GitHub App auth.

Implementation Steps:
1. Choose authentication method (CLI, token, GitHub App, or Octokit.js).
2. Set up environment variables or secrets accordingly.
3. Use provided YAML workflow examples for GitHub Actions.
4. For REST API requests, specify proper HTTP method, endpoint path, parameters, and headers.
5. Test integration by running sample commands and verifying response structure.

Troubleshooting Procedures:
- Verify token validity by checking authentication errors (e.g., error.status and error.response.data.message in Octokit catch block).
- Ensure correct API version by specifying X-GitHub-Api-Version header; if unsupported, a 400 error is returned.
- For CLI issues, verify installation of GitHub CLI using gh --version.
- For curl, check token and header formatting if API calls return authentication errors.

## Reference Details
API Specifications:
- GitHub CLI:
  Method: gh auth login
  API Call: gh api /octocat --method GET
  Parameters: None additional; uses stored credentials.

- Octokit.js SDK:
  Method Signature: const octokit = new Octokit({ auth: string });
  Request Example: await octokit.request("GET /repos/{owner}/{repo}/issues", { owner: string, repo: string });
  Returns: Promise with response object containing data (issue array), status, and headers.
  Error: Catches error with error.status and error.response.data.message.

- Curl Command:
  Syntax: curl --request GET \
    --url "https://api.github.com/repos/{owner}/{repo}/issues" \
    --header "Accept: application/vnd.github+json" \
    --header "Authorization: Bearer YOUR-TOKEN"
  Parameters: owner, repo provided as URL path variables.

Configuration Options and Best Practices:
- Use environment variable GH_TOKEN for token authentication in workflows.
- For GitHub App authentication, configuration:
   app-id: provided as ${{ vars.APP_ID }}
   private-key: complete RSA key from secret (including -----BEGIN RSA PRIVATE KEY----- and -----END RSA PRIVATE KEY-----).
- API versioning: Always include header X-GitHub-Api-Version with value '2022-11-28' to control API behavior.
- YAML Workflow Example for GitHub Actions:
  workflow_dispatch:
  jobs:
    use_api_via_script:
      runs-on: ubuntu-latest
      permissions:
        issues: read
      steps:
        - name: Check out repo content
          uses: actions/checkout@v4
        - name: Setup Node
          uses: actions/setup-node@v4
          with:
            node-version: '16.17.0'
            cache: npm
        - name: Install dependencies
          run: npm install octokit
        - name: Generate token (GitHub App)
          id: generate-token
          uses: actions/create-github-app-token@v1
          with:
            app-id: ${{ vars.APP_ID }}
            private-key: ${{ secrets.APP_PEM }}
        - name: Run script
          run: node .github/actions-scripts/use-the-api.mjs
          env:
            TOKEN: ${{ steps.generate-token.outputs.token }}

Detailed Troubleshooting Commands:
- To verify CLI installation: gh --version
- To test token: Execute gh api /octocat --method GET
- For curl: curl --request GET --url "https://api.github.com/zen" --header "X-GitHub-Api-Version:2022-11-28"
- In Octokit, log error using: console.log(`Error! Status: ${error.status}. Message: ${error.response.data.message}`)

Code Example (Octokit.js):
// Import Octokit
import { Octokit } from "octokit";

// Create instance with your token
const octokit = new Octokit({ auth: process.env.TOKEN });

// Make a request to list repository issues
try {
  const result = await octokit.request("GET /repos/{owner}/{repo}/issues", {
    owner: "octocat",
    repo: "Spoon-Knife",
  });
  // Process result.data
  console.log(result.data);
} catch (error) {
  console.log(`Error! Status: ${error.status}. Message: ${error.response.data.message}`);
}

Ensure all parameters are exact and that tokens and keys are correctly formatted.


## Information Dense Extract
API CLI: gh auth login; gh api /octocat --method GET; Octokit.js: new Octokit({ auth: 'TOKEN' }); await octokit.request('GET /repos/{owner}/{repo}/issues', { owner: 'octocat', repo: 'Spoon-Knife' }); Curl: curl --request GET --url 'https://api.github.com/repos/octocat/Spoon-Knife/issues' --header 'Accept: application/vnd.github+json' --header 'Authorization: Bearer TOKEN'; API versioning via X-GitHub-Api-Version: '2022-11-28'; YAML workflows with actions/checkout@v4, actions/setup-node@v4, actions/create-github-app-token@v1; GitHub App auth requires APP_ID and RSA privatekey (including BEGIN/END RSA PRIVATE KEY); Troubleshooting: check gh --version, errors with error.status and error.response.data.message; configuration options include GH_TOKEN, X-GitHub-Api-Version header, and permission scopes such as issues: read.

## Sanitised Extract
Table of Contents:
1. Authentication Methods
   a. GitHub CLI: Command 'gh auth login'; Request example: gh api /octocat --method GET.
   b. Token Authentication: Set GH_TOKEN env variable; YAML snippet provided for using GITHUB_TOKEN.
   c. GitHub App Auth: Use app ID (APP_ID) and private key (APP_PEM); generate token using actions/create-github-app-token@v1 in workflows.
   d. Octokit.js: Installation via npm; method signature: new Octokit({ auth: 'YOUR-TOKEN' }); request: await octokit.request('GET /repos/{owner}/{repo}/issues', { owner: 'octocat', repo: 'Spoon-Knife' }).
   e. Curl Commands: Example provided with --request GET, --header 'Accept: application/vnd.github+json', and Authorization header.
2. API Versioning
   - Use header X-GitHub-Api-Version with version string like '2022-11-28'.
   - Default version fallback if omitted.
3. Endpoint Specifications
   - Endpoints for issues, commits, pull requests, deployments etc. with defined required and optional parameters.
4. Implementation Patterns
   - CLI, Octokit.js, and curl-based integration patterns with code snippets and YAML workflow examples.
Detailed Items:
Authentication via CLI: Execute 'gh auth login'; use 'gh api /octocat --method GET'.
Token authentication for GitHub Actions: Define GH_TOKEN in workflow environment; ensure permission scopes like 'issues: read'.
Octokit.js Example: Import Octokit from 'octokit'; then instantiate and call octokit.request with exact endpoint format.
Curl Command Example: Use curl with proper headers including Accept and Authorization.
API Versioning: Specify X-GitHub-Api-Version header; fallback to 2022-11-28 if missing.
Complete YAML Workflow examples provided for both token and GitHub App authentication.

## Original Source
GitHub REST API
https://docs.github.com/en/rest

## Digest of GITHUB_API

# Overview
This document details the GitHub REST API with complete technical specifications, authentication methods, API versioning, and implementation patterns. It covers usage via GitHub CLI, Octokit.js, curl, and GitHub Action workflows. The content includes exact method signatures, configuration options, and step-by-step instructions.

# Authentication Methods
1. GitHub CLI:
   - Command: gh auth login
   - Example: gh api /octocat --method GET
   - Supports HTTPS and SSH; credentials automatically stored.

2. Access Token Authentication:
   - Environment variable: GH_TOKEN
   - Use built-in GITHUB_TOKEN in GitHub Actions, or store token as secret.
   - Sample YAML snippet:
     workflow_dispatch:
       jobs:
         use_api:
           runs-on: ubuntu-latest
           permissions:
             issues: read
           steps:
             - env:
                 GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
               run: |
                 gh api https://api.github.com/repos/octocat/Spoon-Knife/issues

3. GitHub App Authentication:
   - Store app ID as configuration variable, e.g., APP_ID.
   - Generate a private key stored in a secret (APP_PEM, including header/footer).
   - Use actions/create-github-app-token@v1 in workflows to generate a token; valid for 60 minutes.
   - Example YAML snippet provided for token generation and API usage.

4. Octokit.js Usage:
   - Installation: npm install octokit
   - Import: import { Octokit } from "octokit";
   - Instance creation: const octokit = new Octokit({ auth: 'YOUR-TOKEN' });
   - Method: await octokit.request("GET /repos/{owner}/{repo}/issues", { owner: "octocat", repo: "Spoon-Knife" });

5. Curl Commands:
   - Example:
     curl --request GET \
       --url "https://api.github.com/repos/octocat/Spoon-Knife/issues" \
       --header "Accept: application/vnd.github+json" \
       --header "Authorization: Bearer YOUR-TOKEN"

# API Versioning and Configuration
- Use X-GitHub-Api-Version header to specify version (e.g., 2022-11-28).
- Request example with header:
  curl --header "X-GitHub-Api-Version:2022-11-28" https://api.github.com/zen
- Default version is 2022-11-28 if header is omitted.
- Breaking changes require parameter changes, removal, or renaming of response fields.

# REST API Endpoints Summary
- Complete catalog of endpoints categorized by resources: issues, commits, pull requests, deployments, packages, and more.
- Every endpoint includes required parameters, optional parameters, expected response structure, and error handling.

# Implementation Patterns
1. CLI Pattern:
   - Commands executed directly from terminal or within GitHub Actions workflows.
   - Example usage provided for repository issues retrieval.

2. Octokit.js Pattern:
   - Initialize Octokit with authentication.
   - Call octokit.request with method signature string and parameter object.
   - Await response, then process result data.

3. Curl Pattern:
   - Build curl command with appropriate headers.
   - Pass token in Authorization header; ensure proper Accept header for JSON responses.

# Date Retrieved
Content retrieved on: 2023-10-05

# Attribution and Data Size
- Source: GitHub REST API documentation (https://docs.github.com/en/rest)
- Data Size: 2778362 bytes
- Number of Links: 17627

## Attribution
- Source: GitHub REST API
- URL: https://docs.github.com/en/rest
- License: License: Public Domain
- Crawl Date: 2025-05-01T22:01:30.161Z
- Data Size: 2778362 bytes
- Links Found: 17627

## Retrieved
2025-05-01
