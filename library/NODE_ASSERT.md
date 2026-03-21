NODE_ASSERT

Source: https://nodejs.org/api/assert.html

Normalised extract (direct technical content):
- Module and imports
  - ESM import recommended: import assert from 'node:assert/strict'
  - Alternative: import { strict as assert } from 'assert'
- Core synchronous assertion APIs (signatures and returns)
  - assert.ok(value: any, message?: string): void  -- alias assert(value)
  - assert.strictEqual(actual: any, expected: any, message?: string): void
  - assert.notStrictEqual(actual: any, expected: any, message?: string): void
  - assert.deepStrictEqual(actual: any, expected: any, message?: string): void
  - assert.notDeepStrictEqual(actual: any, expected: any, message?: string): void
  - assert.throws(block: Function, error?: RegExp | Function | Object, message?: string): void
- Core asynchronous assertion APIs (signatures and returns)
  - assert.rejects(asyncFn: Promise | Function, error?: RegExp | Function | Object, message?: string): Promise<void>
  - assert.doesNotReject(asyncFn: Promise | Function, message?: string): Promise<void>
- Additional helpers
  - assert.match(string: string, regexp: RegExp, message?: string): void
  - assert.fail(message?: string | Error): never
- Usage patterns and behavior
  - assert.strictEqual uses === for comparison; use deepStrictEqual for structural object comparison.
  - assert.throws requires a synchronous function that when invoked throws; assert.rejects accepts a Promise or an async function and returns a Promise that resolves when the assertion has run.
  - Error parameter for throws/rejects can be an Error constructor, a RegExp to match message, or a validation function.

Supplementary details (implementation specifics):
- Import patterns in ESM projects: import assert from 'node:assert/strict' to get strict assertion behavior by default.
- Asynchronous example (plain text representation):
  await assert.rejects(async () => { await someAsyncFunction() }, { name: 'TypeError' })
- When comparing objects with symbol properties, deepStrictEqual compares property descriptors and will consider types and prototypes; use JSON-serialized comparison only when prototypes are intentionally ignored.

Reference details (API specifications, parameter lists, return types):
- assert.ok(value: any, message?: string): void
- assert.strictEqual(actual: any, expected: any, message?: string): void
- assert.notStrictEqual(actual: any, expected: any, message?: string): void
- assert.deepStrictEqual(actual: any, expected: any, message?: string): void
- assert.notDeepStrictEqual(actual: any, expected: any, message?: string): void
- assert.throws(block: () => any, error?: RegExp | Function | Object, message?: string): void
- assert.rejects(asyncFn: Promise<any> | (() => Promise<any>), error?: RegExp | Function | Object, message?: string): Promise<void>
- assert.doesNotReject(asyncFn: Promise<any> | (() => Promise<any>), message?: string): Promise<void>

Best practices and troubleshooting
- Prefer strict variants (strictEqual, deepStrictEqual) to avoid coercive comparisons.
- For async error assertions use assert.rejects and pass an error validator or RegExp to precisely match error conditions.
- When deepStrictEqual fails on objects with differing prototypes, check prototype chain and use Object.getPrototypeOf or convert objects to plain objects before comparison if prototype is irrelevant.
- If an asserted async function unexpectedly resolves, assert.rejects will fail; wrap call in a function: assert.rejects(() => asyncCall())

Detailed digest (extracted content and metadata):
- Retrieved from: https://nodejs.org/api/assert.html
- Retrieval date: 2026-03-21
- Data obtained during crawl: approximately 454.3 KB of HTML (saved to temporary fetch output)
- Extract summary used: import patterns for ESM, full list of core assertion APIs with parameter and return types, async helpers (rejects/doesNotReject), and usage/edge-case guidance.

Attribution
- Source: Node.js documentation — https://nodejs.org/api/assert.html
- Data retrieved on 2026-03-21; content size noted above.
