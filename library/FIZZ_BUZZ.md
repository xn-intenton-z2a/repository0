DOCUMENT: FIZZ_BUZZ

NORMALISED EXTRACT

Core rules and behavior
- For each positive integer in a counting sequence, replace values according to divisibility rules: divisible by 3 => output "fizz"; divisible by 5 => output "buzz"; divisible by both 3 and 5 => output "fizzbuzz".
- Variants: additional divisors (e.g., 7) and rules that trigger when the number contains a digit (e.g., any number containing '5' triggers "buzz").
- Game form: players count aloud and apply rules; in programming this maps to generating or streaming the sequence.
- Common interview use: produce first N entries or print up to 100; used to verify basic control flow and edge-case handling.

Table of Contents
1. Rule set and core logic
2. Function signatures and configuration
3. Implementation patterns and optimizations
4. Time/space complexity and scaling guidance
5. Edge cases, tests and validation
6. Troubleshooting checklist

1. Rule set and core logic
- Primary mapping: if number % 3 == 0 and number % 5 == 0 => "fizzbuzz". Otherwise if number % 3 == 0 => "fizz". Otherwise if number % 5 == 0 => "buzz". Otherwise => the number's decimal representation.
- Alternative implementation: iterate divisors in a deterministic order, concatenate corresponding labels when number divisible by each divisor; if concatenation is empty output number.
- Combined-rule approach: compute label = concat(label_i for each divisor_i if number % divisor_i == 0); output label if non-empty else number.
- Digit-containing rule: if enabled, also apply rule when the decimal representation contains the configured digit for that divisor.

2. Function signatures and configuration
- Generic signature (JavaScript): function fizzBuzzRange(start: integer, end: integer, rules: Array<{divisor:int,label:string,matchDigit?:boolean}>) => Array<string>
- Minimal signature (Java/Python): List<String> fizzBuzz(int n) or def fizz_buzz(n: int) -> List[str]
- Streaming/IO signature: void printFizzBuzz(int start, int end, OutputStream out) — writes line-delimited values to out.
- Configuration options:
  - start (integer, default 1): inclusive start of counting range
  - end (integer): inclusive end of counting range
  - rules (list): ordered list of divisor/label pairs; each entry: divisor (int > 0), label (string), matchDigit (boolean, optional)
  - separator (string, default: single space or newline when streaming)
  - lcmOptimization (boolean): if true, perform combined checks via LCM when many fixed divisors present

3. Implementation patterns and optimizations
- Straightforward loop:
  - For i from start to end: initialize outLabel = ""; for each rule in rules: if i % rule.divisor == 0 then outLabel += rule.label; if rule.matchDigit and decimalString(i) contains digit for rule.divisor, append label. If outLabel empty, output decimal string(i) else outLabel.
- Combined-check ordering:
  - Avoid checking combined (3 and 5) separately when concatenation approach is used; concatenation naturally produces "fizzbuzz" when both divisors match.
  - When checking combined via single condition, use lcm = lcm(divisors) to detect combined-case: if i % lcm == 0 -> combined label.
- Modulo reduction optimization for very high N:
  - Use counters for each divisor: decrement counters and reset to divisor when zero instead of performing modulo for each i; reduces % operations to occasional resets.
- Memory/IO optimization:
  - Streaming output line-by-line to an OutputStream/Writer to avoid storing entire result for large ranges.
  - Buffer writes to reduce syscalls (e.g., write in blocks of 8k).
- Vectorized / SIMD / parallel:
  - Parallelizing the core loop is possible for very large ranges if order isn't critical or outputs can be partitioned, but beware of IO ordering.

4. Time/space complexity and scaling guidance
- Time: O(n * r) where n = number of values (end - start + 1) and r = number of rules (divisors). Using counters reduces constant factor of modulo operations.
- Space: O(n) if collecting results; O(1) extra when streaming.
- Practical guidance: for n up to millions, stream and avoid collecting into memory; for n below ~1e6 collecting is safe in managed languages depending on element size.

5. Edge cases, tests and validation
- Input validation: n must be integer; start <= end; divisors > 0; labels non-empty.
- Tests to include:
  - Basic correctness: small ranges verifying known outputs (1..15 includes first fizzbuzz occurrence at 15).
  - Custom rules: additional divisors and digit-matching rules.
  - Boundaries: start == end; start > end returns empty or raises error depending on API contract.
  - Large N streaming: verify no OOM and correct ordering.
  - Negative and zero divisors: reject with ArgumentError/TypeError.

6. Troubleshooting checklist
- "Fizz Buzz" missing for 15: check order of checks or concatenation logic; ensure both 3 and 5 are applied, or check combined LCM logic.
- Wrong casing or spacing: verify label strings and separator configuration.
- Performance issues at scale: switch from collecting to streaming and apply modulo-counter optimization.
- Unexpected matches for digit rules: ensure digit-match uses decimal string and exact digit characters.

SUPPLEMENTARY DETAILS (technical specifications)
- LCM for combined detection: lcm(a,b) = abs(a*b)/gcd(a,b). Use integer arithmetic to compute lcm safely; guard against overflow for very large divisors.
- Counter optimization: maintain integer counter_i initialized to divisor_i; on each iteration decrement counter_i; when counter_i == 0, emit label and reset counter_i = divisor_i.
- Buffering: use buffered writer with capacity >= 4096 bytes; flush at end or when buffer full.
- Concurrency: partition range into contiguous blocks assigned to worker threads; each worker writes to its own buffer, then merge buffers preserving order or write to separate files.

REFERENCE DETAILS (exact API signatures, options, behaviors)
- JavaScript (Node):
  - Signature: function fizzBuzzRange(start, end, rules, options) -> Array<string>
    - start: integer >= 0
    - end: integer >= start
    - rules: [{divisor: number (>0), label: string, matchDigit?: boolean}]
    - options: {separator?: string, stream?: WritableStream, lcmOptimization?: boolean}
    - Returns: if options.stream provided, returns undefined and writes to stream; otherwise returns Array<string> of length end-start+1.
- Python:
  - Signature: def fizz_buzz(end: int, start: int = 1, rules: Sequence[Tuple[int,str]] = ((3,'fizz'),(5,'buzz')), match_digit: bool = False) -> List[str]
  - Behavior: raises ValueError if end < start or any divisor <= 0.
- Java:
  - Signature: List<String> fizzBuzz(int start, int end, List<Rule> rules)
    - class Rule { int divisor; String label; boolean matchDigit; }
- C#:
  - Signature: IEnumerable<string> FizzBuzzRange(int start, int end, IEnumerable<Rule> rules, bool stream = false)

Concrete configuration examples (descriptive):
- Default rules: rules = [{divisor:3,label:"fizz"},{divisor:5,label:"buzz"}]
- Digit rule: rules = [{divisor:3,label:"fizz"},{divisor:5,label:"buzz",matchDigit:true}]

Best practices
- Prefer concatenation approach (iterate rules and append labels) for extensibility and to avoid missing combined matches.
- Use streaming output for large ranges to avoid memory pressure.
- Validate inputs early and fail fast with clear error messages.

STEP-BY-STEP TROUBLESHOOTING
1. Reproduce the failing input range and exact output.
2. Verify rule list and ordering passed into function.
3. For missing combined label, log per-iteration label building (or simulate for small range) to ensure both divisibility checks are evaluated.
4. For performance regressions, profile: check time spent in modulo operations vs IO; if modulo dominates, apply counter optimization.
5. For incorrect digit-matching, normalize to decimal string and check character containment rather than numeric operations.

DIGEST
- Source: Wikipedia — "Fizz buzz" (https://en.wikipedia.org/wiki/Fizz_buzz)
- Date retrieved: 2026-03-06
- Extracted content: core rules, variants, interview usage, example sequence, references to Rosetta Code and other implementations.
- Data size obtained during crawl: approximately 2.8 kilobytes of page text (HTML/plain extraction).

ATTRIBUTION
- Primary source: Wikipedia contributors, "Fizz buzz", retrieved 2026-03-06, URL: https://en.wikipedia.org/wiki/Fizz_buzz
- Licensing: content from Wikipedia is available under CC BY-SA; include attribution when reusing substantial verbatim content.

CRAWL METADATA
- Source URL: https://en.wikipedia.org/wiki/Fizz_buzz
- Retrieved at: 2026-03-06T02:53:51.681Z
- Size (approx): 2800 bytes

END OF DOCUMENT
