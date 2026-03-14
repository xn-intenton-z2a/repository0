FIZZ_BUZZ

Table of contents
- Algorithm
- Input / Output contract
- Implementation patterns (order, branching, concatenation)
- Generalisation and mapping
- Complexity and performance
- Troubleshooting and common pitfalls
- Digest (source + retrieval)
- Attribution and data size

Algorithm
- For each integer n from 1 to N produce an output string according to rules:
  - If n divisible by 3 and not by 5 -> "Fizz"
  - If n divisible by 5 and not by 3 -> "Buzz"
  - If n divisible by both 3 and 5 -> "FizzBuzz"
  - Otherwise -> the decimal representation of n
- Equivalently, check divisibility by 15 first, or build output by concatenating per-divisor tokens.

Input / Output contract
- Input: single positive integer N (N >= 1). Implementations may accept N == 0 or negative but must define behavior (commonly: empty sequence or error).
- Output: sequence (stream, array, or console lines) of exactly N items following the mapping above.
- Accept only integer inputs; float inputs must be handled explicitly (reject, floor, or error).

Implementation patterns
- Check-for-15 first pattern: if n % 15 == 0 -> FizzBuzz; else if n % 3 == 0 -> Fizz; else if n % 5 == 0 -> Buzz; else -> n
- Concatenation pattern: s = ""; if n % 3 == 0 append "Fizz"; if n % 5 == 0 append "Buzz"; output s or n
- Use integer modulus operations; avoid floating point comparisons for divisibility
- Streaming implementation: yield lines as generated to reduce memory usage for large N

Generalisation and mapping
- To extend to arbitrary divisor-token pairs (d_i, token_i): for each n, for each pair, if n % d_i == 0, append token_i; if none matched, output n
- Order of checking matters for deterministic token concatenation

Complexity and performance
- Time: O(N * D) where D is number of divisor-token pairs (D=2 for classic FizzBuzz)
- Space: O(1) if streaming; O(N) if collecting outputs into an array

Troubleshooting and common pitfalls
- Wrong order of if/else that checks 3 or 5 before 15 causing combined case to be missed
- Using floating inputs without integer validation leads to incorrect modulus behavior
- Off-by-one: ensure loop iterates from 1 through N inclusive if that is the contract

Digest
- Source section: Wikipedia Fizz Buzz page (rule set, history and variations)
- Retrieved: 2026-03-14

Attribution and data size
- Source: https://en.wikipedia.org/wiki/Fizz_buzz
- Retrieved on: 2026-03-14
- Crawl size: 68334 bytes
