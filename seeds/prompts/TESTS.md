Improve the test coverage by pragmatically examining likely paths and failure scenarios and adding tests.
When creating tests have 3 kinds of tests:
* single layer mocked tests covering the main functionality of the code and the most common alternate paths.
* deeper tests mocking at the external resource (e.g. file system or network) to tests a capability end to end.
* feature tests that provide a demonstration of the feature in action, these can consume real resources (e.g. the internet) or be mocked.
There should be tests for any examples given in the README and well as behaviours in the code.
