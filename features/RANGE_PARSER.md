# RANGE_PARSER

## Summary

RANGE_PARSER defines a focused, testable feature for parsing and validating range flag syntax used by the library and CLI (for example: --range "x=-10:10:200"). It standardises how numeric ranges and sample counts are represented, validated, and normalised into the numeric parameters used by generateSeries. This feature is intentionally small, pure, and implementable entirely inside src/lib/main.js with unit tests in tests/unit/main.test.js.

## Motivation

Parsing ranges is a distinct responsibility from expression parsing and plotting. A clear, well-tested range parser improves CLI ergonomics, makes series generation deterministic, and reduces duplicated range-handling logic across the codebase and website examples.

## Behaviour and API

- Library exports (add to src/lib/main.js):
  - parseRange(rangeString: string) -> { varName: string, min: number, max: number, samples: number }
    - Accepts a single-variable range expression of the form var=min:max or var=min:max:samples.
    - Returns parsed numeric values: min, max and samples (samples default 200 when absent).
  - parseRangeMap(rangeString: string) -> Record<string, { min:number, max:number, samples:number }>
    - Accepts comma-separated ranges for multiple variables, e.g. "x=-1:1:100,y=0:10:50".
    - Returns mapping from variable names to their parsed numeric ranges.
  - normalizeRange(parsed, defaults?) -> { xMin, xMax, samples }
    - Helper that converts parseRange output into the shape expected by generateSeries.

- Accepted syntax:
  - Single variable: var=min:max or var=min:max:samples
  - Multiple variables separated by commas: var1=min:max[:samples],var2=min:max[:samples]
  - Numeric literals: integers, decimals, and scientific notation (e.g. 1e-3).
  - Whitespace around tokens is allowed and ignored.

- Semantics and validation:
  - samples must be an integer >= 2 and <= 100000 (configurable constant).
  - min and max are finite numbers; min may equal max (edge-case producing repeated x values).
  - If min > max, parseRange throws a descriptive Error unless caller supplies an option to allow decreasing ranges.
  - Unknown or malformed tokens produce a descriptive parse error (including position where possible).

## Acceptance Criteria

- parseRange exists and correctly parses canonical inputs such as "x=-10:10", "x=0:1:101", and returns numbers and default samples when omitted.
- parseRangeMap parses comma-separated multiple variable ranges and returns a complete mapping.
- Validation errors are thrown for malformed strings, non-numeric values, sample counts <2 or >100000, and min/max NaN.
- normalizeRange converts parsed output into the exact parameter object expected by generateSeries and unit tests assert the endpoints and sample counts.
- Unit tests in tests/unit/main.test.js include positive and negative cases for parseRange and parseRangeMap and are deterministic.

## Testing and Validation

- Tests to add or extend in tests/unit/main.test.js:
  - parseRange.validExamples: verify return values for typical ranges and default samples.
  - parseRange.invalidExamples: assert thrown errors for bad formats, non-numeric tokens, samples=1, and samples too large.
  - parseRangeMap.multipleVars: verify mapping for two or more variables.
  - normalizeRange.edgeCases: verify behaviour when min==max and when samples is explicitly provided.

## Implementation Notes

- Implement a small tokenizer + deterministic parser inside src/lib/main.js; avoid any new heavy dependencies.
- Keep parsing code pure and side-effect free to ease unit testing.
- Expose clear error messages to aid CLI error reporting.

## Backwards Compatibility

- If a previous range parsing helper exists in src/lib/main.js, extend it with the exact API above and keep previous callers working by exporting normalizeRange.

## Notes for Contributors

- Follow CONTRIBUTING.md when adding tests and avoid changing unrelated files.
- Keep the parser small and well-documented.
