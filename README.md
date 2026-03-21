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

### FizzBuzz Library

This repository includes a small FizzBuzz library exported from `src/lib/main.js` with two named exports:

- `fizzBuzz(n)` — returns an array of strings for numbers 1..n applying Fizz/Buzz/FizzBuzz rules. `fizzBuzz(0)` returns `[]`.
- `fizzBuzzSingle(n)` — returns the FizzBuzz string for a single positive integer (e.g., `3 -> "Fizz"`, `5 -> "Buzz"`, `15 -> "FizzBuzz"`, `7 -> "7"`).

Input validation:
- Non-integer inputs throw TypeError
- Negative inputs throw RangeError

Example (Node):

```js
import { fizzBuzz, fizzBuzzSingle } from './src/lib/main.js';
console.log(fizzBuzz(15));
console.log(fizzBuzzSingle(3)); // -> "Fizz"
```

Example (browser): open `src/web/index.html` and the page will display a small FizzBuzz demo (1..15) and single-value examples.

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
