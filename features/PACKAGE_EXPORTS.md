# PACKAGE_EXPORTS

## Summary
Ensure module exports and package metadata are correct so the library is consumable by other code and the web demo.

## Specification
- src/lib/main.js must export fizzBuzz and fizzBuzzSingle as named exports.
- package.json main field must point to src/lib/main.js and the package must use type module.

## Acceptance criteria
- Importing the package via import { fizzBuzz } from '.' resolves and returns the exported function.
- package.json main points to src/lib/main.js and type is module.
