import { describe, it, expect } from 'vitest'
import { toRoman, fromRoman, parseRoman } from '../../src/lib/main.js'

describe('toRoman', () => {
  it('converts basic numbers', () => {
    expect(toRoman(1)).toBe('I')
    expect(toRoman(4)).toBe('IV')
    expect(toRoman(9)).toBe('IX')
    expect(toRoman(3999)).toBe('MMMCMXCIX')
    expect(toRoman(1994)).toBe('MCMXCIV')
  })
  it('throws RangeError for out of range', () => {
    expect(() => toRoman(0)).toThrow(RangeError)
    expect(() => toRoman(4000)).toThrow(RangeError)
  })
  it('throws TypeError for non-integers', () => {
    expect(() => toRoman(3.5)).toThrow(TypeError)
    expect(() => toRoman('5')).toThrow(TypeError)
  })
})

describe('fromRoman (strict by default)', () => {
  it('parses canonical numerals', () => {
    expect(fromRoman('IX')).toBe(9)
    expect(fromRoman('IV')).toBe(4)
    expect(fromRoman('MMMCMXCIX')).toBe(3999)
  })
  it('throws SyntaxError for non-canonical or invalid in strict', () => {
    expect(() => fromRoman('ix')).toThrow(SyntaxError)
    expect(() => fromRoman('IIII')).toThrow(SyntaxError)
    expect(() => fromRoman(' M M I ')).toThrow(SyntaxError)
    expect(() => fromRoman('invalid')).toThrow(SyntaxError)
  })
  it('does not mutate input and is deterministic', () => {
    const s = 'IX'
    expect(fromRoman(s)).toBe(9)
    expect(s).toBe('IX')
  })
})

describe('parseRoman permissive vs strict', () => {
  it('permissive accepts lowercase and returns canonical', () => {
    expect(parseRoman('ix', { strict: false })).toEqual({ valid: true, value: 9, canonical: 'IX' })
  })
  it('permissive accepts IIII and canonicalizes to IV', () => {
    expect(parseRoman('IIII', { strict: false })).toEqual({ valid: true, value: 4, canonical: 'IV' })
  })
  it('strict rejects IIII', () => {
    expect(() => parseRoman('IIII', { strict: true })).toThrow(SyntaxError)
  })
  it('type errors for wrong input types', () => {
    expect(() => parseRoman(null)).toThrow(TypeError)
    expect(() => parseRoman(undefined)).toThrow(TypeError)
    expect(() => parseRoman({})).toThrow(TypeError)
  })
})
