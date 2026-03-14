// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// src/copilot/sdk.js — Find and import the Copilot SDK
//
// The SDK may be in the root node_modules or nested under
// src/actions/agentic-step/node_modules/. This module handles discovery.

import { existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Search for the SDK relative to this file's location. Works in both:
// - npm package: src/copilot/sdk.js → ../../node_modules/ or ../actions/agentic-step/node_modules/
// - consumer repo: .github/agentic-lib/copilot/sdk.js → ../actions/agentic-step/node_modules/
const SDK_LOCATIONS = [
  resolve(__dirname, "../../node_modules/@github/copilot-sdk/dist/index.js"),
  resolve(__dirname, "../actions/agentic-step/node_modules/@github/copilot-sdk/dist/index.js"),
];

let _sdk = null;

/**
 * Dynamically import the Copilot SDK, searching known locations.
 * @returns {Promise<{CopilotClient: *, approveAll: *, defineTool: *}>}
 */
export async function getSDK() {
  if (_sdk) return _sdk;
  const sdkPath = SDK_LOCATIONS.find((p) => existsSync(p));
  if (!sdkPath) {
    throw new Error(
      "@github/copilot-sdk not found. Run: npm ci\nSearched: " + SDK_LOCATIONS.join(", "),
    );
  }
  _sdk = await import(sdkPath);
  return _sdk;
}
