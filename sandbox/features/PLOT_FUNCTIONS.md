# Summary

Enhance the CLI in src/lib/main.js to compute and output data points for simple mathematical functions. Users can specify the function type, numeric range, and step size. Results are serialized as JSON by default.

# Implementation

1. Modify src/lib/main.js to:
   - Import minimist for argument parsing.
   - Define supported functions: quadratic (y = x * x) and sine (y = Math.sin(x)).
   - Parse options with minimist:
     • --function (-f): string, either "quadratic" or "sine"; default "quadratic".
     • --from (-a): number, start of x range; default -10.
     • --to (-b): number, end of x range; default 10.
     • --step (-s): number, increment for x; default 1.
   - Validate:
     • Function name is supported; on invalid name print error to stderr and exit with code 1.
     • Numeric parameters are finite numbers; --step must be positive; on validation failure print clear error and exit code 1.
   - Compute points:
     • Initialize an array.
     • Loop x from start to end (inclusive), stepping by the step size.
     • Compute y according to function type and push an object { x, y }.
   - Output:
     • Serialize the array to JSON and print to stdout.
     • Return the array for programmatic invocation.

# README Updates

- In README.md add a **Plotting Functions** section:
  • Describe invocation: `node src/lib/main.js [options]`.
  • List options with flags, default values, and valid values.
  • Provide examples:
    - `node src/lib/main.js`  # Quadratic from -10 to 10 with step 1
    - `node src/lib/main.js --function sine --from 0 --to 6.28 --step 0.1`

# Testing Deliverables

1. In tests/unit/main.test.js add tests to verify:
   • Running main with no arguments yields an array of 21 points for quadratic and logs valid JSON.
   • Using `--function sine --from 0 --to 6.28 --step 1.57` yields expected sine values at known points.
   • Supplying an unsupported function name triggers process exit with code 1 and prints an error.
   • Supplying invalid numeric values (non-numeric or negative step) exits with code 1 and an error message.
2. Ensure existing echo tests in tests/unit/main.test.js continue to pass unmodified.