WIKIPEDIA_FIZZBUZZ

TABLE OF CONTENTS
1. Definition and rules
2. Canonical algorithms (detailed implementations)
3. Variants and optimisations
4. Edge cases and language-specific notes
5. Supplementary details (complexity, memory)
6. Reference details (exact expressions and patterns)
7. Detailed digest and retrieval metadata

1. Definition and rules
- For each integer n in a defined inclusive range produce one output per integer as follows:
  - If n is divisible by 3 and 5 (i.e., n % 15 == 0) produce the string: FizzBuzz
  - Else if n is divisible by 3 (n % 3 == 0) produce: Fizz
  - Else if n is divisible by 5 (n % 5 == 0) produce: Buzz
  - Otherwise produce the decimal string representation of n

2. Canonical algorithms (detailed implementations)
- Branch-first (explicit combined check):
  for i from start to end:
    if i % 15 == 0: output "FizzBuzz"
    else if i % 3 == 0: output "Fizz"
    else if i % 5 == 0: output "Buzz"
    else: output decimal string of i

- String-concatenation pattern (single-pass without combined branch):
  for i from start to end:
    s = empty string
    if i % 3 == 0: s = s + "Fizz"
    if i % 5 == 0: s = s + "Buzz"
    if s is empty: s = decimal string of i
    output s

- Table-driven LCM (periodic precompute):
  Precompute outputs for offsets 1..15 into array cycle[1..15]
  For base = start to end step 15:
    for offset from 1 to 15:
      idx = base + offset - 1
      if idx > end: break
      output cycle[offset]
  Use when N is large and modulus computation cost must be reduced.

3. Variants and optimisations
- Minimal-branching via bit/flag composition: compute f3 = (i%3==0), f5 = (i%5==0), index into mapping table keyed by (f3<<1 | f5)
- Streaming/generator: yield strings instead of building full array to preserve O(1) extra memory
- Bulk repetition via cycle blocks of 15 to reduce repeated modulus operations for very large ranges

4. Edge cases and language-specific notes
- Zero: 0 % k == 0 in most languages; 0 should emit "FizzBuzz"
- Negative integers: divisibility by k holds for negatives if language defines remainder accordingly; use absolute value or language-specific modulo handling if necessary
- Non-integer inputs: coerce or reject; ensure integer semantics before processing
- Integer overflow: use BigInt or arbitrary-precision types for ranges beyond language safe integers

5. Supplementary details (complexity, memory)
- Time complexity: O(N) mod/branch operations
- Space complexity: O(1) working space when streaming; O(N) if collecting outputs in memory
- Performance notes: push/pop are cheap for arrays; avoid shift/unshift in languages where they are O(N)

6. Reference details (exact expressions and patterns)
- Combined check: i % 15 == 0 -> "FizzBuzz"
- Single checks: i % 3 == 0 -> append "Fizz"; i % 5 == 0 -> append "Buzz"
- Precompute pattern: cycle = [1:"1",2:"2",3:"Fizz",4:"4",5:"Buzz",6:"Fizz",7:"7",8:"8",9:"Fizz",10:"Buzz",11:"11",12:"Fizz",13:"13",14:"14",15:"FizzBuzz"]
- Generator pseudocode example (language-agnostic):
  function fizzbuzzGenerator(start, end):
    for i in range(start, end+1):
      s = (i%3==0?"Fizz":"") + (i%5==0?"Buzz":"")
      yield s != "" ? s : toString(i)

7. Detailed digest and retrieval metadata
- Source: Wikipedia — Fizz Buzz article
- Retrieval date: 2026-03-14
- Crawled data size: page HTML ~70KB (HTTP response captured)
- Attribution: Wikipedia (CC BY-SA) — preserve source licensing when republishing verbatim content

---
Supplementary note: this document extracts the canonical rules, implementable idioms and precise expressions required to implement FizzBuzz across languages, drawn from the Wikipedia entry retrieved on the date above.