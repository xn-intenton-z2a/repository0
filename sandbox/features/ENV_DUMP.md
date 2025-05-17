# Summary

Implement an env command to load environment variables from a .env file and display them as JSON through the CLI, showcasing configuration management.

# Behavior

* When run with the env command and no additional arguments, load environment variables using dotenv.config and print all loaded variables as a JSON object.
* When run with env followed by one or more variable names, print only those variables as JSON. For any requested variable that is not set, include it with a null value and print a warning message to stderr.
* If the .env file is missing or cannot be parsed, print an error message to stderr and exit with code 1.

# Implementation

1. In src/lib/main.js, import dotenv and call dotenv.config() at the start of the env command handler.
2. Add an "env" entry in the command router mapping to a handler function.
3. In the handler, collect process.env into a plain object filtered by requested keys if provided.
4. Log warnings for missing keys and assemble the result object mapping each key to its value or null.
5. Serialize the result object to JSON and print it to stdout.
6. Exit with status code 1 on fatal errors (e.g., dotenv failure).

# Tests

* main(["env"]) prints a JSON object that includes known environment variables (e.g., NODE_ENV).
* main(["env","FOO"]) when FOO is set in a test .env file prints {"FOO":"value"}.
* main(["env","BAR"]) when BAR is unset prints {"BAR":null} and logs a warning.
* If the .env file cannot be loaded, calling main(["env"]) results in exit code 1 and an error message.

# Documentation

* Update README.md to add a Usage section for the env command with examples of full dump and filtered output.
* Reference dotenv configuration in the CLI reference section.