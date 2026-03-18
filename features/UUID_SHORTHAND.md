# UUID_SHORTHAND

Status: Done

Overview

Shorthand helpers encodeUUIDShorthand and decodeUUIDShorthand: strip dashes from canonical UUID strings, parse hex to 16 bytes, support an explicit reverse option (documented) and encode/decode using registered encodings. The reverse option is explicit so behaviour is deterministic and testable.

Acceptance criteria

1. encodeUUIDShorthand(uuidString, encodingName, options?) exists and supports a boolean reverse option with a documented default; decode mirrors that behaviour.
2. Tests assert both reverse modes and that decode(encode(uuid)) returns the original canonical UUID when appropriate.
3. CLI and web demo use these helpers and show consistent results with the library API.
