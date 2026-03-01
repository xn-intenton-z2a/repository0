// config-loader.js — Parse agentic-lib.toml or agentic-lib.yml and resolve paths
//
// Reads the agent configuration file and provides a structured config object
// with resolved paths, limits, and execution parameters.
//
// Supports two formats:
//   1. agentic-lib.toml (preferred) — flat TOML with [sections]
//   2. agentic-lib.yml (legacy) — YAML with nested keys

import { readFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import yaml from "js-yaml";
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

function resolvePaths(configPaths) {
  const paths = {};
  const writablePaths = [];
  const readOnlyPaths = [];

  for (const [key, value] of Object.entries(configPaths || {})) {
    if (typeof value === "string") {
      paths[key] = { path: value, permissions: [] };
      readOnlyPaths.push(value);
    } else if (value && value.path) {
      paths[key] = {
        path: value.path,
        permissions: value.permissions || [],
        limit: value.limit,
      };
      if (value.permissions && value.permissions.includes("write")) {
        writablePaths.push(value.path);
      } else {
        readOnlyPaths.push(value.path);
      }
    } else if (value && value.paths) {
      paths[key] = { paths: value.paths, permissions: [] };
      readOnlyPaths.push(...value.paths);
    }
  }

  return { paths, writablePaths, readOnlyPaths };
}

/**
 * Convert a TOML config object (flat [sections]) into the internal format
 * that matches the YAML config structure.
 */
function normaliseToml(toml) {
  const config = {};

  // [schedule]
  if (toml.schedule) {
    config.schedule = toml.schedule.tier || toml.schedule;
  }

  // [paths] → convert flat key=value into path objects with write permissions
  if (toml.paths) {
    config.paths = {};
    // Known writable paths (paths that agents may modify)
    const WRITABLE_KEYS = [
      "source",
      "targetSourcePath",
      "tests",
      "targetTestsPath",
      "features",
      "featuresPath",
      "dependencies",
      "dependenciesFilepath",
      "docs",
      "documentationPath",
      "readme",
      "readmeFilepath",
    ];
    for (const [key, value] of Object.entries(toml.paths)) {
      const isWritable = WRITABLE_KEYS.includes(key);
      config.paths[key] = {
        path: value,
        permissions: isWritable ? ["write"] : [],
      };
    }
  }

  // [execution]
  if (toml.execution) {
    config.buildScript = toml.execution.build;
    config.testScript = toml.execution.test;
    config.mainScript = toml.execution.start;
  }

  // [limits]
  if (toml.limits) {
    config.featureDevelopmentIssuesWipLimit = toml.limits["feature-issues"];
    config.maintenanceIssuesWipLimit = toml.limits["maintenance-issues"];
    config.attemptsPerBranch = toml.limits["attempts-per-branch"];
    config.attemptsPerIssue = toml.limits["attempts-per-issue"];
  }

  // [bot]
  if (toml.bot) {
    config.intentionBot = {
      intentionFilepath: toml.bot["log-file"],
    };
  }

  return config;
}

/**
 * Parse a config file — auto-detects TOML vs YAML by extension.
 */
function parseConfigFile(configPath) {
  const raw = readFileSync(configPath, "utf8");
  if (configPath.endsWith(".toml")) {
    return normaliseToml(parseToml(raw));
  }
  return yaml.load(raw);
}

/**
 * Load configuration, trying agentic-lib.toml first, then falling back to
 * the provided configPath (typically agentic-lib.yml).
 *
 * @param {string} configPath - Path to the YAML config file (fallback)
 * @returns {AgenticConfig} Parsed configuration object
 */
export function loadConfig(configPath) {
  // Try TOML in the project root (two levels up from .github/agentic-lib/agents/)
  const configDir = dirname(configPath);
  const projectRoot = join(configDir, "..", "..", "..");
  const tomlPath = join(projectRoot, "agentic-lib.toml");

  let config;
  if (existsSync(tomlPath)) {
    config = parseConfigFile(tomlPath);
  } else {
    config = parseConfigFile(configPath);
  }

  const { paths, writablePaths, readOnlyPaths } = resolvePaths(config.paths);

  return {
    schedule: config.schedule || "schedule-1",
    paths,
    buildScript: config.buildScript || "npm run build",
    testScript: config.testScript || "npm test",
    mainScript: config.mainScript || "npm run start",
    featureDevelopmentIssuesWipLimit: config.featureDevelopmentIssuesWipLimit || 2,
    maintenanceIssuesWipLimit: config.maintenanceIssuesWipLimit || 1,
    attemptsPerBranch: config.attemptsPerBranch || 3,
    attemptsPerIssue: config.attemptsPerIssue || 2,
    seeding: config.seeding || {},
    intentionBot: config.intentionBot || {},
    tdd: config.tdd === true,
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
