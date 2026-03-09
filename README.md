# repository0 — FizzBuzz library

This project provides a small JavaScript library exporting FizzBuzz utilities that correctly handle negative and positive integers, zero, and ranges.

Usage example:

import { fizzBuzz, fizzBuzzSingle, fizzBuzzSequence } from './src/lib/main.js';

// single value
console.log(fizzBuzzSingle(-3)); // "Fizz"

// sequence from 1..n
console.log(fizzBuzz(5)); // ["1","2","Fizz","4","Buzz"]

// sequence for arbitrary start..end
console.log(fizzBuzzSequence(-5,-1)); // ["Buzz","-4","Fizz","-2","-1"]

See docs/ for examples and evidence.
