// Browser-friendly demo copy of the library functions for the website
export function hammingDistance(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') {
    throw new TypeError('hammingDistance expects two strings');
  }
  const pa = Array.from(a);
  const pb = Array.from(b);
  if (pa.length !== pb.length) {
    throw new RangeError('Strings must have the same length (in code points)');
  }
  let diff = 0;
  for (let i = 0; i < pa.length; i++) {
    if (pa[i] !== pb[i]) diff++;
  }
  return diff;
}

export function hammingDistanceBits(x, y) {
  const isNumber = (v) => typeof v === 'number';
  const isBigInt = (v) => typeof v === 'bigint';

  if (!(isNumber(x) || isBigInt(x)) || !(isNumber(y) || isBigInt(y))) {
    throw new TypeError('hammingDistanceBits expects integer (Number or BigInt) arguments');
  }

  if (isNumber(x)) {
    if (!Number.isInteger(x)) throw new TypeError('Number arguments must be integers');
    if (x < 0) throw new RangeError('Arguments must be non-negative');
  }
  if (isNumber(y)) {
    if (!Number.isInteger(y)) throw new TypeError('Number arguments must be integers');
    if (y < 0) throw new RangeError('Arguments must be non-negative');
  }
  if (isBigInt(x) && x < 0n) throw new RangeError('Arguments must be non-negative');
  if (isBigInt(y) && y < 0n) throw new RangeError('Arguments must be non-negative');

  let bx = isBigInt(x) ? x : BigInt(x);
  let by = isBigInt(y) ? y : BigInt(y);

  let xor = bx ^ by;
  let count = 0;
  while (xor) {
    xor &= xor - 1n;
    count++;
  }
  return count;
}

export function demoResults() {
  return {
    example1: { a: 'karolin', b: 'kathrin', distance: hammingDistance('karolin', 'kathrin') },
    example2: { a: '', b: '', distance: hammingDistance('', '') },
    bits1: { x: 1, y: 4, distance: hammingDistanceBits(1, 4) },
    bits2: { x: 0, y: 0, distance: hammingDistanceBits(0, 0) }
  };
}
