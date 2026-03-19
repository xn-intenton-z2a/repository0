import { listEncodings, encode } from '../../src/lib/main.js';
function sample(len) { const a=new Uint8Array(len); for (let i=0;i<len;i++) a[i]=i&255; return a; }
(async ()=>{
  const encs = listEncodings().map(e=>e.name);
  console.log('encodings', encs);
  for (const len of [0,1,2,16,31,64,128]){
    const buf = sample(len);
    for (const name of encs){
      console.log('encode', name, 'len', len);
      const before = process.memoryUsage();
      console.log('mem before', before.heapUsed);
      const s = encode(name, buf);
      const after = process.memoryUsage();
      console.log('mem after', after.heapUsed, 'outlen', s.length);
    }
  }
})();
