# repository0

Thank you for your interest in contributing to **agentic‑lib**! This document outlines our guidelines for human and
automated contributions, ensuring that our core library remains robust, testable, and efficient in powering our reusable
GitHub workflows.

## Mission Statement

`repository0` is a demo repository that showcases the GitHub workflows imported from intentïon `agentic‑lib`. Its 
primary purpose is to demonstrate these automated CI/CD workflows. The source file, test file, README.md and package.json
are maintained by the repository's workflows.

The mission of the contributors is to help people who clone this repository and promote healthy collaboration.

The repository workflows that users will work with in their cloned repositories are concatenated below:
START_OF_CONCATENATED_WORKFLOW_FILES
```
./.github/FUNDING.yml
==== Content of ./.github/FUNDING.yml ====
github: Antony-at-Polycode
# paypal: https://www.paypal.com/donate/?hosted_button_id=Y8PK8XP3EJLWG
./.github/workflows/publish.yml
==== Content of ./.github/workflows/publish.yml ====
# .github/workflows/publish.yml
#
# This file is part of the example suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT

name: Publish
run-name: 'Publish packages [${{ github.ref_name }}] [${{ github.event.head_commit.message }}]'
concurrency: branch-${{ github.ref_name }}

on:
  push:
    branches:
      # When publishing from a branch, add branch name here, e,g, 'beta'
      - main
    paths:
      - '**/*.sh'
      - '**/*.js'
      - '**/*.json'
      - '**/*.yml'
      - '**/*.properties'
      - '!intentions/**'
      - '!conversations/**'
      - '!exports/**'
      - '!programs/**'
      - '!results/**'
  workflow_dispatch:
    inputs:
      versionIncrement:
        description: 'Select the Semantic Versioning segment to increment'
        required: true
        default: 'prerelease'
        type: choice
        options:
          - prerelease
          - patch
          - minor
          - major
          - premajor
          - preminor
          - prepatch

jobs:

  npm-test-and-run-main:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci

      - name: test
        id: test
        shell: bash
        run: 'npm test'

      - name: main
        id: main
        shell: bash
        run: timeout 5m ${{ vars.MAIN_SCRIPT || 'npm run start' }}

  publish:
    needs:
      - npm-test-and-run-main
    permissions:
      contents: write
      packages: write
    uses: 'xn-intenton-z2a/agentic-lib/.github/workflows/wfr-publish.yml@1.10.1'
    with:
      versionIncrement: ${{ inputs.versionIncrement || 'prerelease' }}
      buildScript: 'npm run build'
      releaseNotes: 'Release incrment: ${{ inputs.versionIncrement }}.'
      npmAuthOrganisation: 'xn-intenton-z2a'
      gitUserEmail: 'action@github.com'
      gitUserName: 'GitHub Actions[bot]'
./.github/workflows/apply-fix.yml
==== Content of ./.github/workflows/apply-fix.yml ====
# .github/workflows/apply-fix.yml
#
# This file is part of the example suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT

name: Apply Fix on Fail
concurrency:
  issue-worker
  branch-main
run-name: "Apply Fix on Fail [${{ github.ref_name }}]"

on:
  workflow_dispatch:
    inputs:
      target:
        description: 'The source file whose content is used in the resolution prompt. e.g. "src/lib/main.js"'
        required: false
        type: string
        default: 'src/lib/main.js'
      testFile:
        description: 'The test file to run to validate the resolution. e.g. "tests/unit/main.test.js"'
        required: false
        type: string
        default: 'tests/unit/main.test.js'
      applyFixEvenIfTestsPass:
        description: 'Apply the fix even if the tests pass. e.g. true'
        required: false
        type: boolean
        default: true
      scanForBranches:
        description: 'Scan for branches matching the pattern. e.g. true'
        required: false
        type: boolean
        default: false
  workflow_run:
    workflows:
      - 'Tests'
    types:
      - completed
    branches:
      - issue-*
      - apply-formatting
      - apply-update
  schedule:
    - cron: '0 */1 * * *' # Run every 1 hour at 0 minutes past

jobs:

  select-branch:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Fetch all branches
        run: |
          git fetch --all
          git branch -r

      - name: determine-branch
        id: determine
        uses: actions/github-script@v7
        with:
          script: |
            let branch;
            if (context.eventName === "schedule" || context.eventName === "workflow_run" || "${{ inputs.scanForBranches }}" === "true") {
              core.info("Schedule event detected. Scanning for matching branches.");
              const branchesResp = await github.rest.repos.listBranches({
                owner: context.repo.owner,
                repo: context.repo.repo,
              });
              const matchingBranches = branchesResp.data
                .filter(branch => branch.name.match(/^(issue-.*|apply-formatting|apply-update)$/))
                .map(branch => branch.name);
              core.info(`Matching branches: ${matchingBranches}`);
              branch = matchingBranches.length > 0 ? matchingBranches[0] : context.payload.repository?.default_branch || "main";
            } else {
              branch = context.ref.startsWith("refs/heads/") ? context.ref.substring("refs/heads/".length) : context.ref;
            }
            core.info(`Selected branch: ${branch}`);
            core.setOutput("branch", branch);
    outputs:
      branch: ${{ steps.determine.outputs.branch }}

  npm-test:
    needs: select-branch
    name: 'npm test with coverage'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ needs.select-branch.outputs.branch }}
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm test

  npm-build:
    needs: select-branch
    name: 'npm run build'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ needs.select-branch.outputs.branch }}
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run build

  npm-run:
    needs: select-branch
    name: 'npm run start'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ needs.select-branch.outputs.branch }}
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: ${{ vars.MAIN_SCRIPT || 'npm run start' }}

  needs-fix:
    needs:
      - select-branch
      - npm-test
      - npm-build
      - npm-run
    if: >
      ${{ always() &&
         (
           needs.npm-test.result != 'success' ||
           needs.npm-build.result != 'success' ||
           needs.npm-run.result != 'success' ||
           inputs.applyFixEvenIfTestsPass == true
         )
      }}
    runs-on: ubuntu-latest
    steps:
      - name: set-needs-fix
        id: set-needs-fix
        uses: actions/github-script@v7
        with:
          script: |
            const npmTestResult = "${{ needs.npm-test.result }}";
            const npmBuildResult = "${{ needs.npm-build.result }}";
            const npmRunResult = "${{ needs.npm-run.result }}";
            const applyFixEvenIfTestsPass = "${{ inputs.applyFixEvenIfTestsPass }}" === "true";
            const needsFix = npmTestResult !== "success" || npmBuildResult !== "success" || npmRunResult !== "success" || applyFixEvenIfTestsPass;
            core.info(`Needs Fix: ${needsFix}`);
            core.setOutput("needsFix", needsFix);
    outputs:
      needsFix: ${{ steps.set-needs-fix.outputs.needsFix }}

  apply-fix:
    needs:
      - select-branch
      - npm-test
      - npm-build
      - npm-run
      - needs-fix
    if: ${{ always() && needs.needs-fix.outputs.needsFix == 'true' }}
    permissions:
      contents: write
      issues: write
      id-token: write
    uses: 'xn-intenton-z2a/agentic-lib/.github/workflows/wfr-apply-fix.yml@1.10.1'
    with:
      target: ${{ inputs.target || 'src/lib/main.js' }}
      testFile: ${{ inputs.testFile || 'tests/unit/main.test.js' }}
      readmeFile: 'README.md'
      contributingFile: 'CONTRIBUTING.md'
      dependenciesFile: 'package.json'
      formattingFile: '.prettierrc'
      lintingFile: 'eslint.config.js'
      buildScript: 'npm run build'
      testScript: 'npm test'
      mainScript: ${{ vars.MAIN_SCRIPT || 'npm run start' }}
      model: ${{ vars.CHATGPT_API_MODEL || 'o3-mini' }}
      branch: ${{ needs.select-branch.outputs.branch }}
      gitUserEmail: 'action@github.com'
      gitUserName: 'GitHub Actions[bot]'
    secrets:
      CHATGPT_API_SECRET_KEY: ${{ secrets.CHATGPT_API_SECRET_KEY }}

  npm-test-after-fix:
    needs:
      - select-branch
      - npm-test
      - npm-build
      - npm-run
      - needs-fix
      - apply-fix
    if: ${{ always() && needs.needs-fix.outputs.needsFix == 'true' }}
    name: 'npm test with coverage'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ needs.select-branch.outputs.branch }}
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"
      - name: Get latest from remote
        run: |
          git config --local user.email "${{ env.gitUserEmail }}"
          git config --local user.name "${{ env.gitUserName }}"
          git pull --ff-only origin ${{ needs.select-branch.outputs.branch }}
      - run: npm ci
      - run: npm test

  npm-build-after-fix:
    needs:
      - select-branch
      - npm-test
      - npm-build
      - npm-run
      - needs-fix
      - apply-fix
    if: ${{ always() && needs.needs-fix.outputs.needsFix == 'true' }}
    name: 'npm run build'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ needs.select-branch.outputs.branch }}
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"
      - name: Get latest from remote
        run: |
          git config --local user.email "${{ env.gitUserEmail }}"
          git config --local user.name "${{ env.gitUserName }}"
          git pull --ff-only origin ${{ needs.select-branch.outputs.branch }}
      - run: npm ci
      - run: npm run build

  npm-run-after-fix:
    needs:
      - select-branch
      - npm-test
      - npm-build
      - npm-run
      - needs-fix
      - apply-fix
    if: ${{ always() && needs.needs-fix.outputs.needsFix == 'true' }}
    name: 'npm run start'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ needs.select-branch.outputs.branch }}
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"
      - name: Get latest from remote
        run: |
          git config --local user.email "${{ env.gitUserEmail }}"
          git config --local user.name "${{ env.gitUserName }}"
          git pull --ff-only origin ${{ needs.select-branch.outputs.branch }}
      - run: npm ci
      - run: ${{ vars.MAIN_SCRIPT || 'npm run start' }}

  needs-fix-after-fix:
    needs:
      - select-branch
      - npm-test
      - npm-build
      - npm-run
      - needs-fix
      - apply-fix
      - npm-test-after-fix
      - npm-build-after-fix
      - npm-run-after-fix
    if: >
      ${{ always() &&
         (
           needs.npm-test-after-fix.result != 'success' ||
           needs.npm-build-after-fix.result != 'success' ||
           needs.npm-run-after-fix.result != 'success' ||
           inputs.applyFixEvenIfTestsPass == true
         )
      }}
    runs-on: ubuntu-latest
    steps:
      - name: set-needs-fix
        id: set-needs-fix
        uses: actions/github-script@v7
        with:
          script: |
            const npmTestResult = "${{ needs.npm-test-after-fix.result }}";
            const npmBuildResult = "${{ needs.npm-build-after-fix.result }}";
            const npmRunResult = "${{ needs.npm-run-after-fix.result }}";
            const needsFix = npmTestResult !== "success" || npmBuildResult !== "success" || npmRunResult !== "success";
            core.info(`Needs Fix: ${needsFix}`);
            core.setOutput("needsFix", needsFix);
    outputs:
      needsFix: ${{ steps.set-needs-fix.outputs.needsFix }}

  create-pr:
    needs:
      - select-branch
      - npm-test
      - npm-build
      - npm-run
      - apply-fix
      - needs-fix
      - npm-test-after-fix
      - npm-build-after-fix
      - npm-run-after-fix
      - needs-fix-after-fix
    if: ${{ always() && needs.needs-fix.outputs.needsFix == 'true' && needs.needs-fix-after-fix.outputs.needsFix == 'false' }}
    permissions:
      contents: write
      packages: write
      issues: write
      pull-requests: write
      checks: write
      id-token: write
    uses: 'xn-intenton-z2a/agentic-lib/.github/workflows/wfr-create-pr.yml@1.10.1'
    with:
      branch: "${{ needs.select-branch.outputs.branch }}"
      baseBranch: 'main'
      gitCommitMessage: 'Fix applied for failing tests'
      label: 'automerge'
./.github/workflows/truncate-workflow-history.yml
==== Content of ./.github/workflows/truncate-workflow-history.yml ====
# .github/workflows/issue-creator.yml
#
# This file is part of the example suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT

name: ∞ Truncate Workflow Runs
concurrency: truncate-workflow-runs

on:
  workflow_dispatch:
  schedule:
    - cron: '0 0 * * *'

jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - name: Clean up old workflow runs and artifacts
        uses: actions/github-script@v7
        with:
          script: |
            // Set retention period (in days)
            const retentionDays = 7;
            const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
            const owner = context.repo.owner;
            const repo = context.repo.repo;
            const perPage = 100;
            let runsDeleted = 0;
            let artifactsDeleted = 0;

            console.log(`Deleting workflow runs and artifacts older than ${retentionDays} days (before ${cutoffDate.toISOString()})...`);

            // Delete old workflow runs
            let page = 1;
            while (true) {
              const runsResponse = await github.rest.actions.listWorkflowRunsForRepo({
                owner,
                repo,
                per_page: perPage,
                page
              });
              const runs = runsResponse.data.workflow_runs;
              if (runs.length === 0) break;
              for (const run of runs) {
                const runCreatedAt = new Date(run.created_at);
                if (runCreatedAt < cutoffDate) {
                  try {
                    await github.rest.actions.deleteWorkflowRun({
                      owner,
                      repo,
                      run_id: run.id
                    });
                    console.log(`Deleted workflow run ${run.id} (created at ${run.created_at})`);
                    runsDeleted++;
                  } catch (error) {
                    console.error(`Failed to delete run ${run.id}: ${error.message}`);
                  }
                }
              }
              page++;
            }
            console.log(`Total workflow runs deleted: ${runsDeleted}`);

            // Delete old artifacts
            page = 1;
            while (true) {
              const artifactsResponse = await github.rest.actions.listArtifactsForRepo({
                owner,
                repo,
                per_page: perPage,
                page
              });
              const artifacts = artifactsResponse.data.artifacts;
              if (artifacts.length === 0) break;
              for (const artifact of artifacts) {
                const artifactCreatedAt = new Date(artifact.created_at);
                if (artifactCreatedAt < cutoffDate) {
                  try {
                    await github.rest.actions.deleteArtifact({
                      owner,
                      repo,
                      artifact_id: artifact.id
                    });
                    console.log(`Deleted artifact ${artifact.id} (created at ${artifact.created_at})`);
                    artifactsDeleted++;
                  } catch (error) {
                    console.error(`Failed to delete artifact ${artifact.id}: ${error.message}`);
                  }
                }
              }
              page++;
            }
            console.log(`Total artifacts deleted: ${artifactsDeleted}`);

            return `Cleanup complete. Deleted ${runsDeleted} runs and ${artifactsDeleted} artifacts.`;
          result-encoding: string
./.github/workflows/test.yml
==== Content of ./.github/workflows/test.yml ====
# .github/workflows/test.yml
#
# This file is part of the example suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT

name: Tests
run-name: 'Tests [${{ github.ref_name }}] [${{ github.event.head_commit.message }}]'

on:
  push:
    paths:
      - '**/*.sh'
      - '**/*.js'
      - '**/*.json'
      - '**/*.yml'
      - '**/*.properties'
      - '!exports/**'
  workflow_dispatch:
  workflow_run:
    workflows:
      - "Automerge"
    types:
      - completed
  schedule:
    - cron: '45 */6 * * *'

jobs:

  npm-test:
    name: 'npm test with coverage'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm test
./.github/workflows/issue-creator.yml
==== Content of ./.github/workflows/issue-creator.yml ====
# .github/workflows/issue-creator.yml
#
# This file is part of the example suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT

name: Create Issue
concurrency: create-issue
run-name: "Create Issue"

on:
  workflow_dispatch:
    inputs:
      target:
        description: 'An asset (e.g. source file) to reference in the issue. e.g. "src/lib/main.js"'
        required: false
        type: string
        default: 'src/lib/main.js'
      issueTitle:
        description: 'Text to drive the issue title (if "house choice", a currently random prompt will be selected). e.g. "Make a small improvement."'
        required: false
        type: string
        default: 'house choice'
  schedule:
     #- cron: '0 */4 * * *' # Every 4 hours at 0 minutes past
     #- cron: '0 */1 * * *' # Every hour
     - cron: '0,30 * * * *' # Every 30 minutes

jobs:

  create-issue:
    permissions:
      issues: write
      id-token: write
    uses: 'xn-intenton-z2a/agentic-lib/.github/workflows/wfr-create-issue.yml@1.10.1'
    with:
      issueTitle: ${{ inputs.issueTitle || 'house choice' }}
      houseChoiceOptions: |
        Add a new feature to the source file pulling in at most 1 new dependency if you need to.
        || Extend the functionality in the source file.
        || Improve the consistency of the source file and test file.
        || Improve test coverage of the source file by the test file and fix bugs the tests would highlight.
        || Ensure that the main defaults to the usage and some demo output and ensure execution terminates without user input.
        || Synchronise the README with current behaviour and call out future features that have not yet been implemented.
        || Ensure that README.md is consistent with the guidance in the CONTRIBUTING.md.
./.github/workflows/issue-worker.yml
==== Content of ./.github/workflows/issue-worker.yml ====
# .github/workflows/issue-worker.yml
#
# This file is part of the example suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT

name: Issue Worker
concurrency: issue-worker
run-name: "Issue Worker [${{ github.ref_name }}]"

on:
  workflow_dispatch:
    inputs:
      issueNumber:
        description: 'The issue number to resolve. If not provided, the workflow will select one based on label. e.g. "123"'
        required: false
        type: string
        default: ''
      target:
        description: 'The source file whose content is used in the resolution prompt. e.g. "src/lib/main.js"'
        required: false
        type: string
        default: 'src/lib/main.js'
      testFile:
        description: 'The test file to run to validate the resolution. e.g. "tests/unit/main.test.js"'
        required: false
        type: string
        default: 'tests/unit/main.test.js'
      selectionLabel:
        description: 'Label used to filter issues for resolution. e.g. "automated"'
        required: false
        type: string
        default: 'automated'
  workflow_run:
    workflows:
      - "Create Issue"
      - "Linting"
    types:
      - completed
  schedule:
    #- cron: '15 */2 * * *' # Run every 2 hours at 0 minutes past
    #- cron: '*/30 * * * *' # Run every 30 minutes
    - cron: '*/15 * * * *' # Run every 15 minutes

jobs:

  select-issue:
    permissions:
      issues: read
      id-token: write
    uses: 'xn-intenton-z2a/agentic-lib/.github/workflows/wfr-select-issue.yml@1.10.1'
    with:
      issueNumber: ${{ inputs.issueNumber || '' }}
      selectionLabel: ${{ inputs.selectionLabel || 'automated' }}
    secrets:
      CHATGPT_API_SECRET_KEY: ${{ secrets.CHATGPT_API_SECRET_KEY }}

  check-branch:
    needs:
      - select-issue
    if: ${{ needs.select-issue.outputs.issueNumber != '' }}
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write
    env:
      branchPrefix: 'issue-'
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          ref: ${{ github.ref }}
      - name: Ensure there isn't already a branch for this intention type
        shell: bash
        run: |
          git fetch origin
          if git branch -r | grep -q 'origin/${{ env.branchPrefix }}'; then
            echo "A branch with the intention type prefix '${{ env.branchPrefix }}' already exists."
            exit 1
          else
            echo "No existing branch with the intention type prefix found."
          fi

  start-issue:
    needs:
      - select-issue
      - check-branch
    if: ${{ needs.select-issue.outputs.issueNumber != '' }}
    permissions:
      contents: write
      issues: write
      id-token: write
    uses: 'xn-intenton-z2a/agentic-lib/.github/workflows/wfr-start-issue.yml@1.10.1'
    with:
      issueNumber: ${{ needs.select-issue.outputs.issueNumber }}
      target: ${{ inputs.target || 'src/lib/main.js' }}
      testFile: ${{ inputs.testFile || 'tests/unit/main.test.js' }}
      readmeFile: 'README.md'
      contributingFile: 'CONTRIBUTING.md'
      dependenciesFile: 'package.json'
      formattingFile: '.prettierrc'
      lintingFile: 'eslint.config.js'
      branchPrefix: 'issue-'
      buildScript: 'npm run build'
      testScript: 'npm test'
      mainScript: ${{ vars.MAIN_SCRIPT || 'npm run start' }}
      model: ${{ vars.CHATGPT_API_MODEL || 'o3-mini' }}
      gitUserEmail: 'action@github.com'
      gitUserName: 'GitHub Actions[bot]'
    secrets:
      CHATGPT_API_SECRET_KEY: ${{ secrets.CHATGPT_API_SECRET_KEY }}

  create-pr:
    needs:
      - select-issue
      - start-issue
    if: ${{ needs.select-issue.outputs.issueNumber != '' && needs.start-issue.outputs.fixApplied == 'true' && needs.start-issue.outputs.allValidationStepsSuccessful == 'true' }}
    permissions:
      contents: write
      packages: write
      issues: write
      pull-requests: write
      checks: write
      id-token: write
    uses: 'xn-intenton-z2a/agentic-lib/.github/workflows/wfr-create-pr.yml@1.10.1'
    with:
      branch: 'issue-${{ needs.select-issue.outputs.issueNumber }}'
      baseBranch: 'main'
      gitCommitMessage: 'Fix ready for issue ${{ needs.select-issue.outputs.issueNumber }}'
      label: 'automerge'
./.github/workflows/automerge.yml
==== Content of ./.github/workflows/automerge.yml ====
# .github/workflows/automerge.yml
#
# This file is part of the example suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT

name: Automerge
concurrency: branch-main
run-name: "Automerge [${{ github.ref_name }}]"

on:
  pull_request:
  check_suite:
  workflow_dispatch:
  workflow_run:
    workflows:
      - "Issue Worker"
      - "Update"
    types:
      - completed
  schedule:
    - cron: '*/10 * * * *' # Run every 10 minutes
    #- cron: '45 */1 * * *' # Run every hour at 45 minutes past
    #- cron: '15 */2 * * *'  # Run every 2 hours at 15 minutes past

jobs:
  pull-request-event:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - run: |
          echo "Triggered by: pull_request"

  check-suite-event:
    if: github.event_name == 'check_suite'
    runs-on: ubuntu-latest
    steps:
      - run: |
          echo "Triggered by: check_suite"

  schedule-event:
    if: github.event_name == 'schedule'
    runs-on: ubuntu-latest
    steps:
      - run: |
          echo "Triggered by: schedule"

  workflow-dispatch-event:
    if: github.event_name == 'workflow_dispatch'
    runs-on: ubuntu-latest
    steps:
      - run: |
          echo "Triggered by: workflow_dispatch"

  pr:
    if: github.event_name == 'pull_request' && contains(github.event.pull_request.labels.*.name, 'automerge')
    uses: 'xn-intenton-z2a/agentic-lib/.github/workflows/wfr-automerge-find-pr-from-pull-request.yml@1.10.1'

  cs:
    if: github.event_name == 'check_suite' && github.event.check_suite.conclusion == 'success'
    uses: 'xn-intenton-z2a/agentic-lib/.github/workflows/wfr-automerge-find-pr-in-check-suite.yml@1.10.1'

  ls:
    if: github.event_name == 'schedule' || github.event_name == 'workflow_dispatch'
    runs-on: ubuntu-latest
    steps:
      - name: Determine pull request number
        id: get-pull
        uses: actions/github-script@v7
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          script: |
            let pullNumber;
            const { data: pullRequests } = await github.rest.pulls.list({
              owner: context.repo.owner,
              repo: context.repo.repo,
              state: 'open',
              per_page: 1,
              sort: 'created',
              direction: 'asc'
            });
            if (pullRequests.length > 0) {
              pullNumber = pullRequests[0].number;
            } else {
              pullNumber = '';
              core.info('No open pull requests found.');
            }
            core.info(`pullNumber: ${pullNumber}`);
            core.setOutput('pullNumber', pullNumber);
          result-encoding: string
    outputs:
      pullNumber: ${{ steps.get-pull.outputs.pullNumber }}

  merge-check:
    if: ${{ always() }}
    needs:
      - pr
      - cs
      - ls
    runs-on: ubuntu-latest
    steps:
      - name: set-outputs
        id: set-outputs
        uses: actions/github-script@v7
        with:
          script: |
            // Merge outputs from pr-check, cs-check, and determine-ls.
            // Only one of pr-check or cs-check should have run.
            let prMerged = '${{ needs.pr.outputs.prMerged || needs.cs.outputs.prMerged || 'false' }}';
            let pullNumber = '${{ needs.pr.outputs.pullNumber || needs.cs.outputs.pullNumber || needs.ls.outputs.pullNumber }}';
            let shouldSkipMerge = '${{ needs.pr.outputs.shouldSkipMerge || needs.cs.outputs.shouldSkipMerge || 'false' }}';
            core.setOutput('prMerged', `${prMerged}`);
            core.setOutput('pullNumber', `${pullNumber}`);
            core.setOutput('shouldSkipMerge', `${shouldSkipMerge}`);
            core.info(`prMerged: '${prMerged}'`);
            core.info(`pullNumber: '${pullNumber}'`);
            core.info(`shouldSkipMerge: '${shouldSkipMerge}'`);
          result-encoding: string
    outputs:
      prMerged: ${{ steps.set-outputs.outputs.prMerged }}
      pullNumber: ${{ steps.set-outputs.outputs.pullNumber }}
      shouldSkipMerge: ${{ steps.set-outputs.outputs.shouldSkipMerge }}

  label-issue-after-check-pr:
    needs:
      - merge-check
    if: needs.merge-check.outputs.prMerged == 'true' && needs.merge-check.outputs.pullNumber != ''
    permissions:
      contents: write
      pull-requests: read
      issues: write
    uses: 'xn-intenton-z2a/agentic-lib/.github/workflows/wfr-automerge-label-issue.yml@1.10.1'
    with:
      pullNumber: '${{ needs.merge-check.outputs.pullNumber }}'
      branchPrefix: 'issue-'

  automerge:
    needs:
      - merge-check
    if: always() && needs.merge-check.outputs.shouldSkipMerge != 'true' && needs.merge-check.outputs.pullNumber != ''
    permissions:
      contents: write
      pull-requests: write
    uses: 'xn-intenton-z2a/agentic-lib/.github/workflows/wfr-automerge-merge-pr.yml@1.10.1'
    with:
      pullNumber: '${{ needs.merge-check.outputs.pullNumber }}'

  label-issue-after-automerge:
    needs:
      - merge-check
      - automerge
    if: always() && ( needs.automerge.outputs.prMerged == 'true' && needs.merge-check.outputs.pullNumber != '' )
    permissions:
      contents: write
      issues: write
      pull-requests: read
    uses: 'xn-intenton-z2a/agentic-lib/.github/workflows/wfr-automerge-label-issue.yml@1.10.1'
    with:
      pullNumber: ${{ needs.automerge.outputs.prMerged == 'true' && needs.merge-check.outputs.pullNumber || '' }}
      branchPrefix: 'issue-'
./.github/workflows/issue-for-linting.yml
==== Content of ./.github/workflows/issue-for-linting.yml ====
# .github/workflows/issue-for-linting.yml
#
# This file is part of the example suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT

name: Linting
concurrency: branch-${{ github.ref_name }}
run-name: "Linting [${{ github.ref_name }}]"

on:
  workflow_dispatch:
  schedule:
    - cron: '15 4 * * *' # Run every day at 4:15

jobs:

  linting:
    permissions:
      contents: write
      packages: write
      id-token: write
    uses: 'xn-intenton-z2a/agentic-lib/.github/workflows/wfr-run-script-and-commit-to-branch.yml@1.10.1'
    with:
      #script: 'npm run linting "." -- --max-warnings=10'
      script: 'npm run linting'
      sarifScript: 'npm run linting-json --silent'
      testScript: 'npm test'

  create-issue:
    needs:
      - linting
    if: ${{ needs.linting.outputs.fixStillRequired == 'true' || needs.linting.outputs.fixStillRequired == true || needs.linting.outputs.remainingResultsCount != '0' }}
    permissions:
      issues: write
      id-token: write
    uses: 'xn-intenton-z2a/agentic-lib/.github/workflows/wfr-create-issue.yml@1.10.1'
    with:
      issueTitle: 'Resolve issues in output from running: npm run linting-fix "." -- --max-warnings=10'
      issueBody: ${{ needs.linting.outputs.scriptOutput }}
./.github/workflows/update.yml
==== Content of ./.github/workflows/update.yml ====
# .github/workflows/update.yml
#
# This file is part of the example suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT

name: Update
concurrency: branch-${{ github.ref_name }}
run-name: "Update [${{ github.ref_name }}]"

on:
  repository_dispatch:
    types: [package-published]
  schedule:
    - cron: '30 7 * * *'
  workflow_dispatch:
    inputs:
      upgradeTarget:
        description: 'Select the type of update to run'
        type: choice
        default: 'minor'
        required: false
        options:
          - greatest
          - latest
          - newest
          - patch
          - minor
          - semver

jobs:
  update:
    permissions:
      contents: write
      pull-requests: write
      id-token: write
      packages: write
    uses: 'xn-intenton-z2a/agentic-lib/.github/workflows/wfr-update.yml@1.10.1'
    with:
      buildScript: 'npm run build'
      testScript: 'npm test'
      mainScript: ${{ vars.MAIN_SCRIPT || 'npm run start' }}
      upgradeTarget: ${{ inputs.upgradeTarget || 'patch' }}
      branch: 'apply-update'
      gitUserEmail: 'action@github.com'
      gitUserName: 'GitHub Actions[bot]'
      gitCommitMessage: 'chore: dependency updates'

  create-pr:
    needs:
      - update
    if: ${{ needs.update.outputs.updatedFiles == 'true' }}
    permissions:
      contents: write
      packages: write
      issues: write
      pull-requests: write
      checks: write
      id-token: write
    uses: 'xn-intenton-z2a/agentic-lib/.github/workflows/wfr-create-pr.yml@1.10.1'
    with:
      branch: 'apply-update'
      baseBranch: 'main'
      gitCommitMessage: 'chore: dependency updates'
      label: 'automerge'
./.github/workflows/issue-reviewer.yml
==== Content of ./.github/workflows/issue-reviewer.yml ====
# .github/workflows/issue-reviewer.yml
#
# This file is part of the example suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT

name: Review Issue
run-name: "Review Issue [${{ github.ref_name }}]"

on:
  workflow_dispatch:
    inputs:
      issueNumber:
        description: 'The issue number to review. If not provided, the workflow will select one based on label. e.g. "123"'
        required: false
        type: string
        default: ''
      selectionLabel:
        description: 'Label used to filter issues for review. e.g. "merged"'
        required: false
        type: string
        default: 'merged'
      target:
        description: 'The source file whose content was used in the resolution prompt. e.g. "src/lib/main.js"'
        required: false
        type: string
        default: 'src/lib/main.js'
      testFile:
        description: 'The test file to run to validate the resolution. e.g. "tests/unit/main.test.js"'
        required: false
        type: string
        default: 'tests/unit/main.test.js'
  workflow_run:
    workflows:
      - "Automerge"
    types:
      - completed
  schedule:
    #- cron: '30 */2 * * *' # Run every 2 hours at 30 minutes past
    #- cron: '*/30 * * * *' # Run every 30 minutes
    - cron: '*/15 * * * *' # Run every 15 minutes

jobs:

  select-issue:
    permissions:
      issues: read
      id-token: write
    uses: 'xn-intenton-z2a/agentic-lib/.github/workflows/wfr-select-issue.yml@1.10.1'
    with:
      issueNumber: ${{ inputs.issueNumber || '' }}
      selectionLabel: ${{ inputs.selectionLabel || 'merged' }}
    secrets:
      CHATGPT_API_SECRET_KEY: ${{ secrets.CHATGPT_API_SECRET_KEY }}

  review-issue:
    needs:
      - select-issue
    if: ${{ needs.select-issue.outputs.issueNumber != '' && needs.select-issue.outputs.merged == 'true' }}
    permissions:
      contents: write
      issues: write
      id-token: write
    uses: 'xn-intenton-z2a/agentic-lib/.github/workflows/wfr-review-issue.yml@1.10.1'
    with:
      issueNumber: ${{ needs.select-issue.outputs.issueNumber }}
      target: ${{ inputs.target || 'src/lib/main.js' }}
      testFile: ${{ inputs.testFile || 'tests/unit/main.test.js' }}
      readmeFile: 'README.md'
      contributingFile: 'CONTRIBUTING.md'
      dependenciesFile: 'package.json'
      buildScript: 'npm run build'
      testScript: 'npm test'
      mainScript: ${{ vars.MAIN_SCRIPT || 'npm run start' }}
      model: ${{ vars.CHATGPT_API_MODEL || 'o3-mini' }}
    secrets:
      CHATGPT_API_SECRET_KEY: ${{ secrets.CHATGPT_API_SECRET_KEY }}
./.github/workflows/formating.yml
==== Content of ./.github/workflows/formating.yml ====
# .github/workflows/formating.yml
#
# This file is part of the example suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT

name: ∞ Formatting
concurrency: branch-${{ github.ref_name }}
run-name: "Formatting [${{ github.ref_name }}]"

on:
  workflow_dispatch:
  schedule:
    - cron: '15 3 * * *' # Run every day at 3:15

jobs:

  formatting:
    permissions:
      contents: write
      packages: write
      id-token: write
    uses: 'xn-intenton-z2a/agentic-lib/.github/workflows/wfr-run-script-and-commit-to-branch.yml@1.10.1'
    with:
      script: 'npm run formatting-fix -- "." ; npm run linting-fix "."'
      sarifScript: ''
      testScript: 'npm test'
      branch: 'apply-formatting'
      gitUserEmail: 'action@github.com'
      gitUserName: 'GitHub Actions[bot]'
      gitCommitMessage: 'Updated by `npm run formatting-fix -- "." ; npm run linting-fix "."`'

  create-pr:
    needs:
      - formatting
    if: ${{ needs.formatting.outputs.updatedFiles == 'true' }}
    permissions:
      contents: write
      packages: write
      issues: write
      pull-requests: write
      checks: write
      id-token: write
    uses: 'xn-intenton-z2a/agentic-lib/.github/workflows/wfr-create-pr.yml@1.10.1'
    with:
      branch: 'apply-formatting'
      baseBranch: 'main'
      gitCommitMessage: 'chore: formatting fixes'
      label: 'automerge'
./.github/workflows/truncate-issue-history.yml
==== Content of ./.github/workflows/truncate-issue-history.yml ====
# .github/workflows/truncate-issue-history.yml
#
# This file is part of the example suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT

name: ∞ Truncate Issue History
concurrency: truncate-issue-history

on:
  workflow_dispatch:
  schedule:
    - cron: '0 0 * * *'

jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - name: Redact old GitHub issues and delete their comments
        uses: actions/github-script@v7
        with:
          script: |
            // Set retention period (in days)
            const retentionDays = 7;
            const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
            const owner = context.repo.owner;
            const repo = context.repo.repo;
            const perPage = 100;
            let issuesRedacted = 0;
            let commentsDeleted = 0;

            console.log(`Redacting issues not updated in the last ${retentionDays} days (before ${cutoffDate.toISOString()})...`);

            let page = 1;
            while (true) {
              const issuesResponse = await github.rest.issues.listForRepo({
                owner,
                repo,
                state: 'all',
                per_page: perPage,
                page
              });
              const issues = issuesResponse.data;
              if (issues.length === 0) break;
              for (const issue of issues) {
                // Skip pull requests
                if (issue.pull_request) continue;
                const updatedAt = new Date(issue.updated_at);
                if (updatedAt < cutoffDate) {
                  try {
                    // Update the issue's title and body to "redact" details.
                    await github.rest.issues.update({
                      owner,
                      repo,
                      issue_number: issue.number,
                      title: "Redacted",
                      body: "This issue has been redacted."
                    });
                    console.log(`Redacted issue #${issue.number} (last updated at ${issue.updated_at})`);
                    issuesRedacted++;

                    // List and delete all comments for the issue.
                    let commentPage = 1;
                    while (true) {
                      const commentsResponse = await github.rest.issues.listComments({
                        owner,
                        repo,
                        issue_number: issue.number,
                        per_page: perPage,
                        page: commentPage
                      });
                      const comments = commentsResponse.data;
                      if (comments.length === 0) break;
                      for (const comment of comments) {
                        try {
                          await github.rest.issues.deleteComment({
                            owner,
                            repo,
                            comment_id: comment.id
                          });
                          console.log(`Deleted comment ${comment.id} on issue #${issue.number}`);
                          commentsDeleted++;
                        } catch (err) {
                          console.error(`Failed to delete comment ${comment.id} on issue #${issue.number}: ${err.message}`);
                        }
                      }
                      commentPage++;
                    }
                  } catch (error) {
                    console.error(`Failed to update issue #${issue.number}: ${error.message}`);
                  }
                }
              }
              page++;
            }
            console.log(`Total issues redacted: ${issuesRedacted}`);
            console.log(`Total comments deleted: ${commentsDeleted}`);
            return `Cleanup complete. Redacted ${issuesRedacted} issues and deleted ${commentsDeleted} comments.`;
          result-encoding: string
./.github/dependabot.yml
==== Content of ./.github/dependabot.yml ====
# See: https://docs.github.com/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "daily"
    labels:
      - dependencies
      - automated
      - automerge
    #ignore:
    #  - dependency-name: "some-dependency" # Example of ignoring a specific dependency
    #    versions: ["1.x", "2.x"]
```
END_OF_CONCATENATED_WORKFLOW_FILES

START_OF_CONCATENATED_SCRIPT_FILES
```
./scripts/truncate-git-history.sh
==== Content of ./scripts/truncate-git-history.sh ====
#!/usr/bin/env bash
# scripts/truncate-git-history.sh
# Purpose: Truncate the history so that future revisions don't follow a past trend.
# Usage: ./scripts/truncate-git-history.sh
#
# This file is part of the Example Suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT
#
git checkout --orphan temp-branch
git add --verbose --all
git commit --verbose --message "Prepare release"
git push --verbose --force origin temp-branch:main
git checkout main
git pull --verbose
git branch --verbose --delete temp-branch
git pull --verbose
git push --verbose origin main
git log
git status
./scripts/archive.sh
==== Content of ./scripts/archive.sh ====
#!/usr/bin/env bash
# scripts/archive.sh
# Usage: ./scripts/archive.sh
#
# This file is part of the Example Suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT

intention="$(head -1 CONTRIBUTING.md | sed 's/^# //')"
cp -fv CONTRIBUTING.md "archive/${intention?}-$(date +%Y-%m-%d)-CONTRIBUTING.md"
cp -fv README.md "archive/${intention?}-$(date +%Y-%m-%d)-README.md"
cp -fv package.json "archive/${intention?}-$(date +%Y-%m-%d)-package.json"
cp -fv src/lib/main.js "archive/${intention?}-$(date +%Y-%m-%d)-main.js"
cp -fv tests/unit/main.test.js "archive/${intention?}-$(date +%Y-%m-%d)-main.test.js"
#rm -rfv node_modules
#rm -rfv package-lock.json
#npm install
#npm run build
#npm link
./scripts/export-source.sh
==== Content of ./scripts/export-source.sh ====
#!/usr/bin/env bash
# scripts/export-source.sh
# Purpose: Export the source code to date stamped files.
# Usage: ./scripts/export-source.sh
#
# This file is part of the Example Suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT
#

mkdir -p './exports/'
find "." -type f -not -path '*/build/*' -not -path '*/dist/*' -not -path '*/exports/*' -not -path '*/coverage/*' -not -path '*/node_modules/*' -not -path '*/\.git/*' -not -path '*/\.idea/*' -print | grep -v '.DS_Store' > "./exports/$(date +%Y-%m-%d)-files-list.txt"
find "." -maxdepth 1 -type f -name '*.md' -print -exec echo "==== Content of {} ====" \; -exec cat {} \; > "./exports/$(date +%Y-%m-%d)-root-cat.txt"
find "." -maxdepth 1 -type f -name 'package.json' -print -exec echo "==== Content of {} ====" \; -exec cat {} \; >> "./exports/$(date +%Y-%m-%d)-root-cat.txt"
find "." -maxdepth 1 -type f -name 'vitest.config.js' -print -exec echo "==== Content of {} ====" \; -exec cat {} \; >> "./exports/$(date +%Y-%m-%d)-root-cat.txt"
find "." -maxdepth 1 -type f -name 'jsconfig.json' -print -exec echo "==== Content of {} ====" \; -exec cat {} \; >> "./exports/$(date +%Y-%m-%d)-root-cat.txt"
find "." -maxdepth 1 -type f -name 'eslint.config.js' -print -exec echo "==== Content of {} ====" \; -exec cat {} \; >> "./exports/$(date +%Y-%m-%d)-root-cat.txt"
find "." -maxdepth 1 -type f -name '.prettierrc' -print -exec echo "==== Content of {} ====" \; -exec cat {} \; >> "./exports/$(date +%Y-%m-%d)-root-cat.txt"
find "." -maxdepth 1 -type f -name 'LICENSE' -print -exec echo "==== Content of {} ====" \; -exec cat {} \; > "./exports/$(date +%Y-%m-%d)-root-cat.txt"
find "./src" -type f -name '*.js' -print -exec echo "==== Content of {} ====" \; -exec cat {} \; > "./exports/$(date +%Y-%m-%d)-src-cat.txt"
find "./tests" -type f -name '*.js' -print -exec echo "==== Content of {} ====" \; -exec cat {} \; > "./exports/$(date +%Y-%m-%d)-test-cat.txt"
find "./.github" -type f -name '*.yml' -print -exec echo "==== Content of {} ====" \; -exec cat {} \; > "./exports/$(date +%Y-%m-%d)-github-workflow-cat.txt"
find "./scripts" -type f -name '*.sh' -print -exec echo "==== Content of {} ====" \; -exec cat {} \; > "./exports/$(date +%Y-%m-%d)-scripts-cat.txt"
git log --follow -p src/lib/main.js > "./exports/$(date +%Y-%m-%d)-main.js-history.txt"
git log --since="12 hours ago" --follow -p src/lib/main.js > "./exports/$(date +%Y-%m-%d)-main.js-history-last-12-hours.txt"
./scripts/initialise.sh
==== Content of ./scripts/initialise.sh ====
#!/usr/bin/env bash
# scripts/initialise.sh
# Usage: ./scripts/initialise.sh <intention>
# Example: ./scripts/initialise.sh (randomly selects an intention)
# Example: ./scripts/initialise.sh "plot-code-lib"
# Example: ./scripts/initialise.sh "owl-builder"
#
# This file is part of the Example Suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT

defaultIntention=$(find seeds -maxdepth 1 -type f -name 'CONTRIBUTING-*.md' | shuf -n 1 | sed -E 's/.*CONTRIBUTING-(.*)\.md/\1/')

intention="${1-$defaultIntention}"

cp -fv "seeds/CONTRIBUTING-${intention?}.md" CONTRIBUTING.md
cp -fv "seeds/zero-README.md"  README.md
cp -fv "seeds/zero-package.json"  package.json
cp -fv "seeds/zero-main.js" src/lib/main.js
cp -fv "seeds/zero-main.test.js" tests/unit/main.test.js
#rm -rfv node_modules
#rm -rfv package-lock.json
#npm install
#npm run build
#npm link
./scripts/update.sh
==== Content of ./scripts/update.sh ====
#!/usr/bin/env bash
# scripts/update.sh
# Usage: ./scripts/update.sh
#
# This file is part of the Example Suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT
#

rm -f package-lock.json
rm -f node-modules
npm install
npm run update-to-minor
npm update
npm upgrade
npm install
npm run build
npm link
./scripts/clean.sh
==== Content of ./scripts/clean.sh ====
#!/usr/bin/env bash
# scripts/clean.sh
# Usage: ./scripts/clean.sh
#
# This file is part of the Example Suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT
#

rm -rfv ./build \
rm -rfv ./coverage \
rm -rfv ./dist
rm -rfv ./node_modules
rm -rfv ./package-lock.json
npm install
npm run build
npm link

```
END_OF_CONCATENATED_SCRIPT_FILES


## How to Contribute

Contributions come in many forms—whether you’re a developer, tester, or an advocate for process improvements. Here’s how you can help:

1. **Report Issues or Ideas:**  
   Open an issue on GitHub to share bug reports, feature requests, or any improvements you envision. Clear descriptions and reproducible steps are highly appreciated.

2. **Submit Pull Requests:**
    - Fork the repository and create a feature branch.
    - Implement your changes, ensuring you follow our coding style and standards.
    - Add tests to cover any new functionality.
    - Update documentation and this file if your changes affect usage or workflow behavior.
    - Submit your pull request for review.

3. **Enhance Automated Workflows:**  
   Contributions might include adjustments to:
    - The AI-based fix verification logic.
    - File update routines responding to build, test, or main output.
    - Logic for extracting issue numbers from branch names.
    - Automated pull request merging or listing mechanisms.

4. **Run and Test the Library:**  
   To explore the capabilities of **agentic‑lib**, run the demo function with:
   ```bash
   npm run start [--help]
   ```
   This command prints a detailed help message, including available functions and parameters.

## Guidelines

- **Code Quality:**  
  Write modular, clean, and fully testable code. Our design intentionally decouples functionality from GitHub Actions globals to enhance testability and reuse.

- **Documentation:**  
  Keep inline comments and this Contributing.md up-to-date as you introduce changes. Clear documentation ensures the project stays accessible to both human and AI collaborators.

- **Compatibility:**  
  Ensure your code runs on Node 20 and adheres to ECMAScript Module (ESM) standards.

- **Feedback & Collaboration:**  
  We welcome constructive feedback. Engage with maintainers and peers through GitHub issues and pull request discussions to improve our collective workflow.

## Agentic contribution house choice options (programmatically parsed): START

## Issue House Choice Options

repository specific activities:
- Create, vary or extend as many library functions as you can that deliver the spirit of this CONTRIBUTING.md Update the Change Log in README.md (or say what was checked).

generic activities:
- Review the Mission Statement and prune any "drift" from the source file where there are no longer relevant features. Update the Change Log in README.md (or say what was checked).
- Review the Mission Statement and create, vary or extend as many features as you can inline with the Mission Statement. Update the Change Log in README.md (or say what was checked).
  #- Find anything that might be a "simulated" or "demo" implementation and switch to a real implementation. Update the Change Log in README.md (or say what was checked).
  #- Consider alternate code paths that could be explicitly handled to improve the range of supported behaviours. Update the Change Log in README.md (or say what was checked).
  #- Look for code that could be simplified using a library and introduce that library. Update the Change Log in README.md (or say what was checked).

undocumented chores:
#- Look for any duplicated code that could be usefully abstracted out to become shared code and implement that abstraction.
- Refresh the README, consulting the guidance in CONTRIBUTING.md while retaining any relevant content and pruning irrelevant content.
  #- Dry-run any examples in comments or the README against the current code and if they are not accurate or if they could cover more features, update the docs or code to be accurate.
- Bring test coverage up as close to 100% as possible, have single layer mocked tests and deeper tests mocking at the external resource (e.g. file system or network).
  #- Ensure the main function so that it generates some demo output without an over the wire call, and hint a CLI switch that will do the real call.

## Agentic contribution house choice options (programmatically parsed): END

---
---
---

# Ensure README.md begins like this:

START_README_BEGINNING
# `repository0`

The repository is intended as a template that includes:
* A Template Base: A starting point for new projects.
* A Running Experiment: An example implementation that demonstrates one way to use the template.
* Workflows from `agentic‑lib` which reference reusable workflows.

## Overview
`repository0` is a demo repository that showcases the GitHub workflows imported from intentïon `agentic‑lib`. Its primary purpose is to demonstrate these automated CI/CD workflows.

## What’s Inside

- **GitHub Workflows:**  
  Workflows in the `.github/workflows/` These workflows consume reusable workflows from intentïon `agentic‑lib`.

- **Source Code:**  
  The main functionality is in `src/lib/main.js`. This file is focus of the workflow and is modified by the workflow to deliver the project goals.

- **Dependencies:**  
  `package.json` can be modified by the workflow to add or update dependencies and it also defines some of the test and build scripts.

- **Tests:**  
  Unit tests in the `tests/unit/` folder ensure that the main script doesn't drift too far.
  This test file can be modified by the workflow `tests/unit/main.test.js`, duplicate `main.test.js` to fix a version of the behaviour where the workflow can't change it.

- **Docs**  
  This `README.md` can be modified by the workflow.

## Getting Started

This repository is already set up with the necessary workflows and scripts but you do need to supply the following secrets:
- `CHATGPT_API_SECRET_KEY` - This key must be for an account with access to the OpenAI chat completions API for model `o3-mini`.
  Set these secrets in your repository settings under *Settings > Secrets and Variables > Actions*. They are essential for the automated workflows such as publishing packages and managing issues.

## intentïon `agentic-lib`

The **intentïon `agentic-lib`** is a collection of reusable GitHub Actions workflows that enable your repository to operate in an “agentic” manner. Autonomous workflows communicate through branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be invoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK. This project itself is evolving, and these workflows may eventually become bundled actions.

*Warning:* Executing these workflows may incur charges on your OpenAI account and consume GitHub Actions minutes.

*Warning:* Experimental. This coding system is still in development and may not suit production use.

## Should you use the `agentic-lib` Coding System?

* Do you have access to an OpenAI account with necessary API keys?
* Are you willing to incur charges for consumed resources?
* Are you curious about self-evolving code?
* Would you like to see how such a system can be built?
* Do you appreciate integrated OpenAI and GitHub API calls in a JavaScript environment?
END_README_BEGINNING

---
---
---

# Ensure README.md ends like this:

START_README_END
### Contributing

We welcome contributions! Please review our [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to contribute effectively.

## License

Released under the MIT License (see [LICENSE](./LICENSE)).
END_README_END

---
---
---