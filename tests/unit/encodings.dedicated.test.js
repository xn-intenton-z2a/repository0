// SPDX-License-Identifier: MIT
import { describe, test, expect } from 'vitest';
import { encode, decode, listEncodings, createEncodingFromCharset, _internal } from '../../src/lib/main.js';

function randomBytes(len){
  const b = new Uint8Array(len);
  for(let i=0;i<len;i++) b[i]=Math.floor(Math.random()*256);
  return b;
}

describe('Dedicated encodings tests', ()=>{
  const encMeta = listEncodings();
  test('listing returns metadata fields', ()=>{
    expect(Array.isArray(encMeta)).toBe(true);
    for (const e of encMeta) {
      expect(e).toHaveProperty('name');
      expect(e).toHaveProperty('bitsPerChar');
      expect(e).toHaveProperty('charsetSize');
    }
  });

  test('charset sanitisation removes ambiguous chars when creating custom', ()=>{
    const raw = '0O1lI !@#ABC';
    const created = createEncodingFromCharset('sanitize-test', raw);
    expect(created.charset.includes('0')).toBe(false);
    expect(created.charset.includes('O')).toBe(false);
    expect(created.charset.includes(' ')).toBe(false);
    expect(created.charset.length).toBeGreaterThan(0);
  });

  const builtins = encMeta.map(e=>e.name);
  const edgeCases = [new Uint8Array([]), new Uint8Array([0x01]), new Uint8Array(16).fill(0x00), new Uint8Array(16).fill(0xff)];

  for (const name of builtins) {
    describe(`roundtrip ${name}`, ()=>{
      test('roundtrip for empty buffer', ()=>{
        const out = encode(edgeCases[0], name);
        const back = decode(out, name);
        expect(back).toEqual(edgeCases[0]);
      });
      test('roundtrip for single byte', ()=>{
        const out = encode(edgeCases[1], name);
        const back = decode(out, name);
        expect(back).toEqual(edgeCases[1]);
      });
      test('roundtrip for all-zero and all-0xFF', ()=>{
        for (let i=2;i<4;i++){
          const out = encode(edgeCases[i], name);
          const back = decode(out, name);
          expect(back).toEqual(edgeCases[i]);
        }
      });
      test('random roundtrip samples', ()=>{
        for (let i=0;i<5;i++){
          const b = randomBytes(8);
          const out = encode(b, name);
          const back = decode(out, name);
          expect(back).toEqual(b);
        }
      });
    });
  }
});
