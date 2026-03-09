import { describe, it, expect } from 'vitest';
import { fizzBuzz, fizzBuzzSingle } from '../../src/lib/main.js';

describe('FizzBuzz library', ()=>{
  it('fizzBuzz(15) returns 15 items ending with FizzBuzz', ()=>{
    const out = fizzBuzz(15);
    expect(Array.isArray(out)).toBe(true);
    expect(out).toHaveLength(15);
    expect(out[14]).toBe('FizzBuzz');
  });

  it('fizzBuzzSingle(3) -> Fizz', ()=>{
    expect(fizzBuzzSingle(3)).toBe('Fizz');
  });
  it('fizzBuzzSingle(5) -> Buzz', ()=>{
    expect(fizzBuzzSingle(5)).toBe('Buzz');
  });
  it('fizzBuzzSingle(15) -> FizzBuzz', ()=>{
    expect(fizzBuzzSingle(15)).toBe('FizzBuzz');
  });
  it('fizzBuzzSingle(7) -> "7"', ()=>{
    expect(fizzBuzzSingle(7)).toBe('7');
  });

  it('fizzBuzz(0) -> []', ()=>{
    expect(fizzBuzz(0)).toEqual([]);
  });

  it('passing -1 to fizzBuzz throws RangeError with exact message', ()=>{
    expect(()=>fizzBuzz(-1)).toThrow(RangeError);
    expect(()=>fizzBuzz(-1)).toThrow('n must be a non-negative integer');
  });
  it('passing -1 to fizzBuzzSingle throws RangeError with exact message', ()=>{
    expect(()=>fizzBuzzSingle(-1)).toThrow(RangeError);
    expect(()=>fizzBuzzSingle(-1)).toThrow('n must be a non-negative integer');
  });

  it('passing 2.5 to fizzBuzz throws TypeError with exact message', ()=>{
    expect(()=>fizzBuzz(2.5)).toThrow(TypeError);
    expect(()=>fizzBuzz(2.5)).toThrow('n must be an integer');
  });
  it('passing 2.5 to fizzBuzzSingle throws TypeError with exact message', ()=>{
    expect(()=>fizzBuzzSingle(2.5)).toThrow(TypeError);
    expect(()=>fizzBuzzSingle(2.5)).toThrow('n must be an integer');
  });
});
