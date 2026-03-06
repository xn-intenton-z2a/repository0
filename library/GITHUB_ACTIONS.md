GITHUB_ACTIONS

NORMALISED EXTRACT

This document records exact, implementation-ready GitHub Actions configuration, secrets, token scopes, repository settings, workflow usage patterns, troubleshooting steps, and best-practice controls required to operate Copilot-driven automation and workflows used by this repository.

Table of Contents
1. Required secrets and exact names
2. Token types and required scopes/permissions
3. Repository settings (exact values)
4. Workflow usage patterns (secret variable names and effects)
5. Branch protection and CI recommendations
6. Troubleshooting steps (step-by-step checks and fixes)
7. Best practices and operational controls

1. Required secrets and exact names
- COPILOT_GITHUB_TOKEN
  - Description: Fine-grained Personal Access Token (PAT) created for Copilot/Copilot SDK automation.
  - Stored as a repository secret with the exact name: COPILOT_GITHUB_TOKEN
  - Purpose: Grant Copilot automation the minimal read access it needs to interact with repository content and the Copilot SDK.

- WORKFLOW_TOKEN
  - Description: Classic (non-fine-grained) Personal Access Token required when a workflow must modify files in .github/workflows/ or update workflow files programmatically.
  - Stored as a repository secret with the exact name: WORKFLOW_TOKEN
  - Purpose: Allow automation to create/update workflow files; use only when the GITHUB_TOKEN lacks necessary write capability for workflows.

2. Token types and required scopes/permissions (exact specs)
- COPILOT_GITHUB_TOKEN
  - Token type: Fine-grained PAT (preferred) created via GitHub > Settings > Developer settings > Personal access tokens > Fine-grained tokens.
  - Required repository access: Grant access to the target repository only (least privilege).
  - Required permission(s): "Copilot SDK: read" (grant read permission for Copilot/Copilot SDK integration). If fine-grained UI lists specific repository permissions, set read-only access to Contents and any Copilot-specific scopes; avoid granting repo:write.

- WORKFLOW_TOKEN
  - Token type: Classic Personal Access Token (classic PAT).
  - Required scope: workflow
  - Additional scopes: grant only the minimum needed; include repo if workflow actions require repository write (for pushing commits or creating PRs), but avoid broad scopes when possible.
  - Note: The precise scope name required for editing workflow files is workflow (classic PAT); ensure this scope is selected during token creation.

3. Repository settings (exact values to set in repository Settings → Actions)
- Actions: Allow all actions (Setting value: Allow all actions).
- Workflow permissions: Read and write (Setting value: Read and write permissions for the GITHUB_TOKEN).
- Allow access to secrets for workflows: Ensure repository-level secrets are enabled and accessible by workflows.
- Discussions: Enable (Setting value: Enabled) if discussion-bot features are used.
- Required branch protection (recommended defaults): At minimum set the following on protected branches:
  - Require pull request reviews before merging: Enabled
  - Require status checks to pass before merging: Enabled; include the test workflow (e.g., test.yml or the vitest run) as a required check
  - Include administrators: Optional according to policy

4. Workflow usage patterns (exact secret names and example variable usage)
- Accessing secrets in workflow steps: use the exact secret identifiers secrets.COPILOT_GITHUB_TOKEN and secrets.WORKFLOW_TOKEN in the workflow environment.
- When a workflow step must edit workflow files under .github/workflows/, supply the WORKFLOW_TOKEN value to any CLI or API client that needs Authorization; example usage patterns (text form): set environment variable WORKFLOW_TOKEN=${{ secrets.WORKFLOW_TOKEN }} and pass Authorization: token ${WORKFLOW_TOKEN} to GitHub API calls.
- For Copilot automation that uses the Copilot SDK, supply COPILOT_GITHUB_TOKEN similarly as COPILOT_GITHUB_TOKEN=${{ secrets.COPILOT_GITHUB_TOKEN }} and use it as the bearer token for Copilot SDK client initialization.
- Minimal principle: never substitute GITHUB_TOKEN when the operation requires classic workflow scope; use WORKFLOW_TOKEN for workflow-file modifications.

5. Branch protection and CI recommendations (exact checks)
- Require status checks: add the repository test workflow name as required (e.g., vitest run/test workflow). This ensures no workflow can be merged without tests passing.
- Require PR reviews: set required approving reviewers = 1 or more depending on policy.
- Enforce linear history or commit signature checks as organization policy if required.

6. Troubleshooting steps (step-by-step checks and fixes)
If a workflow fails to update .github/workflows/ or a Copilot-driven action fails to run, perform these checks in order:
1) Verify secret presence
   - Go to repository Settings → Secrets → Actions and confirm a secret named WORKFLOW_TOKEN (classic PAT) and COPILOT_GITHUB_TOKEN (fine-grained PAT) are present.
2) Verify token type and scopes
   - For WORKFLOW_TOKEN: confirm it is a classic PAT and has the workflow scope selected. If missing, create a new classic PAT and re-save as the secret.
   - For COPILOT_GITHUB_TOKEN: confirm it is a fine-grained PAT and explicitly grants Copilot SDK read permission and repository content read access.
3) Verify repository Actions settings
   - Confirm Actions is set to Allow all actions.
   - Confirm Workflow permissions are set to Read and write.
4) Confirm workflow code uses the secret correctly
   - Confirm the workflow references secrets.WORKFLOW_TOKEN and secrets.COPILOT_GITHUB_TOKEN exactly and sets them into environment variables before API calls.
5) Re-run workflow with debug logs
   - Enable step-level debug logs (ACTIONS_STEP_DEBUG secret true if needed) and re-run to capture API errors.
6) Error analysis
   - If API returns 403 Forbidden: check scope; recreate token with required scope.
   - If API returns 401 Unauthorized: check token value and that the secret was saved correctly (no extra whitespace).
   - If push/PR operations fail: ensure the token has repo write or contents:write as required.

7. Best practices and operational controls (concrete recommendations)
- Least privilege: use fine-grained PATs for non-workflow operations (COPILOT_GITHUB_TOKEN) and classic PATs with workflow scope only when necessary.
- Rotate secrets: rotate PATs every 90 days and update repository secrets promptly.
- Scoped secrets: for organization-level reuse, prefer environment-level secrets scoped to specific environments; for single-repo automation, repository secrets are sufficient.
- Audit and logging: enable audit log review for token usage; capture operation traces for automated changes.
- Limit usage: only allow workflows that truly need to modify workflow files to use WORKFLOW_TOKEN; otherwise rely on GITHUB_TOKEN with repository Write permissions.

SUPPLEMENTARY DETAILS
- Exact secret names: COPILOT_GITHUB_TOKEN, WORKFLOW_TOKEN (case-sensitive).
- Token creation locations: GitHub > Settings > Developer settings > Personal access tokens (classic) for WORKFLOW_TOKEN; GitHub > Settings > Developer settings > Personal access tokens (fine-grained) for COPILOT_GITHUB_TOKEN.
- Workflow permission UI path: Repository Settings → Actions → General → Workflow permissions → set to Read and write permissions.
- Actions policy UI path to Allow all actions: Repository Settings → Actions → General → Actions permissions → Allow all actions and reusable workflows.

REFERENCE DETAILS (SPECIFICATIONS)
- WORKFLOW_TOKEN specification:
  - Token type: classic personal access token
  - Required scope: workflow
  - Secret name: WORKFLOW_TOKEN
  - Usage effect: grants API access to create or modify workflow files under .github/workflows/ when supplied as Authorization: token <WORKFLOW_TOKEN>

- COPILOT_GITHUB_TOKEN specification:
  - Token type: fine-grained personal access token
  - Required permission: Copilot SDK: read (grant read access to repository contents and Copilot-specific scopes as offered in the fine-grained UI)
  - Secret name: COPILOT_GITHUB_TOKEN
  - Usage effect: used by Copilot SDK clients to read repository state and perform Copilot-driven automation that does not require workflow-level write scope

- Exact repository setting values to enforce
  - Actions permissions: Allow all actions
  - Workflow permissions: Read and write
  - Required branch checks: include test workflow (name as appears in run) as required status check

DETAILED DIGEST
- Source: SOURCES.md entry: https://github.com/xn-intenton-z2a/repository0
- Retrieved: 2026-03-06
- Key technical items extracted:
  - Two required secrets: COPILOT_GITHUB_TOKEN (fine-grained PAT with Copilot SDK read permission) and WORKFLOW_TOKEN (classic PAT with workflow scope)
  - Repository Actions settings must allow all actions and set Workflow permissions to Read and write
  - Workflows that edit workflow YAML require WORKFLOW_TOKEN because GITHUB_TOKEN lacks ability to update .github/workflows in some repository configurations
  - Troubleshooting focuses on token scope, secret presence, repository action permissions, and correct secrets usage in workflow steps

ATTRIBUTION AND DATA SIZE
- Attribution: xn-intenton-z2a/repository0 — source list entry in SOURCES.md
- Files consulted: SOURCES.md and repository documentation referenced by SOURCES.md
- Total bytes retrieved during crawl: 9072 bytes
- Retrieval date: 2026-03-06

END OF DOCUMENT
