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
