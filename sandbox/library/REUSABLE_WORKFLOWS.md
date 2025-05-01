# REUSABLE_WORKFLOWS

## Crawl Summary
Reusing workflows in GitHub Actions: Define reusable workflows using on: workflow_call with clearly specified inputs (e.g., config-path of type string) and secrets (e.g., personal_access_token). Caller workflows reference these workflows using 'uses' syntax with either a local path or repository reference with commit SHA, branch, or tag. Key details include: matrix strategy for job replication, nested workflow limitations (4 levels, 20 unique calls), outputs mapping to pass data, and security implications regarding runner context and token permissions.

## Normalised Extract
Table of Contents:
  1. Workflow Call Setup
     - YAML trigger on: workflow_call
     - Required inputs and secrets syntax
  2. Calling Reusable Workflows
     - Local and external repository syntax
     - Usage of 'uses', 'with', and 'secrets' keywords
  3. Advanced Usage
     - Nesting workflows up to 4 levels
     - Matrix strategy integration
  4. Outputs and Data Passing
     - Mapping job-level outputs and referencing in caller workflows
  5. Runner and Permissions
     - Caller context for GitHub-hosted and self-hosted runners
     - GITHUB_TOKEN propagation rules

Detailed Topics:
1. Workflow Call Setup:
   - YAML must include:
     on:
       workflow_call:
         inputs:
           config-path:
             required: true
             type: string
         secrets:
           personal_access_token:
             required: true
2. Calling Reusable Workflows:
   - Local call: uses: ./.github/workflows/workflow-file.yml
   - External call: uses: octo-org/example-repo/.github/workflows/workflow-file.yml@v1
   - Caller job structure supports: name, uses, with, secrets, strategy, needs, if, concurrency, permissions
3. Advanced Usage:
   - Nest nested workflows: caller > workflow-A > workflow-B (max 4 levels)
   - Matrix usage example: strategy with matrix: target: [dev, stage, prod] and referencing matrix variable in with
4. Outputs and Data Passing:
   - Define outputs in on.workflow_call.outputs
   - Map job outputs from steps to workflow outputs, then reference as needs.job.outputs in caller job
5. Runner and Permissions:
   - Reusable workflows inherit runner from caller, cannot change GitHub-hosted context
   - Permissions: if not specified, default permissions for GITHUB_TOKEN are used; token cannot be elevated.

## Supplementary Details
Technical Specifications:
- Reusable workflow file must be located in .github/workflows; no subdirectories allowed.
- on.workflow_call configuration:
  inputs:
    <input_id>: { required: true, type: [boolean|number|string] }
  secrets:
    <secret_id>: { required: true }
- Caller job syntax:
  jobs:
    job_id:
      uses: {owner}/{repo}/.github/workflows/{filename}@{ref} or ./.github/workflows/{filename}
      with: { <input_id>: <value> }
      secrets: { <secret_id>: ${{ secrets.token }} } or secrets: inherit
- Matrix strategy: Define strategy: matrix: { target: [dev, stage, prod] } and use with: target: ${{ matrix.target }}
- Outputs mapping:
  on.workflow_call:
    outputs:
      firstword: { description: "The first output string", value: ${{ jobs.job.outputs.stepOutput }} }
- Limitations: Maximum 4 workflow levels, 20 unique reusable workflows per workflow file.
- Runner assignment: GitHub-hosted runners are always assigned from caller; self-hosted runners require proper access configuration.
- Security: Use commit SHA for reliable workflow references. Environment variables in caller are not automatically available in called workflows; use outputs or vars context.

## Reference Details
API Specifications and Code Patterns:
1. Workflow YAML Setup:
   on:
     workflow_call:
       inputs:
         config-path:
           required: true
           type: string
       secrets:
         personal_access_token:
           required: true
2. Caller Workflow Example:
   jobs:
     call-workflow-passing-data:
       permissions:
         contents: read
         pull-requests: write
       uses: octo-org/example-repo/.github/workflows/workflow-B.yml@main
       with:
         config-path: .github/labeler.yml
       secrets:
         token: ${{ secrets.GITHUB_TOKEN }}
3. Matrix Strategy Example:
   jobs:
     ReuseableMatrixJobForDeployment:
       strategy:
         matrix:
           target: [dev, stage, prod]
       uses: octocat/octo-repo/.github/workflows/deployment.yml@main
       with:
         target: ${{ matrix.target }}
4. Nested Workflow Call Example:
   jobs:
     call-another-reusable:
       uses: octo-org/example-repo/.github/workflows/another-reusable.yml@v1
5. Outputs Usage Pattern:
   In reusable workflow:
     on:
       workflow_call:
         outputs:
           firstword:
             description: "The first output string"
             value: ${{ jobs.example_job.outputs.output1 }}
     jobs:
       example_job:
         runs-on: ubuntu-latest
         outputs:
           output1: ${{ steps.step1.outputs.firstword }}
         steps:
           - id: step1
             run: echo "firstword=hello" >> $GITHUB_OUTPUT
   In caller workflow:
     jobs:
       job1:
         uses: octo-org/example-repo/.github/workflows/called-workflow.yml@v1
       job2:
         runs-on: ubuntu-latest
         needs: job1
         steps:
           - run: echo ${{ needs.job1.outputs.firstword }}
6. Troubleshooting Procedures:
   - Verify workflow file location: must be in .github/workflows
   - Confirm input types and required fields are correctly defined
   - Use commit SHA for external reusable workflows to avoid unexpected updates
   - Check Actions settings for repository access policies; for private, ensure access is permitted.
   - Command: git checkout <commit-SHA> for stable environment
   - Monitor dependency graph (via GitHub REST API) to track workflow dependencies
   - Review audit logs via GitHub REST API for runtime errors related to token permissions.

## Information Dense Extract
on.workflow_call { inputs: { config-path: { required: true; type: string } }, secrets: { personal_access_token: { required: true } } } | Caller: uses: {owner}/{repo}/.github/workflows/{file}@{ref} or local path | with: { config-path: <value> } and secrets: { token: ${{ secrets.GITHUB_TOKEN }} } or inherit | Matrix: strategy: matrix: { target: [dev, stage, prod] } with: target: ${{ matrix.target }} | Outputs: on.workflow_call.outputs mapping to job outputs; job: outputs: { output1: ${{ steps.step1.outputs.firstword }} } | Limits: max 4 nested levels; 20 unique workflows per file | Runners: GitHub-hosted uses caller context; self-hosted requires proper access | Security: Use commit SHA; no redirection support; token permissions cannot be elevated

## Sanitised Extract
Table of Contents:
  1. Workflow Call Setup
     - YAML trigger on: workflow_call
     - Required inputs and secrets syntax
  2. Calling Reusable Workflows
     - Local and external repository syntax
     - Usage of 'uses', 'with', and 'secrets' keywords
  3. Advanced Usage
     - Nesting workflows up to 4 levels
     - Matrix strategy integration
  4. Outputs and Data Passing
     - Mapping job-level outputs and referencing in caller workflows
  5. Runner and Permissions
     - Caller context for GitHub-hosted and self-hosted runners
     - GITHUB_TOKEN propagation rules

Detailed Topics:
1. Workflow Call Setup:
   - YAML must include:
     on:
       workflow_call:
         inputs:
           config-path:
             required: true
             type: string
         secrets:
           personal_access_token:
             required: true
2. Calling Reusable Workflows:
   - Local call: uses: ./.github/workflows/workflow-file.yml
   - External call: uses: octo-org/example-repo/.github/workflows/workflow-file.yml@v1
   - Caller job structure supports: name, uses, with, secrets, strategy, needs, if, concurrency, permissions
3. Advanced Usage:
   - Nest nested workflows: caller > workflow-A > workflow-B (max 4 levels)
   - Matrix usage example: strategy with matrix: target: [dev, stage, prod] and referencing matrix variable in with
4. Outputs and Data Passing:
   - Define outputs in on.workflow_call.outputs
   - Map job outputs from steps to workflow outputs, then reference as needs.job.outputs in caller job
5. Runner and Permissions:
   - Reusable workflows inherit runner from caller, cannot change GitHub-hosted context
   - Permissions: if not specified, default permissions for GITHUB_TOKEN are used; token cannot be elevated.

## Original Source
GitHub Actions Reusable Workflows
https://docs.github.com/en/actions/using-workflows/reusing-workflows

## Digest of REUSABLE_WORKFLOWS

# Overview
Retrieved on: 2023-10-05
Data Size: 818454 bytes | Links Found: 14237

# Workflow Call Configuration
- For a workflow to be reusable, its YAML file must include an event trigger:
  on:
    workflow_call:
- Defining inputs and secrets:
  on:
    workflow_call:
      inputs:
        <input_id>:
          required: true
          type: <boolean|number|string>
      secrets:
        <secret_id>:
          required: true
- Complete example snippet:
  on:
    workflow_call:
      inputs:
        config-path:
          required: true
          type: string
      secrets:
        personal_access_token:
          required: true

# Using Inputs and Secrets
- In the reusable workflow, refer inputs and secrets as:
  steps:
    - uses: actions/labeler@v4
      with:
        repo-token: ${{ secrets.personal_access_token }}
        configuration-path: ${{ inputs.config-path }}
- Caller workflow passes inputs using 'with' and secrets using 'secrets' keywords.

# Calling Reusable Workflows
- Syntax for same repository:
  uses: ./.github/workflows/{filename}
- Syntax for external repository:
  uses: {owner}/{repo}/.github/workflows/{filename}@{ref}
- Caller job structure:
  jobs:
    job_id:
      uses: octo-org/example-repo/.github/workflows/workflow-file.yml@<ref>
      with:
        <input_id>: <value>
      secrets:
        <secret_id>: ${{ secrets.<name> }}

# Nesting and Matrix Strategies
- Up to four levels of nested workflows in chain.
- Limit: maximum 20 unique reusable workflows per workflow file.
- Matrix strategy example:
  jobs:
    MatrixJob:
      strategy:
        matrix:
          target: [dev, stage, prod]
      uses: octocat/octo-repo/.github/workflows/deployment.yml@main
      with:
        target: ${{ matrix.target }}

# Using Outputs from Reusable Workflows
- Define outputs mapping at the workflow_call level:
  on:
    workflow_call:
      outputs:
        firstword:
          description: "The first output string"
          value: ${{ jobs.example_job.outputs.output1 }}
- Inside job:
  jobs:
    example_job:
      runs-on: ubuntu-latest
      outputs:
        output1: ${{ steps.step1.outputs.firstword }}
      steps:
        - id: step1
          run: echo "firstword=hello" >> $GITHUB_OUTPUT

# Permissions and Runner Contexts
- Reusable workflows run with the caller's github context.
- GITHUB_TOKEN and secrets.GITHUB_TOKEN are automatically passed.
- GitHub-hosted runners are assigned based on caller's context only.
- Self-hosted runners: accessible if in caller repository or organization.

# Limitations and Best Practices
- Environment variables in caller workflow do not propagate; use outputs to pass data.
- Use commit SHA for stability when referencing external reusable workflows.
- Do not use contexts in the 'uses' keyword.
- Jobs in the reusable workflow can only include: name, uses, with, secrets, strategy, needs, if, concurrency, permissions.

# Troubleshooting and Security
- If an action or workflow is renamed, previous references will fail.
- Check GitHub Actions settings for repository and access policies for private workflows.
- To troubleshoot runner issues, verify that the runner belongs to the caller context.


## Attribution
- Source: GitHub Actions Reusable Workflows
- URL: https://docs.github.com/en/actions/using-workflows/reusing-workflows
- License: License if known: GitHub Docs License
- Crawl Date: 2025-05-01T11:16:07.302Z
- Data Size: 818454 bytes
- Links Found: 14237

## Retrieved
2025-05-01
