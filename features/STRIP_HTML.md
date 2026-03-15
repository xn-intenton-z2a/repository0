# STRIP_HTML

Overview
stripHtml removes HTML tags and decodes common HTML entities to plain text. It should handle nested tags and ignore HTML comments. Null or undefined returns empty string.

API
stripHtml(input) -> string

Behavior
- Remove all angle-bracketed tags and comments.
- Decode common named entities: amp, lt, gt, quot, apos, nbsp into their character equivalents.
- Collapse sequences of whitespace into single spaces where appropriate, and trim leading/trailing whitespace.

Acceptance criteria
- stripHtml("<p>Hello &amp; <strong>World</strong></p>") -> "Hello & World"
- stripHtml("<div>1 &lt; 2</div>") -> "1 < 2"
- stripHtml(null) -> "" (empty string)

Testing notes
Add unit tests for nested tags, tags with attributes, HTML comments, entity decoding, and inputs that already contain plain text.