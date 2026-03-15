Title: SHARP
Source: https://sharp.pixelplumbing.com/

TABLE OF CONTENTS:
1. Purpose and core concepts
2. Installation and libvips dependency rules
3. Core API signatures
4. Resize and format-specific options (png/jpeg/webp/avif)
5. Stream and buffer output methods
6. Concurrency and performance tuning
7. Supplementary details
8. Reference details (method signatures and options)
9. Detailed digest
10. Attribution

NORMALISED EXTRACT:
Purpose:
- Sharp is a high-performance image processing library for Node.js built on libvips. It provides streaming and buffer-based transforms and avoids full-buffer memory overhead where possible.

Installation notes and libvips:
- npm install sharp will download prebuilt libvips binaries for supported platforms. To build from source set npm_config_build_from_source=true and ensure libvips build dependencies are installed on the machine.
- Supported Node versions and platform binaries are documented on the site; check the site for the exact supported ranges.

Core API (typical patterns and signatures):
- sharp(input?: string|Buffer|Readable) => Sharp instance
- sharp.resize(width?: number, height?: number, options?: { fit?: 'cover'|'contain'|'fill'|'inside'|'outside', position?: string|{left:number,top:number}, background?: string|{r,g,b,alpha} }) => Sharp
- sharp.rotate(angle?: number, options?: { background?: string|object }) => Sharp
- sharp.toBuffer(options?: { resolveWithObject?: boolean }) => Promise<Buffer|{data:Buffer, info:Object}>
- sharp.toFile(outputPath: string, options?: Object) => Promise<OutputInfo>
- sharp.metadata() => Promise<Metadata>

Format-specific options (representative):
- jpeg(options?: { quality?: number (1-100), progressive?: boolean, chromaSubsampling?: string, mozjpeg?: boolean })
- png(options?: { compressionLevel?: number (0-9), palette?: boolean, quality?: number })
- webp(options?: { quality?: number, alphaQuality?: number, lossless?: boolean })

Concurrency and performance tuning:
- Environment variable SHARP_CONCURRENCY controls internal worker thread pool size.
- Use pipeline streaming (Sharp(readable).resize(...).png().toBuffer()) to avoid full in-memory images.

REFERENCE DETAILS (explicit method signatures and return types):
- sharp(input?: string|Buffer|Readable) => Sharp
- Sharp#resize(width?: number, height?: number, options?: ResizeOptions) => Sharp
- Sharp#rotate(angle?: number, options?: { background?: string|object }) => Sharp
- Sharp#toBuffer(options?: { resolveWithObject?: boolean }) => Promise<Buffer|{data:Buffer, info:Object}>
- Sharp#toFile(path: string) => Promise<{format:string, size:number, width:number, height:number}>
- Sharp#metadata() => Promise<Metadata> (metadata contains format, width, height, channels, density, etc.)

DETAILED DIGEST:
- Source URL: https://sharp.pixelplumbing.com/
- Retrieved: 2026-03-15 (UTC)
- Crawled byte-size: 52643 bytes (HTML)

ATTRIBUTION:
Content extracted from the Sharp documentation site (pixelplumbing) — retrieved 2026-03-15.