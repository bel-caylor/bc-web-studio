#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const DIST_DIR = path.join(__dirname, "..", "dist");

function collectTags(html, tagName) {
  const tags = [];
  const open = `<${tagName}`;
  let idx = html.indexOf(open);
  while (idx !== -1) {
    let i = idx + open.length;
    let inSingle = false;
    let inDouble = false;
    while (i < html.length) {
      const char = html[i];
      if (char === "'" && !inDouble) {
        inSingle = !inSingle;
      } else if (char === '"' && !inSingle) {
        inDouble = !inDouble;
      } else if (char === ">" && !inSingle && !inDouble) {
        tags.push(html.slice(idx, i + 1));
        break;
      }
      i++;
    }
    idx = html.indexOf(open, idx + 1);
  }
  return tags;
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap(entry => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return walk(fullPath);
    }
    if (entry.isFile() && fullPath.endsWith(".html")) {
      return [fullPath];
    }
    return [];
  });
}

function extractAttr(tag, attr) {
  const direct = new RegExp(`${attr}\\s*=\\s*(['"])([\\s\\S]*?)\\1`, "i");
  const match = tag.match(direct);
  if (match) return match[2];

  const bound = new RegExp(`:${attr}\\s*=\\s*(['"])([\\s\\S]*?)\\1`, "i");
  const boundMatch = tag.match(bound);
  if (boundMatch) return boundMatch[2] || "bound";

  return null;
}

function lintHtmlFile(file) {
  const html = fs.readFileSync(file, "utf8");
  const issues = [];

  const imgTags = collectTags(html, "img");
  for (const tag of imgTags) {
    if (tag.includes("tools.find")) continue;
    const alt = extractAttr(tag, "alt");
    if (alt === null || alt.trim() === "") {
      issues.push(`${file}: <img> missing meaningful alt text -> ${tag}`);
    }
    const loading = extractAttr(tag, "loading");
    if (loading === null) {
      issues.push(`${file}: <img> missing loading attribute (perf) -> ${tag}`);
    }
  }

  const videoTags = collectTags(html, "video");
  for (const tag of videoTags) {
    const label =
      extractAttr(tag, "aria-label") ||
      extractAttr(tag, "aria-labelledby") ||
      extractAttr(tag, "title");
    if (!label) {
      issues.push(`${file}: <video> missing accessible label -> ${tag}`);
    }
  }

  return issues;
}

if (!fs.existsSync(DIST_DIR)) {
  console.error("dist directory not found. Run `npm run eleventy:build` first.");
  process.exit(1);
}

const files = walk(DIST_DIR);
let allIssues = [];
files.forEach(file => {
  allIssues = allIssues.concat(lintHtmlFile(file));
});

if (allIssues.length) {
  console.error("Accessibility/perf lint issues found:");
  allIssues.forEach(issue => console.error(`- ${issue}`));
  process.exit(1);
}

console.log(`HTML lint passed: ${files.length} file(s) checked.`);
