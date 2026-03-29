export const SUPPORTED_INGESTION_GAME_MODES = [
  "main-game",
  "finish-the-lyric",
  "emoji-song-guess",
  "album-cover-zoom",
  "lightstick-silhouette-guess",
  "mixed-group",
];

export const SUPPORTED_QUESTION_CATEGORIES = [
  "identify-the-group",
  "identify-the-member",
  "identify-the-song",
  "identify-the-album",
  "identify-the-lightstick",
  "match-lyric-to-song",
  "match-song-to-album",
  "match-member-to-fact",
  "identify-the-comeback-era",
  "release-order",
  "odd-one-out",
  "which-statement-is-true",
  "speed-round",
  "clue-reveal-round",
];

export function createEmptyNormalizedArtist(artistName) {
  return {
    artistName,
    aliases: [],
    description: null,
    company: null,
    debutDate: null,
    debutSong: null,
    nameMeaning: null,
    originStory: null,
    varietySeries: null,
    fandomName: null,
    lightstick: {
      name: null,
      imageUrl: null,
      source: null,
    },
    members: [],
    discography: [],
    lyricMaterial: [],
    eras: [],
    notableFacts: [],
    sources: {},
    conflicts: [],
    reviewQueue: [],
  };
}

export function createFieldValue(value, source, extra = {}) {
  return {
    value,
    source,
    verified: true,
    ...extra,
  };
}

export function createEmptyKnowledgeProfile(groupName) {
  return {
    groupName,
    factPool: [],
    sourceSummary: {},
    mainGameRoundPlan: {
      phases: ["identify-the-group", "identify-the-member", "match-member-to-fact", "identify-the-song"],
      questionIds: [],
    },
  };
}
