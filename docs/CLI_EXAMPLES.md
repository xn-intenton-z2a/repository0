# CLI Usage Examples

Comprehensive examples for using plot-code-lib from the command line.

## Quick Start Examples

### Basic Function Plotting

```bash
# Simple sine wave
plot-code-lib plot -e "sin(x)" -r "x=0:2*pi" -o sine.svg

# Quadratic function
plot-code-lib plot -e "x^2" -r "x=-3:3" -o parabola.png

# With custom title and labels
plot-code-lib plot -e "cos(x)" -r "x=-pi:pi" -o cosine.svg \
  --title "Cosine Function" --xlabel "Angle (rad)" --ylabel "Amplitude"
```

### Parametric Curves

```bash
# Unit circle
plot-code-lib parametric -x "cos(t)" -y "sin(t)" -r "t=0:2*pi" -o circle.svg

# Ellipse
plot-code-lib parametric -x "2*cos(t)" -y "sin(t)" -r "t=0:2*pi" -o ellipse.png

# Spiral with title
plot-code-lib parametric -x "t*cos(t)" -y "t*sin(t)" -r "t=0:4*pi" -o spiral.svg \
  --title "Archimedean Spiral"
```

## Mathematical Functions

### Polynomial Functions

```bash
# Linear function
plot-code-lib plot -e "2*x + 1" -r "x=-5:5" -o linear.svg \
  --title "Linear Function: f(x) = 2x + 1"

# Quadratic with vertex
plot-code-lib plot -e "x^2 - 4*x + 3" -r "x=-1:5" -o quadratic.svg \
  --title "Quadratic: f(x) = x² - 4x + 3"

# Cubic function
plot-code-lib plot -e "x^3 - 6*x^2 + 9*x + 1" -r "x=-2:5" -o cubic.svg \
  --title "Cubic Polynomial"

# Higher order polynomial
plot-code-lib plot -e "x^4 - 4*x^3 + 6*x^2 - 4*x + 1" -r "x=-1:3" -o quartic.svg \
  --title "Fourth Degree Polynomial"
```

### Trigonometric Functions

```bash
# Basic trigonometric functions
plot-code-lib plot -e "sin(x)" -r "x=0:4*pi" -o sine_extended.svg \
  --title "Sine Wave - Two Periods"

plot-code-lib plot -e "cos(x)" -r "x=0:4*pi" -o cosine_extended.svg \
  --title "Cosine Wave - Two Periods"

plot-code-lib plot -e "tan(x)" -r "x=-pi:pi:0.01" -o tangent.svg \
  --title "Tangent Function" --width 1200

# Trigonometric combinations
plot-code-lib plot -e "sin(x) + cos(2*x)" -r "x=0:4*pi" -o trig_combo.svg \
  --title "sin(x) + cos(2x)"

plot-code-lib plot -e "sin(3*x) * cos(x)" -r "x=0:4*pi" -o trig_product.svg \
  --title "sin(3x) × cos(x)"
```

### Inverse Trigonometric Functions

```bash
# Arcsine
plot-code-lib plot -e "asin(x)" -r "x=-1:1" -o arcsine.svg \
  --title "Arcsine Function" --ylabel "arcsin(x)"

# Arccosine
plot-code-lib plot -e "acos(x)" -r "x=-1:1" -o arccosine.svg \
  --title "Arccosine Function" --ylabel "arccos(x)"

# Arctangent
plot-code-lib plot -e "atan(x)" -r "x=-5:5" -o arctangent.svg \
  --title "Arctangent Function" --ylabel "arctan(x)"
```

### Exponential and Logarithmic Functions

```bash
# Natural exponential
plot-code-lib plot -e "exp(x)" -r "x=-2:3" -o exponential.svg \
  --title "Natural Exponential: e^x"

# Natural logarithm
plot-code-lib plot -e "log(x)" -r "x=0.1:10" -o natural_log.svg \
  --title "Natural Logarithm: ln(x)"

# Base-10 logarithm
plot-code-lib plot -e "log10(x)" -r "x=0.1:100" -o log10.svg \
  --title "Base-10 Logarithm: log₁₀(x)"

# Exponential decay
plot-code-lib plot -e "exp(-x)" -r "x=0:5" -o decay.svg \
  --title "Exponential Decay: e^(-x)"

# Gaussian function
plot-code-lib plot -e "exp(-x^2/2) / sqrt(2*pi)" -r "x=-4:4" -o gaussian.svg \
  --title "Standard Normal Distribution"
```

### Hyperbolic Functions

```bash
# Hyperbolic sine
plot-code-lib plot -e "sinh(x)" -r "x=-3:3" -o sinh.svg \
  --title "Hyperbolic Sine: sinh(x)"

# Hyperbolic cosine
plot-code-lib plot -e "cosh(x)" -r "x=-3:3" -o cosh.svg \
  --title "Hyperbolic Cosine: cosh(x)"

# Hyperbolic tangent
plot-code-lib plot -e "tanh(x)" -r "x=-5:5" -o tanh.svg \
  --title "Hyperbolic Tangent: tanh(x)"
```

## Advanced Mathematical Expressions

### Complex Function Combinations

```bash
# Damped oscillation
plot-code-lib plot -e "sin(5*x) * exp(-x/3)" -r "x=0:15" -o damped_oscillation.svg \
  --title "Damped Oscillation" --xlabel "Time" --ylabel "Amplitude"

# Beat frequency phenomenon
plot-code-lib plot -e "sin(10*x) + sin(10.5*x)" -r "x=0:10*pi" -o beats.svg \
  --title "Beat Frequency: sin(10x) + sin(10.5x)"

# Amplitude modulation
plot-code-lib plot -e "(1 + 0.5*cos(x)) * sin(10*x)" -r "x=0:8*pi" -o am_signal.svg \
  --title "Amplitude Modulated Signal"

# Frequency modulation
plot-code-lib plot -e "sin(10*x + 3*sin(x))" -r "x=0:8*pi" -o fm_signal.svg \
  --title "Frequency Modulated Signal"
```

### Mathematical Special Functions

```bash
# Sinc function
plot-code-lib plot -e "x == 0 ? 1 : sin(pi*x)/(pi*x)" -r "x=-5:5:0.05" -o sinc.svg \
  --title "Sinc Function: sin(πx)/(πx)"

# Error function approximation
plot-code-lib plot -e "2/sqrt(pi) * (x - x^3/3 + x^5/10 - x^7/42)" -r "x=-2:2" -o erf_approx.svg \
  --title "Error Function Approximation"

# Sigmoid/Logistic function
plot-code-lib plot -e "1 / (1 + exp(-x))" -r "x=-6:6" -o sigmoid.svg \
  --title "Sigmoid Function: 1/(1+e^(-x))"
```

### Piecewise Functions

```bash
# Step function
plot-code-lib plot -e "x >= 0 ? 1 : 0" -r "x=-2:2:0.01" -o step_function.svg \
  --title "Unit Step Function"

# Absolute value function
plot-code-lib plot -e "x >= 0 ? x : -x" -r "x=-5:5" -o absolute_value.svg \
  --title "Absolute Value: |x|"

# Piecewise linear function
plot-code-lib plot -e "x < -1 ? -1 : x > 1 ? 1 : x" -r "x=-3:3" -o clamp.svg \
  --title "Clamping Function"

# Sawtooth wave
plot-code-lib plot -e "x - floor(x)" -r "x=0:5:0.01" -o sawtooth.svg \
  --title "Sawtooth Wave"
```

## Parametric Curves

### Basic Geometric Shapes

```bash
# Circle with custom radius
plot-code-lib parametric -x "3*cos(t)" -y "3*sin(t)" -r "t=0:2*pi" -o circle_r3.svg \
  --title "Circle (radius = 3)"

# Ellipse
plot-code-lib parametric -x "4*cos(t)" -y "2*sin(t)" -r "t=0:2*pi" -o ellipse_4x2.svg \
  --title "Ellipse (a=4, b=2)"

# Figure-eight
plot-code-lib parametric -x "sin(t)" -y "sin(2*t)" -r "t=0:2*pi" -o figure_eight.svg \
  --title "Figure Eight: Lissajous 1:2"
```

### Spirals

```bash
# Archimedean spiral
plot-code-lib parametric -x "t*cos(t)" -y "t*sin(t)" -r "t=0:6*pi:0.01" -o archimedes_spiral.svg \
  --title "Archimedean Spiral"

# Logarithmic spiral
plot-code-lib parametric -x "exp(t/10)*cos(t)" -y "exp(t/10)*sin(t)" -r "t=0:4*pi" -o log_spiral.svg \
  --title "Logarithmic Spiral"

# Hyperbolic spiral
plot-code-lib parametric -x "cos(t)/t" -y "sin(t)/t" -r "t=0.1:10*pi" -o hyperbolic_spiral.svg \
  --title "Hyperbolic Spiral"
```

### Rose Curves

```bash
# 3-petaled rose
plot-code-lib parametric -x "cos(3*t)*cos(t)" -y "cos(3*t)*sin(t)" -r "t=0:pi" -o rose_3.svg \
  --title "3-Petaled Rose"

# 4-petaled rose
plot-code-lib parametric -x "cos(2*t)*cos(t)" -y "cos(2*t)*sin(t)" -r "t=0:2*pi" -o rose_4.svg \
  --title "4-Petaled Rose"

# 5-petaled rose
plot-code-lib parametric -x "cos(5*t)*cos(t)" -y "cos(5*t)*sin(t)" -r "t=0:pi" -o rose_5.svg \
  --title "5-Petaled Rose"

# 8-petaled rose
plot-code-lib parametric -x "cos(4*t)*cos(t)" -y "cos(4*t)*sin(t)" -r "t=0:2*pi" -o rose_8.svg \
  --title "8-Petaled Rose"
```

### Lissajous Curves

```bash
# Simple Lissajous curves
plot-code-lib parametric -x "sin(2*t)" -y "sin(3*t)" -r "t=0:2*pi" -o lissajous_2_3.svg \
  --title "Lissajous 2:3"

plot-code-lib parametric -x "sin(3*t)" -y "sin(4*t)" -r "t=0:2*pi" -o lissajous_3_4.svg \
  --title "Lissajous 3:4"

plot-code-lib parametric -x "sin(5*t)" -y "sin(6*t)" -r "t=0:2*pi" -o lissajous_5_6.svg \
  --title "Lissajous 5:6"

# Lissajous with phase shift
plot-code-lib parametric -x "sin(2*t)" -y "sin(3*t + pi/4)" -r "t=0:2*pi" -o lissajous_phase.svg \
  --title "Lissajous with Phase Shift"
```

### Exotic Parametric Curves

```bash
# Cardioid
plot-code-lib parametric -x "(1+cos(t))*cos(t)" -y "(1+cos(t))*sin(t)" -r "t=0:2*pi" -o cardioid.svg \
  --title "Cardioid"

# Epicycloid
plot-code-lib parametric -x "5*cos(t) - cos(5*t)" -y "5*sin(t) - sin(5*t)" -r "t=0:2*pi" -o epicycloid.svg \
  --title "Epicycloid"

# Hypocycloid (Astroid)
plot-code-lib parametric -x "cos(t)^3" -y "sin(t)^3" -r "t=0:2*pi" -o astroid.svg \
  --title "Astroid (4-cusped hypocycloid)"

# Butterfly curve
plot-code-lib parametric \
  -x "sin(t) * (exp(cos(t)) - 2*cos(4*t) - sin(t/12)^5)" \
  -y "cos(t) * (exp(cos(t)) - 2*cos(4*t) - sin(t/12)^5)" \
  -r "t=0:12*pi:0.01" -o butterfly.svg \
  --title "Butterfly Curve"

# Heart curve
plot-code-lib parametric \
  -x "16*sin(t)^3" \
  -y "13*cos(t) - 5*cos(2*t) - 2*cos(3*t) - cos(4*t)" \
  -r "t=0:2*pi" -o heart.svg \
  --title "Heart Curve"
```

## Scientific and Engineering Applications

### Signal Processing

```bash
# Square wave approximation (Fourier series)
plot-code-lib plot -e "sin(x) + sin(3*x)/3 + sin(5*x)/5 + sin(7*x)/7" -r "x=0:4*pi" -o square_approx.svg \
  --title "Square Wave Approximation (4 terms)"

# Chirp signal (frequency sweep)
plot-code-lib plot -e "sin(x^2)" -r "x=0:10" -o chirp.svg \
  --title "Chirp Signal" --xlabel "Time" --ylabel "Amplitude"

# Envelope detection
plot-code-lib plot -e "abs(sin(20*x) * cos(x))" -r "x=0:8*pi" -o envelope.svg \
  --title "Envelope Detection"

# Low-pass filter response
plot-code-lib plot -e "1 / sqrt(1 + (x/100)^2)" -r "x=1:1000" -o lowpass_response.svg \
  --title "Low-pass Filter Response" --xlabel "Frequency (Hz)" --ylabel "Magnitude"
```

### Physics and Engineering

```bash
# Projectile motion
plot-code-lib parametric -x "10*t" -y "10*t - 4.9*t^2" -r "t=0:2.04" -o projectile.svg \
  --title "Projectile Motion" --xlabel "Distance (m)" --ylabel "Height (m)"

# Simple harmonic motion
plot-code-lib plot -e "cos(2*pi*t)" -r "t=0:3" -o shm.svg \
  --title "Simple Harmonic Motion" --xlabel "Time (s)" --ylabel "Position"

# Damped harmonic oscillator
plot-code-lib plot -e "exp(-0.1*t) * cos(2*pi*t)" -r "t=0:20" -o damped_oscillator.svg \
  --title "Damped Harmonic Oscillator" --xlabel "Time (s)" --ylabel "Amplitude"

# LC circuit response
plot-code-lib plot -e "cos(t/sqrt(2)) * exp(-t/10)" -r "t=0:20" -o lc_response.svg \
  --title "LC Circuit Step Response"
```

### Probability and Statistics

```bash
# Normal distribution (various σ)
plot-code-lib plot -e "exp(-x^2/2) / sqrt(2*pi)" -r "x=-4:4" -o normal_1.svg \
  --title "Standard Normal (σ=1)"

plot-code-lib plot -e "exp(-x^2/8) / sqrt(8*pi)" -r "x=-6:6" -o normal_2.svg \
  --title "Normal Distribution (σ=2)"

# Exponential distribution
plot-code-lib plot -e "2*exp(-2*x)" -r "x=0:5" -o exponential_dist.svg \
  --title "Exponential Distribution (λ=2)" --xlabel "x" --ylabel "f(x)"

# Poisson approximation to normal
plot-code-lib plot -e "exp(-(x-5)^2/10) / sqrt(10*pi)" -r "x=0:10" -o poisson_normal.svg \
  --title "Normal Approximation to Poisson"
```

## Artistic and Creative Applications

### Mathematical Art

```bash
# Polar rose variations
plot-code-lib parametric -x "sin(6*t)*cos(t)" -y "sin(6*t)*sin(t)" -r "t=0:pi" -o art_rose.svg \
  --title "Artistic Rose Pattern"

# Interference patterns
plot-code-lib plot -e "sin(x) + sin(sqrt(2)*x)" -r "x=0:50" -o interference.svg \
  --title "Wave Interference Pattern"

# Fractal-like curve
plot-code-lib parametric -x "sin(t) + sin(3*t)/2 + sin(5*t)/3" -y "cos(t) + cos(3*t)/2 + cos(5*t)/3" \
  -r "t=0:2*pi" -o fractal_like.svg --title "Fractal-like Curve"
```

### Creative Patterns

```bash
# Star patterns
plot-code-lib parametric -x "(2 + cos(5*t)) * cos(t)" -y "(2 + cos(5*t)) * sin(t)" \
  -r "t=0:2*pi" -o star_pattern.svg --title "Star Pattern"

# Celtic knot approximation
plot-code-lib parametric -x "cos(t) + cos(3*t)/3" -y "sin(t) + sin(3*t)/3" \
  -r "t=0:2*pi" -o celtic.svg --title "Celtic Knot Pattern"
```

## Output Format Options

### High Resolution Plots

```bash
# Large format SVG
plot-code-lib plot -e "sin(x)" -r "x=0:2*pi:0.001" -o high_res.svg \
  --width 1920 --height 1080 --title "High Resolution Plot"

# Publication quality PNG
plot-code-lib plot -e "exp(-x^2/2)" -r "x=-3:3:0.01" -o publication.png \
  --width 1600 --height 1200 --title "Publication Quality Gaussian"
```

### Custom Styling

```bash
# Custom axis labels
plot-code-lib plot -e "sin(2*pi*x)" -r "x=0:2" -o custom_labels.svg \
  --title "Sine Wave - Two Cycles" \
  --xlabel "Time (seconds)" \
  --ylabel "Signal Amplitude (V)"

# Scientific notation friendly
plot-code-lib plot -e "exp(-x^2/(2*0.5^2))" -r "x=-2:2" -o scientific.svg \
  --title "Gaussian Distribution" \
  --xlabel "Standard Deviations (σ)" \
  --ylabel "Probability Density"
```

## Batch Processing Examples

### Multiple Related Plots

```bash
#!/bin/bash
# Generate multiple trigonometric functions

functions=("sin(x)" "cos(x)" "tan(x)")
names=("sine" "cosine" "tangent")

for i in "${!functions[@]}"; do
  plot-code-lib plot -e "${functions[$i]}" -r "x=-pi:pi" \
    -o "${names[$i]}.svg" --title "${names[$i]} Function"
done
```

### Parameter Sweeps

```bash
#!/bin/bash
# Generate Lissajous curves with different frequency ratios

for a in 1 2 3 4; do
  for b in 1 2 3 4; do
    plot-code-lib parametric -x "sin(${a}*t)" -y "sin(${b}*t)" \
      -r "t=0:2*pi" -o "lissajous_${a}_${b}.svg" \
      --title "Lissajous ${a}:${b}"
  done
done
```

### Complex Expression Generation

```bash
#!/bin/bash
# Generate polynomial series

for degree in 2 3 4 5; do
  case $degree in
    2) expr="x^2 - 1" ;;
    3) expr="x^3 - 3*x" ;;
    4) expr="x^4 - 6*x^2 + 1" ;;
    5) expr="x^5 - 10*x^3 + 5*x" ;;
  esac
  
  plot-code-lib plot -e "$expr" -r "x=-2:2" \
    -o "polynomial_degree_${degree}.svg" \
    --title "Degree ${degree} Polynomial"
done
```

This comprehensive collection of examples demonstrates the full capabilities of plot-code-lib for mathematical visualization, scientific computing, and creative applications.