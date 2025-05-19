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