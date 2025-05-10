# Overview

Add support for customizing the appearance of generated SVG plots through new CLI flags. Users can specify stroke color, stroke width, fill color, background color, and SVG dimensions to tailor plots to their requirements.

# CLI Usage

- --stroke-color <css-color>    Set the stroke color for the plot path. Accepts any valid CSS color value. Defaults to #000.
- --stroke-width <number>       Set the stroke width for plot lines in pixels. Must be a positive number. Defaults to 2.
- --fill-color <css-color>      Set the fill color for areas under curves or closed shapes. Defaults to none.
- --background-color <css-color> Set the background rectangle color behind the plot. Defaults to transparent.
- --width <number>              Set the width attribute of the SVG in pixels. Must be a positive integer. Defaults to 800.
- --height <number>             Set the height attribute of the SVG in pixels. Must be a positive integer. Defaults to 600.

# Source File Changes

Modify src/lib/main.js to:

1. Extend argument parsing to recognize stroke-color, stroke-width, fill-color, background-color, width, and height flags.
2. Validate numeric flags (stroke-width, width, height) are positive. On invalid values exit with code 1 and descriptive error.
3. Pass style parameters into the SVG generation logic:
   - Include width and height attributes on the <svg> root element.
   - If background-color is provided, render a <rect> behind the plot covering the full SVG area.
   - Apply stroke-color and stroke-width to the <path> element generating the plot line.
   - Apply fill-color to the <path> or supplementary <polygon> element when set.
4. Ensure existing plot data generation remains unchanged when style flags are omitted.

# Tests

Add sandbox/tests/style-plot.test.js with tests that:

- Invoke main with expression or function flags combined with style flags and assert the output SVG has width and height attributes matching provided values.
- Assert that the <path> element includes the provided stroke-color and stroke-width attributes.
- Assert that background <rect> is present and has the provided fill color when background-color is specified.
- Test that omitting style flags results in defaults (width 800, height 600, stroke #000, stroke-width 2, no fill or background rect).
- Test invalid numeric or color inputs result in exit code 1 and descriptive error messages.

# Documentation

Update README.md to:

- Document all new style-related CLI flags with descriptions and default values.
- Provide example commands demonstrating custom stroke color, width, fill, background, and SVG dimensions.
- Show snippets of SVG output highlighting new attributes.