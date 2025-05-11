# CLI Usage

This repository provides a command-line interface (CLI) with an option to display the mission statement.

## Display Mission Statement

Run the CLI with the `--mission` flag to print out the contents of `MISSION.md`:

```bash
npm run start -- --mission
```

Example output:
```
# Mission Statement

`repository0` is a repository template that showcases the GitHub workflows imported from intentïon `agentic-lib`.
Its primary purpose is to demonstrate these automated CI/CD workflows and provide a basis for further development.
...
```

## Default Behavior

Without any flags, the CLI will simply echo the provided arguments:

```bash
npm run start -- foo bar
# => Run with: ["foo","bar"]
```
