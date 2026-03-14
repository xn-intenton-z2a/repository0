// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/main.js — ontology library and identity

const isNode = typeof process !== "undefined" && !!process.versions?.node;

let pkg = { name: typeof document !== "undefined" ? document.title : "repo", version: "0.0.0", description: "" };
if (isNode) {
  // In Node read package.json using createRequire
  try {
    const { createRequire } = await import("module");
    const requireFn = createRequire(import.meta.url);
    pkg = requireFn("../../package.json");
  } catch (e) {
    // ignore and keep defaults
  }
} else {
  // In browsers try to fetch package.json relative to the module
  try {
    const resp = await fetch(new URL("../../package.json", import.meta.url));
    if (resp.ok) pkg = await resp.json();
  } catch (e) {
    // ignore
  }
}

export const name = pkg.name || "repo";
export const version = pkg.version || "0.0.0";
export const description = pkg.description || "";

export function getIdentity() {
  return { name, version, description };
}

// Simple in-memory ontology implementation with JSON-LD persistence
class Ontology {
  constructor() {
    this.classes = new Map(); // name -> { name, superclass }
    this.properties = new Map(); // name -> { name, domain, range, opts }
    this.individuals = new Map(); // id -> { id, class, properties }
  }

  defineClass(name, superclass = null) {
    if (!name || typeof name !== "string") throw new TypeError("Class name must be a non-empty string");
    if (this.classes.has(name)) return this.classes.get(name);
    if (superclass && !this.classes.has(superclass)) throw new Error(`Superclass '${superclass}' not found`);
    const cls = { name, superclass: superclass || null };
    this.classes.set(name, cls);
    return cls;
  }

  defineProperty(name, domain, range, opts = {}) {
    if (!name || typeof name !== "string") throw new TypeError("Property name must be a non-empty string");
    if (!domain || typeof domain !== "string") throw new TypeError("Domain must be a class name string");
    if (!range || typeof range !== "string") throw new TypeError("Range must be a string (class name or datatype)");
    if (!this.classes.has(domain)) throw new Error(`Domain class '${domain}' not found`);
    const prop = { name, domain, range, opts };
    this.properties.set(name, prop);
    return prop;
  }

  addIndividual(className, id, properties = {}) {
    if (!className || typeof className !== "string") throw new TypeError("className required");
    if (!this.classes.has(className)) throw new Error(`Class '${className}' not defined`);
    if (!id || typeof id !== "string") throw new TypeError("id must be a non-empty string");
    if (this.individuals.has(id)) throw new Error(`Individual with id '${id}' already exists`);
    const ind = { id, class: className, properties: {} };
    for (const [k, v] of Object.entries(properties || {})) {
      ind.properties[k] = Array.isArray(v) ? v.slice() : [v];
    }
    this.individuals.set(id, ind);
    return ind;
  }

  query(pattern = {}) {
    // pattern supports: { id }, { class }, { property, value }
    if (!pattern || Object.keys(pattern).length === 0) return Array.from(this.individuals.values());
    if (pattern.id) {
      return this.individuals.has(pattern.id) ? [this.individuals.get(pattern.id)] : [];
    }
    let results = Array.from(this.individuals.values());
    if (pattern.class) {
      // include subclasses recursively
      const classSet = new Set();
      const addWithSubclasses = (cls) => {
        classSet.add(cls);
        for (const [name, c] of this.classes) {
          if (c.superclass === cls) addWithSubclasses(name);
        }
      };
      addWithSubclasses(pattern.class);
      results = results.filter((ind) => classSet.has(ind.class));
    }
    if (pattern.property) {
      const prop = pattern.property;
      if (pattern.value !== undefined) {
        results = results.filter((ind) => Array.isArray(ind.properties[prop]) && ind.properties[prop].includes(pattern.value));
      } else {
        results = results.filter((ind) => prop in ind.properties);
      }
    }
    return results;
  }

  stats() {
    return { classes: this.classes.size, properties: this.properties.size, individuals: this.individuals.size };
  }

  toJSONLD() {
    const context = { name: "http://schema.org/name" };
    const graph = [];
    for (const cls of this.classes.values()) {
      const node = { "@id": `Class/${cls.name}`, "@type": "rdfs:Class", "rdfs:label": cls.name };
      if (cls.superclass) node["rdfs:subClassOf"] = `Class/${cls.superclass}`;
      graph.push(node);
    }
    for (const prop of this.properties.values()) {
      const node = { "@id": `Property/${prop.name}`, "@type": "rdf:Property", "rdfs:label": prop.name, "rdfs:domain": `Class/${prop.domain}`, "rdfs:range": prop.range };
      graph.push(node);
    }
    for (const ind of this.individuals.values()) {
      const node = { "@id": `Individual/${ind.id}`, "@type": `Class/${ind.class}` };
      for (const [k, vals] of Object.entries(ind.properties)) node[k] = vals.length === 1 ? vals[0] : vals.slice();
      graph.push(node);
    }
    return { "@context": context, "@graph": graph };
  }

  fromJSONLD(jsonld) {
    if (!jsonld || !Array.isArray(jsonld["@graph"])) return 0;
    let count = 0;
    for (const node of jsonld["@graph"]) {
      const id = node["@id"];
      if (!id) continue;
      if (id.startsWith("Class/")) {
        const name = node["rdfs:label"] || id.slice(6);
        const superclassId = node["rdfs:subClassOf"];
        const superclass = superclassId && superclassId.startsWith("Class/") ? superclassId.slice(6) : (superclassId || null);
        try { this.defineClass(name, superclass); count++; } catch (e) { /* ignore duplicates */ }
      } else if (id.startsWith("Property/")) {
        const name = node["rdfs:label"] || id.slice(9);
        const domainId = node["rdfs:domain"];
        const domain = domainId && domainId.startsWith("Class/") ? domainId.slice(6) : domainId;
        const range = node["rdfs:range"] || "Literal";
        try { this.defineProperty(name, domain, range); count++; } catch (e) { /* ignore if domain missing */ }
      } else if (id.startsWith("Individual/")) {
        const indId = id.slice(11);
        const type = node["@type"];
        const className = type && typeof type === "string" && type.startsWith("Class/") ? type.slice(6) : (type || "Thing");
        const props = {};
        for (const [k, v] of Object.entries(node)) {
          if (k === "@id" || k === "@type") continue;
          props[k] = v;
        }
        // ensure class exists
        try { this.defineClass(className); } catch (e) { /* ignore */ }
        try { this.addIndividual(className, indId, props); count++; } catch (e) { /* ignore duplicates */ }
      }
    }
    return count;
  }

  async load(dir = "data") {
    if (isNode) {
      const fs = await import("fs/promises");
      const path = await import("path");
      let files;
      try {
        files = await fs.readdir(dir);
      } catch (e) {
        return 0;
      }
      const jsonFiles = files.filter((f) => f.endsWith(".jsonld") || f.endsWith(".json"));
      let total = 0;
      for (const f of jsonFiles) {
        const content = await fs.readFile(path.join(dir, f), "utf8");
        const json = JSON.parse(content);
        total += this.fromJSONLD(json);
      }
      return total;
    } else {
      try {
        const resp = await fetch(`${dir}/ontology.jsonld`);
        if (!resp.ok) return 0;
        const json = await resp.json();
        return this.fromJSONLD(json);
      } catch (e) {
        return 0;
      }
    }
  }

  async save(dir = "data") {
    if (!isNode) throw new Error("save is only supported in Node.js environment");
    const fs = await import("fs/promises");
    const path = await import("path");
    await fs.mkdir(dir, { recursive: true });
    const outPath = path.join(dir, "ontology.jsonld");
    await fs.writeFile(outPath, JSON.stringify(this.toJSONLD(), null, 2), "utf8");
    return outPath;
  }
}

export function createOntology() {
  return new Ontology();
}

let defaultOntology = createOntology();

export function resetDefaultOntology() {
  defaultOntology = createOntology();
}

export function defineClass(...args) { return defaultOntology.defineClass(...args); }
export function defineProperty(...args) { return defaultOntology.defineProperty(...args); }
export function addIndividual(...args) { return defaultOntology.addIndividual(...args); }
export function query(...args) { return defaultOntology.query(...args); }
export function load(...args) { return defaultOntology.load(...args); }
export function save(...args) { return defaultOntology.save(...args); }
export function stats(...args) { return defaultOntology.stats(...args); }

// Utility accessors for UI
export function listClasses() {
  return Array.from(defaultOntology.classes.values()).map(c => ({ name: c.name, superclass: c.superclass }));
}
export function listProperties() {
  return Array.from(defaultOntology.properties.values()).map(p => ({ name: p.name, domain: p.domain, range: p.range }));
}
export function listIndividuals() {
  return Array.from(defaultOntology.individuals.values()).map(i => ({ id: i.id, class: i.class, properties: { ...i.properties } }));
}

// CLI helpers
export function main(args) {
  if (args?.includes("--version")) {
    console.log(version);
    return;
  }
  if (args?.includes("--identity")) {
    console.log(JSON.stringify(getIdentity(), null, 2));
    return;
  }
  console.log(`${name}@${version}`);
}

if (isNode) {
  try {
    const { fileURLToPath } = await import("url");
    if (process.argv[1] === fileURLToPath(import.meta.url)) {
      const args = process.argv.slice(2);
      main(args);
    }
  } catch (e) {
    // ignore in tests
  }
}
