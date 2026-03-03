# Mathematical Expression Syntax Reference

Complete guide to mathematical expressions supported by plot-code-lib.

## Overview

plot-code-lib uses [Math.js](https://mathjs.org/) for expression parsing, providing comprehensive mathematical functionality with intuitive syntax.

## Basic Operators

| Operator | Description | Example | Result |
|----------|-------------|---------|--------|
| `+` | Addition | `x + 2` | Sum |
| `-` | Subtraction | `x - 1` | Difference |
| `*` | Multiplication | `2 * x` | Product |
| `/` | Division | `x / 3` | Quotient |
| `^` | Exponentiation | `x^2` | Power |
| `%` | Modulo | `x % 2` | Remainder |

## Functions

### Trigonometric Functions

| Function | Description | Domain | Range |
|----------|-------------|--------|-------|
| `sin(x)` | Sine | All real numbers | [-1, 1] |
| `cos(x)` | Cosine | All real numbers | [-1, 1] |
| `tan(x)` | Tangent | x ≠ π/2 + nπ | All real numbers |
| `asin(x)` | Arcsine | [-1, 1] | [-π/2, π/2] |
| `acos(x)` | Arccosine | [-1, 1] | [0, π] |
| `atan(x)` | Arctangent | All real numbers | (-π/2, π/2) |
| `atan2(y, x)` | Two-argument arctangent | All real numbers | [-π, π] |

**Examples:**
```bash
# Basic trigonometric functions
plot-code-lib plot -e "sin(x)" -r "x=0:2*pi" -o sine.svg
plot-code-lib plot -e "cos(x) + sin(2*x)" -r "x=0:4*pi" -o trig_combo.svg

# Inverse trigonometric functions
plot-code-lib plot -e "asin(x)" -r "x=-1:1" -o arcsine.svg
plot-code-lib plot -e "atan(x)" -r "x=-5:5" -o arctangent.svg
```

### Hyperbolic Functions

| Function | Description | Domain | Range |
|----------|-------------|--------|-------|
| `sinh(x)` | Hyperbolic sine | All real numbers | All real numbers |
| `cosh(x)` | Hyperbolic cosine | All real numbers | [1, ∞) |
| `tanh(x)` | Hyperbolic tangent | All real numbers | (-1, 1) |
| `asinh(x)` | Inverse hyperbolic sine | All real numbers | All real numbers |
| `acosh(x)` | Inverse hyperbolic cosine | [1, ∞) | [0, ∞) |
| `atanh(x)` | Inverse hyperbolic tangent | (-1, 1) | All real numbers |

**Examples:**
```bash
# Hyperbolic functions
plot-code-lib plot -e "sinh(x)" -r "x=-3:3" -o sinh.svg
plot-code-lib plot -e "tanh(x)" -r "x=-5:5" -o tanh.svg
```

### Exponential and Logarithmic Functions

| Function | Description | Domain | Range |
|----------|-------------|--------|-------|
| `exp(x)` | Natural exponential (e^x) | All real numbers | (0, ∞) |
| `log(x)` | Natural logarithm | (0, ∞) | All real numbers |
| `log10(x)` | Base-10 logarithm | (0, ∞) | All real numbers |
| `log2(x)` | Base-2 logarithm | (0, ∞) | All real numbers |
| `pow(x, y)` | Power function (x^y) | Depends on y | Varies |

**Examples:**
```bash
# Exponential functions
plot-code-lib plot -e "exp(x)" -r "x=-2:3" -o exponential.svg
plot-code-lib plot -e "exp(-x^2/2)" -r "x=-3:3" -o gaussian.svg

# Logarithmic functions  
plot-code-lib plot -e "log(x)" -r "x=0.1:10" -o logarithm.svg
plot-code-lib plot -e "log10(x)" -r "x=0.1:100" -o log10.svg
```

### Root and Power Functions

| Function | Description | Domain | Range |
|----------|-------------|--------|-------|
| `sqrt(x)` | Square root | [0, ∞) | [0, ∞) |
| `cbrt(x)` | Cube root | All real numbers | All real numbers |
| `nthRoot(x, n)` | nth root | Depends on n | Varies |

**Examples:**
```bash
# Root functions
plot-code-lib plot -e "sqrt(x)" -r "x=0:10" -o square_root.svg
plot-code-lib plot -e "cbrt(x)" -r "x=-8:8" -o cube_root.svg
```

### Rounding and Utility Functions

| Function | Description | Example |
|----------|-------------|---------|
| `round(x)` | Round to nearest integer | `round(3.7)` → 4 |
| `floor(x)` | Round down | `floor(3.7)` → 3 |
| `ceil(x)` | Round up | `ceil(3.2)` → 4 |
| `abs(x)` | Absolute value | `abs(-5)` → 5 |
| `sign(x)` | Sign function | `sign(-3)` → -1 |
| `max(a, b, ...)` | Maximum value | `max(2, 5, 1)` → 5 |
| `min(a, b, ...)` | Minimum value | `min(2, 5, 1)` → 1 |

**Examples:**
```bash
# Utility functions
plot-code-lib plot -e "abs(x)" -r "x=-5:5" -o absolute.svg
plot-code-lib plot -e "sign(x)" -r "x=-3:3" -o sign.svg
plot-code-lib plot -e "floor(x)" -r "x=-3:3:0.1" -o floor.svg
```

## Mathematical Constants

| Constant | Value | Description |
|----------|-------|-------------|
| `pi` | 3.14159... | Pi (π) |
| `e` | 2.71828... | Euler's number |
| `phi` | 1.61803... | Golden ratio |
| `tau` | 6.28318... | Tau (2π) |

**Examples:**
```bash
# Using constants
plot-code-lib plot -e "sin(pi * x)" -r "x=0:4" -o sine_pi.svg
plot-code-lib plot -e "exp(-x) / e" -r "x=0:5" -o exp_normalized.svg
plot-code-lib plot -e "cos(tau * x)" -r "x=0:2" -o cosine_tau.svg
```

## Complex Expressions

### Function Composition

```bash
# Nested functions
plot-code-lib plot -e "sin(cos(x))" -r "x=0:2*pi" -o nested_trig.svg
plot-code-lib plot -e "exp(sin(x))" -r "x=0:4*pi" -o exp_sin.svg
plot-code-lib plot -e "log(abs(x) + 1)" -r "x=-5:5" -o log_abs.svg
```

### Polynomial Expressions

```bash
# Linear
plot-code-lib plot -e "2*x + 1" -r "x=-5:5" -o linear.svg

# Quadratic
plot-code-lib plot -e "x^2 - 4*x + 3" -r "x=-1:5" -o quadratic.svg

# Cubic
plot-code-lib plot -e "x^3 - 6*x^2 + 9*x + 1" -r "x=-2:5" -o cubic.svg

# Higher order
plot-code-lib plot -e "x^4 - 4*x^3 + 6*x^2 - 4*x + 1" -r "x=-1:3" -o quartic.svg
```

### Piecewise Functions

Math.js supports conditional expressions using ternary operators:

```bash
# Step function
plot-code-lib plot -e "x >= 0 ? 1 : 0" -r "x=-2:2" -o step.svg

# Absolute value (alternative)
plot-code-lib plot -e "x >= 0 ? x : -x" -r "x=-5:5" -o abs_alt.svg

# Piecewise linear
plot-code-lib plot -e "x < 0 ? -x : x < 2 ? x : 2" -r "x=-3:4" -o piecewise.svg
```

### Oscillations and Waves

```bash
# Damped oscillation
plot-code-lib plot -e "sin(5*x) * exp(-x/3)" -r "x=0:15" -o damped.svg

# Beat frequency
plot-code-lib plot -e "sin(10*x) + sin(10.5*x)" -r "x=0:20*pi" -o beats.svg

# Amplitude modulation
plot-code-lib plot -e "(1 + 0.5*cos(x)) * sin(10*x)" -r "x=0:4*pi" -o am.svg

# Frequency modulation
plot-code-lib plot -e "sin(10*x + 2*sin(x))" -r "x=0:4*pi" -o fm.svg
```

## Parametric Expressions

For parametric plots, both x and y expressions use the same parameter variable.

### Geometric Curves

```bash
# Circle
plot-code-lib parametric -x "cos(t)" -y "sin(t)" -r "t=0:2*pi" -o circle.svg

# Ellipse  
plot-code-lib parametric -x "3*cos(t)" -y "2*sin(t)" -r "t=0:2*pi" -o ellipse.svg

# Spiral
plot-code-lib parametric -x "t*cos(t)" -y "t*sin(t)" -r "t=0:4*pi" -o spiral.svg
```

### Mathematical Curves

```bash
# Lissajous curves
plot-code-lib parametric -x "sin(3*t)" -y "sin(2*t)" -r "t=0:2*pi" -o lissajous_3_2.svg
plot-code-lib parametric -x "sin(5*t)" -y "sin(4*t)" -r "t=0:2*pi" -o lissajous_5_4.svg

# Rose curves
plot-code-lib parametric -x "cos(5*t)*cos(t)" -y "cos(5*t)*sin(t)" -r "t=0:2*pi" -o rose_5.svg

# Cardioid
plot-code-lib parametric -x "(1+cos(t))*cos(t)" -y "(1+cos(t))*sin(t)" -r "t=0:2*pi" -o cardioid.svg

# Epicycloid
plot-code-lib parametric -x "5*cos(t) - cos(5*t)" -y "5*sin(t) - sin(5*t)" -r "t=0:2*pi" -o epicycloid.svg
```

### Complex Parametric Functions

```bash
# Butterfly curve
plot-code-lib parametric \
  -x "sin(t) * (exp(cos(t)) - 2*cos(4*t) - sin(t/12)^5)" \
  -y "cos(t) * (exp(cos(t)) - 2*cos(4*t) - sin(t/12)^5)" \
  -r "t=0:12*pi" -o butterfly.svg

# Heart curve
plot-code-lib parametric \
  -x "16*sin(t)^3" \
  -y "13*cos(t) - 5*cos(2*t) - 2*cos(3*t) - cos(4*t)" \
  -r "t=0:2*pi" -o heart.svg
```

## Advanced Techniques

### Multi-parameter Expressions

While individual plots use single variables, you can create complex behaviors:

```bash
# Frequency sweep
plot-code-lib plot -e "sin(x^2)" -r "x=0:10" -o chirp.svg

# Envelope functions
plot-code-lib plot -e "sin(x) / (1 + x^2)" -r "x=-10:10" -o envelope.svg
```

### Scientific Functions

```bash
# Error function approximation
plot-code-lib plot -e "2/sqrt(pi) * (x - x^3/3 + x^5/10)" -r "x=-2:2" -o erf_approx.svg

# Sinc function
plot-code-lib plot -e "x == 0 ? 1 : sin(pi*x)/(pi*x)" -r "x=-5:5" -o sinc.svg

# Gaussian distribution
plot-code-lib plot -e "exp(-x^2/2) / sqrt(2*pi)" -r "x=-4:4" -o normal.svg
```

### Expression Validation

Invalid expressions will produce clear error messages:

```bash
# Syntax errors
plot-code-lib plot -e "sin(" -r "x=0:1" -o error.svg
# Error: Parenthesis ) expected

# Undefined functions
plot-code-lib plot -e "undefined_func(x)" -r "x=0:1" -o error.svg  
# Error: Undefined symbol undefined_func

# Domain errors handled gracefully
plot-code-lib plot -e "log(x)" -r "x=-1:1" -o log.svg
# Invalid points (x <= 0) automatically skipped
```

## Performance Tips

### Optimal Expression Structure

```bash
# Efficient: pre-compute constants
plot-code-lib plot -e "sin(3.14159*x)" -r "x=0:4" -o efficient.svg

# Better: use built-in constants
plot-code-lib plot -e "sin(pi*x)" -r "x=0:4" -o better.svg

# Avoid: repeated complex calculations
plot-code-lib plot -e "sin(sqrt(2)*pi*x)" -r "x=0:4" -o slower.svg
```

### Range Optimization

```bash
# High resolution for smooth curves
plot-code-lib plot -e "sin(x)" -r "x=0:2*pi:0.01" -o smooth.svg

# Lower resolution for faster generation
plot-code-lib plot -e "sin(x)" -r "x=0:2*pi:0.1" -o fast.svg
```

This comprehensive syntax reference enables you to create sophisticated mathematical visualizations using plot-code-lib's expression system.