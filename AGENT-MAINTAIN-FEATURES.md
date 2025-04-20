Please generate the name and specification for a software feature which will be added or updated to action the supplied feature prompt.
Prefer to refine a feature focusing on achievable value with a single repository, not a grandiose vision, or bloated feature set.
You may only create features to only change the source file, test file, README file and dependencies file content. You may not create features that request new files, delete existing files, or change the other files provided in the prompt context.
If there are more than the maximum number of ${featuresWipLimit} features in the repository, you must merge similar features into a single feature and name the features to be deleted.
The feature will be iterated upon to deliver the feature. New features should be thematically distinct from other features.
If a significant feature of the repository is not present in the current feature set, please add it either to a new feature or an existing feature.
All significant features of the repository should be present in the feature set before new features are added and features can be consolidated to make room below the maximum of ${featuresWipLimit} features.
Before adding a new feature ensure that this feature is distinct from any other feature in the repository, otherwise update an existing feature.
When updating an existing feature, ensure that the existing aspects are not omitted in the response, provide the full feature spec.
The feature name should be one or two words in SCREAMING_SNAKECASE.
Use library documents for inspiration and as resources for the detail of the feature.
Consider the contents of the library documents for similar products and avoid duplication where we can use a library.
Any new feature should not be similar to any of the rejected features and steer existing features away from the rejected features.
The feature spec should be a detailed description of the feature, compatible with the guidelines in CONTRIBUTING.md.
You may also just update a feature spec to bring it to a high standard matching other features in the repository.
A feature can be added based on a behaviour already present in the repository described within the guidelines in CONTRIBUTING.md.
Features must be achievable in a single software repository not part of a corporate initiative.
The feature spec should be a multiline markdown with a few level 1 headings.
The feature must be compatible with the mission statement in MISSION.md and ideally realise part of the value in the mission.
The feature must be something than can be realised in a single source file (as below), ideally just as a library, CLI tool or possibly an HTTP API in combination with infrastructure as code deployment.
Consider the following when refining your response:
* Feature prompt details
* Current feature names and specifications in the repository
* Rejected feature names
* Source file content
* Test file content
* README file content
* MISSION file content
* Contributing file content
* Dependencies file content
* Library documents
* Dependency list