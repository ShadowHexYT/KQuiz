const EXCLUDED_TRACK_PATTERNS = [
  /\bremix\b/i,
  /\bcover\b/i,
  /\bfeat\.?\b/i,
  /\bft\.?\b/i,
  /\blive\b/i,
  /\binstrumental\b/i,
  /\bkaraoke\b/i,
  /\bacoustic\b/i,
  /\bdemo\b/i,
  /\bsped\s*up\b/i,
  /\bslowed\b/i,
  /\benglish\s+ver\.?\b/i,
  /\bjapanese\s+ver\.?\b/i,
  /\bchinese\s+ver\.?\b/i,
  /\bversion\b/i,
  /\bost\b/i,
  /\bfrom the netflix film\b/i,
];

const EXCLUDED_RELEASE_PATTERNS = [
  /\bremix\b/i,
  /\bparty remixes?\b/i,
  /\blive\b/i,
  /\binstrumental\b/i,
  /\bsped\s*up\b/i,
  /\bslowed\b/i,
];

export function getStableHash(value) {
  return Array.from(String(value)).reduce(
    (hash, char, index) => hash + char.charCodeAt(0) * (index + 1),
    0,
  );
}

export function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function normalizeTitle(value) {
  return String(value)
    .toLowerCase()
    .replace(/\([^)]*\)/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function buildSongKey(groupName, title) {
  return `${groupName}::${normalizeTitle(title)}`;
}

export function buildReleaseKey(groupName, releaseTitle) {
  return `${groupName}::${normalizeTitle(releaseTitle)}`;
}

export function detectTrackExclusionReason({ title, releaseTitle, artist, supportedGroups }) {
  if (!artist || !supportedGroups.has(artist)) {
    return "unsupported_group";
  }

  const titleValue = title ?? "";
  const releaseValue = releaseTitle ?? "";

  const titlePattern = EXCLUDED_TRACK_PATTERNS.find((pattern) => pattern.test(titleValue));
  if (titlePattern) {
    return "excluded_track_variant";
  }

  const releasePattern = EXCLUDED_RELEASE_PATTERNS.find((pattern) => pattern.test(releaseValue));
  if (releasePattern) {
    return "excluded_release_variant";
  }

  return null;
}

export function difficultyRank(difficulty) {
  if (difficulty === "easy") return 0;
  if (difficulty === "medium") return 1;
  if (difficulty === "hard") return 2;
  return 3;
}

export function dedupeBy(items, getKey, mergeItems) {
  const grouped = new Map();

  items.forEach((item) => {
    const key = getKey(item);
    const existing = grouped.get(key);
    grouped.set(key, existing ? mergeItems(existing, item) : item);
  });

  return [...grouped.values()];
}

export function seededSort(values, seed, getValue = (value) => value) {
  return [...values].sort((left, right) => {
    const leftScore = getStableHash(`${seed}-${getValue(left)}`);
    const rightScore = getStableHash(`${seed}-${getValue(right)}`);
    return leftScore - rightScore;
  });
}
