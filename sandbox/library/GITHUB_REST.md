# GITHUB_REST

## Crawl Summary
Authentication methods include PATs, GitHub App tokens, and GITHUB_TOKEN. GitHub CLI commands (e.g., gh auth login, gh api /octocat --method GET) and GitHub Actions workflows are detailed. Octokit.js usage specifies instance creation and method calls (GET /repos/{owner}/{repo}/issues). Curl commands with headers for Accept and Authorization are provided. API versioning is enforced via X-GitHub-Api-Version header. Breaking changes and upgrade strategies are outlined.

## Normalised Extract
TABLE OF CONTENTS:
1. Authentication
2. GitHub CLI Usage
3. GitHub CLI in GitHub Actions
4. Octokit.js Usage
5. Curl Command Usage
6. API Versioning
7. Breaking Changes

1. Authentication:
 - Methods: PAT, GitHub App tokens, GITHUB_TOKEN
 - Command: gh auth login
 - For GitHub App: use app ID and private RSA key (complete key with BEGIN and END lines)

2. GitHub CLI Usage:
 - Command: gh api /octocat --method GET
 - Additional usage: https://api.github.com/repos/octocat/Spoon-Knife/issues

3. GitHub CLI in GitHub Actions:
 - Environment variable set: GH_TOKEN from secrets (e.g., secrets.GITHUB_TOKEN)
 - YAML snippet includes runs-on: ubuntu-latest, permissions: issues: read
 - Steps include token generation via actions/create-github-app-token@v1 with inputs app-id and private-key

4. Octokit.js Usage:
 - Install: npm install octokit
 - Import: import { Octokit } from "octokit"
 - Instance: const octokit = new Octokit({ auth: 'YOUR-TOKEN' });
 - Method call: await octokit.request("GET /repos/{owner}/{repo}/issues", { owner: "octocat", repo: "Spoon-Knife" });

5. Curl Command Usage:
 - Command:
   curl --request GET \
        --url "https://api.github.com/repos/octocat/Spoon-Knife/issues" \
        --header "Accept: application/vnd.github+json" \
        --header "Authorization: Bearer YOUR-TOKEN"

6. API Versioning:
 - Header: X-GitHub-Api-Version:2022-11-28
 - Default: 2022-11-28 if header not provided
 - Upgrade instructions: Check changelog and update integration

7. Breaking Changes:
 - Changes include removal/renaming of endpoints, parameters, response fields;
 - Examples: Changes from optional to required parameters, enum modifications, and header additions.

## Supplementary Details
Authentication Specifications:
- Use gh auth login or set environment variable GH_TOKEN
- For GitHub Apps, configuration variables: APP_ID and secret APP_PEM containing full RSA key

GitHub CLI Configuration in YAML:
- jobs: use_api with runs-on: ubuntu-latest
- permissions: issues: read
- Steps: use token from secrets, commands: gh api <endpoint> --method GET

Octokit.js Configuration:
- Installation: npm install octokit
- Code: import { Octokit } from "octokit"; const octokit = new Octokit({ auth: 'YOUR-TOKEN' });
- Request: await octokit.request("GET /repos/{owner}/{repo}/issues", { owner: "octocat", repo: "Spoon-Knife" });

Curl Command Specifications:
- Required headers: Accept: application/vnd.github+json, Authorization: Bearer YOUR-TOKEN
- Full command includes multiple line backslash separated parameters

API Versioning and Headers:
- Mandatory header for versioning: X-GitHub-Api-Version with a value like 2022-11-28
- Default version if omitted: 2022-11-28

Troubleshooting:
- On failure, check token validity, header inclusion, rate limits, and response error codes (e.g., 400 for unsupported API version)
- Verify token permissions and proper YAML syntax in GitHub Actions workflows.

## Reference Details
GitHub REST API complete specifications:

Authentication API: 
- Method: gh auth login
- Parameters: None; interactively prompts for GitHub.com or custom domain input

GitHub CLI API Example:
Command: gh api /octocat --method GET
- Return: JSON object with meta data for endpoint /octocat

GitHub CLI in Actions (YAML):
  on:
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

GitHub App Token Generation in YAML:
  - name: Generate token
    id: generate-token
    uses: actions/create-github-app-token@v1
    with:
      app-id: ${{ vars.APP_ID }}
      private-key: ${{ secrets.APP_PEM }}

Octokit.js SDK:
- Method Signature: Octokit(options: { auth: string | ((...args: any[]) => any) })
- Request Method: octokit.request(endpoint: string, parameters: { [key: string]: any }): Promise<Response>
- Example:
    const octokit = new Octokit({ auth: 'YOUR-TOKEN' });
    await octokit.request("GET /repos/{owner}/{repo}/issues", {
      owner: "octocat",
      repo: "Spoon-Knife"
    });

Curl Example with full headers:
  curl --request GET \
       --url "https://api.github.com/repos/octocat/Spoon-Knife/issues" \
       --header "Accept: application/vnd.github+json" \
       --header "Authorization: Bearer YOUR-TOKEN"

API Versioning: 
- Header: X-GitHub-Api-Version with exact value: 2022-11-28
- Example: curl --header "X-GitHub-Api-Version:2022-11-28" https://api.github.com/zen

Best Practices:
- Always secure tokens by storing as secrets or using environment variables
- Use built-in GITHUB_TOKEN in GitHub Actions when possible
- Validate YAML syntax in workflow definitions
- Review rate limit response headers and error message outputs

Troubleshooting Commands:
- Verify token: gh auth status
- Rate Limit check: gh api /rate_limit
- Inspect API response error codes and messages in logs

## Information Dense Extract
auth: PAT, App tokens (APP_ID, APP_PEM), GITHUB_TOKEN; CLI: gh auth login, gh api /octocat --method GET; Actions: runs-on ubuntu-latest, permissions issues: read, YAML token injection; Octokit.js: import { Octokit } from "octokit", new Octokit({ auth: 'YOUR-TOKEN' }), request GET /repos/{owner}/{repo}/issues; curl: GET command with Accept and Authorization headers; API versioning: X-GitHub-Api-Version:2022-11-28; breaking changes: removal/renaming endpoints/params; best practices: secure tokens, use built-in tokens, check YAML, validate responses; troubleshooting: gh auth status, gh api /rate_limit.

## Sanitised Extract
TABLE OF CONTENTS:
1. Authentication
2. GitHub CLI Usage
3. GitHub CLI in GitHub Actions
4. Octokit.js Usage
5. Curl Command Usage
6. API Versioning
7. Breaking Changes

1. Authentication:
 - Methods: PAT, GitHub App tokens, GITHUB_TOKEN
 - Command: gh auth login
 - For GitHub App: use app ID and private RSA key (complete key with BEGIN and END lines)

2. GitHub CLI Usage:
 - Command: gh api /octocat --method GET
 - Additional usage: https://api.github.com/repos/octocat/Spoon-Knife/issues

3. GitHub CLI in GitHub Actions:
 - Environment variable set: GH_TOKEN from secrets (e.g., secrets.GITHUB_TOKEN)
 - YAML snippet includes runs-on: ubuntu-latest, permissions: issues: read
 - Steps include token generation via actions/create-github-app-token@v1 with inputs app-id and private-key

4. Octokit.js Usage:
 - Install: npm install octokit
 - Import: import { Octokit } from 'octokit'
 - Instance: const octokit = new Octokit({ auth: 'YOUR-TOKEN' });
 - Method call: await octokit.request('GET /repos/{owner}/{repo}/issues', { owner: 'octocat', repo: 'Spoon-Knife' });

5. Curl Command Usage:
 - Command:
   curl --request GET '
        --url 'https://api.github.com/repos/octocat/Spoon-Knife/issues' '
        --header 'Accept: application/vnd.github+json' '
        --header 'Authorization: Bearer YOUR-TOKEN'

6. API Versioning:
 - Header: X-GitHub-Api-Version:2022-11-28
 - Default: 2022-11-28 if header not provided
 - Upgrade instructions: Check changelog and update integration

7. Breaking Changes:
 - Changes include removal/renaming of endpoints, parameters, response fields;
 - Examples: Changes from optional to required parameters, enum modifications, and header additions.

## Original Source
GitHub REST API Documentation
https://docs.github.com/en/rest

## Digest of GITHUB_REST

# Overview

This document compiles the technical specifications and implementations for interacting with the GitHub REST API. It includes details on authentication, usage via GitHub CLI, Octokit.js integration, and curl command examples. It also covers API versioning and handling breaking changes.

# Authentication

Use personal access tokens, GitHub App tokens, or the built-in GITHUB_TOKEN for authentication. To authenticate on the command line with the GitHub CLI, run:

  gh auth login

For GitHub App authentication, generate an installation access token using your app's ID and a stored private key. Tokens expire after 60 minutes.

# GitHub CLI Usage

To make a REST API call with GitHub CLI:

  gh api /octocat --method GET

In GitHub Actions, set the GH_TOKEN environment variable with either GITHUB_TOKEN or an app-generated token. Example workflow snippet:

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

For GitHub App authentication, include a step to generate the token:

  - name: Generate token
    id: generate-token
    uses: actions/create-github-app-token@v1
    with:
      app-id: ${{ vars.APP_ID }}
      private-key: ${{ secrets.APP_PEM }}

# Octokit.js Usage

Install Octokit via npm (npm install octokit) and import in your JavaScript script:

  import { Octokit } from "octokit"

Create an instance:

  const octokit = new Octokit({ auth: 'YOUR-TOKEN' });

Make requests using:

  await octokit.request("GET /repos/{owner}/{repo}/issues", { owner: "octocat", repo: "Spoon-Knife" });

In GitHub Actions, use a workflow to checkout, setup node, install dependencies, and run your script that uses process.env.TOKEN.

# Curl Command Usage

For CLI users without GitHub CLI, use curl with authentication:

  curl --request GET \
       --url "https://api.github.com/repos/octocat/Spoon-Knife/issues" \
       --header "Accept: application/vnd.github+json" \
       --header "Authorization: Bearer YOUR-TOKEN"

Curl can also be used within GitHub Actions setting GH_TOKEN from secrets.

# API Versioning

Specify the desired API version using the X-GitHub-Api-Version header. Example:

  curl --header "X-GitHub-Api-Version:2022-11-28" https://api.github.com/zen

Requests without this header default to version 2022-11-28. Upgrading requires verifying breaking changes and updating integration tests.

# Breaking Changes

Breaking changes include removal or renaming of operations, parameters, or response fields; introducing new required parameters; and changing response types. Non-breaking changes add optional parameters and new operations while retaining backward compatibility.

Content retrieved on: 2023-10-04

Attribution: Data obtained from crawling https://docs.github.com/en/rest with data size 635253 bytes.

## Attribution
- Source: GitHub REST API Documentation
- URL: https://docs.github.com/en/rest
- License: License: Not explicitly stated; refer to GitHub's documentation terms
- Crawl Date: 2025-05-01T22:48:35.192Z
- Data Size: 635253 bytes
- Links Found: 9646

## Retrieved
2025-05-01
