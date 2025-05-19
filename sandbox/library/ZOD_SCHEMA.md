# ZOD_SCHEMA

## Crawl Summary
TypeScript 4.5+, strict mode; install via npm/yarn/pnpm/bun; import { z } from "zod"; primitive schemas: string, number, bigint, boolean, date, null, undefined, any, unknown, never; coercion via z.coerce; string validators: min,max,length,email,url,regex,datetime; number validators: gte, lte, int, positive, multipleOf, finite; object schemas: z.object(shape) with methods shape, extend, merge, pick, omit, partial, required, strict, passthrough, catchall; arrays: z.array, nonempty,min,max; unions: union, or, discriminatedUnion; parse vs safeParse sync and async; custom refine, transform, preprocess; custom error messages.

## Normalised Extract
Table of Contents:
1 TypeScript Configuration
2 Installation
3 Importing Zod
4 Schema Types
  4.1 Primitives
  4.2 Coercion Schemas
  4.3 String Validators
  4.4 Number Validators
  4.5 Object Schemas
  4.6 Array Schemas
  4.7 Union Schemas
5 Parsing Methods
6 Custom Validation

1 TypeScript Configuration
Enable strict mode in tsconfig.json:
  "compilerOptions": {"strict": true}

2 Installation
npm install zod
yarn add zod
pnpm add zod
bun add zod

3 Importing Zod
import { z } from "zod";

4 Schema Types
4.1 Primitives:
z.string():ZodString  z.number():ZodNumber  z.bigint():ZodBigInt
z.boolean():ZodBoolean  z.date():ZodDate  z.undefined():ZodUndefined
z.null():ZodNull  z.any():ZodAny  z.unknown():ZodUnknown  z.never():ZodNever

4.2 Coercion Schemas:
z.coerce.string() z.coerce.number() z.coerce.boolean() z.coerce.bigint() z.coerce.date()

4.3 String Validators:
z.string().min( min:number, {message?:string} )
z.string().max( max:number, {message?:string} )
z.string().length( length:number )
z.string().email({message?:string})
z.string().url({message?:string})
z.string().regex( regex:RegExp, {message?:string} )
z.string().datetime({offset?:boolean, precision?:number, local?:boolean})

4.4 Number Validators:
z.number().gte( min:number, {message?:string} )
z.number().lte( max:number, {message?:string} )
z.number().int()
z.number().positive()
z.number().multipleOf( factor:number )
z.number().finite()

4.5 Object Schemas:
z.object({ key:ZodType, ... }):ZodObject
Methods:
  .shape       // { [key]:ZodType }
  .extend( shape )
  .merge( other:ZodObject )
  .pick({ fields })
  .omit({ fields })
  .partial([fields])
  .required([fields])
  .strict()
  .passthrough()
  .catchall( schema )

4.6 Array Schemas:
z.array(itemSchema):ZodArray
Methods:
  .nonempty({message?:string})
  .min( count:number, {message?:string} )
  .max( count:number, {message?:string} )
  .length( count:number, {message?:string} )

4.7 Union Schemas:
z.union([schemas]):ZodUnion
z.string().or(z.boolean())
z.discriminatedUnion( discriminator:string, options:ZodObject[] )

5 Parsing Methods:
.parse(data:unknown):Type throws ZodError
.safeParse(data:unknown):{success:boolean,data?:Type,error?:ZodError}
.parseAsync(data:unknown):Promise<Type>
.safeParseAsync(data:unknown):Promise<...>

6 Custom Validation:
.refine( validator:(data)=>boolean, {message?:string} )
.transform( fn:(data)=>out )
.preprocess( fn:(input)=>any, schema )

## Supplementary Details
Type inference: z.infer<typeof schema> yields static TypeScript types.
Generic functions: use z.ZodType<Input,Def,Output> when needed.
Error formatting: ZodError.issues array with {path:string[], message:string, code:string}.
AbortEarly: default false; use .parse to collect all issues.
Refinements async: .refine returns Promise when validator async.
Cascading default: .default(value) sets default for optional fields.
Pipeline: .preprocess => parse => .transform => output.

Implementation steps:
1 Enable strict TS.
2 Install and import.
3 Define base schemas.
4 Chain validations.
5 Use .parse or .safeParse.
6 Catch errors: try/catch or check success flag.


## Reference Details
Zod API Specifications:

ZodString Methods:
--------------------------------
create():ZodString
min(min:number, params?:{message?:string}):ZodString
max(max:number, params?:{message?:string}):ZodString
length(len:number, params?:{message?:string}):ZodString
email(params?:{message?:string}):ZodString
url(params?:{message?:string}):ZodString
emoji(params?:{message?:string}):ZodString
uuid(params?:{message?:string}):ZodString
regex(regex:RegExp, params?:{message?:string}):ZodString
includes(substr:string, params?:{message?:string}):ZodString
startsWith(prefix:string, params?:{message?:string}):ZodString
endsWith(suffix:string, params?:{message?:string}):ZodString
datetime(options?:{offset?:boolean, precision?:number, local?:boolean}, params?:{message?:string}):ZodString
date(params?:{message?:string}):ZodString
time(params?:{message?:string}):ZodString
trim():ZodString
toLowerCase():ZodString
toUpperCase():ZodString

ZodNumber Methods:
--------------------------------
create():ZodNumber
gt(val:number, params?:{message?:string}):ZodNumber
gte(val:number, params?:{message?:string}):ZodNumber
lt(val:number, params?:{message?:string}):ZodNumber
lte(val:number, params?:{message?:string}):ZodNumber
int(params?:{message?:string}):ZodNumber
positive(params?:{message?:string}):ZodNumber
nonnegative(params?:{message?:string}):ZodNumber
negative(params?:{message?:string}):ZodNumber
nonpositive(params?:{message?:string}):ZodNumber
multipleOf(num:number, params?:{message?:string}):ZodNumber
finite(params?:{message?:string}):ZodNumber
safe(params?:{message?:string}):ZodNumber

ZodObject<T>:
--------------------------------
object<T extends ZodRawShape>(shape:T, params?:{unknownKeys?:"strip"|"passthrough"|"strict", catchall?:ZodType}):ZodObject<T>
.parse(data:unknown):Infer<T>
.safeParse(data:unknown)
.extend<U extends ZodRawShape>(shape:U):ZodObject<T&U>
.merge<U extends ZodRawShape>(other:ZodObject<U>):ZodObject<T&U>
.pick<Keys extends keyof T>(keys:{[K in Keys]:true}):ZodObject<Pick<T,Keys>>
.omit<Keys extends keyof T>(keys:{[K in Keys]:true}):ZodObject<Omit<T,Keys>>
.partial(keys?:Partial<Record<keyof T,true>>):ZodObject<Partial<T>>
.required(keys?:Partial<Record<keyof T,true>>):ZodObject<Required<T>>
.strict():ZodObject<T>
.passthrough():ZodObject<T>
.catchall(schema:ZodType):ZodObject<T>

Common Usage Pattern:
```typescript
const ConfigSchema = z.object({
  host: z.string().url(),
  port: z.number().int().positive().default(80)
}).strict();

try {
  const config = ConfigSchema.parse(process.env);
} catch(e) {
  console.error((e as ZodError).issues);
}
```

Best Practices:
• Enable strict TS for full type inference.
• Use .safeParse in async contexts to avoid exceptions.
• Chain methods for clarity and immutability.

Troubleshooting:
Command:
  > node -e "const { z } = require('zod'); console.log(z.string().min(5).safeParse('abc'))"
Expected:
  { success: false, error: ZodError { issues: [ { path: [], message: 'String must contain at least 5 character(s)', code: 'too_small' } ] } }

Check error codes: e.issues[].code. Use custom messages via params.

## Information Dense Extract
TS4.5+,strict; install zod; import {z}; z.string():ZodString; z.number():ZodNumber; z.coerce for primitives; z.string().min/max/length/email/url/regex/datetime; z.number().gte/lte/int/positive/multipleOf/finite; z.object(shape) with .shape/.extend/.merge/.pick/.omit/.partial/.required/.strict/.passthrough/.catchall; z.array(schema).nonempty/min/max/length; z.union([...])/.or; z.discriminatedUnion(key,options); .parse(data):T throws; .safeParse returns success/data or error; .parseAsync/.safeParseAsync for async; .refine(fn,{message}); .transform(fn); .preprocess(fn,schema); z.infer<typeofschema> for TS types; ZodError.issues with path,code,message; immutable chain; use .default() for defaults.

## Sanitised Extract
Table of Contents:
1 TypeScript Configuration
2 Installation
3 Importing Zod
4 Schema Types
  4.1 Primitives
  4.2 Coercion Schemas
  4.3 String Validators
  4.4 Number Validators
  4.5 Object Schemas
  4.6 Array Schemas
  4.7 Union Schemas
5 Parsing Methods
6 Custom Validation

1 TypeScript Configuration
Enable strict mode in tsconfig.json:
  'compilerOptions': {'strict': true}

2 Installation
npm install zod
yarn add zod
pnpm add zod
bun add zod

3 Importing Zod
import { z } from 'zod';

4 Schema Types
4.1 Primitives:
z.string():ZodString  z.number():ZodNumber  z.bigint():ZodBigInt
z.boolean():ZodBoolean  z.date():ZodDate  z.undefined():ZodUndefined
z.null():ZodNull  z.any():ZodAny  z.unknown():ZodUnknown  z.never():ZodNever

4.2 Coercion Schemas:
z.coerce.string() z.coerce.number() z.coerce.boolean() z.coerce.bigint() z.coerce.date()

4.3 String Validators:
z.string().min( min:number, {message?:string} )
z.string().max( max:number, {message?:string} )
z.string().length( length:number )
z.string().email({message?:string})
z.string().url({message?:string})
z.string().regex( regex:RegExp, {message?:string} )
z.string().datetime({offset?:boolean, precision?:number, local?:boolean})

4.4 Number Validators:
z.number().gte( min:number, {message?:string} )
z.number().lte( max:number, {message?:string} )
z.number().int()
z.number().positive()
z.number().multipleOf( factor:number )
z.number().finite()

4.5 Object Schemas:
z.object({ key:ZodType, ... }):ZodObject
Methods:
  .shape       // { [key]:ZodType }
  .extend( shape )
  .merge( other:ZodObject )
  .pick({ fields })
  .omit({ fields })
  .partial([fields])
  .required([fields])
  .strict()
  .passthrough()
  .catchall( schema )

4.6 Array Schemas:
z.array(itemSchema):ZodArray
Methods:
  .nonempty({message?:string})
  .min( count:number, {message?:string} )
  .max( count:number, {message?:string} )
  .length( count:number, {message?:string} )

4.7 Union Schemas:
z.union([schemas]):ZodUnion
z.string().or(z.boolean())
z.discriminatedUnion( discriminator:string, options:ZodObject[] )

5 Parsing Methods:
.parse(data:unknown):Type throws ZodError
.safeParse(data:unknown):{success:boolean,data?:Type,error?:ZodError}
.parseAsync(data:unknown):Promise<Type>
.safeParseAsync(data:unknown):Promise<...>

6 Custom Validation:
.refine( validator:(data)=>boolean, {message?:string} )
.transform( fn:(data)=>out )
.preprocess( fn:(input)=>any, schema )

## Original Source
Zod Schema Validation
https://github.com/colinhacks/zod

## Digest of ZOD_SCHEMA

# Installation

## Requirements
TypeScript 4.5 or higher with strict mode enabled.

// tsconfig.json
{
  "compilerOptions": {
    "strict": true
  }
}

## From npm
npm install zod       # npm
yarn add zod          # yarn
pnpm add zod          # pnpm
bun add zod           # bun

date retrieved: 2024-06-05

# Basic Usage

Import Zod:
```typescript
import { z } from "zod";
```

Create and parse schemas:
```typescript
const myString = z.string();
myString.parse("hello");         // returns "hello"
myString.safeParse(123);         // { success: false; error: ZodError }
```

# Primitives and Schemas

## Primitives
z.string(): ZodString
z.number(): ZodNumber
z.bigint(): ZodBigInt
z.boolean(): ZodBoolean
z.date(): ZodDate
z.undefined(): ZodUndefined
z.null(): ZodNull
z.any(): ZodAny
z.unknown(): ZodUnknown
z.never(): ZodNever

## Coercion
z.coerce.string()
z.coerce.number()
z.coerce.boolean()
z.coerce.bigint()
z.coerce.date()

# String Validations

z.string().min(5, { message: "min length 5" })
z.string().max(10, { message: "max length 10" })
z.string().length(8)
z.string().email()
z.string().url()
z.string().regex(/^[a-z]+$/)
z.string().datetime({ offset: true, precision: 3 })

# Number Validations

z.number().gte(0)
z.number().lte(100)
z.number().int()
z.number().positive()
z.number().multipleOf(5)
z.number().finite()

# Object Schemas

```typescript
const User = z.object({
  id: z.string(),
  age: z.number().int().positive()
});
```

Methods:
User.shape       // access field schemas
User.extend({ email: z.string().email() })
User.merge(Other)
User.pick({ id: true })
User.omit({ age: true })
User.partial()
User.required()
User.strict()
User.passthrough()
User.catchall(z.any())

# Array Schemas

z.array(z.string())
z.string().array().nonempty({ message: "cannot be empty" })
z.string().array().min(2)

# Unions and Discriminated Unions

z.union([z.string(), z.number()])
z.string().or(z.boolean())
z.discriminatedUnion("type", [ObjA, ObjB])

# Parsing and Safe Parsing

schema.parse(data)         // returns data or throws ZodError
schema.safeParse(data)     // { success: true; data } or { success: false; error }
schema.parseAsync(data)    // for async refinements
schema.safeParseAsync(data)

# Refinements and Transforms

z.string().refine(val => val.length <= 10, { message: "<=10 chars" })
z.string().transform(val => val.trim())
z.preprocess(val => String(val), z.number())

# Error Handling

Custom messages via params object in schema constructors and validation methods.


## Attribution
- Source: Zod Schema Validation
- URL: https://github.com/colinhacks/zod
- License: Unknown
- Crawl Date: 2025-05-19T03:39:55.376Z
- Data Size: 859563 bytes
- Links Found: 5833

## Retrieved
2025-05-19
