#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// src/lib/main.js
// Compact cron engine implementing parseCron, nextRun, nextRuns, matches, toString

/**
 * Parse cron expressions (5-field or 6-field with seconds), compute next run times,
 * check matches, and convert parsed form back to canonical string.
 * All computations use local time (Date getters/setters) so behavior follows host timezone.
 */

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

function ensureString(expr) {
  if (typeof expr === 'string') return expr.trim();
  if (expr && expr.original) return expr.original;
  throw new TypeError('expression must be a string or parsed cron object');
}

function expandSpecial(expr) {
  const e = expr.trim();
  return SPECIALS[e.toLowerCase()] || e;
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
    hasSeconds: !!p.hasSeconds
  };
  parsed.seconds = p.seconds ? Array.from(new Set(p.seconds)).sort((a,b)=>a-b) : undefined;
  parsed.minutes = Array.from(new Set(p.minutes)).sort((a,b)=>a-b);
  parsed.hours = Array.from(new Set(p.hours)).sort((a,b)=>a-b);
  parsed.dayOfMonth = Array.from(new Set(p.dayOfMonth)).sort((a,b)=>a-b);
  parsed.month = Array.from(new Set(p.month)).sort((a,b)=>a-b);
  parsed.dayOfWeek = Array.from(new Set((p.dayOfWeek||[]).map(d => d === 7 ? 0 : d))).sort((a,b)=>a-b);
  // convenience aliases
  parsed.minute = parsed.minutes;
  parsed.hour = parsed.hours;
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
  let s = expandSpecial(expr);
  const fields = s.split(/\s+/).filter(Boolean);
  let hasSeconds = false;
  if (fields.length === 6) hasSeconds = true;
  else if (fields.length === 5) hasSeconds = false;
  else throw new Error('expected 5 fields');

  const f = hasSeconds ? fields.slice() : ['0', ...fields];
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
    string: s,
    hasSeconds,
    seconds: hasSeconds ? sec : undefined,
    minutes: min,
    hours: hour,
    dayOfMonth: dom,
    month: mon,
    dayOfWeek: dow
  };
  return normalizeParsed(parsed);
}

function canonicalField(arr, min, max) {
  if (!Array.isArray(arr)) return '*';
  // if full range
  if (arr.length === (max - min + 1) && arr[0] === min && arr[arr.length-1] === max) return '*';
  return arr.join(',');
}

/**
 * toString(parsedOrExpr) -> canonical cron string
 */
function toString(parsedOrExpr) {
  const p = typeof parsedOrExpr === 'string' ? parseCron(parsedOrExpr) : normalizeParsed(parsedOrExpr);
  const secPart = p.hasSeconds ? canonicalField(p.seconds || [0], 0, 59) : null;
  const parts = [];
  if (p.hasSeconds) parts.push(secPart);
  parts.push(canonicalField(p.minutes, 0, 59));
  parts.push(canonicalField(p.hours, 0, 23));
  parts.push(canonicalField(p.dayOfMonth, 1, 31));
  parts.push(canonicalField(p.month, 1, 12));
  parts.push(canonicalField(p.dayOfWeek, 0, 6));
  return parts.join(' ');
}

function isFullRange(arr, min, max) {
  return Array.isArray(arr) && arr.length === (max - min + 1) && arr[0] === min && arr[arr.length-1] === max;
}

/**
 * matches(expressionOrParsed, date) -> boolean
 * Date must match schedule in local time. If seconds are not present in schedule, seconds are ignored.
 * Day-of-month and day-of-week follow cron semantics: if either field is restricted (not *), a match occurs when either matches; if both are * then always match.
 */
function matches(expressionOrParsed, date) {
  if (!(date instanceof Date)) throw new TypeError('date must be a Date');
  const parsed = typeof expressionOrParsed === 'string' ? parseCron(expressionOrParsed) : normalizeParsed(expressionOrParsed);
  const s = parsed.hasSeconds ? date.getSeconds() : undefined;
  const m = date.getMinutes();
  const h = date.getHours();
  const dom = date.getDate();
  const mon = date.getMonth() + 1;
  const dow = date.getDay();

  if (parsed.hasSeconds) {
    if (!parsed.seconds.includes(s)) return false;
  }
  if (!parsed.minutes.includes(m)) return false;
  if (!parsed.hours.includes(h)) return false;
  if (!parsed.month.includes(mon)) return false;

  const domIsAny = isFullRange(parsed.dayOfMonth, 1, 31);
  const dowIsAny = isFullRange(parsed.dayOfWeek, 0, 6);

  if (domIsAny && dowIsAny) return true;
  const domMatches = parsed.dayOfMonth.includes(dom);
  const dowMatches = parsed.dayOfWeek.includes(dow);
  if (!domIsAny && !dowIsAny) {
    // either field matching is sufficient
    return domMatches || dowMatches;
  }
  if (!domIsAny) return domMatches;
  return dowMatches;
}

/**
 * nextRun(expressionOrParsed, after?) -> Date
 * Finds the next Date strictly after 'after' (defaults to now) that matches the schedule.
 * Uses local time arithmetic and a bounded search (default horizon 5 years).
 */
function nextRun(expressionOrParsed, after = new Date()) {
  const parsed = typeof expressionOrParsed === 'string' ? parseCron(expressionOrParsed) : normalizeParsed(expressionOrParsed);
  if (!(after instanceof Date)) throw new TypeError('after must be a Date');
  // Start strictly after 'after'
  const hasSeconds = !!parsed.hasSeconds;
  const stepSec = hasSeconds ? 1 : 60; // step in seconds
  const startMs = after.getTime();
  const horizonYears = 5;
  const horizonMs = horizonYears * 365 * 24 * 3600 * 1000;
  const limit = startMs + horizonMs;

  // candidate starts at after + stepSec
  let candidate = new Date(startMs + stepSec*1000);

  while (candidate.getTime() <= limit) {
    // If candidate matches schedule, return
    try {
      if (matches(parsed, candidate)) return candidate;
    } catch (e) {
      // If invalid local time caused Date methods to misbehave, skip forward
    }
    // advance candidate by stepSec seconds
    candidate = new Date(candidate.getTime() + stepSec*1000);
  }
  throw new Error(`no run found within ${horizonYears} years for schedule '${parsed.string || parsed.original || ''}'`);
}

function nextRuns(expressionOrParsed, count, after = new Date()) {
  if (!Number.isInteger(count) || count <= 0) throw new TypeError('count must be a positive integer');
  const results = [];
  let anchor = new Date(after instanceof Date ? after.getTime() : new Date().getTime());
  for (let i = 0; i < count; i++) {
    const nxt = nextRun(expressionOrParsed, anchor);
    results.push(nxt);
    // set anchor to the found time so next search finds strictly later instants
    anchor = new Date(nxt.getTime());
  }
  return results;
}

// If module run directly, provide minimal CLI. Keep side-effects small.
if (new URL(import.meta.url).pathname === process.argv[1]) {
  // simple CLI dispatch
  const argv = process.argv.slice(2);
  (async () => {
    try {
      const cmd = argv[0];
      if (!cmd) throw new Error('command required: parse|next|next-n|matches|tostring');
      if (cmd === 'parse') {
        const expr = argv[1];
        console.log(JSON.stringify(parseCron(expr), null, 2));
        process.exit(0);
      }
      if (cmd === 'next') {
        const expr = argv[1];
        const afterArg = argv.find(a=>a.startsWith('--after='));
        const after = afterArg ? new Date(afterArg.split('=')[1]) : new Date();
        const d = nextRun(expr, after);
        console.log(d.toISOString());
        process.exit(0);
      }
      if (cmd === 'next-n') {
        const expr = argv[1];
        const cnt = Number(argv[2] || 1);
        const afterArg = argv.find(a=>a.startsWith('--after='));
        const after = afterArg ? new Date(afterArg.split('=')[1]) : new Date();
        const arr = nextRuns(expr, cnt, after);
        console.log(JSON.stringify(arr.map(d=>d.toISOString()), null, 2));
        process.exit(0);
      }
      if (cmd === 'matches') {
        const expr = argv[1];
        const iso = argv[2];
        const d = new Date(iso);
        console.log(matches(expr, d) ? 'true' : 'false');
        process.exit(0);
      }
      if (cmd === 'tostring') {
        const expr = argv[1];
        console.log(toString(expr));
        process.exit(0);
      }
      throw new Error(`unknown command '${cmd}'`);
    } catch (err) {
      console.error('Error:', err && err.message ? err.message : String(err));
      process.exit(2);
    }
  })();
}
