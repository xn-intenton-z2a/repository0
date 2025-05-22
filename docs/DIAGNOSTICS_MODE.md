# Diagnostics Mode

## Overview

Introduce a diagnostics mode to the CLI that prints runtime and environment information when invoked with the `--diagnostics` flag and exits.

## CLI Usage

- `npm run diagnostics`  
- `node src/lib/main.js --diagnostics`

## Output

Prints a JSON object with:

- `version`: Node.js version (string)  
- `uptime`: Process uptime in seconds (number)  
- `memoryUsage`: Object with `rss`, `heapTotal`, `heapUsed` (numbers)  
- `platform`: Operating system platform (string)  
- `arch`: CPU architecture (string)  

## Exit Code

Exits with code 0 after printing diagnostics.

## Sample Output

```json
{
  "version": "v20.5.0",
  "uptime": 0.123,
  "memoryUsage": {
    "rss": 21514176,
    "heapTotal": 5242880,
    "heapUsed": 3034896
  },
  "platform": "linux",
  "arch": "x64"
}
```