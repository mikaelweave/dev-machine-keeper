#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { isMap, parseDocument } = require("yaml");

const repoRoot = path.resolve(__dirname, "..");
const manifestPath = path.resolve(repoRoot, process.argv[2] ?? "manifest/workstation-state.yaml");
const errors = [];

if (!fs.statSync(manifestPath, { throwIfNoEntry: false })?.isFile()) {
  console.error(`Manifest not found: ${manifestPath}`);
  process.exit(1);
}

const manifestDocument = parseDocument(fs.readFileSync(manifestPath, "utf8"), {
  maxAliasCount: 0
});

if (manifestDocument.errors.length > 0) {
  console.error(
    `Invalid YAML in ${path.relative(repoRoot, manifestPath)}: ${manifestDocument.errors[0].message}`
  );
  process.exit(1);
}

if (!isMap(manifestDocument.contents)) {
  console.error("Manifest root must be a mapping");
  process.exit(1);
}

const manifest = manifestDocument.toJS();
let declaredAdapters = manifest.adapters ?? {};

if (!isPlainObject(declaredAdapters)) {
  errors.push("Top-level 'adapters' must be a mapping");
  declaredAdapters = {};
}

const referencedAdapters = [];
visit(excludeKey(manifest, "adapters"), referencedAdapters);

for (const adapter of [...new Set(referencedAdapters)].sort()) {
  if (!Object.hasOwn(declaredAdapters, adapter)) {
    errors.push(`Referenced adapter '${adapter}' is not declared under top-level 'adapters'`);
  }
}

const contractReference = manifest.metadata?.contract;

if (typeof contractReference !== "string" || contractReference.length === 0) {
  errors.push("metadata.contract must be a non-empty local path");
} else {
  const contractPath = path.resolve(path.dirname(manifestPath), contractReference);
  const relativeContract = path.relative(repoRoot, contractPath);

  if (relativeContract === ".." || relativeContract.startsWith(`..${path.sep}`) || path.isAbsolute(relativeContract)) {
    errors.push("metadata.contract must resolve inside the repository");
  } else if (!fs.statSync(contractPath, { throwIfNoEntry: false })?.isFile()) {
    errors.push(`metadata.contract does not exist: ${relativeContract}`);
  }
}

if (errors.length > 0) {
  errors.forEach((error) => console.error(`ERROR: ${error}`));
  process.exit(1);
}

console.log(`Validated ${path.relative(repoRoot, manifestPath)}`);
console.log(
  `${Object.keys(declaredAdapters).length} adapters declared; ${new Set(referencedAdapters).size} referenced`
);

function excludeKey(object, key) {
  return Object.fromEntries(Object.entries(object).filter(([entryKey]) => entryKey !== key));
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function visit(value, referencedAdapters) {
  if (Array.isArray(value)) {
    value.forEach((child) => visit(child, referencedAdapters));
    return;
  }

  if (!isPlainObject(value)) {
    return;
  }

  for (const [key, child] of Object.entries(value)) {
    if (key === "adapter" && typeof child === "string") {
      referencedAdapters.push(child);
    }

    visit(child, referencedAdapters);
  }
}
