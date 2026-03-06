REPOSITORY0

NORMALISED_EXTRACT

Table of contents
1. Required secrets and exact scopes
2. Repository settings that must be configured (exact UI path)
3. Activation steps (exact CLI/UI actions and commands)
4. agentic-lib.toml keys and allowed values (exact config entries)
5. Package scripts and runtime constraints
6. Troubleshooting checklist and fixes

1. Required secrets and exact scopes
COPILOT_GITHUB_TOKEN
- Type: Fine-grained Personal Access Token (PAT)
- Required scope: Copilot Read permission (explicit fine-grained permission for Copilot SDK actions)
- Purpose: Authenticates agentic workflows/agents that use the Copilot SDK to generate and commit code changes.
- Placement: Repository → Settings → Secrets and variables → Actions → New repository secret

WORKFLOW_TOKEN
- Type: Classic Personal Access Token (PAT)
- Required scope: workflow (classic token scope) - must allow updating workflow files in .github/workflows/
- Purpose: Allows init.yml workflow to update files under .github/workflows/ (GITHUB_TOKEN cannot modify workflow files).
- Placement: Repository → Settings → Secrets and variables → Actions → New repository secret

2. Repository settings that must be configured (exact UI path)
- Enable Actions: Settings → Actions → General → Allow all actions (required for agentic workflows to run third-party actions)
- Workflow permissions: Settings → Actions → General → Workflow permissions → Set to Read and write (allows workflows to create PRs, update files)
- Allow Actions to create PRs: Settings → Actions → General → check "Allow GitHub Actions to create pull requests"
- Enable Discussions (required by the discussions bot integration): Settings → General → Features → enable Discussions
- Optional branch protection: Settings → Branches → Protect branch → select main → Require pull request reviews before merging and Require status checks to pass; add test workflow as required status check

3. Activation steps (exact CLI/UI actions and commands)
1. Create secrets in repository settings
   - Add COPILOT_GITHUB_TOKEN and WORKFLOW_TOKEN at: Settings → Secrets and variables → Actions → New repository secret
2. Configure repository settings as in section 2
3. (Optional) Run local checks and tests before relying on CI
   - Install dependencies: npm install
   - Run unit tests: npm run test:unit
4. Start workflows via GitHub UI or push a change to trigger init/test workflows. If init workflow modifies .github/workflows/, ensure WORKFLOW_TOKEN exists and is referenced by the workflow.

4. agentic-lib.toml keys and allowed values (exact config entries)
[ schedule ]
- supervisor: off | weekly | daily | hourly | continuous
  - Effect: controls automated supervisor scheduling for agent runs

[ paths ]
- mission = "MISSION.md"
- source = "src/lib/"
- tests = "tests/unit/"
- features = "features/"
- library = "library/"
- docs = "docs/"
- examples = "examples/"
- readme = "README.md"
- dependencies = "package.json"
- contributing = "CONTRIBUTING.md"
- library-sources = "SOURCES.md"
  - Effect: precise paths used by agentic-lib to locate project artifacts; must match repository layout

[ execution ]
- build = "npm run build"
- test = "npm test"
- start = "npm run start"
  - Effect: commands invoked by automated workflows for CI and local validation

[ limits ]
- feature-issues = integer (example: 2)
- maintenance-issues = integer (example: 1)
- attempts-per-branch = integer (example: 3)
- attempts-per-issue = integer (example: 2)
- features-limit = integer (example: 2)
- library-limit = integer (example: 32)
  - Effect: operational rate-limits for agent activity; tune to control noise and cost

[ tuning ]
- profile = "min|recommended|max" (example: "recommended")
- model = "gpt-5-mini" | "claude-sonnet-4" | "gpt-4.1"
- infinite-sessions = true | false
  - Effect: model selection and session behavior for agentic executions

[ bot ]
- log-file = "intentïon.md"
  - Effect: local log file path used by agents

5. Package scripts and runtime constraints (exact values)
package.json (selected entries)
- scripts:
  - build: echo "Nothing to build"
  - test: vitest --run tests/unit/*.test.js
  - test:unit: vitest --run --coverage tests/unit/*.test.js
  - start: node src/lib/main.js
- dependencies:
  - @xn-intenton-z2a/agentic-lib: ^7.1.60
- devDependencies:
  - vitest: ^4.0.18
  - @vitest/coverage-v8: ^4.0.18
- engines:
  - node: ">=24.0.0"

Concrete commands to run locally
- npm install
- npm run test (runs vitest for unit tests)
- npm run test:unit (runs tests with coverage)
- npm run start (launches node src/lib/main.js for manual execution)

6. Troubleshooting checklist and fixes (step-by-step)
Symptom: init workflow fails to update .github/workflows/
- Check: WORKFLOW_TOKEN exists in repository secrets
- Check: Workflow file references secrets properly and uses token for commits
- Fix: Add WORKFLOW_TOKEN with classic workflow scope and re-run workflow

Symptom: Actions fail with "workflow permissions" errors
- Check: Settings → Actions → General → Workflow permissions set to Read and write
- Fix: Update permission and re-run; if branch protection requires status checks, temporarily relax to allow initial setup

Symptom: Agent cannot create PRs
- Check: "Allow GitHub Actions to create pull requests" is checked (Settings → Actions → General)
- Fix: Enable that checkbox and rerun

Symptom: Tests fail locally but pass in CI (or vice versa)
- Check: Node version matches engines field (node >=24.0.0 locally)
- Fix: Use nvm or Docker to match Node version; run npm ci to ensure lockfile consistency

SUPPLEMENTARY DETAILS

Essential technical specifications and implementation details
- Exact UI path names are literal and must be followed: Settings → Actions → General → Workflow permissions
- Secrets must be created under Settings → Secrets and variables → Actions; repository-level secrets are required for workflows that update repo files
- agentic-lib paths MUST match repository layout; if files are moved, update agentic-lib.toml
- model choices: recommend gpt-5-mini for cost/latency balance, gpt-4.1 for higher quality when available
- When enabling workflows that modify .github/workflows/, use a classic PAT stored as WORKFLOW_TOKEN because GITHUB_TOKEN is forbidden from workflow file updates

REFERENCE DETAILS (exact config values, commands, and effects)
1) Exact repo settings to change
- Settings → Actions → General → "Allow all actions" (set to allow third-party actions used by agentic-lib)
- Settings → Actions → General → Workflow permissions → set to "Read and write"
- Settings → Actions → General → Allow GitHub Actions to create pull requests → check
- Settings → General → Features → Discussions → enable

2) agentic-lib.toml keys with allowed values and effects (repeat for quick copy)
- [schedule] supervisor = "off" | "weekly" | "daily" | "hourly" | "continuous"
- [execution] build = "npm run build"; test = "npm test"; start = "npm run start"
- [tuning] profile = "min|recommended|max"; model = "gpt-5-mini|claude-sonnet-4|gpt-4.1"; infinite-sessions = true|false
- [paths] mission = "MISSION.md"; source = "src/lib/"; tests = "tests/unit/"; library = "library/"; library-sources = "SOURCES.md"

3) package.json scripts and exact invocations
- npm run build -> executes: echo "Nothing to build"
- npm test -> executes: vitest --run tests/unit/*.test.js
- npm run test:unit -> executes: vitest --run --coverage tests/unit/*.test.js
- npm run start -> executes: node src/lib/main.js
- Node engine requirement: node >=24.0.0

4) Implementation patterns and best practices (concrete)
- Secrets: Prefer repository-level secrets for CI tokens; do not commit token values; name them COPILOT_GITHUB_TOKEN and WORKFLOW_TOKEN exactly to match expected workflow naming
- Branch protection: if enforcing, add test workflow as required status check and allow Actions to create PRs so agentic workflows can open changes for review
- Local validation: run npm ci && npm run test:unit before pushing changes that will trigger agentic workflows
- Model selection: use model = "gpt-5-mini" for routine CI; switch to "gpt-4.1" for higher-fidelity automated transforms when budget allows

5) Troubleshooting procedures (detailed step-by-step)
Issue: Workflow cannot modify .github/workflows/
- Step 1: Confirm WORKFLOW_TOKEN exists under repository secrets
- Step 2: Confirm the token has "workflow" scope (classic PAT) in the originating account
- Step 3: Re-run the init workflow; check workflow logs for HTTP 403 or permission errors
- Step 4: If still failing, remove branch protection temporarily and retry, then restore protections and add required checks

Issue: Actions fail due to blocked third-party actions
- Step 1: Settings → Actions → General → under "Allow actions and reusable workflows" set to "Allow all actions"
- Step 2: Rerun failing workflow

DETAILED DIGEST (sourced content and retrieval date)
- Source: repository root referenced in SOURCES.md: https://github.com/xn-intenton-z2a/repository0
- Extracted core files and config: agentic-lib.toml entries (schedule, paths, execution, tuning), package.json (scripts, dependencies, devDependencies, engines), README/mission references, and AGENTIC_LIB guidance material stored in repository root
- Retrieval date (current): 2026-03-06T05:07:24.768Z

ATTRIBUTION AND CRAWL METADATA
- Source URL: https://github.com/xn-intenton-z2a/repository0
- Retrieved: 2026-03-06T05:07:24.768Z
- Data obtained: repository metadata and key config snippets (agentic-lib.toml, package.json, AGENTIC_LIB guidance) — approximately 4.0 KB of text extracted from repository root files (metadata estimate)
- Attribution: xn-intenton-z2a/repository0 (GitHub)

USAGE NOTES
- This document is intended to be actionable: follow the exact UI paths and command strings above when performing repository configuration, secret creation, and local validation.
- Update agentic-lib.toml paths if repository layout is changed; verify workflows reference the same secret names.

END OF DOCUMENT
