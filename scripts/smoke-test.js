const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const checks = [
  {
    file: "index.html",
    rules: [
      { label: "landing intro copy", test: /A multi-disciplinary, independently owned design studio\./i },
      { label: "loader container", test: /id="loader"/i },
      { label: "mobile menu icon", test: /class="nav_icon"/i }
    ]
  },
  {
    file: "project.html",
    rules: [
      { label: "about heading", test: /Who we are\?/i },
      { label: "services section", test: /What we do\?/i },
      { label: "brand identity card", test: /Brand & visual identity/i }
    ]
  },
  {
    file: "menu.html",
    rules: [
      { label: "rabbit case title", test: /<h2>\s*Rabbit\s*<\/h2>/i },
      { label: "case gallery", test: /class="img"/i }
    ]
  },
  {
    file: "contact.html",
    rules: [
      { label: "contact form", test: /<form>/i },
      { label: "email input", test: /type="email"/i },
      { label: "social links block", test: /Sosial Medya|Social Media/i }
    ]
  }
];

const failures = [];

for (const pageCheck of checks) {
  const filePath = path.join(rootDir, pageCheck.file);
  const content = fs.readFileSync(filePath, "utf8");

  for (const rule of pageCheck.rules) {
    if (!rule.test.test(content)) {
      failures.push(`${pageCheck.file} is missing expected project-specific content: ${rule.label}`);
    }
  }
}

const appJsPath = path.join(rootDir, "assest", "js", "app.js");
const appJs = fs.readFileSync(appJsPath, "utf8");

if (!/querySelector\("\.nav_icon"\)/.test(appJs)) {
  failures.push("assest/js/app.js is missing the mobile navigation selector.");
}

if (!/window\.addEventListener\("load"/.test(appJs)) {
  failures.push("assest/js/app.js is missing the loader lifecycle hook.");
}

if (failures.length > 0) {
  console.error("Smoke tests failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Smoke tests passed for the Monke Studio frontend.");
