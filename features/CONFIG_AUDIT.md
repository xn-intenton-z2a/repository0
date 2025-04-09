# CONFIG_AUDIT

## Overview
This feature consolidates runtime configuration management with persistent audit logging into a single, self-contained module. The CONFIG_AUDIT feature allows users to both inspect and modify key tool settings (such as NaN handling and punctuation trimming) and review a persistent log of all CLI invocations. By merging these administrative capabilities, the repository streamlines operational monitoring and troubleshooting, reinforcing our mission of promoting healthy collaboration and automated transparency.

## CLI Integration
- **Configuration Commands:**
  - `--config` displays current CLI settings including tool version, environment variables (INVALID_TOKENS, TOKEN_PUNCTUATION_CONFIG, ALLOW_NAN, etc.), and inline flags status.
  - `--toggle-allow-nan` dynamically toggles the global ALLOW_NAN setting.
- **Audit Commands:**
  - Every command execution is logged with metadata (command, cleansed input, timestamp, execution duration, and status).
  - An optional command such as `--history` (if provided) can output the audit log in a user-friendly format.
- **Output Modes:**
  - Supports standard text mode and global JSON modes (via `--json` and `--json-pretty`), ensuring that both configuration reports and audit logs include contextual metadata for machine integration.

## Implementation Details
- **Configuration Management:**
  - Reads and displays environment variables and runtime flags relevant to numeric parsing and CLI behavior.
  - Provides dynamic toggling with immediate effect on numeric processing and error reporting.
- **Audit Logging:**
  - Integrates a persistent logging mechanism that appends each command’s execution details (including warnings and metadata) to a local audit log file.
  - Ensures that log retrieval issues do not disrupt the primary command processing.
- **Error Handling & Security:**
  - Clear error messages are provided if configuration data is missing or if auditing encounters file access issues.
  - Both components honor the global JSON output mode while maintaining clear separation between operational logs and command results.

## Testing & Documentation
- **Unit Tests:**
  - New tests will ensure that configuration outputs correctly reflect environment and runtime toggles.
  - Audit tests verify that correct metadata is logged for every command invocation and that optional log retrieval works as intended.
- **Documentation:**
  - The README and CLI user guide will be updated to describe the merged CONFIG_AUDIT functionality with examples for each command.
  - Inline source code comments clearly document the combined logic.

## Alignment with Repository Mission
Consolidating configuration management with audit logging in the CONFIG_AUDIT feature reinforces our commitment to transparency and ease of use. This integrated approach aids both end-users and developers by simplifying operational control and historical review of CLI interactions, aligning with our mission to enable streamlined automation and healthy collaborative practices.