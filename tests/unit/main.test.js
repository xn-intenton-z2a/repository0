import { describe, it, expect } from 'vitest';
import { fizzBuzz, fizzBuzzSingle } from '../../src/lib/main.js';

describe('fizzBuzzSingle', ()=>{
  it('returns Fizz for 3', ()=>{
    expect(fizzBuzzSingle(3)).toBe('Fizz');
  });
  it('returns Buzz for 5', ()=>{
    expect(fizzBuzzSingle(5)).toBe('Buzz');
  });
  it('returns FizzBuzz for 15', ()=>{
    expect(fizzBuzzSingle(15)).toBe('FizzBuzz');
  });
  it('returns number string for non-multiples', ()=>{
    expect(fizzBuzzSingle(7)).toBe('7');
  });
  it('throws TypeError for non-integer', ()=>{
    expect(()=>fizzBuzzSingle(3.5)).toThrowError(TypeError);
    expect(()=>fizzBuzzSingle(NaN)).toThrowError(TypeError);
  });
  it('throws RangeError for negative', ()=>{
    expect(()=>fizzBuzzSingle(-1)).toThrowError(RangeError);
  });
});

describe('fizzBuzz', ()=>{
  it('returns empty array for 0', ()=>{
    expect(fizzBuzz(0)).toEqual([]);
  });
  it('returns array length n and correct content for 1..16', ()=>{
    const res = fizzBuzz(16);
    expect(res.length).toBe(16);
    expect(res[2]).toBe('Fizz'); // 3
    expect(res[4]).toBe('Buzz'); //5
    expect(res[14]).toBe('FizzBuzz'); //15
    expect(res[15]).toBe('16'); //16
  });
  it('throws TypeError for non-integer', ()=>{
    expect(()=>fizzBuzz(2.2)).toThrowError(TypeError);
  });
  it('throws RangeError for negative', ()=>{
    expect(()=>fizzBuzz(-5)).toThrowError(RangeError);
  });
});
