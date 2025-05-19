# CLI Commands

The CLI supports the following commands:

- **help**  
  Show this help message.

- **mission**  
  Print the mission statement.

- **version**  
  Print the version from package.json.

- **echo**  
  Echo the provided arguments.

- **house-choice**  
  Randomly select or list predefined houses.

- **plot-quadratic**  
  Plot a quadratic equation y = ax² + bx + c over the domain [-10, 10] and output it as an SVG file.
  Flags:
  - `--a <number>` Coefficient a (default: 1)
  - `--b <number>` Coefficient b (default: 0)
  - `--c <number>` Coefficient c (default: 0)
  - `--output <path>` Output file path (default: plot.svg)

- **plot-sine**  
  Plot a sine wave y = amplitude * sin(frequency * x) over the domain [-10, 10] and output it as an SVG file.
  Flags:
  - `--frequency <number>` Frequency (default: 1)
  - `--amplitude <number>` Amplitude (default: 1)
  - `--output <path>` Output file path (default: plot.svg)

- **plot-server**  
  Start an HTTP server to serve SVG plots for quadratic, sine, or arbitrary expressions.
  Flags:
  - `--port <number>` TCP port to listen on (default: 3000)
  - `--host <string>` Hostname to bind (default: 'localhost')

## Usage

```bash
npm run start -- house-choice
# Outputs a single randomly selected house, e.g. "Gryffindor"

npm run start -- house-choice --list
# Outputs all available houses:
# Gryffindor
# Hufflepuff
# Ravenclaw
# Slytherin

npm run start -- house-choice --seed 123
# Outputs a deterministic house based on the seed value.
```

```bash
npm run start -- plot-quadratic --a 2 --b 3 --c 1 --output quadratic.svg
# Generates quadratic.svg with a plot of y = 2x² + 3x + 1

npm run start -- plot-sine --frequency 2 --amplitude 0.5 --output sine.svg
# Generates sine.svg with a sine wave of frequency 2 and amplitude 0.5
```

```bash
npm run start -- plot-server --port 4000 --host localhost
# Starts server at http://localhost:4000

curl "http://localhost:4000/plot?type=quadratic&a=1&b=0&c=0"
curl "http://localhost:4000/plot?type=sine&frequency=2&amplitude=0.5"
curl "http://localhost:4000/plot?type=expression&expr=x%5E2&domain=-5,5&samples=50"
```