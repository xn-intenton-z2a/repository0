# repository0 — FizzBuzz Feature

This repository demonstrates a small FizzBuzz library and web demo used by the agentic workflows.

Usage examples:

- Library

  import { fizzBuzz, fizzBuzzSingle } from './src/lib/main.js'

  fizzBuzz(5) -> ["1","2","Fizz","4","Buzz"]
  fizzBuzzSingle(15) -> "FizzBuzz"

- CLI

  node src/lib/main.js 15
  # prints: FizzBuzz

- Web demo

  Open `src/web/index.html` (or run `npm run start` after `npm run build:web`) and use the interactive demo.

Web demo element IDs used by testers:
- fizz-input, fizz-submit, fizz-output
- fizz-range, fizz-range-submit, fizz-range-output
- fizz-error

See docs/fizz-buzz.md for API contract and examples.
