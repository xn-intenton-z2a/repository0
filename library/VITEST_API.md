# VITEST_API

## Table of Contents

1. Test Function Definitions and Configuration
2. Test Execution Control Methods
3. Test Organization and Grouping
4. Parameterized Testing Capabilities
5. Benchmark Testing Features

## Normalised Extract

### Test Function Definitions and Configuration

The test function (alias: it) defines a set of related expectations. It receives a test name and a function containing the expectations to test.

Basic test definition:
```
test('test name', () => {
  expect(value).toBe(expected);
});
```

Test options can be specified as an object parameter or by chaining properties:
```
test('name', { timeout: 10000, retry: 3, repeats: 2 }, () => {});
test.skip.concurrent('name', () => {});
```

TestOptions interface:
- timeout: Maximum execution time in milliseconds
- retry: Number of retry attempts on failure (default: 0)  
- repeats: Number of repetitions even if test fails (default: 0)

### Test Execution Control Methods

test.skip: Skips test execution without deleting code. Can be called statically or dynamically on test context.

test.skipIf(condition): Conditionally skips tests based on runtime condition evaluation.

test.runIf(condition): Opposite of skipIf, runs tests only when condition is truthy.

test.only: Runs only marked tests in the suite, useful for debugging specific test cases.

test.todo: Stubs tests for future implementation, shows entries in test reports.

test.fails: Indicates that test assertions are expected to fail explicitly.

### Test Organization and Grouping

test.concurrent: Marks consecutive tests to run in parallel. Concurrent tests must use expect from test context for proper test isolation.

test.sequential: Forces sequential execution within concurrent describe blocks or with --sequence.concurrent option.

Concurrent execution requires careful handling of shared state and snapshots to ensure test isolation and correct assertion attribution.

### Parameterized Testing Capabilities

test.each(cases): Executes same test with different input parameters. Supports array format and template literal format.

Array format:
```
test.each([
  [1, 1, 2],
  [1, 2, 3],
  [2, 1, 3],
])('add(%i, %i) -> %i', (a, b, expected) => {
  expect(a + b).toBe(expected);
});
```

Template literal format:
```
test.each`
  a    | b    | expected
  ${1} | ${1} | ${2}
  ${1} | ${2} | ${3}
`('add($a, $b) -> $expected', ({a, b, expected}) => {
  expect(a + b).toBe(expected);
});
```

test.for(cases): Alternative to test.each with TestContext integration. Differs in array handling - test.for doesn't spread arrays automatically.

### Benchmark Testing Features

bench function defines performance benchmarks using tinybench library. Runs function multiple times to measure performance characteristics.

Basic benchmark:
```
bench('sorting algorithm', () => {
  const arr = [1, 5, 4, 2, 3];
  arr.sort((a, b) => a - b);
}, { time: 1000 });
```

Benchmark options:
- time: Execution time in milliseconds (default: 500)
- iterations: Minimum iterations (default: 10)  
- warmupTime: Warmup period in milliseconds (default: 100)
- warmupIterations: Warmup iteration count (default: 5)
- setup: Setup function before each cycle
- teardown: Cleanup function after each cycle

## Supplementary Details

Test functions can return promises for async operations. The test runner waits for promise resolution to collect async expectations. Rejected promises cause test failures.

The test.extend method creates custom fixtures for test context extension. Fixtures support async operations and cleanup procedures for resource management.

Vitest provides Jest compatibility while adding modern features like native ESM support, TypeScript integration, and improved performance characteristics.

## Reference Details

### Test Function Signatures

```typescript
type Awaitable<T> = T | PromiseLike<T>
type TestFunction = () => Awaitable<void>

interface TestOptions {
  timeout?: number
  retry?: number  
  repeats?: number
}

test(name: string, fn: TestFunction): void
test(name: string, options: TestOptions, fn: TestFunction): void
test(name: string, fn: TestFunction, timeout: number): void
```

### Parameterized Test Printf Formatting

Template string substitutions:
- %s: string
- %d: number
- %i: integer  
- %f: floating point
- %j: JSON
- %o: object
- %#: 0-based test case index
- %$: 1-based test case index
- %%: literal percent sign

Object property access:
- $propertyName: Object property values
- $0, $1, $2: Array element access
- $a.val: Nested property access

### Benchmark Result Structure

```typescript
interface TaskResult {
  totalTime: number     // Total execution time
  min: number          // Minimum execution time
  max: number          // Maximum execution time  
  hz: number           // Operations per second
  period: number       // Period per operation
  samples: number[]    // Individual sample times
  variance: number     // Sample variance
  sd: number          // Standard deviation
  sem: number         // Standard error of mean
  df: number          // Degrees of freedom
  critical: number    // Critical value
  moe: number         // Margin of error
  rme: number         // Relative margin of error
  p75: number         // 75th percentile
  p99: number         // 99th percentile
  p995: number        // 99.5th percentile
  p999: number        // 99.9th percentile
}
```

### Concurrent Testing Requirements

When using test.concurrent, snapshots and assertions must use expect from local TestContext:
```
test.concurrent('test name', async ({ expect }) => {
  expect(value).toMatchSnapshot();
});
```

This ensures proper test attribution and prevents cross-test interference in parallel execution scenarios.

### Configuration Integration

Tests integrate with Vitest configuration for:
- Global timeout settings (testTimeout)
- Retry policies and failure handling
- Coverage collection and reporting
- Environment setup and teardown
- Custom matchers and assertion libraries

## Detailed Digest

Comprehensive API documentation extracted from Vitest testing framework covering test definition, execution control, parameterization, and benchmarking capabilities. Retrieved 2026-03-10.

Content provides complete reference for implementing JavaScript/TypeScript test suites with modern testing patterns including concurrent execution, parameterized tests, and performance benchmarking.

## Attribution Information

Source: https://vitest.dev/api/
Data size: 15000 characters extracted
Retrieved: 2026-03-10