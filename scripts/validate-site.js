const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const pages = ["index.html", "menu.html", "project.html", "contact.html"];
const failures = [];

function fileExists(relativePath) {
  return fs.existsSync(path.join(rootDir, relativePath));
}

function recordFailure(message) {
  failures.push(message);
  console.error(`FAIL: ${message}`);
}

function collectMatches(content, regex) {
  return Array.from(content.matchAll(regex), (match) => match[1]);
}

for (const page of pages) {
  const absolutePagePath = path.join(rootDir, page);

  if (!fs.existsSync(absolutePagePath)) {
    recordFailure(`Missing required page: ${page}`);
    continue;
  }

  const html = fs.readFileSync(absolutePagePath, "utf8");

  if (!/<title>[^<]+<\/title>/i.test(html)) {
    recordFailure(`${page} is missing a non-empty <title>.`);
  }

  if (!/<nav[\s>]/i.test(html)) {
    recordFailure(`${page} is missing a <nav> section.`);
  }

  if (!/<footer[\s>]/i.test(html)) {
    recordFailure(`${page} is missing a <footer> section.`);
  }

  if (!html.includes('href="assest/style.css"')) {
    recordFailure(`${page} does not include the shared stylesheet.`);
  }

  const assetRefs = collectMatches(html, /(?:src|href)="([^"]+)"/g);

  for (const ref of assetRefs) {
    const normalizedRef = ref.trim();

    if (
      normalizedRef.startsWith("http://") ||
      normalizedRef.startsWith("https://") ||
      normalizedRef.startsWith("mailto:") ||
      normalizedRef.startsWith("#")
    ) {
      continue;
    }

    if (!fileExists(normalizedRef)) {
      recordFailure(`${page} references a missing local file: ${normalizedRef}`);
    }
  }
}

if (failures.length > 0) {
  console.error(`\nValidation failed with ${failures.length} issue(s).`);
  process.exit(1);
}

console.log(`Validation passed for ${pages.length} HTML pages.`);
