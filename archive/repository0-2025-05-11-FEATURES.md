sandbox/features/MD_TO_HTML.md
# sandbox/features/MD_TO_HTML.md
# Overview
Extend the CLI to convert a Markdown file into HTML. Leverage the existing markdown-it and markdown-it-github dependencies to parse and render Markdown syntax, producing an HTML document suitable for further processing or preview.

# CLI Usage
Invoke the converter via the main script:

  node src/lib/main.js convert <input.md> [-o <output.html>]

- The `convert` command must be the first argument.
- `<input.md>` is the path to the source Markdown file.
- Optional `-o <output.html>` writes the HTML output to the specified file; otherwise, HTML is written to stdout.

# Implementation Details
1. Detect the `convert` command in `main(args)`.  
2. Parse and validate positional arguments: input path, optional `-o` flag and output path.  
3. Read the input file asynchronously.  
4. Instantiate `markdown-it` with `markdown-it-github` plugin.  
5. Render the Markdown content into HTML.  
6. Write the result to the output file if provided, or to stdout.  
7. Exit with status code 0 on success, non-zero on error.

# File Changes
- **src/lib/main.js**: Add command dispatch for `convert`, file I/O and Markdown rendering logic.  
- **package.json**: Ensure `markdown-it` and `markdown-it-github` are listed in dependencies.  
- **tests/unit/md-to-html.test.js**: Create unit tests to cover valid conversion, missing input, and error handling.  
- **README.md**: Document the new `convert` command under CLI Usage with examples.sandbox/features/CONFIG_VALIDATOR.md
# sandbox/features/CONFIG_VALIDATOR.md
# Overview
Add a new CLI command to load and validate environment variables from a .env file. This feature ensures required configuration values are present and correctly typed before other commands run, preventing runtime errors due to missing or misconfigured environment settings.

# CLI Usage
Invoke the validator via the main script:

  node src/lib/main.js validate-config [-e <envFile>]

- The `validate-config` command must be the first argument.
- Optional `-e <envFile>` specifies the path to the env file; defaults to `.env` in the project root.
- On success, the validated configuration is printed as JSON to stdout and exit code is 0.
- On validation failure, errors describing missing or invalid keys are printed to stderr and exit code is non-zero.

# Implementation Details
1. Detect the `validate-config` command in the main dispatch logic.
2. Parse the optional `-e` flag to determine the env file path, using `minimist` or manual parsing.
3. Load environment variables from the specified file using `dotenv`.
4. Define a Zod schema for the expected configuration keys (e.g., OPENAI_API_KEY as non-empty string, ISSUE_TO_CODE_CONVERSION_RATE as a number between 0 and 1).
5. Validate the loaded environment object against the schema.
6. On success, serialize the parsed config object to JSON and write to stdout.
7. On failure, iterate schema errors, print human-readable messages to stderr.

# File Changes
- **src/lib/main.js**: Extend command dispatch to handle `validate-config`, implement flag parsing, env loading, schema definition, validation logic, and output behavior.
- **package.json**: Ensure `dotenv` and `zod` remain listed under dependencies, no new packages required.
- **sandbox/tests/validate-config.test.js**: Add unit tests covering valid .env loading, missing file, missing keys, and invalid value types, verifying stdout or stderr and exit codes.
- **README.md**: Document the `validate-config` command under CLI Usage with examples of success and failure cases.
sandbox/features/MD_TOC_GENERATOR.md
# sandbox/features/MD_TOC_GENERATOR.md
# Overview
Add a new CLI command that generates a Table of Contents (TOC) for a Markdown file. The feature reads a Markdown document, extracts all heading levels, and outputs a nested markdown list reflecting the document structure. This helps users quickly navigate or include a TOC in their documentation.

# CLI Usage

toc <input.md> [-o <output.md>]
- The `toc` command must be the first argument.
- `<input.md>` is the path to the source Markdown file.
- Optional `-o <output.md>` writes the generated TOC to the specified file; otherwise the TOC is written to stdout.

# Implementation Details

1. Extend the main dispatch in `sandbox/source/main.js` to recognize the `toc` command.
2. Parse positional arguments and the optional `-o` flag using minimist.
3. Verify that `<input.md>` is provided; throw an error if missing.
4. Read the Markdown file asynchronously using `fs/promises`.
5. Import `MarkdownIt` from `markdown-it` and parse the file into tokens.
6. Iterate tokens to identify heading tokens (levels 1 through 6) and capture their text and depth.
7. Build a nested markdown list string where each heading is prefixed by indentation based on its level, e.g.:  
   - `- Heading 1`
     - `  - Subheading 1.1`
     - `  - Subheading 1.2`
8. Write the TOC string to the output file if `-o` is provided; otherwise return it for printing to stdout.
9. Use exit code 0 on success, non-zero on missing input, file I/O errors, or parsing errors.

# File Changes

- **sandbox/source/main.js**: Add dispatch logic for `toc`, argument parsing, file reading, heading extraction, TOC generation, and output handling.
- **sandbox/tests/toc.test.js**: Create unit tests covering a file with multiple heading levels, verifying correct nested list output, and testing both stdout and file write behavior.
- **sandbox/docs/README.md**: Document the new `toc` command under CLI Usage with examples.
- **package.json**: Ensure `markdown-it` remains listed and no new dependencies are required.sandbox/features/JSON_YAML_CONVERTER.md
# sandbox/features/JSON_YAML_CONVERTER.md
# Overview
Add two new CLI commands to convert data between JSON and YAML formats. Leverage the existing js-yaml dependency to parse and serialize documents, enabling seamless round-trip conversion suitable for configuration files, data exchange, and documentation.

# CLI Usage

json2yaml <input.json> [-o <output.yaml>]
- `<input.json>` is the path to a JSON file to convert.
- Optional `-o <output.yaml>` writes the YAML output to the specified file; otherwise YAML is written to stdout.

yaml2json <input.yaml> [-o <output.json>]
- `<input.yaml>` is the path to a YAML file to convert.
- Optional `-o <output.json>` writes the JSON output to the specified file; otherwise JSON is written to stdout.

# Implementation Details
1. Extend main(args) in sandbox/source/main.js to detect the commands json2yaml and yaml2json.
2. Parse the positional input path and optional `-o` flag with minimist (alias o for output).
3. Read the input file asynchronously using fs/promises readFile.
4. For json2yaml:
   - Parse the file content with JSON.parse.
   - Serialize to YAML using jsYaml.dump.
5. For yaml2json:
   - Parse the file content with jsYaml.load.
   - Serialize to JSON with JSON.stringify(..., null, 2).
6. Write the serialized output to the output path if provided, else to stdout.
7. Use exit code 0 on success and non-zero on file I/O or parsing errors, printing descriptive messages to stderr.

# File Changes
- sandbox/source/main.js: Add dispatch and implementation for json2yaml and yaml2json commands, argument parsing, file I/O, and format conversion logic.
- package.json: Ensure js-yaml remains listed in dependencies (no new packages required).
- sandbox/tests/json-yaml.test.js: Create unit tests covering valid conversions, missing input, invalid syntax, file output, and stdout behavior.
- sandbox/docs/README.md: Document the new json2yaml and yaml2json commands under CLI Usage with examples.sandbox/features/EQUATION_PLOTTER.md
# sandbox/features/EQUATION_PLOTTER.md
# Overview
This feature adds a plot command to the CLI tool that generates an SVG representation of a specified mathematical function. The initial implementations support quadratic and sine functions. Users can produce vector graphics output suitable for embedding in HTML, documentation, or further processing.

# CLI Usage
The plot command supports two function types:

- plot quadratic a b c [-o outputFile]
  Users supply three numeric coefficients a, b, and c. The command generates an SVG displaying y = a x^2 + b x + c over a fixed domain.

- plot sine amplitude frequency [-o outputFile]
  Users supply amplitude and frequency values. The command generates an SVG displaying y = amplitude * sin(frequency * x) over a fixed domain.

If outputFile is provided the SVG is written to that file. Otherwise the SVG is written to stdout.

# Implementation Details
1. Extend main(args) to detect the plot command and dispatch to a plotting function.
2. Parse and validate positional arguments using minimist. Provide clear error messages on missing or invalid parameters.
3. Compute a fixed number of sample points (for example 100 points) over a normalized x range such as -10 to +10.
4. Generate an SVG string with a polyline or path element that connects the computed points. Use a fixed viewport size (for example width 500 and height 300) and scale the computed values accordingly.
5. Import fs/promises to write the SVG string to a file if the -o flag is present, otherwise write to process.stdout.
6. Implement appropriate exit codes: zero on success, non-zero on argument parsing or file write errors.

# File Changes
- src/lib/main.js: Add dispatch for plot command, argument parsing, numeric validation, sample computation, SVG string generation, file I O, and error handling.
- sandbox/tests/plot.test.js: Create unit tests covering both quadratic and sine modes, verifying that the generated SVG string includes an opening svg tag and a path or polyline element, testing both stdout and file write behavior.
- README.md: Document the new plot command under CLI Usage with two examples: one for quadratic and one for sine, showing both stdout and file output.
- package.json: Ensure minimist dependency is used for argument parsing and no additional dependencies are added.sandbox/features/MD_SUMMARIZER.md
# sandbox/features/MD_SUMMARIZER.md
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