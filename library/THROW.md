THROW

Table of contents
- Grammar and usage
- Semantics (abrupt completion)
- Values thrown and accepted types
- Best practices for throwing
- Interaction with try/catch/finally
- Diagnostic patterns and rethrowing
- Digest and attribution

Grammar and usage
- Syntax: throw <expression>
- Execution: evaluate expression, then immediately terminate current execution with abrupt completion carrying the evaluated value

Semantics
- The thrown value can be any JavaScript value (Error object, primitive, object). There is no enforced type.
- throw interrupts normal control flow; control transfers to nearest enclosing catch handler matching the thrown completion

Values thrown and accepted types
- Common practice: throw instances of Error (TypeError, RangeError, custom Error subclasses) for interoperability and correct stack traces
- Throwing primitives (strings, numbers) is allowed but discouraged because they lack stack and name metadata

Best practices
- Throw Error objects: new Error(message), new TypeError(message), new RangeError(message) as appropriate
- Include descriptive messages and attach properties (code, details) if consumers rely on them
- Avoid throwing raw objects unless intentionally implementing a lightweight signal and document the shape

Interaction with try/catch/finally
- catch receives the thrown value as parameter and can inspect/transform/rethrow it
- finally always runs after try/catch blocks regardless of thrown state; use finally for cleanup

Diagnostic patterns and rethrowing
- When rethrowing, preserve original error (throw err) to maintain stack trace
- When wrapping, set cause or attach original error to preserve causal chain (modern Error supports cause option)

Digest
- Source: MDN throw statement
- Retrieved: 2026-03-14

Attribution and data size
- URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw
- Crawl size: 199093 bytes
