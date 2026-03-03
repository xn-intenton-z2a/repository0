# Comprehensive CLI Examples

This document provides extensive examples of **plot-code-lib** usage, organized by use case and complexity level. Each example includes the complete command and expected output description.

## Table of Contents

- [Getting Started](#getting-started)
- [Mathematical Functions](#mathematical-functions)
- [Scientific Applications](#scientific-applications)
- [Engineering Examples](#engineering-examples)
- [Parametric Curves](#parametric-curves)
- [Data Export Workflows](#data-export-workflows)
- [Advanced Techniques](#advanced-techniques)
- [Batch Processing](#batch-processing)
- [Troubleshooting Examples](#troubleshooting-examples)

---

## Getting Started

### Basic Function Plots

```bash
# Simple linear function
plot-code-lib plot -e "2*x + 1" -r "x=-5:5" -o linear.svg --title "Linear Function"

# Quadratic parabola
plot-code-lib plot -e "x^2" -r "x=-3:3" -o parabola.svg --title "Parabola y = x²"

# Cubic function
plot-code-lib plot -e "x^3 - 3*x^2 + 2*x + 1" -r "x=-2:4" -o cubic.svg --title "Cubic Polynomial"

# Square root
plot-code-lib plot -e "sqrt(x)" -r "x=0:25" -o square-root.svg --title "Square Root Function"

# Absolute value
plot-code-lib plot -e "abs(x)" -r "x=-10:10" -o absolute.svg --title "Absolute Value"
```

### Basic Trigonometry

```bash
# Standard sine wave
plot-code-lib plot -e "sin(x)" -r "x=0:2*pi" -o sine.svg --title "Sine Wave"

# Cosine with custom range  
plot-code-lib plot -e "cos(x)" -r "x=-pi:pi" -o cosine.svg --title "Cosine Wave"

# Tangent function (avoiding asymptotes)
plot-code-lib plot -e "tan(x)" -r "x=-pi/2+0.1:pi/2-0.1" -o tangent.svg --title "Tangent Function"

# Multiple periods
plot-code-lib plot -e "sin(x)" -r "x=0:4*pi:0.1" -o sine-multiple.svg --title "Sine - Multiple Periods"
```

---

## Mathematical Functions

### Exponential and Logarithmic

```bash
# Natural exponential
plot-code-lib plot -e "exp(x)" -r "x=-2:3" -o exponential.svg --title "Exponential Function eˣ"

# Exponential decay
plot-code-lib plot -e "exp(-x)" -r "x=0:5" -o exp-decay.svg --title "Exponential Decay e⁻ˣ"

# Natural logarithm
plot-code-lib plot -e "log(x)" -r "x=0.1:10" -o natural-log.svg --title "Natural Logarithm ln(x)"

# Base-10 logarithm  
plot-code-lib plot -e "log10(x)" -r "x=0.1:100" -o log10.svg --title "Common Logarithm log₁₀(x)"

# Base-2 logarithm
plot-code-lib plot -e "log2(x)" -r "x=0.1:16" -o log2.svg --title "Binary Logarithm log₂(x)"
```

### Hyperbolic Functions

```bash
# Hyperbolic sine
plot-code-lib plot -e "sinh(x)" -r "x=-3:3" -o sinh.svg --title "Hyperbolic Sine sinh(x)"

# Hyperbolic cosine (catenary)
plot-code-lib plot -e "cosh(x)" -r "x=-3:3" -o cosh.svg --title "Hyperbolic Cosine cosh(x)"

# Hyperbolic tangent (sigmoid-like)
plot-code-lib plot -e "tanh(x)" -r "x=-4:4" -o tanh.svg --title "Hyperbolic Tangent tanh(x)"

# Inverse hyperbolic sine
plot-code-lib plot -e "asinh(x)" -r "x=-5:5" -o asinh.svg --title "Inverse Hyperbolic Sine"

# Inverse hyperbolic cosine
plot-code-lib plot -e "acosh(x)" -r "x=1:5" -o acosh.svg --title "Inverse Hyperbolic Cosine"
```

### Piecewise and Conditional Functions

```bash
# Step function (Heaviside)
plot-code-lib plot -e "x >= 0 ? 1 : 0" -r "x=-3:3" -o heaviside.svg --title "Heaviside Step Function"

# Rectified linear unit (ReLU)
plot-code-lib plot -e "x > 0 ? x : 0" -r "x=-5:5" -o relu.svg --title "ReLU Activation Function"

# Piecewise quadratic
plot-code-lib plot -e "x < 0 ? x^2 : -x^2 + 2*x" -r "x=-3:3" -o piecewise-quad.svg --title "Piecewise Quadratic"

# Clamped function
plot-code-lib plot -e "x > 3 ? 3 : (x < -3 ? -3 : x)" -r "x=-5:5" -o clamped.svg --title "Clamped Linear Function"

# Triangular wave
plot-code-lib plot -e "abs(x - 2*floor(x/2 + 0.5))" -r "x=-5:5" -o triangular.svg --title "Triangular Wave"
```

---

## Scientific Applications

### Probability Distributions

```bash
# Standard normal distribution  
plot-code-lib plot -e "1/sqrt(2*pi) * exp(-0.5*x^2)" -r "x=-4:4" -o standard-normal.svg \
  --title "Standard Normal Distribution" --xlabel "Standard Deviations" --ylabel "Probability Density"

# Normal distribution with parameters (μ=2, σ=1.5)
plot-code-lib plot -e "1/(1.5*sqrt(2*pi)) * exp(-0.5*((x-2)/1.5)^2)" -r "x=-4:8" -o normal-custom.svg \
  --title "Normal Distribution (μ=2, σ=1.5)"

# Exponential distribution (λ=0.5)
plot-code-lib plot -e "x >= 0 ? 0.5 * exp(-0.5*x) : 0" -r "x=-1:10" -o exponential-dist.svg \
  --title "Exponential Distribution (λ=0.5)"

# Chi-squared distribution (k=3)
plot-code-lib plot -e "x > 0 ? x^(3/2-1) * exp(-x/2) / (2^(3/2) * 1.77245) : 0" -r "x=0:15" -o chi-squared.svg \
  --title "Chi-Squared Distribution (k=3)"

# Beta distribution approximation (α=2, β=3)
plot-code-lib plot -e "(x >= 0 and x <= 1) ? 12*x*(1-x)^2 : 0" -r "x=-0.2:1.2" -o beta-dist.svg \
  --title "Beta Distribution (α=2, β=3)"
```

### Wave Functions and Oscillations

```bash
# Damped harmonic oscillator
plot-code-lib plot -e "exp(-0.1*x) * cos(2*pi*x)" -r "x=0:20" -o damped-oscillator.svg \
  --title "Damped Harmonic Oscillator" --xlabel "Time" --ylabel "Amplitude"

# Beat frequency (interference pattern)
plot-code-lib plot -e "sin(10*x) + sin(12*x)" -r "x=0:4*pi" -o beat-frequency.svg \
  --title "Beat Frequency Pattern"

# AM modulation
plot-code-lib plot -e "(1 + 0.5*sin(2*x)) * sin(20*x)" -r "x=0:4*pi" -o am-modulation.svg \
  --title "Amplitude Modulation"

# FM modulation  
plot-code-lib plot -e "sin(20*x + 3*sin(2*x))" -r "x=0:4*pi:0.01" -o fm-modulation.svg \
  --title "Frequency Modulation"

# Gaussian pulse
plot-code-lib plot -e "exp(-(x-5)^2/2) * sin(10*x)" -r "x=0:10" -o gaussian-pulse.svg \
  --title "Gaussian Modulated Pulse"
```

### Quantum Mechanics Approximations

```bash
# Quantum harmonic oscillator ground state
plot-code-lib plot -e "exp(-0.5*x^2)" -r "x=-4:4" -o qho-ground.svg \
  --title "QHO Ground State Wavefunction"

# First excited state  
plot-code-lib plot -e "x * exp(-0.5*x^2)" -r "x=-4:4" -o qho-first.svg \
  --title "QHO First Excited State"

# Particle in a box (n=1)
plot-code-lib plot -e "(x >= 0 and x <= pi) ? sqrt(2/pi) * sin(x) : 0" -r "x=-1:4" -o particle-box-1.svg \
  --title "Particle in Box (n=1)"

# Tunneling barrier (simplified)
plot-code-lib plot -e "x < 0 ? exp(x) : (x < 2 ? exp(-x) : exp(-(x-2)))" -r "x=-3:5" -o tunneling.svg \
  --title "Quantum Tunneling (Simplified)"
```

---

## Engineering Examples

### Control Systems

```bash
# First-order step response (τ=2)
plot-code-lib plot -e "x >= 0 ? 1 - exp(-x/2) : 0" -r "x=-1:10" -o first-order-step.svg \
  --title "First Order Step Response (τ=2)" --xlabel "Time (s)" --ylabel "Output"

# Second-order underdamped (ζ=0.3, ωₙ=1)
plot-code-lib plot -e "x >= 0 ? 1 - exp(-0.3*x) * (cos(0.954*x) + 0.314*sin(0.954*x)) : 0" -r "x=0:15" -o second-order.svg \
  --title "Second Order Underdamped Response"

# PID controller output (simplified)
plot-code-lib plot -e "x + 0.1*x^2 + 10/x" -r "x=0.1:10" -o pid-response.svg \
  --title "PID Controller Response"

# Bode magnitude plot (1st order, fc=10 Hz)
plot-code-lib plot -e "20*log10(1/sqrt(1 + (x/10)^2))" -r "x=0.1:1000" -o bode-magnitude.svg \
  --title "Bode Magnitude Plot" --xlabel "Frequency (Hz)" --ylabel "Magnitude (dB)"

# Phase response  
plot-code-lib plot -e "-atan(x/10) * 180/pi" -r "x=0.1:1000" -o bode-phase.svg \
  --title "Bode Phase Plot" --xlabel "Frequency (Hz)" --ylabel "Phase (degrees)"
```

### Signal Processing

```bash
# Sinc function (sin(x)/x)
plot-code-lib plot -e "x != 0 ? sin(x)/x : 1" -r "x=-10*pi:10*pi" -o sinc.svg \
  --title "Sinc Function sin(x)/x"

# Digital filter impulse response (simple low-pass)
plot-code-lib plot -e "x >= 0 ? exp(-0.5*x) * sin(2*x) : 0" -r "x=-1:10" -o filter-impulse.svg \
  --title "Digital Filter Impulse Response"

# Window function (Hann/Hanning)
plot-code-lib plot -e "(x >= 0 and x <= 10) ? 0.5 * (1 - cos(2*pi*x/10)) : 0" -r "x=-2:12" -o hann-window.svg \
  --title "Hann Window Function"

# Raised cosine pulse  
plot-code-lib plot -e "(abs(x) <= 1) ? (1 + cos(pi*x))/2 : 0" -r "x=-2:2" -o raised-cosine.svg \
  --title "Raised Cosine Pulse"

# Chirp signal (linear frequency sweep)
plot-code-lib plot -e "sin(x^2)" -r "x=0:10:0.01" -o chirp.svg \
  --title "Linear Chirp Signal"
```

### Circuit Analysis

```bash
# RC charging curve (τ = RC = 1)
plot-code-lib plot -e "x >= 0 ? 1 - exp(-x) : 0" -r "x=-0.5:5" -o rc-charging.svg \
  --title "RC Circuit Charging (τ=1)" --xlabel "Time (τ)" --ylabel "Vc/V₀"

# LC oscillation (ω₀ = 1)  
plot-code-lib plot -e "x >= 0 ? cos(x) : 0" -r "x=-1:4*pi" -o lc-oscillation.svg \
  --title "LC Circuit Oscillation"

# RLC overdamped response (ζ=2)
plot-code-lib plot -e "x >= 0 ? 1 - exp(-x) - x*exp(-x) : 0" -r "x=-0.5:5" -o rlc-overdamped.svg \
  --title "RLC Overdamped Response"

# Voltage divider transfer function
plot-code-lib plot -e "1/(1 + x)" -r "x=0.01:100" -o voltage-divider.svg \
  --title "Voltage Divider Response"

# Diode I-V characteristic (simplified)
plot-code-lib plot -e "x > 0 ? exp(x*40) - 1 : -1e-12" -r "x=-0.1:1" -o diode-iv.svg \
  --title "Diode I-V Characteristic"
```

---

## Parametric Curves

### Basic Curves

```bash
# Unit circle
plot-code-lib parametric -x "cos(t)" -y "sin(t)" -r "t=0:2*pi" -o circle.svg \
  --title "Unit Circle"

# Ellipse (a=3, b=2)  
plot-code-lib parametric -x "3*cos(t)" -y "2*sin(t)" -r "t=0:2*pi" -o ellipse.svg \
  --title "Ellipse (a=3, b=2)"

# Figure-8 (Lissajous with 2:1 ratio)
plot-code-lib parametric -x "sin(t)" -y "sin(2*t)" -r "t=0:2*pi" -o figure-8.svg \
  --title "Figure-8 Curve"

# Spiral of Archimedes
plot-code-lib parametric -x "t*cos(t)" -y "t*sin(t)" -r "t=0:6*pi:0.1" -o archimedes-spiral.svg \
  --title "Spiral of Archimedes"

# Logarithmic spiral
plot-code-lib parametric -x "exp(0.1*t)*cos(t)" -y "exp(0.1*t)*sin(t)" -r "t=0:4*pi:0.1" -o log-spiral.svg \
  --title "Logarithmic Spiral"
```

### Mathematical Art

```bash
# Rose curve (5 petals)
plot-code-lib parametric -x "cos(5*t)*cos(t)" -y "cos(5*t)*sin(t)" -r "t=0:pi:0.01" -o rose-5.svg \
  --title "5-Petal Rose Curve"

# Rose curve (8 petals)  
plot-code-lib parametric -x "cos(4*t)*cos(t)" -y "cos(4*t)*sin(t)" -r "t=0:2*pi:0.01" -o rose-8.svg \
  --title "8-Petal Rose Curve"

# Heart curve (cardioid)
plot-code-lib parametric -x "16*sin(t)^3" -y "13*cos(t)-5*cos(2*t)-2*cos(3*t)-cos(4*t)" -r "t=0:2*pi:0.01" -o heart.svg \
  --title "Heart Curve (Cardioid)"

# Butterfly curve
plot-code-lib parametric \
  -x "sin(t)*(exp(cos(t))-2*cos(4*t)-sin(t/12)^5)" \
  -y "cos(t)*(exp(cos(t))-2*cos(4*t)-sin(t/12)^5)" \
  -r "t=0:12*pi:0.01" -o butterfly.svg --title "Butterfly Curve"

# Cycloid (wheel rolling)
plot-code-lib parametric -x "2*(t - sin(t))" -y "2*(1 - cos(t))" -r "t=0:4*pi:0.1" -o cycloid.svg \
  --title "Cycloid Curve"
```

### Lissajous Curves

```bash
# Classic 3:2 Lissajous
plot-code-lib parametric -x "sin(3*t)" -y "sin(2*t)" -r "t=0:2*pi:0.01" -o lissajous-3-2.svg \
  --title "Lissajous Curve (3:2)"

# 4:3 Lissajous with phase shift
plot-code-lib parametric -x "sin(4*t)" -y "sin(3*t + pi/4)" -r "t=0:2*pi:0.01" -o lissajous-4-3-phase.svg \
  --title "Lissajous Curve (4:3 with phase)"

# 5:4 Lissajous
plot-code-lib parametric -x "sin(5*t)" -y "sin(4*t)" -r "t=0:2*pi:0.01" -o lissajous-5-4.svg \
  --title "Lissajous Curve (5:4)"

# Damped Lissajous  
plot-code-lib parametric -x "exp(-0.1*t)*sin(3*t)" -y "exp(-0.1*t)*sin(2*t)" -r "t=0:4*pi:0.01" -o lissajous-damped.svg \
  --title "Damped Lissajous Curve"
```

### Hypotrochoids and Epitrochoids

```bash
# Simple hypotrochoid (R=5, r=3, d=2)
plot-code-lib parametric \
  -x "(5-3)*cos(t) + 2*cos((5-3)/3*t)" \
  -y "(5-3)*sin(t) - 2*sin((5-3)/3*t)" \
  -r "t=0:6*pi:0.01" -o hypotrochoid.svg \
  --title "Hypotrochoid (5,3,2)"

# Epitrochoid (R=3, r=1, d=2)
plot-code-lib parametric \
  -x "(3+1)*cos(t) - 2*cos((3+1)/1*t)" \
  -y "(3+1)*sin(t) - 2*sin((3+1)/1*t)" \
  -r "t=0:2*pi:0.01" -o epitrochoid.svg \
  --title "Epitrochoid (3,1,2)"

# Spirograph pattern
plot-code-lib parametric \
  -x "(7-3)*cos(t) + 2*cos((7-3)/3*t)" \
  -y "(7-3)*sin(t) - 2*sin((7-3)/3*t)" \
  -r "t=0:6*pi:0.01" -o spirograph.svg \
  --title "Spirograph Pattern"
```

---

## Data Export Workflows

### Format Comparisons

```bash
# Generate same data in different formats
EXPR="sin(x) + 0.1*cos(10*x)"
RANGE="x=0:2*pi:0.05"

# GeoJSON format (standard geographic format)
plot-code-lib export -e "$EXPR" -r "$RANGE" -o data.geojson --format geojson

# CSV format (spreadsheet compatible)
plot-code-lib export -e "$EXPR" -r "$RANGE" -o data.csv --format csv

# Simple JSON format  
plot-code-lib export -e "$EXPR" -r "$RANGE" -o data.json --format json
```

### Pipeline Processing

```bash
# Generate data and pipe to analysis tools
plot-code-lib export -e "random()" -r "x=1:1000:1" --format csv -o random-data.csv

# Statistical analysis with awk
cat random-data.csv | tail -n +2 | awk -F',' '{sum+=$2; n++} END {print "Mean:", sum/n}'

# Count data points with jq  
plot-code-lib export -e "sin(x)" -r "x=0:2*pi:0.1" --format json -o sine-data.json
cat sine-data.json | jq '.data | length'

# Extract Y values  
cat sine-data.json | jq '.data | map(.[1])'

# Find extrema
cat sine-data.json | jq '.data | map(.[1]) | max, min'
```

### Batch Data Generation

```bash
# Generate multiple datasets
FUNCTIONS=("sin(x)" "cos(x)" "tan(x)" "exp(-x)" "log(x+1)")
RANGE="x=0:2*pi:0.1"

for i in "${!FUNCTIONS[@]}"; do
  FUNC="${FUNCTIONS[$i]}"
  FILENAME="function-${i}.json"
  plot-code-lib export -e "$FUNC" -r "$RANGE" -o "$FILENAME" --format json
  echo "Generated: $FILENAME for function: $FUNC"
done
```

### Data Analysis Workflows

```bash
# Generate noisy sine wave
plot-code-lib export -e "sin(x) + 0.1*random()" -r "x=0:4*pi:0.1" --format csv -o noisy-sine.csv

# Calculate moving average with awk
awk -F',' 'BEGIN {window=5} NR>1 {
  values[NR-1] = $2; 
  if (NR-1 >= window) {
    sum = 0; 
    for (i=NR-window; i<=NR-1; i++) sum += values[i];
    print $1, sum/window
  }
}' noisy-sine.csv > smoothed-sine.dat

# FFT analysis simulation (frequency content)
plot-code-lib export -e "sin(2*pi*5*x) + 0.5*sin(2*pi*10*x)" -r "x=0:2:0.01" --format csv -o fft-test.csv

# Peak detection (simple threshold)
awk -F',' 'NR>1 {if ($2 > 0.8) print $1, $2}' fft-test.csv > peaks.dat
```

---

## Advanced Techniques

### High-Resolution Plots

```bash
# Ultra-high resolution for publication  
plot-code-lib plot -e "sin(x)*exp(-x/10)" -r "x=0:20:0.01" -o high-res.png \
  --width 3840 --height 2160 --title "4K Resolution Plot"

# Vector graphics for scalability
plot-code-lib plot -e "cos(5*x)*exp(-x/5)" -r "x=0:15:0.005" -o vector.svg \
  --width 1200 --height 800 --title "High-Detail Vector Plot"

# Fine detail capture
plot-code-lib plot -e "sin(50*x)*exp(-x)" -r "x=0:10:0.001" -o fine-detail.svg \
  --title "High-Frequency Detail Capture"
```

### Custom Styling

```bash
# Scientific paper style
plot-code-lib plot -e "log10(x)" -r "x=1:1000" -o scientific.svg \
  --title "Log-Scale Analysis" --xlabel "Input Parameter" --ylabel "log₁₀(Output)" \
  --width 1200 --height 800

# Engineering report style
plot-code-lib plot -e "1/(1 + (x/100)^2)" -r "x=1:10000" -o engineering.svg \
  --title "Frequency Response Analysis" --xlabel "Frequency (Hz)" --ylabel "Magnitude" \
  --width 1600 --height 900

# Presentation style (16:9)
plot-code-lib plot -e "sin(2*pi*x/5)*exp(-x/10)" -r "x=0:25" -o presentation.png \
  --title "Damped Oscillation Analysis" --width 1920 --height 1080
```

### Complex Mathematical Models

```bash
# Bifurcation diagram simulation (simplified logistic map)
plot-code-lib plot -e "3.8*x*(1-x)" -r "x=0:1:0.001" -o logistic-map.svg \
  --title "Logistic Map Dynamics"

# Strange attractor approximation
plot-code-lib parametric \
  -x "sin(1.1*t) + cos(1.3*t)" \
  -y "sin(1.2*t) + cos(1.4*t)" \
  -r "t=0:100:0.01" -o strange-attractor.svg \
  --title "Strange Attractor Approximation"

# Chaos theory - tent map
plot-code-lib plot -e "x < 0.5 ? 2*x : 2*(1-x)" -r "x=0:1:0.001" -o tent-map.svg \
  --title "Tent Map (Chaos Theory)"

# Fractal approximation (limited iterations)
plot-code-lib plot -e "sin(x) + sin(x/2) + sin(x/4) + sin(x/8)" -r "x=0:8*pi:0.01" -o fractal-approx.svg \
  --title "Fractal Function Approximation"
```

---

## Batch Processing

### Parametric Sweeps

```bash
# Frequency sweep for sine waves
mkdir -p frequency-sweep
for freq in 1 2 5 10 20 50; do
  plot-code-lib plot -e "sin(2*pi*${freq}*x)" -r "x=0:2" -o "frequency-sweep/sine-${freq}hz.svg" \
    --title "Sine Wave - ${freq} Hz" --xlabel "Time (s)" --ylabel "Amplitude"
done

# Damping coefficient sweep  
mkdir -p damping-sweep
for damping in 0.1 0.2 0.5 1.0 2.0 5.0; do
  plot-code-lib plot -e "exp(-${damping}*x)*sin(10*x)" -r "x=0:3" -o "damping-sweep/damped-${damping}.svg" \
    --title "Damped Oscillation (ζ=${damping})"
done

# Phase shift sweep for Lissajous
mkdir -p lissajous-sweep  
for phase in 0 0.5 1.0 1.57 2.0 3.14; do
  plot-code-lib parametric -x "sin(3*t)" -y "sin(2*t + ${phase})" -r "t=0:2*pi:0.01" \
    -o "lissajous-sweep/phase-${phase}.svg" --title "Lissajous (φ=${phase})"
done
```

### Animation Frame Generation

```bash
# Generate frames for sine wave animation
mkdir -p animation-frames
frame=0
for phase in $(seq 0 0.2 6.28); do
  frame_num=$(printf "%03d" $frame)
  plot-code-lib plot -e "sin(x + $phase)" -r "x=0:2*pi" -o "animation-frames/frame-${frame_num}.png" \
    --width 800 --height 600 --title "Animated Sine Wave"
  frame=$((frame + 1))
done

# Create video with ffmpeg (if available)
# ffmpeg -r 10 -i animation-frames/frame-%03d.png -pix_fmt yuv420p sine-animation.mp4
```

### Comparative Analysis

```bash
# Compare different window functions
mkdir -p window-functions
WINDOWS=(
  "1:Rectangular"
  "0.5*(1-cos(2*pi*x/10)):Hann"  
  "0.54-0.46*cos(2*pi*x/10):Hamming"
  "0.42-0.5*cos(2*pi*x/10)+0.08*cos(4*pi*x/10):Blackman"
)

for window_def in "${WINDOWS[@]}"; do
  IFS=':' read -r expr name <<< "$window_def"
  filename="window-functions/${name,,}.svg"
  plot-code-lib plot -e "(x >= 0 and x <= 10) ? $expr : 0" -r "x=-1:11" -o "$filename" \
    --title "$name Window Function"
done

# Compare different activation functions  
mkdir -p activation-functions
ACTIVATIONS=(
  "x:Linear"
  "x > 0 ? x : 0:ReLU"
  "1/(1 + exp(-x)):Sigmoid"  
  "tanh(x):Tanh"
  "x > 0 ? x : 0.01*x:LeakyReLU"
)

for activation_def in "${ACTIVATIONS[@]}"; do
  IFS=':' read -r expr name <<< "$activation_def"
  filename="activation-functions/${name,,}.svg"
  plot-code-lib plot -e "$expr" -r "x=-5:5" -o "$filename" \
    --title "$name Activation Function"
done
```

### Research Data Generation

```bash
# Generate datasets for different noise levels
mkdir -p noise-study
SIGNAL="sin(2*pi*x)"
NOISE_LEVELS=(0 0.05 0.1 0.2 0.5)

for noise in "${NOISE_LEVELS[@]}"; do
  # Generate data with noise
  plot-code-lib export -e "$SIGNAL + $noise*(random() - 0.5)" -r "x=0:2:0.01" \
    -o "noise-study/signal-noise-${noise}.csv" --format csv
  
  # Also generate plots
  plot-code-lib plot -e "$SIGNAL + $noise*(random() - 0.5)" -r "x=0:2:0.01" \
    -o "noise-study/plot-noise-${noise}.svg" --title "Signal with ${noise} Noise Level"
done
```

---

## Troubleshooting Examples

### Common Domain Issues

```bash
# Problem: Division by zero
# Wrong: This will skip the discontinuity
plot-code-lib plot -e "1/x" -r "x=-2:2:0.1" -o reciprocal-issue.svg

# Better: Avoid the singularity  
plot-code-lib plot -e "1/x" -r "x=-2:-0.1" -o reciprocal-left.svg
plot-code-lib plot -e "1/x" -r "x=0.1:2" -o reciprocal-right.svg

# Problem: Complex results from square root
# This automatically skips complex values
plot-code-lib plot -e "sqrt(x-1)" -r "x=-1:5" -o sqrt-domain-issue.svg

# Better: Explicit domain restriction
plot-code-lib plot -e "x >= 1 ? sqrt(x-1) : 0" -r "x=-1:5" -o sqrt-domain-fixed.svg
```

### Range and Resolution Issues

```bash
# Problem: Too few points for high-frequency function
plot-code-lib plot -e "sin(50*x)" -r "x=0:2:0.1" -o undersampled.svg

# Solution: Increase resolution (smaller step)
plot-code-lib plot -e "sin(50*x)" -r "x=0:2:0.01" -o properly-sampled.svg

# Problem: Too many points (performance/file size)
plot-code-lib plot -e "x^2" -r "x=0:100:0.001" -o too-many-points.svg

# Solution: Use appropriate resolution for function
plot-code-lib plot -e "x^2" -r "x=0:100:0.5" -o appropriate-resolution.svg
```

### Expression Syntax Errors

```bash
# Problem: Missing parentheses
# This will fail: plot-code-lib plot -e "sin(x + cos(x" -r "x=0:2*pi" -o error.svg

# Solution: Check parentheses matching
plot-code-lib plot -e "sin(x + cos(x))" -r "x=0:2*pi" -o fixed-parentheses.svg

# Problem: Undefined function
# This will fail: plot-code-lib plot -e "undefined_func(x)" -r "x=0:1" -o error.svg

# Solution: Use supported MathJS functions
plot-code-lib plot -e "sin(x)" -r "x=0:2*pi" -o supported-function.svg

# Problem: Invalid range syntax
# This will fail: plot-code-lib plot -e "sin(x)" -r "invalid_range" -o error.svg

# Solution: Use proper range format
plot-code-lib plot -e "sin(x)" -r "x=0:2*pi:0.1" -o valid-range.svg
```

### File Output Issues

```bash
# Problem: Permission denied
# Check directory permissions and use accessible path
plot-code-lib plot -e "sin(x)" -r "x=0:2*pi" -o "/tmp/test.svg"

# Problem: Invalid file extension  
# Ensure .svg or .png extension
plot-code-lib plot -e "sin(x)" -r "x=0:2*pi" -o "output.svg"  # ✓ Valid
plot-code-lib plot -e "sin(x)" -r "x=0:2*pi" -o "output.png"  # ✓ Valid

# Problem: Large PNG files
# Use SVG for vector graphics or reduce dimensions
plot-code-lib plot -e "sin(x)" -r "x=0:2*pi" -o "compact.svg" --width 800 --height 600
```

### Performance Optimization

```bash
# For high-frequency functions, balance resolution vs performance
plot-code-lib plot -e "sin(100*x)" -r "x=0:1:0.001" -o "high-freq-optimized.svg"

# For batch processing, use appropriate ranges
for i in {1..10}; do
  plot-code-lib plot -e "sin(${i}*x)" -r "x=0:2*pi:0.05" -o "batch-${i}.svg" --width 400 --height 300
done

# For very detailed plots, consider PNG format
plot-code-lib plot -e "sin(x) + 0.1*random()" -r "x=0:10:0.001" -o "detailed.png" --width 1920 --height 1080
```

---

This comprehensive CLI examples guide demonstrates the full power and flexibility of plot-code-lib across scientific, engineering, and mathematical applications. For more advanced usage, see the [API Documentation](api.md) and [Syntax Guide](SYNTAX.md).