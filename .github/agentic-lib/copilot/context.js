// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// src/copilot/context.js — Context gathering and user prompt assembly
//
// Builds user prompts for each agent type from available local and GitHub context.
// Works with or without GitHub data — local-only context is always sufficient.

import { resolve } from "path";
import { execSync } from "child_process";
import { scanDirectory, readOptionalFile, extractFeatureSummary, formatPathsSection, summariseIssue, filterIssues } from "./session.js";
import { readCumulativeCost } from "./telemetry.js";
import { defaultLogger } from "./logger.js";

/**
 * Per-agent refinements that control context precision and prompt quality.
 * These restore the tight scoping that existed in the old per-task handlers.
 */
const AGENT_REFINEMENTS = {
  "agent-issue-resolution": {
    sortFeatures: "incomplete-first",
    includeWebFiles: true,
    highlightTargetIssue: true,
    trackPromptBudget: true,
  },
  "agent-apply-fix": {
    emphasizeTestOutput: true,
  },
  "agent-maintain-features": {
    sortFeatures: "incomplete-first",
    injectLimit: "features",
  },
  "agent-maintain-library": {
    checkSourcesForUrls: true,
    injectLimit: "library",
  },
};

/**
 * Context requirements per agent. Defines what context each agent needs.
 * All fields are optional — the builder includes whatever is available.
 */
const AGENT_CONTEXT = {
  "agent-iterate": { mission: true, source: true, tests: true, features: true },
  "agent-discovery": { source: true, tests: true },
  "agent-issue-resolution": { mission: true, source: true, tests: true, features: true, issues: true },
  "agent-apply-fix": { source: true, tests: true },
  "agent-maintain-features": { mission: true, features: true, issues: true },
  "agent-maintain-library": { library: true, librarySources: true },
  "agent-ready-issue": { mission: true, features: true, issues: true },
  "agent-review-issue": { source: true, tests: true, issues: true },
  "agent-discussion-bot": { mission: true, features: true },
  "agent-supervisor": { mission: true, features: true, issues: true },
  "agent-director": { mission: true, features: true, issues: true, source: true, tests: true },
};

/**
 * Gather local context from the workspace filesystem.
 *
 * @param {string} workspacePath - Path to the workspace
 * @param {Object} config - Parsed agentic config (from config.js)
 * @param {Object} [options]
 * @param {Object} [options.logger]
 * @returns {Object} Context object with all available local data
 */
export function gatherLocalContext(workspacePath, config, { logger = defaultLogger } = {}) {
  const wsPath = resolve(workspacePath);
  const paths = config.paths || {};
  const tuning = config.tuning || {};

  const context = {};

  // Mission
  const missionPath = paths.mission?.path || "MISSION.md";
  context.mission = readOptionalFile(resolve(wsPath, missionPath));

  // Source files
  const sourcePath = paths.source?.path || "src/lib/";
  const sourceDir = resolve(wsPath, sourcePath);
  context.sourceFiles = scanDirectory(sourceDir, [".js", ".ts", ".mjs", ".cjs"], {
    fileLimit: tuning.sourceScan || 10,
    contentLimit: tuning.sourceContent || 5000,
    sortByMtime: true,
    clean: true,
    outline: true,
  }, logger);

  // Test files
  const testsPath = paths.tests?.path || "tests/";
  const testsDir = resolve(wsPath, testsPath);
  context.testFiles = scanDirectory(testsDir, [".js", ".ts", ".test.js", ".test.ts", ".spec.js"], {
    fileLimit: tuning.sourceScan || 10,
    contentLimit: tuning.testContent || 3000,
    sortByMtime: true,
    clean: true,
  }, logger);

  // Features
  const featuresPath = paths.features?.path || "features/";
  const featuresDir = resolve(wsPath, featuresPath);
  const featureFiles = scanDirectory(featuresDir, [".md"], {
    fileLimit: tuning.featuresScan || 10,
    sortByMtime: true,
  }, logger);
  context.features = featureFiles.map((f) => extractFeatureSummary(f.content, f.name));

  // Library
  const libraryPath = paths.library?.path || "library/";
  const libraryDir = resolve(wsPath, libraryPath);
  context.libraryFiles = scanDirectory(libraryDir, [".md"], {
    fileLimit: 10,
    contentLimit: tuning.documentSummary || 2000,
  }, logger);

  // Library sources
  const sourcesPath = paths.librarySources?.path || "SOURCES.md";
  context.librarySources = readOptionalFile(resolve(wsPath, sourcesPath));

  // Web files
  const webPath = paths.web?.path || "src/web/";
  const webDir = resolve(wsPath, webPath);
  context.webFiles = scanDirectory(webDir, [".html", ".css", ".js"], {
    fileLimit: tuning.sourceScan || 10,
    contentLimit: tuning.sourceContent || 5000,
    sortByMtime: true,
    clean: true,
  }, logger);

  // Contributing guide
  const contributingPath = paths.contributing?.path || "CONTRIBUTING.md";
  context.contributing = readOptionalFile(resolve(wsPath, contributingPath), 2000);

  // Package.json
  context.packageJson = config.packageJson || readOptionalFile(resolve(wsPath, "package.json"), 3000);

  // Config TOML
  context.configToml = config.configToml || "";

  // Paths
  context.writablePaths = config.writablePaths || [];
  context.readOnlyPaths = config.readOnlyPaths || [];

  // Initial test output
  try {
    context.testOutput = execSync("npm test 2>&1", { cwd: wsPath, encoding: "utf8", timeout: 120000 });
  } catch (err) {
    context.testOutput = `STDOUT:\n${err.stdout || ""}\nSTDERR:\n${err.stderr || ""}`;
  }

  return context;
}

/**
 * Fetch GitHub context using the `gh` CLI.
 * Returns null fields when gh is unavailable or data can't be fetched.
 *
 * @param {Object} options
 * @param {number} [options.issueNumber] - Issue number to fetch
 * @param {number} [options.prNumber] - PR number to fetch
 * @param {string} [options.discussionUrl] - Discussion URL to fetch
 * @param {string} [options.workspacePath] - CWD for gh commands
 * @param {Object} [options.logger]
 * @returns {Object} GitHub context
 */
export function gatherGitHubContext({ issueNumber, prNumber, discussionUrl, workspacePath, logger = defaultLogger } = {}) {
  const github = { issues: [], issueDetail: null, prDetail: null, discussionDetail: null };
  const cwd = workspacePath || process.cwd();

  try {
    // Fetch open issues list
    const issuesJson = execSync("gh issue list --state open --limit 20 --json number,title,labels,body,createdAt,updatedAt", {
      cwd,
      encoding: "utf8",
      timeout: 30000,
    });
    const rawIssues = JSON.parse(issuesJson);
    github.issues = filterIssues(rawIssues.map((i) => ({
      number: i.number,
      title: i.title,
      body: i.body,
      labels: i.labels,
      created_at: i.createdAt,
      updated_at: i.updatedAt,
    })));
  } catch (err) {
    logger.info(`[context] Could not fetch issues: ${err.message}`);
  }

  // Fetch specific issue detail
  if (issueNumber) {
    try {
      const issueJson = execSync(`gh issue view ${issueNumber} --json number,title,body,labels,comments,createdAt`, {
        cwd,
        encoding: "utf8",
        timeout: 30000,
      });
      github.issueDetail = JSON.parse(issueJson);
    } catch (err) {
      logger.info(`[context] Could not fetch issue #${issueNumber}: ${err.message}`);
    }
  }

  // Fetch specific PR detail
  if (prNumber) {
    try {
      const prJson = execSync(`gh pr view ${prNumber} --json number,title,body,files,statusCheckRollup`, {
        cwd,
        encoding: "utf8",
        timeout: 30000,
      });
      github.prDetail = JSON.parse(prJson);
    } catch (err) {
      logger.info(`[context] Could not fetch PR #${prNumber}: ${err.message}`);
    }
  }

  // Fetch discussion
  if (discussionUrl) {
    try {
      // Extract discussion number from URL
      const match = discussionUrl.match(/discussions\/(\d+)/);
      if (match) {
        const num = match[1];
        const discussionJson = execSync(
          `gh api graphql -f query='{ repository(owner:"{owner}", name:"{repo}") { discussion(number: ${num}) { title body comments(last: 10) { nodes { body author { login } createdAt } } } } }'`,
          { cwd, encoding: "utf8", timeout: 30000 },
        );
        github.discussionDetail = JSON.parse(discussionJson);
      }
    } catch (err) {
      logger.info(`[context] Could not fetch discussion: ${err.message}`);
    }
  }

  return github;
}

/**
 * Build a user prompt for the given agent from available context.
 *
 * Returns an object with the assembled prompt and optional promptBudget metadata.
 * The prompt includes config-driven limits and per-agent refinements that restore
 * the context precision from the old per-task handlers.
 *
 * @param {string} agentName - Agent name (e.g. "agent-iterate")
 * @param {Object} localContext - From gatherLocalContext()
 * @param {Object} [githubContext] - From gatherGitHubContext() (optional)
 * @param {Object} [options]
 * @param {Object} [options.tuning] - Tuning config for limits
 * @param {Object} [options.config] - Full parsed config (for limits injection)
 * @returns {{ prompt: string, promptBudget: Array|null }}
 */
export function buildUserPrompt(agentName, localContext, githubContext, { tuning, config } = {}) {
  const needs = AGENT_CONTEXT[agentName] || AGENT_CONTEXT["agent-iterate"];
  const refinements = AGENT_REFINEMENTS[agentName] || {};
  const sections = [];
  const promptBudget = refinements.trackPromptBudget ? [] : null;

  // Target issue — placed prominently when highlightTargetIssue is set
  if (refinements.highlightTargetIssue && githubContext?.issueDetail) {
    const issue = githubContext.issueDetail;
    const issueSection = [
      `# Target Issue #${issue.number}: ${issue.title}`,
      issue.body || "(no description)",
      `Labels: ${(issue.labels || []).map((l) => typeof l === "string" ? l : l.name).join(", ") || "none"}`,
      "",
      "**Focus your transformation on resolving this specific issue.**",
    ];
    if (issue.comments?.length > 0) {
      issueSection.push("\n## Comments");
      for (const c of issue.comments.slice(-5)) {
        issueSection.push(`**${c.author?.login || "unknown"}**: ${c.body}`);
      }
    }
    const text = issueSection.join("\n");
    sections.push(text);
    if (promptBudget) promptBudget.push({ section: "target-issue", size: text.length, files: "1", notes: "" });
  }

  // Mission
  if (needs.mission && localContext.mission) {
    const text = `# Mission\n\n${localContext.mission}`;
    sections.push(text);
    if (promptBudget) promptBudget.push({ section: "mission", size: localContext.mission.length, files: "1", notes: "full" });
  }

  // Current test state — emphasised for fix-code agent
  if (localContext.testOutput) {
    const testPreview = localContext.testOutput.substring(0, 4000);
    if (refinements.emphasizeTestOutput) {
      sections.push(`# Failing Test Output\n\nThe tests are currently failing. Fix the root cause.\n\n\`\`\`\n${testPreview}\n\`\`\``);
    } else {
      sections.push(`# Current Test State\n\n\`\`\`\n${testPreview}\n\`\`\``);
    }
  }

  // Source files
  if (needs.source && localContext.sourceFiles?.length > 0) {
    const sourceSection = [`# Source Files (${localContext.sourceFiles.length})`];
    for (const f of localContext.sourceFiles) {
      sourceSection.push(`## ${f.name}\n\`\`\`\n${f.content}\n\`\`\``);
    }
    const text = sourceSection.join("\n\n");
    sections.push(text);
    if (promptBudget) promptBudget.push({ section: "source", size: text.length, files: `${localContext.sourceFiles.length}`, notes: "" });
  }

  // Web files — only when refinements request it
  if (refinements.includeWebFiles && localContext.webFiles?.length > 0) {
    const webSection = [`# Website Files (${localContext.webFiles.length})`];
    for (const f of localContext.webFiles) {
      webSection.push(`## ${f.name}\n\`\`\`\n${f.content}\n\`\`\``);
    }
    const text = webSection.join("\n\n");
    sections.push(text);
    if (promptBudget) promptBudget.push({ section: "web", size: text.length, files: `${localContext.webFiles.length}`, notes: "" });
  }

  // Test files
  if (needs.tests && localContext.testFiles?.length > 0) {
    const testSection = [`# Test Files (${localContext.testFiles.length})`];
    for (const f of localContext.testFiles) {
      testSection.push(`## ${f.name}\n\`\`\`\n${f.content}\n\`\`\``);
    }
    const text = testSection.join("\n\n");
    sections.push(text);
    if (promptBudget) promptBudget.push({ section: "tests", size: text.length, files: `${localContext.testFiles.length}`, notes: "" });
  }

  // Features — sorted incomplete-first when refinements request it
  if (needs.features && localContext.features?.length > 0) {
    let features = [...localContext.features];
    if (refinements.sortFeatures === "incomplete-first") {
      features.sort((a, b) => {
        const aIncomplete = /Remaining:/.test(a) || /\[ \]/.test(a) ? 0 : 1;
        const bIncomplete = /Remaining:/.test(b) || /\[ \]/.test(b) ? 0 : 1;
        return aIncomplete - bIncomplete;
      });
    }

    const limit = config?.paths?.features?.limit;
    const header = limit
      ? `# Features (${features.length}/${limit} max)`
      : `# Features (${features.length})`;
    const featureSection = [header];
    for (const f of features) {
      featureSection.push(f);
    }
    const text = featureSection.join("\n\n");
    sections.push(text);
    if (promptBudget) promptBudget.push({ section: "features", size: text.length, files: `${features.length}`, notes: "" });
  }

  // Library
  if (needs.library && localContext.libraryFiles?.length > 0) {
    const libLimit = config?.paths?.library?.limit;
    const header = libLimit
      ? `# Library Files (${localContext.libraryFiles.length}/${libLimit} max)`
      : `# Library Files (${localContext.libraryFiles.length})`;
    const libSection = [header];
    for (const f of localContext.libraryFiles) {
      libSection.push(`## ${f.name}\n${f.content}`);
    }
    sections.push(libSection.join("\n\n"));
  }

  // Library sources — vary strategy based on URL presence
  if (needs.librarySources && localContext.librarySources) {
    if (refinements.checkSourcesForUrls) {
      const hasUrls = /https?:\/\//.test(localContext.librarySources);
      if (!hasUrls) {
        sections.push(`# Sources\n\n${localContext.librarySources}\n\nPopulate SOURCES.md with 3-8 relevant reference URLs aligned with the mission.`);
      } else {
        sections.push(`# Sources\n\n${localContext.librarySources}`);
      }
    } else {
      sections.push(`# Sources\n\n${localContext.librarySources}`);
    }
  }

  // Issues (from GitHub context) — not duplicated if target issue already shown
  if (needs.issues && githubContext?.issues?.length > 0) {
    const issueSection = [`# Open Issues (${githubContext.issues.length})`];
    for (const issue of githubContext.issues) {
      issueSection.push(summariseIssue(issue, tuning?.issueBodyLimit || 500));
    }
    const text = issueSection.join("\n\n");
    sections.push(text);
    if (promptBudget) promptBudget.push({ section: "issues", size: text.length, files: `${githubContext.issues.length}`, notes: "" });
  }

  // Specific issue detail (only if not already highlighted as target issue)
  if (!refinements.highlightTargetIssue && githubContext?.issueDetail) {
    const issue = githubContext.issueDetail;
    const issueSection = [`# Issue #${issue.number}: ${issue.title}\n\n${issue.body || "(no body)"}`];
    if (issue.comments?.length > 0) {
      issueSection.push("## Comments");
      for (const c of issue.comments.slice(-10)) {
        issueSection.push(`**${c.author?.login || "unknown"}**: ${c.body}`);
      }
    }
    sections.push(issueSection.join("\n\n"));
  }

  // Specific PR detail
  if (githubContext?.prDetail) {
    const pr = githubContext.prDetail;
    const prSection = [`# PR #${pr.number}: ${pr.title}\n\n${pr.body || "(no body)"}`];
    if (pr.files?.length > 0) {
      prSection.push(`## Changed Files\n${pr.files.map((f) => `- ${f.path}`).join("\n")}`);
    }
    sections.push(prSection.join("\n\n"));
  }

  // File paths section
  if (localContext.writablePaths?.length > 0 || localContext.readOnlyPaths?.length > 0) {
    sections.push(formatPathsSection(
      localContext.writablePaths || [],
      localContext.readOnlyPaths || [],
      { configToml: localContext.configToml, packageJson: localContext.packageJson },
    ));
  }

  // Limits section — inject concrete numbers from agentic-lib.toml
  if (config) {
    const limitsLines = ["# Limits (from agentic-lib.toml)", ""];
    const budget = config.transformationBudget || 0;
    const featLimit = config.paths?.features?.limit;
    const libLimit = config.paths?.library?.limit;

    if (featLimit) limitsLines.push(`- Maximum feature files: ${featLimit}`);
    if (libLimit) limitsLines.push(`- Maximum library documents: ${libLimit}`);
    if (budget > 0) {
      const intentionPath = config.intentionBot?.intentionFilepath;
      const cumulativeCost = readCumulativeCost(intentionPath);
      const remaining = Math.max(0, budget - cumulativeCost);
      limitsLines.push(`- Transformation budget: ${budget} (used: ${cumulativeCost}, remaining: ${remaining})`);
    }
    if (config.featureDevelopmentIssuesWipLimit) limitsLines.push(`- Maximum concurrent feature issues: ${config.featureDevelopmentIssuesWipLimit}`);
    if (config.maintenanceIssuesWipLimit) limitsLines.push(`- Maximum concurrent maintenance issues: ${config.maintenanceIssuesWipLimit}`);
    if (config.attemptsPerBranch) limitsLines.push(`- Maximum attempts per branch: ${config.attemptsPerBranch}`);
    if (config.attemptsPerIssue) limitsLines.push(`- Maximum attempts per issue: ${config.attemptsPerIssue}`);

    if (limitsLines.length > 2) {
      sections.push(limitsLines.join("\n"));
    }
  }

  // Instructions
  sections.push([
    "Implement this mission. Read the existing source code and tests,",
    "make the required changes, run run_tests to verify, and iterate until all tests pass.",
    "",
    "Start by reading the existing files, then implement the solution.",
  ].join("\n"));

  return { prompt: sections.join("\n\n"), promptBudget };
}
