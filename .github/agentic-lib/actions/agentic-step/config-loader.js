// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// config-loader.js — Parse agentic-lib.toml and resolve paths
//
// TOML-only configuration. The config file is required.
// All defaults are defined here in one place.

import { readFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { parse as parseToml } from "smol-toml";

/**
 * @typedef {Object} PathConfig
 * @property {string} path - The filesystem path
 * @property {string[]} permissions - Access permissions (e.g. ['write'])
 * @property {number} [limit] - Maximum number of files allowed
 */

/**
 * @typedef {Object} AgenticConfig
 * @property {string} schedule - Schedule identifier
 * @property {string} supervisor - Supervisor frequency (off | weekly | daily | hourly | continuous)
 * @property {string} model - Copilot SDK model for LLM requests
 * @property {Object<string, PathConfig>} paths - Mapped paths with permissions
 * @property {string} buildScript - Build command
 * @property {string} testScript - Test command
 * @property {string} mainScript - Main entry command
 * @property {number} featureDevelopmentIssuesWipLimit - Max concurrent feature issues
 * @property {number} maintenanceIssuesWipLimit - Max concurrent maintenance issues
 * @property {number} attemptsPerBranch - Max attempts per branch
 * @property {number} attemptsPerIssue - Max attempts per issue
 * @property {Object} seeding - Seed file configuration
 * @property {Object} intentionBot - Bot configuration
 * @property {boolean} tdd - Whether TDD mode is enabled
 * @property {string[]} writablePaths - All paths with write permission
 * @property {string[]} readOnlyPaths - All paths without write permission
 */

// Keys whose paths are writable by agents
const WRITABLE_KEYS = ["source", "tests", "features", "dependencies", "docs", "readme", "examples"];

// Default paths — every key that task handlers might access
const PATH_DEFAULTS = {
  mission: "MISSION.md",
  source: "src/lib/",
  tests: "tests/unit/",
  features: "features/",
  docs: "docs/",
  examples: "examples/",
  readme: "README.md",
  dependencies: "package.json",
  library: "library/",
  librarySources: "SOURCES.md",
  contributing: "CONTRIBUTING.md",
};

// Default limits for path-specific constraints
const LIMIT_DEFAULTS = {
  features: 4,
  library: 32,
};

/**
 * Load configuration from agentic-lib.toml.
 *
 * If configPath ends in .toml, it is used directly.
 * Otherwise, the project root is derived (3 levels up from configPath)
 * and agentic-lib.toml is loaded from there.
 *
 * @param {string} configPath - Path to config file or YAML path (for project root derivation)
 * @returns {AgenticConfig} Parsed configuration object
 * @throws {Error} If no TOML config file is found
 */
export function loadConfig(configPath) {
  let tomlPath;
  if (configPath.endsWith(".toml")) {
    tomlPath = configPath;
  } else {
    const configDir = dirname(configPath);
    const projectRoot = join(configDir, "..", "..", "..");
    tomlPath = join(projectRoot, "agentic-lib.toml");
  }

  if (!existsSync(tomlPath)) {
    throw new Error(`Config file not found: ${tomlPath}. Create agentic-lib.toml in the project root.`);
  }

  const toml = parseToml(readFileSync(tomlPath, "utf8"));

  // Merge TOML paths with defaults, normalising library-sources → librarySources
  const rawPaths = { ...toml.paths };
  if (rawPaths["library-sources"]) {
    rawPaths.librarySources = rawPaths["library-sources"];
    delete rawPaths["library-sources"];
  }
  const mergedPaths = { ...PATH_DEFAULTS, ...rawPaths };

  // Build path objects with permissions
  const paths = {};
  const writablePaths = [];
  const readOnlyPaths = [];

  for (const [key, value] of Object.entries(mergedPaths)) {
    const isWritable = WRITABLE_KEYS.includes(key);
    paths[key] = { path: value, permissions: isWritable ? ["write"] : [] };
    if (isWritable) {
      writablePaths.push(value);
    } else {
      readOnlyPaths.push(value);
    }
  }

  // Apply limits from [limits] section or use defaults
  const limits = toml.limits || {};
  paths.features.limit = limits["features-limit"] || LIMIT_DEFAULTS.features;
  paths.library.limit = limits["library-limit"] || LIMIT_DEFAULTS.library;

  const execution = toml.execution || {};
  const bot = toml.bot || {};

  return {
    schedule: toml.schedule?.tier || "schedule-1",
    supervisor: toml.schedule?.supervisor || "daily",
    model: toml.schedule?.model || "gpt-5-mini",
    paths,
    buildScript: execution.build || "npm run build",
    testScript: execution.test || "npm test",
    mainScript: execution.start || "npm run start",
    featureDevelopmentIssuesWipLimit: limits["feature-issues"] || 2,
    maintenanceIssuesWipLimit: limits["maintenance-issues"] || 1,
    attemptsPerBranch: limits["attempts-per-branch"] || 3,
    attemptsPerIssue: limits["attempts-per-issue"] || 2,
    seeding: toml.seeding || {},
    intentionBot: {
      intentionFilepath: bot["log-file"] || "intentïon.md",
    },
    tdd: toml.tdd === true,
    writablePaths,
    readOnlyPaths,
  };
}

/**
 * Get the writable paths from config, optionally overridden by an input string.
 *
 * @param {AgenticConfig} config - Parsed config
 * @param {string} [override] - Semicolon-separated override paths
 * @returns {string[]} Array of writable paths
 */
export function getWritablePaths(config, override) {
  if (override) {
    return override
      .split(";")
      .map((p) => p.trim())
      .filter(Boolean);
  }
  return config.writablePaths;
}
