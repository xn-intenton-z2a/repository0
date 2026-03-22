# repo

This repository is powered by [intenti&ouml;n agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib) — autonomous code transformation driven by GitHub Copilot. Write a mission, and the system generates issues, writes code, runs tests, and opens pull requests.

## Getting Started

### Step 1: Create Your Repository

Click **"Use this template"** on the [repository0](https://github.com/xn-intenton-z2a/repository0) page, or use the GitHub CLI:

```bash
gh repo create my-project --template xn-intenton-z2a/repository0 --public --clone
cd my-project
```

### Step 2: Initialise with a Mission

Run the init workflow from the GitHub Actions tab (**agentic-lib-init** with mode=purge), or use the CLI:

```bash
npx @xn-intenton-z2a/agentic-lib init --purge --mission 7-kyu-understand-fizz-buzz
```

This resets the repository to a clean state with your chosen mission in `MISSION.md`. The default mission is **fizz-buzz** (7-kyu).

#### Built-in Missions

agentic-lib ships with 20 built-in missions plus two special modes, graded using [Codewars kyu/dan](https://docs.codewars.com/concepts/kata/) difficulty:

| Mission | Kyu/Dan | Description |
|---------|---------|-------------|
| `random` | — | Randomly select from all built-in missions |
| `generate` | — | Ask the LLM to generate a novel mission |
| `8-kyu-remember-empty` | 8 kyu | Blank template |
| `8-kyu-remember-hello-world` | 8 kyu | Hello World |
| `7-kyu-understand-fizz-buzz` | 7 kyu | Classic FizzBuzz (default) |
| `6-kyu-understand-hamming-distance` | 6 kyu | Hamming distance (strings + bits) |
| `6-kyu-understand-roman-numerals` | 6 kyu | Roman numeral conversion |
| `5-kyu-apply-ascii-face` | 5 kyu | ASCII face art |
| `5-kyu-apply-string-utils` | 5 kyu | 10 string utility functions |
| `4-kyu-apply-cron-engine` | 4 kyu | Cron expression parser |
| `4-kyu-apply-dense-encoding` | 4 kyu | Dense binary encoding |
| `4-kyu-analyze-json-schema-diff` | 4 kyu | JSON Schema diff |
| `4-kyu-apply-owl-ontology` | 4 kyu | OWL ontology processor |
| `3-kyu-analyze-lunar-lander` | 3 kyu | Lunar lander simulation |
| `3-kyu-evaluate-time-series-lab` | 3 kyu | Time series analysis |
| `2-kyu-create-markdown-compiler` | 2 kyu | Markdown compiler |
| `2-kyu-create-plot-code-lib` | 2 kyu | Code visualization library |
| `1-kyu-create-ray-tracer` | 1 kyu | Ray tracer |
| `1-dan-create-c64-emulator` | 1 dan | C64 emulator |
| `1-dan-create-planning-engine` | 1 dan | Planning engine |
| `2-dan-create-self-hosted` | 2 dan | Self-hosted AGI vision |

List all available missions:

```bash
npx @xn-intenton-z2a/agentic-lib iterate --list-missions
```

#### Write Your Own Mission

Edit `MISSION.md` directly — describe what you want to build, the features, requirements, and acceptance criteria as checkboxes:

```markdown
# Mission

Build a CLI tool that converts CSV files to formatted Markdown tables.

## Features
- Read CSV from file or stdin
- Auto-detect delimiter

## Acceptance Criteria
- [ ] Reading a CSV with 3 columns produces a 3-column Markdown table
- [ ] All unit tests pass
```

### Step 3: Enable GitHub Copilot and Configure Secrets

Add these secrets in **Settings > Secrets and variables > Actions**:

| Secret | How to create | Purpose |
|--------|---------------|---------|
| `COPILOT_GITHUB_TOKEN` | [Fine-grained PAT](https://github.com/settings/tokens?type=beta) with **GitHub Copilot** > Read | Authenticates with the Copilot SDK |
| `WORKFLOW_TOKEN` | [Classic PAT](https://github.com/settings/tokens) with **workflow** scope | Allows init to update workflow files |

Then in **Settings > Actions > General**:
- Workflow permissions: **Read and write permissions**
- Allow GitHub Actions to create PRs: **Checked**

### Step 4: Activate the Schedule

Workflows ship with schedule **off** by default. Activate them from the GitHub Actions tab by running **agentic-lib-schedule** with your desired frequency:

| Frequency | Workflow runs | Init runs | Test runs |
|-----------|--------------|-----------|-----------|
| continuous | Every 20 min | Every 4 hours | Every hour |
| hourly | Every hour | Every day | Every 4 hours |
| daily | Every day | Every week | Every day |
| weekly | Every week | Every month | Every week |
| off | Never | Never | Never |

## How It Works

```
MISSION.md -> [supervisor] -> dispatch workflows -> Issue -> Code -> Test -> PR -> Merge
                                                     ^                           |
                                                     +---------------------------+
```

The pipeline runs as GitHub Actions workflows. An LLM supervisor gathers repository context and dispatches other workflows. Each workflow uses the Copilot SDK to make targeted changes.

## Configuration

Edit `agentic-lib.toml` to tune the system:

```toml
[schedule]
supervisor = "off"          # off | weekly | daily | hourly | continuous
focus = "mission"           # mission | maintenance

[tuning]
profile = "max"             # min | med | max
model = "gpt-5-mini"       # gpt-5-mini | claude-sonnet-4 | gpt-4.1

[mission-complete]
acceptance-criteria-threshold = 50   # % of criteria that must be met
min-resolved-issues = 1              # minimum closed issues
```

## File Layout

```
src/lib/main.js              <- library (browser-safe)
src/web/index.html            <- web page (imports ./lib.js)
tests/unit/main.test.js       <- unit tests
tests/behaviour/              <- Playwright E2E
docs/                         <- build output for GitHub Pages
```

## Updating

The `init` workflow updates the agentic infrastructure automatically. To update manually:

```bash
npx @xn-intenton-z2a/agentic-lib@latest init --purge
```

## Links

- [MISSION.md](MISSION.md) — your project goals
- [agentic-lib documentation](https://github.com/xn-intenton-z2a/agentic-lib) — full SDK docs
- [intenti&ouml;n website](https://xn--intenton-z2a.com)
