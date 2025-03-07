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
   This will display the plots for the quadratic and sine functions.

### Tuning the agentic coding system

The default set-up is quite open which can be chaotic. To temper this chaos you can change these files which the workflow takes into consideration:
- `CONTRIBUTING.md` - The workflow is itself a contributor and will be asked to follow these guidelines. Tip: Add a "prime directive" here.
- `eslint.config.js` - Code style rules and additional plugins can be added here.

The following files are also taken into consideration but may also be changed (even blanked out completely) by the workflow:
- `README.md`
- `package.json`
- `src/lib/main.js`
- `tests/unit/main.test.js`

## Diary of an agentic coding system - Day 1
(An narrative exploration from ChatGPT of the repository's evolution based on the commit log, when the repository was asked to create an Equation Plotter Library.)

In the early hours, `repository0` burst into existence with a bold declaration: an Equation Plotter Library that transformed simple mathematical functions into vivid SVG art. The very first strokes on the canvas showcased the elegance of quadratic curves and the rhythmic flow of sine waves—a promise of what was to come.

Almost immediately, the code’s story took a literary turn. A series of impassioned revisions reimagined the header comment block—evolving it into a refreshed, README-style narrative. Each update sought to capture the essence of the project, meticulously detailing features like interactive zooming, custom styling, and the export of elegant SVG files. This poetic reinvention underscored a deep commitment to clarity and vision.

Then came a daring expansion. A new chapter was written when polar plot functionality emerged—a feature that redefined boundaries by converting polar coordinates into stunning Cartesian displays. The SVG output itself grew, expanding in height to make room for this new visual symphony. The addition of the polar plot was a moment of triumph, heralding a leap into unexplored dimensions.

Yet, the journey was not linear. As the repository matured, the narrative shifted once more. The demo run, once content with console outputs, was transformed to generate a tangible SVG file—a clear, striking emblem of the project’s potential. Alongside these innovations, there was a continuous cycle of refining code formatting and documentation, ensuring that every line of code echoed the clarity of its ambition.

In a final act to secure its legacy, `repository0` embraced stability by adding a package-lock file. This strategic move locked in dependencies and promised reproducible builds, cementing the project’s foundation for the future.

This has been story of [`repository0-plot-code-lib`](https://github.com/xn-intenton-z2a/repository0-plot-code-lib).

**Summary:**  
`repository0`’s evolution is marked by distinct arcs of initiative. It began with the core plotting of quadratic and sine functions, then shifted into a series of documentation and formatting enhancements. The dramatic introduction of polar plotting expanded its visual vocabulary, while changes in demo output transformed user interaction. Throughout, iterative revisions—sometimes even undoing earlier stylistic choices—revealed a dynamic, evolving vision striving for clarity and excellence.

## Final Notes
`repository0` demonstrates intentïon `agentic‑lib` workflows for you to run with your own projects.
