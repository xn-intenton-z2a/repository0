# repository0

_"Be a go-to plot library with a CLI, be the jq of formulae visualisations."_

**plot-code-lib** is a JavaScript library and CLI tool designed to:
- Transform and given range and a simple expression syntax for (pick an existing open standard) to time series data.
- Read and write the time series data in a standard format (pick an existing open standard).
- Make use of libraries for formula parsing, time series generation, plotting, and persistence in image formats.
- Generate SVG and PNG plots from the time series data and save these as files.
- Variations on this example: `node run start -- --expression "y=sin(x)" --range "x=-1:-1,y=-1:-1" --file output.svg` .
- Showcase all the features of the library via a CLI by dry running tp generate example commands and output in the README.md file.

`plot-code-lib` facilitate the creation of plots from mathematical expressions and time series data. It will take a
mathematical expression and a range of values and generate a plot in SVG or PNG format.
