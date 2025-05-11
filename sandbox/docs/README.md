# repository0

A CLI tool to convert Markdown files to HTML using markdown-it and markdown-it-github.

**Links**

- [Mission](../../MISSION.md)
- [Contributing](../../CONTRIBUTING.md)
- [License](../../LICENSE.md)
- [Agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib)

## Prerequisites

- Node.js v20 or higher
- Install dependencies by running:
  ```sh
  npm install
  ```

## Usage

Convert a Markdown file to HTML:

```sh
node sandbox/source/main.js convert <input.md>
```

Convert and write to an output file:

```sh
node sandbox/source/main.js convert <input.md> -o <output.html>
```

## Examples

Using the sample markdown file located at `sandbox/tests/fixtures/sample.md`:

```sh
node sandbox/source/main.js convert sandbox/tests/fixtures/sample.md
```

## Sample Output

An example of the rendered HTML:

```html
<h1>Sample</h1>
<p>This is a sample markdown file.</p>
```

## Additional Documentation

For more usage details, see [USAGE.md](USAGE.md).
