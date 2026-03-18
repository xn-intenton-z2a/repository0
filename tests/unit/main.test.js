// SPDX-License-Identifier: MIT
// Comprehensive tests for encodings, round-trip, edge-cases, UUID shorthand lengths, and defineEncoding
import { describe, test, expect } from "vitest";
import { randomFillSync } from "crypto";
import {
  encode,
  decode,
  defineEncoding,
  listEncodings,
  encodeUUIDShorthand,
  decodeUUIDShorthand,
} from "../../src/lib/main.js";

function toBytes(uuid) {
  const clean = uuid.replace(/-/g, "");
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(clean.substr(i * 2, 2), 16);
  return out;
}

function randomBytes(len) {
  const arr = new Uint8Array(len);
  randomFillSync(arr);
  return arr;
}

describe("Encoding library - comprehensive suite", () => {
  test("listEncodings returns metadata and builtin encodings exist", () => {
    const encs = listEncodings();
    expect(Array.isArray(encs)).toBe(true);
    // required builtins
    const required = [
      "base62",
      "base85",
      "base91",
      "ascii-printable-no-ambiguous",
    ];
    const names = encs.map(e => e.name);
    required.forEach(r => expect(names).toContain(r));

    encs.forEach(e => {
      expect(typeof e.name).toBe("string");
      expect(typeof e.charset).toBe("string");
      expect(typeof e.charsetSize).toBe("number");
      expect(typeof e.bitsPerChar).toBe("number");
    });
  });

  // Round-trip and edge cases for builtin encodings and a custom encoding
  test("round-trip encode/decode for builtins and a custom charset (edge cases + random samples)", () => {
    const encs = listEncodings().map(e => e.name);
    const builtin = [
      "base62",
      "base85",
      "base91",
      "ascii-printable-no-ambiguous",
    ].filter(n => encs.includes(n));

    // define a custom encoding unique to this test run to avoid name collisions
    const customName = `custom-test-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const customCharset = "0123456789ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"; // base58-like but with some removals
    const meta = defineEncoding(customName, customCharset, { sanitize: true });
    expect(meta.name).toBe(customName);
    builtin.push(customName);

    const sampleBuffers = [
      new Uint8Array(0),
      new Uint8Array([0x00]),
      new Uint8Array([0x01]),
      new Uint8Array([0xff]),
      new Uint8Array(16).fill(0x00),
      new Uint8Array(16).fill(0xff),
    ];

    // add a few random buffers of varying lengths
    for (let i = 0; i < 8; i++) sampleBuffers.push(randomBytes(1 + (i % 16)));

    for (const name of builtin) {
      for (const buf of sampleBuffers) {
        const encoded = encode(name, buf);
        expect(typeof encoded).toBe("string");
        const back = decode(name, encoded);
        expect(back).toEqual(buf);
      }
    }
  });

  test("defineEncoding sanitisation and error handling", () => {
    // sanitisation removes ambiguous characters
    const nm = `san-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const input = "A0O1lI!@#";
    const meta = defineEncoding(nm, input, { sanitize: true });
    // ambiguous chars should be stripped
    ["0", "O", "1", "l", "I"].forEach(ch => expect(meta.charset).not.toContain(ch));
    expect(meta.charset).toContain("A");
    expect(meta.charset.length).toBeGreaterThanOrEqual(2);

    // control/whitespace rejected
    expect(() => defineEncoding(`bad-${Date.now()}`, "ab\ncd")).toThrow();
    // duplicate characters rejected
    expect(() => defineEncoding(`dup-${Date.now()}`, "aa")).toThrow();
  });

  test("decode throws on invalid characters for an encoding", () => {
    const encs = listEncodings();
    // pick a registered encoding and attempt to decode an unsupported symbol
    const name = encs[0].name;
    expect(() => decode(name, "\u2603")).toThrow(); // snowman unlikely to be in charset
  });

  test("UUID shorthand encode/decode and densest encoding length check", () => {
    const sample = "00112233-4455-6677-8899-aabbccddeeff";
    // round-trip for each registered encoding
    const encs = listEncodings();
    encs.forEach(e => {
      const encoded = encodeUUIDShorthand(sample, e.name);
      expect(typeof encoded).toBe("string");
      const decoded = decodeUUIDShorthand(encoded, e.name);
      expect(decoded.toLowerCase()).toBe(sample.toLowerCase());
    });

    // ensure at least one encoding yields length < 22 (denser than base64 without padding)
    const lengths = encs.map(e => encodeUUIDShorthand(sample, e.name).length);
    const minLen = Math.min(...lengths);
    expect(minLen).toBeLessThan(22);

    // default shorthand (no encodingName) uses densest registered encoding
    const defaultEncoded = encodeUUIDShorthand(sample);
    expect(typeof defaultEncoded).toBe("string");
    expect(defaultEncoded.length).toBeLessThan(22);
  });

  test("encode/decode reject unknown encodings", () => {
    expect(() => encode("no-such-enc", new Uint8Array([1, 2, 3]))).toThrow();
    expect(() => decode("no-such-enc", "abc")).toThrow();
  });
});
