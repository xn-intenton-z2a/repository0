// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// config-loader.js — Thin re-export from shared src/copilot/config.js
//
// Phase 4: Configuration logic now lives in src/copilot/config.js.
// This file re-exports for backwards compatibility with existing imports.

export { loadConfig, getWritablePaths } from "../../copilot/config.js";
