# Overview
Add a new CLI command that summarizes the contents of a Markdown file by leveraging the OpenAI chat completions API. This feature reads a Markdown document, sends it to the LLM for concise summarization, and outputs the result either to stdout or to a specified file.

# CLI Usage
summarize <input.md> [-o <output.txt>]
- The `summarize` command must be the first argument.
- `<input.md>` is the path to the source Markdown file to summarize.
- Optional `-o <output.txt>` writes the summary to the specified file; otherwise the summary is written to stdout.

# Implementation Details
1. Extend the main dispatch in `sandbox/source/main.js` to recognize the `summarize` command.
2. Parse positional arguments and the optional `-o` flag using minimist.
3. Verify that `<input.md>` is provided and that `process.env.OPENAI_API_KEY` is set; throw an error if either is missing.
4. Read the input Markdown file asynchronously.
5. Import `Configuration` and `OpenAIApi` from the `openai` package; instantiate the client using the API key.
6. Send a chat completion request with a system prompt to produce a bullet-point summary of the Markdown content.
7. Extract the summary text from the response object.
8. Write the summary to the output file if `-o` is provided; otherwise return it for printing to stdout.
9. Exit with status code 0 on success or non-zero on any error.

# File Changes
- **sandbox/source/main.js**: Add dispatch and implementation of the `summarize` function, file I/O, environment validation, and OpenAI API integration.
- **sandbox/tests/summarize.test.js**: Add unit tests that mock the OpenAI client to verify behavior on summary generation, file output, missing input, and missing API key.
- **sandbox/docs/README.md**: Document the new `summarize` command under CLI Usage with examples for stdout and file output.
- **package.json**: Ensure `openai` remains listed in dependencies; no additional packages required.