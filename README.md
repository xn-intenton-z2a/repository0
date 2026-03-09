# repository0 — fizz-buzz demo

This repository demonstrates a small, reusable FizzBuzz library with unit tests, a web demo, and behaviour tests.

Features
- Library: src/lib/main.js exports generate(n) and format(n).
- Web demo: src/web/index.html shows generated fizz-buzz output and provides a small control to render with a custom n.
- Tests: unit tests (vitest) and behaviour tests (Playwright) verify the library and demo.

API

- generate(n)
  - Signature: generate(n: number): Array<number | 'fizz' | 'buzz' | 'fizzbuzz'>
  - Behavior: returns an array for 1..n inclusive where multiples of 3 -> 'fizz', multiples of 5 -> 'buzz', multiples of 15 -> 'fizzbuzz', otherwise the number.
  - Errors: throws TypeError with message "n must be a positive integer" for non-integer, NaN, non-number, or n < 1.

- format(n)
  - Signature: format(n: number): string
  - Behavior: returns a newline-separated string representation of generate(n) suitable for CLI and web display.

CLI

- Node: node src/lib/main.js 20

Web Demo

- Open the demo locally (build step copies files to docs/):
  - npm run build:web
  - npm start
  - Open http://localhost:5000 (served by `serve` package) or open docs/index.html directly in the browser.

Running Tests

- Unit tests: npm test
- Behaviour tests (Playwright): npm run test:behaviour

Notes & Links

- This project follows the mission of demonstrating a minimal agentic-library demo and CI workflows. See MISSION.md, CONTRIBUTING.md and LICENSE.
- The agentic-lib project: https://github.com/xn-intenton-z2a/agentic-lib

