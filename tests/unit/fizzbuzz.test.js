import { describe, it, expect } from 'vitest';
import { fizzBuzz, fizzBuzzSingle, runCli } from '../../src/lib/main.js';

describe('fizzBuzz core functions', () => {
  it('fizzBuzz(1..5) produces expected values', () => {
    expect(fizzBuzz(1)).toEqual(['1']);
    expect(fizzBuzz(2)).toEqual(['1', '2']);
    expect(fizzBuzz(3)).toEqual(['1', '2', 'Fizz']);
    expect(fizzBuzz(4)).toEqual(['1', '2', 'Fizz', '4']);
    expect(fizzBuzz(5)).toEqual(['1', '2', 'Fizz', '4', 'Buzz']);
  });

  it('fizzBuzz(15) has 15 elements and ends with FizzBuzz', () => {
    const out = fizzBuzz(15);
    expect(out).toHaveLength(15);
    expect(out[14]).toBe('FizzBuzz');
  });

  it('fizzBuzzSingle returns correct strings', () => {
    expect(fizzBuzzSingle(3)).toBe('Fizz');
    expect(fizzBuzzSingle(5)).toBe('Buzz');
    expect(fizzBuzzSingle(15)).toBe('FizzBuzz');
    expect(fizzBuzzSingle(7)).toBe('7');
  });

  it('fizzBuzz(0) returns empty array', () => {
    expect(fizzBuzz(0)).toEqual([]);
  });

  it('negative n throws RangeError with exact message', () => {
    expect(() => fizzBuzz(-1)).toThrow(RangeError);
    expect(() => fizzBuzz(-1)).toThrow('n must be a non-negative integer');
  });

  it('non-integer inputs throw TypeError with exact message', () => {
    expect(() => fizzBuzz(3.1)).toThrow(TypeError);
    expect(() => fizzBuzz(3.1)).toThrow('n must be an integer');
    expect(() => fizzBuzz('3')).toThrow(TypeError);
    expect(() => fizzBuzz('3')).toThrow('n must be an integer');
    expect(() => fizzBuzz(Number.NaN)).toThrow(TypeError);
    expect(() => fizzBuzz(Number.POSITIVE_INFINITY)).toThrow(TypeError);
  });
});

describe('fizzBuzz CLI helper', () => {
  function makeStream() {
    let out = '';
    return {
      write(s) { out += s; },
      getOutput() { return out; }
    };
  }

  it('valid n prints lines and returns 0', () => {
    const stdout = makeStream();
    const stderr = makeStream();
    const code = runCli({ argv: ['node', 'src/lib/main.js', '5'], stdout, stderr });
    expect(code).toBe(0);
    const lines = stdout.getOutput().trim().split('\n');
    expect(lines).toEqual(['1','2','Fizz','4','Buzz']);
    expect(stderr.getOutput()).toBe('');
  });

  it('n=0 prints nothing and returns 0', () => {
    const stdout = makeStream();
    const stderr = makeStream();
    const code = runCli({ argv: ['node', 'src/lib/main.js', '0'], stdout, stderr });
    expect(code).toBe(0);
    expect(stdout.getOutput()).toBe('');
    expect(stderr.getOutput()).toBe('');
  });

  it('missing arg prints usage and returns 1', () => {
    const stdout = makeStream();
    const stderr = makeStream();
    const code = runCli({ argv: ['node', 'src/lib/main.js'], stdout, stderr });
    expect(code).toBe(1);
    expect(stderr.getOutput()).toContain('Usage');
  });

  it('invalid input prints error and returns 2', () => {
    const stdout = makeStream();
    const stderr = makeStream();
    const code = runCli({ argv: ['node', 'src/lib/main.js', '-1'], stdout, stderr });
    expect(code).toBe(2);
    expect(stderr.getOutput()).toContain('n must be a non-negative integer');

    const stderr2 = makeStream();
    const code2 = runCli({ argv: ['node', 'src/lib/main.js', '3.5'], stdout, stderr: stderr2 });
    expect(code2).toBe(2);
    expect(stderr2.getOutput()).toContain('n must be an integer');
  });
});
