sandbox/docs/USAGE.md
# sandbox/docs/USAGE.md
# Usage Guide

## Running the Demo

To run the demo, execute:

    npm run start

### Behavior:

- When executed **without any arguments**, the demo will display ASCII-based plots:
  - **Quadratic Plot:** Displays a plot for the function y = x².
  - **Sine Plot:** Displays a plot for the function y = sin(x).

- When executed **with arguments**, the script will output the provided arguments as a JSON-formatted string.

## Examples

### Without Arguments

    $ npm run start

    Quadratic Plot: y = x^2
    x= -5 y=25 | *****
    x= -4 y=16 | ****
    x= -3 y= 9 | ***
    x= -2 y= 4 | *
    x= -1 y= 1 | 
    x=  0 y= 0 | 
    x=  1 y= 1 | 
    x=  2 y= 4 | *
    x=  3 y= 9 | ***
    x=  4 y=16 | ****
    x=  5 y=25 | *****

    Sine Plot: y = sin(x)
    x= -10 y=-0.54 | ******
    x= -9  y=-0.41 | ********
    x= -8  y=-0.99 | ****
    ...

### With Arguments

    $ npm run start hello world
    Run with: ["hello","world"]
