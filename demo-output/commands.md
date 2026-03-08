# plot-code-lib Demo Commands

This file contains all the commands used to generate the demo output.
Copy and paste any command to reproduce the results.

## Basic Function Plots

plot-code-lib plot -e "sin(x)" -r "x=0:2*pi" -o demo-output/sine-wave.svg --title "Sine Wave"
plot-code-lib plot -e "x^2 - 4*x + 3" -r "x=-1:5" -o demo-output/quadratic.svg --title "Quadratic Function" --xlabel "x" --ylabel "f(x)"
plot-code-lib plot -e "exp(x)" -r "x=0:3" -o demo-output/exponential-growth.svg --title "Exponential Growth"
plot-code-lib plot -e "exp(-x)" -r "x=0:5" -o demo-output/exponential-decay.svg --title "Exponential Decay"
plot-code-lib plot -e "log(x)" -r "x=0.1:10" -o demo-output/logarithmic.svg --title "Natural Logarithm" --xlabel "x" --ylabel "ln(x)"

## Trigonometric and Multi-Expression Plots

plot-code-lib plot -e "sin(x),cos(x),tan(x)" -r "x=-pi:pi" -o demo-output/trig-comparison.svg --title "Trigonometric Functions"
plot-code-lib plot -e "Phase 0:sin(x),Phase π/4:sin(x+pi/4),Phase π/2:sin(x+pi/2)" -r "x=0:2*pi" -o demo-output/phase-shifts.svg --title "Phase Shift Comparison"
plot-code-lib plot -e "Linear:x,Quadratic:x^2,Cubic:x^3,Quartic:x^4" -r "x=-2:2" -o demo-output/polynomial-comparison.svg --title "Polynomial Degrees"
plot-code-lib plot -e "1Hz:sin(2*pi*x),2Hz:sin(4*pi*x),5Hz:sin(10*pi*x)" -r "x=0:2" -o demo-output/frequency-comparison.svg --title "Frequency Comparison"
plot-code-lib plot -e "Growth:exp(x),Decay:exp(-x)" -r "x=0:3" -o demo-output/exponential-family.svg --title "Exponential Family"
plot-code-lib plot -e "sin(5*x) * exp(-x/3)" -r "x=0:15:0.1" -o demo-output/damped-oscillation.svg --title "Damped Oscillation"
plot-code-lib plot -e "(1 + sin(10*x)) * sin(x)" -r "x=0:4*pi" -o demo-output/amplitude-modulation.svg --title "Amplitude Modulation"

## Parametric Curves (Mathematical Art)

plot-code-lib parametric -x "cos(t)" -y "sin(t)" -r "t=0:2*pi" -o demo-output/unit-circle.svg --title "Unit Circle"
plot-code-lib parametric -x "16*sin(t)^3" -y "13*cos(t)-5*cos(2*t)-2*cos(3*t)-cos(4*t)" -r "t=0:2*pi" -o demo-output/heart-curve.svg --title "Heart Curve"
plot-code-lib parametric -x "sin(3*t)" -y "sin(2*t)" -r "t=0:2*pi" -o demo-output/lissajous-3-2.svg --title "Lissajous Curve 3:2"
plot-code-lib parametric -x "cos(5*t)*cos(t)" -y "cos(5*t)*sin(t)" -r "t=0:pi" -o demo-output/rose-curve.svg --title "Rose Curve"
plot-code-lib parametric -x "t*cos(t)" -y "t*sin(t)" -r "t=0:6*pi:0.1" -o demo-output/spiral-archimedes.svg --title "Archimedes Spiral"
plot-code-lib parametric -x "sin(t)*(exp(cos(t))-2*cos(4*t)-sin(t/12)^5)" -y "cos(t)*(exp(cos(t))-2*cos(4*t)-sin(t/12)^5)" -r "t=0:12*pi:0.1" -o demo-output/butterfly-curve.svg --title "Butterfly Curve"

## Scientific & Engineering Applications

plot-code-lib plot -e "exp(-x^2/2) / sqrt(2*pi)" -r "x=-4:4" -o demo-output/gaussian-distribution.svg --title "Standard Normal Distribution"
plot-code-lib plot -e "1/(1 + exp(-x))" -r "x=-6:6" -o demo-output/sigmoid-function.svg --title "Sigmoid Function"
plot-code-lib plot -e "sin(x) + sin(3*x)/3 + sin(5*x)/5 + sin(7*x)/7" -r "x=-pi:pi" -o demo-output/fourier-approximation.svg --title "Square Wave Fourier Series"
plot-code-lib plot -e "1 - exp(-t/2)" -r "t=0:10" -o demo-output/step-response.svg --title "First-Order Step Response" --xlabel "Time" --ylabel "Response"
plot-code-lib plot -e "1 / sqrt(1 + (x/2)^2)" -r "x=0.1:10" -o demo-output/frequency-response.svg --title "Lowpass Filter Response" --xlabel "ω/ω₀" --ylabel "|H(jω)|"
plot-code-lib plot -e "sin(x)/x" -r "x=-20:20:0.1" -o demo-output/bessel-function.svg --title "Sinc Function (J₀ approximation)"

## High-Resolution Examples

plot-code-lib plot -e "sin(x)*cos(3*x)" -r "x=0:2*pi" -o demo-output/publication-ready.png --width 1920 --height 1080 --title "High Resolution Plot"
plot-code-lib plot -e "x^3 - 3*x^2 + 2*x + 1" -r "x=-2:3" -o demo-output/poster-quality.png --width 3840 --height 2160 --title "Ultra High Resolution"

## Data Export Examples

plot-code-lib export -e "sin(x)" -r "x=0:2*pi:0.1" -o demo-output/sine-data.json --format json
plot-code-lib export -e "sin(x),cos(x),tan(x)" -r "x=0:2*pi:0.1" -o demo-output/trig-data.csv --format csv
plot-code-lib export -e "cos(t),sin(t)" -r "t=0:2*pi:0.1" -o demo-output/parametric-data.geojson --format geojson
plot-code-lib export -e "Exponential:exp(x),Logarithmic:log(x+1),Polynomial:x^3" -r "x=0:5:0.1" -o demo-output/analysis-data.json --format json

## Usage Tips

1. **Modify expressions**: Change the math functions to explore different curves
2. **Adjust ranges**: Try different x/t ranges and step sizes for resolution
3. **Custom styling**: Add titles, axis labels, and dimensions
4. **Format selection**: Choose SVG for web/print, PNG for presentations
5. **Data processing**: Export to JSON/CSV for analysis pipelines

## Next Steps

- Combine with other CLI tools: `jq`, `awk`, `gnuplot`
- Use in shell scripts for batch processing
- Integrate into data analysis workflows
- Create animation frames with parameter sweeps
