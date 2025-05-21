# repository0
Create a CLI app that depicts emotion using facial expressions using ascii art.
This will be the emotion communication mechanism for an AI.
2025-05-21T19:37:40Z - Archiving intentïon to branch https://github.com/xn-intenton-z2a/repository0/tree/intention-2025-05-21T19-37Z

## Maintain Feature at 2025-05-21T19:37:56.004Z

Maintained feature DISPLAY_EMOTION.

Feature spec:

# DISPLAY_EMOTION

# Overview
This feature implements the CLI command to display an emotion as ASCII art. The user can specify an emotion name via the --emotion flag and get a corresponding ASCII art facial expression.

# Usage

- Run the CLI with an emotion flag: node src/lib/main.js --emotion happy
- The output will be ASCII art representing a happy face.

# Implementation

- Update src/lib/main.js to parse the --emotion argument.
- Maintain a mapping of supported emotions to ASCII art strings: happy, sad, angry, surprised.
- When the --emotion flag is provided, look up the ASCII art and console.log it.
- If the emotion is unsupported, display an error message listing supported emotions using process.exit with a non-zero code.

# Testing

- Add unit tests in tests/unit/main.test.js to capture stdout when running main(['--emotion', 'happy']) and compare to expected ASCII art.
- Test unsupported emotion to ensure the correct error message is printed and the process exits with code 1.
- Ensure existing tests still pass without errors when no flags are provided, defaulting to printing usage instructions.

Git diff:

```diff
\n\n// New [features/DISPLAY_EMOTION.md]:\n# DISPLAY_EMOTION

# Overview
This feature implements the CLI command to display an emotion as ASCII art. The user can specify an emotion name via the --emotion flag and get a corresponding ASCII art facial expression.

# Usage

- Run the CLI with an emotion flag: node src/lib/main.js --emotion happy
- The output will be ASCII art representing a happy face.

# Implementation

- Update src/lib/main.js to parse the --emotion argument.
- Maintain a mapping of supported emotions to ASCII art strings: happy, sad, angry, surprised.
- When the --emotion flag is provided, look up the ASCII art and console.log it.
- If the emotion is unsupported, display an error message listing supported emotions using process.exit with a non-zero code.

# Testing

- Add unit tests in tests/unit/main.test.js to capture stdout when running main(['--emotion', 'happy']) and compare to expected ASCII art.
- Test unsupported emotion to ensure the correct error message is printed and the process exits with code 1.
- Ensure existing tests still pass without errors when no flags are provided, defaulting to printing usage instructions.
```

LLM API Usage:

```json
{"prompt_tokens":5454,"completion_tokens":1305,"total_tokens":6759,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":1024,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

## Feature to Issue at 2025-05-21T19:38:48.498Z

Generated feature development issue https://github.com/xn-intenton-z2a/repository0/issues/2179 with title:

Implement DISPLAY_EMOTION CLI command with ASCII art output

And description:

We need to flesh out the DISPLAY_EMOTION feature end-to-end by updating the CLI, tests, and documentation. This single LLM invocation should touch only the following files:

1. **src/lib/main.js**
   - Parse `--emotion <name>` from the `args` array.
   - Define a mapping of supported emotions (`happy`, `sad`, `angry`, `surprised`) to ASCII art strings.
   - When `--emotion` is provided and supported, `console.log` the matching ASCII art and exit with code `0`.
   - If the emotion is unsupported, print an error message listing supported emotions to `console.error` and call `process.exit(1)`.
   - If no `--emotion` flag is provided, print a brief usage summary (listing the flag and supported emotions) and exit with code `0`.

2. **tests/unit/main.test.js**
   - Add unit tests to cover:
     - Supported emotions: verify that running `main(["--emotion","happy"])` logs the correct ASCII art and does not call `process.exit(1)`.
     - Unsupported emotion: verify that `console.error` is called with the correct message and `process.exit(1)` is invoked.
     - No flag: verify that the usage summary is printed and exit code is `0`.
   - Use Vitest spies/mocks (`vi.spyOn`, `vi.fn()`) to capture `console.log`, `console.error`, and `process.exit` calls.

3. **README.md**
   - Add a new "Usage" section demonstrating how to invoke the CLI with the `--emotion` flag and show example outputs for `happy` and an unsupported emotion.
   - List the supported emotions and link to the feature specification in `features/DISPLAY_EMOTION.md`.

**Acceptance Criteria**
- After changes, `npm test` passes all existing and new tests.
- `npm run start -- --emotion happy` displays the happy ASCII face.
- `npm run start -- --emotion foo` prints the error with supported-emotions list and exits with code `1`.
- Running `npm run start` (without flags) prints a usage summary and exits normally.

This change will fully realize the DISPLAY_EMOTION feature and deliver a complete user flow for interacting with emotions via ASCII art in the CLI.

LLM API Usage:

```json
{"prompt_tokens":5781,"completion_tokens":1255,"total_tokens":7036,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":704,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

