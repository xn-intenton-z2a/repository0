# Text Manipulation

This feature supports literal and regex-based search and replace operations on text files.

## Flags

- `--search <pattern>` (required): String or regex pattern to search for.
- `--replace <string>` (required): Replacement string.
- `--regex`: Treat `<pattern>` as a regular expression.
  - When `--regex` is provided without any `--flags`, the regex is applied globally (default `g` flag).
- `--flags <regexFlags>`: Specify flags for regex replacement (e.g., `gi`).
- `--all`: Perform global literal replacements when `--regex` is not provided.
- `--output <file>`: Write the replaced output to a file instead of stdout.

## Behavior

- Literal replacement without `--all` replaces only the first occurrence.
- Literal replacement with `--all` replaces all occurrences.
- Regex replacement without `--flags` defaults to global replacement.
- Regex replacement with `--flags` uses the provided flags.

## Examples

Replace only the first occurrence:

```bash
npm run start -- replace file.txt --search foo --replace bar
```

Replace all occurrences literally:

```bash
npm run start -- replace file.txt --search foo --replace bar --all
```

Replace all occurrences using regex by default:

```bash
npm run start -- replace file.txt --search "a" --replace "x" --regex
```

Replace case-insensitive globally with explicit flags:

```bash
npm run start -- replace file.txt --search "foo" --replace "bar" --regex --flags gi
```
