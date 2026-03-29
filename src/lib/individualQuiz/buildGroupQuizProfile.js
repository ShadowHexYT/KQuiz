import { groupQuizzes } from "../../data/groupQuizzes.js";
import { groupVerifiedFacts } from "../../data/groupVerifiedFacts.js";
import { mainQuizRounds, getSongMeta } from "../../data/mainQuizRounds.js";
import { lyricPrompts, playlistSongs } from "../../data/playlistGamePacks.js";
import { createEmptyIndividualQuizProfile } from "./schema.js";

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildSongSourceId(groupName, title) {
  return `${groupName}::${title}`;
}

function inferSongDifficulty(song) {
  if (song.difficulty === "hard") return "hard";
  if (song.difficulty === "medium") return "medium";
  return "easy";
}

function buildSongs(round, groupName) {
  const playlistMatches = playlistSongs.filter((song) => song.artist === groupName);
  const favoriteExtra = round?.extras.find(
    (extra) => extra.kind === "favoriteSong" || extra.key?.startsWith("favoriteSong"),
  );
  const favoriteSet = new Set(favoriteExtra?.answers ?? []);
  const roundSongTitles = favoriteExtra?.choices ?? [];
  const songMap = new Map();

  playlistMatches.forEach((song) => {
    const key = slugify(song.title);
    songMap.set(key, {
      id: buildSongSourceId(groupName, song.title),
      title: song.title,
      albumTitle: song.album ?? null,
      coverImage: getSongMeta(groupName, song.title).coverImage ?? null,
      previewUrl: getSongMeta(groupName, song.title).previewUrl ?? null,
      sourceKinds: ["playlistSong"],
      familiarityBand: inferSongDifficulty(song),
      isFavorite: favoriteSet.has(song.title),
      lyricLeadIn: null,
      emojiClue: song.emojiClue ?? null,
    });
  });

  roundSongTitles.forEach((title) => {
    const key = slugify(title);
    const existing = songMap.get(key);

    if (existing) {
      existing.isFavorite ||= favoriteSet.has(title);
      existing.sourceKinds = unique([...existing.sourceKinds, "mainQuizRound"]);
      if (existing.familiarityBand === "easy" && !favoriteSet.has(title)) {
        existing.familiarityBand = "medium";
      }
      return;
    }

    songMap.set(key, {
      id: buildSongSourceId(groupName, title),
      title,
      albumTitle: null,
      coverImage: getSongMeta(groupName, title).coverImage ?? null,
      previewUrl: getSongMeta(groupName, title).previewUrl ?? null,
      sourceKinds: ["mainQuizRound"],
      familiarityBand: favoriteSet.has(title) ? "medium" : "hard",
      isFavorite: favoriteSet.has(title),
      lyricLeadIn: null,
      emojiClue: null,
    });
  });

  lyricPrompts
    .filter((prompt) => prompt.artist === groupName)
    .forEach((prompt) => {
      const key = slugify(prompt.title);
      const existing = songMap.get(key);

      if (existing) {
        existing.lyricLeadIn = prompt.lyricLeadIn;
        existing.sourceKinds = unique([...existing.sourceKinds, "lyricPrompt"]);
        return;
      }

      songMap.set(key, {
        id: buildSongSourceId(groupName, prompt.title),
        title: prompt.title,
        albumTitle: null,
        coverImage: getSongMeta(groupName, prompt.title).coverImage ?? null,
        previewUrl: getSongMeta(groupName, prompt.title).previewUrl ?? null,
        sourceKinds: ["lyricPrompt"],
        familiarityBand: prompt.difficulty === "hard" ? "hard" : "medium",
        isFavorite: favoriteSet.has(prompt.title),
        lyricLeadIn: prompt.lyricLeadIn,
        emojiClue: null,
      });
    });

  return [...songMap.values()];
}

function buildAlbums(songs) {
  const albumMap = new Map();

  songs.forEach((song) => {
    if (!song.albumTitle) return;

    const key = slugify(song.albumTitle);
    const existing = albumMap.get(key) ?? {
      id: key,
      title: song.albumTitle,
      coverImage: song.coverImage ?? null,
      songTitles: [],
      sourceKinds: [],
    };

    existing.coverImage ??= song.coverImage ?? null;
    existing.songTitles = unique([...existing.songTitles, song.title]);
    existing.sourceKinds = unique([...existing.sourceKinds, ...song.sourceKinds]);
    albumMap.set(key, existing);
  });

  return [...albumMap.values()];
}

function buildMemberRoles(round) {
  const roles = {};
  const extras = round?.extras ?? [];

  ["leader", "maknae", "bias"].forEach((key) => {
    const match = extras.find((extra) => extra.key === key)?.answer ?? null;
    if (match) roles[key] = match;
  });

  return roles;
}

function buildFandomFacts(reference) {
  const facts = [];

  if (reference.fandom) facts.push({ kind: "fandom", value: reference.fandom, source: "groupVerifiedFacts" });
  if (reference.lightstick) facts.push({ kind: "lightstick", value: reference.lightstick, source: "groupVerifiedFacts" });
  if (reference.company) facts.push({ kind: "company", value: reference.company, source: "groupVerifiedFacts" });
  if (reference.debutSong) facts.push({ kind: "debutSong", value: reference.debutSong, source: "groupVerifiedFacts" });
  if (reference.debutDate) facts.push({ kind: "debutDate", value: reference.debutDate, source: "groupVerifiedFacts" });
  if (reference.varietySeries) facts.push({ kind: "varietySeries", value: reference.varietySeries, source: "groupVerifiedFacts" });
  if (reference.originStory) facts.push({ kind: "originStory", value: reference.originStory, source: "groupVerifiedFacts" });
  if (reference.nameMeaning) facts.push({ kind: "nameMeaning", value: reference.nameMeaning, source: "groupVerifiedFacts" });
  if (reference.achievementAnswer) {
    facts.push({ kind: "achievementAnswer", value: reference.achievementAnswer, source: "groupVerifiedFacts" });
  }
  (reference.aliases ?? []).forEach((alias) => {
    facts.push({ kind: "alias", value: alias, source: "groupVerifiedFacts" });
  });

  return facts;
}

export function buildGroupQuizProfile(groupName) {
  const profile = createEmptyIndividualQuizProfile(groupName);
  const round = mainQuizRounds.find((entry) => entry.groupName === groupName) ?? null;
  const groupCard = groupQuizzes.find((entry) => entry.label === groupName) ?? null;
  const reference = groupVerifiedFacts[groupName] ?? {};

  if (!round) {
    profile.reviewQueue.push({
      field: "mainQuizRounds",
      reason: "missing_group_round",
      groupName,
    });
    return profile;
  }

  profile.description = groupCard?.description ?? null;
  profile.members = round.members.map((member) => ({
    name: member.name,
    image: member.image ?? null,
    source: "mainQuizRounds",
  }));
  profile.memberRoles = buildMemberRoles(round);
  profile.songs = buildSongs(round, groupName);
  profile.albums = buildAlbums(profile.songs);
  profile.lyricPrompts = profile.songs
    .filter((song) => song.lyricLeadIn)
    .map((song) => ({
      songTitle: song.title,
      lyricLeadIn: song.lyricLeadIn,
      source: "playlistGamePacks",
    }));
  profile.fandomFacts = buildFandomFacts(reference);
  profile.visualFacts = profile.albums
    .filter((album) => album.coverImage)
    .map((album) => ({
      kind: "albumCover",
      value: album.title,
      coverImage: album.coverImage,
      source: "playlistGamePacks",
    }));
  profile.loreFacts = [
    ...(profile.description
      ? [{ kind: "groupDescription", value: profile.description, source: "groupQuizzes" }]
      : []),
    ...profile.fandomFacts.filter((fact) =>
      ["originStory", "nameMeaning", "achievementAnswer", "alias", "varietySeries"].includes(fact.kind),
    ),
  ];
  profile.dataSignals = {
    discographyDepth: profile.songs.length + profile.albums.length,
    visualDepth:
      profile.members.filter((member) => member.image).length +
      profile.visualFacts.filter((fact) => fact.coverImage).length,
    fandomDepth: profile.fandomFacts.length,
    memberDepth: profile.members.length + Object.keys(profile.memberRoles).length,
  };

  if (!profile.albums.length) {
    profile.reviewQueue.push({
      field: "albums",
      reason: "no_verified_album_groups",
      groupName,
    });
  }

  if (!profile.lyricPrompts.length) {
    profile.reviewQueue.push({
      field: "lyrics",
      reason: "no_compliant_lyric_prompts",
      groupName,
    });
  }

  return profile;
}
