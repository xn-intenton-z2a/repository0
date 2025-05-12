# GH_ACTIONS_VARIABLES

## Crawl Summary
Variables interpolated on runner; set env at workflow/job/step; configuration vars via UI or REST at org/repo/env; precedence: env>repo>org; naming: alphanumeric/underscore, no GITHUB_/digit, case-insensitive; limits: 48 KB per var, 500 repo/100 env/1 000 org, 256 KB combined; access via env and vars contexts; runner shell syntax: $NAME or $env:NAME; default GITHUB_* and RUNNER_* out of override; use runner.os in conditions; pass values in-job via $GITHUB_ENV, between-jobs via outputs.

## Normalised Extract
Table of Contents:
1 Environment Variables
2 Configuration Variables
3 Scoping and Precedence
4 Naming Rules
5 Size and Count Limits
6 Context Access Patterns
7 Shell Syntax per OS
8 Default Variables
9 OS Detection
10 Passing Data Between Steps and Jobs

1 Environment Variables
Use `env:` key in workflow, job, or step block. Example:
  env: { VAR_NAME: "value" }

2 Configuration Variables
UI: Settings→Secrets and variables→Actions→Variables. REST API: POST/GET/PUT/DELETE /repos/{owner}/{repo}/actions/variables.{ name:string; value:string; }

3 Scoping and Precedence
Lowest-level wins: Environment > Repository > Organization. Reusable workflows use caller repo variables.

4 Naming Rules
Pattern: ^[A-Za-z_][A-Za-z0-9_]*$. Disallow GITHUB_ prefix, no leading digit, case-insensitive uniqueness.

5 Size and Count Limits
Single var ≤48 KB. Repo ≤500 vars; org ≤1 000; env ≤100. Repo+org total ≤256 KB per run. Env-level excluded from total.

6 Context Access Patterns
- In runner commands: use shell syntax `$VAR` or `$env:VAR`.
- In workflow metadata/conditionals: use `${{ env.VAR }}` or `${{ vars.VAR }}`.

7 Shell Syntax per OS
Linux/macOS (bash): `$VAR`.
Windows (PowerShell): `$env:VAR`.

8 Default Variables
List includes CI, GITHUB_REPOSITORY, GITHUB_REF, GITHUB_SHA, GITHUB_RUN_ID, RUNNER_OS, RUNNER_TEMP, RUNNER_TOOL_CACHE.

9 OS Detection
Use `if: runner.os == 'Windows'` or `runner.os != 'Windows'`.

10 Passing Data Between Steps and Jobs
Within job: `echo "KEY=VALUE" >> $GITHUB_ENV` then `$KEY`. Between jobs: define step output: `id: set
 run: echo "::set-output name=key::value"`; reference `${{ needs.job.outputs.key }}`.

## Supplementary Details
Parameter values and defaults:
- env key scopes: workflow, jobs.<id>, steps[*]
- REST API JSON body for repo variables: { name:string, value:string }
- Precedence order: org(1000 vars) < repo(500) < env(100)
- Combined size limit repo+org: 256 KB; truncate alphabetical overflow
- Single variable max: 48 KB
- Context names: env and vars
- Shell default: bash on ubuntu-latest, PowerShell on windows-latest
Implementation steps:
1. Add env in workflow YAML under correct block.
2. Create configuration vars via UI or call Octokit:
   await octokit.actions.createOrUpdateRepoVariable({ owner, repo, name, value });
3. Access in steps: run: echo "${{ vars.NAME }}" or echo "$NAME".
4. For conditionals: if: ${{ env.VAR == 'value' }}.
5. Pass values: echo "NAME=value" >> $GITHUB_ENV for intra-job; use outputs for cross-job.
6. Detect OS: if: runner.os == 'Windows'.

UI creation steps:
- Repository: Settings→Secrets and variables→Actions→Variables→New repository variable
- Organization: Settings→Secrets and variables→Actions→Variables→New organization variable→select access policy
- Environment: Settings→Environments→Select env→Environment variables→Add variable

REST API endpoints:
- GET    /repos/{owner}/{repo}/actions/variables
- GET    /repos/{owner}/{repo}/actions/variables/{name}
- POST   /repos/{owner}/{repo}/actions/variables
- PUT    /repos/{owner}/{repo}/actions/variables/{name}
- DELETE /repos/{owner}/{repo}/actions/variables/{name}

Permissions: admin for org, owner for repo, collaborator for API.

## Reference Details
Octokit REST methods:
```js
// List repository variables
const { data } = await octokit.actions.listRepoVariables({ owner, repo });
// Create or update repository variable
await octokit.actions.createOrUpdateRepoVariable({ owner, repo, name: 'MY_VAR', value: 'my_value' });
// Get a single repository variable
const { data: variable } = await octokit.actions.getRepoVariable({ owner, repo, name: 'MY_VAR' });
// Delete repository variable
await octokit.actions.deleteRepoVariable({ owner, repo, name: 'MY_VAR' });
```
Request/Response schemas:
- POST/PUT /repos/{owner}/{repo}/actions/variables
  Request: { name: string, value: string }
  Response: 204 No Content
- GET /repos/{owner}/{repo}/actions/variables
  Response: { total_count: number, variables: [ { name:string, created_at:string, updated_at:string } ] }
- GET /repos/{owner}/{repo}/actions/variables/{name}
  Response: { name:string, value:string, ...metadata }

Workflow commands:
- Set env: echo "KEY=VALUE" >> $GITHUB_ENV
- Set output: echo "::set-output name=key::value"
- List all runner env: run: env

Best practices:
- Do not override GITHUB_* or RUNNER_*
- Use contexts in non-runner sections
- Mask secrets; variables are unmasked by default
- Use $GITHUB_ENV for intra-job data passing; outputs for inter-job

Troubleshooting:
- Verify var existence: run: env
- Confirm context usage: echo "${{ env.NAME }}"
- Shell syntax errors: ensure correct $NAME vs $env:NAME
- API errors: check HTTP status codes (401 unauthorized, 404 not found)
- Exceeded limits: 413 Payload Too Large; reduce variable sizes or use environment level

Expected outputs:
- GET repo variables returns JSON list
- POST returns 204
- Workflow run logs show variable values in runner steps


## Information Dense Extract
env scopes: workflow, job, step. YAML: env: {KEY:VALUE}. Configuration vars via UI or REST /repos/{owner}/{repo}/actions/variables. JSON body: {name:string,value:string}. Precedence: env>repo>org. Naming: ^[A-Za-z_][A-Za-z0-9_]*$, no GITHUB_ prefix. Limits: var≤48 KB; repo≤500; org≤1000; env≤100; repo+org≤256 KB. Access: run steps: bash($VAR)/PowerShell($env:VAR); metadata: ${{ env.VAR }} and ${{ vars.VAR }}. Default vars (CI, GITHUB_REPOSITORY, GITHUB_REF, RUNNER_OS, RUNNER_TEMP) immutable. OS detection: if: runner.os=='Windows'. Intra-job: echo "KEY=VALUE">>$GITHUB_ENV. Cross-job: ::set-output. Octokit: createOrUpdateRepoVariable({owner,repo,name,value}); listRepoVariables; getRepoVariable; deleteRepoVariable. Best practices: mask secrets; avoid overwriting defaults; use contexts pre-run; use appropriate shell syntax. Troubleshoot: run: env; check HTTP status codes; adjust sizes to limits.

## Sanitised Extract
Table of Contents:
1 Environment Variables
2 Configuration Variables
3 Scoping and Precedence
4 Naming Rules
5 Size and Count Limits
6 Context Access Patterns
7 Shell Syntax per OS
8 Default Variables
9 OS Detection
10 Passing Data Between Steps and Jobs

1 Environment Variables
Use 'env:' key in workflow, job, or step block. Example:
  env: { VAR_NAME: 'value' }

2 Configuration Variables
UI: SettingsSecrets and variablesActionsVariables. REST API: POST/GET/PUT/DELETE /repos/{owner}/{repo}/actions/variables.{ name:string; value:string; }

3 Scoping and Precedence
Lowest-level wins: Environment > Repository > Organization. Reusable workflows use caller repo variables.

4 Naming Rules
Pattern: ^[A-Za-z_][A-Za-z0-9_]*$. Disallow GITHUB_ prefix, no leading digit, case-insensitive uniqueness.

5 Size and Count Limits
Single var 48KB. Repo 500 vars; org 1000; env 100. Repo+org total 256KB per run. Env-level excluded from total.

6 Context Access Patterns
- In runner commands: use shell syntax '$VAR' or '$env:VAR'.
- In workflow metadata/conditionals: use '${{ env.VAR }}' or '${{ vars.VAR }}'.

7 Shell Syntax per OS
Linux/macOS (bash): '$VAR'.
Windows (PowerShell): '$env:VAR'.

8 Default Variables
List includes CI, GITHUB_REPOSITORY, GITHUB_REF, GITHUB_SHA, GITHUB_RUN_ID, RUNNER_OS, RUNNER_TEMP, RUNNER_TOOL_CACHE.

9 OS Detection
Use 'if: runner.os == 'Windows'' or 'runner.os != 'Windows''.

10 Passing Data Between Steps and Jobs
Within job: 'echo 'KEY=VALUE' >> $GITHUB_ENV' then '$KEY'. Between jobs: define step output: 'id: set
 run: echo '::set-output name=key::value''; reference '${{ needs.job.outputs.key }}'.

## Original Source
GitHub Actions Environment Variables & Secrets
https://docs.github.com/en/actions/learn-github-actions/variables

## Digest of GH_ACTIONS_VARIABLES

# Variables

Variables provide a way to store and reuse non-sensitive configuration data in GitHub Actions workflows. They are interpolated on the runner and accessible by commands in actions or workflow steps. GitHub sets default environment variables per run; you can also set custom environment or configuration variables.

# Defining Environment Variables for a Single Workflow

Scope levels and syntax:

  • Workflow-level (top): env: { NAME: VALUE }
  • Job-level: jobs.<job_id>.env: { NAME: VALUE }
  • Step-level: jobs.<job_id>.steps[*].env: { NAME: VALUE }

YAML example:

```yaml
name: Greeting on variable day
on: workflow_dispatch

env:
  DAY_OF_WEEK: Monday

jobs:
  greeting_job:
    runs-on: ubuntu-latest
    env:
      Greeting: Hello
    steps:
      - name: Say Hello Mona
        run: echo "$Greeting $First_Name. Today is $DAY_OF_WEEK!"
        env:
          First_Name: Mona
```

# Defining Configuration Variables for Multiple Workflows

Configuration variables can be set at organization, repository or environment level via UI or REST API. They appear in the `vars` context.

UI steps (repository):

  1. Settings → Secrets and variables → Actions → Variables tab.
  2. Click New repository variable; enter Name, Value; Add variable.

REST API endpoints:

  • GET   /repos/{owner}/{repo}/actions/variables
  • POST  /repos/{owner}/{repo}/actions/variables
  • PUT   /repos/{owner}/{repo}/actions/variables/{name}
  • DELETE /repos/{owner}/{repo}/actions/variables/{name}

# Configuration Variable Precedence

Organization < Repository < Environment (lowest-level overrides higher-level). Reusable workflows use caller’s repo variables, not callee’s.

# Naming Conventions

  • Only alphanumeric or underscore; no spaces.
  • Must not start with GITHUB_ or digit.
  • Case-insensitive; unique per scope.

# Limits for Configuration Variables

  • Single variable max size: 48 KB.
  • Max 1 000 org variables; 500 repo; 100 environment.
  • Combined org+repo size ≤ 256 KB per run (alphabetical truncation if exceeded).
  • Environment-level variables excluded from 256 KB limit.

# Using Contexts to Access Values

  • `env` context for environment variables: ${{ env.NAME }}.
  • `vars` context for configuration variables: ${{ vars.NAME }}.
  • Runner env syntax in `run` steps: bash: `$NAME`; PowerShell: `$env:NAME`.
  • Non-runner sections (if, uses, with): only contexts.

# Default Environment Variables

GitHub sets ~60 GITHUB_* and RUNNER_* vars. Examples:

  • CI=true
  • GITHUB_REPOSITORY=owner/repo
  • GITHUB_REF=refs/heads/main
  • RUNNER_OS=Linux
  • RUNNER_TEMP=/home/runner/_temp

These cannot be overridden (except CI).

# Detecting the Operating System

Use `runner.os` context in `if` conditionals. Example:

```yaml
if: runner.os == 'Windows'
run: echo "OS is $env:RUNNER_OS"
```

# Passing Values Between Steps and Jobs

  • Within a job: write `echo "NAME=VALUE" >> $GITHUB_ENV` then use $NAME.
  • Between jobs: declare outputs: `outputs: { KEY: ${{ steps.step_id.outputs.KEY }}}` and reference via `${{ needs.job_id.outputs.KEY }}`.

---

*Retrieved: 2024-06-15*  
*Attribution: docs.github.com/le ... /variables*  
*Data size: 716856 bytes*

## Attribution
- Source: GitHub Actions Environment Variables & Secrets
- URL: https://docs.github.com/en/actions/learn-github-actions/variables
- License: License: CC BY 4.0
- Crawl Date: 2025-05-12T18:30:36.208Z
- Data Size: 716856 bytes
- Links Found: 11461

## Retrieved
2025-05-12
