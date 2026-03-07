# FizzBuzz Library

Simple FizzBuzz utility functions.

Usage (programmatic):

import { fizzBuzzSingle, fizzBuzz } from './src/lib/main.js'

fizzBuzzSingle(3) // => 'Fizz'
fizzBuzz(15) // => ['1','2','Fizz',...,'FizzBuzz']

Command-line:

node src/lib/main.js 15

API:
- fizzBuzzSingle(n): returns the FizzBuzz result for a single integer n. Throws TypeError for non-integers and RangeError for n < 1.
- fizzBuzz(count): returns an array of length count using 1-based indexing. Throws TypeError for non-integer counts and RangeError for negative counts.
