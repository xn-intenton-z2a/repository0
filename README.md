# FizzBuzz Library

This repository implements a small FizzBuzz library with: library exports, CLI, web demo, unit tests, and behaviour tests.

Usage examples (Node):

import { fizzBuzz, fizzBuzzSingle } from './src/lib/fizz.js';

fizzBuzz(15) // => [ '1', '2', 'Fizz', '4', 'Buzz', 'Fizz', '7', '8', 'Fizz', 'Buzz', '11', 'Fizz', '13', '14', 'FizzBuzz' ]

fizzBuzzSingle(3) // => 'Fizz'
fizzBuzzSingle(5) // => 'Buzz'
fizzBuzzSingle(15) // => 'FizzBuzz'
fizzBuzzSingle(7) // => '7'

CLI:

node src/lib/main.js 15

Website demo:

npm run build:web
open docs/index.html

Tests:

npm ci && npm test
npm run test:behaviour
