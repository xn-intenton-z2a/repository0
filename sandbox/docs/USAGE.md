# Usage

This repository includes a demo CLI tool that calculates and prints the effective issue-to-code conversion rate. It determines the rate from:

1. CLI Flag (`--conversion-rate <number>`)
2. Environment Variable (`ISSUE_TO_CODE_CONVERSION_RATE`)
3. Default in `package.json` (`config.issueToCodeConversionRate`)

Valid values are numbers between `0` and `1` (inclusive). Invalid values will cause an error and a non-zero exit.

## Structure

- `sandbox/source/main.js`: Conversion-rate parsing and validation logic.
- `sandbox/tests/main.test.js`: Tests for conversion-rate functionality.
- `src/lib/main.js`: Argument echo demonstration.
- `tests/unit/`: Secondary entry-point unit tests.

## Getting Started

Install dependencies and run tests:

```bash
npm install
npm test
```

## Use the CLI

Run the conversion CLI from the project root:

```bash
node sandbox/source/main.js
# Effective conversion rate: 0.5
```

For the primary argument-echo demo, you can also run:

```bash
npm run start -- <args>
# Run with: ["<args>"]
```

Override the conversion rate:

- Via flag:

  ```bash
  node sandbox/source/main.js --conversion-rate 0.3
  # Effective conversion rate: 0.3
  ```

- Via environment variable:

  ```bash
  ISSUE_TO_CODE_CONVERSION_RATE=0.8 node sandbox/source/main.js
  # Effective conversion rate: 0.8
  ```

## Configuration

The conversion rate is determined in this order:

1. **CLI Flag**: `--conversion-rate <number>`
2. **Environment Variable**: `ISSUE_TO_CODE_CONVERSION_RATE`
3. **Default**: `config.issueToCodeConversionRate` in `package.json` (default: `0.5`)

## Links & References

- [MISSION.md](../../MISSION.md)
- [CONTRIBUTING.md](../../CONTRIBUTING.md)
- [LICENSE.md](../../LICENSE.md)
- [intentïon agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib)
