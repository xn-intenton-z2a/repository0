RANGE_ERROR

Table of contents
- Constructor and signature
- When to throw RangeError
- Properties and prototype behavior
- Recommended usage patterns
- Common scenarios and examples
- Troubleshooting and diagnostics
- Digest and attribution

Constructor and signature
- RangeError(message) creates an instance of RangeError; inherits from Error
- Typical JS constructor forms: new RangeError(message) where message is a short descriptive string

When to throw RangeError
- Use RangeError when a numeric value is outside an allowable range or when a parameter value is not within accepted bounds (e.g., invalid array length, out-of-range index)
- Do not use RangeError for type mismatches (use TypeError for wrong types)

Properties and prototype behavior
- name: "RangeError"
- message: provided descriptive string
- stack: implementation-defined but typically present for Error objects
- instanceof RangeError -> true for RangeError instances

Recommended usage patterns
- Validate inputs early and throw new RangeError("<param> must be between X and Y") for out-of-range numeric arguments
- Include actual and expected values in message or an attached property for diagnostics

Common scenarios and examples
- Invalid array length values, invalid numeric config parameters, iteration counts outside allowed limits

Troubleshooting and diagnostics
- Ensure catch clauses inspect error.name or instanceof RangeError when differentiating error types
- When wrapping errors, preserve original RangeError on an error.cause property if available

Digest
- Source: MDN RangeError
- Retrieved: 2026-03-14

Attribution and data size
- URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError
- Crawl size: 160123 bytes
