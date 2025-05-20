#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";

export function main(args = []) {
  const faces = {
    happy: `\n  ^_^\n`,
    sad: `\n  T_T\n`,
    surprised: `\n  O_O\n`,
    angry: `\n  >:(\n`,
    neutral: `\n  -_-\n`,
  };

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
