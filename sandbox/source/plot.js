// sandbox/source/plot.js

/**
 * Generates an SVG string representing a quadratic function y = ax^2 + bx + c.
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @param {object} [options]
 * @param {number} [options.width=200] - SVG width in pixels
 * @param {number} [options.height=100] - SVG height in pixels
 * @param {number} [options.xMin=-10] - Minimum x value
 * @param {number} [options.xMax=10] - Maximum x value
 * @returns {string} SVG markup
 */
export function plotQuadratic(a, b, c, options = {}) {
  const { width = 200, height = 100, xMin = -10, xMax = 10 } = options;
  const dx = (xMax - xMin) / width;
  const points = Array.from({ length: width + 1 }, (_, i) => {
    const x = xMin + i * dx;
    const y = a * x * x + b * x + c;
    return { x: i, y };
  });
  // Compute y range for scaling
  const ys = points.map(p => p.y);
  const yMin = Math.min(...ys);
  const yMax = Math.max(...ys);
  // Scale and invert y to SVG coordinate space
  const scaledPoints = points.map(p => {
    const scaledY = height - ((p.y - yMin) / (yMax - yMin || 1)) * height;
    return `${p.x},${scaledY}`;
  });
  const polylinePoints = scaledPoints.join(" ");
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><polyline points="${polylinePoints}" stroke="black" fill="none"/></svg>`;
}

/**
 * Generates an SVG string representing a sine wave y = amplitude * sin(frequency * x).
 * @param {number} amplitude
 * @param {number} frequency
 * @param {object} [options]
 * @param {number} [options.width=200] - SVG width in pixels
 * @param {number} [options.height=100] - SVG height in pixels
 * @param {number} [options.xMin=0] - Minimum x value
 * @param {number} [options.xMax=2 * Math.PI] - Maximum x value
 * @returns {string} SVG markup
 */
export function plotSine(amplitude, frequency, options = {}) {
  const { width = 200, height = 100, xMin = 0, xMax = 2 * Math.PI } = options;
  const dx = (xMax - xMin) / width;
  const points = Array.from({ length: width + 1 }, (_, i) => {
    const x = xMin + i * dx;
    const y = amplitude * Math.sin(frequency * x);
    return { x: i, y };
  });
  // Scale and invert y to SVG coordinate space (centered vertically)
  const scaledPoints = points.map(p => {
    const scaledY = height / 2 - (p.y / amplitude) * (height / 2);
    return `${p.x},${scaledY}`;
  });
  // Build path data
  const d = scaledPoints.map((pt, idx) => (idx === 0 ? `M${pt}` : `L${pt}`)).join(' ');
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><path d="${d}" stroke="blue" fill="none"/></svg>`;
}
