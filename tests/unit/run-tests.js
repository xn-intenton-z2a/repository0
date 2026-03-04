import fs from 'fs/promises';
import path from 'path';
import { main } from '../../src/lib/main.js';

async function run() {
  const out = path.resolve('examples', 'test-sin.svg');
  try {
    const res = await main(['--expression', 'y=sin(x)', '--range', 'x=0:6.283:0.1', '--file', out, '--format', 'svg']);
    const content = await fs.readFile(out, 'utf8');
    if (!content.includes('<svg') || !content.includes('<path')) {
      console.error('Generated SVG does not contain expected content');
      process.exit(2);
    }
    if (res.file !== out) {
      console.error('Returned file path mismatch', res.file, out);
      process.exit(3);
    }
    console.log('All checks passed');
    // cleanup
    try { await fs.rm(out); } catch (e) {}
    process.exit(0);
  } catch (err) {
    console.error('Test failed:', err);
    try { await fs.rm(out); } catch (e) {}
    process.exit(1);
  }
}

run();
