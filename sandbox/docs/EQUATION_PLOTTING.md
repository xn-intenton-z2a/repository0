# Equation Plotting

Generate an SVG plot of a mathematical function via the CLI.

## Flags

- `--equation` (string, required): JavaScript expression in `x`, e.g., `x*x` or `Math.sin(x)`.
- `--range` (string, optional): Two comma-separated numbers `min,max`. Default: `-10,10`.
- `--width` (number, optional): SVG width in pixels. Default: `500`.
- `--height` (number, optional): SVG height in pixels. Default: `300`.
- `--samples` (integer, optional): Number of sample points (>1). Default: `100`.
- `--help`: Show usage information.

## Usage Examples

Generate a quadratic plot:
```
npm start -- --equation "x*x" --range "-2,2" --width 400 --height 200 --samples 50
```
This prints an SVG string to stdout, e.g.:

```svg
<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
  <path d="M 0,200 L 16,184 L 33,150 ..." fill="none" stroke="black"/>
</svg>
```

Generate a sine wave plot (default size and samples):
```
npm start -- --equation "Math.sin(x)" --range "0,3.1416"
```

Embed the returned SVG string in your HTML or save it to a `.svg` file to view.
