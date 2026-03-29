export const INDIVIDUAL_QUIZ_DIFFICULTIES = ["easy", "medium", "hard", "expert"];

export const INDIVIDUAL_QUIZ_TARGETS = {
  easy: 25,
  medium: 25,
  hard: 25,
  expert: 25,
};

export const INDIVIDUAL_QUIZ_CATEGORIES = [
  "group-identity",
  "members",
  "discography",
  "album-covers",
  "title-tracks",
  "b-sides",
  "eras-comebacks",
  "lyrics",
  "lightsticks",
  "fandom-knowledge",
  "variety-iconic-moments",
  "release-order",
  "visual-recognition",
  "match-based",
  "odd-one-out",
  "true-vs-false",
  "clue-based",
];

export const MAIN_GAME_TEMPLATE_FAMILIES = new Set([
  "guess-the-group",
  "basic-member-photo",
  "plain-role-check",
  "favorite-song-check",
]);

export const INDIVIDUAL_TEMPLATE_CAPS = {
  easy: 6,
  medium: 6,
  hard: 6,
  expert: 6,
};

export function createEmptyIndividualQuizProfile(groupName) {
  return {
    groupName,
    description: null,
    members: [],
    memberRoles: {},
    songs: [],
    albums: [],
    lyricPrompts: [],
    fandomFacts: [],
    visualFacts: [],
    loreFacts: [],
    deepFacts: {
      memberCredits: [],
      videoClues: [],
      releaseClues: [],
      performanceClues: [],
    },
    reviewQueue: [],
    dataSignals: {
      discographyDepth: 0,
      visualDepth: 0,
      fandomDepth: 0,
      memberDepth: 0,
      deepFactDepth: 0,
    },
  };
}
