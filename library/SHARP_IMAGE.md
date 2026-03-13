# SHARP_IMAGE

## Table of Contents

- High-Performance Image Processing
- Supported Image Formats  
- Resizing and Transformation Operations
- Color Space and Profile Management
- Streaming and Pipeline Architecture
- Output Format Optimization
- Installation and Runtime Requirements

## High-Performance Image Processing

Sharp is a high-speed Node-API module for image processing, typically 4x-5x faster than ImageMagick and GraphicsMagick due to its use of libvips.

### Performance Characteristics
- Powered by blazingly fast libvips image processing library
- Originally created in 1989 at Birkbeck College
- Currently maintained by team led by John Cupitt
- Non-blocking operations using libuv
- No child processes spawned
- Full Promises/async/await support

### Memory Management
- Only small regions of uncompressed image data held in memory
- Processes data regions at a time for efficiency
- Takes advantage of multiple CPU cores
- Optimizes L1/L2/L3 cache usage
- Memory-efficient streaming architecture

## Supported Image Formats

### Input Formats
- JPEG: Standard lossy compression format
- PNG: Lossless compression with transparency
- WebP: Modern efficient format by Google  
- GIF: Animated and static graphics format
- AVIF: Next-generation efficient format
- TIFF: High-quality archival format
- SVG: Scalable vector graphics

### Output Formats  
- JPEG: Optimized encoding with mozjpeg integration
- PNG: Efficient compression with pngquant features
- WebP: Advanced compression for web delivery
- GIF: Animated output with size optimization
- AVIF: Cutting-edge compression ratios
- TIFF: Professional archival output
- Raw pixel data: Uncompressed buffer output

## Resizing and Transformation Operations

### Resizing Capabilities
- High-quality Lanczos resampling ensures quality preservation
- Maintains aspect ratio or allows distortion
- Smart cropping with attention algorithms
- Thumbnail generation for web applications
- Batch processing for multiple sizes

### Geometric Transformations
- Rotation: Arbitrary angle rotation with background fill
- Extraction: Crop specific regions from images
- Compositing: Layer multiple images together
- Flipping: Horizontal and vertical mirroring
- Affine transformations: Scale, skew, and perspective

### Color Corrections
- Gamma correction for display optimization
- Brightness and contrast adjustments
- Color space conversions
- White balance corrections
- Channel manipulation (RGB, CMYK)

## Color Space and Profile Management

### ICC Profile Support
- Embedded ICC profiles handled correctly
- Color space conversion between profiles
- sRGB, Adobe RGB, ProPhoto RGB support
- CMYK color space processing
- Profile stripping for web optimization

### Alpha Transparency
- Alpha transparency channels preserved
- Premultiplied alpha handling
- Transparency to solid color conversion
- Alpha blending operations

## Streaming and Pipeline Architecture

### Stream Integration
- Input from Streams, Buffer objects, or filesystem
- Output to multiple processing pipelines
- Single input stream split to multiple outputs
- Memory-efficient for large file processing

### Pipeline Processing
- Chainable operations for complex workflows
- Non-destructive editing until output
- Operation ordering optimization
- Lazy evaluation for performance

## Output Format Optimization

### JPEG Optimization
- Huffman table optimization built-in
- No need for external jpegoptim or jpegtran tools
- Progressive JPEG encoding support
- Quality vs file size balancing

### PNG Optimization  
- PNG filtering disabled by default for line art
- Often produces results equivalent to pngcrush
- Palette optimization for indexed color
- Compression level configuration

### GIF Optimization
- Animated GIF file size optimization
- No need for external gifsicle tool
- Frame-by-frame compression
- Color palette optimization

### WebP and AVIF
- Advanced compression algorithms
- Lossless and lossy encoding options
- Alpha channel support
- Progressive decoding support

## Installation and Runtime Requirements

### System Requirements
- Node.js >= 18.17.0 compatibility
- Deno and Bun runtime support
- Node-API v9 compatibility required
- No additional install or runtime dependencies on most systems

### Platform Support
- Modern macOS systems supported
- Windows compatibility included
- Linux distributions supported
- ARM and x64 architecture support

### Deep Zoom Features
- Deep Zoom image pyramid generation
- Suitable for "slippy map" tile viewers
- OpenSeadragon compatibility
- Multi-resolution image serving

## Supplementary Details

Sharp is designed for high-volume server-side image processing with emphasis on performance and memory efficiency. The library provides comprehensive image manipulation capabilities while maintaining low resource usage through its libvips foundation.

## Reference Details

### Basic Usage Pattern
```javascript
const sharp = require('sharp');

await sharp(inputBuffer)
  .resize(800, 600)
  .jpeg({ quality: 80 })
  .toFile('output.jpg');
```

### Resize Options
- width: Target width in pixels
- height: Target height in pixels  
- fit: Scaling behavior (cover, contain, fill, inside, outside)
- position: Crop position for cover/contain
- background: Background color for letterboxing
- withoutEnlargement: Prevent upscaling

### Format-Specific Options
JPEG options:
- quality: Compression quality (1-100)
- progressive: Progressive encoding
- mozjpeg: Use mozjpeg encoder

PNG options:
- compressionLevel: Compression level (0-9)
- adaptiveFiltering: Enable adaptive filtering
- palette: Use palette-based encoding

WebP options:
- quality: Compression quality
- lossless: Lossless encoding mode
- effort: Compression effort level

### Transform Operations
- rotate(angle): Rotate image
- flip(): Flip horizontally  
- flop(): Flip vertically
- blur(sigma): Gaussian blur
- sharpen(): Sharpen image
- gamma(value): Gamma correction
- negate(): Color inversion

### Pipeline Methods
- pipe(stream): Stream output to destination
- toBuffer(): Output to Buffer object
- toFile(path): Save to filesystem
- clone(): Duplicate pipeline for multiple outputs

## Detailed Digest

**Source Content:** Sharp image processing library website (https://sharp.pixelplumbing.com/)
**Retrieved:** 2026-03-13  
**Attribution:** Sharp development team and libvips contributors
**Data Size:** Approximately 2.5KB extracted content

Sharp provides high-performance Node.js image processing with comprehensive format support, efficient memory usage, and advanced optimization features built on the libvips library foundation.