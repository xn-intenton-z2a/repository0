sandbox/docs/README.md
# sandbox/docs/README.md
# repository0

A sandboxed CLI tool for converting Markdown to HTML and generating bullet-point summaries using OpenAI.

## Features

- **convert**  
  ```sh
  node sandbox/source/main.js convert <input.md> [-o <output.html>]
  ```
- **summarize**  
  ```sh
  node sandbox/source/main.js summarize <input.md> [-o <output.txt>]
  ```

## Prerequisites

- Node.js v20 or higher  
- `OPENAI_API_KEY` environment variable set

## Installation

```sh
npm install
```

## Usage

```sh
export OPENAI_API_KEY="your_api_key"
node sandbox/source/main.js convert sandbox/tests/fixtures/sample.md
node sandbox/source/main.js summarize sandbox/tests/fixtures/sample.md -o summary.txt
```

## Links

- [Mission](../../MISSION.md)
- [Contributing](../../CONTRIBUTING.md)
- [License](../../LICENSE.md)
- [Agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib)
sandbox/docs/USAGE.md
# sandbox/docs/USAGE.md
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
