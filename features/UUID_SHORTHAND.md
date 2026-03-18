# UUID_SHORTHAND

Status: Done

Overview

Shorthand helpers encodeUUIDShorthand and decodeUUIDShorthand: strip dashes from canonical UUID strings, parse hex to 16 bytes, support an explicit reverse option (documented) and encode/decode using registered encodings. The reverse option is explicit so behaviour is deterministic and testable.

Acceptance criteria

1. encodeUUIDShorthand(uuidString, encodingName, options?) exists and supports a boolean reverse option with a documented default (default: false). The reverse option controls whether the encoded string is reversed after encoding (reverse: true means the library returns the encoded string reversed). decodeUUIDShorthand mirrors that behaviour by reversing the input encoded string before decoding when reverse: true so round-trip remains deterministic.
2. Tests assert both reverse modes and that decodeUUIDShorthand(encodeUUIDShorthand(uuid, name, {reverse})) returns the original canonical UUID for both reverse: false and reverse: true.
3. CLI and web demo use these helpers and show consistent results with the library API; the demo's "Reverse encoded output" checkbox must reflect the same default (unchecked) and behaviour.

Implementation notes

- The helpers operate on canonical dashed lowercase UUID strings for input and output unless explicitly documented otherwise.
- The helpers must validate UUID input (length, hex characters) and return informative errors for invalid input rather than silent failures.
