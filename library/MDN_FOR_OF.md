MDN_FOR_OF

Table of contents:
- Purpose
- Syntax
- Semantics (iterator protocol)
- Behavior with strings and other iterables
- Early exit and iterator.return
- Behavior details and evaluation order
- Error and exception handling rules
- Supplementary details
- Reference details (syntax and algorithmic steps)
- Digest (retrieved 2026-03-18)
- Attribution and data size

Purpose
The for...of statement executes a loop that operates on a sequence of values obtained from an iterable object by using the object's @@iterator method according to the ECMAScript iteration protocol.

Syntax
for (leftHandDeclarator of expression) statement
Examples of leftHandDeclarator: let x, const x, var x, or a pattern.

Semantics (iterator protocol)
- The runtime performs GetIterator(expression) to obtain an iterator record. The iterator record provides a next() method (and optionally return and throw).
- Each iteration performs IteratorStep(iterator). If IteratorStep returns false (iterator done), the loop terminates. Else the runtime obtains value = IteratorValue(step) and binds it to the loop's left-hand target, then executes the loop body.
- The loop uses the iterator returned by the object's [Symbol.iterator] property. For strings, that iterator yields code-point strings (see String.prototype[Symbol.iterator] for details).

Behavior with strings and iterables
- Strings: iterated by code points: for (const ch of s) binds ch to a string representing one Unicode code point per step.
- Arrays, Maps, Sets, TypedArrays, NodeLists, generators, and user-defined iterables are supported; order is the iterator-defined order.

Early exit and iterator.return
- If the loop exits early (break, return, or an exception escapes the loop body), the runtime attempts to close the iterator by calling iterator.return() if that method exists. If iterator.return throws, the exception propagates.

Behavior details and evaluation order
- Expression (the iterable) is evaluated once before loop start to obtain the iterator.
- The left-hand binding is created per spec evaluation rules before each iteration value is assigned.
- The loop body is executed with the value bound to the left-hand variable; continue and break behave as usual.

Error and exception handling
- If evaluation of the iterable or retrieving the iterator throws, the exception propagates and no iterations are performed.
- If retrieving value via IteratorValue or executing loop body throws, the iterator is closed via return if present.

Supplementary details (practical guidance)
- Use for...of when iterating strings to get code points rather than UTF-16 units; do not use index-based loops for Unicode-sensitive code.
- When implementing a Hamming distance over Unicode strings: use for...of or Array.from(s) to produce code-point sequences and compare them element-wise; throw RangeError if sequences differ in length.

Reference details (algorithmic steps)
- High-level algorithm (ECMAScript order):
  1. Evaluate expression to produce iterable.
  2. Let iteratorRecord = GetIterator(iterable).
  3. Repeat: let next = IteratorStep(iteratorRecord); if next is false, break; let v = IteratorValue(next); Bind v to loop variable; execute loop body.
  4. On abrupt completion of loop body, perform IteratorClose(iteratorRecord).

Digest (extracted content)
- The for...of statement consumes iterables via their @@iterator and is the canonical mechanism to iterate strings by code points in JavaScript. It ensures that iterator.return is called on early exit when present and follows the ECMAScript iteration protocol for step/next/value semantics.
- Retrieval date: 2026-03-18

Attribution
Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of
Data retrieved: 210127 bytes (HTTP response body size measured at fetch time)
