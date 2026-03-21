# PACKAGE_COMPAT

Summary
Specify package and module compatibility requirements so the library can be imported from ESM contexts and run as a CLI.

Behavior
- package.json must set type to module and main to src/lib/main.js. The library must export named functions fizzBuzz and fizzBuzzSingle as ESM named exports. The start:cli script must run node src/lib/main.js and behave as documented for CLI behavior.

Acceptance criteria
- [ ] package.json has type module and main points to src/lib/main.js
- [ ] Importing named exports fizzBuzz and fizzBuzzSingle from src/lib/main.js works in an ESM environment
- [ ] npm run start:cli runs without module errors and produces the documented output for a sample input
