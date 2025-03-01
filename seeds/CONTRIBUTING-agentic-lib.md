# agentic‑lib

Thank you for your interest in contributing to **agentic‑lib**! This document outlines our guidelines for human and
automated contributions, ensuring that our core library remains robust, testable, and efficient in powering our
reusable GitHub Workflows.

## Mission Statement

**agentic‑lib** Is a JavaScript library which can be used as a drop in JS implementation or wholesale replacement for
the steps, jobs, and re-usable workflows below in this repository. It is designed to be used in a GitHub Actions
workflow to enable your repository to operate in an “agentic” manner. In our system, autonomous workflows communicate
through branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be
invoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK.

Concatenated source from the GitHub worklflow files to implement as JavaScript (Node 20 / ESM) functions in a library:
START_OF_CONCATENATED_WORKFLOW_FILES
```
./.github/FUNDING.yml
==== Content of ./.github/FUNDING.yml ====
github: Antony-at-Polycode
# paypal: https://www.paypal.com/donate/?hosted_button_id=Y8PK8XP3EJLWG
./.github/workflows/wfr-review-issue.yml
==== Content of ./.github/workflows/wfr-review-issue.yml ====
# .github/workflows/wfr-review-issue.yml

#
# agentic-lib
# Copyright (C) 2025 Polycode Limited
#
# This file is part of agentic-lib.
#
# agentic-lib is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License v3.0 (GPL‑3).
# along with this program. If not, see <https://www.gnu.org/licenses/>.
#
# IMPORTANT: Any derived work must include the following attribution:
# "This work is derived from https://github.com/xn-intenton-z2a/agentic-lib"
#

name: ∞ Review issue

on:
  workflow_call:
    inputs:
      issueNumber:
        description: 'The issue number to review. e.g. "123"'
        type: string
        required: true
      target:
        description: 'The target file to review. e.g. "src/lib/main.js"'
        type: string
        required: false
        default: 'src/lib/main.js'
      testFile:
        description: 'The test file to review. e.g. "tests/unit/main.test.js"'
        type: string
        required: false
        default: 'tests/unit/main.test.js'
      readmeFile:
        description: 'The README file to review. e.g. "README.md"'
        type: string
        required: false
        default: 'README.md'
      contributingFile:
        description: 'The CONTRIBUTING file to review. e.g. "CONTRIBUTING.md"'
        type: string
        required: false
        default: 'CONTRIBUTING.md'
      dependenciesFile:
        description: 'The dependencies file to review. e.g. "package.json"'
        type: string
        required: false
        default: 'package.json'
      buildScript:
        description: 'The script must be runnable as: `npm ci ; <script>` and succeed with a zero exit code. e.g. `npm run build`'
        type: string
        required: false
        default: 'echo "No build script specified."'
      testScript:
        description: 'The script must be runnable as: `npm ci ; <script>` and succeed with a zero exit code. e.g. `npm test`'
        type: string
        required: false
        default: 'npm test'
      mainScript:
        description: 'The script must be runnable as: `npm ci ; <script>` and succeed with a zero exit code. e.g. `npm run start`'
        type: string
        required: false
        default: 'npm run start'
      model:
        description: 'The OpenAI model to use. e.g. "o3-mini"'
        type: string
        required: false
        default: ${{ vars.CHATGPT_API_MODEL || 'o3-mini' }}
    secrets:
      PERSONAL_ACCESS_TOKEN:
        required: false
      CHATGPT_API_SECRET_KEY:
        required: true
    outputs:
      fixed:
        value: ${{ jobs.review-issue.outputs.fixed }}

jobs:
  review-issue:
    runs-on: ubuntu-latest

    env:
      issueNumber: ${{ inputs.issueNumber }}
      target: ${{ inputs.target || 'src/lib/main.js' }}
      testFile: ${{ inputs.testFile || 'tests/unit/main.test.js' }}
      readmeFile: ${{ inputs.readmeFile || 'README.md' }}
      contributingFile: ${{ inputs.contributingFile || 'CONTRIBUTING.md' }}
      dependenciesFile: ${{ inputs.dependenciesFile || 'package.json' }}
      buildScript: ${{ inputs.buildScript || 'npm run build' }}
      testScript: ${{ inputs.testScript || 'npm test' }}
      mainScript: ${{ inputs.mainScript || 'npm run start' }}
      mainScriptTimeout: '5m'
      model: ${{ inputs.model || vars.CHATGPT_API_MODEL || 'o3-mini' }}
      chatgptApiSecretKey: ${{ secrets.CHATGPT_API_SECRET_KEY }}

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Check GitHub authentication
        if: ${{ env.npmAuthOrganisation != '' }}
        shell: bash
        run: |
          curl --include --header "Authorization: token ${{ secrets.PERSONAL_ACCESS_TOKEN || secrets.GITHUB_TOKEN }}" https://api.github.com/user

      - name: Set up .npmrc
        if: ${{ env.npmAuthOrganisation != '' }}
        shell: bash
        run: |
          echo "${{ env.npmAuthOrganisation }}:registry=https://npm.pkg.github.com" >> .npmrc
          echo "//npm.pkg.github.com/:_authToken=${{ secrets.PERSONAL_ACCESS_TOKEN || secrets.GITHUB_TOKEN }}" >> .npmrc
          echo "always-auth=true" >> .npmrc

      - run: npm ci

      - name: List dependencies
        id: list
        shell: bash
        run: |
          output=$(npm list 2>&1)
          echo "output<<EOF" >> "$GITHUB_OUTPUT"
          echo "$output" >> "$GITHUB_OUTPUT"
          echo "EOF" >> "$GITHUB_OUTPUT"
          echo "output=${output}"

      - name: Build project
        id: build
        shell: bash
        run: |
          output=$(${{ env.buildScript }} 2>&1)
          echo "output<<EOF" >> "$GITHUB_OUTPUT"
          echo "$output" >> "$GITHUB_OUTPUT"
          echo "EOF" >> "$GITHUB_OUTPUT"
          echo "output=${output}"

      - name: Tear down .npmrc
        if: ${{ env.npmAuthOrganisation != '' }}
        shell: bash
        run: rm -f .npmrc

      - name: Run tests
        id: test
        shell: bash
        run: |
          output=$(${{ env.testScript }} 2>&1)
          echo "output<<EOF" >> "$GITHUB_OUTPUT"
          echo "$output" >> "$GITHUB_OUTPUT"
          echo "EOF" >> "$GITHUB_OUTPUT"
          echo "output=${output}"

      - name: Run main
        id: main
        shell: bash
        run: |
          output=$(timeout ${{ env.mainScriptTimeout }} ${{ env.mainScript }} 2>&1)
          echo "output<<EOF" >> "$GITHUB_OUTPUT"
          echo "$output" >> "$GITHUB_OUTPUT"
          echo "EOF" >> "$GITHUB_OUTPUT"
          echo "output=${output}"

      - name: verify
        id: verify
        uses: actions/github-script@v7
        env:
          dependenciesListOutput: ${{ steps.list.outputs.output }}
          buildOutput: ${{ steps.build.outputs.output }}
          testOutput: ${{ steps.test.outputs.output }}
          mainOutput: ${{ steps.main.outputs.output }}
        with:
          github-token: ${{ secrets.PERSONAL_ACCESS_TOKEN || secrets.GITHUB_TOKEN }}
          script: |
            const target = process.env.target;
            const testFile = process.env.testFile;
            const readmeFile = process.env.readmeFile;
            const contributingFile = process.env.contributingFile;
            const dependenciesFile = process.env.dependenciesFile;
            const model = process.env.model;
            const apiKey = process.env.chatgptApiSecretKey;
            const issueNumber = parseInt(process.env.issueNumber);
            const dependenciesListOutput = process.env.dependenciesListOutput;
            const buildScript = process.env.buildScript;
            const buildOutput = process.env.buildOutput;
            const testScript = process.env.testScript;
            const testOutput = process.env.testOutput;
            const mainScript = process.env.mainScript;
            const mainOutput = process.env.mainOutput;

            const fs = require('fs');
            const OpenAI = require('openai').default;
            const { z } = require('zod');
            require('dotenv').config();

            if (!apiKey) { 
              core.setFailed("Missing CHATGPT_API_SECRET_KEY"); 
            }
            const openai = new OpenAI({ apiKey });

            core.info(`target: "${target}"`);
            core.info(`testFile: "${testFile}"`);
            core.info(`readmeFile: "${readmeFile}"`);
            core.info(`contributingFile: "${contributingFile}"`);
            core.info(`dependenciesFile: "${dependenciesFile}"`);
            const sourceFileContent = fs.readFileSync(target, 'utf8');
            const testFileContent = fs.readFileSync(testFile, 'utf8');
            const readmeFileContent = fs.readFileSync(readmeFile, 'utf8');
            const contributingFileContent = fs.readFileSync(contributingFile, 'utf8');
            const dependenciesFileContent = fs.readFileSync(dependenciesFile, 'utf8');
            core.info(`Target file '${target}' has been loaded (length ${sourceFileContent.length}).`);
            core.info(`Test file '${testFile}' has been loaded (length ${testFileContent.length}).`);
            core.info(`Readme file '${readmeFile}' has been loaded (length ${readmeFileContent.length}).`);
            core.info(`Dependencies file '${dependenciesFile}' has been loaded (length ${dependenciesFileContent.length}).`);
            
            const issue = await github.rest.issues.get({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: issueNumber
            });
            const issueTitle = issue.data.title;
            const issueDescription = issue.data.body;
            const issueComments = await github.rest.issues.listComments({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: issueNumber
            });
            const issueCommentsText = issueComments.data
              .map(comment => `Author:${comment.user.login}, Created:${comment.created_at}, Comment: ${comment.body}`)
              .join('\n');
            
            const prompt = `
            Does the combination source file, test file, README file and dependencies file show a solution with a reasonable likelihood of including a resolution to the following issue?
            Consider the following when refining your response:
            * Source file content
            * Test file content
            * README file content issue
            * Contributing file content
            * Dependencies file content
            * Issue details
            * Dependency list
            * Build output
            * Test output
            * Main execution output
            
            Source file: ${target}
            SOURCE_FILE_START
            ${sourceFileContent}
            SOURCE_FILE_END
            
            Test file: ${testFile}
            TEST_FILE_START
            ${testFileContent}
            TEST_FILE_END

            README file: ${readmeFile}
            README_FILE_START
            ${readmeFileContent}
            README_FILE_END

            Contributing file: ${contributingFile}
            CONTRIBUTING_FILE_START
            ${contributingFileContent}
            CONTRIBUTING_FILE_END
            
            Dependencies file: ${dependenciesFile}
            DEPENDENCIES_FILE_START
            ${dependenciesFileContent}
            DEPENDENCIES_FILE_END
            
            Issue:
            ISSUE_START
            title: ${issueTitle}
            description:
            ${issueDescription}
            comments:
            ${issueCommentsText}
            ISSUE_END            

            Dependencies list from command: npm list
            DEPENDENCIES_LIST_START
            ${dependenciesListOutput}
            DEPENDENCIES_LIST_END    
            
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
              "message": "The issue has been resolved.", // if the fix is present, or an explanation otherwise.
              "refinement": "None" // if the fix is present, or a suggested refinement to resolve the issue otherwise.
            }
            Ensure valid JSON.
            `;
            
            const ResponseSchema = z.object({ fixed: z.string(), message: z.string(), refinement: z.string() });
            
            // Define the function schema for function calling
            const tools = [{
              type: "function",
              function: {
                name: "review_issue",
                description: "Evaluate whether the supplied source file content resolves the issue. Return an object with fixed (string: 'true' or 'false'), message (explanation), and refinement (suggested refinement).",
                parameters: {
                  type: "object",
                  properties: {
                    fixed: { type: "string", description: "true if the issue is resolved, false otherwise" },
                    message: { type: "string", description: "A message explaining the result" },
                    refinement: { type: "string", description: "A suggested refinement if the issue is not resolved" }
                  },
                  required: ["fixed", "message", "refinement"],
                  additionalProperties: false
                },
                strict: true
              }
            }];

            // Call OpenAI using function calling format
            const response = await openai.chat.completions.create({
              model,
              messages: [
                { role: "system", content: "You are evaluating whether an issue has been resolved in the supplied source code. Answer strictly with a JSON object following the provided function schema." },
                { role: "user", content: prompt }
              ],
              tools: tools
            });
            
            let result;
            if (response.choices[0].message.tool_calls && response.choices[0].message.tool_calls.length > 0) {
              try {
                result = JSON.parse(response.choices[0].message.tool_calls[0].function.arguments);
              } catch (e) {
                core.setFailed(`Failed to parse function call arguments: ${e.message}`);
              }
            } else if (response.choices[0].message.content) {
              try {
                result = JSON.parse(response.choices[0].message.content);
              } catch (e) {
                core.setFailed(`Failed to parse response content: ${e.message}`);
              }
            } else {
              core.setFailed("No valid response received from OpenAI.");
            }
            
            try {
              const parsed = ResponseSchema.parse(result);
              core.setOutput("fixed", parsed.fixed);
              core.setOutput("message", parsed.message);
              core.setOutput("refinement", parsed.refinement);
              core.info(`fixed: "${parsed.fixed}"`);
              core.info(`message: "${parsed.message}"`);
              core.info(`refinement: "${parsed.refinement}"`);
            
              await github.rest.issues.createComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: issueNumber,
                body: parsed.message
              });
            
              await github.rest.issues.createComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: issueNumber,
                body: parsed.refinement
              });
            } catch (e) {
              core.setFailed(`Failed to parse ChatGPT response: ${e.message}`);
            }
            
            core.setOutput("response", JSON.stringify(response));
            core.setOutput("usage", JSON.stringify(response.usage));
            core.info(`response: "${JSON.stringify(response)}"`);
            core.info(`usage: "${JSON.stringify(response.usage)}"`);
      - name: Close fixed issues
        if: steps.verify.outputs.fixed == 'true'
        uses: actions/github-script@v7
        with:
          github-token: ${{ secrets.PERSONAL_ACCESS_TOKEN || secrets.GITHUB_TOKEN }}
          script: |
            const issueNumber = parseInt("${{ env.issueNumber }}");
            await github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: issueNumber,
              body: "The issue has been automatically resolved and the fix has been merged."
            });
            await github.rest.issues.update({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: issueNumber,
              state: "closed"
            });

    outputs:
      fixed: ${{ steps.verify.outputs.fixed }}
      message: ${{ steps.verify.outputs.message }}
      refinement: ${{ steps.verify.outputs.refinement }}
./.github/workflows/wfr-apply-fix.yml
==== Content of ./.github/workflows/wfr-apply-fix.yml ====
# .github/workflows/wfr-apply-fix.yml

#
# agentic-lib
# Copyright (C) 2025 Polycode Limited
#
# This file is part of agentic-lib.
#
# agentic-lib is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License v3.0 (GPL‑3).
# along with this program. If not, see <https://www.gnu.org/licenses/>.
#
# IMPORTANT: Any derived work must include the following attribution:
# "This work is derived from https://github.com/xn-intenton-z2a/agentic-lib"
#

name: ∞ Apply fix

on:
  workflow_call:
    inputs:
      target:
        description: 'The target file to review. e.g. "src/lib/main.js"'
        type: string
        required: false
        default: 'src/lib/main.js'
      testFile:
        description: 'The test file to review. e.g. "tests/unit/main.test.js"'
        type: string
        required: false
        default: 'tests/unit/main.test.js'
      readmeFile:
        description: 'The README file to review. e.g. "README.md"'
        type: string
        required: false
        default: 'README.md'
      contributingFile:
        description: 'The CONTRIBUTING file to review. e.g. "CONTRIBUTING.md"'
        type: string
        required: false
        default: 'CONTRIBUTING.md'
      dependenciesFile:
        description: 'The dependencies file to review. e.g. "package.json"'
        type: string
        required: false
        default: 'package.json'
      formattingFile:
        description: 'The formatting file to review. e.g. ".prettierrc"'
        type: string
        required: false
        default: '.prettierrc'
      lintingFile:
        description: 'The linting file to review. e.g. "eslint.config.js"'
        type: string
        required: false
        default: 'eslint.config.js'
      branchPrefix:
        description: 'The prefix for the issue branch. e.g. "issue-".'
        type: string
        required: true
      buildScript:
        description: 'The script must be runnable as: `npm ci ; <script>` and succeed with a zero exit code. e.g. `npm run build`'
        type: string
        required: false
        default: 'echo "No build script specified."'
      testScript:
        description: 'The script must be runnable as: `npm ci ; <script>` and succeed with a zero exit code. e.g. `npm test`'
        type: string
        required: false
        default: 'npm test'
      mainScript:
        description: 'The script must be runnable as: `npm ci ; <script>` and succeed with a zero exit code. e.g. `npm run start`'
        type: string
        required: false
        default: 'npm run start'
      model:
        description: 'The OpenAI model to use. e.g. "o3-mini"'
        type: string
        required: false
        default: ${{ vars.CHATGPT_API_MODEL || 'o3-mini' }}
      gitUserEmail:
        description: 'The email to use for git commits. e.g. "action@github.com"'
        type: string
        required: false
        default: 'action@github.com'
      gitUserName:
        description: 'The name to use for git commits. e.g. "GitHub Actions[bot]"'
        type: string
        required: false
        default: 'GitHub Actions[bot]'
    secrets:
      PERSONAL_ACCESS_TOKEN:
        required: false
      CHATGPT_API_SECRET_KEY:
        required: true
    outputs:
      fixApplied:
        value: ${{ jobs.start-issue.outputs.fixApplied }}

jobs:
  apply-fix:
    runs-on: ubuntu-latest

    env:
      target: ${{ inputs.target || 'src/lib/main.js' }}
      testFile: ${{ inputs.testFile || 'tests/unit/main.test.js' }}
      readmeFile: ${{ inputs.readmeFile || 'README.md' }}
      contributingFile: ${{ inputs.contributingFile || 'CONTRIBUTING.md' }}
      dependenciesFile: ${{ inputs.dependenciesFile || 'package.json' }}
      formattingFile: ${{ inputs.formattingFile || '.prettierrc' }}
      lintingFile: ${{ inputs.lintingFile || 'eslint.config.js' }}
      branchPrefix: ${{ inputs.branchPrefix || 'issue-' }}
      buildScript: ${{ inputs.buildScript || 'npm run build' }}
      testScript: ${{ inputs.testScript || 'npm test' }}
      mainScript: ${{ inputs.mainScript || 'npm run start' }}
      mainScriptTimeout: '5m'
      model: ${{ inputs.model || vars.CHATGPT_API_MODEL || 'o3-mini' }}
      chatgptApiSecretKey: ${{ secrets.CHATGPT_API_SECRET_KEY }}
      npmAuthOrganisation: ''
      gitUserEmail: ${{ inputs.gitUserEmail || 'action@github.com' }}
      gitUserName: ${{ inputs.gitUserName || 'GitHub Actions[bot]' }}

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Check GitHub authentication
        if: ${{ env.npmAuthOrganisation != '' }}
        shell: bash
        run: |
          curl --include --header "Authorization: token ${{ secrets.PERSONAL_ACCESS_TOKEN || secrets.GITHUB_TOKEN }}" https://api.github.com/user

      - name: Set up .npmrc
        if: ${{ env.npmAuthOrganisation != '' }}
        shell: bash
        run: |
          echo "${{ env.npmAuthOrganisation }}:registry=https://npm.pkg.github.com" >> .npmrc
          echo "//npm.pkg.github.com/:_authToken=${{ secrets.PERSONAL_ACCESS_TOKEN || secrets.GITHUB_TOKEN }}" >> .npmrc
          echo "always-auth=true" >> .npmrc

      - name: Install dependencies
        id: install
        shell: bash
        run: |
          set +e
          output=$(npm install 2>&1)
          echo "output<<EOF" >> "$GITHUB_OUTPUT"
          echo "$output" >> "$GITHUB_OUTPUT"
          echo "EOF" >> "$GITHUB_OUTPUT"
          echo "output=${output}"
          exit 0

      - name: Build project
        id: build
        shell: bash
        run: |
          set +e
          output=$(${{ env.buildScript }} 2>&1)
          echo "output<<EOF" >> "$GITHUB_OUTPUT"
          echo "$output" >> "$GITHUB_OUTPUT"
          echo "EOF" >> "$GITHUB_OUTPUT"
          echo "output=${output}"
          exit 0

      - name: Tear down .npmrc
        if: ${{ env.npmAuthOrganisation != '' }}
        shell: bash
        run: rm -f .npmrc

      - name: Run tests
        id: test
        shell: bash
        run: |
          set +e
          output=$(${{ env.testScript }} 2>&1)
          echo "output<<EOF" >> "$GITHUB_OUTPUT"
          echo "$output" >> "$GITHUB_OUTPUT"
          echo "EOF" >> "$GITHUB_OUTPUT"
          echo "output=${output}"
          exit 0

      - name: Run main
        id: main
        shell: bash
        run: |
          set +e
          output=$(timeout ${{ env.mainScriptTimeout }} ${{ env.mainScript }} 2>&1)
          echo "output<<EOF" >> "$GITHUB_OUTPUT"
          echo "$output" >> "$GITHUB_OUTPUT"
          echo "EOF" >> "$GITHUB_OUTPUT"
          echo "output=${output}"
          exit 0

      - name: update-target
        id: update-target
        uses: actions/github-script@v7
        env:
          installOutput: ${{ steps.install.outputs.output }}
          buildOutput: ${{ steps.build.outputs.output }}
          testOutput: ${{ steps.test.outputs.output }}
          mainOutput: ${{ steps.main.outputs.output }}
        with:
          github-token: ${{ secrets.PERSONAL_ACCESS_TOKEN || secrets.GITHUB_TOKEN }}
          script: |
            const target = process.env.target;
            const testFile = process.env.testFile;
            const readmeFile = process.env.readmeFile;
            const contributingFile = process.env.contributingFile;
            const dependenciesFile = process.env.dependenciesFile;
            const formattingFile = process.env.formattingFile;
            const lintingFile = process.env.lintingFile;
            const model = process.env.model;
            const apiKey = process.env.chatgptApiSecretKey;
            const installOutput = process.env.installOutput;
            const dependenciesListOutput = process.env.dependenciesListOutput;
            const buildScript = process.env.buildScript;
            const buildOutput = process.env.buildOutput;
            const testScript = process.env.testScript;
            const testOutput = process.env.testOutput;
            const mainScript = process.env.mainScript;
            const mainOutput = process.env.mainOutput;
            
            const fs = require('fs');
            const OpenAI = require('openai').default;
            const { z } = require('zod');
            require('dotenv').config();
            
            if (!apiKey) { 
              core.setFailed("Missing CHATGPT_API_SECRET_KEY"); 
            }
            const openai = new OpenAI({ apiKey });
            
            core.info(`target: "${target}"`);
            core.info(`testFile: "${testFile}"`);
            core.info(`readmeFile: "${readmeFile}"`);
            core.info(`contributingFile: "${contributingFile}"`);
            core.info(`dependenciesFile: "${dependenciesFile}"`);
            core.info(`formattingFile: "${formattingFile}"`);
            core.info(`lintingFile: "${lintingFile}"`);
            const sourceFileContent = fs.readFileSync(target, 'utf8');
            const testFileContent = fs.readFileSync(testFile, 'utf8');
            const readmeFileContent = fs.readFileSync(readmeFile, 'utf8');
            const contributingFileContent = fs.readFileSync(contributingFile, 'utf8');
            const dependenciesFileContent = fs.readFileSync(dependenciesFile, 'utf8');
            const formattingFileContent = fs.readFileSync(formattingFile, 'utf8');
            const lintingFileContent = fs.readFileSync(lintingFile, 'utf8');
            core.info(`Target file '${target}' has been loaded (length ${sourceFileContent.length}).`);
            core.info(`Test file '${testFile}' has been loaded (length ${testFileContent.length}).`);
            core.info(`Readme file '${readmeFile}' has been loaded (length ${readmeFileContent.length}).`);
            core.info(`Dependencies file '${dependenciesFile}' has been loaded (length ${dependenciesFileContent.length}).`);
            core.info(`Formatting file '${formattingFile}' has been loaded (length ${formattingFileContent.length}).`);
            core.info(`Linting file '${lintingFile}' has been loaded (length ${lintingFileContent.length}).`);
            
            const prompt = `
            You are providing the entire new content of the source file, test file and README file with all necessary changes applied to resolve a possible build or test problem.
            Consider the following when refining your response:
            * Source file content
            * Test file content
            * README file content issue
            * Contributing file content
            * Dependencies file content
            * Formatting file content
            * Linting file content
            * Dependency install output
            * Build output
            * Test output
            * Main execution output
            
            Apply the contributing guidelines to your response and when suggesting enhancements consider the tone and direction of the contributing guidelines.
            
            Source file: ${target}
            SOURCE_FILE_START
            ${sourceFileContent}
            SOURCE_FILE_END
            
            Test file: ${testFile}
            TEST_FILE_START
            ${testFileContent}
            TEST_FILE_END

            README file: ${readmeFile}
            README_FILE_START
            ${readmeFileContent}
            README_FILE_END

            Contributing file: ${contributingFile}
            CONTRIBUTING_FILE_START
            ${contributingFileContent}
            CONTRIBUTING_FILE_END
            
            Dependencies file: ${dependenciesFile}
            DEPENDENCIES_FILE_START
            ${dependenciesFileContent}
            DEPENDENCIES_FILE_END
            
            Formatting file: ${formattingFile}
            FORMATTING_FILE_START
            ${formattingFileContent}
            FORMATTING_FILE_END
            
            Linting file: ${lintingFile}
            LINTING_FILE_START
            ${lintingFileContent}
            LINTING_FILE_END        

            Dependencies install from command: npm install
            DEPENDENCIES_INSTALL_START
            ${installOutput}
            DEPENDENCIES_INSTALL_END    

            Build output from command: ${buildScript}
            BUILD_OUTPUT_START
            ${buildOutput}
            BUILD_OUTPUT_END      
            
            Test output from command: ${testScript}
            TEST_OUTPUT_START
            ${testOutput}
            TEST_OUTPUT_END            

            Main execution output from command: ${mainScript}
            MAIN_OUTPUT_START
            ${mainOutput}
            MAIN_OUTPUT_END    
            
            Please produce an updated version of the source file, and test file, and README and dependencies file that resolves the possible build or test problem.
            If there are no changes required, please provide the original content and state that no changes are necessary in the message.
            Answer strictly with a JSON object following this schema:
            
            {
              "updatedSourceFileContent": "The entire new content of the source file, with all necessary changes applied, if any.",
              "updatedTestFileContent": "The entire new content of the test file, with all necessary changes applied, if any.",
              "updatedReadmeFileContent": "The entire new content of the README file, with all necessary changes applied, if any.",
              "updatedDependenciesFileContent": "The entire new content of the dependencies file, with all necessary changes applied, if any.",
              "message": "A short sentence explaining the change applied (or why no changes were applied) suitable for a commit message or PR text."
            }
            
            Ensure valid JSON.
            `;
            
            const ResponseSchema = z.object({ updatedSourceFileContent: z.string(), updatedTestFileContent: z.string(), updatedReadmeFileContent: z.string(), updatedDependenciesFileContent: z.string(), message: z.string() });
            
            // Define the function schema for functional calling
            const applyIssueResolutionToSource = [{
              type: "function",
              function: {
                name: "applyIssueResolutionToSource",
                description: "Return an updated version of the source file content along with a commit message. Use the provided source file content and supporting context to generate the update.",
                parameters: {
                  type: "object",
                  properties: {
                    updatedSourceFileContent: {
                      type: "string",
                      description: "The entire new content of the source file, with all necessary changes applied, if any."
                    },
                    updatedTestFileContent: {
                      type: "string",
                      description: "The entire new content of the test file, with all necessary changes applied, if any."
                    },
                    updatedReadmeFileContent: {
                      type: "string",
                      description: "The entire new content of the README file, with all necessary changes applied, if any."
                    },
                    updatedDependenciesFileContent: {
                      type: "string",
                      description: "The entire new content of the dependencies file, with all necessary changes applied, if any."
                    },
                    message: {
                      type: "string",
                      description: "A short sentence explaining the change applied (or why no changes were applied) suitable for a commit message or PR text."
                    }
                  },
                  required: ["updatedSourceFileContent", "updatedTestFileContent", "updatedReadmeFileContent", "updatedDependenciesFileContent", "message"],
                  additionalProperties: false
                },
                strict: true
              }
            }];
            
            // Call OpenAI using the function calling format via the tools parameter
            const response = await openai.chat.completions.create({
              model,
              messages: [
                { role: "system", content: "You are a code fixer that returns an updated source file content, test file content, README file content and dependencies file content to resolve a possible build or test problem. Answer strictly with a JSON object that adheres to the provided function schema." },
                { role: "user", content: prompt }
              ],
              tools: applyIssueResolutionToSource
            });
            
            let fixApplied;
            let result;
            // Check if the model made a function call; if so, parse its arguments.
            if (response.choices[0].message.tool_calls && response.choices[0].message.tool_calls.length > 0) {
              try {
                result = JSON.parse(response.choices[0].message.tool_calls[0].function.arguments);
              } catch (e) {
                fixApplied = false;
                core.setFailed(`Failed to parse function call arguments: ${e.message}`);
              }
            } else if (response.choices[0].message.content) {
              try {
                result = JSON.parse(response.choices[0].message.content);
              } catch (e) {
                fixApplied = false;
                core.setFailed(`Failed to parse response content: ${e.message}`);
              }
            } else {
              fixApplied = false;
              core.setFailed("No valid response received from OpenAI.");
            }
            
            try {
              const parsed = ResponseSchema.parse(result);
              // Sanitize commit message: retain only alphanumerics, spaces, and basic URL-safe punctuation (-, _, ., ~)
              const sanitizedMessage = parsed.message.replace(/[^A-Za-z0-9 \-\_\.\~]/g, '').replace(/\s+/g, ' ').trim();
              core.setOutput("message", sanitizedMessage);
              core.info(`message: "${sanitizedMessage}"`);
            
              if(parsed.updatedSourceFileContent && parsed.updatedSourceFileContent.length > 1 && parsed.updatedSourceFileContent !== sourceFileContent) {
                fs.writeFileSync(target, parsed.updatedSourceFileContent, 'utf8');
                fixApplied = true;
                core.info(`Target file '${target}' has been updated (length ${parsed.updatedSourceFileContent.length}).`);
              }
              if(parsed.updatedTestFileContent && parsed.updatedTestFileContent.length > 1 && parsed.updatedTestFileContent !== testFileContent) {
                fs.writeFileSync(testFile, parsed.updatedTestFileContent, 'utf8');
                fixApplied = true;
                core.info(`Test file '${testFile}' has been updated (length ${parsed.updatedTestFileContent.length}).`);
              }
              if(parsed.updatedReadmeFileContent && parsed.updatedReadmeFileContent.length > 1 && parsed.updatedReadmeFileContent !== readmeFileContent) {
                fs.writeFileSync(readmeFile, parsed.updatedReadmeFileContent, 'utf8');
                fixApplied = true;
                core.info(`Readme file '${readmeFile}' has been updated (length ${parsed.updatedReadmeFileContent.length}).`);
              }
              if(parsed.updatedDependenciesFileContent && parsed.updatedDependenciesFileContent.length > 1 && parsed.updatedDependenciesFileContent !== dependenciesFileContent) {
                fs.writeFileSync(dependenciesFile, parsed.updatedDependenciesFileContent, 'utf8');
                fixApplied = true;
                core.info(`Dependencies file '${dependenciesFile}' has been updated (length ${parsed.updatedDependenciesFileContent.length}).`);
              }

            } catch (e) {
              fixApplied = false;
              core.setFailed(`Failed to validate or process the response: ${e.message}`);
            }
            
            core.setOutput("fixApplied", fixApplied);
            core.setOutput("usage", JSON.stringify(response.usage));
            core.info(`fixApplied: "${fixApplied}"`);
            core.info(`usage: "${JSON.stringify(response.usage)}"`);
            core.info(`response: "${JSON.stringify(response)}"`);

      - run: cat ${{ env.target }}

      - name: Examine the git working copy
        shell: bash
        run: |
          git config --local user.email '${{ env.gitUserEmail }}'
          git config --local user.name '${{ env.gitUserName }}'
          git status -v
          git diff ${{ env.target }}

      - run: |
          set +e
          npm install
          exit 0

      - name: Test after update
        shell: bash
        run: |
          set +e
          ${{ env.testScript }}
          exit 0

      - name: Run main after update
        shell: bash
        run: |
          set +e
          timeout ${{ env.mainScriptTimeout }} ${{ env.mainScript }}
          exit 0

      - name: Commit changes
        id: commit
        continue-on-error: true
        run: |
          git config --local user.email '${{ env.gitUserEmail }}'
          git config --local user.name '${{ env.gitUserName }}'
          git status -v
          git add -v --all
          git diff '${{ env.target }}'
          git commit -m '${{ steps.update-target.outputs.message }}'
          git status -v

    outputs:
      fixApplied: ${{ steps.update-target.outputs.fixApplied }}
./.github/workflows/wfr-automerge-find-pr-from-pull-request.yml
==== Content of ./.github/workflows/wfr-automerge-find-pr-from-pull-request.yml ====
# .github/workflows/wfr-automerge-find-pr-from-pull-request.yml

#
# agentic-lib
# Copyright (C) 2025 Polycode Limited
#
# This file is part of agentic-lib.
#
# agentic-lib is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License v3.0 (GPL‑3).
# along with this program. If not, see <https://www.gnu.org/licenses/>.
#
# IMPORTANT: Any derived work must include the following attribution:
# "This work is derived from https://github.com/xn-intenton-z2a/agentic-lib"
#

name: ∞ Get Pull Request

on:
  workflow_call:
    secrets:
      PERSONAL_ACCESS_TOKEN:
        required: false
    outputs:
      pullNumber:
        description: 'The pull request number. e.g. "123"'
        value: ${{ jobs.check-pr.outputs.pullNumber }}
      shouldSkipMerge:
        description: 'Set to "true", if the merge request should be skipped because there is not a PR in the right state.'
        value: ${{ jobs.check-pr.outputs.shouldSkipMerge }}
      prMerged:
        description: 'Set to "true", if the PR has been merged either already or by this process.'
        value: ${{ jobs.check-pr.outputs.prMerged }}

jobs:
  check-pr:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: check-pr
        id: check-pr
        uses: actions/github-script@v7
        with:
          github-token: ${{ secrets.PERSONAL_ACCESS_TOKEN || secrets.GITHUB_TOKEN }}
          script: |
            const pr = context.payload.pull_request;
            const pullNumber = pr.number;
            const owner = context.repo.owner;
            const repo = context.repo.repo;
            let shouldSkipMerge;
            let prMerged;
  
            const { data: pullRequest } = await github.rest.pulls.get({
              owner,
              repo,
              pull_number: pullNumber,
            });

            if (pullRequest.state === "closed") {
              core.info(`PR #${pr.number} is already closed.`);
              shouldSkipMerge = 'true';
              prMerged = 'true';
            } else if (pullRequest.state !== "open") {
              core.info(`PR #${pr.number} is not open it is ${pullRequest.state}.`);
              shouldSkipMerge = 'true';
              prMerged = 'false';
            } else if (pullRequest.mergeable === true) {
              core.info(`PR #${pr.number} is mergeable at state ${pullRequest.state}.`);
              shouldSkipMerge = 'false';    //   <--- This PR is mergeable.
              prMerged = 'false';
            } else if (pullRequest.mergeable === false) {
              core.info(`PR #${pullNumber} is not mergeable.`);
              shouldSkipMerge = 'true';
              prMerged = 'false';
            } else if (pullRequest.mergeable === null) {
              core.info(`PR #${pullNumber} does not yet have a value for mergeability.`);
              shouldSkipMerge = 'true';
              prMerged = 'false';
            } else {
              core.info(`PR #${pullNumber} is not known.`);
              shouldSkipMerge = 'true';
              prMerged = 'false';
            }
            
            core.setOutput('pullNumber', !pullNumber ? '' : pullNumber.toString());
            core.setOutput('shouldSkipMerge', shouldSkipMerge);
            core.setOutput('prMerged', prMerged);
            core.info(`pullNumber: '${!pullNumber ? '' : pullNumber.toString()}'`);
            core.info(`shouldSkipMerge: '${shouldSkipMerge}'`);
            core.info(`prMerged: '${prMerged}'`);

    outputs:
      pullNumber: ${{ steps.check-pr.outputs.pullNumber }}
      shouldSkipMerge: ${{ steps.check-pr.outputs.shouldSkipMerge }}
      prMerged: ${{ steps.check-pr.outputs.prMerged }}
./.github/workflows/publish.yml
==== Content of ./.github/workflows/publish.yml ====
# .github/workflows/publish.yml
#
# This file is part of the example suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT

name: Publish
run-name: 'Publish packages [${{ github.ref_name }}] [${{ github.event.head_commit.message }}]'
concurrency: branch-${{ github.ref_name }}

on:
  push:
    branches:
      # When publishing from a branch, add branch name here, e,g, 'beta'
      - main
    paths:
      - '**/*.sh'
      - '**/*.js'
      - '**/*.json'
      - '**/*.yml'
      - '**/*.properties'
      - '!intentions/**'
      - '!conversations/**'
      - '!exports/**'
      - '!programs/**'
      - '!results/**'
  workflow_dispatch:
    inputs:
      versionIncrement:
        description: 'Select the Semantic Versioning segment to increment'
        required: true
        default: 'prerelease'
        type: choice
        options:
          - prerelease
          - patch
          - minor
          - major
          - premajor
          - preminor
          - prepatch

jobs:

  npm-test-and-run-main:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci

      - name: test
        id: test
        shell: bash
        run: 'npm test'

      - name: main
        id: main
        shell: bash
        run: timeout 5m npm run start

  publish:
    needs:
      - npm-test-and-run-main
    permissions:
      contents: write
      packages: write
    uses: 'xn-intenton-z2a/agentic-lib/.github/workflows/wfr-publish.yml@main'
    with:
      versionIncrement: ${{ inputs.versionIncrement || 'prerelease' }}
      buildScript: 'npm run build'
      releaseNotes: 'Release incrment: ${{ inputs.versionIncrement }}.'
      npmAuthOrganisation: 'xn-intenton-z2a'
      gitUserEmail: 'action@github.com'
      gitUserName: 'GitHub Actions[bot]'
./.github/workflows/apply-fix.yml
==== Content of ./.github/workflows/apply-fix.yml ====
# .github/workflows/apply-fix.yml
#
# This file is part of the example suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT

name: Apply Fix
concurrency:
  issue-worker
  branch-main
run-name: "Apply Fix [${{ github.ref_name }}]"

on:
  workflow_dispatch:
    inputs:
      target:
        description: 'The source file whose content is used in the resolution prompt. e.g. "src/lib/main.js"'
        required: false
        type: string
        default: 'src/lib/main.js'
      testFile:
        description: 'The test file to run to validate the resolution. e.g. "tests/unit/main.test.js"'
        required: false
        type: string
        default: 'tests/unit/main.test.js'
  schedule:
    - cron: '15 2 * * *' # Run at 2:15am

jobs:

  apply-fix:
    permissions:
      contents: write
      issues: write
      id-token: write
    uses: 'xn-intenton-z2a/agentic-lib/.github/workflows/wfr-apply-fix.yml@main'
    with:
      target: ${{ inputs.target || 'src/lib/main.js' }}
      testFile: ${{ inputs.testFile || 'tests/unit/main.test.js' }}
      readmeFile: 'README.md'
      contributingFile: 'CONTRIBUTING.md'
      dependenciesFile: 'package.json'
      formattingFile: '.prettierrc'
      lintingFile: 'eslint.config.js'
      branchPrefix: 'issue-'
      buildScript: 'npm run build'
      testScript: 'npm test'
      mainScript: 'npm run start'
      model: ${{ vars.CHATGPT_API_MODEL || 'o3-mini' }}
      gitUserEmail: 'action@github.com'
      gitUserName: 'GitHub Actions[bot]'
    secrets:
      CHATGPT_API_SECRET_KEY: ${{ secrets.CHATGPT_API_SECRET_KEY }}
./.github/workflows/wfr-publish.yml
==== Content of ./.github/workflows/wfr-publish.yml ====
# .github/workflows/wfr-publish.yml

#
# agentic-lib
# Copyright (C) 2025 Polycode Limited
#
# This file is part of agentic-lib.
#
# agentic-lib is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License v3.0 (GPL‑3).
# along with this program. If not, see <https://www.gnu.org/licenses/>.
#
# IMPORTANT: Any derived work must include the following attribution:
# "This work is derived from https://github.com/xn-intenton-z2a/agentic-lib"
#

name: ∞ Publish packages

on:
  workflow_call:
    inputs:
      versionIncrement:
        description: 'The Semantic Versioning segment to increment. One of: major | minor | patch | premajor | preminor | prepatch | prerelease.'
        required: true
        type: string
        default: 'prerelease'
      buildScript:
        description: 'The script must be runnable as: `npm ci ; <script>` and succeed with a zero exit code. e.g. `npm run build`'
        type: string
        required: false
        default: 'echo "No build script specified."'
      releaseNotes:
        description: 'The release notes to use for the GitHub release. e.g. "Feature release."'
        type: string
        required: false
        default: 'Feature release.'
      npmAuthOrganisation:
        description: 'The GitHub organisation to authenticate with for npm. e.g. "xn-intenton-z2a"'
        type: string
        required: false
        default: ''
      gitUserEmail:
        description: 'The email to use for git commits. e.g. "action@github.com"'
        type: string
        required: false
        default: 'action@github.com'
      gitUserName:
        description: 'The name to use for git commits. e.g. "GitHub Actions[bot]"'
        type: string
        required: false
        default: 'GitHub Actions[bot]'
    secrets:
      PERSONAL_ACCESS_TOKEN:
        required: false
    outputs:
      releasedVersion:
        description: 'The version that was released. e.g. "1.0.1"'
        value: ${{ jobs.publish.outputs.releasedVersion }}
      newVersion:
        description: 'The version that was bumped to. e.g. "1.0.2-0"'
        value: ${{ jobs.publish.outputs.newVersion }}

jobs:
  publish:
    runs-on: ubuntu-latest

    env:
      versionIncrement: ${{ inputs.versionIncrement || 'prerelease' }}
      buildScript: ${{ inputs.buildScript || 'npm run build' }}
      releaseNotes: ${{ inputs.releaseNotes || 'Feature release.' }}
      npmAuthOrganisation: ${{ inputs.npmAuthOrganisation || '' }}
      gitUserEmail: ${{ inputs.gitUserEmail || 'action@github.com' }}
      gitUserName: ${{ inputs.gitUserName || 'GitHub Actions[bot]' }}
      gitCommitMessage: |
        ${{ inputs.gitCommitMessage || 'chore: dependency updates' }}

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Check GitHub authentication
        if: ${{ env.npmAuthOrganisation != '' }}
        shell: bash
        run: |
          curl --include --header "Authorization: token ${{ secrets.PERSONAL_ACCESS_TOKEN || secrets.GITHUB_TOKEN }}" https://api.github.com/user

      - name: Set up .npmrc
        if: ${{ env.npmAuthOrganisation != '' }}
        shell: bash
        run: |
          echo "${{ env.npmAuthOrganisation }}:registry=https://npm.pkg.github.com" >> .npmrc
          echo "//npm.pkg.github.com/:_authToken=${{ secrets.PERSONAL_ACCESS_TOKEN || secrets.GITHUB_TOKEN }}" >> .npmrc
          echo "always-auth=true" >> .npmrc

      - name: Install dependencies
        run: npm ci

      - name: Build project before publishing begins
        id: build
        shell: bash
        run: ${{ env.buildScript }}

      - name: Examine the git working copy (should have no changes)
        shell: bash
        run: |
          git config --local user.email '${{ env.gitUserEmail }}'
          git config --local user.name '${{ env.gitUserName }}'
          git status -v

      - name: released
        id: released
        if: ${{ env.versionIncrement == 'major' || env.versionIncrement == 'minor' || env.versionIncrement == 'patch' }}
        shell: bash
        run: |
          npm version ${{ env.versionIncrement }}
          ${{ env.buildScript }}
          npm publish --tag latest --access restricted
          git push --follow-tags
          releasedVersion=$(node -p "require('./package.json').version")
          echo "releasedVersion=${releasedVersion}" >> $GITHUB_OUTPUT
          echo "releasedVersion=${releasedVersion}"

      - name: Create GitHub Release
        if: ${{ env.versionIncrement == 'major' || env.versionIncrement == 'minor' || env.versionIncrement == 'patch' }}
        uses: ncipollo/release-action@v1
        with:
          tag: ${{ steps.released.outputs.releasedVersion }}
          name: Release ${{ steps.released.outputs.releasedVersion }}
          body: ${{ env.releaseNotes }}

      - name: Rotate to next pre[major|minor|patch] version from a released version
        if: ${{ env.versionIncrement == 'major' || env.versionIncrement == 'minor' || env.versionIncrement == 'patch' }}
        shell: bash
        run: |
          npm version --no-git-tag-version pre${{ env.versionIncrement }}

      - name: Rotate to next [premajor|preminor|prepatch|prerelease] version
        if: ${{ env.versionIncrement == 'premajor' || env.versionIncrement == 'preminor' || env.versionIncrement == 'prepatch' || env.versionIncrement == 'prerelease' }}
        shell: bash
        run: |
          npm version --no-git-tag-version ${{ env.versionIncrement }}

      - name: rotated
        id: rotated
        shell: bash
        run: |
          newVersion=$(node -p "require('./package.json').version")
          echo "newVersion=${newVersion}" >> $GITHUB_OUTPUT
          echo "newVersion=${newVersion}"

      - name: Examine the git working copy
        shell: bash
        run: |
          git config --local user.email '${{ env.gitUserEmail }}'
          git config --local user.name '${{ env.gitUserName }}'
          git status -v

      - name: Run build after version bump
        run: ${{ env.buildScript }}

      - name: Examine the git working copy
        shell: bash
        run: |
          git config --local user.email '${{ env.gitUserEmail }}'
          git config --local user.name '${{ env.gitUserName }}'
          git status -v

      - name: Push version commit
        id: push
        shell: bash
        run: |
          git config --local user.email "${{ env.gitUserEmail }}"
          git config --local user.name "${{ env.gitUserName }}"
          git add -v --all
          newVersion=$(node -p "require('./package.json').version")
          git commit -m "${newVersion?}"
          git push origin HEAD

      - name: Tear down .npmrc
        if: ${{ env.npmAuthOrganisation != '' }}
        shell: bash
        run: rm -f .npmrc

      - name: Upload package.json artifact
        uses: actions/upload-artifact@v4
        with:
          name: package-json
          path: "./package.json"

      - name: Log final version
        shell: bash
        run: |
          echo "Final version: ${{ steps.rotated.outputs.newVersion }}"

    outputs:
      releasedVersion: ${{ steps.released.outputs.releasedVersion }}
      newVersion: ${{ steps.rotated.outputs.newVersion }}
./.github/workflows/truncate-workflow-history.yml
==== Content of ./.github/workflows/truncate-workflow-history.yml ====
# .github/workflows/issue-creator.yml
#
# This file is part of the example suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT

name: ∞ Truncate Workflow Runs
concurrency: truncate-workflow-runs

on:
  workflow_dispatch:
  schedule:
    - cron: '0 0 * * *'

jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - name: Clean up old workflow runs and artifacts
        uses: actions/github-script@v7
        with:
          script: |
            // Set retention period (in days)
            const retentionDays = 7;
            const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
            const owner = context.repo.owner;
            const repo = context.repo.repo;
            const perPage = 100;
            let runsDeleted = 0;
            let artifactsDeleted = 0;

            console.log(`Deleting workflow runs and artifacts older than ${retentionDays} days (before ${cutoffDate.toISOString()})...`);

            // Delete old workflow runs
            let page = 1;
            while (true) {
              const runsResponse = await github.rest.actions.listWorkflowRunsForRepo({
                owner,
                repo,
                per_page: perPage,
                page
              });
              const runs = runsResponse.data.workflow_runs;
              if (runs.length === 0) break;
              for (const run of runs) {
                const runCreatedAt = new Date(run.created_at);
                if (runCreatedAt < cutoffDate) {
                  try {
                    await github.rest.actions.deleteWorkflowRun({
                      owner,
                      repo,
                      run_id: run.id
                    });
                    console.log(`Deleted workflow run ${run.id} (created at ${run.created_at})`);
                    runsDeleted++;
                  } catch (error) {
                    console.error(`Failed to delete run ${run.id}: ${error.message}`);
                  }
                }
              }
              page++;
            }
            console.log(`Total workflow runs deleted: ${runsDeleted}`);

            // Delete old artifacts
            page = 1;
            while (true) {
              const artifactsResponse = await github.rest.actions.listArtifactsForRepo({
                owner,
                repo,
                per_page: perPage,
                page
              });
              const artifacts = artifactsResponse.data.artifacts;
              if (artifacts.length === 0) break;
              for (const artifact of artifacts) {
                const artifactCreatedAt = new Date(artifact.created_at);
                if (artifactCreatedAt < cutoffDate) {
                  try {
                    await github.rest.actions.deleteArtifact({
                      owner,
                      repo,
                      artifact_id: artifact.id
                    });
                    console.log(`Deleted artifact ${artifact.id} (created at ${artifact.created_at})`);
                    artifactsDeleted++;
                  } catch (error) {
                    console.error(`Failed to delete artifact ${artifact.id}: ${error.message}`);
                  }
                }
              }
              page++;
            }
            console.log(`Total artifacts deleted: ${artifactsDeleted}`);

            return `Cleanup complete. Deleted ${runsDeleted} runs and ${artifactsDeleted} artifacts.`;
          result-encoding: string
./.github/workflows/wfr-automerge-label-issue.yml
==== Content of ./.github/workflows/wfr-automerge-label-issue.yml ====
# .github/workflows/wfr-automerge-label-issue.yml

#
# agentic-lib
# Copyright (C) 2025 Polycode Limited
#
# This file is part of agentic-lib.
#
# agentic-lib is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License v3.0 (GPL‑3).
# along with this program. If not, see <https://www.gnu.org/licenses/>.
#
# IMPORTANT: Any derived work must include the following attribution:
# "This work is derived from https://github.com/xn-intenton-z2a/agentic-lib"
#

name: ∞ Label Issue

on:
  workflow_call:
    inputs:
      pullNumber:
        description: 'The pull request number. e.g. "123"'
        type: string
        required: true
      branchPrefix:
        description: 'The prefix for the issue branch. e.g. "issue-".'
        type: string
        required: true
      commentPrefix:
        description: 'The prefix for the comment. e.g. "The feature branch ".'
        type: string
        required: false
        default: 'The feature branch has been merged: '
    secrets:
      PERSONAL_ACCESS_TOKEN:
        required: false
    outputs:
      issueNumber:
        description: 'The issue number just merged. e.g. "123"'
        value: ${{ jobs.check-pr.outputs.issueNumber }}
jobs:
  label-issue:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: extract-issueNumber
        id: extract-issue-number
        uses: actions/github-script@v7
        with:
          github-token: ${{ secrets.PERSONAL_ACCESS_TOKEN || secrets.GITHUB_TOKEN }}
          script: |
            const pullNumber = parseInt('${{ inputs.pullNumber }}', 10);
            const owner = context.repo.owner;
            const repo = context.repo.repo;
            
            const { data: pullRequest } = await github.rest.pulls.get({
              owner,
              repo,
              pull_number: pullNumber,
            });
            const branchName = pullRequest.head.ref;
            const issueNumberMatch = branchName.match(/${{ inputs.branchPrefix }}(\d+)/);
            let issueNumber;
            if (issueNumberMatch) {
              issueNumber = issueNumberMatch[1];
            } else {
              issueNumber = '';
            }

            core.setOutput('issueNumber', issueNumber);
            core.info(`issueNumber '${issueNumber}'`);

      - name: Add "merged" label and comment on issue
        if: steps.extract-issue-number.outputs.issueNumber != ''
        uses: actions/github-script@v7
        with:
          github-token: ${{ secrets.PERSONAL_ACCESS_TOKEN || secrets.GITHUB_TOKEN }}
          script: |
            const pullNumber = parseInt('${{ inputs.pullNumber }}', 10);
            const owner = context.repo.owner;
            const repo = context.repo.repo;
            
            const { data: pullRequest } = await github.rest.pulls.get({
              owner,
              repo,
              pull_number: pullNumber,
            });
            const issueNumber = '${{ steps.extract-issue-number.outputs.issueNumber }}';
            const branchName = pullRequest.head.ref;
            const commentBody = `${{ inputs.branchPrefix || 'The feature branch has been merged: ' }}${branchName}`;
            await github.rest.issues.addLabels({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: issueNumber,
              labels: ['merged']
            });
            await github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: issueNumber,
              body: commentBody
            });
    outputs:
      issueNumber: ${{ steps.extract-issue-number.outputs.issueNumber }}./.github/workflows/wfr-automerge-merge-pr.yml
==== Content of ./.github/workflows/wfr-automerge-merge-pr.yml ====
# .github/workflows/wfr-automerge-merge-pr.yml

#
# agentic-lib
# Copyright (C) 2025 Polycode Limited
#
# This file is part of agentic-lib.
#
# agentic-lib is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License v3.0 (GPL‑3).
# along with this program. If not, see <https://www.gnu.org/licenses/>.
#
# IMPORTANT: Any derived work must include the following attribution:
# "This work is derived from https://github.com/xn-intenton-z2a/agentic-lib"
#

name: ∞ Automerge Pull Request

on:
  workflow_call:
    inputs:
      pullNumber:
        description: 'The pull request number. e.g. "123"'
        type: string
        required: true
    secrets:
      PERSONAL_ACCESS_TOKEN:
        required: false
    outputs:
      prMerged:
        description: 'Set to "true", if the PR has been merged either already or by this process.'
        value: ${{ jobs.merge-pr.outputs.prMerged }}

jobs:
  merge-pr:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: auto-merge-pr
        id: auto-merge-pr
        uses: actions/github-script@v7
        with:
          github-token: ${{ secrets.PERSONAL_ACCESS_TOKEN || secrets.GITHUB_TOKEN }}
          script: |
            const pullNumber = parseInt('${{ inputs.pullNumber }}', 10);
            const owner = context.repo.owner;
            const repo = context.repo.repo;
            let prMerged;
  
            const { data: pullRequest } = await github.rest.pulls.get({
              owner,
              repo,
              pull_number: pullNumber,
            });

            if (pullRequest.state === "closed") {
              core.info(`PR #${pullNumber} is already closed.`);
              prMerged = 'true';
            } else if (pullRequest.state !== 'open') {
              core.info(`PR #${pullNumber} is not open it is ${pullRequest.state}.`);
              prMerged = 'false';
            } else if (pullRequest.mergeable && pullRequest.mergeable_state === 'clean') {
            
              await github.rest.pulls.merge({
                owner,
                repo,
                pull_number: pullNumber,
                merge_method: 'squash',
              });
              core.info(`PR #${pullNumber} merged.`);
            
              const branchRef = `heads/${pullRequest.head.ref}`;
              await github.rest.git.deleteRef({
                owner,
                repo,
                ref: branchRef,
              });
              core.info(`Branch '${pullRequest.head.ref}' deleted.`);
              prMerged = 'true';
            
            } else if (pullRequest.mergeable === false) {
              core.info(`PR #${pullNumber} is not mergeable.`);
              prMerged = 'false';
            } else if (pullRequest.mergeable === null) {
              core.info(`PR #${pullNumber} does not yet have a value for mergeability.`);
              prMerged = 'false';
            } else {
              core.info(`PR #${pullNumber} is not known.`);
              prMerged = 'false';
            }
            
            core.setOutput('prMerged', prMerged);
            core.info(`prMerged: '${prMerged}'`);

    outputs:
      prMerged: ${{ steps.auto-merge-pr.outputs.prMerged }}
./.github/workflows/wfr-start-issue.yml
==== Content of ./.github/workflows/wfr-start-issue.yml ====
# .github/workflows/wfr-start-issue.yml

#
# agentic-lib
# Copyright (C) 2025 Polycode Limited
#
# This file is part of agentic-lib.
#
# agentic-lib is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License v3.0 (GPL‑3).
# along with this program. If not, see <https://www.gnu.org/licenses/>.
#
# IMPORTANT: Any derived work must include the following attribution:
# "This work is derived from https://github.com/xn-intenton-z2a/agentic-lib"
#

name: ∞ Start issue

on:
  workflow_call:
    inputs:
      issueNumber:
        description: 'The issue number to review. e.g. "123"'
        type: string
        required: true
      target:
        description: 'The target file to review. e.g. "src/lib/main.js"'
        type: string
        required: false
        default: 'src/lib/main.js'
      testFile:
        description: 'The test file to review. e.g. "tests/unit/main.test.js"'
        type: string
        required: false
        default: 'tests/unit/main.test.js'
      readmeFile:
        description: 'The README file to review. e.g. "README.md"'
        type: string
        required: false
        default: 'README.md'
      contributingFile:
        description: 'The CONTRIBUTING file to review. e.g. "CONTRIBUTING.md"'
        type: string
        required: false
        default: 'CONTRIBUTING.md'
      dependenciesFile:
        description: 'The dependencies file to review. e.g. "package.json"'
        type: string
        required: false
        default: 'package.json'
      formattingFile:
        description: 'The formatting file to review. e.g. ".prettierrc"'
        type: string
        required: false
        default: '.prettierrc'
      lintingFile:
        description: 'The linting file to review. e.g. "eslint.config.js"'
        type: string
        required: false
        default: 'eslint.config.js'
      branchPrefix:
        description: 'The prefix for the issue branch. e.g. "issue-".'
        type: string
        required: true
      buildScript:
        description: 'The script must be runnable as: `npm ci ; <script>` and succeed with a zero exit code. e.g. `npm run build`'
        type: string
        required: false
        default: 'echo "No build script specified."'
      testScript:
        description: 'The script must be runnable as: `npm ci ; <script>` and succeed with a zero exit code. e.g. `npm test`'
        type: string
        required: false
        default: 'npm test'
      mainScript:
        description: 'The script must be runnable as: `npm ci ; <script>` and succeed with a zero exit code. e.g. `npm run start`'
        type: string
        required: false
        default: 'npm run start'
      model:
        description: 'The OpenAI model to use. e.g. "o3-mini"'
        type: string
        required: false
        default: ${{ vars.CHATGPT_API_MODEL || 'o3-mini' }}
      gitUserEmail:
        description: 'The email to use for git commits. e.g. "action@github.com"'
        type: string
        required: false
        default: 'action@github.com'
      gitUserName:
        description: 'The name to use for git commits. e.g. "GitHub Actions[bot]"'
        type: string
        required: false
        default: 'GitHub Actions[bot]'
    secrets:
      PERSONAL_ACCESS_TOKEN:
        required: false
      CHATGPT_API_SECRET_KEY:
        required: true
    outputs:
      fixApplied:
        value: ${{ jobs.start-issue.outputs.fixApplied }}
      message:
        value: ${{ jobs.start-issue.outputs.message }}

jobs:
  start-issue:
    runs-on: ubuntu-latest

    env:
      issueNumber: ${{ inputs.issueNumber }}
      target: ${{ inputs.target || 'src/lib/main.js' }}
      testFile: ${{ inputs.testFile || 'tests/unit/main.test.js' }}
      readmeFile: ${{ inputs.readmeFile || 'README.md' }}
      contributingFile: ${{ inputs.contributingFile || 'CONTRIBUTING.md' }}
      dependenciesFile: ${{ inputs.dependenciesFile || 'package.json' }}
      formattingFile: ${{ inputs.formattingFile || '.prettierrc' }}
      lintingFile: ${{ inputs.lintingFile || 'eslint.config.js' }}
      branchPrefix: ${{ inputs.branchPrefix || 'issue-' }}
      buildScript: ${{ inputs.buildScript || 'npm run build' }}
      testScript: ${{ inputs.testScript || 'npm test' }}
      mainScript: ${{ inputs.mainScript || 'npm run start' }}
      mainScriptTimeout: '5m'
      model: ${{ inputs.model || vars.CHATGPT_API_MODEL || 'o3-mini' }}
      chatgptApiSecretKey: ${{ secrets.CHATGPT_API_SECRET_KEY }}
      npmAuthOrganisation: ''
      gitUserEmail: ${{ inputs.gitUserEmail || 'action@github.com' }}
      gitUserName: ${{ inputs.gitUserName || 'GitHub Actions[bot]' }}

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Check GitHub authentication
        if: ${{ env.npmAuthOrganisation != '' }}
        shell: bash
        run: |
          curl --include --header "Authorization: token ${{ secrets.PERSONAL_ACCESS_TOKEN || secrets.GITHUB_TOKEN }}" https://api.github.com/user

      - name: Set up .npmrc
        if: ${{ env.npmAuthOrganisation != '' }}
        shell: bash
        run: |
          echo "${{ env.npmAuthOrganisation }}:registry=https://npm.pkg.github.com" >> .npmrc
          echo "//npm.pkg.github.com/:_authToken=${{ secrets.PERSONAL_ACCESS_TOKEN || secrets.GITHUB_TOKEN }}" >> .npmrc
          echo "always-auth=true" >> .npmrc

      - run: npm ci

      - name: List dependencies
        id: list
        shell: bash
        run: |
          output=$(npm list 2>&1)
          echo "output<<EOF" >> "$GITHUB_OUTPUT"
          echo "$output" >> "$GITHUB_OUTPUT"
          echo "EOF" >> "$GITHUB_OUTPUT"
          echo "output=${output}"

      - name: Build project
        id: build
        shell: bash
        run: |
          output=$(${{ env.buildScript }} 2>&1)
          echo "output<<EOF" >> "$GITHUB_OUTPUT"
          echo "$output" >> "$GITHUB_OUTPUT"
          echo "EOF" >> "$GITHUB_OUTPUT"
          echo "output=${output}"

      - name: Run tests
        id: test
        shell: bash
        run: |
          output=$(${{ env.testScript }} 2>&1)
          echo "output<<EOF" >> "$GITHUB_OUTPUT"
          echo "$output" >> "$GITHUB_OUTPUT"
          echo "EOF" >> "$GITHUB_OUTPUT"
          echo "output=${output}"

      - name: Run main
        id: main
        shell: bash
        run: |
          output=$(timeout ${{ env.mainScriptTimeout }} ${{ env.mainScript }} 2>&1)
          echo "output<<EOF" >> "$GITHUB_OUTPUT"
          echo "$output" >> "$GITHUB_OUTPUT"
          echo "EOF" >> "$GITHUB_OUTPUT"
          echo "output=${output}"

      - name: update-target
        id: update-target
        uses: actions/github-script@v7
        env:
          dependenciesListOutput: ${{ steps.list.outputs.output }}
          buildOutput: ${{ steps.build.outputs.output }}
          testOutput: ${{ steps.test.outputs.output }}
          mainOutput: ${{ steps.main.outputs.output }}
        with:
          github-token: ${{ secrets.PERSONAL_ACCESS_TOKEN || secrets.GITHUB_TOKEN }}
          script: |
            const target = process.env.target;
            const testFile = process.env.testFile;
            const readmeFile = process.env.readmeFile;
            const contributingFile = process.env.contributingFile;
            const dependenciesFile = process.env.dependenciesFile;
            const formattingFile = process.env.formattingFile;
            const lintingFile = process.env.lintingFile;
            const model = process.env.model;
            const apiKey = process.env.chatgptApiSecretKey;
            const issueNumber = parseInt(process.env.issueNumber);
            const dependenciesListOutput = process.env.dependenciesListOutput;
            const buildScript = process.env.buildScript;
            const buildOutput = process.env.buildOutput;
            const testScript = process.env.testScript;
            const testOutput = process.env.testOutput;
            const mainScript = process.env.mainScript;
            const mainOutput = process.env.mainOutput;
            
            const fs = require('fs');
            const OpenAI = require('openai').default;
            const { z } = require('zod');
            require('dotenv').config();
            
            if (!apiKey) { 
              core.setFailed("Missing CHATGPT_API_SECRET_KEY"); 
            }
            const openai = new OpenAI({ apiKey });
            
            core.info(`target: "${target}"`);
            core.info(`testFile: "${testFile}"`);
            core.info(`readmeFile: "${readmeFile}"`);
            core.info(`contributingFile: "${contributingFile}"`);
            core.info(`dependenciesFile: "${dependenciesFile}"`);
            core.info(`formattingFile: "${formattingFile}"`);
            core.info(`lintingFile: "${lintingFile}"`);
            const sourceFileContent = fs.readFileSync(target, 'utf8');
            const testFileContent = fs.readFileSync(testFile, 'utf8');
            const readmeFileContent = fs.readFileSync(readmeFile, 'utf8');
            const contributingFileContent = fs.readFileSync(contributingFile, 'utf8');
            const dependenciesFileContent = fs.readFileSync(dependenciesFile, 'utf8');
            const formattingFileContent = fs.readFileSync(formattingFile, 'utf8');
            const lintingFileContent = fs.readFileSync(lintingFile, 'utf8');
            core.info(`Target file '${target}' has been loaded (length ${sourceFileContent.length}).`);
            core.info(`Test file '${testFile}' has been loaded (length ${testFileContent.length}).`);
            core.info(`Readme file '${readmeFile}' has been loaded (length ${readmeFileContent.length}).`);
            core.info(`Dependencies file '${dependenciesFile}' has been loaded (length ${dependenciesFileContent.length}).`);
            core.info(`Formatting file '${formattingFile}' has been loaded (length ${formattingFileContent.length}).`);
            core.info(`Linting file '${lintingFile}' has been loaded (length ${lintingFileContent.length}).`);
            
            const issue = await github.rest.issues.get({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: issueNumber
            });
            const issueTitle = issue.data.title;
            const issueDescription = issue.data.body;
            const issueComments = await github.rest.issues.listComments({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: issueNumber
            });
            const issueCommentsText = issueComments.data
              .map(comment => `Author:${comment.user.login}, Created:${comment.created_at}, Comment: ${comment.body}`)
              .join('\n');
            
            const prompt = `
            You are providing the entire new content of the source file, test file and README file with all necessary changes applied to resolve an issue.
            Consider the following when refining your response:
            * Source file content
            * Test file content
            * README file content issue
            * Contributing file content
            * Dependencies file content
            * Formatting file content
            * Linting file content
            * Issue details
            * Dependency list
            * Build output
            * Test output
            * Main execution output
            
            Apply the contributing guidelines to your response and when suggesting enhancements consider the tone and direction of the contributing guidelines.
            
            Source file: ${target}
            SOURCE_FILE_START
            ${sourceFileContent}
            SOURCE_FILE_END
            
            Test file: ${testFile}
            TEST_FILE_START
            ${testFileContent}
            TEST_FILE_END

            README file: ${readmeFile}
            README_FILE_START
            ${readmeFileContent}
            README_FILE_END

            Contributing file: ${contributingFile}
            CONTRIBUTING_FILE_START
            ${contributingFileContent}
            CONTRIBUTING_FILE_END
            
            Dependencies file: ${dependenciesFile}
            DEPENDENCIES_FILE_START
            ${dependenciesFileContent}
            DEPENDENCIES_FILE_END
            
            Formatting file: ${formattingFile}
            FORMATTING_FILE_START
            ${formattingFileContent}
            FORMATTING_FILE_END
            
            Linting file: ${lintingFile}
            LINTING_FILE_START
            ${lintingFileContent}
            LINTING_FILE_END
                 
            Issue details:
            ISSUE_START
            title: ${issueTitle}
            description:
            ${issueDescription}
            comments:
            ${issueCommentsText}
            ISSUE_END            

            Dependencies list from command: npm list
            DEPENDENCIES_LIST_START
            ${dependenciesListOutput}
            DEPENDENCIES_LIST_END    

            Build output from command: ${buildScript}
            BUILD_OUTPUT_START
            ${buildOutput}
            BUILD_OUTPUT_END      
            
            Test output from command: ${testScript}
            TEST_OUTPUT_START
            ${testOutput}
            TEST_OUTPUT_END            

            Main execution output from command: ${mainScript}
            MAIN_OUTPUT_START
            ${mainOutput}
            MAIN_OUTPUT_END    
            
            Please produce an updated version of the source file, and test file, and README and dependencies file that resolves the issue.
            Answer strictly with a JSON object following this schema:
            
            {
              "updatedSourceFileContent": "The entire new content of the source file, with all necessary changes applied.",
              "updatedTestFileContent": "The entire new content of the test file, with all necessary changes applied.",
              "updatedReadmeFileContent": "The entire new content of the README file, with all necessary changes applied.",
              "updatedDependenciesFileContent": "The entire new content of the dependencies file, with all necessary changes applied.",
              "message": "A short sentence explaining the change applied suitable for a commit message."
            }
            
            Ensure valid JSON.
            `;
            
            const ResponseSchema = z.object({ updatedSourceFileContent: z.string(), updatedTestFileContent: z.string(), updatedReadmeFileContent: z.string(), updatedDependenciesFileContent: z.string(), message: z.string() });
            
            // Define the function schema for functional calling
            const applyIssueResolutionToSource = [{
              type: "function",
              function: {
                name: "applyIssueResolutionToSource",
                description: "Return an updated version of the source file content along with a commit message. Use the provided source file content and supporting context to generate the update.",
                parameters: {
                  type: "object",
                  properties: {
                    updatedSourceFileContent: {
                      type: "string",
                      description: "The entire new content of the source file, with all necessary changes applied."
                    },
                    updatedTestFileContent: {
                      type: "string",
                      description: "The entire new content of the test file, with all necessary changes applied."
                    },
                    updatedReadmeFileContent: {
                      type: "string",
                      description: "The entire new content of the README file, with all necessary changes applied."
                    },
                    updatedDependenciesFileContent: {
                      type: "string",
                      description: "The entire new content of the dependencies file, with all necessary changes applied."
                    },
                    message: {
                      type: "string",
                      description: "A short sentence explaining the change applied suitable for a commit message."
                    }
                  },
                  required: ["updatedSourceFileContent", "updatedTestFileContent", "updatedReadmeFileContent", "updatedDependenciesFileContent", "message"],
                  additionalProperties: false
                },
                strict: true
              }
            }];
            
            // Call OpenAI using the function calling format via the tools parameter
            const response = await openai.chat.completions.create({
              model,
              messages: [
                { role: "system", content: "You are a code fixer that returns an updated source file content, test file content, README file content and dependencies file content to resolve an issue. Answer strictly with a JSON object that adheres to the provided function schema." },
                { role: "user", content: prompt }
              ],
              tools: applyIssueResolutionToSource
            });
            
            let fixApplied;
            let result;
            // Check if the model made a function call; if so, parse its arguments.
            if (response.choices[0].message.tool_calls && response.choices[0].message.tool_calls.length > 0) {
              try {
                result = JSON.parse(response.choices[0].message.tool_calls[0].function.arguments);
              } catch (e) {
                fixApplied = false;
                core.setFailed(`Failed to parse function call arguments: ${e.message}`);
              }
            } else if (response.choices[0].message.content) {
              try {
                result = JSON.parse(response.choices[0].message.content);
              } catch (e) {
                fixApplied = false;
                core.setFailed(`Failed to parse response content: ${e.message}`);
              }
            } else {
              fixApplied = false;
              core.setFailed("No valid response received from OpenAI.");
            }
            
            try {
              const parsed = ResponseSchema.parse(result);
              // Sanitize commit message: retain only alphanumerics, spaces, and basic URL-safe punctuation (-, _, ., ~)
              const sanitizedMessage = parsed.message.replace(/[^A-Za-z0-9 \-\_\.\~]/g, '').replace(/\s+/g, ' ').trim();
              core.setOutput("message", sanitizedMessage);
              core.info(`message: "${sanitizedMessage}"`);
            
              if(parsed.updatedSourceFileContent && parsed.updatedSourceFileContent.length > 1 && parsed.updatedSourceFileContent !== sourceFileContent) {
                fs.writeFileSync(target, parsed.updatedSourceFileContent, 'utf8');
                fixApplied = true;
                core.info(`Target file '${target}' has been updated (length ${parsed.updatedSourceFileContent.length}).`);
              }
              if(parsed.updatedTestFileContent && parsed.updatedTestFileContent.length > 1 && parsed.updatedTestFileContent !== testFileContent) {
                fs.writeFileSync(testFile, parsed.updatedTestFileContent, 'utf8');
                fixApplied = true;
                core.info(`Test file '${testFile}' has been updated (length ${parsed.updatedTestFileContent.length}).`);
              }
              if(parsed.updatedReadmeFileContent && parsed.updatedReadmeFileContent.length > 1 && parsed.updatedReadmeFileContent !== readmeFileContent) {
                fs.writeFileSync(readmeFile, parsed.updatedReadmeFileContent, 'utf8');
                fixApplied = true;
                core.info(`Readme file '${readmeFile}' has been updated (length ${parsed.updatedReadmeFileContent.length}).`);
              }
              if(parsed.updatedDependenciesFileContent && parsed.updatedDependenciesFileContent.length > 1 && parsed.updatedDependenciesFileContent !== dependenciesFileContent) {
                fs.writeFileSync(dependenciesFile, parsed.updatedDependenciesFileContent, 'utf8');
                fixApplied = true;
                core.info(`Dependencies file '${dependenciesFile}' has been updated (length ${parsed.updatedDependenciesFileContent.length}).`);
              }

              await github.rest.issues.createComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: issueNumber,
                body: parsed.message
              });
            } catch (e) {
              fixApplied = false;
              core.setFailed(`Failed to validate or process the response: ${e.message}`);
            }
            
            core.setOutput("fixApplied", fixApplied);
            core.setOutput("usage", JSON.stringify(response.usage));
            core.info(`fixApplied: "${fixApplied}"`);
            core.info(`usage: "${JSON.stringify(response.usage)}"`);
            core.info(`response: "${JSON.stringify(response)}"`);

      - run: cat ${{ env.target }}

      - name: Examine the git working copy
        shell: bash
        run: |
          git config --local user.email '${{ env.gitUserEmail }}'
          git config --local user.name '${{ env.gitUserName }}'
          git status -v
          git diff ${{ env.target }}

      - run: rm -rf node_modules

      - run: npm install

      - run: npm ci

      - name: Tear down .npmrc
        if: ${{ env.npmAuthOrganisation != '' }}
        shell: bash
        run: rm -f .npmrc

      - name: Test after update
        shell: bash
        run: |
          ${{ env.testScript }}

      - name: Run main after update
        shell: bash
        run: |
          timeout ${{ env.mainScriptTimeout }} ${{ env.mainScript }}

      - name: Commit to new branch
        id: commit
        continue-on-error: true
        run: |
          git config --local user.email '${{ env.gitUserEmail }}'
          git config --local user.name '${{ env.gitUserName }}'
          git status -v
          git switch -c '${{ env.branchPrefix }}${{ env.issueNumber }}'
          git add -v --all
          git diff '${{ env.target }}'
          git commit -m '${{ steps.update-target.outputs.message }} (fixes #${{ env.issueNumber }})'
          git push --set-upstream origin '${{ env.branchPrefix }}${{ env.issueNumber }}' -v
          git status -v

      - name: Post Resolution Comment
        uses: actions/github-script@v7
        with:
          github-token: ${{ secrets.PERSONAL_ACCESS_TOKEN || secrets.GITHUB_TOKEN }}
          script: |
            const issueNumber = parseInt("${{ env.issueNumber }}");
            const branchName = `${{ env.branchPrefix }}${{ env.issueNumber }}`;
            const branchUrl = `https://github.com/${{ github.repository }}/tree/${branchName}`;
            const body = `${branchUrl}`;
            await github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: issueNumber,
              body: body
            });
            await github.rest.issues.addAssignees({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: issueNumber,
              assignees: [ context.actor ]
            });

    outputs:
      fixApplied: ${{ steps.update-target.outputs.fixApplied }}
      message: ${{ steps.update-target.outputs.message }}
./.github/workflows/test.yml
==== Content of ./.github/workflows/test.yml ====
# .github/workflows/test.yml
#
# This file is part of the example suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT

name: Tests
run-name: 'Tests [${{ github.ref_name }}] [${{ github.event.head_commit.message }}]'

on:
  push:
    paths:
      - '**/*.sh'
      - '**/*.js'
      - '**/*.json'
      - '**/*.yml'
      - '**/*.properties'
      - '!exports/**'
  workflow_dispatch:
  workflow_run:
    workflows:
      - "Automerge"
    types:
      - completed
  schedule:
    - cron: '45 */6 * * *'

jobs:

  npm-test:
    name: 'npm test with coverage'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm test
./.github/workflows/wfr-update.yml
==== Content of ./.github/workflows/wfr-update.yml ====
# .github/workflows/wfr-update.yml

#
# agentic-lib
# Copyright (C) 2025 Polycode Limited
#
# This file is part of agentic-lib.
#
# agentic-lib is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License v3.0 (GPL‑3).
# along with this program. If not, see <https://www.gnu.org/licenses/>.
#
# IMPORTANT: Any derived work must include the following attribution:
# "This work is derived from https://github.com/xn-intenton-z2a/agentic-lib"
#

name: ∞ Update packages

on:
  workflow_call:
    inputs:
      buildScript:
        description: 'The script must be runnable as: `npm ci ; <script>` and succeed with a zero exit code. e.g. `npm run build`'
        type: string
        required: false
        default: 'echo "No build script specified."'
      testScript:
        description: 'The script must be runnable as: `npm ci ; <script>` and succeed with a zero exit code. e.g. `npm test`'
        type: string
        required: false
        default: 'npm test'
      mainScript:
        description: 'The script must be runnable as: `npm ci ; <script>` and succeed with a zero exit code. e.g. `npm run start`'
        type: string
        required: false
        default: 'npm run start'
      upgradeTarget:
        description: 'The type of upgrade to perform. e.g. "minor"'
        type: string
        required: false
        default: 'minor'
      branch:
        description: 'The branch to push changes to. e.g. "apply-update"'
        type: string
        required: false
        default: 'apply-update'
      npmAuthOrganisation:
        description: 'The GitHub organisation to authenticate with for npm. e.g. "xn-intenton-z2a"'
        type: string
        required: false
        default: ''
      gitUserEmail:
        description: 'The email to use for git commits. e.g. "action@github.com"'
        type: string
        required: false
        default: 'action@github.com'
      gitUserName:
        description: 'The name to use for git commits. e.g. "GitHub Actions[bot]"'
        type: string
        required: false
        default: 'GitHub Actions[bot]'
      gitCommitMessage:
        description: 'The message to use for git commits. e.g. "chore: dependency updates"'
        type: string
        required: false
        default: 'chore: dependency updates'
    secrets:
      PERSONAL_ACCESS_TOKEN:
        required: false
    outputs:
      updatedFiles:
          description: 'Whether files were updated by the script. e.g. "true"'
          value: ${{ jobs.update.outputs.updatedFiles }}

jobs:
  update:
    runs-on: ubuntu-latest

    env:
      buildScript: ${{ inputs.buildScript || 'npm run build' }}
      testScript: ${{ inputs.testScript || 'npm test' }}
      mainScript: ${{ inputs.mainScript || 'npm run start' }}
      mainScriptTimeout: '5m'
      upgradeTarget: ${{ inputs.upgradeTarget || 'minor' }}
      branch: ${{ inputs.branch || 'apply-update' }}
      npmAuthOrganisation: ${{ inputs.npmAuthOrganisation || '' }}
      gitUserEmail: ${{ inputs.gitUserEmail || 'action@github.com' }}
      gitUserName: ${{ inputs.gitUserName || 'GitHub Actions[bot]' }}
      gitCommitMessage: |
        ${{ inputs.gitCommitMessage || 'chore: dependency updates' }}

    steps:

      - name: Log which version
        if: ${{ github.event.client_payload }}
        shell: bash
        run: |
          echo "Package: ${{ github.event.client_payload.packageName }}"

      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Check GitHub authentication
        if: ${{ env.npmAuthOrganisation != '' }}
        shell: bash
        run: |
          curl --include --header "Authorization: token ${{ secrets.PERSONAL_ACCESS_TOKEN || secrets.GITHUB_TOKEN }}" https://api.github.com/user

      - name: Set up .npmrc
        if: ${{ env.npmAuthOrganisation != '' }}
        shell: bash
        run: |
          echo "${{ env.npmAuthOrganisation }}:registry=https://npm.pkg.github.com" >> .npmrc
          echo "//npm.pkg.github.com/:_authToken=${{ secrets.PERSONAL_ACCESS_TOKEN || secrets.GITHUB_TOKEN }}" >> .npmrc
          echo "always-auth=true" >> .npmrc

      - run: rm -f package-lock.json

      - run: npm install

      - name: Build project
        id: build
        shell: bash
        run: |
          output=$(${{ env.buildScript }} 2>&1)
          echo "output<<EOF" >> "$GITHUB_OUTPUT"
          echo "$output" >> "$GITHUB_OUTPUT"
          echo "EOF" >> "$GITHUB_OUTPUT"
          echo "output=${output}"

      - name: Run tests before update
        id: test
        shell: bash
        run: |
          output=$(${{ env.testScript }} 2>&1)
          echo "output<<EOF" >> "$GITHUB_OUTPUT"
          echo "$output" >> "$GITHUB_OUTPUT"
          echo "EOF" >> "$GITHUB_OUTPUT"
          echo "output=${output}"

      - name: Run main before update
        id: main
        shell: bash
        run: |
          output=$(timeout ${{ env.mainScriptTimeout }} ${{ env.mainScript }} 2>&1)
          echo "output<<EOF" >> "$GITHUB_OUTPUT"
          echo "$output" >> "$GITHUB_OUTPUT"
          echo "EOF" >> "$GITHUB_OUTPUT"
          echo "output=${output}"

      - name: Update packages with npm
        continue-on-error: true
        shell: bash
        env:
          ncuUpgradeTarget: ${{ env.upgradeTarget || 'minor' }}
        run: npm install --save ; npm update ; npm upgrade ; npm install

      - name: Update packages with ncu
        continue-on-error: true
        shell: bash
        env:
          ncuUpgradeTarget: ${{ env.upgradeTarget || 'minor' }}
        run: npx ncu --upgrade --enginesNode --retry 3 --target ${{ env.ncuUpgradeTarget }} --verbose ; npm install ; npm update ; npm upgrade ; npm install

      - name: git-diff
        id: git-diff
        shell: bash
        run: |
          savedOptions=$(set +o) \
          && set +e \
          ; if git diff --quiet; then
            echo "updated=false" | tee -a "${GITHUB_OUTPUT?}"
          else
            echo "updated=true" | tee -a "${GITHUB_OUTPUT?}"
          fi \
          ; eval "${savedOptions?}" \
          ;
        continue-on-error: true

      - run: rm -rf './node_modules/'

      - run: npm ci
        
      - name: Tear down .npmrc
        if: ${{ env.npmAuthOrganisation != '' }}
        shell: bash
        run: rm -f .npmrc

      - name: Run tests after update
        shell: bash
        run: |
          output=$(${{ env.testScript }} 2>&1)
          echo "output<<EOF" >> "$GITHUB_OUTPUT"
          echo "$output" >> "$GITHUB_OUTPUT"
          echo "EOF" >> "$GITHUB_OUTPUT"
          echo "output=${output}"

      - name: Run main after update
        shell: bash
        run: |
          output=$(timeout ${{ env.mainScriptTimeout }} ${{ env.mainScript }} 2>&1)
          echo "output<<EOF" >> "$GITHUB_OUTPUT"
          echo "$output" >> "$GITHUB_OUTPUT"
          echo "EOF" >> "$GITHUB_OUTPUT"
          echo "output=${output}"  

      - name: Commit
        if: ${{ steps.git-diff.outputs.updated == 'true' || env.git-force == 'true' }}
        shell: bash
        run: |
          git config --local user.email '${{ env.gitUserEmail }}'
          git config --local user.name '${{ env.gitUserName }}'
          git status -v
          git switch -c '${{ env.branch }}'
          git add -v --all
          git commit -v -m '${{ env.gitCommitMessage }}'
          git pull --rebase --set-upstream origin '${{ env.branch }}'
          git push --set-upstream origin '${{ env.branch }}'
          git push -v
          git status -v

    outputs:
      updatedFiles: ${{ steps.git-diff.outputs.updated || '' }}./.github/workflows/wfr-echo.yml
==== Content of ./.github/workflows/wfr-echo.yml ====
# .github/workflows/wfr-echo.yml

#
# agentic-lib
# Copyright (C) 2025 Polycode Limited
#
# This file is part of agentic-lib.
#
# agentic-lib is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License v3.0 (GPL‑3).
# along with this program. If not, see <https://www.gnu.org/licenses/>.
#
# IMPORTANT: Any derived work must include the following attribution:
# "This work is derived from https://github.com/xn-intenton-z2a/agentic-lib"
#

name: ∞ Echo

on:
  workflow_call:
    inputs:
      message:
        description: 'The message to echo. e.g. "Hello, World!"'
        required: false
        type: string
        default: 'Hello, World!'

jobs:
  publish:
    runs-on: ubuntu-latest

    env:
      message: ${{ inputs.message || 'Hello, World!' }}

    steps:
      - run: echo '${{ env.message }}'
./.github/workflows/wfr-run-script-and-commit-to-branch.yml
==== Content of ./.github/workflows/wfr-run-script-and-commit-to-branch.yml ====
# .github/workflows/wfr-run-script-and-push-changes.yml

#
# agentic-lib
# Copyright (C) 2025 Polycode Limited
#
# This file is part of agentic-lib.
#
# agentic-lib is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License v3.0 (GPL‑3).
# along with this program. If not, see <https://www.gnu.org/licenses/>.
#
# IMPORTANT: Any derived work must include the following attribution:
# "This work is derived from https://github.com/xn-intenton-z2a/agentic-lib"
#

name: ∞ Run script, test and push

on:
  workflow_call:
    inputs:
      script:
        description: 'The script must be runnable as: `npm ci ; <script>`.'
        type: string
        required: false
        default: ''
      sarifScript:
        description: 'The script must be runnable as: `npm ci ; <script>` and output a SARIF file. e.g. `npm run linting-json`'
        type: string
        required: false
        default: ''
      testScript:
        description: 'The script must be runnable as: `npm ci ; <script>` and succeed with a zero exit code. e.g. `npm test`'
        type: string
        required: false
        default: 'npm test'
      branch:
        description: 'The branch to push changes to. e.g. "apply-script"'
        type: string
        required: false
        default: ''
      npmAuthOrganisation:
        description: 'The GitHub organisation to authenticate with for npm. e.g. "xn-intenton-z2a"'
        type: string
        required: false
        default: ''
      gitUserEmail:
        description: 'The email to use for git commits. e.g. "action@github.com"'
        type: string
        required: false
        default: 'action@github.com'
      gitUserName:
        description: 'The name to use for git commits. e.g. "GitHub Actions[bot]"'
        type: string
        required: false
        default: 'GitHub Actions[bot]'
      gitCommitMessage:
        description: 'The message to use for git commits. e.g. "Updated by script"'
        type: string
        required: false
        default: 'Updated by script'
    secrets:
      PERSONAL_ACCESS_TOKEN:
        required: false
    outputs:
      updatedFiles:
          description: 'Whether files were updated by the script. e.g. "true"'
          value: ${{ jobs.update-and-push.outputs.updatedFiles }}
      scriptOutput:
        description: 'The output from running the script. '
        value: ${{ jobs.update-and-push.outputs.scriptOutput }}
      remainingResultsCount:
        description: 'The number of results from the SARIF script. e.g. "1"'
        value: ${{ jobs.update-and-push.outputs.remainingResultsCount }}
      fixStillRequired:
        description: 'Whether the SARIF script requires fixes. e.g. "true"'
        value: ${{ jobs.update-and-push.outputs.fixStillRequired }}

jobs:
  update-and-push:
    runs-on: ubuntu-latest

    env:
      script: ${{ inputs.script || '' }}
      sarifScript: ${{ inputs.sarifScript || '' }}
      testScript: ${{ inputs.testScript || 'npm test' }}
      branch: ${{ inputs.branch || '' }}
      npmAuthOrganisation: ${{ inputs.npmAuthOrganisation || '' }}
      gitUserEmail: ${{ inputs.gitUserEmail || 'action@github.com' }}
      gitUserName: ${{ inputs.gitUserName || 'GitHub Actions[bot]' }}
      gitCommitMessage: ${{ inputs.gitCommitMessage || 'Updated by inputs.script' }}

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Check GitHub authentication
        if: ${{ env.npmAuthOrganisation != '' }}
        shell: bash
        run: |
          curl --include --header "Authorization: token ${{ secrets.PERSONAL_ACCESS_TOKEN || secrets.GITHUB_TOKEN }}" https://api.github.com/user

      - name: Set up .npmrc
        if: ${{ env.npmAuthOrganisation != '' }}
        shell: bash
        run: |
          echo "${{ env.npmAuthOrganisation }}:registry=https://npm.pkg.github.com" >> .npmrc
          echo "//npm.pkg.github.com/:_authToken=${{ secrets.PERSONAL_ACCESS_TOKEN || secrets.GITHUB_TOKEN }}" >> .npmrc
          echo "always-auth=true" >> .npmrc

      - run: npm ci

      - name: script
        id: script
        if: ${{ env.script != '' }}
        shell: bash
        run: |
          set +e
          output=$(${{ env.script }} 2>&1)
          echo "output<<EOF" >> "$GITHUB_OUTPUT"
          echo "$output" >> "$GITHUB_OUTPUT"
          echo "EOF" >> "$GITHUB_OUTPUT"
          echo "output=${output}"
          if git diff --quiet; then
            updated='false'
          else
            updated='true'
          fi
          set -e
          echo "updated=${updated}" > $GITHUB_OUTPUT
          echo "updated=${updated}"
        continue-on-error: true

      - name: sarif-script
        id: sarif-script
        if: ${{ env.sarifScript != '' }}
        continue-on-error: true
        shell: bash
        run: |
          set +e
          results=$(${{ env.sarifScript }})
          exitCode="$?"
          set -e
          echo "exitCode=${exitCode}"
          fixStillRequired=$([ $? -eq 0 ] && echo 'true' || echo 'false')
          echo "fixStillRequired={fixStillRequired}" > $GITHUB_OUTPUT
          echo "fixStillRequired=${fixStillRequired}"
          remainingResultsCount=$(echo "${results}" | jq '.runs[0].results | length' 2>/dev/null || echo "unknown")
          echo "remainingResultsCount=${remainingResultsCount}" > $GITHUB_OUTPUT
          echo "remainingResultsCount=${remainingResultsCount}"
          echo "results: ${results}"

      - name: Test
        if: ${{ steps.script.outputs.updated == 'true' || env.git-force == 'true' }}
        shell: bash
        run: |
          ${{ env.testScript }}

      - name: Tear down npm auth
        if: ${{ env.npmAuthOrganisation != '' }}
        run: rm -vf .npmrc

      - name: Commit
        if: ${{ env.branch != '' && steps.script.outputs.updated == 'true' || env.git-force == 'true' }}
        shell: bash
        run: |
          git config --local user.email '${{ env.gitUserEmail }}'
          git config --local user.name '${{ env.gitUserName }}'
          git status -v
          git switch -c '${{ env.branch }}'
          git add -v --all
          git commit -v -m '${{ env.gitCommitMessage }}'
          git pull --rebase
          git push --set-upstream origin '${{ env.branch }}'
          git push -v
          git status -v

    outputs:
      updatedFiles: ${{ steps.script.outputs.updated }}
      scriptOutput: ${{ steps.script.outputs.output }}
      remainingResultsCount: ${{ steps.sarif-script.outputs.remainingResultsCount }}
      fixStillRequired: ${{ steps.sarif-script.outputs.fixStillRequired }}./.github/workflows/issue-creator.yml
==== Content of ./.github/workflows/issue-creator.yml ====
# .github/workflows/issue-creator.yml
#
# This file is part of the example suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT

name: Create Issue
concurrency: create-issue
run-name: "Create Issue"

on:
  workflow_dispatch:
    inputs:
      target:
        description: 'An asset (e.g. source file) to reference in the issue. e.g. "src/lib/main.js"'
        required: false
        type: string
        default: 'src/lib/main.js'
      issueTitle:
        description: 'Text to drive the issue title (if "house choice", a currently random prompt will be selected). e.g. "Make a small improvement."'
        required: false
        type: string
        default: 'house choice'
  schedule:
    - cron: '0 */4 * * *' # Every 4 hours at 0 minutes past
    # - cron: '0 */1 * * *' # Every hour
    # - cron: '0,30 * * * *' # Every 30 minutes

jobs:

  create-issue:
    permissions:
      issues: write
      id-token: write
    uses: 'xn-intenton-z2a/agentic-lib/.github/workflows/wfr-create-issue.yml@main'
    with:
      issueTitle: ${{ inputs.issueTitle || 'house choice' }}
      houseChoiceOptions: |
        Add a new feature to the source file pulling in at most 1 new dependency if you need to.
        || Extend the functionality in the source file.
        || Improve the consistency of the source file and test file.
        || Improve test coverage of the source file by the test file and fix bugs the tests would highlight.
        || Ensure that the main defaults to the usage and some demo output and ensure execution terminates without user input.
        || Synchronise the README with current behaviour and call out future features that have not yet been implemented.
./.github/workflows/wfr-create-pr.yml
==== Content of ./.github/workflows/wfr-create-pr.yml ====
# .github/workflows/wfr-create-pr.yml

#
# agentic-lib
# Copyright (C) 2025 Polycode Limited
#
# This file is part of agentic-lib.
#
# agentic-lib is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License v3.0 (GPL‑3).
# along with this program. If not, see <https://www.gnu.org/licenses/>.
#
# IMPORTANT: Any derived work must include the following attribution:
# "This work is derived from https://github.com/xn-intenton-z2a/agentic-lib"
#

name: ∞ Create a PR

on:
  workflow_call:
    inputs:
      branch:
        description: 'The branch to create a PR from. e.g. "issue-123"'
        type: string
        required: true
      baseBranch:
        description: 'The base branch to compare the PRs against. e.g. "main"'
        type: string
        required: false
        default: 'main'
      pulls:
        description: 'The maximum number of PRs to process. e.g. "100"'
        type: string
        required: false
        default: '100'
      gitCommitMessage:
        description: 'The commit message to use for the PR. e.g. "Ready for pull"'
        type: string
        required: false
        default: 'Ready for pull'
      label:
        description: 'The labels to apply to the PR. e.g. "automerge"'
        type: string
        required: false
        default: 'automerge'
    secrets:
      PERSONAL_ACCESS_TOKEN:
        required: false

jobs:
  create-pr:
    runs-on: ubuntu-latest

    env:
      branch: ${{ inputs.branch }}
      baseBranch: ${{ inputs.baseBranch || 'main' }}
      pulls: ${{ inputs.pulls || '100' }}
      gitCommitMessage: ${{ inputs.gitCommitMessage || 'Change complete ready for review' }}
      label: 'automerge'

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Create pull request, if fixed after re-checking linting
        uses: actions/github-script@v7
        with:
          github-token: ${{ secrets.PERSONAL_ACCESS_TOKEN || secrets.GITHUB_TOKEN }}
          script: |
            const { data: existingPulls } = await github.rest.pulls.list({
              owner: context.repo.owner,
              repo: context.repo.repo,
              head: `${context.repo.owner}:${{ env.branch }}`,
              base: '${{ env.baseBranch }}',
              state: 'open',
            });
            if (existingPulls.length === 0) {
              const { data: pr } = await github.rest.pulls.create({
                owner: context.repo.owner,
                repo: context.repo.repo,
                title: '${{ env.gitCommitMessage }}',
                head: '${{ env.branch }}',
                base: '${{ env.baseBranch }}',
                body: '${{ env.gitCommitMessage }}',
                maintainer_can_modify: true,
              });
              await github.rest.issues.addLabels({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: pr.number,
                labels: ['${{ env.label }}'],
              });
              core.info(`Pull request created: ${pr.html_url}`);
            
              // Initiate Check Suites
              const { data: checkSuites } = await github.rest.checks.listForRef({
                owner: context.repo.owner,
                repo: context.repo.repo,
                ref: pr.head.sha,
              });
              if (checkSuites.check_suites && checkSuites.check_suites.length > 0) {
                for (const suite of checkSuites.check_suites) {
                  await github.rest.checks.rerequestSuite({
                    owner: context.repo.owner,
                    repo: context.repo.repo,
                    check_suite_id: suite.id,
                  });
                  core.info(`Re-ran check suite ${suite.id} for commit ${pr.head.sha}`);
                }
              } else {
                core.info('No check suites found for the new commit.');
              }
            } else {
              core.info('Pull request already exists for this branch.');
            }
./.github/workflows/wfr-create-issue.yml
==== Content of ./.github/workflows/wfr-create-issue.yml ====
# .github/workflows/wfr-create-issue.yml

#
# agentic-lib
# Copyright (C) 2025 Polycode Limited
#
# This file is part of agentic-lib.
#
# agentic-lib is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License v3.0 (GPL‑3).
# along with this program. If not, see <https://www.gnu.org/licenses/>.
#
# IMPORTANT: Any derived work must include the following attribution:
# "This work is derived from https://github.com/xn-intenton-z2a/agentic-lib"
#

name: ∞ Create issue

on:
  workflow_call:
    inputs:
      issueTitle:
        description: 'Text to drive the issue title (if "house choice", a random prompt will be selected).'
        required: false
        type: string
        default: 'house choice'
      issueBody:
        description: 'Text to drive the issue body.'
        required: false
        type: string
        default: 'Please resolve the issue.'
      houseChoiceOptions:
        description: 'Options for house choice, separated by commas.'
        type: string
        required: false
        default: 'Make code changes that extend or improve the features or resolve issues shown in the included context.'
    secrets:
      PERSONAL_ACCESS_TOKEN:
        required: false
    outputs:
      issueTitle:
        description: 'The issue title to resolve. e.g. "Make a small improvement."'
        value: ${{ jobs.create-issue.outputs.issueTitle }}
      issueNumber:
        description: 'The issue number to review. e.g. "123"'
        value: ${{ jobs.create-issue.outputs.issueNumber }}

jobs:
  create-issue:
    runs-on: ubuntu-latest

    env:
      issueTitle: ${{ inputs.issueTitle || 'house choice' }}
      issueBody: ${{ inputs.issueBody || 'Please resolve the issue.' }}
      houseChoiceOptions: ${{ inputs.houseChoiceOptions || 'Make code changes that extend or improve the features or resolve issues shown in the included context.'}}

    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: create-issue
        id: create-issue
        uses: actions/github-script@v7
        with:
          github-token: ${{ secrets.PERSONAL_ACCESS_TOKEN || secrets.GITHUB_TOKEN }}
          script: |
            const issueTitle = process.env.issueTitle;
            const issueBody = process.env.issueBody;
            const houseChoiceOptions = process.env.houseChoiceOptions.split('||');

            let selectedIssueTitle;
            if (issueTitle === 'house choice') {
              selectedIssueTitle = houseChoiceOptions[Math.floor(Math.random() * houseChoiceOptions.length)];
            } else {
              selectedIssueTitle = issueTitle;
            }

            const { data: issue } = await github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: selectedIssueTitle,
              body: issueBody,
              labels: ['automated']
            });

            core.setOutput("issueTitle", selectedIssueTitle);
            core.setOutput("issueNumber", issue.number);
            core.info(`issueTitle: ${selectedIssueTitle}`);
            core.info(`issueNumber: ${issue.number}`);

    outputs:
      issueTitle: ${{ steps.create-issue.outputs.issueTitle }}
      issueNumber: ${{ steps.create-issue.outputs.issueNumber }}./.github/workflows/wfr-delete-caches.yml
==== Content of ./.github/workflows/wfr-delete-caches.yml ====
# .github/workflows/wfr-delete-caches.yml

#
# agentic-lib
# Copyright (C) 2025 Polycode Limited
#
# This file is part of agentic-lib.
#
# agentic-lib is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License v3.0 (GPL‑3).
# along with this program. If not, see <https://www.gnu.org/licenses/>.
#
# IMPORTANT: Any derived work must include the following attribution:
# "This work is derived from https://github.com/xn-intenton-z2a/agentic-lib"
#

name: ∞ Delete caches

on:
  workflow_call:
    inputs:
      deleteAllCaches:
        description: 'Whether to delete all caches. e.g. "true"'
        type: string
        required: false
        default: 'false'
    secrets:
      PERSONAL_ACCESS_TOKEN:
        required: false

jobs:
  update:
    runs-on: ubuntu-latest

    env:
      deleteAllCaches: ${{ inputs.deleteAllCaches || 'false' }}

    steps:
      - name: Delete all GitHub Actions caches by iterating through each one to delete it
        if: ${{ env.deleteAllCaches }}
        run: |
          echo "Listing all caches in the repository for ${{ github.repository }}"
          # 1) List all caches in JSON
          result=$(curl -s \
            -H "Authorization: token ${{ secrets.PERSONAL_ACCESS_TOKEN || secrets.GITHUB_TOKEN }}" \
            -H "Accept: application/vnd.github+json" \
            "https://api.github.com/repos/${{ github.repository }}/actions/caches")
          
          # Print the JSON for debugging
          echo "$result" | jq .
          
          # 2) Determine how many total_count
          total=$(echo "$result" | jq -r '.total_count')
          echo "Found $total caches in total."
          
          # 3) For each item in actions_caches array, extract .key and .ref,
          #    then call DELETE with "?key=...&ref=..."
          echo "$result" | jq -c '.actions_caches[]' | while read -r row; do
            key=$(echo "$row" | jq -r '.key')
            ref=$(echo "$row" | jq -r '.ref')
          
            echo "Deleting cache with key='$key' ref='$ref' ..."
            curl -s -X DELETE \
              -H "Authorization: token ${{ secrets.PERSONAL_ACCESS_TOKEN || secrets.GITHUB_TOKEN }}" \
              -H "Accept: application/vnd.github+json" \
              "https://api.github.com/repos/${{ github.repository }}/actions/caches?key=$key&ref=$ref"
          done
          
          echo "Cache deletion iteration complete."
./.github/workflows/issue-worker.yml
==== Content of ./.github/workflows/issue-worker.yml ====
# .github/workflows/issue-worker.yml
#
# This file is part of the example suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT

name: Issue Worker
concurrency: issue-worker
run-name: "Issue Worker [${{ github.ref_name }}]"

on:
  workflow_dispatch:
    inputs:
      issueNumber:
        description: 'The issue number to resolve. If not provided, the workflow will select one based on label. e.g. "123"'
        required: false
        type: string
        default: ''
      target:
        description: 'The source file whose content is used in the resolution prompt. e.g. "src/lib/main.js"'
        required: false
        type: string
        default: 'src/lib/main.js'
      testFile:
        description: 'The test file to run to validate the resolution. e.g. "tests/unit/main.test.js"'
        required: false
        type: string
        default: 'tests/unit/main.test.js'
      selectionLabel:
        description: 'Label used to filter issues for resolution. e.g. "automated"'
        required: false
        type: string
        default: 'automated'
  workflow_run:
    workflows:
      - "Create Issue"
      - "Create Issue from Script"
    types:
      - completed
  schedule:
    - cron: '15 */2 * * *' # Run every 2 hours at 0 minutes past
    #- cron: '*/30 * * * *' # Run every 30 minutes
    #- cron: '*/15 * * * *' # Run every 15 minutes

jobs:

  select-issue:
    permissions:
      issues: read
      id-token: write
    uses: 'xn-intenton-z2a/agentic-lib/.github/workflows/wfr-select-issue.yml@main'
    with:
      issueNumber: ${{ inputs.issueNumber || '' }}
      selectionLabel: ${{ inputs.selectionLabel || 'automated' }}
    secrets:
      CHATGPT_API_SECRET_KEY: ${{ secrets.CHATGPT_API_SECRET_KEY }}

  check-branch:
    needs:
      - select-issue
    if: ${{ needs.select-issue.outputs.issueNumber != '' }}
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write
    env:
      branchPrefix: 'issue-'
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          ref: ${{ github.ref }}
      - name: Ensure there isn't already a branch for this intention type
        shell: bash
        run: |
          git fetch origin
          if git branch -r | grep -q 'origin/${{ env.branchPrefix }}'; then
            echo "A branch with the intention type prefix '${{ env.branchPrefix }}' already exists."
            exit 1
          else
            echo "No existing branch with the intention type prefix found."
          fi

  start-issue:
    needs:
      - select-issue
      - check-branch
    if: ${{ needs.select-issue.outputs.issueNumber != '' }}
    permissions:
      contents: write
      issues: write
      id-token: write
    uses: 'xn-intenton-z2a/agentic-lib/.github/workflows/wfr-start-issue.yml@main'
    with:
      issueNumber: ${{ needs.select-issue.outputs.issueNumber }}
      target: ${{ inputs.target || 'src/lib/main.js' }}
      testFile: ${{ inputs.testFile || 'tests/unit/main.test.js' }}
      readmeFile: 'README.md'
      contributingFile: 'CONTRIBUTING.md'
      dependenciesFile: 'package.json'
      formattingFile: '.prettierrc'
      lintingFile: 'eslint.config.js'
      branchPrefix: 'issue-'
      buildScript: 'npm run build'
      testScript: 'npm test'
      mainScript: 'npm run start'
      model: ${{ vars.CHATGPT_API_MODEL || 'o3-mini' }}
      gitUserEmail: 'action@github.com'
      gitUserName: 'GitHub Actions[bot]'
    secrets:
      CHATGPT_API_SECRET_KEY: ${{ secrets.CHATGPT_API_SECRET_KEY }}

  create-pr:
    needs:
      - select-issue
      - start-issue
    if: ${{ needs.select-issue.outputs.issueNumber != '' && needs.start-issue.outputs.fixApplied == 'true' }}
    permissions:
      contents: write
      packages: write
      issues: write
      pull-requests: write
      checks: write
      id-token: write
    uses: 'xn-intenton-z2a/agentic-lib/.github/workflows/wfr-create-pr.yml@main'
    with:
      branch: 'issue-${{ needs.select-issue.outputs.issueNumber }}'
      baseBranch: 'main'
      gitCommitMessage: 'Fix ready for issue ${{ needs.select-issue.outputs.issueNumber }}'
      label: 'automerge'
./.github/workflows/automerge.yml
==== Content of ./.github/workflows/automerge.yml ====
# .github/workflows/automerge.yml
#
# This file is part of the example suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT

name: Automerge
concurrency: branch-main
run-name: "Automerge [${{ github.ref_name }}]"

on:
  pull_request:
  check_suite:
  workflow_dispatch:
  workflow_run:
    workflows:
      - "Issue Worker"
      - "Update"
    types:
      - completed
  schedule:
    #- cron: '*/10 * * * *' # Run every 10 minutes
    - cron: '45 */1 * * *' # Run every hour at 45 minutes past
    #- cron: '15 */2 * * *'  # Run every 2 hours at 15 minutes past

jobs:
  pull-request-event:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - run: |
          echo "Triggered by: pull_request"

  check-suite-event:
    if: github.event_name == 'check_suite'
    runs-on: ubuntu-latest
    steps:
      - run: |
          echo "Triggered by: check_suite"

  schedule-event:
    if: github.event_name == 'schedule'
    runs-on: ubuntu-latest
    steps:
      - run: |
          echo "Triggered by: schedule"

  workflow-dispatch-event:
    if: github.event_name == 'workflow_dispatch'
    runs-on: ubuntu-latest
    steps:
      - run: |
          echo "Triggered by: workflow_dispatch"

  pr:
    if: github.event_name == 'pull_request' && contains(github.event.pull_request.labels.*.name, 'automerge')
    uses: 'xn-intenton-z2a/agentic-lib/.github/workflows/wfr-automerge-find-pr-from-pull-request.yml@main'

  cs:
    if: github.event_name == 'check_suite' && github.event.check_suite.conclusion == 'success'
    uses: 'xn-intenton-z2a/agentic-lib/.github/workflows/wfr-automerge-find-pr-in-check-suite.yml@main'

  ls:
    if: github.event_name == 'schedule' || github.event_name == 'workflow_dispatch'
    runs-on: ubuntu-latest
    steps:
      - name: Determine pull request number
        id: get-pull
        uses: actions/github-script@v7
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          script: |
            let pullNumber;
            const { data: pullRequests } = await github.rest.pulls.list({
              owner: context.repo.owner,
              repo: context.repo.repo,
              state: 'open',
              per_page: 1,
              sort: 'created',
              direction: 'asc'
            });
            if (pullRequests.length > 0) {
              pullNumber = pullRequests[0].number;
            } else {
              pullNumber = '';
              core.info('No open pull requests found.');
            }
            core.info(`pullNumber: ${pullNumber}`);
            core.setOutput('pullNumber', pullNumber);
          result-encoding: string
    outputs:
      pullNumber: ${{ steps.get-pull.outputs.pullNumber }}

  merge-check:
    if: ${{ always() }}
    needs:
      - pr
      - cs
      - ls
    runs-on: ubuntu-latest
    steps:
      - name: set-outputs
        id: set-outputs
        uses: actions/github-script@v7
        with:
          script: |
            // Merge outputs from pr-check, cs-check, and determine-ls.
            // Only one of pr-check or cs-check should have run.
            let prMerged = '${{ needs.pr.outputs.prMerged || needs.cs.outputs.prMerged || 'false' }}';
            let pullNumber = '${{ needs.pr.outputs.pullNumber || needs.cs.outputs.pullNumber || needs.ls.outputs.pullNumber }}';
            let shouldSkipMerge = '${{ needs.pr.outputs.shouldSkipMerge || needs.cs.outputs.shouldSkipMerge || 'false' }}';
            core.setOutput('prMerged', `${prMerged}`);
            core.setOutput('pullNumber', `${pullNumber}`);
            core.setOutput('shouldSkipMerge', `${shouldSkipMerge}`);
            core.info(`prMerged: '${prMerged}'`);
            core.info(`pullNumber: '${pullNumber}'`);
            core.info(`shouldSkipMerge: '${shouldSkipMerge}'`);
          result-encoding: string
    outputs:
      prMerged: ${{ steps.set-outputs.outputs.prMerged }}
      pullNumber: ${{ steps.set-outputs.outputs.pullNumber }}
      shouldSkipMerge: ${{ steps.set-outputs.outputs.shouldSkipMerge }}

  label-issue-after-check-pr:
    needs:
      - merge-check
    if: needs.merge-check.outputs.prMerged == 'true' && needs.merge-check.outputs.pullNumber != ''
    permissions:
      contents: write
      pull-requests: read
      issues: write
    uses: 'xn-intenton-z2a/agentic-lib/.github/workflows/wfr-automerge-label-issue.yml@main'
    with:
      pullNumber: '${{ needs.merge-check.outputs.pullNumber }}'
      branchPrefix: 'issue-'

  automerge:
    needs:
      - merge-check
    if: always() && needs.merge-check.outputs.shouldSkipMerge != 'true' && needs.merge-check.outputs.pullNumber != ''
    permissions:
      contents: write
      pull-requests: write
    uses: 'xn-intenton-z2a/agentic-lib/.github/workflows/wfr-automerge-merge-pr.yml@main'
    with:
      pullNumber: '${{ needs.merge-check.outputs.pullNumber }}'

  label-issue-after-automerge:
    needs:
      - merge-check
      - automerge
    if: always() && ( needs.automerge.outputs.prMerged == 'true' && needs.merge-check.outputs.pullNumber != '' )
    permissions:
      contents: write
      issues: write
      pull-requests: read
    uses: 'xn-intenton-z2a/agentic-lib/.github/workflows/wfr-automerge-label-issue.yml@main'
    with:
      pullNumber: ${{ needs.automerge.outputs.prMerged == 'true' && needs.merge-check.outputs.pullNumber || '' }}
      branchPrefix: 'issue-'
./.github/workflows/issue-for-linting.yml
==== Content of ./.github/workflows/issue-for-linting.yml ====
# .github/workflows/issue-for-linting.yml
#
# This file is part of the example suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT

name: Linting
concurrency: branch-${{ github.ref_name }}
run-name: "Linting [${{ github.ref_name }}]"

on:
  workflow_dispatch:
  schedule:
    - cron: '15 4 * * *' # Run every day at 4:15

jobs:

  linting:
    permissions:
      contents: write
      packages: write
      id-token: write
    uses: 'xn-intenton-z2a/agentic-lib/.github/workflows/wfr-run-script-and-commit-to-branch.yml@main'
    with:
      #script: 'npm run linting "." -- --max-warnings=10'
      script: 'npm run linting'
      sarifScript: 'npm run linting-json --silent'
      testScript: 'npm test'

  create-issue:
    needs:
      - linting
    if: ${{ needs.linting.outputs.fixStillRequired == 'true' || needs.linting.outputs.fixStillRequired == true || needs.linting.outputs.remainingResultsCount != '0' }}
    permissions:
      issues: write
      id-token: write
    uses: 'xn-intenton-z2a/agentic-lib/.github/workflows/wfr-create-issue.yml@main'
    with:
      issueTitle: 'Resolve issues in output from running: npm run linting-fix "." -- --max-warnings=10'
      issueBody: ${{ needs.linting.outputs.scriptOutput }}
./.github/workflows/update.yml
==== Content of ./.github/workflows/update.yml ====
# .github/workflows/update.yml
#
# This file is part of the example suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT

name: Update
concurrency: branch-${{ github.ref_name }}
run-name: "Update [${{ github.ref_name }}]"

on:
  repository_dispatch:
    types: [package-published]
  schedule:
    - cron: '30 7 * * *'
  workflow_dispatch:
    inputs:
      upgradeTarget:
        description: 'Select the type of update to run'
        type: choice
        default: 'minor'
        required: false
        options:
          - greatest
          - latest
          - newest
          - patch
          - minor
          - semver

jobs:
  update:
    permissions:
      contents: write
      pull-requests: write
      id-token: write
      packages: write
    uses: 'xn-intenton-z2a/agentic-lib/.github/workflows/wfr-update.yml@main'
    with:
      buildScript: 'npm run build'
      testScript: 'npm test'
      mainScript: 'npm run start'
      upgradeTarget: ${{ inputs.upgradeTarget || 'patch' }}
      branch: 'apply-update'
      gitUserEmail: 'action@github.com'
      gitUserName: 'GitHub Actions[bot]'
      gitCommitMessage: 'chore: dependency updates'

  create-pr:
    needs:
      - update
    if: ${{ needs.update.outputs.updatedFiles == 'true' }}
    permissions:
      contents: write
      packages: write
      issues: write
      pull-requests: write
      checks: write
      id-token: write
    uses: 'xn-intenton-z2a/agentic-lib/.github/workflows/wfr-create-pr.yml@main'
    with:
      branch: 'apply-update'
      baseBranch: 'main'
      gitCommitMessage: 'chore: dependency updates'
      label: 'automerge'
./.github/workflows/issue-reviewer.yml
==== Content of ./.github/workflows/issue-reviewer.yml ====
# .github/workflows/issue-reviewer.yml
#
# This file is part of the example suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT

name: Review Issue
run-name: "Review Issue [${{ github.ref_name }}]"

on:
  workflow_dispatch:
    inputs:
      issueNumber:
        description: 'The issue number to review. If not provided, the workflow will select one based on label. e.g. "123"'
        required: false
        type: string
        default: ''
      selectionLabel:
        description: 'Label used to filter issues for review. e.g. "merged"'
        required: false
        type: string
        default: 'merged'
      target:
        description: 'The source file whose content was used in the resolution prompt. e.g. "src/lib/main.js"'
        required: false
        type: string
        default: 'src/lib/main.js'
      testFile:
        description: 'The test file to run to validate the resolution. e.g. "tests/unit/main.test.js"'
        required: false
        type: string
        default: 'tests/unit/main.test.js'
  workflow_run:
    workflows:
      - "Automerge"
    types:
      - completed
  schedule:
    - cron: '30 */2 * * *' # Run every 2 hours at 30 minutes past
    #- cron: '*/30 * * * *' # Run every 30 minutes
    #- cron: '*/15 * * * *' # Run every 15 minutes

jobs:

  select-issue:
    permissions:
      issues: read
      id-token: write
    uses: 'xn-intenton-z2a/agentic-lib/.github/workflows/wfr-select-issue.yml@main'
    with:
      issueNumber: ${{ inputs.issueNumber || '' }}
      selectionLabel: ${{ inputs.selectionLabel || 'merged' }}
    secrets:
      CHATGPT_API_SECRET_KEY: ${{ secrets.CHATGPT_API_SECRET_KEY }}

  review-issue:
    needs:
      - select-issue
    if: ${{ needs.select-issue.outputs.issueNumber != '' && needs.select-issue.outputs.merged == 'true' }}
    permissions:
      contents: write
      issues: write
      id-token: write
    uses: 'xn-intenton-z2a/agentic-lib/.github/workflows/wfr-review-issue.yml@main'
    with:
      issueNumber: ${{ needs.select-issue.outputs.issueNumber }}
      target: ${{ inputs.target || 'src/lib/main.js' }}
      testFile: ${{ inputs.testFile || 'tests/unit/main.test.js' }}
      readmeFile: 'README.md'
      contributingFile: 'CONTRIBUTING.md'
      dependenciesFile: 'package.json'
      buildScript: 'npm run build'
      testScript: 'npm test'
      mainScript: "node ${{ inputs.target || 'src/lib/main.js' }}"
      model: ${{ vars.CHATGPT_API_MODEL || 'o3-mini' }}
    secrets:
      CHATGPT_API_SECRET_KEY: ${{ secrets.CHATGPT_API_SECRET_KEY }}
./.github/workflows/formating.yml
==== Content of ./.github/workflows/formating.yml ====
# .github/workflows/formating.yml
#
# This file is part of the example suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT

name: ∞ Formatting
concurrency: branch-${{ github.ref_name }}
run-name: "Formatting [${{ github.ref_name }}]"

on:
  workflow_dispatch:
  schedule:
    - cron: '15 3 * * *' # Run every day at 3:15

jobs:

  formatting:
    permissions:
      contents: write
      packages: write
      id-token: write
    uses: 'xn-intenton-z2a/agentic-lib/.github/workflows/wfr-run-script-and-commit-to-branch.yml@main'
    with:
      script: 'npm run formatting-fix -- "." ; npm run linting-fix "."'
      sarifScript: ''
      testScript: 'npm test'
      branch: 'apply-formatting'
      gitUserEmail: 'action@github.com'
      gitUserName: 'GitHub Actions[bot]'
      gitCommitMessage: 'Updated by `npm run formatting-fix -- "." ; npm run linting-fix "."`'

  create-pr:
    needs:
      - formatting
    if: ${{ needs.formatting.outputs.updatedFiles == 'true' }}
    permissions:
      contents: write
      packages: write
      issues: write
      pull-requests: write
      checks: write
      id-token: write
    uses: 'xn-intenton-z2a/agentic-lib/.github/workflows/wfr-create-pr.yml@main'
    with:
      branch: 'apply-formatting'
      baseBranch: 'main'
      gitCommitMessage: 'chore: formatting fixes'
      label: 'automerge'
./.github/workflows/wfr-automerge-find-pr-in-check-suite.yml
==== Content of ./.github/workflows/wfr-automerge-find-pr-in-check-suite.yml ====
# .github/workflows/wfr-automerge-find-pr-in-check-suite.yml

#
# agentic-lib
# Copyright (C) 2025 Polycode Limited
#
# This file is part of agentic-lib.
#
# agentic-lib is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License v3.0 (GPL‑3).
# along with this program. If not, see <https://www.gnu.org/licenses/>.
#
# IMPORTANT: Any derived work must include the following attribution:
# "This work is derived from https://github.com/xn-intenton-z2a/agentic-lib"
#

name: ∞ Get Pull Request from Check Suite

on:
  workflow_call:
    secrets:
      PERSONAL_ACCESS_TOKEN:
        required: false
    outputs:
      pullNumber:
        description: 'The pull request number.'
        value: ${{ jobs.check-pr.outputs.pullNumber }}
      shouldSkipMerge:
        description: 'Set to "true", if the merge request should be skipped because there is not a PR in the right state.'
        value: ${{ jobs.check-pr.outputs.shouldSkipMerge }}
      prMerged:
        description: 'Set to "true", if the PR has been merged either already or by this process.'
        value: ${{ jobs.check-pr.outputs.prMerged }}

jobs:
  find-pr:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: find-pr
        id: find-pr
        uses: actions/github-script@v7
        with:
          github-token: ${{ secrets.PERSONAL_ACCESS_TOKEN || secrets.GITHUB_TOKEN }}
          script: |            
            const checkSuite = context.payload.check_suite;
            const owner = context.repo.owner;
            const repo = context.repo.repo;
            const headSha = checkSuite.head_sha;
            let pullNumber;
            let shouldSkipMerge;
            let prMerged;
            
            const { data: prs } = await github.rest.repos.listPullRequestsAssociatedWithCommit({
              owner,
              repo,
              commit_sha: headSha,
            });

            if (prs.length === 0) {
              core.info('No pull requests associated with this check suite.');            
              pullNumber = '';
              shouldSkipMerge = 'true';
              prMerged = 'false';
            } else {

              const openPRs = prs.filter(pr => pr.state === 'open');
              const prWithAutomerge = openPRs.find(pr => pr.labels.some(label => label.name === 'automerge'));
  
              if (!prWithAutomerge) {
                core.info('No open pull requests with the "automerge" label.');
                pullNumber = undefined;
                shouldSkipMerge = 'true';
                prMerged = 'false';
              } else {
                core.info(`Open pull request with the "automerge" label: ${prWithAutomerge.number}`);
                pullNumber = prWithAutomerge.number;
                shouldSkipMerge = 'false';
                prMerged = 'false';
              }
              
              core.setOutput('pullNumber', !pullNumber ? '' : pullNumber.toString());
              core.setOutput('shouldSkipMerge', shouldSkipMerge);
              core.setOutput('prMerged', prMerged);
              core.info(`pullNumber: '${!pullNumber ? '' : pullNumber.toString()}`);
              core.info(`shouldSkipMerge: '${shouldSkipMerge}'`);
              core.info(`prMerged: '${prMerged}'`);
            }

    outputs:
      pullNumber: ${{ steps.find-pr.outputs.pullNumber }}
      shouldSkipMerge: ${{ steps.find-pr.outputs.shouldSkipMerge }}
      prMerged: ${{ steps.find-pr.outputs.prMerged }}
./.github/workflows/wfr-select-issue.yml
==== Content of ./.github/workflows/wfr-select-issue.yml ====
# .github/workflows/wfr-select-issue.yml

#
# agentic-lib
# Copyright (C) 2025 Polycode Limited
#
# This file is part of agentic-lib.
#
# agentic-lib is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License v3.0 (GPL‑3).
# along with this program. If not, see <https://www.gnu.org/licenses/>.
#
# IMPORTANT: Any derived work must include the following attribution:
# "This work is derived from https://github.com/xn-intenton-z2a/agentic-lib"
#

name: ∞ Select issue

on:
  workflow_call:
    inputs:
      issueNumber:
        description: 'The issue number to review. e.g. "123"'
        type: string
        required: true
      selectionLabel:
        description: 'Label used to filter issues for review. e.g. "merged"'
        required: false
        type: string
        default: 'merged'
    secrets:
      PERSONAL_ACCESS_TOKEN:
        required: false
      CHATGPT_API_SECRET_KEY:
        required: true
    outputs:
      issueNumber:
        description: 'The issue number to review. e.g. "123"'
        value: ${{ jobs.select-issue.outputs.issueNumber }}
      merged:
        description: 'Set to "true", if the issue has been merged either already or by this process.'
        value: ${{ jobs.select-issue.outputs.merged }}

jobs:
  select-issue:
    runs-on: ubuntu-latest

    env:
      issueNumber: ${{ inputs.issueNumber }}
      selectionLabel: ${{ inputs.selectionLabel || 'merged' }}

    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: select-issue
        id: select-issue
        uses: actions/github-script@v7
        with:
          github-token: ${{ secrets.PERSONAL_ACCESS_TOKEN || secrets.GITHUB_TOKEN }}
          script: |
            const issueNumberInput = process.env.issueNumber;
            const selectionLabel = process.env.selectionLabel;
            let issueNumberOutput;
            
            let issue;
            if (issueNumberInput) {
              const { data: issue } = await github.rest.issues.get({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: parseInt(issueNumberInput)
              });
            
              if (!issue) {
                issueNumberOutput = '';
                core.info(`No issue found with number: ${issueNumberInput}`);
              } else {
                issueNumberOutput = issue.number;
                core.info(`Found issue with number: ${issueNumberInput}`);
              }
            } else {
              const { data: issues } = await github.rest.issues.listForRepo({
                owner: context.repo.owner,
                repo: context.repo.repo,
                state: 'open',
                labels: selectionLabel,
                per_page: 5
              });
            
              if (issues.length === 0) {
                issueNumberOutput = '';
                core.info(`No open issues found with label: "${selectionLabel}"`);
              } else {
                issueNumberOutput = issues[0].number;
                core.info(`Open issue '${issueNumberOutput}' found with label: '${selectionLabel}'`);
              }
            }
            
            core.setOutput("issueNumber", issueNumberOutput);
            core.info(`issueNumber '${issueNumberOutput}'`);

      - name: has-merged-label
        id: has-merged-label
        if: steps.select-issue.outputs.issueNumber != ''
        uses: actions/github-script@v7
        with:
          github-token: ${{ secrets.PERSONAL_ACCESS_TOKEN || secrets.GITHUB_TOKEN }}
          script: |
            const issueNumber = parseInt("${{ steps.select-issue.outputs.issueNumber }}");
            const { data: issue } = await github.rest.issues.get({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: issueNumber
            });
            
            const merged = issue.labels.some(label => label.name.toLowerCase() === "merged") ? "true" : "false";
            
            core.setOutput("merged", merged);
            core.info(`merged '${merged}'`);

    outputs:
      issueNumber: ${{ steps.select-issue.outputs.issueNumber }}
      merged: ${{ steps.has-merged-label.outputs.merged }}
./.github/dependabot.yml
==== Content of ./.github/dependabot.yml ====
# See: https://docs.github.com/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "daily"
    labels:
      - dependencies
      - automated
      - automerge
    #ignore:
    #  - dependency-name: "some-dependency" # Example of ignoring a specific dependency
    #    versions: ["1.x", "2.x"]
```
END_OF_CONCATENATED_WORKFLOW_FILES

Our goal is to continuously improve and extend these capabilities, making **agentic‑lib** the trusted engine behind automated contributions and continuous integration.

---
---
---

## How to Contribute

Contributions come in many forms—whether you’re a developer, tester, or an advocate for process improvements. Here’s how you can help:

1. **Report Issues or Ideas:**  
   Open an issue on GitHub to share bug reports, feature requests, or any improvements you envision. Clear descriptions and reproducible steps are highly appreciated.

2. **Submit Pull Requests:**
    - Fork the repository and create a feature branch.
    - Implement your changes, ensuring you follow our coding style and standards.
    - Add tests to cover any new functionality.
    - Update documentation if your changes affect usage or workflow behavior.
    - Submit your pull request for review.

3. **Enhance Automated Workflows:**  
   Contributions might include adjustments to:
    - The AI-based fix verification logic.
    - File update routines responding to build, test, or main output.
    - Logic for extracting issue numbers from branch names.
    - Automated pull request merging or listing mechanisms.

4. **Run and Test the Library:**  
   To explore the capabilities of **agentic‑lib**, run the demo function with:
   ```bash
   npm run start [--help]
   ```
   This command prints a detailed help message, including available functions and parameters.

## Guidelines

- **Code Quality:**  
  Write modular, clean, and fully testable code. Our design intentionally decouples functionality from GitHub Actions globals to enhance testability and reuse.

- **Documentation:**  
  Keep inline comments and this Contributing.md up-to-date as you introduce changes. Clear documentation ensures the project stays accessible to both human and AI collaborators.

- **Compatibility:**  
  Ensure your code runs on Node 20 and adheres to ECMAScript Module (ESM) standards.

- **Feedback & Collaboration:**  
  We welcome constructive feedback. Engage with maintainers and peers through GitHub issues and pull request discussions to improve our collective workflow.

---
---
---

# Ensure README.md begins like this:

# repository0

`repository0` is a demo repository that showcases the GitHub workflows imported from intentïon [agentic‑lib](https://github.com/xn-intenton-z2a/agentic-lib). Its primary purpose is to demonstrate these automated CI/CD workflows.

To create a self-evolving agentic coding system of your own based on this one see the [TEMPLATE-README.md](./TEMPLATE-README.md) for more details.

This readme shall evolve into a based on of the seed CONTRIBUTING files in [./seeds](./seeds).

## Repository Template

The repository is intended as a template that includes:
* A Template Base: A starting point for new projects.
* A Running Experiment: An example implementation that demonstrates one way to use the template.
* Example GitHub Workflows from [agentic‑lib](https://github.com/xn-intenton-z2a/agentic-lib) which hand off to reusable workflows.

* See [TEMPLATE-README.md](./TEMPLATE-README.md) for more details.

---
---
---

# Ensure README.md ends like this:

## Contributing

We welcome contributions! Please review our [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to contribute effectively.

## License

Released under the MIT License (see [LICENSE](./LICENSE)).
project is licensed under the MIT License. For details, see LICENSE.