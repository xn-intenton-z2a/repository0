# Mission

Build a Markdown-to-HTML compiler library that converts GitHub Flavored Markdown (GFM) to
semantic HTML.

The library should progressively implement parsing and rendering for:
1. Headings (h1-h6 via `#` markers) and paragraphs
2. Inline formatting: bold (`**`), italic (`*`), code (`` ` ``), strikethrough (`~~`)
3. Links `[text](url)` and images `![alt](src)`
4. Ordered and unordered lists (including nested lists)
5. Code blocks (fenced with ``` and language annotation)
6. Blockquotes (nested `>`)
7. Tables (GFM pipe syntax with alignment)
8. Horizontal rules (`---`, `***`, `___`)
9. Task lists (`- [ ]`, `- [x]`)
10. Auto-linked URLs and HTML entity escaping

## Technical Requirements

- Pure JavaScript, no external Markdown parsing libraries
- Two-pass architecture: tokeniser/lexer pass, then renderer pass
- XSS-safe: all user content must be HTML-escaped before insertion
- Exported as both CommonJS and ESM

## Acceptance Criteria

- `compile(markdown)` returns an HTML string
- `tokenize(markdown)` returns an array of token objects (for inspection/testing)
- Handles all 10 feature areas listed above
- Passes a test suite of at least 30 input/output pairs covering edge cases
- Nested constructs work: bold inside links, links inside lists, code inside blockquotes
- A sample document is compiled and saved to `docs/examples/sample.html`
- Output validates as well-formed HTML (no unclosed tags)
