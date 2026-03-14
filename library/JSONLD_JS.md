JSONLD_JS

Table of Contents
- Implementation extract (jsonld.js)
  - Supported operations and behavior
  - Bundles and environment targets
  - Document loader and custom loaders
  - Safe mode and canonicalization
- Supplementary implementation details
  - Node/browser bundles, polyfills, and React Native notes
  - Document loader user-agent guidance
  - Test suite and conformance testing
- Reference details (API, function signatures, options, examples)
- Detailed digest and attribution

Implementation extract (jsonld.js)
- Primary purpose: A JavaScript implementation of the JSON-LD processor and API implementing the JSON-LD 1.x specifications.
- Core synchronous/asynchronous API operations exposed (promise-based): compact, expand, flatten, frame, toRDF, fromRDF, canonize, registerRDFParser
- Canonicalization: supports URDNA2015 algorithm and can output in application/n-quads format for signing
- Safe mode: option safe: true causes operations to fail on lossy conversions; recommended for signing and canonicalization

Bundles and environment targets
- Distributed bundles: dist/jsonld.min.js (broad compatibility) and dist/jsonld.esm.min.js (ES module optimized)
- Node.js: import jsonld from 'jsonld'; in CommonJS: const jsonld = require('jsonld');
- React Native: requires polyfills providing crypto.subtle and TextEncoder (example: data-integrity-rn)

Document loader and custom loaders
- Built-in document loaders: jsonld.documentLoaders.node() and jsonld.documentLoaders.xhr() (browser)
- Custom loader contract: (url, options) => Promise<{contextUrl, document, documentUrl}>
- Example behavior: override jsonld.documentLoader = customLoader or pass documentLoader in call options
- Node.js default document loader sets user-agent to 'jsonld.js' unless overridden

Testing and conformance
- jsonld.js uses external W3C test suites (json-ld-api, json-ld-framing) and provides helper scripts to fetch test suites and run tests
- Recommended: run tests after upgrading or patching algorithm code to verify compliance with RFCs

Reference details (API signatures and options)
- compact(input, context, options?) => Promise<object>
  - input: object | string (URL)
  - context: object | string (context object or context URL)
  - options: JsonLdOptions (see JSON_LD doc for fields)
  - returns: Promise resolving to compacted JSON-LD object
- expand(input, options?) => Promise<object[]>
- flatten(input, context?, options?) => Promise<object[]>
- frame(input, frame, options?) => Promise<object>
- toRDF(input, options?) => Promise<string | RDFDataset>
  - options.format: 'application/n-quads' recommended for canonicalization
- fromRDF(input, options?) => Promise<object>
- canonize(input, options?) => Promise<string>
  - options.algorithm: 'URDNA2015'
  - options.format: 'application/n-quads'
- registerRDFParser(contentType, parser) => void
  - parser may be synchronous or return a Promise

Document loader user-agent and React Native
- Node.js document loader default agent: 'jsonld.js'
- React Native requires TextEncoder and crypto.subtle polyfills to use canonicalization and signature operations

Common configuration tips
- For production servers: provide a short-lived cache for remote contexts and a robust custom documentLoader to avoid downtime
- For signing: use canonize(..., {algorithm: 'URDNA2015', format: 'application/n-quads'}) and safe: true
- For browser bundling: use the ESM bundle when targeting modern browsers to reduce bundle size

Detailed digest
- Source: https://github.com/digitalbazaar/jsonld.js (documentation and README) and the JSON-LD specs retrieved 2026-03-14
- Data size: repository README and docs fetched up to 20k characters per page

Attribution
- Extracted content derived from digitalbazaar/jsonld.js repository and JSON-LD W3C recommendations

End of JSONLD_JS document
