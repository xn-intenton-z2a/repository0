NORMALISED EXTRACT

Table of contents:
- SIGNATURE
- PARAMETERS
- BEHAVIOUR (step-by-step)
- MAP FUNCTION semantics
- COMMON PATTERNS FOR RANGE GENERATION
- ERROR CONDITIONS

SIGNATURE
Array.from(arrayLike[, mapFn[, thisArg]]) -> Array

PARAMETERS
- arrayLike: An iterable or array-like object (object with length property or conforms to the iterable protocol).
- mapFn (optional): Function called on each element of the new array. Called with two arguments: (currentValue, index). If provided and not callable, a TypeError is thrown.
- thisArg (optional): Value used as this when executing mapFn.

BEHAVIOUR (step-by-step)
1. Determine whether arrayLike is iterable (has Symbol.iterator). If so, iterate it. Otherwise, treat it as array-like and read properties 0..length-1 where length is ToLength(arrayLike.length).
2. Construct a new Array instance with the derived length.
3. For each element from source produce an entry in the new array; if mapFn is supplied invoke mapFn with (element, index) and assign its return value into the target array.
4. Return the newly constructed Array.

MAP FUNCTION SEMANTICS
- mapFn is invoked for every index in order from 0 to length-1 with two parameters: element and index.
- If mapFn throws, the exception propagates and Array.from does not return.
- thisArg binds to the this value when calling mapFn.

COMMON PATTERNS FOR RANGE GENERATION (directly applicable to fizzBuzz)
- Generate integer sequence 1..n using: Array.from({length: n}, (_, i) => i + 1)
- Combine with mapping: Array.from({length: n}, (_, i) => computeFizzBuzz(i + 1)) produces the full result array in one expression.

ERROR CONDITIONS
- If arrayLike is null or undefined, a TypeError is thrown.
- If mapFn is provided but is not callable, a TypeError is thrown.

DETAILED DIGEST
Source: MDN "Array.from()" retrieved 2026-03-21.
Data size fetched during crawl: approximately 167.6 KB.
Source URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from

ATTRIBUTION
Content adapted from MDN Web Docs. Retrieved 2026-03-21.
