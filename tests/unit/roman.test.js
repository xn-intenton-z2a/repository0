import { describe, it, expect } from 'vitest';
import { toRoman, fromRoman } from '../../src/lib/main.js';

describe('Roman numerals library', ()=>{
  it('converts representative numbers to canonical Roman', ()=>{
    expect(toRoman(1)).toBe('I');
    expect(toRoman(4)).toBe('IV');
    expect(toRoman(9)).toBe('IX');
    expect(toRoman(40)).toBe('XL');
    expect(toRoman(90)).toBe('XC');
    expect(toRoman(400)).toBe('CD');
    expect(toRoman(900)).toBe('CM');
    expect(toRoman(3999)).toBe('MMMCMXCIX');
    expect(toRoman(1994)).toBe('MCMXCIV');
    expect(toRoman(2014)).toBe('MMXIV');
  });

  it('toRoman throws RangeError for out of range', ()=>{
    expect(()=>toRoman(0)).toThrow(RangeError);
    expect(()=>toRoman(4000)).toThrow(RangeError);
  });

  it('toRoman throws TypeError for non-finite or non-integer', ()=>{
    expect(()=>toRoman(NaN)).toThrow(TypeError);
    expect(()=>toRoman(Infinity)).toThrow(TypeError);
    expect(()=>toRoman(3.14)).toThrow(TypeError);
    expect(()=>toRoman('10')).toThrow(TypeError);
  });

  it('fromRoman parses canonical and lowercase', ()=>{
    expect(fromRoman('MCMXCIV')).toBe(1994);
    expect(fromRoman('mmxiv')).toBe(2014);
  });

  it('fromRoman throws SyntaxError for invalid strings', ()=>{
    expect(()=>fromRoman('')).toThrow(SyntaxError);
    expect(()=>fromRoman('IIII')).toThrow(SyntaxError);
    expect(()=>fromRoman('VX')).toThrow(SyntaxError);
    expect(()=>fromRoman('IC')).toThrow(SyntaxError);
  });

  it('fromRoman throws TypeError for non-strings', ()=>{
    expect(()=>fromRoman(123)).toThrow(TypeError);
    expect(()=>fromRoman(null)).toThrow(TypeError);
  });

  it('round trip property for sample set', ()=>{
    for (const n of [1,4,9,44,99,399,944,1994,2014,3999]){
      expect(fromRoman(toRoman(n))).toBe(n);
    }
  });
});
