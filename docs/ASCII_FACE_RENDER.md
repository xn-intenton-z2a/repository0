# ASCII Face Renderer

Users can display multi-line ASCII art faces corresponding to emotions via the CLI.

## Usage

Positional argument:

```bash
npm run start -- happy
```

Flag usage:

```bash
npm run start -- --emotion sad
```

## Supported Emotions

| Emotion   | ASCII Art |
| --------- | --------- |
| happy     | ^_^       |
| sad       | T_T       |
| surprised | O_O       |
| angry     | >:(       |
| neutral*  | -_-       |

*neutral is default for unknown or missing emotion

## Examples

```bash
$ npm run start -- surprised

  O_O

$ npm run start

  -_-
```

## Custom Configuration

You can provide a custom JSON or YAML configuration file defining your own emotion-to-ASCII mappings using the `--config <path>` flag. Custom definitions override defaults, and defaults fill in any missing emotions.

### Supported Formats

- JSON files (`.json`): Parsed with `JSON.parse`
- YAML files (any other extension): Parsed with `js-yaml`

Values must be strings representing the ASCII frame (including newline characters as needed).

### Example JSON

```json
{
  "confused": "\n  o_O\n"
}
```

### Example YAML

```yaml
confused: |
  o_O
```

### Usage with Config

```bash
npm run start -- --config custom.json confused
npm run start -- --config custom.yaml happy
```
