AGENTIC_LIB

NORMALISED_EXTRACT

Table of Contents
1. Required Secrets and Exact Purpose
2. Repository Settings and Permissions (exact UI locations)
3. Setup Steps to Activate the Agentic Pipeline
4. Pipeline Execution Flow and Responsibilities
5. Configuration Keys and Allowed Values (agentic-lib.toml)
6. Update / Maintenance Command (exact)
7. Important File Paths and Scripts

1. Required Secrets and Exact Purpose
COPILOT_GITHUB_TOKEN
- Type: Fine-grained Personal Access Token (PAT)
- Required scope: Copilot Read permission (use GitHub fine-grained token creation flow)
- Purpose: Authenticates the Copilot SDK used by workflows to perform agentic tasks (code generation, changes).

WORKFLOW_TOKEN
- Type: Classic Personal Access Token (PAT)
- Required scope: workflow (classic token scope)
- Purpose: Allows init.yml workflow to update files under .github/workflows/ (GITHUB_TOKEN cannot modify workflow files). Use only for workflow updates; store as Actions secret.

2. Repository Settings and Permissions (exact UI locations)
- GitHub Actions: Settings → Actions → General → Allow all actions (must be enabled).
- Workflow permissions: Settings → Actions → General → Workflow permissions → Read and write (must be set to allow PR creation and modifications).
- Allow GitHub Actions to create PRs: Settings → Actions → General → check "Allow GitHub Actions to create pull requests".
- GitHub Discussions: Settings → General → Features → enable Discussions (required for the discussions bot integration).
- Optional branch protection recommendation: Protect main with "Require pull request reviews before merging" and "Require status checks to pass". Include the test workflow as a required status check.

3. Setup Steps to Activate the Agentic Pipeline (step-by-step)
1. Create and add secrets:
   - Add COPILOT_GITHUB_TOKEN and WORKFLOW_TOKEN in repository: Settings → Secrets and variables → Actions → New repository secret.
2. Configure repository settings per section 2 (Actions allowed, workflow permissions read/write, allow Actions to create PRs).
3. Write your mission in MISSION.md at repository root. This file is the input that drives the supervisor agent.
4. Push changes to main. The supervisor workflows will pick up the mission and begin automation: create issues, generate code changes, run tests, and open PRs.

4. Pipeline Execution Flow and Responsibilities (concrete mapping)
MISSION.md -> [supervisor LLM] -> dispatch workflows -> Issue -> Code -> Test -> PR -> Merge
- Supervisor LLM role: gather repository context (issues, PRs, workflow runs, features) and schedule/dispatch workflows.
- Workflows: use the Copilot SDK and agentic-lib to implement changes. Each workflow is focused (issue → code → test → PR).
- init.yml role: daily update of agentic infrastructure; can be run manually via the CLI command below.

5. Configuration Keys and Allowed Values (agentic-lib.toml)
- [schedule]
  supervisor: one of (off, weekly, daily, hourly, continuous). Example recommended default: daily.
- [paths]
  mission: path to mission file (default: "MISSION.md").
  source: path to source code (default: "src/lib/").
  tests: path to unit tests (default: "tests/unit/").
  features: optional features directory (default: "features/").
  library: library output folder (default: "library/").
  docs: docs path (default: "docs/").
  readme: README file (default: "README.md").
  dependencies: path to package manifest (default: "package.json").
  contributing: path to CONTRIBUTING.md.
- [limits]
  feature-issues: integer maximum concurrent feature issues (example: 2).
  attempts-per-issue: integer max retries per issue (example: 2).
- [execution]
  build: shell command to build repo (example: "npm run build").
  test: shell command to run tests (example: "npm test").
  start: shell command to start app (example: "npm run start").

6. Update / Maintenance Command (exact)
- Manual update command: npx @xn-intenton-z2a/agentic-lib@latest init
  - Use this when you need to update agentic infrastructure immediately instead of waiting for the daily init.yml run.

7. Important File Paths and Scripts (exact values from package.json)
- Entry point: src/lib/main.js
- Scripts (package.json):
  - build: echo "Nothing to build"
  - test: vitest --run tests/unit/*.test.js
  - test:unit: vitest --run --coverage tests/unit/*.test.js
  - start: node src/lib/main.js
- Node engine requirement: node >= 24.0.0
- Key dependency: @xn-intenton-z2a/agentic-lib (use version defined in package.json; current declared ^7.1.60)

SUPPLEMENTARY DETAILS

Secrets and Token Best Practices
- Store COPILOT_GITHUB_TOKEN and WORKFLOW_TOKEN as repository Actions secrets, not environment variables in workflows.
- Limit token scopes: use fine-grained PAT for COPILOT_GITHUB_TOKEN and the minimal classic scope (workflow) for WORKFLOW_TOKEN. Rotate tokens regularly.
- Never commit tokens or secrets into repository files.

Repository Permissions and Troubleshooting
- If workflows cannot update .github/workflows/, verify WORKFLOW_TOKEN exists and has workflow scope. GITHUB_TOKEN cannot modify workflows.
- If Actions cannot create PRs, verify "Allow GitHub Actions to create pull requests" is checked and workflow permissions are Read and write.
- If the supervisor appears idle, ensure MISSION.md exists and schedule.supervisor is not set to off in agentic-lib.toml.

Local verification steps
- Run tests locally: npm test (uses vitest). If test workflow fails in CI, run vitest locally to reproduce.
- Validate node version: node --version must be >= 24.0.0.
- Apply manual agentic-lib update: npx @xn-intenton-z2a/agentic-lib@latest init and commit any resulting workflow changes with a token that can update workflows.

REFERENCE DETAILS

Exact configuration options and effects
- schedule.supervisor values and effects:
  - off: supervisor disabled; no scheduled dispatching of workflows.
  - weekly: supervisor runs weekly to dispatch workflows.
  - daily: supervisor runs daily (default recommended).
  - hourly: supervisor runs hourly (higher frequency, more activity).
  - continuous: supervisor runs continuously (highest frequency; use with caution).

- paths.source effect: Files under this path are scanned for code context by workflows. Default: src/lib/.
- limits.feature-issues effect: Controls parallelism of feature work. Setting too high may create many concurrent PRs; set conservatively.

Package.json script signatures (exact commands)
- test: vitest --run tests/unit/*.test.js
  - Runs unit tests matching tests/unit/*.test.js using vitest in run mode (non-interactive).
- test:unit: vitest --run --coverage tests/unit/*.test.js
  - Runs unit tests with coverage collection using @vitest/coverage-v8.
- start: node src/lib/main.js
  - Launches the repository entry point used by any local/manual runs.

GitHub UI exact locations for configuration
- Add secret: Settings → Secrets and variables → Actions → New repository secret
- Actions general settings: Settings → Actions → General
- Enabling discussions: Settings → General → Features → Discussions

Concrete best practices and implementation examples (no raw code blocks)
- To prepare repository for agentic automation:
  1. Create MISSION.md with plain English goals. Keep each goal atomic and testable.
  2. Add COPILOT_GITHUB_TOKEN (fine-grained PAT) and WORKFLOW_TOKEN (classic PAT with workflow scope) as repository secrets.
  3. Ensure Actions permissions are Read and write and allow Actions to create PRs.
  4. Protect main branch with required status checks including the test workflow.
  5. Run npm test locally to ensure guardrail tests pass before enabling automatic merges.

Step-by-step troubleshooting (common failure modes)
- Failure: init.yml cannot update workflows after npx init
  - Check: WORKFLOW_TOKEN secret exists and has workflow scope.
  - Fix: Create or update WORKFLOW_TOKEN with correct scopes and re-run the init command.
- Failure: Workflows run but cannot create PRs
  - Check: Workflow permissions are Read and write and "Allow GitHub Actions to create pull requests" is checked.
  - Fix: Update repository Actions settings and re-run workflow or re-trigger batch operation.
- Failure: Supervisor appears to ignore MISSION.md
  - Check: agentic-lib.toml schedule.supervisor not set to off and MISSION.md exists at configured path.
  - Fix: Edit agentic-lib.toml to correct path or schedule and push changes.

DETAILED DIGEST
- Source: https://github.com/xn-intenton-z2a/repository0
- Retrieval date: 2026-03-06
- Key actionable technical points extracted:
  - Agentic automation is driven by a supervisor LLM that reads MISSION.md and dispatches workflows which use the Copilot SDK.
  - Two repository secrets are mandatory: COPILOT_GITHUB_TOKEN (fine-grained Copilot Read PAT) and WORKFLOW_TOKEN (classic PAT with workflow scope) because GITHUB_TOKEN cannot update workflow files.
  - Repository settings must permit Actions to run, grant workflow read/write permissions, and allow Actions to create PRs.
  - agentic-lib.toml is the central configuration; important keys include schedule.supervisor, paths.source, and limits.feature-issues.
  - Manual update command: npx @xn-intenton-z2a/agentic-lib@latest init

ATTRIBUTION AND CRAWL METADATA
- Source URL: https://github.com/xn-intenton-z2a/repository0
- Retrieved: 2026-03-06T04:58:26Z
- Data size obtained during crawl: approximately 3.2 KB (3,175 bytes)
- Attribution: content publicly available in the repository README and documentation files on the repository landing page.

END OF DOCUMENT
