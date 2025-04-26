# ZOD_SCHEMA

## Crawl Summary
Zod is a comprehensive TypeScript-first schema validation library. It provides installation instructions, basic and advanced schema creation (primitives, strings, objects, arrays, tuples, unions, enums, and function schemas), coercion methods, custom error handling and detailed validations for dates, IP addresses, numbers, booleans, and more. API methods include .parse, .safeParse, .parseAsync, .refine, .transform, and team-supported recursive types with z.lazy(). Coercion methods exist for all primitive types and allow configurable behavior. The library emphasizes immutable, chainable schema definitions designed for immediate integration in modern JavaScript and TypeScript projects.

## Normalised Extract
Table of Contents:
  1. Installation and Requirements
     - TypeScript 4.5+ with strict mode required
     - npm: zod install commands with optional @canary version
  2. Basic Schemas
     - String schema: z.string(), .parse, .safeParse
     - Object schema: z.object({ username: z.string() }), type inference with z.infer
  3. Primitive Types and Coercion
     - Available primitives: string, number, bigint, boolean, date, symbol
     - Coercion: z.coerce.string(), z.coerce.number(), etc. using native constructors
  4. Literals and Custom Messages
     - Literal schemas: z.literal(value), .value property
     - Custom error messages: provided in schema options and method parameters
  5. Complex Types
     - Arrays: z.array(schema), .nonempty, .min, .max
     - Tuples: z.tuple([...]), .rest for variadic arguments
     - Unions: z.union([...]) and .or for alternatives
  6. Object Operations
     - .shape, .extend, .merge, .pick, .omit, .partial, .deepPartial, .required
     - Unknown keys handling: .passthrough, .strict, .strip, .catchall
  7. Specialized Validations
     - Date/Time: z.string().datetime({ offset, precision }), z.string().date(), z.string().time({ precision })
     - IP and CIDR: z.string().ip({ version }), z.string().cidr({ version })
  8. Number, BigInt, Boolean, Date
     - Methods: .gt, .gte, .lt, .lte, .int, .positive, .multipleOf
  9. Enums
     - Zod enums: z.enum([...]), nativeEnum for TypeScript enums, .enum and .options for access
  10. Function Schemas
      - Define with z.function(), chain .args() and .returns(), use .implement to validate inputs/outputs
  11. Preprocess and Custom Schemas
      - z.preprocess for pre-parsing transforms, z.custom<T>() for custom type validations
  12. Schema Methods
      - .parse, .parseAsync, .safeParse, .safeParseAsync, .refine, .superRefine, .transform

Each section includes explicit method signatures, error options, and transformation steps. For example, for string coercion:
  z.coerce.string().email().min(5) transforms input using String(input) and then applies email and length validations. Input is converted and validated in one chain.

Direct use cases are provided for function schemas:
  z.function().args(z.string()).returns(z.number()).implement((x) => x.trim().length) ensures validated input and output types.

These concrete extracts offer immediate implementation details for constructing robust Zod schemas.

## Supplementary Details
Installation requires TS 4.5+ with strict mode enabled in tsconfig.json. Configuration options include enabling timezone offsets in datetime validations with { offset: true }, precision controls in datetime and time validations with { precision: <number> }, IP version restrictions using { version: "v4" or "v6" }, and custom error messages provided as second parameter objects in methods such as .min({ message: 'error' }). Object schemas support .passthrough() to retain unknown keys, .strict() to reject them, and .catchall() to apply validation on all additional keys. Function schemas require explicit .args() and .returns() definitions with .implement() for runtime validation.

## Reference Details
API Specifications:

1. Schema Creation:
   - z.string(): Schema<string>
   - z.number(): Schema<number>
   - z.object({ key: Schema<T> }): Schema<{ key: T }>
   - z.array(Schema<T>): Schema<T[]>

2. Parsing Methods:
   - parse(data: unknown): T
     Throws ZodError if validation fails.
   - safeParse(data: unknown): { success: true; data: T } | { success: false; error: ZodError }
   - parseAsync(data: unknown): Promise<T>
   - safeParseAsync(data: unknown): Promise<{ success: true; data: T } | { success: false; error: ZodError }>

3. Coercion Methods:
   - z.coerce.string(): returns ZodString instance that calls String(input)
   - z.coerce.number(): returns ZodNumber instance using Number(input)
   - z.coerce.boolean(): returns ZodBoolean instance using Boolean(input)
   - z.coerce.date(): returns ZodDate instance using new Date(input)

4. Validation Methods:
   - .min(limit: number, options?: { message: string }): Schema<T>
   - .max(limit: number, options?: { message: string }): Schema<T>
   - .refine(validator: (data: T) => any, params?: { message?: string; path?: (string | number)[] }): Schema<T>
   - .superRefine(callback: (data: T, ctx: { addIssue: (issue: Issue) => void }) => void): Schema<T>
   - .transform(transformer: (arg: T) => U): Schema<U>

5. Function Schemas:
   - z.function(): returns a function schema
   - .args(...schemas: Schema<any>[])
   - .returns(schema: Schema<any>)
   - .implement(fn: (...args: any[]) => any): Returns a new function that validates input and output

6. Example Code:
   // Coerce and validate string email
   const emailSchema = z.coerce.string().email({ message: "Invalid email" }).min(5, { message: "Minimum length is 5" });
   // Object schema with optional field
   const user = z.object({
     username: z.string(),
     age: z.number().optional()
   });
   // Function schema example
   const trimmedLength = z.function()
     .args(z.string())
     .returns(z.number())
     .implement((x) => x.trim().length);

7. Troubleshooting Procedures:
   - For parse errors, use safeParse to capture ZodError and inspect error.errors array for path and issue.
   - If coercion issues arise, verify input transformation via log outputs in preprocess.
   - Command: npm run test to validate schema implementations; expected output includes either successful parsing or detailed ZodError with message, path, and code fields.
   - Use .strict() on object schemas to enforce key filtering; failures will throw error listing unknown keys.

All parameters, return types, method signatures, configuration options and concrete examples are detailed above for immediate developer reference.

## Information Dense Extract
Zod TS-first schema lib; install with npm/yarn; TS 4.5+ strict required; primitives: z.string(), z.number(), etc.; coercion via z.coerce.string() using String(input); object: z.object({ key: schema }); methods: .parse(data), .safeParse(data), .parseAsync(data), .refine(fn, { message, path }); arrays: z.array(schema) with .nonempty(), .min(), .max(); tuples: z.tuple([...]) with .rest(); unions: z.union([...]) or .or; enums: z.enum([...]), z.nativeEnum(); function schema: z.function().args(...).returns(...).implement(fn); advanced: .transform, .preprocess, .superRefine; config options: datetime({ offset:true, precision:n }), ip({ version:"v4"/"v6" }), object unknown key handling: .passthrough(), .strict(), .catchall(schema); full API specifications include method signatures and error handling, example implementations provided, troubleshooting via safeParse and error inspection, use z.lazy for recursive types.

## Sanitised Extract
Table of Contents:
  1. Installation and Requirements
     - TypeScript 4.5+ with strict mode required
     - npm: zod install commands with optional @canary version
  2. Basic Schemas
     - String schema: z.string(), .parse, .safeParse
     - Object schema: z.object({ username: z.string() }), type inference with z.infer
  3. Primitive Types and Coercion
     - Available primitives: string, number, bigint, boolean, date, symbol
     - Coercion: z.coerce.string(), z.coerce.number(), etc. using native constructors
  4. Literals and Custom Messages
     - Literal schemas: z.literal(value), .value property
     - Custom error messages: provided in schema options and method parameters
  5. Complex Types
     - Arrays: z.array(schema), .nonempty, .min, .max
     - Tuples: z.tuple([...]), .rest for variadic arguments
     - Unions: z.union([...]) and .or for alternatives
  6. Object Operations
     - .shape, .extend, .merge, .pick, .omit, .partial, .deepPartial, .required
     - Unknown keys handling: .passthrough, .strict, .strip, .catchall
  7. Specialized Validations
     - Date/Time: z.string().datetime({ offset, precision }), z.string().date(), z.string().time({ precision })
     - IP and CIDR: z.string().ip({ version }), z.string().cidr({ version })
  8. Number, BigInt, Boolean, Date
     - Methods: .gt, .gte, .lt, .lte, .int, .positive, .multipleOf
  9. Enums
     - Zod enums: z.enum([...]), nativeEnum for TypeScript enums, .enum and .options for access
  10. Function Schemas
      - Define with z.function(), chain .args() and .returns(), use .implement to validate inputs/outputs
  11. Preprocess and Custom Schemas
      - z.preprocess for pre-parsing transforms, z.custom<T>() for custom type validations
  12. Schema Methods
      - .parse, .parseAsync, .safeParse, .safeParseAsync, .refine, .superRefine, .transform

Each section includes explicit method signatures, error options, and transformation steps. For example, for string coercion:
  z.coerce.string().email().min(5) transforms input using String(input) and then applies email and length validations. Input is converted and validated in one chain.

Direct use cases are provided for function schemas:
  z.function().args(z.string()).returns(z.number()).implement((x) => x.trim().length) ensures validated input and output types.

These concrete extracts offer immediate implementation details for constructing robust Zod schemas.

## Original Source
Zod Schema Validation Guide
https://github.com/colinhacks/zod

## Digest of ZOD_SCHEMA

# Zod Schema Validation Guide

Content retrieved on: 2023-11-24

## Overview
Zod is a TypeScript-first schema validation library designed to declare and validate data types with static type inference. It supports complex nested objects, coercion, error handling, and transformation. It works in Node.js and modern browsers with no external dependencies.

## Installation
- Requirements: TypeScript 4.5+ with 'strict' enabled in tsconfig.json
- Install commands:
  - npm: npm install zod
  - yarn: yarn add zod
  - pnpm: pnpm add zod
  - bun: bun add zod
  - For canary versions, append @canary

## Basic Usage

### Creating Schemas
- String Schema:
  import { z } from "zod";
  const mySchema = z.string();
  mySchema.parse("tuna");
  mySchema.safeParse(12); // returns error object

- Object Schema:
  const User = z.object({
    username: z.string()
  });
  User.parse({ username: "Ludwig" });
  type User = z.infer<typeof User>;

## Primitive Types and Coercion

### Primitives
- z.string(), z.number(), z.bigint(), z.boolean(), z.date(), z.symbol()
- Catch-all: z.any(), z.unknown()
- z.never() for no values

### Coercion
- z.coerce.string() converts inputs with String(input)
- Similarly: z.coerce.number(), z.coerce.boolean(), z.coerce.bigint(), z.coerce.date()
- Example:
  const schema = z.coerce.boolean();
  schema.parse("true"); // returns true

## Literals & Custom Validation

### Literal Schemas
- const tuna = z.literal("tuna");
- Retrieve literal: tuna.value returns "tuna"

### Custom Error Messages
- When declaring a schema: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string"
  });
- Custom messages for methods: z.string().min(5, { message: "Must be 5 or more characters" });

## Advanced Schemas

### Arrays, Tuples, and Unions
- Arrays: z.array(z.string()) or z.string().array()
- Nonempty arrays: z.string().array().nonempty({ message: "Can't be empty!" });
- Tuples: z.tuple([z.string(), z.number(), z.object({ pointsScored: z.number() })])
- Unions: z.union([z.string(), z.number()]) or using .or

### Objects Specifics
- .shape: access property schemas
- .extend: add fields, override existing ones
- .merge: combine two object schemas
- .pick and .omit: select or remove keys
- .partial / .deepPartial: make fields optional (shallow or deep)
- .required: enforce all fields are present
- .passthrough, .strict, .strip, and .catchall: control unknown keys behavior

## Specialized Validations

### Date and Time
- z.string().datetime(): validates ISO 8601 datetime (default only Z timezone)
- Options: { offset: true } to allow timezone offsets, { precision: 3 } to constrain decimal precision
- z.string().date() accepts YYYY-MM-DD format
- z.string().time() accepts HH:MM:SS with optional fractional seconds

### IP Addresses and CIDR
- z.string().ip(): validates IPv4/IPv6 addresses; option { version: "v4" | "v6" }
- z.string().cidr(): validates CIDR notation ranges

## Numeric and Boolean Validations

### Numbers
- z.number() validations: .gt, .gte (min), .lt, .lte (max), .int(), .positive(), .nonnegative(), .negative(), .nonpositive(), .multipleOf()

### BigInts
- Similar to numbers with z.bigint(): .gt, .gte, .lt, .lte, .multipleOf()

### Booleans and Dates
- z.boolean() with custom error messages
- z.date() validates JavaScript Date instances with .min() and .max() constraints
- Coercion: z.coerce.date() applies new Date(input)

## Enums

### Zod Enums and Native Enums
- z.enum(["Salmon", "Tuna", "Trout"])
- Native enums: z.nativeEnum(SomeEnum)
- Access enum options via .enum and .options
- Subset operations: .extract and .exclude

## Function Schemas

- Define functions with z.function()
- Chain .args() and .returns() to specify input and output types
- .implement() to create a validated function implementation
- Example:
  const trimmedLength = z.function()
    .args(z.string())
    .returns(z.number())
    .implement((x) => x.trim().length);

## Preprocess and Custom Schemas

- z.preprocess() to apply a transform before schema parsing
- z.custom<T>() to create a schema for custom types

## Schema Methods

- .parse(data: unknown): T
- .parseAsync(data: unknown): Promise<T>
- .safeParse(data: unknown): { success: boolean; data?: T; error?: ZodError }
- .safeParseAsync (alias .spa)
- .refine(fn, params?) for custom validations
- .superRefine for multiple issue creation
- .transform for chaining transforms

## Additional Topics

- Recursive types with z.lazy()
- ZodEffects for combining preprocess, refine, and transform
- Cyclical data handling precautions
- Promise schemas with z.promise()
- Instanceof validations with z.instanceof(Class)

## Attribution
Crawled from: https://github.com/colinhacks/zod
Data Size: 829269 bytes, Links: 5674

## Attribution
- Source: Zod Schema Validation Guide
- URL: https://github.com/colinhacks/zod
- License: License if known: MIT
- Crawl Date: 2025-04-26T07:44:48.301Z
- Data Size: 829269 bytes
- Links Found: 5674

## Retrieved
2025-04-26
