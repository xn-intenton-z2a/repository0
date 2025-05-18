# PR Creation Automation

## CLI Behavior

Add a new top-level command pr with subcommand create. Usage: npm run start -- pr create --repo owner slash repo --title title --body body [--base baseBranch] [--head headBranch] [--token envVarName]. The GITHUB_TOKEN environment variable is used by default when --token is omitted.

On success print pull request URL to stdout and exit with code 0. On failure print error to stderr and exit with code 1.

## File Modifications

- sandbox/source/main.js: import no new dependencies. In main switch add case pr to invoke doPrCommand. Implement doPrCommand to validate subcommand and options, read token from environment or flag, build payload, and use built in fetch to call GitHub API endpoint at api github com slash repos slash owner slash repo slash pulls. Handle HTTP errors and parse JSON.
- sandbox/tests/pr.test.js: add tests that stub global fetch to simulate API responses. Cover success, missing token, missing arguments, and API error.
- README.md and sandbox/docs/CLI_USAGE.md: update command reference to document pr create usage and examples.

## Testing

Add tests in sandbox/tests/pr.test.js covering success flow prints URL, missing token exits with error code 1, missing flags exits with code 1, and API error prints error and exits with code 1.

## Documentation

Extend CLI usage in README and CLI_USAGE.md to include pr create command with flags and examples.