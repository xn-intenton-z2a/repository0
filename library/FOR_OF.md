TITLE: FOR_OF

TABLE OF CONTENTS
1. Syntax
2. Iteration semantics
3. Iterable protocol details
4. Use with strings and Unicode code points
5. Interaction with generators and iterators
6. Edge cases and performance notes
7. Reference details (syntax and runtime behavior)
8. Detailed digest (source: MDN — for...of) — retrieved 2026-03-14
9. Attribution and data size

NORMALISED EXTRACT
1. Syntax
for (variable of iterable) statement

2. Iteration semantics
- for...of obtains an iterator via iterable[Symbol.iterator]() and repeatedly calls iterator.next() until done === true.
- Each loop receives the value property of the iterator result object; keys or indices are not provided.
- The loop honors break, continue, and return; ensures iterator.return is invoked for early exits to allow cleanup.

3. Iterable protocol details
- An iterable implements method at Symbol.iterator which returns an iterator object with next() -> { value, done }.
- Built-ins: Arrays, Strings, Maps, Sets, TypedArrays, DOM collections, etc.

4. Use with strings and Unicode code points
- Strings' iterator yields Unicode code points (not raw UTF-16 code units), thus for...of is suitable for Unicode-safe character iteration, including astral symbols represented by surrogate pairs.
- When both index and value are needed, manual index tracking is required; for...of yields values only.

5. Interaction with generators and iterators
- Works seamlessly with generator functions; exceptions thrown by iterator.next() propagate.
- Early exits call iterator.return if present, enabling generator cleanup.

EDGE CASES & PERFORMANCE
- Mutating the underlying iterable during iteration can affect behavior; avoid unsafe modifications when possible.
- for...of may be slightly slower than indexed numeric loops for tight numeric array loops; prefer readability except in hot loops where benchmarks indicate a problem.

REFERENCE DETAILS
- Syntax: for (const item of iterable) { ... }
- Under-the-hood: calls iterable[Symbol.iterator]() once per loop entry and repeatedly calls next(); uses iterator.return for early completion.

DETAILED DIGEST
Source: MDN — for...of — retrieved 2026-03-14
Data obtained: exact semantics of the iteration protocol, behavior with strings (code-point iteration), and interaction with generators/iterators.

ATTRIBUTION
Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of — retrieved 2026-03-14. Data size retrieved: ~160 KB (HTML). License: MDN content (Creative Commons/MDN policies).