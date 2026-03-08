import { describe, it, expect } from 'vitest';
import { createEncoding, listEncodings, encode, decode, encodeUUID, decodeUUID } from '../../src/lib/main.js';

function toHex(u8) {
  return Array.from(u8).map(b => b.toString(16).padStart(2,'0')).join('');
}

function equalUint8(a,b){
  if (a.length !== b.length) return false;
  for (let i=0;i<a.length;i++) if (a[i]!==b[i]) return false;
  return true;
}

const encs = listEncodings().map(e => e.name);

describe('round-trip encoding tests', () => {
  it('empty buffer roundtrip', () => {
    for (const name of encs) {
      const out = encode(new Uint8Array(0), name);
      const back = decode(out, name);
      expect(back).toBeInstanceOf(Uint8Array);
      expect(back.length).toBe(0);
    }
  });

  it('single-byte edge cases', () => {
    const cases = [0x00,0x01,0x7F,0x80,0xFF];
    for (const b of cases) {
      for (const name of encs) {
        const buf = new Uint8Array([b]);
        const s = encode(buf, name);
        const back = decode(s, name);
        expect(equalUint8(back, buf)).toBe(true);
      }
    }
  });

  it('uuid buffers roundtrip', () => {
    const zero = new Uint8Array(16).fill(0);
    const ff = new Uint8Array(16).fill(0xFF);
    const inc = new Uint8Array(16); for (let i=0;i<16;i++) inc[i]=i;
    const cases = [zero, ff, inc];
    for (const buf of cases) {
      for (const name of encs) {
        const s = encode(buf, name);
        const back = decode(s, name);
        expect(equalUint8(back, buf)).toBe(true);
        // also test uuid helpers
        const hex = toHex(buf);
        const dashed = hex.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/,'$1-$2-$3-$4-$5');
        const enc = encodeUUID(dashed, name);
        const dec = decodeUUID(enc, name);
        expect(dec.toLowerCase()).toBe(dashed.toLowerCase());
      }
    }
  });

  it('random small buffers', () => {
    for (let t=0;t<20;t++){
      const len = Math.floor(Math.random()*10)+1;
      const buf = new Uint8Array(len);
      for (let i=0;i<len;i++) buf[i]=Math.floor(Math.random()*256);
      for (const name of encs) {
        const s = encode(buf, name);
        const back = decode(s, name);
        expect(equalUint8(back, buf)).toBe(true);
      }
    }
  });
});
