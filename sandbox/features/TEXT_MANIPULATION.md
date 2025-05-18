# Text Manipulation

## Convert Command

The convert command enables bidirectional conversion among .env, JSON, and YAML formats.

Usage:
convert <inputFile> [--to-json | --to-env | --to-yaml] [--output <file>]

- <inputFile>: Path to the source file. The extension determines parsing:
  - .env is parsed with dotenv.parse
  - .json is parsed with JSON.parse
  - .yaml or .yml is parsed with js-yaml.load
- Flags (--to-json, --to-env, --to-yaml) are mutually exclusive. If none is provided, default is --to-json.
- --output <file> writes the result to the specified file. Otherwise output is printed to stdout.

Behavior:
1. Validate presence of inputFile; on missing exit with code 1 and error message.
2. Read file content; on I/O error print message and exit with code 1.
3. Parse according to extension; unsupported extension yields error and exit code 1.
4. If more than one of --to-json, --to-env, --to-yaml is set, error and exit code 1.
5. Serialize data:
   - to JSON with 2-space indentation
   - to env format as lines KEY=VALUE
   - to YAML using js-yaml.dump
6. Write output to stdout or to the file specified by --output.
7. On serialization or write errors print the original error and exit code 1.

## Replace Command

The replace command (alias text-replace) performs search-and-replace operations on a text file.

Usage:
replace <filePath> --search <pattern> --replace <text> [--regex] [--flags <flags>] [--output <file>]

- <filePath>: Path to the input text file.
- --search: Literal string or regular expression pattern to find.
- --replace: Replacement string.
- --regex: Interpret the search pattern as a regular expression (default is literal search).
- --flags: JavaScript RegExp flags when --regex is used.
- --output <file>: Path to write the result. If omitted, output is printed to stdout.

Behavior:
1. Validate that filePath, --search, and --replace are provided; on missing arguments exit code 1.
2. Read file content; on I/O error print message and exit code 1.
3. If --regex is set, attempt to construct a RegExp using pattern and flags; on invalid regex error exit code 1.
4. Perform replacement:
   - Literal first occurrence when no --regex
   - Global or flagged replacement when --regex is used
5. Write the transformed content to stdout or to the file specified by --output.
6. On write errors print message and exit code 1.