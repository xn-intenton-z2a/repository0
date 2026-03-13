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
- Mathematical Plot Elements
- Scientific Notation and Symbols

## Scalable Vector Graphics Overview

Scalable Vector Graphics (SVG) is a Web graphics language defined as markup and APIs for creating static or dynamic images, capable of interactivity and animation, including various graphical effects. SVG can be styled with CSS and combined with HTML, making it ideal for mathematical plot generation and scientific visualization.

### SVG Characteristics for Mathematical Plotting
- XML-based vector graphics format ideal for precise mathematical shapes
- Scalable without quality loss for high-resolution mathematical plots
- Web standards compliant for cross-platform mathematical visualization
- Interactive and animation capable for dynamic mathematical demonstrations
- CSS stylable elements for customized mathematical plot appearance
- JavaScript programmable for real-time mathematical function plotting

### Mathematical Visualization Advantages
SVG provides superior mathematical plot quality through vector precision, infinite scalability for detailed mathematical analysis, text integration for mathematical notation, and coordinate system control for precise mathematical scaling.

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

## Mathematical Plot Elements

SVG provides specialized elements and techniques optimized for mathematical plot generation and scientific visualization applications.

### Mathematical Path Generation
```xml
<!-- Smooth mathematical function curve -->
<path d="M0,50 Q25,25 50,50 T100,50" 
      fill="none" 
      stroke="blue" 
      stroke-width="2"/>

<!-- Parametric curve with precise coordinates -->
<path d="M10,10 C20,20 40,20 50,10" 
      fill="none" 
      stroke="red" 
      stroke-width="1.5"/>
```

### Grid and Axis Systems
```xml
<!-- Mathematical coordinate grid -->
<defs>
  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" stroke-width="1"/>
  </pattern>
</defs>
<rect width="100%" height="100%" fill="url(#grid)" />

<!-- Mathematical axes with arrows -->
<line x1="0" y1="50" x2="100" y2="50" stroke="black" stroke-width="2" marker-end="url(#arrowhead)"/>
<line x1="50" y1="0" x2="50" y2="100" stroke="black" stroke-width="2" marker-end="url(#arrowhead)"/>
```

### Mathematical Function Visualization
- Precise path data generation for mathematical functions
- Quadratic and cubic Bezier curves for smooth mathematical curves
- Parametric curve support for complex mathematical relationships
- Multi-segment paths for discontinuous mathematical functions
- Coordinate system transformations for mathematical scaling

## Scientific Notation and Symbols

SVG supports comprehensive mathematical notation through text elements and symbol libraries for scientific visualization.

### Mathematical Text Elements
```xml
<!-- Mathematical equation display -->
<text x="50" y="20" font-family="serif" font-size="14" text-anchor="middle">
  f(x) = sin(x) + cos(x)
</text>

<!-- Subscripts and superscripts -->
<text x="30" y="40" font-family="serif" font-size="12">
  x<tspan baseline-shift="sub" font-size="8">1</tspan>
  + x<tspan baseline-shift="super" font-size="8">2</tspan>
</text>

<!-- Greek letters and mathematical symbols -->
<text x="50" y="60" font-family="serif" font-size="14">
  π ≈ 3.14159, α = π/4
</text>
```

### Mathematical Symbol Libraries
- Unicode mathematical symbols support (π, α, β, γ, δ, ε, θ, λ, μ, σ, φ, ψ, ω)
- Mathematical operators (∑, ∫, ∂, ∇, ±, ×, ÷, ≤, ≥, ≠, ≈, ∞)
- Fraction representation using text positioning
- Matrix notation through grouped text elements
- Complex mathematical expressions with proper spacing

### Advanced Mathematical Notation
```xml
<!-- Complex mathematical expression -->
<g font-family="serif" font-size="14">
  <!-- Integral notation -->
  <text x="10" y="50">∫</text>
  <text x="15" y="45" font-size="10">b</text>
  <text x="15" y="55" font-size="10">a</text>
  <text x="25" y="50">f(x)dx</text>
  
  <!-- Summation notation -->
  <text x="80" y="50">∑</text>
  <text x="85" y="45" font-size="10">n</text>
  <text x="85" y="55" font-size="10">i=1</text>
  <text x="95" y="50">x<tspan baseline-shift="sub" font-size="8">i</tspan></text>
</g>
```

## Supplementary Details

### Mathematical Plot Optimization
SVG mathematical plots benefit from path optimization techniques including segment reduction for performance, viewBox scaling for different mathematical ranges, and CSS styling for consistent mathematical notation appearance across devices.

### Interactive Mathematical Visualization
SVG supports interactive mathematical plots through JavaScript event handling, enabling dynamic mathematical function exploration, real-time parameter adjustment, and interactive mathematical demonstrations.

### Mathematical Coordinate Systems
SVG coordinate system flexibility supports various mathematical coordinate systems including Cartesian coordinates with custom origins, polar coordinate transformations, logarithmic scaling for mathematical data, and custom viewBox configurations for mathematical ranges.

## Reference Details

### Mathematical Plot API
```xml
<!-- Mathematical function plot structure -->
<svg viewBox="-100 -100 200 200" xmlns="http://www.w3.org/2000/svg">
  <!-- Grid system -->
  <defs>
    <pattern id="mathGrid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#ccc" stroke-width="0.5"/>
    </pattern>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" 
            refX="0" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="black" />
    </marker>
  </defs>
  
  <!-- Grid background -->
  <rect x="-100" y="-100" width="200" height="200" fill="url(#mathGrid)"/>
  
  <!-- Axes -->
  <line x1="-100" y1="0" x2="100" y2="0" stroke="black" stroke-width="2" marker-end="url(#arrowhead)"/>
  <line x1="0" y1="-100" x2="0" y2="100" stroke="black" stroke-width="2" marker-end="url(#arrowhead)"/>
  
  <!-- Mathematical function curve -->
  <path d="M-80,-64 Q-40,16 0,0 T80,64" fill="none" stroke="blue" stroke-width="2"/>
  
  <!-- Labels -->
  <text x="85" y="-5" font-family="serif" font-size="12">x</text>
  <text x="5" y="-85" font-family="serif" font-size="12">y</text>
</svg>
```

### Mathematical Styling Classes
```css
.math-axis {
  stroke: #000;
  stroke-width: 2;
  marker-end: url(#arrowhead);
}

.math-grid {
  stroke: #ddd;
  stroke-width: 0.5;
  fill: none;
}

.math-function {
  fill: none;
  stroke-width: 2;
}

.math-text {
  font-family: 'Times New Roman', serif;
  text-anchor: middle;
  dominant-baseline: central;
}
```

## Detailed Digest

Retrieved from https://developer.mozilla.org/en-US/docs/Web/SVG on 2026-03-13. SVG provides comprehensive support for mathematical visualization through XML-based vector graphics with scalable precision. Features include path elements for mathematical function curves, text elements for mathematical notation, coordinate system control, CSS styling integration, and JavaScript programmability. The format supports mathematical symbols, complex expressions, grid systems, and interactive mathematical demonstrations while maintaining web standards compliance.

Attribution: Mozilla Developer Network SVG documentation and W3C SVG specifications
Data size obtained: ~6.8KB of technical specifications and mathematical implementation examples