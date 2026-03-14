// SPDX-License-Identifier: MIT
// src/lib/main.js — ontology library implementing JSON-LD persistence and simple reasoning

const isNode = typeof process !== "undefined" && !!process.versions?.node;

// load package.json metadata if available
let pkg = { name: typeof document !== "undefined" ? document.title : "repo", version: "0.0.0", description: "" };
if (isNode) {
  try {
    const { createRequire } = await import("module");
    const requireFn = createRequire(import.meta.url);
    pkg = requireFn("../../package.json");
  } catch (e) {
    // keep defaults
  }
} else {
  try {
    const resp = await fetch(new URL("../../package.json", import.meta.url));
    if (resp.ok) pkg = await resp.json();
  } catch (e) { /* ignore */ }
}

export const name = pkg.name || "repo";
export const version = pkg.version || "0.0.0";
export const description = pkg.description || "";

export function getIdentity() { return { name, version, description }; }

// helpers
function kebabCase(s) {
  return String(s).replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "").toLowerCase();
}

function stringifySorted(obj) {
  const seen = new WeakSet();
  function sorter(item) {
    if (item && typeof item === 'object') {
      if (seen.has(item)) return item;
      seen.add(item);
      if (Array.isArray(item)) return item.map(sorter);
      const out = {};
      Object.keys(item).sort().forEach(k => out[k] = sorter(item[k]));
      return out;
    }
    return item;
  }
  return JSON.stringify(sorter(obj), null, 2);
}

export function createOntology() {
  class Ontology {
    constructor() {
      this.classes = new Map();
      this.properties = new Map();
      this.individuals = new Map();
      this._context = { "@vocab": "http://example.org/" };
      this._modelVersion = "1";
    }

    // Core API
    defineClass(name, superclass = null) {
      if (!name || typeof name !== 'string') throw new TypeError('class name must be a non-empty string');
      if (this.classes.has(name)) return this.classes.get(name);
      if (superclass && typeof superclass === 'string') {
        // allow defining subclass even if superclass not present; it will be validated later
      }
      const cls = { name, superclass: superclass || null };
      this.classes.set(name, cls);
      return cls;
    }

    defineProperty(name, domain, range, opts = {}) {
      if (!name || typeof name !== 'string') throw new TypeError('property name must be a non-empty string');
      if (!domain || typeof domain !== 'string') throw new TypeError('domain must be a string');
      if (!range || typeof range !== 'string') throw new TypeError('range must be a string');
      // Accept domain/range even if class not yet defined — validate() will report issues
      const prop = { name, domain, range, opts: opts || {} };
      this.properties.set(name, prop);
      return prop;
    }

    addIndividual(className, id, properties = {}) {
      if (!className || typeof className !== 'string') throw new TypeError('className required');
      if (!this.classes.has(className)) throw new Error('class not defined');
      if (!id || typeof id !== 'string') throw new TypeError('id must be a non-empty string');
      if (this.individuals.has(id)) throw new Error(`individual '${id}' already exists`);
      const ind = { id, class: className, properties: {} };
      for (const [k, v] of Object.entries(properties || {})) {
        ind.properties[k] = Array.isArray(v) ? v.slice() : [v];
      }
      this.individuals.set(id, ind);
      return { id: ind.id, class: ind.class, properties: JSON.parse(JSON.stringify(ind.properties)) };
    }

    getIndividual(className, id) {
      if (!id || typeof id !== 'string') throw new TypeError('id required');
      if (!this.individuals.has(id)) return null;
      const ind = this.individuals.get(id);
      if (className && ind.class !== className) return null;
      return { id: ind.id, class: ind.class, properties: JSON.parse(JSON.stringify(ind.properties)) };
    }

    updateIndividual(className, id, properties = {}, opts = { merge: true }) {
      if (!id || typeof id !== 'string') throw new TypeError('id required');
      if (!this.individuals.has(id)) throw new Error('individual not found');
      const ind = this.individuals.get(id);
      if (className && ind.class !== className) throw new Error('individual not found');
      if (!opts || opts.merge === undefined) opts = { merge: true };
      if (opts.merge) {
        for (const [k, v] of Object.entries(properties || {})) {
          const vals = Array.isArray(v) ? v.slice() : [v];
          if (!ind.properties[k]) ind.properties[k] = [];
          ind.properties[k].push(...vals);
        }
      } else {
        // replace
        ind.properties = {};
        for (const [k, v] of Object.entries(properties || {})) {
          ind.properties[k] = Array.isArray(v) ? v.slice() : [v];
        }
      }
      return { id: ind.id, class: ind.class, properties: JSON.parse(JSON.stringify(ind.properties)) };
    }

    removeIndividual(className, id) {
      if (!id || typeof id !== 'string') return false;
      if (!this.individuals.has(id)) return false;
      const ind = this.individuals.get(id);
      if (className && ind.class !== className) return false;
      this.individuals.delete(id);
      return true;
    }

    // convenience listing methods (instance-level)
    listClasses() { return Array.from(this.classes.values()).map(c => ({ name: c.name, superclass: c.superclass })); }
    listProperties() { return Array.from(this.properties.values()).map(p => ({ name: p.name, domain: p.domain, range: p.range })); }
    listIndividuals() { return Array.from(this.individuals.values()).map(i => ({ id: i.id, class: i.class, properties: JSON.parse(JSON.stringify(i.properties)) })); }

    // Query with simple subclass inference
    query(pattern = {}, opts = {}) {
      const reasonLevel = opts && opts.reasonLevel ? opts.reasonLevel : 'default';
      const explain = !!(opts && opts.explain);
      if (!pattern || Object.keys(pattern).length === 0) {
        return Array.from(this.individuals.values()).map(ind => ({ id: ind.id, class: ind.class, properties: JSON.parse(JSON.stringify(ind.properties)) }));
      }

      const results = [];
      for (const ind of this.individuals.values()) {
        let matched = true;
        let matchedBy = 'direct';
        const inferenceChain = [];
        if (pattern.id) {
          matched = ind.id === pattern.id;
        }
        if (matched && pattern.class) {
          if (reasonLevel === 'none') {
            matched = ind.class === pattern.class;
            matchedBy = matched ? 'direct' : 'none';
            if (matched) inferenceChain.push(ind.class);
          } else {
            // build chain from ind.class up through superclasses
            let cur = ind.class;
            const chain = [cur];
            while (cur) {
              const cls = this.classes.get(cur);
              if (!cls) break;
              if (cls.superclass) {
                chain.push(cls.superclass);
                cur = cls.superclass;
              } else break;
            }
            // chain contains [ind.class, parent, ...]
            if (chain.includes(pattern.class)) {
              matched = true;
              if (ind.class === pattern.class) matchedBy = 'direct'; else matchedBy = 'inferred';
              inferenceChain.push(...chain);
            } else matched = false;
          }
        }
        if (matched && pattern.property) {
          const prop = pattern.property;
          const hasProp = Array.isArray(ind.properties[prop]) && ind.properties[prop].length > 0;
          if (pattern.value !== undefined) {
            if (!hasProp || !ind.properties[prop].includes(pattern.value)) matched = false;
          } else {
            if (!hasProp) matched = false;
          }
        }
        if (matched) {
          const out = { id: ind.id, class: ind.class, properties: JSON.parse(JSON.stringify(ind.properties)) };
          if (explain) {
            out.matchedBy = matchedBy === 'none' ? 'direct' : matchedBy;
            out.inferenceChain = inferenceChain.slice();
          }
          results.push(out);
        }
      }

      return results;
    }

    // Serialization
    toJSONLD() {
      const context = this._context || { "@vocab": "http://example.org/" };
      const graph = [];
      // classes
      for (const cls of Array.from(this.classes.values()).sort((a,b)=>a.name.localeCompare(b.name))) {
        const node = { "@id": `Class/${cls.name}`, "@type": "rdfs:Class", "rdfs:label": cls.name };
        if (cls.superclass) node["rdfs:subClassOf"] = `Class/${cls.superclass}`;
        graph.push(node);
      }
      // properties
      for (const prop of Array.from(this.properties.values()).sort((a,b)=>a.name.localeCompare(b.name))) {
        const node = { "@id": `Property/${prop.name}`, "@type": "rdf:Property", "rdfs:label": prop.name, "rdfs:domain": prop.domain && prop.domain.startsWith('Class/') ? prop.domain : (prop.domain.startsWith('http') ? prop.domain : prop.domain), "rdfs:range": prop.range };
        graph.push(node);
      }
      // individuals
      for (const ind of Array.from(this.individuals.values()).sort((a,b)=>a.id.localeCompare(b.id))) {
        const node = { "@id": `Individual/${ind.id}`, "@type": `Class/${ind.class}` };
        for (const [k, vals] of Object.entries(ind.properties)) node[k] = vals.length === 1 ? vals[0] : vals.slice();
        graph.push(node);
      }
      const out = { "@context": context, "modelVersion": this._modelVersion, "@graph": graph };
      return out;
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
          const superclass = superclassId && typeof superclassId === 'string' && superclassId.startsWith("Class/") ? superclassId.slice(6) : (superclassId || null);
          this.defineClass(name, superclass);
          count++;
        } else if (id.startsWith("Property/")) {
          const name = node["rdfs:label"] || id.slice(9);
          const domain = node["rdfs:domain"] || null;
          const domainName = domain && typeof domain === 'string' && domain.startsWith("Class/") ? domain.slice(6) : (domain || null);
          const range = node["rdfs:range"] || 'Literal';
          try { this.defineProperty(name, domainName || '', range); count++; } catch (e) { /* ignore */ }
        } else if (id.startsWith("Individual/")) {
          const indId = id.slice(11);
          const type = node["@type"];
          const className = type && typeof type === 'string' && type.startsWith("Class/") ? type.slice(6) : (type || 'Thing');
          const props = {};
          for (const [k, v] of Object.entries(node)) {
            if (k === "@id" || k === "@type") continue;
            props[k] = v;
          }
          // ensure class exists
          this.defineClass(className);
          try { this.addIndividual(className, indId, props); count++; } catch (e) { /* ignore duplicates */ }
        }
      }
      // optionally read modelVersion
      if (jsonld.modelVersion) this._modelVersion = String(jsonld.modelVersion);
      return count;
    }

    // Persistence with one-file-per-class layout
    async save(dir = 'data', opts = {}) {
      const summary = { ok: true, classes: 0, properties: 0, individuals: 0, files: [] };
      if (opts && opts.validate) {
        const v = this.validate();
        const errors = v.issues.filter(i => i.level === 'error');
        if (errors.length) throw new Error('validation failed');
      }
      if (isNode) {
        const fs = await import('fs/promises');
        const path = await import('path');
        await fs.mkdir(dir, { recursive: true });
        // write context.jsonld
        const ctxPath = path.join(dir, 'context.jsonld');
        const contextDoc = { "@context": this._context, "modelVersion": this._modelVersion };
        await fs.writeFile(ctxPath, stringifySorted(contextDoc), 'utf8');
        summary.files.push(ctxPath);
        // per-class files
        const classNames = Array.from(this.classes.keys()).sort();
        for (const cname of classNames) {
          const cls = this.classes.get(cname);
          const graph = [];
          // class node
          const classNode = { "@id": `Class/${cls.name}`, "@type": "rdfs:Class", "rdfs:label": cls.name };
          if (cls.superclass) classNode["rdfs:subClassOf"] = `Class/${cls.superclass}`;
          graph.push(classNode);
          // properties where domain equals this class
          const props = Array.from(this.properties.values()).filter(p => p.domain === cname).sort((a,b)=>a.name.localeCompare(b.name));
          for (const p of props) {
            const node = { "@id": `Property/${p.name}`, "@type": "rdf:Property", "rdfs:label": p.name, "rdfs:domain": p.domain, "rdfs:range": p.range };
            graph.push(node);
          }
          // individuals of this class
          const inds = Array.from(this.individuals.values()).filter(i => i.class === cname).sort((a,b)=>a.id.localeCompare(b.id));
          for (const ind of inds) {
            const node = { "@id": `Individual/${ind.id}`, "@type": `Class/${ind.class}` };
            for (const [k, vals] of Object.entries(ind.properties)) node[k] = vals.length === 1 ? vals[0] : vals.slice();
            graph.push(node);
          }
          const doc = { "@context": this._context, "@graph": graph, "modelVersion": this._modelVersion };
          const fname = `Class-${kebabCase(cname)}.jsonld`;
          const outPath = path.join(dir, fname);
          await fs.writeFile(outPath, stringifySorted(doc), 'utf8');
          summary.files.push(outPath);
        }
        summary.classes = this.classes.size;
        summary.properties = this.properties.size;
        summary.individuals = this.individuals.size;
        return summary;
      } else {
        // Browser: cannot write files; return summary only
        summary.classes = this.classes.size;
        summary.properties = this.properties.size;
        summary.individuals = this.individuals.size;
        summary.files = [];
        return summary;
      }
    }

    async load(dir = 'data') {
      const summary = { ok: true, classes: 0, properties: 0, individuals: 0, files: [], errors: [] };
      if (isNode) {
        const fs = await import('fs/promises');
        const path = await import('path');
        try {
          const files = await fs.readdir(dir);
          const jsonFiles = files.filter(f => f.endsWith('.jsonld') || f.endsWith('.json'));
          for (const f of jsonFiles.sort()) {
            const full = path.join(dir, f);
            try {
              const content = await fs.readFile(full, 'utf8');
              const json = JSON.parse(content);
              const c = this.fromJSONLD(json);
              summary.files.push(full);
            } catch (e) {
              summary.errors.push({ file: f, error: String(e) });
            }
          }
          summary.classes = this.classes.size;
          summary.properties = this.properties.size;
          summary.individuals = this.individuals.size;
          return summary;
        } catch (e) {
          return summary; // dir not present => empty
        }
      } else {
        // Browser: try fetch single file
        try {
          const resp = await fetch(`${dir}/ontology.jsonld`);
          if (!resp.ok) return summary;
          const json = await resp.json();
          this.fromJSONLD(json);
          summary.classes = this.classes.size;
          summary.properties = this.properties.size;
          summary.individuals = this.individuals.size;
          summary.files.push(`${dir}/ontology.jsonld`);
          return summary;
        } catch (e) {
          return summary;
        }
      }
    }

    validate() {
      const issues = [];
      // check properties domain/range
      for (const p of this.properties.values()) {
        // domain
        if (p.domain && typeof p.domain === 'string' && p.domain.length) {
          const d = p.domain;
          // treat xsd: and http as datatypes, skip
          if (!d.startsWith('xsd:') && !d.startsWith('http')) {
            if (!this.classes.has(d)) {
              issues.push({ level: 'error', code: 'unknown-domain', message: `Property '${p.name}' domain '${d}' references unknown class`, context: { property: p.name, domain: d } });
            }
          }
        }
        // range
        if (p.range && typeof p.range === 'string' && p.range.length) {
          const r = p.range;
          if (!r.startsWith('xsd:') && !r.startsWith('http')) {
            if (!this.classes.has(r)) {
              issues.push({ level: 'error', code: 'unknown-range', message: `Property '${p.name}' range '${r}' references unknown class`, context: { property: p.name, range: r } });
            }
          }
        }
      }
      // check individuals classes
      for (const ind of this.individuals.values()) {
        if (!this.classes.has(ind.class)) {
          issues.push({ level: 'error', code: 'unknown-class', message: `Individual '${ind.id}' declared as unknown class '${ind.class}'`, context: { id: ind.id, class: ind.class } });
        }
      }
      return { valid: issues.length === 0, issues };
    }

    migrate(source, targetVersion) {
      const actions = [];
      const from = this._modelVersion;
      if (String(targetVersion) === String(this._modelVersion)) return { migrated: false, summary: { from, to: String(targetVersion) }, actions };
      // simple migration: set modelVersion
      this._modelVersion = String(targetVersion);
      actions.push({ action: 'set-model-version', from, to: this._modelVersion });
      return { migrated: true, summary: { from, to: this._modelVersion }, actions };
    }

    stats() {
      return { classes: this.classes.size, properties: this.properties.size, individuals: this.individuals.size };
    }

    getContext() { return JSON.parse(JSON.stringify(this._context)); }
    setContext(ctx) { this._context = JSON.parse(JSON.stringify(ctx)); }
    getModelVersion() { return this._modelVersion; }
  }

  return new Ontology();
}

// default ontology instance and exported helpers
let defaultOntology = createOntology();
export function resetDefaultOntology() { defaultOntology = createOntology(); }

export function defineClass(...args) { return defaultOntology.defineClass(...args); }
export function defineProperty(...args) { return defaultOntology.defineProperty(...args); }
export function addIndividual(...args) { return defaultOntology.addIndividual(...args); }
export function updateIndividual(...args) { return defaultOntology.updateIndividual(...args); }
export function removeIndividual(...args) { return defaultOntology.removeIndividual(...args); }
export function getIndividual(...args) { return defaultOntology.getIndividual(...args); }
export function query(...args) { return defaultOntology.query(...args); }
export function save(...args) { return defaultOntology.save(...args); }
export function load(...args) { return defaultOntology.load(...args); }
export function validate(...args) { return defaultOntology.validate(...args); }
export function migrate(...args) { return defaultOntology.migrate(...args); }
export function stats(...args) { return defaultOntology.stats(...args); }
export function getContext(...args) { return defaultOntology.getContext(...args); }
export function setContext(...args) { return defaultOntology.setContext(...args); }
export function getModelVersion(...args) { return defaultOntology.getModelVersion(...args); }
export function listClasses() { return Array.from(defaultOntology.classes.values()).map(c => ({ name: c.name, superclass: c.superclass })); }
export function listProperties() { return Array.from(defaultOntology.properties.values()).map(p => ({ name: p.name, domain: p.domain, range: p.range })); }
export function listIndividuals() { return Array.from(defaultOntology.individuals.values()).map(i => ({ id: i.id, class: i.class, properties: JSON.parse(JSON.stringify(i.properties)) })); }

// CLI
export async function main(argv = []) {
  const args = argv || (isNode ? process.argv.slice(2) : []);
  const cmd = args[0];
  try {
    if (!cmd || cmd === 'help' || cmd === '--help') {
      console.log(JSON.stringify({ ok: true, summary: { usage: 'define-class|define-property|add-individual|seed|stats|save|load|export|import' } }, null, 2));
      return 0;
    }
    if (cmd === '--version') { console.log(JSON.stringify({ ok: true, summary: { version } }, null, 2)); return 0; }
    if (cmd === 'define-class') {
      const name = args[1]; const superclass = args[2];
      const c = defineClass(name, superclass);
      console.log(JSON.stringify({ ok: true, summary: c }, null, 2));
      return 0;
    }
    if (cmd === 'define-property') {
      const name = args[1]; const domain = args[2]; const range = args[3];
      const p = defineProperty(name, domain, range);
      console.log(JSON.stringify({ ok: true, summary: p }, null, 2));
      return 0;
    }
    if (cmd === 'add-individual') {
      const className = args[1]; const id = args[2];
      // remaining args are key=val
      const props = {};
      for (let i = 3; i < args.length; i++) {
        const [k, v] = args[i].split('='); props[k] = v;
      }
      const ind = addIndividual(className, id, props);
      console.log(JSON.stringify({ ok: true, summary: ind }, null, 2));
      return 0;
    }
    if (cmd === 'seed') {
      // deterministic seed
      resetDefaultOntology();
      defineClass('Animal');
      defineClass('Mammal', 'Animal');
      defineClass('Bird', 'Animal');
      defineProperty('hasName', 'Animal', 'xsd:string');
      addIndividual('Mammal', 'dog1', { hasName: 'Fido' });
      addIndividual('Mammal', 'cat1', { hasName: 'Whiskers' });
      addIndividual('Bird', 'sparrow1', { hasName: 'Jack' });
      const s = stats();
      console.log(JSON.stringify({ ok: true, summary: s }, null, 2));
      return 0;
    }
    if (cmd === 'stats') {
      console.log(JSON.stringify({ ok: true, summary: stats() }, null, 2));
      return 0;
    }
    if (cmd === 'save') {
      const dir = args[1] || 'data';
      const out = await save(dir);
      console.log(JSON.stringify({ ok: true, summary: out }, null, 2));
      return 0;
    }
    if (cmd === 'load') {
      const dir = args[1] || 'data';
      const out = await load(dir);
      console.log(JSON.stringify({ ok: true, summary: out }, null, 2));
      return 0;
    }
    if (cmd === 'export') {
      const g = defaultOntology.toJSONLD();
      console.log(JSON.stringify({ ok: true, summary: g }, null, 2));
      return 0;
    }
    if (cmd === 'import') {
      const fp = args[1];
      if (!fp) { console.error(JSON.stringify({ ok: false, errors: ['path required'] })); return 1; }
      if (isNode) {
        const fs = await import('fs/promises');
        const content = await fs.readFile(fp, 'utf8');
        const json = JSON.parse(content);
        const c = defaultOntology.fromJSONLD(json);
        console.log(JSON.stringify({ ok: true, summary: { added: c } }, null, 2));
        return 0;
      } else {
        console.error(JSON.stringify({ ok: false, errors: ['import only in node'] }));
        return 1;
      }
    }
    console.error(JSON.stringify({ ok: false, errors: ['unknown command'] }));
    return 2;
  } catch (e) {
    console.error(JSON.stringify({ ok: false, errors: [String(e)] }));
    return 1;
  }
}

if (isNode) {
  try {
    const { fileURLToPath } = await import('url');
    if (process.argv[1] === fileURLToPath(import.meta.url)) {
      const code = await main(process.argv.slice(2));
      process.exit(code);
    }
  } catch (e) { /* ignore when imported in tests */ }
}
