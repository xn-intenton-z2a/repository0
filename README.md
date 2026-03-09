# FizzBuzz Library (repo)

This repository demonstrates a small FizzBuzz library with CLI and web demo.

Links:
- Mission: MISSION.md
- Contributing: CONTRIBUTING.md
- License: LICENSE
- agentic-lib: https://github.com/xn-intenton-z2a/agentic-lib

Usage examples (Node API):

```js
import { fizzBuzz, fizzBuzzSingle } from './src/lib/main.js';
console.log(fizzBuzz(15));
console.log(fizzBuzzSingle(3));
```

CLI usage:

```
node src/lib/main.js --help
node src/lib/main.js fizz 15
node src/lib/main.js fizz 15 --json
node src/lib/main.js fizz-single 3
```

Input validation:
- Non-number types and non-integers throw TypeError
- Negative integers throw RangeError
- fizzBuzz(0) returns []
- fizzBuzzSingle(0) throws RangeError

Docs and examples are in the `docs/` directory (built by `npm run build:web`).

