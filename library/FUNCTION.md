Title: FUNCTION
Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function

TABLE OF CONTENTS:
1. Overview
2. Constructor form and signature
3. Prototype methods (call, apply, bind, toString)
4. Properties (length, name)
5. Security and scope notes
6. Reference details (signatures)
7. Detailed digest
8. Attribution

NORMALISED EXTRACT:
Overview:
- Function is the built-in constructor for function objects. Using the Function constructor or function expressions both produce callable Function objects; Function objects are both callable and (unless native/bound) constructible.
- Function objects are objects with internal [[Call]] and possibly [[Construct]] behaviours; they inherit from Function.prototype.

Constructor signature:
- new Function([arg1[, arg2[, ...argN]],] functionBody: string) -> Function
  Behavior: each arg1..argN are strings that name parameters; the final argument is the function body source string. The created function's scope is the global scope (not the current local/closure scope) — do not use for runtime closures of local variables.

Prototype methods and behaviours:
- Function.prototype.apply(thisArg: any, argArray?: ArrayLike<any> | null) -> any
  Invokes the target function with 'this' set to thisArg and arguments from argArray. If argArray is null or undefined it is treated as an empty argument list.

- Function.prototype.call(thisArg: any, ...args: any[]) -> any
  Invokes the target function with 'this' set to thisArg and explicit arguments.

- Function.prototype.bind(thisArg: any, ...args: any[]) -> Function
  Returns a new bound function with [[BoundThis]]=thisArg and initial bound arguments. The bound function's length property is max(0, original.length - boundArgs.length).

- Function.prototype.toString() -> string
  Returns an implementation-dependent string representing source code of the function; modern engines return exact source when available. Can be used for serialization in controlled contexts.

Properties:
- Function.length: number (number of formal parameters declared on function, excluding rest parameters and default value parameters behavior per spec).
- Function.name: string (function's name property; can be inferred or set)

SECURITY & IMPLEMENTATION NOTES:
- The Function constructor (and eval) execute code in the global scope; avoid using them with untrusted input to prevent code injection.
- Bound functions and native/built-in functions may be non-constructible or have altered behaviour; check Function.prototype for capabilities.

REFERENCE DETAILS (explicit signatures):
- Function(...args: string[], body: string) -> Function
- Function.prototype.apply(thisArg: any, argArray?: ArrayLike<any> | null) -> any
- Function.prototype.call(thisArg: any, ...args: any[]) -> any
- Function.prototype.bind(thisArg: any, ...args: any[]) -> Function
- Function.prototype.toString() -> string
- Function.prototype.length -> number (read-only)
- Function.prototype.name -> string (read-only in many engines)

DETAILED DIGEST:
- Source URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
- Retrieved: 2026-03-15 (UTC)
- Crawled byte-size: 156476 bytes (HTML)

ATTRIBUTION:
Content extracted from MDN Web Docs (Mozilla) — page: Global_Objects/Function — retrieved 2026-03-15.