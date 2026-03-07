#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/main.js

import { createRequire } from "module";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const pkg = require("../../package.json");

export const name = pkg.name;
export const version = pkg.version;
export const description = pkg.description;

export function getIdentity() {
  return { name, version, description };
}

// Re-export ontology utilities
import OntologyDefault, { Ontology as OntologyClass, createOntology } from './owl.js';

export const Ontology = OntologyClass || OntologyDefault;
export function createDefaultOntology() { return createOntology(); }
export function defineClass(name, superclass) { const o = createOntology(); return o.defineClass(name, superclass); }
export function defineProperty(name, domain, range, opts) { const o = createOntology(); return o.defineProperty(name, domain, range, opts); }
export function addIndividual(className, id, properties) { const o = createOntology(); return o.addIndividual(className, id, properties); }
export function query(...args) { const o = createOntology(); return o.query(...args); }
export function loadOntology(source) { return OntologyClass.load(source); }

export function main(args) {
  if (args?.includes("--version")) {
    console.log(version);
    return;
  }
  if (args?.includes("--identity")) {
    console.log(JSON.stringify(getIdentity(), null, 2));
    return;
  }
  if (args?.includes('--owl-summary')) {
    // print a summary of the seed ontology
    (async () => {
      const seed = 'features/seed-ontology.jsonld';
      const ont = await OntologyClass.load(seed);
      console.log('OWL Ontology Summary');
      console.log('Classes:', ont.getClasses().map(c => c.id).join(', '));
      console.log('Properties:', ont.getProperties().map(p => `${p.id} (domain=${p.domain}, range=${p.range})`).join('\\n'));
      console.log('Individuals:', ont.getIndividuals().map(i => i.id).join(', '));
    })();
    return;
  }
  console.log(`${name}@${version}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
