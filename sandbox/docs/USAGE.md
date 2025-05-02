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

### Configuration Validation

The CONFIG_VALIDATOR feature leverages the Zod library to ensure that critical environment variables are present and correctly formatted before the application runs. The following validations are performed at runtime:

- `APP_ENV`: Must be present as a string.
- `PORT`: Must be provided (as a string representing a number) and is automatically converted to a number.

If validation fails (for example, if `PORT` is missing or not a numeric value), the application will log an error message and terminate. This approach enhances system reliability by catching configuration issues early.

**Usage Example:**

Before running the application, set the environment variables appropriately:

```
export APP_ENV=production
export PORT=3000
```

Then run:

```
npm run start
```

The application will output a message similar to:

```
Validated Config: {"APP_ENV":"production","PORT":3000}
Run with: [ ... ]
```

### Usage Example with ARG_PARSER

Run the CLI with the following command:

```
npm run start -- --config=prod --help -ab file.txt
```

The expected output is a JSON string similar to:

```
{"config":"prod","help":true,"a":true,"b":true,"_":["file.txt"]}
```

*Note:* The CLI has been refactored for improved clarity and testability. It now separates argument parsing logic into a dedicated function and outputs the validated configuration along with the parsed arguments.
