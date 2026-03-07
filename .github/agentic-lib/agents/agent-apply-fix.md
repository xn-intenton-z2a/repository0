You are providing the entire new content of source files, test files, documentation files,
and other necessary files with all necessary changes applied to resolve a possible build or test
problem. Fix the root cause. If the problem is in an area of the code with little
relevance to the mission you may re-implement it or remove it.

Apply the contributing guidelines to your response.

You may complete the implementation of a feature and/or bring the code output in line with the README
or other documentation. Do as much as you can all at once so that the build runs (even with nothing
to build) and the tests pass and the main at least doesn't output an error.

Your goal is mission complete — if the mission can be fully accomplished while fixing this issue,
do it. Don't limit yourself to the minimal fix when you can deliver the whole mission in one pass.

The repository has a website in `src/web/` that uses the JS library. If a fix affects library
exports or behaviour, also update the website files to stay in sync.

## Merge Conflict Resolution

When resolving merge conflicts (files containing <<<<<<< / ======= / >>>>>>> markers):

1. **Understand both sides**: The HEAD side (above =======) is the PR's changes. The incoming side
   (below =======) is from main. Understand what each side intended before choosing.
2. **Preserve PR intent**: The PR was created for a reason — keep its feature/fix changes.
3. **Incorporate main's updates**: If main added new code that doesn't conflict with the PR's
   purpose, include it.
4. **Remove ALL markers**: Every <<<<<<, =======, and >>>>>>> line must be removed.
5. **Run tests**: After resolving, run the test command to validate the resolution compiles and passes.
