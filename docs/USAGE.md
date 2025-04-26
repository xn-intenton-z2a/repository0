# Repository Template CLI Usage

This repository serves as a flexible template for new projects integrating automated CI/CD workflows and a simple CLI. It is designed to be easily customized to suit your project’s needs.

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

- **Unrecognized or Missing Command**: For any unrecognized command or if no command is given, the CLI displays the help message.

  **Example:**

  ```bash
  node src/lib/main.js
  ```

## Template Customization

This template is designed to be easily customized for your own projects. Here are some common customization steps:

1. **Update the package metadata**:
   - In `package.json`, change the "description" field to reflect your project’s purpose.
   - Modify the version field as needed.

2. **Modify CLI behavior**:
   - The CLI commands are implemented in `src/lib/main.js`. You can add, remove, or modify commands as needed. For example, to add a new command, extend the `main` function with additional conditions.

3. **Update documentation**:
   - Review and update documentation in this file to reflect any changes in CLI behavior or project configuration.
   - Update links to TEMPLATE-README.md, MISSION.md, and CONTRIBUTING.md in your project’s README to suit your customized template.

**Example: Adding a New CLI Command**

To add a custom command, such as `greet`, update `src/lib/main.js`:

```js
// Add this new command check inside main function
if (command === "greet") {
  console.log("Hello, welcome to your customized project!");
  return;
}
```

Then, update the documentation accordingly to describe the new command.

## Running the CLI

Use the following npm script to run the CLI:

```bash
npm run start
```

This will execute the `src/lib/main.js` file and display the appropriate output based on the provided command.