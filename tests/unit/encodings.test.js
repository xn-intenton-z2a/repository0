// SPDX-License-Identifier: MIT
// Copyright (C) 2026 Polycode Limited
import { describe, test, expect } from "vitest";
import {
  encode,
  decode,
  encodeUUID,
  decodeUUID,
  encodeBase62,
  decodeBase62,
  encodeBase85,
  decodeBase85,
  encodeBase91,
  decodeBase91,
  createEncoding,
  listEncodings,
} from "../../src/lib/main.js";

function randomSample(length) {
  const out = new Uint8Array(length);
  for (let i = 0; i < length; i++) out[i] = (i * 31 + 7) & 0xff;
  return out;
}

const encNames = ["base62", "base85", "base91"];

describe("Encodings round-trip and edge cases", () => {
  test("empty buffer round-trip", () => {
    const empty = new Uint8Array([]);
    encNames.forEach((n) => {
      const e = encode(empty, n);
      expect(e).toBe("");
      const d = decode("", n);
      expect(d).toEqual(new Uint8Array([]));
    });
  });

  test("single byte round-trip", () => {
    const b = new Uint8Array([5]);
    encNames.forEach((n) => {
      const s = encode(b, n);
      const r = decode(s, n);
      expect(r).toEqual(b);
    });
  });

  test("all-zero 16-byte and all-0xFF 16-byte round-trip", () => {
    const zeros = new Uint8Array(16);
    const ff = new Uint8Array(16);
    ff.fill(0xff);
    encNames.forEach((n) => {
      expect(decode(encode(zeros, n), n)).toEqual(zeros);
      expect(decode(encode(ff, n), n)).toEqual(ff);
    });
  });

  test("random deterministic samples round-trip", () => {
    for (let len of [3, 7, 16, 32]) {
      const sample = randomSample(len);
      encNames.forEach((n) => {
        const s = encode(sample, n);
        const out = decode(s, n);
        expect(out).toEqual(sample);
      });
    }
  });

  test("UUID round-trip and length comparisons", () => {
    const uuid = "01234567-89ab-cdef-0123-456789abcdef";
    const lens = {};
    encNames.forEach((n) => {
      const enc = encodeUUID(uuid, n);
      const dec = decodeUUID(enc, n);
      expect(dec).toBe(uuid.toLowerCase());
      lens[n] = enc.length;
    });

    // densest encoding must produce fewer than 22 chars for a UUID
    const minLen = Math.min(...Object.values(lens));
    expect(minLen).toBeLessThan(22);

    // ensure order: base91 <= base85 <= base62 (denser encodings shorter or equal)
    expect(lens["base91"]).toBeLessThanOrEqual(lens["base85"]);
    expect(lens["base85"]).toBeLessThanOrEqual(lens["base62"]);
  });

  test("per-encoding wrapper parity and createEncoding factory", () => {
    const sample = new Uint8Array([1,2,3,4,5,6,7]);
    // wrappers parity
    expect(decodeBase62(encodeBase62(sample))).toEqual(sample);
    expect(decodeBase85(encodeBase85(sample))).toEqual(sample);
    expect(decodeBase91(encodeBase91(sample))).toEqual(sample);

    // factory
    const c = createEncoding("01", "binary2");
    const s = c.encode(Uint8Array.from([0,1,2,3]));
    const d = c.decode(s);
    expect(d).toEqual(Uint8Array.from([0,1,2,3]));
  });

  test("listEncodings returns useful metadata", () => {
    const list = listEncodings();
    expect(Array.isArray(list)).toBe(true);
    const names = list.map(x => x.name).sort();
    expect(names).toEqual(["base62","base85","base91"].sort());
    list.forEach(e => {
      expect(typeof e.charsetSize).toBe('number');
      expect(typeof e.bitsPerChar).toBe('number');
      expect(typeof e.uuidLength).toBe('number');
    });
  });
});
