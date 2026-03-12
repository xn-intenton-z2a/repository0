import { test, expect } from 'vitest';
import { readFile } from 'fs/promises';

test('web index has expected structure and imports', async () => {
  const html = await readFile(new URL('../../src/web/index.html', import.meta.url), 'utf8');
  expect(html).toContain('id="lib-name"');
  expect(html).toContain('id="lib-version"');
  expect(html).toContain('id="demo-output"');
  expect(html).toContain("import('./lib.js')");
});
