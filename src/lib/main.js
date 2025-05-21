#!/usr/bin/env node
// src/lib/main.js

import http from "http";
import { fileURLToPath, URL } from "url";
import fs from "fs";
import yaml from "js-yaml";
import ejs from "ejs";
import { z } from "zod";

export function main(args = []) {
  // Default ASCII faces
  const defaultFaces = {
    happy: `\n  ^_^\n`,
    sad: `\n  T_T\n`,
    surprised: `\n  O_O\n`,
    angry: `\n  >:(\n`,
    neutral: `\n  -_-\n`,
  };

  // Prepare config loading variables
  let customFaces = {};
  let loadedConfigPath = null;
  const configIndex = args.indexOf("--config");
  let filteredArgs = args;

  // Load custom config if provided
  if (configIndex !== -1) {
    if (args.length <= configIndex + 1) {
      console.error("No path specified for --config");
      process.exit(1);
    }
    const configPath = args[configIndex + 1];
    loadedConfigPath = configPath;
    try {
      const content = fs.readFileSync(configPath, "utf8");
      let parsed;
      const schema = z.record(z.string());
      if (configPath.toLowerCase().endsWith(".json")) {
        parsed = JSON.parse(content);
        const validated = schema.parse(parsed);
        customFaces = validated;
      } else {
        parsed = yaml.load(content);
        const validated = schema.parse(parsed);
        customFaces = {};
        for (const [key, val] of Object.entries(validated)) {
          // Normalize YAML values: indent lines and wrap with newlines
          const lines = val.split("\n");
          const indentedLines = lines.map((line) =>
            line.length > 0 ? `  ${line}` : line
          );
          let normalized = `\n${indentedLines.join("\n")}`;
          if (!normalized.endsWith("\n")) {
            normalized += "\n";
          }
          customFaces[key] = normalized;
        }
      }
    } catch (err) {
      console.error(`Error loading config file: ${err.message}`);
      process.exit(1);
    }
    // Remove config args for downstream parsing
    filteredArgs = args.filter(
      (_, idx) => idx !== configIndex && idx !== configIndex + 1
    );
  }

  // Merge defaults with custom (custom overrides)
  const faces = { ...defaultFaces, ...customFaces };

  // Diagnostics mode: output runtime metadata as JSON and exit
  if (args.includes("--diagnostics")) {
    // Load version from package.json
    let version = null;
    try {
      const pkgPath = fileURLToPath(new URL("../../package.json", import.meta.url));
      const pkgContent = fs.readFileSync(pkgPath, "utf8");
      version = JSON.parse(pkgContent).version;
    } catch {
      version = null;
    }
    const diagnostics = {
      version,
      defaultEmotions: Object.keys(defaultFaces),
      loadedConfigPath,
      customEmotionsCount: Object.keys(customFaces).length,
      serveMode: args.includes("--serve"),
      listMode: args.includes("--list-emotions") || args.includes("--list"),
    };
    console.log(JSON.stringify(diagnostics, null, 2));
    process.exit(0);
  }

  // Determine serve mode and list mode
  const serveMode = filteredArgs.includes("--serve");
  const listMode =
    filteredArgs.includes("--list-emotions") || filteredArgs.includes("--list");

  // CLI: list emotions
  if (listMode && !serveMode) {
    console.log(JSON.stringify(Object.keys(faces)));
    return;
  }

  // HTTP server mode
  if (serveMode) {
    let port = 3000;
    const portIndex = filteredArgs.indexOf("--port");
    if (portIndex !== -1 && filteredArgs.length > portIndex + 1) {
      const p = Number(filteredArgs[portIndex + 1]);
      if (!isNaN(p) && p >= 0) {
        port = p;
      }
    }
    const server = http.createServer((req, res) => {
      const base = `http://${req.headers.host}`;
      const reqUrl = new URL(req.url, base);
      const pathName = reqUrl.pathname;
      if (pathName === "/emotions") {
        res.writeHead(200, {
          "Content-Type": "application/json; charset=utf-8",
        });
        res.end(JSON.stringify(Object.keys(faces)));
        return;
      }
      const emotionParam = reqUrl.searchParams.get("emotion");
      const face = Object.prototype.hasOwnProperty.call(faces, emotionParam)
        ? faces[emotionParam]
        : faces.neutral;
      if (pathName === "/html") {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        const template = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>ASCII Face</title></head>
<body><pre><%= face %></pre></body>
</html>`;
        const html = ejs.render(template, { face });
        res.end(html);
        return;
      }
      if (pathName === "/" || pathName === "/face") {
        res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
        res.end(face);
        return;
      }
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not Found");
    });
    server.listen(port);
    return server;
  }

  // CLI render mode
  let emotion;
  const emotionFlagIndex = filteredArgs.indexOf("--emotion");
  if (emotionFlagIndex !== -1 && filteredArgs.length > emotionFlagIndex + 1) {
    emotion = filteredArgs[emotionFlagIndex + 1];
  } else if (
    filteredArgs.length > 0 &&
    !filteredArgs[0].startsWith("-")
  ) {
    emotion = filteredArgs[0];
  }

  const faceToRender = Object.prototype.hasOwnProperty.call(faces, emotion)
    ? faces[emotion]
    : faces.neutral;
  console.log(faceToRender);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
