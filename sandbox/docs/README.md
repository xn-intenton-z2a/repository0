# repository0

A CLI tool to convert and summarize Markdown files to HTML or concise bullet-point summaries using markdown-it, markdown-it-github, and OpenAI.

**Links**

- [Mission](../../MISSION.md)
- [Contributing](../../CONTRIBUTING.md)
- [License](../../LICENSE.md)
- [Agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib)

## Prerequisites

- Node.js v20 or higher
- Set your OpenAI API key in the environment:
  ```sh
  export OPENAI_API_KEY="your_api_key_here"
  ```
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

Summarize a Markdown file to bullet points:

```sh
node sandbox/source/main.js summarize <input.md>
```

Summarize and write to an output file:

```sh
node sandbox/source/main.js summarize <input.md> -o <output.txt>
```

## Examples

Using the sample markdown file located at `sandbox/tests/fixtures/sample.md`:

Convert to HTML and print:

```sh
node sandbox/source/main.js convert sandbox/tests/fixtures/sample.md
```

Summarize and print:

```sh
node sandbox/source/main.js summarize sandbox/tests/fixtures/sample.md
```

Summarize and write to a file:

```sh
node sandbox/source/main.js summarize sandbox/tests/fixtures/sample.md -o sandbox/tests/fixtures/summary.txt
```

## Sample Output (Convert)

```html
<h1>Sample</h1>
<p>This is a sample markdown file.</p>
```

## Sample Output (Summarize)

```
- Sample
- This is a sample markdown file.
```
