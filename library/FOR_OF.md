TITLE: FOR_OF

TABLE OF CONTENTS
1. Syntax
2. Iteration semantics
3. Iterable protocols
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
- Each loop receives the value property of the iterator result object; keys or indices are not provided (use for...in for property names).
- The loop supports break, continue, and return; finally blocks can still run for generator clean-up.

3. Iterable protocols
- Any object implementing the iterable protocol (has a method at Symbol.iterator that returns an iterator) can be used.
- Built-in iterables include Arrays, Strings, Maps, Sets, TypedArrays, and many DOM collections.

4. Use with strings and Unicode code points
- Strings are iterable by code points, not UTF-16 code units—therefore for...of yields full Unicode symbols including those represented by surrogate pairs.
- When precise index access is required alongside iteration, manual index tracking is necessary because for...of yields values only.

5. Interaction with generators and iterators
- for...of works naturally with generator functions (which produce iterators). If iterator.next() throws, loop propagates exception.

EDGE CASES & PERFORMANCE
- Avoid mutating the iterated collection in ways that confuse iteration semantics.
- for...of may be marginally slower than indexed for loops for simple array numeric iteration; favor readability unless a hot loop requires micro-optimizations.

REFERENCE DETAILS
- Syntax: for (const item of iterable) { ... }
- Under-the-hood: calls iterable[Symbol.iterator]() once and uses next() calls; ensures proper iterator.close (return) behavior for early exit.

DETAILED DIGEST
Source: MDN — for...of — retrieved 2026-03-14
Data obtained: exact semantics of iteration protocol, behavior with strings (code-point iteration), and interaction with iterators/generators.

ATTRIBUTION
Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of — retrieved 2026-03-14. Data size retrieved: ~160 KB (HTML). License: MDN content (Creative Commons/MDN policies).