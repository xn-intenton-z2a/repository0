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

## List Emotions

You can list all supported emotion keywords as a JSON array using the `--list-emotions` (or shorthand `--list`) flag in CLI mode. Custom configurations are merged before listing.

### Example

Default emotions:
```bash
$ npm run start -- --list-emotions
["happy","sad","surprised","angry","neutral"]
```

With custom configuration:
```bash
$ npm run start -- --config custom.json --list-emotions
["happy","sad","surprised","angry","neutral","confused"]
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

## Diagnostics Mode

You can inspect runtime metadata by using the `--diagnostics` flag. This outputs a JSON object and exits immediately.

### JSON Schema

- version: string — Application version from `package.json`
- defaultEmotions: string[] — List of built-in emotion keywords
- loadedConfigPath: string|null — The path passed to `--config`, or `null` if none provided
- customEmotionsCount: number — Number of custom emotions loaded from config
- serveMode: boolean — `true` if `--serve` flag is present
- listMode: boolean — `true` if `--list-emotions` or `--list` flag is present

### Example Invocation

```bash
npm run start -- --diagnostics
```

### Sample Output

```json
{
  "version": "1.2.0-0",
  "defaultEmotions": [
    "happy",
    "sad",
    "surprised",
    "angry",
    "neutral"
  ],
  "loadedConfigPath": null,
  "customEmotionsCount": 0,
  "serveMode": false,
  "listMode": false
}
```
