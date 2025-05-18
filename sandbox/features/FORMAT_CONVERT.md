# Format Conversion Feature

This feature provides the `convert` CLI command, enabling bidirectional conversion among `.env`, JSON, and YAML formats with strict flag validation.

## Command: convert

Convert between `.env`, `.json`, `.yaml`, and `.yml` formats.

### Flags (mutually exclusive)
- `--to-json` (default when no format flag is provided):
  Serialize input data to JSON with 2-space indentation.
- `--to-env`:
  Serialize input data to a dotenv-style file (`KEY=VALUE` lines).
- `--to-yaml`:
  Serialize input data to YAML.

> **Note:** You may specify at most one of these flags. Using more than one will result in an error.

### Usage

```bash
npm run start -- convert <input-file> [--to-json | --to-env | --to-yaml] [--output <output-file>]
```

- `<input-file>`: Path to the source file. Extension determines parsing:
  - `.env` → parsed with `dotenv.parse()`
  - `.json` → parsed with `JSON.parse()`
  - `.yaml`/`.yml` → parsed with `jsYaml.load()`
- If `--output` is provided, writes the result to the specified file; otherwise writes to stdout.

### Examples

Convert `.env` to JSON (implicit default):
```bash
npm run start -- convert settings.env
```

Convert `.env` to JSON (explicit):
```bash
npm run start -- convert settings.env --to-json
```

Convert JSON to YAML:
```bash
npm run start -- convert data.json --to-yaml
```

Convert YAML to `.env`:
```bash
npm run start -- convert config.yaml --to-env
```

Convert `.env` to YAML:
```bash
npm run start -- convert settings.env --to-yaml
```

Convert and write to file:
```bash
npm run start -- convert config.json --to-yaml --output config.yaml
```

### Error Conditions

- Specifying more than one of `--to-json`, `--to-env`, or `--to-yaml`:
  ```text
  Error: Specify exactly one of --to-json, --to-env, or --to-yaml
  ```
- Unsupported input extension:
  ```text
  Unsupported input format: .txt
  ```
- Parsing or I/O errors propagate original error messages and exit with code 1.
