TABLE OF CONTENTS
1. Definition
2. Rules
3. Simple algorithm
4. Implementation patterns
5. Edge cases
6. Supplementary details
7. Reference details
8. Digest

1. Definition
Fizz Buzz: iterate integers and produce an output per integer: "Fizz" if divisible by 3, "Buzz" if divisible by 5, "FizzBuzz" if divisible by both, otherwise the number.

2. Rules
- For each n in sequence: if n % 3 == 0 and n % 5 == 0 -> FizzBuzz; else if n % 3 == 0 -> Fizz; else if n % 5 == 0 -> Buzz; else numeric string.

3. Simple algorithm
- Loop from start to end (inclusive) using integer arithmetic
- For each i: compute r3 = i % 3, r5 = i % 5
- Decide output using boolean composition: if (r3==0 && r5==0) -> "FizzBuzz" etc.

4. Implementation patterns
- Branch-first (if/else) pattern: check combined divisor first, then single divisors
- String-concatenation pattern: result = (i%3==0?"Fizz":"") + (i%5==0?"Buzz":""); if result=="" use String(i)
- Table-driven: precompute mapping for lcm cycle (15) and repeat cycle values for large ranges
- Functional pipeline: map over range to transform numbers to outputs

5. Edge cases
- Negative numbers: modulus sign semantics: use absolute or ensure language-specific modulo behavior yields expected divisibility (n % k == 0 works for negative n in most languages supporting Euclidean remainder)
- Zero: 0 is divisible by any non-zero integer -> outputs "FizzBuzz"
- Non-integer inputs: validate or coerce to integers before processing

6. Supplementary details
- Complexity: O(N) time, O(1) extra space for streaming; O(N) space if collecting outputs
- For extremely large N, use streaming/generator to avoid memory growth
- LCM optimization: period = 15; precompute 1..15 outputs and repeat for blocks of 15 when performance matters

7. Reference details
- Exact rule expressions: if (i % 15 == 0) return "FizzBuzz"; else if (i % 3 == 0) return "Fizz"; else if (i % 5 == 0) return "Buzz"; else return i.toString()
- String-concat pattern: let s=""; if(i%3==0) s+="Fizz"; if(i%5==0) s+="Buzz"; return s.length? s: String(i)
- Bulk generation pattern: for (let base=1; base<=N; base+=15) for offset in 1..15 push(precomputed[offset])

8. Digest
Source list: Wikipedia (Fizz Buzz), Rosetta Code examples, canonical StackOverflow discussion, multiple JS tutorials. Retrieved: 2026-03-14
Attribution: Wikipedia, Rosetta Code, freeCodeCamp, MDN, StackOverflow, npm package pages
Data size fetched: multiple pages (~1.6MB total raw HTML).