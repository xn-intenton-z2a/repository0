# Mathematical Expression Syntax Guide

**plot-code-lib** uses MathJS syntax for maximum compatibility and mathematical power. This guide covers all supported functions, operators, and expression patterns.

## Table of Contents

- [Basic Syntax](#basic-syntax)
- [Arithmetic Operators](#arithmetic-operators)  
- [Mathematical Functions](#mathematical-functions)
- [Constants](#constants)
- [Conditional Expressions](#conditional-expressions)
- [Complex Expressions](#complex-expressions)
- [Domain Considerations](#domain-considerations)
- [Performance Tips](#performance-tips)

---

## Basic Syntax

### Variables

Use single letters or descriptive names for variables:

```bash
# Standard function variable
plot-code-lib plot -e "sin(x)" -r "x=0:2*pi" -o sine.svg

# Parametric parameter
plot-code-lib parametric -x "cos(t)" -y "sin(t)" -r "t=0:2*pi" -o circle.svg

# Custom variable names  
plot-code-lib plot -e "sin(theta)" -r "theta=0:2*pi" -o sine-theta.svg
```

### Function Composition

Functions can be nested and combined freely:

```bash
# Nested functions
plot-code-lib plot -e "sin(cos(x))" -r "x=0:2*pi" -o nested.svg

# Function chains  
plot-code-lib plot -e "sqrt(abs(sin(x)))" -r "x=-2*pi:2*pi" -o chain.svg

# Multiple operations
plot-code-lib plot -e "exp(-x) * sin(5*x)" -r "x=0:3" -o damped.svg
```

---

## Arithmetic Operators

### Basic Arithmetic

| Operator | Description | Example | Result |
|----------|-------------|---------|---------|
| `+` | Addition | `x + 2` | Add 2 to x |
| `-` | Subtraction | `x - 1` | Subtract 1 from x |
| `*` | Multiplication | `2 * x` | Multiply x by 2 |
| `/` | Division | `x / 3` | Divide x by 3 |
| `^` | Exponentiation | `x^2` | x squared |
| `%` | Modulo | `x % 2*pi` | x modulo 2π |

### Operator Precedence

MathJS follows standard mathematical precedence:

1. **Parentheses**: `()`
2. **Exponentiation**: `^`  
3. **Multiplication/Division**: `*`, `/`
4. **Addition/Subtraction**: `+`, `-`

```bash
# Precedence examples
plot-code-lib plot -e "2 + 3 * x^2" -r "x=-2:2" -o precedence.svg    # = 2 + (3 * (x^2))
plot-code-lib plot -e "(2 + 3) * x^2" -r "x=-2:2" -o parentheses.svg # = 5 * (x^2)
```

---

## Mathematical Functions

### Trigonometric Functions

#### Basic Trigonometry
```bash
# Sine, cosine, tangent
plot-code-lib plot -e "sin(x)" -r "x=0:2*pi" -o sine.svg
plot-code-lib plot -e "cos(x)" -r "x=0:2*pi" -o cosine.svg  
plot-code-lib plot -e "tan(x)" -r "x=-pi/2+0.1:pi/2-0.1" -o tangent.svg

# Secant, cosecant, cotangent
plot-code-lib plot -e "sec(x)" -r "x=-pi/2+0.1:pi/2-0.1" -o secant.svg
plot-code-lib plot -e "csc(x)" -r "x=0.1:pi-0.1" -o cosecant.svg
plot-code-lib plot -e "cot(x)" -r "x=0.1:pi-0.1" -o cotangent.svg
```

#### Inverse Trigonometry
```bash
# Arc functions (return angles)
plot-code-lib plot -e "asin(x)" -r "x=-1:1" -o arcsine.svg
plot-code-lib plot -e "acos(x)" -r "x=-1:1" -o arccosine.svg
plot-code-lib plot -e "atan(x)" -r "x=-5:5" -o arctangent.svg

# Two-argument arctangent
plot-code-lib plot -e "atan2(x, 1)" -r "x=-5:5" -o atan2.svg
```

#### Hyperbolic Functions
```bash
# Hyperbolic functions
plot-code-lib plot -e "sinh(x)" -r "x=-3:3" -o sinh.svg
plot-code-lib plot -e "cosh(x)" -r "x=-3:3" -o cosh.svg
plot-code-lib plot -e "tanh(x)" -r "x=-3:3" -o tanh.svg

# Inverse hyperbolic
plot-code-lib plot -e "asinh(x)" -r "x=-5:5" -o asinh.svg
plot-code-lib plot -e "acosh(x)" -r "x=1:5" -o acosh.svg
plot-code-lib plot -e "atanh(x)" -r "x=-0.99:0.99" -o atanh.svg
```

### Exponential and Logarithmic Functions

```bash
# Exponential functions
plot-code-lib plot -e "exp(x)" -r "x=-2:2" -o exponential.svg
plot-code-lib plot -e "expm1(x)" -r "x=-1:1" -o expm1.svg         # exp(x) - 1

# Logarithmic functions  
plot-code-lib plot -e "log(x)" -r "x=0.1:10" -o natural-log.svg   # Natural logarithm
plot-code-lib plot -e "log10(x)" -r "x=0.1:100" -o log10.svg      # Base-10 logarithm
plot-code-lib plot -e "log2(x)" -r "x=0.1:16" -o log2.svg         # Base-2 logarithm
plot-code-lib plot -e "log1p(x)" -r "x=0:2" -o log1p.svg          # log(1 + x)
```

### Power and Root Functions

```bash
# Square roots and cube roots
plot-code-lib plot -e "sqrt(x)" -r "x=0:25" -o square-root.svg
plot-code-lib plot -e "cbrt(x)" -r "x=-8:8" -o cube-root.svg

# nth roots
plot-code-lib plot -e "nthRoot(x, 3)" -r "x=-8:8" -o nth-root.svg
plot-code-lib plot -e "x^(1/3)" -r "x=0:8" -o fractional-power.svg

# Power functions
plot-code-lib plot -e "x^2" -r "x=-3:3" -o quadratic.svg
plot-code-lib plot -e "x^3" -r "x=-2:2" -o cubic.svg
plot-code-lib plot -e "x^0.5" -r "x=0:10" -o half-power.svg
```

### Utility Functions

```bash
# Absolute value and sign
plot-code-lib plot -e "abs(x)" -r "x=-5:5" -o absolute.svg
plot-code-lib plot -e "sign(x)" -r "x=-5:5" -o sign.svg

# Rounding functions
plot-code-lib plot -e "ceil(x)" -r "x=-3:3" -o ceiling.svg         # Round up
plot-code-lib plot -e "floor(x)" -r "x=-3:3" -o floor.svg         # Round down  
plot-code-lib plot -e "round(x)" -r "x=-3:3" -o round.svg         # Round nearest
plot-code-lib plot -e "fix(x)" -r "x=-3:3" -o fix.svg             # Round toward zero

# Min/max functions
plot-code-lib plot -e "min(x, 2)" -r "x=-1:5" -o min-function.svg
plot-code-lib plot -e "max(x, 0)" -r "x=-2:3" -o max-function.svg
```

### Special Functions

```bash
# Factorial (integer inputs)
plot-code-lib plot -e "factorial(x)" -r "x=0:10:1" -o factorial.svg

# Greatest common divisor / Least common multiple
plot-code-lib plot -e "gcd(x, 6)" -r "x=1:20:1" -o gcd.svg
plot-code-lib plot -e "lcm(x, 6)" -r "x=1:20:1" -o lcm.svg

# Random function (different each time)
plot-code-lib plot -e "random()" -r "x=1:100:1" -o random.svg
plot-code-lib plot -e "random() * x" -r "x=0:10" -o random-scale.svg
```

---

## Constants

### Mathematical Constants

| Constant | Description | Approximate Value |
|----------|-------------|-------------------|
| `pi` | π (pi) | 3.14159... |
| `e` | Euler's number | 2.71828... |  
| `phi` | Golden ratio | 1.61803... |
| `tau` | 2π | 6.28318... |

```bash
# Using constants in expressions
plot-code-lib plot -e "sin(2*pi*x)" -r "x=0:2" -o sine-2hz.svg
plot-code-lib plot -e "exp(-x/e)" -r "x=0:10" -o exp-decay.svg
plot-code-lib plot -e "phi^x" -r "x=-2:3" -o golden-ratio.svg
plot-code-lib plot -e "cos(tau*x)" -r "x=0:1" -o tau-period.svg
```

### Mathematical Constants (Advanced)

| Constant | Description | Value |
|----------|-------------|-------|
| `LN2` | ln(2) | 0.69314... |
| `LN10` | ln(10) | 2.30258... |  
| `LOG2E` | log₂(e) | 1.44269... |
| `LOG10E` | log₁₀(e) | 0.43429... |
| `SQRT1_2` | √(1/2) | 0.70710... |
| `SQRT2` | √2 | 1.41421... |

```bash
# Using advanced constants
plot-code-lib plot -e "x * LN2" -r "x=0:10" -o ln2-scaling.svg
plot-code-lib plot -e "SQRT2 * sin(x)" -r "x=0:2*pi" -o sqrt2-amplitude.svg
```

### Complex Numbers

```bash
# Imaginary unit (results may be filtered for real plots)
plot-code-lib plot -e "i^x" -r "x=0:4" -o imaginary-power.svg

# Complex expressions (real parts plotted)
plot-code-lib plot -e "real(exp(i*x))" -r "x=0:2*pi" -o euler-real.svg
plot-code-lib plot -e "imag(exp(i*x))" -r "x=0:2*pi" -o euler-imag.svg
```

---

## Conditional Expressions

### Ternary Operator

Use `condition ? valueIfTrue : valueIfFalse` for piecewise functions:

```bash
# Absolute value using conditional
plot-code-lib plot -e "x >= 0 ? x : -x" -r "x=-5:5" -o abs-conditional.svg

# Step function
plot-code-lib plot -e "x > 0 ? 1 : 0" -r "x=-2:2" -o step-function.svg

# Piecewise quadratic
plot-code-lib plot -e "x < 0 ? x^2 : -x^2" -r "x=-3:3" -o piecewise-quad.svg

# Clamped function
plot-code-lib plot -e "x > 2 ? 2 : (x < -2 ? -2 : x)" -r "x=-5:5" -o clamped.svg
```

### Comparison Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `<` | Less than | `x < 0` |
| `<=` | Less than or equal | `x <= 1` |
| `>` | Greater than | `x > 2` |  
| `>=` | Greater than or equal | `x >= -1` |
| `==` | Equal to | `x == 0` |
| `!=` | Not equal to | `x != 1` |

### Logical Operators

```bash
# AND operator
plot-code-lib plot -e "(x > -1) and (x < 1) ? x^2 : 0" -r "x=-3:3" -o windowed.svg

# OR operator  
plot-code-lib plot -e "(x < -1) or (x > 1) ? 1 : 0" -r "x=-3:3" -o outside-window.svg

# NOT operator
plot-code-lib plot -e "not(x == 0) ? sin(x)/x : 1" -r "x=-5:5" -o sinc-safe.svg
```

---

## Complex Expressions

### Function Composition

```bash
# Deeply nested functions
plot-code-lib plot -e "sin(cos(tan(x)))" -r "x=-pi:pi" -o deep-nested.svg

# Multiple function calls
plot-code-lib plot -e "sin(x) * cos(x) * tan(x/2)" -r "x=0.1:pi-0.1" -o trig-product.svg

# Function of functions
plot-code-lib plot -e "exp(sin(x)) + log(cos(x) + 2)" -r "x=0:pi/2" -o exp-sin-log-cos.svg
```

### Mathematical Series

```bash
# Taylor series approximations
plot-code-lib plot -e "x - x^3/6 + x^5/120" -r "x=-3:3" -o sine-taylor.svg

# Fourier series (square wave approximation)
plot-code-lib plot -e "sin(x) + sin(3*x)/3 + sin(5*x)/5 + sin(7*x)/7" -r "x=0:2*pi" -o fourier-square.svg

# Geometric series
plot-code-lib plot -e "1 + x + x^2 + x^3 + x^4 + x^5" -r "x=-0.9:0.9" -o geometric-series.svg
```

### Scientific Formulas

```bash
# Gaussian/Normal distribution
plot-code-lib plot -e "1/sqrt(2*pi) * exp(-0.5*x^2)" -r "x=-4:4" -o gaussian.svg

# Sigmoid function (logistic)
plot-code-lib plot -e "1/(1 + exp(-x))" -r "x=-6:6" -o sigmoid.svg

# Logistic growth model
plot-code-lib plot -e "100/(1 + 99*exp(-0.3*x))" -r "x=0:20" -o logistic-growth.svg

# Damped harmonic oscillator
plot-code-lib plot -e "exp(-0.1*x) * cos(2*pi*x)" -r "x=0:20" -o damped-oscillator.svg

# Black body radiation (Wien's law approximation)
plot-code-lib plot -e "x^3 / (exp(x) - 1)" -r "x=0.1:10" -o planck-distribution.svg
```

### Engineering Applications

```bash
# RC circuit step response  
plot-code-lib plot -e "1 - exp(-x/2.2)" -r "x=0:10" -o rc-step-response.svg

# RLC circuit natural response
plot-code-lib plot -e "exp(-x) * (cos(3*x) + sin(3*x)/3)" -r "x=0:5" -o rlc-response.svg

# Frequency response magnitude
plot-code-lib plot -e "1/sqrt(1 + (x/10)^2)" -r "x=0.1:100" -o frequency-response.svg

# Bode plot phase
plot-code-lib plot -e "atan(-x/10) * 180/pi" -r "x=0.1:100" -o bode-phase.svg
```

---

## Domain Considerations

### Function Domains

Many functions have restricted domains. plot-code-lib automatically skips invalid points:

```bash
# Square root - negative inputs skipped
plot-code-lib plot -e "sqrt(x)" -r "x=-2:10" -o sqrt-domain.svg

# Logarithm - non-positive inputs skipped  
plot-code-lib plot -e "log(x)" -r "x=-1:10" -o log-domain.svg

# Inverse trig - inputs outside [-1,1] skipped
plot-code-lib plot -e "asin(x)" -r "x=-2:2" -o asin-domain.svg

# Division by zero - infinite results skipped
plot-code-lib plot -e "1/x" -r "x=-2:2" -o reciprocal.svg

# Tangent near asymptotes
plot-code-lib plot -e "tan(x)" -r "x=-2*pi:2*pi" -o tangent-full.svg
```

### Handling Discontinuities

```bash
# Step functions with discontinuities
plot-code-lib plot -e "floor(x)" -r "x=-3:3" -o floor-steps.svg

# Functions with vertical asymptotes
plot-code-lib plot -e "1/(x-1)" -r "x=-1:3" -o vertical-asymptote.svg

# Piecewise continuous
plot-code-lib plot -e "x < 0 ? x^2 : sqrt(x)" -r "x=-2:4" -o piecewise-continuous.svg
```

### Complex Number Filtering

Complex results are automatically filtered out for real-valued plots:

```bash
# Complex results from negative square roots are skipped
plot-code-lib plot -e "sqrt(x-2)" -r "x=-1:5" -o complex-filtered.svg

# Complex logarithms filtered
plot-code-lib plot -e "log(x)" -r "x=-2:2" -o log-complex-filtered.svg

# Complex powers
plot-code-lib plot -e "(-1)^x" -r "x=0:4" -o complex-power.svg
```

---

## Performance Tips

### Optimizing Step Sizes

Choose appropriate step sizes for your functions:

```bash
# High-frequency functions need small steps
plot-code-lib plot -e "sin(50*x)" -r "x=0:1:0.001" -o high-freq-fine.svg

# Smooth, low-frequency functions can use larger steps  
plot-code-lib plot -e "x^2" -r "x=-10:10:0.5" -o quadratic-coarse.svg

# Oscillatory functions need steps smaller than period
plot-code-lib plot -e "sin(x)" -r "x=0:2*pi:0.1" -o sine-adequate.svg
plot-code-lib plot -e "sin(x)" -r "x=0:2*pi:1" -o sine-too-coarse.svg
```

### Function Complexity

Simple expressions evaluate faster:

```bash
# Fast: polynomial
plot-code-lib plot -e "x^3 - 2*x^2 + x - 1" -r "x=-2:2" -o poly-fast.svg

# Moderate: trigonometric
plot-code-lib plot -e "sin(x) + cos(2*x)" -r "x=0:2*pi" -o trig-moderate.svg

# Slower: nested transcendental
plot-code-lib plot -e "exp(sin(log(x+1)))" -r "x=0:10" -o nested-slow.svg
```

### Memory Considerations

Large ranges with small steps create many points:

```bash
# Reasonable: ~1000 points
plot-code-lib plot -e "sin(x)" -r "x=0:10:0.01" -o reasonable.svg

# Large: ~100,000 points (slower but detailed)
plot-code-lib plot -e "sin(100*x)" -r "x=0:10:0.0001" -o very-detailed.svg

# Consider PNG for complex plots with many points
plot-code-lib plot -e "random()*sin(100*x)" -r "x=0:10:0.0001" -o complex.png
```

---

This comprehensive syntax guide covers all aspects of mathematical expression writing in plot-code-lib. For more examples, see the [CLI Examples](CLI_EXAMPLES.md) and [API Documentation](api.md).