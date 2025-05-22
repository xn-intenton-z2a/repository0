# Mission Mode

## Overview

Introduce a mission mode to the CLI that prints the project mission when invoked with the `--mission` flag and exits.

## CLI Usage

- `npm run mission`  
- `node src/lib/main.js --mission`

## Output

Prints the full content of `MISSION.md`, which contains the project mission statement.

## Exit Code

Exits with code 0 after printing.

## Sample Output

```md
# repository0

Deliver the traditional first program to write in a new language, the "Hello World!" message.
```