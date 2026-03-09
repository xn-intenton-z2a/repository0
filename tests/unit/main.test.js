import { test, expect } from 'vitest';
import { fizzBuzz, fizzBuzzSingle } from '../../src/lib/main.js';

test('fizzBuzz(0) returns []', () => {
  expect(fizzBuzz(0)).toEqual([]);
});

test('fizzBuzz(1) returns ["1"]', () => {
  expect(fizzBuzz(1)).toEqual(['1']);
});

test('fizzBuzz(3) returns ["1","2","fizz"]', () => {
  expect(fizzBuzz(3)).toEqual(['1','2','fizz']);
});

test('fizzBuzz(5) has buzz at position 5', () => {
  expect(fizzBuzz(5)).toEqual(['1','2','fizz','4','buzz']);
});

test('fizzBuzz(15) matches expected full sequence', () => {
  expect(fizzBuzz(15)).toEqual([
    '1','2','fizz','4','buzz','fizz','7','8','fizz','buzz','11','fizz','13','14','fizzbuzz'
  ]);
});

test('fizzBuzz throws on non-integer, non-number, and negative inputs', () => {
  expect(() => fizzBuzz(-1)).toThrow(RangeError);
  expect(() => fizzBuzz(-1)).toThrow(/fizzBuzz/);
  expect(() => fizzBuzz(3.5)).toThrow(TypeError);
  expect(() => fizzBuzz('10')).toThrow(TypeError);
});

// Tests for fizzBuzzSingle
test('fizzBuzzSingle outputs', () => {
  expect(fizzBuzzSingle(3)).toBe('fizz');
  expect(fizzBuzzSingle(5)).toBe('buzz');
  expect(fizzBuzzSingle(15)).toBe('fizzbuzz');
  expect(fizzBuzzSingle(7)).toBe('7');
});
