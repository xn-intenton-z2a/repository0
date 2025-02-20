# `repository0`

Create a repository from a Repository Template to get started with the agentic coding system. See: [Tamplate README](TEMPLATE-README.md)

## Overview
`repository0` is a demo repository that showcases the GitHub workflows imported from intentïon agentic‑lib. Its primary purpose is to demonstrate these automated CI/CD workflows. One example seed idea included here is the Equation Plotter—a simple SVG-based tool that plots mathematical functions (quadratic, linear, sine, cosine, polar, exponential, and logarithmic) using refactored code powered by lodash for concise iteration.

## What’s Inside

- **GitHub Workflows:**  
  Workflows in the `.github/workflows/` directory consume reusable workflows from intentïon agentic‑lib.

- **Source Code:**  
  The main functionality is in `src/lib/main.js`. This file is the focus of the workflow and is modified by the workflow to deliver the project goals.

- **Dependencies:**  
  `package.json` can be modified by the workflow to add or update dependencies and it also defines some of the test and build scripts.

- **Tests:**  
  Unit tests in the `tests/unit/` folder ensure that the main script doesn't drift too far. The test coverage has been optimized to be pragmatic about risk, ensuring critical functionality is validated without over-testing.

- **Docs**  
  This `README.md` can be modified by the workflow.

## Getting Started

This repository is already set up with the necessary workflows and scripts but you do need to supply the following secrets:
- `CHATGPT_API_SECRET_KEY`

Set these secrets in your repository settings under *Settings > Secrets and Variables > Actions*. They are essential for automated workflows such as publishing packages and managing issues.

### Initiating the workflow

Run the action "Create Issue" and enter some text to create an issue. This will create an issue and trigger the "Issue Worker" to write the code. If the Issue Worker is able to resolve the issue a Pull Request is raised and the change is automatically merged. The issue is reviewed and closed if the change fulfills the request.

Development Workflows:
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
   `node src/lib/main.js`  
   This will display the plots for the quadratic, linear, sine, cosine, polar, exponential, and logarithmic functions.

5. **Markdown Output:**
   You can also generate markdown output by specifying an output file with the `.md` extension. For example:
   `node src/lib/main.js output.md "y=2x+3:-10,10,1"`
   This will generate a markdown file containing the plot data.

## Test Coverage
The project now includes an enhanced suite of tests that verify key exported functions and their outputs. This ensures critical functionality while remaining pragmatic in risk coverage.

## Tuning the agentic coding system

The default setup is open and may be refined over time. You can modify these files which the workflow takes into consideration:
- `CONTRIBUTING.md` - Guidelines for contributing to the project.
- `eslint.config.js` - Code style rules and additional plugins can be added here.

The following files are also taken into consideration by the workflow:
- `README.md`
- `package.json`
- `src/lib/main.js`
- `tests/unit/main.test.js`

## Diary of an agentic coding system - Day 1
(An narrative exploration of the repository's evolution when asked to create an Equation Plotter Library.)

In the early hours, `repository0` burst into existence with a bold declaration: an Equation Plotter Library that transformed simple mathematical functions into vivid SVG art. The very first strokes on the canvas showcased the elegance of quadratic curves and the rhythmic flow of sine waves—a promise of what was to come.

Almost immediately, the code’s story took a literary turn. A series of impassioned revisions reimagined the header comment block—evolving it into a refreshed, README-style narrative. Each update sought to capture the essence of the project, detailing features like interactive zooming, custom styling, and elegant SVG exports. This poetic reinvention underscored a deep commitment to clarity and vision.

Then came a daring expansion. A new chapter was written when polar plot functionality emerged—a feature that redefined boundaries by converting polar coordinates into stunning Cartesian displays. The SVG output itself grew, expanding in height to accommodate this new visual symphony. The addition of polar plotting was a moment of triumph, heralding a leap into unexplored dimensions.

The journey was dynamic. The demo run, once content with console outputs, was transformed to generate tangible output files, and code formatting improvements were continuously integrated. Recently, a refactor was performed to reduce source size by leveraging lodash for range generation, streamlining iterative logic while preserving functionality.

**Version:** Equation Plotter Library version 0.2.0-1

## Final Notes
`repository0` demonstrates intentïon agentic‑lib workflows and is a starting point for your projects.
