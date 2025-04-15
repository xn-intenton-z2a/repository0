# Uses intentïon -agentic-lib- Feature

The **intentïon -agentic-lib-** is a collection of reusable GitHub Actions workflows that enable your 
repository to operate in an “agentic” manner. Autonomous workflows communicate through branches and 
issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be invoked using 
GitHub’s -workflow_call- event, so they can be composed together like an SDK. This project itself is evolving, using this
tool and the reusable workflows shall become bundled actions in due course.

*Warning:* Executing these workflows shall incur charges on your OpenAI account and consume chargeable GitHub Actions resources minutes.

*Warning:* Experimental. This coding system has generated a few interesting examples (I have been educated) but nothing of personal utility.

*Warning:* This project is not yet ready for production use. You should not point the -agentic-lib- workflows a repository containing existing intellectual property.

Mixed licensing:
* This project is licensed under the GNU General Public License (GPL).
* This file is part of the example suite for -agentic-lib- see: https://github.com/xn-intenton-z2a/agentic-lib
* This file is licensed under the MIT License. For details, see LICENSE-MIT

[Start using the Repository Template](https://github.com/xn-intenton-z2a/repository0)

Examples:
* [-repository0-plot-code-lib-](https://github.com/xn-intenton-z2a/repository0-plot-code-lib) - A CLI generating SVG and novel formats plots for formulae. 
* Send a PR to add your example, either descending from -repository0- or using the -agentic-lib- SDK directly.

## Should you use the -agentic-lib- Coding System?

* Can you access an OpenAI account with API keys that can access at least -o3-mini- ?
* Are you willing to incur charges the resources consumed by the OpenAI API and GitHub Actions ?
* Are you curious as to where self-evolving code might lead ?
* Would you like to see how such a system can be built and has been built ?
* Do you like that it's OpenAI and GitHub API calls wired together in JS (GitHub Script) and packaged as GitHub Workflows* ?
* Do you appreciate that you need -dotenv, openai, zod- in your -package.json- because the JS has dependencies on them ?

*Actions with bundled JS coming soon.

---

## Getting Started

Clone a seed repository which is pre-configured with the reusable workflows and scripts: https://github.com/xn-intenton-z2a/repository0

### Initiating the workflow

Run the action "Create Issue" and enter some text to create an issue. This will create an issue and trigger the 
"Issue Worker" to write the code. If the Issue Worker is able to resolve the issue a Pull Request is raised, the change 
automatically merged. The issue reviewed and closed if the change is deemed to have delivered whatever was requested in the issue.

Development Workflows:
---
On timer / Manual: Create Issue (new issue opened) 
-> Issue Worker (code changed, issue updated) 
-> Automerge (code merged)
-> Review Issue (issue reviewed and closed)

On timer: Issue Worker (code changed, issue updated) 
-> Automerge (code merged)
-> Review Issue (issue reviewed and closed)

On timer: Automerge (code merged)
-> Review Issue (issue reviewed and closed)

On timer: Review Issue (issue reviewed and closed)
---
(Each workflow is triggered by the previous one and also on a schedule so that failures can be recovered from.)

### Tuning the agentic coding system

The default set-up is quite open which can be chaotic. To temper this chaos you can change these files which the workflow takes into consideration:
- -CONTRIBUTING.md- - The workflow is itself a contributor and will be asked to follow these guidelines. Start by writing your owm mission statement.
- -eslint.config.js- - Code style rules and additional plugins can be added here.

The following files are also taken into consideration but may also be changed (even blanked out completely) by the workflow:
- -README.md-
- -package.json-
- -src/lib/main.js-
- -tests/unit/main.test.js-

**Chain Workflows Together:**  
   Use outputs from one workflow as inputs for another. For example, if an issue review workflow outputs -fixed-, then trigger an automerge workflow based on that flag.

**Customize Parameters:**  
   Each workflow accepts parameters with sensible defaults. Override them as needed to fit your project’s structure and requirements.

**Seed and Evolve:**  
   With a simple prompt (e.g. a new issue), the system will automatically review, generate fixes using ChatGPT, commit changes, and merge them—allowing the program to evolve autonomously.

---

# Agentic Development System Guide

This guide explains how the various workflows of the Agentic Coding Systems work together to automate and streamline your development process. Think of these workflows as modular SDK components that encapsulate common operations—publishing, testing, issue management, dependency updates, code formatting, and more—allowing you to build an agentic development system for your projects.

---

## Issue Management Workflows
These workflows generalize the concept of work items as “tasks” rather than platform-specific issues.

### Issue Creator (-issue-creator.yml-)
- **Function:** Creates a new task based on predefined prompts.
- **Reusable Workflow:** [-wfr-create-issue.yml@1.2.0-](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-create-issue.yml@1.2.0)
- **Trigger:** Manual dispatch or scheduled events with input parameters.

### Issue Worker (-issue-worker.yml-)
- **Function:** Selects, validates, and initiates work on existing tasks.
- **Reusable Workflows:**
  - [-wfr-select-issue.yml@1.2.0-](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-select-issue.yml@1.2.0)
  - [-wfr-apply-issue-resolution.yml@1.2.0-](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-apply-issue-resolution.yml@1.2.0)
  - [-wfr-create-pr.yml@1.2.0-](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-create-pr.yml@1.2.0)

### Issue Reviewer (-issue-reviewer.yml-)
- **Function:** Reviews and finalizes tasks once work is complete.
- **Reusable Workflow:** [-wfr-review-issue.yml@1.2.0-](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-review-issue.yml@1.2.0)

### Automerge Workflow (-automerge.yml-)
- **Function:** Automatically merges pull requests when criteria are met.
- **Reusable Workflows:**
  - [-wfr-automerge-find-pr-from-pull-request.yml@1.2.0-](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-automerge-find-pr-from-pull-request.yml@1.2.0)
  - [-wfr-automerge-find-pr-in-check-suite.yml@1.2.0-](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-automerge-find-pr-in-check-suite.yml@1.2.0)
  - [-wfr-automerge-label-issue.yml@1.2.0-](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-automerge-label-issue.yml@1.2.0)
  - [-wfr-automerge-merge-pr.yml@1.2.0-](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-automerge-merge-pr.yml@1.2.0)

---

## Reusable Workflows SDK Guide

Think of each reusable workflow as a function in an SDK:
- **Inputs:** Parameters (e.g., -versionIncrement-, -buildScript-, -issueTitle-) customize workflow behavior.
- **Outputs:** Results such as task status, pull request numbers, or merge status.
- **Integration:** Invoke these workflows via GitHub Actions workflow calls, schedule triggers, or manual dispatch. They encapsulate complex operations into modular, reusable components.

### Example: Invoking the Issue Creator Workflow
---yaml
on:
  workflow_dispatch:
    inputs:
      issueTitle:
        description: 'Title for the new task'
        required: false
        default: 'house choice'
---
Internally, this triggers [-wfr-create-issue.yml@1.2.0-](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-create-issue.yml@1.2.0) to generate an issue template based on provided parameters.

---

## Repository Setup Guide

Follow these steps to set up your repository using the agentic development system:

1. **Create a Repository from Template:**
   - Begin with a repository template that includes the top-level workflows (e.g., -publish.yml-, -test.yml-, -issue-creator.yml-, etc.).
   - Clone the repository locally.

2. **Configure Repository Settings:**
   - Ensure your repository supports Node.js (v20+).
   - Add necessary secrets (e.g., -CHATGPT_API_SECRET_KEY-, -GITHUB_TOKEN-) via your repository settings.

3. **Customize Workflow Inputs:**
   - Edit workflow files under -.github/workflows/- to match your project specifics (e.g., branch names, file paths).
   - Update configuration files such as -dependabot.yml- and -FUNDING.yml- as needed.

---

## Component Breakdown

This repository is organized into three distinct areas to help you understand the purpose and maturity level of each component:

### 1. Re‑usable Workflows (Core Functionality)
- **Purpose:**  
  These workflows form the backbone of the agentic‑lib system, enabling automated coding processes such as testing, publishing, and issue management.
- **Stability:**  
  They are stable and well‑tested, designed to be integrated into your CI/CD pipelines.
- **Licensing:**  
  The core workflows are released under GPL‑3 and include an attribution requirement for any derived work.
- **Location:**  
  Find these in the -.github/workflows/- directory.

### 2. Example Workflows (Demonstrative Content)
- **Purpose:**  
  These files provide practical examples of how to use the core workflows. They serve as learning tools and reference implementations.
- **Stability:**  
  While functional, they are intended primarily for demonstration and experimentation.
- **Licensing:**  
  The example workflows are covered by the MIT license to allow for broader use and modification.
- **Location:**  
  Look in the -examples/- directory for sample implementations.

### 3. The Evolving main.js (Experimental Work in Progress)
- **Purpose:**  
  This file showcases experimental features and serves as a testbed for integrating new ideas into the system.
- **Stability:**  
  It is under active development and may change frequently. It represents bleeding‑edge functionality that might not yet be production‑ready.
- **Licensing:**  
  As part of the core project, it is under GPL‑3 with the attribution clause.
- **Location:**  
  The experimental code is located in -src/lib/main.js-.

Each of these components is documented separately to ensure you can quickly determine which parts are ready for use and which are intended as examples or experimental features.

---

## Project Structure

The key components of the project are organized as follows:

---text
.
├── Dockerfile
├── package.json
├── cdk.json
├── pom.xml
├── compose.yml
├── src/lib/main.js
├── aws/main/java/com/intention/AgenticLib/AgenticLibApp.java
├── aws/main/java/com/intention/AgenticLib/AgenticLibStack.java
├── aws/test/java/com/intentïon/AgenticLib/AgenticLibStackTest.java
└── tests/unit/main.test.js
---

Additional files include GitHub workflows (for CI/CD and maintenance scripts) and various helper scripts under the -scripts/- directory.

---

## Getting Started with local development

### Prerequisites

- [Node.js v20+](https://nodejs.org/)
- [AWS CLI](https://aws.amazon.com/cli/) (configured with sufficient permissions)
- [Java JDK 11+](https://openjdk.java.net/)
- [Apache Maven](https://maven.apache.org/)
- [AWS CDK 2.x](https://docs.aws.amazon.com/cdk/v2/guide/home.html) (your account should be CDK bootstrapped)
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)

---

## Local Development Environment

### Clone the Repository

---bash

git clone https://github.com/xn-intenton-z2a/agentic-lib.git
cd agentic-lib
---

### Install Node.js dependencies and test

---bash

npm install
npm test
---

### Build and test the Java Application

---bash
./mvnw clean package
---

## Setup for AWS CDK

You'll need to have run -cdk bootstrap- to set up the environment for the CDK. This is a one-time setup per AWS account and region.
General administrative permissions are required to run this command. (NPM installed the CDK.)

In this example for a user -antony-local-user- and a role -agentic-lib-github-actions-role- (create them if you need to)
we would add the following trust policy so that they can assume the role: -agentic-lib-deployment-role-:
---json
-
	"Version": "2012-10-17",
	"Statement": [
		-
			"Sid": "Statement1",
			"Effect": "Allow",
			"Action": ["sts:AssumeRole", "sts:TagSession"],
			"Resource": ["arn:aws:iam::541134664601:role/agentic-lib-deployment-role"]
		-
	]
-
---

The -agentic-lib-github-actions-role- also needs the following trust entity to allow GitHub Actions to assume the role:
---json
-
    "Version": "2012-10-17",
    "Statement": [
        -
            "Effect": "Allow",
            "Principal": -
                "Federated": "arn:aws:iam::541134664601:oidc-provider/token.actions.githubusercontent.com"
            -,
            "Action": "sts:AssumeRoleWithWebIdentity",
            "Condition": -
                "StringEquals": -
                    "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
                -,
                "StringLike": -
                    "token.actions.githubusercontent.com:sub": "repo:xn-intenton-z2a/agentic-lib:*"
                -
            -
        -
    ]
-
---

Create the IAM role with the necessary permissions to assume role from your authenticated user:
---bash

cat <<'EOF' > agentic-lib-deployment-trust-policy.json
-
  "Version": "2012-10-17",
  "Statement": [
    -
      "Effect": "Allow",
      "Principal": -
        "AWS": [
          "arn:aws:iam::541134664601:user/antony-local-user",
          "arn:aws:iam::541134664601:role/agentic-lib-github-actions-role"
        ]
      -,
      "Action": "sts:AssumeRole"
    -
  ]
-
EOF
aws iam create-role \
  --role-name agentic-lib-deployment-role \
  --assume-role-policy-document file://agentic-lib-deployment-trust-policy.json
---

Add the necessary permissions to deploy -agentic-lib-:
---bash

cat <<'EOF' > agentic-lib-deployment-permissions-policy.json
-
  "Version": "2012-10-17",
  "Statement": [
    -
      "Effect": "Allow",
      "Action": [
        "cloudformation:*",
        "iam:*",
        "s3:*",
        "cloudtrail:*",
        "logs:*",
        "events:*",
        "lambda:*",
        "dynamodb:*",
        "sqs:*",
        "sts:AssumeRole"
      ],
      "Resource": "*"
    -
  ]
-
EOF
aws iam put-role-policy \
  --role-name agentic-lib-deployment-role \
  --policy-name agentic-lib-deployment-permissions-policy \
  --policy-document file://agentic-lib-deployment-permissions-policy.json
---

Assume the deployment role:
---bash

unset AWS_ACCESS_KEY_ID
unset AWS_SECRET_ACCESS_KEY
unset AWS_SESSION_TOKEN
ROLE_ARN="arn:aws:iam::541134664601:role/agentic-lib-deployment-role"
SESSION_NAME="agentic-lib-deployment-session-local"
ASSUME_ROLE_OUTPUT=$(aws sts assume-role --role-arn "$ROLE_ARN" --role-session-name "$SESSION_NAME" --output json)
if [ $? -ne 0 ]; then
  echo "Error: Failed to assume role."
  exit 1
fi
export AWS_ACCESS_KEY_ID=$(echo "$ASSUME_ROLE_OUTPUT" | jq -r '.Credentials.AccessKeyId')
export AWS_SECRET_ACCESS_KEY=$(echo "$ASSUME_ROLE_OUTPUT" | jq -r '.Credentials.SecretAccessKey')
export AWS_SESSION_TOKEN=$(echo "$ASSUME_ROLE_OUTPUT" | jq -r '.Credentials.SessionToken')
EXPIRATION=$(echo "$ASSUME_ROLE_OUTPUT" | jq -r '.Credentials.Expiration')
echo "Assumed role successfully. Credentials valid until: $EXPIRATION"
---
Output:
---log
Assumed role successfully. Credentials valid until: 2025-03-25T02:27:18+00:00
---

Check the session:
---bash

aws sts get-caller-identity
---

Output:
---json
-
  "UserId": "AROAX37RDWOM7ZHORNHKD:3-sqs-bridge-deployment-session",
  "Account": "541134664601",
  "Arn": "arn:aws:sts::541134664601:assumed-role/agentic-lib-deployment-role/3-sqs-bridge-deployment-session"
-
---

Check the permissions of the role:
---bash

aws iam list-role-policies \
  --role-name agentic-lib-deployment-role
---
Output (the policy we created above):
---json
-
  "PolicyNames": [
    "agentic-lib-deployment-permissions-policy"
  ]
-
---

An example of the GitHub Actions role being assumed in a GitHub Actions Workflow:
---yaml
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
---

## Deployment to AWS

See also:
* local running using [Localstack](LOCALSTACK.md).
* Debugging notes for the AWS deployment here [DEBUGGING](DEBUGGING.md).

Package the CDK, deploy the CDK stack which rebuilds the Docker image, and deploy the AWS infrastructure:
---bash

./mvnw clean package
---

Maven build output:
---log
...truncated...
[INFO] 
[INFO] Results:
[INFO] 
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
[INFO] 
[INFO] 
[INFO] --- jar:3.4.1:jar (default-jar) @ agentic-lib ---
[INFO] Building jar: /Users/antony/projects/agentic-lib/target/agentic-lib-2.8.1-0.jar
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  18.775 s
[INFO] Finished at: 2025-04-02T00:59:55+01:00
[INFO] ------------------------------------------------------------------------
Unexpected error in background thread "software.amazon.jsii.JsiiRuntime.ErrorStreamSink": java.lang.NullPointerException: Cannot read field "stderr" because "consoleOutput" is null
---
(Yes... the last line, the error "is a bug in the CDK, but it doesn't affect the deployment", according to Copilot.)

Destroy a previous stack and delete related log groups:
---bash

npx cdk destroy
---
(The commands go in separately because the CDK can be interactive.)
---bash

aws logs delete-log-group \
  --log-group-name "/aws/s3/agentic-lib-telemetry-bucket"
aws logs delete-log-group \
  --log-group-name "/aws/lambda/agentic-lib-digest-function"
---

Create a file -secrets.env- with the following content:
---bash

export PERSONAL_ACCESS_TOKEN=Your Personal Access Token with packages:read
---

Deploys the AWS infrastructure including an App Runner service, an SQS queue, Lambda functions, and a PostgreSQL table.
---bash

. ./secrets.env
npx cdk deploy
---

Example output:
---log
...truncated...
AgenticLibStack: deploying... [1/1]
AgenticLibStack: creating CloudFormation changeset...

 ✅  AgenticLibStack

✨  Deployment time: 78.98s

Outputs:
AgenticLibStack.DigestLambdaArn = arn:aws:lambda:eu-west-2:541134664601:function:agentic-lib-digest-function
AgenticLibStack.DigestQueueUrl = https://sqs.eu-west-2.amazonaws.com/541134664601/agentic-lib-digest-queue
AgenticLibStack.EventsBucketArn = arn:aws:s3:::agentic-lib-telemetry-bucket
AgenticLibStack.EventsS3AccessRoleArn = arn:aws:iam::541134664601:role/agentic-lib-telemetry-bucket-writer-role
AgenticLibStack.digestLambdaFunctionName = agentic-lib-digest-function (Source: CDK context.)
AgenticLibStack.digestLambdaHandlerFunctionName = digestLambdaHandler (Source: CDK context.)
...truncated...
AgenticLibStack.sqsDigestQueueArn = arn:aws:sqs:eu-west-2:541134664601:agentic-lib-digest-queue (Source: CDK context.)
AgenticLibStack.sqsDigestQueueName = agentic-lib-digest-queue (Source: CDK context.)
Stack ARN:
arn:aws:cloudformation:eu-west-2:541134664601:stack/AgenticLibStack/62d89c60-0f62-11f0-852e-02fc4561559f

✨  Total time: 116.49s

---

Write to S3 (2 keys, 2 times each, interleaved):
---bash

aws s3 ls agentic-lib-telemetry-bucket/events/
for value in $(seq 1 2); do
  for id in $(seq 1 2); do
    echo "-\"id\": \"$-id?-\", \"value\": \"$(printf "%010d" "$-value?-")\"-" > "$-id?-.json"
    aws s3 cp "$-id?-.json" s3://agentic-lib-telemetry-bucket/events/"$-id?-.json"
  done
done
aws s3 ls agentic-lib-telemetry-bucket/events/
---

Output:
---
upload: ./1.json to s3://agentic-lib-telemetry-bucket/events/1.json    
upload: ./1.json to s3://agentic-lib-telemetry-bucket/events/1.json   
...
upload: ./2.json to s3://agentic-lib-telemetry-bucket/events/2.json   
2025-03-19 23:47:07         31 1.json
2025-03-19 23:52:12         31 2.json
---

List the versions of all s3 objects:
---bash

aws s3api list-object-versions \
  --bucket agentic-lib-telemetry-bucket \
  --prefix events/ \
  | jq -r '.Versions[] | "\(.LastModified) \(.Key) \(.VersionId) \(.IsLatest)"' \
  | head -5 \
  | tail -r
---

Output (note grouping by key, requiring a merge by LastModified to get the Put Event order):
---log
2025-03-23T02:37:10+00:00 events/2.json NGxS.PCWdSlxMPVIRreb_ra_WsTjc4L5 false
2025-03-23T02:37:12+00:00 events/2.json 7SDSiqco1dgFGKZmRk8bjSoyi5eD5ZLW true
2025-03-23T02:37:09+00:00 events/1.json cxY1weJ62JNq4DvqrgfvIWKJEYDQinly false
2025-03-23T02:37:11+00:00 events/1.json wHEhP8RdXTD8JUsrrUlMfSANzm7ahDlv true
---

Check the projections table:
---bash

aws dynamodb scan \
  --table-name agentic-lib-projections-table \
  --output json \
  | jq --compact-output '.Items[] | with_entries(if (.value | has("S")) then .value = .value.S else . end)' \
  | tail --lines=5
---

Output:
---json lines
-"id":"events/1.json","value":"-\"id\": \"1\", \"value\": \"0000000002\"-\n"-
-"id":"events/2.json","value":"-\"id\": \"2\", \"value\": \"0000000002\"-\n"-
---

Count the attributes on the digest queue:
---bash

aws sqs get-queue-attributes \
  --queue-url https://sqs.eu-west-2.amazonaws.com/541134664601/agentic-lib-digest-queue \
  --attribute-names ApproximateNumberOfMessages
---

Output:
---json
-
  "Attributes": -
    "ApproximateNumberOfMessages": "4"
  -
-
---

---

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### TODO

Re-usable GitHub Actions Workflows:
- [x] Implement "apply-fix" by raising a bug, then running start-issue (with a new name) in a tolerant mode allowing builds to fail but gathering output.
- [x] Run apply fix on a schedule checking if a fix is necessary.
- [x] Add check for failed Test run then re-instate. e.g. #workflow_run:  workflows: - "Tests" / types: - completed
- [x] Detect failing build rather than relying on a passive no change
- [x] Trigger apply fix when a test run completes and attempt a fix if the tests failed, ideally just for automated branches (issues, agentic-lib-formatting, apply-linting). <- This will then fix a broken PR branch or a broken main branch.
- [x] Write issue body when creating an issue from a linting error.
- [x] repository0 init workflow which archives the 4 files (1 of 4): a generic README, package.json, src/lib/main.js, tests/unit/main.test.js, and initialises a CONTRIBUTING.md.
- [x] apply fix should create a PR if it passes.
- [x] use a single branch pre-fix and check it to avoid conflicts.
- [x] pass the change description for the commit message.
- [x] locate the issue number in apply-fix and comment the issue.
- [x] apply-fix to be able to apply a fix to the main branch.
- [x] apply-fix check branches for conflicts and try to resolve them.
- [x] pull before changes to reduce the chance of conflicts.
- [x] Dashboard metrics from github (e.g. GitHub Insights? commits by agents).
- [ ] apply-fix to add issue details to the completion request.
- [ ] Add git log to the context for review issue, issue worker and apply fixes.
- [ ] apply-fix to check if an issue is resolved before raising a PR.
- [ ] issue-worker to check if an issue is resolved before raising a PR.
- [ ] Add PR review comments via LLM.
- [ ] Add PR review comments resolution via LLM.
- [ ] Make a PR review required to automerge a PR.
- [ ] Update CHANGELOG.md when a publishing a release version of the changes since the last release.
- [ ] Duplicate the test when publishing a release version with a version numbered test file.
- [ ] Generate API.md based on the source file.
- [ ] Consider: semantic-release for releasing versions.
- [ ] Expose parameters for wrapped action steps with defaults matching the action steps defaults behaviour.
- [ ] Pre-request with file and a some context in a completions request for which files should be sent.

Supervisor:
- [x] Deploy a s3-sqs-bridge Stack from the agentic-lib project.
- [x] Publish GitHub telemetry data to S3.
- [x] Reintegrate the s3-sqs-bridge workflows with agentic-lib.
- [x] Switch to generating issues based on the prompts.
- [x] Reinstate the agentic workflows in s3-sqs-bridge with maintenance focused tasks.
- [x] Create a feature refiner.
- [x] Provide the feature set to all LLM submissions.
- [x] Create a feature issue creator that creates issues for a feature (like the mission prompt) for a feature picked from 'features/build'.
- [x] Distribute the issue maintenance agentic-lib workflows to the other repositories and remove the renamed ones.
- [x] Prune the features.
- [x] Scan the rejects (names) and avoid adding similar features.
- [x] Dashboard metrics from s3 into the existing all stats dashboard.
- [x] remove urls from the bottom of the stats pages
- [x] fix deployment
- [x] change stats assume role to agentic-lib-bucket-writer-role
- [x] copy website and stats json files to the bucket agentic-lib-public-website-stats-bucket
- [x] rename agentic-lib-bucket to agentic-lib-telemetry-bucket
- [x] create an issue WIP limit in agentic-lib.yml
- [x] Add a NaN filter to stop any NaN issues from being created.
- [x] In Apply Fix, limit the number if attempts to [work++fix] a branch on an issue to 3 (as per agentic-lib.yml), then comment the issue and delete the branch.
- [x] In Issue Worker, limit the number if attempts to [work] an issue on an issue to 2 (as per agentic-lib.yml), then comment and close the issue. 
- [x] Before trying to apply fix a make sure there isn't an open PR.
- [x] In auto-merge, close PRs and delete branches which have conflicts.
- [x] Expose check states in the stats.
- [ ] Do this everywhere:  echo "$-- env.npmAuthOrganisation --:registry=https://npm.pkg.github.com" >> .npmrc
- [ ] Place all AWS config in repository variables and handle blank by skipping the steps if blank.
- [ ] Set repository0 to skip github pages and s3 by default
- [ ] Set s3-sqs-bridge to be github pages only
- [ ] Invoke agentic-lib workflows based on GitHub telemetry projections (e.g. build broken => apply fix) and relabel "engine" to "schedule".
- [ ] Expose the stats generate-stats step as a GitHub Action.

Schedule based workflow refinement:
- [ ] Add an issue refiner that picks and issues either sets 'ready', improves the issue, or closes it if irrelevant. (Then change the issue worker to look for 'ready' issues.)
- [ ] Mark in-progress issues as such, (Then change the issue worker to ignore 'in-progress' issues.)
- [ ] Allow the reviewer to remove an 'in-progress' label and restore 'automated' if the issues is not resolved.

Knowledge based refinement:
- [ ] Maintain a list of data sources suitable for crawling and querying in relation to software, science and business.
- [ ] Build a library of documents useful to the project mission statement of current tech or features, sanitise, normalise to a common word limit, and store them the repository.
- [ ] Use the documents to generate new features or refine existing ones and add to a library wishlist.
- [ ] Supply a subset of relevant documents to the LLM when working on issues or bugs.
- [ ] Add to the library wishlist when a bug is observed or when a library or pattern is used.

Supervisor launch:
- [ ] Publish a demo to GitHub sites that animates issue workflow, git logs applying changes to files and raising PRs with live links to the repository and a draggable timeline.

Marketplace GitHub Actions:
- [ ] Consolidate reusable workflows jobs into a single GitHub Action GitHub Script step.
- [ ] Move GitHub Script to a GitHub Action.
- [ ] Build GitHub Action with the release process.
- [ ] Switch example workflows to use the GitHub Actions.
- [ ] Convert the actions library JS to an SDK.

---

## License

This project is licensed under the GNU General Public License (GPL). See [LICENSE](LICENSE) for details.

License notice:
---
agentic-lib
Copyright (C) 2025 Polycode Limited

agentic-lib is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License v3.0 (GPL‑3).
along with this program. If not, see <https://www.gnu.org/licenses/>.

IMPORTANT: Any derived work must include the following attribution:
"This work is derived from https://github.com/xn-intenton-z2a/agentic-lib"
---

*IMPORTANT*: The project README and any derived work should always include the following attribution:
_"This work is derived from https://github.com/xn-intenton-z2a/agentic-lib"_
