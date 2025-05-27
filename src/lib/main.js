import fs from 'fs';
import { fileURLToPath } from 'url';

/**
 * Build an OWL ontology JSON for countries and their capital cities.
 * @returns {Promise<Object>} The ontology JSON object.
 */
async function buildCapitalCitiesOntology() {
  const response = await fetch('https://restcountries.com/v3.1/all');
  if (!response.ok) {
    throw new Error(`Failed to fetch countries: ${response.status}`);
  }
  const countries = await response.json();
  const classes = ['Country', 'City'];
  const objectProperties = [{ name: 'hasCapital', domain: 'Country', range: 'City' }];
  const individuals = [];
  for (const country of countries) {
    const countryCode = country.cca3;
    const capitalArr = country.capital;
    if (!countryCode || !capitalArr || capitalArr.length === 0) {
      continue;
    }
    const cityName = capitalArr[0];
    individuals.push({ type: 'Country', id: countryCode });
    individuals.push({ type: 'City', id: cityName });
    individuals.push({ subject: countryCode, predicate: 'hasCapital', object: cityName });
  }
  return { ontology: { classes, objectProperties, individuals } };
}

/**
 * Main entry point for CLI
 * @param {string[]} args - Command line arguments
 * @returns {Promise<Object|undefined>} Returns ontology or query result when invoked programmatically.
 */
export async function main(args = []) {
  // Handle --capital-cities command
  if (args.includes('--capital-cities')) {
    const outFlagIndex = args.indexOf('--output');
    const outputPath = outFlagIndex !== -1 && args.length > outFlagIndex + 1
      ? args[outFlagIndex + 1]
      : null;
    const ontologyObj = await buildCapitalCitiesOntology();
    const jsonString = JSON.stringify(ontologyObj);
    if (outputPath) {
      await fs.promises.writeFile(outputPath, jsonString);
    } else {
      console.log(jsonString);
    }
    return ontologyObj;
  }

  // Handle --find-capital-of command
  if (args.includes('--find-capital-of')) {
    const idx = args.indexOf('--find-capital-of');
    const countryCode = args[idx + 1];
    if (!countryCode) {
      throw new Error('Country code not provided');
    }
    const outIdx = args.indexOf('--output');
    const outputPath = outIdx !== -1 && args.length > outIdx + 1
      ? args[outIdx + 1]
      : null;
    const ontologyObj = await buildCapitalCitiesOntology();
    const individuals = ontologyObj.ontology.individuals;
    const matches = individuals
      .filter(ind => ind.subject === countryCode && ind.predicate === 'hasCapital')
      .map(ind => ind.object);
    if (matches.length === 0) {
      throw new Error(`Country code ${countryCode} not found.`);
    }
    const capitalValue = matches.length === 1 ? matches[0] : matches;
    const resultObj = { country: countryCode, capital: capitalValue };
    if (outputPath) {
      await fs.promises.writeFile(outputPath, JSON.stringify(resultObj));
      return resultObj;
    } else {
      if (Array.isArray(capitalValue)) {
        console.log(JSON.stringify(capitalValue));
      } else {
        console.log(capitalValue);
      }
      return resultObj;
    }
  }

  // Default fallback behavior
  console.log('Run with:', args);
}

// Execute if invoked as script
const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  main(process.argv.slice(2)).catch(err => {
    console.error(err);
    process.exit(1);
  });
}
