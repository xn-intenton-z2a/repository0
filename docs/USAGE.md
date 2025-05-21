# CLI Usage

The `repository0` CLI supports displaying emotions as ASCII art.

## Usage

```bash
npm run start -- --emotion <name>
```

### Examples

Display a happy face:

```bash
npm run start -- --emotion happy
```

Output:

```
:-)
```

Unsupported emotion:

```bash
npm run start -- --emotion foo
```

Output:

```
Unsupported emotion: foo
Supported emotions: happy, sad, angry, surprised
```

No flag:

```bash
npm run start
```

Output:

```
Usage: --emotion <name>
Supported emotions: happy, sad, angry, surprised
```

## Supported Emotions

- happy
- sad
- angry
- surprised

For more details, see [features/DISPLAY_EMOTION.md](../features/DISPLAY_EMOTION.md).
