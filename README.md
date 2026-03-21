# repo

This repository is powered by [intentiön agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib) — autonomous code transformation driven by GitHub Copilot. Write a mission, and the system generates issues, writes code, runs tests, and opens pull requests.

## Getting Started

### Running tests

Unit tests use Vitest. To run the unit tests:

```bash
npm ci
npm test
```

To run only unit tests with coverage:

```bash
npm run test:unit
```

To run the browser behaviour tests (Playwright):

```bash
npm run test:behaviour
```

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

## Usage Examples

The library exports two named functions: `fizzBuzz(n)` and `fizzBuzzSingle(n)`.

Example (Node / ESM):

```js
import { fizzBuzz, fizzBuzzSingle } from './src/lib/main.js';

console.log(fizzBuzzSingle(3)); // "Fizz"
console.log(fizzBuzzSingle(5)); // "Buzz"
console.log(fizzBuzzSingle(15)); // "FizzBuzz"
console.log(fizzBuzz(15));
// ["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]
```

Example (browser):

```html
<script type="module">
  import { fizzBuzz, fizzBuzzSingle } from './src/lib/main.js';
  const out = fizzBuzz(15).join(', ');
  document.querySelector('#demo-output').textContent = `fizzBuzz(15):\n${out}`;
</script>
```

... (rest unchanged)
