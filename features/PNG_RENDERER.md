# PNG Plot Renderer

Render data series to PNG format using Canvas API or SVG conversion for raster output.

## Rendering Approach

Use HTML5 Canvas API in Node.js environment via canvas package. Alternatively, generate SVG first and convert to PNG using sharp or similar library. Document the chosen approach in README.

## Canvas Implementation

Create canvas context with appropriate dimensions. Draw coordinate system and data lines using canvas drawing methods. Apply antialiasing for smooth line rendering.

## Color and Styling

Support customizable background colors, line colors, and line widths. Apply default styling consistent with SVG renderer. Handle transparency and alpha channels properly.

## API Design

```javascript
export function renderPNG(dataPoints, options = {}) {
  // Returns PNG Buffer
}

export function savePNG(buffer, filePath) {
  // Saves PNG buffer to file
}
```

## Dependencies

Add canvas or sharp dependency to package.json for PNG rendering capability. Document installation requirements for native dependencies.

## Acceptance Criteria

- Generate PNG files with magic bytes header
- Support customizable dimensions (width x height)
- Render clean antialiased lines
- Handle coordinate transformation like SVG renderer
- Support background and line color customization
- Work in Node.js CLI environment
- Document PNG rendering approach in README
- Add appropriate dependencies to package.json