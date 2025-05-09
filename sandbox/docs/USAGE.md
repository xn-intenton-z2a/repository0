# `repository0`

`repository0` is a CLI tool that calculates and prints the effective issue-to-code conversion rate based on a configurable conversion rate. It determines the rate from the following sources, in order of precedence:

1. CLI Flag (`--conversion-rate <number>`)
2. Environment Variable (`ISSUE_TO_CODE_CONVERSION_RATE`)
3. Default in `package.json` (`config.issueToCodeConversionRate`)

Valid values are numbers between `0` and `1` (inclusive). Invalid values will cause the application to error out with a clear message and exit with a non-zero status.

## What's Inside

- `sandbox/source/main.js` – Conversion-rate parsing and validation logic.
- `src/lib/main.js` – Argument echo demonstration.
- `sandbox/tests/main.test.js` – Tests for conversion-rate functionality.
- `tests/unit/` – Secondary entry-point unit tests.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the full test suite:

```bash
npm test
```

Use the CLI:

- Default rate (from `package.json`, default `0.5`):

  ```bash
  npm run start
  # Effective conversion rate: 0.5
  ```

- Override via flag:

  ```bash
  npm run start -- --conversion-rate 0.3
  # Effective conversion rate: 0.3
  ```

- Override via environment variable:

  ```bash
  ISSUE_TO_CODE_CONVERSION_RATE=0.7 npm run start
  # Effective conversion rate: 0.7
  ```

## Configuration

The conversion rate is determined in the following order:

1. **CLI Flag**: `--conversion-rate <number>`
2. **Environment Variable**: `ISSUE_TO_CODE_CONVERSION_RATE`
3. **Default Configuration**: `config.issueToCodeConversionRate` in `package.json` (default: `0.5`)

Ensure the value is between `0` and `1` (inclusive). Out-of-range or non-numeric values will trigger an error.

## Links & References

- [MISSION.md](../../MISSION.md)
- [CONTRIBUTING.md](../../CONTRIBUTING.md)
- [LICENSE.md](../../LICENSE.md)
- [intentïon agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib)
