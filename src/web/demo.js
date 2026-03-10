import { name, version, description } from './lib-meta.js';
import * as cron from './cron-browser.js';

const title = document.getElementById('lib-name');
const ver = document.getElementById('lib-version');
const desc = document.getElementById('lib-description');
const output = document.getElementById('demo-output');

title.textContent = name || 'repository0';
ver.textContent = version || '(no version)';
desc.textContent = description || '(no description)';

try {
  const runs = cron.nextRuns('@daily', 7, new Date(2025, 0, 1));
  const lines = ['Next 7 daily runs starting 2025-01-01:'];
  for (const d of runs) {
    lines.push(d.toString());
  }
  output.textContent = lines.join('\n');
} catch (e) {
  output.textContent = 'Demo error: ' + e.message;
}
