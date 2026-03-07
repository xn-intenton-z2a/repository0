JSONLD_NPM

NORMALISED EXTRACT
Table of contents
  1. Package entry points and import style
  2. Primary API methods and behaviour
  3. Common options and hooks (document loader, base, processingMode)
  4. Error handling and async patterns

1. Package entry points and import style
  - Import patterns:
    * ES module: import jsonld from 'jsonld'
    * CommonJS: const jsonld = require('jsonld')
  - The package exposes promise-based APIs; all major functions return Promises resolving to JSON-LD objects, arrays, strings, or RDF datasets depending on the API.

2. Primary API methods and behaviour
  - expand(input, options) -> Promise<Array>
    * Expands a JSON-LD document to the expanded form. Parameters: input (object|string), options (object). Returns: Promise resolving to expanded array of node objects.
  - compact(input, context, options) -> Promise<Object>
    * Compacts input using the provided context. Parameters: input (object|string), context (object|string), options (object). Returns: Promise resolving to a compacted JSON-LD object.
  - flatten(input, contextOrOptions, options) -> Promise<Object|Array>
    * Flattens a JSON-LD document. Parameters vary: either (input, options) or (input, context, options). Returns: flattened document.
  - frame(input, frame, options) -> Promise<Object>
    * Frames a JSON-LD document against a frame to produce framed output. Parameters: input, frame, options. Returns: framed JSON-LD.
  - toRDF(input, options) -> Promise<RDFDataset>
    * Converts JSON-LD to an RDF dataset (default representation is an array of quads or the package's RDF dataset structure). Options may include format selectors to produce N-Quads.
  - fromRDF(dataset, options) -> Promise<Object>
    * Converts an RDF dataset (N-Quads or dataset structure) into JSON-LD. Options control useNativeTypes and useRdfType.
  - normalize(input, options) -> Promise<String>
    * Produces a canonical serialization (N-Quads string) using a normalization algorithm (e.g., URDNA2015) for signing or comparison.
  - documentLoader(url) -> Promise<RemoteDocument>
    * Hook to override HTTP fetching. The loader signature: function(url) -> Promise resolving to object with keys: contextUrl (null|string), documentUrl (string), document (any). Set options.documentLoader to supply a custom loader.

3. Common options and hooks (document loader, base, processingMode)
  - options.documentLoader: function(url) returning Promise<RemoteDocument>. Use to cache or rewrite context fetches.
  - options.base: base IRI string used for relative IRI resolution.
  - options.processingMode: string indicating JSON-LD processing mode (examples: "json-ld-1.1").
  - options.produceGeneralizedRdf: boolean controlling generalized RDF output when converting to RDF.
  - options.format: when converting toRDF, may specify 'application/n-quads' or other RDF serializations if supported by the package.

4. Error handling and async patterns
  - All primary APIs return Promises; use then/catch or async/await and wrap calls with try/catch for synchronous-like handling.
  - Document loader failures surface as rejected Promises; implement retry, cache, or fallback loaders in the custom documentLoader to handle transient network errors.

SUPPLEMENTARY DETAILS
  - Remote document loader return shape (RemoteDocument): { contextUrl: string|null, documentUrl: string, document: any }
  - Use a synchronous document loader only if wrapped by a Promise; the package expects a Promise-returning loader for consistency.
  - When normalizing, specify algorithm via options (URDNA2015 recommended) and request N-Quads output for deterministic text.

REFERENCE DETAILS
  - Exact method signatures (summary):
    * expand(input, options) -> Promise<Array>
    * compact(input, context, options) -> Promise<Object>
    * flatten(input, contextOrOptions, options) -> Promise<Object|Array>
    * frame(input, frame, options) -> Promise<Object>
    * toRDF(input, options) -> Promise<RDFDataset|String> (N-Quads if requested)
    * fromRDF(dataset, options) -> Promise<Object>
    * normalize(input, options) -> Promise<String>
    * documentLoader(url) -> Promise<{ contextUrl: string|null, documentUrl: string, document: any }>
  - Option fields (commonly supported): base (string), documentLoader (function), processingMode (string), produceGeneralizedRdf (boolean), format (string), expandContext (object)

DETAILED DIGEST
  - Source: https://www.npmjs.com/package/jsonld
  - Retrieved: 2026-03-07
  - Content: npm package API surface for the jsonld JS library; promise-based conversion, framing, normalization and document-loader extension points.

ATTRIBUTION
  - Attribution: Source URL listed in SOURCES.md. Content synthesized into a concise API reference and implementation notes.
  - Crawl data size: source URL present in SOURCES.md; no raw crawl bytes were fetched during this operation.
