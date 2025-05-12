# VITEST_API

## Crawl Summary
Awaitable<T> = T | PromiseLike<T>; TestFunction = () => Awaitable<void>. TestOptions: timeout? number; retry? number default 0; repeats? number default 0. test(name: string, fn: TestFunction, timeoutMs?: number) and overload test(name: string, options: TestOptions, fn: TestFunction). Variants: test.skip, test.only, test.concurrent(name, fn, timeoutMs?), test.todo(name), test.fails(name, fn). Table-driven: test.each(cases)(title, fn), test.for(cases)(title, fn). Suite: describe(name, fn) plus .skip, .only, .concurrent, .todo, .each, .for. Bench: bench(name|Function, fn, options?), bench.skip, bench.only, bench.todo. BenchOptions defaults: time=500ms, iterations=10, warmupTime=100ms, warmupIterations=5. Hooks: beforeEach/afterEach/beforeAll/afterAll(fn, timeoutMs?), onTestFinished(callback), onTestFailed(callback).

## Normalised Extract
Table of Contents:
1. Type Definitions
2. TestOptions
3. Test API Methods
4. Suite API Methods
5. Benchmark API Methods
6. Lifecycle Hooks

1. Type Definitions
Awaitable<T> = T | PromiseLike<T>
TestFunction: () => Awaitable<void>

2. TestOptions
- timeout: number (milliseconds)
- retry: number (default 0)
- repeats: number (default 0)

3. Test API Methods
3.1 test(name: string, fn: TestFunction, timeoutMs?: number): void
3.2 test(name: string, options: TestOptions, fn: TestFunction): void
3.3 test.skip(name: string, fn: TestFunction): void
3.4 test.only(name: string, fn: TestFunction): void
3.5 test.concurrent(name: string, fn: TestFunction, timeoutMs?: number): void
3.6 test.todo(name: string): void
3.7 test.fails(name: string, fn: () => Promise<void>): void
3.8 test.each<T>(cases: T[] | TemplateStringsArray)(title: string, fn: (ctx: T) => void): void
3.9 test.for<T>(cases: T[])(title: string, fn: (ctx: T) => void): void

4. Suite API Methods
4.1 describe(name: string, fn: () => void): void
4.2 describe.skip(name: string, fn: () => void): void
4.3 describe.only(name: string, fn: () => void): void
4.4 describe.concurrent(name: string, fn: () => void): void
4.5 describe.todo(name: string): void
4.6 describe.each<T>(cases: T[] | TemplateStringsArray)(title: string, fn: (ctx: T) => void): void
4.7 describe.for<T>(cases: T[])(title: string, fn: (ctx: T) => void): void

5. Benchmark API Methods
5.1 bench(name: string|Function, fn: () => void, options?: BenchOptions): void
5.2 bench.skip(name: string|Function, fn: () => void, options?: BenchOptions): void
5.3 bench.only(name: string|Function, fn: () => void, options?: BenchOptions): void
5.4 bench.todo(name: string|Function): void

6. Lifecycle Hooks
6.1 beforeEach(fn: () => Awaitable<void>, timeoutMs?: number): void
6.2 afterEach(fn: () => Awaitable<void>, timeoutMs?: number): void
6.3 beforeAll(fn: () => Awaitable<void>, timeoutMs?: number): void
6.4 afterAll(fn: () => Awaitable<void>, timeoutMs?: number): void
6.5 onTestFinished(callback: () => void): void
6.6 onTestFailed(callback: (ctx: ExtendedContext) => void): void

## Supplementary Details
Global defaults and config parameters:
- Default test timeout: 5000ms. Override in vitest.config.js: export default { test: { timeout: number } }
- Global retries: none unless specified per testOptions.retry
- Concurrency options in config: export default { sequence: { concurrent: boolean, shuffle: boolean, seed: number } }
- Chai format: configure chaiConfig.truncateThreshold in config: export default { chai: { format: { truncateThreshold: number } } }
- BenchOptions defaults: time 500ms, iterations 10, warmupTime 100ms, warmupIterations 5

Implementation Steps:
1. Install Vitest: npm install --save-dev vitest
2. Add script: "test": "vitest"
3. Import APIs in test files: import { test, expect, beforeEach, bench, describe } from 'vitest'
4. Define tests and hooks as per normalizedExtract signatures
5. Configure global settings in vitest.config.js under export default { test: {...}, sequence: {...}, chai: {...} }


## Reference Details
Complete API Specifications and Examples:

// Type Definitions

interface Awaitable<T> {
  // T or PromiseLike<T>
}

type TestFunction = () => void | Promise<void>

// Test API
/**
 * Runs a test
 * @param name test name
 * @param fn test function
 * @param timeout optional timeout in ms
 */
function test(name: string, fn: TestFunction, timeout?: number): void

/**
 * @param name test name
 * @param options { skip?: boolean, only?: boolean, concurrent?: boolean, timeout?: number, retry?: number, repeats?: number }
 * @param fn test function
 */
function test(name: string, options: TestOptions, fn: TestFunction): void

// Examples:
test('addition', () => {
  expect(1 + 2).toBe(3)
})

test('timeout example', { timeout: 10000 }, async () => {
  await new Promise(r => setTimeout(r, 9000))
})

test.skip('skip sample', () => {})
test.only('only this test', () => {})
test.concurrent('parallel test', async () => {})
test.todo('to be implemented')
test.fails('should fail', async () => {
  await expect(Promise.reject()).rejects.toBeUndefined()
})

test.each([ [1,1,2], [2,3,5] ])('sum(%i,%i)=%i', (a,b,exp) => {
  expect(a+b).toBe(exp)
})

test.for([ [1,2,3] ])('forSum', ([a,b,exp]) => {
  expect(a+b).toBe(exp)
})

// Suite API

describe('suiteName', () => {
  test('inside suite', () => {})
})
describe.skip('skipped suite', () => {})
describe.only('exclusive suite', () => {})

describe.concurrent('parallel suite', () => {})
describe.todo('future suite')

describe.each([ {x:1,y:2} ])('with each', ({x,y}) => {
  test('calc', () => { expect(x+y).toBe(3) })
})

describe.for([ [1,2] ])('with for', ([x,y]) => {
  test('calc', () => { expect(x*y).toBe(2) })
})

// Benchmark API
import { bench } from 'vitest'
bench('sort benchmark', () => {
  [3,1,2].sort()
}, { time: 1000, iterations: 20, warmupTime: 200, warmupIterations: 10 })
bench.skip('skip bench', () => {})
bench.only('only bench', () => {})
bench.todo('bench to implement')

// Hooks
beforeEach(async () => {
  await setupDb()
})
afterEach(() => {
  clearMocks()
})
beforeAll(() => {
  startServer()
})
afterAll(async () => {
  await stopServer()
})

test('hooked test', ({ onTestFinished, onTestFailed }) => {
  const conn = connect()
  onTestFinished(() => conn.close())
  onTestFailed(() => console.error('failed', conn))
  conn.query('SELECT 1')
})

// Troubleshooting
// 1. Increase test timeout: run 'vitest run --timeout=10000' or set test.timeout in config
// 2. Debug async tests: return promise or use async/await, avoid done callback
// 3. Chai truncation: set chai.format.truncateThreshold in vitest.config.js
// 4. Concurrency issues: use test.concurrent with local expect(ctx)


## Information Dense Extract
Awaitable<T>; TestFunction returns Awaitable<void>. TestOptions(timeout?:ms,retry?:0,repeats?:0). test(name,fn,timeout?); overload with options. Variants: skip,only,concurrent(timeout?),todo,fails,each,for. describe(name,fn) + skip,only,concurrent,todo,each,for. bench(name|Function,fn,options?) + skip,only,todo. BenchOptions(time:500ms,iterations:10,warmupTime:100ms,warmupIterations:5,now?,signal?,throws?,setup?,teardown?). Hooks: beforeEach/afterEach/beforeAll/afterAll(fn,timeout?), onTestFinished(cb), onTestFailed(cb). Defaults: testTimeout=5000ms, sequence.concurrent/shuffle/seed, chaiConfig.truncateThreshold.

## Sanitised Extract
Table of Contents:
1. Type Definitions
2. TestOptions
3. Test API Methods
4. Suite API Methods
5. Benchmark API Methods
6. Lifecycle Hooks

1. Type Definitions
Awaitable<T> = T | PromiseLike<T>
TestFunction: () => Awaitable<void>

2. TestOptions
- timeout: number (milliseconds)
- retry: number (default 0)
- repeats: number (default 0)

3. Test API Methods
3.1 test(name: string, fn: TestFunction, timeoutMs?: number): void
3.2 test(name: string, options: TestOptions, fn: TestFunction): void
3.3 test.skip(name: string, fn: TestFunction): void
3.4 test.only(name: string, fn: TestFunction): void
3.5 test.concurrent(name: string, fn: TestFunction, timeoutMs?: number): void
3.6 test.todo(name: string): void
3.7 test.fails(name: string, fn: () => Promise<void>): void
3.8 test.each<T>(cases: T[] | TemplateStringsArray)(title: string, fn: (ctx: T) => void): void
3.9 test.for<T>(cases: T[])(title: string, fn: (ctx: T) => void): void

4. Suite API Methods
4.1 describe(name: string, fn: () => void): void
4.2 describe.skip(name: string, fn: () => void): void
4.3 describe.only(name: string, fn: () => void): void
4.4 describe.concurrent(name: string, fn: () => void): void
4.5 describe.todo(name: string): void
4.6 describe.each<T>(cases: T[] | TemplateStringsArray)(title: string, fn: (ctx: T) => void): void
4.7 describe.for<T>(cases: T[])(title: string, fn: (ctx: T) => void): void

5. Benchmark API Methods
5.1 bench(name: string|Function, fn: () => void, options?: BenchOptions): void
5.2 bench.skip(name: string|Function, fn: () => void, options?: BenchOptions): void
5.3 bench.only(name: string|Function, fn: () => void, options?: BenchOptions): void
5.4 bench.todo(name: string|Function): void

6. Lifecycle Hooks
6.1 beforeEach(fn: () => Awaitable<void>, timeoutMs?: number): void
6.2 afterEach(fn: () => Awaitable<void>, timeoutMs?: number): void
6.3 beforeAll(fn: () => Awaitable<void>, timeoutMs?: number): void
6.4 afterAll(fn: () => Awaitable<void>, timeoutMs?: number): void
6.5 onTestFinished(callback: () => void): void
6.6 onTestFailed(callback: (ctx: ExtendedContext) => void): void

## Original Source
vitest Testing Framework
https://vitest.dev/api/

## Digest of VITEST_API

# Vitest API Reference
Retrieved: 2024-06-15

# Types
```ts
type Awaitable<T> = T | PromiseLike<T>
type TestFunction = () => Awaitable<void>
```

# Interface TestOptions
```ts
interface TestOptions {
  /** Will fail the test if it takes too long */
  timeout?: number
  /** Number of retries on failure, default 0 */
  retry?: number
  /** Number of repeats per cycle, default 0 */
  repeats?: number
}
```

# Test API Methods
```ts
// Primary signatures
function test(name: string, fn: TestFunction, timeout?: number): void
overload function test(name: string, options: TestOptions, fn: TestFunction): void

// Control variants
function test.skip(name: string, fn: TestFunction): void
function test.only(name: string, fn: TestFunction): void
function test.concurrent(name: string, fn: TestFunction, timeout?: number): void
function test.todo(name: string): void
function test.fails(name: string, fn: () => Promise<void>): void

// Table-driven variants
function test.each<T>(cases: T[] | TemplateStringsArray)(title: string, fn: (ctx: T) => void): void
function test.for<T>(cases: T[])(title: string, fn: (ctx: T) => void): void
``` 

# Suite API Methods
```ts
function describe(name: string, fn: () => void): void
function describe.skip(name: string, fn: () => void): void
function describe.only(name: string, fn: () => void): void
function describe.concurrent(name: string, fn: () => void): void
function describe.todo(name: string): void
function describe.each<T>(cases: T[] | TemplateStringsArray)(title: string, fn: (ctx: T) => void): void
function describe.for<T>(cases: T[])(title: string, fn: (ctx: T) => void): void
``` 

# Benchmark API Methods
```ts
function bench(name: string|Function, fn: () => void, options?: BenchOptions): void
enum bench.skip(name: string|Function, fn: () => void, options?: BenchOptions): void
function bench.only(name: string|Function, fn: () => void, options?: BenchOptions): void
function bench.todo(name: string|Function): void
```

# Interface BenchOptions
```ts
interface BenchOptions {
  time?: number         // ms, default 500
  iterations?: number   // default 10
  now?: () => number
  signal?: AbortSignal
  throws?: boolean
  warmupTime?: number   // ms, default 100
  warmupIterations?: number // default 5
  setup?: Hook
  teardown?: Hook
}
```

# Lifecycle Hooks
```ts
function beforeEach(fn: () => Awaitable<void>, timeout?: number): void
function afterEach(fn: () => Awaitable<void>, timeout?: number): void
function beforeAll(fn: () => Awaitable<void>, timeout?: number): void
function afterAll(fn: () => Awaitable<void>, timeout?: number): void

// Test-scoped hooks
function onTestFinished(callback: () => void): void
function onTestFailed(callback: (ctx: ExtendedContext) => void): void
```

## Attribution
- Source: vitest Testing Framework
- URL: https://vitest.dev/api/
- License: License: MIT
- Crawl Date: 2025-05-12T06:31:04.531Z
- Data Size: 26870519 bytes
- Links Found: 21585

## Retrieved
2025-05-12
