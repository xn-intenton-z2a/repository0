# Repository Template CLI Usage

This repository provides a basic CLI built with Node.js. The CLI now supports additional commands to improve user feedback and onboarding.

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

- **Unrecognized or No Command**: The CLI will output the received arguments.

  **Example:**

  ```bash
  node src/lib/main.js
  ```

  **Expected Output:**

  ```
  Run with: []
  ```

## Running the CLI

You can run the CLI using the following npm script:

```bash
npm run start
```
