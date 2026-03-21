VITEST

NORMALISED EXTRACT

Table of contents:
- Core API: test, describe, expect
- Common matchers
- CLI & run modes
- Requirements and installation

Core API and signatures:
- import { test, describe, expect, it } from 'vitest'
- test(name: string, fn: () => any | Promise<any>): void
- describe(name: string, fn: () => any): void
- expect<T>(value: T): Expect<T> // Expect exposes matchers described below

Common matchers (subset):
- toBe(expected: any): void
- toEqual(expected: any): void
- toBeTruthy(): void
- toBeFalsy(): void
- toThrow(err?: any): void
- toBeDefined(): void
- toBeUndefined(): void
- Vitest implements a Jest-like matcher set; consult the API for full list.

CLI / Installation:
- Install: npm install -D vitest (or yarn/pnpm/bun equivalents)
- Run tests: npx vitest or add script "test": "vitest" to package.json
- CI usage: vitest --run to run tests in non-watch/CI mode
- Requirements noted in docs: Vite >= v6.0.0 and Node >= v20.0.0

REFERENCE DETAILS
- API signatures:
  - test(name: string, fn: Function): void
  - describe(name: string, fn: Function): void
  - expect(value): Expect with matcher methods (toBe, toEqual, toThrow, ...)
- Programmatic APIs exist for advanced usage; most projects use CLI or package.json scripts.

DETAILED DIGEST (source content summary)
- Source: https://vitest.dev/guide/ (retrieved 2026-03-21)
  - Primary points: Vitest is a Vite-powered test framework with Jest-like API; guides provide getting-started instructions, common matchers, and CLI usage.
  - Retrieval date: 2026-03-21
  - Bytes retrieved during crawl: 113697

ATTRIBUTION
- Source URL: https://vitest.dev/guide/
- Retrieved: 2026-03-21
- Bytes crawled: 113697
