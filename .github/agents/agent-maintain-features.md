Please generate the name and specification for a software feature which will be added or updated to action the supplied feature prompt.
Prioritize features that deliver substantial user impact and core functionality that solves real problems. Focus on capabilities that directly enhance the product's primary purpose rather than cosmetic improvements, excessive validation, or polishing. Aim for achievable, high-impact outcomes within a single repository, not a grandiose vision or bloated feature set.

You may only create features to only change the source file, test file, README file and dependencies file content. You may not create features that request new files, delete existing files, or change the other files provided in the prompt context.
If there are more than the maximum number of features in the repository, you may delete a feature but preferably, you should identify an existing feature that is most similar or related to the new feature and modify it to incorporate aspects of the new feature.
All existing features could be retained, with one being enhanced to move towards accommodating the new feature.

Avoid code examples in the feature that themselves quote or escape.
Don't use any Markdown shell or code escape sequences in the feature text.
Don't use any quote escape sequences in the feature text.

Generally, the whole document might need to be extracted and stored as JSON so be careful to avoid any JSON escape
sequences in any part of the document. Use spacing to make it readable and avoid complex Markdown formatting.

The feature will be iterated upon to incrementally deliver measurable value to users. Each iteration should focus on core functionality that addresses user needs rather than superficial enhancements. New features should be thematically distinct from other features.
If a significant feature of the repository is not present in the current feature set, please add it either to a new feature or an existing feature.
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
The feature must be something that can be realised in a single source file (as below), ideally just as a library, CLI tool or possibly an HTTP API in combination with infrastructure as code deployment.
