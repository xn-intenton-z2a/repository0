# GITHUB_REST

## Crawl Summary
GitHub REST API supports integrations, authentication via CLI, tokens, and GitHub Apps. It specifies API versioning using the X-GitHub-Api-Version header (default 2022-11-28). Endpoints include issues, commits, actions, and more. Concrete examples are provided for GitHub CLI, Octokit.js usage, and curl commands. The documentation details best practices, authentication methods, and troubleshooting steps such as error logging and response handling.

## Normalised Extract
Table of Contents:
1. Authentication
   - Use GitHub CLI: gh auth login; gh api /octocat --method GET
   - GitHub Actions: Set GH_TOKEN, use checkout, setup-node, and run gh api command
   - GitHub App: Configure APP_ID, use private key (with -----BEGIN RSA PRIVATE KEY-----), and generate token via actions/create-github-app-token@v1
2. Octokit.js SDK
   - Installation: npm install octokit
   - Import: import { Octokit } from "octokit";
   - Instantiation: const octokit = new Octokit({ auth: 'YOUR-TOKEN' });
   - API Request: await octokit.request("GET /repos/{owner}/{repo}/issues", { owner: "octocat", repo: "Spoon-Knife" });
3. Curl Usage
   - Command: curl --request GET --url "https://api.github.com/repos/octocat/Spoon-Knife/issues" --header "Accept: application/vnd.github+json" --header "Authorization: Bearer YOUR-TOKEN"
4. API Versioning
   - Header: X-GitHub-Api-Version:2022-11-28
   - Unsupported versions return HTTP 400
5. Troubleshooting
   - Octokit error handling using try-catch; log error.status and error.response.data.message
   - Curl error: check header version and response codes

Each topic provides direct commands, configuration options, and expected outcomes.

## Supplementary Details
Authentication Methods:
- GitHub CLI: Execute gh auth login and then run commands using 'gh api' with -X flag for method specification.
- GitHub Actions: YAML workflow must define permissions, environment variables (GH_TOKEN), and use actions/checkout@v4 and actions/setup-node@v4.
- GitHub App: Requires app configuration with APP_ID and APP_PEM, then generate token with v1 action which lasts 60 minutes.

Octokit.js Implementation:
- Method Signature: Octokit({ auth: string })
- Request Method: request(endpoint: string, parameters: { owner: string, repo: string, [key: string]: any }) returns Promise<Response>

Curl Configuration:
- Use headers: Accept: application/vnd.github+json, Authorization: Bearer YOUR-TOKEN, and optionally X-GitHub-Api-Version header.

API Versioning:
- Mandatory header X-GitHub-Api-Version with API version string.
- Default API version: 2022-11-28, with changes detailed in breaking changes list.

Troubleshooting Procedure:
1. Inspect error message and status codes in Octokit catch block.
2. Confirm token steps and header correctness in curl.
3. Validate GitHub App token generation steps via workflow logs.

## Reference Details
API Specifications:
1. GitHub CLI:
   - Command: gh auth login
   - Request: gh api /octocat --method GET
   - Return: JSON response from GitHub API endpoints

2. Octokit.js SDK:
   - Constructor: new Octokit({ auth: string })
   - Request Signature: octokit.request(method: "GET /repos/{owner}/{repo}/issues", parameters: { owner: string, repo: string }): Promise<Response>
   - Example:
       const octokit = new Octokit({ auth: 'YOUR-TOKEN' });
       await octokit.request("GET /repos/{owner}/{repo}/issues", { owner: "octocat", repo: "Spoon-Knife" });

3. Curl Command:
   - Example:
       curl --request GET \
         --url "https://api.github.com/repos/octocat/Spoon-Knife/issues" \
         --header "Accept: application/vnd.github+json" \
         --header "Authorization: Bearer YOUR-TOKEN"

4. GitHub Actions YAML Examples:
   - Using GITHUB_TOKEN:
       on: workflow_dispatch
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
   - Using GitHub App Token:
       on: workflow_dispatch
       jobs:
         track_pr:
           runs-on: ubuntu-latest
           steps:
             - name: Generate token
               id: generate-token
               uses: actions/create-github-app-token@v1
               with:
                 app-id: ${{ vars.APP_ID }}
                 private-key: ${{ secrets.APP_PEM }}
             - name: Use API
               env:
                 GH_TOKEN: ${{ steps.generate-token.outputs.token }}
               run: |
                 gh api https://api.github.com/repos/octocat/Spoon-Knife/issues

5. API Versioning:
   - Header: X-GitHub-Api-Version
   - Usage: curl --header "X-GitHub-Api-Version:2022-11-28" https://api.github.com/zen

Best Practices:
- Always secure tokens, use environment variables and GitHub secrets.
- Use built-in GITHUB_TOKEN in GitHub Actions.
- Test integration changes when upgrading API versions.

Troubleshooting:
- Octokit: Wrap request in try-catch, log error.status and error.response.data.message.
- Curl: Verify token validity and correct header usage. Expect HTTP 400 for unsupported API versions.
- Check GitHub API documentation for updated endpoint specifications.

## Information Dense Extract
GitHub REST API: Authentication via gh auth login, GITHUB_TOKEN, or GitHub App with APP_ID and private key. CLI: gh api /octocat --method GET. Octokit.js: new Octokit({ auth: 'YOUR-TOKEN' }), await octokit.request("GET /repos/{owner}/{repo}/issues", { owner: "octocat", repo: "Spoon-Knife" }). Curl: curl --request GET --url "https://api.github.com/repos/octocat/Spoon-Knife/issues" --header "Accept: application/vnd.github+json" --header "Authorization: Bearer YOUR-TOKEN". API Versioning via X-GitHub-Api-Version header (default 2022-11-28). YAML workflows for GitHub Actions provided. Error handling: try-catch with error.status and error.response.data.message. Configuration options: tokens, headers, permissions, and YAML keys for actions.

## Sanitised Extract
Table of Contents:
1. Authentication
   - Use GitHub CLI: gh auth login; gh api /octocat --method GET
   - GitHub Actions: Set GH_TOKEN, use checkout, setup-node, and run gh api command
   - GitHub App: Configure APP_ID, use private key (with -----BEGIN RSA PRIVATE KEY-----), and generate token via actions/create-github-app-token@v1
2. Octokit.js SDK
   - Installation: npm install octokit
   - Import: import { Octokit } from 'octokit';
   - Instantiation: const octokit = new Octokit({ auth: 'YOUR-TOKEN' });
   - API Request: await octokit.request('GET /repos/{owner}/{repo}/issues', { owner: 'octocat', repo: 'Spoon-Knife' });
3. Curl Usage
   - Command: curl --request GET --url 'https://api.github.com/repos/octocat/Spoon-Knife/issues' --header 'Accept: application/vnd.github+json' --header 'Authorization: Bearer YOUR-TOKEN'
4. API Versioning
   - Header: X-GitHub-Api-Version:2022-11-28
   - Unsupported versions return HTTP 400
5. Troubleshooting
   - Octokit error handling using try-catch; log error.status and error.response.data.message
   - Curl error: check header version and response codes

Each topic provides direct commands, configuration options, and expected outcomes.

## Original Source
GitHub REST API Documentation
https://docs.github.com/en/rest

## Digest of GITHUB_REST

# GitHub REST API Documentation

## Overview
The GitHub REST API provides endpoints for integrations, data retrieval, and workflow automation. It supports versioning via date-named API versions (e.g., 2022-11-28) and uses standard HTTP methods.

## Authentication
- Command Line: Use GitHub CLI with "gh auth login". 
- Environment Variable: Set GH_TOKEN to use a personal access token or GITHUB_TOKEN in GitHub Actions.
- GitHub App: Generate an installation access token using a private key (including the full RSA key header/footer).

## GitHub CLI Usage
- Basic API call:
  Command: gh api /octocat --method GET
- In GitHub Actions:
  YAML snippet:
    runs-on: ubuntu-latest
    permissions:
      issues: read
    steps:
      - env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          gh api https://api.github.com/repos/octocat/Spoon-Knife/issues

## Octokit.js SDK
- Installation: npm install octokit
- Import: import { Octokit } from "octokit";
- Instantiation:
  const octokit = new Octokit({ auth: 'YOUR-TOKEN' });
- API Request:
  await octokit.request("GET /repos/{owner}/{repo}/issues", {
      owner: "octocat",
      repo: "Spoon-Knife"
  });

## Curl Usage
- Command example:
  curl --request GET \
    --url "https://api.github.com/repos/octocat/Spoon-Knife/issues" \
    --header "Accept: application/vnd.github+json" \
    --header "Authorization: Bearer YOUR-TOKEN"

## API Versioning
- Specify version using header:
  Header: X-GitHub-Api-Version:2022-11-28
- Default version if header not provided is 2022-11-28.

## Breaking Changes
- Breaking changes include parameter removals/renames, required fields changes, type changes, and header modifications.
- Review changelog for new API versions before upgrade.

## Troubleshooting
- For Octokit errors, use try-catch block and log error.status and error.response.data.message.
- Curl errors may return HTTP 400 if an unsupported version is specified.

Retrieved on: 2023-10-05
Attribution: Data size 1495822 bytes, 13981 links crawled.

## Attribution
- Source: GitHub REST API Documentation
- URL: https://docs.github.com/en/rest
- License: License: GitHub Terms of Service
- Crawl Date: 2025-05-01T22:57:45.548Z
- Data Size: 1495822 bytes
- Links Found: 13981

## Retrieved
2025-05-01
