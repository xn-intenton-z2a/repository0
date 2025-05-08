# Usage Guide

This application supports a configurable `conversionRate` that determines the proportion of issues automatically converted into code changes. The priority for determining the effective conversion rate is:

1. **CLI Flag**: `--conversion-rate <number>`
2. **Environment Variable**: `ISSUE_TO_CODE_CONVERSION_RATE`
3. **Default Configuration**: `config.issueToCodeConversionRate` in `package.json` (default: `0.5`)

## CLI Flag

Use the `--conversion-rate` flag to override the rate directly when invoking the script:

```bash
npm start -- --conversion-rate 0.3
# Effective conversion rate: 0.3
```

> Note: The `--` before the flag ensures that the argument is passed through `npm start` to the Node script.

## Environment Variable

Set the `ISSUE_TO_CODE_CONVERSION_RATE` environment variable to override the default configuration:

```bash
ISSUE_TO_CODE_CONVERSION_RATE=0.8 npm start
# Effective conversion rate: 0.8
```

## Default Configuration

If neither a CLI flag nor an environment variable is provided, the application reads the value from `package.json`:

```json
{
  "config": {
    "issueToCodeConversionRate": 0.5
  }
}
```

```bash
npm run start
# Effective conversion rate: 0.5
```

## Valid Range

The `conversionRate` must be a number between `0` and `1` (inclusive). Providing an invalid value (e.g., `-0.1`, `1.1`, or non-numeric) will cause the application to error out with a clear message and exit with a non-zero status.

---

For more information on configuration and contributing, please refer to the project's `CONTRIBUTING.md` and `MISSION.md` files.