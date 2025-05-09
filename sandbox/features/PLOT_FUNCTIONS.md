# Summary

Enhance the CLI in sandbox/source/main.js to compute and output data points for simple mathematical functions, now including a new polar coordinate mode. Users can specify the function type (quadratic, sine, or polar), numeric range, and step size. Results are serialized as JSON by default.

# Implementation

1. Update sandbox/source/main.js:
   - Use minimist to parse options:
     • --function (-f): string, values "quadratic", "sine", or "polar"; default "quadratic".
     • --from (-a): number, start of range; default -10 for cartesian, 0 for polar.
     • --to (-b): number, end of range; default 10 for cartesian, 6.283185307179586 (2π) for polar.
     • --step (-s): number, increment; default 1. Must be positive.
   - Validate:
     • Function name is one of supported values; on invalid name print error to stderr and exit code 1.
     • Numeric parameters are finite numbers; --step must be positive; on validation failure print clear error and exit code 1.
   - Compute points array:
     • For quadratic: as before, y = x * x.
     • For sine: as before, y = Math.sin(x).
     • For polar:
       – Interpret range values as theta in radians.
       – Loop theta from start to end (inclusive), stepping by step.
       – For each theta compute r = theta.
       – Compute x = r * Math.cos(theta) and y = r * Math.sin(theta).
       – Push an object { x, y }.
   - Serialize the array of points as JSON and print to stdout.
   - Return the array for programmatic invocation.

# README Updates

- In sandbox/docs/USAGE.md under **Plot Functions**:
  • List polar as a valid function: --function polar
  • Note defaults: --from 0, --to 6.283185307179586, --step 1
  • Provide example:
    npm run start -- --function polar
    # Outputs [{"x":0,"y":0},...,{"x":6.2831853*...}]

# Testing Deliverables

1. In sandbox/tests/main.test.js add unit tests to verify:
   • Running main with --function polar and default range produces an array of points matching r=theta spiral in JSON format.
   • Custom --from, --to, --step values for polar yield expected x,y pairs for known theta values (e.g., 0, π/2, π).
   • Supplying an unsupported function name causes process.exit with code 1 and logs an error.
   • Invalid numeric values (non-numeric or negative step) exit with code 1 and an error message.
2. Ensure existing tests for quadratic and sine continue to pass unmodified.