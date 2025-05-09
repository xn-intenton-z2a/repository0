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
