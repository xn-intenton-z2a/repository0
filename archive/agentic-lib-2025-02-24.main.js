#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";
import { randomInt } from "crypto";

/**
 * agentic-lib.js
 *
 * JavaScript Library
 *
 * This library contains the core logic extracted from GitHub script sections used in
 * reusable workflows. Its functions are fully testable and do not rely on GitHub Actions
 * globals. They implement the “brains” behind:
 *
 *   - Verifying issue fixes via an AI prompt.
 *   - Updating source files in response to build/test/main outputs (two variants:
 *     one for fixing failing builds and one for starting an issue fix).
 *   - Extracting issue numbers from branch names.
 *   - Automatically merging pull requests.
 *   - Finding PRs in a check suite with the “automerge” label.
 *   - Selecting issues from a provided list.
 *   - Determining whether an issue is marked as merged.
 *   - Creating pull requests and issues.
 *   - Listing open pull requests.
 *
 * A main() demo function exercises all functions and printUsage() outputs a detailed
 * help text with parameter lists.
 *
 * Run with:
 *   node main.js [--help]
 *
 * Target: Node 20 with ESM.
 */

// -----------------------------------------------------------------------------
// 1. verifyIssueFix (from wfr-review-issue.yml)
// -----------------------------------------------------------------------------
/**
 * Verifies whether the source file content reflects the resolution of an issue.
 *
 * @param {Object} params - Parameters:
 *   { target, sourceFileContent, buildScript, buildOutput, testScript, testOutput,
 *     mainScript, mainOutput, issueTitle, issueDescription, issueComments (Array), model,
 *     apiKey, issueNumber }
 * @returns {Promise<Object>} { fixed, message, refinement, responseUsage }
 */
export async function verifyIssueFix(params) {
  const {
    target,
    sourceFileContent,
    buildScript,
    buildOutput,
    testScript,
    testOutput,
    mainScript,
    mainOutput,
    issueTitle,
    issueDescription,
    issueComments,
    model,
    apiKey,
  } = params;
  if (!apiKey) throw new Error("Missing API key.");
  const issueCommentsText = issueComments
    .map((comment) => `Author:${comment.user.login}, Created:${comment.created_at}, Comment: ${comment.body}`)
    .join("\n");
  const prompt = `
Does the following source file content reflect the resolution of the following issue?
Consider the file content, issue, build output, test output, and main output.

Source for file: ${target}
SOURCE_FILE_START
${sourceFileContent}
SOURCE_FILE_END

Issue:
ISSUE_START
title: ${issueTitle}
description:
${issueDescription}
comments:
${issueCommentsText}
ISSUE_END

Build output from command: ${buildScript}
TEST_OUTPUT_START
${buildOutput}
TEST_OUTPUT_END

Test output from command: ${testScript}
TEST_OUTPUT_START
${testOutput}
TEST_OUTPUT_END

Main output from command: ${mainScript}
MAIN_OUTPUT_START
${mainOutput}
MAIN_OUTPUT_END

Answer strictly with a JSON object following this schema:
{
  "fixed": "true", // if the fix is present, or "false" otherwise.
  "message": "The issue has been resolved.", // if fixed, or explanation otherwise.
  "refinement": "None" // if fixed, or suggested refinement otherwise.
}
Ensure valid JSON.
`;
  const { OpenAI } = require("openai");
  const openai = new OpenAI({ apiKey });
  const { z } = require("zod");

  const functionSchema = [
    {
      type: "function",
      function: {
        name: "verify_issue_fix",
        description:
          "Evaluate whether the supplied source file content reflects the resolution of the issue. Return an object with fixed (as 'true' or 'false'), message, and refinement.",
        parameters: {
          type: "object",
          properties: {
            fixed: {
              type: "string",
              description: "true if the issue is fixed, false otherwise",
            },
            message: {
              type: "string",
              description: "A message explaining the result",
            },
            refinement: {
              type: "string",
              description: "A suggested refinement if the issue is not resolved; otherwise, 'None'",
            },
          },
          required: ["fixed", "message", "refinement"],
          additionalProperties: false,
        },
        strict: true,
      },
    },
  ];

  const response = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content:
          "You are evaluating whether an issue has been resolved based on the supplied inputs. Answer strictly with a JSON object following the provided function schema.",
      },
      { role: "user", content: prompt },
    ],
    tools: functionSchema,
  });

  let result;
  if (response.choices[0].message.tool_calls && response.choices[0].message.tool_calls.length > 0) {
    try {
      result = JSON.parse(response.choices[0].message.tool_calls[0].function.arguments);
    } catch (e) {
      throw new Error("Failed to parse function call arguments: " + e.message);
    }
  } else if (response.choices[0].message.content) {
    try {
      result = JSON.parse(response.choices[0].message.content);
    } catch (e) {
      throw new Error("Failed to parse response content: " + e.message);
    }
  } else {
    throw new Error("No valid response received from OpenAI.");
  }
  const ResponseSchema = z.object({
    fixed: z.string(),
    message: z.string(),
    refinement: z.string(),
  });
  try {
    const parsed = ResponseSchema.parse(result);
    return {
      fixed: parsed.fixed,
      message: parsed.message,
      refinement: parsed.refinement,
      responseUsage: response.usage,
    };
  } catch (e) {
    throw new Error("Failed to parse ChatGPT response: " + e.message);
  }
}

// -----------------------------------------------------------------------------
// 2. updateTargetForFixFallingBuild (from wfr-fix-failing-build.yml)
// -----------------------------------------------------------------------------
/**
 * Updates the target file to fix a failing build.
 *
 * @param {Object} params - Parameters:
 *   { target, sourceFileContent, listOutput, buildScript, buildOutput,
 *     testScript, testOutput, mainScript, mainOutput, model, apiKey }
 * @returns {Promise<Object>} { updatedSourceFileContent, message, fixApplied, responseUsage }
 */
export async function updateTargetForFixFallingBuild(params) {
  const {
    target,
    sourceFileContent,
    listOutput,
    buildScript,
    buildOutput,
    testScript,
    testOutput,
    mainScript,
    mainOutput,
    model,
    apiKey,
  } = params;
  if (!apiKey) throw new Error("Missing API key.");
  const prompt = `
You are providing the entire new content of the source file, with all necessary changes applied to resolve any issues visible.
Consider the file content, dependency list, build output, test output, and main output.

Source for file: ${target}
SOURCE_FILE_START
${sourceFileContent}
SOURCE_FILE_END

Dependency list from command: npm list
TEST_OUTPUT_START
${listOutput}
TEST_OUTPUT_END

Build output from command: ${buildScript}
TEST_OUTPUT_START
${buildOutput}
TEST_OUTPUT_END

Test output from command: ${testScript}
TEST_OUTPUT_START
${testOutput}
TEST_OUTPUT_END

Main output from command: ${mainScript}
MAIN_OUTPUT_START
${mainOutput}
MAIN_OUTPUT_END

Please produce an updated version of the file that resolves any issues visible in the build, test, or main output.
Answer strictly with a JSON object following this schema:
{
  "updatedSourceFileContent": "The entire new content of the source file, with all necessary changes applied.",
  "message": "The issue has been resolved."
}
Ensure valid JSON.
`;
  const { OpenAI } = require("openai");
  const openai = new OpenAI({ apiKey });
  const { z } = require("zod");

  const functionSchema = [
    {
      type: "function",
      function: {
        name: "update_source_file_for_fix_falling_build",
        description:
          "Return an updated version of the source file content along with a commit message to fix a failing build. Use the provided file content, dependency list, build output, test output, and main output.",
        parameters: {
          type: "object",
          properties: {
            updatedSourceFileContent: {
              type: "string",
              description: "The entire new content of the source file, with all necessary changes applied.",
            },
            message: {
              type: "string",
              description: "A short sentence explaining the change applied, suitable for a commit message.",
            },
          },
          required: ["updatedSourceFileContent", "message"],
          additionalProperties: false,
        },
        strict: true,
      },
    },
  ];

  const response = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content:
          "You are a code fixer that returns an updated source file content to resolve issues in a failing build. Answer strictly with a JSON object that adheres to the provided function schema.",
      },
      { role: "user", content: prompt },
    ],
    tools: functionSchema,
  });

  let result;
  if (response.choices[0].message.tool_calls && response.choices[0].message.tool_calls.length > 0) {
    try {
      result = JSON.parse(response.choices[0].message.tool_calls[0].function.arguments);
    } catch (e) {
      throw new Error("Failed to parse function call arguments: " + e.message);
    }
  } else if (response.choices[0].message.content) {
    try {
      result = JSON.parse(response.choices[0].message.content);
    } catch (e) {
      throw new Error("Failed to parse response content: " + e.message);
    }
  } else {
    throw new Error("No valid response received from OpenAI.");
  }
  const ResponseSchema = z.object({
    updatedSourceFileContent: z.string(),
    message: z.string(),
  });
  try {
    const parsed = ResponseSchema.parse(result);
    return {
      updatedSourceFileContent: parsed.updatedSourceFileContent,
      message: parsed.message,
      fixApplied: true,
      responseUsage: response.usage,
    };
  } catch (e) {
    throw new Error("Failed to parse ChatGPT response: " + e.message);
  }
}

// -----------------------------------------------------------------------------
// 3. updateTargetForStartIssue (from wfr-start-issue.yml)
// -----------------------------------------------------------------------------
/**
 * Updates the target file to fix an issue by incorporating issue details.
 *
 * @param {Object} params - Parameters:
 *   { target, sourceFileContent, listOutput, buildScript, buildOutput,
 *     testScript, testOutput, mainScript, mainOutput, issueTitle,
 *     issueDescription, issueComments (Array), model, apiKey, issueNumber }
 * @returns {Promise<Object>} { updatedSourceFileContent, message, fixApplied, responseUsage }
 */
export async function updateTargetForStartIssue(params) {
  const {
    target,
    sourceFileContent,
    buildScript,
    buildOutput,
    testScript,
    testOutput,
    mainScript,
    mainOutput,
    issueTitle,
    issueDescription,
    issueComments,
    model,
    apiKey,
  } = params;
  if (!apiKey) throw new Error("Missing API key.");
  const issueCommentsText = issueComments
    .map((comment) => `Author:${comment.user.login}, Created:${comment.created_at}, Comment: ${comment.body}`)
    .join("\n");
  const prompt = `
You are providing the entire new content of the source file, with all necessary changes applied to resolve an issue.
Consider the file content, issue, dependency list, build output, test output, and main output.

Source for file: ${target}
SOURCE_FILE_START
${sourceFileContent}
SOURCE_FILE_END

Issue:
ISSUE_START
title: ${issueTitle}
description:
${issueDescription}
comments:
${issueCommentsText}
ISSUE_END

Build output from command: ${buildScript}
TEST_OUTPUT_START
${buildOutput}
TEST_OUTPUT_END

Test output from command: ${testScript}
TEST_OUTPUT_START
${testOutput}
TEST_OUTPUT_END

Main output from command: ${mainScript}
MAIN_OUTPUT_START
${mainOutput}
MAIN_OUTPUT_END

Please produce an updated version of the file that resolves the following issue.
Answer strictly with a JSON object following this schema:
{
  "updatedSourceFileContent": "The entire new content of the source file, with all necessary changes applied.",
  "message": "The issue has been resolved."
}
Ensure valid JSON.
`;
  const { OpenAI } = require("openai");
  const openai = new OpenAI({ apiKey });
  const { z } = require("zod");

  const functionSchema = [
    {
      type: "function",
      function: {
        name: "update_source_file_for_start_issue",
        description:
          "Return an updated version of the source file content along with a commit message to resolve the issue. Use the provided file content, issue details, dependency list, build output, test output, and main output.",
        parameters: {
          type: "object",
          properties: {
            updatedSourceFileContent: {
              type: "string",
              description: "The entire new content of the source file, with all necessary changes applied.",
            },
            message: {
              type: "string",
              description: "A short sentence explaining the change applied suitable for a commit message.",
            },
          },
          required: ["updatedSourceFileContent", "message"],
          additionalProperties: false,
        },
        strict: true,
      },
    },
  ];

  const response = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content:
          "You are a code fixer that returns an updated source file content to resolve an issue based on supplied issue details. Answer strictly with a JSON object that adheres to the provided function schema.",
      },
      { role: "user", content: prompt },
    ],
    tools: functionSchema,
  });

  let result;
  if (response.choices[0].message.tool_calls && response.choices[0].message.tool_calls.length > 0) {
    try {
      result = JSON.parse(response.choices[0].message.tool_calls[0].function.arguments);
    } catch (e) {
      throw new Error("Failed to parse function call arguments: " + e.message);
    }
  } else if (response.choices[0].message.content) {
    try {
      result = JSON.parse(response.choices[0].message.content);
    } catch (e) {
      throw new Error("Failed to parse response content: " + e.message);
    }
  } else {
    throw new Error("No valid response received from OpenAI.");
  }
  const ResponseSchema = z.object({
    updatedSourceFileContent: z.string(),
    message: z.string(),
  });
  try {
    const parsed = ResponseSchema.parse(result);
    return {
      updatedSourceFileContent: parsed.updatedSourceFileContent,
      message: parsed.message,
      fixApplied: true,
      responseUsage: response.usage,
    };
  } catch (e) {
    throw new Error("Failed to parse ChatGPT response: " + e.message);
  }
}

// -----------------------------------------------------------------------------
// 4. extractIssueNumber (from wfr-automerge-label-issue.yml / wfr-select-issue.yml)
// -----------------------------------------------------------------------------
/**
 * Extracts an issue number from a branch name using a prefix.
 *
 * @param {string} branchName - The branch name.
 * @param {string} branchPrefix - The prefix (e.g. "issue-").
 * @returns {string} The extracted issue number, or an empty string if not found.
 */
export function extractIssueNumber(branchName, branchPrefix) {
  const regex = new RegExp(`${branchPrefix}(\\d+)`);
  const match = branchName.match(regex);
  return match ? match[1] : "";
}

// -----------------------------------------------------------------------------
// 5. labelMergedIssue (from wfr-automerge-label-issue.yml)
// -----------------------------------------------------------------------------
/**
 * Simulates adding a “merged” label and a comment on an issue extracted from a branch.
 *
 * @param {string} pullNumber - The pull request number (as a string).
 * @param {string} branchName - The branch name.
 * @param {string} branchPrefix - The prefix used to indicate issue branches.
 * @returns {Object} { issueNumber, comment }
 */
export function labelMergedIssue(pullNumber, branchName, branchPrefix) {
  const issueNumber = extractIssueNumber(branchName, branchPrefix);
  if (!issueNumber) {
    throw new Error("No issue number found in branch name.");
  }
  return {
    issueNumber,
    comment: `The feature branch "${branchName}" has been merged.`,
  };
}

// -----------------------------------------------------------------------------
// 6. autoMergePullRequest (from wfr-automerge-merge-pr.yml)
// -----------------------------------------------------------------------------
/**
 * Determines whether a pull request can be auto‑merged.
 *
 * @param {Object} pullRequest - An object with properties: state, mergeable, mergeable_state.
 * @returns {string} "true" if auto-merge is allowed, otherwise "false".
 */
export function autoMergePullRequest(pullRequest) {
  if (pullRequest.state === "closed") return "true";
  if (pullRequest.state !== "open") return "false";
  if (pullRequest.mergeable && pullRequest.mergeable_state === "clean") return "true";
  if (pullRequest.mergeable === false) return "false";
  if (pullRequest.mergeable === null) return "false";
  return "false";
}

// -----------------------------------------------------------------------------
// 7. findPRInCheckSuite (from wfr-automerge-find-pr-in-check-suite.yml)
// -----------------------------------------------------------------------------
/**
 * From an array of pull requests, finds one with an "automerge" label.
 *
 * @param {Array<Object>} prs - Array of PR objects.
 * @returns {Object} { pullNumber, shouldSkipMerge, prMerged }
 */
export function findPRInCheckSuite(prs) {
  if (!prs || prs.length === 0) {
    return { pullNumber: "", shouldSkipMerge: "true", prMerged: "false" };
  }
  const openPRs = prs.filter((pr) => pr.state === "open");
  const prWithAutomerge = openPRs.find(
    (pr) => pr.labels && pr.labels.some((label) => label.name.toLowerCase() === "automerge"),
  );
  if (!prWithAutomerge) {
    return { pullNumber: "", shouldSkipMerge: "true", prMerged: "false" };
  }
  return {
    pullNumber: prWithAutomerge.number.toString(),
    shouldSkipMerge: "false",
    prMerged: "false",
  };
}

// -----------------------------------------------------------------------------
// 8. selectIssue (from wfr-select-issue.yml)
// -----------------------------------------------------------------------------
/**
 * Selects an issue number from a provided list.
 *
 * @param {string} providedIssueNumber - An optional provided issue number.
 * @param {Array<Object>} issues - Array of issue objects (each with a "number" property).
 * @returns {string} The selected issue number, or an empty string.
 */
export function selectIssue(providedIssueNumber, issues) {
  if (providedIssueNumber) {
    const found = issues.find((issue) => issue.number.toString() === providedIssueNumber.toString());
    return found ? found.number.toString() : "";
  }
  return issues.length > 0 ? issues[0].number.toString() : "";
}

// -----------------------------------------------------------------------------
// 9. hasMergedLabel (from wfr-select-issue.yml)
// -----------------------------------------------------------------------------
/**
 * Checks if an issue has a "merged" label (case‑insensitive).
 *
 * @param {Object} issue - An issue object with a "labels" array.
 * @returns {boolean} True if the issue has a merged label, false otherwise.
 */
export function hasMergedLabel(issue) {
  if (!issue.labels || !Array.isArray(issue.labels)) return false;
  return issue.labels.some((label) => label.name.toLowerCase() === "merged");
}

// -----------------------------------------------------------------------------
// 10. createPullRequest (from wfr-create-pr.yml)
// -----------------------------------------------------------------------------
/**
 * Simulates creating a pull request if none exists.
 *
 * @param {Object} params - Parameters:
 *   { branch, baseBranch, commitMessage, label, existingPulls (Array) }
 * @returns {Promise<Object>} An object indicating whether a PR was created.
 */
export async function createPullRequest(params) {
  const { existingPulls } = params;
  if (existingPulls && existingPulls.length > 0) {
    return { prCreated: false, info: "Pull request already exists." };
  }
  // Simulate PR creation.
  return {
    prCreated: true,
    prNumber: "123",
    htmlUrl: `https://github.com/dummy/repo/pull/123`,
  };
}

// -----------------------------------------------------------------------------
// 11. createIssue (from wfr-create-issue.yml)
// -----------------------------------------------------------------------------
/**
 * Simulates creating an issue.
 *
 * @param {Object} params - Parameters:
 *   { issueTitle, target }
 * @returns {Promise<Object>} { issueTitle, issueNumber }
 */
export async function createIssue(params) {
  const { issueTitle } = params;
  // Simulate issue creation with a random issue number.
  const issueNumber = randomInt(0, 1000).toString();
  return { issueTitle, issueNumber };
}

// -----------------------------------------------------------------------------
// 12. listOpenPullRequests (from wfr-update-prs.yml)
// -----------------------------------------------------------------------------
/**
 * Simulates listing open pull requests.
 *
 * @returns {Promise<Array<Object>>} Array of PR objects.
 */
export async function listOpenPullRequests({ _x }) {
  // Simulate by returning dummy data.
  return [
    { number: 101, headRef: "issue-101", baseRef: "main" },
    { number: 102, headRef: "feature-102", baseRef: "main" },
  ];
}

// -----------------------------------------------------------------------------
// 13. analyzeSarifResults (from wfr-run-sarif-script-then-post-script-and-push-changes.yml)
// -----------------------------------------------------------------------------
/**
 * Simulates comparing two SARIF outputs and determining if fixes were applied.
 *
 * @param {number|string} resultsBefore - Number of results before.
 * @param {number|string} resultsAfter - Number of results after.
 * @returns {Object} { fixRequired, fixApplied }
 */
export function analyzeSarifResults(resultsBefore, resultsAfter) {
  const before = Number(resultsBefore);
  const after = Number(resultsAfter);
  const fixRequired = after > 0 ? "true" : "false";
  const fixApplied = after < before ? "true" : "false";
  return { fixRequired, fixApplied };
}

// -----------------------------------------------------------------------------
// 14. (Merging from wfr-automerge-find-pr-from-pull-request.yml is covered by autoMergePullRequest)
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Usage / Help Output
// -----------------------------------------------------------------------------
export function printUsage() {
  console.log(`
JavaScript Library for Agentic Operations — Usage Guide

Available Functions:

1. verifyIssueFix(params)
   • Type: async function
   • Mandatory parameters in params:
         - target (string)
         - sourceFileContent (string)
         - buildScript (string)
         - buildOutput (string)
         - testScript (string)
         - testOutput (string)
         - mainScript (string)
         - mainOutput (string)
         - issueTitle (string)
         - issueDescription (string)
         - issueComments (Array<Object>)
         - model (string)
         - apiKey (string)
         - issueNumber (number)
   • Returns: { fixed, message, refinement, responseUsage }

2. updateTargetForFixFallingBuild(params)
   • Type: async function
   • Mandatory parameters:
         - target (string)
         - sourceFileContent (string)
         - listOutput (string)
         - buildScript (string)
         - buildOutput (string)
         - testScript (string)
         - testOutput (string)
         - mainScript (string)
         - mainOutput (string)
         - model (string)
         - apiKey (string)
   • Returns: { updatedSourceFileContent, message, fixApplied, responseUsage }

3. updateTargetForStartIssue(params)
   • Type: async function
   • Mandatory parameters:
         - target (string)
         - sourceFileContent (string)
         - listOutput (string)
         - buildScript (string)
         - buildOutput (string)
         - testScript (string)
         - testOutput (string)
         - mainScript (string)
         - mainOutput (string)
         - issueTitle (string)
         - issueDescription (string)
         - issueComments (Array<Object>)
         - model (string)
         - apiKey (string)
         - issueNumber (number)
   • Returns: { updatedSourceFileContent, message, fixApplied, responseUsage }

4. extractIssueNumber(branchName, branchPrefix)
   • Parameters:
         - branchName (string)
         - branchPrefix (string)
   • Returns: Issue number (string) or empty string.

5. labelMergedIssue(pullNumber, branchName, branchPrefix)
   • Parameters:
         - pullNumber (string)
         - branchName (string)
         - branchPrefix (string)
   • Returns: { issueNumber, comment }

6. autoMergePullRequest(pullRequest)
   • Parameters:
         - pullRequest (object with properties: state, mergeable, mergeable_state)
   • Returns: "true" or "false" (string)

7. findPRInCheckSuite(prs)
   • Parameters:
         - prs (Array<Object>)
   • Returns: { pullNumber, shouldSkipMerge, prMerged }

8. selectIssue(providedIssueNumber, issues)
   • Parameters:
         - providedIssueNumber (string)
         - issues (Array<Object>)
   • Returns: Selected issue number (string)

9. hasMergedLabel(issue)
   • Parameters:
         - issue (object with a labels array)
   • Returns: boolean

10. createPullRequest(params)
    • Parameters:
         - branch (string)
         - baseBranch (string)
         - commitMessage (string)
         - label (string)
         - existingPulls (Array<Object>)
    • Returns: { prCreated, prNumber, htmlUrl } (or an info message)

11. createIssue(params)
    • Parameters:
         - issueTitle (string)
         - target (string)
    • Returns: { issueTitle, issueNumber }

12. listOpenPullRequests({ owner, repo, pullsPerPage })
    • Parameters:
         - owner (string)
         - repo (string)
         - pullsPerPage (number, optional)
    • Returns: Array of PR objects

13. analyzeSarifResults(resultsBefore, resultsAfter)
    • Parameters:
         - resultsBefore (number|string)
         - resultsAfter (number|string)
    • Returns: { fixRequired, fixApplied } (as strings)

Usage examples are provided in the main() demo below.
`);
}

// -----------------------------------------------------------------------------
// Main Demo Function
// -----------------------------------------------------------------------------
async function main() {
  console.log("=== JavaScript Library for Agentic Operations Demo ===\n");

  // 1. verifyIssueFix demo
  try {
    const verifyResult = await verifyIssueFix({
      target: "src/lib/main.js",
      sourceFileContent: "console.log('Hello, world!');",
      buildScript: "npm run build",
      buildOutput: "Build succeeded",
      testScript: "npm test",
      testOutput: "Tests passed",
      mainScript: "node src/lib/main.js",
      mainOutput: "Hello, world!",
      issueTitle: "Fix greeting",
      issueDescription: "Update greeting to include user name.",
      issueComments: [{ user: { login: "alice" }, created_at: "2023-01-01", body: "Please fix this." }],
      model: "o3-mini",
      apiKey: "dummy-api-key",
      issueNumber: 123,
    });
    console.log("verifyIssueFix Result:", verifyResult);
  } catch (err) {
    console.error("Error in verifyIssueFix:", err);
  }

  // 2. updateTargetForFixFallingBuild demo
  try {
    const updateFixResult = await updateTargetForFixFallingBuild({
      target: "src/lib/main.js",
      sourceFileContent: "console.log('Old version');",
      listOutput: "npm list output here",
      buildScript: "npm run build",
      buildOutput: "Build failed",
      testScript: "npm test",
      testOutput: "Tests failed",
      mainScript: "node src/lib/main.js",
      mainOutput: "Error output",
      model: "o3-mini",
      apiKey: "dummy-api-key",
    });
    console.log("updateTargetForFixFallingBuild Result:", updateFixResult);
  } catch (err) {
    console.error("Error in updateTargetForFixFallingBuild:", err);
  }

  // 3. updateTargetForStartIssue demo
  try {
    const updateStartResult = await updateTargetForStartIssue({
      target: "src/lib/main.js",
      sourceFileContent: "console.log('Old version');",
      listOutput: "npm list output here",
      buildScript: "npm run build",
      buildOutput: "Build succeeded",
      testScript: "npm test",
      testOutput: "Tests passed",
      mainScript: "node src/lib/main.js",
      mainOutput: "Output OK",
      issueTitle: "Fix main output",
      issueDescription: "Main output must greet the user properly.",
      issueComments: [{ user: { login: "bob" }, created_at: "2023-02-01", body: "Please update greeting." }],
      model: "o3-mini",
      apiKey: "dummy-api-key",
      issueNumber: 456,
    });
    console.log("updateTargetForStartIssue Result:", updateStartResult);
  } catch (err) {
    console.error("Error in updateTargetForStartIssue:", err);
  }

  // 4. extractIssueNumber demo
  const extracted = extractIssueNumber("issue-789-update", "issue-");
  console.log("extractIssueNumber:", extracted);

  // 5. labelMergedIssue demo
  try {
    const labelInfo = labelMergedIssue("101", "issue-101-update", "issue-");
    console.log("labelMergedIssue:", labelInfo);
  } catch (err) {
    console.error("Error in labelMergedIssue:", err);
  }

  // 6. autoMergePullRequest demo
  const mergeResult = autoMergePullRequest({
    state: "open",
    mergeable: true,
    mergeable_state: "clean",
  });
  console.log("autoMergePullRequest:", mergeResult);

  // 7. findPRInCheckSuite demo
  const prFound = findPRInCheckSuite([
    { number: 1, state: "closed", labels: [] },
    { number: 2, state: "open", labels: [{ name: "automerge" }] },
  ]);
  console.log("findPRInCheckSuite:", prFound);

  // 8. selectIssue demo
  const selectedIssue = selectIssue("", [{ number: 321 }, { number: 654 }]);
  console.log("selectIssue:", selectedIssue);

  // 9. hasMergedLabel demo
  const mergedLabel = hasMergedLabel({
    labels: [{ name: "Merged" }, { name: "bug" }],
  });
  console.log("hasMergedLabel:", mergedLabel);

  // 10. createPullRequest demo
  const prCreation = await createPullRequest({
    branch: "issue-123",
    baseBranch: "main",
    commitMessage: "Ready for pull",
    label: "automerge",
    existingPulls: [],
  });
  console.log("createPullRequest:", prCreation);

  // 11. createIssue demo
  const issueCreation = await createIssue({
    issueTitle: "Improve error handling",
    target: "src/lib/main.js",
  });
  console.log("createIssue:", issueCreation);

  // 12. listOpenPullRequests demo
  const openPRs = await listOpenPullRequests({
    owner: "dummy",
    repo: "repo",
    pullsPerPage: 2,
  });
  console.log("listOpenPullRequests:", openPRs);

  // 13. analyzeSarifResults demo
  const sarifAnalysis = analyzeSarifResults("5", "2");
  console.log("analyzeSarifResults:", sarifAnalysis);

  console.log("\n=== End of Demo ===\n");
}

// -----------------------------------------------------------------------------
// Run main if executed directly.
// -----------------------------------------------------------------------------
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.includes("--help")) {
    printUsage();
    process.exit(0);
  }
  try {
    await main();
  } catch (err) {
    console.error("Error in main demo:", err);
    process.exit(1);
  }
}

export default {
  verifyIssueFix,
  updateTargetForFixFallingBuild,
  updateTargetForStartIssue,
  extractIssueNumber,
  labelMergedIssue,
  autoMergePullRequest,
  findPRInCheckSuite,
  selectIssue,
  hasMergedLabel,
  createPullRequest,
  createIssue,
  listOpenPullRequests,
  analyzeSarifResults,
  printUsage,
  main,
};
