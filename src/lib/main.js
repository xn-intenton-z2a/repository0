#!/usr/bin/env node
/* src/lib/main.js
 * Roman numerals library with strict and permissive parsing and a small CLI.
 */

/**
 * Convert integer to Roman numeral (canonical uppercase, subtractive notation)
 * @param {number} n - integer in [1,3999]
 * @returns {string}
 * @throws {TypeError} if n is not a number or not integer
 * @throws {RangeError} if n < 1 or n > 3999
 */
export function toRoman(n) {
  if (typeof n !== 'number' || Number.isNaN(n)) throw new TypeError('toRoman expects a number')
  if (!Number.isInteger(n)) throw new TypeError('toRoman expects an integer')
  if (n < 1 || n > 3999) throw new RangeError('toRoman accepts only integers from 1 to 3999')
  const pairs = [
    [1000, 'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']
  ]
  let res = ''
  let remaining = n
  for (const [val, sym] of pairs) {
    while (remaining >= val) {
      res += sym
      remaining -= val
    }
  }
  return res
}

/**
 * Parse a Roman numeral string, either strict (canonical only) or permissive.
 * In permissive mode common non-canonical forms are accepted and canonicalized.
 * @param {string} s
 * @param {{strict:boolean}} options
 * @returns {{valid:boolean,value:number,canonical:string}}
 * @throws {TypeError} when s is not a string
 * @throws {SyntaxError} in strict mode when s is invalid or non-canonical
 */
export function parseRoman(s, { strict = true } = {}) {
  if (typeof s !== 'string') throw new TypeError('parseRoman expects a string')
  // Normalize for permissive parsing
  const raw = s
  const collapsed = s.replace(/\s+/g, '') // remove whitespace permissively
  if (collapsed.length === 0) {
    if (strict) throw new SyntaxError('Empty roman numeral')
    return { valid: false, value: NaN, canonical: '' }
  }
  const up = collapsed.toUpperCase()
  const map = {I:1,V:5,X:10,L:50,C:100,D:500,M:1000}
  // Basic permissive validator: accept only these letters
  for (const ch of up) if (!map[ch]) {
    if (strict) throw new SyntaxError('Invalid characters in roman numeral')
    return { valid: false, value: NaN, canonical: '' }
  }
  // Convert permissively to numeric by scanning left-to-right with subtractive logic
  let total = 0
  for (let i = 0; i < up.length; i++) {
    const v = map[up[i]]
    const next = map[up[i+1]] || 0
    if (next > v) {
      total += next - v
      i++
    } else total += v
  }
  // produce canonical string from numeric value if in range
  if (!Number.isFinite(total) || total < 1 || total > 3999) {
    if (strict) throw new SyntaxError('Roman numeral out of range or invalid')
    return { valid: false, value: NaN, canonical: '' }
  }
  const canonical = toRoman(total)
  // In strict mode ensure original matches canonical exactly (no lowercase, no spaces, canonical form)
  if (strict) {
    if (up !== canonical) throw new SyntaxError('Non-canonical roman numeral')
    return { valid: true, value: total, canonical }
  }
  // permissive: return best-effort
  return { valid: true, value: total, canonical }
}

/**
 * Convert from Roman numeral to integer.
 * Calls parseRoman and by default runs in strict mode.
 * @param {string} s
 * @param {{strict?:boolean}} opts
 * @returns {number}
 * @throws {TypeError} when input type wrong
 * @throws {SyntaxError} when invalid in strict mode
 */
export function fromRoman(s, { strict = true } = {}) {
  const parsed = parseRoman(s, { strict })
  if (!parsed || !parsed.valid) {
    // parseRoman throws in strict mode; permissive returns valid:false
    throw new SyntaxError('Invalid roman numeral')
  }
  return parsed.value
}

export const name = 'roman-numerals'
export const version = '0.1.0'
export const description = 'Convert between integers and Roman numerals (strict & permissive)'
export function getIdentity() { return { name, version, description } }

// Minimal CLI behind main guard
function printHelp() {
  console.log('Usage: node src/lib/main.js [options] <value>')
  console.log('Options:')
  console.log('  -t, --to-roman       treat input as number and output Roman (or inferred)')
  console.log('  -f, --from-roman     treat input as Roman and output number')
  console.log('  --strict             strict parsing (default)')
  console.log('  --permissive         permissive parsing')
  console.log('  --help               show this help')
  console.log('\nExamples:')
  console.log('  node src/lib/main.js -t 9       => IX')
  console.log('  node src/lib/main.js -f IX      => 9')
}

function runCli(argv = process.argv.slice(2)) {
  if (argv.length === 0) { printHelp(); process.exit(0) }
  let mode = 'infer'
  let strict = true
  const args = []
  for (const a of argv) {
    if (a === '-t' || a === '--to-roman') mode = 'to'
    else if (a === '-f' || a === '--from-roman') mode = 'from'
    else if (a === '--strict') strict = true
    else if (a === '--permissive') strict = false
    else if (a === '--help') { printHelp(); process.exit(0) }
    else args.push(a)
  }
  if (args.length === 0) { console.error('No value provided'); process.exit(2) }
  const val = args.join(' ')
  try {
    if (mode === 'to' || (mode === 'infer' && /^\d+$/.test(val.trim()))) {
      // numeric to Roman
      const n = Number(val)
      const out = toRoman(n)
      process.stdout.write(out + '\n')
      process.exit(0)
    } else {
      // roman to number
      const out = fromRoman(val, { strict })
      process.stdout.write(String(out) + '\n')
      process.exit(0)
    }
  } catch (err) {
    // deterministic exit codes: 2 for user/parse errors, 1 for unexpected
    if (err instanceof TypeError || err instanceof SyntaxError || err instanceof RangeError) {
      console.error(err.message)
      process.exit(2)
    }
    console.error('Unexpected error')
    process.exit(1)
  }
}

if (typeof process !== 'undefined' && process.argv && process.argv[1] && process.argv[1].endsWith('src/lib/main.js') && (process.argv[0].endsWith('node') || process.execPath)) {
  runCli()
}
