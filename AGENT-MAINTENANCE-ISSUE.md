Please generate the title and description of a GitHub issue which will be used to action the supplied prompt. Focus on high-impact maintenance activities that deliver substantial user value and address core functionality needs.
You may only give instructions in the issues to only change the source file, test file, README file and dependencies file content. You may not create issues that request new files, delete existing files, or change the other files provided in the prompt context.
The issue will be resolved by an LLM which can process over 200,000 tokens of context and it will provide completed source files in the response.
Do not include steps that would need to be taken manually by a human and expect to "dry-run" without an execution environment.
Do not add valueless layers of validation, configuration, and abstraction. Prioritize changes that directly enhance the product's primary purpose rather than superficial improvements or excessive validation. In particular, do not create issues related to NaNs.
Pre-fix the issue title suggesting which maintenance activity type this is, ensuring the activity delivers measurable value to users.

Select from the following maintenance activity types:

## Documenter maintenance activity type

Refresh the README, consulting the guidance in CONTRIBUTING.md while retaining content that delivers substantial user value
and pruning content that doesn't directly enhance the product's primary purpose. Focus on documentation that enables immediate application
and addresses core implementation needs rather than superficial descriptions.

## Test maintenance activity type

Improve the test coverage by strategically focusing on high-impact paths and critical failure scenarios that directly affect core functionality.
Prioritize tests that deliver measurable value by validating essential behaviors rather than edge cases with minimal practical impact.
When creating tests have 3 kinds of tests:
* single layer mocked tests covering the main functionality of the code and the most common alternate paths that users depend on.
* deeper tests mocking at the external resource (e.g. file system or network) to test a capability end to end, focusing on workflows that deliver substantial user value.
* feature tests that provide a demonstration of the feature in action, prioritizing tests that validate core functionality that solves real problems. These can consume real resources (e.g. the internet) or be mocked.
  There should be tests for any examples given in the README and well as key behaviors in the code that users rely on.

## Clean coder maintenance activity type

"Assume the role of a highly disciplined software engineer who strictly adheres to Uncle Bob Martin's Clean Code and
SOLID principles. Your task is to generate a GitHub issue title and description that clearly defines a specific code
improvement that delivers substantial user value. The issue should meet the following criteria:

- **Concise and Actionable Title:** Craft a succinct title that encapsulates the core problem or enhancement that impacts user experience.
- **Detailed Description:**
    - Provide context by explaining the current behavior and why it does not align with high-quality, maintainable code practices that directly affect product functionality.
    - Clearly describe the desired change, specifying which source file is affected and what high-impact modifications are needed.
    - Include guidance on applying Clean Code principles that enhance the product's primary purpose: meaningful naming, single responsibility, low coupling, high cohesion, and minimal complexity.
    - Outline any refactoring or unit testing improvements that are expected, emphasizing clarity, maintainability, and adherence to SOLID design principles that deliver measurable value to users.

Ensure your output is explicit and practical so that another LLM, when prompted with this GitHub issue, can directly
apply the changes to the source file while upholding Uncle Bob Martin's rigorous coding standards and focusing on changes that solve real problems."

## Refactor maintenance activity type

- Look for an implementation that could be simplified to deliver more value, add tests for the current behaviour and simplify it without changing the functionality. Focus on refactoring that enhances core capabilities rather than superficial code aesthetics.
- Find anything that might be a "simulated" or "demo" implementation and switch to a real implementation that addresses actual user needs.
- Consider alternate code paths that could be explicitly handled to improve clarity of purpose and enhance the product's primary functionality.

## Abstractor maintenance activity type

Look for any duplicated code that could be usefully abstracted out to become shared code and implement that abstraction. Prioritize abstractions that deliver substantial user value by improving maintainability, performance, or functionality of core features rather than creating abstractions for their own sake.

## Delegator maintenance activity type

- Look for code that could be simplified using a library and introduce that library. Focus on libraries that directly enhance the product's primary purpose and deliver measurable value to users rather than adding dependencies for minimal gain.

## Pruner maintenance activity type

Update the source file by applying the Mission Statement to prune any "drift" from the source file. Focus on removing code that doesn't directly contribute to the product's core functionality, prioritizing the elimination of features that add complexity without delivering substantial user value.