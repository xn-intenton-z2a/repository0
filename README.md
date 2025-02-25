# repository0

`repository0` is a demo repository that showcases the GitHub workflows imported from intentïon [`agentic‑lib`](https://github.com/xn-intenton-z2a/agentic-lib).
This repository's primary purpose is to demonstrate these automated CI/CD workflows.

To create a self-evolving agentic coding system of your own based on this one see the [TEMPLATE-README.md](./TEMPLATE-README.md) for more details.

This readme shall evolve into a based on of the seed CONTRIBUTING files in [./seeds](./seeds).

## Repository Template

The repository is intended as a template that includes:
* A Template Base: A starting point for new projects.
* A Running Experiment: An example implementation that demonstrates one way to use the template.
* Example GitHub Workflows from [agentic‑lib](https://github.com/xn-intenton-z2a/agentic-lib) which hand off to reusable workflows.

* See [TEMPLATE-README.md](./TEMPLATE-README.md) for more details.

# intentïon `agentic-lib`

The **intentïon `agentic-lib`** is a collection of reusable GitHub Actions workflows that enable your
repository to operate in an “agentic” manner. Autonomous workflows communicate through branches and
issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be invoked using
GitHub’s `workflow_call` event, so they can be composed together like an SDK. This project itself is evolving, using this
tool and the reusable workflows shall become bundled actions in due course.

*Warning:* Executing these workflows shall incur charges on your OpenAI account and consume chargeable GitHub Actions resources minutes.

*Warning:* Experimental. This coding system has generated a few interesting examples (I have been educated) but nothing of personal utility.

*Warning:* This project is not yet ready for production use. You should not point the `agentic-lib` workflows a repository containing existing intellectual property.

## Should you use the `agentic-lib` Coding System?

* Can you access an OpenAI account with API keys that can access at least `o3-mini` ?
* Are you willing to incur charges the resources consumed by the OpenAI API and GitHub Actions ?
* Are you curious as to where self-evolving code might lead ?
* Would you like to see how such a system can be built and has been built ?
* Do you like that it's OpenAI and GitHub API calls wired together in JS (GitHub Script) and packaged as GitHub Workflows* ?
* Do you appreciate that you need `dotenv, openai, zod` in your `package.json` because the JS has dependencies on them ?

*Actions with bundled JS coming soon.

---

## Installation

Install via npm:

```bash
npm install repository0
```

## Features

TODO: Add features here.

## Usage

To run the CLI tool and see help instructions:

```bash
node src/lib/main.js --help
```

If the --help flag is provided, a help menu will be displayed with available options. Additionally, if no arguments are provided, the CLI defaults to displaying the usage instructions along with a demo output.

### Example Commands

- **Default Demo Output:**
  ```bash
  npm run start
  ```
  Running without arguments will print:
  ```
  Usage: node src/lib/main.js [options]
  Options:
    --help     Show help
  Demo Output: Run with: []
  ```

## Incremental Changes Plan

TODO: Add forthcoming changes here.

## Contributing

We welcome contributions! Please review our [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to contribute effectively.

## License

Released under the MIT License (see [LICENSE](./LICENSE)).
