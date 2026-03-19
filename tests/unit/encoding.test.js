// SPDX-License-Identifier: MIT
import { describe, test, expect } from 'vitest';
import { encode, decode, createEncodingFromCharset, listEncodings, encodeUUID } from '../../src/lib/main.js';

function toBytes(hex) {
  const b = new Uint8Array(hex.length/2);
  for (let i=0;i<b.length;i++) b[i]=parseInt(hex.slice(i*2,i*2+2),16);
  return b;
}

describe('Encodings round-trip', () => {
  const cases = [
    {name: 'empty', bytes: new Uint8Array([])},
    {name: 'single', bytes: new Uint8Array([0x7f])},
    {name: 'zeros', bytes: new Uint8Array(16).fill(0x00)},
    {name: 'ones', bytes: new Uint8Array(16).fill(0xff)},
    {name: 'uuid-sample', bytes: toBytes('00112233445566778899aabbccddeeff')}
  ];

  const encs = listEncodings().map(e=>e.name);
  encs.push(createEncodingFromCharset('custom', 'ABCDEFGabcdefg0123456789').name);

  for (const enc of encs) {
    for (const c of cases) {
      test(`roundtrip ${enc} ${c.name}`, () => {
        const out = encode(c.bytes, enc);
        const back = decode(out, enc);
        expect(back).toEqual(c.bytes);
      });
    }
  }
});

describe('UUID shorthand and density', () => {
  test('encodeUUID produces shorter than base64 for dense encoding', () => {
    const uuid = '00112233-4455-6677-8899-aabbccddeeff';
    const dense = 'dense94';
    const s = encodeUUID(uuid, dense);
    // baseline: base64 (no padding) for 16 bytes is 22 chars
    expect(s.length).toBeLessThan(22);
  });

  test('invalid uuid throws', () => {
    expect(()=>encodeUUID('not-a-uuid', 'dense94')).toThrow();
  });
});
