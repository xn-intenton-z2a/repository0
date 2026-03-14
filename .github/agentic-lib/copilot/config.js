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
 * @property {string} testScript - Self-contained test command (e.g. "npm ci && npm test")
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
const WRITABLE_KEYS = ["source", "tests", "behaviour", "features", "dependencies", "docs", "readme", "examples", "web"];

// Default paths — every key that task handlers might access
const PATH_DEFAULTS = {
  mission: "MISSION.md",
  source: "src/lib/",
  tests: "tests/unit/",
  behaviour: "tests/behaviour/",
  features: "features/",
  docs: "docs/",
  examples: "examples/",
  readme: "README.md",
  dependencies: "package.json",
  library: "library/",
  librarySources: "SOURCES.md",
  contributing: "CONTRIBUTING.md",
  web: "src/web/",
};

// Default limits for path-specific constraints
const LIMIT_DEFAULTS = {
  features: 4,
  library: 32,
};

// Fallback profile defaults — used only when [profiles.*] is missing from TOML.
// The canonical source of truth is the [profiles.*] sections in agentic-lib.toml.
const FALLBACK_TUNING = {
  reasoningEffort: "medium",
  infiniteSessions: true,
  transformationBudget: 32,
  issuesScan: 20,
  staleDays: 30,
  discussionComments: 10,
};

const FALLBACK_LIMITS = {
  featureIssues: 2,
  maintenanceIssues: 1,
  attemptsPerBranch: 3,
  attemptsPerIssue: 2,
  featuresLimit: 4,
  libraryLimit: 32,
};

/**
 * Parse a TOML profile section into tuning defaults (camelCase keys).
 */
function parseTuningProfile(profileSection) {
  if (!profileSection) return null;
  return {
    reasoningEffort: profileSection["reasoning-effort"] || "medium",
    infiniteSessions: profileSection["infinite-sessions"] ?? true,
    transformationBudget: profileSection["transformation-budget"] || 32,
    issuesScan: profileSection["max-issues"] || 20,
    staleDays: profileSection["stale-days"] || 30,
    discussionComments: profileSection["max-discussion-comments"] || 10,
  };
}

/**
 * Parse a TOML profile section into limits defaults (camelCase keys).
 */
function parseLimitsProfile(profileSection) {
  if (!profileSection) return null;
  return {
    featureIssues: profileSection["max-feature-issues"] || 2,
    maintenanceIssues: profileSection["max-maintenance-issues"] || 1,
    attemptsPerBranch: profileSection["max-attempts-per-branch"] || 3,
    attemptsPerIssue: profileSection["max-attempts-per-issue"] || 2,
    featuresLimit: profileSection["features-limit"] || 4,
    libraryLimit: profileSection["library-limit"] || 32,
  };
}

/**
 * Read package.json from the project root, returning empty string if not found.
 * @param {string} tomlPath - Path to the TOML config (used to derive project root)
 * @param {string} depsRelPath - Relative path to package.json (from config)
 * @returns {string} Raw package.json content or empty string
 */
function readPackageJson(tomlPath, depsRelPath) {
  try {
    const projectRoot = dirname(tomlPath);
    const pkgPath = join(projectRoot, depsRelPath);
    return existsSync(pkgPath) ? readFileSync(pkgPath, "utf8") : "";
  } catch {
    return "";
  }
}

/**
 * Resolve tuning configuration: start from profile defaults, apply explicit overrides.
 * @param {Object} tuningSection - The [tuning] section from TOML
 * @param {Object} [profilesSection] - The [profiles] section from TOML (source of truth)
 */
function resolveTuning(tuningSection, profilesSection) {
  const profileName = tuningSection.profile || "recommended";
  const tomlProfile = profilesSection?.[profileName];
  const profile = parseTuningProfile(tomlProfile) || FALLBACK_TUNING;
  const tuning = { ...profile, profileName };

  // "none" explicitly disables reasoning-effort regardless of profile
  if (tuningSection["reasoning-effort"]) {
    tuning.reasoningEffort = tuningSection["reasoning-effort"] === "none" ? "" : tuningSection["reasoning-effort"];
  }
  if (tuningSection["infinite-sessions"] === true || tuningSection["infinite-sessions"] === false) {
    tuning.infiniteSessions = tuningSection["infinite-sessions"];
  }
  const numericOverrides = {
    "transformation-budget": "transformationBudget",
    "max-issues": "issuesScan",
    "stale-days": "staleDays",
    "max-discussion-comments": "discussionComments",
  };
  for (const [tomlKey, jsKey] of Object.entries(numericOverrides)) {
    if (tuningSection[tomlKey] > 0) tuning[jsKey] = tuningSection[tomlKey];
  }

  return tuning;
}

/**
 * Resolve limits configuration: start from profile defaults, apply explicit overrides.
 * @param {Object} limitsSection - The [limits] section from TOML
 * @param {string} profileName - Active profile name
 * @param {Object} [profilesSection] - The [profiles] section from TOML (source of truth)
 */
function resolveLimits(limitsSection, profileName, profilesSection) {
  const tomlProfile = profilesSection?.[profileName];
  const profile = parseLimitsProfile(tomlProfile) || FALLBACK_LIMITS;
  return {
    featureIssues: limitsSection["max-feature-issues"] || profile.featureIssues,
    maintenanceIssues: limitsSection["max-maintenance-issues"] || profile.maintenanceIssues,
    attemptsPerBranch: limitsSection["max-attempts-per-branch"] || profile.attemptsPerBranch,
    attemptsPerIssue: limitsSection["max-attempts-per-issue"] || profile.attemptsPerIssue,
    featuresLimit: limitsSection["features-limit"] || profile.featuresLimit,
    libraryLimit: limitsSection["library-limit"] || profile.libraryLimit,
  };
}

/**
 * Load configuration from agentic-lib.toml.
 *
 * If configPath ends in .toml, it is used directly.
 * Otherwise (legacy .yml path), the project root is derived (3 levels up
 * from configPath) and agentic-lib.toml is loaded from there.
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

  const rawToml = readFileSync(tomlPath, "utf8");
  const toml = parseToml(rawToml);

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

  const profilesSection = toml.profiles || {};
  const tuning = resolveTuning(toml.tuning || {}, profilesSection);
  const limitsSection = toml.limits || {};
  const resolvedLimits = resolveLimits(limitsSection, tuning.profileName, profilesSection);

  // Apply resolved limits to path objects
  paths.features.limit = resolvedLimits.featuresLimit;
  paths.library.limit = resolvedLimits.libraryLimit;

  const execution = toml.execution || {};
  const bot = toml.bot || {};

  // Mission-complete thresholds (with safe defaults)
  // C6: Removed minDedicatedTests and requireDedicatedTests
  const mc = toml["mission-complete"] || {};
  const missionCompleteThresholds = {
    minResolvedIssues: mc["min-resolved-issues"] ?? 3,
    maxSourceTodos: mc["max-source-todos"] ?? 0,
  };

  return {
    supervisor: toml.schedule?.supervisor || "daily",
    model: toml.tuning?.model || toml.schedule?.model || "gpt-5-mini",
    tuning,
    paths,
    testScript: execution.test || "npm ci && npm test",
    featureDevelopmentIssuesWipLimit: resolvedLimits.featureIssues,
    maintenanceIssuesWipLimit: resolvedLimits.maintenanceIssues,
    attemptsPerBranch: resolvedLimits.attemptsPerBranch,
    attemptsPerIssue: resolvedLimits.attemptsPerIssue,
    transformationBudget: tuning.transformationBudget,
    seeding: toml.seeding || {},
    intentionBot: {
      logPrefix: bot["log-prefix"] || "agent-log-",
      logBranch: bot["log-branch"] || "agentic-lib-logs",
      screenshotFile: bot["screenshot-file"] || "SCREENSHOT_INDEX.png",
    },
    init: toml.init || null,
    tdd: toml.tdd === true,
    missionCompleteThresholds,
    maxTokensPerMaintain: resolvedLimits.maxTokensPerMaintain || 200000,
    writablePaths,
    readOnlyPaths,
    configToml: rawToml,
    packageJson: readPackageJson(tomlPath, mergedPaths.dependencies),
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
