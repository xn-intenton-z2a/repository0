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

## FizzBuzz Library

This project implements a small FizzBuzz library with two named exports:

- `fizzBuzz(n)` — returns an array of strings for values from 1 to n inclusive.
- `fizzBuzzSingle(n)` — returns the FizzBuzz string for a single integer n.

Both functions perform input validation:

- Passing a non-number or non-integer throws TypeError.
- Negative numbers (or zero for fizzBuzzSingle) throw RangeError.
- `fizzBuzz(0)` returns an empty array.

Examples:

```js
import { fizzBuzz, fizzBuzzSingle } from './src/lib/main.js';

console.log(fizzBuzzSingle(3)); // "Fizz"
console.log(fizzBuzzSingle(5)); // "Buzz"
console.log(fizzBuzzSingle(15)); // "FizzBuzz"
console.log(fizzBuzzSingle(7)); // "7"

console.log(fizzBuzz(15));
// ["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]

console.log(fizzBuzz(0)); // []

// Errors:
// fizzBuzz(2.5) -> TypeError
// fizzBuzz(-1)  -> RangeError
// fizzBuzzSingle(0) -> RangeError
// fizzBuzzSingle(3.2) -> TypeError
```

## How It Works

The library is ESM and browser-safe: `src/web/lib.js` re-exports from `src/lib/main.js`, and `src/web/index.html` loads `lib.js` to demonstrate the API.

## Updating

The `init` workflow updates the agentic infrastructure automatically. To update manually:

```bash
npx @xn-intenton-z2a/agentic-lib init --purge
```

## File Layout

```
src/lib/main.js              <- library (browser-safe)
src/web/index.html            <- web page (imports ./lib.js)
tests/unit/*.test.js          <- unit tests
tests/behaviour/              <- Playwright E2E
docs/                         <- build output for GitHub Pages
```

## Links

- [MISSION.md](MISSION.md) — your project goals
- [agentic-lib documentation](https://github.com/xn-intenton-z2a/agentic-lib) — full SDK docs
