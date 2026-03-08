import fs from 'fs';
import { encodeUUID, listEncodings } from '../../src/lib/main.js';

const sample = '0189a000-0000-7000-8000-000000000000';
const encs = listEncodings();
const out = { uuid: sample, encodings: {} };
for (const e of encs) {
  out.encodings[e.name] = {
    encoded: encodeUUID(sample, e.name),
    meta: e
  };
}
fs.mkdirSync('docs/examples', { recursive: true });
fs.writeFileSync('docs/examples/output.json', JSON.stringify(out, null, 2));
console.log('wrote docs/examples/output.json');
