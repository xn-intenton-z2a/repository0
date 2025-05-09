# AGENTIC_LIB_WORKFLOWS

## Crawl Summary
Agentic-lib provides a set of reusable GitHub Actions workflows invoked via workflow_call. Core workflows: issue-creator (wfr-create-issue@1.2.0), issue-worker (wfr-select-issue@1.2.0, wfr-apply-issue-resolution@1.2.0, wfr-create-pr@1.2.0), automerge (wfr-automerge-*.yml@1.2.0), issue-reviewer (wfr-review-issue@1.2.0), library-worker (wfr-completion-maintain-library), source-worker (wfr-completion-maintain-sources), publish-web (wfr-github-publish-web). Each accepts typed inputs with defaults, exposes outputs. Chaining via needs.<job>.outputs.<param>. Configuration files (CONTRIBUTING.md, eslint.config.js) can override style and mission. AWS deployment uses CDK with assume-role trust policy and permissions policy, deploy via npx cdk deploy producing Lambda ARNs, SQS URLs, S3 bucket ARNs.

## Normalised Extract
Table of Contents

1 Setup
2 Workflow Invocation
3 Workflow Parameters
4 Chaining Workflows
5 Configuration Tuning
6 Issue Management Workflows
7 Reusable Workflows SDK
8 AWS Deployment

1 Setup
Clone https://github.com/xn-intenton-z2a/repository0
Install: npm install
test: npm test

2 Workflow Invocation
Use on: workflow_call or schedule or workflow_dispatch
jobs:
  create_issue:
    uses: xn-intenton-z2a/agentic-lib/.github/workflows/issue-creator.yml@main
    with:
      issueTitle: "Describe the task"

3 Workflow Parameters
issue-creator inputs:
  issueTitle string default "house choice"
issue-worker inputs:
  maxAttempts integer default 1
automerge inputs:
  mergeBranch string default "main"
  requiredLabels array default []
issue-reviewer inputs:
  reviewCriteria string default "fixed"

4 Chaining Workflows
Use needs.create_issue.outputs.newIssueNumber to pass issue number to issue-worker
job condition example: if needs.review.outputs.closed == 'true'

5 Configuration Tuning
CONTRIBUTING.md: custom mission
eslint.config.js: add rules
Override files: README.md, package.json, src/lib/main.js, tests/unit/main.test.js

6 Issue Management Workflows
issue-creator.yml -> creates new GitHub issue
issue-worker.yml -> selects issue, applies resolution, opens PR
automerge.yml -> finds PR, checks labels, merges when ready
issue-reviewer.yml -> reviews and closes issue when tests pass

7 Reusable Workflows SDK
Each workflow file under .github/workflows maps to a function
Inputs defined under with: section, outputs under outputs
Invoke with uses: and with: in calling workflow
Supports version pinning via @<tag>

8 AWS Deployment
AWS role: agentic-lib-deployment-role assume with sts assume-role
IAM trust policy allows sts:AssumeRole and sts:TagSession
Permissions policy: cloudformation, iam, s3, logs, lambda, dynamodb, sqs, sts
Commands:
  aws sts assume-role --role-arn <ARN> --role-session-name <name>
  export AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
  npx cdk deploy



## Supplementary Details
Agentic-lib reads agentic-lib.yml for parameters:
  schedule: schedule-2
  paths:
    missionFilepath: MISSION.md write none
    librarySourcesFilepath: sandbox/SOURCES.md write limit 16
    libraryDocumentsPath: sandbox/library write limit 64
    featuresPath: sandbox/features write limit 8
    contributingFilepath: CONTRIBUTING.md
    targetTestsPath: sandbox/tests write
    otherTestsPaths: tests/unit
    targetSourcePath: sandbox/source write
    otherSourcePaths: src/lib
    dependenciesFilepath: package.json write
    documentationPath: sandbox/docs write
    formattingFilepath: .prettierrc
    lintingFilepath: eslint.config.js
    readmeFilepath: README.md
  buildScript: npm run build
  testScript: npm test
  mainScript: npm run start
  featureDevelopmentIssuesWipLimit: 3
  maintenanceIssuesWipLimit: 3
  attemptsPerBranch: 2
  attemptsPerIssue: 1
  docRoot: public
  sandbox:
    sandboxReset: true
    sandboxPath: sandbox
  discussionBot seedDiscussionFilepath: SEED_DISCUSSION.md

## Reference Details
Example: Invoke Issue Creator
on:
  workflow_dispatch:
    inputs:
      issueTitle:
        description: 'Title for the new task'
        required: false
        default: 'house choice'
jobs:
  create_issue:
    uses: xn-intenton-z2a/agentic-lib/.github/workflows/issue-creator.yml@1.2.0
    with:
      issueTitle: ${{ github.event.inputs.issueTitle }}

Example: AWS Assume Role in GitHub Actions
steps:
  - name: Configure AWS Credentials
    uses: aws-actions/configure-aws-credentials@v4
    with:
      role-to-assume: arn:aws:iam::541134664601:role/agentic-lib-deployment-role
      aws-region: eu-west-2
  - name: Set up Node.js
    uses: actions/setup-node@v3
    with:
      node-version: '20'

IAM Trust Policy (agentic-lib-deployment-trust-policy.json):
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {"AWS": ["arn:aws:iam::541134664601:user/antony-local-user","arn:aws:iam::541134664601:role/agentic-lib-github-actions-role"]},
      "Action": "sts:AssumeRole"
    }
  ]
}

Assume Role CLI:
aws sts assume-role \
  --role-arn "$ROLE_ARN" \
  --role-session-name "$SESSION_NAME" \
  --output json

Troubleshooting:
If assume-role fails check trust policy. Use aws iam get-role to verify assume role policy. Confirm AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are unset before assume-role.

Example: CDK deploy commands
mvnw clean package
npx cdk deploy
Expected output contains AgenticLibStack.* outputs with ARNs and resource names



## Information Dense Extract
agentic-lib workflows invoked via workflow_call; core workflows: issue-creator, issue-worker, automerge, issue-reviewer, library-worker, source-worker, publish-web; each workflow inputs: typed parameters with defaults; outputs: status, ids; chaining via needs.<job>.outputs; config via agentic-lib.yml fields: schedule, paths, buildScript, testScript, mainScript, limits; AWS CDK deploy uses assume-role with trust policy and permissions policy, commands: aws sts assume-role, npx cdk deploy, outputs: LambdaArn, QueueUrl, BucketArn; cleanup: cdk destroy, aws logs delete-log-group.

## Sanitised Extract
Table of Contents

1 Setup
2 Workflow Invocation
3 Workflow Parameters
4 Chaining Workflows
5 Configuration Tuning
6 Issue Management Workflows
7 Reusable Workflows SDK
8 AWS Deployment

1 Setup
Clone https://github.com/xn-intenton-z2a/repository0
Install: npm install
test: npm test

2 Workflow Invocation
Use on: workflow_call or schedule or workflow_dispatch
jobs:
  create_issue:
    uses: xn-intenton-z2a/agentic-lib/.github/workflows/issue-creator.yml@main
    with:
      issueTitle: 'Describe the task'

3 Workflow Parameters
issue-creator inputs:
  issueTitle string default 'house choice'
issue-worker inputs:
  maxAttempts integer default 1
automerge inputs:
  mergeBranch string default 'main'
  requiredLabels array default []
issue-reviewer inputs:
  reviewCriteria string default 'fixed'

4 Chaining Workflows
Use needs.create_issue.outputs.newIssueNumber to pass issue number to issue-worker
job condition example: if needs.review.outputs.closed == 'true'

5 Configuration Tuning
CONTRIBUTING.md: custom mission
eslint.config.js: add rules
Override files: README.md, package.json, src/lib/main.js, tests/unit/main.test.js

6 Issue Management Workflows
issue-creator.yml -> creates new GitHub issue
issue-worker.yml -> selects issue, applies resolution, opens PR
automerge.yml -> finds PR, checks labels, merges when ready
issue-reviewer.yml -> reviews and closes issue when tests pass

7 Reusable Workflows SDK
Each workflow file under .github/workflows maps to a function
Inputs defined under with: section, outputs under outputs
Invoke with uses: and with: in calling workflow
Supports version pinning via @<tag>

8 AWS Deployment
AWS role: agentic-lib-deployment-role assume with sts assume-role
IAM trust policy allows sts:AssumeRole and sts:TagSession
Permissions policy: cloudformation, iam, s3, logs, lambda, dynamodb, sqs, sts
Commands:
  aws sts assume-role --role-arn <ARN> --role-session-name <name>
  export AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
  npx cdk deploy

## Original Source
intentïon-agentic-lib Workflows
https://github.com/xn-intenton-z2a/agentic-lib

## Digest of AGENTIC_LIB_WORKFLOWS

# Getting Started
Clone seed repository: git clone https://github.com/xn-intenton-z2a/repository0.git
cd repository0
Install dependencies: npm install
Trigger first workflow: on workflow_dispatch or schedule run Create Issue workflow by calling issue-creator.yml

# Development Workflows
## Create Issue (issue-creator.yml)
Trigger: workflow_call, workflow_dispatch, schedule
Reusable workflow: wfr-create-issue.yml@1.2.0
Inputs:
  issueTitle: string, required false, default 'house choice'
Outputs:
  newIssueNumber: number

## Issue Worker (issue-worker.yml)
Trigger: workflow_call, schedule
Reusable workflows:
  wfr-select-issue.yml@1.2.0
  wfr-apply-issue-resolution.yml@1.2.0
  wfr-create-pr.yml@1.2.0
Inputs:
  maxAttempts: integer default 1
Outputs:
  prNumber: number, resolutionStatus: string

## Automerge (automerge.yml)
Trigger: workflow_call, schedule
Reusable workflows:
  wfr-automerge-find-pr-from-pull-request.yml@1.2.0
  wfr-automerge-find-pr-in-check-suite.yml@1.2.0
  wfr-automerge-label-issue.yml@1.2.0
  wfr-automerge-merge-pr.yml@1.2.0
Inputs:
  mergeBranch: string default 'main'
  requiredLabels: array<string> default []

## Review Issue (issue-reviewer.yml)
Trigger: workflow_call, schedule
Reusable workflow: wfr-review-issue.yml@1.2.0
Inputs:
  reviewCriteria: string default 'fixed'
Outputs:
  closed: boolean

# Feature Chain Workflows
Library Worker:
  file: library-worker.yml
  reusable: wfr-completion-maintain-library.yml
Source Worker:
  file: source-worker.yml
  reusable: wfr-completion-maintain-sources.yml
Publish Web:
  file: publish-web.yml
  reusable: wfr-github-publish-web.yml

# Reusable Workflows SDK Integration
Each reusable workflow is invoked using uses: <repo>/.github/workflows/<file>@<version>
Workflow inputs map to parameters under with:
  versionIncrement: string
  buildScript: string
  issueTitle: string
Outputs exposed via steps.<id>.outputs

# Configuration Tuning
Agentic-lib reads the following config files if present:
  CONTRIBUTING.md (mission statement guidelines)
  eslint.config.js (ESLint rules)
Override defaults or blank out:
  README.md, package.json, src/lib/main.js, tests/unit/main.test.js

# Chaining Workflows
Use outputs from one workflow as inputs to another by referencing needs.<job>.outputs.<name>
Example: if Review Issue outputs fixed=true then automerge job condition if fixed == 'true'

# Repository Setup
Template includes top-level workflows under .github/workflows and .github/agentic-lib
Required secrets:
  CHATGPT_API_SECRET_KEY, GITHUB_TOKEN
Node.js v20+, AWS CLI, Java JDK11+, Maven, AWS CDK v2, Docker

# AWS Deployment (CDK)
Assume role using aws sts assume-role with agentic-lib-deployment-role
Policy document: agentic-lib-deployment-permissions-policy.json granting cloudformation, iam, s3, logs, lambda, dynamodb, sqs
Commands:
  npm install -g aws-cdk
  ./mvnw clean package
  npx cdk deploy
Outputs include Arn and resource names for DigestLambda, DigestQueue, EventsBucket
Cleanup:
  npx cdk destroy
  aws logs delete-log-group --log-group-name "/aws/s3/agentic-lib-telemetry-bucket"
  aws logs delete-log-group --log-group-name "/aws/lambda/agentic-lib-digest-function"


## Attribution
- Source: intentïon-agentic-lib Workflows
- URL: https://github.com/xn-intenton-z2a/agentic-lib
- License: License: MIT
- Crawl Date: 2025-05-09T18:30:16.514Z
- Data Size: 741436 bytes
- Links Found: 4937

## Retrieved
2025-05-09
