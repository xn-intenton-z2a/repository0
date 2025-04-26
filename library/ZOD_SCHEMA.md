# ZOD_SCHEMA

## Crawl Summary
Key technical details include installation commands, schema creation for primitives, objects, arrays, tuples, unions, recursive schemas, function schemas, and advanced validations. Direct API methods such as .parse, .safeParse, .parseAsync, .refine, and transformation methods (.transform, .preprocess) are covered with explicit parameter options. Detailed specifications for coercion, string validations (email, url, regex, datetime), object schema manipulations (.extend, .merge, .pick/.omit, .partial, .deepPartial, .passthrough, .strict, .strip, .catchall), and error handling are presented.

## Normalised Extract
Table of Contents:
1. Installation and tsconfig Requirements
   - TypeScript 4.5+ with strict=true
   - Install via npm, yarn, bun, pnpm (zod and zod@canary)
2. Schema Definitions and Parsing Methods
   - Primitives: z.string(), z.number(), etc.
   - Coercion: z.coerce.string(), z.coerce.number(), etc. with built-in constructors
   - Parsing: .parse(data), .safeParse(data), .parseAsync(data)
3. Object and Complex Schemas
   - Object: z.object({ key: schema }), .shape, .keyof, .extend, .merge
   - Optional and Nullable: .optional(), .nullable(), .unwrap()
4. Array, Tuple, Union, and Discriminated Union Schemas
   - Arrays: z.array(schema) with .nonempty(), .min(), .max(), .length()
   - Tuples: z.tuple([...]) including .rest for variadic elements
   - Unions: z.union([...]) and .or, discriminatedUnion using a discriminator key
5. Advanced Features
   - Recursive schemas using z.lazy, custom refinements with .refine and .superRefine
   - Effect schemas: z.ZodEffects for preprocessing and transforms
   - Function schemas: z.function().args(...).returns(...).implement(fn), parameters(), returnType()
6. Special Validations and Custom Schemas
   - Literal values with z.literal, enums with z.enum and z.nativeEnum
   - Instance checks using z.instanceof, custom validations using z.custom

Each topic includes direct method signatures, parameter options (e.g., z.string().email({ message: 'Invalid email' })), and explicit code examples illustrating usage and expected outcomes.

## Supplementary Details
Installation: npm install zod; Enable strict mode in tsconfig.json. API Specs:
- z.string().parse(data: unknown): string
- z.string().safeParse(data: unknown): { success: boolean, data?: string, error?: ZodError }
- z.coerce.date() converts input using new Date(input)
- Object schema: z.object({ key: schema }) with .extend({ newKey: schema }), .merge(otherSchema)
- Array schemas: z.array(schema).nonempty({ message: 'Array cannot be empty' })
Configuration Options:
- String validations: min(n, { message }), max(n, { message }), length(n, { message }), email({ message }), regex(pattern, { message })
- Datetime: z.string().datetime({ offset: true, precision: 3, local: true })
- IP: z.string().ip({ version: 'v4' or 'v6' }), z.string().cidr({ version: 'v4' or 'v6' })
- Function schemas: z.function().args(schema1, schema2).returns(schema)
Best Practices:
- Use safeParse to handle validation errors gracefully.
- For recursive schemas, use z.lazy to avoid infinite loops.
- Extract inner schema from optional/nullable types with .unwrap().
Step-by-Step Troubleshooting:
1. Verify TypeScript strict mode is enabled in tsconfig.json.
2. Use .safeParse to inspect validation failure messages.
3. For coercion issues, use z.coerce rather than preprocess if possible.
4. Check method chaining order, e.g., z.string().optional().array() vs. z.string().array().optional().

## Reference Details
API Specifications:
- z.string(): ZodString
  .parse(input: unknown): string
  .safeParse(input: unknown): { success: boolean; data?: string; error?: ZodError }
  .parseAsync(input: unknown): Promise<string>
  .min(n: number, options?: { message?: string }): ZodString
  .max(n: number, options?: { message?: string }): ZodString
  .email(options?: { message?: string }): ZodString

- z.number(): ZodNumber
  .gt(num: number): ZodNumber
  .gte(num: number): ZodNumber
  .lt(num: number): ZodNumber
  .lte(num: number, options?: { message?: string }): ZodNumber
  .int(): ZodNumber
  .positive(): ZodNumber
  .nonnegative(): ZodNumber
  .negative(): ZodNumber
  .nonpositive(): ZodNumber
  .multipleOf(num: number): ZodNumber
  .finite(): ZodNumber
  .safe(): ZodNumber

- Object Schemas:
  const MyObj = z.object({ key: z.string() });
  Methods: .extend({ extra: schema }), .merge(OtherObj), .pick({ key: true }), .omit({ key: true }), .partial(), .deepPartial(), .required(), .passthrough(), .strict(), .strip(), .catchall(schema)

- Array Schemas:
  const arr = z.array(z.string());
  Methods: .nonempty(options), .min(n), .max(n), .length(n), .element

- Tuple Schemas:
  const tup = z.tuple([z.string(), z.number()]);
  .rest(schema) for variadic elements

- Union Schemas:
  z.union([z.string(), z.number()])
  Alternative: z.string().or(z.number())

- Discriminated Unions:
  const union = z.discriminatedUnion('status', [
    z.object({ status: z.literal('success'), data: z.string() }),
    z.object({ status: z.literal('failed'), error: z.instanceof(Error) })
  ]);

- Recursive Schemas:
  const categorySchema: z.ZodType<Category> = baseSchema.extend({
    subcategories: z.lazy(() => categorySchema.array())
  });

- Function Schemas:
  const func = z.function()
    .args(z.string(), z.number())
    .returns(z.boolean())
    .implement((s: string, n: number): boolean => { return s.length === n; });
  Methods: .parameters(), .returnType()

Commands for troubleshooting:
- Use .safeParse to get error details: e.g., result = schema.safeParse(input); if (!result.success) { console.error(result.error.format()); }
- For async validations, use .parseAsync and await the promise.

Full Code Example:

// String Schema with Coercion
import { z } from 'zod';
const schema = z.coerce.string().email().min(5, { message: 'Must be 5 or more characters long' });
console.log(schema.safeParse('example@test.com'));

// Object Schema
const User = z.object({
  username: z.string(),
  age: z.number().int().positive()
}).strict();

// Function Schema
const trimmedLength = z.function()
  .args(z.string())
  .returns(z.number())
  .implement((x) => x.trim().length);

// Recursive Schema
const baseCategorySchema = z.object({ name: z.string() });
const categorySchema: z.ZodType<any> = baseCategorySchema.extend({
  subcategories: z.lazy(() => categorySchema.array())
});

// Parsing Example
try {
  const user = User.parse({ username: 'Alice', age: 30 });
  console.log(user);
} catch (e) {
  console.error(e);
}


## Information Dense Extract
Zod; TypeScript 4.5+; strict mode required; Install: npm install zod; Schemas: z.string(), z.number(), z.boolean(), z.date(), z.enum, z.nativeEnum; Coercion: z.coerce.string() => String(), z.coerce.number() => Number(); Parsing: .parse(data), .safeParse(data), .parseAsync(data); Object: z.object({ key: schema }), .extend(), .merge(), .pick(), .omit(), .partial(), .deepPartial(), .required(), .passthrough(), .strict(), .strip(), .catchall(); Arrays: z.array(schema).nonempty(), .min(n), .max(n), .length(n); Tuples: z.tuple([...]), .rest(); Unions: z.union([schemas]), .or(), discriminatedUnion(key, options); Recursive: z.lazy(() => schema); Functions: z.function().args(...).returns(...).implement(fn), parameters(), returnType(); API methods include .refine, .superRefine, .transform, .preprocess; Detailed error handling and custom messages via options; Code examples demonstrate usage for validations and schema chaining.

## Sanitised Extract
Table of Contents:
1. Installation and tsconfig Requirements
   - TypeScript 4.5+ with strict=true
   - Install via npm, yarn, bun, pnpm (zod and zod@canary)
2. Schema Definitions and Parsing Methods
   - Primitives: z.string(), z.number(), etc.
   - Coercion: z.coerce.string(), z.coerce.number(), etc. with built-in constructors
   - Parsing: .parse(data), .safeParse(data), .parseAsync(data)
3. Object and Complex Schemas
   - Object: z.object({ key: schema }), .shape, .keyof, .extend, .merge
   - Optional and Nullable: .optional(), .nullable(), .unwrap()
4. Array, Tuple, Union, and Discriminated Union Schemas
   - Arrays: z.array(schema) with .nonempty(), .min(), .max(), .length()
   - Tuples: z.tuple([...]) including .rest for variadic elements
   - Unions: z.union([...]) and .or, discriminatedUnion using a discriminator key
5. Advanced Features
   - Recursive schemas using z.lazy, custom refinements with .refine and .superRefine
   - Effect schemas: z.ZodEffects for preprocessing and transforms
   - Function schemas: z.function().args(...).returns(...).implement(fn), parameters(), returnType()
6. Special Validations and Custom Schemas
   - Literal values with z.literal, enums with z.enum and z.nativeEnum
   - Instance checks using z.instanceof, custom validations using z.custom

Each topic includes direct method signatures, parameter options (e.g., z.string().email({ message: 'Invalid email' })), and explicit code examples illustrating usage and expected outcomes.

## Original Source
Zod Schema Validation
https://github.com/colinhacks/zod

## Digest of ZOD_SCHEMA

# ZOD_SCHEMA

Retrieved: 2023-10-08

## Overview
Zod is a TypeScript-first schema declaration and validation library with zero dependencies. It automatically infers static types and supports creating schemas for primitives, objects, arrays, tuples, unions, discriminated unions, recursive types, maps, sets, and functions.

## Installation and Requirements
- Requires: TypeScript 4.5+ with strict mode enabled in tsconfig.json.
- Installation commands:
  - npm: npm install zod
  - yarn: yarn add zod
  - bun: bun add zod
  - pnpm: pnpm add zod
- Canary versions available (e.g. npm install zod@canary)

## Basic Usage

### Creating Schemas
- String Schema:
  - Definition: const mySchema = z.string();
  - Parsing: mySchema.parse("tuna") returns "tuna"; mySchema.parse(12) throws ZodError.
- Object Schema:
  - Definition: const User = z.object({ username: z.string() });
  - Inferred Type: type User = { username: string };

### Parsing Methods
- .parse(data: unknown): T
- .safeParse(data: unknown): returns { success: true; data: T } or { success: false; error: ZodError }
- .parseAsync(data: unknown): Promise<T>

## Primitive Schemas and Coercion
- Primitives: z.string(), z.number(), z.bigint(), z.boolean(), z.date(), z.symbol(), z.undefined(), z.null(), z.void(), z.any(), z.unknown(), z.never().
- Coercion: Use z.coerce.string(), z.coerce.number(), etc. They apply constructors: String(input), Number(input), new Date(input).

## Validation and Refinement Methods
- .refine(validator: (data: T) => any, { message?: string }): custom validation
- .superRefine for multiple issues
- Common string validations: .max(), .min(), .length(), .email(), .url(), .regex(), .includes(), .startsWith(), .endsWith(), .datetime(), .ip(), .cidr()

## Object Schema Methods
- .shape to access keys
- .keyof to generate enum from keys
- .extend to add/overwrite properties
- .merge to combine schemas (B overrides A on conflict)
- .pick and .omit for selection and exclusion of keys
- .partial and .deepPartial to make properties optional
- .required to enforce requirement
- .passthrough, .strict, .strip, .catchall for unknown key handling

## Array, Tuple and Union Schemas
- Arrays: z.array(elementSchema) or elementSchema.array(), with .nonempty(), .min(), .max(), .length()
- Tuples: z.tuple([schema1, schema2, ...]) and .rest for variadic arguments
- Unions: z.union([schema1, schema2]) and .or, optionally using discriminatedUnions for efficient routing

## Advanced Schemas
- Recursive types: using z.lazy(() => schema.array())
- Effects with z.ZodEffects: .transform(), .preprocess() for input coercion
- Function schemas: z.function().args(...).returns(...).implement(fn) for validating input and output.
- JSON and cyclical object schemas via z.lazy()
- Special schemas: z.nan(), z.instanceof(), z.custom()

## API Methods for Functions
- .parameters(): returns schema tuple for parameters
- .returnType(): returns schema for function output

## Troubleshooting and Best Practices
- Always use safeParse for non-throwing validations.
- Ensure strict mode in tsconfig.json to catch type errors.
- Use .coerce methods to convert input types automatically.
- Use .lazy for recursive schemas and avoid runtime infinite loops in cyclical data.
- Customize error messages via options in schema creation.

## Attribution and Data Size
- Data Size: 903859 bytes
- Crawled from: https://github.com/colinhacks/zod


## Attribution
- Source: Zod Schema Validation
- URL: https://github.com/colinhacks/zod
- License: License if known: MIT
- Crawl Date: 2025-04-26T01:04:27.918Z
- Data Size: 903859 bytes
- Links Found: 6273

## Retrieved
2025-04-26
