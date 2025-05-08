# Issue-to-Code Conversion Rate Configuration

The `issueToCodeConversionRate` determines what proportion of issues are automatically converted into code changes.

**Priority of configuration sources:**

1. CLI Flag: `--conversion-rate <number>`
2. Environment Variable: `ISSUE_TO_CODE_CONVERSION_RATE=<number>`
3. Default value in `package.json` under `config.issueToCodeConversionRate` (defaults to `0.5`).

## Usage Examples

Using an environment variable:
```bash
ISSUE_TO_CODE_CONVERSION_RATE=0.8 npm start
```

Using the CLI flag:
```bash
npm start -- --conversion-rate 0.9
```

The output will log the arguments and the effective conversion rate. For example:

```
Run with: [], conversionRate: 0.9
```
