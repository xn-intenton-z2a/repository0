// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// tools.js — Thin re-export from shared src/copilot/tools.js
//
// Phase 4: Tool definitions now live in src/copilot/tools.js.
// This file re-exports for backwards compatibility.
//
// Note: The shared tools.js uses a (writablePaths, logger, defineToolFn) signature.
// The old Actions tools.js used (writablePaths) with @actions/core and @github/copilot-sdk.
// This wrapper adapts the signature for existing callers in copilot.js.

import * as core from "@actions/core";
import { defineTool } from "@github/copilot-sdk";
import { createAgentTools as _createAgentTools, isPathWritable } from "../../copilot/tools.js";

const actionsLogger = {
  info: (...args) => core.info(args.join(" ")),
  warning: (...args) => core.warning(args.join(" ")),
  error: (...args) => core.error(args.join(" ")),
  debug: (...args) => core.debug(args.join(" ")),
};

export function createAgentTools(writablePaths) {
  return _createAgentTools(writablePaths, actionsLogger, defineTool);
}

export { isPathWritable };
