# ZOD_CORE

## Crawl Summary
Basic schema creation: z.string(), z.number(), z.boolean(), z.date(), z.object(), z.array(), z.union(), etc. Coercion methods map inputs via JS constructors. String validations: min, max, length, email, url, uuid, regex, datetime(options). Number validations: min/gte, max/lte, gt, lt, int, positive, nonnegative, negative, nonpositive, multipleOf. Parsing methods: .parse, .parseAsync, .safeParse, .safeParseAsync, .spa alias. Error handling via safeParse and flatten().

## Normalised Extract
Table of Contents:
1. Schema Creation
2. Primitive Types
3. Coercion
4. String Validations
5. Number Validations
6. Parsing Methods

1. Schema Creation
- import { z } from "zod";
- z.string(): ZodString
- z.number(): ZodNumber
- z.object(shape: Record<string,ZodType>): ZodObject
- z.array(type: ZodType): ZodArray
- z.union([types...]): ZodUnion

2. Primitive Types
- z.bigint(), z.boolean(), z.date(), z.undefined(), z.null(), z.void(), z.any(), z.unknown(), z.never()

3. Coercion
- z.coerce.string(): String(input)
- z.coerce.number(): Number(input)
- z.coerce.boolean(): Boolean(input)
- z.coerce.bigint(): BigInt(input)
- z.coerce.date(): new Date(input)

4. String Validations
signature: z.string().method(params?) returns ZodString
dot methods:
min(length:number,{message?:string}), max(length,{message}), length(exact,{message}), email({message}), url({message}), uuid({message}), regex(regexp,{message}), datetime({offset:boolean,local:boolean,precision:number},{message})
ex: z.string().min(5,{message:"Min 5"}).email()

5. Number Validations
methods on z.number():
min(value:number,{message}), max(value,{message}), gt(value,{message}), lt(value,{message}), int({message}), positive({message}), nonnegative({message}), negative({message}), nonpositive({message}), multipleOf(value,{message})
ex: z.number().min(0).max(10).multipleOf(2)

6. Parsing Methods
.parse(data:unknown): T throws ZodError
.parseAsync(data:unknown): Promise<T>
.safeParse(data): { success:true; data:T }|{success:false; error:ZodError}
.safeParseAsync(data): Promise<...>
.spa(data): alias safeParseAsync

## Supplementary Details
Requirements: TypeScript 4.5+, tsconfig.json with strict:true. Installation: npm install zod | yarn add zod | deno add npm:zod | bun add zod | pnpm add zod. For canary: install zod@canary. Import: import { z } from "zod". Strict mode ensures type inference matches schema. Use .coerce methods for input conversion. Use .safeParse/async to avoid exceptions. Call .flatten().fieldErrors to extract field-level error messages.

## Reference Details
API Specifications:
Function: z.string(): ZodString
Function: z.number(): ZodNumber
Function: z.coerce.string(): ZodString
Interfaces:
interface ZodString {
  min(minLength: number, params?: { message?: string }): ZodString;
  max(maxLength: number, params?: { message?: string }): ZodString;
  length(exact: number, params?: { message?: string }): ZodString;
  email(params?: { message?: string }): ZodString;
  url(params?: { message?: string }): ZodString;
  uuid(params?: { message?: string }): ZodString;
  regex(regex: RegExp, params?: { message?: string }): ZodString;
  datetime(options?: { offset?: boolean; local?: boolean; precision?: number }, params?: { message?: string }): ZodString;
}
interface ZodNumber {
  min(value: number, params?: { message?: string }): ZodNumber;
  max(value: number, params?: { message?: string }): ZodNumber;
  gt(value: number, params?: { message?: string }): ZodNumber;
  lt(value: number, params?: { message?: string }): ZodNumber;
  int(params?: { message?: string }): ZodNumber;
  positive(params?: { message?: string }): ZodNumber;
  nonnegative(params?: { message?: string }): ZodNumber;
  negative(params?: { message?: string }): ZodNumber;
  nonpositive(params?: { message?: string }): ZodNumber;
  multipleOf(value: number, params?: { message?: string }): ZodNumber;
}
Parsing Methods:
parse(data: unknown): T throws ZodError
parseAsync(data: unknown): Promise<T>
safeParse(data: unknown): { success: true; data: T } | { success: false; error: ZodError }
safeParseAsync(data: unknown): Promise<{ success: true; data: T } | { success: false; error: ZodError }>
spa(input: unknown): Promise<{ success: boolean }>
Implementation Pattern:
const schema = z.object({ id: z.string().uuid(), age: z.number().int().nonnegative() }).strict();
const { success, data, error } = await schema.spa(inputPayload);
if (!success) console.error(error.format()); else handle(data);

Best Practices:
• Enable strict mode in tsconfig to ensure type inference.
• Use .strict() on objects to disallow extra keys.
• Use .catchall() to validate unknown fields with a fallback schema.
• Prefer .safeParseAsync over try/catch around parse.

Troubleshooting:
Command: npx ts-node parse.ts
Error: ZodError: Required
→ Ensure input matches schema, use .optional() or .nullable() for missing fields.
Error: Non-Promise type
→ For promise schemas use .parseAsync or .safeParseAsync.


## Information Dense Extract
z.string(): ZodString; z.number(): ZodNumber; z.coerce.string()→String(input); z.coerce.number()→Number(input); z.string().min(n,{message})/.max(n)/.length(n)/.email()/.url()/.uuid()/.regex(r)/.datetime({offset?:boolean,local?:boolean,precision?:number}); z.number().min(n)/.max(n)/.gt(n)/.lt(n)/.int()/.positive()/.nonnegative()/.negative()/.nonpositive()/.multipleOf(n); parse(data:unknown):T throws; parseAsync(data):Promise<T>; safeParse(data):{success,data}|{success,error}; safeParseAsync; spa alias; install via npm/yarn/pnpm; import {z} from "zod"; tsconfig strict:true; use .safeParseAsync().flatten().fieldErrors; object.strict(); object.catchall(); array.min()/max()/nonempty(); union, tuple, map, set available.

## Sanitised Extract
Table of Contents:
1. Schema Creation
2. Primitive Types
3. Coercion
4. String Validations
5. Number Validations
6. Parsing Methods

1. Schema Creation
- import { z } from 'zod';
- z.string(): ZodString
- z.number(): ZodNumber
- z.object(shape: Record<string,ZodType>): ZodObject
- z.array(type: ZodType): ZodArray
- z.union([types...]): ZodUnion

2. Primitive Types
- z.bigint(), z.boolean(), z.date(), z.undefined(), z.null(), z.void(), z.any(), z.unknown(), z.never()

3. Coercion
- z.coerce.string(): String(input)
- z.coerce.number(): Number(input)
- z.coerce.boolean(): Boolean(input)
- z.coerce.bigint(): BigInt(input)
- z.coerce.date(): new Date(input)

4. String Validations
signature: z.string().method(params?) returns ZodString
dot methods:
min(length:number,{message?:string}), max(length,{message}), length(exact,{message}), email({message}), url({message}), uuid({message}), regex(regexp,{message}), datetime({offset:boolean,local:boolean,precision:number},{message})
ex: z.string().min(5,{message:'Min 5'}).email()

5. Number Validations
methods on z.number():
min(value:number,{message}), max(value,{message}), gt(value,{message}), lt(value,{message}), int({message}), positive({message}), nonnegative({message}), negative({message}), nonpositive({message}), multipleOf(value,{message})
ex: z.number().min(0).max(10).multipleOf(2)

6. Parsing Methods
.parse(data:unknown): T throws ZodError
.parseAsync(data:unknown): Promise<T>
.safeParse(data): { success:true; data:T }|{success:false; error:ZodError}
.safeParseAsync(data): Promise<...>
.spa(data): alias safeParseAsync

## Original Source
Zod Schema Validation
https://github.com/colinhacks/zod

## Digest of ZOD_CORE

# Basic Usage

```typescript
import { z } from "zod";

const mySchema = z.string();
// parse throws on invalid
const result1: string = mySchema.parse("tuna");
// safeParse returns { success, data } or { success, error }
const safe1 = mySchema.safeParse(12);
// safe1: { success: false; error: ZodError }
```

# Primitives

- z.string(): ZodString instance
- z.number(): ZodNumber instance
- z.bigint(): ZodBigInt
- z.boolean(): ZodBoolean
- z.date(): ZodDate
- z.undefined(), z.null(), z.void(), z.any(), z.unknown(), z.never()

# Coercion for Primitives

```typescript
const s = z.coerce.string();
s.parse(12); // "12"
s.parse(true); // "true"
z.coerce.number().min(0);
```
Coercion mapping: z.coerce.string() → String(input)
z.coerce.number() → Number(input)
z.coerce.boolean() → Boolean(input)
z.coerce.bigint() → BigInt(input)
z.coerce.date() → new Date(input)

# String Validations

Method signatures:
- .min(length: number, params?: { message?: string }): ZodString
- .max(length: number, params?: { message?: string }): ZodString
- .length(exact: number, params?: { message?: string }): ZodString
- .email(params?: { message?: string }): ZodString
- .url(params?: { message?: string }): ZodString
- .uuid(params?: { message?: string }): ZodString
- .regex(regex: RegExp, params?: { message?: string }): ZodString
- .datetime(options?: { offset?: boolean; local?: boolean; precision?: number }, params?: { message?: string }): ZodString

Examples:
```typescript
z.string().min(5, { message: "Too short" }).max(10)
const dt = z.string().datetime({ offset: true, precision: 3 });
dt.parse("2020-01-01T00:00:00+02:00");
```

# Number Validations

Method signatures:
- .min(value: number, params?: { message?: string }): ZodNumber (alias .gte)
- .max(value: number, params?: { message?: string }): ZodNumber (alias .lte)
- .gt(value: number, params?: { message?: string }): ZodNumber
- .lt(value: number, params?: { message?: string }): ZodNumber
- .int(params?: { message?: string }): ZodNumber
- .positive(params?: { message?: string }): ZodNumber
- .nonnegative(params?: { message?: string }): ZodNumber
- .negative(params?: { message?: string }): ZodNumber
- .nonpositive(params?: { message?: string }): ZodNumber
- .multipleOf(value: number, params?: { message?: string }): ZodNumber
```
```typescript
z.number().min(0).max(100).multipleOf(5)
z.number().int().positive()
```

# Parsing Methods

```typescript
.parse(data: unknown): T // throws ZodError
.parseAsync(data: unknown): Promise<T>
.safeParse(data: unknown): { success: true; data: T } | { success: false; error: ZodError }
.safeParseAsync(data: unknown): Promise<{ success: true; data: T } | { success: false; error: ZodError }>
.spa(data): alias for safeParseAsync
```

Error handling:
```typescript
const res = schema.safeParse(input);
if (!res.success) {
  console.error(res.error.flatten().fieldErrors);
} else {
  use(res.data);
}
```

## Attribution
- Source: Zod Schema Validation
- URL: https://github.com/colinhacks/zod
- License: License: MIT
- Crawl Date: 2025-05-10T09:44:29.003Z
- Data Size: 905457 bytes
- Links Found: 6164

## Retrieved
2025-05-10
