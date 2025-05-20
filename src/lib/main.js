#!/usr/bin/env node
// src/lib/main.js

import http from "http";
import { fileURLToPath, URL } from "url";
import fs from "fs";
import yaml from "js-yaml";
import { z } from "zod";

export function main(args = []) {
  const defaultFaces = {
    happy: `\n  ^_^\n`,
    sad: `\n  T_T\n`,
    surprised: `\n  O_O\n`,
    angry: `\n  >:(\n`,
    neutral: `\n  -_-\n`,
  };

  // Load custom config if provided
  let customFaces = {};
  const configIndex = args.indexOf("--config");
  let filteredArgs = args;
  if (configIndex !== -1) {
    if (args.length <= configIndex + 1) {
      console.error("No path specified for --config");
      process.exit(1);
    }
    const configPath = args[configIndex + 1];
    try {
      const content = fs.readFileSync(configPath, "utf8");
      let parsed;
      if (configPath.toLowerCase().endsWith(".json")) {
        parsed = JSON.parse(content);
      } else {
        parsed = yaml.load(content);
      }
      const schema = z.record(z.string());
      const validated = schema.parse(parsed);
      customFaces = validated;
    } catch (err) {
      console.error(`Error loading config file: ${err.message}`);
      process.exit(1);
    }
    // Remove config args for downstream parsing
    filteredArgs = args.filter((_, idx) => idx !== configIndex && idx !== configIndex + 1);
  }

  // Merge defaults with custom (custom overrides)
  const faces = { ...defaultFaces, ...customFaces };

  // Determine serve mode and port
  const serveMode = filteredArgs.includes("--serve");
  if (serveMode) {
    let port = 3000;
    const portIndex = filteredArgs.indexOf("--port");
    if (portIndex !== -1 && filteredArgs.length > portIndex + 1) {
      const p = Number(filteredArgs[portIndex + 1]);
      if (!isNaN(p) && p > 0) {
        port = p;
      }
    }
    const server = http.createServer((req, res) => {
      const base = `http://${req.headers.host}`;
      const reqUrl = new URL(req.url, base);
      const emotionParam = reqUrl.searchParams.get("emotion");
      const face = Object.prototype.hasOwnProperty.call(faces, emotionParam)
        ? faces[emotionParam]
        : faces.neutral;
      if (reqUrl.pathname === "/" || reqUrl.pathname === "/face") {
        res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
        res.end(face);
      } else {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Not Found");
      }
    });
    server.listen(port);
    return server;
  }

  // CLI mode
  let emotion;
  const emotionFlagIndex = filteredArgs.indexOf("--emotion");
  if (emotionFlagIndex !== -1 && filteredArgs.length > emotionFlagIndex + 1) {
    emotion = filteredArgs[emotionFlagIndex + 1];
  } else if (filteredArgs.length > 0 && !filteredArgs[0].startsWith("-")) {
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
