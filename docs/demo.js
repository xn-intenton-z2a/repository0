import { name, version, description } from './lib-meta.js';
import * as cron from './cron-browser.js';

const title = document.getElementById('lib-name');
const ver = document.getElementById('lib-version');
const desc = document.getElementById('lib-description');
const output = document.getElementById('demo-output');
const cronInput = document.getElementById('cron-input');
const startInput = document.getElementById('start-input');
const countInput = document.getElementById('count-input');
const btn = document.getElementById('generate-button');

title.textContent = name || 'repository0';
ver.textContent = version || '(no version)';
desc.textContent = description || '(no description)';

function formatLocalKey(d) {
  // key representing wall-clock local time y-m-d hh:mm
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const day = String(d.getDate()).padStart(2,'0');
  const hh = String(d.getHours()).padStart(2,'0');
  const mm = String(d.getMinutes()).padStart(2,'0');
  return `${y}-${m}-${day} ${hh}:${mm}`;
}

function generate() {
  try {
    const expr = cronInput.value.trim();
    const start = startInput.value ? new Date(startInput.value) : new Date();
    const count = Math.max(1, parseInt(countInput.value, 10) || 5);
    const runs = cron.nextRuns(expr, count, start);
    const lines = [];
    lines.push(`Next ${runs.length} runs for "${expr}" starting ${start.toISOString()}:`);

    const seenLocal = new Map();
    for (const r of runs) {
      const iso = r.toISOString();
      const localKey = formatLocalKey(r);
      const prev = seenLocal.get(localKey) || 0;
      seenLocal.set(localKey, prev + 1);
      lines.push(iso + (prev > 0 ? '  <-- repeated local wall-clock' : ''));
    }

    // detect likely skipped times: if the schedule is daily at a given local time and one day is missing
    // simple heuristic: if any two consecutive runs are more than 36 hours apart, mark as possible skipped day
    for (let i = 1; i < runs.length; i++) {
      if (runs[i].getTime() - runs[i-1].getTime() > 36 * 60 * 60 * 1000) {
        lines.push('\nNote: a large gap detected between runs, this may indicate a skipped local time due to DST spring-forward.');
        break;
      }
    }

    output.textContent = lines.join('\n');
  } catch (e) {
    output.textContent = 'Demo error: ' + (e && e.message ? e.message : String(e));
  }
}

btn.addEventListener('click', generate);
// auto-generate on load
generate();
