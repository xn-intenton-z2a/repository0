// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect } from "vitest";
import { 
  main, 
  getIdentity, 
  name, 
  version, 
  description,
  encode,
  decode,
  encodeUUID,
  decodeUUID,
  createEncoding,
  listEncodings
} from "../../src/lib/main.js";

describe("Main Output", () => {
  test("should terminate without error", () => {
    process.argv = ["node", "src/lib/main.js"];
    main();
  });
});

describe("Library Identity", () => {
  test("exports name, version, and description", () => {
    expect(typeof name).toBe("string");
    expect(typeof version).toBe("string");
    expect(typeof description).toBe("string");
    expect(name.length).toBeGreaterThan(0);
    expect(version).toMatch(/^\d+\.\d+\.\d+/);
  });

  test("getIdentity returns correct structure", () => {
    const identity = getIdentity();
    expect(identity).toEqual({ name, version, description });
  });
});

describe("Dense Encoding Library", () => {
  describe("Basic encode/decode", () => {
    test("encode and decode empty buffer", () => {
      const buffer = Buffer.alloc(0);
      for (const encoding of ['base62', 'base85', 'base91']) {
        const encoded = encode(buffer, encoding);
        const decoded = decode(encoded, encoding);
        expect(decoded).toEqual(buffer);
        expect(encoded).toBe('');
      }
    });

    test("encode and decode single byte", () => {
      const buffer = Buffer.from([42]);
      for (const encoding of ['base62', 'base85', 'base91']) {
        const encoded = encode(buffer, encoding);
        const decoded = decode(encoded, encoding);
        expect(decoded).toEqual(buffer);
      }
    });

    test("encode and decode all-zero bytes", () => {
      const buffer = Buffer.alloc(16, 0);
      for (const encoding of ['base62', 'base85', 'base91']) {
        const encoded = encode(buffer, encoding);
        const decoded = decode(encoded, encoding);
        expect(decoded).toEqual(buffer);
      }
    });

    test("encode and decode all-0xFF bytes", () => {
      const buffer = Buffer.alloc(16, 0xFF);
      for (const encoding of ['base62', 'base85', 'base91']) {
        const encoded = encode(buffer, encoding);
        const decoded = decode(encoded, encoding);
        expect(decoded).toEqual(buffer);
      }
    });

    test("round-trip property for random data", () => {
      const testData = [
        Buffer.from('hello world'),
        Buffer.from([1, 2, 3, 4, 5, 255, 254, 0]),
        Buffer.from('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'),
        Buffer.from(Array.from({length: 50}, () => Math.floor(Math.random() * 256)))
      ];

      for (const data of testData) {
        for (const encoding of ['base62', 'base85', 'base91']) {
          const encoded = encode(data, encoding);
          const decoded = decode(encoded, encoding);
          expect(decoded).toEqual(data);
        }
      }
    });

    test("throws error for unknown encoding", () => {
      const buffer = Buffer.from('test');
      expect(() => encode(buffer, 'unknown')).toThrow('Unknown encoding: unknown');
      expect(() => decode('test', 'unknown')).toThrow('Unknown encoding: unknown');
    });
  });

  describe("UUID encoding", () => {
    test("encodeUUID and decodeUUID round-trip", () => {
      const testUUIDs = [
        '01234567-89ab-cdef-0123-456789abcdef',
        '00000000-0000-0000-0000-000000000000',
        'ffffffff-ffff-ffff-ffff-ffffffffffff',
        '550e8400-e29b-41d4-a716-446655440000'
      ];

      for (const uuid of testUUIDs) {
        const encoded = encodeUUID(uuid);
        const decoded = decodeUUID(encoded);
        expect(decoded).toBe(uuid);
      }
    });

    test("encodeUUID handles UUID without dashes", () => {
      const uuid = '0123456789abcdef0123456789abcdef';
      const uuidWithDashes = '01234567-89ab-cdef-0123-456789abcdef';
      
      const encoded1 = encodeUUID(uuid);
      const encoded2 = encodeUUID(uuidWithDashes);
      
      expect(encoded1).toBe(encoded2);
      expect(decodeUUID(encoded1)).toBe(uuidWithDashes);
    });

    test("UUID encoding is shorter than base64", () => {
      const uuid = '01234567-89ab-cdef-0123-456789abcdef';
      const buffer = Buffer.from(uuid.replace(/-/g, ''), 'hex');
      const base64 = buffer.toString('base64');
      const encoded = encodeUUID(uuid);
      
      expect(encoded.length).toBeLessThan(base64.length);
      expect(encoded.length).toBeLessThan(24); // base64 would be 24 chars for 16 bytes
    });

    test("encodeUUID throws error for invalid UUID", () => {
      expect(() => encodeUUID('invalid')).toThrow('Invalid UUID format');
      expect(() => encodeUUID('01234567-89ab-cdef-0123-456789abcd')).toThrow('Invalid UUID format');
    });

    test("decodeUUID throws error for invalid data", () => {
      // This would be a valid base91 string but not 16 bytes when decoded
      const shortString = encode(Buffer.from([1, 2, 3]), 'base91');
      expect(() => decodeUUID(shortString)).toThrow('Decoded data is not a valid UUID');
    });
  });

  describe("Custom encodings", () => {
    test("createEncoding adds new encoding", () => {
      const charset = '01';
      const encoding = createEncoding('binary', charset);
      
      expect(encoding.name).toBe('binary');
      expect(encoding.charset).toBe(charset);
      expect(encoding.bitDensity).toBeCloseTo(1.0);
      
      // Should now be available in listEncodings
      const encodings = listEncodings();
      const binaryEncoding = encodings.find(e => e.name === 'binary');
      expect(binaryEncoding).toBeTruthy();
    });

    test("createEncoding can be used for encode/decode", () => {
      const charset = 'ABCD';
      createEncoding('base4', charset);
      
      const buffer = Buffer.from([15, 240]);
      const encoded = encode(buffer, 'base4');
      const decoded = decode(encoded, 'base4');
      
      expect(decoded).toEqual(buffer);
    });

    test("createEncoding throws error for invalid charset", () => {
      expect(() => createEncoding('invalid', 'A')).toThrow('Charset must contain at least 2 characters');
      expect(() => createEncoding('duplicate', 'AAB')).toThrow('Charset contains duplicate characters');
    });
  });

  describe("listEncodings", () => {
    test("returns built-in encodings", () => {
      const encodings = listEncodings();
      
      expect(encodings.length).toBeGreaterThanOrEqual(3);
      
      const names = encodings.map(e => e.name);
      expect(names).toContain('base62');
      expect(names).toContain('base85');
      expect(names).toContain('base91');
      
      for (const encoding of encodings) {
        expect(encoding).toHaveProperty('name');
        expect(encoding).toHaveProperty('charset');
        expect(encoding).toHaveProperty('bitDensity');
        expect(encoding).toHaveProperty('charsetLength');
        expect(encoding.charsetLength).toBe(encoding.charset.length);
      }
    });

    test("bit densities are correct", () => {
      const encodings = listEncodings();
      
      const base62 = encodings.find(e => e.name === 'base62');
      const base85 = encodings.find(e => e.name === 'base85');
      const base91 = encodings.find(e => e.name === 'base91');
      
      expect(base62?.bitDensity).toBeCloseTo(5.95, 2);
      expect(base85?.bitDensity).toBeCloseTo(6.41, 2);
      expect(base91?.bitDensity).toBeCloseTo(6.50, 2);
      
      // base91 should be the densest
      expect(base91?.bitDensity).toBeGreaterThan(base85?.bitDensity);
      expect(base85?.bitDensity).toBeGreaterThan(base62?.bitDensity);
    });
  });

  describe("Encoding comparison", () => {
    test("UUID encoding lengths decrease with higher density", () => {
      const uuid = '01234567-89ab-cdef-0123-456789abcdef';
      const buffer = Buffer.from(uuid.replace(/-/g, ''), 'hex');
      
      const base62Length = encode(buffer, 'base62').length;
      const base85Length = encode(buffer, 'base85').length;
      const base91Length = encode(buffer, 'base91').length;
      
      expect(base91Length).toBeLessThanOrEqual(base85Length);
      expect(base85Length).toBeLessThanOrEqual(base62Length);
    });

    test("no control or ambiguous characters", () => {
      const encodings = listEncodings();
      
      for (const encoding of encodings) {
        // Check no control characters (0-31, 127)
        for (let i = 0; i < encoding.charset.length; i++) {
          const charCode = encoding.charset.charCodeAt(i);
          expect(charCode).toBeGreaterThan(31);
          expect(charCode).not.toBe(127);
        }
        
        // Base62 should not have ambiguous characters like 0/O, 1/l/I
        if (encoding.name === 'base62') {
          expect(encoding.charset).not.toContain('O');
          expect(encoding.charset).not.toContain('l');
          expect(encoding.charset).not.toContain('I');
        }
      }
    });
  });

  describe("Error handling", () => {
    test("decode throws error for invalid characters", () => {
      // Use newline which is not in any of our charsets
      expect(() => decode('invalid\nchar', 'base62')).toThrow('Invalid character');
      expect(() => decode('invalid\nchar', 'base85')).toThrow('Invalid character');
      expect(() => decode('invalid\nchar', 'base91')).toThrow('Invalid character');
    });
  });
});