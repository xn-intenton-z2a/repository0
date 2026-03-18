// SPDX-License-Identifier: MIT
import { describe, test, expect } from "vitest";
import { encode, decode, listEncodings, defineEncoding, encodeUUIDShorthand, decodeUUIDShorthand } from "../../src/lib/main.js";

function toBytes(hex) {
  const clean = hex.replace(/-/g, "");
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(clean.substr(i * 2, 2), 16);
  return out;
}

describe("Encodings: round-trip, edge cases, and metadata", () => {
  test("listEncodings returns metadata and is ordered by bitsPerChar descending", () => {
    const encs = listEncodings();
    expect(Array.isArray(encs)).toBe(true);
    expect(encs.length).toBeGreaterThanOrEqual(3);
    encs.forEach(e => {
      expect(typeof e.name).toBe("string");
      expect(typeof e.charset).toBe("string");
      expect(typeof e.charsetSize).toBe("number");
      expect(typeof e.bitsPerChar).toBe("number");
    });
    const bits = encs.map(e => e.bitsPerChar);
    const sorted = [...bits].sort((a, b) => b - a);
    expect(bits).toEqual(sorted);
  });

  const encs = listEncodings();
  encs.forEach(({ name }) => {
    test(`${name} round-trip: empty buffer`, () => {
      const out = encode(name, new Uint8Array(0));
      expect(typeof out).toBe("string");
      const back = decode(name, out);
      expect(back).toEqual(new Uint8Array(0));
    });

    test(`${name} round-trip: single byte 0x01`, () => {
      const data = new Uint8Array([0x01]);
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
  });

  test("defineEncoding sanitises ambiguous characters and rejects control/whitespace", () => {
    // ambiguous characters should be removed from the stored charset
    const meta = defineEncoding("test-sanitize-1", "A0O1lI!@#");
    expect(meta.charset).not.toContain("0");
    expect(meta.charset).not.toContain("O");
    expect(meta.charset).not.toContain("1");
    expect(meta.charset).not.toContain("l");
    expect(meta.charset).not.toContain("I");
    expect(meta.charset).toContain("A");
    expect(meta.charset).toContain("!");

    // control characters and whitespace -> rejected
    expect(() => defineEncoding("test-sanitize-ctrl", "AB\nC")).toThrow();
  });

  test("base91 is registered and round-trips", () => {
    const encs = listEncodings();
    const hasBase91 = encs.some(e => e.name === "base91");
    expect(hasBase91).toBe(true);
    if (hasBase91) {
      const bytes = new Uint8Array([0,1,2,3,4,5,6,7,8,9]);
      const s = encode("base91", bytes);
      const back = decode("base91", s);
      expect(back).toEqual(bytes);
    }
  });

  test("UUID encoded lengths: densest registered encoding yields length < 22", () => {
    const sample = "00112233-4455-6677-8899-aabbccddeeff";
    const bytes = toBytes(sample);
    const encs = listEncodings();
    const results = encs.map(e => ({ name: e.name, encoded: encode(e.name, bytes), len: encode(e.name, bytes).length }));
    const minLen = Math.min(...results.map(r => r.len));
    expect(minLen).toBeLessThan(22);
  });

  test("UUID shorthand round-trip for each encoding", () => {
    const sample = "00112233-4455-6677-8899-aabbccddeeff";
    const encs = listEncodings();
    encs.forEach(e => {
      const encoded = encodeUUIDShorthand(sample, e.name);
      const decoded = decodeUUIDShorthand(encoded, e.name);
      expect(decoded.toLowerCase()).toBe(sample.toLowerCase());
    });
  });
});
