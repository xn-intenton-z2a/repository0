# CLI Usage Examples

This document describes how to use the CLI provided by our repository. The primary command is executed through the Node.js CLI in the file `src/lib/main.js`.

## Usage Examples

1. Running without any arguments (default usage):
   
   Command:
   
       npm run start
   
   Expected output:
   
       Run with: []

2. Running diagnostics:
   
   Command:
   
       npm run diagnostics
   
   Expected output:
   
       Diagnostics: System check initiated.

3. Checking version:
   
   Command:
   
       npm run version
   
   Expected output:
   
       Version: 2.1.0-0

4. Checking for updates:
   
   Command:
   
       npm run check-update
   
   Expected output:
   
       Update check in progress.

5. Passing multiple generic arguments manually:
   
   Command:
   
       node src/lib/main.js arg1 arg2
   
   Expected output:
   
       Run with: ["arg1","arg2"]

## Arithmetic Utility Commands

The CLI now supports arithmetic operations. Below are the available arithmetic commands:

1. Compute the Greatest Common Divisor (GCD):

   Command:

       node src/lib/main.js gcd <num1> <num2>

   Example:

       node src/lib/main.js gcd 48 180

   Expected output:

       12

2. Compute the Least Common Multiple (LCM):

   Command:

       node src/lib/main.js lcm <num1> <num2>

   Example:

       node src/lib/main.js lcm 12 15

   Expected output:

       60

   (The implementation ensures that lcm(a, b) * gcd(a, b) equals a * b.)

3. Prime Number Check:

   Command:

       node src/lib/main.js isprime <num>

   Example:

       node src/lib/main.js isprime 17

   Expected output:

       true

       node src/lib/main.js isprime 18

   Expected output:

       false

## Help Message

For any invalid command or incorrect number of arguments, the CLI will display a help message listing the valid commands and their expected formats:

  diagnostics, version, check-update, gcd <num1> <num2>, lcm <num1> <num2>, isprime <num>

## Notes

- The CLI behavior is adjusted based on the number and value of arguments provided.
- For single recognized commands (diagnostics, version, check-update), specific messages are logged.
- For arithmetic commands, ensure to pass the correct number of numeric arguments.
- For all other cases, the CLI logs a generic help message or the arguments array as a JSON string.
