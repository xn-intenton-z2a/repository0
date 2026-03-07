DOCUMENT: NODE_ASSERT

Table of Contents
1. Purpose and usage overview
2. Core functions and signatures
3. Assertion error class and properties
4. Deep equality algorithms and options
5. Throwing and message customization
6. Execution patterns and best practices
7. Edge cases and exceptions (RangeError, TypeError boundaries)
8. Supplementary details (compatibility, Node versions)
9. Reference details (exact method signatures, parameters, return types)
10. Digest and retrieval metadata
11. Attribution and data size

1. Purpose and usage overview
The Node.js assert module provides a collection of assertion functions useful for tests and internal invariants. Assertions throw AssertionError on failure. Functions are synchronous and intended for runtime validation during testing and debugging.

2. Core functions and signatures
assert(value[, message])
- Throws an AssertionError if value is not truthy.
- Parameters: value: any, message?: string | Error
- Return: undefined

assert.strictEqual(actual, expected[, message])
- Tests strict equality using ===.
- Parameters: actual: any, expected: any, message?: string | Error
- Return: undefined

assert.notStrictEqual(actual, expected[, message])
- Throws if actual === expected.

assert.deepEqual(actual, expected[, message])
- Uses loose deep equality (deprecated in favor of assert.deepStrictEqual in modern usage).

assert.deepStrictEqual(actual, expected[, message])
- Uses strict deep equality (handles object prototypes, typed arrays, primitives strictly).

assert.throws(fn[, error][, message])
- Expects fn to throw. The second parameter can be a constructor, RegExp, or validation function to match the thrown error.
- Parameters: fn: Function, error?: ErrorConstructor | RegExp | ((err) => boolean), message?: string | Error

assert.doesNotThrow(fn[, message])
- Expects fn not to throw; throws AssertionError if it does.

assert.rejects(asyncFnOrPromise[, error][, message])
- Returns a Promise that resolves if the provided async function or promise rejects with a matching error. Accepts same error matcher forms as throws.

assert.doesNotReject(asyncFnOrPromise[, message])
- Returns a Promise that resolves if the promise resolves; rejects if the promise rejects.

assert.fail(message)
- Throws an AssertionError unconditionally with the given message.

assert.ifError(value)
- Throws value if it is truthy (commonly used to assert no error was returned in callbacks).

3. AssertionError class and properties
- Constructor: new assert.AssertionError(options)
- Options: { message?: string, actual?: any, expected?: any, operator?: string, stackStartFn?: Function }
- Properties on instance: name = 'AssertionError', message, actual, expected, operator, stack
- Instances are Error objects and behave accordingly when thrown.

4. Deep equality algorithms and options
- deepStrictEqual compares primitive types with ===, checks object prototypes, Map/Set entries, typed arrays and Buffers with strict element equality.
- Differences between deepEqual and deepStrictEqual: deepEqual performs coercive comparisons for some types and does not check prototypes strictly; deepStrictEqual is the recommended, robust choice for tests.

5. Throwing and message customization
- Pass message string or Error instance as last param to many assertion functions to customize failure messages.
- For assert.throws and assert.rejects, the second param controls validation:
  - Error constructor: assert.throws(fn, TypeError) matches thrown error instanceof TypeError
  - RegExp: assert.throws(fn, /message/) tests error.message against RegExp
  - Predicate function: (err) => boolean for complex matching; returning true means match
- Use stackStartFn in AssertionError options to control stack trace start point for clearer error stacks.

6. Execution patterns and best practices
- Prefer assert.strictEqual and assert.deepStrictEqual for deterministic checks.
- Use assert.rejects/assert.doesNotReject for Promise-based APIs instead of manual try/catch.
- Use assert.ifError(error) in Node-style callbacks to fail fast when an error is present.
- When matching thrown errors in tests, prefer constructor or predicate over message string comparisons to avoid brittle tests.

7. Edge cases and exceptions (RangeError, TypeError boundaries)
- Assertion functions throw AssertionError; the inner error thrown by user code (e.g., TypeError) will be propagated when using assert.throws unless matched by the matcher.
- When asserting floating-point numbers, use custom numeric comparison rather than strict equality to handle precision issues.

8. Supplementary details (compatibility, Node versions)
- assert API described is stable across Node.js LTS versions; assert.rejects/doesNotReject require Promise support (Node 8+ realistically; modern Node >=12 recommended).
- deepStrictEqual behavior improved in recent Node versions to better handle typed arrays and BigInt; verify Node version if relying on edge behavior.

9. Reference details (exact method signatures, parameters, return types)
- assert(value[, message]): void
- assert.fail([message]): never (throws AssertionError)
- assert.strictEqual(actual, expected[, message]): void
- assert.notStrictEqual(actual, expected[, message]): void
- assert.deepEqual(actual, expected[, message]): void
- assert.deepStrictEqual(actual, expected[, message]): void
- assert.throws(fn, [error], [message]): void
  - error: ErrorConstructor | RegExp | (err) => boolean
- assert.doesNotThrow(fn, [message]): void
- assert.rejects(asyncFnOrPromise, [error], [message]): Promise<void>
  - asyncFnOrPromise: Promise | (() => Promise)
  - error: ErrorConstructor | RegExp | (err) => boolean
- assert.doesNotReject(asyncFnOrPromise, [message]): Promise<void>
- assert.ifError(value): void (throws value if truthy)
- new assert.AssertionError({message, actual, expected, operator, stackStartFn}): AssertionError

10. Digest and retrieval metadata
- Source: Node.js assert documentation (nodejs.org/api/assert.html)
- Retrieved: 2026-03-07T02:27:49.506Z
- Data size obtained during crawl: approximately 6 KB of relevant API content

11. Attribution and data size
- Attribution: Node.js Documentation - assert module (nodejs.org)
- Crawl date: 2026-03-07
- Approximate bytes stored from source: 6 KB
