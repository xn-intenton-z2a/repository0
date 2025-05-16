# TICK_LABELS

Provide numeric tick labels on Cartesian and polar plots to enhance interpretability by annotating axis and angle/radius graduations.

# CLI INTEGRATION

Add two new integer flags --xticks and --yticks on the plot and polar commands specifying the number of tick marks on the X and Y axes for Cartesian plots or angular and radial ticks for polar plots. When provided, the CLI will render numeric labels at each tick position. If omitted, default automatic tick count is used. Introduce a boolean flag --no-tick-labels to suppress all numeric labels when desired.

# HTTP ENDPOINT SUPPORT

Extend the /plot and /polar HTTP endpoints to accept optional query parameters xticks, yticks, and tickLabels (true or false). When xticks or yticks are present, the server will generate and include numeric labels at each tick. When tickLabels=false, labels are suppressed even if ticks are drawn. Default behavior remains unlabeled ticks for backward compatibility.

# IMPLEMENTATION NOTES

Modify generatePlotSVG and generatePolarSVG signatures to accept xticks (number), yticks (number), and tickLabels (boolean).

For Cartesian plots:
  - Divide the viewBox X and Y ranges into xticks and yticks intervals.
  - Draw major tick lines at calculated positions on each axis if ticks are enabled.
  - Append <text> elements at each tick with appropriate numeric value, horizontally centered for X-axis and right-aligned for Y-axis.
  - Use strokeColor for text fill and default font size.

For polar plots:
  - For angle ticks, divide the angle-range into xticks steps, draw radial tick lines from center, and place numeric degree labels at the outer radius, rotated to align tangentially.
  - For radial ticks, divide the radius-range into yticks steps, draw concentric circles, and place numeric distance labels along the rightmost point of each circle.

Update the CLI parser in sandbox/source/main.js to parse --xticks and --yticks as integers and --no-tick-labels to set tickLabels=false. Validate that xticks and yticks are positive integers.

Extend HTTP handlers in sandbox/source/main.js for /plot and /polar to read params.get('xticks'), params.get('yticks'), and params.get('tickLabels'), parse values, apply validation, and pass them to the SVG generators.

Add unit tests in sandbox/tests/cli-interface.test.js to verify that SVG output contains correctly positioned <text> elements for axis labels and that invalid flag values result in errors.

Add integration tests in sandbox/tests/data-export.test.js to verify that HTTP /plot and /polar endpoints include numeric tick labels when xticks and yticks are specified and omit them when tickLabels=false.

Update documentation in sandbox/docs/CLI_USAGE.md, sandbox/docs/HTTP_SERVER.md, and top-level README.md with examples showing usage of xticks, yticks, and tickLabels parameters.