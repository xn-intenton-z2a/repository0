# ENCODING_LIST

Status: Done

Overview

listEncodings() returns metadata for each registered encoding to support UI, CLI and docs: name, charsetSize, bitsPerChar and charset string.

Acceptance criteria

1. listEncodings() returns an array where each object contains: name (string), charsetSize (number), bitsPerChar (number) and charset (string).
2. The array ordering is deterministic and intended to be sorted by bitsPerChar descending when used by CLI and docs.
3. JSON outputs produced by CLI or example scripts match the live listEncodings() result.
