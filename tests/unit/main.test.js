// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// tests/unit/main.test.js

import { describe, it, expect } from 'vitest';
import {
  encode, decode, encodeUUID, decodeUUID, createEncoding, listEncodings,
  name, version, description, getIdentity
} from '../../src/lib/main.js';

describe('Dense Binary-to-Text Encoding Library', () => {
  
  describe('Identity functions', () => {
    it('should export package metadata', () => {
      expect(typeof name).toBe('string');
      expect(typeof version).toBe('string');
      expect(typeof description).toBe('string');
    });

    it('should return identity object', () => {
      const identity = getIdentity();
      expect(identity).toEqual({ name, version, description });
    });
  });

  describe('Core encoding functions', () => {
    const testData = Buffer.from([0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 0xEF]);

    it('should encode and decode with base62', () => {
      const encoded = encode(testData, 'base62');
      const decoded = decode(encoded, 'base62');
      expect(decoded.equals(testData)).toBe(true);
    });

    it('should encode and decode with base85', () => {
      const encoded = encode(testData, 'base85');
      const decoded = decode(encoded, 'base85');
      expect(decoded.equals(testData)).toBe(true);
    });

    it('should encode and decode with base91', () => {
      const encoded = encode(testData, 'base91');
      const decoded = decode(encoded, 'base91');
      expect(decoded.equals(testData)).toBe(true);
    });

    it('should handle empty buffer', () => {
      const empty = Buffer.alloc(0);
      expect(encode(empty, 'base62')).toBe('');
      expect(decode('', 'base62').equals(empty)).toBe(true);
    });

    it('should handle single zero byte', () => {
      const zero = Buffer.from([0]);
      const encoded = encode(zero, 'base62');
      const decoded = decode(encoded, 'base62');
      expect(decoded.equals(zero)).toBe(true);
    });

    it('should handle all-zero buffer', () => {
      const zeros = Buffer.alloc(16, 0);
      const encoded = encode(zeros, 'base62');
      expect(encoded).toBe('0'); // All zeros encode to single '0'
      const decoded = decode(encoded, 'base62');
      expect(decoded).toEqual(Buffer.from([0])); // Single zero byte
    });

    it('should handle all-0xFF buffer', () => {
      const ones = Buffer.alloc(16, 0xFF);
      const encoded = encode(ones, 'base62');
      const decoded = decode(encoded, 'base62');
      expect(decoded.equals(ones)).toBe(true);
    });

    it('should throw on invalid encoding name', () => {
      expect(() => encode(testData, 'invalid')).toThrow('Unknown encoding: invalid');
      expect(() => decode('test', 'invalid')).toThrow('Unknown encoding: invalid');
    });

    it('should throw on invalid input types', () => {
      expect(() => encode('not a buffer', 'base62')).toThrow('Input must be a Buffer');
      expect(() => decode(123, 'base62')).toThrow('Input must be a string');
    });

    it('should throw on invalid characters', () => {
      expect(() => decode('invalid$char', 'base62')).toThrow("Invalid character '$' for encoding base62");
    });
  });

  describe('Round-trip property validation', () => {
    const testCases = [
      Buffer.from([]),                           // empty
      Buffer.from([0]),                          // single zero
      Buffer.from([1]),                          // single byte
      Buffer.from([0xFF]),                       // max single byte
      Buffer.from('Hello, World!'),             // text
      Buffer.from([0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 0xEF]), // mixed bytes
      Buffer.from([0x12, 0x34, 0x56, 0x78, 0x9A, 0xBC, 0xDE, 0xF0]), // no leading zeros
      Buffer.from([0xFF, 0xEE, 0xDD, 0xCC, 0xBB, 0xAA, 0x99, 0x88]), // high bytes
      Buffer.from([0x80, 0x40, 0x20, 0x10, 0x08, 0x04, 0x02, 0x01])  // bit pattern
    ];

    const encodings = ['base62', 'base85', 'base91'];

    encodings.forEach(encoding => {
      testCases.forEach((testCase, index) => {
        it(`should maintain round-trip property for ${encoding} test case ${index}`, () => {
          const encoded = encode(testCase, encoding);
          const decoded = decode(encoded, encoding);
          expect(decoded.equals(testCase)).toBe(true);
        });
      });
    });
  });

  describe('UUID encoding functions', () => {
    const testUuid = '550e8400-e29b-41d4-a716-446655440000';
    const testUuidNoDashes = '550e8400e29b41d4a716446655440000';

    it('should encode and decode UUID with dashes', () => {
      const encoded = encodeUUID(testUuid);
      const decoded = decodeUUID(encoded);
      expect(decoded).toBe(testUuid);
    });

    it('should encode and decode UUID without dashes', () => {
      const encoded = encodeUUID(testUuidNoDashes);
      const decoded = decodeUUID(encoded);
      expect(decoded).toBe(testUuid);
    });

    it('should work with different encodings', () => {
      const encodings = ['base62', 'base85', 'base91'];
      encodings.forEach(encoding => {
        const encoded = encodeUUID(testUuid, encoding);
        const decoded = decodeUUID(encoded, encoding);
        expect(decoded).toBe(testUuid);
      });
    });

    it('should produce shorter encodings than base64', () => {
      const base64Length = 24; // base64 UUID length without padding
      const base91Encoded = encodeUUID(testUuid, 'base91');
      expect(base91Encoded.length).toBeLessThan(base64Length);
    });

    it('should validate UUID format', () => {
      expect(() => encodeUUID('invalid')).toThrow('Invalid UUID format');
      expect(() => encodeUUID('550e8400-e29b-41d4-a716-44665544000')).toThrow('Invalid UUID format');
      expect(() => encodeUUID('550e8400-e29b-41d4-a716-44665544000G')).toThrow('Invalid UUID format');
    });

    it('should throw on invalid types', () => {
      expect(() => encodeUUID(123)).toThrow('UUID must be a string');
    });

    it('should validate decoded UUID length', () => {
      const shortEncoded = encode(Buffer.from([1, 2, 3]), 'base91');
      expect(() => decodeUUID(shortEncoded)).toThrow('Decoded data is not a valid UUID (must be 16 bytes)');
    });
  });

  describe('UUID length comparison', () => {
    const testUuid = '550e8400-e29b-41d4-a716-446655440000';
    
    it('should show progressive density improvements', () => {
      const base62Length = encodeUUID(testUuid, 'base62').length;
      const base85Length = encodeUUID(testUuid, 'base85').length;
      const base91Length = encodeUUID(testUuid, 'base91').length;

      // Each encoding should be denser (shorter) than the previous
      expect(base85Length).toBeLessThanOrEqual(base62Length);
      expect(base91Length).toBeLessThanOrEqual(base85Length);

      // All should be shorter than base64 (24 chars)
      expect(base62Length).toBeLessThan(24);
      expect(base85Length).toBeLessThan(24);
      expect(base91Length).toBeLessThan(24);
    });
  });

  describe('Custom encoding creation', () => {
    it('should create custom encoding', () => {
      createEncoding('binary', '01');
      const encodings = listEncodings();
      const binary = encodings.find(e => e.name === 'binary');
      expect(binary).toBeDefined();
      expect(binary.base).toBe(2);
      expect(binary.charset).toBe('01');
    });

    it('should use custom encoding for encode/decode', () => {
      createEncoding('hex', '0123456789ABCDEF');
      const testData = Buffer.from([0x1A, 0x2B]);
      const encoded = encode(testData, 'hex');
      const decoded = decode(encoded, 'hex');
      expect(decoded.equals(testData)).toBe(true);
    });

    it('should validate custom encoding parameters', () => {
      expect(() => createEncoding(123, '01')).toThrow('Name and charset must be strings');
      expect(() => createEncoding('test', 1)).toThrow('Name and charset must be strings');
      expect(() => createEncoding('test', '1')).toThrow('Charset must have at least 2 characters');
      expect(() => createEncoding('test', '112')).toThrow('Charset must not contain duplicate characters');
    });
  });

  describe('Encoding metadata', () => {
    it('should list all encodings with metadata', () => {
      const encodings = listEncodings();
      expect(encodings.length).toBeGreaterThanOrEqual(3);
      
      encodings.forEach(encoding => {
        expect(encoding).toHaveProperty('name');
        expect(encoding).toHaveProperty('charset');
        expect(encoding).toHaveProperty('base');
        expect(encoding).toHaveProperty('bitsPerChar');
        expect(encoding).toHaveProperty('uuidLength');
        
        expect(typeof encoding.name).toBe('string');
        expect(typeof encoding.charset).toBe('string');
        expect(typeof encoding.base).toBe('number');
        expect(typeof encoding.bitsPerChar).toBe('number');
        expect(typeof encoding.uuidLength).toBe('number');
        
        expect(encoding.base).toBe(encoding.charset.length);
      });
    });

    it('should include built-in encodings', () => {
      const encodings = listEncodings();
      const names = encodings.map(e => e.name);
      expect(names).toContain('base62');
      expect(names).toContain('base85');
      expect(names).toContain('base91');
    });

    it('should calculate correct bit densities', () => {
      const encodings = listEncodings();
      const base62 = encodings.find(e => e.name === 'base62');
      const base85 = encodings.find(e => e.name === 'base85');
      const base91 = encodings.find(e => e.name === 'base91');

      expect(base62.bitsPerChar).toBeCloseTo(Math.log2(62), 5);
      expect(base85.bitsPerChar).toBeCloseTo(Math.log2(85), 5);
      expect(base91.bitsPerChar).toBeCloseTo(Math.log2(base91.base), 5);
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle maximum safe integer sized data', () => {
      const largeData = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x9A, 0xBC, 0xDE, 0xF0, 0x11, 0x22]);
      const encoded = encode(largeData, 'base62');
      const decoded = decode(encoded, 'base62');
      expect(decoded.equals(largeData)).toBe(true);
    });

    it('should handle sequential bytes', () => {
      const sequential = Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05]);
      const encoded = encode(sequential, 'base91');
      const decoded = decode(encoded, 'base91');
      expect(decoded.equals(sequential)).toBe(true);
    });

    it('should handle alternating patterns', () => {
      const pattern = Buffer.from(Array(100).fill([0x55, 0xAA]).flat());
      const encoded = encode(pattern, 'base85');
      const decoded = decode(encoded, 'base85');
      expect(decoded.equals(pattern)).toBe(true);
    });
  });
});

// Helper to generate random bytes for testing
const crypto = {
  randomBytes: (length) => {
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
    return Buffer.from(bytes);
  }
};