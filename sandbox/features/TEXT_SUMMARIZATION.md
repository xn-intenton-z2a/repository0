# Text Summarization

## CLI Behavior

Introduce a new top-level command summarize to generate concise summaries of text or markdown files using the OpenAI ChatCompletion API.

Usage:

npm run start -- summarize <inputFile> [--model <model>] [--output <file>] [--apiKey <envVarName>]

- <inputFile>: Path to a text or markdown file to summarize.
- --model: OpenAI model to use (default gpt-3.5-turbo).
- --output: File path to write the summary; defaults to stdout.
- --apiKey: Name of the environment variable containing the OpenAI API key; defaults to OPENAI_API_KEY.

Behavior:

- Validate that inputFile exists and is readable; on failure print error and exit code 1.
- Retrieve API key from process.env or the named envVar; exit with error if missing.
- Read file content, build a chat completion prompt requesting a summary of the content.
- Instantiate OpenAIApi client and call createChatCompletion with system and user messages.
- On success, output the returned summary text to stdout or write it to the specified file.
- On API or network error, print descriptive message and exit code 1.

## Implementation

- sandbox/source/main.js:
  - Import Configuration and OpenAIApi from the openai package.
  - Add a new case "summarize" in the CLI switch to invoke doSummarizeCommand(argv).
  - Implement async function doSummarizeCommand(argv):
    - Validate argv._[1] and extract flags for model, output, apiKey.
    - Read and verify file contents.
    - Configure OpenAIApi client with the API key.
    - Call client.createChatCompletion with a prompt that asks for a brief summary of the input text.
    - Process the response and handle errors.
    - Handle writing summary to file or printing to console.

## Testing

- sandbox/tests/summarize.test.js:
  - Stub the OpenAIApi client to return a mock summary response.
  - Write a temporary input file, invoke node sandbox/source/main.js summarize and assert the summary is printed.
  - Test custom model flag, missing API key error, invalid file path, and output flag writing to file.

## Documentation

- README.md and sandbox/docs/CLI_USAGE.md:
  - Add a section for the summarize command under Commands Reference.
  - Document usage example using default and custom flags.