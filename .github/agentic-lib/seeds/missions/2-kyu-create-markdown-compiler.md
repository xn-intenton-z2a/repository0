# Mission

Build a Markdown-to-HTML compiler library that converts GitHub Flavored Markdown (GFM) to semantic HTML.

## Required Capabilities

The library must parse and render these 10 GFM feature areas:

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

It must also provide a tokenization/inspection mode for testing intermediate representations.

## Technical Requirements

- Pure JavaScript, no external Markdown parsing libraries
- XSS-safe: all user content must be HTML-escaped before insertion. Specifically, compiling `<script>alert('xss')</script>` must produce escaped output with `&lt;script&gt;`, never executable script tags.
- Well-formed HTML output: every opening tag must have a matching closing tag. Self-closing tags (`<br/>`, `<img/>`) use XHTML syntax.
- Exported as both CommonJS and ESM

## Suggested Approach

A two-pass architecture (tokeniser/lexer pass, then renderer pass) works well for this problem, but any architecture that passes the acceptance criteria is acceptable.

## Requirements

- Export all public API as named exports from `src/lib/main.js`.
- Comprehensive test suite covering: 1 test per feature area (10 minimum), nesting combinations (bold in links, links in lists, code in blockquotes — 5 minimum), edge cases (empty input, single character, whitespace only, deeply nested lists — 5 minimum).
- README with usage examples.

## Acceptance Criteria

- [ ] Compiling markdown returns an HTML string
- [ ] Tokenizing markdown returns an array of token objects for inspection
- [ ] Handles all 10 feature areas listed above
- [ ] Nested constructs work: bold inside links, links inside lists, code inside blockquotes
- [ ] Compiling `<script>alert('xss')</script>` produces `&lt;script&gt;` (XSS-safe)
- [ ] A sample document is compiled and saved to `docs/examples/sample.html`
- [ ] Output is well-formed HTML (every opening tag has a matching closing tag)
- [ ] All unit tests pass
