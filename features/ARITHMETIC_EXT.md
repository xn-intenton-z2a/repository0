# ARITHMETIC_EXT Feature Specification

## Overview
This feature extends the CLI utility by adding additional arithmetic operations beyond basic summation. Users can now calculate the Greatest Common Divisor (GCD), Least Common Multiple (LCM), and check if a number is prime directly from the CLI. This enriches our CLI tool with more handy math functions while adhering to the mission of providing useful Node.js utilities in a single source file.

## Implementation Details
1. **Source File Update (src/lib/main.js):**
   - Update the main function to inspect the first argument. If it matches one of the following commands, execute the corresponding arithmetic function:
     - **gcd**: Calculate the GCD of two numbers.
     - **lcm**: Calculate the LCM of two numbers.
     - **prime**: Check if a single number is prime.
   - For the above commands, validate that the subsequent argument(s) are valid numeric inputs. If the inputs are invalid or insufficient, display an error message along with the help text.
   - If the first argument does not match any of the new commands, fallback to the original behavior of summing exactly two numbers.
   - Add helper functions for computing GCD, LCM, and prime checking within the same source file.

2. **Test File Update (tests/unit/main.test.js):**
   - Extend unit tests to validate the new arithmetic commands.
   - Add tests to verify the GCD function (e.g., `gcd 8 12` should output `GCD: 4`).
   - Add tests to validate the LCM function (e.g., `lcm 4 6` should output `LCM: 12`).
   - Add tests to validate the prime check (e.g., `prime 7` should output that 7 is prime, and `prime 8` should indicate non-prime).

3. **README File Update (README.md):**
   - Update the usage section to include examples of the new arithmetic commands. For instance:
     ```bash
     node src/lib/main.js gcd 8 12
     node src/lib/main.js lcm 4 6
     node src/lib/main.js prime 7
     ```
   - Provide a brief description of each new command for user clarity.

4. **Dependencies File Update (package.json):**
   - No new dependencies are required; use the standard Node.js functionality to perform calculations.

## Usage Examples
- Calculate the GCD:
  ```bash
  node src/lib/main.js gcd 8 12
  # Expected output: GCD: 4
  ```
- Calculate the LCM:
  ```bash
  node src/lib/main.js lcm 4 6
  # Expected output: LCM: 12
  ```
- Check if a number is prime:
  ```bash
  node src/lib/main.js prime 7
  # Expected output: 7 is prime
  ```

## Benefits
- **Enhanced Functionality:** Provides users with additional arithmetic operations directly from the CLI.
- **Improved Usability:** Reduces the need for separate tools by bundling handy math utilities in one package.
- **Consistent Experience:** Integrates seamlessly with the existing CLI design and help system, ensuring that all commands are self-documented.
