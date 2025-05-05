# API_VERSIONING

## Crawl Summary
Versions named by release date (YYYY-MM-DD). Use header X-GitHub-Api-Version:<date>. Default version if header missing: 2022-11-28. Unsupported/expired versions yield 400. Breaking changes only in new versions; additive changes in all. Upgrade process: read changelog, set header, implement changes, test. Supported versions list available via metadata endpoint.

## Normalised Extract
Table of Contents:
 1. Version Naming and Semantics
 2. Header Usage
 3. Default and Supported Versions
 4. Upgrade Workflow

1. Version Naming and Semantics
 • Format: YYYY-MM-DD (e.g., 2022-11-28)
 • Breaking change criteria: operation removal, parameter renaming/removal, new required parameters, type changes, auth changes

2. Header Usage
 • Header: X-GitHub-Api-Version: YYYY-MM-DD
 • Default if omitted: 2022-11-28

3. Default and Supported Versions
 • Default: 2022-11-28
 • Supported list via GET /meta (OpenAPI)
 • Expired or invalid version → HTTP 400 Bad Request, response: {"message":"Unsupported API version"}

4. Upgrade Workflow
 • Step 1: Review breaking changes in changelog for target date
 • Step 2: Modify client to include new version header
 • Step 3: Update request and response handling per new spec
 • Step 4: Execute full test suite against live API

## Supplementary Details
• Changelog URL pattern: https://docs.github.com/rest/overview/api-changes#<version-date>
• Metadata endpoint: GET https://api.github.com/meta  returns supported API versions under field versions.rest
• Header injection examples:
   – GitHub CLI: gh api /zen --header "X-GitHub-Api-Version: 2022-11-28"
   – curl: curl --header "X-GitHub-Api-Version: 2022-11-28" https://api.github.com/zen
• SDK header support: include headers object in client config

## Reference Details
1. curl Usage:
   curl --request GET \
        --url "https://api.github.com/zen" \
        --header "Accept: application/vnd.github+json" \
        --header "Authorization: Bearer YOUR_TOKEN" \
        --header "X-GitHub-Api-Version: 2022-11-28"

2. Octokit (JavaScript/TypeScript):
   import { Octokit } from "octokit";
   const octokit = new Octokit({
     auth: 'YOUR_TOKEN',
     headers: { 'X-GitHub-Api-Version': '2022-11-28' }
   });

   async function getZen() {
     const response: OctokitResponse<string> = await octokit.request('GET /zen');
     console.log(response.data);
   }

3. @octokit/rest (Node.js):
   const { Octokit } = require('@octokit/rest');
   const client = new Octokit({
     auth: process.env.GH_TOKEN,
     userAgent: 'my-app v1.2.3',
     baseUrl: 'https://api.github.com',
     headers: { 'X-GitHub-Api-Version': '2022-11-28' }
   });
   client.request('GET /zen', {}).then(resp => console.log(resp.data));

4. Troubleshooting:
   • 400 Bad Request → verify version date string, check supported versions via /meta
   • 415 Unsupported Media Type → ensure Accept header set to application/vnd.github+json
   • Missing header → API defaults to 2022-11-28
   • To detect API version in response: check response headers X-GitHub-Api-Version

5. Best Practices:
   • Pin to specific version header per integration
   • Monitor changelog monthly for upcoming breaking changes
   • Automate header injection via client middleware

## Information Dense Extract
versioning:header:X-GitHub-Api-Version:YYYY-MM-DD;default:2022-11-28;supported:GET /meta→versions.rest;breaking:date-new-version only;additive:across all;invalid→HTTP400;examples:curl,gh,Octokit headers;upgrade:read-changelog→set-header→update-handler→test;troubleshoot:400→check-date;response-header:X-GitHub-Api-Version

## Sanitised Extract
Table of Contents:
 1. Version Naming and Semantics
 2. Header Usage
 3. Default and Supported Versions
 4. Upgrade Workflow

1. Version Naming and Semantics
  Format: YYYY-MM-DD (e.g., 2022-11-28)
  Breaking change criteria: operation removal, parameter renaming/removal, new required parameters, type changes, auth changes

2. Header Usage
  Header: X-GitHub-Api-Version: YYYY-MM-DD
  Default if omitted: 2022-11-28

3. Default and Supported Versions
  Default: 2022-11-28
  Supported list via GET /meta (OpenAPI)
  Expired or invalid version  HTTP 400 Bad Request, response: {'message':'Unsupported API version'}

4. Upgrade Workflow
  Step 1: Review breaking changes in changelog for target date
  Step 2: Modify client to include new version header
  Step 3: Update request and response handling per new spec
  Step 4: Execute full test suite against live API

## Original Source
GitHub REST API Reference
https://docs.github.com/en/rest

## Digest of API_VERSIONING

# API Versioning

**Source:** GitHub REST API Reference (https://docs.github.com/en/rest)
**Retrieved:** 2024-06-20
**Data Size:** 1823013 bytes, **Links Found:** 15001

## About API Versioning

• The GitHub REST API is versioned by release date in form YYYY-MM-DD.
• Breaking changes are released only in new versions.
  – Removing or renaming operations, parameters, response fields
  – Adding new required parameters or validation rules
  – Changing types of parameters or response fields
  – Changing authentication/authorization requirements
• Additive changes (non-breaking) appear across all supported versions.
  – New operations, optional parameters or headers, response fields, enum values

## Specifying an API Version

• Use request header X-GitHub-Api-Version: <version-date>
• Example:
  curl --header "X-GitHub-Api-Version: 2022-11-28" https://api.github.com/zen
• Requests without header default to version 2022-11-28
• Unsupported or expired versions return HTTP 400 Bad Request

## Upgrading to a New API Version

1. Read changelog of breaking changes for target version
2. Update integrations: include header X-GitHub-Api-Version:<new-date>
3. Implement required changes for breaking changes
4. Test end-to-end workflows against new version

## Supported API Versions

• 2022-11-28 (current default)
• Use endpoint GET /meta to list supported versions via OpenAPI metadata

## Attribution
- Source: GitHub REST API Reference
- URL: https://docs.github.com/en/rest
- License: Creative Commons Attribution 4.0 International (CC BY 4.0)
- Crawl Date: 2025-05-05T15:41:52.986Z
- Data Size: 1823013 bytes
- Links Found: 15001

## Retrieved
2025-05-05
