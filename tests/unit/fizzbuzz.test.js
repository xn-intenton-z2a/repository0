import { describe, it, expect } from 'vitest';
import { fizzBuzz, fizzBuzzSingle, fizzBuzzStream, createFizzBuzzReadable, main } from '../../src/lib/main.js';

describe('FizzBuzz', () => {
  it('fizzBuzzSingle returns "Fizz" for 3', () => {
    expect(fizzBuzzSingle(3)).toBe('Fizz');
  });

  it('fizzBuzzSingle returns "Buzz" for 5', () => {
    expect(fizzBuzzSingle(5)).toBe('Buzz');
  });

  it('fizzBuzzSingle returns "FizzBuzz" for 15', () => {
    expect(fizzBuzzSingle(15)).toBe('FizzBuzz');
  });

  it('fizzBuzzSingle returns number string for non-multiple', () => {
    expect(fizzBuzzSingle(7)).toBe('7');
  });

  it('fizzBuzz(15) returns expected sequence', () => {
    const expected = [
      '1','2','Fizz','4','Buzz','Fizz','7','8','Fizz','Buzz','11','Fizz','13','14','FizzBuzz'
    ];
    expect(fizzBuzz(15)).toEqual(expected);
  });

  it('fizzBuzz(0) returns []', () => {
    expect(fizzBuzz(0)).toEqual([]);
  });

  it('fizzBuzz throws RangeError for negative n', () => {
    expect(() => fizzBuzz(-1)).toThrow(RangeError);
  });

  it('fizzBuzz throws TypeError for non-integer', () => {
    expect(() => fizzBuzz(2.5)).toThrow(TypeError);
  });

  it('fizzBuzzSingle throws for non-integer or <1', () => {
    expect(() => fizzBuzzSingle(0)).toThrow(RangeError);
    expect(() => fizzBuzzSingle(1.5)).toThrow(TypeError);
  });

  it('fizzBuzzStream yields values in order and completes', async () => {
    const out = [];
    for await (const v of fizzBuzzStream(5)) out.push(v);
    expect(out).toEqual(['1','2','Fizz','4','Buzz']);
  });

  it('fizzBuzzStream validates synchronously', () => {
    expect(() => fizzBuzzStream(-1)).toThrow(RangeError);
    expect(() => fizzBuzzStream(2.2)).toThrow(TypeError);
  });

  it('createFizzBuzzReadable emits same sequence and ends', async () => {
    const r = createFizzBuzzReadable(5);
    const out = [];
    for await (const v of r) out.push(v);
    expect(out).toEqual(['1','2','Fizz','4','Buzz']);
  });

  it('createFizzBuzzReadable validates synchronously', () => {
    expect(() => createFizzBuzzReadable(-1)).toThrow(RangeError);
    expect(() => createFizzBuzzReadable(3.14)).toThrow(TypeError);
  });

  it('CLI single and range modes print expected output and handle errors', () => {
    const logs = [];
    const errors = [];
    const origLog = console.log;
    const origErr = console.error;
    const origExit = process.exitCode;
    console.log = (m) => logs.push(String(m));
    console.error = (m) => errors.push(String(m));

    try {
      main(['single', '3']);
      expect(logs.pop()).toBe('Fizz');

      main(['range', '5']);
      // last five logs correspond to the range output
      const lastFive = logs.slice(-5);
      expect(lastFive).toEqual(['1','2','Fizz','4','Buzz']);

      // invalid input
      main(['single', '-1']);
      expect(process.exitCode).toBeGreaterThan(0);
      expect(errors.length).toBeGreaterThan(0);
    } finally {
      console.log = origLog;
      console.error = origErr;
      process.exitCode = origExit;
    }
  });
});
