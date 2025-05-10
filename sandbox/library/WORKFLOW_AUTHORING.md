# WORKFLOW_AUTHORING

## Crawl Summary
Defines YAML schema for GitHub Actions workflows: top-level keys (name, on, concurrency, permissions, env, defaults), job definitions (runs-on, needs, if, timeout-minutes, strategy, env, steps), step definitions (uses, run, with, shell, env, if, timeout-minutes), action inputs for checkout, setup-node, cache, triggers configuration for push, pull_request, schedule, workflow_dispatch, workflow_call, runners labels (GitHub-hosted and self-hosted), advanced patterns (matrix, caching, services, container, concurrency, environments, permissions, reusable workflows), and CLI/API commands for troubleshooting and logs retrieval.

## Normalised Extract
Table of Contents
1 Workflow File Structure
2 Triggers Configuration
3 Job Definition
4 Step Definition
5 Actions Usage
6 Runners Configuration
7 Matrix Builds
8 Caching Dependencies
9 Service Containers
10 Concurrency
11 Permissions
12 Reusable Workflows
13 Environments
14 Troubleshooting Workflows

1 Workflow File Structure
name: string   # Workflow identifier
env: map<string,string>   # Global environment variables
defaults:
  run:
    shell: string
    working-directory: string
concurrency:
  group: string
  cancel-in-progress: boolean
permissions:
  contents: read|write|none
  id-token: write|read|none

2 Triggers Configuration
on:
  push:
    branches: [string]
    tags: [string]
    paths: [string]
  pull_request:
    branches: [string]
    types: [opened,reopened,synchronize,closed]
  schedule:
    - cron: string
  workflow_dispatch:
    inputs:
      name:
        description: string
        required: boolean
        default: string
  workflow_call:
    inputs:
      key:
        required: boolean
        type: string
        default: any
    secrets:
      SECRET_NAME:
        required: boolean
    outputs:
      output_name:
        description: string

3 Job Definition
jobs:
  job_id:
    runs-on: string|array<string>
    needs: string|array<string>
    if: expression
    timeout-minutes: integer
    strategy:
      matrix:
        var1: [values]
      fail-fast: boolean
      max-parallel: integer
    env: map<string,string>
    defaults: inherited defaults or overrides
    steps: array<Step>

4 Step Definition
- name: string
  id: string
  uses: string   # owner/repo@ref or ./path
  with: map<string,any>
  run: string
  shell: string or map{name:string,options:string}
  env: map<string,string>
  if: expression
  timeout-minutes: integer
  continue-on-error: boolean

5 Actions Usage
actions/checkout@v4:
  with:
    repository: string
    ref: string
    token: string
    fetch-depth: number
    submodules: boolean
actions/setup-node@v4:
  with:
    node-version: string|number
    check-latest: boolean
actions/cache@v4:
  with:
    path: string|array
    key: string
    restore-keys: string|array

6 Runners Configuration
runs-on: ubuntu-latest|ubuntu-22.04|windows-latest|macos-latest|self-hosted|[labels]

7 Matrix Builds
strategy:
  matrix:
    os: [ubuntu-latest,windows-latest]
    node: [14,16]
  fail-fast: boolean
  max-parallel: integer

8 Caching Dependencies
uses: actions/cache@v4
with:
  path: string|array
  key: string
  restore-keys: array|string

9 Service Containers
services:
  name:
    image: string
    ports: ["host:container"]
    env: map<string,string>
    options: string
container:
  image: string
  credentials:
    username: string
    password: string

10 Concurrency
concurrency:
  group: string
  cancel-in-progress: boolean

11 Permissions
env-level permissions map:
  contents: read|write|none
  id-token: write|read|none
  actions: read|write

12 Reusable Workflows
uses: owner/repo/.github/workflows/file.yml@ref
with: map<string,any>
secrets: map<string,required:boolean>
inputs: map<string,{required:boolean,type:string,default:any}>
outputs: map<string,{description:string}>

13 Environments
environment: string
deployment_branch_policy:
  branches: [string]

14 Troubleshooting Workflows
CLI:
  gh run list --repo owner/repo --limit n
  gh run view <run-id> --log
  gh run cancel <run-id>
  gh run rerun <run-id>
API:
  GET  /repos/{owner}/{repo}/actions/runs/{run_id}/logs
  POST /repos/{owner}/{repo}/actions/runs/{run_id}/cancel
  POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun

## Supplementary Details
YAML Schema Details
- File path: .github/workflows/*.yml
- Shells supported: bash, sh, pwsh, python, cmd
- Max timeout-minutes per job: 360
- Default permissions on GITHUB_TOKEN: contents: read, id-token: none
- Valid runner labels: ubuntu-latest, ubuntu-22.04, windows-latest, macos-latest, self-hosted
- Matrix variables can be any string or number
- Default strategy.fail-fast: true
- Default restore-keys behavior: prefix match
- Cron format: POSIX (minute hour day month weekday)
- workflow_dispatch inputs: types: string, boolean, environment, number
- workflow_call inputs types: string, boolean, number, environment
- services default restart policy: no
- container credentials fields required for private registries
- permissions levels cascade from workflow to job to step
- environment protection: configured under repository settings
- Common exit codes: 0 (success), non-zero for failures
- Recommended practice: pin action versions using @v tag, not @main


## Reference Details
GitHub Actions Workflow File Schema
Path: .github/workflows/<name>.yml
Top-Level Keys:
- name: string
- run-name: string
- on: string|array|map
- concurrency: map { group: string, cancel-in-progress: boolean }
- permissions: map<string, string>
- env: map<string, string>
- defaults: map { run: { shell: string, working-directory: string } }
- jobs: map<string, Job>

Job Object:
- runs-on: string|array<string>
- needs: string|array<string>
- if: expression
- timeout-minutes: integer (0-360)
- strategy: map { matrix: map<string,array>, fail-fast: boolean, max-parallel: integer }
- env: map<string,string>
- defaults: map same as top-level
d - steps: array<Step>

Step Object (one of uses or run required):
- name: string
- id: string
- uses: string (owner/repo@ref or ./path)
- with: map<string,any>
- run: string
- shell: string or map { name: string, options: string }
- env: map<string,string>
- if: expression
- timeout-minutes: integer
- continue-on-error: boolean

REST API Endpoints:
List workflow runs
GET /repos/{owner}/{repo}/actions/runs
Parameters:
  per_page: integer (1-100)
  page: integer
Response: 200 OK, { total_count: integer, workflow_runs: [WorkflowRun] }

Get a single workflow run
GET /repos/{owner}/{repo}/actions/runs/{run_id}
Response: 200 OK, WorkflowRun

List jobs for a workflow run
GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs
Parameters: per_page, page
Response: 200 OK, { total_count: integer, jobs: [Job] }

Download workflow run logs
GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs
Response: 200 OK, application/zip

Cancel a workflow run
POST /repos/{owner}/{repo}/actions/runs/{run_id}/cancel
Response: 202 Accepted

Re-run a workflow run
POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun
Response: 201 Created

SDK Method Signatures (Octokit REST)
listWorkflowRunsForRepo(params: { owner: string; repo: string; per_page?: number; page?: number }): Promise<OctokitResponse<{ total_count: number; workflow_runs: WorkflowRun[] }>>
cancelWorkflowRun(params: { owner: string; repo: string; run_id: number }): Promise<OctokitResponse<{}>>
reRunWorkflow(params: { owner: string; repo: string; run_id: number }): Promise<OctokitResponse<{}>>
listJobsForWorkflowRun(params: { owner: string; repo: string; run_id: number; per_page?: number; page?: number }): Promise<OctokitResponse<{ total_count: number; jobs: Job[] }>>

typedefs:
WorkflowRun { id: number; name: string; node_id: string; head_branch: string; head_sha: string; path: string; run_number: number; event: string; status: 'queued'|'in_progress'|'completed'; conclusion: 'success'|'failure'|'cancelled'|'timed_out'|'action_required'|null; created_at: string; updated_at: string; jobs_url: string; logs_url: string; }
Job { id: number; run_id: number; status: string; conclusion: string; name: string; steps: StepSummary[]; }
StepSummary { name: string; number: number; status: string; conclusion: string; started_at: string; completed_at: string }

Best Practices:
- Pin actions to specific version tags.
- Use matrix builds for parallel variations.
- Cache dependencies with stable key including hash of lockfile.
- Define explicit permissions least privilege for GITHUB_TOKEN.
- Use environments with protection rules for deployments.
- Validate YAML syntax with yamllint.

Troubleshooting Commands:
- gh run list --limit 5
- gh run view <run-id> --log
- gh run cancel <run-id>
- gh run rerun <run-id>
- curl -H "Authorization: token $GITHUB_TOKEN" \  
      https://api.github.com/repos/{owner}/{repo}/actions/runs/{run_id}/jobs
Expected HTTP 200 with jobs list.


## Information Dense Extract
name:string;run-name:string;on:string|[string]|{push:{branches:[string],tags:[string],paths:[string]},pull_request:{branches:[string],types:[string]},schedule:[{cron:string}],workflow_dispatch:{inputs:{name:{desc:string,required:boolean,default:string}}},workflow_call:{inputs:{key:{required:boolean,type:string,default:any}},secrets:{S:boolean},outputs:{o:{desc:string}}}};concurrency:{group:string,cancel-in-progress:boolean};permissions:{contents:read|write|none,id-token:write|read|none,actions:read|write};env:{k:v};defaults:{run:{shell:string,working-directory:string}};jobs:{id:{runs-on:string|[string],needs:string|[string],if:expr,timeout-minutes:int,strategy:{matrix:{k:[v]},fail-fast:boolean,max-parallel:int},env:{k:v},steps:[{name:string,id:string,uses:string|./path,with:{k:v},run:string,shell:string|{name,options},env:{k:v},if:expr,timeout-minutes:int,continue-on-error:boolean}]}};actions/checkout@v4:with:{repository:string,ref:string,token:string,fetch-depth:number,submodules:boolean};actions/setup-node@v4:with:{node-version:string|number,check-latest:boolean};actions/cache@v4:with:{path:string|[string],key:string,restore-keys:string|[string]};runs-on labels:ubuntu-latest,windows-latest,macos-latest,self-hosted;matrix:strategy;services:{name:{image:string,ports:["host:container"],env:{k:v},options:string}};container:{image:string,credentials:{username:string,password:string}};reusable:uses:owner/repo/.github/workflows/file.yml@ref,with/secrets/inputs/outputs;REST:GET/repos/{owner}/{repo}/actions/runs?per_page,page;GET/repos/{owner}/{repo}/actions/runs/{run_id}/jobs;GET/.../logs;POST/.../cancel;POST/.../rerun;SDK:octokit.actions.listWorkflowRunsForRepo({owner,repo,per_page?,page?});cancelWorkflowRun({owner,repo,run_id});reRunWorkflow({owner,repo,run_id});listJobsForWorkflowRun({owner,repo,run_id,per_page?,page?})

## Sanitised Extract
Table of Contents
1 Workflow File Structure
2 Triggers Configuration
3 Job Definition
4 Step Definition
5 Actions Usage
6 Runners Configuration
7 Matrix Builds
8 Caching Dependencies
9 Service Containers
10 Concurrency
11 Permissions
12 Reusable Workflows
13 Environments
14 Troubleshooting Workflows

1 Workflow File Structure
name: string   # Workflow identifier
env: map<string,string>   # Global environment variables
defaults:
  run:
    shell: string
    working-directory: string
concurrency:
  group: string
  cancel-in-progress: boolean
permissions:
  contents: read|write|none
  id-token: write|read|none

2 Triggers Configuration
on:
  push:
    branches: [string]
    tags: [string]
    paths: [string]
  pull_request:
    branches: [string]
    types: [opened,reopened,synchronize,closed]
  schedule:
    - cron: string
  workflow_dispatch:
    inputs:
      name:
        description: string
        required: boolean
        default: string
  workflow_call:
    inputs:
      key:
        required: boolean
        type: string
        default: any
    secrets:
      SECRET_NAME:
        required: boolean
    outputs:
      output_name:
        description: string

3 Job Definition
jobs:
  job_id:
    runs-on: string|array<string>
    needs: string|array<string>
    if: expression
    timeout-minutes: integer
    strategy:
      matrix:
        var1: [values]
      fail-fast: boolean
      max-parallel: integer
    env: map<string,string>
    defaults: inherited defaults or overrides
    steps: array<Step>

4 Step Definition
- name: string
  id: string
  uses: string   # owner/repo@ref or ./path
  with: map<string,any>
  run: string
  shell: string or map{name:string,options:string}
  env: map<string,string>
  if: expression
  timeout-minutes: integer
  continue-on-error: boolean

5 Actions Usage
actions/checkout@v4:
  with:
    repository: string
    ref: string
    token: string
    fetch-depth: number
    submodules: boolean
actions/setup-node@v4:
  with:
    node-version: string|number
    check-latest: boolean
actions/cache@v4:
  with:
    path: string|array
    key: string
    restore-keys: string|array

6 Runners Configuration
runs-on: ubuntu-latest|ubuntu-22.04|windows-latest|macos-latest|self-hosted|[labels]

7 Matrix Builds
strategy:
  matrix:
    os: [ubuntu-latest,windows-latest]
    node: [14,16]
  fail-fast: boolean
  max-parallel: integer

8 Caching Dependencies
uses: actions/cache@v4
with:
  path: string|array
  key: string
  restore-keys: array|string

9 Service Containers
services:
  name:
    image: string
    ports: ['host:container']
    env: map<string,string>
    options: string
container:
  image: string
  credentials:
    username: string
    password: string

10 Concurrency
concurrency:
  group: string
  cancel-in-progress: boolean

11 Permissions
env-level permissions map:
  contents: read|write|none
  id-token: write|read|none
  actions: read|write

12 Reusable Workflows
uses: owner/repo/.github/workflows/file.yml@ref
with: map<string,any>
secrets: map<string,required:boolean>
inputs: map<string,{required:boolean,type:string,default:any}>
outputs: map<string,{description:string}>

13 Environments
environment: string
deployment_branch_policy:
  branches: [string]

14 Troubleshooting Workflows
CLI:
  gh run list --repo owner/repo --limit n
  gh run view <run-id> --log
  gh run cancel <run-id>
  gh run rerun <run-id>
API:
  GET  /repos/{owner}/{repo}/actions/runs/{run_id}/logs
  POST /repos/{owner}/{repo}/actions/runs/{run_id}/cancel
  POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun

## Original Source
GitHub Actions Workflow Authoring
https://docs.github.com/en/actions

## Digest of WORKFLOW_AUTHORING

# Workflow Authoring

## Workflow File Location

Workflows are defined in .github/workflows directory with file extension .yml or .yaml.

## Top-Level Keys

### name
Type: string (optional)
Description: Human-readable identifier for the workflow.

### run-name
Type: string (optional)
Description: Custom name for the run displayed in UI; supports expressions (e.g., ${{ github.actor }}).

### on
Type: event name | array of events | map of event configurations
defaults: none

Valid values:
- push
- pull_request
- workflow_dispatch
- repository_dispatch
- schedule (cron)
- workflow_call
- issue_comment, issues, release, deployment, etc.

### concurrency
Type: map { group: string, cancel-in-progress: boolean }
Default: none
Description: Controls parallel runs in a group.

### permissions
Type: map<string, string>
Default: contents: read, id-token: none, actions: read

### env
Type: map<string, string>
Scope: global environment variables for all jobs.

### defaults
Type: map { run: { shell: string, working-directory: string } }

## Jobs

Jobs: map<job_id, Job>
job_id constraints: alphanumeric, - or _

### Job Properties

runs-on
Type: string or array<string>
Valid values: ubuntu-latest, ubuntu-22.04, windows-latest, macos-latest, self-hosted, [labels]

needs
Type: string or array<string>
Description: Job dependencies; jobs run sequentially if listed.

if
Type: expression

timeout-minutes
Type: integer (0–360)
Default: 360

strategy
Type: map { matrix: map<string, array>, fail-fast: boolean, max-parallel: integer }
Default: fail-fast: true, max-parallel: all

env
Type: map<string, string> (job-level overrides)

defaults
Inherited defaults or job-specific overrides.

steps
Type: array<Step>

## Steps

Step: map with one of uses or run plus optional keys: name, id, shell, env, with, if, timeout-minutes, continue-on-error

### uses
Type: string
Format: <owner>/<repo>@<ref> or ./path

### run
Type: string
Executes shell script or multiline commands.

### with
Type: map<string, any>
Action inputs.

### shell
Type: string or map{name: string, options: string}
Valid shells: bash, sh, pwsh, python, cmd

### env
Type: map<string, string>

### continue-on-error
Type: boolean
Default: false

### if
Type: expression

### timeout-minutes
Type: integer
Default: inherits job timeout

## Actions Usage

### actions/checkout@v4
with:
  repository: string (default: github.repository)
  ref: string (default: github.ref)
  token: string (default: secrets.GITHUB_TOKEN)
  fetch-depth: number (default: 1)
  submodules: boolean (default: false)

### actions/setup-node@v4
with:
  node-version: string or number (required)
  check-latest: boolean (default: false)

### actions/cache@v4
with:
  path: string | array<string> (required)
  key: string (required)
  restore-keys: string | array<string> (optional)

## Triggers Configuration

### push
branches, branches-ignore, tags, tags-ignore, paths, paths-ignore, types: [created, deleted, edited]

### pull_request
branches, branches-ignore, paths, paths-ignore, types: [opened, reopened, synchronize, closed]

### schedule
cron: string (POSIX cron format)

### workflow_dispatch
inputs:
  name:
    description: string
    required: boolean
    default: string

### workflow_call
inputs: map<string,{required:boolean, type:string, default:any}>
secrets: map<string,{required:boolean}>
outputs: map<string,{description:string}>

## Runners

### GitHub-Hosted Labels
ubuntu-latest, ubuntu-22.04, ubuntu-20.04, windows-latest, windows-2022, macos-latest, macos-12
largebuild: ubuntu-20.04-large-2x, windows-2019-large-2x

### Self-Hosted
labels: self-hosted plus custom labels; reference in runs-on as array.

## Advanced Features

### Matrix Builds
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest]
    node: [14, 16]
  fail-fast: boolean
  max-parallel: integer

### Caching Dependencies
uses: actions/cache@v4
with:
  path: string|array
  key: string
  restore-keys: array|string

### Service Containers
services:
  postgres:
    image: postgres:13
    ports: [5432:5432]
    env:
      POSTGRES_USER: string
      POSTGRES_PASSWORD: string

container:
  image: node:20-bookworm-slim
  credentials:
    username: string
    password: string

### Concurrency
concurrency:
  group: string expression
  cancel-in-progress: boolean

### Environments
environment: string
deployment_branch_policy:
  branches: array<string>

### Permissions
permissions:
  contents: read|write|none
  id-token: write|read|none
  deployments: write|read
  issues: write|read|none

### Reusable Workflows
uses: <owner>/<repo>/.github/workflows/<file>.yml@<ref>
with: map
secrets: map
inputs: map
outputs: map

## Troubleshooting
- Cancel run: gh run cancel <run-id>
- Rerun: gh run rerun <run-id> or POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun
- Download logs: GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs
- Common errors: missing permissions, incorrect runner labels, invalid YAML syntax (use yamllint).
- Inspect runner logs: echo $RUNNER_OS, runner temp and tool cache paths.


## Attribution
- Source: GitHub Actions Workflow Authoring
- URL: https://docs.github.com/en/actions
- License: Creative Commons Attribution 4.0 International (CC BY 4.0)
- Crawl Date: 2025-05-10T08:58:03.850Z
- Data Size: 939006 bytes
- Links Found: 16573

## Retrieved
2025-05-10
