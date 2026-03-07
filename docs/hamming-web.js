// Browser-friendly implementations of the Hamming functions used on the demo page.
export function hammingDistance(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') {
    throw new TypeError('hammingDistance expects two strings');
  }
  const A = Array.from(a);
  const B = Array.from(b);
  if (A.length !== B.length) {
    throw new RangeError('Strings must have the same length');
  }
  let diff = 0;
  for (let i = 0; i < A.length; i++) {
    if (A[i] !== B[i]) diff++;
  }
  return diff;
}

export function hammingDistanceBits(x, y) {
  const isBigInt = (v) => typeof v === 'bigint';
  const isNumber = (v) => typeof v === 'number';

  if (!isBigInt(x) && !isNumber(x)) {
    throw new TypeError('hammingDistanceBits expects integer arguments (Number or BigInt)');
  }
  if (!isBigInt(y) && !isNumber(y)) {
    throw new TypeError('hammingDistanceBits expects integer arguments (Number or BigInt)');
  }

  if (isNumber(x) && (!Number.isInteger(x) || x < 0)) {
    throw new RangeError('hammingDistanceBits expects non-negative integers');
  }
  if (isNumber(y) && (!Number.isInteger(y) || y < 0)) {
    throw new RangeError('hammingDistanceBits expects non-negative integers');
  }
  if (isBigInt(x) && x < 0n) {
    throw new RangeError('hammingDistanceBits expects non-negative integers');
  }
  if (isBigInt(y) && y < 0n) {
    throw new RangeError('hammingDistanceBits expects non-negative integers');
  }

  const bx = isBigInt(x) ? x : BigInt(x);
  const by = isBigInt(y) ? y : BigInt(y);
  let v = bx ^ by;
  let count = 0;
  while (v) {
    count += Number(v & 1n);
    v = v >> 1n;
  }
  return count;
}
