#!/usr/bin/env node
/**
 * Basic Usage Example
 * 
 * This example demonstrates the fundamental CLI commands and workflows
 * for the agentic-lib toolkit.
 */

import { execSync } from "child_process";

console.log("🚀 Agentic-lib Basic Usage Examples");
console.log("====================================\n");

console.log("1. Display help and available commands:");
console.log("   npx @xn-intenton-z2a/repo help\n");

console.log("2. Initialize agentic system in repository:");
console.log("   npx @xn-intenton-z2a/repo init\n");

console.log("3. Create different workflow types:");
console.log("   npx @xn-intenton-z2a/repo create-workflow review");
console.log("   npx @xn-intenton-z2a/repo create-workflow fix");
console.log("   npx @xn-intenton-z2a/repo create-workflow transform");
console.log("   npx @xn-intenton-z2a/repo create-workflow maintain\n");

console.log("4. Send messages through communication system:");
console.log("   npx @xn-intenton-z2a/repo send-message 'Build completed' --channel status --type success");
console.log("   npx @xn-intenton-z2a/repo send-message 'Critical error detected' --channel errors --type error");
console.log("   npx @xn-intenton-z2a/repo send-message 'Requesting code review' --channel coordination\n");

console.log("5. Check system status:");
console.log("   npx @xn-intenton-z2a/repo status\n");

console.log("6. List active workflows:");
console.log("   npx @xn-intenton-z2a/repo list-workflows\n");

console.log("💡 Required Environment Variables:");
console.log("   GITHUB_TOKEN - Your GitHub personal access token");
console.log("   GITHUB_REPOSITORY - Auto-detected in Actions (owner/repo format)\n");

console.log("📝 Note: Run with a valid GITHUB_TOKEN to test actual functionality");