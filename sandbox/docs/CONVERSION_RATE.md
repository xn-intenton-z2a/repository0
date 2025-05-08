# Issue-to-Code Conversion Rate

This document describes how to pass a conversion rate to the main script. In the current version, the script logs all CLI arguments; future versions will apply this rate to workflow logic.

## Usage

```bash
npm run start -- --conversion-rate 0.9
```

Output:

```
Run with: ["--conversion-rate","0.9"]
```

## Configuration Priority (future)

1. CLI flag: `--conversion-rate <number>`
2. Environment variable: `ISSUE_TO_CODE_CONVERSION_RATE=<number>`
3. Default in `package.json` under `config.issueToCodeConversionRate` (0.5)
