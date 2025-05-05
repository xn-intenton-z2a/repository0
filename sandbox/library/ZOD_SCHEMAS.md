# ZOD_SCHEMAS

## Crawl Summary
z.string():ZodString;z.number():ZodNumber;z.boolean():ZodBoolean;z.date():ZodDate;z.undefined():ZodUndefined;z.null():ZodNull;z.any():ZodAny;z.unknown():ZodUnknown;z.never():ZodNever;z.void():ZodVoid;z.array(item:ZodType):ZodArray;z.tuple(items:ZodType[]):ZodTuple;z.record(key:ZodType,value:ZodType):ZodRecord;z.object(shape:ZodRawShape,params?:{strict?:boolean;catchall?:ZodType<any>}):ZodObject;z.union([ZodType]):ZodUnion;z.intersection(a:ZodType,b:ZodType):ZodIntersection;z.enum([string]):ZodEnum;z.nativeEnum(obj:object):ZodNativeEnum;schema.optional():ZodOptional;schema.nullable():ZodNullable;schema.default(val:any):ZodDefault;schema.transform(fn):ZodEffects;schema.refine(fn,msg?):ZodEffects;schema.catch(val:any):ZodEffects;z.lazy(fn):ZodLazy;schema.parse(input):T;schema.safeParse(input):{success:true,data:T}|{success:false,error:ZodError};schema.parseAsync(input):Promise<T>;schema.safeParseAsync(input):Promise<{success:true,data:T}|{success:false,error:ZodError}>;ZodError.errors:ZodIssue[];ZodError.flatten():{formErrors:string[];fieldErrors:Record<string,string[]>};z.object(shape).strict(),.passthrough(),.catchall(type)

## Normalised Extract
Table of Contents
1 Basic Primitives
2 Composite Schemas
3 Modifiers & Effects
4 Parsing API
5 Error API
6 Configuration Options

1 Basic Primitives
  z.string() returns ZodString
  z.number() returns ZodNumber
  z.boolean() returns ZodBoolean
  z.date() returns ZodDate
  z.undefined() returns ZodUndefined
  z.null() returns ZodNull
  z.any() returns ZodAny
  z.unknown() returns ZodUnknown
  z.never() returns ZodNever
  z.void() returns ZodVoid

2 Composite Schemas
  z.array(item: ZodType) => ZodArray of items
  z.tuple(items: ZodType[]) => ZodTuple of fixed-length items
  z.record(key: ZodType, value: ZodType) => ZodRecord mapping keys to values
  z.object(shape: ZodRawShape, params?:{strict?:boolean;catchall?:ZodType}) => ZodObject
  z.union(options: [ZodType,...]) => ZodUnion selecting one type
  z.intersection(a: ZodType, b: ZodType) => ZodIntersection intersection of two schemas
  z.enum(values: string[]) => ZodEnum literal union
  z.nativeEnum(obj: object) => ZodNativeEnum mapping native enum

3 Modifiers & Effects
  schema.optional() => ZodOptional
  schema.nullable() => ZodNullable
  schema.default(value) => ZodDefault with fallback
  schema.transform(mapper) => ZodEffects apply sync transform
  schema.refine(check, message?) => ZodEffects apply predicate
  schema.catch(defaultValue) => ZodEffects catch parsing errors
  z.lazy(fn) => ZodLazy for recursive schemas

4 Parsing API
  schema.parse(input) => validated and parsed T or throws ZodError
  schema.safeParse(input) => success flag and data or ZodError
  schema.parseAsync(input) => Promise<T> for async refinements
  schema.safeParseAsync(input) => Promise<safeParse result>

5 Error API
  ZodError.errors: ZodIssue[]
  ZodError.flatten() => { formErrors: string[]; fieldErrors: Record<string,string[]> }
  ZodError.format() => Record<string,string[]> formatted messages

6 Configuration Options
  z.object(...).strict() strips/throws on unknown keys
  z.object(...).passthrough() retains unknown keys
  z.object(...).catchall(type) applies schema to all unspecified keys

## Supplementary Details
Parameter Details
- ZodRawShape: Record<string,ZodType>
- strict?: boolean default false
- catchall?: ZodType<any> default none
- transform(mapper: (val:any)=>any)
- refine(check: (val:any)=>boolean, message?: string)

Implementation Steps
1 import { z } from 'zod'
2 define schema via z.object, z.string, etc.
3 parse with safeParse or parseAsync for async
4 handle success.data or error.errors via flatten()
5 apply .strict(), .passthrough(), or .catchall() as needed

Default Values Behavior
- .default(v) applied when input is undefined
- .nullable() allows null only
- .optional() allows undefined only
- combining optional and default yields default when undefined


## Reference Details
API Specifications
- z.string(def?: StringDef): ZodString
- z.number(def?: NumberDef): ZodNumber
- z.boolean(): ZodBoolean
- z.date(): ZodDate
- z.undefined(): ZodUndefined
- z.null(): ZodNull
- z.any(): ZodAny
- z.unknown(): ZodUnknown
- z.never(): ZodNever
- z.void(): ZodVoid
- z.array(schema: ZodType, params?: ArrayDef): ZodArray
- z.tuple(items: [ZodType,...], params?: TupleDef): ZodTuple
- z.record(keyType: ZodType, valueType: ZodType, params?: RecordDef): ZodRecord
- z.object(shape: ZodRawShape, params?:{strict?:boolean;passthrough?:boolean;catchall?:ZodType<any>}): ZodObject
- z.union(types: [ZodType,...], params?: UnionDef): ZodUnion
- z.intersection(a: ZodType, b: ZodType): ZodIntersection
- z.enum(values: string[], params?: EnumDef): ZodEnum
- z.nativeEnum(e: object, params?: NativeEnumDef): ZodNativeEnum
- z.lazy(fn: ()=>ZodType): ZodLazy

Schema Methods
- optional(): ZodOptional
- nullable(): ZodNullable
- default(def: any): ZodDefault
- transform(fn: (val:any)=>any): ZodEffects
- refine(fn: (val:any)=>boolean, message?: string): ZodEffects
- catch(def: any): ZodEffects
- strict(): enforced on ZodObject
- passthrough(): on ZodObject
- catchall(type: ZodType): on ZodObject

Parsing
- parse(input: unknown): T throws ZodError
- safeParse(input: unknown): SafeParseReturn<T>
- parseAsync(input: unknown): Promise<T>
- safeParseAsync(input: unknown): Promise<SafeParseReturn<T>>

Types
- type SafeParseReturn<T> = { success: true; data: T } | { success: false; error: ZodError<T> }

Error Handling
- ZodError<T>.errors: ZodIssue[]
- ZodIssue: { path: (string|number)[]; message: string; code: string }
- ZodError.flatten(): { formErrors: string[]; fieldErrors: Record<string,string[]> }
- ZodError.format(): Record<string,string[]>

Best Practices
1 Always use safeParse for predictable error handling
2 Use .strict() on objects to prevent injection of unexpected keys
3 Leverage .refine for cross-field validation
4 Combine .default with .optional for fallback values

Code Example
import { z } from 'zod'
const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  age: z.number().int().nonnegative().optional(),
  roles: z.enum(['admin','user']).default('user')
}).strict()

const result = UserSchema.safeParse(input)
if (!result.success) {
  console.error(result.error.flatten().fieldErrors)
} else {
  const user = result.data
  // use user.id, user.name, user.age, user.roles
}

Troubleshooting
- Unexpected keys dropped: apply .passthrough() or remove .strict()
- Invalid type: check .refine conditions and input shape
- Async refinements not awaited: use parseAsync



## Information Dense Extract
z.string():ZodString z.number():ZodNumber z.boolean():ZodBoolean z.date():ZodDate z.undefined():ZodUndefined z.null():ZodNull z.any():ZodAny z.unknown():ZodUnknown z.never():ZodNever z.void():ZodVoid z.array(item:ZodType):ZodArray z.tuple([ZodType,...]):ZodTuple z.record(key:ZodType,value:ZodType):ZodRecord z.object(shape,{strict?,passthrough?,catchall?}):ZodObject z.union([ZodType,...]):ZodUnion z.intersection(a:ZodType,b:ZodType):ZodIntersection z.enum([string,...]):ZodEnum z.nativeEnum(obj):ZodNativeEnum z.lazy(fn):ZodLazy optional() nullable() default(v) transform(fn) refine(fn,msg?) catch(v) parse(x):T safeParse(x):{success,data}|{error} parseAsync(x):Promise<T> safeParseAsync(x):Promise<safeParse> ZodError.errors:ZodIssue[] ZodError.flatten():{formErrors,fieldErrors} ZodError.format():Record<string,string[]> schema.strict() schema.passthrough() schema.catchall(t)

## Sanitised Extract
Table of Contents
1 Basic Primitives
2 Composite Schemas
3 Modifiers & Effects
4 Parsing API
5 Error API
6 Configuration Options

1 Basic Primitives
  z.string() returns ZodString
  z.number() returns ZodNumber
  z.boolean() returns ZodBoolean
  z.date() returns ZodDate
  z.undefined() returns ZodUndefined
  z.null() returns ZodNull
  z.any() returns ZodAny
  z.unknown() returns ZodUnknown
  z.never() returns ZodNever
  z.void() returns ZodVoid

2 Composite Schemas
  z.array(item: ZodType) => ZodArray of items
  z.tuple(items: ZodType[]) => ZodTuple of fixed-length items
  z.record(key: ZodType, value: ZodType) => ZodRecord mapping keys to values
  z.object(shape: ZodRawShape, params?:{strict?:boolean;catchall?:ZodType}) => ZodObject
  z.union(options: [ZodType,...]) => ZodUnion selecting one type
  z.intersection(a: ZodType, b: ZodType) => ZodIntersection intersection of two schemas
  z.enum(values: string[]) => ZodEnum literal union
  z.nativeEnum(obj: object) => ZodNativeEnum mapping native enum

3 Modifiers & Effects
  schema.optional() => ZodOptional
  schema.nullable() => ZodNullable
  schema.default(value) => ZodDefault with fallback
  schema.transform(mapper) => ZodEffects apply sync transform
  schema.refine(check, message?) => ZodEffects apply predicate
  schema.catch(defaultValue) => ZodEffects catch parsing errors
  z.lazy(fn) => ZodLazy for recursive schemas

4 Parsing API
  schema.parse(input) => validated and parsed T or throws ZodError
  schema.safeParse(input) => success flag and data or ZodError
  schema.parseAsync(input) => Promise<T> for async refinements
  schema.safeParseAsync(input) => Promise<safeParse result>

5 Error API
  ZodError.errors: ZodIssue[]
  ZodError.flatten() => { formErrors: string[]; fieldErrors: Record<string,string[]> }
  ZodError.format() => Record<string,string[]> formatted messages

6 Configuration Options
  z.object(...).strict() strips/throws on unknown keys
  z.object(...).passthrough() retains unknown keys
  z.object(...).catchall(type) applies schema to all unspecified keys

## Original Source
Zod Schema Validation
https://zod.dev

## Digest of ZOD_SCHEMAS

# Zod Schema Validation Technical Digest (retrieved 2024-06-30)

# Basic Primitives

- z.string(): ZodString
- z.number(): ZodNumber
- z.boolean(): ZodBoolean
- z.date(): ZodDate
- z.undefined(): ZodUndefined
- z.null(): ZodNull
- z.any(): ZodAny
- z.unknown(): ZodUnknown
- z.never(): ZodNever
- z.void(): ZodVoid

# Composite Schemas

- z.array(item: ZodType): ZodArray
- z.tuple(items: ZodType[]): ZodTuple
- z.record(key: ZodType, value: ZodType): ZodRecord
- z.object(shape: ZodRawShape, params?: { strict?: boolean; catchall?: ZodType<any> }): ZodObject
- z.union(options: [ZodType,...]): ZodUnion
- z.intersection(a: ZodType, b: ZodType): ZodIntersection
- z.enum(values: [string,...]): ZodEnum
- z.nativeEnum(enumObj: object): ZodNativeEnum

# Modifiers & Effects

- schema.optional(): ZodOptional
- schema.nullable(): ZodNullable
- schema.default(value: any): ZodDefault
- schema.transforms(mapper: (value)=>any): ZodEffects
- schema.refine(check: (value)=>boolean, message?: string): ZodEffects
- schema.catch(defaultForError: any): ZodEffects
- z.lazy(fn: ()=>ZodType): ZodLazy

# Parsing Methods

- schema.parse(input: unknown): T
- schema.safeParse(input: unknown): { success: true; data: T } | { success: false; error: ZodError<T> }
- schema.parseAsync(input: unknown): Promise<T>
- schema.safeParseAsync(input: unknown): Promise<{ success: true; data: T } | { success: false; error: ZodError<T> }>

# Error Handling

- ZodError<T> properties:
    errors: ZodIssue[]
    flatten(): { formErrors: string[]; fieldErrors: Record<string,string[]> }
    format(): Record<string,string[]>

# Configuration Options

- z.object strict mode: z.object(shape).strict() strips unknown props and throws on extras
- z.object passthrough(): allows unknown props alongside defined schema
- catchall(type): applies a schema to all unspecified keys



## Attribution
- Source: Zod Schema Validation
- URL: https://zod.dev
- License: License
- Crawl Date: 2025-05-05T14:24:57.571Z
- Data Size: 0 bytes
- Links Found: 0

## Retrieved
2025-05-05
