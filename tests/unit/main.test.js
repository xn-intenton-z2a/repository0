import { describe, it, expect } from 'vitest';
import { fizzBuzz, fizzBuzzSingle } from '../../src/lib/main.js';

describe('FizzBuzz library', ()=>{
  it('fizzBuzz(15) length and 15th element', ()=>{
    const arr = fizzBuzz(15);
    expect(arr).toHaveLength(15);
    expect(arr[14]).toBe('FizzBuzz');
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

  it('negative throws RangeError with exact message', ()=>{
    expect(()=>fizzBuzz(-1)).toThrow(RangeError);
    expect(()=>fizzBuzz(-1)).toThrow('n must be a non-negative integer');
    expect(()=>fizzBuzzSingle(-1)).toThrow(RangeError);
    expect(()=>fizzBuzzSingle(-1)).toThrow('n must be a non-negative integer');
  });

  it('non-integer throws TypeError with exact message', ()=>{
    expect(()=>fizzBuzz(2.5)).toThrow(TypeError);
    expect(()=>fizzBuzz(2.5)).toThrow('n must be an integer');
    expect(()=>fizzBuzzSingle(2.5)).toThrow(TypeError);
    expect(()=>fizzBuzzSingle(2.5)).toThrow('n must be an integer');
  });

  it('non-number inputs throw TypeError', ()=>{
    // null and string
    expect(()=>fizzBuzz(null)).toThrow(TypeError);
    expect(()=>fizzBuzz('3')).toThrow(TypeError);
    expect(()=>fizzBuzzSingle(null)).toThrow(TypeError);
    expect(()=>fizzBuzzSingle('3')).toThrow(TypeError);
  });

  it('large n works and returns correct length', ()=>{
    const arr = fizzBuzz(1000);
    expect(arr).toHaveLength(1000);
    expect(arr[2]).toBe('Fizz'); // 3rd element
  });
});
