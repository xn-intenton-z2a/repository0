VITEST_EXPECT

Table of Contents
- Overview
- Core API: expect(value)
- Common matchers and signatures
- Async matchers (resolves / rejects)
- Extending expect
- Supplementary details
- Reference signatures (Type-like) and return types
- Digest and crawl metadata
- Attribution

Overview
expect is the Vitest assertion entrypoint. Call expect(value) to obtain a set of matcher functions for synchronous and asynchronous assertions. Matchers throw on failure; they do not return truthy values.

Core API: expect(value)
- Input: any JavaScript value
- Returns: an object (Matchers) exposing assertion methods. For promises, the returned object exposes modifiers "resolves" and "rejects" that return Promise-aware matchers.

Common matchers and signatures (precise forms)
- toBe(expected)
  - Signature: toBe(expected: unknown): void
  - Behavior: strict equality using ===
- toEqual(expected)
  - Signature: toEqual(expected: unknown): void
  - Behavior: deep equality (structured clone / recursive comparison)
- toStrictEqual(expected)
  - Signature: toStrictEqual(expected: unknown): void
  - Behavior: deeper comparison including object types and prototypes
- toBeNull(): void
- toBeUndefined(): void
- toBeTruthy(): void
- toBeFalsy(): void
- toContain(item: unknown): void
  - Checks presence in arrays/iterables/strings
- toHaveLength(length: number): void
- toMatch(regexpOrString: RegExp | string): void
- toMatchObject(object: object): void
- toBeInstanceOf(ctor: Function): void
- toThrow(error?: string | RegExp | Error | { message?: string } | Function): void
  - Used for asserting thrown errors from functions

Async matchers
- Awaiting promise results uses modifiers:
  - await expect(promise).resolves.toBe(value)
    - "resolves" returns matchers that assert the resolved value
  - await expect(promise).rejects.toThrow(/message/)
    - "rejects" returns matchers that assert the rejection reason
- Signature patterns (Type-like):
  - expect<T>(actual: T | Promise<T>): Matchers<T> | PromiseMatchers<T>
  - PromiseMatchers<T> provide the same matchers but operate on the awaited value

Extending expect
- expect.extend(matchers: Record<string, Function>): void
  - Adds custom matchers globally; each matcher should return { pass: boolean, message: () => string }

Supplementary details
- Matchers throw an Error on mismatch; tests should let the test runner surface these errors.
- Use toEqual for structural comparisons; use toBe for identity checks.
- Prefer explicit matchers (toBeNull, toBeUndefined) for clearer diagnostics.
- When asserting promises, always await the expect(...).resolves/rejects expression to ensure the test runner observes the assertion.

Reference signatures (Type-like)
- declare function expect<T = any>(actual: T | Promise<T>): Matchers<T>;
- interface Matchers<T> {
  toBe(expected: unknown): void;
  toEqual(expected: unknown): void;
  toStrictEqual(expected: unknown): void;
  toBeNull(): void;
  toBeUndefined(): void;
  toBeTruthy(): void;
  toBeFalsy(): void;
  toContain(item: unknown): void;
  toHaveLength(len: number): void;
  toMatch(r: RegExp | string): void;
  toThrow(err?: unknown): void;
  resolves?: PromiseMatchers<T>;
  rejects?: PromiseMatchers<T>;
}
- interface PromiseMatchers<T> extends Matchers<T> {}

Digest and crawl metadata
- Source section: https://vitest.dev/api/expect.html
- Retrieved: 2026-03-21
- Bytes downloaded during crawl: 492453 bytes

Attribution
- Source: Vitest API — Expect (https://vitest.dev/api/expect.html). Retrieved 2026-03-21; crawl size 492453 bytes.
