# AGENTIC_LIB

## Crawl Summary
Agentic-lib contains reusable GitHub Actions workflows for autonomous code evolution. It defines chain workflows (Source Worker -> Library Worker -> Publish Web) and issue management (creator, worker, reviewer, automerge) with explicit GitHub Actions workflow calls. The repository includes detailed AWS deployment procedures with trust policies, role assumptions, and CLI commands. It also provides developer setup commands for Node.js, Maven, and AWS CDK, as well as an agent configuration file mapping file paths, permissions, and limits.

## Normalised Extract
Table of Contents:
1. Workflows and GitHub Actions
2. AWS Deployment and IAM Role Setup
3. Local Development and Build Instructions
4. Agent Configuration File Details

1. Workflows and GitHub Actions:
- Core workflows: issue-creator.yml (wfr-create-issue.yml@1.2.0), issue-worker.yml (wfr-select-issue.yml@1.2.0, wfr-apply-issue-resolution.yml@1.2.0, wfr-create-pr.yml@1.2.0), issue-reviewer.yml (wfr-review-issue.yml@1.2.0)
- Automerge workflows: wfr-automerge-find-pr-from-pull-request.yml@1.2.0, wfr-automerge-merge-pr.yml@1.2.0
- Reusable action invocation via workflow_call event in GitHub Actions
- Example invocation structure:
  on:
    workflow_dispatch:
      inputs:
        issueTitle:
          description: Title for new task
          required: false
          default: house choice

2. AWS Deployment and IAM Role Setup:
- Use AWS CLI commands to create and manage IAM roles for CDK deployment.
- Trust policy example for role agentic-lib-deployment-role provided in JSON format.
- Commands:
  aws iam create-role --role-name agentic-lib-deployment-role --assume-role-policy-document file://policy.json
  aws iam put-role-policy --role-name agentic-lib-deployment-role --policy-name agentic-lib-deployment-permissions-policy --policy-document file://permissions.json
- Assume role and export environment variables using aws sts assume-role and jq extraction.

3. Local Development and Build Instructions:
- Clone repository: git clone https://github.com/xn-intenton-z2a/agentic-lib.git
- Install dependencies: npm install
- Run tests: npm test
- Build Java application: ./mvnw clean package
- Deploy CDK stack with: npx cdk deploy

4. Agent Configuration File Details:
- schedule: schedule-3
- paths section defines missionFilepath, librarySourcesFilepath (limit 16, write), libraryDocumentsPath (limit 64, write), featuresPath (limit 8, write), contributingFilepath, targetTestsPath, otherTestsPaths, targetSourcePath, otherSourcePaths, dependenciesFilepath, documentationPath, formattingFilepath, lintingFilepath, readmeFilepath
- Execution commands: buildScript: 'npm run build', testScript: 'npm test', mainScript: 'npm run start'
- Issue limits: featureDevelopmentIssuesWipLimit: 3, maintenanceIssuesWipLimit: 3, attemptsPerBranch: 2, attemptsPerIssue: 1
- Web publishing: docRoot: 'public'
- Sandbox: sandboxPath: 'sandbox', sandboxReset: 'true'

## Supplementary Details
Agent Configuration File (exact values):

schedule: schedule-3
paths:
  missionFilepath:
    path: 'MISSION.md'
  librarySourcesFilepath:
    path: 'sandbox/SOURCES.md'
    permissions: [ 'write' ]
    limit: 16
  libraryDocumentsPath:
    path: 'sandbox/library/'
    permissions: [ 'write' ]
    limit: 64
  featuresPath:
    path: 'sandbox/features/'
    permissions: [ 'write' ]
    limit: 8
  contributingFilepath:
    path: 'CONTRIBUTING.md'
  targetTestsPath:
    path: 'sandbox/tests/'
    permissions: [ 'write' ]
  otherTestsPaths:
    paths: [ 'tests/unit/' ]
  targetSourcePath:
    path: 'sandbox/source/'
    permissions: [ 'write' ]
  otherSourcePaths:
    paths: [ 'src/lib/' ]
  dependenciesFilepath:
    path: 'package.json'
  documentationPath:
    path: 'sandbox/docs/'
    permissions: [ 'write' ]
  formattingFilepath:
    path: '.prettierrc'
  lintingFilepath:
    path: 'eslint.config.js'
  readmeFilepath:
    path: 'README.md'

Execution Commands:
  buildScript: 'npm run build'
  testScript: 'npm test'
  mainScript: 'npm run start'

AWS Deployment Steps:
- Create role with trust policy:
  Role trust policy JSON provided.
- Create IAM role using aws iam create-role and attach policy via aws iam put-role-policy
- Assume role with aws sts assume-role; export AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN
- Validate session using aws sts get-caller-identity

Local Development Steps:
- Clone, npm install, npm test, and Maven build commands as specified.


## Reference Details
API and SDK Specifications:

1. GitHub Actions Workflows API:
   - Issue Creator Workflow:
     Method: triggerIssueCreator(inputs: { issueTitle: string })
     SDK Signature: triggerIssueCreator(issueTitle: string): Promise<{ issueId: number, prNumber?: number }>
     Parameters: issueTitle (default: 'house choice')
     Return: JSON response with issue details

   - Issue Worker Workflow:
     Methods: selectIssue(issueId: number): Promise<boolean>, applyIssueResolution(issueId: number): Promise<boolean>, createPR(issueId: number): Promise<{ prNumber: number }>

   - Automerge Workflow:
     Methods: findPRFromPullRequest(prId: number): Promise<{ prId: number }>, mergePR(prId: number): Promise<{ status: string }>

2. AWS Deployment CLI Commands:
   - Create Role:
     Command: aws iam create-role --role-name agentic-lib-deployment-role --assume-role-policy-document file://agentic-lib-deployment-trust-policy.json
   - Attach Policy:
     Command: aws iam put-role-policy --role-name agentic-lib-deployment-role --policy-name agentic-lib-deployment-permissions-policy --policy-document file://agentic-lib-deployment-permissions-policy.json
   - Assume Role:
     Command:
       unset AWS_ACCESS_KEY_ID
       unset AWS_SECRET_ACCESS_KEY
       unset AWS_SESSION_TOKEN
       ROLE_ARN="arn:aws:iam::541134664601:role/agentic-lib-deployment-role"
       SESSION_NAME="agentic-lib-deployment-session-local"
       ASSUME_ROLE_OUTPUT=$(aws sts assume-role --role-arn "$ROLE_ARN" --role-session-name "$SESSION_NAME" --output json)
       export AWS_ACCESS_KEY_ID=$(echo "$ASSUME_ROLE_OUTPUT" | jq -r '.Credentials.AccessKeyId')
       export AWS_SECRET_ACCESS_KEY=$(echo "$ASSUME_ROLE_OUTPUT" | jq -r '.Credentials.SecretAccessKey')
       export AWS_SESSION_TOKEN=$(echo "$ASSUME_ROLE_OUTPUT" | jq -r '.Credentials.SessionToken')
       echo "Assumed role successfully."
   - Check session:
     Command: aws sts get-caller-identity
   - List SQS Attributes:
     Command: aws sqs get-queue-attributes --queue-url <QUEUE_URL> --attribute-names ApproximateNumberOfMessages

3. Implementation Patterns and Best Practices:
   - Always validate AWS credentials after assuming a role.
   - Use workflow_call to modularize GitHub Actions; provide explicit parameters with defaults.
   - Configure repository settings to include secrets such as CHATGPT_API_SECRET_KEY and GITHUB_TOKEN.
   - For local testing, run npm install, npm test, and use ./mvnw clean package for Java build.

4. Troubleshooting Procedures:
   - If assume-role fails, verify trust policy and AWS CLI configuration.
   - Check CDK bootstrap status with: aws cloudformation describe-stacks --stack-name CDKToolkit
   - For failing tests, inspect npm test logs and adjust ESLint or Prettier configurations as specified in eslint.config.js and .prettierrc.
   - In deployment, if logs error "software.amazon.jsii.JsiiRuntime.ErrorStreamSink" appears, note it is a known CDK bug that does not affect deployment.

Code Example Commented Workflow Invocation (pseudocode):

// Example invoking Issue Creator Workflow
// Triggered via workflow_dispatch event
// Input: { issueTitle: 'New feature request' }
triggerIssueCreator('New feature request')
  .then(response => {
    // response includes issueId and possibly prNumber
    console.log('Issue created:', response.issueId);
  })
  .catch(error => {
    console.error('Error creating issue:', error);
  });

Configuration Options Summary:
- schedule: 'schedule-3'
- Paths limits: librarySources (limit: 16), libraryDocuments (limit: 64), features (limit: 8)
- Execution commands: buildScript, testScript, mainScript
- Issue limits: featureDevelopmentIssuesWipLimit: 3, maintenanceIssuesWipLimit: 3, attemptsPerBranch: 2, attemptsPerIssue: 1

Return Types and Exceptions:
- All SDK methods return a Promise with JSON; exceptions are thrown for network or parameter validation errors.


## Information Dense Extract
AGENTIC_LIB: reusable GitHub Actions workflows; chain: Source Worker -> Library Worker -> Publish Web; Issue Creator (wfr-create-issue.yml@1.2.0), Issue Worker (wfr-select-issue.yml@1.2.0, wfr-apply-issue-resolution.yml@1.2.0, wfr-create-pr.yml@1.2.0), Issue Reviewer (wfr-review-issue.yml@1.2.0), Automerge (wfr-automerge-merge-pr.yml@1.2.0); AWS CLI: create-role, put-role-policy, assume-role; commands with jq extraction; local setup: git clone, npm install, npm test, ./mvnw clean package; Agent config: schedule=schedule-3; paths: missionFilepath (MISSION.md), librarySourcesFilepath (sandbox/SOURCES.md, limit 16, write), libraryDocumentsPath (sandbox/library/, limit 64, write), featuresPath (sandbox/features/, limit 8, write), contributingFilepath (CONTRIBUTING.md), targetTestsPath (sandbox/tests/, write), otherTestsPaths ([tests/unit/]), targetSourcePath (sandbox/source/, write), otherSourcePaths ([src/lib/]), dependenciesFilepath (package.json), documentationPath (sandbox/docs/, write), formattingFilepath (.prettierrc), lintingFilepath (eslint.config.js), readmeFilepath (README.md); Execution: buildScript='npm run build', testScript='npm test', mainScript='npm run start'; SDK methods with parameters, return Promises, error handling; troubleshooting: check AWS assume-role, CDK bootstrap, npm test logs; detailed AWS commands and GitHub workflow invocation examples provided.

## Sanitised Extract
Table of Contents:
1. Workflows and GitHub Actions
2. AWS Deployment and IAM Role Setup
3. Local Development and Build Instructions
4. Agent Configuration File Details

1. Workflows and GitHub Actions:
- Core workflows: issue-creator.yml (wfr-create-issue.yml@1.2.0), issue-worker.yml (wfr-select-issue.yml@1.2.0, wfr-apply-issue-resolution.yml@1.2.0, wfr-create-pr.yml@1.2.0), issue-reviewer.yml (wfr-review-issue.yml@1.2.0)
- Automerge workflows: wfr-automerge-find-pr-from-pull-request.yml@1.2.0, wfr-automerge-merge-pr.yml@1.2.0
- Reusable action invocation via workflow_call event in GitHub Actions
- Example invocation structure:
  on:
    workflow_dispatch:
      inputs:
        issueTitle:
          description: Title for new task
          required: false
          default: house choice

2. AWS Deployment and IAM Role Setup:
- Use AWS CLI commands to create and manage IAM roles for CDK deployment.
- Trust policy example for role agentic-lib-deployment-role provided in JSON format.
- Commands:
  aws iam create-role --role-name agentic-lib-deployment-role --assume-role-policy-document file://policy.json
  aws iam put-role-policy --role-name agentic-lib-deployment-role --policy-name agentic-lib-deployment-permissions-policy --policy-document file://permissions.json
- Assume role and export environment variables using aws sts assume-role and jq extraction.

3. Local Development and Build Instructions:
- Clone repository: git clone https://github.com/xn-intenton-z2a/agentic-lib.git
- Install dependencies: npm install
- Run tests: npm test
- Build Java application: ./mvnw clean package
- Deploy CDK stack with: npx cdk deploy

4. Agent Configuration File Details:
- schedule: schedule-3
- paths section defines missionFilepath, librarySourcesFilepath (limit 16, write), libraryDocumentsPath (limit 64, write), featuresPath (limit 8, write), contributingFilepath, targetTestsPath, otherTestsPaths, targetSourcePath, otherSourcePaths, dependenciesFilepath, documentationPath, formattingFilepath, lintingFilepath, readmeFilepath
- Execution commands: buildScript: 'npm run build', testScript: 'npm test', mainScript: 'npm run start'
- Issue limits: featureDevelopmentIssuesWipLimit: 3, maintenanceIssuesWipLimit: 3, attemptsPerBranch: 2, attemptsPerIssue: 1
- Web publishing: docRoot: 'public'
- Sandbox: sandboxPath: 'sandbox', sandboxReset: 'true'

## Original Source
agentic-lib Workflows
https://github.com/xn-intenton-z2a/agentic-lib

## Digest of AGENTIC_LIB

# AGENTIC_LIB DOCUMENT

# Overview
This document contains the full technical details for the agentic-lib repository, which is a collection of reusable GitHub Actions workflows that enable autonomous code review, issue management and AWS deployment. The document covers workflow chain configuration, repository structure, AWS deployment commands, SDK method invocation examples, and the complete agent configuration file.

# Repository Structure
- Dockerfile
- package.json
- cdk.json
- pom.xml
- compose.yml
- src/lib/main.js
- aws/main/java/com/intention/AgenticLib/AgenticLibApp.java
- aws/main/java/com/intention/AgenticLib/AgenticLibStack.java
- aws/test/java/com/intention/AgenticLib/AgenticLibStackTest.java
- tests/unit/main.test.js
- GitHub workflows located in .github/workflows/
- Example workflows in examples/ directory

# Workflow Chain and Agentic Development System
- Source Worker: Maintains SOURCES*.md files. Uses the reusable workflow: wfr-completion-maintain-sources.yml
- Library Worker: Creates/updates feature documents using wfr-completion-maintain-library.yml
- Publish Web: Publishes documentation via wfr-github-publish-web.yml

# Issue Management and Reusable Workflows
- Issue Creator: Trigger via workflow_dispatch with input parameter 'issueTitle'; internally calls wfr-create-issue.yml@1.2.0
- Issue Worker: Uses wfr-select-issue.yml@1.2.0, wfr-apply-issue-resolution.yml@1.2.0 and wfr-create-pr.yml@1.2.0
- Issue Reviewer: Finalizes tasks via wfr-review-issue.yml@1.2.0
- Automerge Workflow: Merges pull requests when criteria are met through multiple sub-workflows such as wfr-automerge-merge-pr.yml@1.2.0

# AWS Deployment and IAM Configuration
- Prerequisites: Node.js v20+, AWS CLI, Java JDK 11+, Maven, AWS CDK 2.x, Docker.
- AWS CDK bootstrap required.
- Example trust policy for agentic-lib-deployment-role:
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Sid": "Statement1",
        "Effect": "Allow",
        "Action": ["sts:AssumeRole", "sts:TagSession"],
        "Resource": ["arn:aws:iam::541134664601:role/agentic-lib-deployment-role"]
      }
    ]
  }
- Commands to create role and attach policies are provided in the document.
- Example AWS CLI commands:
  - Assume role using aws sts assume-role
  - Check session with aws sts get-caller-identity
  - List role policies using aws iam list-role-policies

# Local Development Setup
- Clone the repository: git clone https://github.com/xn-intenton-z2a/agentic-lib.git
- Install dependencies: npm install
- Run tests: npm test
- Build Java application: ./mvnw clean package
- Example for AWS deployment: ./mvnw clean package ; npx cdk deploy

# Agent Configuration File
The agent configuration file defines workflow schedules and file path mappings:

schedule: schedule-3
paths:
  missionFilepath:
    path: 'MISSION.md'
  librarySourcesFilepath:
    path: 'sandbox/SOURCES.md'
    permissions: [ 'write' ]
    limit: 16
  libraryDocumentsPath:
    path: 'sandbox/library/'
    permissions: [ 'write' ]
    limit: 64
  featuresPath:
    path: 'sandbox/features/'
    permissions: [ 'write' ]
    limit: 8
  contributingFilepath:
    path: 'CONTRIBUTING.md'
  targetTestsPath:
    path: 'sandbox/tests/'
    permissions: [ 'write' ]
  otherTestsPaths:
    paths: [ 'tests/unit/' ]
  targetSourcePath:
    path: 'sandbox/source/'
    permissions: [ 'write' ]
  otherSourcePaths:
    paths: [ 'src/lib/' ]
  dependenciesFilepath:
    path: 'package.json'
  documentationPath:
    path: 'sandbox/docs/'
    permissions: [ 'write' ]
  formattingFilepath:
    path: '.prettierrc'
  lintingFilepath:
    path: 'eslint.config.js'
  readmeFilepath:
    path: 'README.md'

Execution commands:
  buildScript: 'npm run build'
  testScript: 'npm test'
  mainScript: 'npm run start'

Issue limits and sandbox configuration are explicitly set.

# License and Attribution
- Licensed under GNU GPL-3.0 with MIT for examples.
- Attribution: "This work is derived from https://github.com/xn-intenton-z2a/agentic-lib"

# Retrieval Date and Source Attribution
- Retrieved on: 2023-10-05
- Data Size: 727219 bytes
- Links Found: 4913


## Attribution
- Source: agentic-lib Workflows
- URL: https://github.com/xn-intenton-z2a/agentic-lib
- License: Apache-2.0
- Crawl Date: 2025-05-01T23:47:37.678Z
- Data Size: 727219 bytes
- Links Found: 4913

## Retrieved
2025-05-01
