# AGENTIC_LIB

## Crawl Summary
Agentic-lib implements a set of autonomous GitHub Actions workflows that cover issue management, automated merges, AWS infrastructure deployment using CDK, and local development setups. It details file structure, exact commands for role configuration in AWS, complete workflow triggering mechanisms, and exact agent configuration parameters such as schedule and filepaths with limits. The system integrates GitHub API calls with OpenAI API for self-evolving code and includes detailed AWS IAM trust policies and CDK commands.

## Normalised Extract
Table of Contents:
1. Workflow Specifications
   - Issue Creator: workflow file wfr-create-issue.yml@1.2.0, input parameter issueTitle (default: 'house choice').
   - Issue Worker: includes wfr-select-issue.yml@1.2.0, wfr-apply-issue-resolution.yml@1.2.0, wfr-create-pr.yml@1.2.0.
   - Issue Reviewer: uses wfr-review-issue.yml@1.2.0.
   - Automerge: triggers wfr-automerge-find-pr-from-pull-request.yml@1.2.0, wfr-automerge-find-pr-in-check-suite.yml@1.2.0, wfr-automerge-label-issue.yml@1.2.0, wfr-automerge-merge-pr.yml@1.2.0.
2. Repository Setup and Local Development
   - Clone command: git clone https://github.com/xn-intenton-z2a/agentic-lib.git
   - Node.js (v20+), AWS CLI, Java JDK 11+, Maven, AWS CDK 2.x required.
   - Build commands: npm install, npm test, ./mvnw clean package
3. AWS Deployment
   - Trust policy JSON for agentic-lib-deployment-role with Allow actions for sts:AssumeRole and sts:AssumeRoleWithWebIdentity.
   - AWS CLI commands: aws iam create-role with role-name agentic-lib-deployment-role; aws iam put-role-policy with policy document file://agentic-lib-deployment-permissions-policy.json.
   - Assume Role using aws sts assume-role and export AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN.
   - Verify with aws sts get-caller-identity and list policies via aws iam list-role-policies.
4. Agent Configuration File
   - schedule: schedule-3
   - paths: missionFilepath ('MISSION.md'), librarySourcesFilepath ('sandbox/SOURCES.md', permissions [write], limit 16), libraryDocumentsPath ('sandbox/library/', permissions [write], limit 64), featuresPath ('sandbox/features/', permissions [write], limit 8), contributingFilepath ('CONTRIBUTING.md'), targetTestsPath ('sandbox/tests/'), otherTestsPaths (['tests/unit/']), targetSourcePath ('sandbox/source/', permissions [write]), otherSourcePaths (['src/lib/']), dependenciesFilepath ('package.json'), documentationPath ('sandbox/docs/', permissions [write]), formattingFilepath ('.prettierrc'), lintingFilepath ('eslint.config.js'), readmeFilepath ('README.md').
   - Execution commands: buildScript: npm run build, testScript: npm test, mainScript: npm run start.
   - Issue limits: featureDevelopmentIssuesWipLimit: 3, maintenanceIssuesWipLimit: 3, attemptsPerBranch: 2, attemptsPerIssue: 1.
5. AWS and GitHub Actions Best Practices
   - Use dotenv, openai, zod in package.json.
   - Role assumption in GitHub Actions with aws-actions/configure-aws-credentials@v4 and actions/setup-node@v3.
   - Troubleshooting: Check for CDK errors; ignore background thread NullPointer while deployment if output is BUILD SUCCESS.
   - Log deletion commands for CloudWatch: aws logs delete-log-group for telemetry and lambda logs.
   - S3 operations: Using aws s3 cp and aws s3 ls; list object versions with aws s3api list-object-versions piped to jq.
6. Detailed Implementation Patterns
   - Code changes trigger series: Create Issue -> Issue Worker -> Automerge -> Review Issue (or timer based).
   - Chain workflow design using outputs as inputs for subsequent workflows (e.g. issue review output fixed flag).
   - Modular SDK integration via GitHub workflow calls using specific version tags.


## Supplementary Details
Agent Config Details:
• schedule: 'schedule-3'
• paths configuration:
   - missionFilepath: 'MISSION.md'
   - librarySourcesFilepath: 'sandbox/SOURCES.md', permissions: [ 'write' ], limit: 16
   - libraryDocumentsPath: 'sandbox/library/', permissions: [ 'write' ], limit: 64
   - featuresPath: 'sandbox/features/', permissions: [ 'write' ], limit: 8
   - contributingFilepath: 'CONTRIBUTING.md'
   - targetTestsPath: 'sandbox/tests/'
   - otherTestsPaths: [ 'tests/unit/' ]
   - targetSourcePath: 'sandbox/source/', permissions: [ 'write' ]
   - otherSourcePaths: [ 'src/lib/' ]
   - dependenciesFilepath: 'package.json'
   - documentationPath: 'sandbox/docs/', permissions: [ 'write' ]
   - formattingFilepath: '.prettierrc'
   - lintingFilepath: 'eslint.config.js'
   - readmeFilepath: 'README.md'
• Execution Commands:
   - buildScript: npm run build
   - testScript: npm test
   - mainScript: npm run start
• Issue limits:
   - featureDevelopmentIssuesWipLimit: 3
   - maintenanceIssuesWipLimit: 3
   - attemptsPerBranch: 2
   - attemptsPerIssue: 1

AWS Deployment Specifications:
• Create role using:
   aws iam create-role --role-name agentic-lib-deployment-role --assume-role-policy-document file://agentic-lib-deployment-trust-policy.json
• Attach permissions using:
   aws iam put-role-policy --role-name agentic-lib-deployment-role --policy-name agentic-lib-deployment-permissions-policy --policy-document file://agentic-lib-deployment-permissions-policy.json
• Assume role with:
   aws sts assume-role --role-arn "arn:aws:iam::541134664601:role/agentic-lib-deployment-role" --role-session-name "agentic-lib-deployment-session-local" --output json

Local Development:
• Clone, install dependencies (npm install), test (npm test), and build Java application with ./mvnw clean package
• CDK bootstrapping required before deployment (cdk bootstrap)

Detailed troubleshooting commands:
• To destroy a stack: npx cdk destroy
• To delete CloudWatch log groups:
   aws logs delete-log-group --log-group-name "/aws/s3/agentic-lib-telemetry-bucket"
   aws logs delete-log-group --log-group-name "/aws/lambda/agentic-lib-digest-function"
• S3 file operations:
   aws s3 ls agentic-lib-telemetry-bucket/events/
   aws s3 cp "file.json" s3://agentic-lib-telemetry-bucket/events/"file.json"
   aws s3api list-object-versions --bucket agentic-lib-telemetry-bucket --prefix events/ | jq -r '.Versions[] | "\(.LastModified) \(.Key) \(.VersionId) \(.IsLatest)"'


## Reference Details
API Specifications and SDK Method Signatures:

Issue Creator API:
Method Signature: createIssue(issueTitle: string = 'house choice'): Promise<{ issueId: number, status: string }>
Parameters: issueTitle (string, optional).
Return Type: Promise with object containing 'issueId' and 'status'.

Issue Worker API:
Methods: selectIssue(): Promise<{issue: object}>, applyIssueResolution(): Promise<{result: boolean}>, createPullRequest(): Promise<{prNumber: number}>

Automated Merge API:
Method Signature: automerge(prIdentifier: string): Promise<{merged: boolean, prNumber: number}>

AWS IAM Role Setup Example:
Trust Policy JSON:
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

GitHub Actions Role Setup Example:
Step in Workflow:
- name: Configure AWS Credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: arn:aws:iam::541134664601:role/agentic-lib-deployment-role
    aws-region: eu-west-2
- name: Set up Node.js
  uses: actions/setup-node@v3
  with:
    node-version: '20'

Code Example for Assuming Role Locally (Shell Script):
ROLE_ARN="arn:aws:iam::541134664601:role/agentic-lib-deployment-role"
SESSION_NAME="agentic-lib-deployment-session-local"
ASSUME_ROLE_OUTPUT=$(aws sts assume-role --role-arn "$ROLE_ARN" --role-session-name "$SESSION_NAME" --output json)
export AWS_ACCESS_KEY_ID=$(echo "$ASSUME_ROLE_OUTPUT" | jq -r '.Credentials.AccessKeyId')
export AWS_SECRET_ACCESS_KEY=$(echo "$ASSUME_ROLE_OUTPUT" | jq -r '.Credentials.SecretAccessKey')
export AWS_SESSION_TOKEN=$(echo "$ASSUME_ROLE_OUTPUT" | jq -r '.Credentials.SessionToken')

Best Practices:
- Validate file write permissions before invoking workflows.
- Use chained workflows outputs (e.g. issue review fixed -> trigger automerge).
- Maintain a dedicated sandbox directory (e.g. 'sandbox') for temporary files and reset regularly.

Troubleshooting:
- Check CDK build logs; ignore background thread errors if build is successful.
- Run aws sts get-caller-identity to verify correct role assumption.
- For S3 issues, use aws s3 ls and aws s3api list-object-versions to verify file uploads.


## Information Dense Extract
agentic-lib; Workflows: issue-creator (wfr-create-issue.yml@1.2.0, input: issueTitle, default 'house choice'), issue-worker (wfr-select-issue.yml@1.2.0, wfr-apply-issue-resolution.yml@1.2.0, wfr-create-pr.yml@1.2.0), issue-reviewer (wfr-review-issue.yml@1.2.0), automerge (wfr-automerge-find-pr-from-pull-request.yml@1.2.0, etc.). Repo clone: git clone https://github.com/xn-intenton-z2a/agentic-lib.git; build: npm install, npm test, ./mvnw clean package; AWS setup: create-role, put-role-policy, assume-role (role ARN arn:aws:iam::541134664601:role/agentic-lib-deployment-role), verify via aws sts get-caller-identity; Agent config: schedule 'schedule-3', paths with exact file paths and limits; Execution: npm run build, npm test, npm run start; IAM trust JSON and GitHub Actions role config provided; SDK methods: createIssue(issueTitle: string), selectIssue(), applyIssueResolution(), createPullRequest(), automerge(prIdentifier: string); commands for CDK deploy and destroy; S3 and CloudWatch log commands provided.

## Sanitised Extract
Table of Contents:
1. Workflow Specifications
   - Issue Creator: workflow file wfr-create-issue.yml@1.2.0, input parameter issueTitle (default: 'house choice').
   - Issue Worker: includes wfr-select-issue.yml@1.2.0, wfr-apply-issue-resolution.yml@1.2.0, wfr-create-pr.yml@1.2.0.
   - Issue Reviewer: uses wfr-review-issue.yml@1.2.0.
   - Automerge: triggers wfr-automerge-find-pr-from-pull-request.yml@1.2.0, wfr-automerge-find-pr-in-check-suite.yml@1.2.0, wfr-automerge-label-issue.yml@1.2.0, wfr-automerge-merge-pr.yml@1.2.0.
2. Repository Setup and Local Development
   - Clone command: git clone https://github.com/xn-intenton-z2a/agentic-lib.git
   - Node.js (v20+), AWS CLI, Java JDK 11+, Maven, AWS CDK 2.x required.
   - Build commands: npm install, npm test, ./mvnw clean package
3. AWS Deployment
   - Trust policy JSON for agentic-lib-deployment-role with Allow actions for sts:AssumeRole and sts:AssumeRoleWithWebIdentity.
   - AWS CLI commands: aws iam create-role with role-name agentic-lib-deployment-role; aws iam put-role-policy with policy document file://agentic-lib-deployment-permissions-policy.json.
   - Assume Role using aws sts assume-role and export AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN.
   - Verify with aws sts get-caller-identity and list policies via aws iam list-role-policies.
4. Agent Configuration File
   - schedule: schedule-3
   - paths: missionFilepath ('MISSION.md'), librarySourcesFilepath ('sandbox/SOURCES.md', permissions [write], limit 16), libraryDocumentsPath ('sandbox/library/', permissions [write], limit 64), featuresPath ('sandbox/features/', permissions [write], limit 8), contributingFilepath ('CONTRIBUTING.md'), targetTestsPath ('sandbox/tests/'), otherTestsPaths (['tests/unit/']), targetSourcePath ('sandbox/source/', permissions [write]), otherSourcePaths (['src/lib/']), dependenciesFilepath ('package.json'), documentationPath ('sandbox/docs/', permissions [write]), formattingFilepath ('.prettierrc'), lintingFilepath ('eslint.config.js'), readmeFilepath ('README.md').
   - Execution commands: buildScript: npm run build, testScript: npm test, mainScript: npm run start.
   - Issue limits: featureDevelopmentIssuesWipLimit: 3, maintenanceIssuesWipLimit: 3, attemptsPerBranch: 2, attemptsPerIssue: 1.
5. AWS and GitHub Actions Best Practices
   - Use dotenv, openai, zod in package.json.
   - Role assumption in GitHub Actions with aws-actions/configure-aws-credentials@v4 and actions/setup-node@v3.
   - Troubleshooting: Check for CDK errors; ignore background thread NullPointer while deployment if output is BUILD SUCCESS.
   - Log deletion commands for CloudWatch: aws logs delete-log-group for telemetry and lambda logs.
   - S3 operations: Using aws s3 cp and aws s3 ls; list object versions with aws s3api list-object-versions piped to jq.
6. Detailed Implementation Patterns
   - Code changes trigger series: Create Issue -> Issue Worker -> Automerge -> Review Issue (or timer based).
   - Chain workflow design using outputs as inputs for subsequent workflows (e.g. issue review output fixed flag).
   - Modular SDK integration via GitHub workflow calls using specific version tags.

## Original Source
agentic-lib Workflows
https://github.com/xn-intenton-z2a/agentic-lib

## Digest of AGENTIC_LIB

# AGENTIC_LIB
Date Retrieved: 2023-10-11

## Overview
The agentic-lib system is a collection of reusable GitHub Actions workflows that execute autonomous development processes. Workflows are triggered using GitHub's workflow_call event, functioning like an SDK to compose modular operations including issue creation, review, merge, and AWS deployment.

## Repository Structure
- Top-level files: Dockerfile, package.json, cdk.json, pom.xml, compose.yml
- Source Code: src/lib/main.js, aws/main/java/com/intention/AgenticLib/AgenticLibApp.java, AgenticLibStack.java
- Tests: tests/unit/main.test.js
- Workflows: Located in .github/workflows/ (e.g. issue-creator.yml, issue-worker.yml, automerge.yml)

## Workflow Components
1. Issue Management
   - Issue Creator: Uses wfr-create-issue.yml@1.2.0; parameters include issueTitle (default: 'house choice')
   - Issue Worker: Comprises wfr-select-issue.yml@1.2.0, wfr-apply-issue-resolution.yml@1.2.0, wfr-create-pr.yml@1.2.0
   - Issue Reviewer: Uses wfr-review-issue.yml@1.2.0
   - Automerge: Uses multiple workflows (wfr-automerge-find-pr-from-pull-request.yml@1.2.0, etc.)

2. Repository Setup and Local Development
   - Clone the repository: git clone https://github.com/xn-intenton-z2a/agentic-lib.git
   - Node.js dependencies: npm install and npm test
   - Java build: ./mvnw clean package
   - AWS CDK bootstrap required

3. AWS Deployment (CDK based)
   - Create trust policies and roles using provided JSON examples
   - Use AWS CLI for role creation and permission assignment
   - Commands include: aws iam create-role, aws iam put-role-policy, aws sts assume-role
   - Deployment commands: npx cdk deploy, npx cdk destroy and related AWS CLI log commands

4. Agent Config & Execution
   - Agent config file parameters:
     • schedule: 'schedule-3'
     • paths: missionFilepath, librarySourcesFilepath, libraryDocumentsPath, featuresPath, contributingFilepath, targetTestsPath, otherTestsPaths, targetSourcePath, otherSourcePaths, dependenciesFilepath, documentationPath, formattingFilepath, lintingFilepath, readmeFilepath
     • Execution commands: buildScript (npm run build), testScript (npm test), mainScript (npm run start)
     • Limits: featureDevelopmentIssuesWipLimit: 3, maintenanceIssuesWipLimit: 3, attemptsPerBranch: 2, attemptsPerIssue: 1

## Licensing and Attribution
- Mixed licenses: GPL-3.0 and MIT; derived works must include attribution "This work is derived from https://github.com/xn-intenton-z2a/agentic-lib"

## Attribution & Data Size
- Data Size: 668699 bytes
- Crawled with 4488 links and no errors

## Attribution
- Source: agentic-lib Workflows
- URL: https://github.com/xn-intenton-z2a/agentic-lib
- License: Apache-2.0
- Crawl Date: 2025-05-01T23:40:02.140Z
- Data Size: 668699 bytes
- Links Found: 4488

## Retrieved
2025-05-01
