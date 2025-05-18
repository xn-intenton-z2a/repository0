import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

const cli = 'node sandbox/source/main.js';

describe('markdown command', () => {
  const tempDir = path.join(os.tmpdir(), 'markdown-tests');

  beforeEach(() => {
    fs.mkdirSync(tempDir, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test('renders markdown to HTML on stdout', () => {
    const mdPath = path.join(tempDir, 'test.md');
    const mdContent = `# Heading

This is a [link](http://example.com).

\
\`\`\`
code
\`\`\`\n
| A | B |
| - | - |
| 1 | 2 |`;
    fs.writeFileSync(mdPath, mdContent, 'utf-8');
    const output = execSync(`${cli} markdown ${mdPath}`, { encoding: 'utf-8' });
    expect(output).toContain('<h1>Heading</h1>');
    expect(output).toContain('<a href="http://example.com">link</a>');
    expect(output).toContain('<pre><code>code');
    expect(output).toContain('<table>');
  });

  test('writes HTML output to file with --output', () => {
    const mdPath = path.join(tempDir, 'test2.md');
    const outPath = path.join(tempDir, 'out.html');
    const mdContent = '# Test\nContent';
    fs.writeFileSync(mdPath, mdContent, 'utf-8');
    const stdout = execSync(`${cli} markdown ${mdPath} --output ${outPath}`, { encoding: 'utf-8' });
    expect(stdout).toBe('');
    const fileContent = fs.readFileSync(outPath, 'utf-8');
    expect(fileContent).toContain('<h1>Test</h1>');
    expect(fileContent).toContain('<p>Content</p>');
  });

  test('error on non-existent file', () => {
    const non = path.join(tempDir, 'nope.md');
    let err;
    try {
      execSync(`${cli} markdown ${non}`, { encoding: 'utf-8', stdio: 'pipe' });
    } catch (e) {
      err = e;
    }
    expect(err).toBeDefined();
    expect(err.status).toBe(1);
    expect(err.stderr).toContain('Error reading input file');
  });
});
