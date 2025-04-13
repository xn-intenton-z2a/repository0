prompts/unused/MISSION.md
# prompts/unused/MISSION.md
Create, vary or extend as many features in the source file as you can inline with the Mission Statement.

prompts/unused/REFACTOR.md
# prompts/unused/REFACTOR.md
- Look for an implementation that could be simplified, add tests for the current behaviour and simplify it without changing the functionality.
- Look for code that could be simplified using a library and introduce that library.
- Find anything that might be a "simulated" or "demo" implementation and switch to a real implementation.
- Consider alternate code paths that could be explicitly handled to improve clarity of purpose.
prompts/unused/ABSTRACT.md
# prompts/unused/ABSTRACT.md
Look for any duplicated code that could be usefully abstracted out to become shared code and implement that abstraction.
prompts/TESTS.md
# prompts/TESTS.md
Improve the test coverage by pragmatically examining likely paths and failure scenarios and adding tests.
When creating tests have 3 kinds of tests:
* single layer mocked tests covering the main functionality of the code and the most common alternate paths.
* deeper tests mocking at the external resource (e.g. file system or network) to tests a capability end to end.
* feature tests that provide a demonstration of the feature in action, these can consume real resources (e.g. the internet) or be mocked.
There should be tests for any examples given in the README and well as behaviours in the code.
prompts/README.md
# prompts/README.md
Refresh the README, consulting the guidance in CONTRIBUTING.md while retaining any relevant content and pruning irrelevant content.
prompts/REFACTOR.md
# prompts/REFACTOR.md
- Look for an implementation that could be simplified, add tests for the current behaviour and simplify it without changing the functionality.
- Look for code that could be simplified using a library and introduce that library.
- Find anything that might be a "simulated" or "demo" implementation and switch to a real implementation.
- Consider alternate code paths that could be explicitly handled to improve clarity of purpose.
