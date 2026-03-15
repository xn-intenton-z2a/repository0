Title: NODE_CANVAS
Source: https://github.com/Automattic/node-canvas (README)

TABLE OF CONTENTS:
1. Purpose and scope
2. Installation and native dependencies
3. Core utility methods and signatures
4. Non-standard APIs and streaming output methods
5. Platform-specific notes and compilation flags
6. Supplementary details
7. Reference details (method signatures and return values)
8. Detailed digest
9. Attribution

NORMALISED EXTRACT:
Purpose:
- node-canvas is a Cairo-backed Canvas implementation for Node.js that implements most of the HTML Canvas 2D API and provides additional utilities for Node usage.

Installation and native dependencies (exact commands and packages):
- npm install canvas (pre-built binaries downloaded for common platforms). Minimum Node.js version: 18.12.0 as noted in README.
- To compile from source (npm install --build-from-source) install native libraries.
- Debian/Ubuntu (one-line):
  sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
- macOS (Homebrew):
  brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman python-setuptools
- Fedora: sudo yum install gcc-c++ cairo-devel pango-devel libjpeg-turbo-devel giflib-devel
- Optional libraries: libgif (GIF support), librsvg (SVG), libjpeg (JPEG); Cairo v1.10.0+ required.

Core utility API and signatures (from README):
- createCanvas(width: number, height: number, type?: 'PDF'|'SVG') => Canvas
- createImageData(width: number, height: number) => ImageData
- loadImage(src: string|Buffer) => Promise<Image>
- registerFont(path: string, { family: string, weight?: string, style?: string }) => void
- deregisterAllFonts() => void

Canvas instance common methods:
- canvas.getContext('2d') => CanvasRenderingContext2D
- Canvas#toBuffer([formatOptions]) => Buffer (synchronous or Promise variants depending on API)
- Canvas#createPNGStream() => Readable stream (PNG)
- Canvas#createJPEGStream([opts]) => Readable stream (JPEG)
- Canvas#createPDFStream() => Readable stream (PDF) when PDF support compiled in

Non-standard APIs and notes:
- Image.src accepts string, Buffer, local path or data URIs.
- registerFont lets you load a font file and use its family name in canvas contexts.
- Utility functions return standard web-like types (ImageData, CanvasRenderingContext2D) adapted to Node.

Platform and compilation notes:
- Prebuilt binaries available for popular platforms; building from source requires compilers and development versions of dependencies listed above.
- When building for Docker or CI, install the listed distro packages in the build image before npm install.

REFERENCE DETAILS (explicit signatures and behaviors):
- createCanvas(width: number, height: number, type?: 'PDF'|'SVG') => Canvas
- loadImage(src: string|Buffer) => Promise<Image>
- registerFont(path: string, options: { family: string, weight?: string, style?: string }) => void
- Canvas#createPNGStream() => Node.Readable stream producing PNG bytes
- Canvas#toDataURL() => string (data: URL) representing the canvas in default image format

DETAILED DIGEST:
- Source URL: https://github.com/Automattic/node-canvas (README discovered via repository Readme)
- Retrieved: 2026-03-15 (UTC)
- Crawled byte-size: 566377 bytes (HTML for the GitHub page) and README content signature from repo (raw README pulled when available).

ATTRIBUTION:
Content extracted from Automattic/node-canvas README and repository documentation — retrieved 2026-03-15.