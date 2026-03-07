# repo

This repository is powered by [intentïon agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib) — autonomous code transformation driven by GitHub Copilot. Write a mission, and the system generates issues, writes code, runs tests, and opens pull requests on a schedule.

## FizzBuzz

This project now includes a small FizzBuzz library and CLI.

Usage examples

Library:

```js
import { fizzBuzz, fizzBuzzSingle } from './src/lib/main.js';
console.log(fizzBuzzSingle(3)); // -> 'Fizz'
console.log(fizzBuzz(15)); // -> array of 1..15 with Fizz/Buzz
```

CLI:

```bash
npm run start:cli -- single 15
# or
node src/lib/main.js range 15
```

Validation rules:
- fizzBuzz(0) -> []
- Negative numbers throw RangeError
- Non-integer numbers throw TypeError

## Getting Started

1. **Write your mission** in [`MISSION.md`](MISSION.md) — describe what you want to build in plain English
2. **Configure GitHub** — see [Setup](#setup) below
3. **Push to main** — the autonomous workflows take over from here

The system will create issues from your mission, generate code to resolve them, run tests, and open PRs. A supervisor agent orchestrates the pipeline, and you can interact through GitHub Discussions.

## Setup

### Required Secrets

Add these in your repository: **Settings → Secrets and variables → Actions → New repository secret**

| Secret | How to create | Purpose |
|--------|---------------|---------|
| `COPILOT_GITHUB_TOKEN` | [Fine-grained PAT](https://github.com/settings/tokens?type=beta) with **GitHub Copilot** → Read permission | Authenticates with the Copilot SDK for all agentic tasks |
| `WORKFLOW_TOKEN` | [Classic PAT](https://github.com/settings/tokens) with **workflow** scope | Allows `init.yml` to update workflow files (GITHUB_TOKEN cannot modify `.github/workflows/`) |

## Updating

The `init.yml` workflow runs daily and updates the agentic infrastructure automatically. To update manually:

```bash
npx @xn-intenton-z2a/agentic-lib@latest init
```

## Links

- [MISSION.md](MISSION.md) — your project goals
- [agentic-lib documentation](https://github.com/xn-intenton-z2a/agentic-lib) — full SDK docs
- [intentïon website](https://xn--intenton-z2a.com)
