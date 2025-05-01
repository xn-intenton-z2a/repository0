# GITHUB_API

## Crawl Summary
Provides technical specifications for GitHub REST API usage including authentication (CLI, Octokit.js, curl), API versioning via the X-GitHub-Api-Version header, handling breaking changes, and GitHub App token generation. Includes exact command examples and code snippets for immediate implementation.

## Normalised Extract
Table of Contents:
1. GitHub CLI Usage
2. Octokit.js Implementation
3. Curl Command Examples
4. API Versioning and Breaking Changes
5. GitHub App Authentication

1. GitHub CLI Usage:
- Install GitHub CLI on macOS, Windows, or Linux.
- Command: gh auth login; then follow on-screen prompts for authentication.
- API Usage: gh api /octocat --method GET; in actions, set GH_TOKEN from GITHUB_TOKEN.

2. Octokit.js Implementation:
- Install via npm install octokit.
- Import using: import { Octokit } from 'octokit'.
- Create instance: new Octokit({ auth: 'YOUR-TOKEN' }).
- Request pattern: octokit.request('GET /repos/{owner}/{repo}/issues', { owner: 'octocat', repo: 'Spoon-Knife' }).

3. Curl Command Examples:
- Structure: curl --request GET --url "https://api.github.com/repos/octocat/Spoon-Knife/issues" --header "Accept: application/vnd.github+json" --header "Authorization: Bearer YOUR-TOKEN".

4. API Versioning and Breaking Changes:
- Specify API version: add header X-GitHub-Api-Version:2022-11-28.
- Breaking changes include removal or renaming of parameters, addition of new required parameters, and data type changes.

5. GitHub App Authentication:
- Use actions/create-github-app-token@v1 in GitHub Actions.
- Provide app-id and private-key as inputs (APP_ID and APP_PEM).
- Example workflow steps include token generation and subsequent API calls using the generated token.


## Supplementary Details
GitHub CLI Details:
- Command: gh auth login
- API invocation: gh api /octocat --method GET
- Environment variable in Actions: GH_TOKEN set to GITHUB_TOKEN

Octokit.js Specifications:
- npm install octokit
- Import: import { Octokit } from 'octokit'
- SDK Initialization: new Octokit({ auth: 'YOUR-TOKEN' })
- API Method: octokit.request(method: string, parameters: {owner: string, repo: string}) returning Promise<Response>

Curl Usage:
- Full command: curl --request GET --url "https://api.github.com/repos/octocat/Spoon-Knife/issues" --header "Accept: application/vnd.github+json" --header "Authorization: Bearer YOUR-TOKEN"

API Versioning:
- Use header X-GitHub-Api-Version with value 2022-11-28
- Requests without this header default to 2022-11-28
- Future versions may introduce breaking changes (e.g., parameter renaming, removal, additional required parameters)

GitHub App Token Generation in Actions:
- Use action: actions/create-github-app-token@v1
- Inputs: app-id (from configuration variable APP_ID), private-key (secret APP_PEM)
- Token expires after 60 minutes

Troubleshooting:
- For authentication failures, verify token validity and correct usage of GH_TOKEN.
- Use gh auth status and curl --verbose for debug output.


## Reference Details
Complete API Specifications:
GitHub CLI:
  Command: gh auth login (interactive authentication)
  API Request Example: gh api /octocat --method GET returns JSON data from the specified endpoint.

Octokit.js Methods:
  Import: import { Octokit } from 'octokit';
  Constructor: new Octokit({ auth: 'YOUR-TOKEN' });
  API Request: octokit.request('GET /repos/{owner}/{repo}/issues', { owner: 'octocat', repo: 'Spoon-Knife' })
    Parameters:
      owner: string - Repository owner
      repo: string - Repository name
    Return: Promise<Response> where Response.data contains issue details.

Curl Commands:
  Syntax: curl --request GET --url "https://api.github.com/repos/{owner}/{repo}/issues" --header "Accept: application/vnd.github+json" --header "Authorization: Bearer YOUR-TOKEN"
  Replace {owner} and {repo} with actual repository identifiers.

API Versioning:
  Header: X-GitHub-Api-Version
  Value Example: 2022-11-28
  Effect: Determines API version; missing header defaults to 2022-11-28. Unsupported versions return HTTP 400.

GitHub App Authentication in Actions:
  Action: actions/create-github-app-token@v1
  Inputs:
    app-id: string (configuration variable APP_ID)
    private-key: string (secret APP_PEM including header and footer lines of RSA private key)
  Usage: Generate token step in workflow; token used in subsequent API calls.

Troubleshooting Procedures:
  - Check authentication: Run gh auth status; verify GitHub CLI token.
  - Debug curl: Use curl --verbose to inspect headers and responses.
  - API version errors: Confirm header X-GitHub-Api-Version is correctly set.
  - For Octokit.js issues, log error.status and error.response.data.message.

Concrete Best Practices:
  - Always secure tokens using secrets in GitHub Actions.
  - Prefer built-in GITHUB_TOKEN over personal access tokens when possible.
  - Use latest CLI and SDK versions to leverage updated API features.
  - Regularly check GitHub REST API changelog for breaking changes.


## Information Dense Extract
gh auth login; gh api /octocat --method GET; npm install octokit; import { Octokit } from 'octokit'; new Octokit({ auth: 'YOUR-TOKEN' }); octokit.request('GET /repos/{owner}/{repo}/issues', {owner: 'octocat', repo: 'Spoon-Knife'}); curl --request GET --url 'https://api.github.com/repos/octocat/Spoon-Knife/issues' --header 'Accept: application/vnd.github+json' --header 'Authorization: Bearer YOUR-TOKEN'; X-GitHub-Api-Version:2022-11-28; breaking changes: parameter removal/renaming, new mandatory parameters; GitHub App token via actions/create-github-app-token@v1 with app-id and private-key; use gh auth status and curl --verbose for troubleshooting.

## Sanitised Extract
Table of Contents:
1. GitHub CLI Usage
2. Octokit.js Implementation
3. Curl Command Examples
4. API Versioning and Breaking Changes
5. GitHub App Authentication

1. GitHub CLI Usage:
- Install GitHub CLI on macOS, Windows, or Linux.
- Command: gh auth login; then follow on-screen prompts for authentication.
- API Usage: gh api /octocat --method GET; in actions, set GH_TOKEN from GITHUB_TOKEN.

2. Octokit.js Implementation:
- Install via npm install octokit.
- Import using: import { Octokit } from 'octokit'.
- Create instance: new Octokit({ auth: 'YOUR-TOKEN' }).
- Request pattern: octokit.request('GET /repos/{owner}/{repo}/issues', { owner: 'octocat', repo: 'Spoon-Knife' }).

3. Curl Command Examples:
- Structure: curl --request GET --url 'https://api.github.com/repos/octocat/Spoon-Knife/issues' --header 'Accept: application/vnd.github+json' --header 'Authorization: Bearer YOUR-TOKEN'.

4. API Versioning and Breaking Changes:
- Specify API version: add header X-GitHub-Api-Version:2022-11-28.
- Breaking changes include removal or renaming of parameters, addition of new required parameters, and data type changes.

5. GitHub App Authentication:
- Use actions/create-github-app-token@v1 in GitHub Actions.
- Provide app-id and private-key as inputs (APP_ID and APP_PEM).
- Example workflow steps include token generation and subsequent API calls using the generated token.

## Original Source
GitHub REST API Documentation
https://docs.github.com/en/rest

## Digest of GITHUB_API

# GitHub REST API Documentation

## Overview
The GitHub REST API enables creating integrations, retrieving data, and automating workflows. This document provides details on authentication methods, API versioning, endpoint usage, and examples using GitHub CLI, Octokit.js, and curl.

## Authentication and API Invocation
- GitHub CLI: Install via supported platforms. Authenticate using the command: gh auth login. API calls can be made using: gh api /octocat --method GET. In workflows, set GH_TOKEN with the GITHUB_TOKEN secret.

- Octokit.js: Install using npm install octokit. Import with: import { Octokit } from 'octokit'. Create an instance: new Octokit({ auth: 'YOUR-TOKEN' }). Make an API request with: 
  octokit.request('GET /repos/{owner}/{repo}/issues', { owner: 'octocat', repo: 'Spoon-Knife' }).

- curl: Make requests using the command:
  curl --request GET --url "https://api.github.com/repos/octocat/Spoon-Knife/issues" --header "Accept: application/vnd.github+json" --header "Authorization: Bearer YOUR-TOKEN"

## API Versioning and Breaking Changes
- Specify the API version by using the header: X-GitHub-Api-Version:2022-11-28. 
- Breaking changes include removals or renaming of parameters, and new required parameters. Additive changes are backward compatible.

## GitHub App Authentication
- For GitHub App authentication, use actions/create-github-app-token@v1 in GitHub Actions. Provide the app's ID and private key as configuration inputs (APP_ID and APP_PEM).

## Detailed Endpoint Usage
- Endpoints cover resources such as issues, checks, repositories, deployments, and more. Each endpoint has its own detailed specification regarding URL paths, HTTP methods, required parameters, and expected response fields.

## Troubleshooting and Best Practices
- Use gh auth status and curl --verbose to debug authentication issues.
- Ensure tokens are stored securely and regenerate tokens when necessary.
- Follow exact guidelines for API version header usage to prevent 400 errors from unsupported versions.

Content retrieved on 2023-10-05.
Data Size: 1325384 bytes. Attribution: GitHub REST API documentation.


## Attribution
- Source: GitHub REST API Documentation
- URL: https://docs.github.com/en/rest
- License: License: Not explicitly licensed but follows GitHub's documentation usage policies
- Crawl Date: 2025-05-01T21:05:28.811Z
- Data Size: 1325384 bytes
- Links Found: 13100

## Retrieved
2025-05-01
