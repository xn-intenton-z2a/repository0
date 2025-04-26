# SEMVER

## Crawl Summary
Version format: X.Y.Z with MAJOR for incompatible changes, MINOR for backward-compatible additions or deprecations, PATCH for bug fixes. Pre-release denoted by '-' followed by dot-separated identifiers, and build metadata by '+' with dot-separated identifiers. Comparisons are numerical for major, minor, patch; pre-release lower precedence than stable releases. Includes BNF grammar and regex examples for validation.

## Normalised Extract
Table of Contents:
1. Version Number Format
   - Format: X.Y.Z, X, Y, Z are non-negative integers without leading zeros.
   - Rules: MAJOR increment for incompatible API changes; MINOR increment for backward-compatible feature additions and deprecations; PATCH increment for bug fixes. Patch resets to 0 when MINOR is incremented and MINOR and PATCH reset to 0 when MAJOR is incremented.
2. Pre-release and Build Metadata
   - Pre-release: Append '-' followed by dot separated identifiers (e.g., alpha, alpha.1). Identifiers must consist of ASCII alphanumerics and hyphens, without leading zeros in numeric parts.
   - Build Metadata: Append '+' followed by dot separated identifiers; ignored in precedence.
3. Version Precedence
   - Major, Minor, and Patch are compared numerically.
   - Pre-release versions have lower precedence than normal versions.
   - Pre-release identifiers compared left-to-right: numeric vs numeric (numerical compare), alphanumeric vs alphanumeric (lexical ASCII compare); numeric identifiers always lower than non-numeric.
4. BNF Grammar
   - Exact grammar provided for valid versions with production rules for version core, pre-release, build metadata, and identifiers.
5. Regular Expressions
   - Two regex patterns provided: one with named groups and one with numbered groups for validation across multiple languages (PCRE, Python, Go, ECMA Script).

## Supplementary Details
Technical Specifications:
- Version Format: Must be X.Y.Z, where X, Y, Z are integers with no leading zeroes.
- API Change Guidelines: 
  * MAJOR (X): Increment for any backward incompatible changes. Reset MINOR and PATCH to 0.
  * MINOR (Y): Increment for new backward compatible functionality, including deprecation notices. Reset PATCH to 0.
  * PATCH (Z): Increment for backward compatible bug fixes.
- Pre-release Versions: Append '-' followed by identifiers (e.g., 1.0.0-alpha, identifiers cannot be empty or have leading zeros in numeric parts).
- Build Metadata: Append '+' with identifiers; does not affect version precedence.
- BNF Grammar: Full production rules provided for all components.
- Regular Expressions: 
  * Named groups regex: Pattern provided with exact escapes and group names (major, minor, patch, prerelease, buildmetadata).
  * Numbered groups regex: Pattern provided for capturing groups representing major, minor, patch, prerelease, buildmetadata.
- Configuration of use-cases in dependency management: Example provided for specifying dependency versions (e.g., >=3.1.0 <4.0.0 for backward compatible upgrades).

## Reference Details
API Specifications and Implementation Details:
1. Version Number Validator (Regex Implementation):
   - Named Groups Regex:
     Pattern: ^(?P<major>0|[1-9]\d*)\.(?P<minor>0|[1-9]\d*)\.(?P<patch>0|[1-9]\d*)(?:-(?P<prerelease>(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+(?P<buildmetadata>[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$
   - Numbered Groups Regex:
     Pattern: ^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$
   - Use this in SDKs by applying regular expression matching on version strings. Expected return types: If match then an object with keys [major:int, minor:int, patch:int, prerelease:string, buildmetadata:string]. Raise exception if input does not match the pattern.

2. Implementation Patterns for Version Bumping:
   - To bump PATCH: newVersion = X.Y.(Z+1).
   - To bump MINOR: newVersion = X.(Y+1).0.
   - To bump MAJOR: newVersion = (X+1).0.0.
   - Pre-release changes can be appended with '-' plus identifier (e.g., alpha, beta).

3. Best Practices:
   - Always declare and document a public API.
   - Ensure that version strings strictly adhere to the SemVer format for consistency across dependency management systems.
   - Validate version strings using provided regex patterns before processing.
   - Avoid modifying a released version; always increment version numbers on changes.

4. Troubleshooting Procedures:
   - If version validation fails, run the regex test against the version string; use tools like regex101.com with provided patterns.
   - Verify that the version string does not contain extra characters, such as a leading 'v'.
   - For numeric identifier errors, ensure no leading zeros exist (e.g., '01' is invalid).
   - For pre-release formatting issues, check that identifiers are non-empty and only contain ASCII alphanumerics and hyphens.
   - Command-line test: In a Node.js environment, use regex.test(versionString) to validate, and log the match object for debugging.

5. Example Code Comment Pattern (Pseudo-code):
   // Validate a semver string
   const semverRegex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
   if (semverRegex.test(versionString)) {
       // Parse version string into components
   } else {
       throw new Error('Invalid SemVer string.');
   }

Developers can directly use these specifications to implement semver validation and version bumping in their build and deployment pipelines.

## Information Dense Extract
Format: X.Y.Z; MAJOR: incompatible changes; MINOR: backward compatible additions or deprecation; PATCH: bug fixes; Pre-release: '-' + identifiers; Build metadata: '+' + identifiers; Numeric comparison for X, Y, Z; Pre-release compared lexically/numerically; BNF Grammar defined with production rules; Regex (named): ^(?P<major>0|[1-9]\d*)\.(?P<minor>0|[1-9]\d*)\.(?P<patch>0|[1-9]\d*)(?:-(?P<prerelease>(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+(?P<buildmetadata>[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$; Regex (numbered): ^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$; BNF rules for version core, pre-release, build; Implementation: bump PATCH: X.Y.(Z+1), bump MINOR: X.(Y+1).0, bump MAJOR: (X+1).0.0; Validate no leading zeros; Use provided regex patterns.

## Sanitised Extract
Table of Contents:
1. Version Number Format
   - Format: X.Y.Z, X, Y, Z are non-negative integers without leading zeros.
   - Rules: MAJOR increment for incompatible API changes; MINOR increment for backward-compatible feature additions and deprecations; PATCH increment for bug fixes. Patch resets to 0 when MINOR is incremented and MINOR and PATCH reset to 0 when MAJOR is incremented.
2. Pre-release and Build Metadata
   - Pre-release: Append '-' followed by dot separated identifiers (e.g., alpha, alpha.1). Identifiers must consist of ASCII alphanumerics and hyphens, without leading zeros in numeric parts.
   - Build Metadata: Append '+' followed by dot separated identifiers; ignored in precedence.
3. Version Precedence
   - Major, Minor, and Patch are compared numerically.
   - Pre-release versions have lower precedence than normal versions.
   - Pre-release identifiers compared left-to-right: numeric vs numeric (numerical compare), alphanumeric vs alphanumeric (lexical ASCII compare); numeric identifiers always lower than non-numeric.
4. BNF Grammar
   - Exact grammar provided for valid versions with production rules for version core, pre-release, build metadata, and identifiers.
5. Regular Expressions
   - Two regex patterns provided: one with named groups and one with numbered groups for validation across multiple languages (PCRE, Python, Go, ECMA Script).

## Original Source
Versioning, Dependency Management & Conventional Commits Guidelines
https://semver.org

## Digest of SEMVER

# Semantic Versioning 2.0.0

Specification retrieved on 2023-10-06

1. Versioning Rules
   - A version number must follow the format X.Y.Z where X, Y, and Z are non-negative integers without leading zeroes.
   - Increment MAJOR for incompatible API changes.
   - Increment MINOR for backward-compatible functionality additions.
   - Increment PATCH for backward-compatible bug fixes.
   - Once released, a version must remain immutable; modifications require a new version.
   - Version 0.y.z is for initial development and the public API should not be considered stable.
   - Version 1.0.0 defines the public API and all subsequent increments depend on API changes.

2. Pre-release and Build Metadata
   - Pre-release versions are denoted by appending a hyphen and a series of dot-separated identifiers (e.g., 1.0.0-alpha, 1.0.0-alpha.1).
   - Build metadata is denoted by a plus sign and dot-separated identifiers (e.g., 1.0.0+20130313144700) and is ignored in version precedence.

3. Precedence Rules
   - Versions are compared by major, minor, and patch numerically.
   - When major, minor, and patch are equal, a pre-release version has lower precedence than a normal version.
   - Pre-release identifiers are compared left-to-right: numeric identifiers are compared numerically and alphanumerics lexically in ASCII order. Numeric identifiers have lower precedence than non-numeric ones.
   - A larger set of pre-release fields has higher precedence than a smaller set if all preceding identifiers are equal.

4. Backus-Naur Form Grammar for Valid SemVer Versions
   <valid semver> ::= <version core>
                     | <version core> "-" <pre-release>
                     | <version core> "+" <build>
                     | <version core> "-" <pre-release> "+" <build>

   <version core> ::= <major> "." <minor> "." <patch>

   <major> ::= <numeric identifier>
   <minor> ::= <numeric identifier>
   <patch> ::= <numeric identifier>

   <pre-release> ::= <dot-separated pre-release identifiers>
   <dot-separated pre-release identifiers> ::= <pre-release identifier>
                                             | <pre-release identifier> "." <dot-separated pre-release identifiers>

   <build> ::= <dot-separated build identifiers>
   <dot-separated build identifiers> ::= <build identifier>
                                      | <build identifier> "." <dot-separated build identifiers>

   <pre-release identifier> ::= <alphanumeric identifier>
                                | <numeric identifier>

   <build identifier> ::= <alphanumeric identifier>
                          | <digits>

   (Further production rules define alphanumeric and numeric identifiers as specified.)

5. Regular Expressions to Validate SemVer
   - With named groups (PCRE, Python, Go):
     ^(?P<major>0|[1-9]\d*)\.(?P<minor>0|[1-9]\d*)\.(?P<patch>0|[1-9]\d*)(?:-(?P<prerelease>(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+(?P<buildmetadata>[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$
   - With numbered capture groups (compatible with ECMA Script, PCRE, Python, Go):
     ^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$

Attribution: Content sourced from semver.org with data size 3097210 bytes, 739 links found.

## Attribution
- Source: Versioning, Dependency Management & Conventional Commits Guidelines
- URL: https://semver.org
- License: License if known: Not specified
- Crawl Date: 2025-04-26T10:45:42.330Z
- Data Size: 3097210 bytes
- Links Found: 739

## Retrieved
2025-04-26
