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
