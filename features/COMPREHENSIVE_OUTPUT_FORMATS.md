# Comprehensive Output Formats

Extend plot-code-lib output capabilities to support multiple file formats and export targets, making it a versatile tool for different visualization workflows and integration scenarios.

## Purpose

Transform plot-code-lib into a comprehensive plotting solution that can generate output suitable for web applications, scientific publications, presentations, and data analysis pipelines through multiple format support.

## Acceptance Criteria

- Add --format flag supporting: svg, png, pdf, html, webp, json-data
- Support --embed flag for generating HTML with embedded interactive plots
- Include --quality flag for controlling image compression and resolution
- Add --theme flag for predefined styling: light, dark, scientific, presentation
- Support --size flag with common presets: thumbnail, web, print, poster
- Include LaTeX-compatible SVG output with proper mathematical notation
- Add animated GIF support for time-varying expressions with --animate flag
- Support Base64 encoded output for direct web embedding
- Include accessibility features with alt-text and high-contrast themes
- Add batch processing with --batch flag for multiple expressions in one run

## Technical Implementation

Extend PlotRenderer class with format-specific rendering engines. Create FormatManager class that handles different output targets and compression settings. Add ThemeManager for styling presets and accessibility features. Implement animation support for time-series expressions.

## Integration Points

- Extends existing PlotRenderer with new format support
- Uses current CLI interface with additional format flags
- Compatible with existing expression parsing and data generation
- Works with all coordinate systems and plotting modes
- Maintains backward compatibility with SVG/PNG output

## Example Usage

PDF output: node src/lib/main.js --expression "y=sin(x)" --range "x=-pi:pi" --format pdf --file scientific.pdf

Interactive HTML: node src/lib/main.js --expression "y=cos(x)" --range "x=0:2*pi" --format html --embed --file interactive.html

High-quality print: node src/lib/main.js --expression "y=x^2" --range "x=-3:3" --format png --size poster --quality 95 --file poster.png

Animated visualization: node src/lib/main.js --expression "y=sin(x+t)" --range "x=-pi:pi,t=0:2*pi" --format gif --animate --file wave.gif