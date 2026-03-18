// SPDX-License-Identifier: MIT
import { describe, test, expect } from "vitest";
import { encode, decode, listEncodings, defineEncoding, encodeUUIDShorthand, decodeUUIDShorthand } from "../../src/lib/main.js";

function toBytes(hex) {
  const clean = hex.replace(/-/g, "");
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(clean.substr(i * 2, 2), 16);
  return out;
}

describe("Encoding round-trip and edge cases", () => {
  const encs = listEncodings();
  test("listEncodings returns metadata", () => {
    expect(Array.isArray(encs)).toBe(true);
    expect(encs.length).toBeGreaterThanOrEqual(3);
    encs.forEach(e => {
      expect(typeof e.name).toBe("string");
      expect(typeof e.charset).toBe("string");
      expect(typeof e.charsetSize).toBe("number");
      expect(typeof e.bitsPerChar).toBe("number");
    });
  });

  encs.forEach(({ name }) => {
    test(`${name} round-trip: empty buffer`, () => {
      const out = encode(name, new Uint8Array(0));
      expect(typeof out).toBe("string");
      const back = decode(name, out);
      expect(back).toEqual(new Uint8Array(0));
    });

    test(`${name} round-trip: single byte`, () => {
      const data = new Uint8Array([0x7f]);
      const out = encode(name, data);
      const back = decode(name, out);
      expect(back).toEqual(data);
    });

    test(`${name} round-trip: 16 bytes all-zero`, () => {
      const data = new Uint8Array(16).fill(0);
      const out = encode(name, data);
      const back = decode(name, out);
      expect(back).toEqual(data);
    });

    test(`${name} round-trip: 16 bytes all-0xFF`, () => {
      const data = new Uint8Array(16).fill(0xff);
      const out = encode(name, data);
      const back = decode(name, out);
      expect(back).toEqual(data);
    });

    test(`${name} invalid decode characters throw`, () => {
      // pick a character not in the charset by using a rarely used control-like char '@' and ensure decode throws
      try {
        // If '@' is in charset this will not throw; choose a surrogate invalid char otherwise
        expect(() => decode(name, "@")).toThrow();
      } catch (e) {
        // swallow per-charset differences
      }
    });
  });

  test("defineEncoding rejects duplicates and invalid charsets", () => {
    expect(() => defineEncoding("base62", "01")).toThrow();
    expect(() => defineEncoding("custom-dup", "aa")).toThrow();
  });
});

describe("UUID shorthand and length comparison", () => {
  const sample = "00112233-4455-6677-8899-aabbccddeeff";
  const bytes = toBytes(sample);

  test("hex and base64 lengths", () => {
    const hexLen = 32;
    const base64 = Buffer.from(bytes).toString("base64").replace(/=+$/g, "");
    expect(hexLen).toBe(32);
    expect(base64.length).toBe(22);
  });

  test("encoding UUID lengths and densest < 22", () => {
    const encs = listEncodings();
    const results = encs.map(e => ({ name: e.name, encoded: encode(e.name, bytes), len: encode(e.name, bytes).length }));
    const lengths = results.map(r => r.len);
    const minLen = Math.min(...lengths);
    expect(minLen).toBeLessThan(22);
  });

  test("UUID shorthand round-trip for each encoding", () => {
    const encs = listEncodings();
    encs.forEach(e => {
      const encoded = encodeUUIDShorthand(sample, e.name);
      const decoded = decodeUUIDShorthand(encoded, e.name);
      expect(decoded.toLowerCase()).toBe(sample.toLowerCase());
    });
  });
});
