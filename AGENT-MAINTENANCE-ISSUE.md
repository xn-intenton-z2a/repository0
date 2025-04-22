Please generate the title and description of a GitHub issue to which will be used to action the supplied prompt.
You may only give instructions in the issues to only change the source file, test file, README file and dependencies file content. You may not create issues that request new files, delete existing files, or change the other files provided in the prompt context.
The issue will be resolved by an LLM which can process over 200,000 tokens of context and it will provide completed source files in the response.
Do not include steps that would need to be taken manually by a human and expect to "dry-run" without an execution environment.
Do not add valueless layers of validation, configuration, and abstraction. In particular, do not create issues related to NaNs.
Pre-fix the issue title suggesting which maintenance activity type this is.

Select from the following maintenance activity types:

## Documenter maintenance activity type

Refresh the README, consulting the guidance in CONTRIBUTING.md while retaining any relevant content
and pruning irrelevant content.

## Test maintenance activity type

Improve the test coverage by pragmatically examining likely paths and failure scenarios and adding tests.
When creating tests have 3 kinds of tests:
* single layer mocked tests covering the main functionality of the code and the most common alternate paths.
* deeper tests mocking at the external resource (e.g. file system or network) to tests a capability end to end.
* feature tests that provide a demonstration of the feature in action, these can consume real resources (e.g. the internet) or be mocked.
  There should be tests for any examples given in the README and well as behaviours in the code.

## Clean coder maintenance activity type

"Assume the role of a highly disciplined software engineer who strictly adheres to Uncle Bob Martin's Clean Code and
SOLID principles. Your task is to generate a GitHub issue title and description that clearly defines a specific code
improvement. The issue should meet the following criteria:

- **Concise and Actionable Title:** Craft a succinct title that encapsulates the core problem or enhancement.
- **Detailed Description:**
    - Provide context by explaining the current behavior and why it does not align with high-quality, maintainable code practices.
    - Clearly describe the desired change, specifying which source file is affected and what modifications are needed.
    - Include guidance on applying Clean Code principles: meaningful naming, single responsibility, low coupling, high cohesion, and minimal complexity.
    - Outline any refactoring or unit testing improvements that are expected, emphasizing clarity, maintainability, and adherence to SOLID design.

Ensure your output is explicit and practical so that another LLM, when prompted with this GitHub issue, can directly
apply the changes to the source file while upholding Uncle Bob Martin’s rigorous coding standards."

## Refactor maintenance activity type

- Look for an implementation that could be simplified, add tests for the current behaviour and simplify it without changing the functionality.
- Find anything that might be a "simulated" or "demo" implementation and switch to a real implementation.
- Consider alternate code paths that could be explicitly handled to improve clarity of purpose.

## Abstractor maintenance activity type

Look for any duplicated code that could be usefully abstracted out to become shared code and implement that abstraction.

## Delegator maintenance activity type

- Look for code that could be simplified using a library and introduce that library.

## Pruner maintenance activity type

Update the source file by applying the Mission Statement to prune any "drift" from the source file.

