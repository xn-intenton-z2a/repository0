# Canvas API for PNG Rendering

## Table of Contents

1. Canvas Element and Context
2. Drawing Methods for Plotting
3. Image Data and PNG Export  
4. Node.js Canvas Implementation
5. Path Drawing for Line Plots

## Canvas Element and Context

### Canvas Creation

Browser environment:
const canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 600;
const ctx = canvas.getContext('2d');

Node.js environment (with node-canvas):
const { createCanvas } = require('canvas');
const canvas = createCanvas(800, 600);
const ctx = canvas.getContext('2d');

### Context Configuration

Set up drawing context for plotting:
ctx.strokeStyle = 'blue';
ctx.lineWidth = 2;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

## Drawing Methods for Plotting

### Path-Based Line Drawing

Begin new path for each data series:
ctx.beginPath();
ctx.moveTo(x1, y1);  // Move to first point
ctx.lineTo(x2, y2);  // Draw line to second point
ctx.lineTo(x3, y3);  // Continue line to third point
ctx.stroke();        // Render the path

### Coordinate System

Canvas coordinate system:
- Origin (0,0) at top-left
- X increases rightward  
- Y increases downward
- Requires Y-axis transformation for mathematical plots

Transform mathematical coordinates:
function transformToCanvas(mathX, mathY, domainX, rangeY, canvasWidth, canvasHeight) {
  const canvasX = ((mathX - domainX.min) / (domainX.max - domainX.min)) * canvasWidth;
  const canvasY = canvasHeight - ((mathY - rangeY.min) / (rangeY.max - rangeY.min)) * canvasHeight;
  return { x: canvasX, y: canvasY };
}

### Plotting Data Points

Plot array of {x, y} data points:
function plotDataSeries(ctx, dataPoints, domainX, rangeY, width, height) {
  if (dataPoints.length === 0) return;
  
  ctx.beginPath();
  const firstPoint = transformToCanvas(dataPoints[0].x, dataPoints[0].y, domainX, rangeY, width, height);
  ctx.moveTo(firstPoint.x, firstPoint.y);
  
  for (let i = 1; i < dataPoints.length; i++) {
    const point = transformToCanvas(dataPoints[i].x, dataPoints[i].y, domainX, rangeY, width, height);
    ctx.lineTo(point.x, point.y);
  }
  
  ctx.stroke();
}

## Image Data and PNG Export

### Canvas to PNG (Browser)

Convert canvas to blob:
canvas.toBlob((blob) => {
  // Handle PNG blob
}, 'image/png');

Convert canvas to data URL:
const dataURL = canvas.toDataURL('image/png');

### PNG Export (Node.js)

With node-canvas library:
const fs = require('fs');
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('output.png', buffer);

Stream output:
const out = fs.createWriteStream('output.png');
const stream = canvas.createPNGStream();
stream.pipe(out);

### PNG Magic Bytes

PNG files begin with 8-byte signature:
[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]

Verification:
function isPNG(buffer) {
  const signature = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
  return signature.every((byte, index) => buffer[index] === byte);
}

## Node.js Canvas Implementation

### Package Installation

npm install canvas

### Import and Setup

const { createCanvas, loadImage } = require('canvas');

### Canvas Factory Function

function createPlotCanvas(width, height) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Set default styles for plotting
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = 'blue';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  return { canvas, ctx };
}

### Font and Text Support

Text rendering for axis labels:
ctx.font = '14px Arial';
ctx.fillStyle = 'black';
ctx.textAlign = 'center';
ctx.fillText('X Axis Label', x, y);

## Path Drawing for Line Plots

### Multiple Data Series

Draw multiple series with different colors:
function plotMultipleSeries(ctx, seriesArray, domainX, rangeY, width, height) {
  const colors = ['blue', 'red', 'green', 'orange', 'purple'];
  
  seriesArray.forEach((series, index) => {
    ctx.strokeStyle = colors[index % colors.length];
    plotDataSeries(ctx, series.data, domainX, rangeY, width, height);
  });
}

### Performance Optimization

For large datasets:
- Use requestAnimationFrame for progressive rendering
- Implement data simplification algorithms
- Consider WebGL context for hardware acceleration
- Cache transformed coordinates

### Anti-aliasing Control

Control line smoothness:
ctx.imageSmoothingEnabled = true;  // Enable anti-aliasing
ctx.imageSmoothingQuality = 'high';

## Reference Details

### Canvas 2D Context Methods

Drawing paths:
beginPath(): void
moveTo(x: number, y: number): void  
lineTo(x: number, y: number): void
stroke(): void
fill(): void
closePath(): void

Styling:
strokeStyle: string | CanvasGradient | CanvasPattern
fillStyle: string | CanvasGradient | CanvasPattern
lineWidth: number
lineCap: "butt" | "round" | "square"
lineJoin: "bevel" | "round" | "miter"

### PNG Export Methods

Browser Canvas:
toDataURL(type?: string, quality?: number): string
toBlob(callback: BlobCallback, type?: string, quality?: number): void

Node Canvas:
toBuffer(mime?: string): Buffer
createPNGStream(): ReadableStream

### Canvas Creation Signatures

Browser:
document.createElement('canvas'): HTMLCanvasElement

Node.js (canvas package):
createCanvas(width: number, height: number): Canvas
createCanvas(width: number, height: number, type: 'pdf' | 'svg'): Canvas

## Detailed Digest

Technical specifications for HTML5 Canvas API extracted from MDN documentation, focusing on 2D drawing context methods for creating line plots. Canvas provides bitmap rendering capabilities essential for PNG output generation. The 2D context offers path-based drawing with styling options. Node.js canvas package provides server-side canvas implementation with PNG export capabilities. Content retrieved on 2026-03-19.

Attribution: Mozilla Developer Network, node-canvas maintainers
Data size: ~153KB HTML content