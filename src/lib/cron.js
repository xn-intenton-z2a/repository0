// SPDX-License-Identifier: MIT
// src/lib/cron.js

export function parseCron(expression) {
  if (typeof expression !== 'string') {
    throw new TypeError('expression must be a string');
  }
  const fields = expression.trim().split(/\s+/);
  if (fields.length !== 5) {
    throw new Error(`expected 5 fields in cron expression, got ${fields.length}`);
  }

  const defs = [
    { key: 'minute', min: 0, max: 59 },
    { key: 'hour', min: 0, max: 23 },
    { key: 'dayOfMonth', min: 1, max: 31 },
    { key: 'month', min: 1, max: 12 },
    { key: 'dayOfWeek', min: 0, max: 6 }
  ];

  const result = {};
  for (let i = 0; i < defs.length; i++) {
    const def = defs[i];
    result[def.key] = parseField(fields[i], def.min, def.max, def.key);
  }
  return result;
}

function parseField(fieldStr, min, max, fieldName) {
  if (!fieldStr || fieldStr.length === 0) {
    throw new Error(`${fieldName} empty`);
  }
  const parts = fieldStr.split(',').map(s => s.trim()).filter(Boolean);
  const values = new Set();

  for (const part of parts) {
    // Handle step
    const [base, stepPart] = part.split('/');
    const step = stepPart === undefined ? 1 : parseInteger(stepPart, `${fieldName} step`);
    if (step <= 0 || !Number.isFinite(step)) {
      throw new Error(`${fieldName} step must be a positive integer`);
    }

    if (base === '*') {
      pushRange(values, min, max, step, min, max, fieldName);
      continue;
    }

    if (base.includes('-')) {
      const [aStr, bStr] = base.split('-');
      const a = parseInteger(aStr, `${fieldName} range start`);
      const b = parseInteger(bStr, `${fieldName} range end`);
      if (a > b) throw new Error(`${fieldName} range start ${a} greater than end ${b}`);
      if (a < min || b > max) throw new Error(`${fieldName} range ${a}-${b} out of bounds ${min}-${max}`);
      pushRange(values, a, b, step, min, max, fieldName);
      continue;
    }

    // Single number
    const n = parseInteger(base, `${fieldName} value`);
    if (n < min || n > max) throw new Error(`${fieldName} value ${n} out of range ${min}-${max}`);
    if (step !== 1) {
      // if a single value with a step like "5/2" treat as starting at that value and stepping within range
      pushRange(values, n, max, step, min, max, fieldName);
    } else {
      values.add(n);
    }
  }

  return Array.from(values).sort((a, b) => a - b);
}

function pushRange(set, start, end, step, min, max, fieldName) {
  if (!Number.isInteger(start) || !Number.isInteger(end)) {
    throw new Error(`${fieldName} range bounds must be integers`);
  }
  if (start < min || end > max) {
    throw new Error(`${fieldName} range ${start}-${end} out of bounds ${min}-${max}`);
  }
  for (let v = start; v <= end; v += step) {
    set.add(v);
  }
}

function parseInteger(str, label) {
  if (str === undefined || str === null) throw new Error(`${label} missing`);
  if (!/^\d+$/.test(str)) throw new Error(`${label} '${str}' is not a valid integer`);
  const n = Number(str);
  if (!Number.isFinite(n)) throw new Error(`${label} '${str}' is not a finite number`);
  return n;
}
