NORMALISED EXTRACT

Table of Contents:
1. Array.from behavior and algorithm
2. ES module export forms and live bindings
3. Node.js module resolution, package.json "type" and exports
4. FizzBuzz rules, API, and npm package behavior

1. Array.from behavior and algorithm
- Signature: Array.from(source[, mapFn[, thisArg]])
- Source types: iterable (Symbol.iterator) or array-like (length + numeric indices).
- Steps: if source is null/undefined -> throw TypeError. If mapFn provided and not callable -> throw TypeError. If source is iterable: obtain iterator and repeatedly call next() until done, extract IteratorValue for each step. If not iterable: read length = ToLength(source.length) where ToLength clamps ToInteger(length) to [0, 2^53-1]; iterate i from 0 to length-1 and read source[i]. For each value: if mapFn provided call mapped = Call(mapFn, thisArg, [value, index]) else mapped = value. Assign to newArray[index] and at end set newArray.length and return it.
- Edge cases: strings iterate by code points (handles surrogate pairs); sparse array-like yields undefined for missing indices; non-callable mapFn -> TypeError; ToLength clamps very large lengths to 2^53-1.

2. ES module export forms and live bindings
- Named exports: export const A = ...; export function f() {} ; export { local as exported }.
- Default export: export default expression; import default using import d from 'm'.
- Aggregate exports: export * from 'module'; export { name as alias } from 'module'.
- Live binding semantics: exported identifiers are live views into module-local bindings; mutation of exported variables updates imported bindings in other modules.
- Circular dependency behavior: modules create exported bindings at instantiation; cycles may observe partially initialized bindings; prefer functions to delay usage until after initialization.
- Re-export patterns: export { x } from 'm' re-exports without creating a local binding; export * excludes default.

3. Node.js module resolution, package.json "type" and exports
- Resolution algorithm: resolve specifier to file via exact file match, extension lookup (.js, .json, .node), package.json "exports" and "main" fields, directory index files, and node_modules traversal up parent directories until filesystem root.
- package.json "type": when set to "module", .js files are parsed as ESM; otherwise .js parsed as CommonJS. Use .mjs for explicit ESM when type is not module.
- "exports" field pattern: exports: { ".": { "import": "./dist/index.mjs", "require": "./dist/index.cjs" } } allows conditional entry points per import type.
- CommonJS vs ESM interop: require(ESM) produces a synthetic default export wrapper; import CJS sees namespace with default mapping to module.exports. Transpilers emulate live bindings by defining getters on exports object.
- Loading phases: resolve -> load (format detection) -> instantiate (create bindings) -> evaluate (run code).

4. FizzBuzz rules, API, and npm package behavior
- Problem rules: For integer n starting at 1: if divisible by 15 -> "FizzBuzz"; else if divisible by 3 -> "Fizz"; else if divisible by 5 -> "Buzz"; else number as string.
- Implementation pattern (imperative): for i in range: output = ''; if i%3 === 0 output+='Fizz'; if i%5 ===0 output+='Buzz'; if output==='' output=String(i); push output.
- Signatures: single-value evaluator signature: fizzbuzzValue(n: number, rules?: Array<[number,string]>) -> string. Range generator: fizzbuzzRange(n: number, rules?) -> Iterable<string>. npm package common API: fizzbuzz(n: number) -> string[]; single evaluator alias fb(n) -> string.
- Complexity: O(n * r) where r is number of rules; typical implementations are O(n) with O(n) memory for full-range generator or O(1) extra for streaming generators.

SUPPLEMENTARY DETAILS

Technical specifications and implementation details:
- ToLength: ToInteger(length) then clamp between 0 and 2^53-1 (9007199254740991).
- Iterator protocol: GetIterator(source) -> iterator with next() returning { value, done } until done true; use IteratorValue from result.
- Live bindings implementation: modules create property descriptors (getters) on import objects referencing module environment records, ensuring observers see updated values.
- package.json exports conditional resolution: exact key "." maps subpath "/"; nested exports allow fine-grained entry points; unsupported subpath -> throw ERR_MODULE_NOT_FOUND.
- FizzBuzz rule customization: accept rules as ordered list of [divisor, label]; compute labels by iterating rule list and concatenating when n % divisor === 0.

REFERENCE DETAILS

API signatures and configuration options:
- Array.from(source: Iterable|ArrayLike, mapFn?: (value:any, index:number)=>any, thisArg?: any) -> any[]
  - Errors: TypeError if source null/undefined or mapFn not callable.
  - ToLength applies to array-like length reading.

- ES module exports
  - export { names } syntax must be statically analyzable; names are resolved at parse/instantiation time.
  - Re-export exact forms: export { name as alias } from 'module'; export * from 'module' (excludes default).

- Node package.json fields
  - type: "module" | omitted/other -> affects .js parsing mode
  - exports: object mapping subpaths to entry points; conditional keys: import, require, node, default
  - example: { "type":"module","main":"dist/index.cjs","exports":{ ".": { "import":"./dist/index.mjs","require":"./dist/index.cjs" } } }

- FizzBuzz npm package (common signatures)
  - fizzbuzz(n: number) -> string[] (returns 1..n mapped according to rules)
  - fizzbuzz.single or fb(n: number) -> string
  - Parameters: n must be integer; behavior for n <= 0 depends on implementation (empty array or throw). Validate inputs.

BEST PRACTICES & TROUBLESHOOTING

Best practices:
- Prefer using iterable protocol for Array.from inputs when dealing with strings to preserve Unicode code points.
- Use export bindings rather than copying values to preserve live updates across modules.
- Set package.json "exports" to restrict public API surface and provide separate ESM/CJS builds.
- For large FizzBuzz ranges, implement streaming generator to avoid O(n) memory.

Troubleshooting:
- If Array.from returns unexpected values for strings, ensure the source is an iterable string and not indexed access that breaks surrogate pairs.
- If module resolution fails, verify package.json "exports" keys and runtime import style (require vs import) match provided conditional exports.
- If require('fizzbuzz') yields undefined, check module type (ESM vs CJS) and whether the package exposes a default export or named exports; use dynamic import or adjust require interop accordingly.

DIGEST

Source list and retrieval date:
- MDN Array.from — retrieved 2026-03-09
- MDN export statement — retrieved 2026-03-09
- Node.js Modules docs — retrieved 2026-03-09
- npm package "fizzbuzz" — retrieved 2026-03-09
- Wikipedia Fizz Buzz — retrieved 2026-03-09

Attribution and data size:
- Sources: MDN Web Docs (Array.from, export), Node.js official documentation, npmjs.com (fizzbuzz package), Wikipedia (Fizz Buzz)
- Approximate data size aggregated: small (each source ~1 page), total ~5 pages equivalent

[Retrieved: 2026-03-09]

ATTRIBUTION

Content compiled from MDN Web Docs, Node.js official documentation, npm package page for "fizzbuzz", and Wikipedia Fizz Buzz article. Data size: ~5 pages equivalent.