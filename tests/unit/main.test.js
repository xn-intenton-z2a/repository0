import { describe, it, expect } from 'vitest'
import { hammingDistance, hammingDistanceBits } from '../../src/lib/main.js'

describe('hammingDistance', () => {
  it('computes known example', () => {
    expect(hammingDistance('karolin', 'kathrin')).toBe(3)
  })

  it('empty strings', () => {
    expect(hammingDistance('', '')).toBe(0)
  })

  it('throws for unequal length', () => {
    expect(() => hammingDistance('a', 'bb')).toThrow(RangeError)
  })

  it('handles unicode code points (emoji)', () => {
    expect(hammingDistance('a\u{1F600}', 'a\u{1F601}')).toBe(1)
  })

  it('throws TypeError for non-strings', () => {
    // @ts-ignore
    expect(() => hammingDistance(1, 2)).toThrow(TypeError)
  })
})

describe('hammingDistanceBits', () => {
  it('known example', () => {
    expect(hammingDistanceBits(1, 4)).toBe(2)
  })

  it('zeros', () => {
    expect(hammingDistanceBits(0, 0)).toBe(0)
  })

  it('large integers', () => {
    const a = 2n ** 60n
    expect(hammingDistanceBits(a, 0n)).toBe(1)
  })

  it('throws for negative integers', () => {
    // @ts-ignore
    expect(() => hammingDistanceBits(-1, 1)).toThrow(RangeError)
  })

  it('throws for non-integer types', () => {
    // @ts-ignore
    expect(() => hammingDistanceBits('a', 1)).toThrow(TypeError)
  })
})
