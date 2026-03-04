# TIME_SERIES_GENERATION

Summary

Generate time series (ordered numeric samples) from an expression evaluator and a specified numeric range. This module produces point arrays consumable by plotting and rendering components.

Motivation

Plotting requires deterministic sampling of the independent variable. A dedicated generator that accepts a parsed expression plus range and sampling parameters ensures consistent, testable outputs for both CLI and programmatic usage.

Scope

- Accept an evaluator (from the expression parser) and a range specification for the independent variable in the form start:end or start:end:count semantics.
- Support explicit step or implicit count; default sampling should be a sensible default (for example 200 samples) while allowing user override.
- Produce an array of point objects with numeric x and y values and preserve ordering.
- Validate and clamp invalid ranges (start equals end, reversed ranges) and surface errors for invalid configurations.

Implementation notes

- Place generation logic as a reusable function in src/lib/main.js or src/lib/generator.js, returning an array of {x, y}.
- Ensure evaluation exceptions are handled so a single bad x value does not crash the whole generation; instead, propagate an error or mark points as NaN depending on the chosen behaviour, but document the choice and tests.

Files to modify

- src/lib/main.js (or new src/lib/generator.js)
- tests/unit/generator.test.js
- README.md example usage showing range syntax and the generated sample count

Acceptance criteria

- Given evaluator and range 0:1 with count 11, generator returns 11 ordered points with x values from 0 to 1 inclusive.
- Given a step-based range start:step:end the generator uses the step to compute samples and includes both endpoints when aligned.
- The generator defaults to a sensible sample count if neither step nor count is provided.
- Tests include: uniform sampling verification, reversed range handling, start==end handling, numeric accuracy checks for a simple function like y=x.

Test cases (examples)

- Range 0:1:11 with evaluator y=x should yield x values [0,0.1,0.2,...,1.0] and y matching x.
- Range 1:0:5 should produce 5 samples in descending order consistent with start> end behaviour or produce a well-documented error.
- Range 0:0 should produce a single sample at x=0 when semantics demand it.

Notes

Keep generation deterministic and free of side effects to make unit tests reliable and fast.