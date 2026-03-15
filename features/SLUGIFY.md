# SLUGIFY

Overview
Slugify converts arbitrary text into a URL-friendly slug suitable for paths and filenames. It is Unicode-aware, lowercases output, removes diacritics, replaces any sequence of non-alphanumeric characters with a single hyphen, collapses repeated hyphens, and trims leading/trailing hyphens. Null or undefined input returns an empty string.

Behavior
- Normalize Unicode using NFKD and remove combining marks.
- Convert to lowercase.
- Replace any run of characters that are not letters or numbers with a single hyphen.
- Collapse multiple hyphens into one and trim hyphens from ends.

API
slugify(input) -> string

Acceptance criteria
- slugify("Hello World!") -> "hello-world"
- slugify("Café au lait") -> "cafe-au-lait"
- slugify("  Leading and  Trailing  ") -> "leading-and-trailing"
- slugify("foo--bar") -> "foo-bar"
- slugify(null) -> "" (empty string)

Testing notes
Add unit tests covering ASCII and accented input, numbers, long strings, repeated punctuation, and empty values.