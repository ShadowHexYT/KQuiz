import { getSourcePriority } from "./sourcePriority.js";

export const FACT_CATEGORY_BASELINES = {
  group_identity: { familiarity: 0.95, fun: 0.82, questionability: 0.9, difficulty: 1 },
  fandom: { familiarity: 0.82, fun: 0.72, questionability: 0.84, difficulty: 1 },
  member_identity: { familiarity: 0.9, fun: 0.84, questionability: 0.92, difficulty: 1 },
  member_role: { familiarity: 0.76, fun: 0.74, questionability: 0.84, difficulty: 2 },
  title_track: { familiarity: 0.9, fun: 0.88, questionability: 0.95, difficulty: 1 },
  b_side: { familiarity: 0.52, fun: 0.8, questionability: 0.78, difficulty: 3 },
  album: { familiarity: 0.72, fun: 0.8, questionability: 0.9, difficulty: 2 },
  lightstick: { familiarity: 0.66, fun: 0.8, questionability: 0.86, difficulty: 2 },
  lyric: { familiarity: 0.62, fun: 0.9, questionability: 0.88, difficulty: 2 },
  release_order: { familiarity: 0.48, fun: 0.7, questionability: 0.72, difficulty: 3 },
  comeback_era: { familiarity: 0.58, fun: 0.82, questionability: 0.74, difficulty: 3 },
  community: { familiarity: 0.56, fun: 0.78, questionability: 0.72, difficulty: 3 },
  notable_fact: { familiarity: 0.42, fun: 0.74, questionability: 0.7, difficulty: 4 },
};

function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function getConfidenceScore(sources) {
  if (!sources.length) return 0;
  const bestPriority = Math.max(...sources.map((source) => getSourcePriority(source)));
  return clamp(bestPriority / 100);
}

export function scoreFact({
  category,
  sources = [],
  isNotable = false,
  isBroadlyKnown = false,
  supportsVisualPrompt = false,
  supportsAudioPrompt = false,
  hasCompliantSnippet = false,
}) {
  const baseline = FACT_CATEGORY_BASELINES[category] ?? FACT_CATEGORY_BASELINES.notable_fact;
  const confidence = getConfidenceScore(sources);
  const familiarity = clamp(
    baseline.familiarity +
      (isBroadlyKnown ? 0.14 : 0) -
      (isNotable ? 0.08 : 0) +
      (supportsVisualPrompt ? 0.04 : 0),
  );
  const fun = clamp(
    baseline.fun +
      (supportsVisualPrompt ? 0.08 : 0) +
      (supportsAudioPrompt ? 0.06 : 0) +
      (hasCompliantSnippet ? 0.05 : 0),
  );
  const questionability = clamp(
    baseline.questionability + confidence * 0.1 + (supportsVisualPrompt ? 0.05 : 0),
  );
  const difficultyScore = clamp(
    baseline.difficulty / 4 +
      (isNotable ? 0.12 : 0) +
      (isBroadlyKnown ? -0.08 : 0) +
      (familiarity < 0.5 ? 0.08 : 0),
    0.25,
    1,
  );

  let suggestedDifficulty = "easy";
  if (difficultyScore >= 0.85) {
    suggestedDifficulty = "expert";
  } else if (difficultyScore >= 0.65) {
    suggestedDifficulty = "hard";
  } else if (difficultyScore >= 0.4) {
    suggestedDifficulty = "medium";
  }

  return {
    sourceConfidence: confidence,
    familiarityScore: familiarity,
    difficultyScore,
    funScore: fun,
    questionabilityScore: questionability,
    suggestedDifficulty,
  };
}
