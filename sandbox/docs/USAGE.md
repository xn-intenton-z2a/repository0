# CLI Usage

This command-line interface supports the following options:

- `--help`: Display help information including usage instructions.
- `--version`: Display the current version of the application (retrieved from package.json).

## How to Run

Execute the CLI using npm run start with additional flags and arguments as needed:

```bash
npm run start -- [options] [arguments]
```

### Examples

- Display help information:
  ```bash
  npm run start -- --help
  ```

- Display version information:
  ```bash
  npm run start -- --version
  ```

- Run with positional arguments:
  ```bash
  npm run start -- arg1 arg2
  ```

If unsupported flags are provided, the CLI will output an error message along with the usage instructions.
