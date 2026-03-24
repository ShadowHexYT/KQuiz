export const GAME_SCORE_KEYS = {
  mainShow: "mainShow",
  jeopardy: "jeopardy",
  wheelOfFortune: "wheelOfFortune",
  songGuessing: "songGuessing",
};

export const DEFAULT_GAME_SCORES = Object.freeze({
  [GAME_SCORE_KEYS.mainShow]: 0,
  [GAME_SCORE_KEYS.jeopardy]: 0,
  [GAME_SCORE_KEYS.wheelOfFortune]: 0,
  [GAME_SCORE_KEYS.songGuessing]: 0,
});

export function createEmptyScores() {
  return { ...DEFAULT_GAME_SCORES };
}

export function normalizeScores(scores) {
  return {
    ...createEmptyScores(),
    ...(scores ?? {}),
  };
}
