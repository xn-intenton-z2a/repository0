# GITHUB_CLI

## Crawl Summary
Commands for installing, configuring, and utilizing GitHub CLI are detailed with exact command syntaxes. Authentication is performed via 'gh auth login' with environment variable overrides (GITHUB_TOKEN, GH_HOST, GH_ENTERPRISE_TOKEN). Complete command examples include 'gh issue list', 'gh pr checkout', and API interactions via 'gh api' with flags for method, headers, and pagination. Detailed alias management commands and attestations commands (download, trusted-root, verify) are specified with their available options.

## Normalised Extract
## Table of Contents
1. Installation
2. Configuration
3. GitHub Enterprise
4. Core Commands
5. Aliases
6. GitHub API
7. Attestation Commands

---

### 1. Installation
- Command: `brew install gh`
- Options: Download links provided for Mac, Windows, Linux
- Reference: README for complete instructions

### 2. Configuration
- Authentication: `gh auth login`
  - Uses GITHUB_TOKEN if provided
- Set Editor: `gh config set editor <editor>`
- Alias Declaration: `gh alias set <alias> <command>`

### 3. GitHub Enterprise
- Login with hostname: `gh auth login --hostname <hostname>`
- Set default host: `export GH_HOST=<hostname>`
- For automation: `export GH_ENTERPRISE_TOKEN=<access-token>`

### 4. Core Commands
- List Issues: `gh issue list`
- PR Status: `gh pr status`
- Checkout PR: `gh pr checkout <number>`
- Create PR: `gh pr create`
- Create Release: `gh release create <tag>`
- Repository View: `gh repo view`

### 5. Aliases
- Set Alias: `gh alias set bugs 'issue list --label="bugs"'`
- List Aliases: `gh alias list` (or `gh alias ls`)
- Delete Alias: `gh alias delete <alias> | --all`
- Import from YAML: `gh alias import <file>`

### 6. GitHub API
- Base command: `gh api <endpoint> [flags]`
- Example: `gh api repos/{owner}/{repo}/releases`
- Flags:
  - `-f key=value` for parameters (automatic POST if provided)
  - `--raw-field key=value` for string fields
  - `-H 'Header:Value'` to add HTTP headers
  - `-X <method>` to override HTTP method
  - `--paginate` and `--slurp` for handling paginated responses
  - GraphQL: `gh api graphql -f query='query(...)'`

### 7. Attestation Commands
- Download: `gh attestation download [<file>|oci://<image-uri>] [--owner | --repo]`
- Trusted Root: `gh attestation trusted-root [--tuf-url <url>] [--tuf-root <file-path>] [--verify-only]`
- Verify: `gh attestation verify [<file>|oci://<image-uri>] [--owner | --repo]`

## Supplementary Details
### Detailed Technical Specifications and Configuration Options

1. Authentication & Configuration:
   - Command: `gh auth login`
     - No parameters required for basic login; supports GITHUB_TOKEN environment variable.
   - Set Editor: `gh config set editor <editor>`
     - <editor>: String representing the preferred text editor (e.g., vim, nano, code)
   - Aliases: `gh alias set <alias> <expansion> [flags]`
     - Flag: `--clobber` to overwrite existing alias
     - Flag: `--shell` to declare a shell alias

2. GitHub Enterprise Configuration:
   - Command: `gh auth login --hostname <hostname>`
     - <hostname>: GitHub Enterprise server domain
   - Environment variable: `export GH_HOST=<hostname>`
   - Scripting Token: `export GH_ENTERPRISE_TOKEN=<access-token>`

3. GitHub API Commands Detailed Options:
   - Basic structure: `gh api <endpoint> [flags]`
   - Options:
     - `-f key=value`: Adds typed parameter (automatically converts literals like true, false, null, numbers)
     - `--raw-field key=value`: Sends the parameter as a raw string
     - `-H 'Header:Value'`: Adds custom HTTP header
     - `-X <method>`: Specifies HTTP method (default: GET; auto-switches to POST if params provided)
     - `--paginate`: Fetch all pages sequentially
     - `--slurp`: Wraps paginated JSON results into an array
   - Example for Nested Parameters:
     - `gh api gists -F 'files[myfile.txt][content]=@myfile.txt'`

4. Aliases Technical Details:
   - Setting an Alias:
     - Command: `gh alias set bugs 'issue list --label="bugs"'`
     - Example with positional placeholders: `gh alias set epicsBy 'issue list --author="$1" --label="epic"'`
   - Import Aliases:
     - Command: `gh alias import <filename>` or use `-` for standard input
   - Listing Aliases:
     - Command: `gh alias list` or `gh alias ls`

5. Attestation Commands Options:
   - Download:
     - Command: `gh attestation download [<file>|oci://<image-uri>] [--owner | --repo]`
     - Options:
       - `-d, --digest-alg <string>` (default "sha256")
       - `-L, --limit <int>` (default 30)
       - `-o, --owner <string>` and `-R, --repo <string>` to specify context
   - Trusted Root:
     - Command: `gh attestation trusted-root [--tuf-url <url>] [--tuf-root <file-path>] [--verify-only]`
   - Verification:
     - Command: `gh attestation verify [<file>|oci://<image-uri>] [--owner | --repo]`
     - Can use `--predicate-type` to set expected predicate type (default: slsa.dev/provenance/v1)

**Implementation Steps:**
- Ensure proper environment variables (GITHUB_TOKEN, GH_HOST, GH_ENTERPRISE_TOKEN) before authentication
- Use precise command-line flags as specified; incorrect flag usage may lead to unexpected HTTP methods or results
- Follow nested parameters and file input guidelines for proper API payload constructions

**Configuration Effects:**
- Using `--shell` with alias commands causes the expansion to be evaluated by sh interpreter
- Setting pagination flags affects API responses by collecting multiple pages
- Environment variables override local configuration within CLI commands

## Reference Details
### Complete API and Command Specifications

#### gh auth login
- **Signature:** `gh auth login [flags]`
- **Description:** Authenticates the user with GitHub using either interactive login or environment variables.
- **Flags:**
  - No explicit parameters, but respects environment variable GITHUB_TOKEN

#### gh config set editor
- **Signature:** `gh config set editor <editor>`
- **Parameters:**
  - `<editor>` (string): The name of the preferred text editor (e.g., vim, nano, code)

#### gh alias set
- **Signature:** `gh alias set <alias> <expansion> [flags]`
- **Parameters:**
  - `<alias>` (string): The shortcut name for the command
  - `<expansion>` (string): The full command expansion that will be executed
- **Flags:**
  - `--clobber`: Overwrite existing alias
  - `-s, --shell`: Interpret expansion as a shell command
- **Example:**
  // Setting a simple alias for issues labeled as bugs
  $ gh alias set bugs 'issue list --label="bugs"'
  $ gh bugs

#### gh api
- **Signature:** `gh api <endpoint> [flags]`
- **Parameters:**
  - `<endpoint>` (string): API endpoint. Example: `repos/{owner}/{repo}/releases`, or `graphql` for GraphQL queries.
- **Flags and Options:**
  - `-f, --field <key=value>`: Adds a typed parameter (supports conversion of booleans, numbers, etc.)
  - `--raw-field <key=value>`: Sends the parameter as a raw string
  - `-H, --header <key:value>`: Adds HTTP header (e.g., `-H 'Accept: application/vnd.github.v3.raw+json'`)
  - `-X, --method <string>`: HTTP method (default "GET", auto switches to POST with parameters)
  - `--paginate`: Requests additional pages (requires appropriate GraphQL variables for pagination)
  - `--slurp`: Wrap paginated JSON responses into an array
  - `-q, --jq <string>`: Filter the JSON output with jq syntax
- **Example:**
  # List releases
  $ gh api repos/{owner}/{repo}/releases

#### gh attestation download
- **Signature:** `gh attestation download [<file-path> | oci://<image-uri>] [--owner | --repo] [flags]`
- **Parameters and Flags:**
  - `-d, --digest-alg <string>`: Digest algorithm (default "sha256")
  - `-L, --limit <int>`: Maximum number of attestations (default 30)
  - `-o, --owner <string>`: GitHub organization
  - `-R, --repo <string>`: Repository name in the format <owner>/<repo>
- **Example:**
  $ gh attestation download example.bin -o github

#### Troubleshooting Commands
- **Check Command Output:**
  - For PR checkout: Verify branch switch output and updated README modifications.
  - For API commands: Use `--verbose` to include full HTTP request and response details for debugging.

#### Full Code Example Combining Commands:
```bash
# Authenticate and set editor
export GITHUB_TOKEN=your_token_here
gh auth login

gh config set editor vim

# Create an alias and use it
gh alias set pv 'pr view'
gh pv -w 123  # Invokes: gh pr view -w 123

# Query GitHub API for releases
gh api repos/{owner}/{repo}/releases -H 'Accept: application/vnd.github.v3+json'

# Download attestations for an artifact
gh attestation download oci://example.com/foo/bar:latest -o github
```

This complete specification includes all parameters, flags, and concrete examples needed to implement and troubleshoot GitHub CLI operations directly.

## Original Source
GitHub CLI Documentation
https://cli.github.com/manual

## Digest of GITHUB_CLI

# GitHub CLI Manual

**Retrieved:** 2023-10-27

## Installation
- Install using Homebrew: `brew install gh`
- Download for Mac, Windows, or install for Linux
- Refer to README for detailed installation instructions

## Configuration
- Authenticate: `gh auth login` (supports GITHUB_TOKEN environment variable)
- Set default editor: `gh config set editor <editor>`
- Define aliases: `gh alias set <alias> <expansion>`

## GitHub Enterprise
- Authenticate with custom hostname: `gh auth login --hostname <hostname>`
- Set default host: `export GH_HOST=<hostname>`
- For scripting: `export GH_ENTERPRISE_TOKEN=<access-token>`

## Core Commands & Examples
- Listing issues: `gh issue list`
- Checking PR status: `gh pr status`
- Checkout a pull request: `gh pr checkout 12`
- Create pull requests: `gh pr create`
- Create releases: `gh release create 1.0`
- Viewing repository details: `gh repo view`

## Aliases
- Create alias for commands:
  - Example: `gh alias set bugs 'issue list --label="bugs"'`
  - List existing aliases: `gh alias list`
  - Delete alias: `gh alias delete {alias} | --all`
  - Import aliases from YAML: `gh alias import aliases.yml`

## GitHub API (gh api)
- Make authenticated requests:
  - General form: `gh api <endpoint> [flags]`
  - Example: List releases: `gh api repos/{owner}/{repo}/releases`
- Parameters via flags:
  - Static parameters: `-f key=value` or `--raw-field key=value`
  - HTTP headers: `-H 'Key:Value'`
  - Custom method: `-X POST` (or GET by default)
  - Support for pagination: `--paginate` and `--slurp`
- GraphQL support via endpoint: `gh api graphql -f query='...'`

## Attestation Commands
- Download attestations: `gh attestation download [<file>|oci://<image-uri>] [--owner | --repo]`
- Trusted root retrieval: `gh attestation trusted-root [--tuf-url <url>] [--tuf-root <file-path>] [--verify-only]`
- Verify attestations: `gh attestation verify [<file>|oci://<image-uri>] [--owner | --repo]`

**Attribution:** Crawled content size: 415402 bytes, 36824 links found.

## Attribution
- Source: GitHub CLI Documentation
- URL: https://cli.github.com/manual
- License: License: Various (GitHub proprietary)
- Crawl Date: 2025-04-22T01:04:16.511Z
- Data Size: 415402 bytes
- Links Found: 36824

## Retrieved
2025-04-22
