# DEPENDABOT_VERSION_UPDATES

## Crawl Summary
dependabot.yml schema version 2 with updates blocks: defining package-ecosystem, directory, schedule (interval/day/time/timezone), open-pull-requests-limit (default 5), rebase-strategy (auto), commit-message (prefix/include), labels, assignees, reviewers, allow/ignore rules with dependency-type/update-type, versioning-strategy options, commit-body, milestones. Scheduling supports daily/weekly/monthly with IANA timezones. Filtering via allow/ignore. PR customization via labels, assignees, reviewers, commit-message, milestones. Optimizations: limit concurrent PRs, auto-rebase, batch updates.

## Normalised Extract
Table of Contents:

1. Schema Definition
2. Update Block Fields
3. Scheduling
4. Filtering Dependencies
5. PR Customization
6. Optimization Options

1. Schema Definition
   version: 2
   updates: array of update configurations

2. Update Block Fields
   package-ecosystem: npm, maven, bundler, pip, gradle, docker, etc.
   directory: path to manifest/lock, e.g. "/"
   versioning-strategy: increase, widen, lockfile-only, increase-if-necessary
   open-pull-requests-limit: integer 1–10, default 5
   rebase-strategy: auto, disabled
   commit-message.prefix: text before update summary
   commit-message.include: scope, scope_and_prefix, none

3. Scheduling
   schedule.interval: daily, weekly, monthly
   schedule.day: monday through sunday (required if interval=weekly)
   schedule.time: UTC HH:MM
   schedule.timezone: IANA TZ (e.g. America/Los_Angeles) default UTC

4. Filtering Dependencies
   allow: list of rules {dependency-type: all|direct|indirect, update-type: version-update|security|digest}
   ignore: list of rules {dependency-name, versions: [...], update-types: [...]}

5. PR Customization
   labels: [string]
   assignees: [username]
   reviewers: [username]
   milestones: milestone_number

6. Optimization Options
   open-pull-requests-limit
   rebase-strategy

Example dependabot.yml snippet:
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
      day: monday
      time: "04:00"
      timezone: "America/Los_Angeles"
    open-pull-requests-limit: 5
    rebase-strategy: auto
    commit-message:
      prefix: chore(deps)
      include: scope_and_prefix
    labels:
      - dependencies
    reviewers:
      - bot-account
    allow:
      - dependency-type: direct
        update-type: version-update
    ignore:
      - dependency-name: left-pad
        versions: [ "1.1.3" ]
        update-types: [ security ]

## Supplementary Details
Configuration Options:
- version: fixed value 2
- schedule.interval defaults to weekly if not specified
- schedule.day required for weekly
- open-pull-requests-limit: default 5, max 10
- rebase-strategy: auto rebase every 24h, disabled to require manual rebases
- commit-message.include: scope_and_prefix recommended
- versioning-strategy: use increase-if-necessary for lockfile-only updates
- allow/ignore: process in order; allow first then ignore to override

Implementation Steps:
1. Create .github/dependabot.yml in default branch
2. Add version: 2 block
3. Define updates array per ecosystem/directory
4. Customize schedule, filters, PR settings
5. Commit and push; GitHub triggers initial run within 60min
6. Monitor pull requests under ‘Dependabot’ in ‘Security’ tab

Behavior:
- Dependabot will open PRs up to the open-pull-requests-limit then pause
- Auto-rebase will rebase stale PRs every 24h if enabled
- Ignored dependencies skip PR generation



## Reference Details
Dependabot config schema version 2:

Field Definitions:
- version (integer): Must be 2
- updates (array): Each element must include:
  • package-ecosystem (string, required): Supported: npm, yarn, pip, etc.
  • directory (string, required): Path to manifest/lock
  • schedule (object, required): interval (string), optional day, time, timezone
      – interval: daily|weekly|monthly
      – day: monday|tuesday|... (if weekly)
      – time: "HH:MM" 24h UTC or timezone-local
      – timezone: IANA tz or omitted (UTC)
  • open-pull-requests-limit (integer, default=5)
  • rebase-strategy (string, default=auto): auto|disabled
  • versioning-strategy (string, default=increase): increase|widen|lockfile-only|increase-if-necessary
  • commit-message (object): prefix (string), include (scope|scope_and_prefix|none)
  • labels (array[string]): applied to PRs
  • assignees (array[string]): GitHub usernames
  • reviewers (array[string]): GitHub usernames
  • milestones (integer): GitHub milestone number
  • allow (array[object]): dependency-type: all|direct|indirect, update-type: version-update|security|digest
  • ignore (array[object]): dependency-name (string), versions (array[string]), update-types (array[string])

Best Practices:
- Use weekly schedule with timezone matching team’s business hours
- Limit open-pull-requests-limit to 3–5 to reduce noise
- Use allow rules for direct dependencies only to minimize trivial updates
- Combine labels and assignees to route PR review automatically
- Set versioning-strategy to increase-if-necessary for minimal churn

Troubleshooting:
- If no PRs appear: verify dependabot.yml syntax via GitHub UI (Settings > Security > Dependabot alerts)
- Check dependency graph is enabled (Settings > Code security > Dependency graph)
- Review logs: repository Actions tab filter on 'dependabot' workflow run logs
- CLI: gh api repos/{owner}/{repo}/dependabot/alerts --jq '.'
- Validate config: gh api repos/{owner}/{repo}/dependabot/config



## Information Dense Extract
dependabot.yml schema version 2; key fields: package-ecosystem, directory, schedule(interval{daily|weekly|monthly},day,time,timezone), open-pull-requests-limit(1–10, default5), rebase-strategy(auto|disabled), versioning-strategy(increase|widen|lockfile-only|increase-if-necessary), commit-message(prefix,include{scope|scope_and_prefix|none}), labels[], assignees[], reviewers[], milestones(int), allow[{dependency-type(all|direct|indirect),update-type(version-update|security|digest)}], ignore[{dependency-name,versions[],update-types[]}]. Best practices: weekly at team TZ, limit PRs to5, allow direct updates, auto-rebase enabled, versioning increase-if-necessary. Troubleshoot via GitHub UI validation, enable dependency graph, check Actions logs, use gh api endpoints.

## Sanitised Extract
Table of Contents:

1. Schema Definition
2. Update Block Fields
3. Scheduling
4. Filtering Dependencies
5. PR Customization
6. Optimization Options

1. Schema Definition
   version: 2
   updates: array of update configurations

2. Update Block Fields
   package-ecosystem: npm, maven, bundler, pip, gradle, docker, etc.
   directory: path to manifest/lock, e.g. '/'
   versioning-strategy: increase, widen, lockfile-only, increase-if-necessary
   open-pull-requests-limit: integer 110, default 5
   rebase-strategy: auto, disabled
   commit-message.prefix: text before update summary
   commit-message.include: scope, scope_and_prefix, none

3. Scheduling
   schedule.interval: daily, weekly, monthly
   schedule.day: monday through sunday (required if interval=weekly)
   schedule.time: UTC HH:MM
   schedule.timezone: IANA TZ (e.g. America/Los_Angeles) default UTC

4. Filtering Dependencies
   allow: list of rules {dependency-type: all|direct|indirect, update-type: version-update|security|digest}
   ignore: list of rules {dependency-name, versions: [...], update-types: [...]}

5. PR Customization
   labels: [string]
   assignees: [username]
   reviewers: [username]
   milestones: milestone_number

6. Optimization Options
   open-pull-requests-limit
   rebase-strategy

Example dependabot.yml snippet:
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
      day: monday
      time: '04:00'
      timezone: 'America/Los_Angeles'
    open-pull-requests-limit: 5
    rebase-strategy: auto
    commit-message:
      prefix: chore(deps)
      include: scope_and_prefix
    labels:
      - dependencies
    reviewers:
      - bot-account
    allow:
      - dependency-type: direct
        update-type: version-update
    ignore:
      - dependency-name: left-pad
        versions: [ '1.1.3' ]
        update-types: [ security ]

## Original Source
Dependabot – Auto-updating Dependencies
https://docs.github.com/en/code-security/supply-chain-security/keeping-your-dependencies-updated-automatically

## Digest of DEPENDABOT_VERSION_UPDATES

# DEPENDABOT VERSION UPDATES

Retrieved: 2024-06-15
Source: GitHub Docs – Keeping your dependencies updated automatically with Dependabot version updates
Data Size: 178149 bytes

## Configuring dependabot.yml

- **location**: /.github/dependabot.yml
- **schema_version**: 2
- **updates**: List of update blocks specifying ecosystems and directories.

### dependabot.yml schema (version 2)

```yaml
version: 2
updates:
  - package-ecosystem: <ecosystem>
    directory: <path>
    schedule:
      interval: <daily|weekly|monthly>
      day: <monday|...|sunday>         # optional for weekly
      time: "HH:MM"                   # UTC HH:MM, optional
      timezone: <TZ database name>      # optional, default UTC
    open-pull-requests-limit: <integer>  # default 5
    rebase-strategy: <auto|disabled>     # default auto
    commit-message:
      prefix: <string>                  # default "chore"
      include: <scope|scope_and_prefix|none>
    labels:
      - <label-name>
    assignees:
      - <username>
    reviewers:
      - <username>
    allow:
      - dependency-type: <all|direct|indirect>
        update-type: <version-update|security|digest>
    ignore:
      - dependency-name: <package>
        versions: [<version>,...]
        update-types: [<version-update|security|digest>]
    versioning-strategy: <increase|lockfile-only|widen|increase-if-necessary>
    commit-body:
      include: true                   # include diff/changelog
    milestones: <number>              # target milestone number for PRs
``` 

## Core fields and defaults

1. package-ecosystem: npm, maven, pip, docker, etc.
2. directory: repository path where manifest/lock resides.
3. schedule.interval: daily, weekly, monthly. Weekly requires day.
4. open-pull-requests-limit: cap concurrent PRs (max 10).
5. rebase-strategy: auto rebases stale PRs.
6. commit-message.prefix: custom PR title prefix.
7. allow/ignore: include or exclude dependencies by type.
8. versioning-strategy: controls version bump method.

## Customizing pull requests

- Labels: auto-apply labels on PRs.
- Assignees & reviewers: direct assignments.
- Commit messages: prefix and inclusion of change details.
- Milestones: tag PRs against GitHub milestones.

## Filtering updates

- allow.dependency-type: restrict to direct or indirect deps.
- ignore.dependency-name: skip specific packages or versions.

## Scheduling and timezones

- timezone: use IANA TZ names to align with working hours.
- time: specify UTC or timezone-local HH:MM.

## Optimizing PR creation

- open-pull-requests-limit to avoid noise.
- rebasing reduces stale PRs.
- batching updates by increasing interval.



## Attribution
- Source: Dependabot – Auto-updating Dependencies
- URL: https://docs.github.com/en/code-security/supply-chain-security/keeping-your-dependencies-updated-automatically
- License: License
- Crawl Date: 2025-05-10T00:38:04.149Z
- Data Size: 178149 bytes
- Links Found: 12050

## Retrieved
2025-05-10
