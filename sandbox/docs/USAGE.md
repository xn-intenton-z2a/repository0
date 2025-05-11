# CLI Usage

## convert

Convert a Markdown file to HTML.

**Usage:**

```sh
node sandbox/source/main.js convert <input.md>
node sandbox/source/main.js convert <input.md> -o <output.html>
```

By default, the rendered HTML is written to stdout. Use the `-o` or `--output` flag to specify an output file path.

## summarize

Generate a bullet-point summary of a Markdown file.

**Usage:**

```sh
node sandbox/source/main.js summarize <input.md>
node sandbox/source/main.js summarize <input.md> -o <output.txt>
```

By default, the summary is written to stdout. Use the `-o` or `--output` flag to specify an output file path.
