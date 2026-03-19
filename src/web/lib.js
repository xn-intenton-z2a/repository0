// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/web/lib.js — Browser entry point, re-exports from the library.
export {
  name,
  version,
  description,
  getIdentity,
  createEncoding,
  listEncodings,
  encode,
  decode,
  encodeUUID,
  decodeUUID
} from "../lib/main.js";
