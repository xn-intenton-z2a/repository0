export const name = 'repo';
export const version = '0.1.0';
export const description = 'JavaScript library for Hamming distance functions';

export function getIdentity() { return { name, version, description }; }

export function hammingDistance(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') {
    throw new TypeError('Both arguments must be strings');
  }
  const aPoints = Array.from(a);
  const bPoints = Array.from(b);
  if (aPoints.length !== bPoints.length) {
    throw new RangeError('Strings must have equal length');
  }
  let distance = 0;
  for (let i = 0; i < aPoints.length; i++) {
    if (aPoints[i] !== bPoints[i]) distance++;
  }
  return distance;
}

export function hammingDistanceBits(x, y) {
  const isIntegerLike = (v) => (typeof v === 'number' && Number.isInteger(v)) || typeof v === 'bigint';
  if (!isIntegerLike(x) || !isIntegerLike(y)) {
    throw new TypeError('Both arguments must be integers (Number or BigInt)');
  }
  const bx = typeof x === 'bigint' ? x : BigInt(x);
  const by = typeof y === 'bigint' ? y : BigInt(y);
  if (bx < 0n || by < 0n) {
    throw new RangeError('Arguments must be non-negative');
  }
  let xor = bx ^ by;
  let distance = 0;
  while (xor) {
    distance += Number(xor & 1n);
    xor >>= 1n;
  }
  return distance;
}
