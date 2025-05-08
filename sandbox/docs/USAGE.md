# `repository0`

`repository0` is a CLI tool that calculates and prints the effective issue-to-code conversion rate based on a configurable conversion rate. It showcases GitHub workflows from [intentïon agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib) in sandbox mode.

This project demonstrates how automated workflows can manage code evolution, testing, and documentation.

## What's Inside

- **CLI Source**: `sandbox/source/main.js` – Parses CLI arguments and environment variables to determine the conversion rate, validates it with Zod.
- **Secondary Entry Point**: `src/lib/main.js` – Echoes CLI arguments; used for demonstration.
- **Tests**:  
  - `sandbox/tests/main.test.js` – Tests conversion rate logic.  
  - `tests/unit/` – Unit tests for the secondary entry point.
- **Configuration**: `package.json` – Defines the default `config.issueToCodeConversionRate`.

## Installation & Getting Started

1. **Clone the Repository**  
   ```bash
   git clone <repository_url>
   cd repository0
   ```

2. **Install Dependencies**  
   ```bash
   npm install
   ```

3. **Run Tests**  
   ```bash
   npm test
   ```

4. **Run the CLI**  
   - **Default** (uses `package.json` default `issueToCodeConversionRate` of `0.5`):  
     ```bash
     npm run start
     # Effective conversion rate: 0.5
     ```
   - **Flag Override**:  
     ```bash
     npm run start -- --conversion-rate 0.3
     # Effective conversion rate: 0.3
     ```
   - **Environment Variable Override**:  
     ```bash
     ISSUE_TO_CODE_CONVERSION_RATE=0.8 npm run start
     # Effective conversion rate: 0.8
     ```

## Configuration

The conversion rate is determined by the following precedence:

1. **CLI Flag**: `--conversion-rate <number>`
2. **Environment Variable**: `ISSUE_TO_CODE_CONVERSION_RATE`
3. **Default Configuration**: `config.issueToCodeConversionRate` in `package.json` (default: `0.5`)

**Valid Range**: Must be a number between `0` and `1` (inclusive).  
An invalid value (e.g., `-0.1`, `1.1`, `abc`) will cause the application to error out with a clear message and exit with a non-zero status.

## Links & References

- [CONTRIBUTING.md](../../CONTRIBUTING.md)  
- [MISSION.md](../../MISSION.md)  
- [LICENSE.md](../../LICENSE.md)  
- [intentïon agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib)
