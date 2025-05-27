import fs from 'fs';
import { fileURLToPath } from 'url';

export async function main(args = []) {
  if (args.includes('--capital-cities')) {
    const outFlagIndex = args.indexOf('--output');
    const outputPath = outFlagIndex !== -1 && args.length > outFlagIndex + 1
      ? args[outFlagIndex + 1]
      : null;
    const response = await fetch('https://restcountries.com/v3.1/all');
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
    const ontology = { ontology: { classes, objectProperties, individuals } };
    const jsonString = JSON.stringify(ontology);
    if (outputPath) {
      await fs.promises.writeFile(outputPath, jsonString);
    } else {
      console.log(jsonString);
    }
    return ontology;
  } else {
    console.log('Run with:', args);
  }
}

const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  main(process.argv.slice(2)).catch(err => {
    console.error(err);
    process.exit(1);
  });
}
