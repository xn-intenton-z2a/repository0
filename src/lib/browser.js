// src/lib/browser.js
// Browser-friendly implementation of string utilities.

export function _safeStr(s) {
  if (s === null || s === undefined) return "";
  return String(s);
}

export function slugify(str) {
  str = _safeStr(str);
  // Normalize and remove diacritics
  const normalized = str.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  return normalized
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-") // replace non letters/numbers with hyphen
    .replace(/^-+|-+$/g, "") // trim
    .replace(/-+/g, "-");
}

export function truncate(str, maxLength, suffix = "…") {
  str = _safeStr(str);
  if (!maxLength || maxLength <= 0) return "";
  if (str.length <= maxLength) return str;
  const allowed = maxLength - suffix.length;
  if (allowed <= 0) return suffix;
  // don't break mid-word
  const cutIndex = str.lastIndexOf(" ", allowed);
  if (cutIndex > 0) {
    return str.slice(0, cutIndex).trim() + suffix;
  }
  return str.slice(0, allowed).trim() + suffix;
}

function splitWords(str) {
  return str
    .trim()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
}

export function camelCase(str) {
  str = _safeStr(str);
  const words = splitWords(str);
  if (!words.length) return "";
  return (
    words[0].toLowerCase() +
    words
      .slice(1)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join("")
  );
}

export function kebabCase(str) {
  str = _safeStr(str);
  const normalized = str.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  return normalized
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean)
    .join("-");
}

export function titleCase(str) {
  str = _safeStr(str);
  return str
    .split(/(\s+)/)
    .map((token) => {
      if (token.trim().length === 0) return token;
      return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
    })
    .join("");
}

export function wordWrap(str, width = 40) {
  str = _safeStr(str);
  if (width <= 0) return str;
  const words = str.split(/(\s+)/);
  let line = "";
  const lines = [];
  for (const token of words) {
    // token may be space or word
    if (/^\s+$/.test(token)) {
      // spaces: preserve single space when needed
      if ((line + " ").length <= width) {
        line += " ";
      }
      continue;
    }
    if ((line + token).length <= width) {
      line += token;
    } else {
      if (line) {
        lines.push(line);
      }
      // if single token longer than width, break it
      if (token.length > width) {
        let i = 0;
        while (i < token.length) {
          lines.push(token.slice(i, i + width));
          i += width;
        }
        line = "";
      } else {
        line = token;
      }
    }
  }
  if (line) lines.push(line);
  return lines.join("\n");
}

// Simple HTML stripper and entity decoder
export function stripHtml(input) {
  const s = _safeStr(input);
  // remove tags
  let text = s.replace(/<[^>]*>/g, "");
  // decode named entities
  const entities = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: " ",
  };
  text = text.replace(/&([a-zA-Z]+);/g, (m, name) => entities[name] ?? m);
  // decode numeric entities
  text = text.replace(/&#(x?[0-9a-fA-F]+);/g, (m, num) => {
    const isHex = num[0] === "x" || num[0] === "X";
    const code = parseInt(num.slice(isHex ? 1 : 0), isHex ? 16 : 10);
    if (!Number.isNaN(code)) return String.fromCodePoint(code);
    return m;
  });
  return text;
}

export function escapeRegex(str) {
  str = _safeStr(str);
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function pluralize(word, count) {
  word = _safeStr(word);
  if (count === 1) return word;
  if (!word) return word;
  const lower = word.toLowerCase();
  const last2 = lower.slice(-2);
  const last1 = lower.slice(-1);
  if (/[sxz]$/.test(lower) || /ch$/.test(lower) || /sh$/.test(lower)) return word + "es";
  if (last1 === "y" && !/[aeiou]y$/.test(lower)) return word.slice(0, -1) + "ies";
  if (last2 === "fe") return word.slice(0, -2) + "ves";
  if (last1 === "f") return word.slice(0, -1) + "ves";
  return word + "s";
}

export function levenshteinDistance(a, b) {
  a = _safeStr(a);
  b = _safeStr(b);
  const A = Array.from(a);
  const B = Array.from(b);
  const m = A.length;
  const n = B.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = A[i - 1] === B[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}
