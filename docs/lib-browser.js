// Browser-compatible shim for roman conversion used by the demo page
export function toRoman(n) {
  if (typeof n !== 'number' || !Number.isFinite(n) || Math.floor(n) !== n) {
    throw new TypeError('toRoman: input must be an integer');
  }
  if (n < 1 || n > 3999) {
    throw new RangeError('toRoman: input must be in range 1..3999');
  }
  const map = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
  ];
  let result = '';
  let remaining = n;
  for (const [value, numeral] of map) {
    while (remaining >= value) {
      result += numeral;
      remaining -= value;
    }
  }
  return result;
}

export function fromRoman(s) {
  if (typeof s !== 'string') {
    throw new TypeError('fromRoman: input must be a string');
  }
  if (s.length === 0) {
    throw new SyntaxError('fromRoman: empty string');
  }
  if (s !== s.toUpperCase()) {
    throw new SyntaxError('fromRoman: only uppercase canonical forms accepted');
  }
  if (!/^[IVXLCDM]+$/.test(s)) {
    throw new SyntaxError('fromRoman: invalid characters');
  }
  const canonical = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;
  if (!canonical.test(s)) {
    throw new SyntaxError('fromRoman: non-canonical form');
  }
  const numerals = {I:1,V:5,X:10,L:50,C:100,D:500,M:1000};
  let total = 0;
  for (let i=0;i<s.length;i++){
    const val = numerals[s[i]];
    const next = numerals[s[i+1]]||0;
    if (val < next) { total += next - val; i++; } else { total += val; }
  }
  return total;
}
