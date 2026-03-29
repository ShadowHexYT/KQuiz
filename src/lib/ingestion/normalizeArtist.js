import { createEmptyNormalizedArtist } from "./schema.js";
import { addReviewItem } from "./reviewQueue.js";
import { getSourcePriority } from "./sourcePriority.js";

function isBlankValue(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function deepEqual(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function collectCandidateValues(results, fieldName) {
  return results
    .filter((result) => result.status === "ok")
    .map((result) => ({
      source: result.source,
      value: result.fields[fieldName],
    }))
    .filter((entry) => !isBlankValue(entry.value))
    .sort((left, right) => getSourcePriority(right.source) - getSourcePriority(left.source));
}

function resolveScalarField(results, fieldName, normalized, options = {}) {
  const candidates = collectCandidateValues(results, fieldName);
  const sourcesChecked = results.map((result) => result.source);

  if (!candidates.length) {
    addReviewItem(normalized.reviewQueue, {
      field: fieldName,
      reason: "unverified_or_missing",
      sourcesChecked,
    });
    return null;
  }

  const winner = candidates[0];
  const conflicts = candidates
    .slice(1)
    .filter((candidate) => !deepEqual(candidate.value, winner.value));

  if (conflicts.length) {
    normalized.conflicts.push({
      field: fieldName,
      chosenSource: winner.source,
      chosenValue: winner.value,
      conflictingValues: conflicts,
    });
  }

  normalized.sources[fieldName] = [
    {
      source: winner.source,
      field: fieldName,
    },
  ];

  if (options.transform) {
    return options.transform(winner.value);
  }

  return winner.value;
}

function mergeUniqueStrings(results, fieldName, normalized) {
  const values = collectCandidateValues(results, fieldName)
    .flatMap((entry) => (Array.isArray(entry.value) ? entry.value : [entry.value]))
    .filter((value) => !isBlankValue(value));

  const uniqueValues = [...new Set(values)];
  normalized.sources[fieldName] = collectCandidateValues(results, fieldName).map((entry) => ({
    source: entry.source,
    field: fieldName,
  }));
  return uniqueValues;
}

function normalizeMembers(results, normalized) {
  const memberEntries = collectCandidateValues(results, "members");
  const memberMap = new Map();

  memberEntries.forEach((entry) => {
    entry.value.forEach((member) => {
      const key = slugify(member.name);
      if (!key) return;

      if (!memberMap.has(key)) {
        memberMap.set(key, {
          name: member.name,
          image: member.image ?? null,
          roles: {
            leader: false,
            maknae: false,
            bias: false,
          },
          sources: [],
        });
      }

      const currentMember = memberMap.get(key);
      currentMember.image ??= member.image ?? null;
      currentMember.roles.leader ||= Boolean(member.roles?.leader);
      currentMember.roles.maknae ||= Boolean(member.roles?.maknae);
      currentMember.roles.bias ||= Boolean(member.roles?.bias);
      currentMember.sources.push(entry.source);
    });
  });

  if (!memberMap.size) {
    addReviewItem(normalized.reviewQueue, {
      field: "members",
      reason: "unverified_or_missing",
      sourcesChecked: results.map((result) => result.source),
    });
    return [];
  }

  normalized.sources.members = [...memberMap.values()].map((member) => ({
    field: `members.${member.name}`,
    source: [...new Set(member.sources)].join(","),
  }));

  return [...memberMap.values()].map((member) => ({
    name: member.name,
    image: member.image,
    roles: member.roles,
  }));
}

function normalizeDiscography(results, normalized) {
  const releaseEntries = collectCandidateValues(results, "discography");
  const releaseMap = new Map();

  releaseEntries.forEach((entry) => {
    entry.value.forEach((release) => {
      const key = slugify(`${release.title}-${release.releaseDate ?? ""}`);
      if (!key) return;

      const existing = releaseMap.get(key) ?? {
        title: release.title ?? null,
        type: release.type ?? null,
        releaseDate: release.releaseDate ?? null,
        era: release.era ?? null,
        albumCover: release.albumCover ?? null,
        titleTracks: [],
        notableBSides: [],
        trackTitles: [],
        streamingLinks: {},
        sources: [],
      };

      existing.title ??= release.title ?? null;
      existing.type ??= release.type ?? null;
      existing.releaseDate ??= release.releaseDate ?? null;
      existing.era ??= release.era ?? null;
      existing.albumCover ??= release.albumCover ?? null;
      existing.titleTracks = [...new Set([...existing.titleTracks, ...(release.titleTracks ?? [])])];
      existing.notableBSides = [...new Set([...existing.notableBSides, ...(release.notableBSides ?? [])])];
      existing.trackTitles = [...new Set([...existing.trackTitles, ...(release.trackTitles ?? [])])];
      existing.streamingLinks = {
        ...existing.streamingLinks,
        ...(release.streamingLinks ?? {}),
      };
      existing.sources.push(entry.source);

      releaseMap.set(key, existing);
    });
  });

  const releases = [...releaseMap.values()].sort((left, right) =>
    String(left.releaseDate ?? "").localeCompare(String(right.releaseDate ?? "")),
  );

  if (!releases.length) {
    addReviewItem(normalized.reviewQueue, {
      field: "discography",
      reason: "unverified_or_missing",
      sourcesChecked: results.map((result) => result.source),
    });
  }

  normalized.sources.discography = releases.map((release) => ({
    field: `release:${release.title}`,
    source: [...new Set(release.sources)].join(","),
  }));

  return releases;
}

function normalizeLyrics(results, normalized) {
  const lyricEntries = collectCandidateValues(results, "lyricMaterial");
  const lyrics = lyricEntries.flatMap((entry) =>
    entry.value
      .filter((item) => item?.isPermitted)
      .map((item) => ({
        songTitle: item.songTitle ?? null,
        snippet: item.snippet ?? null,
        source: entry.source,
        isPermitted: true,
      })),
  );

  normalized.sources.lyricMaterial = lyrics.map((entry) => ({
    field: `lyric:${entry.songTitle}`,
    source: entry.source,
  }));

  return lyrics;
}

function normalizeFactEntries(results, fieldName, normalized) {
  const factEntries = collectCandidateValues(results, fieldName);
  const normalizedFacts = factEntries.flatMap((entry) =>
    entry.value.map((fact) => ({
      ...fact,
      source: entry.source,
    })),
  );

  normalized.sources[fieldName] = normalizedFacts.map((fact, index) => ({
    field: `${fieldName}.${index}`,
    source: fact.source,
  }));

  return normalizedFacts;
}

export function normalizeArtistResults(artistRequest, adapterResults) {
  const normalized = createEmptyNormalizedArtist(artistRequest.artistName);
  normalized.artistName =
    resolveScalarField(adapterResults, "artistName", normalized) ?? artistRequest.artistName;
  normalized.aliases = mergeUniqueStrings(adapterResults, "aliases", normalized);
  normalized.description = resolveScalarField(adapterResults, "description", normalized);
  normalized.company = resolveScalarField(adapterResults, "company", normalized);
  normalized.debutDate = resolveScalarField(adapterResults, "debutDate", normalized);
  normalized.debutSong = resolveScalarField(adapterResults, "debutSong", normalized);
  normalized.nameMeaning = resolveScalarField(adapterResults, "nameMeaning", normalized);
  normalized.originStory = resolveScalarField(adapterResults, "originStory", normalized);
  normalized.varietySeries = resolveScalarField(adapterResults, "varietySeries", normalized);
  normalized.fandomName = resolveScalarField(adapterResults, "fandomName", normalized);
  normalized.lightstick =
    resolveScalarField(adapterResults, "lightstick", normalized, {
      transform: (value) => ({
        name: value?.name ?? null,
        imageUrl: value?.imageUrl ?? null,
        source: value?.source ?? null,
      }),
    }) ?? normalized.lightstick;
  normalized.members = normalizeMembers(adapterResults, normalized);
  normalized.discography = normalizeDiscography(adapterResults, normalized);
  normalized.lyricMaterial = normalizeLyrics(adapterResults, normalized);
  normalized.eras = mergeUniqueStrings(adapterResults, "eras", normalized);
  normalized.notableFacts = normalizeFactEntries(adapterResults, "notableFacts", normalized);
  return normalized;
}
