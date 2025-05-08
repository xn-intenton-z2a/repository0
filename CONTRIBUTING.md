# repository0

`repository0` is a repository template that showcases the GitHub workflows imported from intentïon `agentic‑lib`. Its
primary purpose is to demonstrate these automated CI/CD workflows and provide a basis for further development.
We add features to showcase what we can confidently do with completion calls to an LLM with a 200,000 token limit used
to create and update directory of JS source and test files. The files in `sandbox/` are maintained by the repository's
workflows and run using the same test suite as the main source file.

We showcase what you can by generating a new feature showing it at work as the output of `npm run start` and with
feature level tests showing primary flows as well as classic unit tests.

The mission of the contributors, human or automated, is to show case the workflow capabilities of the repository.

## How to Contribute

The guidelines below apply to human or automated contributions:

1. **Report Issues or Ideas:**
    - Open an issue on GitHub to share bug reports, feature requests, or any improvements you envision.
    - Clear descriptions and reproducible steps are highly appreciated.

2. **Submit Pull Requests:**
    - Fork the repository and create a feature branch.
    - Implement your changes, ensuring you follow the existing coding style and standards.
    - Add tests to cover any new functionality.
    - Update documentation if your changes affect usage or workflow behavior.
    - Submit your pull request for review.

## Guidelines

- **Code Quality:**
    - Ensure there are tests that cover your changes and any likely new cases they introduce.
    - When making a change remain consistent with the existing code style and structure.
    - When adding new functionality, consider if some unused or superseded code should be removed.

- **Compatibility:**
    - Ensure your code runs on Node 20 and adheres to ECMAScript Module (ESM) standards.
    - Tests use vitest and competing test frameworks should not be added.
    - Mocks in tests must not interfere with other tests.

- **Issue Creation:**
    - Don't create layers of configuration managers or similar abstractions.
    - Work on adding valuable functionality not plumbing.

- **Testing:**
    - The command `npm test` should invoke the tests added for the new functionality (and pass).
    - If you add new functionality, ensure it is covered by tests.

- **Documentation:**
    - When making a change to the main source file, review the readme to see if it needs to be updated and if so, update it.
    - Where the source exports a function, consider that part of the API of the library and document it in the readme.
    - Where the source stands-up an HTTP endpoint, consider that part of the API of the library and document it in the readme.
    - Include usage examples including inline code usage and CLI and HTTP invocation, API references.

- **README:**
    - The README should begin with something inspired by the mission statement and describe the current state of the repository (rather than the journey)
    - The README should include a link to MISSION.md, CONTRIBUTING.md, LICENSE.md.
    - The README should include a link to the intentïon `agentic-lib` GitHub Repository which is https://github.com/xn-intenton-z2a/agentic-lib.

## Sandbox mode

Please note that the automation features of this repository are in sandbox mode. This means that
automated changes should only be applied to the sandbox paths which are shown below:
```yaml
paths:
  librarySourcesFilepath:
    path: 'sandbox/SOURCES.md'
    permissions: [ 'write' ]
    limit: 16
  libraryDocumentsPath:
    path: 'sandbox/library/'
    permissions: [ 'write' ]
    limit: 64
  featuresPath:
    path: 'sandbox/features/'
    permissions: [ 'write' ]
    limit: 8
  targetTestsPath:
    path: 'sandbox/tests/'
    permissions: [ 'write' ]
  targetSourcePath:
    path: 'sandbox/source/'
    permissions: [ 'write' ]
  documentationPath:
    path: 'sandbox/docs/'
    permissions: [ 'write' ]
  readmeFilepath:
    path: 'sandbox/README.md'
    permissions: [ 'write' ]

  # Not sandboxed and modifiable by the LLM-generated responses
  dependenciesFilepath:
    path: 'package.json'
    permissions: [ 'write' ]
```
