CRON_ENGINE implementation notes

This module implements a synchronous cron parser and scheduler supporting 5-field and 6-field expressions, special macros, ranges, lists and steps. It uses local time semantics and provides deterministic Date outputs via toISOString() for tests.
