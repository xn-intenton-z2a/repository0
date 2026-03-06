AGENTIC_LIB

NORMALISED EXTRACT

This document consolidates exact agentic-lib configuration, operational knobs, execution commands, distributed-file mappings, and troubleshooting steps drawn from agentic-lib.toml and repository metadata. All entries are concrete configuration values, command strings, file mappings, and recommended procedures for immediate implementation.

Table of Contents
1. Core configuration entries (agentic-lib.toml)
2. Execution commands and npm scripts
3. Paths mapping and distributed file behavior
4. Tuning knobs and model selection
5. Limits and operational defaults
6. Bot/session configuration
7. Workflow and distributed-file mappings (exact lists)
8. Best practices for init, re-init and updates
9. Troubleshooting and verification steps

1. Core configuration entries (agentic-lib.toml)

schedule.supervisor = "continuous"

[paths]
mission = "MISSION.md"
source = "src/lib/"
tests = "tests/unit/"
features = "features/"
library = "library/"
docs = "docs/"
examples = "examples/"
readme = "README.md"
dependencies = "package.json"
contributing = "CONTRIBUTING.md"
library-sources = "SOURCES.md"

[execution]
build = "npm run build"
test = "npm test"
start = "npm run start"

[limits]
feature-issues = 2
maintenance-issues = 1
attempts-per-branch = 3
attempts-per-issue = 2
features-limit = 2
library-limit = 32

[tuning]
profile = "recommended"
# model is one of: gpt-5-mini | claude-sonnet-4 | gpt-4.1
model = "gpt-5-mini"
# other knobs (examples preserved): reasoning-effort = "low" | "medium" | "high" | "none"
infinite-sessions = false

[bot]
log-file = "intentïon.md"

Notes: These are literal, exact keys and values to use when configuring the agentic-lib runtime. Changing schedule.supervisor to weekly/daily/hourly/off changes the supervisor cadence. The paths are strict relative repository paths used by automation and by the library build/scan processes.

2. Execution commands and npm scripts

package.json (type: module, main: "src/lib/main.js") scripts:
- build: echo "Nothing to build"
- test: vitest --run tests/unit/*.test.js
- test:unit: vitest --run --coverage tests/unit/*.test.js
- start: node src/lib/main.js

Engines: node >=24.0.0

Effects: Use npm run build to run the configured build step (noop by default). Use npm test or npm run test:unit to execute unit tests used by CI. start invokes the entrypoint ESM module.

3. Paths mapping and distributed-file behavior

Paths field values map to repository locations consumed by agentic workflows and the library builder. Important mappings:
- source => src/lib/ (primary code scanned and modified by agents)
- tests => tests/unit/ (unit tests used as guardrails)
- library => library/ (where produced reference documents are stored)
- library-sources => SOURCES.md (source list driving library generation)

Distributed-files rules (observed in repository metadata): certain seed/zero files are overwritten when running npx @xn-intenton-z2a/agentic-lib init --purge. Exact list of seed targets (literal):
- zero-main.js -> src/lib/main.js
- zero-main.test.js -> tests/unit/main.test.js
- zero-MISSION.md -> MISSION.md
- zero-package.json -> package.json
- zero-README.md -> README.md

Additionally, workflows and actions copied from agentic-lib include directories under .github/ (workflows, actions, agents, seeds, scripts). Treat these as distributable artifacts that the init/purge process may overwrite.

4. Tuning knobs and model selection

Available model choices (explicit): gpt-5-mini, claude-sonnet-4, gpt-4.1.
profile may be: min | recommended | max (defaults to recommended). profile controls defaults for multiple knobs (reasoning-effort, timeouts, source-content limits, etc.).

Representative tuning options and effects:
- reasoning-effort = "low"|"medium"|"high"|"none" — increases computation/analysis depth per task.
- source-content = integer (max chars per source file included in prompts)
- features-scan, source-scan, issues-scan = integer limits that bound how many items are included in prompts
- infinite-sessions = true|false — true allows long sessions that avoid compaction

5. Limits and operational defaults

These limit how many concurrent/queued automated tasks and library documents are produced:
- feature-issues = 2 (max concurrent feature issues)
- maintenance-issues = 1
- attempts-per-branch = 3
- attempts-per-issue = 2
- features-limit = 2
- library-limit = 32

Effects: Use these numbers as gating rules when authoring automation that spawns branches or persistent agents. Automation should respect and decrement counters when scheduling runs.

6. Bot/session configuration

bot.log-file = "intentïon.md" (path to runtime log file used by the bot). Use this exact path to find bot activity logs. Session folder for Copilot is described at runtime under /home/runner/.copilot/session-state/ (not configured here but present in runtime notes).

7. Workflow and distributed-file mappings (exact lists)

The repository documents which files are distributed from agentic-lib upstream. Exact mapping entries (literal filenames):
Workflows that are distributed: agent-discussions-bot.yml, agent-flow-fix-code.yml, agent-flow-maintain.yml, agent-flow-review.yml, agent-flow-transform.yml, agent-supervisor.yml, ci-automerge.yml, test.yml, init.yml

Actions distributed: .github/agentic-lib/actions/* (full directory copy excluding node_modules) — notably commit-if-changed, agentic-step, setup-npmrc.

Agents distributed: .github/agentic-lib/agents/*

Seeds distributed: .github/agentic-lib/seeds/* and the seed files that may overwrite project root files when purge is used (zero-main.js, zero-main.test.js, zero-MISSION.md, zero-package.json, zero-README.md).

Scripts distributed: .github/agentic-lib/scripts/ (selected files) including: accept-release.sh, activate-schedule.sh, clean.sh, initialis e.sh, md-to-html.js, update.sh

8. Best practices for init, re-init and updates

- Always commit local changes before running npx @xn-intenton-z2a/agentic-lib init --purge. The purge action overwrites seed targets listed in section 3 and distributed files under .github/agentic-lib/.
- When making local fixes intended to persist across inits, update agentic-lib upstream source or add local non-distributed files outside the distributed list.
- Keep package.json scripts minimal; automation relies on exact script names (test, start, build).
- Use node >=24 to avoid runtime compatibility issues.

9. Troubleshooting and verification steps

Step 1: Validate node version
- node --version must be >= v24.0.0

Step 2: Run tests
- npm ci (if package-lock present) then npm test
- If vitest fails, run vitest --run tests/unit/*.test.js to see failing assertions

Step 3: Confirm distributed-file safety
- Run git status to ensure no uncommitted changes before running init --purge
- If files were overwritten accidentally, recover with git checkout -- <file> or revert via git reflog

Step 4: Verify agentic-lib init behavior
- Run npx @xn-intenton-z2a/agentic-lib init --purge --dry-run to preview changes (if available)
- If init is destructive, re-apply local modifications in a higher-priority location or upstream in agentic-lib source

SUPPLEMENTARY DETAILS

Essential technical specifications and implementation notes
- The agentic-lib runtime expects exact path keys under [paths]; all automation uses these values verbatim. Change them only with full replacement of downstream automation settings.
- model selection directly affects which sub-agents are used. "gpt-5-mini" is the default and recommended for CI-speed tasks; "claude-sonnet-4" is preferred for nuanced code transforms; "gpt-4.1" for thorough analysis.
- profile="recommended" sets balanced defaults; switching to "min" reduces source-content and scans; "max" raises them (more tokens and cost).
- limit keys must be respected by orchestrating scripts to avoid runaway PR/branch creation.
- package.json main must be an ESM entrypoint (type: module); main points to src/lib/main.js which is used by start.

REFERENCE DETAILS

Exact configuration options, values and effects (copy-paste ready)
- schedule.supervisor = "continuous"  // values: off | weekly | daily | hourly | continuous
- paths.mission = "MISSION.md"
- paths.source = "src/lib/"
- paths.tests = "tests/unit/"
- paths.library = "library/"
- execution.build = "npm run build"
- execution.test = "npm test"
- execution.start = "npm run start"
- tuning.profile = "recommended"  // values: min | recommended | max
- tuning.model = "gpt-5-mini"  // values: gpt-5-mini | claude-sonnet-4 | gpt-4.1
- limits.feature-issues = 2
- limits.maintenance-issues = 1
- limits.attempts-per-branch = 3
- limits.attempts-per-issue = 2
- limits.features-limit = 2
- limits.library-limit = 32
- bot.log-file = "intentïon.md"

Best-practice implementation patterns
- Always run: git --no-pager status && git --no-pager diff before running any init/purge operations.
- Use npm test (vitest) as the CI gate; implement minimal but deterministic unit tests under tests/unit/ to avoid flakiness.
- When editing distributed files, either update agentic-lib upstream or place local overrides outside the distributed mapping.

Step-by-step recovery patterns
- If init --purge overwrote files accidentally:
  1. git checkout -- <overwritten-file>  OR
  2. git reflog && git reset --hard <prior-commit> to restore state
- If tests fail after distributed changes, run npm test locally, inspect failing stack trace, and incrementally revert the last init changes.

DETAILED DIGEST

Source: https://github.com/xn-intenton-z2a/repository0
Retrieved: 2026-03-06T22:29:56Z
Digest summary: agentic-lib.toml contains authoritative runtime configuration keys used by automation. The repository uses node >=24 and vitest for unit testing. The agentic-lib distribution model copies multiple workflows, actions, agents and seed files into the host repo; init --purge can overwrite a known set of root files listed explicitly in the config and seed lists.

Attribution
- Source URL: https://github.com/xn-intenton-z2a/repository0
- Retrieval date: 2026-03-06
- Data size obtained during crawling: approx 8.2 KB

END OF DOCUMENT
