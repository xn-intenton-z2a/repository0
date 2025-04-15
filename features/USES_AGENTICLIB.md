# Uses intentïon -agentic-lib- Feature

The **intentïon -agentic-lib-** is a collection of reusable GitHub Actions workflows that enable your 
repository to operate in an “agentic” manner. Autonomous workflows communicate through branches and 
issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be invoked using 
GitHub’s -workflow_call- event, so they can be composed together like an SDK. This project itself is evolving, using this
tool and the reusable workflows shall become bundled actions in due course.

*Warning:* Executing these workflows shall incur charges on your OpenAI account and consume chargeable GitHub Actions resources minutes.

*Warning:* Experimental. This coding system has generated a few interesting examples (I have been educated) but nothing of personal utility.

*Warning:* This project is not yet ready for production use. You should not point the -agentic-lib- workflows a repository containing existing intellectual property.

Mixed licensing:
* This project is licensed under the GNU General Public License (GPL).
* This file is part of the example suite for -agentic-lib- see: https://github.com/xn-intenton-z2a/agentic-lib
* This file is licensed under the MIT License. For details, see LICENSE-MIT

[Start using the Repository Template](https://github.com/xn-intenton-z2a/repository0)

Examples:
* [-repository0-plot-code-lib-](https://github.com/xn-intenton-z2a/repository0-plot-code-lib) - A CLI generating SVG and novel formats plots for formulae. 
* Send a PR to add your example, either descending from -repository0- or using the -agentic-lib- SDK directly.

## Should you use the -agentic-lib- Coding System?

* Can you access an OpenAI account with API keys that can access at least -o3-mini- ?
* Are you willing to incur charges the resources consumed by the OpenAI API and GitHub Actions ?
* Are you curious as to where self-evolving code might lead ?
* Would you like to see how such a system can be built and has been built ?
* Do you like that it's OpenAI and GitHub API calls wired together in JS (GitHub Script) and packaged as GitHub Workflows* ?
* Do you appreciate that you need -dotenv, openai, zod- in your -package.json- because the JS has dependencies on them ?

*Actions with bundled JS coming soon.

---

## Getting Started

Clone a seed repository which is pre-configured with the reusable workflows and scripts: https://github.com/xn-intenton-z2a/repository0

### Initiating the workflow

Run the action "Create Issue" and enter some text to create an issue. This will create an issue and trigger the 
"Issue Worker" to write the code. If the Issue Worker is able to resolve the issue a Pull Request is raised, the change 
automatically merged. The issue reviewed and closed if the change is deemed to have delivered whatever was requested in the issue.

Development Workflows:
---
On timer / Manual: Create Issue (new issue opened) 
-> Issue Worker (code changed, issue updated) 
-> Automerge (code merged)
-> Review Issue (issue reviewed and closed)

On timer: Issue Worker (code changed, issue updated) 
-> Automerge (code merged)
-> Review Issue (issue reviewed and closed)

On timer: Automerge (code merged)
-> Review Issue (issue reviewed and closed)

On timer: Review Issue (issue reviewed and closed)
---
(Each workflow is triggered by the previous one and also on a schedule so that failures can be recovered from.)

### Tuning the agentic coding system

The default set-up is quite open which can be chaotic. To temper this chaos you can change these files which the workflow takes into consideration:
- -CONTRIBUTING.md- - The workflow is itself a contributor and will be asked to follow these guidelines. Start by writing your owm mission statement.
- -eslint.config.js- - Code style rules and additional plugins can be added here.

The following files are also taken into consideration but may also be changed (even blanked out completely) by the workflow:
- -README.md-
- -package.json-
- -src/lib/main.js-
- -tests/unit/main.test.js-

**Chain Workflows Together:**  
   Use outputs from one workflow as inputs for another. For example, if an issue review workflow outputs -fixed-, then trigger an automerge workflow based on that flag.

**Customize Parameters:**  
   Each workflow accepts parameters with sensible defaults. Override them as needed to fit your project’s structure and requirements.

**Seed and Evolve:**  
   With a simple prompt (e.g. a new issue), the system will automatically review, generate fixes using ChatGPT, commit changes, and merge them—allowing the program to evolve autonomously.

---

# Agentic Development System Guide

This guide explains how the various workflows of the Agentic Coding Systems work together to automate and streamline your development process. Think of these workflows as modular SDK components that encapsulate common operations—publishing, testing, issue management, dependency updates, code formatting, and more—allowing you to build an agentic development system for your projects.

---

## Issue Management Workflows
These workflows generalize the concept of work items as “tasks” rather than platform-specific issues.

### Issue Creator (-issue-creator.yml-)
- **Function:** Creates a new task based on predefined prompts.
- **Reusable Workflow:** [-wfr-create-issue.yml@1.2.0-](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-create-issue.yml@1.2.0)
- **Trigger:** Manual dispatch or scheduled events with input parameters.

### Issue Worker (-issue-worker.yml-)
- **Function:** Selects, validates, and initiates work on existing tasks.
- **Reusable Workflows:**
  - [-wfr-select-issue.yml@1.2.0-](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-select-issue.yml@1.2.0)
  - [-wfr-apply-issue-resolution.yml@1.2.0-](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-apply-issue-resolution.yml@1.2.0)
  - [-wfr-create-pr.yml@1.2.0-](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-create-pr.yml@1.2.0)

### Issue Reviewer (-issue-reviewer.yml-)
- **Function:** Reviews and finalizes tasks once work is complete.
- **Reusable Workflow:** [-wfr-review-issue.yml@1.2.0-](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-review-issue.yml@1.2.0)

### Automerge Workflow (-automerge.yml-)
- **Function:** Automatically merges pull requests when criteria are met.
- **Reusable Workflows:**
  - [-wfr-automerge-find-pr-from-pull-request.yml@1.2.0-](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-automerge-find-pr-from-pull-request.yml@1.2.0)
  - [-wfr-automerge-find-pr-in-check-suite.yml@1.2.0-](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-automerge-find-pr-in-check-suite.yml@1.2.0)
  - [-wfr-automerge-label-issue.yml@1.2.0-](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-automerge-label-issue.yml@1.2.0)
  - [-wfr-automerge-merge-pr.yml@1.2.0-](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-automerge-merge-pr.yml@1.2.0)

---

## Reusable Workflows SDK Guide

Think of each reusable workflow as a function in an SDK:
- **Inputs:** Parameters (e.g., -versionIncrement-, -buildScript-, -issueTitle-) customize workflow behavior.
- **Outputs:** Results such as task status, pull request numbers, or merge status.
- **Integration:** Invoke these workflows via GitHub Actions workflow calls, schedule triggers, or manual dispatch. They encapsulate complex operations into modular, reusable components.

### Example: Invoking the Issue Creator Workflow
---yaml
on:
  workflow_dispatch:
    inputs:
      issueTitle:
        description: 'Title for the new task'
        required: false
        default: 'house choice'
---
Internally, this triggers [-wfr-create-issue.yml@1.2.0-](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-create-issue.yml@1.2.0) to generate an issue template based on provided parameters.

---

## Repository Setup Guide

Follow these steps to set up your repository using the agentic development system:

1. **Create a Repository from Template:**
   - Begin with a repository template that includes the top-level workflows (e.g., -publish.yml-, -test.yml-, -issue-creator.yml-, etc.).
   - Clone the repository locally.

2. **Configure Repository Settings:**
   - Ensure your repository supports Node.js (v20+).
   - Add necessary secrets (e.g., -CHATGPT_API_SECRET_KEY-, -GITHUB_TOKEN-) via your repository settings.

3. **Customize Workflow Inputs:**
   - Edit workflow files under -.github/workflows/- to match your project specifics (e.g., branch names, file paths).
   - Update configuration files such as -dependabot.yml- and -FUNDING.yml- as needed.

---

## Component Breakdown

This repository is organized into three distinct areas to help you understand the purpose and maturity level of each component:

### 1. Re‑usable Workflows (Core Functionality)
- **Purpose:**  
  These workflows form the backbone of the agentic‑lib system, enabling automated coding processes such as testing, publishing, and issue management.
- **Stability:**  
  They are stable and well‑tested, designed to be integrated into your CI/CD pipelines.
- **Licensing:**  
  The core workflows are released under GPL‑3 and include an attribution requirement for any derived work.
- **Location:**  
  Find these in the -.github/workflows/- directory.

### 2. Example Workflows (Demonstrative Content)
- **Purpose:**  
  These files provide practical examples of how to use the core workflows. They serve as learning tools and reference implementations.
- **Stability:**  
  While functional, they are intended primarily for demonstration and experimentation.
- **Licensing:**  
  The example workflows are covered by the MIT license to allow for broader use and modification.
- **Location:**  
  Look in the -examples/- directory for sample implementations.

### 3. The Evolving main.js (Experimental Work in Progress)
- **Purpose:**  
  This file showcases experimental features and serves as a testbed for integrating new ideas into the system.
- **Stability:**  
  It is under active development and may change frequently. It represents bleeding‑edge functionality that might not yet be production‑ready.
- **Licensing:**  
  As part of the core project, it is under GPL‑3 with the attribution clause.
- **Location:**  
  The experimental code is located in -src/lib/main.js-.

Each of these components is documented separately to ensure you can quickly determine which parts are ready for use and which are intended as examples or experimental features.
