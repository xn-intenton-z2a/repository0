#!/usr/bin/env node
// src/lib/main.js

import http from "http";
import { fileURLToPath, URL } from "url";

export function main(args = []) {
  const faces = {
    happy: `\n  ^_^\n`,
    sad: `\n  T_T\n`,
    surprised: `\n  O_O\n`,
    angry: `\n  >:(\n`,
    neutral: `\n  -_-\n`,
  };

  const serveMode = args.includes("--serve");
  if (serveMode) {
    let port = 3000;
    const portIndex = args.indexOf("--port");
    if (portIndex !== -1 && args.length > portIndex + 1) {
      const p = Number(args[portIndex + 1]);
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
  const emotionFlagIndex = args.indexOf("--emotion");
  if (emotionFlagIndex !== -1 && args.length > emotionFlagIndex + 1) {
    emotion = args[emotionFlagIndex + 1];
  } else if (args.length > 0 && !args[0].startsWith("-")) {
    emotion = args[0];
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
