// SPDX-License-Identifier: MIT
// src/lib/main.js
// Compact cron engine implementing parseCron, nextRun, nextRuns, matches, toString

export { parseCron, nextRun, nextRuns, matches, toString };

const SPECIALS = {
  '@yearly': '0 0 1 1 *',
  '@annually': '0 0 1 1 *',
  '@monthly': '0 0 1 * *',
  '@weekly': '0 0 * * 0',
  '@daily': '0 0 * * *',
  '@midnight': '0 0 * * *',
  '@hourly': '0 * * * *'
};

function expandSpecial(expr) {
  const e = expr.trim();
  const low = e.toLowerCase();
  return SPECIALS[low] || e;
}

function parseIntStrict(s, label) {
  if (s === undefined || s === null) throw new Error(`${label} missing`);
  if (!/^\d+$/.test(String(s))) throw new Error(`${label} '${s}' is not a valid integer`);
  return Number(s);
}

function parseField(fieldStr, min, max, fieldName) {
  if (!fieldStr || fieldStr.length === 0) throw new Error(`${fieldName} empty`);
  const parts = fieldStr.split(',').map(s => s.trim()).filter(Boolean);
  const vals = new Set();
  for (const part of parts) {
    const [base, stepPart] = part.split('/');
    const step = stepPart === undefined ? 1 : parseIntStrict(stepPart, `${fieldName} step`);
    if (!Number.isInteger(step) || step <= 0) throw new Error(`${fieldName} step must be a positive integer`);
    if (base === '*') {
      for (let v = min; v <= max; v += step) vals.add(v);
      continue;
    }
    if (base.includes('-')) {
      const [aStr, bStr] = base.split('-');
      if (bStr === undefined || bStr === '') throw new Error(`malformed range in field '${fieldName}': '${base}'`);
      const a = parseIntStrict(aStr, `${fieldName} range start`);
      const b = parseIntStrict(bStr, `${fieldName} range end`);
      if (a > b) throw new Error(`${fieldName} range start ${a} greater than end ${b}`);
      if (a < min || b > max) throw new Error(`${fieldName} range ${a}-${b} out of bounds ${min}-${max}`);
      for (let v = a; v <= b; v += step) vals.add(v);
      continue;
    }
    const n = parseIntStrict(base, `${fieldName} value`);
    if (n < min || n > max) throw new Error(`${fieldName} value ${n} out of range ${min}-${max}`);
    if (step !== 1) {
      for (let v = n; v <= max; v += step) vals.add(v);
    } else {
      vals.add(n);
    }
  }
  return Array.from(vals).sort((a, b) => a - b);
}

function normalizeParsed(p) {
  const parsed = {
    original: p.original || p.string || '',
    string: p.string || p.original || '',
    secondsPresent: !!p.secondsPresent
  };
  parsed.seconds = p.secondsPresent ? Array.from(new Set(p.seconds)).sort((a,b)=>a-b) : undefined;
  parsed.minutes = Array.from(new Set(p.minutes)).sort((a,b)=>a-b);
  parsed.hours = Array.from(new Set(p.hours)).sort((a,b)=>a-b);
  parsed.dayOfMonth = Array.from(new Set(p.dayOfMonth)).sort((a,b)=>a-b);
  parsed.month = Array.from(new Set(p.month)).sort((a,b)=>a-b);
  parsed.dayOfWeek = Array.from(new Set((p.dayOfWeek||[]).map(d => d === 7 ? 0 : d))).sort((a,b)=>a-b);
  // convenience aliases
  parsed.minutes = parsed.minutes;
  parsed.hours = parsed.hours;
  parsed.day = parsed.dayOfMonth;
  return parsed;
}

/**
 * parseCron(expression) -> parsed object
 * Supports 5-field and 6-field (seconds) crons, lists, ranges, steps, and special macros.
 * Throws descriptive Errors for invalid syntax or out-of-range values.
 */
function parseCron(expr) {
  if (typeof expr !== 'string') throw new TypeError('expression must be a string');
  const expanded = expandSpecial(expr);
  const fields = expanded.split(/\s+/).filter(Boolean);
  let secondsPresent = false;
  if (fields.length === 6) secondsPresent = true;
  else if (fields.length === 5) secondsPresent = false;
  else throw new Error(`expected 5 or 6 fields in cron expression, got ${fields.length}`);

  const f = secondsPresent ? fields.slice() : ['0', ...fields];
  // f: [sec,min,hour,dom,mon,dow]
  const sec = parseField(f[0], 0, 59, 'seconds');
  const min = parseField(f[1], 0, 59, 'minutes');
  const hour = parseField(f[2], 0, 23, 'hours');
  const dom = parseField(f[3], 1, 31, 'dayOfMonth');
  const mon = parseField(f[4], 1, 12, 'month');
  const dowRaw = parseField(f[5], 0, 7, 'dayOfWeek');
  const dow = Array.from(new Set(dowRaw.map(d => d === 7 ? 0 : d))).sort((a,b)=>a-b);

  const parsed = {
    original: expr,
    string: expanded,
    secondsPresent,
    seconds: secondsPresent ? sec : undefined,
    minutes: min,
    hours: hour,
    dayOfMonth: dom,
    month: mon,
    dayOfWeek: dow
  };
  return normalizeParsed(parsed);
}

function isFullRange(arr, min, max) {
  if (!Array.isArray(arr)) return false;
  if (arr.length !== (max - min + 1)) return false;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== min + i) return false;
  }
  return true;
}

function canonicalField(arr, min, max) {
  if (!Array.isArray(arr)) return '*';
  if (isFullRange(arr, min, max)) return '*';
  return arr.join(',');
}

function toString(input) {
  const p = typeof input === 'string' ? parseCron(input) : input;
  if (!p || typeof p !== 'object') throw new TypeError('toString expects parsed object or string');
  const secTok = p.secondsPresent ? canonicalField(p.seconds, 0, 59) : undefined;
  const minTok = canonicalField(p.minutes, 0, 59);
  const hourTok = canonicalField(p.hours, 0, 23);
  const domTok = canonicalField(p.dayOfMonth, 1, 31);
  const monTok = canonicalField(p.month, 1, 12);
  const dowTok = canonicalField(p.dayOfWeek, 0, 6);
  if (p.secondsPresent) return `${secTok} ${minTok} ${hourTok} ${domTok} ${monTok} ${dowTok}`;
  return `${minTok} ${hourTok} ${domTok} ${monTok} ${dowTok}`;
}

function matches(parsedOrExpr, date) {
  const p = typeof parsedOrExpr === 'string' ? parseCron(parsedOrExpr) : parsedOrExpr;
  if (!p || typeof p !== 'object') throw new TypeError('matches expects parsed object or string');
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) throw new TypeError('date must be a valid Date');
  const sec = date.getSeconds();
  const min = date.getMinutes();
  const hour = date.getHours();
  const dom = date.getDate();
  const mon = date.getMonth() + 1;
  const dow = date.getDay();

  if (p.secondsPresent) {
    if (!p.seconds.includes(sec)) return false;
  } else {
    // when seconds not present, schedule is anchored at second 0
    if (sec !== 0) return false;
  }
  if (!p.minutes.includes(min)) return false;
  if (!p.hours.includes(hour)) return false;
  if (!p.month.includes(mon)) return false;

  const domAny = isFullRange(p.dayOfMonth, 1, 31);
  const dowAny = isFullRange(p.dayOfWeek, 0, 6);
  const domMatch = p.dayOfMonth.includes(dom);
  const dowMatch = p.dayOfWeek.includes(dow);
  if (domAny && dowAny) return true;
  if (domAny) return dowMatch;
  if (dowAny) return domMatch;
  return domMatch || dowMatch;
}

function nextRun(parsedOrExpr, after) {
  const p = typeof parsedOrExpr === 'string' ? parseCron(parsedOrExpr) : parsedOrExpr;
  if (!p || typeof p !== 'object') throw new TypeError('nextRun expects parsed object or string');
  const anchor = after ? new Date(after) : new Date();
  if (Number.isNaN(anchor.getTime())) throw new TypeError('after must be a valid Date');
  // search strictly after anchor
  const stepMs = p.secondsPresent ? 1000 : 60000; // step by second or minute
  let candidateTime = anchor.getTime() + stepMs;
  // search up to 5 years ahead
  const maxTime = anchor.getTime() + 5 * 366 * 24 * 60 * 60 * 1000;
  while (candidateTime <= maxTime) {
    const d = new Date(candidateTime);
    // ensure the constructed local components correspond to intended local fields (reject invalid dates created by overflow)
    // nothing extra needed because we compare using getters
    if (matches(p, d)) return d;
    candidateTime += stepMs;
  }
  throw new Error('no matching run found within 5 years');
}

function nextRuns(parsedOrExpr, count, after) {
  if (!Number.isInteger(count) || count <= 0) throw new TypeError('count must be a positive integer');
  const results = [];
  let anchor = after ? new Date(after) : new Date();
  for (let i = 0; i < count; i++) {
    const nxt = nextRun(parsedOrExpr, anchor);
    results.push(nxt);
    // set anchor to the found time to get strictly after next
    anchor = new Date(nxt.getTime());
  }
  return results;
}
