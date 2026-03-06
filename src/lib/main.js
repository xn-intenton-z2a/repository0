#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Compact cron engine implementing parseCron, nextRun, nextRuns, matches, toString
// All times are computed in UTC for determinism in library functions; CLI prints ISO strings (local offset if desired).

export { parseCron, nextRun, nextRuns, matches, toString, main };

export function main(argv = process.argv.slice(2)) {
  // Minimal main used by tests; when invoked as CLI actual runner prints next runs.
  // Keep this side-effect free for tests.
  return { argv };
}

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

function parseInteger(str, label) {
  if (str === undefined || str === null) throw new Error(`${label} missing`);
  if (!/^\d+$/.test(str)) throw new Error(`${label} '${str}' is not a valid integer`);
  return Number(str);
}

function parseField(fieldStr, min, max, fieldName) {
  if (!fieldStr || fieldStr.length === 0) throw new Error(`${fieldName} empty`);
  const parts = fieldStr.split(',').map(s => s.trim()).filter(Boolean);
  const vals = new Set();
  for (const part of parts) {
    const [base, stepPart] = part.split('/');
    const step = stepPart === undefined ? 1 : parseInteger(stepPart, `${fieldName} step`);
    if (step <= 0) throw new Error(`${fieldName} step must be a positive integer`);
    if (base === '*') {
      for (let v = min; v <= max; v += step) vals.add(v);
      continue;
    }
    if (base.includes('-')) {
      const [aStr, bStr] = base.split('-');
      const a = parseInteger(aStr, `${fieldName} range start`);
      const b = parseInteger(bStr, `${fieldName} range end`);
      if (a > b) throw new Error(`${fieldName} range start ${a} greater than end ${b}`);
      if (a < min || b > max) throw new Error(`${fieldName} range ${a}-${b} out of bounds ${min}-${max}`);
      for (let v = a; v <= b; v += step) vals.add(v);
      continue;
    }
    const n = parseInteger(base, `${fieldName} value`);
    if (n < min || n > max) throw new Error(`${fieldName} value ${n} out of range ${min}..${max}`);
    if (step !== 1) {
      for (let v = n; v <= max; v += step) vals.add(v);
    } else {
      vals.add(n);
    }
  }
  return Array.from(vals).sort((a, b) => a - b);
}

function normalizeParsed(p) {
  // ensure arrays and hasSeconds flag
  const parsed = { original: p.original || p.string || '', hasSeconds: !!p.hasSeconds };
  parsed.seconds = p.seconds ? Array.from(new Set(p.seconds)).sort((a,b)=>a-b) : undefined;
  parsed.minutes = Array.from(new Set(p.minutes)).sort((a,b)=>a-b);
  parsed.hours = Array.from(new Set(p.hours)).sort((a,b)=>a-b);
  parsed.dayOfMonth = Array.from(new Set(p.dayOfMonth)).sort((a,b)=>a-b);
  parsed.month = Array.from(new Set(p.month)).sort((a,b)=>a-b);
  // normalize dayOfWeek mapping 7->0
  parsed.dayOfWeek = Array.from(new Set((p.dayOfWeek||[]).map(d => d === 7 ? 0 : d))).sort((a,b)=>a-b);
  return parsed;
}

function parseCron(expr) {
  if (typeof expr !== 'string') throw new TypeError('expression must be a string');
  let s = expandSpecial(expr);
  const fields = s.split(/\s+/).filter(Boolean);
  let hasSeconds = false;
  if (fields.length === 6) hasSeconds = true;
  else if (fields.length === 5) hasSeconds = false;
  else throw new Error(`expected 5 fields`);

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
    hasSeconds,
    seconds: hasSeconds ? sec : undefined,
    minutes: min,
    hours: hour,
    dayOfMonth: dom,
    month: mon,
    dayOfWeek: dow
  };
  const norm = normalizeParsed(parsed);
  // provide backward-compatible singular property names used by older tests
  norm.minute = norm.minutes;
  norm.hour = norm.hours;
  norm.month = norm.months || norm.month;
  norm.dayOfWeek = norm.dayOfWeek;
  norm.dayOfMonth = norm.dayOfMonth;
  norm.seconds = norm.seconds;
  return norm;
}

function toString(parsed) {
  const p = typeof parsed === 'string' ? parseCron(parsed) : normalizeParsed(parsed);
  const sec = p.hasSeconds ? (p.seconds || [0]).join(',') : null;
  const parts = [];
  if (p.hasSeconds) parts.push((p.seconds||[0]).join(','));
  parts.push((p.minutes||[0]).join(','));
  parts.push((p.hours||[0]).join(','));
  parts.push((p.dayOfMonth||[1]).join(','));
  parts.push((p.month||[1]).join(','));
  parts.push((p.dayOfWeek||[0]).join(','));
  return parts.join(' ');
}

// helpers for searching
function nextOrSame(sorted, val) {
  for (const v of sorted) if (v >= val) return {value: v, wrapped: false};
  return {value: sorted[0], wrapped: true};
}

function dateToComponentsUTC(d) {
  return {
    year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate(),
    hour: d.getUTCHours(), minute: d.getUTCMinutes(), second: d.getUTCSeconds()
  };
}

function componentsToDateUTC(year, month, day, hour, minute, second) {
  // month 1-12 to Date month index
  const dt = new Date(Date.UTC(year, month - 1, day, hour, minute, second, 0));
  return dt;
}

function monthDaysUTC(year, month) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate(); // day 0 of next month
}

function matchesParsed(parsed, date) {
  const c = dateToComponentsUTC(date);
  if (!parsed.month.includes(c.month)) return false;
  if (!parsed.hours.includes(c.hour)) return false;
  if (!parsed.minutes.includes(c.minute)) return false;
  if (parsed.hasSeconds) {
    if (!parsed.seconds.includes(c.second)) return false;
  }
  const domMatch = parsed.dayOfMonth.includes(c.day);
  const dow = new Date(Date.UTC(c.year, c.month -1, c.day)).getUTCDay();
  const dowMatch = parsed.dayOfWeek.includes(dow);
  // cron semantics: day-of-month OR day-of-week
  return domMatch || dowMatch;
}

function nextRun(exprOrParsed, after) {
  const parsed = typeof exprOrParsed === 'string' ? parseCron(exprOrParsed) : normalizeParsed(exprOrParsed);
  const start = after ? new Date(after) : new Date();
  if (Number.isNaN(start.getTime())) throw new Error('invalid after date');
  // strict > start
  // start point is start + 1sec if hasSeconds else start + 60sec
  let cursorMs = start.getTime();
  cursorMs += parsed.hasSeconds ? 1000 : 60000;
  let cursor = new Date(cursorMs);

  const limitYear = start.getUTCFullYear() + 6; // search up to 5 years ahead
  while (cursor.getUTCFullYear() <= limitYear) {
    const c = dateToComponentsUTC(cursor);
    // month
    const monNext = nextOrSame(parsed.month, c.month);
    let year = c.year;
    let month = monNext.value;
    if (monNext.wrapped) {
      year += 1;
    }
    // find day in month that satisfies dom OR dow, starting from current day if same month/year
    const daysInMonth = monthDaysUTC(year, month);
    let dayStart = 1;
    if (year === c.year && month === c.month) dayStart = c.day;

    let foundDay = null;
    for (let d = dayStart; d <= daysInMonth; d++) {
      const domMatch = parsed.dayOfMonth.includes(d);
      const dow = new Date(Date.UTC(year, month -1, d)).getUTCDay();
      const dowMatch = parsed.dayOfWeek.includes(dow);
      if (domMatch || dowMatch) {
        foundDay = d; break;
      }
    }
    if (!foundDay) {
      // advance to next allowed month
      cursor = componentsToDateUTC(year, month % 12 + 1, 1, 0, 0, 0);
      continue;
    }
    // hours
    let hourStart = 0;
    if (year === c.year && month === c.month && foundDay === c.day) hourStart = c.hour;
    const hourNext = nextOrSame(parsed.hours, hourStart);
    let hour = hourNext.value;
    if (hourNext.wrapped && hourStart > hour) {
      // need to advance day
      const nextDay = foundDay + 1;
      cursor = componentsToDateUTC(year, month, nextDay, 0, 0, 0);
      continue;
    }
    // minutes
    let minuteStart = 0;
    if (year === c.year && month === c.month && foundDay === c.day && hour === c.hour) minuteStart = c.minute;
    const minNext = nextOrSame(parsed.minutes, minuteStart);
    let minute = minNext.value;
    if (minNext.wrapped && minuteStart > minute) {
      // advance hour
      cursor = componentsToDateUTC(year, month, foundDay, hour + 1, 0, 0);
      continue;
    }
    // seconds
    let second = 0;
    if (parsed.hasSeconds) {
      let secondStart = 0;
      if (year === c.year && month === c.month && foundDay === c.day && hour === c.hour && minute === c.minute) secondStart = c.second;
      const secNext = nextOrSame(parsed.seconds, secondStart);
      second = secNext.value;
      if (secNext.wrapped && secondStart > second) {
        // advance minute
        cursor = componentsToDateUTC(year, month, foundDay, hour, minute + 1, 0);
        continue;
      }
    } else {
      second = 0;
      if (!(year === c.year && month === c.month && foundDay === c.day && hour === c.hour && minute >= c.minute)) {
        // it's OK
      }
    }
    const candidate = componentsToDateUTC(year, month, foundDay, hour, minute, second);
    if (candidate.getTime() > start.getTime()) {
      // final check: matchesParsed
      if (matchesParsed(parsed, candidate)) return candidate;
      // else advance
      cursor = new Date(candidate.getTime() + (parsed.hasSeconds ? 1000 : 60000));
      continue;
    }
    // otherwise advance cursor
    cursor = new Date(candidate.getTime() + (parsed.hasSeconds ? 1000 : 60000));
  }
  throw new Error('no run found within 5 years');
}

function nextRuns(exprOrParsed, count, after) {
  if (!Number.isInteger(count) || count <= 0) throw new Error('count must be positive integer');
  const runs = [];
  let afterDate = after ? new Date(after) : new Date();
  for (let i = 0; i < count; i++) {
    const nr = nextRun(exprOrParsed, afterDate);
    runs.push(nr);
    afterDate = nr;
  }
  return runs;
}

function matches(exprOrParsed, date) {
  if (!(date instanceof Date)) date = new Date(date);
  if (Number.isNaN(date.getTime())) throw new Error('invalid date');
  const parsed = typeof exprOrParsed === 'string' ? parseCron(exprOrParsed) : normalizeParsed(exprOrParsed);
  return matchesParsed(parsed, date);
}

// CLI
if (process.argv[1] && process.argv[1].endsWith('/src/lib/main.js') || process.argv[1] === undefined) {
  // allow running as node src/lib/main.js
  if (import.meta.url && process.argv[1] !== undefined && process.argv[1] !== '' && !process.env._COPILOT_CLI_NO_RUN) {
    // proceed only when directly executed
  }
}

if (process.argv[1] === process.argv[1] /* trivial to appease bundlers */ && process.argv[1] && process.argv[1].endsWith('/src/lib/main.js') ) {
  // not reliable in some bundles; provide a lightweight CLI when invoked directly
  // simple parse: node src/lib/main.js "expr" [--count N] [--after ISO]
  (async () => {
    try {
      const args = process.argv.slice(2);
      if (args.length === 0) return;
      let expr = args[0];
      let count = 1;
      let after;
      for (let i = 1; i < args.length; i++) {
        if (args[i] === '--count' && args[i+1]) { count = Number(args[i+1]); i++; }
        else if (args[i] === '--after' && args[i+1]) { after = new Date(args[i+1]); i++; }
      }
      const runs = nextRuns(expr, count, after);
      for (const r of runs) console.log(r.toISOString());
      process.exit(0);
    } catch (err) {
      console.error(err && err.message ? err.message : String(err));
      process.exit(1);
    }
  })();
}
