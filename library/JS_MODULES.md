DOCUMENT: JS_MODULES

NORMALISED EXTRACT

Table of contents:
1. Module system overview
2. File extensions and package.json "type"
3. Export syntax (named, default, re-exporting)
4. Import syntax and module specifiers
5. Import maps and remapping rules
6. Array.from API
7. Number.isInteger API
8. RangeError behaviour and constructor

1. Module system overview
- Modern JavaScript supports ECMAScript modules (ESM) and CommonJS (CJS).
- Browsers and Node.js support ESM; Node.js supports both ESM and CJS concurrently. Implementations must detect module type using file extension, package.json "type", or syntax detection for compatibility.
- Modules are evaluated in strict mode by default; module top-level variables are module-scoped.

2. File extensions and package.json "type"
- Node.js determination rules:
  - ".mjs" => treat file as ESM.
  - ".cjs" => treat file as CommonJS.
  - ".js" => treat according to nearest parent package.json "type" field: "module" => ESM; "commonjs" => CommonJS. If no package.json then default CommonJS unless ESM-only syntax is required.
- When authoring a package, set package.json "type" explicitly to avoid ambiguity.

3. Export syntax (named, default, re-exporting)
- Named exports: export let/const/var name1, name2; export { name1, name2 }.
- Default export: export default <expression|function|class> — only one default allowed per module.
- Re-exporting: export { name } from "mod"; export * from "mod" (does not re-export default); export * as ns from "mod".
- Export declarations are top-level only; they are declarations (not executed statements) and may appear before the referenced binding is declared.
- Duplicate exported names across wildcard re-exports result in conflicting star exports and will not export conflicting names; attempting to import them directly will throw.

4. Import syntax and module specifiers
- Import forms: named imports, namespace import, default import, dynamic import(import()).
- Module specifiers can be relative or absolute URLs, or bare names resolved by environment (Node.js resolver or browser import maps).
- In browsers, use <script type="module"> and ensure server sets Content-Type: text/javascript for modules.

5. Import maps and remapping rules
- Import maps are JSON objects in a <script type="importmap"> that map specifier keys to absolute/relative URLs.
- Keys without trailing slash are exact matches; keys with trailing slash act as path prefixes and must have values with trailing slash.
- Resolution picks the longest matching key when multiple keys could match.
- Import maps apply only to the document; workers require separate maps.

6. Array.from API
- Signature: Array.from(items[, mapFn[, thisArg]]) -> Array
- items: iterable or array-like (length property and indexed elements). If not iterable, Array.from will use length to produce array entries with undefined for missing indices.
- mapFn(element, index) called for each element during construction; using mapFn avoids creating an intermediate array.
- Array.from never creates sparse arrays; missing indices become undefined.
- When called on a subclass constructor via Function.prototype.call, the constructor is invoked with a length parameter for array-likes; when given an iterable, constructor invoked with no args and elements appended during iteration.

7. Number.isInteger API
- Signature: Number.isInteger(value) -> boolean
- Returns true if typeof value is "number" and value is an integer (no fractional component) and not NaN or Infinity.
- Precision caveat: floating-point representation may cause values like 5.0000000000000001 to be considered integer due to rounding.

8. RangeError behaviour and constructor
- RangeError is subclass of Error; used when argument values out of allowed range, e.g., invalid array length, invalid numeric formatting arguments.
- Constructor: new RangeError([message])
- Instance properties: name = "RangeError"; standard Error.prototype properties apply.
- RangeError objects are serializable (structuredClone) and transferable between Workers via postMessage.

SUPPLEMENTARY DETAILS

Module authoring guidelines and implementation details:
- Always set package.json "type" to "module" or "commonjs" for packages containing .js files to ensure consistent Node.js behaviour.
- Prefer .mjs for explicit ESM when publishing mixed-type packages or when consumers may not set package.json correctly.
- For browser modules, ensure server sets Content-Type: text/javascript; use .mjs only if server supports correct MIME type.
- When exporting an API surface, prefer named exports for multiple utilities and default export only for single-main-export modules.
- For libraries that will be consumed by both ESM and CommonJS, provide both module entrypoints: "main" for CommonJS and "module" or "exports" map for ESM in package.json; ensure build step produces both artifacts.

Array.from implementation patterns:
- Use Array.from({ length: N }, (_, i) => start + i * step) to generate numeric sequences safely without sparse arrays.
- For typed arrays, use Array.from with mapFn to avoid intermediate arrays that would be truncated.

Number.isInteger usage rules:
- Guard numeric inputs: validate typeof value === 'number' before calling Number.isInteger when non-number inputs may appear.
- Do not rely on Number.isInteger for very large integers near or above Number.MAX_SAFE_INTEGER due to precision loss.

RangeError handling patterns:
- Validate parameters at API boundary and throw new RangeError("message") with explicit allowed range.
- Catch RangeError specifically when handling numeric parsing/formatting or array length operations.

REFERENCE DETAILS (API, signatures, options, effects)

Array.from(items, mapFn?, thisArg?) -> Array
- items: Iterable or array-like object
- mapFn: function(element, index) -> mappedValue (optional)
- thisArg: this binding for mapFn (optional)
- Effects: returns new Array instance (or instance of "this" constructor if called as method), never sparse.

Number.isInteger(value) -> boolean
- value: any
- Returns: true if value is a number and integral, false otherwise.
- Edge cases: NaN -> false; Infinity -> false; non-number types -> false.

Export syntax (ECMAScript module surface):
- export const/let/var name
- export function name() { }
- export default <expression|function|class>
- export { name as alias }
- export * from "module"
- export { default as alias } from "module"
- Constraints: only one default per module; export declarations must be top-level; duplicate exported names across aggregated star exports silently omitted and conflict when imported directly.

RangeError constructor
- RangeError([message]) -> RangeError instance
- Instance: message (string), name = "RangeError", stack (string)

MODULES IMPLEMENTATION PATTERNS
- package.json fields:
  - "type": "module" | "commonjs"
  - "main": entry for CommonJS
  - "module": entry for ES module (if providing separate bundles)
  - "exports": conditional exports mapping for Node resolution (use to present different builds to ESM vs CJS consumers)
- Interop:
  - When offering both default and named exports to CJS consumers, provide a CommonJS wrapper that sets module.exports = { default: defaultExport, named1 } or use the __esModule convention when transpiling.

TROUBLESHOOTING (common errors and fixes)
- SyntaxError when importing: ensure server serves modules with correct MIME type (text/javascript) and use <script type="module">.
- Unresolved module specifier in browser: add importmap entries or use relative/absolute URL specifiers.
- Duplicate star export conflicts when aggregating many modules: avoid export * from across modules that share export names; create an explicit barrel module with controlled re-exports.
- Number.isInteger unexpected true: check for floating point precision around large magnitudes; use Number.isFinite and manual rounding checks if strictness required.

DETAILED DIGEST

Sources referenced (from SOURCES.md):
- MDN JavaScript Guide: Modules (developer.mozilla.org) — retrieved 2026-03-07
- MDN export statement reference (developer.mozilla.org) — retrieved 2026-03-07
- MDN Array.from reference (developer.mozilla.org) — retrieved 2026-03-07
- MDN Number.isInteger reference (developer.mozilla.org) — retrieved 2026-03-07
- MDN RangeError reference (developer.mozilla.org) — retrieved 2026-03-07
Data retrieved on: 2026-03-07T03:59:20.633Z
Approximate data size fetched for these MDN pages: ~48 KB combined

ATTRIBUTION
Content extracted verbatim and condensed from developer.mozilla.org pages: "JavaScript Guide: Modules", "export", "Array.from", "Number.isInteger", "RangeError"; retrieved 2026-03-07.

END OF DOCUMENT
