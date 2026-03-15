WORD_WRAP

Normalised extract

Table of contents:
1. Purpose
2. Signature
3. Options (complete list)
4. Behavior details
5. Examples and recommended defaults

Detailed information

Purpose
- word-wrap wraps input text to a specified column width inserting newline separators and optional indentation; suitable for formatting plain-text output.

Signature
- wrap(text: string, options?: object) -> string

Options (from README)
- width: Number — default 50. Maximum column width before wrapping.
- indent: String — default two spaces. String to prefix each wrapped line with (used for continued lines).
- newline: String — default '\n'. Sequence to insert at line breaks.
- escape: function(str) — default identity. Function applied to each line after splitting/wrapping.
- trim: Boolean — default false. Trim trailing whitespace from the returned string.
- cut: Boolean — default false. If true, break words longer than width to enforce max width.

Behavior details
- Wraps on word boundaries when possible; when cut is true, splits long words to fit width.
- Indentation applies to every wrapped line as configured by indent.
- escape() receives each line and should return a string; useful to post-process wrapped lines (e.g., XML/HTML escaping).

Reference details (API specifications)
- wrap(text: string, options?: { width?: number, indent?: string, newline?: string, escape?: (s:string)=>string, trim?: boolean, cut?: boolean }) -> string
- Defaults: width=50, indent='  ' (two spaces), newline='\n', escape=(s)=>s, trim=false, cut=false

Detailed digest
- Source: word-wrap README (npm registry)
- Registry fetched: https://registry.npmjs.org/word-wrap
- README length: 6329 characters
- Registry JSON size fetched: 37835 bytes
- Retrieved: 2026-03-15

Attribution
- word-wrap README (jonschlinkert/word-wrap) via npm registry
