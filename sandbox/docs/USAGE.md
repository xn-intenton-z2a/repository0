# Usage Guide

## ARG_PARSER Feature

The ARG_PARSER feature enhances the CLI by providing robust parsing of command-line arguments. It supports several formats:

- **Long-form options (prefixed with `--`):**
  - **Key-Value Pairs:** Use an equal sign to assign a value. For example, `--config=prod` is parsed as `{ config: "prod" }`.
  - **Boolean Flags:** If no value is provided, the flag is set to `true`. For instance, `--help` is parsed as `{ help: true }`.

- **Short-form options (prefixed with `-`):**
  - Each character following the dash is considered a separate flag. For example, `-ab` is parsed as `{ a: true, b: true }`.

- **Positional Arguments:**
  - Any argument that does not start with `-` or `--` is collected into an array under the `_` key. For example, `file.txt` is parsed as `{ _: ["file.txt"] }`.

### Usage Example

Run the CLI with the following command:

```
npm run start -- --config=prod --help -ab file.txt
```

The expected output is a JSON string similar to:

```
{"config":"prod","help":true,"a":true,"b":true,"_":["file.txt"]}
```

*Note:* The CLI has been refactored for improved clarity and testability. It now separates argument parsing logic into a dedicated function and outputs the parsed arguments as a JSON string.
