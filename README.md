# repo

This repository is powered by [intentïon agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib) — autonomous code transformation driven by GitHub Copilot. Write a mission, and the system generates issues, writes code, runs tests, and opens pull requests on a schedule.

## Hamming Distance Library

This project includes two Hamming-distance utilities exported from `src/lib/main.js`:

- `hammingString(a, b)` — compute the Hamming distance between two strings by Unicode code points.
  - Throws TypeError if arguments are not strings.
  - Throws RangeError if strings differ in length (in Unicode code points).
  - Example: hammingString('karolin', 'kathrin') === 3

- `hammingBits(a, b)` — compute the Hamming distance between two non-negative integers by counting differing bits.
  - Accepts Number (integer) or BigInt.
  - Throws TypeError if arguments are not integers (Number integer or BigInt).
  - Throws RangeError for negative integers.
  - Example: hammingBits(1, 4) === 2

Usage examples (Node):

```js
import { hammingString, hammingBits } from './src/lib/main.js';
console.log(hammingString('karolin', 'kathrin'));
console.log(hammingBits(1, 4));
```

Website demo

Open `src/web/index.html` in a browser (or run `npm run start` after building) to see a small demo showing example inputs and outputs.

## Getting Started

Run unit tests:

```bash
npm ci
npm test
```

Run behaviour (Playwright) tests:

```bash
npm run test:behaviour
```

## Project Structure

- `src/lib/main.js` — library entry point (browser-safe). Exports `name`, `version`, `getIdentity`, `hammingString`, and `hammingBits`.
- `src/web/` — simple website that imports `src/lib/main.js` via `src/web/lib.js` and demonstrates the library.
- `tests/unit/` — unit tests for library and web wiring.
- `tests/behaviour/` — Playwright tests ensuring the website renders and displays library identity.

## License

MIT
