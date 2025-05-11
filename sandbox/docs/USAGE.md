# CLI Usage

## convert

Convert a Markdown file to HTML.

**Usage:**

```
node src/lib/main.js convert <input.md>
node src/lib/main.js convert <input.md> -o <output.html>
```

By default, the rendered HTML is written to stdout. Use the `-o` or `--output` flag to specify an output file path.

**Examples:**

Convert and print HTML to stdout:

```sh
node src/lib/main.js convert docs/guide.md
```

Convert and write HTML to a file:

```sh
node src/lib/main.js convert docs/guide.md -o guide.html
```
