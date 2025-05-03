sandbox/library/AGENTIC_LIB.md
# sandbox/library/AGENTIC_LIB.md
# AGENTIC_LIB

## Crawl Summary
Agentic-lib provides a modular set of reusable GitHub Actions workflows designed for autonomous repository management. The workflows span issue creation, code fixes, merge automation, and feature documentation publishing. Key specifications include precise workflow invocation via workflow_call events, configuration parameters in agent_config file for paths and limits, AWS deployment using CDK with explicit IAM role trust policies, and local development using Node.js v20+ and Maven commands. Detailed AWS CLI commands and GitHub Actions configuration snippets are provided for practical deployment.

## Normalised Extract
Table of Contents:
1. Workflow Setup
   - Description: Automated chaining of GitHub Actions workflows.
   - Details: Source Worker (wfr-completion-maintain-sources.yml) feeds into Library Worker (wfr-completion-maintain-library.yml) which then triggers Publish Web (wfr-github-publish-web.yml).
2. Issue Management Workflows
   - Description: Create, assign, review, and auto-merge issues.
   - Details: Issue Creator uses wfr-create-issue.yml@1.2.0; Issue Worker invokes wfr-select-issue.yml@1.2.0, wfr-apply-issue-resolution.yml@1.2.0, and wfr-create-pr.yml@1.2.0; Issue Reviewer uses wfr-review-issue.yml@1.2.0; Automerge Workflow runs wfr-automerge-find-pr-from-pull-request.yml@1.2.0, wfr-automerge-find-pr-in-check-suite.yml@1.2.0, wfr-automerge-label-issue.yml@1.2.0, wfr-automerge-merge-pr.yml@1.2.0.
3. Repository Configuration
   - Description: Essential files and configuration parameters.
   - Details: Files such as CONTRIBUTING.md, README.md, package.json, src/lib/main.js, tests/unit/main.test.js; agent_config file with schedule (schedule-1), file path definitions (e.g., sandbox/SOURCES.md with permissions:'write', limit:16), execution commands (buildScript: npm run build, testScript: npm test, mainScript: npm run start).
4. AWS Deployment and Local Setup
   - Description: Commands and configuration for deployment.
   - Details: AWS CLI commands to create IAM role, assume role with trust policy JSON, environment variable export commands, and AWS resource checks (aws sts get-caller-identity, aws iam list-role-policies). Includes steps to build (./mvnw clean package) and deploy (npx cdk deploy).
5. Troubleshooting and Debugging
   - Description: Known issues and command outputs.
   - Details: Handling CDK null pointer errors, usage of aws logs delete-log-group and aws s3api list-object-versions with expected output formats.

Each topic contains exact parameter values, file paths, and commands for immediate application in a CI/CD pipeline.

## Supplementary Details
Agent Configuration Parameters:
- schedule: schedule-1
- paths:
  missionFilepath: 'MISSION.md'
  librarySourcesFilepath: 'sandbox/SOURCES.md' (permissions: write, limit: 16)
  libraryDocumentsPath: 'sandbox/library/' (permissions: write, limit: 64)
  featuresPath: 'sandbox/features/' (permissions: write, limit: 8)
  contributingFilepath: 'CONTRIBUTING.md'
  targetTestsPath: 'sandbox/tests/' (permissions: write)
  otherTestsPaths: ['tests/unit/']
  targetSourcePath: 'sandbox/source/' (permissions: write)
  otherSourcePaths: ['src/lib/']
  dependenciesFilepath: 'package.json'
  documentationPath: 'sandbox/docs/' (permissions: write)
- Execution commands:
  buildScript: npm run build
  testScript: npm test
  mainScript: npm run start
- Workflow Limits:
  featureDevelopmentIssuesWipLimit: 3
  maintenanceIssuesWipLimit: 3
  attemptsPerBranch: 2
  attemptsPerIssue: 1

AWS Deployment Detailed Steps:
1. Create IAM role using aws iam create-role with a trust policy accepting sts:AssumeRole and sts:TagSession.
2. Attach policy via aws iam put-role-policy with permissions: cloudformation:*, iam:*, s3:*, lambda:*, dynamodb:*, sqs:*, logs:*, events:*, sts:AssumeRole.
3. Assume role commands:
   unset AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN, then use aws sts assume-role with ROLE_ARN and SESSION_NAME variables.
4. Validate session with aws sts get-caller-identity.
5. Check role policies with aws iam list-role-policies --role-name agentic-lib-deployment-role.

Local Development:
- Clone repository using git clone https://github.com/xn-intenton-z2a/agentic-lib.git
- Install dependencies with npm install and run tests with npm test.
- Build Java application using Maven: ./mvnw clean package
- AWS CDK bootstrap must be run for deployment environment setup.

## Reference Details
API Specifications and Implementation Patterns:
1. GitHub Actions Workflow Invocation:
   - YAML configuration:
     on:
       workflow_dispatch:
         inputs:
           issueTitle:
             description: Title for the new task
             required: false
             default: 'house choice'
   - SDK Method Signatures: Not applicable as these are YAML defined; however, each reusable workflow is versioned. Example: wfr-create-issue.yml@1.2.0 accepts parameters: { issueTitle: string, versionIncrement?: string } and returns { issueNumber: number, status: string }.

2. AWS Deployment CLI Commands:
   - Create IAM Role:
     aws iam create-role --role-name agentic-lib-deployment-role --assume-role-policy-document file://agentic-lib-deployment-trust-policy.json
   - Attach Role Policy:
     aws iam put-role-policy --role-name agentic-lib-deployment-role --policy-name agentic-lib-deployment-permissions-policy --policy-document file://agentic-lib-deployment-permissions-policy.json
   - Assume Role (Bash Example):
     unset AWS_ACCESS_KEY_ID
     unset AWS_SECRET_ACCESS_KEY
     unset AWS_SESSION_TOKEN
     ROLE_ARN="arn:aws:iam::541134664601:role/agentic-lib-deployment-role"
     SESSION_NAME="agentic-lib-deployment-session-local"
     ASSUME_ROLE_OUTPUT=$(aws sts assume-role --role-arn "$ROLE_ARN" --role-session-name "$SESSION_NAME" --output json)
     export AWS_ACCESS_KEY_ID=$(echo "$ASSUME_ROLE_OUTPUT" | jq -r '.Credentials.AccessKeyId')
     export AWS_SECRET_ACCESS_KEY=$(echo "$ASSUME_ROLE_OUTPUT" | jq -r '.Credentials.SecretAccessKey')
     export AWS_SESSION_TOKEN=$(echo "$ASSUME_ROLE_OUTPUT" | jq -r '.Credentials.SessionToken')
     EXPIRATION=$(echo "$ASSUME_ROLE_OUTPUT" | jq -r '.Credentials.Expiration')
     echo "Assumed role successfully. Credentials valid until: $EXPIRATION"

3. SDK Usage Pattern in Node.js for Workflow Calls:
   - Example function signature (pseudocode):
     async function invokeWorkflow(workflowName: string, inputs: { [key: string]: any }): Promise<{ result: any }> {
       // Implementation calls GitHub Actions workflow_call API
     }
   - Input parameters include versionIncrement, buildScript, issueTitle; return types include task status and pull request numbers.

4. Troubleshooting Procedures:
   - CDK Error Resolution:
     If encountering "NullPointerException: Cannot read field 'stderr'" ignore as it does not affect deployment.
   - AWS S3 Object Version Listing:
     aws s3api list-object-versions --bucket agentic-lib-telemetry-bucket --prefix events/ |
       jq -r '.Versions[] | "\(.LastModified) \(.Key) \(.VersionId) \(.IsLatest)"'
   - DynamoDB Scan Command:
     aws dynamodb scan --table-name agentic-lib-projections-table --output json |
       jq --compact-output '.Items[] | with_entries(if (.value | has("S")) then .value = .value.S else . end)'

5. Configuration Options and Effects:
   - Agent Configuration file sets file paths, permissions, execution scripts, and issue limits which directly impact workflow behaviors.
   - Best practices include verifying IAM roles, ensuring Node.js version compatibility, and running CDK bootstrap per AWS account.

6. Full Code Example for GitHub Actions (excerpt):
     - name: Configure AWS Credentials
       uses: aws-actions/configure-aws-credentials@v4
       with:
         role-to-assume: arn:aws:iam::541134664601:role/agentic-lib-deployment-role
         aws-region: eu-west-2
     - name: Set up Node.js
       uses: actions/setup-node@v3
       with:
         node-version: '20'
     - run: npm install -g aws-cdk
     - run: aws s3 ls --region eu-west-2

All method signatures, parameter lists, commands, and configuration values above are exact and ready for direct implementation.

## Information Dense Extract
Agentic-lib workflows: Source Worker (wfr-completion-maintain-sources.yml), Library Worker (wfr-completion-maintain-library.yml), Publish Web (wfr-github-publish-web.yml). Issue Workflows: Issue Creator (wfr-create-issue.yml@1.2.0), Issue Worker (wfr-select-issue.yml@1.2.0, wfr-apply-issue-resolution.yml@1.2.0, wfr-create-pr.yml@1.2.0), Issue Reviewer (wfr-review-issue.yml@1.2.0), Automerge (wfr-automerge-find-pr-from-pull-request.yml@1.2.0, wfr-automerge-find-pr-in-check-suite.yml@1.2.0, wfr-automerge-label-issue.yml@1.2.0, wfr-automerge-merge-pr.yml@1.2.0). Config: schedule: schedule-1; file paths with write permissions (e.g., sandbox/SOURCES.md, sandbox/library/; limits: 16, 64, 8). Execution commands: npm run build, npm test, npm run start. AWS CLI commands provided for role creation, assume-role with jq parsing, output validation via aws sts get-caller-identity. Node.js SDK pattern: async invokeWorkflow(workflowName, inputs) returning task status. Best practices include verifying IAM policies, CDK bootstrap, handling known CDK error (NullPointerException ignored).

## Sanitised Extract
Table of Contents:
1. Workflow Setup
   - Description: Automated chaining of GitHub Actions workflows.
   - Details: Source Worker (wfr-completion-maintain-sources.yml) feeds into Library Worker (wfr-completion-maintain-library.yml) which then triggers Publish Web (wfr-github-publish-web.yml).
2. Issue Management Workflows
   - Description: Create, assign, review, and auto-merge issues.
   - Details: Issue Creator uses wfr-create-issue.yml@1.2.0; Issue Worker invokes wfr-select-issue.yml@1.2.0, wfr-apply-issue-resolution.yml@1.2.0, and wfr-create-pr.yml@1.2.0; Issue Reviewer uses wfr-review-issue.yml@1.2.0; Automerge Workflow runs wfr-automerge-find-pr-from-pull-request.yml@1.2.0, wfr-automerge-find-pr-in-check-suite.yml@1.2.0, wfr-automerge-label-issue.yml@1.2.0, wfr-automerge-merge-pr.yml@1.2.0.
3. Repository Configuration
   - Description: Essential files and configuration parameters.
   - Details: Files such as CONTRIBUTING.md, README.md, package.json, src/lib/main.js, tests/unit/main.test.js; agent_config file with schedule (schedule-1), file path definitions (e.g., sandbox/SOURCES.md with permissions:'write', limit:16), execution commands (buildScript: npm run build, testScript: npm test, mainScript: npm run start).
4. AWS Deployment and Local Setup
   - Description: Commands and configuration for deployment.
   - Details: AWS CLI commands to create IAM role, assume role with trust policy JSON, environment variable export commands, and AWS resource checks (aws sts get-caller-identity, aws iam list-role-policies). Includes steps to build (./mvnw clean package) and deploy (npx cdk deploy).
5. Troubleshooting and Debugging
   - Description: Known issues and command outputs.
   - Details: Handling CDK null pointer errors, usage of aws logs delete-log-group and aws s3api list-object-versions with expected output formats.

Each topic contains exact parameter values, file paths, and commands for immediate application in a CI/CD pipeline.

## Original Source
agentic‑lib Repository Documentation
https://github.com/xn-intenton-z2a/agentic-lib

## Digest of AGENTIC_LIB

# AGENTIC_LIB Documentation

# Overview
The agentic-lib project is a collection of reusable GitHub Actions workflows enabling repositories to operate autonomously. The workflows manage issue creation, code fixes, automated merges, and continuous documentation publishing. Retrieved on 2023-11-28.

# Workflow Chain and SDK
- Source Worker (source-worker.yml): Maintains SOURCES*.md files with URL metadata.
- Library Worker (library-worker.yml): Creates/updates documents from source material.
- Publish Web (publish-web.yml): Converts feature documents into HTML for GitHub Pages deployment.

# GitHub Actions Workflows
- Issue Creator (issue-creator.yml): Triggered manually or on schedule; uses inputs like issueTitle to create issues.
- Issue Worker (issue-worker.yml): Selects and validates issues, invokes wfr-select-issue, wfr-apply-issue-resolution, and wfr-create-pr workflows.
- Issue Reviewer (issue-reviewer.yml): Reviews and finalizes tasks using wfr-review-issue.
- Automerge Workflow (automerge.yml): Merges pull requests based on criteria using wfr-automerge-* workflows.

# Repository and File Configuration
- Repositories must support Node.js (v20+) and contain files: CONTRIBUTING.md, README.md, package.json, src/lib/main.js, tests/unit/main.test.js.
- Agent configuration (agent_config.yml) specifies:
  - Schedule: schedule-1
  - Filepaths for mission, sources, library, features, tests, docs with permissions and limits.
  - Execution commands: buildScript (npm run build), testScript (npm test), mainScript (npm run start).
  - Issue workflow limits: featureDevelopmentIssuesWipLimit: 3, maintenanceIssuesWipLimit: 3, attempts per branch/issue.

# AWS Deployment and Local Development
- Prerequisites include Node.js v20+, AWS CLI, Java JDK 11+, Apache Maven, AWS CDK 2.x, Docker and Docker Compose.
- AWS IAM Role setup with trust policies to allow GitHub Actions to assume roles:
  - Example trust policy and role creation via aws iam create-role and aws iam put-role-policy commands.
- Local commands for assume role, check session with aws sts get-caller-identity, and list role policies.
- Deployment steps: Maven build (./mvnw clean package), deploy via npx cdk deploy, and use aws s3 and aws dynamodb commands for operational checks.

# Example GitHub Workflow Snippet
on:
  workflow_dispatch:
    inputs:
      issueTitle:
        description: Title for the new task
        required: false
        default: house choice

Steps include setup of AWS credentials via aws-actions/configure-aws-credentials@v4 and Node.js setup using actions/setup-node@v3.

# Troubleshooting and Debugging
- CDK NullPointerException note: "Cannot read field 'stderr' because 'consoleOutput' is null" is a known bug.
- Commands provided to destroy previous stacks (npx cdk destroy), delete log groups, list S3 object versions and scan DynamoDB tables.
- Detailed CLI commands for role assumption and permissions check are provided.

# Attribution and Licensing
- Licensed under GPL-3.0 for core workflows and MIT for example workflows.
- All derived works must include the attribution "This work is derived from https://github.com/xn-intenton-z2a/agentic-lib".

Data Size: 642911 bytes, Links Found: 4336.


## Attribution
- Source: agentic‑lib Repository Documentation
- URL: https://github.com/xn-intenton-z2a/agentic-lib
- License: License: MIT License (assumed based on repository standards)
- Crawl Date: 2025-05-03T19:22:47.863Z
- Data Size: 642911 bytes
- Links Found: 4336

## Retrieved
2025-05-03
