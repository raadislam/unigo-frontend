import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourceDir = path.join(root, "src/components/home");
const targetDir = path.join(root, "src/styles/home");
const sourceRoot = path.join(root, "src");

if (!fs.existsSync(sourceDir)) {
  throw new Error("Source directory not found: src/components/home");
}

fs.mkdirSync(targetDir, { recursive: true });

const cssFiles = fs
  .readdirSync(sourceDir, { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith(".css"))
  .map((entry) => entry.name);

for (const file of cssFiles) {
  const from = path.join(sourceDir, file);
  const to = path.join(targetDir, file);

  if (fs.existsSync(to)) {
    throw new Error(`Destination already exists: src/styles/home/${file}`);
  }

  fs.renameSync(from, to);
  console.log(`Moved: ${file}`);
}

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (["node_modules", ".next", ".git"].includes(entry.name)) {
        return [];
      }

      return walk(fullPath);
    }

    return /\.(tsx?|jsx?)$/.test(entry.name) ? [fullPath] : [];
  });
}

const movedFiles = new Set(cssFiles);

for (const filePath of walk(sourceRoot)) {
  const original = fs.readFileSync(filePath, "utf8");
  let updated = original;

  updated = updated.replace(
    /((?:import|export)\s+(?:[^"'`]*?\s+from\s+)?["'])(\.{1,2}\/[^"'`]+\.css)(["'])/g,
    (match, prefix, importPath, suffix) => {
      const resolved = path.resolve(path.dirname(filePath), importPath);
      const filename = path.basename(resolved);

      if (!movedFiles.has(filename)) {
        return match;
      }

      const originalHomePath = path.join(sourceDir, filename);

      if (resolved !== originalHomePath) {
        return match;
      }

      const newPath = path
        .relative(path.dirname(filePath), path.join(targetDir, filename))
        .split(path.sep)
        .join("/");

      const normalizedPath = newPath.startsWith(".") ? newPath : `./${newPath}`;

      return `${prefix}${normalizedPath}${suffix}`;
    },
  );

  if (updated !== original) {
    fs.writeFileSync(filePath, updated, "utf8");
    console.log(`Updated imports: ${path.relative(root, filePath)}`);
  }
}

console.log("CSS migration completed.");
