### Issue Creator (`issue-creator.yml`)
- **Function:** Creates a new task based on predefined prompts.
- **Reusable Workflow:** [`wfr-create-issue.yml@1.2.0`](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-create-issue.yml@1.2.0)
- **Trigger:** Manual dispatch or scheduled events with input parameters.

Example of source from the GitHub worklflow file to implement as JavaScript (Node 20 / ESM) functions in a library:
START_OF_CONCATENATED_WORKFLOW_FILE
```
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
        description: 'Options for house choice, separated by double pipes "||".'
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
            core.setOutput("issueBody", issueBody);
            core.setOutput("issueNumber", issue.number);
            core.info(`issueTitle: ${selectedIssueTitle}`);
            core.info(`issueBody: ${issueBody}`);    
            core.info(`issueNumber: ${issue.number}`);

    outputs:
      issueTitle: ${{ steps.create-issue.outputs.issueTitle }}
      issueBody: ${{ steps.create-issue.outputs.issueBody }}
      issueNumber: ${{ steps.create-issue.outputs.issueNumber }}
```
END_OF_CONCATENATED_WORKFLOW_FILE

Example OpenAI function to implement as JavaScript function which exports a simple function with the same signature as the openAI funcion that it wraps (Node 20 / ESM) functions in a library:
START_OF_OPENAI_FUNCTION_EXAMPLE_JS
```
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
```
END_OF_OPENAI_FUNCTION_EXAMPLE_JS
