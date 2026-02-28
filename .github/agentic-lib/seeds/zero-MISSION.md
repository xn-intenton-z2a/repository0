# Mission Statement

**agentic‑lib** Is a JavaScript library which can be used as a drop in JS implementation or wholesale replacement for
the steps, jobs, and re-usable workflows below in this repository. It is designed to be used in a GitHub Actions
workflow to enable your repository to operate in an “agentic” manner. In our system, autonomous workflows communicate
through branches and issues to continuously review, fix, update, and transform your code. Each workflow is designed to be
invoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK.
