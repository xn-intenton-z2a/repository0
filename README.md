# `repository0`

The repository is intended as a template that includes:
* A Template Base: A starting point for new projects.
* A Running Experiment: An example implementation that demonstrates one way to use the template.
* Workflows from `agentic‑lib` which reference reusable workflows.

## Overview
`repository0` is a demo repository that showcases the GitHub workflows imported from intentïon `agentic‑lib`. Its primary purpose is to demonstrate these automated CI/CD workflows.

## What’s Inside

- **GitHub Workflows:**  
  Workflows in the `.github/workflows/` These workflows consume reusable workflows from intentïon `agentic‑lib`.

- **Source Code:**  
  The main functionality is in `src/lib/main.js`. This file is focus of the workflow and is modified by the workflow to deliver the project goals.

- **Dependencies:**  
  `package.json` can be modified by the workflow to add or update dependencies and it also defines some of the test and build scripts.

- **Tests:**  
  Unit tests in the `tests/unit/` folder ensure that the main script doesn't drift too far.
  This test file can be modified by the workflow `tests/unit/main.test.js`, duplicate `main.test.js` to fix a version of the behaviour where the workflow can't change it.

- **Docs**  
  This `README.md` can be modified by the workflow.

## Getting Started

This repository is already set up with the necessary workflows and scripts but you do need to supply the following secrets:
- `CHATGPT_API_SECRET_KEY` - This key must be for an account with access to the OpenAI chat completions API for model `o3-mini`.
  Set these secrets in your repository settings under *Settings > Secrets and Variables > Actions*. They are essential for the automated workflows such as publishing packages and managing issues.

## intentïon `agentic-lib`

The **intentïon `agentic-lib`** is a collection of reusable GitHub Actions workflows that enable your repository to operate in an “agentic” manner. Autonomous workflows communicate through branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be invoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK. This project itself is evolving, and these workflows may eventually become bundled actions.

*Warning:* Executing these workflows may incur charges on your OpenAI account and consume GitHub Actions minutes.

*Warning:* Experimental. This coding system is still in development and may not suit production use.

## Should you use the `agentic-lib` Coding System?

* Do you have access to an OpenAI account with necessary API keys?
* Are you willing to incur charges for consumed resources?
* Are you curious about self-evolving code?
* Would you like to see how such a system can be built?
* Do you appreciate integrated OpenAI and GitHub API calls in a JavaScript environment?

### Initiating the workflow

Run the action "Create Issue" and enter some text to create an issue. This will create an issue and trigger the "Issue Worker" to write the code.
If the Issue Worker is able to resolve the issue a Pull Request is raised, the change automatically merged.
The issue reviewed and closed if the change is deemed to have delivered whatever was requested in the issue.

#### Development Workflows:
```
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
```
(Each workflow is triggered by the previous one and also on a schedule so that failures can be recovered from.)

#### Running the workflows:

The workflows have `schedules:` set and will run automatically. You can also run them manually from the Actions tab.
The workflows can become stuck and need manual intervention. It's worth running things like `Automerge`
and `Review Issue` manually to get things moving again. If a branch has a failing build you can try `Apply Fix`
this is somewhat unreliable but worth a try, then delete the branch and run the worker again for a fresh attempt.

### Running the Demo

Check the current source file in `./src/lib/main.js` and the tests in `./tests/unit/main.test.js`.

You can run the demo and tests locally:

1. **Clone the Repository:**  
   Run in your terminal:  
   `git clone <repository_url>`

2. **Install Dependencies:**  
   Change into the project directory and run:  
   `npm install`

3. **Run Tests:**  
   To verify that everything is working, run:  
   `npm test`

4. **Run the Demo:**  
   Execute the main script with:  
   `npm run start`  
   This will display the output of the program.

### Tuning the agentic coding system

The default set-up is quite open which can be chaotic. To temper this chaos you can change these files which the workflow takes into consideration:
- `CONTRIBUTING.md` - The workflow is itself a contributor and will be asked to follow these guidelines. Tip: Add a "prime directive" here.
- `eslint.config.js` - Code style rules and additional plugins can be added here.

The following files are also taken into consideration but may also be changed (even blanked out completely) by the workflow:
- `README.md`
- `package.json`
- `src/lib/main.js`
- `tests/unit/main.test.js`

## Final Notes
`repository0` demonstrates intentïon `agentic‑lib` workflows for you to run with your own projects.
