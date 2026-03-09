# repository0

Small template repository augmented with a FizzBuzz demo feature.

## FizzBuzz demo

This repository now includes a FizzBuzz library and a browser demo.

- Library: src/lib/main.js exports fizzBuzz(n) and fizzBuzzSingle(n)
- CLI: node src/lib/main.js [N] prints first N values (default 100)
- Web demo: src/web/index.html (built into docs/ by `npm run build:web`)

Example (ESM):

```js
import { fizzBuzz } from './src/lib/main.js';
console.log(fizzBuzz(15));
```

See docs/fizz-buzz.md for more information.
