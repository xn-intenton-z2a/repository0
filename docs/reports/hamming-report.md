# Hamming utilities report

This report demonstrates the hammingDistanceString and hammingDistanceInt utilities added to the project.

Usage examples (JS):

```js
import { hammingDistanceString, hammingDistanceInt } from './src/lib/hamming.js';

console.log(hammingDistanceString('karolin', 'kathrin')); // 3
console.log(hammingDistanceInt(1, 4)); // 2
```

Evidence and example outputs are available under docs/examples and docs/evidence.
