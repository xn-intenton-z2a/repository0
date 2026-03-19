# SVG Plot Renderer

Render data series to valid SVG 1.1 format using polyline elements and viewBox coordinate mapping.

## SVG Structure

Generate complete SVG documents with XML declaration, namespace, dimensions, and viewBox. Use polyline elements with points attribute containing coordinate pairs. Include proper fill and stroke styling.

## Coordinate Transformation

Transform mathematical coordinate space to SVG coordinate space. Handle Y-axis inversion (SVG Y increases downward). Map data range to viewBox dimensions with appropriate scaling and margins.

## Styling

Apply default styling with no fill, blue stroke, and appropriate stroke width. Support customizable colors and line styles through options parameter.

## API Design

```javascript
export function renderSVG(dataPoints, options = {}) {
  // Returns SVG string
}

export function transformCoordinates(points, bounds, svgWidth, svgHeight) {
  // Returns transformed points for SVG space
}
```

## Acceptance Criteria

- Generate valid SVG 1.1 with XML declaration
- Include viewBox attribute for coordinate mapping
- Use polyline elements with points attribute
- Transform mathematical coordinates to SVG space
- Handle Y-axis inversion correctly
- Apply appropriate margins and scaling
- Support customizable dimensions and colors
- Produce clean, readable SVG markup