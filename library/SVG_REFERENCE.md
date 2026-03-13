# SVG_REFERENCE

## Table of Contents

- SVG Elements for Graphics Construction
- SVG Attributes and Properties
- Coordinate System and Positioning  
- Basic Shapes and Path Operations
- Text Rendering and Styling
- Transformations and Grouping
- Embedding SVG in Web Pages
- JavaScript DOM Interface

## SVG Elements for Graphics Construction

### Basic Shape Elements
- line: Creates straight lines between two points
- rect: Draws rectangles with optional rounded corners
- circle: Renders circles with center point and radius
- ellipse: Creates elliptical shapes with separate x and y radii
- path: Defines complex shapes using moveTo, lineTo, and curve commands
- image: Embeds raster images within SVG content
- text: Renders text content with positioning and styling

### Container Elements  
- svg: Root container element defining coordinate system
- g: Groups elements for collective transformations and styling
- defs: Contains reusable definitions for gradients, patterns, and symbols
- use: References and reuses defined elements
- symbol: Creates reusable graphic components

## SVG Attributes and Properties

### Positioning Attributes
- x, y: Coordinate positioning for elements
- cx, cy: Center coordinates for circles and ellipses
- r: Radius for circular elements
- rx, ry: Radii for elliptical elements and rounded rectangles
- width, height: Dimensional attributes for rectangles and viewports

### Styling Attributes
- fill: Interior color or pattern for shapes
- stroke: Outline color for shape borders
- stroke-width: Thickness of shape outlines
- opacity: Transparency level from 0 to 1
- fill-opacity: Transparency specific to fill color
- stroke-opacity: Transparency specific to stroke color

## Coordinate System and Positioning

SVG uses a coordinate system with origin (0,0) at top-left corner. Units can be specified or default to user units. The viewBox attribute defines the coordinate system mapping to the SVG viewport.

### Viewport and ViewBox
- viewport: Physical dimensions of the SVG container
- viewBox: Logical coordinate system mapped to viewport
- preserveAspectRatio: Controls scaling behavior

## Basic Shapes and Path Operations

### Path Data Commands
- M (moveTo): Moves drawing cursor to specified point
- L (lineTo): Draws straight line to specified point  
- Q (quadraticBezier): Creates quadratic Bézier curves
- C (cubicBezier): Creates cubic Bézier curves with two control points
- A (ellipticalArc): Creates elliptical arc segments
- Z (closePath): Closes current path by drawing line to start point

### Path Syntax
Paths use single-letter commands followed by coordinate parameters. Uppercase commands use absolute coordinates while lowercase commands use relative coordinates.

## Text Rendering and Styling

### Text Elements
- text: Basic text rendering with positioning
- tspan: Inline text spans with independent styling
- textPath: Text following curved path shapes

### Text Attributes
- font-family: Typeface selection
- font-size: Text size specification  
- text-anchor: Horizontal alignment (start, middle, end)
- dominant-baseline: Vertical alignment control

## Transformations and Grouping

### Transform Operations
- translate(x, y): Position offset transformation
- rotate(angle, cx, cy): Rotation around specified center point
- scale(sx, sy): Size scaling with separate x and y factors
- skewX(angle), skewY(angle): Shearing transformations
- matrix(a, b, c, d, e, f): Direct matrix transformation

### Grouping Benefits
- Collective transformations applied to group contents
- Shared styling attributes inherited by group members
- Logical organization of related graphic elements

## Embedding SVG in Web Pages

### Integration Methods
- Inline SVG: Direct embedding in HTML documents
- Object element: External SVG file reference
- Img element: SVG as static image content
- Background images: SVG in CSS background properties
- Iframe embedding: Isolated SVG document contexts

### HTML Integration
SVG can be combined with HTML for interactive web graphics. CSS styling applies to SVG elements, and JavaScript can manipulate SVG DOM elements.

## JavaScript DOM Interface

### Element Manipulation
- createElementNS(): Creates SVG elements with proper namespace
- getAttribute() / setAttribute(): Reads and modifies element attributes  
- appendChild(): Adds elements to SVG containers
- getElementById(): Locates elements by ID attribute

### Event Handling
- Mouse events: click, mouseover, mouseout, mousemove
- Touch events for mobile device interaction
- Custom event handling for interactive graphics

## Supplementary Details

SVG supports advanced features including gradients, patterns, masks, filters, and animations through SMIL or JavaScript. The format is XML-based, making it compatible with standard XML processing tools and libraries.

## Reference Details

### SVG Namespace
SVG elements must be created with proper namespace:
xmlns="http://www.w3.org/2000/svg"

### Element Creation Pattern
```javascript
const element = document.createElementNS('http://www.w3.org/2000/svg', 'elementName');
element.setAttribute('attribute', 'value');
parentElement.appendChild(element);
```

### Coordinate Precision
SVG coordinates accept floating-point values for sub-pixel precision. Coordinate values can include units (px, em, %, etc.) or default to user units.

### Browser Compatibility
Modern browsers provide comprehensive SVG support. Internet Explorer 11+ includes full SVG 1.1 support. Mobile browsers support touch events on SVG elements.

### Performance Considerations
- Vector graphics scale without quality loss
- Complex paths may impact rendering performance
- GPU acceleration available for transforms and animations
- DOM manipulation costs apply to dynamic SVG modifications

## Detailed Digest

**Source Content:** Mozilla Developer Network SVG documentation (https://developer.mozilla.org/en-US/docs/Web/SVG) and W3C SVG Primer (https://www.w3.org/Graphics/SVG/IG/resources/svgprimer.html)
**Retrieved:** 2026-03-13  
**Attribution:** Mozilla Developer Network and W3C SVG Interest Group
**Data Size:** Approximately 4KB extracted content

SVG (Scalable Vector Graphics) provides XML-based vector graphics for web applications with comprehensive element types, styling capabilities, coordinate systems, and JavaScript integration for dynamic and interactive graphics creation.