## FizzBuzz usage

Example: Create a readable stream and pipe to stdout

```js
import { createFizzBuzzReadable } from '../src/lib/main.js';
const r = createFizzBuzzReadable(15);
for await (const line of r) console.log(line);
```
