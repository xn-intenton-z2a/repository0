DOCUMENT: FIZZ_BUZZ

NORMALISED EXTRACT

Core rules and behavior
- Replace each integer in a counting sequence with labels according to divisibility rules: divisible by 3 => fizz; divisible by 5 => buzz; divisible by both 3 and 5 => fizzbuzz.
- Extendable rules: add any divisor and label pair; optionally treat a rule as matching when the decimal representation contains a configured digit.
- In implementations prefer label concatenation: evaluate every rule for a number and append matching labels; if none match, emit the decimal string.
- Common usage: generate first N entries, stream results for large N, or use as a control-flow interview question.

Table of Contents
1. Rule set and core logic
2. Function signatures and configuration
3. Implementation patterns and performance optimizations
4. Time/space complexity and scaling guidance
5. Edge cases, tests and validation
6. Supplementary implementation details
7. Reference API specifications and method signatures
8. Troubleshooting and best practices
9. Digest and attribution

1. Rule set and core logic
- Core algorithm (deterministic, extensible): for each integer i in [start, end]:
  - Initialize label = empty string.
  - For each rule in rules (ordered):
    - If i % rule.divisor == 0 then append rule.label to label.
    - If rule.matchDigit is true and decimalString(i) contains configured digit, append rule.label.
  - Output label if non-empty; otherwise output decimalString(i).
- Use deterministic rule ordering to ensure predictable concatenation when multiple rules match.
- Avoid special-casing combined divisors when using concatenation; combined outputs produce naturally (for example, fizz + buzz => fizzbuzz).

2. Function signatures and configuration
- JavaScript (Node) primary signature:
  function fizzBuzzRange(start: integer, end: integer, rules: Array<{divisor: number, label: string, matchDigit?: boolean}>, options?: {separator?: string, stream?: WritableStream, lcmOptimization?: boolean}) -> Array<string> | undefined
  - start: integer, default 1. end: integer >= start. rules: ordered list of rule objects. options.stream: if present, function writes UTF-8 line-delimited output to stream and returns undefined. options.separator default '\n'.
- Python signature:
  def fizz_buzz(end: int, start: int = 1, rules: Sequence[Tuple[int, str]] = ((3, 'fizz'), (5, 'buzz')), match_digit: bool = False) -> List[str]
  - Raises ValueError if end < start or any divisor <= 0.
- Java signature:
  List<String> fizzBuzz(int start, int end, List<Rule> rules)
  - Rule: class Rule { int divisor; String label; boolean matchDigit; }
- C# signature:
  IEnumerable<string> FizzBuzzRange(int start, int end, IEnumerable<Rule> rules, bool stream = false)
- Common options (cross-language):
  - start: inclusive start integer (default 1)
  - end: inclusive end integer
  - rules: ordered list of (divisor > 0, label non-empty, optional matchDigit boolean)
  - separator: string used when streaming (default newline)
  - stream: writable destination to avoid collecting full output
  - lcmOptimization: boolean to enable LCM-based combined checks when beneficial

3. Implementation patterns and performance optimizations
- Baseline loop: O(n * r) time where n = end - start + 1 and r = number of rules. Implementation steps: convert integer to string only when needed (avoid unnecessary allocations).
- Concatenation approach: evaluate all rules and append labels; this avoids special-case bugs for combined matches.
- LCM-based combined-check: compute lcm of multiple divisors to detect simultaneous divisibility in a single modulo check when r is small and fixed. lcm(a,b) = abs(a*b)/gcd(a,b).
- Counter (modulo reduction) optimization: for each divisor maintain counter_i initialized to divisor_i; on each iteration decrement counters; when counter_i reaches zero, append label and reset counter_i = divisor_i. This replaces per-iteration modulo with decrement and branch, reducing CPU cost under heavy iteration.
- IO buffering: buffer writes into blocks (suggested 4k–8k bytes) then flush to stream to minimize syscalls. Use binary/UTF-8 writer appropriate to environment.
- Parallelization: partition numeric range into contiguous blocks for workers; each worker computes its block into an in-memory buffer and then outputs in order. Preserve overall ordering by either sequentially writing worker buffers or assigning ordered blocks.

4. Time/space complexity and scaling guidance
- Time complexity: O(n * r) worst-case; counters and other micro-optimizations reduce constant factors.
- Space complexity: O(n) when collecting results; O(1) extra when streaming. For very large n prefer streaming to avoid OOM.
- Practical thresholds: collecting into memory is suitable for n up to roughly 1e6 depending on per-element size and runtime; above that, prefer streaming.

5. Edge cases, tests and validation
- Input validation rules:
  - start and end must be integers and start <= end.
  - All divisors must be integers > 0.
  - Labels must be non-empty strings.
  - matchDigit flag must be boolean when present.
- Unit tests to include:
  - Known sequence verification for range 1..15 producing correct fizz, buzz, and fizzbuzz placements.
  - Custom rule sets: verify behavior with additional divisors and digit-matching enabled.
  - Boundary conditions: start == end returns single-element output; start > end should either return empty list or raise, per API contract.
  - Invalid inputs: negative or zero divisors, non-integer start/end should raise appropriate exceptions.
  - Large-range streaming: integration test ensuring no OOM and correct first/last elements.

6. Supplementary implementation details
- LCM calculation: implement gcd via Euclid's algorithm using integer arithmetic; compute lcm(a,b) = (a / gcd(a,b)) * b to reduce intermediate overflow risk. For chains: lcm(a,b,c) = lcm(lcm(a,b),c).
- Counter arrays: store counters in a fixed-size integer array aligned with rules; initialize counters[i] = rules[i].divisor. On each iteration decrement counters[i]; if counters[i] == 0 then append rules[i].label and reset counters[i] = rules[i].divisor.
- Digit matching: compute decimal string once per iteration only if any rule has matchDigit enabled; match by character containment of the decimal digit corresponding to rule.divisor's relevant digit (usually use string of divisor or configured digit).
- Buffering: use a buffer writer with capacity >= 4096 bytes; write entries separated by options.separator; flush at end or when buffer full.
- Error handling: validate inputs at entry and raise precise exceptions (ValueError/IllegalArgumentException/ArgumentException) with messages including offending parameter and value.

7. Reference API specifications and method signatures
- JavaScript (Node) API
  Signature
    - function fizzBuzzRange(start, end, rules, options) -> Array<string> | undefined
  Parameters
    - start: integer, default 1. If not integer, throw TypeError.
    - end: integer >= start. If end < start, throw RangeError or return empty array per chosen contract.
    - rules: Array of objects with fields: divisor (integer > 0), label (non-empty string), matchDigit (optional boolean).
    - options: object with optional fields: separator (string, default '\n'), stream (Writable stream), lcmOptimization (boolean, default false).
  Return
    - If options.stream provided: returns undefined and writes results to stream encoded as UTF-8 using options.separator between entries.
    - Otherwise returns Array<string> of length end - start + 1.
  Behavior details
    - Deterministic: rules evaluated in provided order. Concatenate labels in that order.
    - Side effects: when stream provided, function must not allocate the full output array.

- Python API
  Signature
    - def fizz_buzz(end: int, start: int = 1, rules: Sequence[Tuple[int, str]] = ((3, 'fizz'), (5, 'buzz')), match_digit: bool = False) -> List[str]
  Parameter rules format
    - rules: sequence of (divisor:int, label:str) tuples; matchDigit may be included as third element per rule or controlled globally via match_digit flag.
  Exceptions
    - Raises ValueError for invalid ranges or divisors.

- Java API
  Signature
    - List<String> fizzBuzz(int start, int end, List<Rule> rules)
  Rule class
    - class Rule { int divisor; String label; boolean matchDigit; }
  Behavior
    - Returns list of strings for inclusive range [start, end]. Validate inputs and throw IllegalArgumentException when invalid.

- C# API
  Signature
    - IEnumerable<string> FizzBuzzRange(int start, int end, IEnumerable<Rule> rules, bool stream = false)
  Behavior
    - When stream = true, write to provided TextWriter or yield strings lazily to avoid collecting.

8. Troubleshooting and best practices
- Common issues and fixes
  - Missing combined label (e.g., fizzbuzz at 15): ensure concatenation approach is used or the LCM-based combined check includes all relevant divisors.
  - Incorrect digit-matching: normalize the integer to decimal string and use simple substring checks for the target digit; avoid numeric digit extraction pitfalls.
  - Performance bottleneck dominated by modulo operations: apply counter optimization to remove repeated modulo operations.
  - Memory pressure on large ranges: switch to streaming and buffer writes.
- Best practices
  - Use concatenation rule evaluation for extensibility and correctness.
  - Validate input early and provide clear error messages.
  - Prefer streaming and buffering for large N; benchmark before applying heavy parallelization.

9. Digest and attribution
- Digest: Extracted authoritative technical details on core rules, extensible rule models (divisor and digit matches), algorithmic patterns (concatenation, LCM optimization, counter optimization), API signatures across JS/Python/Java/C#, input validation, buffering and streaming guidance, and troubleshooting steps.
- Source reference: Wikipedia — "Fizz buzz" — URL: https://en.wikipedia.org/wiki/Fizz_buzz
- Date retrieved: 2026-03-06
- Data size obtained during crawl: approximately 2800 bytes

ATTRIBUTION
- Source: Wikipedia contributors, "Fizz buzz". Content licensed under CC BY-SA; include attribution when reusing verbatim content.

CRAWL METADATA
- Source URL: https://en.wikipedia.org/wiki/Fizz_buzz
- Retrieved at: 2026-03-06T03:02:17.642Z
- Size (approx): 2800 bytes

END OF DOCUMENT
