// src/lib/owl.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class Ontology {
  constructor() {
    this.classes = new Map(); // id -> { id, superClasses: Set }
    this.properties = new Map(); // id -> { id, domain, range, type }
    this.individuals = new Map(); // id -> { id, types: Set, properties: Map }
  }

  async load(input) {
    let doc;
    if (typeof input === 'string') {
      const p = path.isAbsolute(input) ? input : path.resolve(process.cwd(), input);
      const raw = await fs.readFile(p, 'utf8');
      doc = JSON.parse(raw);
    } else {
      doc = input;
    }

    const graph = Array.isArray(doc) ? doc : (doc['@graph'] || [doc]);
    const ctx = doc['@context'] || {};

    function toId(v) {
      if (!v) return null;
      if (typeof v === 'string') return v;
      if (v['@id']) return v['@id'];
      return null;
    }

    // first pass: collect classes and properties
    for (const node of graph) {
      const id = node['@id'] || node.id;
      if (!id) continue;
      const types = node['@type'] ? (Array.isArray(node['@type']) ? node['@type'] : [node['@type']]) : [];
      const typeStr = types.join(' ');
      if (typeStr.includes('Class') || typeStr.includes('owl:Class') || typeStr.includes('rdfs:Class')) {
        // class
        const superNodes = node['rdfs:subClassOf'] || node['subClassOf'] || null;
        const supers = new Set();
        if (superNodes) {
          const arr = Array.isArray(superNodes) ? superNodes : [superNodes];
          for (const s of arr) {
            const sid = toId(s) || s;
            if (sid) supers.add(sid);
          }
        }
        this.classes.set(id, { id, superClasses: supers });
      } else if (typeStr.includes('Property') || typeStr.includes('ObjectProperty') || typeStr.includes('DatatypeProperty') || typeStr.includes('rdf:Property')) {
        // property
        const domain = toId(node['rdfs:domain'] || node.domain);
        const range = toId(node['rdfs:range'] || node.range);
        const ptype = typeStr.includes('ObjectProperty') ? 'ObjectProperty' : (typeStr.includes('DatatypeProperty') ? 'DatatypeProperty' : 'Property');
        this.properties.set(id, { id, domain, range, type: ptype });
      }
    }

    // second pass: collect individuals and also detect properties expressed inline
    for (const node of graph) {
      const id = node['@id'] || node.id;
      if (!id) continue;
      const types = node['@type'] ? (Array.isArray(node['@type']) ? node['@type'] : [node['@type']]) : [];
      const typeStr = types.join(' ');
      // skip classes and properties
      if (typeStr.includes('Class') || typeStr.includes('Property') || typeStr.includes('ObjectProperty') || typeStr.includes('DatatypeProperty')) continue;
      // treat as individual
      const inds = new Map();
      for (const [k, v] of Object.entries(node)) {
        if (k === '@id' || k === 'id' || k === '@type' || k === 'type') continue;
        // property value
        const vals = Array.isArray(v) ? v : [v];
        inds.set(k, vals.map(x => toId(x) || x));
      }
      const tset = new Set(types.map(t => (typeof t === 'string' ? t : (t['@id'] || t))));
      this.individuals.set(id, { id, types: tset, properties: inds });
    }

    return this;
  }

  static async load(input) {
    const o = new Ontology();
    return o.load(input);
  }

  defineClass(id, superclass) {
    const supSet = new Set();
    if (superclass) supSet.add(superclass);
    if (!this.classes.has(id)) this.classes.set(id, { id, superClasses: supSet });
    else { const c = this.classes.get(id); if (superclass) c.superClasses.add(superclass); }
    return this.classes.get(id);
  }

  defineProperty(id, domain, range, opts = {}) {
    const p = { id, domain, range, type: opts.type || 'ObjectProperty' };
    this.properties.set(id, p);
    return p;
  }

  addIndividual(className, id, properties = {}) {
    const props = new Map();
    for (const [k, v] of Object.entries(properties)) {
      props.set(k, Array.isArray(v) ? v : [v]);
    }
    const inst = { id, types: new Set([className]), properties: props };
    this.individuals.set(id, inst);
    return inst;
  }

  validate() {
    const errors = [];
    // properties must have domain and range
    for (const [id, p] of this.properties.entries()) {
      if (!p.domain) errors.push({ message: 'Property missing domain', node: id });
      if (!p.range) errors.push({ message: 'Property missing range', node: id });
      if (p.domain && !this.classes.has(p.domain)) errors.push({ message: 'Property domain unknown class', node: id, domain: p.domain });
      if (p.range && !this.classes.has(p.range)) {
        // range may be a datatype (literal), allow simple checks: if startsWith http treat as class
        if (typeof p.range === 'string' && p.range.startsWith('http')) errors.push({ message: 'Property range unknown class', node: id, range: p.range });
      }
    }
    // subclass references must exist
    for (const [id, c] of this.classes.entries()) {
      for (const s of c.superClasses) {
        if (!this.classes.has(s)) errors.push({ message: 'Superclass unknown', node: id, super: s });
      }
    }
    // individual's types must be declared classes
    for (const [id, ind] of this.individuals.entries()) {
      for (const t of ind.types) {
        if (t && typeof t === 'string' && t.startsWith('http') && !this.classes.has(t)) {
          errors.push({ message: 'Individual type unknown class', node: id, type: t });
        }
      }
    }
    return errors;
  }

  getClasses() {
    return Array.from(this.classes.values()).map(c => ({ id: c.id, superClasses: Array.from(c.superClasses) }));
  }

  getProperties() {
    return Array.from(this.properties.values());
  }

  getIndividuals() {
    return Array.from(this.individuals.values()).map(i => ({ id: i.id, types: Array.from(i.types), properties: Object.fromEntries(i.properties) }));
  }

  // pattern: (subject, predicate, object) - simple triple query
  query(subject = null, predicate = null, object = null) {
    // find subclasses: predicate === 'subClassOf' and object is class id -> return subclasses
    if ((predicate === 'subClassOf' || predicate === 'rdfs:subClassOf') && object) {
      const res = [];
      for (const [id, c] of this.classes.entries()) {
        if (c.superClasses.has(object)) res.push(id);
      }
      return res;
    }
    // find instances: predicate === 'type' or 'rdf:type' and object is class id
    if ((predicate === 'type' || predicate === 'rdf:type') && object) {
      const res = [];
      for (const [id, ind] of this.individuals.entries()) {
        if (ind.types.has(object)) res.push(id);
      }
      return res;
    }
    // list domain/range for a property
    if (!subject && (predicate === 'domain' || predicate === 'range') && object) {
      const p = this.properties.get(object);
      if (!p) return [];
      return predicate === 'domain' ? [p.domain] : [p.range];
    }
    // find individuals by property value
    if (predicate && object) {
      const res = [];
      for (const [id, ind] of this.individuals.entries()) {
        for (const [k, vals] of ind.properties.entries()) {
          if ((k === predicate || k === predicate) && vals.includes(object)) res.push(id);
        }
      }
      return res;
    }
    return [];
  }

  toJSONLD() {
    const ctx = { rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#', rdfs: 'http://www.w3.org/2000/01/rdf-schema#', owl: 'http://www.w3.org/2002/07/owl#' };
    const graph = [];
    for (const [id, c] of this.classes.entries()) {
      const node = { '@id': id, '@type': 'owl:Class' };
      if (c.superClasses && c.superClasses.size) {
        node['rdfs:subClassOf'] = Array.from(c.superClasses).map(s => ({ '@id': s }));
      }
      graph.push(node);
    }
    for (const [id, p] of this.properties.entries()) {
      const node = { '@id': id, '@type': p.type === 'DatatypeProperty' ? 'owl:DatatypeProperty' : 'owl:ObjectProperty' };
      if (p.domain) node['rdfs:domain'] = { '@id': p.domain };
      if (p.range) node['rdfs:range'] = { '@id': p.range };
      graph.push(node);
    }
    for (const [id, ind] of this.individuals.entries()) {
      const node = { '@id': id };
      if (ind.types && ind.types.size) node['@type'] = Array.from(ind.types);
      for (const [k, vals] of ind.properties.entries()) {
        node[k] = vals.map(v => (typeof v === 'string' && v.startsWith('http') ? { '@id': v } : v));
      }
      graph.push(node);
    }
    return { '@context': ctx, '@graph': graph };
  }

  // convenience persistence
  async save(dir = 'data') {
    const out = this.toJSONLD();
    await fs.mkdir(dir, { recursive: true });
    const p = path.join(dir, 'ontology.jsonld');
    await fs.writeFile(p, JSON.stringify(out, null, 2), 'utf8');
    return p;
  }

  stats() {
    return { classes: this.classes.size, properties: this.properties.size, individuals: this.individuals.size };
  }
}

export default Ontology;

// convenience top-level functions
export function createOntology() { return new Ontology(); }
