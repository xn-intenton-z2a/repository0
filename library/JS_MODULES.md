JavaScript Modules (ESM)

ES module syntax uses import and export. Files with .mjs extension or package.json with "type": "module" are treated as ESM in Node.js.

Named export example:

```js
// math.js
export function add(a, b) { return a + b }

// main.js
import { add } from './math.js'
console.log(add(2,3))
```

Default export example:

```js
// logger.js
export default function log(msg){ console.log(msg) }

// main.js
import log from './logger.js'
log('hello')
```