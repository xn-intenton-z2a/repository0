NODE_ASSERT

Table of Contents
- Overview
- Core assertion functions
- Error-throwing assertions and signatures
- Deep equality variants
- Exceptions and thrown error handling
- Practical patterns for tests
- Reference signatures and return types
- Digest and crawl metadata
- Attribution

Overview
Node's built-in assert module provides assertion functions for synchronous runtime checks and unit tests. Functions throw AssertionError on failure; most return undefined on success.

Core assertion functions and precise signatures
- assert(value[, message])
  - Signature: assert(value: unknown, message?: string | Error): void
  - Behavior: Throws AssertionError if value is falsy (legacy alias for ok)
- assert.ok(value[, message])
  - Signature: ok(value: unknown, message?: string | Error): void
  - Behavior: Throws if value is falsy
- assert.strictEqual(actual, expected[, message])
  - Signature: strictEqual(actual: any, expected: any, message?: string | Error): void
  - Behavior: Uses === for comparison
- assert.notStrictEqual(actual, expected[, message])
  - Signature: notStrictEqual(actual: any, expected: any, message?: string | Error): void
  - Behavior: Uses !==
- assert.deepStrictEqual(actual, expected[, message])
  - Signature: deepStrictEqual(actual: any, expected: any, message?: string | Error): void
  - Behavior: Performs recursive strict comparison on object graphs; distinguishes prototypes and non-enumerable properties per Node semantics
- assert.notDeepStrictEqual(actual, expected[, message])
  - Signature: notDeepStrictEqual(actual: any, expected: any, message?: string | Error): void

Error-throwing assertions and signatures
- assert.throws(block[, error][, message])
  - Signature: throws(block: () => any, error?: RegExp | Function | Error | { name?: string, message?: string } , message?: string | Error): Error
  - Behavior: Invokes block; expects it to throw. Returns the thrown error on success. If provided, the `error` parameter acts as a predicate (RegExp to match message, constructor to check instance, or object to match properties).
- assert.doesNotThrow(block[, message])
  - Signature: doesNotThrow(block: () => any, message?: string | Error): void
  - Behavior: Fails if block throws

Additional utilities
- assert.fail(message?) — signature: fail(message?: string | Error): never — always throws an AssertionError
- assert.rejects(asyncFnOrPromise, [error], [message]) — signature: rejects(asyncFnOrPromise: Promise | Function, error?: RegExp|Function|Error|object, message?: string): Promise<Error>
  - For asserting that a Promise rejects; returns the rejection reason on success

Exceptions and thrown error handling
- AssertionError fields: name, actual, expected, operator, message, stack
- When providing `error` to assert.throws/rejects, Node matches in this order: constructor check, RegExp test against message, property match for plain object

Practical patterns for tests
- Use strictEqual for primitive identity checks, deepStrictEqual for object structure checks
- Use assert.throws(() => fn(), { name: 'TypeError', message: 'invalid' }) to match properties of thrown errors
- For promises, prefer assert.rejects(Promise, expected) or Vitest/Jest-style expect(...).rejects when using test frameworks

Reference signatures (Type-like)
- declare function assert(value: unknown, message?: string | Error): void;
- declare namespace assert {
  function ok(value: unknown, message?: string | Error): void;
  function strictEqual(a: any, b: any, message?: string | Error): void;
  function deepStrictEqual(a: any, b: any, message?: string | Error): void;
  function throws(block: () => any, error?: any, message?: string | Error): Error;
  function rejects(blockOrPromise: Function | Promise<any>, error?: any, message?: string | Error): Promise<Error>;
  function fail(message?: string | Error): never;
}

Digest and crawl metadata
- Source section: https://nodejs.org/api/assert.html
- Retrieved: 2026-03-21
- Bytes downloaded during crawl: 463665 bytes

Attribution
- Source: Node.js API — assert (https://nodejs.org/api/assert.html). Retrieved 2026-03-21; crawl size 463665 bytes.
