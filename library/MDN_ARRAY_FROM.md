MDN_ARRAY_FROM

Table of contents
- Signature
- Purpose
- Parameters and behavior (iterable vs array-like)
- Map function semantics
- Unicode / string iteration (code points)
- Implementation notes and spec steps
- Reference details (parameters, return, errors)
- Digest (retrieval date and size)
- Attribution

Normalised extract
Signature
Array.from(arrayLike[, mapFn[, thisArg]]) -> Array

Purpose
Create a new Array instance from an iterable or array-like object. When called with a string, Array.from consumes the String iterator (String.prototype[@@iterator]) and yields entries that are Unicode code points (full characters), not raw UTF-16 code units. This makes Array.from suitable for converting strings into arrays of user-visible characters for correct Unicode-aware comparison.

Parameters and behavior
arrayLike
- Accepts either an iterable (object with a callable Symbol.iterator) or an array-like object (object with a length property).
- If the object has an @@iterator method, the iterator is used to obtain values in sequence. Otherwise the algorithm reads indexed properties 0..length-1 using ToLength(Get(O, "length")).

mapFn (optional)
- If provided, mapFn must be a callable function. For each sourced element value v at index k, the value pushed into the resulting array is Call(mapFn, thisArg, v, k).
- If mapFn is present and not callable, a TypeError is thrown.

thisArg (optional)
- The value to use as this when invoking mapFn.

Map function semantics
- Map is applied during element retrieval: value = mapFn.call(thisArg, element, index).
- Errors thrown by mapFn propagate to the caller.

Unicode / string iteration (code points)
- For strings, Array.from uses the String iterator, which produces Unicode code points. Example behaviour: Array.from("\uD83D\uDE00") yields ["😀"] (single entry) rather than two surrogate code units. Use Array.from(str) or the spread operator [...str] to obtain code points correctly.

Implementation notes and spec steps (condensed)
- Pseudocode algorithm used by Array.from (condensed):
  1. Let items be the input value converted to an object.
  2. Let usingIterator be GetMethod(items, @@iterator).
  3. If usingIterator is not undefined, get iterator and iterate, pushing each result.value (mapped if mapFn) into the new array A.
  4. Otherwise, read length = ToLength(Get(items, "length")); loop k = 0..length-1, push Get(items, ToString(k)) (mapped if mapFn).
  5. If called as a method on a constructor C (this is a constructor), create the result array using SpeciesConstructor or Construct(C, length), otherwise create a standard Array.

Reference details
- Full signature: Array.from(arrayLike: Iterable|ArrayLike, mapFn?: Function(element, index), thisArg?: any) -> Array
- Parameter types and effects:
  - arrayLike: if null or undefined, a TypeError is thrown when conversion to object is attempted.
  - mapFn: if supplied and not callable, TypeError.
  - thisArg: used as this when invoking mapFn.
- Return value: a newly created Array instance containing the mapped/copied elements in order.
- Exceptions: TypeError for non-callable mapFn or invalid inputs when conversion fails.

Supplementary details and implementation patterns
- To obtain Unicode code points from a string for Hamming comparisons, normalize input to a consistent normalization form if required (NFC/NFD) using String.prototype.normalize, then use Array.from(normalizedString) to get an array of characters (code points).
- For performance with large strings, iterating with a for..of loop over the String iterator or using a simple Array.from without a mapping function is efficient and uses native iteration.

Detailed digest
Source: MDN Web Docs — Array.from (developer.mozilla.org)
Retrieved: 2026-03-18
Bytes retrieved during crawl: 171639
Key technical content used: method signature, iterable vs array-like retrieval algorithm, map function semantics, explicit note that string iteration yields Unicode code points (surrogate pairs are combined), and constructor/spec interaction when called on subclasses.

Attribution
Source URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
Data retrieved: 2026-03-18; 171639 bytes
License / attribution: MDN content (Mozilla) — consult original page for full attribution and licensing.
