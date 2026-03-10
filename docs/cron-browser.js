// src/web/cron-browser.js
// Browser-compatible cron utilities (mirror of src/lib/cron.js)

const SPECIALS = {
  '@yearly': '0 0 1 1 *',
  '@annually': '0 0 1 1 *',
  '@monthly': '0 0 1 * *',
  '@weekly': '0 0 * * 0',
  '@daily': '0 0 * * *',
  '@midnight': '0 0 * * *',
  '@hourly': '0 * * * *'
};

function parseField(field, min, max, name) {
  if (field == null) throw new Error(`Missing field ${name}`);
  field = String(field).trim();
  if (field === '*') return { any: true };
  const values = new Set();
  const parts = field.split(',');
  for (const part of parts) {
    if (part.includes('/')) {
      const [base, stepStr] = part.split('/');
      const step = Number(stepStr);
      if (!Number.isFinite(step) || step <= 0) throw new Error(`Invalid step "${part}" in ${name}`);
      const baseRange = base === '*' ? `${min}-${max}` : base;
      const [rstart, rend] = baseRange.split('-').map(Number);
      if (!Number.isFinite(rstart) || !Number.isFinite(rend)) throw new Error(`Invalid range "${base}" in ${name}`);
      for (let v = rstart; v <= rend; v += step) values.add(v);
      continue;
    }
    if (part.includes('-')) {
      const [a, b] = part.split('-').map(Number);
      if (!Number.isFinite(a) || !Number.isFinite(b)) throw new Error(`Invalid range "${part}" in ${name}`);
      for (let v = a; v <= b; v++) values.add(v);
      continue;
    }
    const n = Number(part);
    if (!Number.isFinite(n)) throw new Error(`Invalid value "${part}" in ${name}`);
    values.add(n);
  }
  for (const v of values) {
    if (v < min || v > max) throw new Error(`${name} value ${v} out of range ${min}-${max}`);
  }
  return { any: false, values };
}

export function parseCron(expression) {
  if (!expression || typeof expression !== 'string') throw new Error('Expression must be a non-empty string');
  expression = expression.trim();
  if (SPECIALS[expression]) expression = SPECIALS[expression];
  const parts = expression.split(/\s+/);
  let hasSeconds = false;
  if (parts.length === 6) {
    hasSeconds = true;
  } else if (parts.length === 5) {
    hasSeconds = false;
  } else {
    throw new Error(`Invalid cron expression, expected 5 or 6 fields but got ${parts.length}`);
  }
  const secs = hasSeconds ? parts[0] : '0';
  const mins = hasSeconds ? parts[1] : parts[0];
  const hrs = hasSeconds ? parts[2] : parts[1];
  const dom = hasSeconds ? parts[3] : parts[2];
  const mon = hasSeconds ? parts[4] : parts[3];
  const dow = hasSeconds ? parts[5] : parts[4];

  const seconds = parseField(secs, 0, 59, 'seconds');
  const minutes = parseField(mins, 0, 59, 'minutes');
  const hours = parseField(hrs, 0, 23, 'hours');
  const dayOfMonth = parseField(dom, 1, 31, 'dayOfMonth');
  const month = parseField(mon, 1, 12, 'month');
  const dayOfWeek = parseField(dow.replace(/7/g, '0'), 0, 6, 'dayOfWeek');

  return {
    expression,
    hasSeconds,
    fields: { seconds, minutes, hours, dayOfMonth, month, dayOfWeek }
  };
}

function matchesField(f, value) {
  if (!f) return false;
  if (f.any) return true;
  return f.values.has(value);
}

export function matches(expression, date) {
  const parsed = typeof expression === 'string' ? parseCron(expression) : expression;
  if (!(date instanceof Date)) throw new Error('date must be a Date');
  const mo = date.getMonth() + 1; // 1-12
  const dom = date.getDate();
  const hr = date.getHours();
  const min = date.getMinutes();
  const sec = date.getSeconds();
  const dow = date.getDay(); // 0-6

  const f = parsed.fields;
  if (!matchesField(f.month, mo)) return false;
  // Cron semantics: day-of-month and day-of-week interaction:
  // - If both DOM and DOW are restricted (not '*'), match when either matches (OR).
  // - If one is '*', require the other to match.
  const domMatch = matchesField(f.dayOfMonth, dom);
  const dowMatch = matchesField(f.dayOfWeek, dow);
  const domAny = f.dayOfMonth.any === true;
  const dowAny = f.dayOfWeek.any === true;
  if (!domAny && !dowAny) {
    if (!domMatch && !dowMatch) return false;
  } else if (!domAny) {
    if (!domMatch) return false;
  } else if (!dowAny) {
    if (!dowMatch) return false;
  }
  if (!matchesField(f.hours, hr)) return false;
  if (!matchesField(f.minutes, min)) return false;
  if (parsed.hasSeconds) {
    if (!matchesField(f.seconds, sec)) return false;
  }
  return true;
}

export function nextRun(expression, after) {
  const parsed = typeof expression === 'string' ? parseCron(expression) : expression;
  const stepMs = parsed.hasSeconds ? 1000 : 60 * 1000;
  let candidate = after ? new Date(after.getTime()) : new Date();
  // start strictly after
  candidate = new Date(candidate.getTime() + stepMs);
  const limit = new Date(candidate.getTime());
  limit.setFullYear(limit.getFullYear() + 5);

  while (candidate <= limit) {
    if (matches(parsed, candidate)) return candidate;
    candidate = new Date(candidate.getTime() + stepMs);
  }
  throw new Error('No next run found within 5 years');
}

export function nextRuns(expression, count, after) {
  if (!Number.isInteger(count) || count <= 0) throw new Error('count must be a positive integer');
  const results = [];
  let cursor = after ? new Date(after.getTime()) : new Date();
  for (let i = 0; i < count; i++) {
    const next = nextRun(expression, cursor);
    results.push(next);
    cursor = new Date(next.getTime());
  }
  return results;
}

export function toString(parsed) {
  if (!parsed || !parsed.fields) throw new Error('Invalid parsed cron object');
  function fieldToStr(f) {
    if (f.any) return '*';
    const arr = Array.from(f.values).sort((a,b)=>a-b);
    const pieces = [];
    let i = 0;
    while (i < arr.length) {
      let j = i;
      while (j+1 < arr.length && arr[j+1] === arr[j]+1) j++;
      if (j === i) pieces.push(String(arr[i]));
      else pieces.push(`${arr[i]}-${arr[j]}`);
      i = j+1;
    }
    return pieces.join(',');
  }
  const f = parsed.fields;
  const secs = parsed.hasSeconds ? fieldToStr(f.seconds) : null;
  const mins = fieldToStr(f.minutes);
  const hrs = fieldToStr(f.hours);
  const dom = fieldToStr(f.dayOfMonth);
  const mon = fieldToStr(f.month);
  const dow = fieldToStr(f.dayOfWeek);
  return parsed.hasSeconds ? `${secs} ${mins} ${hrs} ${dom} ${mon} ${dow}` : `${mins} ${hrs} ${dom} ${mon} ${dow}`;
}
