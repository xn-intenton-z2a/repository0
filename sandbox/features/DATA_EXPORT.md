# Purpose
Add a data export subcommand to output sampled data points for supported functions in JSON or CSV format. This enables users to integrate numeric output into other tools or workflows without needing to parse SVG.

# CLI Interface
Add subcommand data under the main script invocation:
node src/lib/main.js data functionType [options]

Where:
  functionType (required) is either quadratic or sine
  Options:
    --format <json|csv>    output format, either json or csv (default json)
    --samples <number>     number of sample points across the domain (default 100)
    --domainStart <number> start of x range (default -10)
    --domainEnd <number>   end of x range (default 10)
    --outputPath <path>    optional file path to write the data (defaults to stdout)

# Behavior
1. Parse arguments to determine functionType, format, samples, domainStart, domainEnd, and outputPath.
2. Validate that functionType and format are supported; on error exit with code 1 and print descriptive message.
3. Sample the specified number of x values evenly from domainStart to domainEnd.
4. Compute corresponding y values: y = x * x for quadratic, y = Math.sin(x) for sine.
5. Build output:
   - For json produce an array of objects with x and y properties.
   - For csv produce a header line x,y followed by one line per sample with comma separated values.
6. Write the formatted output to stdout or to the given outputPath file.

# Tests
Add unit tests in tests/unit/main.test.js:
- Call main(["data","quadratic","--format","json","--samples","3"]) and assert the returned string begins with [ and contains objects with x and y fields.
- Call main(["data","sine","--format","csv","--samples","5"]) and assert the returned string contains header x,y and five data lines.
- Test unsupported functionType or unsupported format by calling main with bad values and assert exit code 1 and error message.

# Documentation
Update README.md to include the data subcommand with its options. Show example invocations for json and csv formats and embed sample output in plain text.

# Files to Modify
- src/lib/main.js implement data subcommand, argument parsing, data generation, formatting, and output handling
- tests/unit/main.test.js add unit tests for data command success and failure cases
- README.md document data command syntax, options, and example json and csv output
- package.json ensure test scripts include data mode tests