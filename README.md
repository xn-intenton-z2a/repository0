# string-utils

A small JavaScript library of string utility functions exported from src/lib/main.js.

Available functions:

- slugify(str) — convert to URL-friendly slug (lowercase, hyphens, strip non-alphanumeric)
- truncate(str, maxLength, suffix?) — truncate with suffix (default "…"), don't break mid-word
- camelCase(str) — convert to camelCase
- kebabCase(str) — convert to kebab-case
- titleCase(str) — capitalise first letter of each word
- wordWrap(str, width) — wrap text at word boundaries to given width
- stripHtml(str) — remove HTML tags and decode common entities
- escapeRegex(str) — escape special regex characters
- pluralize(word, count) — basic English pluralisation
- levenshteinDistance(a, b) — compute edit distance between two strings

Examples

```js
import { slugify, truncate, camelCase, levenshteinDistance } from './src/lib/main.js';
console.log(slugify('Hello World!')); // hello-world
console.log(truncate('Hello World', 8)); // Hello…
console.log(camelCase('foo-bar-baz')); // fooBarBaz
console.log(levenshteinDistance('kitten', 'sitting')); // 3
```

See src/web/index.html for a browser demo and tests in tests/.
