# FIZZBUZZ_STREAM

Summary

Add a small, well-scoped streaming export to the canonical library that produces FizzBuzz output as a Node.js Readable stream. This feature enables incremental consumption of results, backpressure-friendly processing for large n, and streaming-friendly demos and examples without allocating the full sequence in memory.

Specification

Public export (src/lib/main.js)

- fizzBuzzStream(n, options)
  - Description: Return a Node.js Readable stream that yields the canonical FizzBuzz values for integers 1..n according to the library's canonical rules. The stream is UTF-8 text by default and emits one item at a time under normal usage, respecting Node backpressure semantics.
  - Parameters:
    - n: number — integer, validated by the library's centralised validation rules (same error types and message substrings as fizzBuzz/fizzBuzzSingle).
    - options: optional object with keys:
      - mode: string — 'lines' (default) or 'json'. 'lines' emits each canonical value as a UTF-8 string followed by a newline. 'json' emits a single, well-formed JSON array as a stream without buffering the entire array in memory; the array must be emitted incrementally with correct separators and brackets.
      - labels: optional object { fizz?: string, buzz?: string } — display-only overrides for the words Fizz and Buzz; when provided the stream should call the library's additive localisation helpers (e.g., fizzBuzzSingleWithWords or fizzBuzzWithWords) for formatted output but must not alter canonical fizzBuzz/fizzBuzzSingle behaviour or return values from non-stream APIs.
      - encoding: optional string — default 'utf8'; passed to the Readable so consumers can change encoding if desired.
  - Behaviour:
    - The returned object is an instance of stream.Readable (require('stream').Readable).
    - In 'lines' mode each push is the canonical string for the next integer plus the newline character; the stream ends after n items and emits 'end'.
    - In 'json' mode the stream emits the '[' then each value serialized via JSON.stringify with commas between entries and then the closing ']' so consumers may parse the combined stream as a JSON array; the implementation must not buffer the entire array and must respect backpressure.
    - For invalid parameters the stream must emit an 'error' event (the same RangeError/TypeError types used by the canonical validation) and must not emit further data.
    - The stream implementation must reuse canonical validation logic and helper functions; it must not reimplement validation or core replacement logic.

Validation and errors

- Reuse the canonical validation routine used by fizzBuzz/fizzBuzzSingle so thrown error types and messages are stable for unit tests (TypeError vs RangeError and messages containing integer, finite or >=/<= substrings as specified in FIZZBUZZ_CORE).
- If options is provided but not an object, throw TypeError('options must be an object'). If mode is present but not one of the allowed strings, throw TypeError('mode must be "lines" or "json"'). If labels is present but not an object throw TypeError('labels must be an object').

Testing guidance

- Unit tests (tests/unit/) should import fizzBuzzStream from src/lib/main.js and verify:
  - Reading the stream in 'lines' mode for n=15 yields 15 newline-terminated strings that match fizzBuzz(15) when trimmed; the last non-empty trimmed line equals 'FizzBuzz'.
  - Reading the stream in 'json' mode for n=15 produces a concatenated string parseable by JSON.parse that equals JSON.stringify(fizzBuzz(15)) when parsed and compared.
  - Providing labels { fizz: 'Foo', buzz: 'Bar' } causes the streamed display values to contain Foo/Bar/FooBar at the same positions as Fizz/Buzz/FizzBuzz, while canonical library outputs remain unchanged.
  - Invalid n causes the stream to emit an 'error' event with the appropriate error type and message substring.
  - Non-object options or invalid mode cause TypeError to be emitted on the stream.
  - The stream respects backpressure: unit test can create a slow consumer that reads chunk-by-chunk and assert all items are delivered in order.

Examples and usage

- README: add a short example showing how to consume the 'lines' stream with async iteration or by piping to process.stdout, and how to consume 'json' mode by accumulating chunks and JSON.parse when complete. Keep examples minimal and rely on the exported API only.
- examples/: add a tiny examples/stream-run.js that imports fizzBuzzStream, consumes n=15 in 'lines' mode and prints to stdout; exit 0 on success.

Acceptance criteria

- A named export fizzBuzzStream exists in src/lib/main.js and returns an instance of stream.Readable.
- 'lines' mode for n=15 emits 15 newline-terminated items and the last item equals 'FizzBuzz' when trimmed.
- 'json' mode for n=15 produces a valid JSON array equivalent to JSON.stringify(fizzBuzz(15)) without buffering the full result in memory before emitting.
- Labels override display only and do not change canonical outputs from other functions.
- Invalid inputs cause the stream to emit the same RangeError/TypeError messages or events as the canonical validation.

Implementation notes

- Implement fizzBuzzStream as a thin wrapper that performs validation then returns a custom Readable constructed with an internal counter and a _read implementation that pushes items until n is exhausted, respecting options.mode.
- Prefer using existing additive helpers (fizzBuzzSingle, fizzBuzzSingleWithWords or fizzBuzzGenerator) where available to produce values; do not duplicate core replacement logic.
- Keep the implementation dependency-free (use Node built-in stream module only) so no changes to package.json are required.

Rationale

Streaming is complementary to the existing generator and stats helpers and is particularly useful for large or interactive consumers, CLI piping and web server endpoints that should stream results incrementally rather than allocate large arrays.
