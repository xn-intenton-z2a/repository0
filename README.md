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

## FizzBuzz usage

The library exports two named functions: `fizzBuzz(n)` and `fizzBuzzSingle(n)`.

- `fizzBuzzSingle(n)` returns the FizzBuzz string for a single positive integer `n`:

```js
import { fizzBuzzSingle } from './src/lib/main.js';
console.log(fizzBuzzSingle(3)); // "Fizz"
console.log(fizzBuzzSingle(5)); // "Buzz"
console.log(fizzBuzzSingle(7)); // "7"
console.log(fizzBuzzSingle(15)); // "FizzBuzz"
```

- `fizzBuzz(n)` returns an array of strings for the sequence 1..n, applying the FizzBuzz rules. Edge cases:
  - `fizzBuzz(0)` returns an empty array
  - negative numbers throw `RangeError`
  - non-integers throw `TypeError`

```js
import { fizzBuzz } from './src/lib/main.js';
console.log(fizzBuzz(15));
// ["1","2","Fizz",...,"FizzBuzz"]
```

## How It Works

The project is ESM-first (`"type": "module"`) and is browser-safe: the website at `src/web/index.html` imports `src/web/lib.js`, which re-exports the library for the demo.

## File Layout

```
src/lib/main.js              <- library (browser-safe)
src/web/index.html           <- web page (imports ./lib.js)
tests/unit/                  <- unit tests
tests/behaviour/             <- Playwright E2E tests
```

## Running tests

```bash
npm ci
npm test          # unit tests (Vitest)
npm run test:behaviour   # Playwright behaviour tests
```

The README includes usage examples for the FizzBuzz library. For more information see `MISSION.md`.
