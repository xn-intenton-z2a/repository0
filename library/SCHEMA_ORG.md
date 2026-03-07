SCHEMA_ORG

NORMALISED EXTRACT
Table of contents
  1. Core usage patterns and JSON-LD embedding
  2. Important types and required properties
  3. Context and @type/@id best practices
  4. Serialization and MIME type for embedding
  5. Validation, testing and common errors

1. Core usage patterns and JSON-LD embedding
  - Preferred embedding method: JSON-LD scripts injected in HTML head using script type "application/ld+json" with top-level @context set to "https://schema.org".
  - Use @type to declare the schema type (e.g., Organization, Person, Product) and @id for stable identifiers (use full HTTPS URLs where possible).
  - Nest objects to represent complex properties rather than string concatenation; use property names exactly as defined in the schema.org vocabulary.

2. Important types and required properties
  - Organization: recommended properties: name (text), url (IRI), logo (ImageObject or URL). Include contactPoint and sameAs where applicable.
  - Person: required property: name. Recommended: url, image, sameAs.
  - Product: recommended: name, image, description, sku, brand (Organization or Text), offers (Offer).
  - Event: required/important: name, startDate (ISO 8601), location (Place or PostalAddress).
  - Article/NewsArticle/BlogPosting: headline, author, datePublished, image; use mainEntityOfPage when applicable.

3. Context and @type/@id best practices
  - Always include @context: "https://schema.org" at the document root for JSON-LD structured data.
  - Prefer absolute IRIs for @id values and canonical URLs; do not rely on relative paths for identity across crawls.
  - Where multiple types apply, use an array for @type: e.g., ["Product","SomeAdditionalType"].

4. Serialization and MIME type for embedding
  - Use script tag with type application/ld+json for embedding JSON-LD in HTML; serve the page with Content-Type: text/html; charset=utf-8.
  - For API responses, use Content-Type: application/ld+json when returning JSON-LD payloads.

5. Validation, testing and common errors
  - Primary validation tools: vendor rich results testers (Google Rich Results Test), Schema.org validator, and structured-data testing tools that accept application/ld+json.
  - Common errors: missing required properties for intended rich result, using relative @id values, incorrect date formats (use ISO 8601), incorrect property names or capitalization, and mixing vocabularies without explicit @context.

SUPPLEMENTARY DETAILS
  - Context URL: https://schema.org
  - Recommended date formats: RFC3339 / ISO 8601 (e.g., 2026-03-07T14:00:00Z) for startDate, endDate, datePublished.
  - Use of image: prefer full absolute HTTPS URLs; ImageObject may include url, width, height.
  - Language tagging: use language in text fields consistently; prefer @language in JSON-LD context only when required for default language.

REFERENCE DETAILS
  - Exact context string: https://schema.org
  - Script embedding MIME type: application/ld+json
  - Key types and required/recommended properties (literal list):
    * Organization: name (Text), url (URL), logo (URL or ImageObject)
    * Person: name (Text)
    * Product: name (Text), image (URL), description (Text), sku (Text), brand (Organization|Text), offers (Offer)
    * Event: name (Text), startDate (DateTime), location (Place|PostalAddress)
    * Article: headline (Text), author (Person|Organization), datePublished (DateTime)
  - Preferred value formats:
    * Date/time: ISO 8601 / RFC3339
    * URLs: absolute HTTPS URLs

DETAILED DIGEST
  - Source: https://schema.org/docs/gs.html
  - Retrieved: 2026-03-07
  - Content: practical guide to using schema.org structured data, JSON-LD embedding recommendations and type/property guidance.

ATTRIBUTION
  - Attribution: Source document listed in SOURCES.md (schema.org Getting Started). Content synthesized from schema.org guidance.
  - Crawl data size: source URL present in SOURCES.md; no raw crawl bytes were fetched during this operation.
