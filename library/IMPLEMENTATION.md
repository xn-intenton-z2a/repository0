IMPLEMENTATION

Table of contents
1. Normalised extract
  1.1 FizzBuzz algorithm and deterministic contract
  1.2 Input validation and canonical error semantics (exact checks and messages)
  1.3 API signature and return types
  1.4 Module export and loading notes (ESM/CJS)
2. Supplementary details
  2.1 Constants and configuration knobs
  2.2 Installation and CI commands
  2.3 Testing patterns (Vitest)
3. Reference details
  3.1 Exact validation logic (stepwise, exact messages)
  3.2 Function signature, parameters and return typing
  3.3 Configuration and package fields affecting resolution
  3.4 Troubleshooting steps and deterministic checks
4. Detailed digest
  4.1 Source excerpt from SOURCES.md (retrieved 2026-03-08)
5. Attribution and crawl data size

1. Normalised extract

1.1 FizzBuzz algorithm and deterministic contract
- For input integer n produce an Array of length n where element at index (i-1) corresponds to integer i for i in 1..n inclusive.
- Mapping (apply in this exact priority order):
  - If i % 15 === 0 then element is the exact string FizzBuzz
  - Else if i % 3 === 0 then element is the exact string Fizz
  - Else if i % 5 === 0 then element is the exact string Buzz
  - Else element is the integer i (JavaScript Number value)
- Implementation MUST satisfy:
  - Returned array length MUST equal n.
  - Elements MUST be ordered to correspond to integers 1..n.
  - Elements that are not Fizz/Buzz/FizzBuzz MUST be Number typed values (not strings).

1.2 Input validation and canonical error semantics (exact checks and messages)
- Perform the following checks in this exact order; on failure throw a RangeError with the exact message shown:
  1. If Number.isFinite(n) === false then throw new RangeError('n must be finite')
  2. If Number.isInteger(n) === false then throw new RangeError('n must be an integer')
  3. If n < 1 then throw new RangeError('n must be >= 1')
  4. If n > MAX_N then throw new RangeError('n must be <= ' + MAX_N)
- Use RangeError exclusively for numeric domain/type violations; do not substitute TypeError for these checks.

1.3 API signature and return types
- Exported function name: fizzBuzz
- Signature (declarative): export function fizzBuzz(n: number): Array<string | number>
- Behaviour: returns an Array whose length equals n; entries are either the exact strings Fizz, Buzz, FizzBuzz or JavaScript Number values for other indices.

1.4 Module export and loading notes (ESM/CJS)
- package.json "type": "module" makes .js files be interpreted as ESM. Prefer export forms compatible with ESM when package.type is module. Provide a CJS entry (.cjs) or conditional exports if CJS consumers are expected.
- Use explicit named export: export function fizzBuzz(n) { ... } and also consider export default for convenience if the package is intended as single-function API.

2. Supplementary details

2.1 Constants and configuration knobs
- MAX_N: integer upper bound for n; must be declared and surfaced in errors exactly as 'n must be <= ' + MAX_N.
- Consider exposing MAX_N and default values in module exports for consumers and tests.

2.2 Installation and CI commands
- Install: npm install --save fizzbuzz or pin with npm install --save fizzbuzz@<version>
- CI reproducible install: use npm ci with committed package-lock.json; for yarn use yarn install --frozen-lockfile.
- Inspect package metadata before use: npm view fizzbuzz --json

2.3 Testing patterns (Vitest)
- Run unit tests: npm run test (maps to vitest invocation in package.json)
- Use test:unit and test:behaviour scripts where appropriate; ensure deterministic behavior by asserting exact array length and element types.

3. Reference details

3.1 Exact validation logic (stepwise, exact messages)
- Implement checks in this exact order (pseudocode description without escape sequences):
  if (Number.isFinite(n) === false) throw new RangeError('n must be finite')
  if (Number.isInteger(n) === false) throw new RangeError('n must be an integer')
  if (n < 1) throw new RangeError('n must be >= 1')
  if (n > MAX_N) throw new RangeError('n must be <= ' + MAX_N)

3.2 Function signature, parameters and return typing
- fizzBuzz(n: number): Array<string | number>
  - Parameters: n — finite integer in inclusive range [1, MAX_N]
  - Returns: array of length n where index i-1 maps to i per the mapping rules in 1.1
  - Throws: RangeError with exact messages as defined in 3.1 on invalid input

3.3 Configuration and package fields affecting resolution
- package.json fields to check and their effects:
  - type: "module" => .js files parsed as ESM
  - main: fallback entry for CommonJS consumers; set only if CJS entry required
  - module / exports: use conditional exports to provide ESM and CJS entry points
  - files / package.json "exports" mapping: control which paths are importable by consumers

3.4 Troubleshooting steps and deterministic checks
- If tests fail asserting array length: verify that returned.length === n and that loop is inclusive 1..n.
- If element type mismatches: ensure non-Fizz/Buzz values are not coerced to strings; use Number typed values.
- If RangeError messages differ: check exact string literals used in throws; messages are machine-parseable and must match expected.
- If module import fails in consumer: confirm package.json.type and file extensions (.mjs/.cjs) or add conditional exports to support both loaders.

4. Detailed digest

4.1 Source excerpt from SOURCES.md (retrieved 2026-03-08)
- Sources referenced: Wikipedia Fizz_buzz; MDN JS Modules; MDN Number.isInteger; MDN RangeError; npm package fizzbuzz; Vitest guide.
- Technical extracts used: algorithm mapping and exact contract, validation steps and exact RangeError messages, API signature fizzBuzz(n): Array<string|number>, package.json type effects, installation and vitest commands.
- Retrieval date: 2026-03-08

5. Attribution and crawl data size
- Attribution: content extracted and normalised from the URLs listed in SOURCES.md (Wikipedia, MDN, npm, Vitest). See SOURCES.md for full URLs.
- Crawl snapshot: 6 source URLs; approximate raw text extracted ~10KB (combined) during crawl.
