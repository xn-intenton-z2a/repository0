// config-loader.js — Parse agentic-lib.yml and resolve paths
//
// Reads the agent configuration file and provides a structured config object
// with resolved paths, limits, and execution parameters.

import { readFileSync } from "fs";
import yaml from "js-yaml";

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

/**
 * Load and parse the agentic-lib.yml configuration file.
 *
 * @param {string} configPath - Path to the YAML config file
 * @returns {AgenticConfig} Parsed configuration object
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

export function loadConfig(configPath) {
  const raw = readFileSync(configPath, "utf8");
  const config = yaml.load(raw);
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
