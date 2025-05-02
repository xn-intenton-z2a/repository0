# CLI Usage

This CLI application now supports enhanced argument parsing using the `minimist` library.

## Usage

```
node src/lib/main.js [options] [arguments]
```

## Options

- `--help` or `-h`: Display this help message.
- `--version`: Show the application version as specified in `package.json`.

## Examples

### Display help message

```
node src/lib/main.js --help
```

You should see output similar to:

```
Usage: <command> [options]

Options:
  --help, -h       Show help
  --version        Show version
```

### Display version

```
node src/lib/main.js --version
```

Expected output (for example):

```
2.1.0-0
```

### Passing additional arguments

```
node src/lib/main.js input.txt --mode fast --debug
```

The output will be a JSON string representing all parsed arguments, for example:

```
Run with: {"_": ["input.txt"], "mode": "fast", "debug": true}
```
