# Uses intentïon `agentic-lib` Feature

The **intentïon `agentic-lib`** is a collection of reusable GitHub Actions workflows that enable your 
repository to operate in an “agentic” manner. Autonomous workflows communicate through branches and 
issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be invoked using 
GitHub’s `workflow_call` event, so they can be composed together like an SDK. This project itself is evolving, using this
tool and the reusable workflows shall become bundled actions in due course.

*Warning:* Executing these workflows shall incur charges on your OpenAI account and consume chargeable GitHub Actions resources minutes.

*Warning:* Experimental. This coding system has generated a few interesting examples (I have been educated) but nothing of personal utility.

*Warning:* This project is not yet ready for production use. You should not point the `agentic-lib` workflows a repository containing existing intellectual property.

Mixed licensing:
* This project is licensed under the GNU General Public License (GPL).
* This file is part of the example suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
* This file is licensed under the MIT License. For details, see LICENSE-MIT

[Start using the Repository Template](https://github.com/xn-intenton-z2a/repository0)

Examples:
* [`repository0-plot-code-lib`](https://github.com/xn-intenton-z2a/repository0-plot-code-lib) - A CLI generating SVG and novel formats plots for formulae. 
* Send a PR to add your example, either descending from `repository0` or using the `agentic-lib` SDK directly.

## Should you use the `agentic-lib` Coding System?

* Can you access an OpenAI account with API keys that can access at least `o3-mini` ?
* Are you willing to incur charges the resources consumed by the OpenAI API and GitHub Actions ?
* Are you curious as to where self-evolving code might lead ?
* Would you like to see how such a system can be built and has been built ?
* Do you like that it's OpenAI and GitHub API calls wired together in JS (GitHub Script) and packaged as GitHub Workflows* ?
* Do you appreciate that you need `dotenv, openai, zod` in your `package.json` because the JS has dependencies on them ?

*Actions with bundled JS coming soon.

---

## Issue Management Workflows
These workflows generalize the concept of work items as “tasks” rather than platform-specific issues.

### Issue Creator (`issue-creator.yml`)
- **Function:** Creates a new task based on predefined prompts.
- **Reusable Workflow:** [`wfr-create-issue.yml@4.0.4`](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-create-issue.yml@4.0.4)
- **Trigger:** Manual dispatch or scheduled events with input parameters.

### Issue Worker (`issue-worker.yml`)
- **Function:** Selects, validates, and initiates work on existing tasks.
- **Reusable Workflows:**
  - [`wfr-select-issue.yml@4.0.4`](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-select-issue.yml@4.0.4)
  - [`wfr-apply-issue-resolution.yml@4.0.4`](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-apply-issue-resolution.yml@4.0.4)
  - [`wfr-create-pr.yml@4.0.4`](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-create-pr.yml@4.0.4)

### Issue Reviewer (`issue-reviewer.yml`)
- **Function:** Reviews and finalizes tasks once work is complete.
- **Reusable Workflow:** [`wfr-review-issue.yml@4.0.4`](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-review-issue.yml@4.0.4)

### Automerge Workflow (`automerge.yml`)
- **Function:** Automatically merges pull requests when criteria are met.
- **Reusable Workflows:**
  - [`wfr-automerge-find-pr-from-pull-request.yml@4.0.4`](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-automerge-find-pr-from-pull-request.yml@4.0.4)
  - [`wfr-automerge-find-pr-in-check-suite.yml@4.0.4`](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-automerge-find-pr-in-check-suite.yml@4.0.4)
  - [`wfr-automerge-label-issue.yml@4.0.4`](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-automerge-label-issue.yml@4.0.4)
  - [`wfr-automerge-merge-pr.yml@4.0.4`](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-automerge-merge-pr.yml@4.0.4)

---

## Reusable Workflows SDK Guide

Think of each reusable workflow as a function in an SDK:
- **Inputs:** Parameters (e.g., `versionIncrement`, `buildScript`, `issueTitle`) customize workflow behavior.
- **Outputs:** Results such as task status, pull request numbers, or merge status.
- **Integration:** Invoke these workflows via GitHub Actions workflow calls, schedule triggers, or manual dispatch. They encapsulate complex operations into modular, reusable components.

### Example: Invoking the Issue Creator Workflow
```yaml
on:
  workflow_dispatch:
    inputs:
      issueTitle:
        description: 'Title for the new task'
        required: false
        default: 'house choice'
```
Internally, this triggers [`wfr-create-issue.yml@4.0.4`](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-create-issue.yml@4.0.4) to generate an issue template based on provided parameters.

---

## Repository Setup Guide

Follow these steps to set up your repository using the agentic development system:

1. **Create a Repository from Template:**
   - Begin with a repository template that includes the top-level workflows (e.g., `publish.yml`, `test.yml`, `issue-creator.yml`, etc.).
   - Clone the repository locally.

2. **Configure Repository Settings:**
   - Ensure your repository supports Node.js (v20+).
   - Add necessary secrets (e.g., `CHATGPT_API_SECRET_KEY`, `GITHUB_TOKEN`) via your repository settings.

3. **Customize Workflow Inputs:**
   - Edit workflow files under `.github/workflows/` to match your project specifics (e.g., branch names, file paths).
   - Update configuration files such as `dependabot.yml` and `FUNDING.yml` as needed.

---