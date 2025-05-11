# Equation Plotter CLI Usage

This tool generates SVG plots for quadratic and sine functions from the command line.

## CLI Options

--type <quadratic|sine>    (required)
--a <number>               coefficient a for quadratic (default: 1)
--b <number>               coefficient b for quadratic (default: 0)
--c <number>               coefficient c for quadratic (default: 0)
--amplitude <number>       amplitude for sine (default: 1)
--frequency <number>       frequency for sine (default: 1)
--phase <number>           phase offset for sine in radians (default: 0)
--output <file>            write SVG output to the specified file (otherwise prints to stdout)
--mission                  Print the project mission statement (contents of MISSION.md) and exit.

## Examples

Generate a quadratic plot and save to `plot.svg`:
```
node sandbox/source/main.js --type quadratic --a 1 --b 0 --c 0 --output plot.svg
```

Generate a sine wave with custom amplitude/frequency and print SVG to console:
```
node sandbox/source/main.js --type sine --amplitude 2 --frequency 0.5
```

Print the project mission statement:
```
node sandbox/source/main.js --mission
```
