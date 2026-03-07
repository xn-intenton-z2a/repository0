Vitest Quickstart

Vitest is a fast unit test framework for Vite projects that is also commonly used standalone.

Example test:

```js
import { it, expect } from 'vitest'
import { add } from '../src/lib/math.js'

it('adds numbers', () => {
  expect(add(1,2)).toBe(3)
})
```

Run tests with:

```
npm run test
```

Use spies and mocks via vitest.mock and vi.spyOn as needed.