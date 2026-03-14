// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// src/copilot/logger.js — Logger abstraction for shared Copilot module
//
// In Actions: wraps @actions/core. In CLI: wraps console.

/**
 * Create a logger instance.
 * @param {"actions"|"console"} [backend="console"]
 * @returns {{ info: Function, warning: Function, error: Function, debug: Function }}
 */
export function createLogger(backend = "console") {
  if (backend === "console") {
    return {
      info: (...args) => console.log(...args),
      warning: (...args) => console.warn(...args),
      error: (...args) => console.error(...args),
      debug: () => {},
    };
  }
  // "actions" backend — lazy-load @actions/core
  let _core;
  const getCore = () => {
    if (!_core) {
      try {
        // Dynamic require — only available in Actions runtime
        _core = require("@actions/core");
      } catch {
        _core = { info: console.log, warning: console.warn, error: console.error, debug: () => {} };
      }
    }
    return _core;
  };
  return {
    info: (...args) => getCore().info(args.join(" ")),
    warning: (...args) => getCore().warning(args.join(" ")),
    error: (...args) => getCore().error(args.join(" ")),
    debug: (...args) => getCore().debug(args.join(" ")),
  };
}

/** Default console logger */
export const defaultLogger = createLogger("console");
