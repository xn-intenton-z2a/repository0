# Format Conversion

This feature implements the `convert` CLI command to enable bidirectional conversion between `.env`, JSON, and YAML formats.

## Usage

- Convert `.env` to JSON (default):
  ```bash
  npm run start -- convert config.env
  ```
- Convert JSON to dotenv:
  ```bash
  npm run start -- convert data.json --to-env
  ```
- Convert JSON to YAML:
  ```bash
  npm run start -- convert data.json --to-yaml --output config.yaml
  ```
