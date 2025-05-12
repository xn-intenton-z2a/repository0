# VITEST_API

## Crawl Summary
Definitions: Awaitable<T>, TestFunction, TestOptions
test(), test.skip/.only/.concurrent/.sequential/.todo/.fails/.each/.for
bench(), bench.skip/.only/.todo
Hooks: beforeEach/afterEach/beforeAll/afterAll/onTestFinished/onTestFailed

## Normalised Extract
Contents:
1. Type Aliases & Interfaces
   a. Awaitable<T>: T | PromiseLike<T>
   b. TestFunction: () => Awaitable<void>
   c. TestOptions: {timeout?: number, retry?: number (default 0), repeats?: number (default 0)}
2. Test Functions
   a. test(name: string, fn: TestFunction, timeout?: number)
      - Default timeout 5000ms, positional timeout disallowed with options.
   b. test(name: string, options: TestOptions, fn: TestFunction)
   c. Modifiers: skip, only, concurrent, sequential, todo, fails
   d. Data-driven: test.each(cases)(namePattern: string, fn: (...args) => void), test.for(cases)(namePattern, fn)
3. Benchmarks
   a. bench(name: string, fn: BenchFunction, options?: BenchOptions)
   b. BenchOptions: time (ms, default 500), iterations (default 10), warmupTime (ms, default 100), warmupIterations (default 5), now(), signal, throws, setup(), teardown()
4. Suite Organization
   a. describe(name: string, fn: () => void)
   b. Modifiers: skip, skipIf(cond), runIf(cond), only, concurrent, sequential, shuffle, todo
   c. Data-driven: describe.each/for
5. Hooks
   a. beforeEach(fn, timeout?), afterEach(fn, timeout?), beforeAll(fn, timeout?), afterAll(fn, timeout?)
6. Test Context Hooks
   a. onTestFinished(callback)
   b. onTestFailed(callback)

Detailed:
1.a. Awaitable: generic union.
1.b. TestFunction signature.
1.c. TestOptions fields with defaults.
2.a. test(): signature; constraints; example.
2.b. test() with options: exact ordering.
2.c. Modifiers chainable: skip, only, concurrent, sequential, todo, fails.
2.d. test.each: printf patterns: %s, %d, %i, %f, %j, %o, %#, %$, %%; $foo inject. For arrays, spreads. test.for: no spread of array.
3.a. bench(): signature. Tinybench under the hood.
3.b. BenchOptions exact field names and defaults.
4.a. describe(): grouping; implicit suite.
4.b. Suite modifiers with alias: suite.skip, suite.skipIf, suite.runIf, suite.only, suite.concurrent, suite.sequential, suite.shuffle, suite.todo.
4.c. describe.each/for: similar to test.
5.a. Lifecycle hooks signatures with optional timeouts.
6.a/b. onTestFinished/Failed: signatures, usage patterns.


## Supplementary Details
Parameter Defaults and Effects:
- test timeout default: 5000ms; set via --testTimeout or config.sequence.timeout
- retry default 0; repeats default 0; unlimited only via object.
- bench time default: 500ms; iterations 10; warmupTime 100ms; warmupIterations 5.
- describe.shuffle order randomized by config.sequence.seed or flag --sequence.shuffle.
- Hooks optional cleanup return functions: beforeEach/beforeAll can return cleanup to be invoked after scope.
Implementation Steps:
1. Install Vitest: npm install -D vitest
2. Add script: "test": "vitest"
3. Create test files: *.test.ts or *.spec.ts
4. Import APIs: import { test, expect, describe, bench, beforeEach,... } from 'vitest'
5. Configure vitest.config.ts for global options:
   export default {
     test: { timeout: 10000, globalSetup: '', sequence: { concurrent: true, shuffle: true } },
     bench: { time: 2000 }
   }
6. Run tests: npx vitest
7. For CI, use --run flag.


## Reference Details
// Full API Signatures

// Type Aliases
export type Awaitable<T> = T | PromiseLike<T>
export type TestFunction = () => Awaitable<void>

export interface TestOptions {
  timeout?: number
  retry?: number
  repeats?: number
}

// Test API
export function test(name: string, fn: TestFunction, timeout?: number): void
export function test(name: string, options: TestOptions, fn: TestFunction): void
export namespace test {
  function skip(name: string, fn: TestFunction): void
  function only(name: string, fn: TestFunction): void
  function concurrent(name: string, fn: TestFunction, timeout?: number): void
  function sequential(name: string, fn: TestFunction): void
  function todo(name: string): void
  function fails(name: string, fn: TestFunction): void
  function each<T extends any[]>(cases: readonly T[]): (name: string, fn: (...args: T) => void) => void
  function for<T extends any[]>(cases: readonly T[]): (name: string, fn: (args: T) => void) => void
  function skipIf(cond: boolean): (name: string, fn: TestFunction) => void
  function runIf(cond: boolean): (name: string, fn: TestFunction) => void
}

// Suite API
export function describe(name: string, fn: () => void): void
export namespace describe {
  function skip(name: string, fn: () => void): void
  function skipIf(cond: boolean): (name: string, fn: () => void) => void
  function runIf(cond: boolean): (name: string, fn: () => void) => void
  function only(name: string, fn: () => void): void
  function concurrent(name: string, fn: () => void): void
  function sequential(name: string, fn: () => void): void
  function shuffle(name: string, options: { shuffle: boolean } , fn: () => void): void
  function todo(name: string): void
  function each<T extends any[]>(cases: readonly T[]): (name: string, fn: (...args: T) => void) => void
  function for<T extends any[]>(cases: readonly T[]): (name: string, fn: (args: T) => void) => void
}

// Hooks
export function beforeEach(fn: () => Awaitable<void>, timeout?: number): void
export function afterEach(fn: () => Awaitable<void>, timeout?: number): void
export function beforeAll(fn: () => Awaitable<void>, timeout?: number): void
export function afterAll(fn: () => Awaitable<void>, timeout?: number): void

// Test Context Hooks
export function onTestFinished(callback: () => void): void
export function onTestFailed(callback: (ctx: { task: TaskResult }) => void): void

// Bench API
export type BenchFunction = () => Awaitable<void>
export interface BenchOptions {
  time?: number
  iterations?: number
  now?: () => number
  signal?: AbortSignal
  throws?: boolean
  warmupTime?: number
  warmupIterations?: number
  setup?: () => Awaitable<void>
  teardown?: () => Awaitable<void>
}
export function bench(name: string, fn: BenchFunction, options?: BenchOptions): void
export namespace bench {
  function skip(name: string, fn: BenchFunction, options?: BenchOptions): void
  function only(name: string, fn: BenchFunction, options?: BenchOptions): void
  function todo(name: string): void
}

// TaskResult
export interface TaskResult {
  error?: unknown
  totalTime: number
  min: number
  max: number
  hz: number
  period: number
  samples: number[]
  mean: number
  variance: number
  sd: number
  sem: number
  df: number
  critical: number
  moe: number
  rme: number
  mad: number
  p50: number
  p75: number
  p99: number
  p995: number
  p999: number
}

// Code Examples

// test with fixture
import { test, expect } from 'vitest'

test.extend({
  db: async ({}, use) => {
    const conn = await connectDb()
    await use(conn)
    await conn.close()
  }
})('db test', async ({ db }) => {
  const rows = await db.query('SELECT * FROM users')
  expect(rows).toEqual([])
})

// CI invocation
$ npx vitest --run --reporter=dot

// Troubleshooting

// Increase default timeout if tests hang
export default { test: { timeout: 20000 }} in vitest.config.ts

// Debug concurrent leaks
$ npx vitest --run --detect-leaks

// Show coverage
$ npx vitest --coverage


## Information Dense Extract
Awaitable<T>=T|PromiseLike<T>;TestFunction=()=>Awaitable<void>;TestOptions{timeout?:number;retry?:number=0;repeats?:number=0};test(name,fn[,timeout]);test(name,opts,fn); modifiers: skip,only,concurrent[,timeout],sequential,todo,fails;data-driven: test.each(cases)(namePattern,fn(args));test.for(cases)(namePattern,fn([args]));bench(name,fn,opts{time?:number=500;iterations?:10;warmupTime?:100;warmupIterations?:5;now?;signal?;throws?;setup?;teardown?});suite: describe(name,fn); suite.skip/skipIf(cond)/runIf(cond)/only/concurrent/sequential/shuffle({shuffle:true|false})/todo; suite.each/for;hooks: beforeEach/afterEach/beforeAll/afterAll(fn[,timeout]);test ctx hooks: onTestFinished(cb);onTestFailed(cb);TaskResult{error?,totalTime,min,max,hz,period,samples[],mean,variance,sd,sem,df,critical,moe,rme,mad,p50,p75,p99,p995,p999}

## Sanitised Extract
Contents:
1. Type Aliases & Interfaces
   a. Awaitable<T>: T | PromiseLike<T>
   b. TestFunction: () => Awaitable<void>
   c. TestOptions: {timeout?: number, retry?: number (default 0), repeats?: number (default 0)}
2. Test Functions
   a. test(name: string, fn: TestFunction, timeout?: number)
      - Default timeout 5000ms, positional timeout disallowed with options.
   b. test(name: string, options: TestOptions, fn: TestFunction)
   c. Modifiers: skip, only, concurrent, sequential, todo, fails
   d. Data-driven: test.each(cases)(namePattern: string, fn: (...args) => void), test.for(cases)(namePattern, fn)
3. Benchmarks
   a. bench(name: string, fn: BenchFunction, options?: BenchOptions)
   b. BenchOptions: time (ms, default 500), iterations (default 10), warmupTime (ms, default 100), warmupIterations (default 5), now(), signal, throws, setup(), teardown()
4. Suite Organization
   a. describe(name: string, fn: () => void)
   b. Modifiers: skip, skipIf(cond), runIf(cond), only, concurrent, sequential, shuffle, todo
   c. Data-driven: describe.each/for
5. Hooks
   a. beforeEach(fn, timeout?), afterEach(fn, timeout?), beforeAll(fn, timeout?), afterAll(fn, timeout?)
6. Test Context Hooks
   a. onTestFinished(callback)
   b. onTestFailed(callback)

Detailed:
1.a. Awaitable: generic union.
1.b. TestFunction signature.
1.c. TestOptions fields with defaults.
2.a. test(): signature; constraints; example.
2.b. test() with options: exact ordering.
2.c. Modifiers chainable: skip, only, concurrent, sequential, todo, fails.
2.d. test.each: printf patterns: %s, %d, %i, %f, %j, %o, %#, %$, %%; $foo inject. For arrays, spreads. test.for: no spread of array.
3.a. bench(): signature. Tinybench under the hood.
3.b. BenchOptions exact field names and defaults.
4.a. describe(): grouping; implicit suite.
4.b. Suite modifiers with alias: suite.skip, suite.skipIf, suite.runIf, suite.only, suite.concurrent, suite.sequential, suite.shuffle, suite.todo.
4.c. describe.each/for: similar to test.
5.a. Lifecycle hooks signatures with optional timeouts.
6.a/b. onTestFinished/Failed: signatures, usage patterns.

## Original Source
vitest Testing Framework
https://vitest.dev/api/

## Digest of VITEST_API

# Vitest API Reference (retrieved 2023-08-01)

## Type Definitions

### Awaitable

```ts
// Accepts a value or a promise-like value
type Awaitable<T> = T | PromiseLike<T>
```

### TestFunction

```ts
// A function that returns void or a promise-like void
type TestFunction = () => Awaitable<void>
```

### TestOptions

```ts
interface TestOptions {
  /** maximum execution time in ms before failing */
  timeout?: number
  /** number of retries on failure; default: 0 */
  retry?: number
  /** number of repeats regardless of pass/fail; default: 0 */
  repeats?: number
}
```

## Test API Methods

### test(name: string, fn: TestFunction, timeout?: number): void

```ts
import { test } from 'vitest'

// default timeout: 5000ms
// 'timeout' as 3rd positional arg is disallowed when options object is provided
test('basic test', () => {
  // ... assertions
}, 5000)
```

### test(name: string, options: TestOptions, fn: TestFunction): void

```ts
// with options
test('heavy test', { timeout: 10000, retry: 2, repeats: 1 }, async () => {
  // async logic
})
```

### test.skip(name: string, fn: TestFunction): void
### test.only(name: string, fn: TestFunction): void
### test.concurrent(name: string, fn: AsyncTestFunction, timeout?: number): void
### test.sequential(name: string, fn: AsyncTestFunction): void
### test.todo(name: string): void
### test.fails(name: string, fn: TestFunction): void
### test.each(cases)(name: string, fn: (...args: any[]) => void): void
### test.for(cases)(name: string, fn: (args: any[]) => void): void

## Benchmark API

### bench(name: string, fn: BenchFunction, options?: BenchOptions): void

```ts
import { bench } from 'vitest'

bench('sort time', () => {
  [1,5,3,2].sort()
}, { time: 1000, iterations: 20, warmupTime: 100, warmupIterations:5 })
```

### BenchOptions

```ts
interface BenchOptions {
  time?: number    // ms, default 500
  iterations?: number // default 10
  now?: () => number
  signal?: AbortSignal
  throws?: boolean
  warmupTime?: number // default 100
  warmupIterations?: number // default 5
  setup?: () => Awaitable<void>
  teardown?: () => Awaitable<void>
}
```

## Test & Suite Hooks

```ts
beforeEach(fn: () => Awaitable<void>, timeout?: number)
afterEach(fn: () => Awaitable<void>, timeout?: number)
beforeAll(fn: () => Awaitable<void>, timeout?: number)
afterAll(fn: () => Awaitable<void>, timeout?: number)
```

### onTestFinished(callback: () => void)
Called after each test (post-afterEach), reverse order

### onTestFailed(callback: ({ task }) => void)
Called after failed test (post-afterEach)


## Attribution
- Source: vitest Testing Framework
- URL: https://vitest.dev/api/
- License: License: MIT
- Crawl Date: 2025-05-12T12:31:49.356Z
- Data Size: 41201758 bytes
- Links Found: 26607

## Retrieved
2025-05-12
