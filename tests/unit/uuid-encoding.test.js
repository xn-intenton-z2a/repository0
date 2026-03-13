// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect } from "vitest";
import { encodeUUID, decodeUUID, encode, listEncodings } from "../../src/lib/main.js";

describe("UUID Encoding Functions", () => {
  test("should encode and decode UUIDs correctly", () => {
    const testUUIDs = [
      "01234567-89ab-cdef-0123-456789abcdef",
      "018d4db2-4c87-7b82-8000-123456789abc", // v7 format
      "00000000-0000-0000-0000-000000000000",
      "ffffffff-ffff-ffff-ffff-ffffffffffff"
    ];
    
    for (const uuid of testUUIDs) {
      const encoded = encodeUUID(uuid);
      expect(typeof encoded).toBe("string");
      expect(encoded.length).toBeGreaterThan(0);
      
      const decoded = decodeUUID(encoded);
      expect(decoded.toLowerCase()).toBe(uuid.toLowerCase());
    }
  });

  test("should produce shorter output than base64", () => {
    const uuid = "018d4db2-4c87-7b82-8000-123456789abc";
    const encoded = encodeUUID(uuid);
    
    // Base64 would be ~24 chars for 16 bytes, densest encoding should be < 24
    expect(encoded.length).toBeLessThan(24);
  });

  test("should handle UUIDs without dashes", () => {
    const withDashes = "018d4db2-4c87-7b82-8000-123456789abc";
    const withoutDashes = "018d4db24c877b828000123456789abc";
    
    const encoded1 = encodeUUID(withDashes);
    const encoded2 = encodeUUID(withoutDashes);
    
    expect(encoded1).toBe(encoded2);
    
    const decoded1 = decodeUUID(encoded1);
    const decoded2 = decodeUUID(encoded2);
    
    expect(decoded1).toBe(decoded2);
    expect(decoded1).toBe(withDashes);
  });

  test("should use densest available encoding", () => {
    const uuid = "018d4db2-4c87-7b82-8000-123456789abc";
    const encoded = encodeUUID(uuid);
    
    // Parse UUID to bytes
    const cleaned = uuid.replace(/-/g, "");
    const bytes = new Uint8Array(16);
    for (let i = 0; i < 32; i += 2) {
      bytes[i / 2] = parseInt(cleaned.substring(i, i + 2), 16);
    }
    
    // Verify it uses base91 (densest)
    const encodings = listEncodings();
    const densest = encodings[0];
    const expectedEncoded = encode(bytes, densest.name);
    
    expect(encoded).toBe(expectedEncoded);
  });
});