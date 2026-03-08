#!/usr/bin/env node
// Example usage of the dense encoding library

import { encode, decode, encodeUUID, decodeUUID, listEncodings } from '../../src/lib/main.js';

console.log('Dense Binary-to-Text Encoding Library Examples\n');

// Example 1: Basic text encoding
console.log('=== Example 1: Basic Text Encoding ===');
const text = 'Hello, World!';
const textBuffer = Buffer.from(text, 'utf8');

console.log(`Original text: "${text}"`);
console.log(`Buffer: ${textBuffer.toString('hex')}`);

for (const encoding of ['base62', 'base85', 'base91']) {
  const encoded = encode(textBuffer, encoding);
  const decoded = decode(encoded, encoding);
  console.log(`${encoding.padEnd(8)}: ${encoded} -> "${decoded.toString('utf8')}"`);
}

console.log('\n=== Example 2: UUID Encoding Comparison ===');
const uuids = [
  '01234567-89ab-cdef-0123-456789abcdef',
  '00000000-0000-0000-0000-000000000000',
  'ffffffff-ffff-ffff-ffff-ffffffffffff',
  '550e8400-e29b-41d4-a716-446655440000'
];

console.log('UUID                                | Base64               | Base62              | Base85         | Base91         | Savings');
console.log('------------------------------------|----------------------|---------------------|----------------|----------------|--------');

for (const uuid of uuids) {
  const buffer = Buffer.from(uuid.replace(/-/g, ''), 'hex');
  const base64 = buffer.toString('base64');
  const base62 = encode(buffer, 'base62');
  const base85 = encode(buffer, 'base85');
  const base91 = encode(buffer, 'base91');
  const savings = Math.round((1 - base91.length / base64.length) * 100);
  
  console.log(`${uuid} | ${base64.padEnd(20)} | ${base62.padEnd(19)} | ${base85.padEnd(14)} | ${base91.padEnd(14)} | ${savings}%`);
}

console.log('\n=== Example 3: Binary Data ===');
const binaryData = Buffer.from([0x00, 0xFF, 0x42, 0xA5, 0x7E, 0x91, 0x3D, 0xC8]);
console.log(`Binary data: ${binaryData.toString('hex')}`);

for (const encoding of ['base62', 'base85', 'base91']) {
  const encoded = encode(binaryData, encoding);
  const decoded = decode(encoded, encoding);
  const matches = decoded.equals(binaryData);
  console.log(`${encoding}: ${encoded} (${matches ? 'OK' : 'FAIL'})`);
}

console.log('\n=== Example 4: Available Encodings ===');
const encodings = listEncodings();
console.log('Name    | Characters | Bit Density | Sample (16 bytes)');
console.log('--------|------------|-------------|------------------');

for (const enc of encodings) {
  const sample16 = encode(Buffer.from('0123456789ABCDEF', 'hex'), enc.name);
  console.log(`${enc.name.padEnd(7)} | ${enc.charsetLength.toString().padEnd(10)} | ${enc.bitDensity.toFixed(2).padEnd(11)} | ${sample16}`);
}

console.log('\n=== Example 5: UUID Convenience Functions ===');
const testUUID = '550e8400-e29b-41d4-a716-446655440000';
const encodedUUID = encodeUUID(testUUID);
const decodedUUID = decodeUUID(encodedUUID);

console.log(`Original UUID:   ${testUUID}`);
console.log(`Encoded (${encodedUUID.length} chars):  ${encodedUUID}`);
console.log(`Decoded:         ${decodedUUID}`);
console.log(`Round-trip OK:   ${testUUID === decodedUUID}`);

console.log('\n=== Performance Comparison ===');
console.log('For 16-byte UUID:');
console.log(`Base64:  24 characters (baseline)`);
console.log(`Base62:  ${encode(Buffer.from('0123456789ABCDEF', 'hex'), 'base62').length} characters (${Math.round((1 - encode(Buffer.from('0123456789ABCDEF', 'hex'), 'base62').length / 24) * 100)}% smaller)`);
console.log(`Base85:  ${encode(Buffer.from('0123456789ABCDEF', 'hex'), 'base85').length} characters (${Math.round((1 - encode(Buffer.from('0123456789ABCDEF', 'hex'), 'base85').length / 24) * 100)}% smaller)`);
console.log(`Base91:  ${encode(Buffer.from('0123456789ABCDEF', 'hex'), 'base91').length} characters (${Math.round((1 - encode(Buffer.from('0123456789ABCDEF', 'hex'), 'base91').length / 24) * 100)}% smaller)`);