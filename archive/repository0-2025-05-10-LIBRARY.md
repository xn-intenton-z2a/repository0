sandbox/library/EVENT_TRIGGERS.md
# sandbox/library/EVENT_TRIGGERS.md
# EVENT_TRIGGERS

## Crawl Summary
Defined on key forms and configurations for triggering workflows. Supported events: push, pull_request, workflow_dispatch, repository_dispatch, schedule, issues, issue_comment, label, page_build. Filtering: branches, tags, paths and types. Manual triggers via workflow_dispatch inputs. Triggers from workflows require personal or app tokens.

## Normalised Extract
Table of Contents
1. on Key Syntax
2. Event Definitions and Config Fields
3. Activity Types Filtering
4. Branch, Tag, Path Filters
5. Manual workflow_dispatch Inputs
6. repository_dispatch Types
7. Triggering Workflows from Workflows

1. on Key Syntax
Place on at root of YAML. Supported scalar, array, mapping forms.

2. Event Definitions and Config Fields
push: branches (string[]), branches-ignore (string[]), tags (string[]), tags-ignore (string[]), paths (string[]), paths-ignore (string[])
pull_request: branches, branches-ignore, paths, paths-ignore, types (string[])
schedule: cron (string[])
workflow_dispatch: inputs: map(name:{description:string, required:boolean, default:string})
repository_dispatch: types (string[])
issues: types (string[])
issue_comment: types (string[])
label: types (string[])
page_build: none

3. Activity Types Filtering
Use types under event: e.g. issues: types: [opened, closed]

4. Branch, Tag, Path Filters
Define include/exclude via glob arrays under push or pull_request.

5. Manual workflow_dispatch Inputs
inputs:
  user_input:
    description: 'Prompt'
    required: true
    default: 'DefaultValue'

6. repository_dispatch Types
on:
  repository_dispatch:
    types: ["custom_type1", "custom_type2"]

7. Triggering Workflows from Workflows
GITHUB_TOKEN prevents recursive triggers. Use PAT or GitHub App token in secrets. Set env: GH_TOKEN: ${{ secrets.MY_TOKEN }}

## Supplementary Details
Implementation Steps:
1. Create .github/workflows/<file>.yml
2. Define on: key per desired events
3. For event filters, add branches, tags, paths arrays
4. For manual runs, add workflow_dispatch and inputs definition
5. Commit to default branch or PR branch to trigger
6. Store tokens in repository secrets for cross-workflow triggers
Configuration Options:
- branches: list of glob strings, default is all branches
- branches-ignore: list of glob strings to exclude
- tags: glob list for Git tags
- tags-ignore: glob list to exclude tags
- paths / paths-ignore: glob patterns for file paths
- cron: array of cron expressions for schedule
- inputs: key-value map with description, required flag, default value
- types: list of sub-event names


## Reference Details
push Event:
Syntax:
  on:
    push:
      branches: ["main", "dev"]
      branches-ignore: ["release/**"]
      tags: ["v*"]
      tags-ignore: []
      paths: ["src/**", "!test/**"]
      paths-ignore: ["docs/**"]
Parameters:
- branches: string[]
- branches-ignore: string[]
- tags: string[]
- tags-ignore: string[]
- paths: string[]
- paths-ignore: string[]

pull_request Event:
Syntax:
  on:
    pull_request:
      types: ["opened","synchronize"]
      branches: ["main"]
      paths: ["lib/**"]
Parameters:
- types: string[]
- branches: string[]
- branches-ignore: string[]
- paths: string[]
- paths-ignore: string[]

workflow_dispatch Event:
Syntax:
  on:
    workflow_dispatch:
      inputs:
        example_input:
          description: 'Example'
          required: false
          default: 'hello'
Parameters:
- inputs: map<string,{description:string,required:boolean,default:string}>

repository_dispatch Event:
Syntax:
  on:
    repository_dispatch:
      types: ["deploy","test"]
Parameters:
- types: string[]

schedule Event:
Syntax:
  on:
    schedule:
      - cron: '0 0 * * *'
      - cron: '30 2 * * 1'
Parameters:
- cron: string[] (standard cron expressions)

issues / issue_comment / label Events:
Syntax:
  on:
    issues:
      types: ["opened","closed"]
  on:
    issue_comment:
      types: ["created"]
  on:
    label:
      types: ["created","deleted"]
Parameters:
- types: string[]

Troubleshooting:
- No workflows found: confirm file in .github/workflows and valid YAML
- Unexpected triggers: verify filters and glob patterns
- Recursive runs prevented: GITHUB_TOKEN does not trigger nested runs
Commands:
- act -P ubuntu-latest=nektos/act-environments-ubuntu:18.04 -j <job_id> to test locally
Expected Outputs:
- Local log entries matching Actions runner logs


## Information Dense Extract
on:scalar|array|mapping;push:branches[],branches-ignore[],tags[],tags-ignore[],paths[],paths-ignore[];pull_request:branches[],branches-ignore[],paths[],paths-ignore[],types[];workflow_dispatch:inputs{description,required,default};repository_dispatch:types[];schedule:cron[];issues/issue_comment/label:types[];filters:glob;manual:workflow_dispatch inputs;prevent_recursive:GITHUB_TOKEN;use_PAT_or_AppToken for cross-workflow triggers

## Sanitised Extract
Table of Contents
1. on Key Syntax
2. Event Definitions and Config Fields
3. Activity Types Filtering
4. Branch, Tag, Path Filters
5. Manual workflow_dispatch Inputs
6. repository_dispatch Types
7. Triggering Workflows from Workflows

1. on Key Syntax
Place on at root of YAML. Supported scalar, array, mapping forms.

2. Event Definitions and Config Fields
push: branches (string[]), branches-ignore (string[]), tags (string[]), tags-ignore (string[]), paths (string[]), paths-ignore (string[])
pull_request: branches, branches-ignore, paths, paths-ignore, types (string[])
schedule: cron (string[])
workflow_dispatch: inputs: map(name:{description:string, required:boolean, default:string})
repository_dispatch: types (string[])
issues: types (string[])
issue_comment: types (string[])
label: types (string[])
page_build: none

3. Activity Types Filtering
Use types under event: e.g. issues: types: [opened, closed]

4. Branch, Tag, Path Filters
Define include/exclude via glob arrays under push or pull_request.

5. Manual workflow_dispatch Inputs
inputs:
  user_input:
    description: 'Prompt'
    required: true
    default: 'DefaultValue'

6. repository_dispatch Types
on:
  repository_dispatch:
    types: ['custom_type1', 'custom_type2']

7. Triggering Workflows from Workflows
GITHUB_TOKEN prevents recursive triggers. Use PAT or GitHub App token in secrets. Set env: GH_TOKEN: ${{ secrets.MY_TOKEN }}

## Original Source
GitHub Actions Event Triggers
https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows

## Digest of EVENT_TRIGGERS

# EVENT TRIGGERS

# Workflow triggers
A workflow run is triggered by events defined with the on key in a workflow YAML file stored under .github/workflows.

# on key syntax
Place on at the top level of the workflow file. Supported forms:
• Scalar: on: push
• Sequence: on: [push, pull_request]
• Mapping: on:
    push:
      branches: [main, 'releases/**']
      tags: ['v1.*']
    workflow_dispatch:
      inputs:
        name:
          description: 'Person to greet'
          required: true
          default: 'World'

# Supported events and configuration
List of common events and their config fields:
• push: branches, branches-ignore, tags, tags-ignore, paths, paths-ignore
• pull_request: branches, branches-ignore, paths, paths-ignore, types
• workflow_dispatch: inputs (map of name:{description, required, default})
• repository_dispatch: types (array of custom event types)
• schedule: cron (array of cron expressions)
• issues, issue_comment, label: types
• page_build: no config

# Activity types
Some events support types to filter sub-events:
• issues: types: [opened, edited, closed]
• issue_comment: types: [created, edited, deleted]
• label: types: [created, edited, deleted]

# Filters
Filter events by branch, tag, or file path:
• branches / branches-ignore: glob patterns
• tags / tags-ignore: glob patterns
• paths / paths-ignore: include or exclude file path patterns

# Manual triggers
workflow_dispatch enables manual runs with user-defined inputs:
inputs:
  param1:
    description: 'Description'
    required: true
    default: 'value'

# Triggering from workflow
Events triggered by steps using GITHUB_TOKEN (except workflow_dispatch and repository_dispatch) do not launch new runs. To trigger other workflows, use a personal access token or GitHub App token stored as a secret.


## Attribution
- Source: GitHub Actions Event Triggers
- URL: https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows
- License: License
- Crawl Date: 2025-05-09T23:09:55.320Z
- Data Size: 1069012 bytes
- Links Found: 17973

## Retrieved
2025-05-09
sandbox/library/WORKFLOW_AUTHORING.md
# sandbox/library/WORKFLOW_AUTHORING.md
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
sandbox/library/CACHE_DEPENDENCIES.md
# sandbox/library/CACHE_DEPENDENCIES.md
# CACHE_DEPENDENCIES

## Crawl Summary
Jobs on GitHub-hosted runners start clean. Use actions/cache@v4 with parameters key (string ≤512 chars), path (dirs/files/globs), optional restore-keys (multiline strings), optional enableCrossOsArchive (boolean). Restore sequence: exact key, partial key, restore-keys; on miss save new cache. Caches immutable. Limit: repos 10 GB total, entries expire after 7 days. Manage via web UI, REST API, GH CLI. Access restricted to current, default, and base branches. CLI workflows require CLI≥2.32.0.

## Normalised Extract
Table of Contents 1  Input Parameters 2  Restore Logic 3  Output Parameters 4  Cache Versioning 5  Usage Limits 6  Management Methods

1 Input Parameters
key   required string max512 variables, contexts, literals, functions
path  required string or multiline list directories, files, glob patterns, absolute or workspace paths
restore-keys optional multiline string ordered keys for fallback partial matches
enableCrossOsArchive optional boolean default:false enables cross-OS archive on Windows

2 Restore Logic
Step1 exact match on key
Step2 prefix match on key
Step3 for each restore-key sequential prefix match
Within branch then default branch

3 Output Parameters
cache-hit boolean true on exact match false otherwise

4 Cache Versioning
Stamp path and compression metadata to ensure tool compatibility

5 Usage Limits
Expiry 7d inactivity
Repo limit 10 GB total
Evict oldest caches when limit exceeded

6 Management Methods
Web UI Actions > Management > Caches view filter sort delete
REST API endpoints: GET repos/{owner}/{repo}/actions/caches, DELETE repos/{owner}/{repo}/actions/caches/{cache_id}
GitHub CLI gh cache list|delete --ref --limit requires CLI>=2.32.0

## Supplementary Details
Parameter Defaults and Effects
enableCrossOsArchive: false disables cross-OS caching; set true to allow Windows runners to handle caches created on Linux/macOS
restore-keys order matters: first matching prefix restores the most recent cache
Implementation Steps
1. actions/checkout@v4
2. actions/cache@v4 with key,path,restore-keys
3. Conditional if cache-hit output false run fallback steps
4. Install/build/test
5. On success new cache saved automatically
CLI Cleanup Workflow
Use gh cache list --ref <ref> --limit <n> --json id --jq '.[].id' to fetch IDs
Loop over IDs with gh cache delete <id>
Bind GH_TOKEN and GH_REPO environment variables
Use refs/pull/${{ github.event.pull_request.number }}/merge for PR caches

## Reference Details
REST API Endpoints
GET /repos/{owner}/{repo}/actions/caches
Parameters: owner:string repo:string per_page:int page:int
Response: total_count:int actions_caches:[{id:int, key:string, size_in_bytes:int, last_accessed_at:string, created_at:string}]
DELETE /repos/{owner}/{repo}/actions/caches/{cache_id}
Parameters: cache_id:int
Response: 204 No Content

GitHub CLI Subcommands
gh cache list --ref string --limit int --json string --jq string
gh cache delete <cache_id>

cache Action Inputs
actions/cache@v4 uses: inputs:
  key: ${{ runner.os }}-build-name-${{ hashFiles('file') }}
  path: |
    ~/.npm
    other/path
  restore-keys: |
    key1
    key2
  enableCrossOsArchive: true

Outputs
steps.cache.outputs.cache-hit
Type boolean

Best Practices
Always include runner.os in key for OS isolation
Hash dependency lock files to auto-refresh on changes
Provide multiple restore-keys from most to least specific
Check cache-hit output to skip expensive operations

Troubleshooting
Command: gh cache list --ref refs/heads/main --limit 10 --json id,name
Expected: JSON array of cache entries
If empty, ensure workflow has created caches and ref matches
If delete fails 404, verify cache_id and permissions


## Information Dense Extract
key:string≤512;path:string|list dirs/files/globs;restore-keys:string lines;enableCrossOsArchive:boolean default=false. Restore: exact key→prefix key→restore-keys sequential; branch then default branch. cache-hit:boolean. Caches expire 7d inactive; repo limit10GB; evict oldest. Manage: Web UI Caches filter key:NAME; REST GET repos/{owner}/{repo}/actions/caches, DELETE repos/{owner}/{repo}/actions/caches/{cache_id}; CLI gh cache list|delete --ref--limit--json--jq. Best: include runner.os and hashFiles(lock) in key; multiple restore-keys; conditional cache-hit checks. Troubleshoot: gh cache list --ref refs/heads/main --limit10 --json id,name →non-empty JSON; delete returns204 on success,404 on invalid id.

## Sanitised Extract
Table of Contents 1  Input Parameters 2  Restore Logic 3  Output Parameters 4  Cache Versioning 5  Usage Limits 6  Management Methods

1 Input Parameters
key   required string max512 variables, contexts, literals, functions
path  required string or multiline list directories, files, glob patterns, absolute or workspace paths
restore-keys optional multiline string ordered keys for fallback partial matches
enableCrossOsArchive optional boolean default:false enables cross-OS archive on Windows

2 Restore Logic
Step1 exact match on key
Step2 prefix match on key
Step3 for each restore-key sequential prefix match
Within branch then default branch

3 Output Parameters
cache-hit boolean true on exact match false otherwise

4 Cache Versioning
Stamp path and compression metadata to ensure tool compatibility

5 Usage Limits
Expiry 7d inactivity
Repo limit 10 GB total
Evict oldest caches when limit exceeded

6 Management Methods
Web UI Actions > Management > Caches view filter sort delete
REST API endpoints: GET repos/{owner}/{repo}/actions/caches, DELETE repos/{owner}/{repo}/actions/caches/{cache_id}
GitHub CLI gh cache list|delete --ref --limit requires CLI>=2.32.0

## Original Source
GitHub Actions Caching Dependencies
https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows

## Digest of CACHE_DEPENDENCIES

# Cache Dependencies Document

Retrieved: 2024-06-14

# About Caching Workflow Dependencies

Jobs on GitHub-hosted runners start in a clean image. Use the cache action to store and restore dependency files between runs. Supported package managers and setup actions:

• npm, Yarn, pnpm — setup-node
• pip, pipenv, Poetry — setup-python
• Gradle, Maven — setup-java
• RubyGems — setup-ruby
• Go modules (go.sum) — setup-go
• .NET NuGet — setup-dotnet

# Restrictions for Accessing a Cache

• Restore caches only from current branch, default branch, or base branch of a pull request.
• Cannot restore caches from child or sibling branches or different tag names.
• Caches created on a pull request merge ref (refs/pull/.../merge) are scoped to that pull request runs only.
• Multiple workflow runs on the same repository and branch can share caches.

# Using the cache Action

Sequence on restore:
1. Search exact key match.
2. Search partial key match.
3. Search restore-keys sequentially.

On cache hit: cache restored and cache-hit output true.  On cache miss: job runs steps, then on success, new cache created with provided key and path.

Existing caches are immutable; to update, create a new cache with a new key.

# Input Parameters

• key (required)  Type: string  Max length: 512  Composition: variables, contexts, functions, literals
• path (required)  Type: string or multiline list  Supports directories, files, glob patterns, absolute or workspace-relative paths
• restore-keys (optional)  Type: multiline string  Order from most to least specific  Used when exact key misses
• enableCrossOsArchive (optional)  Type: boolean  Default: false  Enables cross-OS cache restore and save on Windows

# Output Parameters

• cache-hit  Type: boolean  Indicates exact key match

# Cache Hits and Misses

• Exact match: hit, restore files.
• No hit: miss, run job steps, then save new cache on success.
• On miss, checks restore-keys for partial matches, restores the most recent partial match.

# Matching a Cache Key

Search order within branch then default branch:
1. key exact
2. key prefix
3. restore-keys exact or prefix

Cache version stamps metadata for path and compression tool to ensure compatibility.

# Example Workflow

```yaml
name: Caching with npm
on: push
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Cache node modules
        id: cache-npm
        uses: actions/cache@v4
        env:
          cache-name: cache-node-modules
        with:
          path: |
            ~/.npm
          key: ${{ runner.os }}-build-${{ env.cache-name }}-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-build-${{ env.cache-name }}-
            ${{ runner.os }}-build-
            ${{ runner.os }}-
      - if: ${{ steps.cache-npm.outputs.cache-hit != 'true' }}
        name: List node modules state
        run: npm list
      - name: Install dependencies
        run: npm install
      - name: Build
        run: npm run build
      - name: Test
        run: npm test
```

# Usage Limits and Eviction Policy

• Caches expire after 7 days of inactivity.
• Unlimited number of caches, but per-repo size limit 10 GB.
• When limit exceeded, oldest caches evicted until under limit.
• Prevent thrashing by deleting specific workflow caches or reducing paths.

# Managing Caches

Methods:
• Web interface: view, filter, sort, delete caches.
• REST API: GitHub Actions cache endpoints.
• GitHub CLI: gh cache subcommands (requires CLI ≥2.32.0).

# Example Cleanup Workflow

```yaml
name: cleanup caches by branch
on:
  pull_request:
    types: [ closed ]
jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - name: Cleanup
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          GH_REPO: ${{ github.repository }}
          BRANCH: refs/pull/${{ github.event.pull_request.number }}/merge
        run: |
          cacheKeys=$(gh cache list --ref $BRANCH --limit 100 --json id --jq '.[].id')
          set +e
          for id in $cacheKeys; do gh cache delete $id; done
```


## Attribution
- Source: GitHub Actions Caching Dependencies
- URL: https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows
- License: License
- Crawl Date: 2025-05-10T06:29:55.014Z
- Data Size: 954918 bytes
- Links Found: 16783

## Retrieved
2025-05-10
sandbox/library/MINIMATCH.md
# sandbox/library/MINIMATCH.md
# MINIMATCH

## Crawl Summary
minimatch(path:string,pattern:string,options?:MinimatchOptions):boolean. MinimatchOptions flags: debug,nobrace,noglobstar,dot,noext,nocase,nocaseMagicOnly,nonull,magicalBraces,matchBase,nocomment,nonegate,flipNegate,partial,windowsPathsNoEscape,windowsNoMagicRoot,preserveMultipleSlashes; optimizationLevel:number(0|1|>=2), platform:string(default process.platform). Class Minimatch(pattern:string,options?): pattern,options,set:Array<Array<RegExp|string>>,regexp,negate,comment,empty; methods: makeRe():RegExp|false, match(string):boolean, matchOne(string[],(RegExp|string)[],partial?):boolean, hasMagic():boolean. Utility: filter(pattern,options):(path)=>boolean; escape/unescape(pattern,options):string; match(list,pattern,options):string[]; makeRe(pattern,options):RegExp|false. Globstar ** matches full segment only. Brace expansion first. UNC paths: '//' prefix preserved. Backslashes escape by default; windowsPathsNoEscape:true treats backslashes as separators. Optimization levels control '../' normalization and dedupe. Negation '!' and comments '#' suppressible. Extglob differences from bash noted.

## Normalised Extract
Table of Contents:
1 Module Import
2 Core Function minimatch
3 Class Minimatch
4 Utility Functions
5 Options
6 Windows and UNC Paths
7 Optimization Levels
8 Discrepancies

1 Module Import
import { minimatch } from 'minimatch'
const { minimatch } = require('minimatch')

2 Core Function minimatch
Signature:
  function minimatch(path:string, pattern:string, options?:MinimatchOptions): boolean
Returns true or false. No exceptions thrown.

3 Class Minimatch
Constructor:
  new Minimatch(pattern:string, options?:MinimatchOptions)
Properties:
  pattern:string
  options:MinimatchOptions
  set:Array<Array<RegExp|string>>
  regexp:RegExp
  negate:boolean
  comment:boolean
  empty:boolean
Methods:
  makeRe(): RegExp | false
  match(fname:string): boolean
  matchOne(fileArray:string[], patternArray:(RegExp|string)[], partial?:boolean): boolean
  hasMagic(): boolean

4 Utility Functions
minimatch.filter(pattern:string, options?:MinimatchOptions): (path:string) => boolean
minimatch.escape(pattern:string, options?:MinimatchOptions): string
minimatch.unescape(pattern:string, options?:MinimatchOptions): string
minimatch.match(list:string[], pattern:string, options?:MinimatchOptions): string[]
minimatch.makeRe(pattern:string, options?:MinimatchOptions): RegExp | false

5 Options
debug: boolean = false
nobrace: boolean = false
noglobstar: boolean = false
dot: boolean = false
noext: boolean = false
nocase: boolean = false
nocaseMagicOnly: boolean = false
nonull: boolean = false
magicalBraces: boolean = false
matchBase: boolean = false
nocomment: boolean = false
nonegate: boolean = false
flipNegate: boolean = false
partial: boolean = false
windowsPathsNoEscape: boolean = false
windowsNoMagicRoot: boolean = true on win32+nocase else false
preserveMultipleSlashes: boolean = false
optimizationLevel: number = 1
platform: string = process.platform

6 Windows and UNC Paths
Use '/' only in patterns; '\\' escapes characters by default. Patterns starting '//' followed by non-slash preserve leading '//'. Patterns '//?/<drive>:/...' match '<drive>:/...' interchangeably when drive letters match case-insensitively; remainder compared case-sensitively unless nocase:true.

7 Optimization Levels
0: Keep '.' and '..' segments in-place.
1: Remove safe '../' segments and preserve dots; default.
>=2: Aggressive removal of empty and '.' segments, dedupe '{a/**/b,a/b}' -> 'a/**/b', '{*,x}' -> '*'.

8 Discrepancies
Leading '!' negates unless nonegate:true. Leading '#' treated as comment unless nocomment:true. '**' only special if alone in segment. Extglob negation differs from Bash in corner cases.

## Supplementary Details
interface MinimatchOptions {
  debug?: boolean
  nobrace?: boolean
  noglobstar?: boolean
  dot?: boolean
  noext?: boolean
  nocase?: boolean
  nocaseMagicOnly?: boolean
  nonull?: boolean
  magicalBraces?: boolean
  matchBase?: boolean
  nocomment?: boolean
  nonegate?: boolean
  flipNegate?: boolean
  partial?: boolean
  windowsPathsNoEscape?: boolean
  windowsNoMagicRoot?: boolean
  preserveMultipleSlashes?: boolean
  optimizationLevel?: number
  platform?: string
}

Implementation Steps:
1 Normalize pattern: if windowsPathsNoEscape:false, replace '\\' with '/'.
2 Expand braces unless nobrace:true.
3 Split pattern into segments on '/'.
4 Convert segments with wildcards to RegExp objects.
5 Build set[][] and combined regexp via makeRe().
6 For each path: use match() or matchOne() (partial:true for walking).
7 For lists: minimatch.match(fileList, pattern, options).

UNC Path Handling:
- Pattern '//' prefix retained when next char != '/'.
- Patterns '//?/C:/' match 'C:/' paths and vice versa when case matches.
- Use windowsPathsNoEscape:true to allow '\\' separators in pattern only on Windows.


## Reference Details
### API Specifications

Function: minimatch(path:string, pattern:string, options?:MinimatchOptions): boolean
  path: string - file path to test
  pattern: string - glob pattern
  options: MinimatchOptions - matching flags
  returns: true if match, false otherwise

Function: minimatch.filter(pattern:string, options?:MinimatchOptions): (path:string) => boolean
  returns predicate for Array.filter

Function: minimatch.escape(pattern:string, options?:MinimatchOptions): string

Function: minimatch.unescape(pattern:string, options?:MinimatchOptions): string

Function: minimatch.match(list:string[], pattern:string, options?:MinimatchOptions): string[]
  returns matched subset or [pattern] if nonull:true and no matches

Function: minimatch.makeRe(pattern:string, options?:MinimatchOptions): RegExp | false
  returns RegExp or false if invalid

Class: Minimatch
Constructor(pattern:string, options?:MinimatchOptions)
Properties: pattern, options, set, regexp, negate, comment, empty
Methods:
  makeRe(): RegExp | false
  match(fname:string): boolean
  matchOne(fileArray:string[], patternArray:(RegExp|string)[], partial?:boolean): boolean
  hasMagic(): boolean

### Code Examples

// ES Module import
import minimatch, { Minimatch } from 'minimatch'

// Basic match
console.log(minimatch('src/index.js','**/*.js',{ matchBase:true })) // true

// Filter array
const jsFilter = minimatch.filter('*.js',{ nocase:true })
['a.JS','b.txt'].filter(jsFilter) // ['a.JS']

// Escape/unescape
const escaped = minimatch.escape('file?[0-9].js')
// 'file\?\[0-9\]\.js'
console.log(minimatch.unescape(escaped)) // 'file?[0-9].js'

// Using Minimatch class
const mm = new Minimatch('lib/**/*.ts',{ dot:true, optimizationLevel:2 })
const re = mm.makeRe()
console.log(re.test('lib/sub/file.ts')) // true
console.log(mm.match('lib/.hidden.ts'))      // true

// Partial matching during directory walk
const walkerMM = new Minimatch('src/**/*.js',{ partial:true })
// While recursing 'src', call walkerMM.matchOne(currentPathArray, walkerMM.set[row], true)

### Implementation Pattern
1 const pattern = userInput.replace('\\','/')
2 const mm = new Minimatch(pattern, opts)
3 if (!mm.hasMagic()) handle literal match
4 const re = mm.makeRe() // compile once
5 list.filter(minimatch.filter(pattern,opts))

### Configuration Options with Effects
- debug:true outputs parse/match log to stderr
- matchBase:true matches pattern without '/' to basename
- windowsPathsNoEscape:true allows Windows '\\' separators in pattern
- optimizationLevel:0|1|>=2 controls path normalization steps

### Best Practices
- Escape untrusted input: minimatch.escape()
- Use nonull when missing matches must be signaled
- Precompile RegExp via makeRe() for bulk matching
- Use partial:true to prune file-walker branches

### Troubleshooting
**Symptom**: Unexpected false on valid file
**Action**: Enable debug, inspect mm.set and mm.regexp
  node -e "console.log(require('minimatch').minimatch('a/.b','a/*.b',{dot:true,debug:true}))"
**Symptom**: Backslashes in pattern not matching
**Action**: set windowsPathsNoEscape:true or convert to '/'
**Symptom**: Invalid pattern returns false from makeRe()
**Action**: Catch false and fallback to string-equality or escape input


## Information Dense Extract
minimatch(path:string,pattern:string,options?:{debug?,nobrace?,noglobstar?,dot?,noext?,nocase?,nocaseMagicOnly?,nonull?,magicalBraces?,matchBase?,nocomment?,nonegate?,flipNegate?,partial?,windowsPathsNoEscape?,windowsNoMagicRoot?,preserveMultipleSlashes?,optimizationLevel?:number,platform?:string}):boolean; class Minimatch{constructor(pattern:string,options?);pattern:string;options;set:Array<Array<RegExp|string>>;regexp:RegExp;negate:boolean;comment:boolean;empty:boolean;makeRe():RegExp|false;match(string):boolean;matchOne(string[],(RegExp|string)[],boolean?):boolean;hasMagic():boolean}; util:filter(pattern,opts)->(path=>boolean);escape(pattern)->string;unescape(pattern)->string;match(list,pattern,opts)->string[];makeRe(pattern,opts)->RegExp|false; Options default false (except optimizationLevel=1,platform=process.platform); Windows:'//' prefix preserved, use '/', windowsPathsNoEscape toggles '\\' interpretation; Globstar '**' only full segment; Brace expansion then pattern parse; Optimization levels 0,1,>=2 re: '../' and dedupe; '!' negation unless nonegate; '#' comment unless nocomment.

## Sanitised Extract
Table of Contents:
1 Module Import
2 Core Function minimatch
3 Class Minimatch
4 Utility Functions
5 Options
6 Windows and UNC Paths
7 Optimization Levels
8 Discrepancies

1 Module Import
import { minimatch } from 'minimatch'
const { minimatch } = require('minimatch')

2 Core Function minimatch
Signature:
  function minimatch(path:string, pattern:string, options?:MinimatchOptions): boolean
Returns true or false. No exceptions thrown.

3 Class Minimatch
Constructor:
  new Minimatch(pattern:string, options?:MinimatchOptions)
Properties:
  pattern:string
  options:MinimatchOptions
  set:Array<Array<RegExp|string>>
  regexp:RegExp
  negate:boolean
  comment:boolean
  empty:boolean
Methods:
  makeRe(): RegExp | false
  match(fname:string): boolean
  matchOne(fileArray:string[], patternArray:(RegExp|string)[], partial?:boolean): boolean
  hasMagic(): boolean

4 Utility Functions
minimatch.filter(pattern:string, options?:MinimatchOptions): (path:string) => boolean
minimatch.escape(pattern:string, options?:MinimatchOptions): string
minimatch.unescape(pattern:string, options?:MinimatchOptions): string
minimatch.match(list:string[], pattern:string, options?:MinimatchOptions): string[]
minimatch.makeRe(pattern:string, options?:MinimatchOptions): RegExp | false

5 Options
debug: boolean = false
nobrace: boolean = false
noglobstar: boolean = false
dot: boolean = false
noext: boolean = false
nocase: boolean = false
nocaseMagicOnly: boolean = false
nonull: boolean = false
magicalBraces: boolean = false
matchBase: boolean = false
nocomment: boolean = false
nonegate: boolean = false
flipNegate: boolean = false
partial: boolean = false
windowsPathsNoEscape: boolean = false
windowsNoMagicRoot: boolean = true on win32+nocase else false
preserveMultipleSlashes: boolean = false
optimizationLevel: number = 1
platform: string = process.platform

6 Windows and UNC Paths
Use '/' only in patterns; '''' escapes characters by default. Patterns starting '//' followed by non-slash preserve leading '//'. Patterns '//?/<drive>:/...' match '<drive>:/...' interchangeably when drive letters match case-insensitively; remainder compared case-sensitively unless nocase:true.

7 Optimization Levels
0: Keep '.' and '..' segments in-place.
1: Remove safe '../' segments and preserve dots; default.
>=2: Aggressive removal of empty and '.' segments, dedupe '{a/**/b,a/b}' -> 'a/**/b', '{*,x}' -> '*'.

8 Discrepancies
Leading '!' negates unless nonegate:true. Leading '#' treated as comment unless nocomment:true. '**' only special if alone in segment. Extglob negation differs from Bash in corner cases.

## Original Source
minimatch – File Globbing and Pattern Matching
https://github.com/isaacs/minimatch

## Digest of MINIMATCH

# minimatch v3.4.0
Date Retrieved: 2024-06-09

# Usage
import { minimatch } from 'minimatch'
const { minimatch } = require('minimatch')

minimatch('bar.foo', '*.foo')       // true
minimatch('bar.foo', '*.bar')       // false
minimatch('bar.foo', '*.+(bar|foo)', { debug: true }) // true, debug prints parse details

# Features
Brace Expansion
Extended glob matching (extglob)
Globstar ** matching
POSIX character classes [[:alpha:]] (Unicode-aware)

# Class Minimatch
## Constructor
new Minimatch(pattern: string, options?: MinimatchOptions)

## Properties
pattern              The original pattern string
options              MinimatchOptions used for parsing
set                  Array of arrays of RegExp|string segments (after brace expansion)
regexp               Combined RegExp for full-pattern matching (from makeRe)
negate               true if pattern starts with '!'
comment              true if pattern is a comment (#...)
empty                true if pattern is empty string

## Methods
makeRe(): RegExp | false    Generate or return existing regexp; false if invalid
match(fname: string): boolean     Test single filename against pattern
matchOne(fileArray: string[], patternArray: (RegExp|string)[], partial?: boolean): boolean  Internal segment-by-segment matcher
hasMagic(): boolean       true if pattern contains any magic (braces, glob chars)

# Utility Functions
minimatch(path: string, pattern: string, options?: MinimatchOptions): boolean
minimatch.filter(pattern: string, options?: MinimatchOptions): (path: string) => boolean
minimatch.escape(pattern: string, options?: MinimatchOptions): string
minimatch.unescape(pattern: string, options?: MinimatchOptions): string
minimatch.match(list: string[], pattern: string, options?: MinimatchOptions): string[]
minimatch.makeRe(pattern: string, options?: MinimatchOptions): RegExp | false

# Options (all boolean unless noted)
debug               false  Print detailed parse/match debug
nobrace             false  Disable {a,b} and {1..3} expansion
noglobstar          false  Disable ** matching folders
dot                 false  Allow names starting with '.' to match
noext               false  Disable extglob +(...) patterns
nocase              false  Case-insensitive match
nocaseMagicOnly     false  With nocase, only regex parts ignore case
nonull              false  Return [pattern] if no matches
magicalBraces       false  Count brace sets as magic for hasMagic()
matchBase           false  Match basename when no slashes in pattern
nocomment           false  Treat leading '#' as literal
nonegate            false  Treat leading '!' as literal
flipNegate          false  Swap negate logic (true on non-match)
partial             false  Allow partial path matches (for walkers)
windowsPathsNoEscape false Use '\\' only as separator, not escape
windowsNoMagicRoot  default on win32 when nocase  Keep root string-literal
preserveMultipleSlashes false Preserve '///' sequences
optimizationLevel   1      0|1|>=2 pattern normalization aggressiveness
platform            process.platform  'win32' or other


## Attribution
- Source: minimatch – File Globbing and Pattern Matching
- URL: https://github.com/isaacs/minimatch
- License: License
- Crawl Date: 2025-05-10T01:24:10.253Z
- Data Size: 601192 bytes
- Links Found: 4607

## Retrieved
2025-05-10
sandbox/library/ESM_MODULES.md
# sandbox/library/ESM_MODULES.md
# ESM_MODULES

## Crawl Summary
Node.js ES modules use explicit markers (.mjs, package.json type:module, --input-type). Relative specifiers require extensions; bare specifiers follow package exports field; absolute use file: URLs. import attributes support only { type: 'json' }. import.meta offers url, dirname, filename, resolve(specifier) -> string. CommonJS interop: default export = module.exports, named exports via static analysis, createRequire for require. JSON modules require with { type: 'json' } and expose default. WASM modules require --experimental-wasm-modules; support source imports. Top-level await enabled unflagged. Resolution algorithm: ESM_RESOLVE handles URLs, relative, imports (#), bare packages via PACKAGE_RESOLVE; format from extension or package.json type and content detection; throws specific errors.

## Normalised Extract
Table of Contents:
1. Enabling ES Modules
2. Import Specifiers
3. Import Attributes
4. import.meta API
5. CommonJS Interop
6. JSON Modules
7. WASM Modules
8. Top-Level Await
9. Resolution Algorithm

1. Enabling ES Modules
Markers:
  • .mjs extension
  • package.json: { "type": "module" }
  • CLI: node --input-type=module
Fallback: source scan for import/export syntax.

2. Import Specifiers
- Relative: './file.ext' (extension mandatory)
- Bare: 'pkg' or 'pkg/sub' (exports field controls access)
- Absolute: 'file:///path'

3. Import Attributes
Syntax: import x from 'file.json' with { type: 'json' }
Supported: type:'json'

4. import.meta API
import.meta.url      -> file: URL string
import.meta.dirname  -> path.dirname(import.meta.filename)
import.meta.filename -> absolute path of module
import.meta.resolve(specifier:string):string

5. CommonJS Interop
import defaultExport from 'cjs'
import * as ns from 'cjs'
createRequire:
  import { createRequire } from 'module'
  const require = createRequire(import.meta.url)

6. JSON Modules
import pkg from './package.json' with { type:'json' }
Exposes default export only; caches via CommonJS

7. WASM Modules
Flag: --experimental-wasm-modules
import * as Module from './mod.wasm'
import source wasmBinary from './mod.wasm'

8. Top-Level Await
Allowed. Exits with code 13 if never resolves.

9. Resolution Algorithm
ESM_RESOLVE(specifier,parentURL)
  • If valid URL -> parse
  • If starts with '/', './', '../' -> URL.resolve
  • If '#' -> PACKAGE_IMPORTS_RESOLVE
  • Else -> PACKAGE_RESOLVE
Format via ESM_FILE_FORMAT by extension (.mjs,module;.cjs,commonjs;.json,json;.wasm if flag,wasm)
Throws: Invalid Module Specifier, Module Not Found, Unsupported Directory Import, Invalid Package Target/Configuration, Package Path Not Exported

## Supplementary Details
Exact parameter values and flags:
--input-type=module | commonjs
package.json "type": "module" | "commonjs"
Extension-to-format mapping: .mjs->module, .cjs->commonjs, .json->json, .wasm->wasm (flag), .node->addon (flag)
import.meta.resolve: accepts specifier:string, returns absolute URL string; synchronous
MODULE ERRORS:
  Invalid Module Specifier: non-URL/bad package name
  Module Not Found: file missing
  Unsupported Directory Import: specifier resolves to directory
PACKAGE RESOLUTION:
PACKAGE_RESOLVE(pkgSpecifier,parentURL) extracts packageName, subpath, falls back up directories to node_modules, reads package.json exports field or main, supports conditions ["node","import"].
Conditions array default: ["node","import"].

Implementation steps:
1. Add "type":"module" to package.json
2. Rename .js to .mjs or use extension markers
3. Use import specifiers with extensions
4. For JSON imports, add with { type: 'json' }
5. For WASM, invoke node with --experimental-wasm-modules
6. Use import.meta.resolve to resolve specifiers programmatically

Best practice: Always specify extensions on relative imports; use import attributes for JSON; use createRequire for CJS interop; avoid mixing require() and import statements.



## Reference Details
API: import.meta.resolve
Signature: function resolve(specifier: string): string
Parameters: specifier: string (relative, bare, or absolute) 
Returns: string (absolute URL)
Throws: Error on invalid specifier or resolution failure

API: createRequire
import { createRequire } from 'module'
Signature: function createRequire(path: string | URL): NodeRequire

Code Example:
import { createRequire } from 'module'
import { readFileSync } from 'fs'

const require = createRequire(import.meta.url)
const pkg = require('./package.json')
console.log(pkg.version)

// JSON Module import
import config from './config.json' with { type: 'json' }
console.log(config)

// Top-level await example
export const data = await fetch('https://api.example.com/data').then(r=>r.json())

// WASM import
// Run: node --experimental-wasm-modules index.mjs
import * as wasm from './lib.wasm'
console.log(wasm.add(1,2))

Troubleshooting:
Command: node --trace-warnings --experimental-wasm-modules app.mjs
Output: prints loader traces and resolution errors
Common errors:
Invalid Module Specifier at ESM_RESOLVE -> check specifier syntax
Module Not Found -> verify file path and extension
Unsupported Directory Import -> include index file or explicit file

Configuration options:
{ "type": "module" } in package.json defaults all .js files to ESM
--input-type=module treats stdin or --eval input as module
--experimental-wasm-modules enables .wasm handling

Best Practice Code Pattern:
// package.json
{
  "type": "module",
  "exports": {
    "./feature": "./src/feature.mjs"
  }
}

// src/index.mjs
import feature from './feature.mjs'
feature.init()



## Information Dense Extract
ESM: enable via .mjs, package.json type:module, --input-type=module. Relative imports require extensions; bare follow exports field; absolute use file: URL. import attributes: JSON: with {type:'json'}. import.meta: url:string, dirname:string, filename:string, resolve(specifier)->string. CommonJS interop via createRequire(import.meta.url); default export=module.exports; named via static analysis. JSON modules expose default only; cache in CJS. WASM: flag --experimental-wasm-modules; import and source import. Top-level await allowed; unresolved await exits code 13. Resolution: ESM_RESOLVE categorizes specifiers, calls PACKAGE_RESOLVE or IMPORTS_RESOLVE, uses ESM_FILE_FORMAT by extension or package.json type and syntax detection. Errors: Invalid Module Specifier, Module Not Found, Unsupported Directory Import, Invalid Package Target, Package Path Not Exported.

## Sanitised Extract
Table of Contents:
1. Enabling ES Modules
2. Import Specifiers
3. Import Attributes
4. import.meta API
5. CommonJS Interop
6. JSON Modules
7. WASM Modules
8. Top-Level Await
9. Resolution Algorithm

1. Enabling ES Modules
Markers:
   .mjs extension
   package.json: { 'type': 'module' }
   CLI: node --input-type=module
Fallback: source scan for import/export syntax.

2. Import Specifiers
- Relative: './file.ext' (extension mandatory)
- Bare: 'pkg' or 'pkg/sub' (exports field controls access)
- Absolute: 'file:///path'

3. Import Attributes
Syntax: import x from 'file.json' with { type: 'json' }
Supported: type:'json'

4. import.meta API
import.meta.url      -> file: URL string
import.meta.dirname  -> path.dirname(import.meta.filename)
import.meta.filename -> absolute path of module
import.meta.resolve(specifier:string):string

5. CommonJS Interop
import defaultExport from 'cjs'
import * as ns from 'cjs'
createRequire:
  import { createRequire } from 'module'
  const require = createRequire(import.meta.url)

6. JSON Modules
import pkg from './package.json' with { type:'json' }
Exposes default export only; caches via CommonJS

7. WASM Modules
Flag: --experimental-wasm-modules
import * as Module from './mod.wasm'
import source wasmBinary from './mod.wasm'

8. Top-Level Await
Allowed. Exits with code 13 if never resolves.

9. Resolution Algorithm
ESM_RESOLVE(specifier,parentURL)
   If valid URL -> parse
   If starts with '/', './', '../' -> URL.resolve
   If '#' -> PACKAGE_IMPORTS_RESOLVE
   Else -> PACKAGE_RESOLVE
Format via ESM_FILE_FORMAT by extension (.mjs,module;.cjs,commonjs;.json,json;.wasm if flag,wasm)
Throws: Invalid Module Specifier, Module Not Found, Unsupported Directory Import, Invalid Package Target/Configuration, Package Path Not Exported

## Original Source
Node.js ESM Modules
https://nodejs.org/api/esm.html

## Digest of ESM_MODULES

# Introduction

ECMAScript modules are the official standard format to package JavaScript code for reuse. Modules are defined using import and export statements. Node.js supports ES modules via .mjs extension, "type": "module" in package.json, or the --input-type flag. Without explicit markers, Node.js inspects source for ES syntax.

# Enabling

Explicit markers:
- .mjs file extension
- package.json: { "type": "module" }
- CLI flag: --input-type=module

CommonJS markers:
- .cjs file extension
- package.json: { "type": "commonjs" }
- CLI flag: --input-type=commonjs

# Import Specifiers

Types:
1. Relative ("./file.mjs", extension required)
2. Bare ("package" or "package/subpath")
3. Absolute ("file:///path/to/file.js")

# Import Attributes

Syntax:
import data from './file.json' with { type: 'json' };
Supported attributes:
- type: 'json'

# import.meta Properties

import.meta.url        : string (file: URL of current module)
import.meta.dirname    : string (directory of current module)
import.meta.filename   : string (absolute path, symlinks resolved)
import.meta.resolve    : function(specifier: string) -> string (absolute URL)

# Interoperability with CommonJS

- import cjsDefault from 'cjs'    // default = module.exports
- import * as ns from 'cjs'        // namespace with default and named
- module.createRequire(import.meta.url)

# JSON Modules

import config from './config.json' with { type: 'json' };
Default export only, cached in CommonJS cache.

# Wasm Modules

--experimental-wasm-modules flag
import * as M from './module.wasm';
import source wasmModule from './module.wasm';

# Top-Level Await

Allowed in ES modules:
export const val = await Promise.resolve(5);

# Resolution Algorithm

ESM_RESOLVE(specifier, parentURL) -> { format: string, resolved: URL }
- URLs -> parse directly
- "." or "/" prefixes -> relative URL resolution
- "#" prefixes -> PACKAGE_IMPORTS_RESOLVE
- else bare -> PACKAGE_RESOLVE
Format detection via ESM_FILE_FORMAT by extension and package.json "type" field.

# Errors

Invalid Module Specifier, Module Not Found, Unsupported Directory Import, Invalid Package Configuration, Package Path Not Exported.

## Attribution
- Source: Node.js ESM Modules
- URL: https://nodejs.org/api/esm.html
- License: License
- Crawl Date: 2025-05-09T23:41:18.475Z
- Data Size: 3733629 bytes
- Links Found: 3224

## Retrieved
2025-05-09
sandbox/library/WORKFLOW_SYNTAX.md
# sandbox/library/WORKFLOW_SYNTAX.md
# WORKFLOW_SYNTAX

## Crawl Summary
Workflow syntax defines top-level key on with supported events push, pull_request, schedule, workflow_dispatch, workflow_call, workflow_run. Each event supports filters: branches, branches-ignore, tags, tags-ignore, paths, paths-ignore, types, workflows, cron. The jobs section configures runs-on, needs, if, permissions, environment, concurrency, container, services, defaults, steps, timeout-minutes, strategy, continue-on-error. Permissions key controls GITHUB_TOKEN scopes with read, write, none. Defaults run defines shell and working-directory. Env defines variables at workflow, job, step levels. Concurrency ensures single in-flight group using group and cancel-in-progress.

## Normalised Extract
Table of Contents:
1  Triggers (on)
2  Filters
3  Jobs
4  Steps
5  Defaults
6  Permissions
7  Env Variables
8  Concurrency

1  Triggers (on)
   on supports events: push, pull_request, pull_request_target, schedule, workflow_dispatch, workflow_call, workflow_run

2  Filters
   push / pull_request / pull_request_target:
     branches: [string glob]
     branches-ignore: [string glob]
     tags: [string glob]
     tags-ignore: [string glob]
     paths: [string glob]
     paths-ignore: [string glob]
     types: [string]
   schedule:
     - cron: '30 5 * * 1-5'
   workflow_run:
     workflows: [string]
     types: [string]
     branches: [glob]
     branches-ignore: [glob]
   workflow_dispatch:
     inputs:
       <input_id>:
         required: boolean
         type: boolean|choice|number|environment|string
         default: string|number|boolean
         options: [string]  # for choice
   workflow_call:
     inputs:
       <input_id>:
         required: boolean
         type: string|boolean|number
         default: string|number|boolean
     outputs:
       <output_id>:
         value: ${{ jobs.<job_id>.outputs.<key> }}
     secrets:
       <secret_id>:
         required: boolean

3  Jobs
   jobs.<job_id>:
     runs-on: ubuntu-latest|macos-latest|windows-latest|self-hosted
     needs: [job_id]
     if: expression
     environment: string
     permissions:
       <permission>: read|write|none
     concurrency:
       group: string|expression
       cancel-in-progress: boolean
     container:
       image: string
       credentials: {username: string,password: string}
       env: {VAR:string}
       ports: [string]
       volumes: [string]
       options: string
     services:
       id:
         image: string
         credentials: {username:string,password:string}
         env: {VAR:string}
         ports: [string]
         volumes: [string]
         options: string
     defaults.run:
       shell: bash|pwsh|cmd|sh|python
       working-directory: string
     timeout-minutes: integer
     strategy:
       matrix: {key:[values], include:[map], exclude:[map]}
       fail-fast: boolean
       max-parallel: integer
     continue-on-error: boolean

4  Steps
   - id: string
     name: string
     if: expression
     uses: action@version | path
     run: command
     shell: bash|pwsh|cmd|sh|python
     working-directory: string
     with: {input:value, entrypoint:string, args:string}
     env: {VAR:value}
     continue-on-error: boolean
     timeout-minutes: integer

5  Defaults
   defaults:
     run:
       shell: bash|pwsh|...  
       working-directory: path

6  Permissions
   permissions: read-all|write-all|{}
   map: actions, attestations, checks, contents, deployments, id-token, issues, models, discussions, packages, pages, pull-requests, security-events, statuses
   values: read|write|none

7  Env Variables
   workflow-level:
     env: {VAR:value}
   job-level:
     jobs.id.env: {VAR:value}
   step-level:
     steps.env: {VAR:value}

8  Concurrency
   concurrency:
     group: expression
     cancel-in-progress: boolean


## Supplementary Details
Trigger evaluation order: evaluate events in order listed under on; if multiple events match, multiple runs. Filters combine: event and branch and path and tag filters are AND logic. Glob patterns: *, **, ?, !; escape special chars with \\. Path filters limited to first 300 changed files; diff type: two-dot for push, three-dot for pull_request. Scheduled workflows require cron string quoted. workflow_dispatch max inputs: 10; max payload: 65535 chars. workflow_run requires workflows and types arrays; types default: [completed, requested, in_progress]. Default GITHUB_TOKEN scopes: none; unspecified scopes default to none when map provided. Default shell fallback: non-Windows uses bash -e {0}, Windows uses pwsh. Timeout defaults: 360 minutes. Max jobs per workflow: unlimited within runner limits. Self-hosted runners require labels in runs-on.

## Reference Details
Complete API Specifications and SDK Method Signatures for Workflow Configuration

1  on Event Filters Schema JSON Schema Fragment:
{
  "on": {
    "oneOf": [
      {"type":"string","enum":["push","pull_request","pull_request_target","schedule","workflow_dispatch","workflow_call","workflow_run"]},
      {"type":"array","items":{"type":"string","enum":["push","pull_request",...]}},
      {"type":"object","properties":{
        "push": {"type":"object","properties":{
          "branches":{"type":"array","items":{"type":"string"}},
          "branches-ignore":{"type":"array","items":{"type":"string"}},
          "tags":{"type":"array","items":{"type":"string"}},
          "tags-ignore":{"type":"array","items":{"type":"string"}},
          "paths":{"type":"array","items":{"type":"string"}},
          "paths-ignore":{"type":"array","items":{"type":"string"}}
        },"additionalProperties":false},
        "pull_request": {"$ref":"#/on/push"},
        "schedule": {"type":"array","items":{"type":"object","properties":{"cron":{"type":"string"}},"required":["cron"]}},
        "workflow_dispatch": {"type":"object","properties":{"inputs":{"type":"object","additionalProperties":{
          "type":"object","properties":{
            "description":{"type":"string"},
            "required":{"type":"boolean"},
            "default":{},
            "type":{"type":"string","enum":["boolean","choice","number","environment","string"]},
            "options":{"type":"array","items":{"type":"string"}}
          },"required":["required","type"]
        }}}},
        "workflow_call": {"type":"object","properties":{
          "inputs":{"type":"object","additionalProperties":{
            "type":"object","properties":{
              "description":{"type":"string"},"required":{"type":"boolean"},"default":{},"type":{"type":"string","enum":["boolean","number","string"]}
            },"required":["required","type"]}},
          "outputs":{"type":"object","additionalProperties":{
            "type":"object","properties":{"description":{"type":"string"},"value":{"type":"string"}},"required":["value"]}},
          "secrets":{"type":"object","additionalProperties":{
            "type":"object","properties":{"description":{"type":"string"},"required":{"type":"boolean"}},"required":["required"]}}
        }},
        "workflow_run": {"type":"object","properties":{
          "workflows":{"type":"array","items":{"type":"string"}},
          "types":{"type":"array","items":{"type":"string"}},
          "branches":{"type":"array","items":{"type":"string"}},
          "branches-ignore":{"type":"array","items":{"type":"string"}}
        },"required":["workflows","types"]}
      },"additionalProperties":false}
    ]
  }
}

2  SDK Method Signatures (JavaScript Action Runner):

function registerWorkflow(config: WorkflowConfig): void
interface WorkflowConfig {
  name?: string;
  on: Trigger;
  permissions?: PermissionsMap | 'read-all' | 'write-all' | {};
  env?: Record<string,string>;
  defaults?: {run?: {shell:string;working-directory:string}};
  concurrency?: {group:string;cancel-in-progress:boolean};
  jobs: Record<string,JobConfig>;
}

type Trigger = string | string[] | PushTrigger | PRTrigger | ScheduleTrigger[] | DispatchTrigger | CallTrigger | RunTrigger;
interface PushTrigger {branches?:string[];branches-ignore?:string[];tags?:string[];tags-ignore?:string[];paths?:string[];paths-ignore?:string[];}
interface PRTrigger extends PushTrigger {types?:string[];}
interface ScheduleTrigger {cron:string;}
interface DispatchTrigger {inputs:Record<string,InputDef>}
interface CallTrigger {inputs?:Record<string,InputDef>;outputs?:Record<string,OutputDef>;secrets?:Record<string,SecretDef>}
interface RunTrigger {workflows:string[];types:string[];branches?:string[];branches-ignore?:string[]}
interface InputDef {description?:string;required:boolean;default?:string|number|boolean;type:'boolean'|'choice'|'number'|'environment'|'string';options?:string[]}
interface OutputDef {description?:string;value:string}
interface SecretDef {description?:string;required:boolean}
interface JobConfig {
  name?:string;
  runs-on:string|string[];
  needs?:string[];
  if?:string;
  permissions?:PermissionsMap;
  environment?:string;
  concurrency?:{group:string;cancel-in-progress:boolean};
  container?:ContainerConfig;
  services?:Record<string,ContainerConfig>;
  defaults?:{run?:{shell:string;working-directory:string}};
  timeout-minutes?:number;
  strategy?:StrategyConfig;
  continue-on-error?:boolean;
  steps: StepConfig[];
}
interface ContainerConfig {image:string;credentials?:{username:string;password:string};env?:Record<string,string>;ports?:string[];volumes?:string[];options?:string}
interface StrategyConfig {matrix:Record<string,any[]>;include?:any[];exclude?:any[];fail-fast?:boolean;max-parallel?:number}
interface StepConfig {id?:string;name?:string;if?:string;uses?:string;run?:string;shell?:string;working-directory?:string;with?:Record<string,string>;env?:Record<string,string>;continue-on-error?:boolean;timeout-minutes?:number}
interface PermissionsMap {actions?:'read'|'write'|'none';attestations?:'read'|'write'|'none';checks?:'read'|'write'|'none';contents?:'read'|'write'|'none';deployments?:'read'|'write'|'none';'id-token'?:'write'|'none';issues?:'read'|'write'|'none';models?:'read'|'none';discussions?:'read'|'write'|'none';packages?:'read'|'write'|'none';pages?:'read'|'write'|'none';'pull-requests'?:'read'|'write'|'none';'security-events'?:'read'|'write'|'none';statuses?:'read'|'write'|'none'}

3  Sample Implementation Pattern:

// workflow.yml
name: CI
on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      issues: write
    concurrency:
      group: ci-${{ github.ref }}
      cancel-in-progress: true
    steps:
      - uses: actions/checkout@v3
      - name: Install
        run: npm ci
      - name: Test
        run: npm test
      - name: Upload Report
        uses: actions/upload-artifact@v3
        with:
          name: test-report
          path: coverage/

4  Best Practices:
   - Always specify exact version for actions: uses: action/name@vX
   - Lock runner labels: runs-on: [self-hosted, linux]
   - Limit concurrency per branch: group: ${{ github.ref }}
   - Least privilege for GITHUB_TOKEN: specify only needed permissions

5  Troubleshooting:
   Command: gh run list --workflow CI --status in_progress
   Expected: displays queued and running runs
   Command: gh run view <run-id> --log-failed
   Expected: shows log output with error sections
   If workflow pending: check branch and path filters. Use gh api repo/actions/runs/<id> to inspect event and filters.


## Information Dense Extract
on: {push:{branches:Array<string>,branches-ignore:Array<string>,tags:Array<string>,tags-ignore:Array<string>,paths:Array<string>,paths-ignore:Array<string>},pull_request:{types:Array<string>,branches:Array<string>,branches-ignore:Array<string>},schedule:[{cron:string}],workflow_dispatch:{inputs:Map<input_id:{required:boolean,type:string,default?,options?}>},workflow_call:{inputs:Map<input>,outputs:Map<output>,secrets:Map<secret>},workflow_run:{workflows:Array<string>,types:Array<string>,branches?,branches-ignore?}}
jobs:<job_id>:{runs-on:string|Array<string>,needs?:Array<string>,if?:string,permissions?:Map<scope: 'read'|'write'|'none'>,environment?:string,concurrency?:{group:string,cancel-in-progress:boolean},container?:Container,services?:Map<Container>,defaults?:{run:{shell:string,working-directory:string}},timeout-minutes?:number,strategy?:{matrix:Map<any[]>,include?,exclude?,fail-fast?,max-parallel?},continue-on-error?:boolean,steps:Array<Step>}
Container:{image:string,credentials?:{username:string,password:string},env?:Map<string>,ports?:Array<string>,volumes?:Array<string>,options?:string}
Step:{id?:string,name?:string,if?:string,uses?:string,run?:string,shell?:string,working-directory?:string,with?:Map<string,string>,env?:Map<string,string>,continue-on-error?:boolean,timeout-minutes?:number}
permissions:Map<actions,attestations,checks,contents,deployments,id-token,issues,models,discussions,packages,pages,pull-requests,security-events,statuses>=read|write|none or read-all|write-all or {}
defaults: {run:{shell:'bash'|'pwsh'|'cmd'|'sh'|'python',working-directory:string}}
env: Map<string,string>
concurrency:{group:string,cancel-in-progress:boolean}

## Sanitised Extract
Table of Contents:
1  Triggers (on)
2  Filters
3  Jobs
4  Steps
5  Defaults
6  Permissions
7  Env Variables
8  Concurrency

1  Triggers (on)
   on supports events: push, pull_request, pull_request_target, schedule, workflow_dispatch, workflow_call, workflow_run

2  Filters
   push / pull_request / pull_request_target:
     branches: [string glob]
     branches-ignore: [string glob]
     tags: [string glob]
     tags-ignore: [string glob]
     paths: [string glob]
     paths-ignore: [string glob]
     types: [string]
   schedule:
     - cron: '30 5 * * 1-5'
   workflow_run:
     workflows: [string]
     types: [string]
     branches: [glob]
     branches-ignore: [glob]
   workflow_dispatch:
     inputs:
       <input_id>:
         required: boolean
         type: boolean|choice|number|environment|string
         default: string|number|boolean
         options: [string]  # for choice
   workflow_call:
     inputs:
       <input_id>:
         required: boolean
         type: string|boolean|number
         default: string|number|boolean
     outputs:
       <output_id>:
         value: ${{ jobs.<job_id>.outputs.<key> }}
     secrets:
       <secret_id>:
         required: boolean

3  Jobs
   jobs.<job_id>:
     runs-on: ubuntu-latest|macos-latest|windows-latest|self-hosted
     needs: [job_id]
     if: expression
     environment: string
     permissions:
       <permission>: read|write|none
     concurrency:
       group: string|expression
       cancel-in-progress: boolean
     container:
       image: string
       credentials: {username: string,password: string}
       env: {VAR:string}
       ports: [string]
       volumes: [string]
       options: string
     services:
       id:
         image: string
         credentials: {username:string,password:string}
         env: {VAR:string}
         ports: [string]
         volumes: [string]
         options: string
     defaults.run:
       shell: bash|pwsh|cmd|sh|python
       working-directory: string
     timeout-minutes: integer
     strategy:
       matrix: {key:[values], include:[map], exclude:[map]}
       fail-fast: boolean
       max-parallel: integer
     continue-on-error: boolean

4  Steps
   - id: string
     name: string
     if: expression
     uses: action@version | path
     run: command
     shell: bash|pwsh|cmd|sh|python
     working-directory: string
     with: {input:value, entrypoint:string, args:string}
     env: {VAR:value}
     continue-on-error: boolean
     timeout-minutes: integer

5  Defaults
   defaults:
     run:
       shell: bash|pwsh|...  
       working-directory: path

6  Permissions
   permissions: read-all|write-all|{}
   map: actions, attestations, checks, contents, deployments, id-token, issues, models, discussions, packages, pages, pull-requests, security-events, statuses
   values: read|write|none

7  Env Variables
   workflow-level:
     env: {VAR:value}
   job-level:
     jobs.id.env: {VAR:value}
   step-level:
     steps.env: {VAR:value}

8  Concurrency
   concurrency:
     group: expression
     cancel-in-progress: boolean

## Original Source
GitHub Actions Workflow Syntax
https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions

## Digest of WORKFLOW_SYNTAX

# on
Define events that trigger workflows

Supported top-level events: push, pull_request, schedule, workflow_dispatch, workflow_call, workflow_run

on: push | pull_request | pull_request_target | schedule | workflow_dispatch | workflow_call | workflow_run

Filters under on.<event>:
  branches:     array of string glob patterns
  branches-ignore: array of string glob patterns
  tags:         array of string glob patterns
  tags-ignore:  array of string glob patterns
  paths:        array of string glob patterns
  paths-ignore: array of string glob patterns
  types:        array of string activity types for events that support types
  workflows:    array of string workflow names for workflow_run
  cron:         string POSIX cron expression (for schedule event)

Examples:
on:
  push:
    branches:
      - main
      - 'releases/**'
    tags-ignore:
      - 'v1.*'

on:
  pull_request:
    types:
      - opened
      - synchronize
    branches-ignore:
      - 'experimental/**'

on:
  schedule:
    - cron: '0 0 * * *'


# jobs
Define parallel or sequential tasks

jobs:
  <job_id>:
    runs-on: ubuntu-latest | macos-latest | windows-latest | self-hosted labels
    needs: [<job_id>]            # list of dependencies
    if: <expression>             # conditional execution
    permissions:                 # override GITHUB_TOKEN scopes
      <permission>: read|write|none
    environment: <name>          # environment name
    concurrency:                 # job-level concurrency
      group: <string|expression>
      cancel-in-progress: true|false
    container:                   # run job in container
      image: <string>
      credentials:
        username: <string>
        password: <string>
      env:
        <VAR>: <value>
      ports:
        - <host:container>
      volumes:
        - <host:container>
      options: <string>
    services:
      <service_id>:
        image: <string>
        credentials:
          username: <string>
          password: <string>
        env:
          <VAR>: <value>
        ports:
          - <host:container>
        volumes:
          - <host:container>
        options: <string>
    defaults:
      run:
        shell: bash|pwsh|cmd|sh|python
        working-directory: <path>
    steps:
      - id: <id>
        name: <string>
        if: <expression>
        uses: <action>@<version> | <path>
        run: <shell command>
        shell: bash|pwsh|cmd|sh|python
        working-directory: <path>
        with:
          <input>: <value>
          entrypoint: <string>
          args: <string>
        env:
          <VAR>: <value>
        continue-on-error: true|false
        timeout-minutes: <integer>
    timeout-minutes: <integer>
    strategy:
      matrix:
        <key>:
          - <values>
        include:
          - <matrix combinations>
        exclude:
          - <matrix combinations>
      fail-fast: true|false
      max-parallel: <integer>
    continue-on-error: true|false


# permissions
Modify default GITHUB_TOKEN scopes

permissions: read-all | write-all | {} | map of scopes

Available scopes and default values:
  actions: none
  attestations: none
  checks: none
  contents: none
  deployments: none
  id-token: none
  issues: none
  models: none
  discussions: none
  packages: none
  pages: none
  pull-requests: none
  security-events: none
  statuses: none

Examples:
permissions: read-all

permissions:
  contents: write
  issues: read
  id-token: write


# defaults
Apply default settings for run steps

defaults:
  run:
    shell: bash
    working-directory: ./scripts

# env
Define environment variables

env:
  GLOBAL_VAR: production

jobs:
  job1:
    env:
      JOB_VAR: staging
    steps:
      - name: step1
        env:
          STEP_VAR: testing
        run: echo "$STEP_VAR"

# concurrency
Limit concurrent jobs or workflows

concurrency:
  group: <string|expression>
  cancel-in-progress: true|false

Examples:
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true


## Attribution
- Source: GitHub Actions Workflow Syntax
- URL: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions
- License: License
- Crawl Date: 2025-05-10T04:57:50.365Z
- Data Size: 4127087 bytes
- Links Found: 30320

## Retrieved
2025-05-10
sandbox/library/DEPENDABOT_VERSION_UPDATES.md
# sandbox/library/DEPENDABOT_VERSION_UPDATES.md
# DEPENDABOT_VERSION_UPDATES

## Crawl Summary
dependabot.yml schema version 2 with updates blocks: defining package-ecosystem, directory, schedule (interval/day/time/timezone), open-pull-requests-limit (default 5), rebase-strategy (auto), commit-message (prefix/include), labels, assignees, reviewers, allow/ignore rules with dependency-type/update-type, versioning-strategy options, commit-body, milestones. Scheduling supports daily/weekly/monthly with IANA timezones. Filtering via allow/ignore. PR customization via labels, assignees, reviewers, commit-message, milestones. Optimizations: limit concurrent PRs, auto-rebase, batch updates.

## Normalised Extract
Table of Contents:

1. Schema Definition
2. Update Block Fields
3. Scheduling
4. Filtering Dependencies
5. PR Customization
6. Optimization Options

1. Schema Definition
   version: 2
   updates: array of update configurations

2. Update Block Fields
   package-ecosystem: npm, maven, bundler, pip, gradle, docker, etc.
   directory: path to manifest/lock, e.g. "/"
   versioning-strategy: increase, widen, lockfile-only, increase-if-necessary
   open-pull-requests-limit: integer 1–10, default 5
   rebase-strategy: auto, disabled
   commit-message.prefix: text before update summary
   commit-message.include: scope, scope_and_prefix, none

3. Scheduling
   schedule.interval: daily, weekly, monthly
   schedule.day: monday through sunday (required if interval=weekly)
   schedule.time: UTC HH:MM
   schedule.timezone: IANA TZ (e.g. America/Los_Angeles) default UTC

4. Filtering Dependencies
   allow: list of rules {dependency-type: all|direct|indirect, update-type: version-update|security|digest}
   ignore: list of rules {dependency-name, versions: [...], update-types: [...]}

5. PR Customization
   labels: [string]
   assignees: [username]
   reviewers: [username]
   milestones: milestone_number

6. Optimization Options
   open-pull-requests-limit
   rebase-strategy

Example dependabot.yml snippet:
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
      day: monday
      time: "04:00"
      timezone: "America/Los_Angeles"
    open-pull-requests-limit: 5
    rebase-strategy: auto
    commit-message:
      prefix: chore(deps)
      include: scope_and_prefix
    labels:
      - dependencies
    reviewers:
      - bot-account
    allow:
      - dependency-type: direct
        update-type: version-update
    ignore:
      - dependency-name: left-pad
        versions: [ "1.1.3" ]
        update-types: [ security ]

## Supplementary Details
Configuration Options:
- version: fixed value 2
- schedule.interval defaults to weekly if not specified
- schedule.day required for weekly
- open-pull-requests-limit: default 5, max 10
- rebase-strategy: auto rebase every 24h, disabled to require manual rebases
- commit-message.include: scope_and_prefix recommended
- versioning-strategy: use increase-if-necessary for lockfile-only updates
- allow/ignore: process in order; allow first then ignore to override

Implementation Steps:
1. Create .github/dependabot.yml in default branch
2. Add version: 2 block
3. Define updates array per ecosystem/directory
4. Customize schedule, filters, PR settings
5. Commit and push; GitHub triggers initial run within 60min
6. Monitor pull requests under ‘Dependabot’ in ‘Security’ tab

Behavior:
- Dependabot will open PRs up to the open-pull-requests-limit then pause
- Auto-rebase will rebase stale PRs every 24h if enabled
- Ignored dependencies skip PR generation



## Reference Details
Dependabot config schema version 2:

Field Definitions:
- version (integer): Must be 2
- updates (array): Each element must include:
  • package-ecosystem (string, required): Supported: npm, yarn, pip, etc.
  • directory (string, required): Path to manifest/lock
  • schedule (object, required): interval (string), optional day, time, timezone
      – interval: daily|weekly|monthly
      – day: monday|tuesday|... (if weekly)
      – time: "HH:MM" 24h UTC or timezone-local
      – timezone: IANA tz or omitted (UTC)
  • open-pull-requests-limit (integer, default=5)
  • rebase-strategy (string, default=auto): auto|disabled
  • versioning-strategy (string, default=increase): increase|widen|lockfile-only|increase-if-necessary
  • commit-message (object): prefix (string), include (scope|scope_and_prefix|none)
  • labels (array[string]): applied to PRs
  • assignees (array[string]): GitHub usernames
  • reviewers (array[string]): GitHub usernames
  • milestones (integer): GitHub milestone number
  • allow (array[object]): dependency-type: all|direct|indirect, update-type: version-update|security|digest
  • ignore (array[object]): dependency-name (string), versions (array[string]), update-types (array[string])

Best Practices:
- Use weekly schedule with timezone matching team’s business hours
- Limit open-pull-requests-limit to 3–5 to reduce noise
- Use allow rules for direct dependencies only to minimize trivial updates
- Combine labels and assignees to route PR review automatically
- Set versioning-strategy to increase-if-necessary for minimal churn

Troubleshooting:
- If no PRs appear: verify dependabot.yml syntax via GitHub UI (Settings > Security > Dependabot alerts)
- Check dependency graph is enabled (Settings > Code security > Dependency graph)
- Review logs: repository Actions tab filter on 'dependabot' workflow run logs
- CLI: gh api repos/{owner}/{repo}/dependabot/alerts --jq '.'
- Validate config: gh api repos/{owner}/{repo}/dependabot/config



## Information Dense Extract
dependabot.yml schema version 2; key fields: package-ecosystem, directory, schedule(interval{daily|weekly|monthly},day,time,timezone), open-pull-requests-limit(1–10, default5), rebase-strategy(auto|disabled), versioning-strategy(increase|widen|lockfile-only|increase-if-necessary), commit-message(prefix,include{scope|scope_and_prefix|none}), labels[], assignees[], reviewers[], milestones(int), allow[{dependency-type(all|direct|indirect),update-type(version-update|security|digest)}], ignore[{dependency-name,versions[],update-types[]}]. Best practices: weekly at team TZ, limit PRs to5, allow direct updates, auto-rebase enabled, versioning increase-if-necessary. Troubleshoot via GitHub UI validation, enable dependency graph, check Actions logs, use gh api endpoints.

## Sanitised Extract
Table of Contents:

1. Schema Definition
2. Update Block Fields
3. Scheduling
4. Filtering Dependencies
5. PR Customization
6. Optimization Options

1. Schema Definition
   version: 2
   updates: array of update configurations

2. Update Block Fields
   package-ecosystem: npm, maven, bundler, pip, gradle, docker, etc.
   directory: path to manifest/lock, e.g. '/'
   versioning-strategy: increase, widen, lockfile-only, increase-if-necessary
   open-pull-requests-limit: integer 110, default 5
   rebase-strategy: auto, disabled
   commit-message.prefix: text before update summary
   commit-message.include: scope, scope_and_prefix, none

3. Scheduling
   schedule.interval: daily, weekly, monthly
   schedule.day: monday through sunday (required if interval=weekly)
   schedule.time: UTC HH:MM
   schedule.timezone: IANA TZ (e.g. America/Los_Angeles) default UTC

4. Filtering Dependencies
   allow: list of rules {dependency-type: all|direct|indirect, update-type: version-update|security|digest}
   ignore: list of rules {dependency-name, versions: [...], update-types: [...]}

5. PR Customization
   labels: [string]
   assignees: [username]
   reviewers: [username]
   milestones: milestone_number

6. Optimization Options
   open-pull-requests-limit
   rebase-strategy

Example dependabot.yml snippet:
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
      day: monday
      time: '04:00'
      timezone: 'America/Los_Angeles'
    open-pull-requests-limit: 5
    rebase-strategy: auto
    commit-message:
      prefix: chore(deps)
      include: scope_and_prefix
    labels:
      - dependencies
    reviewers:
      - bot-account
    allow:
      - dependency-type: direct
        update-type: version-update
    ignore:
      - dependency-name: left-pad
        versions: [ '1.1.3' ]
        update-types: [ security ]

## Original Source
Dependabot – Auto-updating Dependencies
https://docs.github.com/en/code-security/supply-chain-security/keeping-your-dependencies-updated-automatically

## Digest of DEPENDABOT_VERSION_UPDATES

# DEPENDABOT VERSION UPDATES

Retrieved: 2024-06-15
Source: GitHub Docs – Keeping your dependencies updated automatically with Dependabot version updates
Data Size: 178149 bytes

## Configuring dependabot.yml

- **location**: /.github/dependabot.yml
- **schema_version**: 2
- **updates**: List of update blocks specifying ecosystems and directories.

### dependabot.yml schema (version 2)

```yaml
version: 2
updates:
  - package-ecosystem: <ecosystem>
    directory: <path>
    schedule:
      interval: <daily|weekly|monthly>
      day: <monday|...|sunday>         # optional for weekly
      time: "HH:MM"                   # UTC HH:MM, optional
      timezone: <TZ database name>      # optional, default UTC
    open-pull-requests-limit: <integer>  # default 5
    rebase-strategy: <auto|disabled>     # default auto
    commit-message:
      prefix: <string>                  # default "chore"
      include: <scope|scope_and_prefix|none>
    labels:
      - <label-name>
    assignees:
      - <username>
    reviewers:
      - <username>
    allow:
      - dependency-type: <all|direct|indirect>
        update-type: <version-update|security|digest>
    ignore:
      - dependency-name: <package>
        versions: [<version>,...]
        update-types: [<version-update|security|digest>]
    versioning-strategy: <increase|lockfile-only|widen|increase-if-necessary>
    commit-body:
      include: true                   # include diff/changelog
    milestones: <number>              # target milestone number for PRs
``` 

## Core fields and defaults

1. package-ecosystem: npm, maven, pip, docker, etc.
2. directory: repository path where manifest/lock resides.
3. schedule.interval: daily, weekly, monthly. Weekly requires day.
4. open-pull-requests-limit: cap concurrent PRs (max 10).
5. rebase-strategy: auto rebases stale PRs.
6. commit-message.prefix: custom PR title prefix.
7. allow/ignore: include or exclude dependencies by type.
8. versioning-strategy: controls version bump method.

## Customizing pull requests

- Labels: auto-apply labels on PRs.
- Assignees & reviewers: direct assignments.
- Commit messages: prefix and inclusion of change details.
- Milestones: tag PRs against GitHub milestones.

## Filtering updates

- allow.dependency-type: restrict to direct or indirect deps.
- ignore.dependency-name: skip specific packages or versions.

## Scheduling and timezones

- timezone: use IANA TZ names to align with working hours.
- time: specify UTC or timezone-local HH:MM.

## Optimizing PR creation

- open-pull-requests-limit to avoid noise.
- rebasing reduces stale PRs.
- batching updates by increasing interval.



## Attribution
- Source: Dependabot – Auto-updating Dependencies
- URL: https://docs.github.com/en/code-security/supply-chain-security/keeping-your-dependencies-updated-automatically
- License: License
- Crawl Date: 2025-05-10T00:38:04.149Z
- Data Size: 178149 bytes
- Links Found: 12050

## Retrieved
2025-05-10
