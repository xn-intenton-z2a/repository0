// SPDX-License-Identifier: MIT
// src/web/lib.js — re-export browser-safe API from the library
export { name, version, description, getIdentity, createOntology, resetDefaultOntology, listClasses, listProperties, listIndividuals, defineClass, defineProperty, addIndividual, updateIndividual, removeIndividual, getIndividual, query, load, save, validate, migrate, stats, getContext, setContext, getModelVersion } from "../lib/main.js";
