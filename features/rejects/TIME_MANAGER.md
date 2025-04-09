# TIME_MANAGER

## Overview
This feature consolidates time utilities and command scheduling into one unified module. In addition to providing standard time and date operations (such as obtaining the current timestamp, date formatting, and calculating differences between timestamps), the module introduces a scheduler that enables users to queue CLI commands for future execution. Schedules can be set for a specific date/time or after a defined duration, with all scheduled commands stored persistently in a local JSON file (e.g., `.repository_schedule.json`).

## CLI Integration
- **Global Flag:** A new flag `--time` activates the TIME_MANAGER module, which now supports both time operations and scheduling sub-commands.
- **Sub-Commands for Time Utilities:**
  - **now:** Returns the current timestamp in ISO 8601 format.
  - **format:** Formats a given timestamp using a provided formatting string.
  - **diff:** Calculates the difference between two timestamps.
  - **add/subtract:** Performs arithmetic with timestamps using duration strings (e.g., "1h15m").

- **Sub-Commands for Scheduling:**
  - **schedule add <time> <command> [arguments]:** Schedules a CLI command to be executed at a specified future time or after a specified delay. The `<time>` parameter can be an ISO timestamp or a duration (e.g., "2h30m").
  - **schedule list:** Displays all scheduled commands with their scheduled execution times and unique identifiers.
  - **schedule remove <id>:** Cancels a scheduled command identified by its unique ID.

## Implementation Details
- **Time Operations:** Maintains the existing functionality for time formatting, differences, and arithmetic, utilizing JavaScript's native Date object and optional lightweight libraries if needed.
- **Scheduling Mechanism:**
  - Scheduled commands are stored in a local JSON file (`.repository_schedule.json`) including details such as the command, its arguments, scheduled time, and a generated unique ID.
  - When a scheduled time is reached (or the delay expires), the scheduler invokes the corresponding command using the same command processing logic as the primary CLI.
  - The scheduler operates either in the background (if the CLI is running continuously) or is triggered on-demand to execute due commands.

## Testing & Documentation
- **Unit Tests:** New tests will simulate scheduling scenarios, including adding, listing, and removing scheduled commands, as well as verifying that commands execute correctly when their scheduled time arrives.
- **Documentation:** The README and CLI usage guides will be updated with examples, such as:
  - `node src/lib/main.js --time now`
  - `node src/lib/main.js --time format "2023-10-07T12:00:00Z" "YYYY-MM-DD HH:mm:ss"`
  - `node src/lib/main.js --time schedule add "2023-10-07T15:00:00Z" "--sum" 3 4 5`
  - `node src/lib/main.js --time schedule list`
  - `node src/lib/main.js --time schedule remove 12345`

## Alignment with Repository Mission
By merging time utilities and command scheduling into a single, modular module, TIME_MANAGER enhances automation capabilities and promotes healthy collaboration. Users can not only perform standard time manipulations but also schedule tasks directly through the CLI, thereby streamlining workflows and reducing context switching.
