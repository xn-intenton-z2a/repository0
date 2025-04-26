# Repository Template CLI Usage

This repository provides a basic CLI built with Node.js. The CLI now includes an enhanced help command to assist users in understanding the available commands.

## Commands

- **version**: Prints the repository version.

  **Example:**

  ```bash
  node src/lib/main.js version
  ```

  **Expected Output:**

  ```
  2.1.0-0
  ```

- **diagnostics**: Prints diagnostic information as a JSON object including the Node.js version and a status message.

  **Example:**

  ```bash
  node src/lib/main.js diagnostics
  ```

  **Expected Output:**

  ```json
  {
    "nodeVersion": "vXX.XX.X",
    "message": "Diagnostics info: all systems operational"
  }
  ```

- **help**: Displays a help message with usage instructions and available commands.

  **Example:**

  ```bash
  node src/lib/main.js help
  ```

  **Expected Output:**

  ```
  Available commands:
    version      - Prints the version number.
    diagnostics  - Prints diagnostics information.
    help         - Displays this help message.

  Usage: node src/lib/main.js [command]
  ```

- **Unrecognized Command or No Command**: If an unrecognized command is provided or no command is given, the CLI defaults to displaying the help message.

  **Example:**

  ```bash
  node src/lib/main.js
  ```

  **Expected Output:**

  ```
  Available commands:
    version      - Prints the version number.
    diagnostics  - Prints diagnostics information.
    help         - Displays this help message.

  Usage: node src/lib/main.js [command]
  ```

## Running the CLI

You can run the CLI using the following npm script:

```bash
npm run start
```
