NORMALISED EXTRACT

Table of contents
1. Running tests
2. Assertion API (toEqual, toThrow, etc.)
3. Testing error throws
4. Example FizzBuzz test cases (plain text)
5. Coverage and runner flags

1. Running tests
- This repository invokes vitest via the npm script: npm test -> vitest --run tests/unit/*.test.js
- Use vitest --watch during development; use --run for CI runs.

2. Assertion API
- toEqual for deep equality (use for arrays returned by fizzBuzz)
- toBe for strict primitive equality
- toThrow(ErrorClass) to assert the thrown type; toThrow('message') to assert message content
- Typical imports: import { test, expect } from 'vitest' or import { describe, it, expect } from 'vitest'

3. Testing error throws
- Use expect(() => func()).toThrow(ErrorClass) to assert the exact error constructor. Example: expect(() => fizzBuzz(-1)).toThrow(RangeError)
- Use expect(() => func()).toThrow('partial message') for message substring matching

4. Example FizzBuzz test cases (plain text)
- import { fizzBuzz, fizzBuzzSingle } from '../../src/lib/main.js'
- test('fizzBuzz(15) correct', () => { expect(fizzBuzz(15).length).toEqual(15); expect(fizzBuzz(15)[14]).toEqual('FizzBuzz') })
- test('single values', () => { expect(fizzBuzzSingle(3)).toEqual('Fizz'); expect(fizzBuzzSingle(5)).toEqual('Buzz'); expect(fizzBuzzSingle(7)).toEqual('7') })
- test('edge cases', () => { expect(fizzBuzz(0)).toEqual([]); expect(() => fizzBuzz(-1)).toThrow(RangeError); expect(() => fizzBuzz(1.2)).toThrow(TypeError) })

5. Coverage and runner flags
- Use npm run test:unit for coverage-enabled runs (package.json defines test:unit)
- Vitest supports Node ESM; ensure imports use explicit file extensions and package.json has "type": "module"

DIGEST
Source: https://vitest.dev/
Retrieved: 2026-03-19
Extract (technical): Vitest is a Vite-native test runner that exposes a Jest-like API (test/expect) and supports running tests via CLI flags. Use expect(...).toEqual for array equality and expect(() => ...).toThrow(ErrorClass) for error assertions.

ATTRIBUTION
- URL: https://vitest.dev/
- Retrieved: 2026-03-19
- Bytes downloaded: 69584
