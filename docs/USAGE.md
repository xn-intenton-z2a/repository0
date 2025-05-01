# CLI Utility Usage

This CLI utility provides enhanced command-line functionality through a set of subcommands. In addition to running the commands via the CLI, each command is also available as an individually exported function. This allows you to integrate CLI functionality directly into your scripts.

## Available Commands

- **diagnostics**
  - Description: Displays diagnostic information including a system check status.
  - CLI Example: `node src/lib/main.js diagnostics`
  - Library Usage:
    ```js
    import { diagnostics } from '@src/lib/main.js';
    diagnostics();
    ```

- **version**
  - Description: Displays the current version of the repository. The version is read from the package.json file.
  - CLI Example: `node src/lib/main.js version`
  - Library Usage:
    ```js
    import { version } from '@src/lib/main.js';
    version();
    ```

- **update**
  - Description: Initiates a simulated update process.
  - CLI Example: `node src/lib/main.js update`
  - Library Usage:
    ```js
    import { update } from '@src/lib/main.js';
    update();
    ```

- **plot**
  - Description: Generate an ASCII bar chart from a comma-separated list of numbers. Each bar is scaled relative to the maximum value (max bar length is 40 characters).
  - CLI Example: `node src/lib/main.js plot 10,20,30`
  - Library Usage:
    ```js
    import { plot } from '@src/lib/main.js';
    plot("10,20,30");
    ```

## Help Message

If no command or an invalid command is provided, the CLI will display a help message with usage instructions:

```
Usage: node src/lib/main.js <command>
Available commands:
  diagnostics - Display diagnostic information.
  version - Display current version information.
  update - Initiate update process.
  plot - Generate an ASCII bar chart from a comma-separated list of numbers.
```