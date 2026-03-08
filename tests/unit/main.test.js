import { describe, it, expect } from 'vitest';
import { toRoman, fromRoman } from '../src/lib/main.js';

describe('Roman conversion', ()=>{
  it('toRoman canonical examples', ()=>{
    expect(toRoman(1)).toBe('I');
    expect(toRoman(4)).toBe('IV');
    expect(toRoman(9)).toBe('IX');
    expect(toRoman(40)).toBe('XL');
    expect(toRoman(3999)).toBe('MMMCMXCIX');
    expect(toRoman(1994)).toBe('MCMXCIV');
  });

  it('toRoman throws for non-integers and out of range', ()=>{
    expect(()=>toRoman(0)).toThrowError(RangeError);
    expect(()=>toRoman(4000)).toThrowError(RangeError);
    expect(()=>toRoman(1.5)).toThrowError(TypeError);
    expect(()=>toRoman('10')).toThrowError(TypeError);
  });

  it('fromRoman canonical examples', ()=>{
    expect(fromRoman('I')).toBe(1);
    expect(fromRoman('IV')).toBe(4);
    expect(fromRoman('MMMCMXCIX')).toBe(3999);
    expect(fromRoman('MCMXCIV')).toBe(1994);
  });

  it('fromRoman rejects invalid input and non-canonical forms', ()=>{
    expect(()=>fromRoman('')).toThrowError(SyntaxError);
    expect(()=>fromRoman('iiii')).toThrowError(SyntaxError);
    expect(()=>fromRoman('IIII')).toThrowError(SyntaxError);
    expect(()=>fromRoman('ABC')).toThrowError(SyntaxError);
    expect(()=>fromRoman(123)).toThrowError(TypeError);
  });

  it('round-trip for representative values', ()=>{
    const reps = [1,2,3,4,5,9,40,90,400,900,1987,1994,3999];
    for(const n of reps){
      const r = toRoman(n);
      expect(fromRoman(r)).toBe(n);
      expect(toRoman(fromRoman(r))).toBe(r);
    }
  });
});
