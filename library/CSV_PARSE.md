Title: CSV_PARSE
Source: https://csv.js.org/parse/

TABLE OF CONTENTS:
1. Overview and purpose
2. Primary API signatures
3. Options (parse-time configuration) and their effects
4. Return types and streaming vs sync usage
5. Error handling and recovery options
6. Performance notes and streaming patterns
7. Reference details (option list and types)
8. Detailed digest
9. Attribution

NORMALISED EXTRACT:
Overview:
- csv-parse (csv.js) is a fast CSV parsing library for Node.js that provides both callback/Promise and streaming APIs. It supports configurable delimiters, quote handling, record conversion/casting, custom column mapping and incremental parsing.

Primary API signatures:
- parse(input: string|Buffer|Readable, options?: ParseOptions, callback?: (err, records) => void) => records | stream
- When used as a stream: const parser = parse(options); readable.pipe(parser).on('data', record => ...)

Key options (explicit types and default behaviors):
- delimiter?: string or Buffer (default: ',')
- columns?: boolean | string[] | function(headerRow) => columnsMapping
  - If true: uses first record as header row and returns objects keyed by header names.
  - If Array: uses provided array as keys for object records.
- skip_empty_lines?: boolean (default: false)
- from_line?: number (1-based) — start parsing from this line
- to_line?: number — stop parsing after this line
- relax_column_count?: boolean (default: false) — do not throw when field count varies
- cast?: boolean | function(value, context) => any — when true, cast values to native types (numbers, booleans) where possible or use provided function
- bom?: boolean (default: false) — strip UTF-8 BOM
- trim?: boolean | string ('start'|'end') — trim whitespace from fields
- quote?: string single-character quote (default: '"')
- escape?: string character used to escape quotes inside quoted fields (default: '"')

Return types and usage:
- parse with callback: callback receives (error, records) where records is array of arrays or array of objects when columns option used.
- parse returns a stream if no callback provided; attach on('readable')/on('data') listeners to process records incrementally.

Error handling:
- Parser emits an error event on malformed CSV unless options such as relax_column_count are used.
- For robust ingestion, use streaming API and implement on('error') handler and optionally on_record callback to validate/transform records.

REFERENCE DETAILS (option types):
- parse(input, options?: {
    delimiter?: string|Buffer,
    columns?: boolean|string[]|Function,
    skip_empty_lines?: boolean,
    from_line?: number,
    to_line?: number,
    relax_column_count?: boolean,
    cast?: boolean|Function,
    bom?: boolean,
    trim?: boolean|'start'|'end',
    quote?: string,
    escape?: string
  }, callback?: Function) => Array|Stream

DETAILED DIGEST:
- Source URL: https://csv.js.org/parse/
- Retrieved: 2026-03-15 (UTC)
- Crawled byte-size: 59015 bytes (HTML)

ATTRIBUTION:
Documentation extracted from csv.js (csv-parse) website — retrieved 2026-03-15.