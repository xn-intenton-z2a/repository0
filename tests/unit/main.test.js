import { test, expect } from 'vitest';
import { fizzBuzz, fizzBuzzSingle } from '../../src/lib/main.js';

test('fizzBuzz(0) returns []', () => {
  expect(fizzBuzz(0)).toEqual([]);
});

test('fizzBuzz(1) returns ["1"]', () => {
  expect(fizzBuzz(1)).toEqual(['1']);
});

test('fizzBuzz(3) returns ["1","2","Fizz"]', () => {
  expect(fizzBuzz(3)).toEqual(['1','2','Fizz']);
});

test('fizzBuzz(5) has Buzz at position 5', () => {
  expect(fizzBuzz(5)).toEqual(['1','2','Fizz','4','Buzz']);
});

test('fizzBuzz(15) matches expected full sequence', () => {
  expect(fizzBuzz(15)).toEqual([
    '1','2','Fizz','4','Buzz','Fizz','7','8','Fizz','Buzz','11','Fizz','13','14','FizzBuzz'
  ]);
});

test('fizzBuzz throws on non-integer, non-number, and negative inputs', () => {
  expect(() => fizzBuzz(-1)).toThrow(TypeError);
  expect(() => fizzBuzz(-1)).toThrow('n must be a non-negative integer');
  expect(() => fizzBuzz(3.5)).toThrow(TypeError);
  expect(() => fizzBuzz('10')).toThrow(TypeError);
});

// Tests for fizzBuzzSingle
test('fizzBuzzSingle outputs', () => {
  expect(fizzBuzzSingle(3)).toBe('Fizz');
  expect(fizzBuzzSingle(5)).toBe('Buzz');
  expect(fizzBuzzSingle(15)).toBe('FizzBuzz');
  expect(fizzBuzzSingle(7)).toBe('7');
});
