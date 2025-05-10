# REUSABLE_WORKFLOWS

## Crawl Summary
on.workflow_call trigger required; define inputs(security and type) and secrets(required flag); caller jobs use 'uses' syntax with owner/repo/.github/workflows/{file}@ref or local path; allowed job keys: name, uses, with, secrets, strategy, needs, if, concurrency, permissions; matrix strategy supports reusable workflows; nesting depth max 4; pass outputs via job and workflow outputs mapping; GitHub-hosted runners execute in caller context; self-hosted runners accessible under same org; max 20 workflows per caller; env contexts not propagated; GITHUB_ENV not supported for passing values; subdirs under .github/workflows disallowed; use commit SHA for stability; redirects unsupported; GITHUB_TOKEN permissions restricted.

## Normalised Extract
Table of Contents 1 Creating reusable workflows 2 Defining inputs and secrets 3 Calling reusable workflows 4 Matrix strategy 5 Nesting workflows 6 Passing outputs 7 Runner contexts 8 Permissions and access 9 Limitations

1 Creating reusable workflows
Location: .github/workflows/{filename}.yml
Trigger: on.workflow_call

2 Defining inputs and secrets
on.workflow_call.inputs.<id>.required: true|false
on.workflow_call.inputs.<id>.type: string|boolean|number
on.workflow_call.secrets.<id>.required: true|false

3 Calling reusable workflows
jobs.<job_id>.uses: owner/repo/.github/workflows/{file}@ref or ./.github/workflows/{file}
jobs.<job_id>.with.<input_id>: <value>
jobs.<job_id>.secrets.<secret_id>: ${{ secrets.<source> }}
Allowed jobs keys: name, uses, with, secrets, strategy, needs, if, concurrency, permissions

4 Matrix strategy
jobs.<job_id>.strategy.matrix.<key>: [v1,v2,...]
jobs.<job_id>.uses: <owner>/<repo>/.github/workflows/{file}@ref
jobs.<job_id>.with.<input_id>: ${{ matrix.<key> }}

5 Nesting workflows
Max depth: 4 levels
No loops
Secrets passed only to immediate child or use inherit

6 Passing outputs
In called workflow: define on.workflow_call.outputs.<out_id>.value: ${{ jobs.<job>.outputs.<job_out> }}
jobs.<job>.outputs.<job_out>: ${{ steps.<step>.outputs.<step_out> }}
steps.<step>.run: echo step_out=value >> $GITHUB_OUTPUT
In caller: needs.<job>.outputs.<out_id>

7 Runner contexts
GitHub-hosted: uses caller context, billing, no access to called repo runners
Self-hosted: accessible if in caller repo or made available to it

8 Permissions and access
Caller repo Actions settings must allow reusable workflows
github.token and secrets.GITHUB_TOKEN auto granted
GITHUB_TOKEN permissions cannot be elevated

9 Limitations
Max 20 unique workflows per caller
env contexts not propagated use outputs or vars context
GITHUB_ENV cannot pass values to caller job steps
Subdirectories under workflows directory not supported
Redirects unsupported

## Supplementary Details
- File placement: only .github/workflows root directory accepted - no subdirectories allowed
- Ref syntax: owner/repo/.github/workflows/{file}@{ref}, where ref = commit SHA, tag, or branch; commit SHA recommended
- Local reuse: ./.github/workflows/{file} must exist in same commit; no ref prefixes or expressions
- Secrets inheritance: jobs.<id>.secrets: inherit passes all caller secrets; explicit list passes only those named
- Env contexts: org/repo/env-level vars via vars context: vars.<id>
- Concurrency caveat: do not reuse same concurrency.group value in caller and called when cancel-in-progress = true
- Redirects unsupported: changing repo or action name breaks workflows
- Access control: private called workflows require called repo Access policy to allow caller repo
- Dependency graph listing available in GitHub UI and via REST API


## Reference Details
YAML schema for reusable workflows

on.workflow_call:
  inputs:
    <input_id>:
      description: string
      required: boolean
      type: string|boolean|number
  secrets:
    <secret_id>:
      description: string
      required: boolean
  outputs:
    <output_id>:
      description: string
      value: ${{ jobs.<job>.outputs.<job_output> }}

jobs:<job_id>:
  name: string           # optional
  uses: string          # required: owner/repo/.github/workflows/{file}@ref or local path
  with:
    <input_id>: string|boolean|number
  secrets:
    <secret_id>: string|inherit
  strategy:
    matrix:
      <key>: list<string|number|boolean>
  needs: list<string>
  if: expression
  concurrency:
    group: string
    cancel-in-progress: boolean
  permissions:
    <scope>: read|write

Code example: reusable workflow
name: triage-workflow
on:
  workflow_call:
    inputs:
      config-path:
        required: true
        type: string
    secrets:
      token:
        required: true
jobs:
  triage:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/labeler@v4
        with:
          repo-token: ${{ secrets.token }}
          configuration-path: ${{ inputs.config-path }}

Caller workflow example
name: call-triage
on:
  pull_request:
    branches: [main]
jobs:
  call-triage:
    uses: my-org/my-repo/.github/workflows/triage-workflow.yml@c0mm1tsh4
    with:
      config-path: .github/labeler.yml
    secrets:
      token: ${{ secrets.GITHUB_TOKEN }}

Troubleshooting
- Invalid trigger error: ensure on.workflow_call is present
- Access denied: verify Actions settings on both caller and called repos and Access policy
- Max nesting exceeded: restructure to reduce depth below 4
- Workflow fails after repo rename: update uses refs or commit SHAs; redirects unsupported
- Matrix output mismatch: last successful job output applied


## Information Dense Extract
on.workflow_call required; define inputs.<id> {required:boolean,type:string|boolean|number}; define secrets.<id> {required:boolean}; define outputs.<id>.value ${{ jobs.<job>.outputs.<job_out> }}; place reusable workflows in .github/workflows; call with jobs.<job>.uses: owner/repo/.github/workflows/{file}@ref or ./.github/workflows/{file}; pass inputs via with, secrets via secrets or inherit; supported job keys: name,uses,with,secrets,strategy,needs,if,concurrency,permissions; max nesting=4; max unique calls=20; env contexts not propagated; use vars context; GITHUB_ENV not for caller steps; matrix strategy supports reusable workflows via strategy.matrix; GitHub-hosted runners use caller context; self-hosted accessible if same org/repo; GITHUB_TOKEN permissions only restricted; recommend pin by SHA; redirects unsupported

## Sanitised Extract
Table of Contents 1 Creating reusable workflows 2 Defining inputs and secrets 3 Calling reusable workflows 4 Matrix strategy 5 Nesting workflows 6 Passing outputs 7 Runner contexts 8 Permissions and access 9 Limitations

1 Creating reusable workflows
Location: .github/workflows/{filename}.yml
Trigger: on.workflow_call

2 Defining inputs and secrets
on.workflow_call.inputs.<id>.required: true|false
on.workflow_call.inputs.<id>.type: string|boolean|number
on.workflow_call.secrets.<id>.required: true|false

3 Calling reusable workflows
jobs.<job_id>.uses: owner/repo/.github/workflows/{file}@ref or ./.github/workflows/{file}
jobs.<job_id>.with.<input_id>: <value>
jobs.<job_id>.secrets.<secret_id>: ${{ secrets.<source> }}
Allowed jobs keys: name, uses, with, secrets, strategy, needs, if, concurrency, permissions

4 Matrix strategy
jobs.<job_id>.strategy.matrix.<key>: [v1,v2,...]
jobs.<job_id>.uses: <owner>/<repo>/.github/workflows/{file}@ref
jobs.<job_id>.with.<input_id>: ${{ matrix.<key> }}

5 Nesting workflows
Max depth: 4 levels
No loops
Secrets passed only to immediate child or use inherit

6 Passing outputs
In called workflow: define on.workflow_call.outputs.<out_id>.value: ${{ jobs.<job>.outputs.<job_out> }}
jobs.<job>.outputs.<job_out>: ${{ steps.<step>.outputs.<step_out> }}
steps.<step>.run: echo step_out=value >> $GITHUB_OUTPUT
In caller: needs.<job>.outputs.<out_id>

7 Runner contexts
GitHub-hosted: uses caller context, billing, no access to called repo runners
Self-hosted: accessible if in caller repo or made available to it

8 Permissions and access
Caller repo Actions settings must allow reusable workflows
github.token and secrets.GITHUB_TOKEN auto granted
GITHUB_TOKEN permissions cannot be elevated

9 Limitations
Max 20 unique workflows per caller
env contexts not propagated use outputs or vars context
GITHUB_ENV cannot pass values to caller job steps
Subdirectories under workflows directory not supported
Redirects unsupported

## Original Source
Reusing Workflows in GitHub Actions
https://docs.github.com/en/actions/using-workflows/reusing-workflows

## Digest of REUSABLE_WORKFLOWS

# Reusable Workflows

## Creating a reusable workflow

Location: .github/workflows/{filename}.yml
Required trigger:
```
on:
  workflow_call:
```

## Defining inputs and secrets

In the called workflow under on.workflow_call:
```
inputs:
  <input_id>:
    required: true|false
    type: string|boolean|number
secrets:
  <secret_id>:
    required: true|false
```

## Calling a reusable workflow

In the caller workflow jobs section:
```
jobs:
  <job_id>:
    uses: <owner>/<repo>/.github/workflows/{filename}@<ref>
    with:
      <input_id>: <value>
    secrets:
      <secret_id>: ${{ secrets.<secret_source> }}
```
Allowed job keywords: name, uses, with, secrets, strategy, needs, if, concurrency, permissions.

## Using a matrix strategy

```
jobs:
  <job_id>:
    strategy:
      matrix:
        <key>: [v1, v2, v3]
    uses: <owner>/<repo>/.github/workflows/{filename}@<ref>
    with:
      <input_id>: ${{ matrix.<key> }}
```

## Nesting reusable workflows

Maximum depth: 4 levels (caller + 3 nested). Loops are disallowed.

## Passing outputs

In called workflow:
```
on:
  workflow_call:
    outputs:
      <out_id>:
        description: <text>
        value: ${{ jobs.<job>.outputs.<job_out> }}
jobs:
  <job>:
    outputs:
      <job_out>: ${{ steps.<step>.outputs.<step_out> }}
    steps:
      - id: <step>
        run: echo '<step_out>=<value>' >> $GITHUB_OUTPUT
```
In caller:
```
needs: <job1>
steps:
  - run: echo ${{ needs.<job1>.outputs.<out_id> }}
```

## Access, runners and permissions

- Access table by repository visibility and settings
- GitHub-hosted runners use caller context and billing
- Self-hosted runners accessible if owned by same org or repo
- GITHUB_TOKEN permissions can only be downgraded in called workflows
- Actions settings must enable reusable workflows

## Limitations

- Max 20 unique reusable workflows per top-level workflow (includes nested)
- Env context at workflow or job level is not propagated; use outputs or vars context
- GITHUB_ENV cannot be used to pass values in caller job steps
- Subdirectories under workflows are not supported
- Redirects are not supported


## Attribution
- Source: Reusing Workflows in GitHub Actions
- URL: https://docs.github.com/en/actions/using-workflows/reusing-workflows
- License: License: CC BY 4.0
- Crawl Date: 2025-05-10T12:31:24.279Z
- Data Size: 416994 bytes
- Links Found: 6559

## Retrieved
2025-05-10
