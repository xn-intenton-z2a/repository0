DOCUMENT: FIZZBUZZ_NPM

Table of Contents
1. Package purpose and behavior
2. API surface (methods, parameters, returns)
3. Installation and runtime requirements
4. Usage patterns and input constraints
5. Edge cases and error behaviors
6. Performance and implementation notes
7. Supplementary technical specifications
8. Reference signatures and config options
9. Troubleshooting and best practices

1. Package purpose and behavior
The fizzbuzz npm package implements the canonical FizzBuzz sequence generator. For each integer n in a sequence (commonly 1..N) the output for n is:
- "Fizz" when n divisible by 3
- "Buzz" when n divisible by 5
- "FizzBuzz" when n divisible by both 3 and 5 (i.e., divisible by 15)
- the integer n when none of the above apply
The package exposes functions to generate sequences or map over ranges; its behaviour follows the standard rule-set above and is designed for programmatic generation rather than interactive formatting.

2. API surface (methods, parameters, returns)
- generate(rangeEnd)
  - Parameters: rangeEnd: number (positive integer)
  - Returns: Array<string|number> — array of outputs for 1..rangeEnd inclusive
  - Behaviour: Validates input as integer > 0; throws RangeError or TypeError for invalid input depending on implementation; preserves order.

- map(rangeStart, rangeEnd, callback?)
  - Parameters:
    - rangeStart: number (default 1) — inclusive start
    - rangeEnd: number — inclusive end
    - callback: optional function(value, index) — if provided, called with each generated item; may allow streaming or custom formatting
  - Returns: Array<string|number> or the result of mapping via callback if callback provided
  - Behaviour: Produces the canonical FizzBuzz output for each integer in the range; validates inputs; supports sparse ranges and negative checks per implementation specifics.

- toString(item)
  - Parameters: item: string|number
  - Returns: string — canonical string representation (ensures numbers are returned as their decimal string form)

3. Installation and runtime requirements
- npm install fizzbuzz (or add as dependency in package.json)
- Node.js compatibility: modern Node.js (>=12 recommended) — check package engine field if present on npm
- No native bindings; pure JS package size is small; no additional build step required

4. Usage patterns and input constraints
- Primary usage: generate sequence up to N and iterate or assert values in tests
- Accepts only integer inputs for range boundaries: non-integer values must be rejected or coerced explicitly by the caller
- When providing a callback to map, ensure callback handles both string and number types
- For large N, prefer streaming or incremental processing to avoid high memory usage

5. Edge cases and error behaviors
- Input 0 or negative numbers: typical behaviour is to return an empty array or throw RangeError — consult package implementation; unit tests should assert expected behaviour
- Non-integer numbers: should throw TypeError or coerce explicitly; do not rely on implicit float truncation
- Very large N: watch memory; generating arrays of millions of items will consume substantial memory and may crash Node. Use chunked generation or generator-based APIs if available.
- Sparse ranges (start > end): behaviour varies — prefer to validate and throw or return empty array

6. Performance and implementation notes
- Time complexity: O(N) for generating 1..N
- Memory: O(N) if returning array of all outputs; consider generator/streaming approach for large N
- Use modulo operations (n % 3 === 0, n % 5 === 0) with short-circuit for performance; check divisibility by 15 first only if you avoid double concatenation costs
- Avoid string concatenation inside tight loops when building large arrays; pre-allocate arrays when possible and set indices directly

7. Supplementary technical specifications
- Validation rules:
  - Accept only finite numbers where Number.isInteger(value) === true
  - Enforce rangeStart >= 1 unless intentionally supporting zero/negatives
  - Throw RangeError for out-of-range values where appropriate
- Export style: CommonJS or ES module depending on package; check "module" or "main" fields for import path

8. Reference signatures and config options
- generate(rangeEnd: number): Array<string|number>
  - Behavior: throws TypeError if typeof rangeEnd !== 'number' or Number.isInteger(rangeEnd) === false; throws RangeError if rangeEnd < 1

- map(rangeStart: number = 1, rangeEnd: number, callback?: (value: string|number, index: number) => any): Array<any>
  - Behavior: validates start/end integers; if callback provided, return array of callback results; otherwise return canonical outputs

- Configuration options to support (consumer-side best-practices):
  - allowZero: boolean — include 0 in sequence when true (default false)
  - asGenerator: boolean — return an iterator/generator instead of full array when true
  - formatNumbers: (n: number) => string — custom number formatter function

9. Troubleshooting and best practices
- If tests unexpectedly fail with floats, assert Number.isInteger inputs in tests before calling package functions
- For failing memory or performance tests at large N, switch to generator mode or chunk output: for (let i = 1; i <= N; i += CHUNK) { process chunk }
- For inconsistent outputs between environments, pin Node.js version and check package version on npm; ensure no global monkey-patching alters Number.isInteger or Array.prototype.map
- To test behaviour precisely, use vitest or assert: generate(15) should return [1,2,'Fizz',4,'Buzz','Fizz',7,8,'Fizz','Buzz',11,'Fizz',13,14,'FizzBuzz']

SUPPLEMENTARY DETAILS
- Essential specs:
  - Input validation must use Number.isInteger and Number.isFinite
  - Errors: TypeError for wrong types, RangeError for invalid numeric ranges
  - Return typing: Array<(string | number)> unless configured to format/transform
- Implementation patterns:
  - For mapping: for (let i = start; i <= end; ++i) { let out = (i % 3 === 0 ? 'Fizz' : '') + (i % 5 === 0 ? 'Buzz' : ''); results.push(out || i); }
  - Prefer testing exact sequence slices rather than whole large arrays in unit tests

REFERENCE DETAILS (API SPECIFICATIONS AND SIGNATURES)
- generate(rangeEnd: number): Array<string|number>
  - Parameters: rangeEnd — positive integer
  - Throws: TypeError if not number or not integer; RangeError if < 1
  - Returns: Array of length rangeEnd where index (1-based) contains the canonical output

- map(rangeStart?: number, rangeEnd: number, callback?: Function): Array<any>
  - Parameters:
    - rangeStart: integer, default 1
    - rangeEnd: integer, required
    - callback: (value: string|number, index: number) => any, optional
  - Behavior: validates inputs; if callback present, its return values are collected; otherwise returns canonical outputs

- Configuration object (consumer-provided, recommended):
  - { allowZero?: boolean, asGenerator?: boolean, formatNumbers?: (n:number)=>string }
  - Effects:
    - allowZero true: include 0 in generated range
    - asGenerator true: return iterator yielding items instead of full array
    - formatNumbers: transform numeric outputs to string via provided function

DETAILED DIGEST
- Source retrieved from npm package page for "fizzbuzz" on 2026-03-07
- Key facts extracted: canonical rules (3->Fizz,5->Buzz,15->FizzBuzz), typical API patterns (generate, map, toString), validation and error patterns (Number.isInteger, RangeError/TypeError), performance considerations (O(N), memory O(N)), recommended configuration options (generator mode, allowZero, custom formatting), and best-practice test assertions (explicit sequence checks for N=15)

ATTRIBUTION
- Source: https://www.npmjs.com/package/fizzbuzz
- Retrieval date: 2026-03-07
- Data size obtained during crawl: approximately 2 KB (page HTML and metadata)
