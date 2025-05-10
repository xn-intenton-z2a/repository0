# REUSABLE_WORKFLOWS

## Crawl Summary
on.workflow_call trigger required; define inputs under on.workflow_call.inputs with type string|boolean|number and required flag; define secrets under on.workflow_call.secrets; call reusable workflow in jobs.<id>.uses syntax with repo path and ref; pass inputs via with: <input>: value; pass secrets via secrets: <secret>: ${{ secrets.X }} or secrets: inherit; supports matrix strategy by combining strategy.matrix and uses; maximum nest depth 4 levels; maximum 20 unique workflows per caller; env vars in workflow-level env contexts not propagated; use vars context for cross-workflow variables; GitHub-hosted runners billed and evaluated in caller context; self-hosted runners accessible from caller org; supported job keywords limited to name, uses, with, secrets, strategy, needs, if, concurrency, permissions; outputs mapped from steps to job to workflow and consumed with needs.job.outputs; re-run semantics differ for full vs partial re-runs; redirects unsupported resulting in failure.

## Normalised Extract
Table of Contents:
 1 Access Control
 2 Runner Assignment
 3 Workflow Call Event
 4 Inputs & Secrets Definition
 5 Invoking Reusable Workflows
 6 Matrix Strategy
 7 Supported Job Keywords
 8 Nesting Workflows
 9 Output Mapping
 10 Re-run Semantics

1 Access Control
  Conditions:
    • Same repo
    • Public repo with org permission
    • Private repo with explicit access policy

2 Runner Assignment
  GitHub-hosted:
    • runs-on evaluated in caller context
    • billing to caller
  Self-hosted:
    • accessible if in caller repo or org-provided

3 Workflow Call Event
  Syntax:
    on:
      workflow_call:

4 Inputs & Secrets Definition
  on.workflow_call.inputs:
    <id>:
      required: true|false
      type: string|boolean|number
  on.workflow_call.secrets:
    <id>:
      required: true|false

5 Invoking Reusable Workflows
  jobs.<job_id>.uses: owner/repo/.github/workflows/file@ref or ./.github/workflows/file
  jobs.<job_id>.with:<input_id>: ${ inputs }  
  jobs.<job_id>.secrets:<secret_id>: ${{ secrets }} or inherit

6 Matrix Strategy
  strategy.matrix:<key>: [values]
  uses and with accept matrix expressions

7 Supported Job Keywords
  name, uses, with, secrets, strategy, needs, if, concurrency, permissions

8 Nesting Workflows
  Maximum depth: 4 levels
  Secrets pass only one level at a time (inherit or explicit per job)

9 Output Mapping
  Step-level to job-level:
    steps:
      - id: s
        run: echo "key=value" >> $GITHUB_OUTPUT
    outputs:
      o: ${{ steps.s.outputs.key }}
  Job-level to workflow-level:
    on.workflow_call.outputs:<id>.value: ${ jobs.<job>.outputs.o }
  Consumption in caller:
    needs.<job>.outputs.<id>

10 Re-run Semantics
  Full re-run uses latest ref when not SHA
  Failed/specific job re-run uses original commit SHA

## Supplementary Details
Inputs:
  Type options: string (quoted YAML), boolean (true|false), number (integer|float)
  Required defaults to false
Secrets:
  Must be defined under on.workflow_call.secrets
  Cannot pass environment secrets via workflow_call
Refs:
  Use SHA for stability; tags override branches of same name
Env Variables:
  Workflow-level env contexts not shared; use outputs or vars context
Limits:
  Nest depth = 4; count includes top-level caller as level 1
  Unique workflows per file ≤ 20 (includes nested counts)
Permissions:
  Default GITHUB_TOKEN permissions apply if jobs.<id>.permissions omitted
  Called workflow can only reduce (not elevate) GITHUB_TOKEN permissions
Concurrency:
  Use distinct concurrency.group values in caller and called to avoid self-cancellation

Implementation Steps:
 1 Create `.github/workflows/reusable.yml` with on.workflow_call
 2 Define inputs and secrets under workflow_call
 3 Reference inputs/secrets in job steps using ${{ inputs.X }} and ${{ secrets.Y }}
 4 In calling workflow, add job with uses pointing to reusable.yml@ref
 5 Pass inputs via with:, secrets via secrets: or inherit
 6 For matrices, include strategy.matrix alongside uses
 7 Map and expose outputs in reusable; consume via needs in caller


## Reference Details
Complete Keywords and Structure:
```yaml
on:
  workflow_call:
    inputs:
      <input_id>:
        required: true|false
        type: string|boolean|number
    secrets:
      <secret_id>:
        required: true|false
    outputs:
      <output_id>:
        description: "text"
        value: ${{ jobs.<job>.outputs.<job_output> }}
jobs:
  <job_id>:
    name: <string>
    runs-on: <runner_label>
    needs: [<other_job_ids>]
    if: <expression>
    uses: owner/repo/.github/workflows/<file>.yml@<ref>
    with:
      <input_id>: <value>
    secrets:
      <secret_id>: ${{ secrets.<secret> }}
    secrets: inherit
    strategy:
      matrix:
        <key>: [<values>]
    concurrency:
      group: <string>
      cancel-in-progress: true|false
    permissions:
      <scope>: read|write
```
Example Reusable Workflow:
```yaml
name: Labeler Reusable
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
      - uses: actions/checkout@v3
      - uses: actions/labeler@v4
        with:
          repo-token: ${{ secrets.token }}
          configuration-path: ${{ inputs.config-path }}
```
Example Caller Workflow:
```yaml
name: Call Labeler
on: [pull_request]
jobs:
  label-job:
    uses: octo-org/repo/.github/workflows/labeler.yml@main
    with:
      config-path: .github/labeler.yml
    secrets:
      token: ${{ secrets.GITHUB_TOKEN }}
```
Matrix Invocation:
```yaml
jobs:
  matrix-deploy:
    strategy:
      matrix:
        env: [dev,stage,prod]
    uses: org/repo/.github/workflows/deploy.yml@v2
    with:
      target-env: ${{ matrix.env }}
```
Output Mapping in Reusable:
```yaml
on:
  workflow_call:
    outputs:
      result:
        value: ${{ jobs.build.outputs.build_id }}
jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      build_id: ${{ steps.setid.outputs.id }}
    steps:
      - id: setid
        run: echo "id=12345" >> $GITHUB_OUTPUT
```
Consume Outputs:
```yaml
jobs:
  generate:
    uses: org/repo/.github/workflows/build.yml@v1
  report:
    runs-on: ubuntu-latest
    needs: generate
    steps:
      - run: echo ${{ needs.generate.outputs.result }}
```
Best Practices:
- Pin reusable workflows to commit SHA for stability.
- Define minimal permissions in caller jobs to adhere to least privilege.
- Use concurrency.group to prevent overlapping runs.
- Use secrets: inherit for same-org workflows when passing all secrets.
Troubleshooting:
- Error "could not resolve action": verify owner/repo and ref existence.
- Permission denied on calling workflow: check repo Settings > Actions > General > Allow select actions and reusable workflows.
- Rerun fails due to ref drift: use pinned SHA or tag.
- Nested call inaccessible: ensure each repository has access policy granting caller.


## Information Dense Extract
on.workflow_call trigger with inputs(id,type,required),secrets(id,required),outputs(id,description,value);jobs.<id>.uses syntax owner/repo/.github/workflows/file@ref or ./path (no refs/heads);with.<input_id>:value,secrets.<secret_id>:$GITHUB_TOKEN or inherit;strategy.matrix for multi-run;max depth=4,max unique=20;env contexts not shared,use vars;GitHub-hosted runners billed in caller context,self-hosted from caller repo/org;supported job keywords(name,uses,with,secrets,strategy,needs,if,concurrency,permissions);outputs: map step->job->workflow then needs.<job>.outputs;rerun semantics: full uses latest ref if non-SHA,partial uses original SHA;no redirects;permissions can only be downgraded.

## Sanitised Extract
Table of Contents:
 1 Access Control
 2 Runner Assignment
 3 Workflow Call Event
 4 Inputs & Secrets Definition
 5 Invoking Reusable Workflows
 6 Matrix Strategy
 7 Supported Job Keywords
 8 Nesting Workflows
 9 Output Mapping
 10 Re-run Semantics

1 Access Control
  Conditions:
     Same repo
     Public repo with org permission
     Private repo with explicit access policy

2 Runner Assignment
  GitHub-hosted:
     runs-on evaluated in caller context
     billing to caller
  Self-hosted:
     accessible if in caller repo or org-provided

3 Workflow Call Event
  Syntax:
    on:
      workflow_call:

4 Inputs & Secrets Definition
  on.workflow_call.inputs:
    <id>:
      required: true|false
      type: string|boolean|number
  on.workflow_call.secrets:
    <id>:
      required: true|false

5 Invoking Reusable Workflows
  jobs.<job_id>.uses: owner/repo/.github/workflows/file@ref or ./.github/workflows/file
  jobs.<job_id>.with:<input_id>: ${ inputs }  
  jobs.<job_id>.secrets:<secret_id>: ${{ secrets }} or inherit

6 Matrix Strategy
  strategy.matrix:<key>: [values]
  uses and with accept matrix expressions

7 Supported Job Keywords
  name, uses, with, secrets, strategy, needs, if, concurrency, permissions

8 Nesting Workflows
  Maximum depth: 4 levels
  Secrets pass only one level at a time (inherit or explicit per job)

9 Output Mapping
  Step-level to job-level:
    steps:
      - id: s
        run: echo 'key=value' >> $GITHUB_OUTPUT
    outputs:
      o: ${{ steps.s.outputs.key }}
  Job-level to workflow-level:
    on.workflow_call.outputs:<id>.value: ${ jobs.<job>.outputs.o }
  Consumption in caller:
    needs.<job>.outputs.<id>

10 Re-run Semantics
  Full re-run uses latest ref when not SHA
  Failed/specific job re-run uses original commit SHA

## Original Source
Reusing Workflows in GitHub Actions
https://docs.github.com/en/actions/using-workflows/reusing-workflows

## Digest of REUSABLE_WORKFLOWS

# Retrieved: 2024-07-30

# Access to Reusable Workflows
A reusable workflow can be invoked if one of the following conditions is met:
- Caller and called workflows reside in the same repository.
- Called workflow is in a public repository and organization allows public reusable workflows.
- Called workflow is in a private repository with explicit access policy permitting the caller.

# Using Runners
## GitHub-hosted
- Assignment evaluated using caller context only.
- Billing associated with caller repository.
- Cannot use GitHub-hosted runners from the called repository.

## Self-hosted
- Called workflows in same user/org can access self-hosted runners in:
  • Caller repository
  • Caller repository’s organization (if made available)

# Limitations
- Maximum of 4 nested workflow levels (caller + 3 reusable).
- Maximum 20 unique reusable workflows per top-level workflow (includes nested trees).
- Workflow-level env variables in caller are not propagated to called workflows.
- Workflow-level env variables in called workflows are not accessible to caller.
- GITHUB_ENV cannot pass values from caller job to called job steps.
- Use "vars" context for cross-workflow variables at org/repo/environment level.

# Creating a Reusable Workflow
File location: `.github/workflows/<file>.yml`
Required trigger:
```yaml
on:
  workflow_call:
```

# Defining Inputs and Secrets
```yaml
on:
  workflow_call:
    inputs:
      config-path:
        required: true
        type: string
    secrets:
      personal_access_token:
        required: true
```
Reference within job steps:
```yaml
jobs:
  job1:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/labeler@v4
        with:
          repo-token: ${{ secrets.personal_access_token }}
          configuration-path: ${{ inputs.config-path }}
```

# Calling a Reusable Workflow
Within a job definition:
```yaml
jobs:
  deploy:
    uses: octo-org/repo/.github/workflows/reusable.yml@main
    with:
      config-path: .github/config.yml
    secrets:
      personal_access_token: ${{ secrets.PAT }}
```
Syntax options:
- `{owner}/{repo}/.github/workflows/{file}@{ref}`
- `./.github/workflows/{file}` (same repo, same commit)

# Matrix Strategy
```yaml
jobs:
  deploy-matrix:
    strategy:
      matrix:
        target: [dev,stage,prod]
    uses: octocat/octo-repo/.github/workflows/deployment.yml@v1
    with:
      target: ${{ matrix.target }}
```

# Supported Job Keywords
jobs.<job_id> may include only:
- name
- uses
- with, with.<input_id>
- secrets, secrets.<secret_id>, secrets: inherit
- strategy
- needs
- if
- concurrency
- permissions

# Nesting Reusable Workflows
Depth: up to 4 levels.
Example in called workflow:
```yaml
jobs:
  inner:
    uses: octo-org/repo/.github/workflows/another.yml@v1
```
Secrets propagate only one level at a time.

# Outputs from Reusable Workflows
Define job-level outputs:
```yaml
jobs:
  example_job:
    runs-on: ubuntu-latest
    outputs:
      o1: ${{ steps.s1.outputs.first }}
      o2: ${{ steps.s2.outputs.second }}
    steps:
      - id: s1
        run: echo "first=hello" >> $GITHUB_OUTPUT
      - id: s2
        run: echo "second=world" >> $GITHUB_OUTPUT
```
Map to workflow outputs:
```yaml
on:
  workflow_call:
    outputs:
      firstword:
        value: ${{ jobs.example_job.outputs.o1 }}
      secondword:
        value: ${{ jobs.example_job.outputs.o2 }}
```
Consume in caller:
```yaml
jobs:
  job2:
    needs: job1
    runs-on: ubuntu-latest
    steps:
      - run: echo ${{ needs.job1.outputs.firstword }} ${{ needs.job1.outputs.secondword }}
```

# Troubleshooting
- Redirects not supported: workflows fail if owner/name changes.
- Permission errors: ensure Actions settings permit reusable workflows and access policy on private repos.
- Re-run behavior:
  • Re-running all jobs uses latest ref if not SHA.
  • Re-running failed/specific jobs uses same SHA as first run.

# Attribution
Source: GitHub Actions "Reusing workflows" documentation
Data Size: 948149 bytes


## Attribution
- Source: Reusing Workflows in GitHub Actions
- URL: https://docs.github.com/en/actions/using-workflows/reusing-workflows
- License: License: CC BY 4.0
- Crawl Date: 2025-05-10T18:29:47.647Z
- Data Size: 948149 bytes
- Links Found: 16506

## Retrieved
2025-05-10
