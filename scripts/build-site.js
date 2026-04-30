const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const topLevelEntries = ["index.html", "menu.html", "project.html", "contact.html", "assest"];

function removeDir(targetDir) {
  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true });
  }
}

function ensureDir(targetDir) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function copyRecursive(sourcePath, destinationPath) {
  const stats = fs.statSync(sourcePath);

  if (stats.isDirectory()) {
    ensureDir(destinationPath);
    for (const entry of fs.readdirSync(sourcePath)) {
      copyRecursive(path.join(sourcePath, entry), path.join(destinationPath, entry));
    }
    return;
  }

  ensureDir(path.dirname(destinationPath));
  fs.copyFileSync(sourcePath, destinationPath);
}

function countFiles(targetDir) {
  let count = 0;
  for (const entry of fs.readdirSync(targetDir, { withFileTypes: true })) {
    const entryPath = path.join(targetDir, entry.name);
    if (entry.isDirectory()) {
      count += countFiles(entryPath);
    } else {
      count += 1;
    }
  }
  return count;
}

removeDir(distDir);
ensureDir(distDir);

for (const entry of topLevelEntries) {
  copyRecursive(path.join(rootDir, entry), path.join(distDir, entry));
}

const buildReport = {
  project: "monke-website",
  generatedAt: new Date().toISOString(),
  pages: topLevelEntries.filter((entry) => entry.endsWith(".html")),
  deployedAssetFolder: "assest",
  totalFiles: countFiles(distDir)
};

fs.writeFileSync(
  path.join(distDir, "release-report.json"),
  `${JSON.stringify(buildReport, null, 2)}\n`,
  "utf8"
);

fs.writeFileSync(
  path.join(distDir, "deployment-log.txt"),
  [
    "Monke Studio release package created successfully.",
    `Build time: ${buildReport.generatedAt}`,
    `Pages included: ${buildReport.pages.join(", ")}`,
    `Total packaged files: ${buildReport.totalFiles}`
  ].join("\n"),
  "utf8"
);

console.log(`Build completed. Packaged ${buildReport.totalFiles} files into dist/.`);
