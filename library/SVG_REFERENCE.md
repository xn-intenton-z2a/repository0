# SVG_REFERENCE

## Table of Contents

- Scalable Vector Graphics Overview
- XML-Based Markup Structure
- Coordinate Systems and Viewports
- Basic Shape Elements
- Path Data and Complex Shapes
- Text and Typography
- Styling and CSS Integration
- Transformations and Animations
- Scripting and Interactivity
- SVG in Web Integration
- Browser Support and Standards

## Scalable Vector Graphics Overview

Scalable Vector Graphics (SVG) is a Web graphics language defined as markup and APIs for creating static or dynamic images, capable of interactivity and animation, including various graphical effects. SVG can be styled with CSS and combined with HTML.

### SVG Characteristics
- XML-based vector graphics format
- Scalable without quality loss
- Web standards compliant
- Interactive and animation capable
- CSS stylable elements
- JavaScript programmable

### Web Integration
SVG integrates seamlessly with HTML documents and can be embedded inline, referenced as images, or loaded dynamically through JavaScript.

## XML-Based Markup Structure

SVG documents follow XML syntax rules with a defined namespace and element hierarchy.

### Document Structure
```
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
  <!-- SVG content -->
</svg>
```

### Namespace Requirements
SVG elements must be properly namespaced when used in HTML documents or processed by XML parsers. The standard SVG namespace is "http://www.w3.org/2000/svg".

### Element Hierarchy
SVG documents support nested elements with proper parent-child relationships, enabling complex graphic compositions and logical grouping of related elements.

## Coordinate Systems and Viewports

SVG uses a coordinate system with the origin (0,0) typically at the top-left corner, with x increasing rightward and y increasing downward.

### Viewport Definition
The viewport defines the visible area of the SVG canvas, specified through width and height attributes on the root SVG element.

### viewBox Attribute
The viewBox attribute establishes a user coordinate system, enabling scaling and positioning control independent of the viewport dimensions.

### Coordinate Transformations
SVG supports coordinate system transformations including translation, rotation, scaling, and skewing through transform attributes.

## Basic Shape Elements

SVG provides primitive shape elements for common geometric forms.

### Rectangle Elements
- `<rect>` for rectangular shapes
- x, y attributes for positioning
- width, height for dimensions
- rx, ry for rounded corners

### Circle Elements
- `<circle>` for circular shapes
- cx, cy attributes for center positioning
- r attribute for radius

### Ellipse Elements
- `<ellipse>` for oval shapes
- cx, cy for center positioning
- rx, ry for horizontal and vertical radii

### Line Elements
- `<line>` for straight lines
- x1, y1 for start point
- x2, y2 for end point

### Polygon and Polyline
- `<polygon>` for closed shapes
- `<polyline>` for connected line segments
- points attribute for coordinate specification

## Path Data and Complex Shapes

The `<path>` element provides the most powerful shape creation capabilities through path data commands.

### Path Commands
- M (moveto) for positioning without drawing
- L (lineto) for straight line segments
- C (curveto) for cubic Bézier curves
- Q (quadratic curveto) for quadratic Bézier curves
- A (elliptical arc) for curved segments
- Z (closepath) for closing path shapes

### Bézier Curves
- Cubic Bézier curves with two control points
- Quadratic Bézier curves with one control point
- Smooth curve continuation commands
- Relative and absolute coordinate modes

### Elliptical Arcs
Complex arc definition with radius, rotation, and sweep parameters for creating curved segments that are parts of ellipses.

## Text and Typography

SVG provides comprehensive text handling capabilities with precise positioning and styling control.

### Text Elements
- `<text>` for single-line text
- `<tspan>` for text spans with individual formatting
- `<textPath>` for text along paths
- x, y attributes for positioning

### Typography Control
- font-family for typeface selection
- font-size for text scaling
- font-weight for boldness
- text-anchor for alignment

### Advanced Text Features
- Text decoration including underlines and strikethrough
- Text rotation and transformation
- Multi-line text with precise line spacing
- Internationalization support

## Styling and CSS Integration

SVG elements can be styled using CSS properties, either through external stylesheets, internal styles, or inline attributes.

### CSS Property Support
- fill for interior color
- stroke for outline color
- stroke-width for line thickness
- opacity for transparency
- visibility for element display

### Style Application Methods
- External CSS files with class and ID selectors
- Internal `<style>` elements within SVG documents
- Inline style attributes on individual elements
- Presentation attributes as element attributes

### CSS Animation Integration
SVG properties can be animated using CSS transitions and keyframe animations, providing smooth visual effects.

## Transformations and Animations

SVG supports both static transformations and dynamic animations.

### Transform Types
- translate() for positional changes
- rotate() for rotational transformations
- scale() for size modifications
- skewX() and skewY() for perspective effects
- matrix() for complex transformations

### SMIL Animation
- `<animate>` for property animation
- `<animateTransform>` for transformation animation
- `<animateMotion>` for path-based movement
- timing attributes for animation control

### Animation Timing
- dur attribute for animation duration
- repeatCount for animation repetition
- begin attribute for animation triggers
- keyTimes for animation pacing control

## Scripting and Interactivity

SVG elements support event handling and JavaScript manipulation for interactive graphics.

### Event Handling
- Mouse events (click, mouseover, mouseout)
- Keyboard events for user input
- Touch events for mobile interaction
- Custom events for application logic

### DOM Manipulation
- getElementById() for element selection
- getAttribute() and setAttribute() for property access
- createElement() for dynamic element creation
- Event listener registration and removal

### JavaScript Integration
- Inline script elements within SVG documents
- External JavaScript file references
- Event attribute handlers
- Programmatic animation control

## SVG in Web Integration

SVG can be integrated into web pages through multiple methods, each with specific use cases and limitations.

### Inline SVG
SVG markup embedded directly in HTML documents, providing full styling and scripting capabilities with direct DOM access.

### Image References
SVG files referenced through `<img>` elements, `<object>` elements, or CSS background-image properties.

### Dynamic Loading
JavaScript-based SVG loading and manipulation for creating dynamic visualizations and interactive graphics.

### HTML5 Integration
Modern HTML5 supports inline SVG without XML namespace declarations, simplifying integration with web applications.

## Browser Support and Standards

SVG enjoys widespread browser support across modern web browsers with comprehensive feature implementation.

### Standard Compliance
SVG follows W3C specifications with defined behavior across different implementations and rendering engines.

### Feature Support
- Complete SVG 1.1 support in modern browsers
- Partial SVG 2.0 feature adoption
- Animation support varies by browser
- JavaScript API consistency across platforms

### Performance Considerations
- Vector graphics scale efficiently
- Complex paths may impact rendering performance
- Animation performance varies by complexity
- Hardware acceleration support in modern browsers

## Supplementary Details

SVG represents a mature and powerful graphics format for web applications, providing vector-based graphics with full integration into web standards. The format balances simplicity for basic shapes with sophisticated capabilities for complex visualizations.

## Reference Details

### Core Elements
- `<svg>` - Root container element
- `<g>` - Group element for logical organization
- `<use>` - Element reuse and referencing
- `<defs>` - Definitions for reusable components
- `<symbol>` - Template definitions

### Styling Attributes
- fill: color or pattern for shape interior
- stroke: color for shape outline
- stroke-width: thickness of outline
- opacity: transparency level
- transform: coordinate transformations

### Animation Elements
- `<animate>` - Generic property animation
- `<animateTransform>` - Transform-specific animation
- `<animateMotion>` - Path-based motion animation
- `<set>` - Discrete value setting

### Filter Effects
- `<filter>` - Filter definition container
- `<feGaussianBlur>` - Blur filter primitive
- `<feColorMatrix>` - Color manipulation
- `<feOffset>` - Position offset effects

## Detailed Digest

**Source Content:** Mozilla Developer Network SVG documentation (https://developer.mozilla.org/en-US/docs/Web/SVG) and W3C SVG Primer (https://www.w3.org/Graphics/SVG/IG/resources/svgprimer.html)
**Retrieved:** 2026-03-13
**Attribution:** Mozilla Foundation and W3C SVG Working Group
**Data Size:** Approximately 5.2KB extracted content

SVG is a comprehensive XML-based vector graphics format for web applications, providing scalable graphics with CSS styling, JavaScript interactivity, and animation capabilities. The format integrates seamlessly with HTML and supports complex visualizations while maintaining web standards compliance.