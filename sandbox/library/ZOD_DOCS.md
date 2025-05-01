# ZOD_DOCS

## Crawl Summary
The crawled content from https://zod.dev returned minimal data size. Core technical details are derived from the established Zod API focusing on schema creation, parsing, transformation, and error handling with explicit method signatures and configuration details.

## Normalised Extract
Table of Contents:
1. Schema Creation
   - z.string(options) returns ZodString with methods min(number, {message}) and max(number, {message}).
   - z.number() returns ZodNumber with min and max validations.
   - z.object(shape) enforces property-level validations.
   - z.array(itemSchema) for array validations; z.lazy for recursive schemas.
2. Parsing Methods
   - parse(input: unknown): T; throws ZodError on failure.
   - safeParse(input: unknown): { success: boolean, data?: T, error?: ZodError }.
3. Transformation Methods
   - .transform(fn): custom transformation post validation.
   - .refine(predicate, {message}): custom rule enforcement.
4. Error Handling
   - ZodError with issues array containing message, path, and code.
   - Use z.setErrorMap(customMap) for global error message configuration.

Detailed Information:
Schema creation functions (z.string, z.number, z.boolean, z.object, z.array, z.lazy) allow building complex validation schemas. Parsing methods (parse, safeParse) enforce type safety and transform input data. Transformation and refinement methods modify output or enforce additional constraints. Error responses are detailed and customizable.


## Supplementary Details
Technical Specifications:
- z.string(options?: { invalid_type_error?: string, required_error?: string }): Constructs a ZodString. Methods:
   - .min(limit: number, opts?: { message?: string }): ZodString
   - .max(limit: number, opts?: { message?: string }): ZodString
- z.number(): Constructs a ZodNumber. Methods:
   - .min(value: number, opts?: { message?: string }): ZodNumber
   - .max(value: number, opts?: { message?: string }): ZodNumber
- z.object(shape: { [key: string]: ZodType<any> }): Returns a ZodObject enforcing structure.
- Parsing Methods:
   - parse(input: unknown): T; throws ZodError with detailed issues on failure.
   - safeParse(input: unknown): Returns object { success: boolean, data?: T, error?: ZodError }.
- Configuration Options:
   - z.setErrorMap(customMap): Overrides default error message mappings globally.
- Implementation Steps:
   1. Define schema using Zod creation methods.
   2. Use parse or safeParse to validate input.
   3. Chain transformation and refinement methods as needed.
   4. Implement try-catch for error handling and inspect error.issues.


## Reference Details
API Specifications:
* Function: z.string(options?: { invalid_type_error?: string, required_error?: string }): ZodString
  - Methods:
    - min(limit: number, opts?: { message?: string }): ZodString
    - max(limit: number, opts?: { message?: string }): ZodString
* Function: z.number(): ZodNumber
  - Methods:
    - min(value: number, opts?: { message?: string }): ZodNumber
    - max(value: number, opts?: { message?: string }): ZodNumber
* Function: z.object(shape: { [key: string]: ZodType<any> }): ZodObject
* Parsing:
  - parse(input: unknown): T throws ZodError
  - safeParse(input: unknown): { success: boolean, data?: T, error?: ZodError }
* Error Handling:
  - ZodError: Contains property issues: Array<{ message: string, path: (string | number)[], code: string }>
* Example Pattern:
  - Define schema:
    const userSchema = z.object({
      name: z.string({ required_error: 'Name required' }).min(1, { message: 'Non-empty string expected' }),
      age: z.number().min(0, { message: 'Must be non-negative' })
    });
  - Validate input using try { const result = userSchema.parse(input); } catch (e) { if (e instanceof ZodError) { handle(e.issues); } }
* Configuration:
  - z.setErrorMap(newErrorMap): Sets global error message mapping.
* Troubleshooting:
  - Use safeParse to identify schema violations without exceptions.
  - Check error.issues for detailed failure context and paths.


## Information Dense Extract
z.string({invalid_type_error, required_error}) => ZodString; .min(number, {message}), .max(number, {message}). z.number() => ZodNumber; .min(number, {message}), .max(number, {message}). z.object({ key: ZodType }) validates objects; parse(input) returns T or throws ZodError; safeParse(input) returns {success, data, error}. z.array(schema) and z.lazy(() => schema) for arrays and recursions. API: parse(input: unknown): T, safeParse: {success, data?, error?}, ZodError with issues:[{message, path, code}]. Global config via z.setErrorMap(newMap); best practice: try-catch around parse; chain transformations with .transform and .refine.

## Sanitised Extract
Table of Contents:
1. Schema Creation
   - z.string(options) returns ZodString with methods min(number, {message}) and max(number, {message}).
   - z.number() returns ZodNumber with min and max validations.
   - z.object(shape) enforces property-level validations.
   - z.array(itemSchema) for array validations; z.lazy for recursive schemas.
2. Parsing Methods
   - parse(input: unknown): T; throws ZodError on failure.
   - safeParse(input: unknown): { success: boolean, data?: T, error?: ZodError }.
3. Transformation Methods
   - .transform(fn): custom transformation post validation.
   - .refine(predicate, {message}): custom rule enforcement.
4. Error Handling
   - ZodError with issues array containing message, path, and code.
   - Use z.setErrorMap(customMap) for global error message configuration.

Detailed Information:
Schema creation functions (z.string, z.number, z.boolean, z.object, z.array, z.lazy) allow building complex validation schemas. Parsing methods (parse, safeParse) enforce type safety and transform input data. Transformation and refinement methods modify output or enforce additional constraints. Error responses are detailed and customizable.

## Original Source
Zod Documentation
https://zod.dev

## Digest of ZOD_DOCS

# ZOD DOCUMENTATION

Date Retrieved: 2023-10-04

## Schema Creation

- z.string(options: { invalid_type_error?: string, required_error?: string }): Returns a ZodString instance. Methods available include .min(limit: number, { message?: string }) and .max(limit: number, { message?: string }).
- z.number(): Returns a ZodNumber instance. Methods available include .min(value: number, { message?: string }) and .max(value: number, { message?: string }).
- z.boolean(): Returns a ZodBoolean instance.
- z.object(shape: { [key: string]: ZodType<any> }): Constructs an object schema validating each property as specified.
- z.array(itemSchema: ZodType<any>): Constructs an array schema based on the provided item schema.
- z.lazy(() => schema): Defines recursive schemas.

## Parsing and Validation Methods

- schema.parse(input: unknown): Returns the validated and parsed value of type T, or throws a ZodError if validation fails.
- schema.safeParse(input: unknown): Returns an object with { success: boolean, data?: T, error?: ZodError } where error contains detailed issues if validation fails.
- .refine(predicate: (val: any) => boolean, { message?: string }): Adds custom validation logic. 
- .transform(transformFn: (val: any) => any): Transforms input value post validation.

## Error Handling

- ZodError: Contains an array 'issues' where each issue details the message, path, and error code.
- Custom error messages can be defined within each method, and z.setErrorMap(newErrorMap) can override the default error messages globally.

## Configuration and Best Practices

- Global Configuration: z.setErrorMap(customMap) to globally change error responses.
- Use try-catch blocks around schema.parse to gracefully handle errors and output detailed error information.
- Chain methods (such as .min, .max, .refine) to apply multiple validation rules in one go.
- For asynchronous validations, consider structuring schema transformations carefully.

## Example Implementation Pattern

// Define a schema for a user object
const userSchema = z.object({
  name: z.string({ required_error: "Name is required" }).min(1, { message: "Name cannot be empty" }),
  age: z.number().min(0, { message: "Age must be a positive number" })
});

// Validate input data
try {
  const validatedUser = userSchema.parse(inputData);
  // Proceed with validatedUser
} catch (error) {
  if (error instanceof ZodError) {
    // Handle detailed error report
  }
}

## Troubleshooting

- Ensure proper chaining of methods. For unexpected type errors, validate that the input conforms to the expected schema structure.
- Use safeParse to diagnose schema issues without interrupting program flow.
- Inspect the error.issues array to locate which field validation failed.


## Attribution
- Source: Zod Documentation
- URL: https://zod.dev
- License: License: MIT
- Crawl Date: 2025-05-01T22:27:24.116Z
- Data Size: 0 bytes
- Links Found: 0

## Retrieved
2025-05-01
