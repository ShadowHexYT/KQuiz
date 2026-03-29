import fs from "node:fs/promises";
import path from "node:path";

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function readCachedPayload(cacheDir, cacheKey) {
  try {
    const filePath = path.join(cacheDir, `${slugify(cacheKey)}.json`);
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function writeCachedPayload(cacheDir, cacheKey, payload) {
  const filePath = path.join(cacheDir, `${slugify(cacheKey)}.json`);
  await fs.mkdir(cacheDir, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(payload, null, 2));
}
